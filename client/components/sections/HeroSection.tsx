import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// CSS Avatar 3D Component
function Avatar3D() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Main Avatar Circle */}
      <motion.div
        className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 shadow-2xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Inner Glow */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Rings */}
      <motion.div
        className="absolute inset-0 border-2 border-purple-300/30 rounded-full"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.div
        className="absolute inset-8 border border-pink-300/40 rounded-full"
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
      />
    </div>
  );
}

// Typing Effect Hook
function useTypingEffect(texts: string[], speed = 100, deleteSpeed = 50, pause = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, speed, deleteSpeed, pause]);

  return displayText;
}

export default function HeroSection() {
  const stackTexts = [
    'React Developer',
    'TypeScript Expert',
    'Frontend Engineer',
    'UI/UX Designer',
    'Full Stack Developer'
  ];

  const typingText = useTypingEffect(stackTexts);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      
      <motion.div 
        className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <motion.div className="text-center lg:text-left" variants={itemVariants}>
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Olá, eu sou
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Jefferson Felix
            </span>
          </motion.h1>

          <motion.div 
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 h-12 flex items-center justify-center lg:justify-start"
            variants={itemVariants}
          >
            <span className="border-r-2 border-purple-400 pr-2 animate-pulse">
              {typingText}
            </span>
          </motion.div>

          <motion.p 
            className="text-lg text-gray-400 mb-8 max-w-2xl"
            variants={itemVariants}
          >
            Desenvolvedor Frontend apaixonado por criar experiências digitais incríveis. 
            Especializado em React, TypeScript e tecnologias modernas.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            variants={itemVariants}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Projetos
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Entre em Contato
            </motion.button>
          </motion.div>
        </motion.div>

        {/* CSS Avatar */}
        <motion.div 
          className="h-96 lg:h-[500px] relative flex items-center justify-center"
          variants={itemVariants}
        >
          <Avatar3D />
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-6 h-6 bg-pink-400 rounded-full"
            animate={{ 
              y: [0, 15, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-sm mb-2">Role para baixo</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}