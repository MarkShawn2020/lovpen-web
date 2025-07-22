import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type WaitlistEntry = Database['public']['Tables']['waitlist']['Row'];

export function useWaitlistRealtime() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    };

    fetchEntries();

    // Set up real-time subscription
    const subscription = supabase
      .channel('waitlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist'
        },
        (payload) => {
          console.log('Waitlist change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as WaitlistEntry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(entry => 
              entry.id === payload.new.id ? payload.new as WaitlistEntry : entry
            ));
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { entries, loading };
}

export function useWaitlistPosition(userId?: string, email?: string) {
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    // Get initial position
    const fetchPosition = async () => {
      try {
        const { data: entry } = await supabase
          .from('waitlist')
          .select('id')
          .eq('email', email)
          .eq('status', 'pending')
          .single();

        if (entry) {
          const { data: positionData } = await supabase
            .rpc('get_waitlist_position', { entry_id: entry.id });

          if (positionData && typeof positionData === 'object' && 'queue_position' in positionData) {
            setPosition(positionData.queue_position as number);
          }
        }
      } catch (error) {
        console.error('Error fetching position:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();

    // Set up real-time subscription for position updates
    const subscription = supabase
      .channel('position_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist'
        },
        async (payload) => {
          // Recalculate position when waitlist changes
          await fetchPosition();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [email]);

  return { position, loading };
}
