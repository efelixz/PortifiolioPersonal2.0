import { motion } from "framer-motion";

export default function Avatar3D() {
  return (
    <div className="relative w-48 h-48 mx-auto">
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
        className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Ring */}
      <motion.div
        className="absolute inset-0 border-2 border-purple-300/40 rounded-full"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </div>
  );
}