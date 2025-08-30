import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FlashMessageComponent } from '../ui/flash-message';
import type { PageProps } from '@/types/auth';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  user?: { id: number; email: string }; // Optional user prop for explicit passing
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { flash, auth } = usePage<PageProps>().props;
  const user = auth?.user;

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-background">
        <nav className="bg-card shadow border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-xl font-bold text-foreground hover:text-muted-foreground"
                >
                  Jacko
                </Link>
              </div>

              {user && (
                <div className="flex items-center space-x-6">
                  {/* Profile Link */}
                  {user.role === 'tradesperson' && (
                    <Link
                      href="/profile/tradesperson"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      My Profile
                    </Link>
                  )}
                  {user.role === 'client' && (
                    <Link
                      href="/profile/client"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      My Profile
                    </Link>
                  )}

                  {/* User Info */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {user.role === 'tradesperson'
                        ? 'Tradesperson'
                        : user.role === 'client'
                          ? 'Client'
                          : 'Admin'}
                    </span>
                  </div>

                  {/* Account Menu - for future expansion */}
                  <div className="relative">
                    <Link
                      href="/sessions"
                      className="text-sm font-medium text-foreground hover:text-muted-foreground"
                    >
                      Sessions
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main>
          {flash && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <FlashMessageComponent flash={flash} />
            </div>
          )}
          {children}
        </main>
      </div>
    </>
  );
};
