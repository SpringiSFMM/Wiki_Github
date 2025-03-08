import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Definiere Aliase für häufig verwendete Verzeichnisse
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@lib': resolve(__dirname, './src/lib'),
      '@data': resolve(__dirname, './src/data')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['@mantine/core', '@mantine/hooks'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@mantine/core', '@mantine/hooks']
  },
  server: {
    host: 'localhost',
    port: 5173
  }
}); 