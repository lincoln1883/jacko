import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../../contexts/ToastContext';

// Mock timer functions
vi.useFakeTimers();

describe('ToastContext', () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('ToastProvider', () => {
    const TestComponent: React.FC = () => {
      const toast = useToast();

      return (
        <div>
          <button onClick={() => toast.success('Success message')}>
            Add Success Toast
          </button>
          <button onClick={() => toast.error('Error message')}>
            Add Error Toast
          </button>
          <button onClick={() => toast.warning('Warning message')}>
            Add Warning Toast
          </button>
          <button onClick={() => toast.info('Info message')}>
            Add Info Toast
          </button>
          <button onClick={() => toast.clearAllToasts()}>Clear All</button>
          <div data-testid="toast-count">{toast.toasts.length}</div>
        </div>
      );
    };

    it('provides toast context to child components', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('throws error when useToast is used outside provider', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('useToast hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider maxToasts={5} defaultDuration={5000}>
        {children}
      </ToastProvider>
    );

    it('adds success toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Test success message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].message).toBe('Test success message');
      expect(result.current.toasts[0].duration).toBe(5000);
    });

    it('adds error toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.error('Test error message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('error');
      expect(result.current.toasts[0].message).toBe('Test error message');
    });

    it('adds warning toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.warning('Test warning message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('warning');
      expect(result.current.toasts[0].message).toBe('Test warning message');
    });

    it('adds info toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.info('Test info message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].message).toBe('Test info message');
    });

    it('adds toast with custom options', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Test message', {
          title: 'Custom Title',
          duration: 10000,
          action: {
            label: 'Undo',
            onClick: vi.fn(),
          },
        });
      });

      const toast = result.current.toasts[0];
      expect(toast.title).toBe('Custom Title');
      expect(toast.duration).toBe(10000);
      expect(toast.action?.label).toBe('Undo');
    });

    it('generates unique IDs for toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Toast 1');
        result.current.success('Toast 2');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].id).not.toBe(result.current.toasts[1].id);
      expect(result.current.toasts[0].id).toMatch(/^toast-\d+-\w+$/);
    });

    it('removes specific toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId: string;

      act(() => {
        toastId = result.current.success('Test message');
        result.current.success('Another message');
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Another message');
    });

    it('clears all toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.success('Toast 1');
        result.current.error('Toast 2');
        result.current.warning('Toast 3');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearAllToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it.skip('respects maxToasts limit', async () => {
      const limitedWrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider maxToasts={2}>{children}</ToastProvider>
      );

      const { result } = renderHook(() => useToast(), {
        wrapper: limitedWrapper,
      });

      act(() => {
        result.current.success('Toast 1');
        result.current.success('Toast 2');
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.success('Toast 3'); // This should trigger removal of oldest
      });

      expect(result.current.toasts).toHaveLength(3); // Temporarily 3 until cleanup

      // Wait for the oldest toast to be removed
      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(2);
        // The first toast should be removed, leaving the 2nd and 3rd
        expect(
          result.current.toasts.find((t) => t.message === 'Toast 1')
        ).toBeUndefined();
      });
    });

    it('uses default duration when not specified', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast({
          type: 'success',
          message: 'Test message',
        });
      });

      expect(result.current.toasts[0].duration).toBe(5000);
    });

    it('preserves custom duration when specified', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast({
          type: 'success',
          message: 'Test message',
          duration: 3000,
        });
      });

      expect(result.current.toasts[0].duration).toBe(3000);
    });
  });

  describe('Toast Integration', () => {
    const TestComponentWithToasts: React.FC = () => {
      const toast = useToast();

      return (
        <div>
          <button
            data-testid="add-success"
            onClick={() => toast.success('Success message')}
          >
            Add Success
          </button>
          <button
            data-testid="add-error"
            onClick={() => toast.error('Error message')}
          >
            Add Error
          </button>
          <button
            data-testid="clear-all"
            onClick={() => toast.clearAllToasts()}
          >
            Clear All
          </button>
          <div data-testid="toast-count">{toast.toasts.length}</div>
          <div data-testid="toast-messages">
            {toast.toasts.map((t) => t.message).join(', ')}
          </div>
        </div>
      );
    };

    it('manages multiple toasts through user interactions', () => {
      render(
        <ToastProvider>
          <TestComponentWithToasts />
        </ToastProvider>
      );

      // Initially no toasts
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

      // Add success toast
      fireEvent.click(screen.getByTestId('add-success'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
      expect(screen.getByTestId('toast-messages')).toHaveTextContent(
        'Success message'
      );

      // Add error toast
      fireEvent.click(screen.getByTestId('add-error'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
      expect(screen.getByTestId('toast-messages')).toHaveTextContent(
        'Success message, Error message'
      );

      // Clear all toasts
      fireEvent.click(screen.getByTestId('clear-all'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
      expect(screen.getByTestId('toast-messages')).toHaveTextContent('');
    });
  });
});
