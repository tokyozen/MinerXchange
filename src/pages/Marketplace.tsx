import React, { useState } from 'react';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import SearchBar from '../components/marketplace/SearchBar';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import MineralCard from '../components/marketplace/MineralCard';
import { mineralListings } from '../data/mineralListings';
import { SortOption } from '../types/marketplace';

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    weightQuantity: '',
    region: '',
    priceRange: '',
    qualityGrade: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('price-low-high');

  const filteredListings = mineralListings
    .filter(listing => {
      if (search && !listing.mineralName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filters.region && listing.country !== filters.region) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.pricePerUnit - b.pricePerUnit;
        case 'price-high-low':
          return b.pricePerUnit - a.pricePerUnit;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketplaceHeader 
        title="Mining Resources Marketplace"
        description="Find and purchase mining resources from verified sellers"
      />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <MarketplaceFilters
        filters={filters}
        onFilterChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <MineralCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}