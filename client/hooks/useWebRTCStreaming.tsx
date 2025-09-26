import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para WebRTC e Streaming
interface StreamConfig {
  video: boolean;
  audio: boolean;
  screen: boolean;
  quality: 'low' | 'medium' | 'high' | 'auto';
  recordingEnabled: boolean;
  aiAnalysisEnabled: boolean;
}

interface StreamStats {
  bitrate: number;
  framerate: number;
  resolution: { width: number; height: number };
  packetLoss: number;
  latency: number;
  viewers: number;
}

interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  stream: MediaStream | null;
  stats: RTCStatsReport | null;
}

interface StreamingSession {
  id: string;
  title: string;
  description: string;
  type: 'demo' | 'presentation' | 'code-review' | 'portfolio-tour';
  status: 'preparing' | 'live' | 'paused' | 'ended';
  startTime: number;
  duration: number;
  participants: string[];
}

interface InteractiveFeature {
  type: 'pointer' | 'annotation' | 'highlight' | 'zoom' | 'voice-note';
  position: { x: number; y: number };
  data: any;
  timestamp: number;
  author: string;
}

// Hook principal para WebRTC e Streaming
export function useWebRTCStreaming() {
  const [isSupported, setIsSupported] = useState(false);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    video: true,
    audio: true,
    screen: false,
    quality: 'auto',
    recordingEnabled: false,
    aiAnalysisEnabled: true
  });

  const [currentSession, setCurrentSession] = useState<StreamingSession | null>(null);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    bitrate: 0,
    framerate: 0,
    resolution: { width: 0, height: 0 },
    packetLoss: 0,
    latency: 0,
    viewers: 0
  });

  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [interactiveFeatures, setInteractiveFeatures] = useState<InteractiveFeature[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Verificar suporte WebRTC
  useEffect(() => {
    const checkWebRTCSupport = () => {
      const supported = !!(
        window.RTCPeerConnection &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      );
      setIsSupported(supported);
    };

    checkWebRTCSupport();
  }, []);

  // Iniciar captura de mídia
  const startCapture = useCallback(async (config: Partial<StreamConfig> = {}) => {
    const finalConfig = { ...streamConfig, ...config };
    setStreamConfig(finalConfig);

    try {
      let stream: MediaStream;

      if (finalConfig.screen) {
        // Captura de tela
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: getResolutionByQuality(finalConfig.quality).width,
            height: getResolutionByQuality(finalConfig.quality).height,
            frameRate: getFrameRateByQuality(finalConfig.quality)
          },
          audio: finalConfig.audio
        });
      } else {
        // Captura de câmera
        stream = await navigator.mediaDevices.getUserMedia({
          video: finalConfig.video ? {
            width: getResolutionByQuality(finalConfig.quality).width,
            height: getResolutionByQuality(finalConfig.quality).height,
            frameRate: getFrameRateByQuality(finalConfig.quality)
          } : false,
          audio: finalConfig.audio
        });
      }

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Iniciar gravação se habilitado
      if (finalConfig.recordingEnabled) {
        startRecording(stream);
      }

      // Monitorar estatísticas
      startStatsMonitoring();

      return stream;
    } catch (error) {
      console.error('Failed to start capture:', error);
      throw error;
    }
  }, [streamConfig]);

  // Parar captura
  const stopCapture = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Fechar todas as conexões peer
    peers.forEach(peer => {
      peer.connection.close();
    });
    setPeers(new Map());
  }, [peers]);

  // Iniciar gravação
  const startRecording = useCallback((stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        downloadRecording(blob);
      };

      mediaRecorder.start(1000); // Chunk a cada segundo
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  // Download da gravação
  const downloadRecording = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-demo-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Criar conexão peer
  const createPeerConnection = useCallback(async (peerId: string) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    
    // Adicionar stream local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Data channel para interações
    const dataChannel = peerConnection.createDataChannel('interactions', {
      ordered: true
    });

    setupDataChannelEvents(dataChannel);

    // Eventos da conexão
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Enviar candidate para o peer (implementar sinalização)
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.ondatachannel = (event) => {
      setupDataChannelEvents(event.channel);
    };

    const peer: PeerConnection = {
      id: peerId,
      connection: peerConnection,
      dataChannel,
      stream: null,
      stats: null
    };

    setPeers(prev => new Map(prev.set(peerId, peer)));
    return peer;
  }, []);

  // Configurar eventos do data channel
  const setupDataChannelEvents = useCallback((channel: RTCDataChannel) => {
    channel.onopen = () => {
      console.log('Data channel opened');
    };

    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleInteractiveFeature(data);
    };

    channel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }, []);

  // Manipular recursos interativos
  const handleInteractiveFeature = useCallback((feature: InteractiveFeature) => {
    setInteractiveFeatures(prev => [...prev, feature]);

    // Aplicar efeito visual baseado no tipo
    switch (feature.type) {
      case 'pointer':
        showPointer(feature.position);
        break;
      case 'annotation':
        showAnnotation(feature.position, feature.data.text);
        break;
      case 'highlight':
        showHighlight(feature.position, feature.data.area);
        break;
      case 'zoom':
        applyZoom(feature.position, feature.data.scale);
        break;
    }
  }, []);

  // Adicionar ponteiro visual
  const addPointer = useCallback((x: number, y: number) => {
    const feature: InteractiveFeature = {
      type: 'pointer',
      position: { x, y },
      data: {},
      timestamp: Date.now(),
      author: 'local'
    };

    // Enviar para peers
    peers.forEach(peer => {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        peer.dataChannel.send(JSON.stringify(feature));
      }
    });

    showPointer({ x, y });
  }, [peers]);

  // Adicionar anotação
  const addAnnotation = useCallback((x: number, y: number, text: string) => {
    const feature: InteractiveFeature = {
      type: 'annotation',
      position: { x, y },
      data: { text },
      timestamp: Date.now(),
      author: 'local'
    };

    // Enviar para peers
    peers.forEach(peer => {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        peer.dataChannel.send(JSON.stringify(feature));
      }
    });

    showAnnotation({ x, y }, text);
  }, [peers]);

  // Monitorar estatísticas
  const startStatsMonitoring = useCallback(() => {
    const updateStats = async () => {
      if (peers.size === 0) return;

      for (const peer of peers.values()) {
        try {
          const stats = await peer.connection.getStats();
          peer.stats = stats;

          stats.forEach(report => {
            if (report.type === 'outbound-rtp' && report.kind === 'video') {
              setStreamStats(prev => ({
                ...prev,
                bitrate: report.bytesSent * 8 / report.timestamp * 1000,
                framerate: report.framesPerSecond || 0,
                packetLoss: report.packetsLost || 0
              }));
            }
          });
        } catch (error) {
          console.error('Failed to get stats:', error);
        }
      }
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [peers]);

  // Análise de IA da demonstração
  const analyzeDemo = useCallback(async () => {
    if (!streamConfig.aiAnalysisEnabled || !localStreamRef.current) return;

    const canvas = canvasRef.current;
    const video = localVideoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capturar frame atual
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simular análise de IA (implementar com TensorFlow.js ou similar)
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Análise fictícia
    const analysis = {
      engagement: Math.random() * 100,
      clarity: Math.random() * 100,
      pace: Math.random() * 100,
      suggestions: [
        'Fale mais devagar para melhor compreensão',
        'Aproxime-se mais da câmera',
        'Destaque os pontos principais'
      ]
    };

    return analysis;
  }, [streamConfig.aiAnalysisEnabled]);

  return {
    isSupported,
    streamConfig,
    setStreamConfig,
    currentSession,
    streamStats,
    interactiveFeatures,
    localVideoRef,
    remoteVideoRef,
    canvasRef,
    startCapture,
    stopCapture,
    createPeerConnection,
    addPointer,
    addAnnotation,
    analyzeDemo
  };
}

// Componente de streaming
interface StreamingStudioProps {
  onSessionStart?: (session: StreamingSession) => void;
  onSessionEnd?: () => void;
}

export function StreamingStudio({ onSessionStart, onSessionEnd }: StreamingStudioProps) {
  const {
    isSupported,
    streamConfig,
    setStreamConfig,
    streamStats,
    interactiveFeatures,
    localVideoRef,
    canvasRef,
    startCapture,
    stopCapture,
    addPointer,
    addAnnotation
  } = useWebRTCStreaming();

  const [isStreaming, setIsStreaming] = useState(false);
  const [showAnnotationInput, setShowAnnotationInput] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });

  const handleStartStream = async () => {
    try {
      await startCapture();
      setIsStreaming(true);
      
      const session: StreamingSession = {
        id: `session-${Date.now()}`,
        title: 'Portfolio Demo',
        description: 'Demonstração interativa do portfólio',
        type: 'demo',
        status: 'live',
        startTime: Date.now(),
        duration: 0,
        participants: ['host']
      };

      onSessionStart?.(session);
    } catch (error) {
      console.error('Failed to start stream:', error);
    }
  };

  const handleStopStream = () => {
    stopCapture();
    setIsStreaming(false);
    onSessionEnd?.();
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (e.ctrlKey) {
      // Adicionar anotação
      setAnnotationPosition({ x, y });
      setShowAnnotationInput(true);
    } else {
      // Adicionar ponteiro
      addPointer(x, y);
    }
  };

  const handleAddAnnotation = () => {
    if (annotationText.trim()) {
      addAnnotation(annotationPosition.x, annotationPosition.y, annotationText);
      setAnnotationText('');
      setShowAnnotationInput(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p>WebRTC não suportado neste navegador</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de streaming */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Streaming Studio</h3>
          <div className="flex items-center space-x-2">
            {isStreaming && (
              <div className="flex items-center space-x-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">AO VIVO</span>
              </div>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={streamConfig.video}
              onChange={(e) => setStreamConfig(prev => ({ ...prev, video: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Vídeo</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={streamConfig.audio}
              onChange={(e) => setStreamConfig(prev => ({ ...prev, audio: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Áudio</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={streamConfig.screen}
              onChange={(e) => setStreamConfig(prev => ({ ...prev, screen: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Tela</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={streamConfig.recordingEnabled}
              onChange={(e) => setStreamConfig(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Gravar</span>
          </label>
        </div>

        {/* Controles principais */}
        <div className="flex space-x-4">
          {!isStreaming ? (
            <button
              onClick={handleStartStream}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              🎥 Iniciar Stream
            </button>
          ) : (
            <button
              onClick={handleStopStream}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              ⏹️ Parar Stream
            </button>
          )}
        </div>
      </div>

      {/* Área de vídeo */}
      {isStreaming && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto cursor-crosshair"
            onClick={handleVideoClick}
          />

          {/* Canvas para análise */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Recursos interativos */}
          <div className="absolute inset-0 pointer-events-none">
            {interactiveFeatures.map((feature, index) => (
              <InteractiveOverlay key={index} feature={feature} />
            ))}
          </div>

          {/* Estatísticas em tempo real */}
          <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm">
            <div>FPS: {Math.round(streamStats.framerate)}</div>
            <div>Bitrate: {Math.round(streamStats.bitrate / 1000)} kbps</div>
            <div>Resolução: {streamStats.resolution.width}x{streamStats.resolution.height}</div>
            <div>Latência: {Math.round(streamStats.latency)}ms</div>
          </div>

          {/* Instruções */}
          <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm">
            <div>Clique: Ponteiro</div>
            <div>Ctrl + Clique: Anotação</div>
          </div>
        </div>
      )}

      {/* Modal de anotação */}
      <AnimatePresence>
        {showAnnotationInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAnnotationInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-4">Adicionar Anotação</h3>
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Digite sua anotação..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddAnnotation}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAnnotationInput(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente de overlay interativo
function InteractiveOverlay({ feature }: { feature: InteractiveFeature }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const style = {
    left: `${feature.position.x * 100}%`,
    top: `${feature.position.y * 100}%`,
    transform: 'translate(-50%, -50%)'
  };

  switch (feature.type) {
    case 'pointer':
      return (
        <motion.div
          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          style={style}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      );

    case 'annotation':
      return (
        <motion.div
          className="absolute bg-yellow-400 text-black p-2 rounded-lg text-sm font-medium shadow-lg max-w-32"
          style={style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {feature.data.text}
        </motion.div>
      );

    default:
      return null;
  }
}

// Funções auxiliares
function getResolutionByQuality(quality: StreamConfig['quality']) {
  switch (quality) {
    case 'low': return { width: 640, height: 480 };
    case 'medium': return { width: 1280, height: 720 };
    case 'high': return { width: 1920, height: 1080 };
    default: return { width: 1280, height: 720 };
  }
}

function getFrameRateByQuality(quality: StreamConfig['quality']) {
  switch (quality) {
    case 'low': return 15;
    case 'medium': return 30;
    case 'high': return 60;
    default: return 30;
  }
}

function showPointer(position: { x: number; y: number }) {
  // Implementar efeito visual do ponteiro
  console.log('Showing pointer at:', position);
}

function showAnnotation(position: { x: number; y: number }, text: string) {
  // Implementar efeito visual da anotação
  console.log('Showing annotation at:', position, text);
}

function showHighlight(position: { x: number; y: number }, area: any) {
  // Implementar efeito de destaque
  console.log('Showing highlight at:', position, area);
}

function applyZoom(position: { x: number; y: number }, scale: number) {
  // Implementar efeito de zoom
  console.log('Applying zoom at:', position, scale);
}

export default {
  useWebRTCStreaming,
  StreamingStudio
};