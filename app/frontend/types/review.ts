import { User } from './auth';

export interface Review {
  id?: number;
  job_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
  reviewer?: User;
  reviewee?: User;
  errors?: Record<string, string[]>;
}

export interface ReviewFormProps {
  job: { id: number; title: string };
  reviewee_id: number; // Corrected to directly include reviewee_id
  errors: Record<string, string[]>;
}
