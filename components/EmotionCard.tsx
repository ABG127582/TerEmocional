import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EmotionScale, EmotionLevel } from '../types';
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
  theme 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EmotionLevel | null>(null);
  const IconComp = emotion.icon;
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const emotionColor = emotionColors[emotionKey];

  // Reseta a seleção quando o card é fechado
  useEffect(() => {
    if (!isExpanded) {
      setSelectedLevel(null);
    }
  }, [isExpanded]);

  // Lógica de Prioridade: 
  // 1. Mostra o que está sob o mouse (Preview)
  // 2. Se mouse saiu, mostra o que foi clicado (Locked/Selected)
  // 3. Se nenhum, mostra 0
  const activeDisplayLevel = (hoveredLevel?.emotionKey === emotionKey ? hoveredLevel.level : null) || selectedLevel;
  const currentLevelValue = activeDisplayLevel ? activeDisplayLevel.level : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Evita toggle se clicar em elementos interativos internos
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    onCardToggle(emotionKey);
  };

  return (
    <div
      className={`rounded-2xl p-6 md:p-8 transition-all duration-500 ease-out cursor-default backdrop-blur-md border-2 overflow-hidden relative`}
      style={{
        background: theme === 'dark' 
          ? `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))` 
          : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.95))`,
        borderColor: isExpanded ? emotionColor.main : 'transparent',
        boxShadow: isExpanded 
          ? `0 0 30px ${emotionColor.glow}, inset 0 0 20px ${emotionColor.glow}` 
          : theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)'
      }}
      aria-expanded={isExpanded}
    >
      {/* Header clicável para expandir/colapsar */}
      <div 
        onClick={() => onCardToggle(emotionKey)}
        className="relative z-10 flex items-center justify-between mb-4 cursor-pointer group"
        role="button"
        tabIndex={0}
        aria-label={`${emotion.name}, clique para alternar`}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-105"
            style={{ 
              background: theme === 'dark' ? '#0f172a' : '#ffffff',
              boxShadow: isExpanded ? `0 0 20px ${emotionColor.glow}` : 'none',
              border: `1px solid ${isExpanded ? emotionColor.main : 'transparent'}`
            }}
          >
            <div 
              className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
              style={{ background: emotionColor.main }} 
            />
            <IconComp 
              className="w-7 h-7 relative z-10 transition-colors duration-300" 
              style={{ 
                color: isExpanded ? emotionColor.main : (theme === 'dark' ? '#94a3b8' : '#64748b'),
                filter: isExpanded ? `drop-shadow(0 0 5px ${emotionColor.main})` : 'none'
              }} 
            />
          </div>
          <div>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${textClass}`} style={{ textShadow: isExpanded ? `0 0 20px ${emotionColor.glow}` : 'none' }}>
              {emotion.name}
            </h2>
            <p className={`text-xs ${textSecondary} font-mono uppercase tracking-widest opacity-70`}>
              {isExpanded ? 'Monitoramento Ativo' : 'Toque para expandir'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${textSecondary}`}
        />
      </div>

      {/* Glow Effect de fundo quando expandido */}
      {isExpanded && (
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity duration-1000"
          style={{ background: emotionColor.main }}
        />
      )}

      <div className={`relative z-10 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="relative min-h-[140px] px-16 pt-8 pb-4">
          
          {/* TRILHA (Barra de Fundo) */}
          <div 
            className="h-3 rounded-full relative overflow-visible" 
            style={{ 
              background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            
            {/* FEIXE DE LUZ (Barra de Progresso) */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 pointer-events-none"
              style={{ 
                width: currentLevelValue > 0 
                  ? `${((currentLevelValue - 1) / (emotion.levels.length - 1)) * 100}%` 
                  : '0%',
                background: emotionColor.main,
                boxShadow: `0 0 10px ${emotionColor.main}, 0 0 20px ${emotionColor.glow}`
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
          <div className="pt-2 mt-24">
            {activeDisplayLevel ? (
              <DetailCard 
                level={activeDisplayLevel} 
                theme={theme} 
                emotionKey={emotionKey} 
                onRegister={() => onSave(emotionKey, activeDisplayLevel.level)}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[180px] pt-4 opacity-50">
                <p className={`${textSecondary} text-xs font-mono uppercase tracking-widest`}>
                  Selecione uma intensidade para ver detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};