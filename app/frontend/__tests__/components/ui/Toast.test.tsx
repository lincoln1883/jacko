import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ToastComponent, { Toast } from '../../../components/ui/toast';

// Mock timer functions
vi.useFakeTimers();

describe('ToastComponent', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  const defaultToast: Toast = {
    id: 'test-toast-1',
    type: 'success',
    message: 'Test message',
    duration: 5000,
  };

  describe('Rendering', () => {
    it('renders toast with message', () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders toast with title and message', () => {
      const toastWithTitle: Toast = {
        ...defaultToast,
        title: 'Success!',
      };

      render(<ToastComponent toast={toastWithTitle} onClose={mockOnClose} />);

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders toast with action button', () => {
      const actionMock = vi.fn();
      const toastWithAction: Toast = {
        ...defaultToast,
        action: {
          label: 'Retry',
          onClick: actionMock,
        },
      };

      render(<ToastComponent toast={toastWithAction} onClose={mockOnClose} />);

      const actionButton = screen.getByText('Retry');
      expect(actionButton).toBeInTheDocument();

      fireEvent.click(actionButton);
      expect(actionMock).toHaveBeenCalledTimes(1);
    });

    it('renders close button', () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('Toast Types', () => {
    it('renders success toast with correct styling and icon', () => {
      const successToast: Toast = {
        ...defaultToast,
        type: 'success',
      };

      render(<ToastComponent toast={successToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass(
        'bg-green-50',
        'border-green-400',
        'text-green-800'
      );

      // Check for CheckCircle icon (it should be in the document)
      const icon = toastElement.querySelector('.text-green-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders error toast with correct styling and icon', () => {
      const errorToast: Toast = {
        ...defaultToast,
        type: 'error',
      };

      render(<ToastComponent toast={errorToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass(
        'bg-red-50',
        'border-red-400',
        'text-red-800'
      );

      // Check for XCircle icon
      const icon = toastElement.querySelector('.text-red-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders warning toast with correct styling and icon', () => {
      const warningToast: Toast = {
        ...defaultToast,
        type: 'warning',
      };

      render(<ToastComponent toast={warningToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass(
        'bg-amber-50',
        'border-amber-400',
        'text-amber-800'
      );

      // Check for AlertTriangle icon
      const icon = toastElement.querySelector('.text-amber-600');
      expect(icon).toBeInTheDocument();
    });

    it('renders info toast with correct styling and icon', () => {
      const infoToast: Toast = {
        ...defaultToast,
        type: 'info',
      };

      render(<ToastComponent toast={infoToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass(
        'bg-blue-50',
        'border-blue-400',
        'text-blue-800'
      );

      // Check for Info icon
      const icon = toastElement.querySelector('.text-blue-600');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it.skip('calls onClose when close button is clicked', async () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      const closeButton = screen.getByText('Close').closest('button')!;
      fireEvent.click(closeButton);

      // Wait for the close animation (with longer timeout)
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
        },
        { timeout: 1000 }
      );
    });

    it.skip('auto-closes after specified duration', async () => {
      const toast: Toast = {
        ...defaultToast,
        duration: 1000,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledWith('test-toast-1');
      });
    });

    it.skip('does not auto-close when duration is 0', async () => {
      const toast: Toast = {
        ...defaultToast,
        duration: 0,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      // Fast-forward time significantly
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Wait a tick for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it.skip('does not auto-close when duration is undefined', async () => {
      const toast: Toast = {
        ...defaultToast,
        duration: undefined,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      // Fast-forward time significantly
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Wait a tick for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Progress Bar', () => {
    it('shows progress bar for timed toasts', () => {
      const toast: Toast = {
        ...defaultToast,
        duration: 5000,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const progressContainer = screen
        .getByRole('alert')
        .querySelector('.h-1.bg-black.bg-opacity-10');
      expect(progressContainer).toBeInTheDocument();

      const progressBar = progressContainer?.querySelector(
        '.h-full.bg-current.opacity-50'
      );
      expect(progressBar).toBeInTheDocument();
    });

    it('does not show progress bar for permanent toasts', () => {
      const toast: Toast = {
        ...defaultToast,
        duration: 0,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const progressContainer = screen
        .getByRole('alert')
        .querySelector('.h-1.bg-black.bg-opacity-10');
      expect(progressContainer).not.toBeInTheDocument();
    });
  });

  describe('Animation Classes', () => {
    it('applies correct animation classes', () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveClass(
        'transition-all',
        'duration-300',
        'ease-in-out',
        'transform'
      );
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      const toastElement = screen.getByRole('alert');
      expect(toastElement).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has accessible label', () => {
      render(<ToastComponent toast={defaultToast} onClose={mockOnClose} />);

      const closeButton = screen.getByText('Close').closest('button')!;
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAccessibleName('Close');
    });

    it('action button is accessible when present', () => {
      const actionMock = vi.fn();
      const toastWithAction: Toast = {
        ...defaultToast,
        action: {
          label: 'Undo Action',
          onClick: actionMock,
        },
      };

      render(<ToastComponent toast={toastWithAction} onClose={mockOnClose} />);

      const actionButton = screen.getByText('Undo Action');
      expect(actionButton).toHaveAccessibleName('Undo Action');
      expect(actionButton).toHaveAttribute('type', 'button');
    });
  });
});
