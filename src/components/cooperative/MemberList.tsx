import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Member {
  id: string;
  full_name: string;
  member_id: string;
  phone_number: string;
  status: string;
  created_at: string;
}

export default function MemberList() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.id) return;

      const { data: cooperative } = await supabase
        .from('cooperatives')
        .select('id')
        .eq('contact_email', user.email)
        .single();

      if (!cooperative) return;

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('cooperative_id', cooperative.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        return;
      }

      setMembers(data);
      setLoading(false);
    };

    fetchMembers();
  }, [user]);

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {members.map((member) => (
          <li key={member.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {member.full_name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{member.full_name}</h3>
                    <p className="text-sm text-gray-500">ID: {member.member_id}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {member.phone_number}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Joined{' '}
                    {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}