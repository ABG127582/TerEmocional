import React, { useState } from 'react';
import { EmotionScale, EmotionLevel } from '../types';
import { emotionColors } from '../constants';

interface LevelButtonProps {
  emotionKey: string;
  emotion: EmotionScale;
  item: EmotionLevel;
  index: number;
  isActive: boolean; // Faz parte do caminho iluminado (hover ou seleção)
  isCurrent: boolean; // É a ponta do caminho iluminado
  isSelected?: boolean; // Foi especificamente clicado
  onHover: (data: { emotionKey: string; level: EmotionLevel } | null) => void;
  onSelect: (level: EmotionLevel) => void;
  theme: 'light' | 'dark';
}

export const LevelButton: React.FC<LevelButtonProps> = ({ 
  emotionKey, 
  emotion, 
  item, 
  index, 
  isActive, 
  isCurrent,
  isSelected,
  onHover, 
  onSelect, 
  theme 
}) => {
  const emotionColor = emotionColors[emotionKey];
  const [showTooltip, setShowTooltip] = useState(false);

  // Define os estilos baseados no estado com estética Neon/Futurista
  const getButtonStyles = () => {
    const mainColor = emotionColor.main;
    
    // Prioridade Visual: Selecionado (Fixo) ou Hover Atual
    if (isCurrent || isSelected) {
      // ESTADO: NÚCLEO ATIVO (Alvo atual)
      return {
        className: 'scale-125 z-20 transition-all duration-300',
        style: {
          background: '#FFFFFF',
          color: mainColor,
          border: `2px solid ${mainColor}`,
          boxShadow: `
            0 0 10px ${mainColor}, 
            0 0 20px ${mainColor}, 
            0 0 40px ${mainColor},
            inset 0 0 10px ${mainColor}
          `
        }
      };
    } else if (isActive) {
      // ESTADO: CAMINHO ENERGIZADO (Anteriores)
      return {
        className: 'scale-110 z-10 transition-all duration-300',
        style: {
          background: mainColor,
          color: '#FFFFFF',
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: `0 0 15px ${mainColor}`
        }
      };
    } else {
      // ESTADO: INATIVO (Desligado)
      return {
        className: 'z-0 transition-all duration-300 hover:scale-110',
        style: {
          background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          border: `2px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: 'none'
        }
      };
    }
  };

  const buttonStyle = getButtonStyles();

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${(index / (emotion.levels.length - 1)) * 100}%`,
        // Ajuste fino para centralizar o botão (h-14/56px) na linha (h-3/12px)
        top: '-1.375rem', 
        transform: 'translateX(-50%)'
      }}
    >
      <button
        type="button"
        onMouseEnter={() => { setShowTooltip(true); onHover({ emotionKey, level: item }); }}
        onMouseLeave={() => { setShowTooltip(false); onHover(null); }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
        className={`w-14 h-14 flex items-center justify-center rounded-full font-black text-lg cursor-pointer outline-none ${buttonStyle.className}`}
        style={buttonStyle.style}
        aria-label={`${emotion.name} nível ${item.level}: ${item.label}`}
        aria-pressed={isSelected}
      >
        {item.level}
      </button>

      {/* Tooltip simples só aparece se NÃO estiver selecionado (para não poluir quando o card grande abrir) */}
      {showTooltip && !isSelected && (
        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-3 rounded-lg text-xs whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md pointer-events-none" role="tooltip">
          <p className="font-bold text-sm text-center uppercase tracking-wider" style={{ color: isActive ? emotionColor.chart : 'white' }}>{item.label}</p>
        </div>
      )}

      <span 
        className={`relative text-[10px] uppercase tracking-widest mt-8 text-center max-w-24 transition-all duration-300 font-bold select-none`}
        style={{
          color: isActive ? emotionColor.main : (theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
          textShadow: isActive ? `0 0 10px ${emotionColor.glow}` : 'none',
          opacity: isActive || isCurrent || isSelected ? 1 : 0.7
        }}
      >
        {item.label}
      </span>
    </div>
  );
};