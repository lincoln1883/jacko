import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Navigation } from '../navigation/Navigation';
import { ToastProvider } from '../../contexts/ToastContext';
import ToastContainer from '../ui/toast-container';
import { useFlashToast } from '../../hooks/useFlashToast';
import type { PageProps } from '../../types/auth';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

/**
 * Inner component that uses toast hooks
 * This needs to be inside the ToastProvider
 */
const AppLayoutContent: React.FC<AppLayoutProps> = ({
  children,
  title,
  className,
}) => {
  const { auth } = usePage<PageProps>().props;

  // Initialize flash message to toast conversion
  useFlashToast();

  // Get user and session data from page props
  const pageUser = auth?.user;
  const pageSession = auth?.session;

  // Calculate role-based permissions from page data
  const isAdmin = pageUser?.role === 'admin';
  const isClient = pageUser?.role === 'client';
  const isTradesperson = pageUser?.role === 'tradesperson';

  // This layout should only be used for authenticated users
  if (!pageUser) {
    return null;
  }

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-background">
        <Navigation variant="app" user={pageUser} session={pageSession} />

        <main>
          {/* Role-based content wrapper */}
          <div className={`${className || ''}`}>
            {/* Admin users see everything */}
            {isAdmin && children}

            {/* Tradespeople see their content */}
            {isTradesperson && !isAdmin && children}

            {/* Clients see their content */}
            {isClient && !isAdmin && children}
          </div>
        </main>

        {/* Toast notifications */}
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

/**
 * AppLayout is used for authenticated user pages.
 * Shows full navigation based on user role and profile status.
 */
export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  return (
    <ToastProvider maxToasts={5} defaultDuration={5000}>
      <AppLayoutContent {...props} />
    </ToastProvider>
  );
};
