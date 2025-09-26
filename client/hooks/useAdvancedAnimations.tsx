import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Tipos para animações
interface AnimationPreset {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
}

interface ParticleConfig {
  count: number;
  color: string;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  lifetime: number;
  gravity?: boolean;
  trail?: boolean;
}

interface AnimationSettings {
  reducedMotion: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  animationSpeed: number;
  enableParticles: boolean;
  enableTransitions: boolean;
}

// Presets de animação
export const animationPresets: Record<string, AnimationPreset> = {
  // Entradas
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  
  slideInUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  
  slideInDown: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
  
  rotateIn: {
    initial: { rotate: -180, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 150, damping: 20 }
  },
  
  // Hover/Interação
  float: {
    initial: { y: 0 },
    animate: { 
      y: [-5, 5, -5],
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      }
    }
  },
  
  pulse: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut" 
      }
    }
  },
  
  glow: {
    initial: { boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
    animate: { 
      boxShadow: [
        "0 0 0 rgba(59, 130, 246, 0)",
        "0 0 20px rgba(59, 130, 246, 0.5)",
        "0 0 0 rgba(59, 130, 246, 0)"
      ],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut" 
      }
    }
  },
  
  // Textos
  typewriter: {
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 2, ease: "steps(40)" }
  },
  
  staggerText: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  
  // Especiais
  morphing: {
    initial: { borderRadius: "0%" },
    animate: { 
      borderRadius: ["0%", "50%", "25%", "0%"],
      transition: { 
        repeat: Infinity, 
        duration: 4,
        ease: "easeInOut" 
      }
    }
  },
  
  liquidMove: {
    initial: { 
      clipPath: "circle(0% at 50% 50%)" 
    },
    animate: { 
      clipPath: "circle(150% at 50% 50%)" 
    },
    transition: { duration: 1.5, ease: "easeOut" }
  }
};

// Hook principal para animações avançadas
export function useAdvancedAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>({
    reducedMotion: false,
    particleQuality: 'medium',
    animationSpeed: 1,
    enableParticles: true,
    enableTransitions: true
  });

  // Detectar preferência de movimento reduzido
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));

    const handler = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Ajustar animação baseado nas configurações
  const getAdjustedAnimation = useCallback((preset: string) => {
    const animation = animationPresets[preset];
    if (!animation) return animationPresets.fadeIn;

    if (settings.reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
    }

    // Ajustar velocidade
    const adjustedTransition = {
      ...animation.transition,
      duration: (animation.transition?.duration || 0.6) / settings.animationSpeed
    };

    return {
      ...animation,
      transition: adjustedTransition
    };
  }, [settings]);

  // Criar animação personalizada
  const createCustomAnimation = useCallback((config: Partial<AnimationPreset>) => {
    return {
      initial: { opacity: 0, ...config.initial },
      animate: { opacity: 1, ...config.animate },
      transition: { duration: 0.6, ...config.transition },
      ...config
    };
  }, []);

  return {
    settings,
    setSettings,
    getAdjustedAnimation,
    createCustomAnimation,
    presets: Object.keys(animationPresets)
  };
}

// Hook para animação de scroll
export function useScrollAnimation(preset: string = 'fadeIn', threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();
  const { getAdjustedAnimation } = useAdvancedAnimations();

  useEffect(() => {
    const animation = getAdjustedAnimation(preset);
    
    if (isInView) {
      controls.start(animation.animate);
    }
  }, [isInView, controls, preset, getAdjustedAnimation]);

  const animation = getAdjustedAnimation(preset);

  return {
    ref,
    isInView,
    initial: animation.initial,
    animate: controls,
    transition: animation.transition
  };
}

// Componente de animação inteligente
interface SmartAnimatedProps {
  children: React.ReactNode;
  preset?: string;
  delay?: number;
  threshold?: number;
  className?: string;
  onClick?: () => void;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
}

export function SmartAnimated({
  children,
  preset = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  className = '',
  onClick,
  whileHover,
  whileTap,
  ...props
}: SmartAnimatedProps) {
  const { ref, isInView, initial, animate, transition } = useScrollAnimation(preset, threshold);

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ ...transition, delay }}
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Sistema de partículas
export function useParticleSystem(config: ParticleConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
  }>>([]);
  const animationId = useRef<number>();

  const createParticle = useCallback((x: number, y: number) => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
      vy: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
      life: config.lifetime,
      maxLife: config.lifetime,
      size: Math.random() * (config.size.max - config.size.min) + config.size.min,
      color: config.color
    };
  }, [config]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar partículas
    particles.current = particles.current.filter(particle => {
      particle.life--;
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (config.gravity) {
        particle.vy += 0.1;
      }

      // Desenhar partícula
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      return particle.life > 0;
    });

    animationId.current = requestAnimationFrame(animate);
  }, [config]);

  const emit = useCallback((x: number, y: number, count?: number) => {
    const particleCount = count || config.count;
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(createParticle(x, y));
    }
  }, [config.count, createParticle]);

  const start = useCallback(() => {
    animate();
  }, [animate]);

  const stop = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    canvasRef,
    emit,
    start,
    stop
  };
}

