import React from 'react';
import { Theme } from '../types';
import { RefreshCw, Fingerprint, BookOpen, Brain, Activity, Film, Play, ExternalLink, Mic2, Library, GraduationCap, Sparkles } from 'lucide-react';
import { TTSButton } from './TTSButton';

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

const movies = [
  {
    title: "Divertida Mente 1 & 2",
    originalTitle: "Inside Out Franchise",
    context: "A bíblia das emoções básicas. Do controle da raiva à complexidade da ansiedade na adolescência.",
    url: "https://www.youtube.com/watch?v=LEjhY15eCx0",
    image: "https://placehold.co/100x150/F59E0B/FFFFFF?text=Inside+Out",
  },
  {
    title: "Soul",
    originalTitle: "Soul (2020)",
    context: "Emoções existenciais. Uma aula sobre propósito, 'flow' e as pequenas alegrias (emoções sutis).",
    url: "https://www.youtube.com/watch?v=xOsLIiBStEs",
    image: "https://placehold.co/100x150/60A5FA/FFFFFF?text=Soul",
  },
  {
    title: "Up – Altas Aventuras",
    originalTitle: "Up (2009)",
    context: "Sobre perda, luto e a ressignificação do apego. A importância da tristeza para a cura.",
    url: "https://www.youtube.com/watch?v=ORFWdSZWGM8",
    image: "https://placehold.co/100x150/38bdf8/FFFFFF?text=Up",
  },
  {
    title: "Luca",
    originalTitle: "Luca (2021)",
    context: "Enfrentamento do medo ('Silêncio, Bruno!'), aceitação social e construção de identidade.",
    url: "https://www.youtube.com/watch?v=mYfJxlgR2jw",
    image: "https://placehold.co/100x150/34d399/FFFFFF?text=Luca",
  },
  {
    title: "Brilho Eterno...",
    originalTitle: "Eternal Sunshine... (2004)",
    context: "A tentativa de apagar memórias dolorosas e como isso afeta nossa identidade emocional.",
    url: "https://www.youtube.com/watch?v=TLlkksQlHg8",
    image: "https://placehold.co/100x150/3B82F6/FFFFFF?text=Eternal+Sunshine",
  },
  {
    title: "Ela",
    originalTitle: "Her (2013)",
    context: "Solidão contemporânea, vínculos digitais e a natureza da conexão emocional.",
    url: "https://www.youtube.com/watch?v=ne6p6MfLBxc",
    image: "https://placehold.co/100x150/f87171/FFFFFF?text=Her",
  },
  {
    title: "Manchester à Beira-Mar",
    originalTitle: "Manchester by the Sea (2016)",
    context: "Um retrato cru do luto não resolvido, culpa e o entorpecimento emocional.",
    url: "https://www.youtube.com/watch?v=GSFCvG6BSKg",
    image: "https://placehold.co/100x150/94a3b8/FFFFFF?text=Manchester",
  },
  {
    title: "Uma Mente Brilhante",
    originalTitle: "A Beautiful Mind (2001)",
    context: "A linha tênue entre percepção e realidade. Resiliência e o papel do afeto na saúde mental.",
    url: "https://www.youtube.com/watch?v=kVrqfYjkTdQ",
    image: "https://placehold.co/100x150/d6d3d1/FFFFFF?text=Beautiful+Mind",
  },
  {
    title: "O Vendedor de Sonhos",
    originalTitle: "O Vendedor de Sonhos (2016)",
    context: "Do desespero à esperança. Narrativa simbólica sobre gestão da emoção e escolhas.",
    url: "https://www.youtube.com/watch?v=hH4gW-qF5pU",
    image: "https://placehold.co/100x150/57534e/FFFFFF?text=Vendedor+Sonhos",
  }
];

const talks = [
  {
    title: "O Poder da Vulnerabilidade",
    author: "Brené Brown",
    source: "TED Talk",
    url: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
    desc: "Uma das palestras mais vistas do mundo. Sobre vergonha, conexão e coragem."
  },
  {
    title: "O Dom e o Poder da Coragem Emocional",
    author: "Susan David",
    source: "TED Talk",
    url: "https://www.youtube.com/watch?v=NDQ1F509E94",
    desc: "A diferença crítica entre negar emoções e ter agilidade emocional."
  }
];

