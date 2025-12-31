import React, { useState, useEffect } from 'react';
import { X, Wind, Eye, Hand, Ear, Coffee, Smile, Footprints, Phone, HeartHandshake, Siren, Edit2, Save, Plus, Trash2 } from 'lucide-react';
import FocusTrap from './FocusTrap';
import { storageService } from '../services/storageService';
import { SafetyPlan } from '../types';

interface BreathingModalProps {
  onClose: () => void;
}

type Mode = 'breathing' | 'grounding' | 'crisis';

export const BreathingModal: React.FC<BreathingModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode>('breathing');
  
  // States for Breathing
  const [phase, setPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [seconds, setSeconds] = useState(1);

  // States for Grounding
  const [groundingStep, setGroundingStep] = useState(0);

  // States for Crisis/Safety Plan
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({ contacts: [], copingPhantom: '', safePlace: '' });
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  useEffect(() => {
    if (mode === 'crisis') {
      setSafetyPlan(storageService.getSafetyPlan());
    }
  }, [mode]);

  // Breathing Logic
  useEffect(() => {
    if (mode !== 'breathing') return;

    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec < 4) {
          return prevSec + 1;
        } else {
          setPhase((prevPhase) => {
            if (prevPhase === 'inspire') return 'hold';
            if (prevPhase === 'hold') return 'expire';
            return 'inspire';
          });
          return 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

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

  const getInstruction = () => {
    switch (phase) {
      case 'inspire': return 'Inspirar';
      case 'hold': return 'Segurar';
      case 'expire': return 'Expirar';
      default: return '';
    }
  };

  const groundingSteps = [
    { count: 5, icon: Eye, text: "Coisas que você vê", desc: "Olhe ao redor e nomeie mentalmente objetos." },
    { count: 4, icon: Hand, text: "Coisas que você toca", desc: "Sinta a textura da roupa, cadeira ou pele." },
    { count: 3, icon: Ear, text: "Sons que você ouve", desc: "Foque em ruídos distantes ou próximos." },
    { count: 2, icon: Coffee, text: "Cheiros que você sente", desc: "Ou aromas que você gosta (café, chuva)." },
    { count: 1, icon: Smile, text: "Uma emoção boa", desc: "Ou algo que você gosta em você mesmo." }
  ];

  const currentGStep = groundingSteps[groundingStep];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-fade-in p-4 overflow-y-auto">
      <FocusTrap className="flex flex-col items-center w-full max-w-2xl min-h-[500px] justify-center relative py-12 md:py-0" aria-label="Ferramentas de Regulação">
        
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20">
            <div className="flex flex-wrap gap-2 bg-white/10 p-1 rounded-full backdrop-blur-md">
                <button 
                    onClick={() => setMode('breathing')}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'breathing' ? 'bg-white text-indigo-900 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                    <Wind className="w-4 h-4" />
                    Respiração
                </button>
                <button 
                    onClick={() => setMode('grounding')}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'grounding' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                    <Footprints className="w-4 h-4" />
                    Aterramento
                </button>
                <button 
                    onClick={() => setMode('crisis')}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${mode === 'crisis' ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                    <Siren className="w-4 h-4" />
                    Plano de Crise
                </button>
            </div>
            <button 
                onClick={onClose} 
                className="text-white/60 hover:text-white p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
                aria-label="Fechar exercício"
            >
                <X className="w-8 h-8" />
            </button>
        </div>

        {/* Content Area */}
        <div className="relative w-full flex flex-col items-center justify-center mt-12 md:mt-0">
            
            {mode === 'breathing' && (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Respire Comigo (4-4-4)</h3>
                    <div className="relative flex items-center justify-center w-64 h-64 mb-12">
                        <div className="absolute w-full h-full rounded-full bg-indigo-500/20 animate-breathe" />
                        <div 
                        className="absolute w-48 h-48 rounded-full bg-indigo-400/30 animate-breathe" 
                        style={{ animationDelay: '100ms' }}
                        />
                        <div className="absolute w-32 h-32 rounded-full bg-white text-indigo-900 flex items-center justify-center font-bold shadow-[0_0_50px_rgba(255,255,255,0.6)] z-10 transition-transform duration-[3000ms] ease-in-out animate-breathe">
                            <div className="flex flex-col items-center animate-fade-in">
                                <span className="text-4xl font-black mb-1 tabular-nums">
                                    {seconds}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Segundos</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-white/80 max-w-md space-y-4">
                        <p className="text-4xl font-bold tracking-wide text-indigo-300 transition-all duration-300 min-h-[3rem] flex items-center justify-center gap-3">
                            <span aria-hidden="true">
                                {phase === 'inspire' && '⬆️'}
                                {phase === 'hold' && '✋'}
                                {phase === 'expire' && '⬇️'}
                            </span>
                            {getInstruction()}
                        </p>
                    </div>
                </div>
            )}

            {mode === 'grounding' && (
                <div className="flex flex-col items-center w-full max-w-lg animate-in slide-in-from-right-8 duration-300 px-4">
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Técnica 5-4-3-2-1</h3>
                     <p className="text-emerald-300 text-sm font-medium mb-10 tracking-wider uppercase">Para Dissociação e Ansiedade</p>

                     <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 h-1.5 bg-emerald-500/30 w-full">
                            <div 
                                className="h-full bg-emerald-400 transition-all duration-500"
                                style={{ width: `${((groundingStep + 1) / 5) * 100}%` }}
                            />
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">
                             <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-2">
                                <currentGStep.icon className="w-10 h-10" />
                             </div>
                             
                             <div>
                                <h4 className="text-6xl font-black text-white mb-2 leading-none">{currentGStep.count}</h4>
                                <h5 className="text-xl font-bold text-emerald-200">{currentGStep.text}</h5>
                             </div>
                             
                             <p className="text-white/70 text-base leading-relaxed max-w-xs">
                                {currentGStep.desc}
                             </p>

                             <div className="flex gap-3 w-full pt-4">
                                <button 
                                    onClick={() => setGroundingStep(Math.max(0, groundingStep - 1))}
                                    disabled={groundingStep === 0}
                                    className="flex-1 py-3 rounded-xl font-bold text-white/50 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                                >
                                    Voltar
                                </button>
                                <button 
                                    onClick={() => {
                                        if (groundingStep < 4) setGroundingStep(groundingStep + 1);
                                        else onClose();
                                    }}
                                    className="flex-[2] py-3 rounded-xl font-bold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
                                >
                                    {groundingStep === 4 ? "Finalizar" : "Próximo Passo"}
                                </button>
                             </div>
                        </div>
                     </div>
                </div>
            )}

            {mode === 'crisis' && (
                <div className="flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-right-8 duration-300 px-4 pb-10">
                     <div className="flex items-center justify-center gap-3 mb-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-white text-center">Plano de Segurança</h3>
                        <button 
                            onClick={() => isEditingPlan ? handleSavePlan() : setIsEditingPlan(true)}
                            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title={isEditingPlan ? "Salvar" : "Editar Plano"}
                        >
                            {isEditingPlan ? <Save className="w-5 h-5 text-green-400" /> : <Edit2 className="w-5 h-5" />}
                        </button>
                     </div>
                     <p className="text-red-300 text-sm font-medium mb-8 tracking-wider uppercase text-center">
                        {isEditingPlan ? "Personalize seus recursos" : "Recursos Imediatos"}
                     </p>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                         <a href="tel:188" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center gap-4 transition-all border border-white/10 group">
                            <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400 group-hover:scale-110 transition-transform">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-bold text-lg text-white">CVV 188</h4>
                                <p className="text-white/60 text-xs">Apoio Emocional 24h</p>
                            </div>
                         </a>

                         <a href="tel:192" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center gap-4 transition-all border border-white/10 group">
                            <div className="p-3 bg-red-500/20 rounded-full text-red-400 group-hover:scale-110 transition-transform">
                                <Siren className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-bold text-lg text-white">SAMU 192</h4>
                                <p className="text-white/60 text-xs">Emergência Médica</p>
                            </div>
                         </a>
                     </div>

                     {/* Personal Contacts Section */}
                     <div className="w-full bg-slate-800/50 rounded-2xl p-6 border border-white/10 mb-4">
                        <h5 className="font-bold text-blue-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                           <Phone className="w-4 h-4" />
                           Minha Rede de Apoio
                        </h5>
                        
                        <div className="space-y-3">
                            {safetyPlan.contacts.map((contact, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">
                                        {contact.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {isEditingPlan ? (
                                            <div className="space-y-1">
                                                <input 
                                                    value={contact.name} 
                                                    onChange={e => {
                                                        const newContacts = [...safetyPlan.contacts];
                                                        newContacts[idx].name = e.target.value;
                                                        setSafetyPlan({...safetyPlan, contacts: newContacts});
                                                    }}
                                                    className="w-full bg-white/10 rounded px-2 py-1 text-sm text-white" 
                                                    placeholder="Nome"
                                                />
                                                <input 
                                                    value={contact.phone} 
                                                    onChange={e => {
                                                        const newContacts = [...safetyPlan.contacts];
                                                        newContacts[idx].phone = e.target.value;
                                                        setSafetyPlan({...safetyPlan, contacts: newContacts});
                                                    }}
                                                    className="w-full bg-white/10 rounded px-2 py-1 text-xs text-white/70" 
                                                    placeholder="Telefone"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white font-medium truncate">{contact.name}</p>
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50">{contact.relation}</span>
                                                </div>
                                                <a href={`tel:${contact.phone}`} className="text-blue-300 text-sm hover:underline flex items-center gap-1">
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
                                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-white/50 text-sm hover:bg-white/5 hover:text-white flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Adicionar Contato
                                </button>
                            )}

                            {!isEditingPlan && safetyPlan.contacts.length === 0 && (
                                <p className="text-white/30 text-center text-sm italic py-2">Nenhum contato pessoal cadastrado.</p>
                            )}
                        </div>
                     </div>

                     <div className="w-full bg-red-900/20 border border-red-500/20 rounded-2xl p-6">
                        <h5 className="font-bold text-red-200 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                           <Hand className="w-4 h-4" />
                           Lembrete Pessoal
                        </h5>
                        {isEditingPlan ? (
                            <textarea 
                                value={safetyPlan.copingPhantom}
                                onChange={(e) => setSafetyPlan({...safetyPlan, copingPhantom: e.target.value})}
                                className="w-full bg-black/20 text-white p-3 rounded-lg text-sm border border-white/10 h-24"
                                placeholder="Escreva uma frase que te acalma..."
                            />
                        ) : (
                            <div className="text-white/80 text-lg font-medium italic text-center py-4 relative">
                                <span className="absolute top-0 left-0 text-4xl text-white/10">"</span>
                                {safetyPlan.copingPhantom || "Isso é temporário. Eu já sobrevivi a dias difíceis antes."}
                                <span className="absolute bottom-0 right-0 text-4xl text-white/10">"</span>
                            </div>
                        )}
                     </div>
                </div>
            )}

        </div>

        {mode === 'breathing' && (
            <button 
                onClick={onClose} 
                className="mt-8 mb-8 md:mt-12 px-10 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
                Estou me sentindo melhor
            </button>
        )}
      </FocusTrap>
    </div>
  );
};