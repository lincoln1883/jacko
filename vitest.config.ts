/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/frontend/test/setup.ts'],
    include: ['app/frontend/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'app/frontend/test/',
        'app/frontend/__tests__/',
        'app/frontend/entrypoints/',
        'app/frontend/vite-env.d.ts',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        'dist/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      all: true,
      include: ['app/frontend/**/*.{js,jsx,ts,tsx}'],
      clean: true,
    },
  },
  resolve: {
    alias: {
      '/assets': new URL('./app/frontend/assets', import.meta.url).pathname,
    },
  },
})
