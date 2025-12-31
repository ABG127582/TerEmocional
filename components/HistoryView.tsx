import React, { useMemo, useState, useRef } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ScatterChart, Scatter, ZAxis, ReferenceLine, ComposedChart, Legend } from 'recharts';
import { Heart, BarChart3, Download, Eye, EyeOff, X, Compass, FileText, List, Calendar as CalendarIcon, Printer, Activity, Moon, BookOpen, Check, Trash2, Sparkles, Brain, ArrowRight, ChevronLeft, ChevronRight, Filter, MapPin, Users, Zap, Upload, CalendarRange } from 'lucide-react';
import { Assessment, AIAnalysisResult } from '../types';
import { emotionalScales, emotionColors } from '../constants';
import { aiService } from '../services/aiService';
import { NeuroGlossary } from './NeuroGlossary';
import { storageService } from '../services/storageService';

interface HistoryViewProps {
  assessments: Assessment[];
  theme: 'light' | 'dark';
  onClearHistory: () => void;
  onExportData: () => void;
  onAnonymize: () => void;
  onDeleteAssessment: (id: number) => void;
}

// --- Subcomponente Calendar Heatmap ---
const CalendarHeatmap = ({ assessments, theme }: { assessments: Assessment[], theme: 'light' | 'dark' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const firstDayOfWeek = daysInMonth[0].getDay(); 
  const blankDays = Array(firstDayOfWeek).fill(null);

  const monthData = useMemo(() => {
    const map = new Map<string, Assessment[]>();
    assessments.forEach(a => {
       const dateStr = new Date(a.timestamp).toDateString();
       if (!map.has(dateStr)) map.set(dateStr, []);
       map.get(dateStr)?.push(a);
    });
    return map;
  }, [assessments]);

  const getDayColor = (date: Date) => {
    const dailyAssessments = monthData.get(date.toDateString());
    if (!dailyAssessments || dailyAssessments.length === 0) {
      return theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100';
    }

    // Calcula a emoção dominante do dia (ou a média)
    // Estratégia: Pegar a emoção do registro mais intenso ou o último
    const dominant = dailyAssessments.reduce((prev, current) => (prev.level > current.level) ? prev : current);
    const color = emotionColors[dominant.emotion];
    
    return {
       backgroundColor: color.main,
       style: { 
          boxShadow: `0 0 10px ${color.glow}`,
          opacity: 0.8 + (dominant.level / 20) // leve ajuste de opacidade baseado na intensidade
       }
    };
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`p-6 rounded-2xl border-2 ${theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/50 border-slate-200/50'} backdrop-blur-md`}>
       <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold flex items-center gap-2 ${textClass}`}>
             <CalendarIcon className="w-5 h-5 text-indigo-500" />
             Mapa de Calor Emocional
          </h3>
          <div className="flex items-center gap-4">
             <button onClick={prevMonth} className={`p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${textClass}`}><ChevronLeft className="w-5 h-5"/></button>
             <span className={`font-mono font-bold uppercase ${textClass}`}>
               {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
             </span>
             <button onClick={nextMonth} className={`p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${textClass}`}><ChevronRight className="w-5 h-5"/></button>
          </div>
       </div>

       <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
             <div key={d} className={`text-center text-[10px] uppercase font-bold tracking-wider opacity-50 ${textClass}`}>{d}</div>
          ))}
          
          {blankDays.map((_, i) => <div key={`blank-${i}`} />)}

          {daysInMonth.map(date => {
             const dayData = monthData.get(date.toDateString());
             const styleData = getDayColor(date);
             const isToday = date.toDateString() === new Date().toDateString();
             
             return (
               <div 
                  key={date.toISOString()}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative group
                     ${typeof styleData === 'string' ? styleData : ''}
                     ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                  `}
                  style={typeof styleData === 'object' ? styleData.style : {}}
               >
                  <span className={typeof styleData === 'object' ? 'text-white drop-shadow-md' : 'opacity-40'}>
                    {date.getDate()}
                  </span>
                  
                  {/* Styling de fundo se for objeto de cor */}
                  {typeof styleData === 'object' && (
                     <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: styleData.backgroundColor }} />
                  )}

                  {/* Tooltip Simples */}
                  {dayData && (
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 w-max max-w-[150px] p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl pointer-events-none">
                        <p className="font-bold border-b border-white/20 mb-1 pb-1">{date.toLocaleDateString()}</p>
                        {dayData.length} registros.
                        <br/>
                        Dominante: {emotionalScales[dayData[0].emotion]?.name}
                     </div>
                  )}
               </div>
             );
          })}
       </div>
    </div>
  );
};


