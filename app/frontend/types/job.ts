import { User } from './auth';
import { Bid } from './bid';

export interface Parish {
  id: number;
  name: string;
  code: string;
}

export interface Job {
  id?: number;
  title: string;
  description: string;
  budget: number;
  due_date: string;
  location: string;
  parish_id: number;
  status: string;
  client_id?: number;
  created_at?: string;
  updated_at?: string;
  parish?: Parish;
  client?: User;
  bids?: Bid[];
  errors?: Record<string, string[]>;
}

export interface JobFormProps {
  job: Job;
  parishes: Parish[];
  errors: Record<string, string[]>;
}

export interface JobsIndexProps {
  jobs: Job[];
  parishes: Parish[];
  selectedParishId: number | null;
  selectedStatus: string | null;
  canPostJob: boolean;
}

export interface JobShowProps {
  job: Job;
}
