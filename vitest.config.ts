/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/frontend/test/setup.ts'],
    include: ['app/frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'app/frontend/test/'],
    },
  },
  resolve: {
    alias: {
      '/assets': new URL('./app/frontend/assets', import.meta.url).pathname,
    },
  },
})
