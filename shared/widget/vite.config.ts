import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OzeanLichtSupport',
      fileName: 'widget',
      formats: ['iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: 'widget.[ext]',
        inlineDynamicImports: true,
      },
    },
    minify: 'terser',
    sourcemap: true,
    cssCodeSplit: false,
    outDir: 'dist',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
