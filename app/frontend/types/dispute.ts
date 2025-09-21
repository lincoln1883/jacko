import { User } from './auth';
import { SelectOption } from './profile';

export interface Dispute {
  id?: number;
  job_id: number;
  reporter_id: number;
  reported_user_id: number;
  reason: string;
  description: string;
  status?: 'pending' | 'resolved' | 'escalated';
  notes?: string; // Added notes property
  created_at?: string;
  updated_at?: string;
  job?: { id: number; title: string }; // Added job property
  reporter?: User;
  reported_user?: User;
  errors?: Record<string, string[]>;
}

export interface DisputeFormProps {
  job: { id: number; title: string };
  dispute: Dispute;
  errors: Record<string, string[]>;
  reportedUserOptions: SelectOption[];
}

export interface AdminDisputeIndexProps {
  disputes: Dispute[];
}

export interface AdminDisputeShowProps {
  dispute: Dispute;
}
