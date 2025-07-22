import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

type WaitlistSubmitRequest = {
  email: string;
  name: string;
  company?: string | null;
  useCase?: string | null;
  source: string;
}

type WaitlistResponse = {
  id: number;
  email: string;
  name: string;
  company?: string | null;
  use_case?: string | null;
  source: string;
  status: string;
  priority?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  queue_position?: number | null;
  estimated_wait_weeks?: number | null;
  position_tier?: string | null;
  total_submissions?: number | null;
}

console.log('Waitlist submit function is running!')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestData: WaitlistSubmitRequest = await req.json()

    // Validate required fields
    if (!requestData.email || !requestData.name || !requestData.source) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, name, source' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call the Supabase function
    const { data, error } = await supabaseClient.rpc('submit_waitlist_with_position', {
      p_email: requestData.email,
      p_name: requestData.name,
      p_company: requestData.company || null,
      p_use_case: requestData.useCase || null,
      p_source: requestData.source
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if the response indicates an existing email
    if (data.error && data.error === 'Email already exists') {
      return new Response(
        JSON.stringify({
          detail: {
            message: 'Email already exists in waitlist',
            waitlist_info: data.waitlist_info
          }
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return successful response
    return new Response(
      JSON.stringify(data),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
