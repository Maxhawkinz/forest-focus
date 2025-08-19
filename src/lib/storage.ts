import type { AppState, ForestSession, Streaks, Task } from './types';
import { BADGE_THRESHOLDS } from './types';

const STORAGE_KEY = 'forest_focus_state_v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('no-state');
    const parsed = JSON.parse(raw) as AppState;
    return parsed;
  } catch {
    const defaultState: AppState = {
      tasks: [],
      forest: [],
      points: 0,
      streaks: { current: 0, best: 0 },
      username: 'You',
      badges: [],
      preferences: {
        theme: 'system',
        focusMinutes: 25,
        breakMinutes: 5,
        notifications: false,
      },
    };
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function computeBadges(points: number, streaks: Streaks): string[] {
  const badges: string[] = [];
  for (const [name, threshold] of Object.entries(BADGE_THRESHOLDS)) {
    if (points >= threshold) badges.push(name);
  }
  if (streaks.current >= 7) badges.push('Weekly Warrior');
  return badges;
}

export function updateStreaks(current: Streaks): Streaks {
  const last = current.lastDone ? new Date(current.lastDone) : undefined;
  const now = new Date();
  const lastDay = last ? new Date(last.getFullYear(), last.getMonth(), last.getDate()) : undefined;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let nextCurrent = current.current;
  if (!last) {
    nextCurrent = 1;
  } else if (lastDay?.getTime() === today.getTime()) {
    nextCurrent = current.current; // already counted today
  } else if (lastDay?.getTime() === yesterday.getTime()) {
    nextCurrent = current.current + 1; // continued streak
  } else {
    nextCurrent = 1; // reset
  }
  const best = Math.max(current.best, nextCurrent);
  return { current: nextCurrent, best, lastDone: now.toISOString() };
}

export function applyPoints(basePoints: number, streaks: Streaks): number {
  // Simple multiplier: +5% per current streak day, cap 2x
  const multiplier = Math.min(1 + 0.05 * streaks.current, 2);
  return Math.round(basePoints * multiplier);
}

export function addTask(state: AppState, task: Omit<Task, 'id' | 'completed'> & { id: string }): AppState {
  const next: AppState = { ...state, tasks: [...state.tasks, { ...task, completed: false }] };
  saveState(next);
  return next;
}

export function updateTask(state: AppState, task: Task): AppState {
  const next: AppState = { ...state, tasks: state.tasks.map(t => (t.id === task.id ? { ...task } : t)) };
  saveState(next);
  return next;
}

export function removeTask(state: AppState, id: string): AppState {
  const next: AppState = { ...state, tasks: state.tasks.filter(t => t.id !== id) };
  saveState(next);
  return next;
}

export function toggleTaskComplete(state: AppState, id: string): AppState {
  const before = state.tasks.find(t => t.id === id);
  if (!before) return state;

  const toggled = { ...before, completed: !before.completed };
  let next: AppState = { ...state, tasks: state.tasks.map(t => (t.id === id ? toggled : t)) };

  if (toggled.completed) {
    const newStreaks = updateStreaks(state.streaks);
    const earned = applyPoints(5, newStreaks);
    const newPoints = state.points + earned;
    const newBadges = Array.from(new Set([...
      computeBadges(newPoints, newStreaks),
    ]));
    next = { ...next, streaks: newStreaks, points: newPoints, badges: newBadges };
  }

  saveState(next);
  return next;
}

export function addForestSession(state: AppState, session: ForestSession): AppState {
  let next: AppState = { ...state, forest: [session, ...state.forest] };
  if (session.completed) {
    const newStreaks = updateStreaks(state.streaks);
    const earned = applyPoints(session.pointsEarned, newStreaks);
    const newPoints = state.points + earned;
    const newBadges = Array.from(new Set([...
      computeBadges(newPoints, newStreaks),
    ]));
    next = { ...next, streaks: newStreaks, points: newPoints, badges: newBadges };
  }
  saveState(next);
  return next;
}

export function setUsername(state: AppState, name: string): AppState {
  const next = { ...state, username: name };
  saveState(next);
  return next;
}

export function setPreferences(state: AppState, prefs: Partial<AppState['preferences']>): AppState {
  const next = { ...state, preferences: { ...state.preferences, ...prefs } };
  saveState(next);
  return next;
}
