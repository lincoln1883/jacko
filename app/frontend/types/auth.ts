export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
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
      created_at: string;
    };
  };
  app_name?: string;
}

export interface IdentityFormData {
  email?: string;
  password?: string;
  password_confirmation?: string;
  password_challenge?: string;
}
