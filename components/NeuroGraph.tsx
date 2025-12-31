import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { EmotionKey, Theme } from '../types';
import { NEURO_DATA } from '../constants';
import { Clock, Brain } from 'lucide-react';

interface NeuroGraphProps {
  emotionKey: EmotionKey;
  intensityLevel: number;
  theme: Theme;
}

const NeuroGraph: React.FC<NeuroGraphProps> = ({ emotionKey, intensityLevel, theme }) => {
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const neuroInfo = NEURO_DATA[emotionKey];

  // 1. Calcula a duração dinâmica baseada no perfil de decaimento dos hormônios
  const totalMinutes = useMemo(() => {
    let maxDuration = 60; // Mínimo de 1 hora para contexto
    
    neuroInfo.hormones.forEach(h => {
      // Cálculo reverso: Quanto tempo leva para cair para ~1% do valor de pico?
      // Baseado na fórmula: valor = peak * exp(-rate * time/10)
      // Queremos quando exp(...) ≈ 0.01 -> ln(0.01) ≈ -4.6
      // Então: -rate * time / 10 = -4.6  =>  time = 46 / rate
      const decayDuration = (4.6 / h.decayProfile.decayRate) * 10;
      const totalHormoneTime = h.decayProfile.peakTime + decayDuration;
      
      if (totalHormoneTime > maxDuration) {
        maxDuration = totalHormoneTime;
      }
    });

    // Arredonda para a próxima meia hora para manter o gráfico limpo
    return Math.ceil(maxDuration / 30) * 30;
  }, [neuroInfo]);

  // 2. Gera os dados com base no tempo calculado
  const data = useMemo(() => {
    const points = [];
    // Ajusta a resolução: se for muito longo, diminui pontos para performance
    const timeStep = totalMinutes > 300 ? 10 : 5; 
    const intensityMultiplier = intensityLevel / 7;

    for (let t = 0; t <= totalMinutes; t += timeStep) {
      const point: any = { time: t };
      for (let i = 0; i < neuroInfo.hormones.length; i++) {
        const hormone = neuroInfo.hormones[i];
        let value = 0;

        if (t <= hormone.decayProfile.peakTime) {
            // Fase de subida
            value = (t / Math.max(1, hormone.decayProfile.peakTime)) * 100 * intensityMultiplier;
        } else {
            // Fase de descida (decaimento exponencial)
            const peakValue = 100 * intensityMultiplier;
            const timeSincePeak = t - hormone.decayProfile.peakTime;
            value = peakValue * Math.exp(-hormone.decayProfile.decayRate * (timeSincePeak / 10)); 
        }
        
        // Corta valores residuais muito baixos para limpar visualmente o final
        if (value < 0.5) value = 0;
        
        point[hormone.name] = Number(value.toFixed(1));
      }
      points.push(point);
    }
    return points;
  }, [neuroInfo, intensityLevel, totalMinutes]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hours = Math.floor(label / 60);
      const mins = label % 60;
      const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return (
        <div className={`p-3 rounded border shadow-lg backdrop-blur-md ${theme === 'dark' ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
          <p className={`text-[10px] font-bold mb-2 pb-1 border-b ${theme === 'dark' ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-200'}`}>
             T + {timeLabel}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
               const hInfo = neuroInfo.hormones.find(h => h.name === entry.name);
               return (
                <div key={index} className="flex items-center gap-2 text-[10px] font-bold" style={{ color: entry.color }}>
                   <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color}} />
                   <span className="whitespace-nowrap">
                     {entry.name}
                     {hInfo && <span className="font-normal opacity-80 ml-1">({hInfo.description})</span>}
                   </span>
                   <span className="ml-auto pl-2">{entry.value}%</span>
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

  // 3. Gera ticks dinâmicos para o eixo X
  const xAxisTicks = useMemo(() => {
    const ticks = [];
    // Define intervalo dos ticks baseado na duração total
    let interval = 30; // Padrão
    if (totalMinutes <= 60) interval = 15;
    else if (totalMinutes <= 120) interval = 30;
    else interval = 60;

    for (let i = 0; i <= totalMinutes; i += interval) {
      ticks.push(i);
    }
    return ticks;
  }, [totalMinutes]);

  return (
    <div className={`h-full flex flex-col p-3 rounded-xl border animate-fade-in ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Brain className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <div className="flex-1 leading-tight">
            <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Neuroquímica (Simulada)
            </h4>
            <span className="text-[10px] opacity-70 block truncate">{neuroInfo.description}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 whitespace-nowrap">
            <Clock className="w-3 h-3" />
            {neuroInfo.recoveryEstimate}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[140px]">
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
                domain={[0, 100]} 
                tick={{ fill: textClass, fontSize: 9 }} 
                axisLine={false} 
                tickLine={false}
                width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
            <Legend 
                verticalAlign="top" 
                height={20} 
                iconType="circle" 
                iconSize={6}
                wrapperStyle={{ fontSize: '10px', opacity: 0.8, top: -5 }}
                formatter={(value) => {
                  const h = neuroInfo.hormones.find(h => h.name === value);
                  return h ? `${value} (${h.description})` : value;
                }}
            />
            <ReferenceLine x={0} stroke={gridColor} />
            {neuroInfo.hormones.map((hormone) => (
              <Line 
                key={hormone.name}
                type="monotone"
                dataKey={hormone.name}
                stroke={hormone.color}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NeuroGraph;