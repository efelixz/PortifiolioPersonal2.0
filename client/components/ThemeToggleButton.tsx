import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme2';
import { ThemeSelector } from './ThemeSelector';

export function ThemeToggleButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, isDarkMode } = useTheme();

  const toggleOpen = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 flex items-center justify-center backdrop-blur-sm border transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          backgroundColor: `${currentTheme.surface}cc`,
          borderColor: currentTheme.border,
          color: currentTheme.text
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
            </svg>
          )}
        </motion.div>

        {/* Theme indicator dots */}
        <div className="absolute -top-1 -right-1 flex space-x-0.5">
          <div
            className="w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <div
            className="w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: currentTheme.accent }}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 whitespace-nowrap">
          Personalizar tema
        </div>
      </motion.button>

      {/* Quick theme toggle (mobile) */}
      <motion.div
        className="fixed bottom-6 right-20 flex flex-col space-y-2 z-30"
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          x: isOpen ? 0 : 100,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Quick Dark/Light Toggle */}
        <motion.button
          onClick={() => {
            // Quick toggle logic would go here
            handleClose();
          }}
          className="w-12 h-12 rounded-full shadow-md backdrop-blur-sm border flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: `${currentTheme.surface}ee`,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </motion.button>

        {/* Quick theme presets */}
        <div className="flex flex-col space-y-1">
          {['light', 'dark', 'purple', 'ocean'].map((themeId, index) => (
            <motion.button
              key={themeId}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: themeId === 'light' ? '#3b82f6' :
                                themeId === 'dark' ? '#1e293b' :
                                themeId === 'purple' ? '#8b5cf6' :
                                '#0ea5e9'
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : 50
              }}
              transition={{ 
                duration: 0.3,
                delay: isOpen ? index * 0.1 : 0
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Quick theme change logic would go here
                handleClose();
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Theme Selector Modal */}
      <ThemeSelector isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

export default ThemeToggleButton;