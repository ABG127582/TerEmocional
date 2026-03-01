import React, { useState, useEffect } from 'react';
import { Volume2, StopCircle, Loader2 } from 'lucide-react';
import { audioService } from '../services/audioService';

interface TTSButtonProps {
  text: string;
  theme: 'light' | 'dark';
  className?: string;
  label?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, theme, className = '', label }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');

  useEffect(() => {
    // Sincronizar estado inicial
    if (audioService.isAudioPlaying(text)) {
      setStatus('playing');
    }

    // Assinar mudanças globais
    const unsubscribe = audioService.subscribe((isPlaying, currentText, isLoading) => {
      if (currentText === text) {
        if (isLoading) setStatus('loading');
        else setStatus(isPlaying ? 'playing' : 'idle');
      } else {
        // Se outro texto está tocando, este botão deve estar parado
        setStatus('idle');
      }
    });

    return () => unsubscribe();
  }, [text]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (status === 'playing') {
       await audioService.stop();
    } else {
       // O estado de loading agora é gerenciado pelo listener do serviço, 
       // mas setamos aqui para feedback instantâneo ao clique
       setStatus('loading'); 
       await audioService.speak(text);
    }
  };

  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50";
  
  const themeClasses = theme === 'dark' 
    ? (status === 'playing' || status === 'loading' ? "bg-red-900/30 text-red-400 border border-red-500/30" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20")
    : (status === 'playing' || status === 'loading' ? "bg-red-50 text-red-600 border border-red-200" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100");

  return (
    <button 
      onClick={handleClick}
      className={`${baseClasses} ${themeClasses} ${className}`}
      aria-label={status === 'playing' ? "Parar leitura" : "Ouvir texto"}
      title={status === 'playing' ? "Parar leitura" : "Ouvir texto com IA"}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : status === 'playing' ? (
        <StopCircle className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      {label && <span>{status === 'playing' ? 'Parar' : (status === 'loading' ? 'Carregando...' : label)}</span>}
    </button>
  );
};