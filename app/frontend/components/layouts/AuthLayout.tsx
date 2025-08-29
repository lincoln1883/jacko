import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FlashMessageComponent } from '../ui/flash-message';
import type { PageProps } from '@/types/auth';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const { flash } = usePage<PageProps>().props;
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
            {flash && (
              <div className="mb-6">
                <FlashMessageComponent flash={flash} />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
