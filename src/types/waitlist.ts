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
