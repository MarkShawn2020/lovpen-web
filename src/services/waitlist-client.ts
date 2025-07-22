import type {
  WaitlistListResponse,
  WaitlistResponse,
  WaitlistStats,
  WaitlistSubmit,
  WaitlistUpdate,
} from '@/types/waitlist';
import { supabase } from '@/lib/supabase';
import {
  deleteWaitlistEntryAction,
  getWaitlistEntriesAction,
  getWaitlistStatsAction,
  submitWaitlistAction,
  updateWaitlistEntryAction
} from '@/app/actions/waitlist';

export class WaitlistClient {
  constructor() {
    // Using Server Actions instead of direct API calls
  }

  // Removed publicRequest method as we're using Server Actions

  async submitWaitlist(data: WaitlistSubmit): Promise<WaitlistResponse> {
    // Use Server Action for waitlist submission
    const result = await submitWaitlistAction(data);
    
    if (!result.success) {
      // Handle existing email specially
      if (result.waitlistInfo) {
        const errorWithInfo = new Error(result.error!) as any;
        errorWithInfo.waitlistInfo = result.waitlistInfo;
        throw errorWithInfo;
      }
      
      throw new Error(result.error || 'Submission failed');
    }

    return result.data!;
  }

  async getWaitlistEntries(params: {
    page?: number;
    size?: number;
    status_filter?: 'pending' | 'approved' | 'rejected';
    search?: string;
  } = {}): Promise<WaitlistListResponse> {
    // Use Server Action for list operations
    const result = await getWaitlistEntriesAction(params);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get entries');
    }

    return result.data!;
  }

  async getWaitlistStats(): Promise<WaitlistStats> {
    // Use Server Action for stats
    const result = await getWaitlistStatsAction();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get stats');
    }

    return result.data!;
  }

  async getWaitlistEntry(id: number): Promise<WaitlistResponse> {
    // Use Supabase direct query
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Transform database row to WaitlistResponse
    return {
      ...data,
      status: data.status as 'pending' | 'approved' | 'rejected'
    } as WaitlistResponse;
  }

  async updateWaitlistEntry(
    id: number,
    data: WaitlistUpdate
  ): Promise<WaitlistResponse> {
    // Use Server Action for update
    const result = await updateWaitlistEntryAction(id, data);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update entry');
    }

    return result.data!;
  }

  async deleteWaitlistEntry(id: number): Promise<void> {
    // Use Server Action for delete
    const result = await deleteWaitlistEntryAction(id);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete entry');
    }
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
export function waitlistMutations() {
  return {
    submitWaitlist: (data: WaitlistSubmit) => waitlistClient.submitWaitlist(data),
    approveEntry: (id: number, notes?: string) => waitlistClient.approveWaitlistEntry(id, notes),
    rejectEntry: (id: number, notes?: string) => waitlistClient.rejectWaitlistEntry(id, notes),
    updateEntry: (id: number, data: WaitlistUpdate) => waitlistClient.updateWaitlistEntry(id, data),
    deleteEntry: (id: number) => waitlistClient.deleteWaitlistEntry(id),
    setPriority: (id: number, priority: number) => waitlistClient.setPriority(id, priority),
  };
}
