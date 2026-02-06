import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './gui',
  resolve: {
    alias: {
      '@combat': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});