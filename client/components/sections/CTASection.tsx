import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Mail, MessageCircle, Coffee } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 border border-purple-400/20 rounded-full"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-20 w-24 h-24 border border-pink-400/20 rounded-full"
        animate={{ 
          rotate: -360,
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Pronto para
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Criar Algo Incrível?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Vamos transformar sua ideia em realidade. Entre em contato e vamos conversar sobre seu próximo projeto.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            {/* Primary CTA */}
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Mail size={20} />
                <span>Vamos Conversar</span>
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </span>
              
              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </motion.button>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {/* Email Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-400/30 transition-all duration-300 group"
            >
              <div className="text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Mail size={24} className="mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400 text-sm">contato@jefferson.dev</p>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-400/30 transition-all duration-300 group"
            >
              <div className="text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={24} className="mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-400 text-sm">+55 (11) 99999-9999</p>
            </motion.div>

            {/* Coffee Chat Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-400/30 transition-all duration-300 group"
            >
              <div className="text-orange-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Coffee size={24} className="mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Coffee Chat</h3>
              <p className="text-gray-400 text-sm">Vamos tomar um café!</p>
            </motion.div>
          </motion.div>

          {/* Bottom Message */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              ✨ Resposta em até 24 horas • 🚀 Orçamento gratuito • 💡 Consultoria inicial gratuita
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <motion.div 
        className="absolute top-40 left-1/4 w-2 h-2 bg-purple-400 rounded-full"
        animate={{ 
          y: [0, -50, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 right-1/3 w-3 h-3 bg-pink-400 rounded-full"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          opacity: [0, 0.8, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </section>
  );
}