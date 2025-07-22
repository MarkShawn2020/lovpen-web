'use server'

import { supabaseServiceClient } from '@/lib/supabase'
import type { WaitlistResponse, WaitlistSubmit } from '@/types/waitlist'

export async function submitWaitlistAction(data: WaitlistSubmit): Promise<{
  success: boolean;
  data?: WaitlistResponse;
  error?: string;
  waitlistInfo?: WaitlistResponse;
}> {
  try {
    // Check if email already exists
    const { data: existingEntry, error: checkError } = await supabaseServiceClient
      .from('waitlist')
      .select('*')
      .eq('email', data.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking existing email:', checkError)
      return {
        success: false,
        error: `Database error: ${checkError.message}`
      }
    }

    if (existingEntry) {
      // Calculate position for existing entry
      const { count: position } = await supabaseServiceClient
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .lte('created_at', existingEntry.created_at)

      const { count: totalSubmissions } = await supabaseServiceClient
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      const responseWithPosition = {
        ...existingEntry,
        queue_position: position || 0,
        total_submissions: totalSubmissions || 0,
        estimated_wait_weeks: calculateEstimatedWeeks(position || 0),
        position_tier: calculatePositionTier(position || 0)
      } as WaitlistResponse

      return {
        success: false,
        error: 'Email already exists in waitlist',
        waitlistInfo: responseWithPosition
      }
    }

    // Insert new entry
    const { data: newEntry, error: insertError } = await supabaseServiceClient
      .from('waitlist')
      .insert({
        email: data.email,
        name: data.name,
        company: data.company || null,
        use_case: data.useCase || null,
        source: data.source,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting entry:', insertError)
      return {
        success: false,
        error: `Database error: ${insertError.message}`
      }
    }

    // Calculate position for new entry
    const { count: position } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lte('created_at', newEntry.created_at)

    const { count: totalSubmissions } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const responseWithPosition = {
      ...newEntry,
      queue_position: position || 0,
      total_submissions: totalSubmissions || 0,
      estimated_wait_weeks: calculateEstimatedWeeks(position || 0),
      position_tier: calculatePositionTier(position || 0)
    } as WaitlistResponse

    return {
      success: true,
      data: responseWithPosition
    }
  } catch (error: any) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: `Server error: ${error.message}`
    }
  }
}

// Helper functions
function calculatePositionTier(position: number): 'priority' | 'regular' | 'extended' {
  if (position <= 50) {
 return 'priority' 
}
  if (position <= 500) {
 return 'regular' 
}
  return 'extended'
}

function calculateEstimatedWeeks(position: number): number {
  const tier = calculatePositionTier(position)
  const baseWeeksPer100 = 2
  
  const multiplier = tier === 'priority' ? 0.5 : tier === 'regular' ? 0.8 : 1.2
  return Math.max(1, Math.min(12, Math.ceil((position / 100) * baseWeeksPer100 * multiplier)))
}

export async function getWaitlistStatsAction(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Get basic statistics
    const { count: totalSubmissions } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const { count: pendingCount } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: approvedCount } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    const { count: rejectedCount } = await supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    // Get recent submissions
    const { data: recentSubmissions, error } = await supabaseServiceClient
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: {
        total_submissions: totalSubmissions || 0,
        pending_count: pendingCount || 0,
        approved_count: approvedCount || 0,
        rejected_count: rejectedCount || 0,
        recent_submissions: recentSubmissions || []
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export async function getWaitlistEntriesAction(params: {
  page?: number;
  size?: number;
  status_filter?: 'pending' | 'approved' | 'rejected';
  search?: string;
} = {}): Promise<{
  success: boolean;
  data?: {
    items: any[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
  error?: string;
}> {
  try {
    let query = supabaseServiceClient
      .from('waitlist')
      .select('*', { count: 'exact' })

    // Apply filters
    if (params.status_filter) {
      query = query.eq('status', params.status_filter)
    }

    if (params.search) {
      query = query.or(`email.ilike.%${params.search}%,name.ilike.%${params.search}%`)
    }

    // Apply pagination
    const page = params.page || 1
    const size = params.size || 10
    const from = (page - 1) * size
    const to = from + size - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: {
        items: data || [],
        total: count || 0,
        page,
        size,
        pages: Math.ceil((count || 0) / size)
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export async function updateWaitlistEntryAction(
  id: number,
  updateData: {
    status?: 'pending' | 'approved' | 'rejected' | null;
    priority?: number | null;
    notes?: string | null;
  }
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseServiceClient
      .from('waitlist')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export async function deleteWaitlistEntryAction(id: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabaseServiceClient
      .from('waitlist')
      .delete()
      .eq('id', id)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}
