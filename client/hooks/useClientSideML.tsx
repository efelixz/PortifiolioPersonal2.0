import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// Tipos para ML Client-Side
interface MLModel {
  id: string;
  name: string;
  type: 'image-classification' | 'object-detection' | 'sentiment-analysis' | 'face-recognition' | 'gesture-recognition';
  status: 'loading' | 'ready' | 'error';
  accuracy: number;
  size: number;
  inferenceTime: number;
}

interface MLPrediction {
  confidence: number;
  label: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

interface MLAnalysis {
  predictions: MLPrediction[];
  processingTime: number;
  modelUsed: string;
  timestamp: number;
  inputType: 'image' | 'text' | 'audio' | 'video';
}

interface UserBehaviorPattern {
  action: string;
  frequency: number;
  timestamp: number;
  context: Record<string, any>;
  confidence: number;
}

interface PersonalizationData {
  preferences: Record<string, any>;
  behaviorPatterns: UserBehaviorPattern[];
  interactionHistory: Array<{
    type: string;
    data: any;
    timestamp: number;
  }>;
  predictedInterests: string[];
}

// Hook principal para ML Client-Side
export function useClientSideML() {
  const [models, setModels] = useState<Map<string, MLModel>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [capabilities, setCapabilities] = useState({
    webgl: false,
    webgpu: false,
    sharedArrayBuffer: false,
    offscreenCanvas: false,
    webAssembly: false
  });

  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({
    preferences: {},
    behaviorPatterns: [],
    interactionHistory: [],
    predictedInterests: []
  });

  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detectar capacidades do navegador
  useEffect(() => {
    detectMLCapabilities();
    initializeMLWorker();
    loadPersonalizationData();
  }, []);

  const detectMLCapabilities = useCallback(() => {
    const caps = {
      webgl: !!document.createElement('canvas').getContext('webgl'),
      webgpu: 'gpu' in navigator,
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      offscreenCanvas: typeof OffscreenCanvas !== 'undefined',
      webAssembly: typeof WebAssembly !== 'undefined'
    };

    setCapabilities(caps);
    console.log('ML Capabilities detected:', caps);
  }, []);

  // Inicializar Web Worker para ML
  const initializeMLWorker = useCallback(() => {
    if (typeof Worker === 'undefined') return;

    // Criar Web Worker inline para processamento ML
    const workerScript = `
      // Web Worker para processamento ML
      let loadedModels = new Map();
      
      self.addEventListener('message', async function(e) {
        const { type, data, modelId } = e.data;
        
        try {
          switch (type) {
            case 'LOAD_MODEL':
              await loadModel(data);
              break;
            case 'PREDICT':
              const result = await predict(modelId, data);
              self.postMessage({ type: 'PREDICTION_RESULT', result });
              break;
            case 'ANALYZE_BEHAVIOR':
              const patterns = analyzeBehaviorPatterns(data);
              self.postMessage({ type: 'BEHAVIOR_ANALYSIS', patterns });
              break;
          }
        } catch (error) {
          self.postMessage({ type: 'ERROR', error: error.message });
        }
      });
      
      async function loadModel(modelConfig) {
        // Simular carregamento de modelo
        await new Promise(resolve => setTimeout(resolve, 1000));
        loadedModels.set(modelConfig.id, modelConfig);
        self.postMessage({ type: 'MODEL_LOADED', modelId: modelConfig.id });
      }
      
      async function predict(modelId, inputData) {
        const model = loadedModels.get(modelId);
        if (!model) throw new Error('Model not loaded');
        
        // Simular inferência
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return {
          predictions: generateMockPredictions(model.type),
          processingTime: 50,
          modelUsed: modelId,
          timestamp: Date.now()
        };
      }
      
      function generateMockPredictions(modelType) {
        switch (modelType) {
          case 'image-classification':
            return [
              { confidence: 0.95, label: 'Portfolio Screenshot' },
              { confidence: 0.03, label: 'Code Editor' },
              { confidence: 0.02, label: 'Design Document' }
            ];
          case 'sentiment-analysis':
            return [
              { confidence: 0.85, label: 'Positive' },
              { confidence: 0.10, label: 'Neutral' },
              { confidence: 0.05, label: 'Negative' }
            ];
          case 'face-recognition':
            return [
              { 
                confidence: 0.92, 
                label: 'Professional Photo',
                boundingBox: { x: 100, y: 50, width: 200, height: 250 }
              }
            ];
          default:
            return [{ confidence: 0.5, label: 'Unknown' }];
        }
      }
      
      function analyzeBehaviorPatterns(interactionHistory) {
        const patterns = [];
        const actionCounts = {};
        
        interactionHistory.forEach(interaction => {
          actionCounts[interaction.type] = (actionCounts[interaction.type] || 0) + 1;
        });
        
        Object.entries(actionCounts).forEach(([action, frequency]) => {
          patterns.push({
            action,
            frequency,
            timestamp: Date.now(),
            context: {},
            confidence: Math.min(frequency / 10, 1)
          });
        });
        
        return patterns;
      }
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      handleWorkerMessage(e.data);
    };

    workerRef.current.onerror = (error) => {
      console.error('ML Worker error:', error);
    };
  }, []);

  const handleWorkerMessage = useCallback((data: any) => {
    const { type, result, modelId, patterns, error } = data;

    switch (type) {
      case 'MODEL_LOADED':
        setModels(prev => {
          const updated = new Map(prev);
          const model = updated.get(modelId);
          if (model) {
            updated.set(modelId, { ...model, status: 'ready' });
          }
          return updated;
        });
        break;

      case 'PREDICTION_RESULT':
        // Processar resultado da predição
        console.log('ML Prediction:', result);
        break;

      case 'BEHAVIOR_ANALYSIS':
        setPersonalizationData(prev => ({
          ...prev,
          behaviorPatterns: patterns
        }));
        break;

      case 'ERROR':
        console.error('ML Worker error:', error);
        break;
    }
  }, []);

  // Carregar modelo ML
  const loadModel = useCallback(async (modelConfig: Omit<MLModel, 'status'>) => {
    const model: MLModel = {
      ...modelConfig,
      status: 'loading'
    };

    setModels(prev => new Map(prev.set(model.id, model)));

    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'LOAD_MODEL',
        data: model
      });
    }
  }, []);

  // Análise de imagem
  const analyzeImage = useCallback(async (imageElement: HTMLImageElement | HTMLCanvasElement, modelId: string): Promise<MLAnalysis | null> => {
    const model = models.get(modelId);
    if (!model || model.status !== 'ready') {
      console.warn('Model not ready:', modelId);
      return null;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Redimensionar para otimização
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(imageElement, 0, 0, 224, 224);

    const imageData = ctx.getImageData(0, 0, 224, 224);
    
    return new Promise((resolve) => {
      if (workerRef.current) {
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'PREDICTION_RESULT') {
            workerRef.current?.removeEventListener('message', handler);
            resolve(e.data.result);
          }
        };

        workerRef.current.addEventListener('message', handler);
        workerRef.current.postMessage({
          type: 'PREDICT',
          modelId,
          data: imageData
        });
      }
    });
  }, [models]);

  // Análise de sentimento em texto
  const analyzeSentiment = useCallback(async (text: string): Promise<MLAnalysis | null> => {
    const model = models.get('sentiment-analyzer');
    if (!model || model.status !== 'ready') return null;

    return new Promise((resolve) => {
      if (workerRef.current) {
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'PREDICTION_RESULT') {
            workerRef.current?.removeEventListener('message', handler);
            resolve(e.data.result);
          }
        };

        workerRef.current.addEventListener('message', handler);
        workerRef.current.postMessage({
          type: 'PREDICT',
          modelId: 'sentiment-analyzer',
          data: { text }
        });
      }
    });
  }, [models]);

  // Reconhecimento de gestos (simulado)
  const recognizeGesture = useCallback(async (videoElement: HTMLVideoElement): Promise<MLAnalysis | null> => {
    // Simular análise de gestos
    const mockAnalysis: MLAnalysis = {
      predictions: [
        { confidence: 0.8, label: 'pointing_right' },
        { confidence: 0.15, label: 'thumbs_up' },
        { confidence: 0.05, label: 'wave' }
      ],
      processingTime: 25,
      modelUsed: 'gesture-recognizer',
      timestamp: Date.now(),
      inputType: 'video'
    };

    return mockAnalysis;
  }, []);

  // Análise de comportamento do usuário
  const analyzeBehavior = useCallback(async (interactions: any[]) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'ANALYZE_BEHAVIOR',
        data: interactions
      });
    }
  }, []);

  // Rastrear interação do usuário
  const trackInteraction = useCallback((type: string, data: any) => {
    const interaction = {
      type,
      data,
      timestamp: Date.now()
    };

    setPersonalizationData(prev => ({
      ...prev,
      interactionHistory: [...prev.interactionHistory.slice(-99), interaction] // Manter últimas 100
    }));

    // Analisar padrões se tivermos dados suficientes
    if (personalizationData.interactionHistory.length >= 10) {
      analyzeBehavior([...personalizationData.interactionHistory, interaction]);
    }
  }, [personalizationData.interactionHistory, analyzeBehavior]);

  // Gerar recomendações personalizadas
  const generatePersonalizedRecommendations = useCallback(() => {
    const { behaviorPatterns, preferences } = personalizationData;
    
    const recommendations: string[] = [];

    // Baseado em padrões de comportamento
    behaviorPatterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        switch (pattern.action) {
          case 'project-view':
            recommendations.push('Explore mais projetos similares');
            break;
          case 'technology-interest':
            recommendations.push('Veja implementações com essa tecnologia');
            break;
          case 'demo-interaction':
            recommendations.push('Experimente demonstrações interativas');
            break;
        }
      }
    });

    return recommendations;
  }, [personalizationData]);

  // Otimização automática de performance
  const optimizePerformance = useCallback(() => {
    const { behaviorPatterns } = personalizationData;
    
    const optimizations = {
      prefetchContent: [],
      reduceAnimations: false,
      prioritizeFeatures: []
    };

    // Analisar padrões para otimizações
    behaviorPatterns.forEach(pattern => {
      if (pattern.frequency > 5) {
        optimizations.prefetchContent.push(pattern.action);
      }
    });

    // Reduzir animações se usuário não interage muito
    const totalInteractions = behaviorPatterns.reduce((sum, p) => sum + p.frequency, 0);
    if (totalInteractions < 10) {
      optimizations.reduceAnimations = true;
    }

    return optimizations;
  }, [personalizationData]);

  // Carregar dados de personalização
  const loadPersonalizationData = useCallback(() => {
    try {
      const stored = localStorage.getItem('ml-personalization');
      if (stored) {
        setPersonalizationData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load personalization data:', error);
    }
  }, []);

  // Salvar dados de personalização
  const savePersonalizationData = useCallback(() => {
    try {
      localStorage.setItem('ml-personalization', JSON.stringify(personalizationData));
    } catch (error) {
      console.error('Failed to save personalization data:', error);
    }
  }, [personalizationData]);

  // Salvar automaticamente
  useEffect(() => {
    savePersonalizationData();
  }, [personalizationData, savePersonalizationData]);

  return {
    models: Array.from(models.values()),
    capabilities,
    personalizationData,
    canvasRef,
    loadModel,
    analyzeImage,
    analyzeSentiment,
    recognizeGesture,
    trackInteraction,
    generatePersonalizedRecommendations,
    optimizePerformance
  };
}

// Componente de dashboard ML
export function MLDashboard() {
  const {
    models,
    capabilities,
    personalizationData,
    loadModel,
    generatePersonalizedRecommendations,
    optimizePerformance
  } = useClientSideML();

  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Carregar modelos padrão
  useEffect(() => {
    const defaultModels = [
      {
        id: 'image-classifier',
        name: 'Classificador de Imagens',
        type: 'image-classification' as const,
        accuracy: 0.94,
        size: 25 * 1024 * 1024, // 25MB
        inferenceTime: 50
      },
      {
        id: 'sentiment-analyzer',
        name: 'Análise de Sentimento',
        type: 'sentiment-analysis' as const,
        accuracy: 0.89,
        size: 15 * 1024 * 1024, // 15MB
        inferenceTime: 25
      },
      {
        id: 'gesture-recognizer',
        name: 'Reconhecimento de Gestos',
        type: 'gesture-recognition' as const,
        accuracy: 0.82,
        size: 45 * 1024 * 1024, // 45MB
        inferenceTime: 75
      }
    ];

    defaultModels.forEach(model => loadModel(model));
  }, [loadModel]);

  // Gerar recomendações
  useEffect(() => {
    const newRecommendations = generatePersonalizedRecommendations();
    setRecommendations(newRecommendations);
  }, [personalizationData, generatePersonalizedRecommendations]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: MLModel['status']) => {
    switch (status) {
      case 'ready': return 'text-green-600';
      case 'loading': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: MLModel['status']) => {
    switch (status) {
      case 'ready': return '✅';
      case 'loading': return '⏳';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🧠</span>
          Machine Learning Dashboard
        </h3>

        {/* Capacidades do navegador */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Capacidades Detectadas</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {Object.entries(capabilities).map(([capability, supported]) => (
              <div key={capability} className="flex items-center space-x-2">
                <span className={supported ? 'text-green-600' : 'text-red-600'}>
                  {supported ? '✅' : '❌'}
                </span>
                <span className="capitalize">{capability.replace(/([A-Z])/g, ' $1')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modelos carregados */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Modelos ML Carregados</h4>
          <div className="space-y-3">
            {models.map((model) => (
              <motion.div
                key={model.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setActiveModel(activeModel === model.id ? null : model.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStatusIcon(model.status)}</span>
                    <div>
                      <h5 className="font-medium">{model.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {model.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className={getStatusColor(model.status)}>
                      {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                    </div>
                    <div className="text-gray-500">
                      {formatBytes(model.size)}
                    </div>
                  </div>
                </div>

                {activeModel === model.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Precisão:</span>
                        <div className="font-medium">{(model.accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Inferência:</span>
                        <div className="font-medium">{model.inferenceTime}ms</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Análise de comportamento */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Análise de Comportamento</h4>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Interações:</span>
                <div className="font-medium text-lg">
                  {personalizationData.interactionHistory.length}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Padrões:</span>
                <div className="font-medium text-lg">
                  {personalizationData.behaviorPatterns.length}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Interesses:</span>
                <div className="font-medium text-lg">
                  {personalizationData.predictedInterests.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações personalizadas */}
        {recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Recomendações Personalizadas</h4>
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm"
                >
                  <span className="text-blue-600 dark:text-blue-400">💡</span>
                  <span className="ml-2">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de análise de imagem em tempo real
export function RealTimeImageAnalysis() {
  const { analyzeImage, models, canvasRef } = useClientSideML();
  const [analysis, setAnalysis] = useState<MLAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    const img = new Image();
    img.onload = async () => {
      const result = await analyzeImage(img, 'image-classifier');
      setAnalysis(result);
      setIsAnalyzing(false);
    };
    
    img.src = URL.createObjectURL(file);
  };

  const isModelReady = models.some(m => m.id === 'image-classifier' && m.status === 'ready');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4">Análise de Imagem em Tempo Real</h3>

      <canvas ref={canvasRef} className="hidden" />

      {!isModelReady ? (
        <div className="text-center p-8 text-gray-500">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando modelo de classificação...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              📸 Analisar Imagem
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center p-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Analisando...</p>
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
            >
              <h4 className="font-semibold mb-3">Resultados da Análise</h4>
              
              <div className="space-y-2 mb-4">
                {analysis.predictions.map((prediction, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{prediction.label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Processado em {analysis.processingTime}ms usando {analysis.modelUsed}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default {
  useClientSideML,
  MLDashboard,
  RealTimeImageAnalysis
};