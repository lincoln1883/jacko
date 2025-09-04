import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Navigation } from '../navigation/Navigation';
import { ToastProvider } from '../../contexts/ToastContext';
import ToastContainer from '../ui/toast-container';
import { useFlashToast } from '../../hooks/useFlashToast';
import type { PageProps } from '../../types/auth';

interface GuestLayoutProps {
  children: React.ReactNode;
  title: string;
  showFooter?: boolean;
  className?: string;
}

/**
 * Inner component that uses toast hooks
 * This needs to be inside the ToastProvider
 */
const GuestLayoutContent: React.FC<GuestLayoutProps> = ({
  children,
  title,
  showFooter = true,
  className,
}) => {
  const { auth } = usePage<PageProps>().props;

  // Initialize flash message to toast conversion
  useFlashToast();

  // Get user and session data from page props - should be null for guest pages
  const pageUser = auth?.user;
  const pageSession = auth?.session;

  const footerContent = showFooter && (
    <footer className="bg-card border-t border-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Jacko
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Connecting skilled tradespeople with clients who need quality work
              done. Simple, reliable, and professional.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              For Tradespeople
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/sign_up"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join as Professional
                </Link>
              </li>
              <li>
                <Link
                  href="/sign_in"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Professional Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              For Clients
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/sign_up"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Find Professionals
                </Link>
              </li>
              <li>
                <Link
                  href="/sign_in"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Client Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Jacko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-background">
        <Navigation variant="guest" user={pageUser} session={pageSession} />
        <main>
          <div className={className}>{children}</div>
          {footerContent}
        </main>

        {/* Toast notifications */}
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};

/**
 * GuestLayout is used for unauthenticated user pages (landing page, marketing pages).
 * Shows guest navigation with sign in/sign up buttons.
 */
export const GuestLayout: React.FC<GuestLayoutProps> = (props) => {
  return (
    <ToastProvider maxToasts={5} defaultDuration={5000}>
      <GuestLayoutContent {...props} />
    </ToastProvider>
  );
};
