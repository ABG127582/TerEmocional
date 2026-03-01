import React, { useState, useMemo, useRef } from 'react';
import { Trash2, BookOpen, Activity, Download, EyeOff, List, BarChart2, Trash, Upload, Filter, X, Sparkles, Loader2, Brain, Calendar, Printer } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { Assessment } from '../types';
import { emotionalScales, emotionColors } from '../constants';

interface HistoryViewProps {
  assessments: Assessment[];
  theme: 'light' | 'dark';
  onClearHistory: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnonymize: () => void;
  onDeleteAssessment: (id: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  assessments, 
  theme, 
  onClearHistory, 
  onExportData, 
  onImportData,
  onAnonymize,
  onDeleteAssessment 
}) => {
  const [subView, setSubView] = useState<'list' | 'stats'>('list');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  // AI States
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  // --- FILTRAGEM ---
  const filteredAssessments = useMemo(() => {
    if (!selectedFilter) return assessments;
    return assessments.filter(a => a.emotion === selectedFilter);
  }, [assessments, selectedFilter]);

  const sortedAssessments = useMemo(() => {
    return [...filteredAssessments].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredAssessments]);

  // --- AI ANALYSIS ---
  const handleGenerateInsights = async () => {
    if (assessments.length < 3) {
      alert("Registre pelo menos 3 emoções para gerar uma análise válida.");
      return;
    }

    setIsAiLoading(true);
    setAiReport(null);

    try {
      const logsToAnalyze = sortedAssessments.slice(0, 20).map(a => ({
        data: new Date(a.timestamp).toLocaleDateString(),
        hora: new Date(a.timestamp).toLocaleTimeString(),
        emocao: emotionalScales[a.emotion]?.name || a.emotion,
        nivel: a.level,
        gatilho: a.trigger,
        sono: a.sleepHours,
        energia: a.energy,
        notas: a.notes
      }));

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Atue como um psicólogo especialista em Terapia Cognitivo-Comportamental e análise de dados.
        Analise os seguintes registros do diário emocional do usuário.
        
        DADOS:
        ${JSON.stringify(logsToAnalyze)}

        Gere um relatório conciso e empático (use Markdown) contendo:
        1. **Padrões Identificados**: Correlações entre sono, energia, horários e emoções.
        2. **Gatilhos Principais**: O que parece estar causando as emoções mais intensas.
        3. **Sugestões Práticas**: 3 estratégias de regulação emocional específicas para o perfil atual.

        Fale diretamente com o usuário ("Você parece..."). Seja acolhedor mas analítico.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiReport(response.text);
    } catch (error) {
      console.error("Erro na análise IA:", error);
      setAiReport("Desculpe, não foi possível gerar a análise no momento. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- DADOS PARA GRÁFICOS (Baseados nos FILTRADOS) ---
  const trendData = useMemo(() => {
    return [...filteredAssessments]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-20) // Últimos 20 registros filtrados
      .map(a => ({
        date: new Date(a.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
        valence: a.customValence,
        arousal: a.customArousal,
        energy: a.energy
      }));
  }, [filteredAssessments]);

  // --- DISTRIBUIÇÃO (Sempre baseada no TOTAL para permitir filtro) ---
  const emotionDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    assessments.forEach(a => {
        counts[a.emotion] = (counts[a.emotion] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
        name: emotionalScales[key]?.name || key,
        value,
        color: emotionColors[key]?.main || '#ccc',
        key // key original para filtro
    }));
  }, [assessments]);

  // --- CALENDAR HEATMAP DATA ---
  const calendarData = useMemo(() => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      
      const heatmap: Record<number, { count: number; dominantEmotion: string; intensity: number }> = {};
      
      assessments.forEach(a => {
          const d = new Date(a.timestamp);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
              const day = d.getDate();
              if (!heatmap[day]) {
                  heatmap[day] = { count: 0, dominantEmotion: a.emotion, intensity: 0 };
              }
              
              heatmap[day].count += 1;
              heatmap[day].intensity = Math.max(heatmap[day].intensity, a.level); // Keep max intensity of the day
              // Simple logic: last entry dominates for color, or keep existing if intensity is higher
              if (a.level >= heatmap[day].intensity) {
                  heatmap[day].dominantEmotion = a.emotion;
              }
          }
      });
      
      return { days: daysArray, map: heatmap, monthName: today.toLocaleString('default', { month: 'long' }) };
  }, [assessments]);

  return (
    <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 no-print">
            <div className="flex gap-2">
                <button 
                    onClick={() => setSubView('list')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${subView === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800 ' + textSecondary}`}
                >
                    <List className="w-4 h-4" /> Lista
                </button>
                <button 
                    onClick={() => setSubView('stats')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${subView === 'stats' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800 ' + textSecondary}`}
                >
                    <BarChart2 className="w-4 h-4" /> Estatísticas
                </button>
            </div>
            
            <div className="flex gap-2 items-center">
                <button 
                    onClick={handleGenerateInsights}
                    disabled={isAiLoading || assessments.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isAiLoading ? 'bg-slate-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}
                    title="Analisar padrões com Inteligência Artificial"
                >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isAiLoading ? 'Analisando...' : 'Insights IA'}
                </button>

                <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2" />

                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={onImportData}
                    className="hidden"
                    accept=".json"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} 
                    title="Importar Backup"
                >
                    <Upload className="w-5 h-5" />
                </button>

                <button onClick={onExportData} className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} title="Exportar JSON">
                    <Download className="w-5 h-5" />
                </button>
                <button onClick={onAnonymize} className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} title="Exportar Anônimo">
                    <EyeOff className="w-5 h-5" />
                </button>
                <button onClick={() => window.print()} className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} title="Imprimir Relatório Clínico">
                    <Printer className="w-5 h-5" />
                </button>
                <button onClick={onClearHistory} className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500`} title="Limpar Histórico">
                    <Trash className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* AI REPORT SECTION */}
        {aiReport && (
          <div className="relative p-6 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 animate-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                   <Brain className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-bold ${textClass}`}>Relatório de Inteligência Emocional</h3>
                <button onClick={() => setAiReport(null)} className="ml-auto p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"><X className="w-4 h-4 opacity-50" /></button>
             </div>
             <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert text-slate-300' : 'text-slate-700'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {aiReport.split('\n').map((line, i) => {
                      // Simple markdown parser for bolding
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i} className="mb-2">
                          {parts.map((part, j) => {
                             if (part.startsWith('**') && part.endsWith('**')) {
                               return <strong key={j} className={theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}>{part.slice(2, -2)}</strong>;
                             }
                             return part;
                          })}
                        </p>
                      )
                  })}
                </div>
             </div>
             <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800/50 text-xs text-center opacity-60">
                Análise gerada por IA (Gemini). Use como apoio, não como diagnóstico.
             </div>
          </div>
        )}

        {/* Barra de Filtro Ativo */}
        {selectedFilter && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-bold ${textClass}`}>Filtrando por: {emotionalScales[selectedFilter]?.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-mono">
                        {filteredAssessments.length} registros
                    </span>
                </div>
                <button 
                    onClick={() => setSelectedFilter(null)}
                    className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                    title="Limpar filtro"
                >
                    <X className="w-4 h-4 text-blue-500" />
                </button>
            </div>
        )}

        {assessments.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <p className="text-xl font-bold">Nenhum registro encontrado.</p>
                <p className="text-sm">Comece registrando como você se sente na aba "Registrar" ou importe um backup.</p>
            </div>
        ) : (
            <>
                {subView === 'list' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {sortedAssessments.length === 0 ? (
                        <p className="text-center text-slate-500 py-10">Nenhum registro encontrado com este filtro.</p>
                    ) : (
                        sortedAssessments.map((assessment) => {
                            const emotion = emotionalScales[assessment.emotion];
                            const color = emotionColors[assessment.emotion];
                            if (!emotion || !color) return null;
                            
                            const secEmotion = assessment.secondaryEmotion ? emotionalScales[assessment.secondaryEmotion]?.name : null;

                            return (
                            <div 
                                key={assessment.id || assessment.timestamp} 
                                className={`rounded-xl p-4 border-l-4 ${bgCard} ${borderClass} hover:translate-x-1 transition-transform group relative`}
                                style={{ borderLeftColor: color.main }}
                            >
                                <button
                                onClick={() => assessment.id && onDeleteAssessment(assessment.id)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Excluir este registro"
                                >
                                <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 pr-10">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs font-mono font-bold">
                                    {new Date(assessment.timestamp).toLocaleDateString()}
                                    <span className="mx-1 text-slate-400">|</span>
                                    {new Date(assessment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                    <emotion.icon className="w-5 h-5" style={{ color: color.main }} />
                                    <span className={`font-bold ${textClass}`}>{emotion.name}</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700">Nv. {assessment.level}</span>
                                    {secEmotion && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-300 dark:border-slate-600 opacity-70">
                                            + {secEmotion}
                                        </span>
                                    )}
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                                    Valência: {assessment.customValence}
                                    </span>
                                    <span className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                                    Energia: {assessment.energy}/10
                                    </span>
                                </div>
                                </div>

                                {assessment.notes && (
                                <div className={`mb-3 p-3 rounded-lg text-sm italic border-l-2 border-yellow-400 ${theme === 'dark' ? 'bg-yellow-900/20 text-slate-300' : 'bg-yellow-50 text-slate-700'}`}>
                                    <div className="flex items-center gap-2 mb-1 not-italic font-semibold text-xs opacity-70">
                                    <BookOpen className="w-3 h-3" />
                                    Nota de Diário
                                    </div>
                                    "{assessment.notes}"
                                </div>
                                )}

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${textSecondary}`}>
                                <div className="space-y-2">
                                    {assessment.trigger && (
                                    <p className="flex items-start gap-2">
                                        <span className="mt-0.5">⚡</span>
                                        <span><strong>Gatilho:</strong> {assessment.trigger}</span>
                                    </p>
                                    )}
                                    <p className="flex items-start gap-2">
                                    <span className="mt-0.5">📍</span>
                                    <span>{assessment.location} {assessment.company.length > 0 && `com ${assessment.company.join(', ')}`}</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {assessment.bodySensations && assessment.bodySensations.length > 0 && (
                                    <p className="flex items-start gap-2">
                                        <Activity className="w-4 h-4 text-pink-500 mt-0.5" />
                                        <span><strong>Corpo:</strong> {assessment.bodySensations.join(', ')}</span>
                                    </p>
                                    )}
                                    <p className="flex items-start gap-2">
                                        <span className="mt-0.5">😴</span>
                                        <span><strong>Sono:</strong> {assessment.sleepHours}h</span>
                                    </p>
                                    {assessment.copingStrategies && assessment.copingStrategies.length > 0 && (
                                    <p className="flex items-start gap-2">
                                        <span className="mt-0.5">🛡️</span>
                                        <span><strong>Estratégias:</strong> {assessment.copingStrategies.join(', ')}</span>
                                    </p>
                                    )}
                                </div>
                                </div>
                            </div>
                            );
                        })
                    )}
                    </div>
                )}
                
                {subView === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                        {/* CALENDAR HEATMAP (NEW) */}
                        <div className={`md:col-span-2 p-6 rounded-xl border ${bgCard} ${borderClass}`}>
                            <div className="flex items-center gap-2 mb-6">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                                <h3 className={`text-lg font-bold ${textClass}`}>Mapa de Calor: {calendarData.monthName}</h3>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {/* Weekday Labels */}
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                                    <div key={d} className="text-center text-xs font-bold opacity-50 uppercase">{d}</div>
                                ))}
                                
                                {/* Days */}
                                {calendarData.days.map(day => {
                                    const data = calendarData.map[day];
                                    const bgStyle = data 
                                        ? { 
                                            backgroundColor: emotionColors[data.dominantEmotion].main,
                                            opacity: 0.3 + (data.intensity / 10) // Intensidade baseada no nível (0.3 a 1.0)
                                          }
                                        : { backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9' };
                                    
                                    return (
                                        <div 
                                            key={day} 
                                            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group transition-transform hover:scale-110 cursor-default border border-transparent hover:border-slate-400 ${!data ? 'opacity-50' : ''}`}
                                            style={bgStyle}
                                        >
                                            <span className={`text-xs font-bold ${data ? 'text-white drop-shadow-md' : textSecondary}`}>{day}</span>
                                            {data && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg backdrop-blur-[1px]">
                                                    <div className="text-[10px] text-white font-bold text-center leading-tight">
                                                        {emotionalScales[data.dominantEmotion]?.name}<br/>
                                                        Nv.{data.intensity}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-between text-xs opacity-50 px-2">
                                <span>Menos Intenso</span>
                                <span>Mais Intenso</span>
                            </div>
                        </div>

                        {/* Gráfico 1: Distribuição de Emoções */}
                        <div className={`p-6 rounded-xl border ${bgCard} ${borderClass} flex flex-col items-center min-h-[300px]`}>
                            <h3 className={`text-lg font-bold mb-4 ${textClass}`}>Distribuição Emocional</h3>
                            <div className="text-xs text-center mb-2 opacity-60">Clique na fatia para filtrar</div>
                            <div className="w-full h-[250px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={emotionDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            onClick={(data) => {
                                                if (data && data.key) {
                                                    setSelectedFilter(prev => prev === data.key ? null : data.key);
                                                }
                                            }}
                                            cursor="pointer"
                                        >
                                            {emotionDistribution.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    stroke={selectedFilter === entry.key ? theme === 'dark' ? '#fff' : '#000' : 'none'}
                                                    strokeWidth={2}
                                                    opacity={selectedFilter && selectedFilter !== entry.key ? 0.3 : 1}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }}
                                            itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráfico 2: Linha do Tempo de Humor (Valência) */}
                        <div className={`p-6 rounded-xl border ${bgCard} ${borderClass} min-h-[300px]`}>
                            <h3 className={`text-lg font-bold mb-4 ${textClass}`}>
                                Oscilação de Humor {selectedFilter ? `(${emotionalScales[selectedFilter].name})` : '(Geral)'}
                            </h3>
                            <div className="text-xs text-center mb-2 opacity-60">Últimos 20 registros filtrados</div>
                            <div className="w-full h-[250px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} 
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis 
                                            domain={[0, 10]} 
                                            hide 
                                        />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="valence" 
                                            name="Bem-estar (Valência)" 
                                            stroke="#34d399" 
                                            strokeWidth={3} 
                                            dot={{ r: 4 }} 
                                            activeDot={{ r: 6 }} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="energy" 
                                            name="Energia Física" 
                                            stroke="#fbbf24" 
                                            strokeWidth={2} 
                                            strokeDasharray="5 5" 
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Estatísticas Rápidas */}
                        <div className={`md:col-span-2 p-6 rounded-xl border ${bgCard} ${borderClass}`}>
                            <h3 className={`text-lg font-bold mb-4 ${textClass}`}>Métricas Gerais {selectedFilter ? '(Filtrado)' : ''}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Total Registros</p>
                                    <p className={`text-2xl font-black ${textClass}`}>{filteredAssessments.length}</p>
                                </div>
                                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Média Sono</p>
                                    <p className={`text-2xl font-black text-blue-500`}>
                                        {(filteredAssessments.reduce((acc, curr) => acc + curr.sleepHours, 0) / filteredAssessments.length || 0).toFixed(1)}h
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Emoção Dominante</p>
                                    <p className={`text-lg font-black ${textClass} truncate`}>
                                        {emotionDistribution.sort((a,b) => b.value - a.value)[0]?.name || '-'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Média Energia</p>
                                    <p className={`text-2xl font-black text-yellow-500`}>
                                        {(filteredAssessments.reduce((acc, curr) => acc + curr.energy, 0) / filteredAssessments.length || 0).toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
  );
};