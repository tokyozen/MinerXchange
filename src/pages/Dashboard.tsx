import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MemberStats from '../components/member/MemberStats';
import MineralListings from '../components/member/MineralListings';
import SubmissionHistory from '../components/member/SubmissionHistory';
import NewListingModal from '../components/member/NewListingModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [showNewListing, setShowNewListing] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
        <button
          onClick={() => setShowNewListing(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Listing
        </button>
      </div>

      <MemberStats />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Listings</h2>
          <MineralListings />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h2>
          <SubmissionHistory />
        </div>
      </div>

      {showNewListing && (
        <NewListingModal onClose={() => setShowNewListing(false)} />
      )}
    </div>
  );
}