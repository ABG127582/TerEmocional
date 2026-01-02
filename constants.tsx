import { Heart, Frown, Flame, AlertCircle, Zap, ThumbsDown, Glasses, Filter, Scale, Anchor } from 'lucide-react';
import { EmotionScale, NeuroInfo } from './types';

export const emotionColors: Record<string, { light: string; main: string; dark: string; glow: string; chart: string }> = {
  alegria: { light: '#FBBF24', main: '#F59E0B', dark: '#D97706', glow: 'rgba(245, 158, 11, 0.3)', chart: '#FBBF24' },
  tristeza: { light: '#93C5FD', main: '#60A5FA', dark: '#3B82F6', glow: 'rgba(96, 165, 250, 0.3)', chart: '#60A5FA' },
  raiva: { light: '#FCA5A5', main: '#F87171', dark: '#DC2626', glow: 'rgba(248, 113, 113, 0.3)', chart: '#F87171' },
  medo: { light: '#D8B4FE', main: '#A78BFA', dark: '#7C3AED', glow: 'rgba(167, 139, 250, 0.3)', chart: '#A78BFA' },
  surpresa: { light: '#A5F3FC', main: '#06B6D4', dark: '#0891B2', glow: 'rgba(6, 182, 212, 0.3)', chart: '#06B6D4' },
  nojo: { light: '#86EFAC', main: '#34D399', dark: '#10B981', glow: 'rgba(52, 211, 153, 0.3)', chart: '#34D399' }
};

export const somaticSensations = [
  "Taquicardia (Coração acelerado)",
  "Tensão muscular",
  "Nó na garganta",
  "Respiração curta",
  "Calor no rosto",
  "Frio na barriga",
  "Tremores",
  "Sudorese",
  "Peso no peito",
  "Cansaço súbito",
  "Agitação motora",
  "Mandíbula travada",
  "Vazio no estômago",
  "Lágrimas",
  "Formigamento"
];

export const cognitiveDistortions = [
    { id: 'catastrophizing', label: "Catastrofização", desc: "Imaginar o pior cenário possível.", icon: AlertCircle },
    { id: 'blackwhite', label: "Tudo ou Nada", desc: "Pensar em extremos, sem meio termo.", icon: Scale },
    { id: 'filtering', label: "Filtro Negativo", desc: "Focar só no ruim e ignorar o bom.", icon: Filter },
    { id: 'mindreading', label: "Leitura Mental", desc: "Achar que sabe o que o outro pensa.", icon: Glasses },
    { id: 'personalization', label: "Personalização", desc: "Se culpar por coisas fora do controle.", icon: Anchor },
];

export const NEURO_DATA: Record<string, NeuroInfo> = {
  alegria: {
    description: "Ativação do sistema de recompensa e opioides endógenos.",
    recoveryEstimate: "20min - 4h+ (Dopamina decai rápido, Serotonina sustenta)",
    hormones: [
      { 
        name: "Dopamina", 
        color: "#FBBF24", 
        description: "Impulso de recompensa", 
        decayProfile: { peakTime: 10, decayRate: 1.5 } // Pico mais rápido e curto
      },
      { 
        name: "Endorfina", 
        color: "#EC4899", 
        description: "O anestésico", 
        decayProfile: { peakTime: 15, decayRate: 1.0 } 
      },
      { 
        name: "Serotonina", 
        color: "#34D399", 
        description: "Segurança/Humor", 
        decayProfile: { peakTime: 45, decayRate: 0.2 } // Sustentação prolongada
      }
    ]
  },
  tristeza: {
    description: "Baixa atividade de neurotransmissores excitatórios e aumento leve de cortisol.",
    recoveryEstimate: "4h - 24h+ (Metabolização lenta)",
    hormones: [
      { 
        name: "Cortisol", 
        color: "#60A5FA", 
        description: "Desliga o longo prazo", 
        decayProfile: { peakTime: 60, decayRate: 0.3 } 
      },
      { 
        name: "Prolactina", 
        color: "#818CF8", 
        description: "Saciedade", 
        decayProfile: { peakTime: 30, decayRate: 0.6 } 
      }
    ]
  },
  raiva: {
    description: "Resposta 'Lutar', alta energia e mobilização muscular.",
    recoveryEstimate: "40min - 2h (Para metabolizar adrenalina)",
    hormones: [
      { 
        name: "Adrenalina", 
        color: "#EF4444", 
        description: "Potência máxima", 
        decayProfile: { peakTime: 5, decayRate: 1.5 } 
      },
      { 
        name: "Noradrenalina", 
        color: "#F97316", 
        description: "Alerta", 
        decayProfile: { peakTime: 10, decayRate: 0.9 } 
      },
      { 
        name: "Testosterona", 
        color: "#D97706", 
        description: "Força", 
        decayProfile: { peakTime: 20, decayRate: 0.4 } 
      }
    ]
  },
  medo: {
    description: "Resposta 'Fugir ou Congelar' do eixo HPA.",
    recoveryEstimate: "1h - 3h (Cortisol residual pode durar mais)",
    hormones: [
      { 
        name: "Adrenalina", 
        color: "#D946EF", 
        description: "Potência máxima", 
        decayProfile: { peakTime: 2, decayRate: 2.0 } 
      },
      { 
        name: "Cortisol", 
        color: "#8B5CF6", 
        description: "Desliga o longo prazo", 
        decayProfile: { peakTime: 20, decayRate: 0.4 } 
      }
    ]
  },
  surpresa: {
    description: "Sobressalto neural para focar atenção em novo estímulo.",
    recoveryEstimate: "15min - 45min (Rápida habituação)",
    hormones: [
      { 
        name: "Adrenalina", 
        color: "#06B6D4", 
        description: "Potência máxima", 
        decayProfile: { peakTime: 1, decayRate: 2.5 } 
      }
    ]
  },
  nojo: {
    description: "Ativação da ínsula e resposta visceral de rejeição.",
    recoveryEstimate: "20min - 1h (Depende da remoção do estímulo)",
    hormones: [
      { 
        name: "Resposta Vagal", 
        color: "#10B981", 
        description: "Náusea/Rejeição (Simulação)", 
        decayProfile: { peakTime: 5, decayRate: 1.0 } 
      }
    ]
  }
};

