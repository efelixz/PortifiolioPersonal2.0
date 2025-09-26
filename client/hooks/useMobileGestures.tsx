import { useState, useEffect, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface SwipeGesture {
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
  velocity: number;
  duration: number;
}

interface GestureOptions {
  threshold?: number; // Distância mínima para reconhecer gesto
  velocity?: number; // Velocidade mínima
  preventScroll?: boolean;
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
}

export function useGestures(elementRef: React.RefObject<HTMLElement>, options: GestureOptions = {}) {
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    threshold = 50,
    velocity = 0.3,
    preventScroll = false,
    onSwipe,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress
  } = options;

  // Detectar tipo de dispositivo
  const isMobile = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Adicionar haptic feedback se disponível
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Calcular distância entre dois pontos
  const calculateDistance = useCallback((point1: TouchPoint, point2: TouchPoint) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }, []);

  // Calcular direção do swipe
  const calculateDirection = useCallback((start: TouchPoint, end: TouchPoint): 'up' | 'down' | 'left' | 'right' => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // Handler para início do toque
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile()) return;

    const touch = e.touches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouchStart(point);
    setIsGestureActive(true);

    if (preventScroll) {
      e.preventDefault();
    }

    // Configurar timer para long press
    if (onLongPress) {
      const timer = setTimeout(() => {
        hapticFeedback('medium');
        onLongPress(point);
      }, 500);
      setLongPressTimer(timer);
    }
  }, [isMobile, preventScroll, onLongPress, hapticFeedback]);

  // Handler para movimento do toque
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isGestureActive || !touchStart) return;

    // Cancelar long press se o dedo se mover
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = calculateDistance(
        { x: touch1.clientX, y: touch1.clientY, timestamp: 0 },
        { x: touch2.clientX, y: touch2.clientY, timestamp: 0 }
      );

      const center = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };

      // Calcular escala baseada na distância inicial (seria necessário armazenar)
      // Por simplicidade, usamos a distância atual
      const scale = distance / 100; // Ajustar conforme necessário
      onPinch(scale, center);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  }, [isGestureActive, touchStart, longPressTimer, onPinch, calculateDistance, preventScroll]);

  // Handler para fim do toque
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart || !isGestureActive) return;

    const touch = e.changedTouches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouchEnd(point);
    setIsGestureActive(false);

    // Limpar timer de long press
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const distance = calculateDistance(touchStart, point);
    const duration = point.timestamp - touchStart.timestamp;
    const gestureVelocity = distance / duration;

    // Detectar tap vs swipe
    if (distance < threshold && duration < 200) {
      // É um tap
      const now = Date.now();
      const timeDiff = now - lastTap;

      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap
        if (onDoubleTap) {
          hapticFeedback('light');
          onDoubleTap(point);
        }
      } else {
        // Single tap
        if (onTap) {
          onTap(point);
        }
      }
      setLastTap(now);
    } else if (distance >= threshold && gestureVelocity >= velocity) {
      // É um swipe
      if (onSwipe) {
        const direction = calculateDirection(touchStart, point);
        hapticFeedback('light');
        onSwipe({
          direction,
          distance,
          velocity: gestureVelocity,
          duration
        });
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [
    touchStart, 
    isGestureActive, 
    longPressTimer, 
    calculateDistance, 
    threshold, 
    velocity, 
    calculateDirection, 
    onSwipe, 
    onTap, 
    onDoubleTap, 
    lastTap, 
    hapticFeedback
  ]);

  // Configurar event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isMobile()) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, isMobile, handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]);

  return {
    isGestureActive,
    isMobile: isMobile(),
    hapticFeedback,
    touchStart,
    touchEnd
  };
}

// Hook para detectar orientação do dispositivo
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      
      if ('screen' in window && 'orientation' in screen) {
        setAngle(screen.orientation.angle);
      }
    };

    updateOrientation();
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return { orientation, angle };
}

// Hook para performance em dispositivos móveis
export function useMobilePerformance() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    // Detectar dispositivos low-end
    const navigator = window.navigator as any;
    
    if ('deviceMemory' in navigator) {
      setIsLowEnd(navigator.deviceMemory < 4); // Menos de 4GB RAM
    }

    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection.effectiveType || 'unknown');
      setSaveData(connection.saveData || false);
    }
  }, []);

  const shouldReduceMotion = isLowEnd || saveData || 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldReduceImages = isLowEnd || saveData || 
    connectionType === 'slow-2g' || connectionType === '2g';

  return {
    isLowEnd,
    connectionType,
    saveData,
    shouldReduceMotion,
    shouldReduceImages
  };
}