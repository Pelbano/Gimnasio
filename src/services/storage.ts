import { Workout, Metric, Goal, Exercise } from '../types';

const KEYS = {
  WORKOUTS: 'fittrack_workouts',
  METRICS: 'fittrack_metrics',
  GOALS: 'fittrack_goals',
  CUSTOM_EXERCISES: 'fittrack_custom_exercises',
};

export const storage = {
  getWorkouts: (): Workout[] => {
    const data = localStorage.getItem(KEYS.WORKOUTS);
    if (!data) return [];
    return JSON.parse(data).map((w: any) => ({ ...w, date: new Date(w.date) }));
  },
  saveWorkouts: (workouts: Workout[]) => {
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
  },
  getCustomExercises: (): Exercise[] => {
    const data = localStorage.getItem(KEYS.CUSTOM_EXERCISES);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveCustomExercises: (exercises: Exercise[]) => {
    localStorage.setItem(KEYS.CUSTOM_EXERCISES, JSON.stringify(exercises));
  },
  getMetrics: (): Metric[] => {
    const data = localStorage.getItem(KEYS.METRICS);
    if (!data) return [];
    return JSON.parse(data).map((m: any) => ({ ...m, date: new Date(m.date) }));
  },
  saveMetrics: (metrics: Metric[]) => {
    localStorage.setItem(KEYS.METRICS, JSON.stringify(metrics));
  },
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    if (!data) return [];
    return JSON.parse(data).map((g: any) => ({ ...g, deadline: g.deadline ? new Date(g.deadline) : undefined }));
  },
  saveGoals: (goals: Goal[]) => {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  }
};
