import { useSyncExternalStore } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  date: string;
}

const SEED: CalendarEvent[] = [
  { id: 'evt-1', title: 'Community dinner', time: '6:00 PM', location: 'Club House', date: '2026-08-23' },
  { id: 'evt-2', title: 'Maintenance inspection', time: '10:00 AM', location: 'Block A', date: '2026-08-20' },
  { id: 'evt-3', title: 'Resident meeting', time: '7:30 PM', location: 'Zoom', date: '2026-08-25' },
];

let events: CalendarEvent[] = SEED;
let cachedEvents: CalendarEvent[] | null = null;

const listeners = new Set<() => void>();

function recompute() {
  cachedEvents = events;
}

function emit() {
  recompute();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

recompute();

export function getCalendarEvents(): CalendarEvent[] {
  return cachedEvents!;
}

export function addCalendarEvent(event: CalendarEvent) {
  events = [...events, event];
  emit();
}

export function useCalendarEvents(): CalendarEvent[] {
  return useSyncExternalStore(subscribe, getCalendarEvents);
}