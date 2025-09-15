import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
      
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1 
              className="text-9xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              404
            </motion.h1>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Página não encontrada
          </h2>
          
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao início
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Página anterior
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}