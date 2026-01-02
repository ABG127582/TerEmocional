import React, { useState, useRef, useEffect } from 'react';
import { EmotionScale, ContextData } from '../types';
import { emotionColors, emotionalScales, somaticSensations, cognitiveDistortions } from '../constants';
import { Activity, X, Battery, BatteryLow, BatteryMedium, BatteryFull, Moon, Zap, Layers, ArrowRight, ArrowLeft, Check, Brain, MapPin, Users, HelpCircle, Plus, Crosshair, Target } from 'lucide-react';

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
    notes: '',
    secondaryEmotion: null,
    secondaryLevel: 0,
    customValence: emotion.levels[level - 1]?.valence || 5,
    customArousal: emotion.levels[level - 1]?.arousal || 5
  });

  // Arrays de opções (Agora podem ser expandidos)
  const [locations, setLocations] = useState(['Casa', 'Trabalho', 'Escola', 'Rua', 'Online']);
  const [companyOptions, setCompanyOptions] = useState(['Só', 'Família', 'Amigos', 'Parceiro', 'Colegas']);
  const [triggers, setTriggers] = useState(['Reunião', 'Email', 'Crítica', 'Elogio', 'Erro', 'Pensamento', 'Notícia']);
  
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const inputClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';
  const emotionColor = emotionColors[emotionKey];
  const currentSleepColor = getSleepColor(context.sleepHours);

  const copingOptions = ['Respirar', 'Sair', 'Música', 'Água', 'Exercício', 'Escrever', 'Falar'];
  const isNegativeEmotion = ['raiva', 'tristeza', 'medo', 'nojo'].includes(emotionKey);

  const renderStepContent = () => {
      switch(step) {
          case 0: // FISIOLOGIA & TEMPO
              return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className={`font-bold text-lg mb-4 ${textClass}`}>Como você está biologicamente?</h3>
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
                        </div>
                    </div>
                </div>
              );
          case 1: // CONTEXTO
              return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                     <div>
                        <h3 className={`font-bold text-lg mb-2 ${textClass}`}>Onde e com quem?</h3>
                        <p className={`text-sm ${textSecondary} mb-6`}>Identificar padrões de ambiente ajuda a prever gatilhos.</p>

                        <div className="space-y-6">
                            <div>
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                                    <MapPin className="w-3 h-3" /> Localização
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {locations.map(loc => (
                                        <button key={loc} onClick={() => setContext(prev => ({ ...prev, location: loc }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${context.location === loc ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : `${inputClass} opacity-70 hover:opacity-100`}`}>
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                                <TagInput 
                                    onAdd={(val) => {
                                        setLocations([...locations, val]);
                                        setContext(prev => ({ ...prev, location: val }));
                                    }}
                                    placeholder="Outro local..." 
                                    theme={theme} 
                                />
                            </div>

                            <div>
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                                    <Users className="w-3 h-3" /> Companhia
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {companyOptions.map(comp => (
                                        <button key={comp} onClick={() => setContext(prev => ({ ...prev, company: prev.company.includes(comp) ? prev.company.filter(c => c !== comp) : [...prev.company, comp] }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${context.company.includes(comp) ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' : `${inputClass} opacity-70 hover:opacity-100`}`}>
                                            {comp}
                                        </button>
                                    ))}
                                </div>
                                <TagInput 
                                    onAdd={(val) => {
                                        setCompanyOptions([...companyOptions, val]);
                                        setContext(prev => ({ ...prev, company: [...prev.company, val] }));
                                    }}
                                    placeholder="Mais alguém..." 
                                    theme={theme} 
                                />
                            </div>

                            <div>
                                <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                                    <Zap className="w-3 h-3" /> Gatilho Principal
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {triggers.map(trig => (
                                        <button key={trig} onClick={() => setContext(prev => ({ ...prev, trigger: trig }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${context.trigger === trig ? 'bg-pink-600 text-white border-pink-600 shadow-md scale-105' : `${inputClass} opacity-70 hover:opacity-100`}`}>
                                            {trig}
                                        </button>
                                    ))}
                                </div>
                                <TagInput 
                                    onAdd={(val) => {
                                        setTriggers([...triggers, val]);
                                        setContext(prev => ({ ...prev, trigger: val }));
                                    }}
                                    placeholder="Outro gatilho..." 
                                    theme={theme} 
                                />
                            </div>
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
                                    <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                                        <Target className="w-3 h-3" /> Mapa Afetivo (Circumplexo)
                                    </label>
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
                            <textarea
                                value={context.notes}
                                onChange={(e) => setContext(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Descreva brevemente o que aconteceu ou o que você pensou..."
                                className={`w-full px-4 py-4 rounded-xl border text-sm ${inputClass} outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner`}
                            />

                            {/* Seção TCC: Armadilhas de Pensamento (Apenas para emoções negativas) */}
                            {isNegativeEmotion && (
                                <div className={`p-4 rounded-xl border-l-4 border-yellow-500 ${theme === 'dark' ? 'bg-yellow-900/10' : 'bg-yellow-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <HelpCircle className="w-4 h-4 text-yellow-500" />
                                        <h4 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                            Armadilhas de Pensamento (TCC)
                                        </h4>
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