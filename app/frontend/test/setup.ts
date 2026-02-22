import '@testing-library/jest-dom';

// Setup global test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock static assets
if (typeof vi !== 'undefined') {
  vi.mock('/assets/inertia.svg', () => ({
    default: '/assets/inertia.svg',
  }));

  vi.mock('/assets/react.svg', () => ({
    default: '/assets/react.svg',
  }));

  vi.mock('/assets/vite_ruby.svg', () => ({
    default: '/assets/vite_ruby.svg',
  }));
}
