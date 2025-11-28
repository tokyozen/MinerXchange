export interface MineralListing {
  id: string;
  mineralName: string;
  country: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  seller: string;
}

export type SortOption = 'price-low-high' | 'price-high-low';