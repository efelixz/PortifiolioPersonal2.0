import { useEffect, useState } from 'react';

// Hook para monitorar performance
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loading: true,
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0, // First Input Delay
  });

  useEffect(() => {
    // Monitorar Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: prev.cls + layoutShiftEntry.value }));
          }
        }
        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as any;
          setMetrics(prev => ({ ...prev, fid: firstInputEntry.processingStart - entry.startTime }));
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (e) {
      // Fallback para navegadores que não suportam todas as métricas
      console.warn('Performance Observer não suportado completamente');
    }

    // Marcar como carregado
    const timer = setTimeout(() => {
      setMetrics(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return metrics;
};

// Hook para detectar conexão lenta
export const useConnectionSpeed = () => {
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === '4g') {
        setConnectionSpeed('fast');
      } else if (effectiveType === '3g' || effectiveType === '2g') {
        setConnectionSpeed('slow');
      }
    }
  }, []);

  return connectionSpeed;
};

// Hook para preload crítico
export const useCriticalResourcePreload = () => {
  useEffect(() => {
    // Preload fontes críticas
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });

    // Preload imagens críticas (above the fold)
    const criticalImages = [
      '/placeholder.svg', // Avatar ou hero image
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);
};

// Componente de loading inteligente
export const SmartLoader = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const connectionSpeed = useConnectionSpeed();

  useEffect(() => {
    const delay = connectionSpeed === 'slow' ? 500 : 200;
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [connectionSpeed]);

  if (!isLoaded) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
          <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-indigo-500/10"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};