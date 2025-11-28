import React, { useEffect, useState } from 'react';
import { Scale, BarChart2, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useMember } from '../../hooks/useMember';

interface Stats {
  totalListings: number;
  totalSubmissions: number;
  totalQuantity: number;
}

export default function MemberStats() {
  const { member } = useMember();
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    totalSubmissions: 0,
    totalQuantity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!member?.id) return;

      try {
        const { data, error: statsError } = await supabase
          .rpc('get_member_stats', { member_id: member.id });

        if (statsError) throw statsError;

        if (data && data.length > 0) {
          setStats({
            totalListings: Number(data[0].total_listings) || 0,
            totalSubmissions: Number(data[0].total_submissions) || 0,
            totalQuantity: Number(data[0].total_quantity) || 0,
          });
        }
        setError(null);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('member_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mineral_listings',
        },
        fetchStats
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mineral_submissions',
        },
        fetchStats
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [member]);

  if (loading) {
    return <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
          <div className="p-5 h-24"></div>
        </div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-md">
      <p className="text-red-800">Error loading stats: {error}</p>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        icon={<Scale className="h-6 w-6 text-indigo-600" />}
        label="Total Listings"
        value={stats.totalListings}
      />
      <StatCard
        icon={<BarChart2 className="h-6 w-6 text-green-600" />}
        label="Total Submissions"
        value={stats.totalSubmissions}
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        label="Total Quantity"
        value={stats.totalQuantity}
        unit="kg"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
}

function StatCard({ icon, label, value, unit }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {value.toLocaleString()}
                {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}