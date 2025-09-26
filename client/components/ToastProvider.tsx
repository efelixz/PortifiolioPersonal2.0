import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { NotificationToast } from './NotificationCenter';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastNotification, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts(prev => {
      const newToasts = [newToast, ...prev];
      // Limitar número máximo de toasts
      return newToasts.slice(0, maxToasts);
    });

    // Auto-remove toast após a duração especificada
    if (!toast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className={`fixed z-[9999] pointer-events-none ${getPositionClasses()}`}>
          <div className="flex flex-col gap-2 pointer-events-auto">
            <AnimatePresence mode="popLayout">
              {toasts.map((toast, index) => (
                <motion.div
                  key={toast.id}
                  layout
                  initial={{ opacity: 0, y: position.includes('top') ? -50 : 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: position.includes('top') ? -50 : 50, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ zIndex: 9999 - index }}
                >
                  <NotificationToast
                    notification={toast}
                    onClose={() => hideToast(toast.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// Hook para facilitar o uso de toasts comuns
export function useQuickToast() {
  const { showToast } = useToast();

  return {
    success: (title: string, message?: string) =>
      showToast({
        type: 'success',
        title,
        message: message || '',
      }),
    
    error: (title: string, message?: string) =>
      showToast({
        type: 'error',
        title,
        message: message || '',
        duration: 7000, // Erros ficam mais tempo
      }),
    
    warning: (title: string, message?: string) =>
      showToast({
        type: 'warning',
        title,
        message: message || '',
      }),
    
    info: (title: string, message?: string) =>
      showToast({
        type: 'info',
        title,
        message: message || '',
      }),
    
    achievement: (title: string, message?: string) =>
      showToast({
        type: 'achievement',
        title,
        message: message || '',
        duration: 8000, // Conquistas ficam mais tempo
      }),
    
    loading: (title: string, message?: string) =>
      showToast({
        type: 'info',
        title,
        message: message || '',
        persistent: true, // Não remove automaticamente
      }),
    
    custom: showToast,
  };
}