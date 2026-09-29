import { Restaurant } from './restaurant';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Room {
  id: string;
  code: string;
  location: Location;
  /** Anonymous per-tab user IDs, at most two. */
  users: string[];
  restaurants: Restaurant[];
  /** Restaurant IDs both users swiped right on. */
  matches: string[];
  status: 'waiting' | 'active';
  createdAt: number;
}
