import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { usePWA } from './usePWA';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'reminder';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
  icon?: string;
  timestamp: number;
  read: boolean;
  category?: 'system' | 'user' | 'app' | 'marketing';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  enablePush: boolean;
  enableInApp: boolean;
  enableSound: boolean;
  categories: {
    system: boolean;
    user: boolean;
    app: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  maxNotifications: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  scheduleNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>, delay: number) => string;
  scheduleRecurringNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>, interval: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_SETTINGS: NotificationSettings = {
  enablePush: true,
  enableInApp: true,
  enableSound: true,
  categories: {
    system: true,
    user: true,
    app: true,
    marketing: false
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  maxNotifications: 50
};

const STORAGE_KEY = 'portfolio_notifications';
const SETTINGS_KEY = 'portfolio_notification_settings';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const { sendNotification: sendPWANotification, capabilities } = usePWA();

  // Carregar dados do localStorage
  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  // Salvar notificações quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Limpar notificações antigas (mais de 30 dias)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recent = parsed.filter((n: Notification) => n.timestamp > thirtyDaysAgo);
        setNotifications(recent);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const generateId = () => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const isQuietTime = (): boolean => {
    if (!settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours crosses midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  const shouldShowNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): boolean => {
    // Verificar se a categoria está habilitada
    if (notification.category && !settings.categories[notification.category]) {
      return false;
    }

    // Verificar quiet hours para notificações não urgentes
    if (notification.priority !== 'urgent' && isQuietTime()) {
      return false;
    }

    return true;
  };

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): string => {
    const id = generateId();
    
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: Date.now(),
      read: false,
      category: notificationData.category || 'app',
      priority: notificationData.priority || 'medium'
    };

    // Verificar se deve mostrar a notificação
    if (!shouldShowNotification(notificationData)) {
      console.log('Notificação suprimida pelas configurações:', notification);
      return id;
    }

    setNotifications(prev => {
      const updated = [notification, ...prev];
      
      // Limitar número máximo de notificações
      if (updated.length > settings.maxNotifications) {
        return updated.slice(0, settings.maxNotifications);
      }
      
      return updated;
    });

    // Enviar push notification se habilitado
    if (settings.enablePush && capabilities.hasNotifications) {
      sendPWANotification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        tag: notification.id,
        data: {
          notificationId: notification.id,
          category: notification.category,
          timestamp: notification.timestamp
        }
      });
    }

    // Som de notificação
    if (settings.enableSound) {
      playNotificationSound(notification.type);
    }

    // Auto-remove para notificações não persistentes
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, [settings, capabilities, sendPWANotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const scheduleNotification = useCallback((
    notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    delay: number
  ): string => {
    const id = generateId();
    
    setTimeout(() => {
      addNotification(notificationData);
    }, delay);

    return id;
  }, [addNotification]);

  const scheduleRecurringNotification = useCallback((
    notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    interval: number
  ): string => {
    const id = generateId();
    
    const intervalId = setInterval(() => {
      addNotification(notificationData);
    }, interval);

    // Salvar interval ID para poder cancelar depois
    const storageKey = `recurring_notification_${id}`;
    localStorage.setItem(storageKey, intervalId.toString());

    return id;
  }, [addNotification]);

  const playNotificationSound = (type: Notification['type']) => {
    if (!settings.enableSound) return;

    try {
      const audio = new Audio();
      
      switch (type) {
        case 'success':
        case 'achievement':
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcATuT2O/MdyMFL3vN8cuPOAYYaLnt4p5REAnP9o1'
          break;
        case 'error':
        case 'warning':
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcATuT2O/MdyMFL3vN8cuPOAYYaLnt4p5REAlA...'
          break;
        default:
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcATuT2O/MdyMFL3vN8cuPOAYYaLnt4p5REAn...'
      }
      
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors (user might have disabled autoplay)
      });
    } catch (error) {
      console.warn('Não foi possível reproduzir som de notificação:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    updateSettings,
    scheduleNotification,
    scheduleRecurringNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Hook para notificações pré-definidas
export function useNotificationTemplates() {
  const { addNotification, scheduleNotification } = useNotifications();

  const showSuccessNotification = (message: string, title = 'Sucesso!') => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      category: 'user',
      priority: 'medium'
    });
  };

  const showErrorNotification = (message: string, title = 'Erro!') => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true,
      category: 'system',
      priority: 'high'
    });
  };

  const showWarningNotification = (message: string, title = 'Atenção!') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 8000,
      category: 'user',
      priority: 'medium'
    });
  };

  const showInfoNotification = (message: string, title = 'Informação') => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 6000,
      category: 'app',
      priority: 'low'
    });
  };

  const showAchievementNotification = (message: string, title = 'Conquista!') => {
    return addNotification({
      type: 'achievement',
      title,
      message,
      duration: 10000,
      category: 'user',
      priority: 'medium',
      icon: '🏆'
    });
  };

  const scheduleStudyReminder = (message: string, delay: number) => {
    return scheduleNotification({
      type: 'reminder',
      title: 'Lembrete de Estudo',
      message,
      category: 'user',
      priority: 'medium',
      icon: '📚'
    }, delay);
  };

  const showProgressNotification = (progress: number, total: number, task: string) => {
    const percentage = Math.round((progress / total) * 100);
    return addNotification({
      type: 'info',
      title: 'Progresso',
      message: `${task}: ${progress}/${total} (${percentage}%)`,
      duration: 3000,
      category: 'app',
      priority: 'low'
    });
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    showAchievementNotification,
    scheduleStudyReminder,
    showProgressNotification
  };
}