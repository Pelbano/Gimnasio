import { Exercise } from './types';

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Press de Banca', category: 'Pecho' },
  { id: '2', name: 'Aperturas con Mancuernas', category: 'Pecho' },
  { id: '3', name: 'Sentadilla Libre', category: 'Piernas' },
  { id: '4', name: 'Peso Muerto Rumano', category: 'Piernas' },
  { id: '5', name: 'Dominadas', category: 'Espalda' },
  { id: '6', name: 'Remo con Barra', category: 'Espalda' },
  { id: '7', name: 'Press Militar', category: 'Hombros' },
  { id: '8', name: 'Elevaciones Laterales', category: 'Hombros' },
  { id: '9', name: 'Curl de Bíceps', category: 'Brazos' },
  { id: '10', name: 'Press Francés', category: 'Brazos' },
  { id: '11', name: 'Plancha Abdominal', category: 'Core' },
  { id: '12', name: 'Cinta de Correr', category: 'Cardio' },
];

export const MUSCLE_GROUPS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'] as const;
