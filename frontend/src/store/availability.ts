import { useSyncExternalStore } from 'react';

let isAway = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAvailability(): boolean {
  return isAway;
}

export function setAvailability(away: boolean) {
  if (isAway !== away) {
    isAway = away;
    emit();
  }
}

export function useAvailability(): boolean {
  return useSyncExternalStore(subscribe, getAvailability);
}