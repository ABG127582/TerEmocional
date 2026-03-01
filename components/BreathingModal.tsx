import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Wind, Eye, Hand, Ear, Coffee, Smile, Phone, HeartHandshake, Siren, Edit2, Save, Plus, Trash2, MapPin, Smartphone, Navigation, Volume2, VolumeX, ThumbsUp, Minus, ArrowRight, Brain, Shield, Flame, Droplets, Anchor, AlertTriangle, Calculator, Share2, MessageCircle, PhoneCall } from 'lucide-react';
import FocusTrap from './FocusTrap';
import { storageService } from '../services/storageService';
import { SafetyPlan } from '../types';

interface BreathingModalProps {
  onClose: () => void;
}

type Mode = 'breathing' | 'grounding' | 'regulation' | 'rumination' | 'crisis';
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

const MAX_REGULATION_STRATEGIES = [
    {
        id: 'raiva',
        label: 'Fúria / Ódio',
        icon: Flame,
        color: 'bg-red-500',
        title: 'Choque Térmico (Gelo)',
        desc: "Interrompa o sequestro da amígdala fisicamente.",
        steps: [
            "NÃO FALE. NÃO AJA. NÃO DECIDA.",
            "Vá até a geladeira agora.",
            "Pegue um cubo de gelo e aperte na mão fechada.",
            "Foque toda sua atenção na dor do frio.",
            "Deixe o gelo derreter um pouco.",
            "A sensação física intensa 'reseta' o cérebro reptiliano."
        ]
    },
    {
        id: 'medo',
        label: 'Pânico / Terror',
        icon: AlertTriangle,
        color: 'bg-purple-600',
        title: 'Ancoragem Física',
        desc: "Sobrevivendo à onda de pânico.",
        steps: [
            "Sente-se no chão. Sinta o chão segurando você.",
            "Encoste as costas na parede com força.",
            "O pânico é uma onda. Ele sobe, quebra e desce.",
            "Não lute contra. Diga: 'É apenas fisiologia'.",
            "Foque apenas na sensação das costas contra a parede."
        ]
    },
    {
        id: 'tristeza',
        label: 'Desespero / Dor',
        icon: Droplets,
        color: 'bg-blue-600',
        title: 'Mergulho Simulado (TIPP)',
        desc: "Técnica para baixar a frequência cardíaca instantaneamente.",
        steps: [
            "Pegue uma bacia com água gelada (ou bolsa de gelo).",
            "Prenda a respiração.",
            "Mergulhe o rosto na água (ou coloque gelo nas olheiras).",
            "Segure por 30 segundos.",
            "Isso ativa o Nervo Vago e força seu corpo a 'desligar' o pânico."
        ]
    },
    {
        id: 'nojo',
        label: 'Repulsa Extrema',
        icon: Anchor,
        color: 'bg-teal-600',
        title: 'Controle de Náusea',
        desc: "Estabilizando o reflexo vagal.",
        steps: [
            "Sente-se e incline a cabeça levemente para frente.",
            "Respire devagar pelo nariz, evitando cheiros.",
            "Coloque um pano frio na nuca ou na testa.",
            "Não engula saliva em excesso, cuspa se precisar.",
            "Foque em um ponto fixo visual."
        ]
    }
];

