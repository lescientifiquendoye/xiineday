import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserEvent {
  id?: string;
  title: string;
  event_type: string;
  location: string;
  event_date: string;
  description?: string;
  weather_score?: number;
  created_at?: string;
  updated_at?: string;
}

let mockEventsStore: UserEvent[] = [
  {
    id: '1',
    title: 'Semis de maïs - Parcelle A',
    event_type: 'Semis',
    location: 'Dakar',
    event_date: '2025-10-10',
    description: 'Préparation du terrain et semis de maïs dans la parcelle A',
    weather_score: 85,
    created_at: '2025-10-04T10:00:00Z',
    updated_at: '2025-10-04T10:00:00Z',
  },
  {
    id: '2',
    title: 'Irrigation - Zone Nord',
    event_type: 'Irrigation',
    location: 'Dakar',
    event_date: '2025-10-12',
    description: 'Irrigation programmée pour la zone nord',
    weather_score: 72,
    created_at: '2025-10-04T11:00:00Z',
    updated_at: '2025-10-04T11:00:00Z',
  },
  {
    id: '3',
    title: 'Récolte tomates',
    event_type: 'Récolte',
    location: 'Thiès',
    event_date: '2025-10-20',
    description: 'Récolte des tomates cultivées en serre',
    weather_score: 90,
    created_at: '2025-10-04T12:00:00Z',
    updated_at: '2025-10-04T12:00:00Z',
  },
];

export async function createEvent(event: Omit<UserEvent, 'id' | 'created_at' | 'updated_at'>) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newEvent: UserEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockEventsStore.push(newEvent);
  return newEvent;
}

export async function getEvents(location?: string, startDate?: string, endDate?: string) {
  await new Promise(resolve => setTimeout(resolve, 200));

  let filtered = [...mockEventsStore];

  if (location) {
    filtered = filtered.filter(e => e.location === location);
  }

  if (startDate) {
    filtered = filtered.filter(e => e.event_date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(e => e.event_date <= endDate);
  }

  return filtered.sort((a, b) => a.event_date.localeCompare(b.event_date));
}

export async function updateEvent(id: string, updates: Partial<UserEvent>) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockEventsStore.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }

  mockEventsStore[index] = {
    ...mockEventsStore[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return mockEventsStore[index];
}

export async function deleteEvent(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockEventsStore.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }

  mockEventsStore.splice(index, 1);
  return true;
}
