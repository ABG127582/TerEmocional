import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Wind, Eye, Hand, Ear, Coffee, Smile, Phone, HeartHandshake, Siren, Edit2, Save, Plus, Trash2, MapPin, Smartphone, Navigation, Volume2, VolumeX } from 'lucide-react';
import FocusTrap from './FocusTrap';
import { storageService } from '../services/storageService';
import { SafetyPlan } from '../types';

interface BreathingModalProps {
  onClose: () => void;
}

type Mode = 'breathing' | 'grounding' | 'crisis';
type BreathTechnique = 'box' | 'relax' | 'balance';

const BREATH_CONFIGS = {
  box: {
    name: "Quadrada (4-4-4-4)",
    desc: "Foco e Estabilidade",
    phases: [
      { name: 'Inspire', duration: 4, label: 'inspire' },
      { name: 'Segure', duration: 4, label: 'hold' },
      { name: 'Expire', duration: 4, label: 'expire' },
      { name: 'Segure', duration: 4, label: 'hold-empty' }
    ],
    baseFreq: 170, // Hz - Foco
    color: 'text-indigo-300'
  },
  relax: {
    name: "Relaxante (4-7-8)",
    desc: "Ansiedade Aguda e Sono",
    phases: [
      { name: 'Inspire', duration: 4, label: 'inspire' },
      { name: 'Segure', duration: 7, label: 'hold' },
      { name: 'Expire', duration: 8, label: 'expire' }
    ],
    baseFreq: 130, // Hz - Calmante profundo (Grave)
    color: 'text-emerald-300'
  },
  balance: {
    name: "Coerente (6-6)",
    desc: "Equilíbrio Cardíaco",
    phases: [
      { name: 'Inspire', duration: 6, label: 'inspire' },
      { name: 'Expire', duration: 6, label: 'expire' }
    ],
    baseFreq: 200, // Hz - Equilíbrio
    color: 'text-blue-300'
  }
};

