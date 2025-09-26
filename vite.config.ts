import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), RubyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/frontend'),
    },
  },
  build: {
    rollupOptions: {
      external: ['vitest'],
    },
    sourcemap: false, // Disable sourcemaps in production for smaller bundle size
    minify: 'terser', // Use terser for better minification
  },
  define: {
    // Exclude test globals from production build
    ...(process.env.NODE_ENV !== 'test' && {
      global: 'globalThis',
    }),
  },
  // Enable asset inlining for small files
  assetsInclude: ['**/*.{jpg,jpeg,png,gif,webp,svg}'],
});
