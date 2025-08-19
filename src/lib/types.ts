export type Task = {
  id: string;
  title: string;
  due?: string;
  remindAt?: string;
  completed: boolean;
};

export type TreeStage = 'seed' | 'sprout' | 'plant' | 'small' | 'full' | 'withered';

export type ForestSession = {
  id: string;
  sessionLength: number;
  completed: boolean;
  treeStage: TreeStage;
  timestamp: string;
  pointsEarned: number;
};

export type Streaks = {
  current: number;
  best: number;
  lastDone?: string;
};

export type AppState = {
  tasks: Task[];
  forest: ForestSession[];
  points: number;
  streaks: Streaks;
  username: string;
  badges: string[];
  preferences: {
    theme: 'system' | 'light' | 'dark';
    focusMinutes: number;
    breakMinutes: number;
    notifications: boolean;
  };
};

export const BADGE_THRESHOLDS: Record<string, number> = {
  Sproutling: 50,
  Sapling: 200,
  'Oak Master': 500,
};