export const BreathingModal: React.FC<BreathingModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode>('breathing');
  
  // States for Breathing
  const [technique, setTechnique] = useState<BreathTechnique>('relax');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [useVibration, setUseVibration] = useState(true);
  const [useSound, setUseSound] = useState(false);

  // Audio Refs (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // States for Grounding
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<string[]>(['', '', '', '', '']);

  // States for Crisis/Safety Plan
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({ contacts: [], copingPhantom: '', safePlace: '' });
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [locationState, setLocationState] = useState<{ status: 'idle' | 'loading' | 'success' | 'error', text: string }>({ status: 'idle', text: '' });

  useEffect(() => {
    if (mode === 'crisis') {
      setSafetyPlan(storageService.getSafetyPlan());
    }
  }, [mode]);

  // --- WAKE LOCK (Manter tela ligada) ---
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock request failed:', err);
      }
    };
    
    if (isActive) requestWakeLock();
    
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [isActive]);

  // --- AUDIO ENGINE ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = BREATH_CONFIGS[technique].baseFreq;
        gain.gain.value = 0; // Mute start
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start();
        
        oscRef.current = osc;
        gainRef.current = gain;
      }
    }
  }, [technique]);

  // Função para modular o som baseada na fase
  const updateAudio = useCallback((label: string, duration: number) => {
    if (!useSound || !audioCtxRef.current || !oscRef.current || !gainRef.current) return;

    const ctx = audioCtxRef.current;
    const osc = oscRef.current;
    const gain = gainRef.current;
    const now = ctx.currentTime;
    const baseFreq = BREATH_CONFIGS[technique].baseFreq;
    const rampTime = duration; 

    // Cancelar agendamentos anteriores para evitar conflito
    osc.frequency.cancelScheduledValues(now);
    gain.gain.cancelScheduledValues(now);

    if (label === 'inspire') {
      // Subir tom e volume (Expansão)
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq + 60, now + rampTime);
      
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.15, now + rampTime); // Volume máx agradável
    } else if (label === 'expire') {
      // Descer tom e volume (Relaxamento)
      osc.frequency.setValueAtTime(baseFreq + 60, now);
      osc.frequency.linearRampToValueAtTime(baseFreq, now + rampTime);
      
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.02, now + rampTime); // Quase silêncio
    } else if (label === 'hold') {
      // Manter (Sustentação)
      osc.frequency.setTargetAtTime(baseFreq + 60, now, 0.1);
      gain.gain.setTargetAtTime(0.15, now, 0.1);
    } else {
      // Hold Empty (Silêncio relativo)
      osc.frequency.setTargetAtTime(baseFreq, now, 0.1);
      gain.gain.setTargetAtTime(0.02, now, 0.1);
    }
  }, [useSound, technique]);

  const toggleSound = () => {
    if (!useSound) {
      initAudio();
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setUseSound(true);
    } else {
      if (gainRef.current && audioCtxRef.current) {
        // Fade out suave antes de desligar a flag
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      }
      setUseSound(false);
    }
  };

  // Cleanup Audio on Unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // --- BREATHING LOGIC ---
  useEffect(() => {
    if (mode !== 'breathing' || !isActive) return;

    const currentConfig = BREATH_CONFIGS[technique];
    const safePhaseIndex = phaseIndex % currentConfig.phases.length;
    const currentPhase = currentConfig.phases[safePhaseIndex];
    
    // Trigger audio update at start of phase
    updateAudio(currentPhase.label, currentPhase.duration);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        
        // Phase Transition Logic
        const nextIndex = (safePhaseIndex + 1) % currentConfig.phases.length;
        setPhaseIndex(nextIndex);
        
        const nextPhase = currentConfig.phases[nextIndex];

        // Haptic Feedback
        if (useVibration && navigator.vibrate) {
           if (nextPhase.label === 'inspire') navigator.vibrate([30, 40, 50, 60]); // Crescente
           else if (nextPhase.label === 'expire') navigator.vibrate([60, 50]); // Decrescente suave
           else navigator.vibrate(50); // Bump curto
        }

        // Trigger Audio for next phase
        updateAudio(nextPhase.label, nextPhase.duration);

        return nextPhase.duration;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isActive, technique, phaseIndex, useVibration, useSound, updateAudio]);

  // Change Technique
  const changeTechnique = (tech: BreathTechnique) => {
    setTechnique(tech);
    setPhaseIndex(0);
    setSecondsLeft(BREATH_CONFIGS[tech].phases[0].duration);
    
    // Reset Oscillator freq se som estiver ligado
    if (useSound && oscRef.current && audioCtxRef.current) {
       oscRef.current.frequency.setValueAtTime(BREATH_CONFIGS[tech].baseFreq, audioCtxRef.current.currentTime);
    }
  };

  // --- GEOLOCATION ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({ status: 'error', text: 'Geolocalização não suportada.' });
      return;
    }

    setLocationState({ status: 'loading', text: 'Buscando satélites...' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationState({ 
            status: 'success', 
            text: `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}\n(Precisão: ${Math.round(position.coords.accuracy)}m)` 
        });
      },
      (error) => {
        setLocationState({ status: 'error', text: 'Não foi possível obter a localização. Verifique permissões do GPS.' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // --- GROUNDING LOGIC ---
  const groundingSteps = [
    { count: 5, icon: Eye, text: "Coisas que você vê", desc: "Olhe ao redor. Digite ou fale 5 objetos.", placeholder: "Ex: Cadeira azul, Janela..." },
    { count: 4, icon: Hand, text: "Coisas que você toca", desc: "Sinta texturas agora. Tecido, mesa, sua pele.", placeholder: "Ex: Calça jeans áspera..." },
    { count: 3, icon: Ear, text: "Sons que você ouve", desc: "Feche os olhos um segundo. O que ouve?", placeholder: "Ex: Ar condicionado, carros..." },
    { count: 2, icon: Coffee, text: "Cheiros que sente", desc: "Ou aromas que você gosta de imaginar.", placeholder: "Ex: Café, chuva, perfume..." },
    { count: 1, icon: Smile, text: "Uma emoção boa", desc: "Ou uma qualidade sua.", placeholder: "Ex: Eu sou resiliente." }
  ];
  const currentGStep = groundingSteps[groundingStep];

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSavePlan = () => {
    storageService.saveSafetyPlan(safetyPlan);
    setIsEditingPlan(false);
  };

  // Visual Helper for Breathing Scale (0.5 to 1.0)
  const getCircleScale = () => {
    const config = BREATH_CONFIGS[technique];
    const safePhaseIndex = phaseIndex % config.phases.length;
    const phase = config.phases[safePhaseIndex];
    const progress = (phase.duration - secondsLeft) / phase.duration; // 0 to 1
    
    if (phase.label === 'inspire') return 0.5 + (0.5 * progress); // Expande
    if (phase.label === 'expire') return 1.0 - (0.5 * progress); // Contrai
    if (phase.label === 'hold') return 1.0; 
    if (phase.label === 'hold-empty') return 0.5;
    return 1;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 md:p-8">
        <FocusTrap className="flex flex-col items-center w-full max-w-2xl relative" aria-label="Ferramentas de Regulação">
            
            {/* Header Navigation - Relative to avoid clipping */}
            <div className="w-full flex justify-between items-start mb-8 z-20">
                <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
                    <button 
                        onClick={() => setMode('breathing')}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'breathing' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Wind className="w-4 h-4" />
                        Respiração
                    </button>
                    <button 
                        onClick={() => setMode('grounding')}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'grounding' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Navigation className="w-4 h-4" />
                        Aterramento
                    </button>
                    <button 
                        onClick={() => setMode('crisis')}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'crisis' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Siren className="w-4 h-4" />
                        Crise
                    </button>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white/60 hover:text-white p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:bg-white/10"
                    aria-label="Fechar exercício"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
                
                {/* --- MODO RESPIRAÇÃO --- */}
                {mode === 'breathing' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 w-full">
                        
                        {/* Seletor de Técnica */}
                        <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-lg">
                            {(Object.keys(BREATH_CONFIGS) as BreathTechnique[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => changeTechnique(t)}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${technique === t ? 'bg-white/20 text-white font-bold' : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {BREATH_CONFIGS[t].name}
                                </button>
                            ))}
                        </div>

                        {/* Visualizador de Respiração */}
                        <div className="relative flex items-center justify-center w-72 h-72 mb-8">
                            {/* Anéis de Fundo */}
                            <div className="absolute w-full h-full rounded-full border border-white/5" />
                            <div className="absolute w-48 h-48 rounded-full border border-white/5" />
                            
                            {/* Círculo Principal Animado */}
                            <div 
                                className="absolute w-64 h-64 rounded-full bg-indigo-500 blur-2xl transition-all duration-[1000ms] ease-linear opacity-40 will-change-transform"
                                style={{ 
                                    transform: `scale(${getCircleScale()})`,
                                    backgroundColor: technique === 'relax' ? '#10b981' : (technique === 'box' ? '#6366f1' : '#f43f5e'),
                                    boxShadow: `0 0 ${getCircleScale() * 50}px ${technique === 'relax' ? 'rgba(16,185,129,0.3)' : (technique === 'box' ? 'rgba(99,102,241,0.3)' : 'rgba(244,63,94,0.3)')}`
                                }} 
                            />
                             <div 
                                className="absolute w-64 h-64 rounded-full border-2 border-white/20 transition-all duration-[1000ms] ease-linear will-change-transform"
                                style={{ 
                                    transform: `scale(${getCircleScale()})`
                                }} 
                            />

                            {/* Texto Central */}
                            <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none">
                                <span className="text-6xl font-black text-white tabular-nums drop-shadow-lg mb-2">
                                    {secondsLeft}
                                </span>
                                <span className="text-xl font-bold uppercase tracking-widest text-white/90 drop-shadow-md">
                                    {BREATH_CONFIGS[technique].phases[phaseIndex % BREATH_CONFIGS[technique].phases.length].name}
                                </span>
                            </div>
                        </div>

                        {/* Controles e Infos */}
                        <div className="text-center text-white/80 max-w-md space-y-4">
                            <p className="text-sm text-white/50">{BREATH_CONFIGS[technique].desc}</p>
                            
                            <div className="flex gap-3 justify-center mt-4">
                                <button 
                                    onClick={() => setUseVibration(!useVibration)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${useVibration ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/30'}`}
                                >
                                    <Smartphone className="w-3 h-3" />
                                    {useVibration ? 'Vibrar' : 'Silencioso'}
                                </button>
                                
                                <button 
                                    onClick={toggleSound}
                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${useSound ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'border-white/10 text-white/30'}`}
                                >
                                    {useSound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                                    {useSound ? 'Som: ON' : 'Som: OFF'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODO ATERRAMENTO (GROUNDING) --- */}
                {mode === 'grounding' && (
                    <div className="flex flex-col items-center w-full max-w-lg animate-in slide-in-from-right-8 duration-300 px-4">
                         <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Técnica 5-4-3-2-1</h3>
                         <p className="text-emerald-300 text-sm font-medium mb-8 tracking-wider uppercase">Engaje o Córtex para Parar a Ansiedade</p>

                         <div className="w-full bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${((groundingStep + 1) / 5) * 100}%` }}
                                />
                            </div>

                            <div className="flex flex-col items-center text-center space-y-6 pt-4">
                                 <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-2">
                                    <currentGStep.icon className="w-8 h-8" />
                                 </div>
                                 
                                 <div>
                                    <h4 className="text-5xl font-black text-white mb-2 leading-none">{currentGStep.count}</h4>
                                    <h5 className="text-lg font-bold text-emerald-200">{currentGStep.text}</h5>
                                 </div>
                                 
                                 <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                                    {currentGStep.desc}
                                 </p>

                                 {/* Input Interativo para forçar cognição */}
                                 <textarea 
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20"
                                    placeholder={currentGStep.placeholder}
                                    value={groundingInputs[groundingStep]}
                                    onChange={(e) => {
                                        const newInputs = [...groundingInputs];
                                        newInputs[groundingStep] = e.target.value;
                                        setGroundingInputs(newInputs);
                                    }}
                                 />

                                 <div className="flex gap-3 w-full pt-2">
                                    <button 
                                        onClick={() => setGroundingStep(Math.max(0, groundingStep - 1))}
                                        disabled={groundingStep === 0}
                                        className="flex-1 py-3 rounded-xl font-bold text-white/50 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors text-sm"
                                    >
                                        Voltar
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (groundingStep < 4) setGroundingStep(groundingStep + 1);
                                            else onClose();
                                        }}
                                        className="flex-[2] py-3 rounded-xl font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] text-sm"
                                    >
                                        {groundingStep === 4 ? "Finalizar Exercício" : "Próximo Passo"}
                                    </button>
                                 </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* --- MODO CRISE --- */}
                {mode === 'crisis' && (
                    <div className="flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-right-8 duration-300 px-4 pb-10">
                         <div className="flex items-center justify-center gap-3 mb-4 w-full relative">
                            <h3 className="text-2xl font-bold text-white text-center">Recursos de Segurança</h3>
                            <button 
                                onClick={() => isEditingPlan ? handleSavePlan() : setIsEditingPlan(true)}
                                className="absolute right-0 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                title={isEditingPlan ? "Salvar" : "Editar Plano"}
                            >
                                {isEditingPlan ? <Save className="w-5 h-5 text-green-400" /> : <Edit2 className="w-5 h-5" />}
                            </button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                             <a href="tel:188" className="bg-red-900/20 hover:bg-red-900/40 p-4 rounded-xl flex items-center gap-4 transition-all border border-red-500/30 group">
                                <div className="p-3 bg-red-500 rounded-full text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                                    <HeartHandshake className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-xl text-white">CVV 188</h4>
                                    <p className="text-red-200 text-xs">Apoio Emocional 24h</p>
                                </div>
                             </a>

                             <a href="tel:192" className="bg-red-900/20 hover:bg-red-900/40 p-4 rounded-xl flex items-center gap-4 transition-all border border-red-500/30 group">
                                <div className="p-3 bg-red-500 rounded-full text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                                    <Siren className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-xl text-white">SAMU 192</h4>
                                    <p className="text-red-200 text-xs">Emergência Médica</p>
                                </div>
                             </a>
                         </div>

                         {/* Cartão de Localização de Emergência */}
                         <div className="w-full bg-slate-800/80 rounded-2xl p-5 border border-white/10 mb-4 shadow-lg">
                             <div className="flex justify-between items-start mb-3">
                                 <h5 className="font-bold text-blue-300 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <MapPin className="w-4 h-4" /> Onde estou?
                                 </h5>
                                 <button 
                                    onClick={handleGetLocation}
                                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-bold"
                                 >
                                    {locationState.status === 'idle' ? 'Ver Localização' : 'Atualizar'}
                                 </button>
                             </div>
                             
                             <div className="bg-black/40 rounded-lg p-3 min-h-[60px] flex items-center justify-center text-center">
                                {locationState.status === 'idle' && <p className="text-white/30 text-xs">Clique para obter coordenadas GPS em caso de emergência.</p>}
                                {locationState.status === 'loading' && <p className="text-blue-400 text-xs animate-pulse">{locationState.text}</p>}
                                {locationState.status === 'error' && <p className="text-red-400 text-xs">{locationState.text}</p>}
                                {locationState.status === 'success' && (
                                    <p className="text-white font-mono text-sm select-all whitespace-pre-line">{locationState.text}</p>
                                )}
                             </div>
                         </div>

                         {/* Personal Contacts Section */}
                         <div className="w-full bg-slate-800/50 rounded-2xl p-6 border border-white/10 mb-4">
                            <h5 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                               <Phone className="w-4 h-4" />
                               Minha Rede de Apoio
                            </h5>
                            
                            <div className="space-y-3">
                                {safetyPlan.contacts.map((contact, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                                            {contact.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isEditingPlan ? (
                                                <div className="space-y-2">
                                                    <input 
                                                        value={contact.name} 
                                                        onChange={e => {
                                                            const newContacts = [...safetyPlan.contacts];
                                                            newContacts[idx].name = e.target.value;
                                                            setSafetyPlan({...safetyPlan, contacts: newContacts});
                                                        }}
                                                        className="w-full bg-black/40 rounded px-2 py-1 text-sm text-white border border-white/10" 
                                                        placeholder="Nome"
                                                    />
                                                    <input 
                                                        value={contact.phone} 
                                                        onChange={e => {
                                                            const newContacts = [...safetyPlan.contacts];
                                                            newContacts[idx].phone = e.target.value;
                                                            setSafetyPlan({...safetyPlan, contacts: newContacts});
                                                        }}
                                                        className="w-full bg-black/40 rounded px-2 py-1 text-xs text-white/70 border border-white/10" 
                                                        placeholder="Telefone"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-white font-bold truncate">{contact.name}</p>
                                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50">{contact.relation}</span>
                                                    </div>
                                                    <a href={`tel:${contact.phone}`} className="text-indigo-300 text-sm hover:underline flex items-center gap-1 mt-0.5">
                                                        {contact.phone}
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                        {isEditingPlan && (
                                            <button 
                                                onClick={() => {
                                                    const newContacts = safetyPlan.contacts.filter((_, i) => i !== idx);
                                                    setSafetyPlan({...safetyPlan, contacts: newContacts});
                                                }}
                                                className="text-red-400 hover:bg-red-500/20 p-2 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {isEditingPlan && (
                                    <button 
                                        onClick={() => setSafetyPlan({
                                            ...safetyPlan, 
                                            contacts: [...safetyPlan.contacts, { name: '', phone: '', relation: 'Amigo' }]
                                        })}
                                        className="w-full py-3 border border-dashed border-white/20 rounded-lg text-white/50 text-sm hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Adicionar Contato
                                    </button>
                                )}
                            </div>
                         </div>

                         <div className="w-full bg-amber-900/20 border border-amber-500/20 rounded-2xl p-6">
                            <h5 className="font-bold text-amber-200 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                               <Hand className="w-4 h-4" />
                               Lembrete Pessoal
                            </h5>
                            {isEditingPlan ? (
                                <textarea 
                                    value={safetyPlan.copingPhantom}
                                    onChange={(e) => setSafetyPlan({...safetyPlan, copingPhantom: e.target.value})}
                                    className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/10 h-24 focus:ring-1 focus:ring-amber-500 outline-none"
                                    placeholder="Escreva uma frase que te acalma..."
                                />
                            ) : (
                                <div className="text-white/90 text-lg font-medium italic text-center py-4 relative">
                                    <span className="absolute top-0 left-0 text-4xl text-white/10 font-serif">"</span>
                                    {safetyPlan.copingPhantom || "Isso é temporário. Eu já sobrevivi a dias difíceis antes."}
                                    <span className="absolute bottom-0 right-0 text-4xl text-white/10 font-serif">"</span>
                                </div>
                            )}
                         </div>
                    </div>
                )}

            </div>
        </FocusTrap>
      </div>
    </div>
  );
};