import { Room, Booking, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const discoveryHubImage = PlaceHolderImages.find(img => img.id === 'discovery-hub')?.imageUrl;
const room1Image = PlaceHolderImages.find(img => img.id === 'meeting-room-1')?.imageUrl;
const room2Image = PlaceHolderImages.find(img => img.id === 'meeting-room-2')?.imageUrl;

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    role: 'user',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: 'admin1',
    email: 'admin@merbook.com',
    displayName: 'Admin User',
    role: 'admin',
    avatarUrl: 'https://picsum.photos/seed/admin1/100/100'
  }
];

export const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Discovery Hub',
    capacity: 12,
    description: 'High-tech room with video conferencing.',
    facilities: ['AC', 'HDMI Connectivity', 'Notebook/PC', 'Projector', 'Smart Camera', 'TV', 'Whiteboard', 'Wi-Fi'].sort(),
    isActive: true,
    color: '#226DD4',
    imageUrl: discoveryHubImage || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1080'
  },
  {
    id: 'room-2',
    name: 'Silicon Lounge',
    capacity: 4,
    description: 'Cozy room for small group discussions.',
    facilities: ['Coffee', 'HDMI Connectivity', 'Hybrid-Ready', 'Whiteboard'].sort(),
    isActive: true,
    color: '#1ACAEA',
    imageUrl: room1Image || 'https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?auto=format&fit=crop&q=80&w=1080'
  },
  {
    id: 'room-3',
    name: 'Apollo Boardroom',
    capacity: 20,
    description: 'Formal boardroom for executive meetings.',
    facilities: ['AC', 'Audio System', 'HDMI Connectivity', 'Projector', 'Smart Camera'].sort(),
    isActive: true,
    color: '#0D47A1',
    imageUrl: room2Image || 'https://images.unsplash.com/photo-1631247022917-53f9af27d719?auto=format&fit=crop&q=80&w=1080'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    roomId: 'room-1',
    roomName: 'Discovery Hub',
    userId: 'user1',
    userName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    title: 'Weekly Sync',
    pax: 5,
    specialRequest: 'Need coffee for 5 people',
    createdAt: new Date().toISOString()
  }
];
