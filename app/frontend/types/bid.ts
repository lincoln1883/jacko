import { User } from './auth';

export interface Bid {
  id?: number;
  job_id: number;
  supplier_id?: number;
  amount: number;
  message: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at?: string;
  updated_at?: string;
  supplier?: User;
  errors?: Record<string, string[]>;
}

export interface BidFormProps {
  job: { id: number; title: string; budget: number };
  bid: Bid;
  errors: Record<string, string[]>;
}
