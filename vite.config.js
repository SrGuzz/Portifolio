import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // o workflow de deploy publica a pasta ./build
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', '@gsap/react', 'lenis'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
