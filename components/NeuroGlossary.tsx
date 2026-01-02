import React from 'react';
import { Theme } from '../types';
import { RefreshCw, Fingerprint, BookOpen, Brain, Activity } from 'lucide-react';

interface NeuroGlossaryProps {
  theme: Theme;
}

const hormones = [
  { name: 'Cortisol', func: 'Desliga o longo prazo', color: '#60A5FA' }, // Blue-400
  { name: 'Dopamina', func: 'Impulso de recompensa', color: '#FBBF24' }, // Amber-400
  { name: 'Serotonina', func: 'Segurança', color: '#34D399' }, // Emerald-400
  { name: 'Ocitocina', func: 'Confiança', color: '#EC4899' }, // Pink-500
  { name: 'Endorfina', func: 'O anestésico', color: '#F472B6' }, // Pink-400
  { name: 'Adrenalina', func: 'Potência máxima', color: '#EF4444' }, // Red-500
  { name: 'Noradrenalina', func: 'Alerta', color: '#F97316' }, // Orange-500
  { name: 'Testosterona', func: 'Força', color: '#D97706' }, // Amber-600/Bronze
  { name: 'Prolactina', func: 'Saciedade', color: '#818CF8' }, // Indigo-400
];

export const NeuroGlossary: React.FC<NeuroGlossaryProps> = ({ theme }) => {
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
      
      {/* 1. Hormônios */}
      <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
          <Activity className="w-5 h-5 text-indigo-500" />
          Glossário Neuroquímico
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {hormones.map((h) => (
            <div 
              key={h.name} 
              className={`flex items-center gap-3 p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}
            >
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ backgroundColor: h.color, color: h.color }} 
              />
              <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>{h.name}</span>
                <span className={`text-xs font-medium opacity-80 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {h.func}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mecanismos Psicológicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ruminação */}
        <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
          <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <RefreshCw className="w-5 h-5 text-yellow-500" />
            Ruminação: O Loop de Manutenção
          </h3>
          <p className={`text-sm leading-relaxed mb-4 text-justify ${textSecondary}`}>
            Uma emoção fisiológica dura apenas 90 segundos a alguns minutos. O que faz ela durar horas ou dias é a <strong>Ruminação</strong>.
          </p>
          <div className={`p-4 rounded-lg border text-xs font-medium space-y-2 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <p>1. Você se lembra do evento.</p>
            <p>2. O Hipocampo reativa a Amígdala.</p>
            <p>3. O cérebro não distingue "pensar no perigo" de "estar em perigo".</p>
            <p className="text-yellow-500 font-bold">4. Nova descarga de hormônios (Cortisol/Adrenalina) ocorre.</p>
            <p>5. O ciclo reinicia, impedindo a metabolização natural.</p>
          </div>
        </div>

        {/* Memórias Base */}
        <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
          <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <Fingerprint className="w-5 h-5 text-purple-500" />
            Memórias Base & Personalidade
          </h3>
          <p className={`text-sm leading-relaxed mb-4 text-justify ${textSecondary}`}>
            Emoções intensas funcionam como um "marcador de importância" para o cérebro, criando <strong>Memórias Base</strong>.
          </p>
          <div className={`p-4 rounded-lg border text-xs font-medium space-y-2 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <div className="flex items-start gap-2">
               <Brain className="w-4 h-4 shrink-0 opacity-70" />
               <p><strong>Codificação:</strong> Alta adrenalina aumenta a plasticidade neural (LTP), gravando o evento vividamente.</p>
            </div>
            <div className="flex items-start gap-2">
               <Fingerprint className="w-4 h-4 shrink-0 opacity-70" />
               <p><strong>Personalidade:</strong> Essas memórias tornam-se "lentes" preditivas. Se você tem muitas memórias base de medo, seu cérebro se molda para ser "ansioso" (hipervigilante) por padrão para te proteger.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fontes */}
      <div className={`py-4 px-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-2 opacity-70">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Fontes Científicas (Clique para acessar)</span>
        </div>
        <p className={`text-[10px] ${textSecondary} flex flex-wrap gap-2`}>
          <a href="https://www.google.com/search?q=Behave+Robert+Sapolsky" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-500 transition-colors">
            <strong>Behave</strong> (Robert Sapolsky)
          </a> • 
          <a href="https://lisafeldmanbarrett.com/books/how-emotions-are-made/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-500 transition-colors">
            <strong> How Emotions Are Made</strong> (Lisa Feldman Barrett)
          </a> • 
          <a href="https://www.besselvanderkolk.com/resources/the-body-keeps-the-score" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-500 transition-colors">
            <strong> The Body Keeps the Score</strong> (Bessel van der Kolk)
          </a> • 
          <a href="https://en.wikipedia.org/wiki/Affective_neuroscience" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-500 transition-colors">
             <strong> Affective Neuroscience</strong> (Jaak Panksepp)
          </a> • 
          <a href="https://en.wikipedia.org/wiki/Circumplex_model" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-500 transition-colors">
             Modelo Circumplexo de Afeto (James Russell)
          </a>.
        </p>
      </div>

    </div>
  );
};