import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '../contexts/ToastContext';
import type { PageProps } from '../types/auth';

/**
 * Hook to automatically convert Inertia flash messages to toast notifications
 * This hook should be used in layout components to capture flash messages
 * and display them as toasts instead of traditional flash messages.
 */
export const useFlashToast = (): void => {
  const { flash } = usePage<PageProps>().props;
  const toast = useToast();
  const lastFlashRef = useRef<{ type: string; message: string } | null>(null);

  useEffect(() => {
    if (flash) {
      const { type, message } = flash;

      // Check if this is a different flash message than the last one we processed
      const lastFlash = lastFlashRef.current;
      const isDifferent =
        !lastFlash || lastFlash.type !== type || lastFlash.message !== message;

      if (isDifferent) {
        // Update the last flash reference
        lastFlashRef.current = { type, message };

        switch (type) {
          case 'notice':
            toast.success(message, {
              duration: 5000,
            });
            break;
          case 'alert':
          case 'error':
            toast.error(message, {
              duration: 7000, // Keep error messages longer
            });
            break;
          case 'warning':
            toast.warning(message, {
              duration: 6000,
            });
            break;
          case 'info':
            toast.info(message, {
              duration: 5000,
            });
            break;
          default:
            // Fallback for unknown flash types
            toast.info(message, {
              duration: 5000,
            });
        }
      }
    } else {
      // Clear the reference when there's no flash message
      lastFlashRef.current = null;
    }
  }, [flash, toast]);
};
