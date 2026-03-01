import React, { useState } from 'react';
import { EmotionLevel, Theme } from '../types';
import { EMOTION_INSIGHTS, emotionColors, emotionalScales } from '../constants';
import { Activity, BookOpen, Brain, Lightbulb, Microscope, Quote } from 'lucide-react';
import { TTSButton } from './TTSButton';

interface EmotionInsightProps {
  level: EmotionLevel;
  theme: Theme;
  emotionKey: string;
  onRegister: () => void;
}

export const EmotionInsight: React.FC<EmotionInsightProps> = ({ level, theme, emotionKey, onRegister }) => {
  const [mode, setMode] = useState<'layman' | 'scientific'>('layman');
  
  const scaleLevel = emotionalScales[emotionKey]?.levels[level.level - 1];

  // Fallback seguro se não houver dados específicos
  const defaultData = {
    layman: { 
      description: scaleLevel?.desc || "Informação detalhada em breve.", 
      advice: scaleLevel?.feedback || "Respire e observe." 
    },
    scientific: { 
      mechanism: `Ativação relacionada a ${scaleLevel?.label || 'esta emoção'}.`, 
      source: "Dados neurobiológicos gerais" 
    },
    body: { 
      sensation: "Sensações variam de acordo com a intensidade.", 
      why: "Resposta fisiológica individual." 
    }
  };

  const fullData = EMOTION_INSIGHTS[emotionKey]?.[level.level];
  const data = fullData || defaultData;

  const color = emotionColors[emotionKey];
  const isDark = theme === 'dark';

  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  
  // Configuração dinâmica de estilos baseada no modo
  const activeTabClass = isDark 
    ? 'bg-white/10 text-white shadow-inner border-white/20' 
    : 'bg-white text-slate-900 shadow-sm border-slate-200';
    
  const inactiveTabClass = isDark
    ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100';

  const ttsText = mode === 'layman' 
    ? `${data.layman.description}. Conselho: ${data.layman.advice}`
    : `Mecanismo: ${data.scientific.mechanism}. Fonte: ${data.scientific.source}. Reação corporal: ${data.body.why}`;

  return (
    <div className={`mt-6 rounded-2xl overflow-hidden border transition-all duration-500 bg-noise ${isDark ? 'bg-slate-900/40 border-slate-700/50' : 'bg-white/60 border-white/60 shadow-xl shadow-slate-200/50'}`}>
      
      {/* Header com Abas */}
      <div className={`flex items-center justify-between p-2 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
         <div className="flex bg-slate-500/10 p-1 rounded-xl">
            <button
                onClick={() => setMode('layman')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${mode === 'layman' ? activeTabClass : inactiveTabClass}`}
            >
                <Lightbulb className="w-4 h-4" />
                Essencial
            </button>
            <button
                onClick={() => setMode('scientific')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${mode === 'scientific' ? activeTabClass : inactiveTabClass}`}
            >
                <Microscope className="w-4 h-4" />
                Laboratório
            </button>
         </div>
         <TTSButton text={ttsText} theme={theme} className="opacity-80 hover:opacity-100" />
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Bloco 1: Descrição Principal */}
        <div className="relative">
            <div className={`absolute -left-4 top-0 w-1 h-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            {mode === 'layman' ? (
                <div className="space-y-4">
                    <h3 className={`text-xl md:text-2xl font-serif leading-relaxed ${textPrimary}`}>
                        "{data.layman.description}"
                    </h3>
                    <div className={`flex gap-3 p-4 rounded-xl border ${isDark ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                        <Quote className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Conselho Prático</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-emerald-100' : 'text-emerald-900'}`}>{data.layman.advice}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2 ${textPrimary}`}>
                            <Brain className="w-3 h-3" /> Mecanismo Neurobiológico
                        </p>
                        <p className={`text-lg font-serif leading-relaxed ${textPrimary}`}>
                            {data.scientific.mechanism}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 border-t pt-2 border-dashed border-current">
                        <BookOpen className="w-3 h-3" />
                        Fonte: {data.scientific.source}
                    </div>
                </div>
            )}
        </div>

        {/* Bloco 2: O Corpo (Somático) */}
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
                <Activity className={`w-4 h-4 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-pink-200' : 'text-pink-800'}`}>
                    {mode === 'layman' ? 'O que você sente no corpo' : 'Fisiologia & Somatização'}
                </h4>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className={`text-sm leading-relaxed ${textPrimary}`}>
                        {data.body.sensation}
                    </p>
                </div>
                {mode === 'scientific' && (
                    <div className={`pl-4 border-l ${isDark ? 'border-pink-500/20' : 'border-pink-200'}`}>
                        <p className={`text-xs font-bold mb-1 opacity-70 ${textPrimary}`}>Causa Biológica:</p>
                        <p className={`text-sm italic ${textSecondary}`}>
                            {data.body.why}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Action Button */}
        <button 
            onClick={onRegister} 
            className="w-full group relative px-6 py-4 rounded-xl font-bold text-white shadow-lg overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg, ${color.light}, ${color.main})` }}
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center justify-center gap-2 text-shadow-sm">
                Registrar este Momento
            </span>
        </button>

      </div>
    </div>
  );
};