const scientificBooks = [
  { title: "Inteligência Emocional", author: "Daniel Goleman", link: "https://www.google.com/search?q=Inteligencia+Emocional+Daniel+Goleman" },
  { title: "Agilidade Emocional", author: "Susan David", link: "https://www.google.com/search?q=Agilidade+Emocional+Susan+David" },
  { title: "Atlas of the Heart", author: "Brené Brown", link: "https://brenebrown.com/book/atlas-of-the-heart/" },
  { title: "Permission to Feel", author: "Marc Brackett", link: "https://www.marcbrackett.com/books/permission-to-feel/" },
  { title: "How Emotions Are Made", author: "Lisa Feldman Barrett", link: "https://lisafeldmanbarrett.com/books/how-emotions-are-made/" },
  { title: "O Corpo Guarda as Marcas", author: "Bessel van der Kolk", link: "https://www.besselvanderkolk.com/resources/the-body-keeps-the-score" }
];

const reflectionBooks = [
  { title: "O Vendedor de Sonhos", author: "Augusto Cury", link: "https://www.google.com/search?q=O+Vendedor+de+Sonhos+Augusto+Cury" },
  { title: "O Código da Inteligência", author: "Augusto Cury", link: "https://www.google.com/search?q=O+Codigo+da+Inteligencia+Augusto+Cury" },
  { title: "Gestão da Emoção", author: "Augusto Cury", link: "https://www.google.com/search?q=Gestao+da+Emocao+Augusto+Cury" }
];

const institutions = [
    { name: "Yale Center for Emotional Intelligence", url: "https://www.ycei.org/" },
    { name: "Greater Good Science Center (Berkeley)", url: "https://ggsc.berkeley.edu/" },
    { name: "APA - American Psychological Association", url: "https://www.apa.org/" }
];