export const BreathingModal: React.FC<BreathingModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode>('breathing');
  const [viewState, setViewState] = useState<'exercise' | 'feedback'>('exercise');
  const [feedbackResult, setFeedbackResult] = useState<'better' | 'same' | null>(null);
  
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
  const [locationState, setLocationState] = useState<{ 
      status: 'idle' | 'loading' | 'success' | 'error', 
      text: string,
      coords?: { lat: number, lng: number } 
  }>({ status: 'idle', text: '' });

  // States for Regulation (Max Level)
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);

  // States for Rumination (Math)
  const [mathStart, setMathStart] = useState(100);

  useEffect(() => {
    if (mode === 'crisis') {
      setSafetyPlan(storageService.getSafetyPlan());
    }
    // Reset selections on mode change
    setSelectedRegulation(null);
    setMathStart(100);
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

  // --- INTERCEPT CLOSE ---
  const handleCloseAttempt = () => {
      if (mode !== 'crisis' && viewState === 'exercise') {
          // Pause activities
          setIsActive(false); 
          if (useSound && audioCtxRef.current) audioCtxRef.current.suspend();
          
          setViewState('feedback');
      } else {
          onClose();
      }
  };

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
    if (mode !== 'breathing' || !isActive || viewState !== 'exercise') return;

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
  }, [mode, isActive, technique, phaseIndex, useVibration, useSound, updateAudio, viewState]);

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

  // --- GEOLOCATION & SHARING ---
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
            text: `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}\n(Precisão: ${Math.round(position.coords.accuracy)}m)`,
            coords: { lat: latitude, lng: longitude }
        });
      },
      (error) => {
        setLocationState({ status: 'error', text: 'Não foi possível obter a localização. Verifique permissões do GPS.' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleShareLocation = () => {
      if (locationState.status !== 'success' || !locationState.coords) return;
      
      const mapLink = `https://www.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lng}`;
      const message = `Preciso de ajuda ou apoio. Minha localização atual é: ${mapLink}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
  };

  const handleContactWhatsApp = (phone: string, name: string) => {
      // Limpar número (manter apenas dígitos)
      const cleanPhone = phone.replace(/\D/g, '');
      const message = `Oi ${name}, estou usando meu plano de segurança emocional e preciso conversar um pouco. Pode falar?`;
      
      // Se tiver menos de 10 digitos, provavelmente está errado, mas tenta abrir
      // Idealmente, se não tiver código de país, pode dar erro no deep link com número,
      // mas vamos tentar assumir BR (55) se não começar com ele e tiver tamanho de celular BR.
      let finalPhone = cleanPhone;
      if (!finalPhone.startsWith('55') && finalPhone.length >= 10) {
          finalPhone = '55' + finalPhone;
      }

      const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
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
      if (e.key === 'Escape') handleCloseAttempt();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, viewState]);

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
            
            {/* Header Navigation - Scrollable for small screens */}
            <div className="w-full flex justify-between items-start mb-6 z-20">
                {viewState === 'exercise' ? (
                  <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10 max-w-[85%] overflow-x-auto no-scrollbar">
                      <button 
                          onClick={() => setMode('breathing')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${mode === 'breathing' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                          <Wind className="w-4 h-4" />
                          Respiração
                      </button>
                      <button 
                          onClick={() => setMode('grounding')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${mode === 'grounding' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                          <Navigation className="w-4 h-4" />
                          Aterramento
                      </button>
                      <button 
                          onClick={() => setMode('regulation')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${mode === 'regulation' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                          <Shield className="w-4 h-4" />
                          Antídotos (Max)
                      </button>
                      <button 
                          onClick={() => setMode('rumination')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${mode === 'rumination' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                          <Brain className="w-4 h-4" />
                          Mente
                      </button>
                      <button 
                          onClick={() => setMode('crisis')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${mode === 'crisis' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                      >
                          <Siren className="w-4 h-4" />
                          Crise
                      </button>
                  </div>
                ) : (
                  <div className="flex-1" /> // Spacer
                )}
                
                <button 
                    onClick={handleCloseAttempt} 
                    className="text-white/60 hover:text-white p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:bg-white/10 ml-2"
                    aria-label="Fechar exercício"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
                
                {/* --- MODO FEEDBACK (PÓS-SOS) --- */}
                {viewState === 'feedback' && (
                  <div className="animate-in zoom-in-95 duration-300 text-center max-w-sm">
                      {!feedbackResult ? (
                          <>
                              <h3 className="text-2xl font-bold text-white mb-4">Como se sente agora?</h3>
                              <p className="text-white/60 mb-8 text-sm">Validar o resultado ajuda seu cérebro a aprender que a regulação funciona.</p>
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <button 
                                      onClick={() => setFeedbackResult('better')}
                                      className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all transform hover:scale-105 shadow-lg border border-indigo-400/30"
                                  >
                                      <ThumbsUp className="w-8 h-8" />
                                      <span className="font-bold">Melhor</span>
                                  </button>
                                  <button 
                                      onClick={() => setFeedbackResult('same')}
                                      className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-105 border border-white/10"
                                  >
                                      <Minus className="w-8 h-8" />
                                      <span className="font-bold">Igual</span>
                                  </button>
                              </div>
                          </>
                      ) : (
                          <div className="flex flex-col items-center animate-in fade-in duration-500">
                               {feedbackResult === 'better' ? (
                                   <>
                                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce-short">
                                            <Smile className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Excelente!</h3>
                                        <p className="text-white/70 mb-6">Seu sistema nervoso acaba de registrar que você tem controle.</p>
                                   </>
                               ) : (
                                   <>
                                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white mb-4">
                                            <Wind className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Tudo bem.</h3>
                                        <p className="text-white/70 mb-6">A regulação é uma prática. O simples fato de tentar já ajuda.</p>
                                   </>
                               )}
                               <button 
                                  onClick={onClose}
                                  className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                               >
                                  Voltar ao App <ArrowRight className="w-4 h-4" />
                               </button>
                          </div>
                      )}
                  </div>
                )}

                {/* --- MODO RESPIRAÇÃO --- */}
                {viewState === 'exercise' && mode === 'breathing' && (
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
                {viewState === 'exercise' && mode === 'grounding' && (
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
                                            else handleCloseAttempt(); // Feedback at end
                                        }}
                                        className="flex-[2] py-3 rounded-xl font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] text-sm"
                                    >
                                        {groundingStep === 4 ? "Finalizar" : "Próximo Passo"}
                                    </button>
                                 </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* --- MODO REGULAÇÃO (MAX LEVEL) --- */}
                {viewState === 'exercise' && mode === 'regulation' && (
                    <div className="flex flex-col items-center w-full max-w-2xl animate-in zoom-in-95 duration-300 px-4">
                        {!selectedRegulation ? (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-2 text-center">Antídotos de Alta Intensidade</h3>
                                <p className="text-blue-300 text-sm font-medium mb-8 tracking-wider uppercase text-center">O que você está sentindo no nível máximo?</p>
                                
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {MAX_REGULATION_STRATEGIES.map(st => (
                                        <button 
                                            key={st.id}
                                            onClick={() => setSelectedRegulation(st.id)}
                                            className={`flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] group`}
                                        >
                                            <div className={`w-14 h-14 rounded-full ${st.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <st.icon className={`w-8 h-8 ${st.color.replace('bg-', 'text-')}`} />
                                            </div>
                                            <span className="text-white font-bold text-lg mb-1">{st.label}</span>
                                            <span className="text-white/40 text-xs text-center">{st.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl relative animate-in slide-in-from-bottom">
                                <button 
                                    onClick={() => setSelectedRegulation(null)}
                                    className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-wider"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
                                </button>
                                
                                {(() => {
                                    const strategy = MAX_REGULATION_STRATEGIES.find(s => s.id === selectedRegulation)!;
                                    return (
                                        <div className="flex flex-col items-center text-center mt-4">
                                            <div className={`w-20 h-20 rounded-full ${strategy.color} bg-opacity-20 flex items-center justify-center mb-6 shadow-[0_0_30px_currentColor]`} style={{ color: strategy.color }}>
                                                <strategy.icon className={`w-10 h-10 ${strategy.color.replace('bg-', 'text-')}`} />
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-2">{strategy.title}</h3>
                                            <p className="text-white/60 mb-8 max-w-md">{strategy.desc}</p>
                                            
                                            <div className="space-y-4 w-full text-left bg-black/20 p-6 rounded-2xl border border-white/5">
                                                {strategy.steps.map((step, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className={`w-6 h-6 rounded-full ${strategy.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-white text-lg font-medium leading-relaxed">{step}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={handleCloseAttempt}
                                                className={`mt-8 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 ${strategy.color}`}
                                            >
                                                Já me sinto capaz de pensar
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {/* --- MODO RUMINAÇÃO (MENTE) --- */}
                {viewState === 'exercise' && mode === 'rumination' && (
                    <div className="flex flex-col items-center w-full max-w-lg animate-in slide-in-from-right duration-300 px-4">
                         <h3 className="text-2xl font-bold text-white mb-2 text-center">Interrupção Cognitiva</h3>
                         <p className="text-amber-400 text-sm font-medium mb-8 tracking-wider uppercase">Sobrecarga de Memória de Trabalho</p>
                         
                         <div className="w-full bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
                            <Calculator className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                            <p className="text-white/80 mb-6">
                                A ruminação usa a mesma área do cérebro que o cálculo matemático. 
                                Ao forçar um cálculo, você fisicamente "rouba" energia da preocupação.
                            </p>

                            <div className="bg-black/30 rounded-2xl p-6 mb-6">
                                <p className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-2">Desafio Mental</p>
                                <div className="text-5xl font-mono font-black text-white mb-4 tracking-tighter">
                                    {mathStart}
                                </div>
                                <p className="text-amber-500 font-bold mb-4">- 7 = ?</p>
                                
                                <button 
                                    onClick={() => setMathStart(prev => prev - 7)}
                                    className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
                                >
                                    {mathStart - 7}
                                </button>
                            </div>
                            
                            <p className="text-xs text-white/30 italic">
                                Continue subtraindo até sentir que o pensamento obsessivo perdeu força.
                            </p>
                         </div>
                    </div>
                )}

                {/* --- MODO CRISE --- */}
                {viewState === 'exercise' && mode === 'crisis' && (
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
                             
                             <div className="bg-black/40 rounded-lg p-3 min-h-[60px] flex items-center justify-center text-center flex-col gap-2">
                                {locationState.status === 'idle' && <p className="text-white/30 text-xs">Clique para obter coordenadas GPS em caso de emergência.</p>}
                                {locationState.status === 'loading' && <p className="text-blue-400 text-xs animate-pulse">{locationState.text}</p>}
                                {locationState.status === 'error' && <p className="text-red-400 text-xs">{locationState.text}</p>}
                                {locationState.status === 'success' && (
                                    <>
                                        <p className="text-white font-mono text-sm select-all whitespace-pre-line">{locationState.text}</p>
                                        <button 
                                            onClick={handleShareLocation}
                                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-all w-full justify-center"
                                        >
                                            <Share2 className="w-3 h-3" /> Enviar via WhatsApp
                                        </button>
                                    </>
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
                                                <div className="flex flex-col">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-white font-bold truncate">{contact.name}</p>
                                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50">{contact.relation}</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <a 
                                                            href={`tel:${contact.phone}`} 
                                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-xs font-bold transition-colors"
                                                        >
                                                            <PhoneCall className="w-3 h-3" /> Ligar
                                                        </a>
                                                        <button 
                                                            onClick={() => handleContactWhatsApp(contact.phone, contact.name)}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-xs font-bold transition-colors"
                                                        >
                                                            <MessageCircle className="w-3 h-3" /> Mensagem
                                                        </button>
                                                    </div>
                                                </div>
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
