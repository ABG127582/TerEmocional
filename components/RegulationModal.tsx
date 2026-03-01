import React from 'react';
import { X, Play, FileText, Youtube, BookOpen } from 'lucide-react';
import { RegulationPractice } from '../types';
import { TTSButton } from './TTSButton';

interface RegulationModalProps {
  practice: RegulationPractice;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const RegulationModal: React.FC<RegulationModalProps> = ({ practice, onClose, theme }) => {
  const bgClass = theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const textClass = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  const hasVideo = !!practice.videoUrl;

  // Combine title, description and steps for the TTS
  const fullTextToRead = `Prática: ${practice.title}. ${practice.description}. Instruções: ${practice.content?.join('. ')}`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Container Principal: Tamanho padrão (max-w-4xl), altura controlada */}
      <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${bgClass} animate-in zoom-in-95 duration-300`}>
        
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
               {hasVideo ? <Play className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>{practice.title}</h2>
              <p className={`text-sm ${textSecondary}`}>Prática Guiada</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TTSButton text={fullTextToRead} theme={theme} label="Ouvir Instruções" />
            <button 
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${textClass}`}
            >
                <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className={`${hasVideo ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'max-w-2xl mx-auto space-y-6'}`}>
                
                {/* Video Column */}
                {hasVideo && (
                    <div className="space-y-4">
                         <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black border border-slate-700">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={practice.videoUrl} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className={`p-4 rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} ${textSecondary}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold opacity-80">
                                <Youtube className="w-4 h-4 text-red-500" /> Instruções Visuais
                            </div>
                            Acompanhe o vídeo para guiar sua respiração e foco. Use o roteiro ao lado como apoio.
                        </div>
                    </div>
                )}

                {/* Text Content */}
                <div className="space-y-6">
                    <div className="text-center md:text-left">
                        <p className={`text-lg italic font-medium opacity-80 ${textClass}`}>
                            "{practice.description}"
                        </p>
                    </div>

                    <div className={`space-y-4 ${textClass}`}>
                        {practice.content?.map((line, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${theme === 'dark' ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {idx + 1}
                                </span>
                                <p className="text-base leading-relaxed">{line}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 shrink-0 flex justify-end bg-slate-50 dark:bg-slate-900/50">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md hover:scale-105 text-sm md:text-base"
            >
                Concluir Prática
            </button>
        </div>

      </div>
    </div>
  );
};
