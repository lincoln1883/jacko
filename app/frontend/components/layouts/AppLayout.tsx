import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Navigation } from '../navigation/Navigation';
import { FlashMessageComponent } from '../ui/flash-message';
import type { PageProps } from '../../types/auth';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

/**
 * AppLayout is used for authenticated user pages.
 * Shows full navigation based on user role and profile status.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  className,
}) => {
  const { flash, auth } = usePage<PageProps>().props;

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
          {flash && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <FlashMessageComponent flash={flash} />
            </div>
          )}

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
      </div>
    </>
  );
};
