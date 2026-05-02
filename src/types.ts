export type MuscleGroup = 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core' | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  isCustom?: boolean;
}

export interface SetRecord {
  id: string;
  workoutId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  order: number;
}

export interface Workout {
  id: string;
  date: Date;
  duration: number; // minutes
  notes?: string;
  totalVolume?: number;
  totalReps?: number;
  totalSets?: number;
  exerciseIds?: string[]; // cache for faster history list
  sets?: SetRecord[];
}

export interface Metric {
  id: string;
  date: Date;
  bodyWeight: number;
  bodyFat?: number;
  photoUrl?: string;
}

export interface Goal {
  id: string;
  type: 'Peso Corporal' | 'Ejercicio PR' | 'Frecuencia';
  targetValue: number;
  currentValue: number;
  deadline?: Date;
  exerciseId?: string;
}
