import React from 'react';

interface MarketplaceHeaderProps {
  title: string;
  description: string;
}

export default function MarketplaceHeader({ title, description }: MarketplaceHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}