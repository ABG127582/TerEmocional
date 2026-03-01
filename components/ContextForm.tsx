import React, { useState, useRef, useEffect } from 'react';
import { EmotionScale, ContextData } from '../types';
import { emotionColors, emotionalScales, somaticSensations, cognitiveDistortions } from '../constants';
import { storageService } from '../services/storageService';
import { Activity, X, Battery, BatteryLow, BatteryMedium, BatteryFull, Moon, Zap, Layers, ArrowRight, ArrowLeft, Check, Brain, MapPin, Users, HelpCircle, Plus, Crosshair, Target, Edit2, Trash2, Sparkles, Loader2, Wand2, Mic, MicOff } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { GoogleGenAI, Type } from "@google/genai";

// --- Utilitários de UI ---

const getSleepColor = (hours: number) => {
  if (hours < 5) return '#ff0033'; // Vermelho Neon Crítico
  if (hours < 7) return '#ffaa00'; // Laranja Alerta
  return '#39ff14'; // Verde Néon Vibrante
};

interface SleepSliderProps {
  value: number;
  onChange: (val: number) => void;
  color: string;
}

const SleepSlider: React.FC<SleepSliderProps> = ({ value, onChange, color }) => {
  const percentage = (value / 12) * 100;
  
  return (
    <div className="relative h-12 w-full bg-black rounded-xl border border-slate-700 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] group touch-none">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} 
      />
      <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none opacity-40">
         {[0, 3, 6, 9, 12].map(h => (
           <div key={h} className="h-2 w-0.5 bg-white shadow-[0_0_5px_white]" />
         ))}
      </div>
      <div className="absolute top-1/2 left-3 right-3 h-1.5 -mt-0.5 rounded-full bg-slate-800 overflow-visible">
         <div className="absolute inset-0 rounded-full opacity-80" 
              style={{
                background: 'linear-gradient(90deg, #ff0033 0%, #ff4400 30%, #ffff00 45%, #39ff14 58%, #39ff14 100%)',
                boxShadow: '0 0 10px rgba(255,255,255,0.1)'
              }}
         />
      </div>
      <input
        type="range" min="0" max="12" step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        aria-label="Horas de sono"
      />
      <div 
        className="absolute top-1/2 h-6 w-6 -mt-3 -ml-3 z-10 pointer-events-none transition-all duration-75"
        style={{ left: `calc(${percentage}% - ${(percentage/100)*12}px + 6px)` }}
      >
         <div 
           className="w-full h-full rounded-full bg-white border-2 border-white transition-all duration-300"
           style={{ 
             boxShadow: `0 0 15px ${color}, 0 0 30px ${color}, inset 0 0 5px ${color}`,
             backgroundColor: '#fff' 
           }}
         />
      </div>
    </div>
  );
};

interface EnergySelectorProps {
  value: number;
  onChange: (val: number) => void;
  theme: 'light' | 'dark';
}

const EnergySelector: React.FC<EnergySelectorProps> = ({ value, onChange, theme }) => {
  const levels = [1, 3, 5, 7, 9]; 
  return (
    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-lg p-2">
      {levels.map((val, idx) => {
        const isSelected = value >= val;
        const isCurrent = value >= val && (idx === levels.length - 1 || value < levels[idx + 1]);
        
        let Icon = Battery;
        if (idx === 0) Icon = BatteryLow;
        if (idx === 2) Icon = BatteryMedium;
        if (idx === 4) Icon = BatteryFull;

        let activeColorClass = 'text-slate-400';
        
        if (isSelected) {
           if (val < 4) activeColorClass = 'text-red-500';
           else if (val < 8) activeColorClass = 'text-yellow-400';
           else activeColorClass = 'text-cyan-400';
        }

        return (
          <button
            key={val}
            onClick={() => onChange(val + 1)}
            className={`p-1 rounded transition-all transform hover:scale-110 ${activeColorClass} ${isCurrent ? 'scale-110 drop-shadow-md' : ''} ${!isSelected && theme === 'dark' ? 'text-slate-700' : ''}`}
          >
            <Icon className={`w-6 h-6 ${isCurrent ? 'fill-current' : ''}`} />
          </button>
        );
      })}
    </div>
  );
};

