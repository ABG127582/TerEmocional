import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Wind, Brain, Eye, ArrowRight, CheckCircle, Volume2, VolumeX, Edit3, Loader2 } from 'lucide-react';
import { Theme } from '../types';
import { audioService } from '../services/audioService';

interface RuminationModalProps {
  onClose: () => void;
  theme: Theme;
}

const STEPS = [
  { id: 'intro', duration: 8, label: 'Pausa Inicial', text: "Vamos interromper esse ciclo agora. Pare o que está fazendo e siga minha voz." },
  { id: 'breath', duration: 25, label: 'Respiração Rítmica', text: "Inspire contando até quatro. Segure o ar. Agora expire contando até seis. Repita comigo." },
  { id: 'grounding', duration: 20, label: 'Ancoragem Sensorial', text: "Olhe ao seu redor agora. Encontre cores, formas e sons. Saia da sua cabeça e entre no ambiente." },
  { id: 'cognitive', duration: 20, label: 'Desafio Cognitivo', text: "Vamos ocupar seu processador lógico. Conte regressivamente subtraindo sete, começando do cem." },
  { id: 'action', duration: 15, label: 'Micro-Ação', text: "Escreva uma única ação simples, física, para fazer nos próximos dois minutos. Algo pequeno." },
  { id: 'check', duration: 0, label: 'Verificação', text: "Como você está agora? Você quebrou o padrão?" }
];

