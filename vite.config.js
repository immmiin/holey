import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in the lazily-loaded 3D chunk; it's big but off the critical path
    chunkSizeWarningLimit: 1100
  }
});
