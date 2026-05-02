import React, { useState } from 'react';
import { X, Scale, Percent, Camera } from 'lucide-react';

interface MetricLoggerProps {
  onSave: (data: { weight: number, fat?: number }) => void;
  onCancel: () => void;
}

export const MetricLogger = ({ onSave, onCancel }: MetricLoggerProps) => {
  const [weight, setWeight] = useState<string>('');
  const [fat, setFat] = useState<string>('');

  return (
    <div className="fixed inset-0 bg-[#1C1B1F] z-[60] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#1C1B1F] sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Métricas Corporales</h2>
        <button 
          onClick={() => onSave({ weight: parseFloat(weight), fat: fat ? parseFloat(fat) : undefined })}
          className="text-emerald-400 font-bold px-4 py-2 disabled:opacity-30"
          disabled={!weight}
        >
          Guardar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        <div className="bg-[#2B2930] rounded-[32px] p-8 border border-slate-700/50 space-y-8">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Peso Actual (kg)</label>
            <div className="relative">
              <Scale className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 opacity-50" />
              <input 
                type="number" 
                step="0.1"
                placeholder="0.0"
                autoFocus
                className="w-full bg-transparent border-b-2 border-slate-700 py-4 pl-10 text-4xl font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Grasa Corporal % (Opcional)</label>
            <div className="relative">
              <Percent className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 opacity-50" />
              <input 
                type="number" 
                step="0.1"
                placeholder="0.0"
                className="w-full bg-transparent border-b-2 border-slate-700 py-4 pl-10 text-4xl font-bold text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-5 rounded-[24px] bg-slate-800/50 border-2 border-dashed border-slate-700/50 text-slate-500 font-bold text-xs hover:bg-slate-800 transition-all uppercase tracking-widest">
            <Camera className="w-5 h-5 text-indigo-400" />
            Foto de Progreso
          </button>
        </div>

        <button 
          onClick={() => onSave({ weight: parseFloat(weight), fat: fat ? parseFloat(fat) : undefined })}
          disabled={!weight}
          className="md-button-primary w-full py-4 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
        >
          Confirmar Registro
        </button>
      </div>
    </div>
  );
};
