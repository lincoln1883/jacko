import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    RubyPlugin(),
  ],
  build: {
    rollupOptions: {
      external: ['vitest'],
    },
  },
  define: {
    // Exclude test globals from production build
    ...(process.env.NODE_ENV !== 'test' && {
      global: 'globalThis',
    }),
  },
})
