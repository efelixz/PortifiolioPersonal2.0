import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Wifi,
  WifiOff,
  HardDrive,
  Smartphone,
  Monitor,
  Tablet,
  Users,
  TrendingUp,
  RefreshCw,
  Settings,
  Bell,
  Shield,
  Zap,
  Database,
  Globe,
  Activity
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNotifications } from '../hooks/useNotifications';

interface PWADashboardProps {
  className?: string;
}

export function PWADashboard({ className = '' }: PWADashboardProps) {
  const { 
    isInstalled, 
    canInstall, 
    installPWA, 
    getCacheInfo
  } = usePWA();
  
  const { 
    metrics: analyticsMetrics,
    behavior,
    exportAnalytics 
  } = useAnalytics();
  
  const { 
    notifications, 
    unreadCount,
    settings: notificationSettings 
  } = useNotifications();

  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Monitor connection status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsRefreshing(true);
      
      const cacheData = await getCacheInfo();
      setCacheInfo(cacheData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearCache = async () => {
    if (confirm('Tem certeza que deseja limpar o cache? Isso pode afetar a performance offline.')) {
      try {
        // Limpar cache via Service Worker
        if ('serviceWorker' in navigator && 'caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }
        await loadDashboardData();
      } catch (error) {
        console.error('Erro ao limpar cache:', error);
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard PWA
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoramento e controle da aplicação progressiva
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={loadDashboardData}
            disabled={isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </motion.button>
          
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PWA Status */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status PWA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isInstalled ? 'Instalado' : canInstall ? 'Disponível' : 'Navegador'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              isInstalled 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : canInstall
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
          
          {canInstall && !isInstalled && (
            <motion.button
              onClick={installPWA}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Instalar App
            </motion.button>
          )}
        </motion.div>

        {/* Connection Status */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conexão</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              isOnline 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
          </div>
        </motion.div>

        {/* Cache Size */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cache</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cacheInfo ? formatBytes(cacheInfo.totalSize || 0) : '0 MB'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
          
          {cacheInfo && cacheInfo.totalSize > 0 && (
            <button
              onClick={handleClearCache}
              className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Limpar Cache
            </button>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notificações</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unreadCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {notifications.length} total
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comportamento do Usuário
            </h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Profundidade de scroll</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(behavior.scrollDepth)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo na página</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(behavior.timeOnPage / 1000)}s
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cliques registrados</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {behavior.clicksCount}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de dispositivo</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {behavior.deviceType}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Device Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informações do Dispositivo
            </h3>
            <Monitor className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Navegador</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {behavior.browser}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sistema</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {behavior.os}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Resolução</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {behavior.screenResolution}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Idioma</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {behavior.language}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      {analyticsMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Métricas de Performance
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analyticsMetrics.totalPageViews}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visualizações</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analyticsMetrics.uniqueVisitors}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visitantes únicos</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(analyticsMetrics.averageTimeOnSite / 1000)}s
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tempo médio</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analyticsMetrics.bounceRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de rejeição</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cache Details */}
      {cacheInfo && cacheInfo.caches && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes do Cache
            </h3>
            <Database className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(cacheInfo.caches).map(([cacheName, size]) => (
              <div key={cacheName} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {cacheName}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatBytes(size as number)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}