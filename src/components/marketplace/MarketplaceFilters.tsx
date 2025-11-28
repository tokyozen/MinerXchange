import React from 'react';
import Select from '../ui/Select';
import { SortOption } from '../../types/marketplace';

interface MarketplaceFiltersProps {
  filters: {
    weightQuantity: string;
    region: string;
    priceRange: string;
    qualityGrade: string;
  };
  onFilterChange: (filters: any) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function MarketplaceFilters({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Select
        label="Weight/Quantity"
        value={filters.weightQuantity}
        onChange={(e) => onFilterChange({ ...filters, weightQuantity: e.target.value })}
        options={[
          { value: '', label: 'All Quantities' },
          { value: 'low', label: '< 1000 kg' },
          { value: 'medium', label: '1000-5000 kg' },
          { value: 'high', label: '> 5000 kg' },
        ]}
      />

      <Select
        label="Region/Country"
        value={filters.region}
        onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
        options={[
          { value: '', label: 'All Regions' },
          { value: 'Africa', label: 'Africa' },
          { value: 'Asia', label: 'Asia' },
          { value: 'Europe', label: 'Europe' },
          { value: 'North America', label: 'North America' },
          { value: 'South America', label: 'South America' },
        ]}
      />

      <Select
        label="Price Range"
        value={filters.priceRange}
        onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value })}
        options={[
          { value: '', label: 'All Prices' },
          { value: 'low', label: '< $1,000' },
          { value: 'medium', label: '$1,000-$10,000' },
          { value: 'high', label: '> $10,000' },
        ]}
      />

      <Select
        label="Quality/Grade"
        value={filters.qualityGrade}
        onChange={(e) => onFilterChange({ ...filters, qualityGrade: e.target.value })}
        options={[
          { value: '', label: 'All Grades' },
          { value: 'low', label: 'Low Grade' },
          { value: 'medium', label: 'Medium Grade' },
          { value: 'high', label: 'High Grade' },
        ]}
      />

      <Select
        label="Sort By"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        options={[
          { value: 'price-low-high', label: 'Price: Low to High' },
          { value: 'price-high-low', label: 'Price: High to Low' },
        ]}
      />
    </div>
  );
}