// --- Novo Componente: Seletor Visual Circumplexo ---
interface CircumplexSelectorProps {
    valence: number;
    arousal: number;
    onChange: (valence: number, arousal: number) => void;
    theme: 'light' | 'dark';
}

const CircumplexSelector: React.FC<CircumplexSelectorProps> = ({ valence, arousal, onChange, theme }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleInteraction = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calcular porcentagem (0 a 1)
        let xPct = (clientX - rect.left) / rect.width;
        let yPct = 1 - ((clientY - rect.top) / rect.height); // Inverter Y pois CSS top é 0

        // Clamp 0-1
        xPct = Math.max(0, Math.min(1, xPct));
        yPct = Math.max(0, Math.min(1, yPct));

        // Converter para escala 1-10
        const newValence = Math.round((xPct * 9 + 1) * 10) / 10;
        const newArousal = Math.round((yPct * 9 + 1) * 10) / 10;

        onChange(newValence, newArousal);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleInteraction(e.clientX, e.clientY);
        const handleMouseMove = (ev: MouseEvent) => handleInteraction(ev.clientX, ev.clientY);
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
        e.preventDefault(); // Prevenir scroll enquanto arrasta
    };

    // Posição do ponto (0-100%)
    const leftPct = ((valence - 1) / 9) * 100;
    const bottomPct = ((arousal - 1) / 9) * 100;

    return (
        <div className="w-full flex flex-col items-center">
             <div 
                ref={containerRef}
                className={`relative w-full aspect-square max-w-[280px] rounded-xl border-2 cursor-crosshair overflow-hidden shadow-inner ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-300'}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
             >
                {/* Grid Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                     style={{ backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '25% 25%' }} 
                />
                
                {/* Eixos Centrais */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400/50 transform -translate-x-1/2 pointer-events-none" />
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-400/50 transform -translate-y-1/2 pointer-events-none" />

                {/* Etiquetas de Quadrante (Sutis) */}
                <span className="absolute top-2 right-2 text-[8px] opacity-40 uppercase font-bold">Alta Energia / Prazer</span>
                <span className="absolute top-2 left-2 text-[8px] opacity-40 uppercase font-bold">Alta Energia / Desprazer</span>
                <span className="absolute bottom-2 left-2 text-[8px] opacity-40 uppercase font-bold">Baixa Energia / Desprazer</span>
                <span className="absolute bottom-2 right-2 text-[8px] opacity-40 uppercase font-bold">Baixa Energia / Prazer</span>

                {/* O Ponto Indicador */}
                <div 
                    className="absolute w-6 h-6 rounded-full shadow-[0_0_10px_currentColor] border-2 border-white transform -translate-x-1/2 translate-y-1/2 transition-transform duration-75"
                    style={{ 
                        left: `${leftPct}%`, 
                        bottom: `${bottomPct}%`,
                        backgroundColor: leftPct > 50 ? '#34d399' : '#f87171', // Verde se prazer, Vermelho se desprazer
                        color: leftPct > 50 ? '#34d399' : '#f87171'
                    }}
                >
                    <Crosshair className="w-full h-full p-0.5 text-white animate-spin-slow" />
                </div>
             </div>
             
             {/* Legendinhas */}
             <div className="flex justify-between w-full max-w-[280px] text-[10px] mt-2 font-bold opacity-60 uppercase">
                <span>Desprazer</span>
                <span>Prazer</span>
             </div>
             <div className="text-xs mt-2 font-mono flex gap-4">
                 <span>Valência: <strong>{valence}</strong></span>
                 <span>Energia: <strong>{arousal}</strong></span>
             </div>
        </div>
    );
};

// --- Novo Componente: Input de Tag Customizada ---
const TagInput = ({ onAdd, placeholder, theme }: { onAdd: (val: string) => void, placeholder: string, theme: string }) => {
    const [val, setVal] = useState('');
    const inputClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';

    return (
        <div className="flex gap-2 mt-2">
            <input 
                value={val}
                onChange={e => setVal(e.target.value)}
                placeholder={placeholder}
                className={`flex-1 px-3 py-1.5 rounded-lg text-sm border ${inputClass} outline-none focus:ring-1 focus:ring-blue-500`}
                onKeyDown={e => {
                    if (e.key === 'Enter' && val.trim()) {
                        onAdd(val.trim());
                        setVal('');
                    }
                }}
            />
            <button 
                onClick={() => {
                    if (val.trim()) {
                        onAdd(val.trim());
                        setVal('');
                    }
                }}
                disabled={!val.trim()}
                className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};


const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

// --- Wizard Form ---

interface ContextFormProps {
  emotionKey: string;
  emotion: EmotionScale;
  level: number;
  onSave: (data: any) => void;
  onCancel: () => void;
  theme: 'light' | 'dark';
}

export const ContextForm: React.FC<ContextFormProps> = ({ emotionKey, emotion, level, onSave, onCancel, theme }) => {
  const [step, setStep] = useState(0); // 0: Fisiologia, 1: Contexto, 2: Corpo/Estratégia, 3: Cognitivo/Notas
  const [date, setDate] = useState(toLocalISOString(new Date()));
  
  // AI & Voice States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [context, setContext] = useState<ContextData>({
    location: 'Casa',
    company: [],
    trigger: '',
    duration: '1-5m',
    copingStrategies: [],
    bodySensations: [],
    thinkingTraps: [],
    sleepHours: 7, 
    energy: 5,
    habits: {
      water: false,
      exercise: false,
      meds: false,
      therapy: false
    },
    notes: '',
    secondaryEmotion: null,
    secondaryLevel: 0,
    customValence: emotion.levels[level - 1]?.valence || 5,
    customArousal: emotion.levels[level - 1]?.arousal || 5
  });

  // Arrays de opções com persistência
  const [locations, setLocations] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  
  // Estado para controlar qual seção está em modo de edição (exclusão)
  const [editingSection, setEditingSection] = useState<'locations' | 'company' | 'triggers' | null>(null);

  // Carregar tags do storage ao iniciar
  useEffect(() => {
      const savedTags = storageService.getUserTags();
      setLocations(savedTags.locations);
      setCompanyOptions(savedTags.company);
      setTriggers(savedTags.triggers);
  }, []);

  // --- VOICE RECOGNITION SETUP ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pt-BR';

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            // Append to existing notes only when finished or update efficiently?
            // Simple approach: Update state. Note: This replaces, so we need logic to append if desired.
            // For simplicity here, we append the final result to the previous note state.
            if (finalTranscript) {
                setContext(prev => ({
                    ...prev,
                    notes: (prev.notes ? prev.notes + ' ' : '') + finalTranscript
                }));
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
  }, []);

  const toggleListening = () => {
      if (!recognitionRef.current) {
          alert("Seu navegador não suporta reconhecimento de voz.");
          return;
      }

      if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  };

  // Função para salvar tags atualizadas
  const updateTags = (type: 'locations' | 'company' | 'triggers', newTags: string[]) => {
      const currentTags = storageService.getUserTags();
      const updated = { ...currentTags, [type]: newTags };
      storageService.saveUserTags(updated);
      
      if (type === 'locations') setLocations(newTags);
      if (type === 'company') setCompanyOptions(newTags);
      if (type === 'triggers') setTriggers(newTags);
  };

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const inputClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';
  const emotionColor = emotionColors[emotionKey];
  const currentSleepColor = getSleepColor(context.sleepHours);

  const copingOptions = ['Respirar', 'Sair', 'Música', 'Água', 'Exercício', 'Escrever', 'Falar'];
  const isNegativeEmotion = ['raiva', 'tristeza', 'medo', 'nojo'].includes(emotionKey);

  // --- AI ANALYSIS ---
  const handleAiAnalysis = async () => {
    if (!context.notes || context.notes.trim().length < 5) {
        alert("Escreva uma nota mais detalhada para a IA analisar.");
        return;
    }

    setIsAiLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Analise o texto de diário emocional abaixo e extraia dados estruturados.
            
            Texto do usuário: "${context.notes}"

            Instruções:
            1. Identifique o Gatilho principal (causa da emoção) em poucas palavras.
            2. Identifique sensações físicas mencionadas ou implícitas (mapeie para a lista permitida abaixo).
            3. Identifique possíveis distorções cognitivas (mapeie para os IDs permitidos abaixo).

            Listas permitidas:
            - Sensações: ${somaticSensations.join(', ')}
            - Distorções (IDs): ${JSON.stringify(cognitiveDistortions.map(d => ({id: d.id, label: d.label})))}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        trigger: { type: Type.STRING, description: "O gatilho curto identificado" },
                        sensations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de sensações físicas da lista permitida" },
                        distortionIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs das distorções cognitivas identificadas" }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);

        setContext(prev => ({
            ...prev,
            trigger: data.trigger || prev.trigger,
            bodySensations: [...new Set([...prev.bodySensations, ...(data.sensations || [])])],
            thinkingTraps: [...new Set([...prev.thinkingTraps, ...(data.distortionIds || [])])]
        }));

        // Adicionar gatilho à lista se for novo e não vazio
        if (data.trigger && !triggers.includes(data.trigger)) {
            updateTags('triggers', [...triggers, data.trigger]);
        }

    } catch (error) {
        console.error("Erro na análise IA:", error);
        alert("Não foi possível analisar o texto agora.");
    } finally {
        setIsAiLoading(false);
    }
  };


  const renderEditableSection = (
      title: string, 
      icon: React.ElementType, 
      items: string[], 
      selectedItem: string | string[], 
      sectionKey: 'locations' | 'company' | 'triggers',
      onSelect: (val: string) => void,
      multiSelect: boolean = false
  ) => {
      const isEditing = editingSection === sectionKey;

      return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                    <IconWrapper className="w-3 h-3" as={icon} /> {title}
                </label>
                <button 
                    onClick={() => setEditingSection(isEditing ? null : sectionKey)}
                    className={`p-1.5 rounded-full transition-colors ${isEditing ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title={isEditing ? "Concluir edição" : "Editar/Excluir tags"}
                >
                    {isEditing ? <Check className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {items.map(item => {
                    const isSelected = multiSelect 
                        ? (selectedItem as string[]).includes(item) 
                        : selectedItem === item;
                    
                    return (
                        <div key={item} className="relative group">
                            <button 
                                onClick={() => {
                                    if (isEditing) {
                                        updateTags(sectionKey, items.filter(i => i !== item));
                                    } else {
                                        onSelect(item);
                                    }
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all 
                                    ${isEditing 
                                        ? 'border-red-400 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 pr-8' 
                                        : isSelected 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                                            : `${inputClass} opacity-70 hover:opacity-100`
                                    }`}
                            >
                                {item}
                                {isEditing && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <Trash2 className="w-3 h-3" />
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            <TagInput 
                onAdd={(val) => {
                    if (!items.includes(val)) {
                        updateTags(sectionKey, [...items, val]);
                        if (!isEditing) onSelect(val);
                    }
                }}
                placeholder={`Adicionar ${title.toLowerCase()}...`} 
                theme={theme} 
            />
        </div>
      );
  };

  const renderStepContent = () => {
      switch(step) {
          case 0: // FISIOLOGIA & TEMPO
              return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div>
                        <div className="flex items-center mb-4">
                            <h3 className={`font-bold text-lg ${textClass}`}>Como você está biologicamente?</h3>
                            <InfoTooltip text="Fatores físicos (sono, fome, energia) alteram como o cérebro processa emoções. É o 'terreno' onde a emoção cresce." direction="bottom" />
                        </div>
                        <p className={`text-sm ${textSecondary} mb-6`}>Fatores físicos afetam drasticamente nossa regulação emocional.</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Horário do Evento</label>
                                <input 
                                    type="datetime-local" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={`w-full px-3 py-3 rounded-xl border ${inputClass} outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                                        <Moon className="w-4 h-4" /> Sono (Última noite)
                                    </label>
                                    <span className="text-lg font-mono font-bold" style={{ color: currentSleepColor }}>{context.sleepHours}h</span>
                                </div>
                                <SleepSlider 
                                    value={context.sleepHours} 
                                    onChange={(val) => setContext(prev => ({ ...prev, sleepHours: val }))}
                                    color={currentSleepColor}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                                        <Zap className="w-4 h-4" /> Nível de Energia
                                    </label>
                                    <span className={`text-lg font-mono font-bold ${textClass}`}>{context.energy}/10</span>
                                </div>
                                <EnergySelector 
                                    value={context.energy} 
                                    onChange={(val) => setContext(prev => ({ ...prev, energy: val }))}
                                    theme={theme}
                                />
                            </div>

                            {/* Rastreador de Hábitos */}
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                                    <Activity className="w-4 h-4" /> Hábitos de Hoje
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'water', label: 'Água (2L+)', icon: '💧', color: 'bg-blue-500' },
                                        { id: 'exercise', label: 'Exercício', icon: '🏃', color: 'bg-emerald-500' },
                                        { id: 'meds', label: 'Medicação', icon: '💊', color: 'bg-purple-500' },
                                        { id: 'therapy', label: 'Terapia', icon: '🛋️', color: 'bg-amber-500' }
                                    ].map(habit => {
                                        const isChecked = context.habits[habit.id as keyof typeof context.habits];
                                        return (
                                            <button
                                                key={habit.id}
                                                onClick={() => setContext(prev => ({
                                                    ...prev,
                                                    habits: { ...prev.habits, [habit.id]: !isChecked }
                                                }))}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                                                    isChecked 
                                                        ? `${habit.color} text-white border-transparent shadow-md scale-105` 
                                                        : `${inputClass} opacity-70 hover:opacity-100`
                                                }`}
                                            >
                                                <span className="text-xl">{habit.icon}</span>
                                                <span className="font-bold text-sm">{habit.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              );
          case 1: // CONTEXTO
              return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                     <div>
                        <h3 className={`font-bold text-lg mb-2 ${textClass}`}>Onde e com quem?</h3>
                        <p className={`text-sm ${textSecondary} mb-6`}>Identificar padrões de ambiente ajuda a prever gatilhos. Use o lápis para remover tags que não usa.</p>

                        <div className="space-y-6">
                            {renderEditableSection(
                                'Localização', 
                                MapPin, 
                                locations, 
                                context.location, 
                                'locations', 
                                (val) => setContext(prev => ({ ...prev, location: val }))
                            )}

                            {renderEditableSection(
                                'Companhia', 
                                Users, 
                                companyOptions, 
                                context.company, 
                                'company', 
                                (val) => setContext(prev => ({ ...prev, company: prev.company.includes(val) ? prev.company.filter(c => c !== val) : [...prev.company, val] })),
                                true
                            )}

                            {renderEditableSection(
                                'Gatilho Principal', 
                                Zap, 
                                triggers, 
                                context.trigger, 
                                'triggers', 
                                (val) => setContext(prev => ({ ...prev, trigger: val }))
                            )}
                        </div>
                     </div>
                </div>
              );
          case 2: // CORPO & ESTRATÉGIAS
             return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className={`font-bold text-lg mb-2 ${textClass}`}>Corpo e Regulação</h3>
                        <p className={`text-sm ${textSecondary} mb-6`}>Como seu corpo reagiu e qual é o seu estado exato de ativação.</p>
                        
                        <div className="space-y-6">
                             <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                                    <Activity className="w-3 h-3 text-pink-500" /> Sensações no Corpo
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {somaticSensations.slice(0, 10).map(sensation => (
                                        <button key={sensation}
                                            onClick={() => setContext(prev => ({ ...prev, bodySensations: prev.bodySensations.includes(sensation) ? prev.bodySensations.filter(s => s !== sensation) : [...prev.bodySensations, sensation] }))}
                                            className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${context.bodySensations.includes(sensation) ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : `${inputClass} hover:border-pink-400 opacity-80 hover:opacity-100`}`}>
                                            {sensation}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                                    <Brain className="w-3 h-3" /> Estratégias Usadas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {copingOptions.map(cop => (
                                        <button key={cop}
                                            onClick={() => setContext(prev => ({ ...prev, copingStrategies: prev.copingStrategies.includes(cop) ? prev.copingStrategies.filter(c => c !== cop) : [...prev.copingStrategies, cop] }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${context.copingStrategies.includes(cop) ? 'bg-green-500 text-white border-green-500 shadow-md' : `${inputClass} hover:border-green-400 opacity-80 hover:opacity-100`}`}>
                                            {cop}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             {/* Calibragem Visual Circumplexa */}
                             <div className={`p-4 rounded-xl border flex flex-col items-center ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex justify-between w-full mb-3">
                                    <div className="flex items-center">
                                        <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                                            <Target className="w-3 h-3" /> Mapa Afetivo (Circumplexo)
                                        </label>
                                        <InfoTooltip text="Um mapa simples para encontrar o nome exato do que sente, cruzando sua Energia (Ativação) com o quanto é bom/ruim (Valência)." direction="bottom" />
                                    </div>
                                    <a 
                                      href="https://en.wikipedia.org/wiki/Circumplex_model" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`text-[8px] ${textSecondary} opacity-40 hover:opacity-100 font-mono tracking-tight hover:underline cursor-pointer`}
                                    >
                                        Fonte: James A. Russell
                                    </a>
                                </div>
                                
                                <CircumplexSelector 
                                    valence={context.customValence} 
                                    arousal={context.customArousal} 
                                    theme={theme}
                                    onChange={(v, a) => setContext(prev => ({ ...prev, customValence: v, customArousal: a }))}
                                />
                                <p className={`text-[10px] mt-2 text-center max-w-xs ${textSecondary} opacity-70`}>
                                    Clique ou arraste o ponto para representar exatamente como você se sente (Ex: Muito agitado mas triste = Canto superior esquerdo).
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
             );
          case 3: // COGNITIVO (TCC) & NOTAS
             return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className={`font-bold text-lg mb-2 ${textClass}`}>O que passou pela sua mente?</h3>
                        <p className={`text-sm ${textSecondary} mb-6`}>Registrar pensamentos é o primeiro passo para mudá-los.</p>

                        <div className="space-y-6">
                            <div className="relative">
                                <textarea
                                    value={context.notes}
                                    onChange={(e) => setContext(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Descreva brevemente o que aconteceu ou o que você pensou... Use o ditado ou o botão Mágico para auto-completar!"
                                    className={`w-full px-4 py-4 rounded-xl border text-sm ${inputClass} outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner`}
                                />
                                
                                {/* Voice Dictation Button */}
                                <button
                                    onClick={toggleListening}
                                    className={`absolute left-3 bottom-3 p-2 rounded-full transition-all flex items-center justify-center 
                                        ${isListening 
                                            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                            : `text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700`
                                        }`}
                                    title={isListening ? "Parar ditado" : "Ditar nota (Voz)"}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>

                                {/* Magic AI Button */}
                                <button 
                                    onClick={handleAiAnalysis}
                                    disabled={isAiLoading || !context.notes}
                                    className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold 
                                        ${isAiLoading 
                                            ? 'bg-slate-400 text-white cursor-wait' 
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 active:scale-95'
                                        }`}
                                    title="Auto-completar gatilhos e sensações com IA"
                                >
                                    {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                    {isAiLoading ? 'Analisando...' : 'Mágica'}
                                </button>
                            </div>

                            {/* Seção TCC: Armadilhas de Pensamento (Apenas para emoções negativas) */}
                            {isNegativeEmotion && (
                                <div className={`p-4 rounded-xl border-l-4 border-yellow-500 ${theme === 'dark' ? 'bg-yellow-900/10' : 'bg-yellow-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <HelpCircle className="w-4 h-4 text-yellow-500" />
                                        <h4 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                            Armadilhas de Pensamento (TCC)
                                        </h4>
                                        <InfoTooltip text="Erros comuns de lógica que o cérebro comete quando está emocionado, fazendo a situação parecer pior do que é." direction="bottom" />
                                    </div>
                                    <p className={`text-xs mb-3 ${textSecondary}`}>Você identifica alguma dessas distorções no seu pensamento agora?</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {cognitiveDistortions.map(dist => (
                                            <button 
                                                key={dist.id}
                                                onClick={() => setContext(prev => ({ ...prev, thinkingTraps: prev.thinkingTraps.includes(dist.id) ? prev.thinkingTraps.filter(t => t !== dist.id) : [...prev.thinkingTraps, dist.id] }))}
                                                className={`flex items-start gap-2 p-2 rounded-lg text-left border transition-all ${context.thinkingTraps.includes(dist.id) ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm' : `${inputClass} hover:border-yellow-400`}`}
                                            >
                                                <dist.icon className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                                                <div>
                                                    <span className="block text-xs font-bold">{dist.label}</span>
                                                    <span className="block text-[10px] opacity-70 leading-tight">{dist.desc}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Emoção Secundária (Mini) */}
                             <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-3 h-3 text-purple-500" />
                                    <label className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Sentimentos Mistos?</label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(emotionalScales).map(([key, scale]) => {
                                        if (key === emotionKey) return null;
                                        const isSelected = context.secondaryEmotion === key;
                                        return (
                                            <button key={key}
                                                onClick={() => setContext(prev => ({ ...prev, secondaryEmotion: isSelected ? null : key, secondaryLevel: isSelected ? 0 : 3 }))}
                                                className={`px-3 py-1 rounded-full text-[10px] border font-bold uppercase ${isSelected ? 'bg-purple-600 text-white border-purple-600' : `${inputClass} opacity-60`}`}>
                                                {scale.name}
                                            </button>
                                        );
                                    })}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
             );
          default: return null;
      }
  };

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4`} role="dialog">
      <div className={`${theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white'} rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] h-auto`}>
        
        {/* Header com Progresso */}
        <div className="relative pt-6 px-6 pb-2 shrink-0">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${emotionColor.light}, ${emotionColor.main})` }}>
                        <emotion.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black ${textClass} leading-none mb-1`}>{emotion.name}</h2>
                        <p className={`text-sm ${textSecondary} font-medium`}>{emotion.levels[level-1]?.label} • Nível {level}</p>
                    </div>
                </div>
                <button onClick={onCancel} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${textSecondary}`}>
                    <X className="w-6 h-6" />
                </button>
             </div>
             
             {/* Progress Bar */}
             <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{ 
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${emotionColor.light}, ${emotionColor.main})`
                    }}
                />
             </div>
             <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                <span className={step >= 0 ? emotionColors[emotionKey].chart : ''}>1. Fisiologia</span>
                <span className={step >= 1 ? emotionColors[emotionKey].chart : ''}>2. Contexto</span>
                <span className={step >= 2 ? emotionColors[emotionKey].chart : ''}>3. Corpo</span>
                <span className={step >= 3 ? emotionColors[emotionKey].chart : ''}>4. Mente</span>
             </div>
        </div>

        {/* Corpo do Wizard */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {renderStepContent()}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center px-6 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
            {step > 0 ? (
                <button 
                    onClick={() => setStep(step - 1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${textSecondary} hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors`}
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            ) : (
                <button 
                    onClick={onCancel}
                    className={`px-4 py-2 rounded-lg font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                >
                    Cancelar
                </button>
            )}

            {step < totalSteps - 1 ? (
                <button 
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm shadow-lg hover:brightness-110 hover:scale-105 transition-all"
                    style={{ background: emotionColor.main }}
                >
                    Próximo <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button 
                    onClick={() => onSave({ emotion: emotionKey, level, customTimestamp: new Date(date).toISOString(), ...context })}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm shadow-xl hover:brightness-110 hover:scale-105 transition-all animate-pulse"
                    style={{ background: `linear-gradient(135deg, ${emotionColor.light}, ${emotionColor.main})` }}
                >
                    <Check className="w-4 h-4" /> Salvar Registro
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

// Ícone auxiliar (Componente renomeado para PascalCase para conformidade com React)
const IconWrapper = ({ as: Icon, className }: { as: React.ElementType, className: string }) => <Icon className={className} />;