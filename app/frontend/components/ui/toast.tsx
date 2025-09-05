import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastComponentProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Match the exit animation duration
  }, [onClose, toast.id]);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const getToastIcon = () => {
    const iconClass = 'h-5 w-5 flex-shrink-0';

    switch (toast.type) {
      case 'success':
        return <CheckCircle className={cn(iconClass, 'text-green-600')} />;
      case 'error':
        return <XCircle className={cn(iconClass, 'text-red-600')} />;
      case 'warning':
        return <AlertTriangle className={cn(iconClass, 'text-amber-600')} />;
      case 'info':
        return <Info className={cn(iconClass, 'text-blue-600')} />;
    }
  };

  const getToastStyles = () => {
    const baseStyles = 'border-l-4';

    switch (toast.type) {
      case 'success':
        return cn(baseStyles, 'bg-green-50 border-green-400 text-green-800');
      case 'error':
        return cn(baseStyles, 'bg-red-50 border-red-400 text-red-800');
      case 'warning':
        return cn(baseStyles, 'bg-amber-50 border-amber-400 text-amber-800');
      case 'info':
        return cn(baseStyles, 'bg-blue-50 border-blue-400 text-blue-800');
      default:
        return cn(baseStyles, 'bg-gray-50 border-gray-400 text-gray-800');
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto max-w-sm w-full rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out transform',
        getToastStyles(),
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getToastIcon()}</div>

          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-semibold mb-1">{toast.title}</p>
            )}
            <p className="text-sm">{toast.message}</p>

            {toast.action && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={toast.action.onClick}
                  className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for timed toasts */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-black bg-opacity-10">
          <div
            className="h-full bg-current opacity-50 transition-all ease-linear"
            style={{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ToastComponent;
