import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Bell, 
  Smartphone, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
  Activity,
  Wifi,
  Download
} from 'lucide-react';
import { PWADashboard } from './PWADashboard';
import { NotificationCenter } from './NotificationCenter';
import { usePWA } from '../hooks/usePWA';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNotifications } from '../hooks/useNotifications';
import { useQuickToast } from './ToastProvider';
import { useAuth } from '../hooks/useAuth';

interface AdvancedControlPanelProps {
  className?: string;
  inDashboard?: boolean;
}

export function AdvancedControlPanel({ className = '', inDashboard = false }: AdvancedControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notifications' | 'analytics' | 'pwa'>('dashboard');
  const [isMinimized, setIsMinimized] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { isInstalled, canInstall, installPWA } = usePWA();
  const { metrics, behavior, isTracking } = useAnalytics();
  const { unreadCount, notifications } = useNotifications();
  const toast = useQuickToast();

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      count: null
    },
    {
      id: 'pwa' as const,
      label: 'PWA',
      icon: <Smartphone className="w-4 h-4" />,
      count: canInstall && !isInstalled ? 1 : null
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      count: isTracking ? metrics?.totalPageViews || 0 : null
    },
    {
      id: 'notifications' as const,
      label: 'Notificações',
      icon: <Bell className="w-4 h-4" />,
      count: unreadCount
    }
  ];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInstallPWA = async () => {
    try {
      const installed = await installPWA();
      if (installed) {
        toast.success('PWA Instalado!', 'O aplicativo foi instalado com sucesso');
      } else {
        toast.warning('Instalação cancelada', 'A instalação do PWA foi cancelada');
      }
    } catch (error) {
      toast.error('Erro na instalação', 'Não foi possível instalar o PWA');
    }
  };

  // Se o usuário não estiver autenticado, não mostra nada
  if (!isAuthenticated) {
    return null;
  }
  
  // Se estiver na página de dashboard, mostra um estilo diferente
  if (inDashboard) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 relative px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {tab.count !== null && tab.count > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {tab.count > 99 ? '99+' : tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="py-2">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <h4 className="font-medium text-white/90 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Status do Sistema
                    </h4>
                    <div className="text-sm text-white/70">
                      <div className="flex justify-between py-1">
                        <span>PWA instalado:</span>
                        <span>{isInstalled ? "✅ Sim" : "❌ Não"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Notificações:</span>
                        <span>{unreadCount} não lidas</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Analytics:</span>
                        <span>{isTracking ? "✅ Ativo" : "❌ Inativo"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <h4 className="font-medium text-white/90 mb-2 flex items-center gap-2">
                      <Wifi className="w-4 h-4" /> Conectividade
                    </h4>
                    <div className="text-sm text-white/70">
                      <div className="flex justify-between py-1">
                        <span>Status:</span>
                        <span className="text-green-400">Online</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>WebSocket:</span>
                        <span className="text-green-400">Conectado</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Cache:</span>
                        <span>Atualizado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pwa' && (
              <div className="py-2">
                <PWADashboard />
                {canInstall && !isInstalled && (
                  <button
                    onClick={handleInstallPWA}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Instalar PWA
                  </button>
                )}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="py-2">
                {/* Analytics content will go here */}
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="py-2">
                <NotificationCenter />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`fixed bottom-6 right-6 z-50 ${className}`}
        >
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <Settings className="w-6 h-6" />
            
            {(unreadCount > 0 || (canInstall && !isInstalled)) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount + (canInstall && !isInstalled ? 1 : 0)}
              </motion.span>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black bg-opacity-25"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl ${
                isMinimized ? 'w-20' : 'w-96'
              } transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                {!isMinimized && (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Painel Avançado
                  </h2>
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {isMinimized ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized ? (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex-1 relative px-3 py-3 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {tab.icon}
                          <span className="hidden sm:inline">{tab.label}</span>
                          
                          {tab.count !== null && tab.count > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {tab.count > 99 ? '99+' : tab.count}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                      <div className="p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Visão Geral
                        </h3>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm text-blue-900 dark:text-blue-200">Analytics</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                              {metrics?.totalPageViews || 0}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">visualizações</p>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm text-green-900 dark:text-green-200">PWA</span>
                            </div>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                              {isInstalled ? 'Instalado' : canInstall ? 'Disponível' : 'N/A'}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">status</p>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm text-purple-900 dark:text-purple-200">Notificações</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
                              {notifications.length}
                            </p>
                            <p className="text-xs text-purple-700 dark:text-purple-300">
                              {unreadCount} não lidas
                            </p>
                          </div>
                          
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              <span className="text-sm text-orange-900 dark:text-orange-200">Comportamento</span>
                            </div>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                              {Math.round(behavior.scrollDepth)}%
                            </p>
                            <p className="text-xs text-orange-700 dark:text-orange-300">scroll depth</p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Ações Rápidas
                          </h4>
                          
                          {canInstall && !isInstalled && (
                            <button
                              onClick={handleInstallPWA}
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Instalar PWA
                            </button>
                          )}
                          
                          <button
                            onClick={() => setActiveTab('analytics')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            Ver Analytics
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'pwa' && (
                      <div className="h-full">
                        <PWADashboard />
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Analytics
                        </h3>
                        
                        {metrics && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Páginas vistas</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  {metrics.totalPageViews}
                                </p>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Visitantes únicos</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  {metrics.uniqueVisitors}
                                </p>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tempo médio</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  {Math.round(metrics.averageTimeOnSite / 1000)}s
                                </p>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de rejeição</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  {metrics.bounceRate.toFixed(1)}%
                                </p>
                              </div>
                            </div>

                            {/* Top Pages */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Páginas mais visitadas
                              </h4>
                              <div className="space-y-2">
                                {metrics.topPages.slice(0, 3).map((page, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 truncate">
                                      {page.page}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {page.views}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="p-4">
                        <NotificationCenter />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Minimized View */
                <div className="flex flex-col items-center py-4 space-y-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setIsMinimized(false);
                        handleTabChange(tab.id);
                      }}
                      className={`relative p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={tab.label}
                    >
                      {tab.icon}
                      
                      {tab.count !== null && tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {tab.count > 9 ? '9+' : tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}