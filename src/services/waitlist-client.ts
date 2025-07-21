import type {
  WaitlistListResponse,
  WaitlistResponse,
  WaitlistStats,
  WaitlistSubmit,
  WaitlistUpdate,
} from '@/types/waitlist';
import { fastAPIAuthService } from './fastapi-auth-v2';

export class WaitlistClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';
  }

  private async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail 
        || `API Error: ${response.status} ${response.statusText}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async submitWaitlist(data: WaitlistSubmit): Promise<WaitlistResponse> {
    // Public endpoint - no authentication required
    return this.publicRequest<WaitlistResponse>('/waitlist/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWaitlistEntries(params: {
    page?: number;
    size?: number;
    status_filter?: 'pending' | 'approved' | 'rejected';
    search?: string;
  } = {}): Promise<WaitlistListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) {
 searchParams.set('page', params.page.toString()); 
}
    if (params.size) {
 searchParams.set('size', params.size.toString()); 
}
    if (params.status_filter) {
 searchParams.set('status_filter', params.status_filter); 
}
    if (params.search) {
 searchParams.set('search', params.search); 
}

    const query = searchParams.toString();
    // Admin endpoint - requires authentication
    return fastAPIAuthService.authenticatedRequest<WaitlistListResponse>(
      `/waitlist/list${query ? `?${query}` : ''}`
    );
  }

  async getWaitlistStats(): Promise<WaitlistStats> {
    // Admin endpoint - requires authentication
    return fastAPIAuthService.authenticatedRequest<WaitlistStats>('/waitlist/stats');
  }

  async getWaitlistEntry(id: number): Promise<WaitlistResponse> {
    // Admin endpoint - requires authentication
    return fastAPIAuthService.authenticatedRequest<WaitlistResponse>(`/waitlist/${id}`);
  }

  async updateWaitlistEntry(
    id: number,
    data: WaitlistUpdate
  ): Promise<WaitlistResponse> {
    // Admin endpoint - requires authentication
    return fastAPIAuthService.authenticatedRequest<WaitlistResponse>(`/waitlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteWaitlistEntry(id: number): Promise<void> {
    // Admin endpoint - requires authentication
    return fastAPIAuthService.authenticatedRequest<void>(`/waitlist/${id}`, {
      method: 'DELETE',
    });
  }

  async approveWaitlistEntry(id: number, notes?: string): Promise<WaitlistResponse> {
    return this.updateWaitlistEntry(id, {
      status: 'approved',
      notes,
    });
  }

  async rejectWaitlistEntry(id: number, notes?: string): Promise<WaitlistResponse> {
    return this.updateWaitlistEntry(id, {
      status: 'rejected',
      notes,
    });
  }

  async setPriority(id: number, priority: number): Promise<WaitlistResponse> {
    return this.updateWaitlistEntry(id, { priority });
  }
}

// Create singleton instance
export const waitlistClient = new WaitlistClient();

// React hooks for easier usage
export function useWaitlistMutations() {
  return {
    submitWaitlist: (data: WaitlistSubmit) => waitlistClient.submitWaitlist(data),
    approveEntry: (id: number, notes?: string) => waitlistClient.approveWaitlistEntry(id, notes),
    rejectEntry: (id: number, notes?: string) => waitlistClient.rejectWaitlistEntry(id, notes),
    updateEntry: (id: number, data: WaitlistUpdate) => waitlistClient.updateWaitlistEntry(id, data),
    deleteEntry: (id: number) => waitlistClient.deleteWaitlistEntry(id),
    setPriority: (id: number, priority: number) => waitlistClient.setPriority(id, priority),
  };
}
