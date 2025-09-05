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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayedFlashMessages = useRef<any>({}); // Use any since flash message types are not defined

  useEffect(() => {
    if (flash) {
      const { type, message } = flash;

      // Generate a unique key for the flash message
      const flashKey = `${type}-${message}`;

      // Check if the flash message has already been displayed
      if (!displayedFlashMessages.current[flashKey]) {
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

        // Mark the flash message as displayed
        displayedFlashMessages.current[flashKey] = true;
      }
    }
  }, [flash, toast]);
};
