/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { WorkoutCard } from './components/WorkoutCard';
import { Plus, Target, TrendingUp, History as HistoryIcon, LogOut, ChevronRight } from 'lucide-react';
import { Workout, Goal, Exercise } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutLogger } from './components/WorkoutLogger';
import { storage } from './services/storage';
import { DEFAULT_EXERCISES, MUSCLE_GROUPS } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLogging, setIsLogging] = useState(false);
  const [evolutionMetric, setEvolutionMetric] = useState<'volume' | 'reps' | 'sets' | 'maxWeight'>('volume');
  const [evolutionExerciseId, setEvolutionExerciseId] = useState<string>('Todos');
  
  // Filter state
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('Todos');
  const [filterExerciseId, setFilterExerciseId] = useState<string>('Todos');
  
  const [customExercises, setCustomExercises] = useState<Exercise[]>(() => {
    return storage.getCustomExercises();
  });

  const allExercises = useMemo(() => [...DEFAULT_EXERCISES, ...customExercises], [customExercises]);
  
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = storage.getWorkouts();
    return saved.length > 0 ? saved : [
      { id: '1', date: new Date(), duration: 45, notes: 'Pecho y Tríceps', totalVolume: 2450, totalReps: 120, exerciseIds: ['1', '10'] },
      { id: '2', date: new Date(Date.now() - 86400000 * 2), duration: 60, notes: 'Piernas (Intenso)', totalVolume: 5200, totalReps: 150, exerciseIds: ['3', '4'] },
    ];
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = storage.getGoals();
    return saved.length > 0 ? saved.filter(g => g.type !== 'Peso Corporal') : [
      { id: '1', type: 'Frecuencia', targetValue: 4, currentValue: 2 },
      { id: '2', type: 'Ejercicio PR', targetValue: 120, currentValue: 100, exerciseId: '1' },
    ];
  });

  useEffect(() => {
    storage.saveWorkouts(workouts);
  }, [workouts]);

  useEffect(() => {
    storage.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    storage.saveCustomExercises(customExercises);
  }, [customExercises]);

  const handleSaveWorkout = (data: { notes: string, sets: any[] }) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      date: new Date(),
      duration: 0,
      notes: data.notes || 'Entrenamiento',
      totalVolume: data.sets.reduce((acc, s) => acc + ((s.weight || 0) * (s.reps || 0)), 0),
      totalReps: data.sets.reduce((acc, s) => acc + (s.reps || 0), 0),
      totalSets: data.sets.length,
      exerciseIds: Array.from(new Set(data.sets.map(s => s.exerciseId).filter(Boolean))),
      sets: data.sets.map((s, i) => ({ ...s, id: `${Date.now()}-${i}`, workoutId: Date.now().toString() }))
    };
    setWorkouts([newWorkout, ...workouts]);
    setIsLogging(false);
    setActiveTab('home');
  };

  const handleAddCustomExercise = (exercise: Exercise) => {
    setCustomExercises([...customExercises, exercise]);
  };

  const todayWorkout = useMemo(() => {
    return workouts.find(w => format(w.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const matchesMuscle = filterMuscleGroup === 'Todos' || 
        w.exerciseIds?.some(id => allExercises.find(ex => ex.id === id)?.category === filterMuscleGroup);
      
      const matchesExercise = filterExerciseId === 'Todos' || 
        w.exerciseIds?.includes(filterExerciseId);
      
      return matchesMuscle && matchesExercise;
    });
  }, [workouts, filterMuscleGroup, filterExerciseId, allExercises]);

  return (
    <div className="min-h-screen bg-[#1C1B1F] pb-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-end relative z-10">
        <div>
          <p className="text-slate-400 font-medium text-xs leading-none mb-1 uppercase tracking-wider">
            {format(new Date(), 'EEEE, d MMMM', { locale: es })}
          </p>
          <h1 className="text-2xl font-bold text-white">¡Hola de nuevo!</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          U
        </button>
      </header>

      <main className="px-6 space-y-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Quick Summary Card */}
              <div className="bg-[#2B2930] rounded-[32px] p-6 border border-slate-700/50 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Hoy</h2>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold">
                      {todayWorkout ? 'COMPLETADO' : 'PENDIENTE'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Volumen Total</p>
                      <p className="text-2xl font-display text-white">{(todayWorkout?.totalVolume || 0)} <span className="text-sm text-slate-500">kg</span></p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Repeticiones</p>
                      <p className="text-2xl font-display text-emerald-400">{(todayWorkout?.totalReps || 0)} <span className="text-sm opacity-60">reps</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsLogging(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] py-4 flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Entrenar</span>
                </button>
                <button 
                  onClick={() => setActiveTab('workouts')}
                  className="flex-1 bg-[#2B2930] text-white rounded-[24px] py-4 border border-slate-700/50 flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <HistoryIcon className="w-6 h-6 mb-1 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Historial</span>
                </button>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className="flex-1 bg-[#2B2930] text-white rounded-[24px] py-4 border border-slate-700/50 flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <Target className="w-6 h-6 mb-1 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Metas</span>
                </button>
              </div>

              {/* Recent Activity */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-white tracking-tight">Actividad Reciente</h2>
                  <button 
                    onClick={() => setActiveTab('workouts')}
                    className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-full"
                  >
                    Ver Todo
                  </button>
                </div>
                <div className="space-y-4">
                  {workouts.length > 0 ? (
                    workouts.slice(0, 3).map(workout => (
                      <WorkoutCard key={workout.id} workout={workout} onClick={() => {}} />
                    ))
                  ) : (
                    <div className="md-card bg-slate-900 shadow-none border border-dashed border-slate-700/50 py-8 text-center text-slate-500 italic">
                      No hay entrenamientos registrados aún.
                    </div>
                  )}
                </div>
              </section>

              {/* Goals Progress */}
              <section className="pb-4">
                <h2 className="text-lg font-bold text-white tracking-tight mb-4">Progreso de Metas</h2>
                <div className="space-y-4">
                  {goals.map(goal => {
                    const progress = Math.min(100, Math.round((goal.targetValue > goal.currentValue ? (goal.currentValue / goal.targetValue) : (goal.targetValue / goal.currentValue)) * 100));
                    return (
                      <div key={goal.id} className="bg-[#2B2930] rounded-[24px] p-5 border border-slate-700/50">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{goal.type}: {goal.targetValue}</span>
                          <span className="text-xs text-emerald-400 font-black">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}


          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-white">Evolución</h2>
                <div className="flex gap-1 bg-[#2B2930] p-1 rounded-xl border border-slate-700/50">
                  {([
                    { id: 'volume', label: 'Vol' },
                    { id: 'reps', label: 'Reps' },
                    { id: 'sets', label: 'Series' },
                    ...(evolutionExerciseId !== 'Todos' ? [{ id: 'maxWeight', label: 'Max' } as const] : [])
                  ] as const).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setEvolutionMetric(m.id as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                        evolutionMetric === m.id 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#2B2930] rounded-[32px] p-6 border border-slate-700/50">
                <div className="mb-6">
                  <select 
                    className="w-full bg-[#1C1B1F] border border-slate-700/50 rounded-xl py-2 px-3 text-[10px] font-bold text-slate-400 outline-none focus:border-indigo-500 appearance-none"
                    value={evolutionExerciseId}
                    onChange={(e) => setEvolutionExerciseId(e.target.value)}
                  >
                    <option value="Todos">Global (Todas las sesiones)</option>
                    {allExercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={workouts.slice(0, 10).reverse().map(w => {
                      if (evolutionExerciseId === 'Todos') {
                        return { 
                          fecha: format(w.date, 'dd/MM'), 
                          volume: w.totalVolume,
                          reps: w.totalReps,
                          sets: w.totalSets 
                        };
                      } else {
                        // Filter sets for this specific exercise
                        const exerciseSets = w.sets?.filter(s => s.exerciseId === evolutionExerciseId) || [];
                        if (exerciseSets.length === 0) return null;
                        
                        return {
                          fecha: format(w.date, 'dd/MM'),
                          volume: exerciseSets.reduce((acc, s) => acc + (s.weight * s.reps), 0),
                          reps: exerciseSets.reduce((acc, s) => acc + s.reps, 0),
                          sets: exerciseSets.length,
                          maxWeight: Math.max(...exerciseSets.map(s => s.weight))
                        };
                      }
                    }).filter(Boolean)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis 
                        dataKey="fecha" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis hide={true} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={evolutionMetric} 
                        stroke={evolutionMetric === 'volume' ? '#6366f1' : evolutionMetric === 'reps' ? '#10b981' : evolutionMetric === 'sets' ? '#f59e0b' : '#ec4899'} 
                        strokeWidth={4} 
                        dot={{ fill: evolutionMetric === 'volume' ? '#6366f1' : evolutionMetric === 'reps' ? '#10b981' : evolutionMetric === 'sets' ? '#f59e0b' : '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2B2930] rounded-[28px] border border-slate-700/50 flex flex-col items-center justify-center py-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Récord Volumen</p>
                  <p className="text-2xl font-display text-white">{Math.max(...workouts.map(w => w.totalVolume || 0))} <span className="text-xs opacity-50">kg</span></p>
                </div>
                <div className="bg-[#2B2930] rounded-[28px] border border-slate-700/50 flex flex-col items-center justify-center py-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Media Sesión</p>
                  <p className="text-2xl font-display text-indigo-400">
                    {Math.round(workouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0) / workouts.length)} <span className="text-xs opacity-50 text-white">kg</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'workouts' && (
            <motion.div
              key="workouts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Historial</h2>
                <button 
                  onClick={() => setIsLogging(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg shadow-indigo-500/20"
                >
                  Nuevo +
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                  {['Todos', ...MUSCLE_GROUPS].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilterMuscleGroup(cat);
                        setFilterExerciseId('Todos');
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        filterMuscleGroup === cat 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                          : 'bg-[#2B2930] border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <select 
                  className="w-full bg-[#2B2930] border border-slate-700/50 rounded-2xl py-3 px-4 text-xs font-bold text-slate-200 outline-none focus:border-indigo-500 appearance-none"
                  value={filterExerciseId}
                  onChange={(e) => setFilterExerciseId(e.target.value)}
                >
                  <option value="Todos">Todos los Ejercicios</option>
                  {(filterMuscleGroup === 'Todos' 
                    ? allExercises 
                    : allExercises.filter(ex => ex.category === filterMuscleGroup)
                  ).map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pb-4">
                {filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} onClick={() => {}} />
                  ))
                ) : (
                  <div className="bg-[#2B2930] rounded-[24px] border border-dashed border-slate-700/50 py-12 text-center text-slate-500 italic px-6">
                    No se encontraron sesiones con estos filtros.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center py-8">
                <div className="w-24 h-24 rounded-full bg-indigo-600 border-4 border-[#2B2930] shadow-xl flex items-center justify-center mb-4 text-white text-3xl font-bold">
                  U
                </div>
                <h2 className="text-2xl font-bold text-white">Tu Perfil</h2>
                <p className="text-slate-500 text-sm italic">Viernes, 24 de Mayo</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#2B2930] border border-slate-700/50 rounded-[28px] p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-slate-200">Objetivos Mensuales</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </div>
                
                <div className="bg-[#2B2930] border border-slate-700/50 rounded-[28px] p-5 flex justify-between items-center cursor-pointer hover:bg-red-500/10 group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 group-hover:text-red-500">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-slate-200 group-hover:text-red-400">Cerrar Sesión</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {isLogging && (
          <WorkoutLogger 
            exercises={allExercises}
            onAddCustomExercise={handleAddCustomExercise}
            onSave={handleSaveWorkout}
            onCancel={() => setIsLogging(false)}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

