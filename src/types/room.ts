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

export interface CreateRoomRequest {
  location: Location;
}

export interface CreateRoomResponse {
  roomId: string;
  code: string;
}

export interface JoinRoomRequest {
  code: string;
  userId: string;
}

export interface JoinRoomResponse {
  roomId: string;
  location: Location;
}
