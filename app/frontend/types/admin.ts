import { User } from './auth';
import { VerificationRequest } from './verification_request';
import { Job } from './job';
import { Dispute } from './dispute';
import { SupplierProfile } from './profile';
import { ClientProfile } from './profile';
import { ConstructionService } from './construction_service';

export interface AdminUser extends User {
  supplier_profile?: SupplierProfile;
  client_profile?: ClientProfile;
  verification_requests?: VerificationRequest[];
}

export interface AdminDashboardIndexProps {
  userCount: number;
  supplierCount: number;
  clientCount: number;
  pendingVerificationRequestsCount: number;
  openJobsCount: number;
  pendingDisputesCount: number;
  errors?: Record<string, string[]>;
}

export interface AdminUsersIndexProps {
  users: AdminUser[];
  pagination: { currentPage: number; totalPages: number };
  errors?: Record<string, string[]>;
}

export interface AdminUserShowProps {
  user: AdminUser;
  errors?: Record<string, string[]>;
}

export interface AdminVerificationRequestsIndexProps {
  verificationRequests: VerificationRequest[];
  pagination: { currentPage: number; totalPages: number };
  allStatuses: string[];
  errors?: Record<string, string[]>;
}

export interface AdminVerificationRequestShowProps {
  verificationRequest: VerificationRequest;
  errors?: Record<string, string[]>;
}

export interface AdminDisputesIndexProps {
  disputes: Dispute[];
  pagination: { currentPage: number; totalPages: number };
  allStatuses: string[];
  errors?: Record<string, string[]>;
}

export interface AdminDisputeShowProps {
  dispute: Dispute;
  errors?: Record<string, string[]>;
}

export interface AdminJobsIndexProps {
  jobs: Job[];
  pagination: { currentPage: number; totalPages: number };
  errors?: Record<string, string[]>;
}

export interface AdminJobShowProps {
  job: Job;
  errors?: Record<string, string[]>;
}

export interface AdminConstructionServicesIndexProps {
  services: ConstructionService[];
  pagination: { currentPage: number; totalPages: number };
  errors?: Record<string, string[]>;
}

export interface AdminConstructionServicesNewProps {
  service: ConstructionService;
  errors?: Record<string, string[]>;
}

export interface AdminConstructionServicesEditProps {
  service: ConstructionService;
  errors?: Record<string, string[]>;
}
