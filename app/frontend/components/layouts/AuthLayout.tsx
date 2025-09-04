import React from 'react';
import { Head } from '@inertiajs/react';
import { ToastProvider } from '../../contexts/ToastContext';
import ToastContainer from '../ui/toast-container';
import { useFlashToast } from '../../hooks/useFlashToast';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

/**
 * Inner component that uses toast hooks
 * This needs to be inside the ToastProvider
 */
const AuthLayoutContent: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  // Initialize flash message to toast conversion
  useFlashToast();

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Jacko</h1>
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow-lg border sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>

        {/* Toast notifications */}
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

export const AuthLayout: React.FC<AuthLayoutProps> = (props) => {
  return (
    <ToastProvider maxToasts={3} defaultDuration={5000}>
      <AuthLayoutContent {...props} />
    </ToastProvider>
  );
};
