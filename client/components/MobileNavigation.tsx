import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  Menu, 
  X,
  ChevronUp,
  Search,
  Settings
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMobileInteraction, useAdaptiveAnimations } from '../hooks/useMobileAnimations';
import { useMicroInteraction } from '../hooks/useMobileAnimations';

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { getAnimationConfig } = useAdaptiveAnimations();
  const { triggerInteraction } = useMicroInteraction();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/sobre', icon: User, label: 'Sobre' },
    { path: '/projetos', icon: Briefcase, label: 'Projetos' },
    { path: '/contato', icon: Mail, label: 'Contato' }
  ];

  // Auto-hide tab bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsTabBarVisible(false);
      } else {
        setIsTabBarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    triggerInteraction('tap');
  };

  const animationConfig = getAnimationConfig({ duration: 300 });

  return (
    <>
      {/* Mobile Tab Bar */}
      <motion.nav
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}
        initial={{ y: 0 }}
        animate={{ y: isTabBarVisible ? 0 : '100%' }}
        transition={animationConfig}
      >
        <div className="flex items-center justify-around py-2 px-4 safe-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <MobileNavButton
                key={item.path}
                isActive={isActive}
                onClick={() => handleNavigation(item.path)}
                icon={<Icon className="w-5 h-5" />}
                label={item.label}
              />
            );
          })}
          
          {/* Menu Button */}
          <MobileNavButton
            isActive={isMenuOpen}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              triggerInteraction('tap');
            }}
            icon={<Menu className="w-5 h-5" />}
            label="Menu"
          />
        </div>
      </motion.nav>

      {/* Expanded Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={animationConfig}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={animationConfig}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-xl shadow-2xl max-h-[80vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-3 overflow-y-auto">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"
                  >
                    <Search className="w-5 h-5" />
                    <span className="text-sm font-medium">Buscar</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Config</span>
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <motion.button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="active-indicator"
                            className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Additional Options */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Configurações</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {!isTabBarVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={animationConfig}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              triggerInteraction('tap');
            }}
            className="fixed bottom-20 right-4 z-30 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

interface MobileNavButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function MobileNavButton({ isActive, onClick, icon, label }: MobileNavButtonProps) {
  const { elementRef, isInteracting } = useMobileInteraction();
  const { getAnimationConfig } = useAdaptiveAnimations();

  const animationConfig = getAnimationConfig({ duration: 200 });

  return (
    <motion.button
      ref={elementRef as any}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-0 flex-1 transition-colors ${
        isActive 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-400'
      }`}
      whileTap={{ scale: 0.95 }}
      transition={animationConfig}
    >
      <motion.div
        className={`relative ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
        animate={{ 
          scale: isInteracting ? 1.1 : 1,
          y: isActive ? -1 : 0
        }}
        transition={animationConfig}
      >
        {icon}
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="mobile-nav-indicator"
            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
            style={{ transform: 'translateX(-50%)' }}
          />
        )}
      </motion.div>
      
      <motion.span 
        className={`text-xs font-medium truncate max-w-full ${
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`}
        animate={{ 
          scale: isActive ? 1.05 : 1,
          fontWeight: isActive ? 600 : 500
        }}
        transition={animationConfig}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}