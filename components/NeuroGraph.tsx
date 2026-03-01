import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
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
  
  const textClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  
  // Garantir fallback se a chave não existir
  const neuroInfo = NEURO_DATA[emotionKey] || NEURO_DATA.alegria;

  // 1. Calcula a duração dinâmica
  const totalMinutes = useMemo(() => {
    let maxDuration = 60;
    const ruminationMultiplier = isRuminating ? 3 : 1;

    neuroInfo.hormones.forEach(h => {
      const decayDuration = (4.6 / h.decayProfile.decayRate) * 10;
      const totalHormoneTime = h.decayProfile.peakTime + decayDuration;
      if (totalHormoneTime > maxDuration) maxDuration = totalHormoneTime;
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

  // Renderizador de Legenda Customizado
  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 mb-2 px-2">
            {payload.map((entry: any, index: number) => (
                <div key={`legend-${index}`} className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                    <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hours = Math.floor(label / 60);
      const mins = label % 60;
      const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return (
        <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl z-50 min-w-[200px] ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-700'}`}>
          <p className={`text-xs font-bold mb-3 pb-2 border-b flex justify-between uppercase tracking-wider ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
             <span>Tempo: {timeLabel}</span>
             {isRuminating && label > 20 && <span className="text-amber-500 animate-pulse">⚠️ Ciclo Ativo</span>}
          </p>
          <div className="space-y-3">
            {payload.map((entry: any, index: number) => {
               const hInfo = neuroInfo.hormones.find(h => h.name === entry.name);
               return (
                <div key={index} className="flex flex-col gap-1">
                   <div className="flex items-center justify-between text-xs font-bold" style={{ color: entry.color }}>
                       <span>{entry.name}</span>
                       <span>{entry.value}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${entry.value}%`, backgroundColor: entry.color }} />
                   </div>
                   <span className={`text-[9px] mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                       {hInfo?.description}
                   </span>
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

  return (
    <div className={`h-full flex flex-col p-5 rounded-xl border relative overflow-hidden bg-noise ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'}`}>
      
      {/* Definição de Gradientes SVG */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {neuroInfo.hormones.map((h, i) => (
            <linearGradient key={`grad-${h.name}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={h.color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={h.color} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 z-10">
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                <Brain className="w-5 h-5" />
            </div>
            <div>
                <h4 className={`text-sm font-bold leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Onda Neuroquímica
                </h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-medium uppercase tracking-wide opacity-60">
                        {isRuminating ? "Duração Indefinida" : `Ciclo aprox: ${neuroInfo.recoveryEstimate}`}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsRuminating(!isRuminating)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border ${
                    isRuminating 
                    ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20' 
                    : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-500 hover:border-slate-400'
                }`}
            >
                <RefreshCw className={`w-3 h-3 ${isRuminating ? 'animate-spin-slow' : ''}`} />
                {isRuminating ? 'Ruminação Ativa' : 'Simular Ruminação'}
            </button>
            
            <div className="relative group">
                <button 
                  onClick={() => setIsInfoOpen(!isInfoOpen)}
                  className={`p-1.5 rounded-full transition-all ${isInfoOpen ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                {/* Tooltip Card */}
                {isInfoOpen && (
                    <div className={`absolute right-0 top-10 w-72 p-4 rounded-xl shadow-2xl z-[60] backdrop-blur-xl border border-white/10 ${theme === 'dark' ? 'bg-slate-900/95 text-slate-200' : 'bg-white/95 text-slate-800'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-xs uppercase tracking-widest text-amber-500">Mecanismo de Loop</h5>
                            <button onClick={() => setIsInfoOpen(false)}><X className="w-3 h-3 opacity-50" /></button>
                        </div>
                        <p className="text-xs leading-relaxed mb-3">
                            A ruminação (pensar repetidamente no evento) reativa a Amígdala, causando novas descargas hormonais e impedindo o retorno à homeostase (linha de base).
                        </p>
                        <a href="https://www.apa.org/monitor/2005/11/ruminate" target="_blank" className="text-[9px] opacity-60 hover:opacity-100 flex items-center gap-1 hover:underline">
                            Fonte: APA Monitor <ExternalLink className="w-2 h-2" />
                        </a>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px] relative min-w-0 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.2} />
                <XAxis 
                    dataKey="time" 
                    tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'Inter' }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={formatXAxis}
                    dy={10}
                />
                <YAxis hide domain={[0, 110]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: textClass, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend content={renderLegend} verticalAlign="top" height={36} />
                <ReferenceLine x={0} stroke={gridColor} />
                {isRuminating && (
                    <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Platô de Stress Crônico", position: 'insideTopRight', fontSize: 10, fill: '#f59e0b', fontWeight: 'bold' }} />
                )}
                {neuroInfo.hormones.map((hormone, index) => (
                    <Area 
                        key={hormone.name}
                        type="monotone"
                        dataKey={hormone.name}
                        stroke={hormone.color}
                        fill={`url(#gradient-${index})`}
                        strokeWidth={2}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        isAnimationActive={true}
                        animationDuration={1500}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NeuroGraph;