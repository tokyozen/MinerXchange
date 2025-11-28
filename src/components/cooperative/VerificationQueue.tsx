import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';

interface Submission {
  id: string;
  quantity: number;
  submission_date: string;
  verification_status: string;
  notes: string;
  member: {
    full_name: string;
    member_id: string;
  };
  mineral_listing: {
    mineral_type: string;
    unit: string;
    quality_grade: string;
  };
}

export default function VerificationQueue() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id) return;

      const { data: cooperative } = await supabase
        .from('cooperatives')
        .select('id')
        .eq('contact_email', user.email)
        .single();

      if (!cooperative) return;

      const { data, error } = await supabase
        .from('mineral_submissions')
        .select(`
          id,
          quantity,
          submission_date,
          verification_status,
          notes,
          member:members(full_name, member_id),
          mineral_listing:mineral_listings(mineral_type, unit, quality_grade)
        `)
        .eq('verification_status', 'pending')
        .order('submission_date', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return;
      }

      setSubmissions(data);
      setLoading(false);
    };

    fetchSubmissions();

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

  const handleVerification = async (submissionId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('mineral_submissions')
        .update({
          verification_status: status,
          verified_by: user?.id,
          verification_date: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Submission ${status} successfully`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading verification queue...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Verifications</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {submissions.map((submission) => (
          <li key={submission.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {submission.mineral_listing.mineral_type}
                </h3>
                <p className="text-sm text-gray-500">
                  {submission.quantity} {submission.mineral_listing.unit} • Grade:{' '}
                  {submission.mineral_listing.quality_grade}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted by: {submission.member.full_name} ({submission.member.member_id})
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerification(submission.id, 'verified')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleVerification(submission.id, 'rejected')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
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
          <li className="p-4 text-center text-gray-500">No pending verifications</li>
        )}
      </ul>
    </div>
  );
}