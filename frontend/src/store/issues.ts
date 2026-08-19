import React from 'react';
import { useSyncExternalStore } from 'react';
import { Feather } from '@expo/vector-icons';

export type FeatherName = React.ComponentProps<typeof Feather>['name'];

export interface Issue {
  id: string;
  category: string;
  icon: FeatherName;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  time: string;
}

export const ISSUE_CATEGORIES = [
  { id: 'Plumbing', label: 'Plumbing', icon: 'droplet' as FeatherName, color: '#1D6FC4', bg: '#E3F2FD', hint: 'Leaks, taps, pipes' },
  { id: 'Electrical', label: 'Electrical', icon: 'zap' as FeatherName, color: '#D97706', bg: '#FEF3C7', hint: 'Lights, switches, sockets' },
  { id: 'Lift', label: 'Lift', icon: 'arrow-up' as FeatherName, color: '#7E22CE', bg: '#F3E8FF', hint: 'Elevator, doors, noise' },
  { id: 'Custom', label: 'Custom', icon: 'edit-3' as FeatherName, color: '#1B7A44', bg: '#E8F5E9', hint: 'Something else' },
];

let issues: Issue[] = [
  { id: 'REQ-0192', category: 'Plumbing', icon: 'droplet', title: 'Leaking pipe in master bathroom', status: 'In Progress', time: 'Today, 10:30 AM' },
];

let cachedIssues: Issue[] | null = null;
let cachedOpenIssues: Issue[] | null = null;

const listeners = new Set<() => void>();

function recompute() {
  cachedIssues = issues;
  cachedOpenIssues = issues.filter((i) => i.status !== 'Resolved');
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

export function getIssues(): Issue[] {
  return cachedIssues!;
}

export function getOpenIssues(): Issue[] {
  return cachedOpenIssues!;
}

export function addIssue(issue: Issue) {
  issues = [issue, ...issues];
  emit();
}

export function removeIssue(id: string) {
  issues = issues.filter((i) => i.id !== id);
  emit();
}

export function useIssues(): Issue[] {
  return useSyncExternalStore(subscribe, getIssues);
}

export function useOpenIssues(): Issue[] {
  return useSyncExternalStore(subscribe, getOpenIssues);
}