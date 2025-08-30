import React from 'react';

interface PersistentLayoutProps {
  children: React.ReactNode;
}

/**
 * PersistentLayout is a minimal wrapper for all pages.
 * Individual pages should use specific layouts (AppLayout, GuestLayout, AuthLayout) for their UI structure.
 */
export const PersistentLayout: React.FC<PersistentLayoutProps> = ({
  children,
}) => {
  return <>{children}</>;
};