// --- Componente Principal ---

export const HistoryView: React.FC<HistoryViewProps> = ({ assessments, theme, onClearHistory, onExportData, onAnonymize, onDeleteAssessment }) => {
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const borderClass = theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50';
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';

  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
  const [subView, setSubView] = useState<'charts' | 'list' | 'calendar'>('charts');
  const [showReport, setShowReport] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  
  // Date Filters
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 dias atrás
    end: new Date().toISOString().split('T')[0]
  });

  // Import Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- FILTRAGEM GLOBAL ---
  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => {
      const aDate = new Date(a.timestamp).toISOString().split('T')[0];
      const isWithinDate = aDate >= dateRange.start && aDate <= dateRange.end;
      const isEmotionMatch = filterEmotion === 'all' || a.emotion === filterEmotion;
      return isWithinDate && isEmotionMatch;
    });
  }, [assessments, filterEmotion, dateRange]);

  // Processamento de dados (Baseado nos Filtrados)
  const emotionCounts = useMemo(() => {
    const map = new Map<string, { emotion: string; name: string; count: number }>();
    for (const a of filteredAssessments) {
      const emotion = emotionalScales[a.emotion];
      if (!emotion) continue;
      const key = a.emotion;
      const current = map.get(key) || { emotion: key, name: emotion.name, count: 0 };
      map.set(key, { ...current, count: current.count + 1 });
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredAssessments]);

  // --- ANÁLISE DE CONTEXTO ---
  const contextStats = useMemo(() => {
    if (filteredAssessments.length === 0) return null;

    const locations: Record<string, number> = {};
    const companies: Record<string, number> = {};
    const triggers: Record<string, number> = {};

    filteredAssessments.forEach(a => {
        if(a.location) locations[a.location] = (locations[a.location] || 0) + 1;
        if(a.trigger) triggers[a.trigger] = (triggers[a.trigger] || 0) + 1;
        a.company.forEach(c => {
            companies[c] = (companies[c] || 0) + 1;
        });
    });

    const getTop3 = (rec: Record<string, number>) => Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return {
        locations: getTop3(locations),
        companies: getTop3(companies),
        triggers: getTop3(triggers)
    };
  }, [filteredAssessments]);

  const sortedAssessments = useMemo(() => {
    return [...filteredAssessments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredAssessments]);

  const weeklyConsistency = useMemo(() => {
    const days = [];
    const today = new Date();
    // Use last 7 days regardless of filter for consistency check, or respect filter?
    // Let's make consistency reflect the filter window if possible, but standard 7 days is usually expected for "Consistency"
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

        const count = filteredAssessments.filter(a => {
            const aDate = new Date(a.timestamp);
            const aStr = `${aDate.getFullYear()}-${pad(aDate.getMonth()+1)}-${pad(aDate.getDate())}`;
            return aStr === dStr;
        }).length;

        days.push({ 
            label: d.toLocaleDateString('pt-BR', { weekday: 'narrow' }), 
            date: d.toLocaleDateString('pt-BR'),
            count,
            hasData: count > 0 
        });
    }
    return days;
  }, [filteredAssessments]);

  const getTrendData = useMemo(() => {
    const sorted = [...filteredAssessments].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted.map((a) => {
      const date = new Date(a.timestamp);
      return {
        fullDate: date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        dateLabel: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        nivel: a.level,
        sleep: a.sleepHours,
        emocao: emotionalScales[a.emotion]?.name || 'Desconhecida'
      };
    });
  }, [filteredAssessments]);

  const getCircumplexData = useMemo(() => {
    return filteredAssessments.map(a => ({
      x: a.customValence,
      y: a.customArousal,
      z: 1,
      name: emotionalScales[a.emotion]?.name,
      fill: emotionColors[a.emotion]?.main || '#8884d8'
    }));
  }, [filteredAssessments]);

  const chartBg = theme === 'dark' ? '#1e293b' : '#f8fafc';
  const chartText = theme === 'dark' ? '#e2e8f0' : '#1e293b';

  const handleRunAnalysis = async () => {
    if (filteredAssessments.length < 3) {
      setAnalysisError("Registre pelo menos 3 emoções no período selecionado para gerar uma análise.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await aiService.generateClinicalInsight(filteredAssessments); 
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisError("Erro ao conectar com a IA. Verifique sua conexão ou tente mais tarde.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            // Verify if it has assessments prop (export format) or is array (raw)
            const dataToImport = Array.isArray(json) ? json : (json.assessments || []);
            
            const result = storageService.importAssessments(dataToImport);
            if (result.success) {
                alert(`${result.count} registros importados com sucesso! A página será recarregada.`);
                window.location.reload();
            } else {
                alert('Formato de arquivo inválido ou nenhum dado novo encontrado.');
            }
        } catch (err) {
            alert('Erro ao ler o arquivo. Certifique-se que é um JSON válido.');
        }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  if (showReport) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        <div className="max-w-[210mm] mx-auto bg-white min-h-screen p-8 md:p-12 print:p-0">
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <Heart className="w-8 h-8 text-red-600" />
                 <h1 className="text-3xl font-bold text-slate-900 print-force-black">Termômetro Emocional</h1>
              </div>
              <h2 className="text-xl font-semibold text-slate-700">Relatório Clínico</h2>
              <div className="grid grid-cols-2 gap-8 mt-4 text-sm text-slate-600">
                  <div>
                    <p><strong>Gerado em:</strong> {new Date().toLocaleString('pt-BR')}</p>
                    <p><strong>Período:</strong> {new Date(dateRange.start).toLocaleDateString()} a {new Date(dateRange.end).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p><strong>Paciente ID:</strong> _________________________</p>
                     <p><strong>Total de Registros:</strong> {filteredAssessments.length}</p>
                  </div>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md">
                <Printer className="w-4 h-4" /> Imprimir / PDF
              </button>
              <button onClick={() => setShowReport(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg flex items-center gap-2 hover:bg-slate-300">
                <X className="w-4 h-4" /> Fechar
              </button>
            </div>
          </div>
          
          {analysisResult && (
             <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 print-force-black page-break-inside-avoid">
                <div className="flex items-center gap-2 mb-3 text-slate-800 border-b border-slate-300 pb-2">
                   <Sparkles className="w-5 h-5" />
                   <h3 className="font-bold text-lg">Análise Clínica (IA)</h3>
                </div>
                <p className="text-slate-800 mb-4 text-justify leading-relaxed text-sm">{analysisResult.summary}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm uppercase mb-2">Padrões</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">{analysisResult.patterns.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm uppercase mb-2">Sugestões</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">{analysisResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                </div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-8 mb-8 page-break-inside-avoid">
            <div className="p-4 rounded-lg border border-slate-300">
              <h3 className="font-bold text-lg mb-2 border-b border-slate-300 pb-2 print-force-black">Estatísticas</h3>
              <p className="text-sm mt-2">Emoção Predominante: <strong>{emotionCounts[0]?.name || '-'}</strong> ({emotionCounts[0]?.count || 0})</p>
              <div className="mt-4">
                 <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Gatilhos Frequentes</h4>
                 <div className="flex flex-wrap gap-1">
                    {contextStats?.triggers.map(([t, c]) => (
                        <span key={t} className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{t} ({c})</span>
                    ))}
                 </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-slate-300">
               <h3 className="font-bold text-lg mb-2 border-b border-slate-300 pb-2 print-force-black">Frequência</h3>
               <ul className="space-y-1">
                   {emotionCounts.map(e => (
                       <li key={e.emotion} className="flex justify-between text-sm items-center">
                           <span>{e.name}</span>
                           <div className="flex items-center gap-2">
                               <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-slate-400" style={{ width: `${(e.count / filteredAssessments.length) * 100}%`}} />
                               </div>
                               <span className="font-mono font-bold w-6 text-right">{e.count}</span>
                           </div>
                       </li>
                   ))}
               </ul>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 bg-slate-100 p-2 print-force-black border-l-4 border-slate-400">Diário & Log Clínico</h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="p-2 w-24 border-r border-slate-200">Data</th>
                      <th className="p-2 w-28 border-r border-slate-200">Estado</th>
                      <th className="p-2 w-32 border-r border-slate-200">Métricas</th>
                      <th className="p-2">Contexto & Notas</th>
                  </tr>
              </thead>
              <tbody>
                {sortedAssessments.map((a, idx) => {
                  const secEmotion = a.secondaryEmotion ? emotionalScales[a.secondaryEmotion]?.name : null;
                  return (
                    <tr key={idx} className="border-b border-slate-200 page-break-inside-avoid">
                      <td className="p-2 align-top font-mono text-xs text-slate-600 border-r border-slate-200">
                          {new Date(a.timestamp).toLocaleDateString('pt-BR')}
                          <br />
                          {new Date(a.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-2 align-top border-r border-slate-200">
                          <span className="font-bold text-black">{emotionalScales[a.emotion]?.name}</span>
                          <br />
                          <span className="text-xs">Nível {a.level}</span>
                          {secEmotion && (<div className="mt-1 text-xs text-slate-500 italic">+ {secEmotion}</div>)}
                      </td>
                      <td className="p-2 align-top text-xs space-y-1 border-r border-slate-200">
                          <div>Val: {a.customValence.toFixed(1)}</div>
                          <div>Ativ: {a.customArousal.toFixed(1)}</div>
                          <div className="font-semibold">Sono: {a.sleepHours}h</div>
                      </td>
                      <td className="p-2 align-top space-y-1">
                          {a.notes && (<div className="bg-slate-50 p-2 rounded border border-slate-100 mb-2 italic text-slate-800 text-xs">"{a.notes}"</div>)}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                             {a.trigger && <span>⚡ {a.trigger}</span>}
                             {a.location && <span>📍 {a.location}</span>}
                             {a.bodySensations && a.bodySensations.length > 0 && <span>🩺 {a.bodySensations.join(', ')}</span>}
                          </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW DEFAULT ---

  return (
    <div className="space-y-6">
      {/* Controles de Visualização e Filtros */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/5">
        
        {/* Toggle de Visualização */}
        <div className={`flex p-1 rounded-lg border ${borderClass} ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} self-start`}>
          <button
            onClick={() => setSubView('charts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              subView === 'charts' 
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' 
                : `${textSecondary} hover:text-blue-500`
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Gráficos</span>
          </button>
          <button
            onClick={() => setSubView('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              subView === 'calendar' 
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' 
                : `${textSecondary} hover:text-blue-500`
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Calendário</span>
          </button>
          <button
            onClick={() => setSubView('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              subView === 'list' 
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400' 
                : `${textSecondary} hover:text-blue-500`
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Diário</span>
          </button>
        </div>

        {/* Filtros de Data e Emoção */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${borderClass} ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
             <CalendarRange className={`w-4 h-4 ${textSecondary}`} />
             <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className={`bg-transparent text-xs font-medium outline-none ${textClass} w-24`}
             />
             <span className={textSecondary}>-</span>
             <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className={`bg-transparent text-xs font-medium outline-none ${textClass} w-24`}
             />
          </div>

          <div className="relative flex-1 sm:flex-none sm:w-48">
             <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${textSecondary}`}>
                <Filter className="w-4 h-4" />
             </div>
             <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider appearance-none border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} focus:ring-2 focus:ring-indigo-500 outline-none h-full`}
             >
                <option value="all">Todas Emoções</option>
                {Object.entries(emotionalScales).map(([key, scale]) => (
                   <option key={key} value={key}>{scale.name}</option>
                ))}
             </select>
          </div>

          <button
            onClick={() => setShowReport(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-indigo-500/30 whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            Relatório
          </button>
        </div>
      </div>

      {assessments.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block mb-4 p-6 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <Heart className="w-12 h-12 text-red-400" aria-hidden="true" />
            </div>
            <p className={`${textClass} text-xl font-bold mb-2`}>Nenhuma emoção registrada</p>
            <p className={textSecondary}>Comece registrando para ver o histórico clínico.</p>
            {/* Botão de Importar em Estado Vazio */}
            <div className="mt-6">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
                <button 
                    onClick={handleImportClick}
                    className="text-indigo-500 hover:text-indigo-400 text-sm font-medium underline flex items-center gap-2 mx-auto"
                >
                    <Upload className="w-4 h-4" />
                    Restaurar backup anterior?
                </button>
            </div>
          </div>
      ) : (
      <>
        {/* AI ANALYSIS SECTION */}
        <div className={`rounded-2xl p-1 overflow-hidden relative ${theme === 'dark' ? 'bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100'}`}>
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />

            <div className={`relative p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-sm`}>
                {!analysisResult && !isAnalyzing && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${textClass}`}>Insights com Inteligência Artificial</h3>
                            <p className={`text-sm ${textSecondary}`}>
                                Análise baseada nos {filteredAssessments.length} registros filtrados.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleRunAnalysis}
                        disabled={filteredAssessments.length < 3}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:scale-100"
                    >
                        <Brain className="w-4 h-4" />
                        Gerar Análise
                    </button>
                </div>
                )}

                {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin" />
                        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-pink-500 border-b-transparent border-l-indigo-500 animate-spin-reverse" />
                    </div>
                    <p className={`text-sm font-medium animate-pulse ${textClass}`}>O Gemini está analisando seus registros...</p>
                </div>
                )}

                {analysisError && (
                <div className="text-red-500 p-4 text-center text-sm font-medium">
                    {analysisError}
                    <button onClick={() => setAnalysisError(null)} className="ml-2 underline">Tentar novamente</button>
                </div>
                )}

                {analysisResult && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <h3 className={`font-bold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent`}>
                            Análise Clínica
                            </h3>
                        </div>
                        <button onClick={() => setAnalysisResult(null)} className={`text-xs underline ${textSecondary}`}>Nova Análise</button>
                    </div>

                    <p className={`text-base leading-relaxed mb-6 ${textClass} p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        {analysisResult.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Activity className="w-4 h-4" />
                            Padrões Identificados
                            </h4>
                            <ul className="space-y-2">
                            {analysisResult.patterns.map((item, idx) => (
                                <li key={idx} className={`text-sm flex items-start gap-2 ${textSecondary}`}>
                                    <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                                    {item}
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <Brain className="w-4 h-4" />
                            Sugestões Práticas
                            </h4>
                            <ul className="space-y-2">
                            {analysisResult.suggestions.map((item, idx) => (
                                <li key={idx} className={`text-sm flex items-start gap-2 ${textSecondary}`}>
                                    <Check className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                                    {item}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>

        {filteredAssessments.length === 0 ? (
            <div className="py-20 text-center opacity-60">
                <p>Nenhum registro encontrado para este filtro de data/emoção.</p>
                <button 
                   onClick={() => setDateRange({
                       start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
                       end: new Date().toISOString().split('T')[0]
                   })}
                   className="text-indigo-500 underline text-sm mt-2"
                >
                    Expandir filtro para o último ano
                </button>
            </div>
        ) : (
            <>
            {subView === 'calendar' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <CalendarHeatmap assessments={filteredAssessments} theme={theme} />
                    <div className={`p-4 rounded-xl border-l-4 border-indigo-500 ${bgCard}`}>
                    <h4 className={`font-bold ${textClass} mb-2`}>Como ler o Calendário?</h4>
                    <p className={`text-sm ${textSecondary}`}>
                        As cores representam a emoção predominante do dia. A intensidade da cor indica o nível da emoção.
                    </p>
                    </div>
                </div>
            )}

            {subView === 'charts' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                    {/* Cartão de Resumo e Frequência */}
                    <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-bold ${textClass}`}>Frequência</h3>
                    </div>
                    <div className="space-y-3">
                        {emotionCounts.slice(0, 4).map((item, idx) => (
                        <div key={item.emotion} className="flex items-center gap-2">
                            <div className="w-24 text-sm font-medium opacity-80">{item.name}</div>
                            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${(item.count / filteredAssessments.length) * 100}%` }}
                            />
                            </div>
                            <div className="text-xs font-mono opacity-60 w-8 text-right">{item.count}</div>
                        </div>
                        ))}
                    </div>
                    </div>
                    
                    {/* Cartão de Consistência e Total */}
                    <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass} flex flex-col justify-between`}>
                    <div>
                        <p className={`text-sm font-semibold uppercase ${textSecondary} mb-2`}>Total Filtrado</p>
                        <div className="flex items-baseline gap-2">
                        <p className={`text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
                            {filteredAssessments.length}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>registros</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary} mb-2`}>Últimos 7 dias</p>
                        <div className="flex justify-between items-end">
                            {weeklyConsistency.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                            day.hasData 
                                            ? 'bg-green-500 text-white border-green-600 shadow-sm scale-110' 
                                            : `bg-transparent ${theme === 'dark' ? 'border-slate-700 text-slate-600' : 'border-slate-200 text-slate-300'}`
                                        }`}
                                        title={`${day.count} registros em ${day.date}`}
                                    >
                                        {day.hasData ? <Check className="w-4 h-4" /> : day.label[0]}
                                    </div>
                                    <span className="text-[9px] opacity-50 uppercase">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>

                {/* PAINEL DE CORRELAÇÕES DE CONTEXTO */}
                {contextStats && (
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl p-6 border-2 ${bgCard} ${borderClass}`}>
                        <div className="md:col-span-3 mb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                            <h3 className={`font-bold ${textClass}`}>
                                Contextos Mais Frequentes {filterEmotion !== 'all' ? `para ${emotionalScales[filterEmotion].name}` : ''}
                            </h3>
                        </div>
                        
                        <div className="space-y-3">
                            <p className={`text-xs font-bold uppercase tracking-wider ${textSecondary} flex items-center gap-1`}>
                            <MapPin className="w-3 h-3" /> Lugares
                            </p>
                            {contextStats.locations.map(([name, count], i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className={textClass}>{name}</span>
                                    <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 rounded text-xs">{count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <p className={`text-xs font-bold uppercase tracking-wider ${textSecondary} flex items-center gap-1`}>
                            <Users className="w-3 h-3" /> Companhia
                            </p>
                            {contextStats.companies.map(([name, count], i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className={textClass}>{name}</span>
                                    <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 rounded text-xs">{count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <p className={`text-xs font-bold uppercase tracking-wider ${textSecondary} flex items-center gap-1`}>
                            <Zap className="w-3 h-3" /> Gatilhos
                            </p>
                            {contextStats.triggers.map(([name, count], i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className={textClass}>{name}</span>
                                    <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 rounded text-xs">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gráfico Composto: Emoção x Sono */}
                <div className={`rounded-2xl p-8 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
                    <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} aria-hidden="true" />
                        <h3 className={`text-xl font-bold ${textClass}`}>Correlação: Emoção & Sono</h3>
                    </div>
                    </div>
                    <p className={`text-sm ${textSecondary} mb-6`}>
                    Analise como a quantidade de sono (barras azuis) influencia a intensidade emocional (linha roxa).
                    </p>
                    <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={getTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#cbd5e1'} vertical={false} />
                        <XAxis 
                        dataKey="dateLabel" 
                        tick={{ fill: chartText, fontSize: 11 }} 
                        interval="preserveStartEnd"
                        />
                        <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        stroke="#8b5cf6" 
                        tick={{ fill: chartText, fontSize: 11 }}
                        label={{ value: 'Intensidade Emoção (1-7)', angle: -90, position: 'insideLeft', fill: '#8b5cf6', fontSize: 11 }}
                        domain={[0, 8]}
                        />
                        <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#3b82f6" 
                        tick={{ fill: chartText, fontSize: 11 }}
                        label={{ value: 'Horas de Sono', angle: 90, position: 'insideRight', fill: '#3b82f6', fontSize: 11 }}
                        domain={[0, 14]}
                        />
                        <Tooltip 
                        labelFormatter={(label, payload) => payload[0]?.payload.fullDate || label}
                        contentStyle={{ backgroundColor: chartBg, border: 'none', borderRadius: '12px', color: chartText }} 
                        />
                        <Legend />
                        <Bar yAxisId="right" dataKey="sleep" name="Horas de Sono" barSize={20} fill="#3b82f6" opacity={0.3} radius={[4, 4, 0, 0]} />
                        <Line yAxisId="left" type="monotone" dataKey="nivel" name="Nível de Emoção" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                    </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Modelo Circumplexo de Russell */}
                <div className={`rounded-2xl p-8 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
                    <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Compass className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} aria-hidden="true" />
                        <h3 className={`text-xl font-bold ${textClass}`}>Modelo Circumplexo (Russell)</h3>
                    </div>
                    </div>
                    <p className={`text-sm ${textSecondary} mb-6`}>
                    Correlação entre Valência (Prazer) e Arousal (Energia).
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#475569' : '#cbd5e1'} />
                        <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Valência" 
                        domain={[0, 10]} 
                        tick={{ fill: chartText }} 
                        label={{ value: 'Desprazer <---> Prazer', position: 'bottom', fill: chartText, fontSize: 12 }} 
                        />
                        <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Arousal" 
                        domain={[0, 10]} 
                        tick={{ fill: chartText }} 
                        label={{ value: 'Baixa <---> Alta Energia', angle: -90, position: 'left', fill: chartText, fontSize: 12 }} 
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 200]} />
                        <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: chartBg, border: 'none', borderRadius: '12px', color: chartText }}
                        formatter={(value, name) => [value, name === 'x' ? 'Valência' : 'Energia']} 
                        />
                        <ReferenceLine x={5} stroke={chartText} strokeOpacity={0.3} />
                        <ReferenceLine y={5} stroke={chartText} strokeOpacity={0.3} />
                        <Scatter name="Emoções" data={getCircumplexData} fill="#8884d8" />
                    </ScatterChart>
                    </ResponsiveContainer>
                </div>

                <NeuroGlossary theme={theme} />
                </div>
            )}

            {subView === 'list' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {sortedAssessments.map((assessment) => {
                    const emotion = emotionalScales[assessment.emotion];
                    const color = emotionColors[assessment.emotion];
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
                            Arousal: {assessment.customArousal}
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
                })}
                </div>
            )}
            </>
        )}

      )}

      {/* Footer de Ações */}
      <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass} mt-8`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className={`text-sm font-semibold uppercase ${textSecondary}`}>Dados & Privacidade</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPrivacyOptions(!showPrivacyOptions)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all text-sm"
            >
              {showPrivacyOptions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Opções Avançadas
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
            />
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              <Upload className="w-4 h-4" />
              Restaurar Backup
            </button>
            <button
              onClick={onExportData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:brightness-110 rounded-lg transition-all text-sm font-bold"
            >
              <Download className="w-4 h-4" />
              Backup (JSON)
            </button>
          </div>
        </div>

        {showPrivacyOptions && (
          <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex gap-3">
               <button
                onClick={onAnonymize}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-sm font-medium"
              >
                Anonimizar para Pesquisa
              </button>
              <button
                onClick={onClearHistory}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium"
              >
                Apagar Tudo (Irreversível)
              </button>
            </div>
            <p className={`text-xs ${textSecondary} mt-3`}>
              Os dados ficam salvos apenas no navegador deste dispositivo. Recomendamos fazer backups frequentes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};