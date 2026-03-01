import React from 'react';
import { EmotionLevel, RegulationPractice } from '../types';
import { emotionColors, emotionalScales } from '../constants';
import NeuroGraph from './NeuroGraph';
import { EmotionInsight } from './EmotionInsight';
import { InfoTooltip } from './InfoTooltip';
import { PlayCircle, RefreshCw } from 'lucide-react';

interface DetailCardProps {
  level: EmotionLevel;
  theme: 'light' | 'dark';
  emotionKey: string;
  onRegister?: () => void;
  onOpenPractice?: (practice: RegulationPractice) => void;
  onOpenRumination?: () => void;
}

export const DetailCard: React.FC<DetailCardProps> = ({ level, theme, emotionKey, onRegister, onOpenPractice, onOpenRumination }) => {
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const bgSubtle = theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50';
  const emotionColor = emotionColors[emotionKey];
  const emotion = emotionalScales[emotionKey];
  const IconComp = emotion.icon;

  // Ruminação disponível para emoções de valência negativa/agitada
  const isRuminationProne = ['raiva', 'tristeza', 'medo', 'nojo'].includes(emotionKey);
  
  // Calcula o tamanho do ícone com base no nível (1 a 7)
  const iconSize = 24 + (level.level * 4);

  return (
    <div className={`${bgSubtle} rounded-xl p-6 backdrop-blur-sm border ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`} role="region" aria-label="Detalhes da emoção">
      
      {/* Container Principal Vertical */}
      <div className="flex flex-col gap-8">

        {/* SEÇÃO SUPERIOR: Cabeçalho e Métricas (Agora com largura total para os botões) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Bloco 1: Identidade e Ações (Ganha flex-1 para expandir) */}
            <div className="flex-1 flex flex-col space-y-4 w-full">
                <div className="flex items-start gap-5">
                    <div 
                        className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-lg flex items-center justify-center text-white" 
                        style={{ background: `linear-gradient(135deg, ${emotionColor.light}, ${emotionColor.main})` }} 
                        aria-hidden="true"
                    >
                        <IconComp size={iconSize} strokeWidth={2.5} className="drop-shadow-md transition-all duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className={`text-2xl font-bold ${textClass} leading-tight`}>{level.label}</p>
                        <p className={`text-sm ${textSecondary} mt-1 leading-snug font-medium`}>{level.desc}</p>
                        
                        {/* Botões de Ação - Agora com espaço total disponível */}
                        <div className="flex flex-wrap gap-3 mt-4 items-center">
                            {/* Botão Regulação */}
                            {level.practice && onOpenPractice ? (
                                <button 
                                    onClick={() => onOpenPractice(level.practice!)}
                                    className="text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer font-bold whitespace-nowrap"
                                    title={`Abrir prática guiada: ${level.practice.title}`}
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    Regulação: {level.regulation}
                                </button>
                            ) : (
                                <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded flex items-center gap-2 font-bold whitespace-nowrap">
                                    <PlayCircle className="w-4 h-4 opacity-50" />
                                    Regulação: {level.regulation}
                                </span>
                            )}

                            {/* Botão Ruminação */}
                            {onOpenRumination && isRuminationProne && (
                                <button 
                                    onClick={onOpenRumination}
                                    className="text-xs font-mono bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer font-bold animate-pulse-slow whitespace-nowrap"
                                    title="Ferramenta de interrupção de pensamento repetitivo"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Ruminação: Quebrar Loop ⚡
                                </button>
                            )}
                            
                            <InfoTooltip text="Estratégias para equilibrar essa emoção agora." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bloco 2: Métricas (Valência/Ativação) - Fixado à direita em telas grandes */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center space-y-5 pt-2 lg:border-l lg:pl-8 border-slate-200 dark:border-slate-700/50">
                <div>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1.5 opacity-70">
                        <div className="flex items-center gap-1">
                            <span>Valência (Prazer)</span>
                        </div>
                        <span>{level.valence}</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                        className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400" 
                        style={{ width: `${(level.valence / 10) * 100}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1.5 opacity-70">
                        <div className="flex items-center gap-1">
                            <span>Ativação (Energia)</span>
                        </div>
                        <span>{level.arousal}</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                        className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-red-500" 
                        style={{ width: `${(level.arousal / 10) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* SEÇÃO INFERIOR: Gráfico (Agora ocupa 100% da largura, abaixo dos dados) */}
        <div className="w-full h-[320px] rounded-xl overflow-hidden relative">
           <NeuroGraph emotionKey={emotionKey} intensityLevel={level.level} theme={theme} />
           
           {/* Fonte Discreta */}
           <div className="flex justify-end pt-2 border-t border-slate-200/10 mt-2">
              <a 
                href="https://en.wikipedia.org/wiki/Circumplex_model" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-[9px] ${textSecondary} opacity-40 hover:opacity-100 font-mono tracking-tight hover:underline cursor-pointer`}
              >
                Fonte: Modelo Circumplexo de Afeto (Russell, 1980) & Neurobiologia Afetiva
              </a>
           </div>
        </div>
      
      </div>

      <EmotionInsight 
        level={level} 
        theme={theme} 
        emotionKey={emotionKey} 
        onRegister={onRegister || (() => {})} 
      />

    </div>
  );
};