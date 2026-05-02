import React, { useState } from 'react';
import { MuscleGroup, Exercise, SetRecord } from '../types';
import { Plus, Trash2, Check, X, Dumbbell, Hash, Weight, ChevronLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSCLE_GROUPS } from '../constants';

interface WorkoutLoggerProps {
  exercises: Exercise[];
  onSave: (workoutInfo: { notes: string, sets: Partial<SetRecord>[] }) => void;
  onCancel: () => void;
  onAddCustomExercise: (exercise: Exercise) => void;
}

export const WorkoutLogger = ({ exercises, onSave, onCancel, onAddCustomExercise }: WorkoutLoggerProps) => {
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<Partial<SetRecord>[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  
  // Custom exercise form state
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState(MUSCLE_GROUPS[0]);

  const addSet = (exerciseId: string) => {
    const lastSetOfThisExercise = [...sets].reverse().find(s => s.exerciseId === exerciseId);
    setSets([...sets, {
      exerciseId,
      weight: lastSetOfThisExercise?.weight || 0,
      reps: lastSetOfThisExercise?.reps || 0,
      order: sets.filter(s => s.exerciseId === exerciseId).length + 1
    }]);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: keyof SetRecord, value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const activeExercises = Array.from(new Set(sets.map(s => s.exerciseId)))
    .map(id => exercises.find(e => e.id === id))
    .filter(Boolean) as Exercise[];

  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) return;
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      category: newExerciseCategory as any
    };
    onAddCustomExercise(newEx);
    addSet(newEx.id);
    setIsCreatingExercise(false);
    setIsAddingExercise(false);
    setNewExerciseName('');
  };

  return (
    <div className="fixed inset-0 bg-[#1C1B1F] z-[60] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#1C1B1F] sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Nueva Sesión</h2>
        <button 
          onClick={() => onSave({ notes, sets })}
          className="text-indigo-400 font-bold px-4 py-2 disabled:opacity-30"
          disabled={sets.length === 0}
        >
          Hecho
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* Notes */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Nombre de la Sesión</label>
          <input 
            type="text" 
            placeholder="Ej: Empuje, Día A, Torso..."
            className="md-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Exercises List */}
        <div className="space-y-6">
          {activeExercises.map((exercise) => (
            <div key={exercise.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-lg font-bold text-indigo-400">{exercise.name}</h3>
                <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-wider">{exercise.category}</span>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                  <span>Serie</span>
                  <span className="text-center">Peso (kg)</span>
                  <span className="text-center">Reps</span>
                  <span></span>
                </div>
                {sets.filter(s => s.exerciseId === exercise.id).map((set, setIndexInExercise) => {
                  const globalIndex = sets.findIndex(s => s === set);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={`${exercise.id}-${setIndexInExercise}`}
                      className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                        {globalIndex + 1}
                      </div>
                      <input 
                        type="number"
                        className="bg-[#2B2930] border border-slate-700/50 rounded-xl py-2 px-3 text-center text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(globalIndex, 'weight', parseFloat(e.target.value) || 0)}
                      />
                      <input 
                        type="number"
                        className="bg-[#2B2930] border border-slate-700/50 rounded-xl py-2 px-3 text-center text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(globalIndex, 'reps', parseInt(e.target.value) || 0)}
                      />
                      <button 
                        onClick={() => removeSet(globalIndex)}
                        className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              <button 
                onClick={() => addSet(exercise.id)}
                className="w-full py-3 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-[11px] font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest"
              >
                + Añadir Serie
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsAddingExercise(true)}
          className="md-button-secondary w-full py-4 bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
        >
          <Dumbbell className="w-5 h-5" />
          Añadir Ejercicio
        </button>
      </div>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {isAddingExercise && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 bg-[#1C1B1F] z-20 flex flex-col"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#1C1B1F] z-30">
              <h3 className="text-xl font-bold text-white tracking-tight">Elegir Ejercicio</h3>
              <button onClick={() => setIsAddingExercise(false)} className="p-2 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <button
                onClick={() => setIsCreatingExercise(true)}
                className="w-full flex items-center gap-4 p-5 rounded-[24px] bg-indigo-600 hover:bg-indigo-500 transition-all text-white border border-transparent shadow-lg shadow-indigo-500/20"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Nuevo Ejercicio Personalizado</p>
                  <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Crea el tuyo propio</p>
                </div>
              </button>

              <div className="h-px bg-slate-800 my-4" />

              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    addSet(ex.id);
                    setIsAddingExercise(false);
                  }}
                  className="w-full flex justify-between items-center p-5 rounded-[24px] bg-[#2B2930] hover:bg-slate-800 transition-all text-left border border-slate-700/50 hover:border-indigo-500/50"
                >
                  <div>
                    <p className="font-bold text-slate-200">{ex.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{ex.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Exercise Form Overlay */}
            <AnimatePresence>
              {isCreatingExercise && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#1C1B1F] z-40 flex flex-col p-6 space-y-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setIsCreatingExercise(false)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase">
                      <ChevronLeft className="w-5 h-5" /> Volver
                    </button>
                    <h4 className="text-white font-bold">Crear Ejercicio</h4>
                    <div className="w-10" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Press con Mancuernas Inclinado"
                        className="md-input"
                        autoFocus
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Grupo Muscular</label>
                      <div className="grid grid-cols-2 gap-2">
                        {MUSCLE_GROUPS.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setNewExerciseCategory(cat)}
                            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                              newExerciseCategory === cat 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                : 'bg-[#2B2930] border-slate-700/50 text-slate-400'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCreateExercise}
                    disabled={!newExerciseName.trim()}
                    className="md-button-primary w-full py-4 mt-auto disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    Crear y Añadir
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};
