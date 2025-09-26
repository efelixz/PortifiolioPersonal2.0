import { Download, Smartphone, Check, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';

export default function PWAStatus() {
  const { isInstallable, isInstalled, isOffline, installPWA, canInstall } = usePWA();

  const handleInstall = async () => {
    const success = await installPWA();
    if (!success) {
      console.log('Installation cancelled or failed');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2">
      {/* Status de conexão */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-red-400/50 shadow-lg"
          >
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Offline</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de instalação */}
      <AnimatePresence>
        {canInstall && (
          <motion.button
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            onClick={handleInstall}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-white/20 backdrop-blur-sm"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Smartphone className="h-5 w-5" />
            <div className="text-left">
              <div className="text-sm font-semibold">Instalar App</div>
              <div className="text-xs opacity-90">Acesso rápido</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Status de instalado */}
      <AnimatePresence>
        {isInstalled && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-green-400/50 shadow-lg"
          >
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">App Instalado</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente para o header (versão menor)
export function PWAInstallButton() {
  const { canInstall, installPWA } = usePWA();

  if (!canInstall) return null;

  const handleInstall = async () => {
    await installPWA();
  };

  return (
    <motion.button
      onClick={handleInstall}
      className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }} // Aparecer após 2s
    >
      <Download className="h-4 w-4" />
      Instalar
    </motion.button>
  );
}