import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Member {
  id: string;
  user_id: string;
  cooperative_id: string;
  full_name: string;
  member_id: string;
}

export function useMember() {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!user?.id) return;

      try {
        // Use RPC call to get current member
        const { data, error: fetchError } = await supabase
          .rpc('get_current_member');

        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('No member profile found. Please contact support.');
          setMember(null);
        } else {
          setMember(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError(err.message);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [user]);

  return { member, loading, error };
}