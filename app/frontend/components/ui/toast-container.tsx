import React from 'react';
import ToastComponent from './toast';
import { useToast } from '../../contexts/ToastContext';

interface ToastContainerProps {
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
}) => {
  const { toasts, removeToast } = useToast();

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4 items-end';
      case 'top-left':
        return 'top-4 left-4 items-start';
      case 'bottom-right':
        return 'bottom-4 right-4 items-end';
      case 'bottom-left':
        return 'bottom-4 left-4 items-start';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2 items-center';
      default:
        return 'top-4 right-4 items-end';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Optional: Screen overlay (you can remove this if unnecessary) */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        aria-hidden="true"
      />

      {/* Toast container */}
      <div
        className={`fixed z-50 flex flex-col space-y-4 p-4 w-full ${getPositionStyles()}`}
        aria-live="polite"
        aria-label="Toast notifications"
      >
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
