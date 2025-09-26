import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para AR e 3D
interface ARSupport {
  webXR: boolean;
  webRTC: boolean;
  deviceOrientation: boolean;
  mediaDevices: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
}

interface Device3DCapabilities {
  webGL: boolean;
  webGL2: boolean;
  maxTextureSize: number;
  maxVertexUniforms: number;
  performanceLevel: 'low' | 'medium' | 'high';
  supportedFormats: string[];
}

interface ARMode {
  mode: 'portfolio' | 'business-card' | 'demo' | 'experience';
  isActive: boolean;
  trackingType: 'marker' | 'markerless' | 'face' | 'hand';
}

interface Model3D {
  id: string;
  name: string;
  url: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  animations?: string[];
  interactive?: boolean;
  hotspots?: Array<{
    position: [number, number, number];
    content: string;
    type: 'info' | 'link' | 'media';
  }>;
}

// Hook principal para AR/3D
export function useAR3D() {
  const [arSupport, setARSupport] = useState<ARSupport>({
    webXR: false,
    webRTC: false,
    deviceOrientation: false,
    mediaDevices: false,
    accelerometer: false,
    gyroscope: false
  });

  const [device3D, setDevice3D] = useState<Device3DCapabilities>({
    webGL: false,
    webGL2: false,
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    performanceLevel: 'low',
    supportedFormats: []
  });

  const [arMode, setARMode] = useState<ARMode>({
    mode: 'portfolio',
    isActive: false,
    trackingType: 'markerless'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detectar suporte AR/3D
  useEffect(() => {
    detectARSupport();
    detect3DCapabilities();
  }, []);

  const detectARSupport = useCallback(async () => {
    const support: ARSupport = {
      webXR: 'xr' in navigator && 'requestSession' in (navigator as any).xr,
      webRTC: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      mediaDevices: 'mediaDevices' in navigator,
      accelerometer: 'Accelerometer' in window,
      gyroscope: 'Gyroscope' in window
    };

    setARSupport(support);
  }, []);

  const detect3DCapabilities = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext;

    if (gl) {
      const capabilities: Device3DCapabilities = {
        webGL: true,
        webGL2: !!gl2,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        performanceLevel: determinePerformanceLevel(gl),
        supportedFormats: getSupportedFormats(gl)
      };

      setDevice3D(capabilities);
    }
  }, []);

  // Iniciar AR
  const startAR = useCallback(async (mode: ARMode['mode']) => {
    if (!arSupport.webRTC) {
      throw new Error('WebRTC não suportado');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setARMode({
        mode,
        isActive: true,
        trackingType: 'markerless'
      });

      // Iniciar tracking
      startTracking();

    } catch (error) {
      console.error('Erro ao iniciar AR:', error);
      throw error;
    }
  }, [arSupport.webRTC]);

  // Parar AR
  const stopAR = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setARMode(prev => ({ ...prev, isActive: false }));
  }, []);

  // Tracking de movimento
  const startTracking = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    const trackingLoop = () => {
      if (!arMode.isActive) return;

      if (ctx && video.readyState >= 2) {
        // Desenhar vídeo no canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simular detecção de marcadores/superfícies
        detectSurfaces(ctx, canvas.width, canvas.height);
      }

      requestAnimationFrame(trackingLoop);
    };

    trackingLoop();
  }, [arMode.isActive]);

  return {
    arSupport,
    device3D,
    arMode,
    videoRef,
    canvasRef,
    startAR,
    stopAR
  };
}

// Componente AR Viewer
interface ARViewerProps {
  mode: ARMode['mode'];
  models?: Model3D[];
  onTrackingFound?: (position: [number, number, number]) => void;
  className?: string;
}

