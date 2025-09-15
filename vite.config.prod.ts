import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Production-optimized Vite config for GitHub Pages
export default defineConfig({
  base: '/portfolio-jefferson/',
  
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    target: "es2015",
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          vendor: ['react', 'react-dom'],
          
          // Routing
          router: ['react-router-dom'],
          
          // Animations
          motion: ['framer-motion'],
          
          // 3D (lazy loaded)
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          
          // UI Components
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          
          // Utilities
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
        },
        
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Minify options
    minify: 'terser',
  },
  
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'clsx',
      'tailwind-merge',
    ],
    exclude: [
      // Lazy load heavy dependencies
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'jspdf',
      'html2canvas',
    ],
  },
  
  // CSS optimization
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default',
        }),
      ],
    },
  },
});