import React, { useEffect, useState } from 'react';
import { Assessment, EmotionScale } from '../types';
import { emotionColors, emotionalScales } from '../constants';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface FeedbackModalProps {
  assessment: Assessment;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ assessment, onClose, theme }) => {
  const emotion = emotionalScales[assessment.emotion];
  const color = emotionColors[assessment.emotion];
  const levelInfo = emotion.levels.find(l => l.level === assessment.level);
  
  // Efeito para auto-fechar (opcional) ou apenas para garantir animação de entrada
  useEffect(() => {
    // Focus management se necessário
  }, []);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-white';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 relative ${bgClass}`}
        style={{ boxShadow: `0 0 40px ${color.glow}` }}
      >
        {/* Topo Decorativo */}
        <div 
          className="h-32 w-full relative flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color.light}, ${color.main})` }}
        >
          <div className="absolute inset-0 bg-white/10 pattern-dots" />
          
          <div className="relative z-10 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg">
             <Check className="w-10 h-10 text-white animate-bounce-short" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8 text-center">
            <h2 className={`text-2xl font-black mb-1 ${textClass}`}>Registro Salvo!</h2>
            <p className={`text-sm font-medium opacity-60 uppercase tracking-widest mb-6 ${textClass}`}>
                {emotion.name} • Nível {assessment.level}
            </p>

            {/* Pílula de Sabedoria */}
            <div className={`p-6 rounded-2xl mb-8 relative border-2 border-dashed transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pílula de Sabedoria
                </div>
                
                <p className={`text-lg font-medium italic leading-relaxed ${textSecondary}`}>
                    "{levelInfo?.feedback || "Sua autoconsciência é o primeiro passo para o equilíbrio."}"
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] hover:brightness-110 flex items-center justify-center gap-2 group"
                style={{ background: color.main }}
            >
                Continuar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};