import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, Sun, Moon, LifeBuoy, AlertTriangle, Flame, Shield } from 'lucide-react';
import { Toast } from './components/Toast';
import { EmotionCard } from './components/EmotionCard';
import { ContextForm } from './components/ContextForm';
import { HistoryView } from './components/HistoryView';
import { SafetyPlanView } from './components/SafetyPlanView';
import { BreathingModal } from './components/BreathingModal';
import { NeuroGlossary } from './components/NeuroGlossary';
import { FeedbackModal } from './components/FeedbackModal';
import { RegulationModal } from './components/RegulationModal';
import { RuminationModal } from './components/RuminationModal';
import { emotionalScales, emotionColors } from './constants';
import { storageService } from './services/storageService';
import { Assessment, ToastMessage, ContextData, RegulationPractice } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storageService.getTheme());
  const [hoveredLevel, setHoveredLevel] = useState<{ emotionKey: string; level: any } | null>(null);
  const [view, setView] = useState<'scale' | 'history' | 'safety'>('scale');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showContextForm, setShowContextForm] = useState<{ emotionKey: string; level: number } | null>(null);
  const [showFeedback, setShowFeedback] = useState<Assessment | null>(null);
  const [showSOS, setShowSOS] = useState(false);
  const [activePractice, setActivePractice] = useState<RegulationPractice | null>(null);
  const [showRumination, setShowRumination] = useState(false);

  useEffect(() => {
    setAssessments(storageService.getAssessments());
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    storageService.saveTheme(theme);
  }, [theme]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const handleAssessmentSave = useCallback((data: { emotion: string; level: number } & ContextData) => {
    const finalTimestamp = data.customTimestamp || new Date().toISOString();
    const { customTimestamp, ...rest } = data;

    const assessmentPayload = {
      ...rest,
      timestamp: finalTimestamp
    };

    const savedAssessment = storageService.saveAssessment(assessmentPayload);

    if (savedAssessment) {
      setAssessments(storageService.getAssessments());
      setShowContextForm(null);
      // Now using the actual saved object which includes the generated ID
      setShowFeedback(savedAssessment); 
    } else {
      showToast('Erro ao salvar', 'error');
    }
  }, [showToast]);

  const handleCardToggle = useCallback((key: string) => {
    setExpandedCard(prev => (prev === key ? null : key));
    setHoveredLevel(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Deseja limpar TODO o histórico? Esta ação é irreversível.')) {
      if (storageService.clearAssessments()) {
        showToast('Histórico limpo', 'success');
        setAssessments([]);
      }
    }
  }, [showToast]);

  const handleDeleteAssessment = useCallback((id: number) => {
    if (window.confirm('Excluir este registro?')) {
      if (storageService.deleteAssessment(id)) {
        showToast('Registro excluído', 'success');
        setAssessments(storageService.getAssessments());
      } else {
        showToast('Erro ao excluir', 'error');
      }
    }
  }, [showToast]);

  const handleExportData = useCallback(() => {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        totalAssessments: assessments.length,
        assessments: assessments
      };
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `termometro-emocional-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      showToast('Dados exportados com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao exportar dados', 'error');
    }
  }, [assessments, showToast]);

  const handleImportData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Suporta tanto o formato de exportação completo quanto um array simples
        const itemsToImport = Array.isArray(json) ? json : (json.assessments || []);
        
        const result = storageService.importAssessments(itemsToImport);
        if (result.success) {
          setAssessments(storageService.getAssessments());
          showToast(`${result.count} registros importados com sucesso!`, 'success');
        } else {
          showToast('Nenhum registro válido encontrado ou erro no formato.', 'info');
        }
      } catch (err) {
        console.error(err);
        showToast('Erro ao ler o arquivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
    // Resetar o input para permitir importar o mesmo arquivo novamente se necessário
    e.target.value = '';
  }, [showToast]);

  const handleAnonymize = useCallback(() => {
    try {
      const anonymized = assessments.map(a => ({
        ...a,
        id: undefined,
        pseudoId: 'anon-' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(a.timestamp).toISOString().split('T')[0],
        notes: '[REDACTED]',
        company: a.company.map(() => 'Anônimo')
      }));
      
      const data = {
        anonymized: true,
        exportDate: new Date().toISOString(),
        totalAssessments: anonymized.length,
        assessments: anonymized
      };
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `termometro-anonimizado-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      showToast('Dados anonimizados e exportados!', 'success');
    } catch (e) {
      showToast('Erro ao gerar dados anônimos', 'error');
    }
  }, [assessments, showToast]);

  // Calcula dias seguidos de registro (Streak)
  const streak = useMemo(() => {
    if (!assessments.length) return 0;
    const dates = [...new Set(assessments.map(a => a.timestamp.split('T')[0]))].sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let currentDate = new Date();
    
    // Normaliza para string YYYY-MM-DD local
    const formatDate = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const todayStr = formatDate(currentDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const yesterdayStr = formatDate(currentDate);

    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;

    let checkDate = new Date(dates[0] + 'T12:00:00'); // Evita problemas de fuso horário
    for (const dateStr of dates) {
      if (dateStr === formatDate(checkDate)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }, [assessments]);

  // Cores dinâmicas baseadas na última emoção
  const lastEmotionKey = assessments[0]?.emotion;
  const dynamicColors = lastEmotionKey ? emotionColors[lastEmotionKey] : null;

  const bgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900'
    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-4 md:p-8 transition-colors duration-500 font-sans relative overflow-x-hidden selection:bg-pink-500 selection:text-white`}>
      
      {/* Background Blobs Animados - Estética Orgânica (Dinâmico) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none no-print z-0 transition-colors duration-1000">
        <div 
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob`} 
          style={{ backgroundColor: dynamicColors ? dynamicColors.light : (theme === 'dark' ? '#581c87' : '#93c5fd') }}
        />
        <div 
          className={`absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000`} 
          style={{ backgroundColor: dynamicColors ? dynamicColors.main : (theme === 'dark' ? '#312e81' : '#d8b4fe') }}
        />
        <div 
          className={`absolute -bottom-40 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000`} 
          style={{ backgroundColor: dynamicColors ? dynamicColors.dark : (theme === 'dark' ? '#831843' : '#f9a8d4') }}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className={`max-w-6xl mx-auto relative z-10 ${showSOS || showContextForm || showFeedback || activePractice || showRumination ? 'blur-sm pointer-events-none select-none grayscale-[0.5]' : ''} transition-all duration-500`}>
        
        {/* Header Elegante */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 no-print">
          <div className="flex items-center gap-4 group cursor-default">
             <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500/10 transition-transform group-hover:scale-110 duration-300" />
                </div>
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 filter drop-shadow-sm">
                     Termômetro
                   </span>
                   <span className={`block text-xl md:text-2xl font-medium ${textSecondary}`}>Emocional</span>
                </h1>
             </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${streak > 0 ? 'border-orange-500/30 bg-orange-500/10 text-orange-500' : 'border-slate-500/30 bg-slate-500/10 text-slate-500'}`} title="Dias seguidos de registro">
              <Flame className={`w-5 h-5 ${streak > 0 ? 'fill-orange-500 animate-pulse' : ''}`} />
              <span className="font-bold font-mono">{streak} {streak === 1 ? 'dia' : 'dias'}</span>
            </div>

            <button
              onClick={() => setShowSOS(true)}
              className="group relative px-6 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] active:scale-95 transition-all duration-300 flex items-center gap-2 overflow-hidden pointer-events-auto"
              aria-label="SOS - Respiração Guiada"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <LifeBuoy className="w-5 h-5 animate-pulse" />
              <span>SOS</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-3.5 rounded-full transition-all duration-300 active:scale-90 hover:rotate-12 pointer-events-auto border backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:bg-slate-800'
                  : 'bg-white/50 border-white/50 text-slate-600 shadow-sm hover:bg-white'
              }`}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navegação Estilo 'Pill' com vidro */}
        <div className="flex justify-center mb-10 no-print">
          <div className={`flex p-1.5 rounded-full backdrop-blur-md border shadow-lg ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-white/40'}`}>
            {[
              { id: 'scale', label: 'Registrar', icon: '📝' },
              { id: 'history', label: 'Histórico', icon: '📈' },
              { id: 'safety', label: 'Plano SOS', icon: '🛡️' }
            ].map(viewOption => (
              <button
                key={viewOption.id}
                onClick={() => setView(viewOption.id as any)}
                className={`relative px-4 md:px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  view === viewOption.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-100'
                    : `hover:bg-black/5 dark:hover:bg-white/5 ${textSecondary} scale-95 hover:scale-100`
                }`}
              >
                <span className="hidden md:inline">{viewOption.icon}</span>
                <span>{viewOption.label}</span>
              </button>
            ))}
          </div>
        </div>

        {view === 'scale' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 no-print" role="region" aria-label="Escalas emocionais">
            {Object.entries(emotionalScales).map(([key, emotion]) => (
              <EmotionCard
                key={key}
                emotionKey={key}
                emotion={emotion}
                isExpanded={expandedCard === key}
                hoveredLevel={hoveredLevel}
                onCardToggle={handleCardToggle}
                onHoverLevel={setHoveredLevel}
                onSave={(emotionKey, level) => setShowContextForm({ emotionKey, level })}
                onOpenPractice={(practice) => setActivePractice(practice)}
                onOpenRumination={() => setShowRumination(true)}
                theme={theme}
              />
            ))}
            
            <div className="pt-12">
              <NeuroGlossary theme={theme} />
            </div>
          </div>
        )}

        {view === 'history' && (
          <div role="region" aria-label="Histórico e análises" className="animate-in slide-in-from-right-8 duration-500">
            <HistoryView 
              assessments={assessments} 
              theme={theme} 
              onClearHistory={handleClearHistory}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onAnonymize={handleAnonymize}
              onDeleteAssessment={handleDeleteAssessment}
            />
          </div>
        )}

        {view === 'safety' && (
          <div role="region" aria-label="Plano de Segurança" className="animate-in slide-in-from-left-8 duration-500">
            <SafetyPlanView theme={theme} />
          </div>
        )}

        <footer className="mt-20 pb-8 text-center no-print">
           <div className={`inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border backdrop-blur-sm shadow-sm transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white/40 border-white/50'}`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Aviso Ético</span>
              </div>
              <p className={`text-xs max-w-lg leading-relaxed opacity-70 ${textSecondary}`}>
                 Este aplicativo é uma <strong>ferramenta de apoio</strong> ao autoconhecimento. Ele não substitui o diagnóstico ou tratamento profissional. Em caso de sofrimento intenso, procure um Psicólogo ou Psiquiatra.
              </p>
           </div>
        </footer>

      </div>

      {/* Camada de Sobreposição */}
      <div className="relative z-50">
        {showContextForm && (
          <ContextForm
            emotionKey={showContextForm.emotionKey}
            emotion={emotionalScales[showContextForm.emotionKey]}
            level={showContextForm.level}
            onSave={handleAssessmentSave}
            onCancel={() => setShowContextForm(null)}
            theme={theme}
          />
        )}
        
        {showSOS && (
          <BreathingModal onClose={() => setShowSOS(false)} />
        )}

        {activePractice && (
          <RegulationModal 
            practice={activePractice} 
            theme={theme} 
            onClose={() => setActivePractice(null)} 
          />
        )}

        {showRumination && (
          <RuminationModal 
            theme={theme} 
            onClose={() => setShowRumination(false)} 
          />
        )}

        {showFeedback && (
          <FeedbackModal 
            assessment={showFeedback} 
            theme={theme} 
            onClose={() => setShowFeedback(null)} 
          />
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

export default App;