export const NeuroGlossary: React.FC<NeuroGlossaryProps> = ({ theme }) => {
  const bgCard = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  const ruminationText = `Ruminação: O Loop de Manutenção. Uma emoção fisiológica dura apenas 90 segundos a alguns minutos. O que faz ela durar horas ou dias é a Ruminação. 1. Você se lembra do evento. 2. O Hipocampo reativa a Amígdala. 3. O cérebro não distingue "pensar no perigo" de "estar em perigo". 4. Nova descarga de hormônios ocorre. 5. O ciclo reinicia, impedindo a metabolização natural.`;
  
  const memoryText = `Memórias Base e Personalidade. Emoções intensas funcionam como um "marcador de importância" para o cérebro, criando Memórias Base. Codificação: Alta adrenalina aumenta a plasticidade neural, gravando o evento vividamente. Personalidade: Essas memórias tornam-se "lentes" preditivas. Se você tem muitas memórias de medo, seu cérebro se molda para ser "ansioso" por padrão.`;

  return (
    <div className={`mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
      
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
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <RefreshCw className="w-5 h-5 text-yellow-500" />
                Ruminação: O Loop
            </h3>
            <TTSButton text={ruminationText} theme={theme} />
          </div>
          <p className={`text-sm leading-relaxed mb-4 text-justify ${textSecondary}`}>
            Uma emoção fisiológica dura apenas 90 segundos a alguns minutos. O que faz ela durar horas ou dias é a <strong>Ruminação</strong>.
          </p>
          <div className={`p-4 rounded-lg border text-xs font-medium space-y-2 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <p>1. Você se lembra do evento.</p>
            <p>2. O Hipocampo reativa a Amígdala.</p>
            <p>3. O cérebro não distingue "pensar no perigo" de "estar em perigo".</p>
            <p className="text-yellow-500 font-bold">4. Nova descarga de hormônios ocorre.</p>
            <p>5. O ciclo reinicia, impedindo a metabolização natural.</p>
          </div>
        </div>

        {/* Memórias Base */}
        <div className={`rounded-xl p-6 backdrop-blur-md border-2 ${bgCard} ${borderClass}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <Fingerprint className="w-5 h-5 text-purple-500" />
                Memórias Base
            </h3>
            <TTSButton text={memoryText} theme={theme} />
          </div>
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
               <p><strong>Personalidade:</strong> Essas memórias tornam-se "lentes" preditivas. Se você tem muitas memórias de medo, seu cérebro se molda para ser "ansioso" por padrão.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO CULTURAL E EDUCACIONAL - MAPA CANÔNICO */}
      <div className={`pt-10 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 ${textSecondary} flex items-center gap-2`}>
          <Library className="w-4 h-4" /> Centro de Recursos & Educação Emocional
        </h3>

        <div className="space-y-12">
            
            {/* 3. Filmes Essenciais */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Film className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <h4 className={`text-sm font-bold ${textClass}`}>Material Cultural (Narrativas Essenciais)</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {movies.map((ref) => (
                    <a 
                    key={ref.title}
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] group ${theme === 'dark' ? 'bg-slate-900/40 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                    >
                        <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 shadow-sm">
                            <img 
                                src={ref.image} 
                                alt={`Poster: ${ref.title}`} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h5 className={`text-sm font-bold leading-tight mb-1 ${theme === 'dark' ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'} transition-colors`}>
                                {ref.title}
                            </h5>
                            <p className={`text-[10px] font-mono mb-2 opacity-60 ${textClass}`}>{ref.originalTitle}</p>
                            <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                                {ref.context}
                            </p>
                        </div>
                    </a>
                ))}
                </div>
            </div>

            {/* 4. Palestras (TED) - Agora em GRID */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Mic2 className={`w-4 h-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                    <h4 className={`text-sm font-bold ${textClass}`}>Palestras Fundamentais (TED)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {talks.map(talk => (
                        <a 
                            key={talk.title}
                            href={talk.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`block p-4 rounded-lg border transition-all hover:border-red-500/30 group ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{talk.source}</span>
                                <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h5 className={`text-sm font-bold mb-1 ${textClass}`}>{talk.title}</h5>
                            <p className={`text-[10px] font-mono mb-2 ${textSecondary}`}>Por {talk.author}</p>
                            <p className={`text-[11px] ${textSecondary} opacity-80 leading-relaxed`}>{talk.desc}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* 5. Biblioteca e Fontes - Agora Full Width abaixo */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <h4 className={`text-sm font-bold ${textClass}`}>Biblioteca Essencial & Pesquisa</h4>
                </div>
                <div className={`rounded-xl border p-6 w-full ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    {/* Livros Científicos */}
                    <div className="mb-6">
                        <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-3 opacity-70 ${textClass}`}>Ciência e Neurobiologia</h5>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {scientificBooks.map(book => (
                                <li key={book.title} className="flex items-start gap-3">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600'}`} />
                                    <a 
                                        href={book.link}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 group"
                                    >
                                        <div className={`text-xs font-bold group-hover:underline decoration-emerald-500/50 ${textClass}`}>
                                            {book.title}
                                        </div>
                                        <div className={`text-[11px] ${textSecondary}`}>
                                            {book.author}
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Leitura Complementar (Reflexão) */}
                    <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                            <Sparkles className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                            <h5 className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Leitura Complementar — Reflexão</h5>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {reflectionBooks.map(book => (
                                <li key={book.title} className="flex items-start gap-3">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500'}`} />
                                    <a 
                                        href={book.link}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 group"
                                    >
                                        <div className={`text-xs font-bold group-hover:underline decoration-amber-500/50 ${textClass}`}>
                                            {book.title}
                                        </div>
                                        <div className={`text-[11px] ${textSecondary}`}>
                                            {book.author}
                                        </div>
                                    </a>
                                </li>
                            ))}
                            </ul>
                    </div>
                    
                    {/* Instituições */}
                    <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                            <GraduationCap className={`w-3 h-3 ${textSecondary}`} />
                            <h5 className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Instituições de Referência</h5>
                            </div>
                            <div className="flex flex-wrap gap-2">
                            {institutions.map(inst => (
                                <a 
                                    key={inst.name}
                                    href={inst.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[10px] px-3 py-1.5 rounded border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}
                                >
                                    {inst.name}
                                </a>
                            ))}
                            </div>
                    </div>
                </div>
            </div>

            {/* Aviso Legal */}
            <p className={`text-[9px] text-center opacity-40 ${textSecondary} pt-4`}>
                Todo o material visual e intelectual citado pertence a seus respectivos detentores de direitos autorais. <br/>
                Este aplicativo utiliza estas referências estritamente para fins de <strong>educação emocional e divulgação científica</strong>.
            </p>
        </div>
      </div>

    </div>
  );
};