export const emotionalScales: Record<string, EmotionScale> = {
  alegria: {
    name: "Alegria",
    icon: Heart,
    color: "from-yellow-400 via-lime-500 to-emerald-500",
    valenceBase: 7.5,
    colorKey: 'alegria',
    levels: [
      { level: 1, label: "Alívio", valence: 6.5, arousal: 3.0, desc: "Sensação de 'ufa!'", examples: "Terminar prova", regulation: "Respiração profunda" },
      { level: 2, label: "Serenidade", valence: 7.0, arousal: 2.5, desc: "Paz interior", examples: "Meditar", regulation: "Mindfulness" },
      { level: 3, label: "Gratidão", valence: 7.5, arousal: 4.0, desc: "Apreciar coisas boas", examples: "Ajuda", regulation: "Diário" },
      { level: 4, label: "Contentamento", valence: 8.0, arousal: 4.5, desc: "Satisfação", examples: "Projeto", regulation: "Compartilhar" },
      { level: 5, label: "Prazer", valence: 8.5, arousal: 6.5, desc: "Bem-estar", examples: "Comida", regulation: "Exercício" },
      { level: 6, label: "Êxtase", valence: 9.0, arousal: 8.0, desc: "Imersão profunda", examples: "Flow", regulation: "Flow" },
      { level: 7, label: "Euforia", valence: 9.5, arousal: 9.5, desc: "Pico máximo", examples: "Grande conquista", regulation: "Cautela" }
    ]
  },
  tristeza: {
    name: "Tristeza",
    icon: Frown,
    color: "from-sky-400 via-blue-500 to-indigo-600",
    valenceBase: 3.0,
    colorKey: 'tristeza',
    levels: [
      { level: 1, label: "Desapontamento", valence: 4.0, arousal: 3.5, desc: "Expectativas não atendidas", examples: "Plano cancelado", regulation: "Reestruturação" },
      { level: 2, label: "Decepção", valence: 3.5, arousal: 4.0, desc: "Quebra de confiança", examples: "Promessa quebrada", regulation: "Conversar" },
      { level: 3, label: "Melancolia", valence: 3.0, arousal: 3.0, desc: "Tristeza pensativa", examples: "Nostalgia", regulation: "Arte" },
      { level: 4, label: "Mágoa", valence: 2.5, arousal: 5.0, desc: "Dor emocional", examples: "Rejeição", regulation: "Comunicação" },
      { level: 5, label: "Sofrimento", valence: 2.0, arousal: 6.0, desc: "Dor profunda", examples: "Perda", regulation: "Ajuda profissional" },
      { level: 6, label: "Angústia", valence: 1.5, arousal: 7.0, desc: "Tempestade interna", examples: "Crise", regulation: "Profissional" },
      { level: 7, label: "Desespero", valence: 1.0, arousal: 5.5, desc: "Sem esperança", examples: "Depressão", regulation: "Ajuda imediata" }
    ]
  },
  raiva: {
    name: "Raiva",
    icon: Flame,
    color: "from-amber-500 via-red-600 to-rose-700",
    valenceBase: 3.0,
    colorKey: 'raiva',
    levels: [
      { level: 1, label: "Aversão", valence: 4.5, arousal: 4.0, desc: "Repulsa leve", examples: "Inconveniente", regulation: "Afastamento" },
      { level: 2, label: "Irritação", valence: 4.0, arousal: 5.5, desc: "Agitação", examples: "Trânsito", regulation: "Pausas" },
      { level: 3, label: "Ressentimento", valence: 3.5, arousal: 5.0, desc: "Raiva reaquecida", examples: "Injustiça", regulation: "Terapia" },
      { level: 4, label: "Raiva", valence: 3.0, arousal: 7.0, desc: "Resposta forte", examples: "Desrespeito", regulation: "Time-out" },
      { level: 5, label: "Rancor", valence: 2.5, arousal: 6.5, desc: "Raiva amarga", examples: "Traição", regulation: "Perdão" },
      { level: 6, label: "Ódio", valence: 2.0, arousal: 7.5, desc: "Aversão profunda", examples: "Animosidade", regulation: "Profissional" },
      { level: 7, label: "Fúria", valence: 1.5, arousal: 9.5, desc: "Explosão", examples: "Agressividade", regulation: "Afastamento imediato" }
    ]
  },
  medo: {
    name: "Medo",
    icon: AlertCircle,
    color: "from-fuchsia-500 via-purple-600 to-violet-800",
    valenceBase: 3.0,
    colorKey: 'medo',
    levels: [
      { level: 1, label: "Nervosismo", valence: 4.5, arousal: 5.0, desc: "Agitação pré-evento", examples: "Apresentação", regulation: "Preparação" },
      { level: 2, label: "Insegurança", valence: 4.0, arousal: 5.5, desc: "Dúvida", examples: "Capacidades", regulation: "Autoeficácia" },
      { level: 3, label: "Preocupação", valence: 3.5, arousal: 6.0, desc: "Pensamento repetido", examples: "Futuro", regulation: "Cognitiva" },
      { level: 4, label: "Ansiedade", valence: 3.0, arousal: 7.0, desc: "Medo futuro", examples: "Generalizada", regulation: "TCC" },
      { level: 5, label: "Medo", valence: 2.5, arousal: 8.0, desc: "Perigo real", examples: "Ameaça", regulation: "Segurança" },
      { level: 6, label: "Terror", valence: 2.0, arousal: 9.0, desc: "Medo paralisante", examples: "Extremo", regulation: "Garantir segurança" },
      { level: 7, label: "Pânico", valence: 1.0, arousal: 10.0, desc: "Onda avassaladora", examples: "Ataque", regulation: "Grounding" }
    ]
  },
  surpresa: {
    name: "Surpresa",
    icon: Zap,
    color: "from-cyan-400 via-sky-500 to-blue-500",
    valenceBase: 5.0,
    colorKey: 'surpresa',
    levels: [
      { level: 1, label: "Surpresa", valence: 5.0, arousal: 5.5, desc: "Reação instantânea", examples: "Inesperado", regulation: "Avaliar" },
      { level: 2, label: "Curiosidade", valence: 6.5, arousal: 6.0, desc: "Desejo de saber", examples: "Descoberta", regulation: "Explorar" },
      { level: 3, label: "Fascínio", valence: 7.0, arousal: 6.5, desc: "Atenção capturada", examples: "Impressionante", regulation: "Imersão" },
      { level: 4, label: "Admiração", valence: 7.5, arousal: 6.0, desc: "Algo grandioso", examples: "Arte", regulation: "Contemplação" },
      { level: 5, label: "Assombro", valence: 8.0, arousal: 7.0, desc: "Surpresa positiva", examples: "Transcendente", regulation: "Integração" },
      { level: 6, label: "Pasmo", valence: 5.0, arousal: 8.0, desc: "Evento chocante", examples: "Choque", regulation: "Processar" },
      { level: 7, label: "Espanto", valence: 5.0, arousal: 9.0, desc: "Reação máxima", examples: "Extraordinário", regulation: "Verificar" }
    ]
  },
  nojo: {
    name: "Nojo",
    icon: ThumbsDown,
    color: "from-lime-500 via-green-600 to-teal-700",
    valenceBase: 3.0,
    colorKey: 'nojo',
    levels: [
      { level: 1, label: "Desprezo", valence: 4.0, arousal: 4.5, desc: "Nojo social", examples: "Antiético", regulation: "Limites" },
      { level: 2, label: "Desgosto", valence: 3.5, arousal: 5.0, desc: "Ofende sentidos", examples: "Comida", regulation: "Afastamento" },
      { level: 3, label: "Repulsa", valence: 3.0, arousal: 6.5, desc: "Vontade forte", examples: "Contaminação", regulation: "Afastar" },
      { level: 4, label: "Indignação", valence: 2.5, arousal: 7.0, desc: "Nojo + raiva", examples: "Injustiça", regulation: "Ação" },
      { level: 5, label: "Aversão", valence: 2.0, arousal: 8.0, desc: "Nojo máximo", examples: "Náusea", regulation: "Remover" }
    ]
  }
};

