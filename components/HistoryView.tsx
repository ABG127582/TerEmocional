import React, { useState } from 'react';
import { Trash2, BookOpen, Activity, Download, EyeOff, List, BarChart2, Trash } from 'lucide-react';
import { Assessment } from '../types';
import { emotionalScales, emotionColors } from '../constants';

interface HistoryViewProps {
  assessments: Assessment[];
  theme: 'light' | 'dark';
  onClearHistory: () => void;
  onExportData: () => void;
  onAnonymize: () => void;
  onDeleteAssessment: (id: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  assessments, 
  theme, 
  onClearHistory, 
  onExportData, 
  onAnonymize,
  onDeleteAssessment 
}) => {
  const [subView, setSubView] = useState<'list' | 'stats'>('list');

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
            
            <div className="flex gap-2">
                <button onClick={onExportData} className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} title="Exportar JSON">
                    <Download className="w-5 h-5" />
                </button>
                <button onClick={onAnonymize} className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 ${textSecondary}`} title="Exportar Anônimo">
                    <EyeOff className="w-5 h-5" />
                </button>
                <button onClick={onClearHistory} className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500`} title="Limpar Histórico">
                    <Trash className="w-5 h-5" />
                </button>
            </div>
        </div>

        {assessments.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <p className="text-xl font-bold">Nenhum registro encontrado.</p>
                <p className="text-sm">Comece registrando como você se sente na aba "Registrar".</p>
            </div>
        ) : (
            <>
                {subView === 'list' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {sortedAssessments.map((assessment) => {
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
                {subView === 'stats' && (
                    <div className={`p-8 text-center rounded-xl border-2 border-dashed ${borderClass} opacity-50`}>
                        <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Visualização de estatísticas em desenvolvimento.</p>
                    </div>
                )}
            </>
        )}
    </div>
  );
};