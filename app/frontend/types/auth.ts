export interface User {
  id: number;
  email: string;
  role: 'client' | 'tradesperson' | 'admin';
  created_at: string;
  updated_at?: string;
  profile_completed?: boolean;
  has_profile?: boolean;
}

export interface Session {
  id: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'tradesperson';
}

export interface AuthPageProps {
  errors?: Record<string, string[]>;
  email_hint?: string;
}

export interface SessionsIndexProps {
  sessions: Session[];
}

export interface FlashMessage {
  type: 'notice' | 'alert' | 'error';
  message: string;
}

export interface PageProps {
  flash?: FlashMessage;
  errors?: Record<string, string[]>;
  auth?: {
    user: {
      id: number;
      email: string;
      role: 'client' | 'tradesperson' | 'admin';
      created_at: string;
      profile_completed?: boolean;
      has_profile?: boolean;
    };
    session?: {
      id: string;
      user_agent?: string;
      ip_address?: string;
      created_at: string;
    };
  };
  app_name?: string;
  email_hint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Index signature to satisfy Inertia's PageProps constraint
}

export interface IdentityFormData {
  email?: string;
  password?: string;
  password_confirmation?: string;
  password_challenge?: string;
}

// Navigation and Layout Types
export type UserRole = 'client' | 'tradesperson' | 'admin';

export interface NavigationLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  requireAuth?: boolean;
  external?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  navigationVariant?: 'app' | 'guest';
  className?: string;
}
