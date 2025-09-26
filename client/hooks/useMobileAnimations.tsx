import { useState, useEffect, useCallback, useRef } from 'react';
import { useMobilePerformance } from './useMobileGestures';

interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

interface SpringConfig {
  tension?: number;
  friction?: number;
  mass?: number;
}

interface IntersectionConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Hook para animações de entrada otimizadas
export function useIntersectionAnimation(config: IntersectionConfig = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const { shouldReduceMotion } = useMobilePerformance();

  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = config;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Se motion reduzido está ativo, mostrar imediatamente
    if (shouldReduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, shouldReduceMotion]);

  return { elementRef, isVisible };
}

// Hook para animações de scroll parallax otimizadas
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const { shouldReduceMotion } = useMobilePerformance();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let ticking = false;

    const updateOffset = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      setOffset(rate);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateOffset);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateOffset();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, shouldReduceMotion]);

  return { elementRef, offset: shouldReduceMotion ? 0 : offset };
}

// Hook para animações de hover/focus otimizadas para mobile
export function useMobileInteraction() {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Usar pointer events para melhor suporte mobile
    const handlePointerDown = () => setIsActive(true);
    const handlePointerUp = () => setIsActive(false);
    const handlePointerEnter = () => setIsHovered(true);
    const handlePointerLeave = () => {
      setIsHovered(false);
      setIsActive(false);
    };
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointerenter', handlePointerEnter);
    element.addEventListener('pointerleave', handlePointerLeave);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointerleave', handlePointerLeave);
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { 
    elementRef, 
    isActive, 
    isHovered, 
    isFocused,
    isInteracting: isActive || isHovered || isFocused
  };
}

// Hook para animações de loading otimizadas
export function useLoadingAnimation(isLoading: boolean) {
  const [progress, setProgress] = useState(0);
  const { shouldReduceMotion } = useMobilePerformance();

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }

    if (shouldReduceMotion) {
      setProgress(isLoading ? 50 : 100);
      return;
    }

    let animationFrame: number;
    const startTime = Date.now();
    const duration = 2000; // 2 segundos

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 95); // Máximo 95% até concluir
      
      setProgress(progress);

      if (progress < 95) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, shouldReduceMotion]);

  return { progress };
}

// Hook para micro-interactions com feedback tátil
export function useMicroInteraction() {
  const { shouldReduceMotion } = useMobilePerformance();

  const triggerInteraction = useCallback((type: 'tap' | 'success' | 'error' | 'warning' = 'tap') => {
    if (shouldReduceMotion) return;

    // Haptic feedback
    if ('vibrate' in navigator) {
      const patterns = {
        tap: [5],
        success: [10, 50, 10],
        error: [20, 30, 20],
        warning: [15]
      };
      navigator.vibrate(patterns[type]);
    }

    // Visual feedback através de CSS custom properties
    document.documentElement.style.setProperty('--interaction-timestamp', Date.now().toString());
  }, [shouldReduceMotion]);

  return { triggerInteraction };
}

// Hook para otimização de performance em listas móveis
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set scrolling to false after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    isScrolling,
    handleScroll
  };
}

// Configurações de animação baseadas na performance do dispositivo
export function useAdaptiveAnimations() {
  const { shouldReduceMotion, isLowEnd } = useMobilePerformance();

  const getAnimationConfig = useCallback((baseConfig: AnimationConfig): AnimationConfig => {
    if (shouldReduceMotion) {
      return {
        ...baseConfig,
        duration: 0,
        delay: 0
      };
    }

    if (isLowEnd) {
      return {
        ...baseConfig,
        duration: (baseConfig.duration || 300) * 0.7, // 30% mais rápida
        easing: 'ease-out' // Easing mais simples
      };
    }

    return baseConfig;
  }, [shouldReduceMotion, isLowEnd]);

  const getSpringConfig = useCallback((baseConfig: SpringConfig): SpringConfig => {
    if (shouldReduceMotion) {
      return { tension: 300, friction: 30, mass: 1 };
    }

    if (isLowEnd) {
      return {
        tension: (baseConfig.tension || 170) * 1.5,
        friction: (baseConfig.friction || 26) * 1.2,
        mass: baseConfig.mass || 1
      };
    }

    return baseConfig;
  }, [shouldReduceMotion, isLowEnd]);

  return { getAnimationConfig, getSpringConfig, shouldReduceMotion, isLowEnd };
}