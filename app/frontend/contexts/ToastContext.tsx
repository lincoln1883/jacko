import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Toast } from '../components/ui/toast';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  // Convenience methods for different toast types
  success: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  error: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  warning: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
  info: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => string;
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'CLEAR_ALL_TOASTS' };

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
}) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    dispatch({ type: 'ADD_TOAST', toast: newToast });

    // Remove oldest toast if we exceed maxToasts
    if (state.toasts.length >= maxToasts) {
      const oldestToast = state.toasts[0];
      if (oldestToast) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', id: oldestToast.id });
        }, 100);
      }
    }

    return id;
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  };

  const clearAllToasts = () => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  };

  const success = (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => {
    return addToast({
      type: 'success',
      message,
      ...options,
    });
  };

  const error = (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => {
    return addToast({
      type: 'error',
      message,
      ...options,
    });
  };

  const warning = (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => {
    return addToast({
      type: 'warning',
      message,
      ...options,
    });
  };

  const info = (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => {
    return addToast({
      type: 'info',
      message,
      ...options,
    });
  };

  const contextValue: ToastContextValue = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
