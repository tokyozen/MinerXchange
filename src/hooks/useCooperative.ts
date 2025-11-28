import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Cooperative {
  id: string;
  name: string;
  contact_email: string;
}

export function useCooperative() {
  const { user } = useAuth();
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCooperative = async () => {
      if (!user?.email) return;

      try {
        // Use RPC call to get current cooperative
        const { data, error: fetchError } = await supabase
          .rpc('get_current_cooperative');

        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('No cooperative profile found. Please contact support.');
          setCooperative(null);
        } else {
          setCooperative(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching cooperative:', err);
        setError(err.message);
        setCooperative(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCooperative();
  }, [user]);

  return { cooperative, loading, error };
}