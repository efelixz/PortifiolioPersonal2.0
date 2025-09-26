import { useEffect, useState, useCallback, createContext, useContext } from 'react';

// Tipos para o sistema de temas
export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  preferredTheme: string;
  autoMode: boolean;
  systemPreference: boolean;
  animations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'comfortable';
}

// Temas predefinidos
export const THEMES: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#fbbf24',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa'
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#ec4899',
    background: '#faf5ff',
    surface: '#f3e8ff',
    text: '#581c87',
    textSecondary: '#7c3aed',
    border: '#e9d5ff',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    shadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#8b5cf6'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#84cc16',
    background: '#f0f9ff',
    surface: '#e0f2fe',
    text: '#0c4a6e',
    textSecondary: '#0369a1',
    border: '#bae6fd',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    shadow: '0 4px 6px -1px rgba(14, 165, 233, 0.1)',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#0ea5e9'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#eab308',
    background: '#fffbeb',
    surface: '#fef3c7',
    text: '#9a3412',
    textSecondary: '#ea580c',
    border: '#fed7aa',
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    shadow: '0 4px 6px -1px rgba(249, 115, 22, 0.1)',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#f97316'
  }
};

const DEFAULT_CONFIG: ThemeConfig = {
  preferredTheme: 'light',
  autoMode: true,
  systemPreference: true,
  animations: true,
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  spacing: 'normal'
};

// Context
interface ThemeContextType {
  currentTheme: Theme;
  config: ThemeConfig;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;
  resetToDefaults: () => void;
  isDarkMode: boolean;
  isSystemDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook principal
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

// Provider do tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('theme-config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [isSystemDark, setIsSystemDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detectar preferência por motion reduzido
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches && !config.reducedMotion) {
      setConfig(prev => ({ ...prev, reducedMotion: true }));
    }
  }, [config.reducedMotion]);

  // Determinar tema atual
  const currentTheme = (() => {
    let themeId = config.preferredTheme;

    if (config.systemPreference && config.autoMode) {
      themeId = isSystemDark ? 'dark' : 'light';
    }

    return THEMES[themeId] || THEMES.light;
  })();

  const isDarkMode = currentTheme.id === 'dark' || 
    (config.systemPreference && isSystemDark);

  // Aplicar tema ao DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar cores do tema
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'name') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Aplicar configurações de acessibilidade
    root.style.setProperty('--font-size-base', 
      config.fontSize === 'small' ? '14px' :
      config.fontSize === 'large' ? '18px' : '16px'
    );

    root.style.setProperty('--spacing-unit',
      config.spacing === 'compact' ? '4px' :
      config.spacing === 'comfortable' ? '8px' : '6px'
    );

    // Aplicar classe para motion reduzido
    if (config.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Aplicar classe para alto contraste
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Aplicar classe para animações
    if (config.animations) {
      root.classList.add('animations-enabled');
    } else {
      root.classList.remove('animations-enabled');
    }

    // Meta theme-color para mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme.primary);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = currentTheme.primary;
      document.head.appendChild(meta);
    }

  }, [currentTheme, config]);

  // Salvar configuração
  useEffect(() => {
    try {
      localStorage.setItem('theme-config', JSON.stringify(config));
    } catch (error) {
      console.warn('Não foi possível salvar configuração do tema:', error);
    }
  }, [config]);

  const setTheme = useCallback((themeId: string) => {
    if (THEMES[themeId]) {
      setConfig(prev => ({ 
        ...prev, 
        preferredTheme: themeId,
        systemPreference: false 
      }));
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    config,
    availableThemes: Object.values(THEMES),
    setTheme,
    updateConfig,
    resetToDefaults,
    isDarkMode,
    isSystemDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para animações baseadas no tema
export function useThemeAnimations() {
  const { config } = useTheme();

  const getAnimationProps = useCallback((baseProps: any) => {
    if (!config.animations || config.reducedMotion) {
      return {
        ...baseProps,
        animate: false,
        transition: { duration: 0 }
      };
    }
    return baseProps;
  }, [config.animations, config.reducedMotion]);

  return { getAnimationProps, shouldAnimate: config.animations && !config.reducedMotion };
}

// Hook para preferências de acessibilidade
export function useAccessibilityPreferences() {
  const { config, updateConfig } = useTheme();

  const toggleHighContrast = useCallback(() => {
    updateConfig({ highContrast: !config.highContrast });
  }, [config.highContrast, updateConfig]);

  const toggleReducedMotion = useCallback(() => {
    updateConfig({ reducedMotion: !config.reducedMotion });
  }, [config.reducedMotion, updateConfig]);

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    updateConfig({ fontSize: size });
  }, [updateConfig]);

  const setSpacing = useCallback((spacing: 'compact' | 'normal' | 'comfortable') => {
    updateConfig({ spacing });
  }, [updateConfig]);

  return {
    highContrast: config.highContrast,
    reducedMotion: config.reducedMotion,
    fontSize: config.fontSize,
    spacing: config.spacing,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
    setSpacing
  };
}