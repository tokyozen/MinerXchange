import React from 'react';
import { MineralListing } from '../../types/marketplace';

interface MineralCardProps {
  listing: MineralListing;
}

export default function MineralCard({ listing }: MineralCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{listing.mineralName}</h3>
            <p className="text-sm text-gray-500">{listing.country}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Quantity:</span>
            <span className="font-medium">{listing.quantity} {listing.unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price per {listing.unit}:</span>
            <span className="font-medium">${listing.pricePerUnit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Seller:</span>
            <span className="font-medium">{listing.seller}</span>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Contact Seller
        </button>
      </div>
    </div>
  );
}