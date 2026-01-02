import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { EmotionKey, Theme } from '../types';
import { NEURO_DATA } from '../constants';
import { Clock, Brain, RefreshCw, HelpCircle, X, ExternalLink } from 'lucide-react';

interface NeuroGraphProps {
  emotionKey: EmotionKey;
  intensityLevel: number;
  theme: Theme;
}

const NeuroGraph: React.FC<NeuroGraphProps> = ({ emotionKey, intensityLevel, theme }) => {
  const [isRuminating, setIsRuminating] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const neuroInfo = NEURO_DATA[emotionKey];

  // 1. Calcula a duração dinâmica baseada no perfil de decaimento
  const totalMinutes = useMemo(() => {
    let maxDuration = 60; // Mínimo de 1 hora
    
    const ruminationMultiplier = isRuminating ? 3 : 1;

    neuroInfo.hormones.forEach(h => {
      const decayDuration = (4.6 / h.decayProfile.decayRate) * 10;
      const totalHormoneTime = h.decayProfile.peakTime + decayDuration;
      
      if (totalHormoneTime > maxDuration) {
        maxDuration = totalHormoneTime;
      }
    });

    if (isRuminating && maxDuration < 180) maxDuration = 180;

    return Math.ceil((maxDuration * ruminationMultiplier) / 30) * 30;
  }, [neuroInfo, isRuminating]);

  // 2. Gera os dados
  const data = useMemo(() => {
    const points = [];
    const timeStep = totalMinutes > 300 ? 10 : 5; 
    const intensityMultiplier = intensityLevel / 7;

    for (let t = 0; t <= totalMinutes; t += timeStep) {
      const point: any = { time: t };
      for (let i = 0; i < neuroInfo.hormones.length; i++) {
        const hormone = neuroInfo.hormones[i];
        let value = 0;
        const peakValue = 100 * intensityMultiplier;

        if (t <= hormone.decayProfile.peakTime) {
            value = (t / Math.max(1, hormone.decayProfile.peakTime)) * peakValue;
        } else {
            const timeSincePeak = t - hormone.decayProfile.peakTime;
            let decay = Math.exp(-hormone.decayProfile.decayRate * (timeSincePeak / 10));

            if (isRuminating) {
                const thoughtWave = (Math.sin(timeSincePeak / 20) + 1) * 0.15; 
                const slowDecay = Math.exp(-(hormone.decayProfile.decayRate / 4) * (timeSincePeak / 10));
                value = peakValue * (slowDecay * 0.7 + thoughtWave);
                if (value > peakValue) value = peakValue;
            } else {
                value = peakValue * decay;
            }
        }
        
        if (value < 0.5) value = 0;
        point[hormone.name] = Number(value.toFixed(1));
      }
      points.push(point);
    }
    return points;
  }, [neuroInfo, intensityLevel, totalMinutes, isRuminating]);

  // --- RENDERIZADOR PERSONALIZADO DA LEGENDA ---
  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 mb-2 px-2">
            {payload.map((entry: any, index: number) => {
                const hInfo = neuroInfo.hormones.find(h => h.name === entry.value);
                return (
                    <div key={`legend-${index}`} className="flex items-center gap-1.5">
                        <span 
                            className="w-2 h-2 rounded-full shadow-sm flex-shrink-0" 
                            style={{ backgroundColor: entry.color }} 
                        />
                        <span className={`text-[10px] font-bold leading-none ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                            {entry.value}
                        </span>
                        {hInfo && (
                            <span className={`text-[9px] font-medium leading-none ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                — {hInfo.description}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hours = Math.floor(label / 60);
      const mins = label % 60;
      const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return (
        <div className={`p-3 rounded-lg border shadow-xl backdrop-blur-md z-50 min-w-[180px] ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-700'}`}>
          <p className={`text-[10px] font-bold mb-2 pb-1 border-b flex justify-between ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
             <span>Tempo: {timeLabel}</span>
             {isRuminating && label > 20 && <span className="text-yellow-500 ml-2">⚠️ Sustentado</span>}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
               const hInfo = neuroInfo.hormones.find(h => h.name === entry.name);
               return (
                <div key={index} className="flex items-start gap-2 text-xs" style={{ color: entry.color }}>
                   <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: entry.color}} />
                   <div className="flex flex-col flex-1 leading-tight">
                       <div className="flex justify-between items-center w-full">
                           <span className="font-bold">{entry.name}</span>
                           <span className="font-mono text-[10px] opacity-80">{entry.value}%</span>
                       </div>
                       <span className={`text-[9px] uppercase tracking-wide font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                           {hInfo?.description}
                       </span>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tickItem: number) => {
    if (tickItem === 0) return '0';
    if (tickItem % 60 === 0) return `${tickItem / 60}h`;
    return `${tickItem}m`;
  };

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    let interval = 30;
    if (totalMinutes > 180) interval = 60;
    for (let i = 0; i <= totalMinutes; i += interval) {
      ticks.push(i);
    }
    return ticks;
  }, [totalMinutes]);

  return (
    <div className={`h-full flex flex-col p-4 rounded-xl border animate-fade-in relative group/graph ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'}`}>
      
      {/* Header e Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Título e Info Básica */}
        <div className="flex items-start gap-2 max-w-[60%]">
            <Brain className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
                <h4 className={`text-sm font-bold leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Neuroquímica (Simulada)
                </h4>
                <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] opacity-70">
                        {isRuminating 
                            ? "Indefinido (Ciclo de Reativação)" 
                            : neuroInfo.recoveryEstimate}
                    </span>
                </div>
            </div>
        </div>

        {/* Toggle Ruminação */}
        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsRuminating(!isRuminating)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${
                    isRuminating 
                    ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
            >
                <RefreshCw className={`w-3 h-3 ${isRuminating ? 'animate-spin-slow' : ''}`} />
                {isRuminating ? 'Ruminação Ativa' : 'Simular Ruminação'}
            </button>
            
            {/* Tooltip Interativo da Palavra Ruminação */}
            <div className="relative group/tooltip">
                <button 
                  onClick={() => setIsInfoOpen(!isInfoOpen)}
                  className={`p-1 rounded-full transition-all duration-300 ${isInfoOpen ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  title={isInfoOpen ? "Fechar explicação" : "Clique para fixar explicação"}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                
                {/* O Card Explicativo */}
                <div className={`absolute right-0 top-9 w-72 sm:w-80 p-4 rounded-xl shadow-2xl z-[60] transition-all duration-300 origin-top-right backdrop-blur-xl border border-white/20
                     ${isInfoOpen 
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible' 
                        : 'opacity-0 -translate-y-2 scale-95 pointer-events-none invisible group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto group-hover/tooltip:translate-y-0 group-hover/tooltip:scale-100 group-hover/tooltip:visible'}`}
                     style={{ 
                         background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                         border: isRuminating || isInfoOpen ? '1px solid #EAB308' : undefined
                     }}
                >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-yellow-500" />
                          <h5 className={`font-bold text-sm ${textClass}`}>O Mecanismo da Ruminação</h5>
                        </div>
                        {isInfoOpen && (
                          <button onClick={() => setIsInfoOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                        <p className={`text-sm font-bold text-center italic py-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                           "Ruminação é reviver o evento pela memória."
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                           Ao repensar obsessivamente, o gráfico mostra como cada pensamento funciona como um <strong>novo gatilho</strong>.
                        </p>
                        
                        <div className={`p-2 rounded bg-opacity-10 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-100'}`}>
                           <p className="text-[10px] font-bold uppercase mb-1 text-blue-500">Ciclo Vicioso:</p>
                           <ol className={`list-decimal list-inside text-[10px] space-y-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                               <li>Memória ativada pelo hipocampo.</li>
                               <li>Amígdala interpreta memória como perigo atual.</li>
                               <li>Nova injeção de Cortisol/Adrenalina ocorre.</li>
                               <li>Corpo nunca relaxa ("Platô de Stress").</li>
                           </ol>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-right">
                            <a 
                                href="https://drjoedispenza.com/pages/about-dr-joe" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-[9px] hover:underline opacity-60 hover:opacity-100 transition-opacity"
                                title="Saiba mais sobre a teoria"
                            >
                                Fonte: Dr. Joe Dispenza / Hebbian Theory <ExternalLink className="w-2 h-2" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px] relative">
        {isRuminating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
                <RefreshCw className="w-64 h-64 animate-spin-slow text-yellow-500" />
            </div>
        )}

        {/* Uso de container com tamanho definido para evitar width/height -1 no Recharts */}
        <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.3} />
                <XAxis 
                    dataKey="time" 
                    tick={{ fill: textClass, fontSize: 9 }} 
                    axisLine={{ stroke: gridColor }} 
                    tickLine={false}
                    tickFormatter={formatXAxis}
                    ticks={xAxisTicks}
                    height={20}
                    type="number"
                    domain={[0, 'dataMax']}
                />
                <YAxis 
                    domain={[0, 110]} 
                    tick={{ fill: textClass, fontSize: 9 }} 
                    axisLine={false} 
                    tickLine={false}
                    width={30}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
                <Legend 
                    content={renderLegend}
                    verticalAlign="top" 
                    height={36} 
                />
                <ReferenceLine x={0} stroke={gridColor} />
                
                {isRuminating && (
                    <ReferenceLine y={30} stroke="orange" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: "Platô de Stress", position: 'insideTopRight', fontSize: 9, fill: 'orange' }} />
                )}

                {neuroInfo.hormones.map((hormone) => (
                <Line 
                    key={hormone.name}
                    type="monotone"
                    dataKey={hormone.name}
                    stroke={hormone.color}
                    strokeWidth={isRuminating ? 2 : 1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                />
                ))}
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Ícone auxiliar
const FingerprintIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" /><path d="M5 15.1a8 8 0 0 1 1.6-9" /><path d="M9 4.1a6 6 0 0 1 6 1.9" /><path d="M12 6a4 4 0 0 0-3.9 3.9" /><path d="M16 11.9a2 2 0 0 0 .1-2.9" /><path d="M12 10v9" /><path d="M8 19h1" /><path d="M15 19h1" /><path d="M12 22a9 9 0 0 1-9-9" /><path d="M21 12a9 9 0 0 1-6.1 8.6" /></svg>
);

export default NeuroGraph;