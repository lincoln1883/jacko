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
} from 'lucide-react';

interface NavigationProps {
  variant?: 'app' | 'guest';
  user?: {
    id: number;
    email: string;
    role: 'client' | 'tradesperson' | 'admin';
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
  const isTradesperson = user?.role === 'tradesperson';
  const isAdmin = user?.role === 'admin';
  const canAccessProfile = isClient || isTradesperson;

  const getProfilePath = (): string | null => {
    if (isTradesperson) return '/profile/tradesperson';
    if (isClient) return '/profile/client';
    return null;
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
    <>
      <Link
        href="/sign_in"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/sign_up"
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm border border-blue-600"
      >
        Get Started
      </Link>
    </>
  );

  // Authenticated navigation links
  const authenticatedLinks = (
    <>
      {/* Dashboard/Home Link */}
      <Link
        href="/"
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Dashboard
      </Link>

      {/* Search Link */}
      <Link
        href="/search"
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="w-4 h-4 mr-1" />
        Find Tradespeople
      </Link>

      {/* Profile Link - Only for clients and tradespeople */}
      {canAccessProfile && (
        <Link
          href={getProfilePath() || '#'}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="w-4 h-4 mr-1" />
          My Profile
        </Link>
      )}

      {/* Sessions Link */}
      <Link
        href="/sessions"
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Shield className="w-4 h-4 mr-1" />
        Sessions
      </Link>

      {/* Admin Links */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Users className="w-4 h-4 mr-1" />
          Admin
        </Link>
      )}

      {/* User Info Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block">{user?.email}</span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
              <div className="font-medium text-foreground">{user?.email}</div>
              <div className="text-xs capitalize">{user?.role} Account</div>
            </div>

            <Link
              href="/password/edit"
              className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <nav
      className={`${
        variant === 'guest'
          ? 'bg-white/95 backdrop-blur-sm border-gray-200'
          : 'bg-white border-gray-200'
      } shadow-sm border-b sticky top-0 z-[100]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
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
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {shouldShowGuestLinks ? (
                <>
                  <Link
                    href="/sign_in"
                    className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign_up"
                    className="block px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-all duration-200 shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="px-3 py-2 text-sm border-b border-border mb-2">
                    <div className="font-medium text-foreground">
                      {user?.email}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user?.role} Account
                    </div>
                  </div>

                  {/* Mobile authenticated links */}
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    href="/search"
                    className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Tradespeople
                  </Link>

                  {canAccessProfile && (
                    <Link
                      href={getProfilePath() || '#'}
                      className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  )}

                  <Link
                    href="/sessions"
                    className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sessions
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}

                  <Link
                    href="/password/edit"
                    className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
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
