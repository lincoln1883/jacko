// Profile types for the Jamaica Skills & Trades Platform

// Skills types
export interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
  category_color: string;
}

export interface SkillsCategory {
  [category: string]: Skill[];
}

export interface Parish {
  id: number;
  name: string;
  svg_path: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface TradesPersonProfile {
  id: number;
  bio: string | null;
  company_name: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  phone: string | null;
  website: string | null;
  availability_status: 'available' | 'busy' | 'unavailable' | 'booked';
  experience_level: 'graduate' | 'intermediate' | 'expert' | 'master' | null;
  description: string | null;
  active: boolean;
  completion_percentage: number;
  completed: boolean;
  display_hourly_rate: string;
  display_experience: string;
  display_availability: string;
  availability_color: string;
  parish: Parish | null;
  parish_id: number | null;
  street_address: string | null;
  city_town: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  service_radius_km: number | null;
  service_area_notes: string | null;
  additional_parishes: string[];
  skills: Skill[];
  skill_ids: number[];
  skills_by_category: SkillsCategory;
  has_avatar: boolean;
  avatar_url: string | null;
  avatar_thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  portfolio_images: PortfolioImage[]; // New field
}

export interface PortfolioImage {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  file_size_mb: number;
  image_alt_text: string;
  active: boolean;
  position: number;
}

export interface ClientProfile {
  id: number;
  company_name: string | null;
  preferred_contact_method:
    | 'email'
    | 'phone'
    | 'whatsapp'
    | 'platform_messaging';
  project_budget_range: string | null;
  description: string | null;
  active: boolean;
  completion_percentage: number;
  completed: boolean;
  display_budget_range: string;
  display_contact_method: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  role: 'client' | 'tradesperson' | 'admin';
  role_display: string;
  verified: boolean;
}

// Form data types
export interface TradesPersonProfileFormData {
  bio: string;
  company_name: string;
  years_experience: number | string;
  hourly_rate: number | string;
  phone: string;
  website: string;
  availability_status: 'available' | 'busy' | 'unavailable' | 'booked';
  experience_level: 'graduate' | 'intermediate' | 'expert' | 'master' | null;
  description: string;
  skill_ids: number[];
  parish_id: number | string;
  street_address: string;
  city_town: string;
  postal_code: string;
  service_radius_km: number | string;
  service_area_notes: string;
  additional_parishes: string[];
}

export interface ClientProfileFormData {
  company_name: string;
  preferred_contact_method:
    | 'email'
    | 'phone'
    | 'whatsapp'
    | 'platform_messaging';
  project_budget_range: string;
  description: string;
}

// Page props
export interface TradesPersonProfilePageProps {
  profile: TradesPersonProfile;
  user: User;
  can_edit: boolean;
  skills?: Skill[];
  skills_by_category?: SkillsCategory;
  flash?: {
    success?: string;
    error?: string;
    notice?: string;
  };
  errors?: Record<string, string[]>;
}

export interface ClientProfilePageProps {
  profile: ClientProfile;
  user: User;
  can_edit: boolean;
  contact_method_options?: [string, string][];
  budget_range_options?: [string, string][];
  flash?: {
    success?: string;
    error?: string;
    notice?: string;
  };
  errors?: Record<string, string[]>;
}

// Option types for selects
export interface SelectOption {
  label: string;
  value: string;
}

export const AVAILABILITY_STATUS_OPTIONS: SelectOption[] = [
  { label: 'Available for new projects', value: 'available' },
  { label: 'Busy but accepting inquiries', value: 'busy' },
  { label: 'Currently unavailable', value: 'unavailable' },
  { label: 'Fully booked', value: 'booked' },
];

export const EXPERIENCE_LEVEL_OPTIONS: SelectOption[] = [
  { label: 'Graduate (0-2 years experience)', value: 'graduate' },
  { label: 'Intermediate (3-7 years experience)', value: 'intermediate' },
  { label: 'Expert (8-15 years experience)', value: 'expert' },
  { label: 'Master (15+ years experience)', value: 'master' },
];
