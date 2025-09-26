import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGestures, useDeviceOrientation } from '../hooks/useMobileGestures';
import { useAdaptiveAnimations, useMicroInteraction } from '../hooks/useMobileAnimations';

interface SwipeableCarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function SwipeableCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = false,
  className = ''
}: SwipeableCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getAnimationConfig } = useAdaptiveAnimations();
  const { triggerInteraction } = useMicroInteraction();
  const { orientation } = useDeviceOrientation();

  // Configurar gestos de swipe
  const { isMobile } = useGestures(containerRef, {
    onSwipe: (gesture) => {
      if (gesture.direction === 'left' && currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
        triggerInteraction('tap');
      } else if (gesture.direction === 'right' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        triggerInteraction('tap');
      }
    },
    threshold: 50,
    velocity: 0.3
  });

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      triggerInteraction('tap');
    } else if (info.offset.x < -threshold && currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      triggerInteraction('tap');
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    triggerInteraction('tap');
  };

  const nextSlide = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      triggerInteraction('tap');
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      triggerInteraction('tap');
    }
  };

  const animationConfig = getAnimationConfig({ duration: 300 });

  return (
    <div className={`relative overflow-hidden ${className}`} ref={containerRef}>
      {/* Main carousel container */}
      <div className="relative h-full">
        <motion.div
          className="flex h-full"
          style={{ width: `${items.length * 100}%` }}
          animate={{ x: `-${currentIndex * (100 / items.length)}%` }}
          transition={animationConfig}
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full"
              style={{ width: `${100 / items.length}%` }}
            >
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <motion.button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            disabled={currentIndex === items.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-white dark:bg-gray-200'
                  : 'bg-white/50 dark:bg-gray-400/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-white dark:bg-gray-200"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          transition={animationConfig}
        />
      </div>
    </div>
  );
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.3, 0.6, 0.9],
  className = ''
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(snapPoints[0]);
  const { getAnimationConfig } = useAdaptiveAnimations();
  const { triggerInteraction } = useMicroInteraction();

  const handleDragEnd = (event: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Se arrastar para baixo com velocidade suficiente, fechar
    if (velocity > 500 || offset > 150) {
      onClose();
      return;
    }

    // Encontrar o snap point mais próximo
    const windowHeight = window.innerHeight;
    const currentPosition = windowHeight * (1 - currentSnapPoint) + offset;
    
    let closestSnapPoint = snapPoints[0];
    let minDistance = Infinity;

    snapPoints.forEach(point => {
      const snapPosition = windowHeight * (1 - point);
      const distance = Math.abs(currentPosition - snapPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSnapPoint = point;
      }
    });

    setCurrentSnapPoint(closestSnapPoint);
    triggerInteraction('tap');
  };

  const animationConfig = getAnimationConfig({ duration: 300 });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={animationConfig}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: `${(1 - currentSnapPoint) * 100}%` }}
            exit={{ y: '100%' }}
            transition={animationConfig}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl shadow-2xl z-50 ${className}`}
            style={{ height: '100vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {children}
            </div>

            {/* Snap point indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {snapPoints.map((point, index) => (
                <motion.button
                  key={point}
                  onClick={() => {
                    setCurrentSnapPoint(point);
                    triggerInteraction('tap');
                  }}
                  className={`w-2 h-8 rounded-full transition-colors ${
                    point === currentSnapPoint
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getAnimationConfig } = useAdaptiveAnimations();
  const { triggerInteraction } = useMicroInteraction();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerInteraction('success');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setStartY(0);
  };

  const animationConfig = getAnimationConfig({ duration: 200 });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: Math.min(pullDistance, threshold),
          opacity: pullDistance > 20 ? 1 : 0
        }}
        transition={animationConfig}
      >
        <div className="flex items-center gap-2 py-2">
          <motion.div
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ 
              rotate: isRefreshing ? 360 : pullDistance > threshold ? 180 : 0 
            }}
            transition={{ 
              duration: isRefreshing ? 1 : 0.3,
              repeat: isRefreshing ? Infinity : 0,
              ease: 'linear'
            }}
          />
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {isRefreshing ? 'Atualizando...' : 
             pullDistance > threshold ? 'Solte para atualizar' : 
             'Puxe para atualizar'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        animate={{ y: Math.min(pullDistance * 0.5, threshold * 0.5) }}
        transition={animationConfig}
      >
        {children}
      </motion.div>
    </div>
  );
}