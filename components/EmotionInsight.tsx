import React from 'react';
import { EmotionLevel, Theme } from '../types';
import { EMOTION_INSIGHTS } from '../constants';
import { Activity } from 'lucide-react';

interface EmotionInsightProps {
  level: EmotionLevel;
  theme: Theme;
  emotionKey: string;
  onRegister: () => void;
}

export const EmotionInsight: React.FC<EmotionInsightProps> = ({ level, theme, emotionKey, onRegister }) => {
  const data = EMOTION_INSIGHTS[emotionKey]?.[level.level] || { 
    science: "Informação neurobiológica não disponível para este nível.", 
    example: "Exemplo não disponível.",
    bodyChanges: "Informação somática não disponível."
  };
  
  const isExtreme = level.level >= 6;
  const textColor = theme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const headingColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-700';
  const bodyColor = theme === 'dark' ? 'text-pink-300' : 'text-pink-700';

  // Define color schemes based on intensity
  const containerClass = isExtreme 
    ? (theme === 'dark' ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-500') 
    : (theme === 'dark' ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-500');
    
  const accentColor = isExtreme 
    ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') 
    : (theme === 'dark' ? 'text-blue-400' : 'text-blue-600');

  return (
    <div className={`mt-4 p-5 rounded-lg border-l-4 space-y-6 ${containerClass} animate-in fade-in slide-in-from-top-4 duration-500`}>
      {/* Seção Neurobiologia */}
      <div>
        <div className="flex items-center gap-2 mb-2">
           <span className="text-lg">{isExtreme ? '⚠️' : '🧠'}</span>
           <p className={`text-sm font-bold uppercase tracking-wider ${accentColor}`}>
             {isExtreme ? 'Decisão Reptiliana - Nível ' + level.level : 'Neurobiologia - Nível ' + level.level}
           </p>
        </div>
        <p className={`text-sm leading-relaxed text-justify ${textColor}`}>
          {data.science}
        </p>
      </div>

      {/* Seção Somática (Corpo) - NOVA */}
      <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-pink-900/10 border-pink-500/30' : 'bg-pink-50 border-pink-200'}`}>
        <div className="flex items-center gap-2 mb-2">
           <Activity className={`w-4 h-4 ${bodyColor}`} />
           <p className={`text-sm font-bold uppercase tracking-wider ${bodyColor}`}>
             O Que Acontece no Corpo
           </p>
        </div>
        <p className={`text-sm leading-relaxed ${textColor}`}>
          {data.bodyChanges}
        </p>
      </div>

      {/* Seção Exemplo Real */}
      <div>
        <div className="flex items-center gap-2 mb-2">
           <span className="text-lg">📋</span>
           <p className={`text-sm font-bold uppercase tracking-wider ${headingColor}`}>
             Exemplo Real
           </p>
        </div>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
           <p className={`text-sm leading-relaxed italic ${textColor}`}>
             "{data.example}"
           </p>
        </div>
      </div>

      {/* Ação */}
      <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
        <button 
          onClick={onRegister} 
          className="w-full px-4 py-3 rounded-lg font-bold text-sm text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" 
          style={{ 
            background: isExtreme 
              ? 'linear-gradient(135deg, #EF4444, #B91C1C)' 
              : 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
          }}
        >
          <span>📝</span>
          Registrar Esta Emoção para Reflexão
        </button>
      </div>
    </div>
  );
};