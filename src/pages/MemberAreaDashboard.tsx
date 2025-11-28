import React from 'react';
import BackButton from '../components/ui/BackButton';

export default function MemberAreaDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Member Area Dashboard</h1>
        <p className="text-gray-600">Manage members and track submissions here.</p>
      </div>
    </div>
  );
}