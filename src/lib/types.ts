export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  facilities: string[];
  isActive: boolean;
  color: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  date: string; // ISO string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  pax: number;
  specialRequest?: string;
  createdAt: string;
}
