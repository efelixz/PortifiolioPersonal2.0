import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/Toast';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isLoading: boolean;
  updateAvailable: boolean;
  swRegistration: ServiceWorkerRegistration | null;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWACapabilities {
  hasServiceWorker: boolean;
  hasNotifications: boolean;
  hasBackgroundSync: boolean;
  hasPushMessaging: boolean;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    isLoading: true,
    updateAvailable: false,
    swRegistration: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [capabilities] = useState<PWACapabilities>({
    hasServiceWorker: 'serviceWorker' in navigator,
    hasNotifications: 'Notification' in window,
    hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    hasPushMessaging: 'serviceWorker' in navigator && 'PushManager' in window
  });
  
  const { success, info, warning } = useToast();

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
          
          // Verificar por atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  info('Nova versão disponível', 'Recarregue para atualizar');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        })
        .finally(() => {
          setState(prev => ({ ...prev, isLoading: false }));
        });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [info]);

  // Detectar se já está instalado
  useEffect(() => {
    const checkInstalled = () => {
      const isInstalled = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setState(prev => ({ ...prev, isInstalled }));
    };

    checkInstalled();
    window.addEventListener('resize', checkInstalled);
    return () => window.removeEventListener('resize', checkInstalled);
  }, []);

  // Listener para prompt de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      setDeferredPrompt(null);
      success('App instalado!', 'Portfólio instalado com sucesso');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [success]);

  // Listener para status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      success('Conexão restaurada', 'Você está online novamente');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      warning('Sem conexão', 'Você está navegando offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [success, warning]);

  // Função para instalar o PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ ...prev, isInstallable: false }));
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Função para enviar notificações
  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!capabilities.hasNotifications) {
      warning('Notificações não são suportadas neste navegador');
      return false;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        warning('Permissão para notificações negada');
        return false;
      }
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      
      // Vibração separada para dispositivos móveis
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }, [capabilities.hasNotifications, warning]);

  // Função para atualizar SW
  const updateServiceWorker = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  }, []);

  // Função para obter informações do cache
  const getCacheInfo = useCallback(async () => {
    if (!state.swRegistration) return null;

    try {
      const messageChannel = new MessageChannel();
      const promise = new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
      });

      state.swRegistration.active?.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );

      return await promise;
    } catch (error) {
      console.error('Erro ao obter informações do cache:', error);
      return null;
    }
  }, [state.swRegistration]);

  return {
    ...state,
    capabilities,
    installPWA,
    updateServiceWorker,
    sendNotification,
    getCacheInfo,
    canInstall: state.isInstallable && !state.isInstalled,
  };
}

// Hook para cache management
export function useServiceWorkerCache() {
  const [cacheSize, setCacheSize] = useState<number>(0);

  useEffect(() => {
    if ('caches' in window) {
      caches.keys().then(async (cacheNames) => {
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }
        
        setCacheSize(totalSize);
      });
    }
  }, []);

  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCacheSize(0);
    }
  }, []);

  return {
    cacheSize: Math.round(cacheSize / 1024 / 1024 * 100) / 100, // MB
    clearCache,
  };
}