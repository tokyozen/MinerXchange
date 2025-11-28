import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/date';

interface Submission {
  id: string;
  quantity: number;
  submission_date: string;
  verification_status: string;
  notes: string;
  mineral_listing: {
    mineral_type: string;
    unit: string;
  };
}

export default function SubmissionHistory() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id) return;

      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) return;

      const { data, error } = await supabase
        .from('mineral_submissions')
        .select(`
          id,
          quantity,
          submission_date,
          verification_status,
          notes,
          mineral_listing (
            mineral_type,
            unit
          )
        `)
        .eq('member_id', member.id)
        .order('submission_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching submissions:', error);
        return;
      }

      setSubmissions(data);
      setLoading(false);
    };

    fetchSubmissions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('submission_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mineral_submissions',
        },
        fetchSubmissions
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {submissions.map((submission) => (
          <li key={submission.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {submission.mineral_listing.mineral_type}
                </h3>
                <p className="text-sm text-gray-500">
                  {submission.quantity} {submission.mineral_listing.unit}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  submission.verification_status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : submission.verification_status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {submission.verification_status}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Submitted on {formatDate(submission.submission_date)}
            </div>
            {submission.notes && (
              <div className="mt-2 text-sm text-gray-600">{submission.notes}</div>
            )}
          </li>
        ))}
        {submissions.length === 0 && (
          <li className="p-4 text-center text-gray-500">No submissions yet</li>
        )}
      </ul>
    </div>
  );
}