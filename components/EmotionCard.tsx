import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EmotionScale, EmotionLevel, RegulationPractice } from '../types';
import { emotionColors } from '../constants';
import { LevelButton } from './LevelButton';
import { DetailCard } from './DetailCard';

interface EmotionCardProps {
  emotionKey: string;
  emotion: EmotionScale;
  isExpanded: boolean;
  hoveredLevel: { emotionKey: string; level: EmotionLevel } | null;
  onCardToggle: (key: string) => void;
  onHoverLevel: (data: { emotionKey: string; level: EmotionLevel } | null) => void;
  onSave: (emotionKey: string, level: number) => void;
  onOpenPractice: (practice: RegulationPractice) => void;
  onOpenRumination: () => void;
  theme: 'light' | 'dark';
}

export const EmotionCard: React.FC<EmotionCardProps> = ({ 
  emotionKey, 
  emotion, 
  isExpanded, 
  hoveredLevel, 
  onCardToggle, 
  onHoverLevel, 
  onSave, 
  onOpenPractice,
  onOpenRumination,
  theme 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EmotionLevel | null>(null);
  const IconComp = emotion.icon;
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const emotionColor = emotionColors[emotionKey];

  useEffect(() => {
    if (!isExpanded) {
      setSelectedLevel(null);
    }
  }, [isExpanded]);

  const activeDisplayLevel = (hoveredLevel?.emotionKey === emotionKey ? hoveredLevel.level : null) || selectedLevel;
  const currentLevelValue = activeDisplayLevel ? activeDisplayLevel.level : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    onCardToggle(emotionKey);
  };

  return (
    <div
      className={`rounded-3xl p-1 transition-all duration-500 ease-out cursor-default relative group`}
      style={{
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        zIndex: isExpanded ? 20 : 1
      }}
    >
        {/* Ambient Glow (Fundo colorido borrado) */}
        <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-xl"
            style={{ 
                background: `linear-gradient(135deg, ${emotionColor.light}, ${emotionColor.main})`,
                opacity: isExpanded ? 0.3 : undefined
            }} 
        />

        {/* Card Principal - Glassmorphism */}
        <div
            className={`relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg transition-colors duration-500`}
            style={{
                background: theme === 'dark' 
                ? `linear-gradient(145deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))` 
                : `linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(248, 250, 252, 0.9))`,
                boxShadow: isExpanded 
                    ? `0 20px 60px -15px ${emotionColor.glow}` 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            aria-expanded={isExpanded}
        >
            {/* Header clicável para expandir/colapsar */}
            <div 
                onClick={() => onCardToggle(emotionKey)}
                className="relative z-10 flex items-center justify-between mb-4 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${emotion.name}, clique para alternar`}
            >
                <div className="flex items-center gap-6">
                    {/* Icon Container com efeito 3D sutil */}
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl"
                        style={{ 
                            background: theme === 'dark' ? '#0f172a' : '#ffffff',
                            boxShadow: `0 8px 30px ${emotionColor.glow}`,
                            border: `1px solid ${emotionColor.main}30`
                        }}
                    >
                        <div 
                            className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-300"
                            style={{ background: emotionColor.main }} 
                        />
                        <IconComp 
                            className="w-8 h-8 relative z-10 transition-all duration-300" 
                            style={{ 
                                color: emotionColor.main,
                                filter: `drop-shadow(0 0 2px ${emotionColor.main})`
                            }} 
                        />
                    </div>
                    
                    <div>
                        <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${textClass} transition-all`} 
                            style={{ 
                                textShadow: isExpanded ? `0 0 30px ${emotionColor.glow}` : 'none',
                                color: isExpanded ? emotionColor.main : undefined
                            }}>
                            {emotion.emoji} {emotion.name}
                        </h2>
                        <p className={`text-xs ${textSecondary} font-mono uppercase tracking-widest opacity-70 mt-1 flex items-center gap-2`}>
                            {isExpanded ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    Monitoramento Ativo
                                </span>
                            ) : 'Toque para expandir'}
                        </p>
                    </div>
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-slate-100 dark:bg-slate-800 rotate-180' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <ChevronDown
                        className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'text-blue-500' : textSecondary}`}
                    />
                </div>
            </div>

            {/* Conteúdo Expansível */}
            <div className={`relative z-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isExpanded ? 'max-h-[1600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="relative min-h-[140px] px-2 md:px-12 pt-16 pb-4">
                
                {/* TRILHA (Barra de Fundo) */}
                <div 
                    className="h-3 rounded-full relative overflow-visible mt-6 mb-16 mx-4" 
                    style={{ 
                        background: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    
                    {/* FEIXE DE LUZ (Barra de Progresso) */}
                    <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out pointer-events-none"
                    style={{ 
                        width: currentLevelValue > 0 
                        ? `${((currentLevelValue - 1) / (emotion.levels.length - 1)) * 100}%` 
                        : '0%',
                        background: emotionColor.main,
                        boxShadow: `0 0 15px ${emotionColor.main}, 0 0 30px ${emotionColor.glow}`
                    }} 
                    />

                    {emotion.levels.map((item, index) => {
                    const isActive = currentLevelValue >= item.level;
                    const isCurrent = currentLevelValue === item.level;
                    const isSelected = selectedLevel?.level === item.level;

                    return (
                        <LevelButton
                            key={item.level}
                            emotionKey={emotionKey}
                            emotion={emotion}
                            item={item}
                            index={index}
                            isActive={isActive}
                            isCurrent={isCurrent}
                            isSelected={isSelected}
                            onHover={onHoverLevel}
                            onSelect={setSelectedLevel}
                            theme={theme}
                        />
                    );
                    })}
                </div>

                {/* Área de Detalhes */}
                <div className="pt-2 min-h-[300px]">
                    {activeDisplayLevel ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DetailCard 
                            level={activeDisplayLevel} 
                            theme={theme} 
                            emotionKey={emotionKey} 
                            onRegister={() => onSave(emotionKey, activeDisplayLevel.level)}
                            onOpenPractice={onOpenPractice}
                            onOpenRumination={onOpenRumination}
                        />
                    </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[180px] pt-4 opacity-40">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 animate-pulse-slow">
                            <IconComp className="w-6 h-6" />
                        </div>
                        <p className={`${textSecondary} text-xs font-bold uppercase tracking-widest`}>
                            Selecione uma intensidade
                        </p>
                    </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    </div>
  );
};