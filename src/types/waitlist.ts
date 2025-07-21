// Waitlist types based on uni-api specification

export type WaitlistStatus = 'pending' | 'approved' | 'rejected';

export type WaitlistSubmit = {
  email: string;
  name: string;
  company?: string | null;
  useCase?: string | null;
  source: string;
}

export type WaitlistResponse = {
  id: number;
  email: string;
  name: string;
  company?: string | null;
  use_case?: string | null;
  source: string;
  status: WaitlistStatus;
  priority?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  // New fields for position notification
  queue_position?: number | null;
  estimated_wait_weeks?: number | null;
  position_tier?: 'priority' | 'regular' | 'extended' | null;
  total_submissions?: number | null;
}

export type NotificationTier = 'priority' | 'regular' | 'extended';

export type NotificationConfig = {
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  duration: number;
  celebratory?: boolean;
  actions?: Array<{
    key: string;
    label: string;
    handler: () => void;
  }>;
}

export type WaitlistUpdate = {
  status?: WaitlistStatus | null;
  priority?: number | null;
  notes?: string | null;
}

export type WaitlistStats = {
  total_submissions: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  recent_submissions: WaitlistResponse[];
}

export type WaitlistListResponse = {
  items: WaitlistResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export type HTTPValidationError = {
  detail: ValidationError[];
}

export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
}