// Componente de partículas
interface ParticleCanvasProps {
  config: ParticleConfig;
  trigger?: 'click' | 'hover' | 'auto';
  className?: string;
}

export function ParticleCanvas({ config, trigger = 'click', className = '' }: ParticleCanvasProps) {
  const { canvasRef, emit, start, stop } = useParticleSystem(config);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger === 'auto') {
      start();
      const interval = setInterval(() => {
        emit(
          Math.random() * (canvasRef.current?.width || 400),
          Math.random() * (canvasRef.current?.height || 300)
        );
      }, 100);

      return () => {
        clearInterval(interval);
        stop();
      };
    }
  }, [trigger, start, stop, emit]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (trigger === 'click' || trigger === 'hover') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        emit(x, y);
        
        if (!isActive) {
          setIsActive(true);
          start();
          setTimeout(() => {
            setIsActive(false);
            stop();
          }, 3000);
        }
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className={`absolute inset-0 pointer-events-none ${className}`}
      onClick={trigger === 'click' ? handleInteraction : undefined}
      onMouseEnter={trigger === 'hover' ? handleInteraction : undefined}
    />
  );
}

// Componente de texto animado
interface AnimatedTextProps {
  text: string;
  animation?: 'typewriter' | 'stagger' | 'wave' | 'glitch';
  speed?: number;
  className?: string;
}

export function AnimatedText({ text, animation = 'stagger', speed = 50, className = '' }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (animation === 'typewriter') {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
      }
    } else {
      setDisplayText(text);
    }
  }, [text, currentIndex, animation, speed]);

  if (animation === 'stagger') {
    return (
      <div className={className}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animation === 'wave') {
    return (
      <div className={className}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animation === 'glitch') {
    return (
      <motion.div
        className={className}
        animate={{
          x: [0, -2, 2, 0],
          textShadow: [
            "0 0 0 transparent",
            "2px 0 0 #ff0000, -2px 0 0 #00ff00",
            "0 0 0 transparent"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: text.length * speed / 1000, ease: "easeInOut" }}
      style={{ 
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRight: '2px solid currentColor'
      }}
    >
      {displayText}
    </motion.div>
  );
}

// Painel de controle das animações
export function AnimationControlPanel() {
  const { settings, setSettings, presets } = useAdvancedAnimations();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <h3 className="font-semibold mb-3">Controles de Animação</h3>
      
      <div className="space-y-3">
        {/* Movimento reduzido */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => setSettings(prev => ({ ...prev, reducedMotion: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm">Movimento Reduzido</span>
        </label>

        {/* Qualidade das partículas */}
        <div>
          <label className="block text-sm font-medium mb-1">Qualidade das Partículas</label>
          <select
            value={settings.particleQuality}
            onChange={(e) => setSettings(prev => ({ ...prev, particleQuality: e.target.value as any }))}
            className="w-full text-sm bg-gray-100 dark:bg-gray-700 border rounded px-2 py-1"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        {/* Velocidade */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Velocidade: {settings.animationSpeed}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={settings.animationSpeed}
            onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: parseFloat(e.target.value) }))}
            className="w-full"
          />
        </div>

        {/* Ativar partículas */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.enableParticles}
            onChange={(e) => setSettings(prev => ({ ...prev, enableParticles: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm">Ativar Partículas</span>
        </label>

        {/* Ativar transições */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.enableTransitions}
            onChange={(e) => setSettings(prev => ({ ...prev, enableTransitions: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm">Ativar Transições</span>
        </label>
      </div>

      {/* Lista de presets */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Presets Disponíveis:</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {presets.map(preset => (
            <div key={preset} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {preset}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Hook para efeitos de hover avançados
export function useAdvancedHover() {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  const magneticEffect = {
    x: isHovered ? Math.random() * 10 - 5 : 0,
    y: isHovered ? Math.random() * 10 - 5 : 0,
    scale: isHovered ? 1.05 : 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  };

  const glowEffect = {
    boxShadow: isHovered 
      ? "0 0 25px rgba(59, 130, 246, 0.6)" 
      : "0 0 0 rgba(59, 130, 246, 0)",
    transition: { duration: 0.3 }
  };

  const rotateEffect = {
    rotate: isHovered ? [0, -5, 5, 0] : 0,
    transition: { duration: 0.3 }
  };

  return {
    isHovered,
    hoverProps,
    magneticEffect,
    glowEffect,
    rotateEffect
  };
}

export default {
  useAdvancedAnimations,
  useScrollAnimation,
  SmartAnimated,
  useParticleSystem,
  ParticleCanvas,
  AnimatedText,
  AnimationControlPanel,
  useAdvancedHover,
  animationPresets
};