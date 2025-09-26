import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Shield,
  Users,
  Home as HomeIcon,
  Search,
  Briefcase,
} from 'lucide-react';

interface NavigationProps {
  variant?: 'app' | 'guest';
  user?: {
    id: number;
    email: string;
    role: 'client' | 'supplier' | 'contractor' | 'admin';
    created_at: string;
  } | null;
  session?: {
    id: string;
    user_agent?: string;
    ip_address?: string;
    created_at: string;
  } | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  variant = 'app',
  user,
  session,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive authentication state from user data
  const isAuthenticated = !!user;

  // For guest pages, we should show guest links regardless of user state
  const shouldShowGuestLinks = variant === 'guest' || !isAuthenticated;
  const isClient = user?.role === 'client';
  const isSupplier = user?.role === 'supplier'; // Changed from isTradesperson
  const isContractor = user?.role === 'contractor'; // Added new role
  const isAdmin = user?.role === 'admin';
  const canAccessProfile = isClient || isSupplier || isContractor;

  const getProfilePath = (): string | null => {
    if (isSupplier) return '/profile/supplier'; // Updated path
    if (isClient) return '/profile/client';
    if (isContractor) return '/profile/contractor'; // Added new path for contractor
    return null;
  };

  const getDashboardPath = (): string => {
    if (isAdmin) return '/admin/dashboard';
    if (isClient) return '/client_dashboard';
    if (isSupplier || isContractor) return '/supplier_dashboard';
    return '/'; // Default to home for unauthenticated or unknown roles
  };

  const handleSignOut = () => {
    if (session?.id) {
      // Send session ID to destroy specific session
      router.delete(`/sessions/${session.id}`, {
        onSuccess: () => {
          // Successfully signed out, will be redirected by the server
        },
        onError: () => {
          // Fallback to general sign out if session-specific logout fails
          console.error('Error signing out session, trying general logout');
          router.delete('/sign_out');
        },
      });
    } else {
      // Fallback to general sign out if no session ID available
      router.delete('/sign_out', {
        onSuccess: () => {
          // Successfully signed out, will be redirected by the server
        },
        onError: () => {
          // Handle any errors during sign out
          console.error('Error signing out');
        },
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Guest navigation links
  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link
        href="/sign_in"
        className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
      >
        Sign In
      </Link>
      <Link
        href="/sign_up"
        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm border border-transparent"
      >
        Get Started
      </Link>
    </div>
  );

  // Authenticated navigation links
  const authenticatedLinks = (
    <div className="flex items-center space-x-6">
      {/* Dashboard/Home Link */}
      <Link
        href={getDashboardPath()}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Dashboard
      </Link>

      {/* Search Link */}
      {(isClient || isSupplier || isContractor) && (
        <Link
          href="/search"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
        >
          <Search className="w-4 h-4 mr-1" />
          Find Tradespeople
        </Link>
      )}

      {/* Jobs Link for Suppliers/Contractors */}
      {(isSupplier || isContractor) && (
        <Link
          href="/supplier_dashboard"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
        >
          <Briefcase className="w-4 h-4 mr-1" />
          Jobs
        </Link>
      )}

      {/* Profile Link - Only for clients and tradespeople */}
      {canAccessProfile && (
        <Link
          href={getProfilePath() || '#'}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
        >
          <User className="w-4 h-4 mr-1" />
          My Profile
        </Link>
      )}

      {/* Sessions Link */}
      <Link
        href="/sessions"
        className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
      >
        <Shield className="w-4 h-4 mr-1" />
        Sessions
      </Link>

      {/* Admin Links */}
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200"
        >
          <Users className="w-4 h-4 mr-1" />
          Admin
        </Link>
      )}

      {/* User Info Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors duration-200 focus:outline-none">
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block">{user?.email}</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
              <div className="font-medium text-gray-900">{user?.email}</div>
              <div className="text-xs capitalize text-gray-500">
                {user?.role} Account
              </div>
            </div>

            <Link
              href="/password/edit"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <nav
      className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[100] ${variant === 'guest' ? '' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-blue-700 hover:text-blue-800 transition-colors duration-200"
            >
              Jacko
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {shouldShowGuestLinks ? guestLinks : authenticatedLinks}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {shouldShowGuestLinks ? (
                <>
                  <Link
                    href="/sign_in"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign_up"
                    className="block w-full text-center px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all duration-200 shadow-sm mt-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="px-3 py-2 text-sm border-b border-gray-200 mb-2">
                    <div className="font-medium text-gray-900">
                      {user?.email}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user?.role} Account
                    </div>
                  </div>

                  {/* Mobile authenticated links */}
                  <Link
                    href={getDashboardPath()}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>

                  {(isClient || isSupplier || isContractor) && (
                    <Link
                      href="/search"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Find Tradespeople
                    </Link>
                  )}

                  {(isSupplier || isContractor) && (
                    <Link
                      href="/supplier_dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      Jobs
                    </Link>
                  )}

                  {canAccessProfile && (
                    <Link
                      href={getProfilePath() || '#'}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-2" />
                      My Profile
                    </Link>
                  )}

                  <Link
                    href="/sessions"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Sessions
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Admin
                    </Link>
                  )}

                  <Link
                    href="/password/edit"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 text-left"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
