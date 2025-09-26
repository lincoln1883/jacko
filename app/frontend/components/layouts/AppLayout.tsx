import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Navigation } from '../navigation/Navigation';
import { ToastProvider } from '../../contexts/ToastContext';
import ToastContainer from '../ui/toast-container';
import { useFlashToast } from '../../hooks/useFlashToast';
import type { PageProps } from '../../types/auth';
import AdminLayout from './AdminLayout'; // Corrected to default import

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

  // If admin, render AdminLayout
  if (isAdmin) {
    return <AdminLayout title={title}>{children}</AdminLayout>;
  }

  // For unauthenticated users, or non-admin roles, render the regular authenticated layout structure.
  // If there's no authenticated user, the backend should redirect to login for pages using AppLayout.
  if (!pageUser) {
    // Render a minimalist layout for unauthenticated users, or redirect
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
        <Head title={title} />
        <Navigation variant="guest" user={null} session={null} />

        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          <div className={`${className || ''}`}>{children}</div>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
        <Navigation user={pageUser} session={pageSession} />

        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          <div className={`${className || ''}`}>
            {children} {/* Children for non-admin authenticated users */}
          </div>
        </main>

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
