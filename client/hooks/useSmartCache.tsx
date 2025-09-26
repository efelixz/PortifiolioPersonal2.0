import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para cache inteligente
interface CacheStrategy {
  name: string;
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  maxAge: number;
  maxItems: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface CacheStats {
  totalSize: number;
  itemCount: number;
  hitRate: number;
  missRate: number;
  strategies: Record<string, {
    hits: number;
    misses: number;
    size: number;
  }>;
}

interface OfflineCapability {
  pages: string[];
  assets: string[];
  data: Record<string, any>;
  lastSync: number;
  syncInProgress: boolean;
}

interface SmartCacheConfig {
  enableIntelligentPrefetch: boolean;
  enableUserBehaviorPrediction: boolean;
  enableAdaptiveStrategies: boolean;
  maxCacheSize: number;
  compressionLevel: 'none' | 'low' | 'medium' | 'high';
  encryptSensitiveData: boolean;
}

// Hook principal para cache inteligente
export function useSmartCache() {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: 0,
    itemCount: 0,
    hitRate: 0,
    missRate: 0,
    strategies: {}
  });

  const [offlineCapability, setOfflineCapability] = useState<OfflineCapability>({
    pages: [],
    assets: [],
    data: {},
    lastSync: 0,
    syncInProgress: false
  });

  const [config, setConfig] = useState<SmartCacheConfig>({
    enableIntelligentPrefetch: true,
    enableUserBehaviorPrediction: true,
    enableAdaptiveStrategies: true,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    compressionLevel: 'medium',
    encryptSensitiveData: true
  });

  const userBehavior = useRef<Array<{
    url: string;
    timestamp: number;
    duration: number;
    actions: string[];
  }>>([]);

  // Estratégias de cache predefinidas
  const cacheStrategies: CacheStrategy[] = [
    {
      name: 'critical-assets',
      pattern: /\.(css|js|woff2?|ttf)$/,
      strategy: 'cache-first',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      maxItems: 100,
      priority: 'critical'
    },
    {
      name: 'images',
      pattern: /\.(jpg|jpeg|png|webp|svg|gif|ico)$/,
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      maxItems: 200,
      priority: 'high'
    },
    {
      name: 'api-data',
      pattern: /\/api\//,
      strategy: 'stale-while-revalidate',
      maxAge: 5 * 60 * 1000, // 5 minutos
      maxItems: 50,
      priority: 'medium'
    },
    {
      name: 'pages',
      pattern: /\/(projetos|contato|sobre|demos)/,
      strategy: 'network-first',
      maxAge: 60 * 60 * 1000, // 1 hora
      maxItems: 20,
      priority: 'high'
    },
    {
      name: '3d-models',
      pattern: /\.(glb|gltf|obj|fbx)$/,
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      maxItems: 10,
      priority: 'medium'
    },
    {
      name: 'ai-responses',
      pattern: /\/ai\//,
      strategy: 'stale-while-revalidate',
      maxAge: 30 * 60 * 1000, // 30 minutos
      maxItems: 100,
      priority: 'low'
    }
  ];

  // Inicializar cache inteligente
  useEffect(() => {
    initializeSmartCache();
    setupPerformanceMonitoring();
    loadUserBehaviorData();
  }, []);

  const initializeSmartCache = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Enviar configuração para o Service Worker
      registration.active?.postMessage({
        type: 'INIT_SMART_CACHE',
        strategies: cacheStrategies,
        config
      });

      // Configurar listeners
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      // Atualizar estatísticas
      updateCacheStats();
    } catch (error) {
      console.error('Failed to initialize smart cache:', error);
    }
  }, [config]);

  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_STATS_UPDATE':
        setCacheStats(data);
        break;
      case 'OFFLINE_READY':
        setOfflineCapability(prev => ({
          ...prev,
          pages: data.pages,
          assets: data.assets,
          lastSync: Date.now()
        }));
        break;
      case 'SYNC_PROGRESS':
        setOfflineCapability(prev => ({
          ...prev,
          syncInProgress: data.inProgress
        }));
        break;
    }
  }, []);

  // Monitoramento de performance
  const setupPerformanceMonitoring = useCallback(() => {
    // Performance Observer para navegação
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            trackPagePerformance(navEntry);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }

    // Rastrear comportamento do usuário
    setupUserBehaviorTracking();
  }, []);

  const trackPagePerformance = useCallback((entry: PerformanceNavigationTiming) => {
    const metrics = {
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      domReady: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      firstPaint: entry.responseStart - entry.requestStart,
      transferSize: entry.transferSize,
      cacheHit: entry.transferSize === 0
    };

    // Atualizar estatísticas de hit/miss
    setCacheStats(prev => ({
      ...prev,
      hitRate: metrics.cacheHit ? prev.hitRate + 1 : prev.hitRate,
      missRate: !metrics.cacheHit ? prev.missRate + 1 : prev.missRate
    }));

    // Enviar para o Service Worker para análise
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PERFORMANCE_METRICS',
        metrics,
        url: window.location.href
      });
    }
  }, []);

  const setupUserBehaviorTracking = useCallback(() => {
    let sessionStart = Date.now();
    let interactions: string[] = [];

    // Rastrear cliques
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      interactions.push(`click:${target.tagName}:${target.className}`);
    });

    // Rastrear scroll
    let scrollDepth = 0;
    document.addEventListener('scroll', () => {
      const depth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (depth > scrollDepth) {
        scrollDepth = depth;
      }
    });

    // Salvar dados na saída da página
    window.addEventListener('beforeunload', () => {
      const sessionData = {
        url: window.location.href,
        timestamp: sessionStart,
        duration: Date.now() - sessionStart,
        actions: interactions,
        scrollDepth
      };

      userBehavior.current.push(sessionData);
      localStorage.setItem('user-behavior', JSON.stringify(userBehavior.current.slice(-50))); // Manter últimas 50 sessões
    });
  }, []);

  const loadUserBehaviorData = useCallback(() => {
    try {
      const stored = localStorage.getItem('user-behavior');
      if (stored) {
        userBehavior.current = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user behavior data:', error);
    }
  }, []);

  // Prefetch inteligente baseado em comportamento
  const intelligentPrefetch = useCallback((currentUrl: string) => {
    if (!config.enableIntelligentPrefetch) return;

    // Analisar padrões de navegação
    const behaviorData = userBehavior.current;
    const predictions = predictNextPages(currentUrl, behaviorData);

    predictions.forEach(prediction => {
      if (prediction.confidence > 0.7) {
        // Prefetch com alta confiança
        prefetchResource(prediction.url, 'high');
      } else if (prediction.confidence > 0.4) {
        // Prefetch com baixa prioridade
        prefetchResource(prediction.url, 'low');
      }
    });
  }, [config.enableIntelligentPrefetch]);

  const predictNextPages = useCallback((currentUrl: string, behaviorData: typeof userBehavior.current) => {
    const predictions: Array<{ url: string; confidence: number }> = [];
    
    // Análise simples de padrões (em produção, usar ML mais sofisticado)
    const urlCounts: Record<string, number> = {};
    
    behaviorData.forEach(session => {
      if (session.url === currentUrl) {
        // Encontrar próximas páginas visitadas em sessões similares
        const sessionIndex = behaviorData.indexOf(session);
        if (sessionIndex < behaviorData.length - 1) {
          const nextSession = behaviorData[sessionIndex + 1];
          urlCounts[nextSession.url] = (urlCounts[nextSession.url] || 0) + 1;
        }
      }
    });

    // Converter contagens em probabilidades
    const totalSessions = Object.values(urlCounts).reduce((a, b) => a + b, 0);
    
    Object.entries(urlCounts).forEach(([url, count]) => {
      predictions.push({
        url,
        confidence: count / totalSessions
      });
    });

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }, []);

  const prefetchResource = useCallback(async (url: string, priority: 'low' | 'high') => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.setAttribute('importance', priority);
      document.head.appendChild(link);

      // Remover após um tempo para não poluir o DOM
      setTimeout(() => {
        document.head.removeChild(link);
      }, 5000);
    } catch (error) {
      console.error('Prefetch failed:', error);
    }
  }, []);

  // Cache manual de dados críticos
  const cacheData = useCallback(async (key: string, data: any, strategy?: string) => {
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        strategy: strategy || 'default'
      });

      // Cache no localStorage para dados pequenos
      if (serializedData.length < 5000) {
        localStorage.setItem(`cache:${key}`, serializedData);
      }

      // Cache no IndexedDB para dados maiores
      if ('indexedDB' in window) {
        await cacheToIndexedDB(key, data);
      }

      return true;
    } catch (error) {
      console.error('Failed to cache data:', error);
      return false;
    }
  }, []);

  const getCachedData = useCallback(async (key: string) => {
    try {
      // Tentar localStorage primeiro
      const localData = localStorage.getItem(`cache:${key}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        return parsed.data;
      }

      // Tentar IndexedDB
      if ('indexedDB' in window) {
        return await getFromIndexedDB(key);
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }, []);

  // Limpeza inteligente de cache
  const cleanupCache = useCallback(async () => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'CLEANUP_CACHE',
      maxSize: config.maxCacheSize,
      strategies: cacheStrategies
    });
  }, [config.maxCacheSize]);

  // Atualizar estatísticas do cache
  const updateCacheStats = useCallback(async () => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'GET_CACHE_STATS'
    });
  }, []);

  return {
    cacheStats,
    offlineCapability,
    config,
    setConfig,
    intelligentPrefetch,
    cacheData,
    getCachedData,
    cleanupCache,
    updateCacheStats
  };
}

// Componente de monitoramento de cache
export function CacheMonitor() {
  const { cacheStats, offlineCapability, config, setConfig, cleanupCache, updateCacheStats } = useSmartCache();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHitRateColor = (rate: number) => {
    if (rate > 80) return 'text-green-600';
    if (rate > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Header compacto */}
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Cache</span>
          <span className="text-xs text-gray-500">{formatBytes(cacheStats.totalSize)}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Painel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4">
              {/* Estatísticas principais */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Itens</div>
                  <div className="font-semibold">{cacheStats.itemCount}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Hit Rate</div>
                  <div className={`font-semibold ${getHitRateColor(cacheStats.hitRate)}`}>
                    {Math.round(cacheStats.hitRate)}%
                  </div>
                </div>
              </div>

              {/* Status offline */}
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Capacidade Offline</span>
                  {offlineCapability.syncInProgress && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>{offlineCapability.pages.length} páginas cached</div>
                  <div>{offlineCapability.assets.length} assets cached</div>
                  <div>Última sync: {new Date(offlineCapability.lastSync).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Estratégias */}
              <div>
                <div className="text-sm font-medium mb-2">Estratégias Ativas</div>
                <div className="space-y-1">
                  {Object.entries(cacheStats.strategies).map(([name, stats]) => (
                    <div key={name} className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{name}</span>
                      <span>{formatBytes(stats.size)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles */}
              <div className="flex space-x-2">
                <button
                  onClick={updateCacheStats}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
                >
                  Atualizar
                </button>
                <button
                  onClick={cleanupCache}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Configurações rápidas */}
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={config.enableIntelligentPrefetch}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      enableIntelligentPrefetch: e.target.checked 
                    }))}
                    className="mr-2"
                  />
                  Prefetch Inteligente
                </label>
                
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={config.enableUserBehaviorPrediction}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      enableUserBehaviorPrediction: e.target.checked 
                    }))}
                    className="mr-2"
                  />
                  Predição de Comportamento
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Funções auxiliares para IndexedDB
async function cacheToIndexedDB(key: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('smart-cache', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      store.put({
        key,
        data,
        timestamp: Date.now()
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
  });
}

async function getFromIndexedDB(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('smart-cache', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result?.data || null);
      };
      getRequest.onerror = () => reject(getRequest.error);
    };
  });
}

export default {
  useSmartCache,
  CacheMonitor
};