import { User } from './auth';

export interface VerificationRequest {
  id?: number;
  supplier_id: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  documents?: string[]; // Array of document URLs
  supplier?: User;
  errors?: Record<string, string[]>;
}

export interface VerificationRequestFormProps {
  verificationRequest: VerificationRequest;
  errors: Record<string, string[]>;
}

export interface VerificationRequestShowProps {
  verificationRequest: VerificationRequest;
}
