export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  image: string;
  gradient?: string;
  address: string;
  rating?: number;
  priceLevel?: string;
}
