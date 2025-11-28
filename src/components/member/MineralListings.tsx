import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/date';
import ListingFilters from './ListingFilters';
import SubmitMineralModal from './SubmitMineralModal';

interface MineralListing {
  id: string;
  mineral_type: string;
  quantity: number;
  unit: string;
  quality_grade: string;
  status: string;
  price_per_unit: number;
  created_at: string;
}

export default function MineralListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<MineralListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    mineralType: '',
    status: '',
  });

  useEffect(() => {
    const fetchListings = async () => {
      if (!user?.id) return;

      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) return;

      let query = supabase
        .from('mineral_listings')
        .select('*')
        .eq('member_id', member.id)
        .order('created_at', { ascending: false });

      if (filters.mineralType) {
        query = query.eq('mineral_type', filters.mineralType);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.ilike('mineral_type', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        return;
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();

    const subscription = supabase
      .channel('mineral_listings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mineral_listings',
        },
        fetchListings
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filters]);

  if (loading) {
    return <div>Loading listings...</div>;
  }

  return (
    <div>
      <ListingFilters filters={filters} onChange={setFilters} />
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {listings.map((listing) => (
            <li key={listing.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{listing.mineral_type}</h3>
                  <p className="text-sm text-gray-500">
                    {listing.quantity} {listing.unit} • Grade: {listing.quality_grade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${listing.price_per_unit}/{listing.unit}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                    {listing.status === 'available' && (
                      <button
                        onClick={() => setSelectedListing(listing.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Listed on {formatDate(listing.created_at)}
              </div>
            </li>
          ))}
          {listings.length === 0 && (
            <li className="p-4 text-center text-gray-500">No listings found</li>
          )}
        </ul>
      </div>

      {selectedListing && (
        <SubmitMineralModal
          listingId={selectedListing}
          mineralType={listings.find(l => l.id === selectedListing)?.mineral_type || ''}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}