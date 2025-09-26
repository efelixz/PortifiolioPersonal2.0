import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, useAccessibilityPreferences, Theme } from '../hooks/useTheme2';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ThemeSelector({ isOpen, onClose, className = '' }: ThemeSelectorProps) {
  const { 
    currentTheme, 
    config, 
    availableThemes, 
    setTheme, 
    updateConfig,
    isDarkMode,
    isSystemDark 
  } = useTheme();

  const {
    highContrast,
    reducedMotion,
    fontSize,
    spacing,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
    setSpacing
  } = useAccessibilityPreferences();

  const [activeTab, setActiveTab] = useState<'themes' | 'settings'>('themes');

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };

  const handleSystemPreferenceToggle = () => {
    updateConfig({ 
      systemPreference: !config.systemPreference,
      autoMode: !config.systemPreference ? config.autoMode : false
    });
  };

  const handleAutoModeToggle = () => {
    updateConfig({ autoMode: !config.autoMode });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${className}`}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personalização
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mt-4 space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('themes')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'themes'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Temas
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Configurações
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'themes' && (
                <div className="space-y-6">
                  {/* System Preference */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Preferências do Sistema
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Seguir sistema
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Usar tema do sistema operacional {isSystemDark ? '(escuro)' : '(claro)'}
                        </p>
                      </div>
                      <button
                        onClick={handleSystemPreferenceToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.systemPreference ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.systemPreference ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {config.systemPreference && (
                      <div className="flex items-center justify-between pl-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Modo automático
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Alternar automaticamente entre claro/escuro
                          </p>
                        </div>
                        <button
                          onClick={handleAutoModeToggle}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.autoMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.autoMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Theme Grid */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Escolher Tema
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {availableThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          isSelected={currentTheme.id === theme.id}
                          onClick={() => handleThemeSelect(theme.id)}
                          disabled={config.systemPreference && config.autoMode}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Accessibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Acessibilidade
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alto contraste
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Aumentar contraste para melhor legibilidade
                          </p>
                        </div>
                        <button
                          onClick={toggleHighContrast}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              highContrast ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reduzir movimento
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Diminuir animações e transições
                          </p>
                        </div>
                        <button
                          onClick={toggleReducedMotion}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              reducedMotion ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Tamanho da Fonte
                    </h3>
                    
                    <div className="flex space-x-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            fontSize === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size === 'small' ? 'Pequena' : size === 'medium' ? 'Média' : 'Grande'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Espaçamento
                    </h3>
                    
                    <div className="flex space-x-2">
                      {['compact', 'normal', 'comfortable'].map((space) => (
                        <button
                          key={space}
                          onClick={() => setSpacing(space as 'compact' | 'normal' | 'comfortable')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            spacing === space
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {space === 'compact' ? 'Compacto' : space === 'normal' ? 'Normal' : 'Confortável'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ThemeCard({ theme, isSelected, onClick, disabled }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="space-y-2">
        {/* Theme preview */}
        <div className="h-16 rounded-lg overflow-hidden border" style={{ backgroundColor: theme.background }}>
          <div className="flex h-full">
            <div className="flex-1" style={{ backgroundColor: theme.surface }} />
            <div className="w-8" style={{ backgroundColor: theme.primary }} />
            <div className="w-6" style={{ backgroundColor: theme.accent }} />
          </div>
        </div>

        {/* Theme name */}
        <div className="text-left">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {theme.name}
          </h4>
          <div className="flex space-x-1 mt-1">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: theme.primary }}
            />
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: theme.secondary }}
            />
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: theme.accent }}
            />
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}