export const RuminationModal: React.FC<RuminationModalProps> = ({ onClose, theme }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STEPS[0].duration);
  const [isActive, setIsActive] = useState(true);
  const [mathCount, setMathCount] = useState(100);
  const [actionText, setActionText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  // Audio Feedback State
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  
  const currentStep = STEPS[stepIndex];
  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';

  // Sincronização com o estado global do AudioService
  useEffect(() => {
    const unsubscribe = audioService.subscribe((isPlaying, currentText, isLoading) => {
        if (currentText === currentStep.text) {
            if (isLoading) setAudioState('loading');
            else if (isPlaying) setAudioState('playing');
            else setAudioState('idle');
        } else {
            setAudioState('idle');
        }
    });
    return () => unsubscribe();
  }, [currentStep.text]);

  // Audio / TTS Logic Trigger
  useEffect(() => {
    const playStepAudio = async () => {
        if (!ttsEnabled) return;
        
        await new Promise(r => setTimeout(r, 500));
        
        if (isActive) { 
            audioService.speak(currentStep.text);
        }
    };

    playStepAudio();

    return () => {
        audioService.stop();
    };
  }, [stepIndex, ttsEnabled]);

  // Timer Logic
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    audioService.stop(); 
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const toggleMute = () => {
      if (ttsEnabled) {
          audioService.stop();
          setTtsEnabled(false);
      } else {
          setTtsEnabled(true);
          audioService.speak(currentStep.text);
      }
  };

  const renderContent = () => {
    switch (currentStep.id) {
      case 'intro':
        return (
          <div className="text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
               <RefreshCw className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass}`}>Vamos quebrar o ciclo.</h3>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} text-lg`}>
              Interrompa o pensamento por 60 segundos.<br/>
              Faça apenas o que for confortável.
            </p>
          </div>
        );
      
      case 'breath':
        return (
          <div className="text-center space-y-8 animate-in fade-in">
             <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s' }} />
                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-[4000ms] ${timeLeft % 10 > 4 ? 'scale-110 bg-indigo-500/10' : 'scale-90 bg-transparent'}`}>
                    <Wind className="w-12 h-12 text-indigo-500" />
                </div>
                <div className="absolute -bottom-8 font-mono text-indigo-400 font-bold">
                    {timeLeft % 10 > 6 ? "EXPIRE (6s)" : (timeLeft % 10 > 2 ? "SEGURE" : "INSPIRE (4s)")}
                </div>
             </div>
             <p className={`text-xl ${textClass} font-medium`}>
               Inspire em 4... Segure... Expire em 6.
             </p>
          </div>
        );

      case 'grounding':
        return (
          <div className="text-center space-y-6 animate-in slide-in-from-right">
             <div className="flex justify-center gap-4 mb-4">
                <Eye className="w-8 h-8 text-emerald-500" />
             </div>
             <h3 className={`text-xl font-bold ${textClass}`}>Ancoragem 5-4-3-2-1</h3>
             <div className="grid gap-3 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-500 text-xl">5</span>
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Coisas que você VÊ agora.</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-80">
                    <span className="font-bold text-emerald-500 text-xl">4</span>
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Coisas que você SENTE (tato).</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-60">
                    <span className="font-bold text-emerald-500 text-xl">3</span>
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Sons que você OUVE.</span>
                </div>
             </div>
          </div>
        );

      case 'cognitive':
        return (
          <div className="text-center space-y-6 animate-in zoom-in">
             <Brain className="w-10 h-10 text-pink-500 mx-auto" />
             <h3 className={`text-lg font-bold ${textClass}`}>Desafio: Subtraia 7</h3>
             <p className="text-sm opacity-70">Foque na conta. Quebre o padrão.</p>
             
             <div className="flex flex-col items-center gap-4">
                <div className={`text-6xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {mathCount}
                </div>
                <button 
                    onClick={() => setMathCount(prev => prev - 7)}
                    className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold shadow-lg transform active:scale-95 transition-all"
                >
                    - 7 = ?
                </button>
                <p className="text-xs opacity-50 mt-2">(Clique para revelar o próximo)</p>
             </div>
          </div>
        );

      case 'action':
        return (
          <div className="text-center space-y-6 animate-in slide-in-from-bottom">
             <Edit3 className="w-10 h-10 text-blue-500 mx-auto" />
             <h3 className={`text-xl font-bold ${textClass}`}>Próxima Ação</h3>
             <p className="text-sm opacity-70">Uma coisa simples para fazer nos próximos 2 minutos.</p>
             
             <input 
                type="text"
                autoFocus
                placeholder="Ex: Beber água, Ligar para X..."
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                className={`w-full p-4 rounded-xl text-center text-lg font-medium outline-none border-2 focus:border-blue-500 transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
             />
          </div>
        );

      case 'check':
        return (
           <div className="text-center space-y-8 animate-in zoom-in">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className={`text-2xl font-bold ${textClass}`}>Você voltou ao presente?</h3>
              
              <div className="grid grid-cols-1 gap-4">
                  <button onClick={onClose} className="p-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg">
                      Sim, estou melhor.
                  </button>
                  <button onClick={() => setStepIndex(0)} className={`p-4 border rounded-xl font-bold ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} ${textClass}`}>
                      Ainda não (Repetir Ciclo)
                  </button>
              </div>
              
              <div className="text-xs opacity-50 pt-4">
                 A ruminação é um hábito neural. Quebrar o ciclo repetidamente enfraquece esse hábito.
              </div>
           </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col ${bgClass} transition-colors duration-300 min-h-[500px]`}>
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 dark:bg-slate-800 w-full">
            <div 
                className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
        </div>

        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 absolute top-2 left-0 right-0 z-10">
            <div className="flex items-center gap-2">
                <button 
                    onClick={toggleMute}
                    className={`p-2 rounded-full transition-colors flex items-center gap-2 ${ttsEnabled ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title={ttsEnabled ? "Desativar voz" : "Ativar voz"}
                >
                    {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                {/* Audio Status Indicator */}
                {ttsEnabled && audioState !== 'idle' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 backdrop-blur text-xs font-bold text-slate-500">
                        {audioState === 'loading' ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span className="text-[10px]">Carregando...</span>
                            </>
                        ) : (
                            <>
                                <span className="flex gap-0.5 h-3 items-end">
                                    <span className="w-0.5 bg-green-500 animate-[bounce_1s_infinite] h-2"></span>
                                    <span className="w-0.5 bg-green-500 animate-[bounce_1.2s_infinite] h-3"></span>
                                    <span className="w-0.5 bg-green-500 animate-[bounce_0.8s_infinite] h-1.5"></span>
                                </span>
                                <span className="text-[10px] text-green-600 dark:text-green-400">Falando</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <button 
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 mt-4">
            {renderContent()}
        </div>

        {/* Footer Navigation */}
        {currentStep.id !== 'check' && (
            <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                     <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {currentStep.label}
                     </span>
                     <span className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {timeLeft > 0 ? `${timeLeft}s` : 'Pronto?'}
                     </span>
                </div>
                <button 
                    onClick={handleNext}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                >
                    {stepIndex === STEPS.length - 2 ? "Concluir" : "Próximo Passo"} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};