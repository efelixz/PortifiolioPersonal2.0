import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

interface PDFProgressProps {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  onClose?: () => void;
}

export default function PDFProgress({ 
  isGenerating, 
  progress, 
  error, 
  onClose 
}: PDFProgressProps) {
  if (!isGenerating && !error && progress === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-background border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {error ? (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Erro na Geração
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Fechar
              </button>
            </>
          ) : progress === 100 ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                PDF Gerado com Sucesso!
              </h3>
              <p className="text-sm text-muted-foreground">
                O download deve começar automaticamente.
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <FileText className="h-12 w-12 text-primary mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Gerando PDF...
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Preparando o documento para download
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress}% concluído
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}