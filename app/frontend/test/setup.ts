import '@testing-library/jest-dom';
import React from 'react';

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

  // Mock Inertia.js hooks and components globally
  vi.mock('@inertiajs/react', async () => {
    const actual = await vi.importActual('@inertiajs/react');

    return {
      ...actual,
      useForm: vi.fn().mockImplementation((initialData = {}) => ({
        data: initialData,
        setData: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        processing: false,
        errors: {},
        hasErrors: false,
        progress: null,
        wasSuccessful: false,
        recentlySuccessful: false,
        reset: vi.fn(),
        clearErrors: vi.fn(),
        setError: vi.fn(),
        transform: vi.fn(),
        isDirty: false,
      })),

      usePage: vi.fn().mockReturnValue({
        component: 'TestComponent',
        props: {
          flash: undefined,
          errors: {},
          auth: undefined,
          app_name: 'Jacko',
        },
        url: '/test',
        version: '1',
      }),

      Head: vi.fn().mockImplementation(({ title }: any) => {
        if (typeof document !== 'undefined' && title) {
          document.title = title;
        }
        // Create a real DOM element for testing
        const titleElement = document.createElement('title');
        if (title) titleElement.textContent = title;
        return null; // Head component doesn't render anything visible
      }),

      Link: vi
        .fn()
        .mockImplementation(({ href, children, className, ...props }: any) => {
          // Return a proper React element using React.createElement
          return React.createElement(
            'a',
            {
              href,
              className,
              ...props,
            },
            children
          );
        }),

      router: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        visit: vi.fn(),
        reload: vi.fn(),
        remember: vi.fn(),
        restore: vi.fn(),
      },
    };
  });
}
