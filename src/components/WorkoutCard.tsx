import React from 'react';
import { Workout } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Dumbbell, ChevronRight } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  return (
    <div className="md-card cursor-pointer group" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">
            {workout.notes || "Sesión de Entrenamiento"}
          </h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            {format(workout.date, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-all group-hover:bg-indigo-500/10">
          <ChevronRight className="w-5 h-5 transition-all group-hover:translate-x-0.5" />
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-xl uppercase tracking-tight">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          {workout.duration} min
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-xl uppercase tracking-tight">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
          {workout.totalVolume?.toLocaleString()} kg
        </div>
        {workout.totalReps && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-xl uppercase tracking-tight">
            <span className="text-indigo-400">#</span>
            {workout.totalReps} Reps
          </div>
        )}
      </div>
    </div>
  );
};
