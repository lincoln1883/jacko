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
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <div className="relative">
                    <button className="text-sm font-medium text-foreground hover:text-muted-foreground">
                      Account
                    </button>
                    {/* You could add a dropdown menu here */}
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