export const EMOTION_INSIGHTS: Record<string, Record<number, { example: string; science: string; bodyChanges: string }>> = {
  alegria: {
    1: {
      example: "Pessoa se sente leve após terminar tarefa difícil. Respira fundo, pequeno sorriso. Continua atividades normalmente com leve contentamento.",
      science: "Dopamina (impulso de recompensa) moderada estimula núcleo accumbens. Córtex pré-frontal permanece ativo. Amígdala em nível basal. Cortisol (desliga o longo prazo) desce ligeiramente. Serotonina (segurança) aumenta moderadamente, permitindo pensamento claro e decisões sábias.",
      bodyChanges: "Relaxamento dos ombros, respiração mais lenta e profunda (suspiro de alívio). Tensão muscular se dissipa."
    },
    2: {
      example: "Pessoa sentada em um parque observando a natureza ou lendo um livro. Sente uma paz profunda e estável. Não há picos de excitação, apenas 'estar bem'.",
      science: "Atividade predominante do Sistema Nervoso Parassimpático. Níveis ótimos de GABA (calma) e Serotonina (segurança). Ocitocina levemente elevada promove sensação de conexão com o ambiente. Córtex pré-frontal regula emoções sem esforço. Baixo Cortisol.",
      bodyChanges: "Frequência cardíaca baixa e estável. Expressão facial suave. Relaxamento do maxilar e das mãos. Respiração rítmica abdominal."
    },
    3: {
      example: "Pessoa recebe ajuda inesperada de um amigo ou reflete sobre coisas boas da vida. Sente um calor no peito e vontade de retribuir.",
      science: "Ativação do Córtex Cingulado Anterior (processamento moral e social). Liberação de Ocitocina (confiança) combinada com Dopamina (recompensa social). O cérebro reforça laços sociais e comportamentos pró-sociais. Hipotálamo regula temperatura corporal criando sensação de 'calor'.",
      bodyChanges: "Sensação física de calor na região do peito. Sorriso espontâneo (ativação do músculo zigomático). Olhar brilhante e úmido."
    },
    4: {
      example: "Pessoa termina um projeto longo no trabalho. Olha para o resultado com orgulho. Sente-se competente e validada. A energia é alta mas controlada.",
      science: "Dopamina (recompensa por objetivo atingido) em níveis robustos. Serotonina (status e autoestima) elevada. O lobo pré-frontal dorsolateral está ativo, avaliando o sucesso. Testosterona pode ter leve aumento (sensação de poder/competência). Equilíbrio perfeito entre excitação e controle.",
      bodyChanges: "Postura ereta e expansiva (peito aberto). Energia física estável. Tom de voz firme e claro. Movimentos precisos."
    },
    5: {
      example: "Pessoa come seu prato favorito com muita fome, ou recebe uma massagem relaxante. 'Mmmm' sai involuntariamente. Foco total na sensação física.",
      science: "Liberação de Endorfinas (o anestésico natural) e Encefalinas. Pico agudo de Dopamina no Núcleo Accumbens. O córtex sensorial domina a atividade cerebral, enquanto o processamento abstrato diminui. O sistema de recompensa 'hot' está no comando.",
      bodyChanges: "Dilatação das pupilas. Salivação aumentada. Sensibilidade tátil aguçada. Relaxamento muscular profundo pós-tensão (derretimento)."
    },
    6: {
      example: "Músico durante um solo complexo ou atleta em desempenho máximo. Perde a noção do tempo e de si mesmo. Ação e consciência se fundem.",
      science: "Estado de 'Flow'. Hipofrontalidade Transiente (o córtex pré-frontal, o 'crítico interno', desliga temporariamente). Coquetel neuroquímico potente: Norepinefrina (foco) + Dopamina (engajamento) + Anandamida (bem-estar lateral) + Endorfina. O cérebro opera em eficiência máxima com baixo custo energético consciente.",
      bodyChanges: "Perda da consciência corporal (o corpo 'some'). Movimentos automáticos de altíssima precisão. Respiração sincronizada com a ação. Resistência à fadiga."
    },
    7: {
      example: "Homem em euforia sexual máxima. Golpista retira camisinha sem consentimento (stealthing). Homem nem percebe - está em transe neurobiológico. Semanas depois descobre IST. Consciência não participou da situação.",
      science: "Lobo pré-frontal completamente offline. Amígdala suprimida 100% - nenhum medo processado. Lobo temporal desativa - sem formação de memória clara do evento. Tálamo funciona apenas com sistema reptiliano de prazer. Corpo entra em estado de transe - pupilas muito dilatadas, resposta a dor reduzida, tempo parece surreal. Núcleo caudado (detecção de erros) desativa - pessoa não percebe comportamento anormal do outro. Cérebro não consegue processar ameaça biológica mesmo se evidência óbvia. Sistema de reward domina completamente a consciência.",
      bodyChanges: "Transe físico completo. Analgesia (não sente dor). Exaustão física mascarada pela Dopamina (impulso de recompensa). Perda total de coordenação motora fina."
    }
  },
  tristeza: {
     1: {
      example: "Pessoa não consegue cinema que planejava ir. Sente decepção por alguns minutos. Depois marca para próximo fim de semana e volta ao normal.",
      science: "Cortisol (desliga o longo prazo) sobe ligeiramente (30-50 pg/mL acima do basal). Amígdala ativa moderadamente. Lobo pré-frontal ainda consegue reframing cognitivo. Dopamina (impulso de recompensa) baixa levemente mas sistema de recompensa alternativo ainda acessível. Pessoa consegue pensar em soluções.",
      bodyChanges: "Suspiro profundo involuntário. Leve queda de energia. Ombros podem cair ligeiramente."
    },
    2: {
      example: "Pessoa descobriu que amigo disse coisa não verdadeira sobre ela. Sente magoada, fica quieta por um dia. Depois comunica o sentimento ao amigo e resolvem.",
      science: "Amígdala ativa mas lobo pré-frontal consegue intervir. Tálamo filtra estímulos para revisitar pensamento. Posterior cingulado (relacionamento social) ativa processando traição. Sem anedonia - pessoa ainda consegue comer, dormir, trabalhar normalmente. Reflexão emocional possível.",
      bodyChanges: "Sensação de aperto leve no peito. Diminuição da vontade de falar. Rosto com expressão neutra ou caída."
    },
    3: {
      example: "Pessoa perde contato com amiga querida (muda de cidade). Sente nostalgia profunda, ouça músicas tristes. Passa horas pensando em memórias. Dorme mais cedo por alguns dias.",
      science: "Lobo temporal medial hiperativado (memórias emotivas). Ínsula anterior processa dor emocional (ativa como dor física). Dorsal anterior cingulado registra perda. Sem motivação mas capacidade cognitiva preservada. Consegue trabalhar mas com esforço maior. Hormônios de apego (Ocitocina (confiança)) baixam.",
      bodyChanges: "Nó na garganta persistente. Olhos marejados. Sensação de frio. Cansaço que aparece mais cedo que o normal."
    },
    4: {
      example: "Pessoa sofre rejeição amorosa depois de relacionamento de meses. Sente dor emocional profunda. Para de comer normalmente, perde 2kg em semana. Chora sem razão clara em momentos aleatórios.",
      science: "Lobo pré-frontal medial desativa 50%. Amígdala hiperativada processando ameaça existencial (perda de reprodução). Hipocampo prejudicado - dificuldade de formar novas memórias, reviravolta de memórias antigas. Anedonia parcial - comida sem gosto, música sem prazer. Cortisol (desliga o longo prazo) 200+ pg/mL (2-3x acima do normal). Citocinas pró-inflamatórias aumentadas (IL-6, TNF-alpha) causando fadiga corporal.",
      bodyChanges: "Perda de apetite (vazio no estômago). Choro frequente. Dor física real no peito (coração partido). Distúrbios do sono."
    },
    5: {
      example: "Pessoa perde emprego de 10 anos. Sente sofrimento profundo, vê futuro como preto. Dorme 12h por dia. Não responde mensagens de amigos. Pensa frequentemente em morte como 'alívio'.",
      science: "Lobo pré-frontal ventromedial offline. Ínsula anterior em dor constante. Hipocampo atrofia por Cortisol (desliga o longo prazo) crônico. Serotonina (segurança) 40% abaixo do normal. Dopamina (impulso de recompensa) praticamente zero - anedonia total. Sem energia muscular - corpo pesado. Reflexo pupilar reduzido. Grelina (apetite) invertida - fome desaparece. Pensamentos ruminativos no córtex cingulado anterior - loop mental depressivo que não para.",
      bodyChanges: "Sensação de corpo extremamente pesado (chumbo). Letargia e lentidão motora. Olhar fixo e vazio. Dores musculares difusas."
    },
    6: {
      example: "Pessoa em depressão clínica profunda. Não consegue sair da cama por semanas. Negligencia higiene pessoal. Pensa em suicídio como 'solução lógica'. Família força internação psiquiátrica.",
      science: "Lobo pré-frontal completamente offline - sem capacidade de planejamento ou esperança. Amígdala hiperativa processando ameaça permanente. Hippocampo atrofiado - sem conseguir lembrar momentos bons. Tálamo malfunction - todos estímulos parecem ameaça. Tronco encefálico desativa sistemas de movimento (acinesia depressiva). Córtex motor primário não consegue ativar músculos. Glutamato (excitação) descontrola. GABA (calma) inexistente. Pessoa está em paralisia biológica completa apesar de corpo estar vivo.",
      bodyChanges: "Imobilidade quase total. Falta de higiene por incapacidade física. Fala lenta e monótona. Ausência total de libido e apetite."
    },
    7: {
      example: "Adolescente em desespero após separação dos pais. Vê suicídio como única saída do sofrimento. Escreve carta de despedida. Apenas intervenção de amigo salva vida.",
      science: "Cérebro em estado de falência neurobiológica. Lobo pré-frontal não existe funcionalmente. Amígdala em alarme permanente - corpo inteiro em mode 'morrer é mais fácil que viver'. Córtex insular (dor) em hiperativação constante - sofrimento é a única realidade neurológica. Ópioide endógeno (dinorfina) ao invés de Endorfina (o anestésico) - criar estado de dor pura. Neurotransmissor noradrenalina (alerta) desequilibrado - vigilância paranóica sem razão. Futuro neuralmente apagado - hipocampo não consegue projetar amanhã. Apenas dor presente existe. Cérebro conclui logicamente que morte = fim da dor = alívio. É lógica reptiliana pura.",
      bodyChanges: "Dor psíquica insuportável sentida no corpo todo. Agitação psicomotora ou catatonia. Sensação de sufocamento constante."
    }
  },
  raiva: {
    1: {
      example: "Pessoa é cortada de forma brusca na fila do banco. Sente incômodo, cruza os braços. Murmura reclamação baixo. Continua esperando normalmente após 2 minutos.",
      science: "Adrenalina (potência máxima) sobe ligeiramente (5-10%). Noradrenalina (alerta) estimula vigilância. Amígdala acende brevemente mas lobo pré-frontal inibe resposta. Testosterona (força) sobe minimamente. Frequência cardíaca sobe para 70-80 bpm. Sem vasoconstrição ainda. Pessoa consegue pensar e decidir melhor resposta.",
      bodyChanges: "Leve tensão na mandíbula. Foco visual aguçado. Cruzar de braços (postura defensiva)."
    },
    2: {
      example: "Motorista em trânsito comete erro. Pessoa buzina irritada, faz gesto de desaprovação. Reclama para passageiro. Depois esquece do incidente.",
      science: "Adrenalina (potência máxima) 20%. Lobo pré-frontal ancora resposta. Amígdala ativa mas contenção funciona. Testosterona (força) aumenta 15% - impulso de dominância mas controlado. Batimento cardíaco 85-95 bpm. Sem raiva, apenas irritação. Cérebro consegue contextualizar - 'foi um erro, não intencional'.",
      bodyChanges: "Calor súbito no rosto. Voz fica mais alta e rígida. Aceleração cardíaca perceptível."
    },
    3: {
      example: "Pessoa é desonrada publicamente em reunião. Sente ressentimento ardendo. Quer responder agressivamente mas se contém. Sai da sala com raiva contida, rumina por horas.",
      science: "Adrenalina (potência máxima) 40-50%. Noradrenalina (alerta) dispara atenção seletiva para ameaça. Testosterona (força) aumenta 30% - impulso de combate ativado. Lobo pré-frontal dorsolateral (controle executivo) ainda funciona 60%. Amígdala processa insulto como ameaça à status social. Batimento 100-110 bpm. Vasoconstrição periférica começa - sangue vai para músculos grandes. Pessoa reclama para outros, rumina (córtex cingulado anterior em loop).",
      bodyChanges: "Mãos fechadas em punho. Respiração curta e nasal. Tensão nos ombros e pescoço. Sensação de 'sangue quente'."
    },
    4: {
      example: "Chefe critica trabalho de pessoa de forma agressiva na frente de todos. Pessoa sente raiva genuína. Voz fica tensa, veia da testa saltada. Quer confrontar mas segura até final do dia. Vai para casa e bate em almofada.",
      science: "Adrenalina (potência máxima) 60-70%. Testosterona (força) sobe 50% - agressividade ativada. Noradrenalina (alerta) alta causa tunnel vision - foco só no insultante. Lobo pré-frontal reduz a 40% de função. Amígdala processa desonra como ameaça existencial à sobrevivência. Cortisol (desliga o longo prazo) sobe junto (stress + raiva). Vasoconstrição completa - rosto vermelho, veia saltada, respiração curta. Reflexo de Moro preparado. Pessoa consegue se conter mas com esforço enorme - 'estou segurando'.",
      bodyChanges: "Veias do pescoço/testa dilatadas. Rosto vermelho. Tremores nas mãos por adrenalina (potência máxima) contida. Olhar fixo (predatório)."
    },
    5: {
      example: "Pai vê filho apanhando na rua. Raiva explode. Corre para combater agressores. Bate sem pensar em consequências legais. Polícia precisa separar. Depois relata 'não sei o que me deu'.",
      science: "Adrenalina (potência máxima) máxima (190-200 ng/L). Testosterona (força) 70% acima do normal. Noradrenalina (alerta) causa hipervigilância paranóica. Lobo pré-frontal offline 80%. Tálamo envia informações direto para amígdala pulando consciência. Tronco encefálico (cérebro reptiliano) toma controle - COMBATER É IMPERATIVO. Ritmo cardíaco 140+ bpm. Força muscular aumenta 30% (Cortisol (desliga o longo prazo) + Adrenalina (potência máxima)). Visão em tunnel - só vê ameaça. Audição seletiva - só ouve ameaça. Dor somática não registra (analgesia de stress).",
      bodyChanges: "Analgesia (não sente dor se ferido). Força muscular ampliada. Visão de túnel. Hiperventilação."
    },
    6: {
      example: "Homem em briga de rua após ofensa à honra. Tira faca. Esfaqueia oponente múltiplas vezes. Depois de preso relata estar em transe total. Não recorda número exato de golpes.",
      science: "Lobo pré-frontal completamente offline. Amígdala em modo puramente survival. Cérebro reptiliano (tronco encefálico) controla todas ações. Tálamo malfunction - não filtra realidade. Testosterona (força) triplicada. Adrenalina (potência máxima) em nível de combate extremo. Pupila máxima dilatação. Respiração em hiperventilação. Força muscular aumenta 50%+ (Cortisol (desliga o longo prazo) + Testosterona (força) + Adrenalina (potência máxima)). Dor completamente suprimida - ferimentos não percebidos. Tempo parece distorcido - 10 segundos parecem horas. Memória fragmentada do evento. Pessoa age como máquina de combate, não como humano.",
      bodyChanges: "Coordenação motora focada apenas no ataque. Perda de audição periférica. Dilatação máxima das pupilas. O corpo age antes do pensamento."
    },
    7: {
      example: "Homem em briga de trânsito por vaga de estacionamento. Fúria máxima. Tira arma e atira no outro motorista. Mata alguém. Depois em delegacia, chora dizendo 'não sei como aconteceu'. Memória apagada.",
      science: "Cérebro em modo puramente reptiliano primitivo. Lobo pré-frontal não existe funcionalmente. Amígdala em alarm máximo - MORTE OU MORTE. Tálamo roto - realidade é apenas ameaça. Tronco encefálico (mesencéfalo) COMANDA tudo. Testosterona (força) máxima (similarmente a animal dominante em luta). Adrenalina (potência máxima) e noradrenalina (alerta) em pico absoluto. Córtex motor primário recebe order de ELIMINAR AMEAÇA. Consciência apareceu DEPOIS da ação não ANTES. Pessoa é espectador de suas próprias ações. Memória do evento é fragmentada/apagada porque lobo temporal não conseguiu codificar (amígdala hijacked o sistema de memória para apenas survival). Corpo em modo 'matar ou morrer' - realidade é que estacionamento é irrelevante, mas cérebro processou como ameaça mortal.",
      bodyChanges: "Dissociação completa (o corpo se move sozinho). Cegueira de raiva (red mist). Colapso físico após o evento devido à exaustão adrenal."
    }
  },
  medo: {
    1: {
      example: "Pessoa antes de apresentação em público sente nervosismo leve. Mãos tremem levemente. Respira fundo algumas vezes. Apresentação corre bem.",
      science: "Amígdala ativa moderadamente. Locus ceruleus libera noradrenalina (alerta). Lobo pré-frontal mantém controle 80%. Adrenalina (potência máxima) sobe 15-20%. Ritmo cardíaco 90-100 bpm. Pupilas levemente dilatadas. Sem vasoconstrição significativa. Pessoa consegue pensar claro e usar treino racional.",
      bodyChanges: "Frio na barriga (borboletas). Mãos levemente suadas. Boca seca. Inquietação nas pernas."
    },
    2: {
      example: "Pessoa em exame médico aguardando resultado. Sente insegurança sobre saúde. Piora sono uma noite. Resultado é normal, alívio imediato.",
      science: "Amígdala processando ameaça incerta. Anterior cingulado (avaliação de risco) ativa. Lobo pré-frontal funciona 70%. Cortisol (desliga o longo prazo) sobe moderadamente. Noradrenalina (alerta) causa vigilância sem mobilização total. Batimento 95-105 bpm. Pensamento ruminativo mas controlável. Oxígeno para músculos grandes aumenta mas sem tremores.",
      bodyChanges: "Tensão muscular nos ombros. Dificuldade para relaxar. Estado de alerta constante."
    },
    3: {
      example: "Pessoa em entrevista de emprego crucial. Preocupação clara - suda levemente, voz trêmula. Consegue responder mas com dificuldade. Sente alívio quando acaba.",
      science: "Amígdala em alerta claro. Tálamo filtra estímulos mas tenuamente. Lobo pré-frontal reduzido a 60%. Hipocampo tenta acessar memória mas com dificuldade (stress bloqueia acesso). Ritmo cardíaco 110-120 bpm. Suor nas mãos (glândulas sudoríparas ativas). Adrenalina (potência máxima) 30-40%. Sem paralisia ainda - movimento possível mas em câmera lenta subjetiva.",
      bodyChanges: "Voz trêmula ou falhando. Sudorese visível. Necessidade de usar o banheiro (urgência urinária). Estômago embrulhado."
    },
    4: {
      example: "Pessoa tem sintomas físicos estranhos. Sente que pode estar com doença séria. Pesquisa obsessivamente na internet. Avalia ir ao pronto-socorro. Angústia constante por dias.",
      science: "Amígdala hiperativa processando ameaça existencial (morte possível). Tálamo malfunction - todos sinais corporais parecem ameaça. Insula anterior (corpo awareness) hiperativada - hipersensível a qualquer sensação. Lobo pré-frontal offline 50%. Córtex cingulado anterior ruminando. Batimento 120-130 bpm constante. Adrenalina (potência máxima) 50-60%. Mãos tremem notavelmente. Respiração curta e superficial. Insônia por preocupação. Sem conseguir congelar ou fugir - apenas vigilância paranóica.",
      bodyChanges: "Hipervigilância corporal (sente cada batida do coração). Respiração curta e torácica. Tremores finos nas extremidades."
    },
    5: {
      example: "Pessoa em situação de risco real (assaltante armado aproximando). Medo puro dispara. Tenta correr mas pernas não obedecem bem. Grita pedindo ajuda com voz aguda.",
      science: "Amígdala em modo de threat máximo. Tálamo envia info direto para amígdala pulando consciência - DANGER DETECTED. Locus ceruleus dispara noradrenalina (alerta) máxima. Adrenalina (potência máxima) 80-90%. Ritmo cardíaco 140-160 bpm. Respiração acelerada (hiperventilação). Vasoconstrição completa - mãos pálidas, tremem descontroladamente. Tronco encefálico prepara resposta 'fuga'. Pernas querem correr mas decisão está prejudicada. Visão em tunnel - só vê ameaça. Audição seletiva - só ouve som de arma acima de tudo.",
      bodyChanges: "Palidez intensa (o sangue foge da pele). Joelhos fracos ('pernas bambas'). Coração 'saindo pela boca'. Grito agudo involuntário."
    },
    6: {
      example: "Pessoa em sequestro com arma apontada para cabeça. Terror máximo. Começa a chorar incontrolavelmente. Corpo paralisa completamente (freeze response). Nem consegue responder perguntas do criminoso.",
      science: "Amígdala 100% ativada - MORTE IMINENTE. Tálamo offline. Tronco encefálico ativa resposta 'congelamento' (dorsal vagal shutdown). Córtex motor superior inibe movimento - paralisia defensiva de opossum. Vaguês (nervo vagal) causa bradcardia (coração desacelera paradoxalmente). Diafragma congela - dificuldade respiratória. Esfíncter anal pode relaxar (medo extremo causa incontinência). Pupila máxima dilatação depois contrai (colapso pupilar). Adrenalina (potência máxima) tão alta que corpo desliga em resposta (sobrecarga). Consciência em dissociação - pessoa vê evento de fora do corpo. Memória do trauma não se codifica normalmente (hipocampo offline).",
      bodyChanges: "Paralisia total (impossibilidade de mover). Choro silencioso. Incontinência urinária ou fecal. Sensação de desmaio iminente."
    },
    7: {
      example: "Criança vê carro vindo em alta velocidade durante brincadeira. Pânico absoluto. Corpo congela completamente na rua. Não consegue correr nem gritar. Atropelamento ocorre.",
      science: "Pânico neural completo. Amígdala operando em modo 'aniquilação'. Dorsal anterior cingulado processa que morte é certa. Tronco encefálico ativa shutdown vagal completo - JOGO MORTO. Vaguês causa colapso cardiocirculatório. Batimento cardíaco cai para 40-50 bpm enquanto Adrenalina (potência máxima) está no máximo (paradoxo fisiológico). Respiração para quase completamente. Músculos em rigidez total (catalepsia). Cérebro humano deixou de existir - apenas sobrevivência primitiva importa. Corpo escolheu 'congelar' como última defesa. Percepção consciente já apagou. Pessoa em dissociação profunda não sente o atropelamento. Trauma neurobiológico permanente - TEPT garantido se sobreviver.",
      bodyChanges: "Rigidez cadavérica (catalepsia). Parada respiratória temporária. Dissociação completa (sair do corpo). Colapso vagal (desmaio)."
    }
  },
  surpresa: {
    1: {
      example: "Pessoa recebe ligação de amiga inesperada. Surpreendida positivamente. 'Ah! Oi!' diz com entonação diferente. Conversa animada e agradável.",
      science: "Núcleo dorsal da rafe (detecção de novidade) ativa brevemente. Dopamina (impulso de recompensa) sobe em pico curto. Adrenalina (potência máxima) 5-10%. Amígdala nota novidade mas reconhece segurança (amiga conhecida). Pupilas levemente dilatadas. Sem medo. Atenção focada em novi expectativa interessante.",
      bodyChanges: "Elevação súbita das sobrancelhas. Pequena inalação de ar. Dilatação leve das pupilas."
    },
    2: {
      example: "Pessoa ganha prêmio inesperado na loteria (valor pequeno). Eyes wide, 'Não acredito!'. Verifica tíquete múltiplas vezes. Sorri durante horas.",
      science: "Pico de Dopamina (impulso de recompensa) (recompensa inesperada processada como maior que esperado). Noradrenalina (alerta) causa hyper-focus em premio. Lobo pré-frontal ativa para verificação racional. Sem threat detectado. Endorfinas (o anestésico) aumentam (bom sentimento inesperado). Ritmo cardíaco 95-105 bpm. Sistema de reward dominado (positive surprise).",
      bodyChanges: "Boca aberta (queixo cai levemente). Olhos arregalados. Mãos levadas ao rosto ou peito."
    },
    3: {
      example: "Pessoa vira esquina e amigo secreto surge para festa surpresa. Genuíno surpreendimento. 'Meu Deus!' grita. Abraços com lágrimas. Emoção positiva misturada com shock.",
      science: "Amígdala detecta ameaça brevemente (aparição súbita). Imediatamente reconhece segurança (amigos queridos). Contraste cria surpreendimento máximo positivo. Dopamina (impulso de recompensa) massiva por recompensa social inesperada. Oxitocina (confiança) sobe. Insula anterior processa emoção intensa. Sem medo residual. Puro alegria surpreendida.",
      bodyChanges: "Pulo para trás (reflexo inicial) seguido de relaxamento. Taquicardia momentânea. Risada nervosa de alívio."
    },
    4: {
      example: "Pessoa em carro recebe mensagem: 'Parabéns, você foi aprovado no mestrado!'. Reação de surpreendimento intenso. Tira carro da estrada para processar. Chora de alegria.",
      science: "Recompensa inesperada maior = dopamina (impulso de recompensa) explosiva. Amígdala estava pronta para rejeição, recebe aprovação. Contraste neurológico massivo. Lobo pré-frontal medial processa significado de vida. Tálamo em overdrive de processamento. Insula em feedback interoceptivo intenso - corpo sente a notícia. Adrenalina (potência máxima) 30-40%. Sem possibilidade de pensar racionalmente nos minutos iniciais - apenas shock e alegria. Sistema nervoso tem difficulty stabilizing para dirigir.",
      bodyChanges: "Tremores de excitação. Choro convulsivo de alegria. Necessidade de sentar (fraqueza nas pernas)."
    },
    5: {
      example: "Carro freia bruscamente sem avisar na frente de pessoa (near-miss accident). Reflexo de Moro dispara - braços se flexionam. Grita involuntariamente. Coração acelerado por minutos.",
      science: "Amígdala detecta THREAT iminente. Tálamo envia info direto para amígdala antes de consciência perceber. Locus ceruleus dispara noradrenalina (alerta) máxima em <200ms. Reflexo de Moro (startle ancestral) dispara braços e pernas. Adrenalina (potência máxima) 60-70%. Ritmo cardíaco salta de 70 para 130+ em segundos. Respiração trava momentaneamente (startle inibe respiração). Pessoa grita involuntariamente. Vigilância total por 2-3 minutos enquanto amígdala verifica se death ocorreu.",
      bodyChanges: "Reflexo de Moro (braços se abrem ou protegem o rosto). Contração muscular total súbita. Gasp (inalação ruidosa)."
    },
    6: {
      example: "Pessoa ouve gunshot muito perto (estouro acidental). Choque neurológico completo. Grita involuntariamente. Congelamento momentâneo. Procura abrigo desesperadamente. Tremendo por horas.",
      science: "Ameaça de morte detectada. Amígdala em pânico. Tronco encefálico prepara resposta. Tálamo malfunction - som extremo desativa processamento normal. Adrenalina (potência máxima) máxima (160+ ng/L). Noradrenalina (alerta) causa hypervigilância paranóica. Reflexo de Moro em versão completa - corpo inteiro em defensive posture. Dorsal anterior cingulado processa 'death possibility'. Dissociação parcial. Memória do evento fragmentada devido trauma agudo. TEPT potencial. Tremores involuntários por horas (sistema nervoso simpático não consegue desligar).",
      bodyChanges: "Tremores incontroláveis pós-choque. Sensação de frio intenso. Náusea. Atordoamento (tontura)."
    },
    7: {
      example: "Pessoa presencia cena de sangue/morte inesperada (acidente grave). Shock neurobiológico absoluto. Corpo congela. Não consegue se mover por minutos. Depois amnésia parcial do evento. Trauma permanente.",
      science: "Morte inesperada observada = overload existencial. Amígdala em failure mode - NÃO HÁ RESPOSTA ADEQUADA. Tálamo desativa processamento (realidade too much). Lobo temporal (memória) não consegue codificar - trauma bloqueia memória. Tronco encefálico em shutdown total. Dorsal vagal domina - corpo em paralisia total. Ritmo cardíaco pode cair para 40bpm (colapso vagal paradoxal). Respiração pratica para. Dissociação profunda - consciência 'sai' do corpo. Sobrevivente relata 'não era real, era como filme'. TEPT garantido. Memória pode ser apagada permanentemente ou retornar em flashbacks intrusivos. Cérebro entrou em 'não há resposta', então apaga a realidade temporariamente.",
      bodyChanges: "Congelamento total. Palidez mortal. Queda da pressão arterial (desmaio). Vazio no estômago extremo."
    }
  },
  nojo: {
    1: {
      example: "Pessoa prova comida vencida por acidente. Faz careta. Cuspiu na pia. Enxaguou boca. Desconforto passa em minutos.",
      science: "Ínsula anterior detecta flavor perigoso (rancidez = contaminação potencial). Ativação leve de nojo visceral. Amígdala reconhece 'poison possibility'. Reflexo de vômito é preparado mas controlado. Sem mobilização ampla de defesa. Pessoa consegue 'resolve' cognitivamente - 'achava vencido'.",
      bodyChanges: "Careta involuntária (nariz franzido). Leve arrepio. Salivação aumenta (preparo para expelir)."
    },
    2: {
      example: "Pessoa vê inseto morto apodrecendo. Desgosto claro. 'Que nojo'. Vira a cabeça, respira pela boca. Pede alguém limpar.",
      science: "Ínsula em nojo moderado. Resposta de contaminação biológica detectada. Amígdala ativa gate-keeper de defesa. Facial expression de nojo involuntária (nariz enrugado, boca para cima). Gaguez olfativa (respira boca para evitar cheiro). Nejo moral/físico misturados (morte = contaminação). Sem grande mobilização mas clara rejeição.",
      bodyChanges: "Desvio do olhar e da cabeça. Respiração pela boca (para evitar cheiro). Contração leve do estômago."
    },
    3: {
      example: "Pessoa tem que limpar vômito ou fezes acidentalmente. Repulsa clara. Respira como boca, sente gag reflex. Consegue fazer trabalho mas com desconforto notável.",
      science: "Ínsula em pico de nojo. Contaminação biológica máxima (human waste). Amígdala processa como biohazard extremo. Vaguês causa gag reflex preparado. Batimento cardíaco sobe (stress). Parassimpático prepara próprio vômito de defesa. Sem perda de consciência mas clara mobilização de defesa biológica.",
      bodyChanges: "Reflexo de vômito (ânsia). Arrepios na espinha. Mãos instintivamente se afastam do corpo."
    },
    4: {
      example: "Pessoa descobre infidelidade do parceiro. Sente nojo visceral do parceiro. 'Deixe de me tocar'. Vômito. Não consegue estar no mesmo cômodo. Começam processo separação.",
      science: "Nojo moral (traição) se torna nojo visceral (pessoa física agora é 'contaminada'). Ínsula em conexão social hiperativada. Insula anterior conecta a representação neural do parceiro com contaminação. Amígdala processa 'intimate threat'. Vaguês causa vômito real. Oxitocina (confiança) é substituída por repúdio. Pessoa não consegue touch física porque cérebro literalmente registra parceiro como biological threat agora.",
      bodyChanges: "Sensação física de sujeira na pele. Náusea real. Repulsa ao toque. Tensão abdominal."
    },
    5: {
      example: "Durante um jantar, pessoa encontra um inseto grande no meio da comida após ter comido metade. O choque é imediato. Corre para o banheiro para vomitar tudo. Sente-se 'contaminada' por dentro, escova os dentes 5 vezes seguidas e não consegue comer nada sólido até o dia seguinte.",
      science: "Ínsula anterior dispara alarme máximo de contaminação interna. O sistema imune comportamental é ativado em overdrive para expulsar patógenos. A amígdala marca a experiência como trauma sensorial (aversão aprendida de sabor). O córtex motor prepara expulsão gástrica imediata e prolongada.",
      bodyChanges: "Contrações estomacais violentas. Salivação excessiva. Arrepios intensos e generalizados. Sensação fantasma de algo na garganta ou boca."
    },
    6: {
      example: "Pai descobre que filha foi estuprada. Nojo extremo do estuprador surge instantaneamente. Fantasias de matar. Traz arma para tribunal. Necessário prenção para prevenir homicídio.",
      science: "Nojo moral + contaminação sexual + ameaça ao lineage = storm neurobiológica. Ínsula em activation máxima direcionada a estuprador. Amígdala processa estuprador como 'must be eliminated' (threat to gene pool). Testosterona (força) + agressão surge como resposta de proteção paternal. Lobo pré-frontal tenta controlar mas nojo está primordial. Instinto reptiliano: contaminação = matar fonte. Pai literalmente traz arma porque córtex não consegue lutar contra instinto de aniquilar 'contamination source'. Consciência diz 'crime', instinto diz 'matar'.",
      bodyChanges: "Mistura de náusea extrema com adrenalina de raiva. Calor intenso. Visão turva. Corpo treme de repulsa."
    },
    7: {
      example: "Pessoa vê criança sendo abusada. Nojo absoluto inunda. Violência instintiva dispara. Mata abusador à bater na frente de polícia. Aceita morte. 'Mereceu'.",
      science: "Nojo neurobiológico em threshold absoluto. Não é emoção - é programa de defesa ancestral 'ELIMINATE CONTAMINATION'. Ínsula inteira em sobrecarga. Lobo pré-frontal completamente offline. Sistema de reward se reinicia para valorizar matar (ao invés de viver). Testosterona (força) máxima (protetor paternal). Amígdala processa abusador como 'não-humano, contamination''. Núcleos basais (ação automática) dispara 'matar'. Pessoa é espectador de suas próprias ações. Bate até morte sem parar porque instinto está 'roaring'. Consciência aparece DEPOIS. Pessoa depois diz 'merecia, faria dnovo'. Nojo transformou pessoa em ferramenta de eliminação biológica. Cérebro reptiliano = máquina de matar para proteger espécie.",
      bodyChanges: "Vômito violento. Dissociação da realidade. Força física anormal (movida por repulsa absoluta). Perda total de inibição social."
    }
  }
};