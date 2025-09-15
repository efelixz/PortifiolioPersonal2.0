import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${
              type === "success"
                ? "border-green-200 bg-green-50/90 dark:border-green-800 dark:bg-green-950/90"
                : "border-red-200 bg-red-50/90 dark:border-red-800 dark:bg-red-950/90"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    type === "success"
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {message}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`flex-shrink-0 rounded-md p-1 transition-colors ${
                  type === "success"
                    ? "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900"
                    : "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                }`}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}