import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  esbuild: {
    target: 'esnext'
  }
})