export function ARViewer({ mode, models = [], onTrackingFound, className = '' }: ARViewerProps) {
  const { arSupport, arMode, videoRef, canvasRef, startAR, stopAR } = useAR3D();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedPositions, setTrackedPositions] = useState<Array<[number, number, number]>>([]);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await startAR(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    stopAR();
    setTrackedPositions([]);
  };

  if (!arSupport.webRTC) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>AR não suportado neste dispositivo</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!arMode.isActive ? (
        <div className="text-center p-8">
          <motion.button
            onClick={handleStart}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Iniciando AR...</span>
              </div>
            ) : (
              `Iniciar AR - ${getModeLabel(mode)}`
            )}
          </motion.button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Video feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto bg-black rounded-lg"
          />

          {/* Overlay canvas para tracking */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            width={640}
            height={480}
          />

          {/* AR Overlays */}
          <AROverlays
            mode={mode}
            models={models}
            trackedPositions={trackedPositions}
          />

          {/* Controles */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Overlays AR
interface AROverlaysProps {
  mode: ARMode['mode'];
  models: Model3D[];
  trackedPositions: Array<[number, number, number]>;
}

function AROverlays({ mode, models, trackedPositions }: AROverlaysProps) {
  const renderPortfolioMode = () => (
    <div className="absolute inset-0 pointer-events-none">
      {trackedPositions.map((position, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
          style={{
            left: `${position[0]}%`,
            top: `${position[1]}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm">Projeto Detectado</h3>
            <p className="text-xs text-gray-600">Toque para explorar</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderBusinessCardMode = () => (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Jefferson</h3>
            <p className="text-gray-600">Desenvolvedor Full Stack</p>
            <div className="flex space-x-4 mt-2 text-sm">
              <span>React • Node.js • TypeScript</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium">
            📱 Contato
          </button>
          <button className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium">
            💼 Portfólio
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderDemoMode = () => (
    <div className="absolute inset-0 pointer-events-none">
      {trackedPositions.map((position, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          className="absolute"
          style={{
            left: `${position[0]}%`,
            top: `${position[1]}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg shadow-2xl transform perspective-1000 rotateX-12">
            <div className="text-white text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold">Demo Interativa</h3>
              <p className="text-sm opacity-90">Projeto React + AR</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderExperienceMode = () => (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Experiência Imersiva</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xl mb-2">💻</div>
            <h3 className="font-semibold">Desenvolvimento</h3>
            <p className="text-sm opacity-90">3+ anos de experiência</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-xl mb-2">🎯</div>
            <h3 className="font-semibold">Projetos</h3>
            <p className="text-sm opacity-90">50+ entregas</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  switch (mode) {
    case 'portfolio':
      return renderPortfolioMode();
    case 'business-card':
      return renderBusinessCardMode();
    case 'demo':
      return renderDemoMode();
    case 'experience':
      return renderExperienceMode();
    default:
      return null;
  }
}

// Viewer 3D para modelos
interface Model3DViewerProps {
  model: Model3D;
  autoRotate?: boolean;
  enableControls?: boolean;
  className?: string;
}

export function Model3DViewer({ model, autoRotate = true, enableControls = true, className = '' }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Simular carregamento do modelo 3D
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [model.url]);

  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 1 }));
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableControls) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !enableControls) return;

    const deltaX = e.movementX;
    const deltaY = e.movementY;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando modelo 3D...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 dark:text-red-300">Erro ao carregar modelo 3D</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Simulação do modelo 3D */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <motion.div
          className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-2xl"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.3)',
              '0 0 40px rgba(147, 51, 234, 0.3)',
              '0 0 20px rgba(236, 72, 153, 0.3)',
              '0 0 20px rgba(59, 130, 246, 0.3)'
            ]
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
            {model.name.charAt(0)}
          </div>
        </motion.div>
      </div>

      {/* Hotspots */}
      <AnimatePresence>
        {model.hotspots?.map((hotspot, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full cursor-pointer"
            style={{
              left: `${50 + hotspot.position[0] * 10}%`,
              top: `${50 + hotspot.position[1] * 10}%`
            }}
            whileHover={{ scale: 1.5 }}
            title={hotspot.content}
          >
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Controles */}
      {enableControls && (
        <div className="absolute bottom-4 right-4 space-y-2">
          <button
            onClick={() => setRotation({ x: 0, y: 0 })}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            title="Resetar rotação"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Informações do modelo */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg">
        <h3 className="font-semibold text-sm">{model.name}</h3>
        {model.interactive && (
          <p className="text-xs opacity-90">Interativo • Arraste para rotacionar</p>
        )}
      </div>
    </div>
  );
}

// Galeria AR/3D
export function AR3DGallery() {
  const [selectedMode, setSelectedMode] = useState<ARMode['mode']>('portfolio');
  
  const demoModels: Model3D[] = [
    {
      id: 'portfolio-card',
      name: 'Cartão Portfolio',
      url: '/models/portfolio-card.glb',
      scale: [1, 1, 1],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      interactive: true,
      hotspots: [
        { position: [0.5, 0.5, 0], content: 'Projetos Principais', type: 'info' },
        { position: [-0.5, 0.5, 0], content: 'Contato', type: 'link' }
      ]
    },
    {
      id: 'skill-cube',
      name: 'Cubo de Habilidades',
      url: '/models/skill-cube.glb',
      scale: [1.2, 1.2, 1.2],
      position: [0, 0, 0],
      rotation: [0, 45, 0],
      interactive: true,
      animations: ['rotate', 'pulse']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Experiência AR/3D</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore o portfólio em realidade aumentada e visualizações 3D interativas
        </p>
      </div>

      {/* Seletor de modo */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['portfolio', 'business-card', 'demo', 'experience'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {getModeLabel(mode)}
          </button>
        ))}
      </div>

      {/* AR Viewer */}
      <ARViewer
        mode={selectedMode}
        models={demoModels}
        className="w-full h-96"
      />

      {/* Galeria de modelos 3D */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoModels.map((model) => (
          <Model3DViewer
            key={model.id}
            model={model}
            className="h-64"
          />
        ))}
      </div>
    </div>
  );
}

// Funções auxiliares
function getModeLabel(mode: ARMode['mode']): string {
  const labels = {
    portfolio: 'Portfólio AR',
    'business-card': 'Cartão Digital',
    demo: 'Demo Interativa',
    experience: 'Experiência Completa'
  };
  return labels[mode];
}

function determinePerformanceLevel(gl: WebGLRenderingContext): 'low' | 'medium' | 'high' {
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  
  if (maxTextureSize >= 8192) return 'high';
  if (maxTextureSize >= 4096) return 'medium';
  return 'low';
}

function getSupportedFormats(gl: WebGLRenderingContext): string[] {
  const formats = ['WEBP', 'PNG', 'JPEG'];
  // Em uma implementação real, verificaria extensões WebGL
  return formats;
}

function detectSurfaces(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Simulação simplificada de detecção de superfícies
  const imageData = ctx.getImageData(0, 0, width, height);
  
  // Em uma implementação real, usaria algoritmos como:
  // - Edge detection (Canny, Sobel)
  // - Corner detection (Harris, FAST)
  // - Feature matching (ORB, SIFT)
  // - Plane detection
  
  // Para demo, retorna posições aleatórias
  return [
    [Math.random() * 100, Math.random() * 100, 0]
  ];
}

export default {
  useAR3D,
  ARViewer,
  Model3DViewer,
  AR3DGallery
};