import React from 'react';
import { Theme } from '../types';

interface NeuroGlossaryProps {
  theme: Theme;
}

const hormones = [
  { name: 'Cortisol', func: 'Desliga o longo prazo', color: '#60A5FA' }, // Blue-400
  { name: 'Dopamina', func: 'Impulso de recompensa', color: '#FBBF24' }, // Amber-400
  { name: 'Serotonina', func: 'Segurança', color: '#34D399' }, // Emerald-400
  { name: 'Ocitocina', func: 'Confiança', color: '#EC4899' }, // Pink-500
  { name: 'Endorfina', func: 'O anestésico', color: '#F472B6' }, // Pink-400
  { name: 'Adrenalina', func: 'Potência máxima', color: '#EF4444' }, // Red-500
  { name: 'Noradrenalina', func: 'Alerta', color: '#F97316' }, // Orange-500
  { name: 'Testosterona', func: 'Força', color: '#D97706' }, // Amber-600/Bronze
  { name: 'Prolactina', func: 'Saciedade', color: '#818CF8' }, // Indigo-400
];

export const NeuroGlossary: React.FC<NeuroGlossaryProps> = ({ theme }) => {
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';

  return (
    <div className={`mt-8 rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
        🧬 Glossário Neuroquímico
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {hormones.map((h) => (
          <div 
            key={h.name} 
            className={`flex items-center gap-3 p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}
          >
            <div 
              className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
              style={{ backgroundColor: h.color, color: h.color }} 
            />
            <div className="flex flex-col">
              <span className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>{h.name}</span>
              <span className={`text-xs font-medium opacity-80 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {h.func}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};