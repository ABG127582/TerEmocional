import { Smile, Frown, Flame, AlertCircle, Zap, ThumbsDown, Glasses, Filter, Scale, Anchor, HeartHandshake, Droplets, Heart } from 'lucide-react';
import { EmotionScale, NeuroInfo } from './types';

// ... (emotionColors, somaticSensations, cognitiveDistortions, NEURO_DATA mantidos iguais, apenas EMOTION_INSIGHTS muda drasticamente)

export const emotionColors: Record<string, { light: string; main: string; dark: string; glow: string; chart: string }> = {
  alegria: { light: '#FBBF24', main: '#F59E0B', dark: '#D97706', glow: 'rgba(245, 158, 11, 0.3)', chart: '#FBBF24' },
  tristeza: { light: '#93C5FD', main: '#60A5FA', dark: '#3B82F6', glow: 'rgba(96, 165, 250, 0.3)', chart: '#60A5FA' },
  raiva: { light: '#FCA5A5', main: '#F87171', dark: '#DC2626', glow: 'rgba(248, 113, 113, 0.3)', chart: '#F87171' },
  medo: { light: '#D8B4FE', main: '#A78BFA', dark: '#7C3AED', glow: 'rgba(167, 139, 250, 0.3)', chart: '#A78BFA' },
  surpresa: { light: '#A5F3FC', main: '#06B6D4', dark: '#0891B2', glow: 'rgba(6, 182, 212, 0.3)', chart: '#06B6D4' },
  nojo: { light: '#86EFAC', main: '#34D399', dark: '#10B981', glow: 'rgba(52, 211, 153, 0.3)', chart: '#34D399' },
  amor: { light: '#F472B6', main: '#EC4899', dark: '#BE185D', glow: 'rgba(236, 72, 153, 0.3)', chart: '#EC4899' }
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
      { name: "Dopamina", color: "#FBBF24", description: "Impulso de recompensa", decayProfile: { peakTime: 10, decayRate: 1.5 } },
      { name: "Endorfina", color: "#EC4899", description: "O anestésico", decayProfile: { peakTime: 15, decayRate: 1.0 } },
      { name: "Serotonina", color: "#34D399", description: "Segurança/Humor", decayProfile: { peakTime: 45, decayRate: 0.2 } }
    ]
  },
  tristeza: {
    description: "Baixa atividade de neurotransmissores excitatórios e aumento leve de cortisol.",
    recoveryEstimate: "4h - 24h+ (Metabolização lenta)",
    hormones: [
      { name: "Cortisol", color: "#60A5FA", description: "Desliga o longo prazo", decayProfile: { peakTime: 60, decayRate: 0.3 } },
      { name: "Prolactina", color: "#818CF8", description: "Saciedade", decayProfile: { peakTime: 30, decayRate: 0.6 } }
    ]
  },
  raiva: {
    description: "Resposta 'Lutar', alta energia e mobilização muscular.",
    recoveryEstimate: "40min - 2h (Para metabolizar adrenalina)",
    hormones: [
      { name: "Adrenalina", color: "#EF4444", description: "Potência máxima", decayProfile: { peakTime: 5, decayRate: 1.5 } },
      { name: "Noradrenalina", color: "#F97316", description: "Alerta", decayProfile: { peakTime: 10, decayRate: 0.9 } },
      { name: "Testosterona", color: "#D97706", description: "Força", decayProfile: { peakTime: 20, decayRate: 0.4 } }
    ]
  },
  medo: {
    description: "Resposta 'Fugir ou Congelar' do eixo HPA.",
    recoveryEstimate: "1h - 3h (Cortisol residual pode durar mais)",
    hormones: [
      { name: "Adrenalina", color: "#D946EF", description: "Potência máxima", decayProfile: { peakTime: 2, decayRate: 2.0 } },
      { name: "Cortisol", color: "#8B5CF6", description: "Desliga o longo prazo", decayProfile: { peakTime: 20, decayRate: 0.4 } }
    ]
  },
  surpresa: {
    description: "Sobressalto neural para focar atenção em novo estímulo.",
    recoveryEstimate: "15min - 45min (Rápida habituação)",
    hormones: [
      { name: "Adrenalina", color: "#06B6D4", description: "Potência máxima", decayProfile: { peakTime: 1, decayRate: 2.5 } }
    ]
  },
  nojo: {
    description: "Ativação da ínsula e resposta visceral de rejeição.",
    recoveryEstimate: "20min - 1h (Depende da remoção do estímulo)",
    hormones: [
      { name: "Resposta Vagal", color: "#10B981", description: "Náusea/Rejeição", decayProfile: { peakTime: 5, decayRate: 1.0 } }
    ]
  },
  amor: {
    description: "Ativação do sistema de apego, cuidado e recompensa social (Córtex Orbitofrontal).",
    recoveryEstimate: "30min - 2h (Efeito 'Afterglow' da Ocitocina)",
    hormones: [
      { name: "Ocitocina", color: "#EC4899", description: "Vínculo/Confiança", decayProfile: { peakTime: 20, decayRate: 0.5 } },
      { name: "Dopamina", color: "#FBBF24", description: "Desejo/Foco", decayProfile: { peakTime: 10, decayRate: 1.2 } },
      { name: "Vasopressina", color: "#06B6D4", description: "Proteção/Memória", decayProfile: { peakTime: 30, decayRate: 0.3 } }
    ]
  }
};

export const emotionalScales: Record<string, EmotionScale> = {
  alegria: {
    name: "Alegria",
    emoji: "😄",
    icon: Smile,
    color: "from-yellow-400 via-lime-500 to-emerald-500",
    valenceBase: 7.5,
    colorKey: 'alegria',
    levels: [
      { 
        level: 1, label: "Alívio", valence: 6.5, arousal: 3.0, desc: "Sensação de 'ufa!'", examples: "Terminar prova", regulation: "Saborear", feedback: "Respire fundo e aproveite esse momento de pausa. Seu corpo agradece o descanso.",
        practice: {
          title: "Saboreando o Alívio",
          description: "Amplifique a sensação de que o 'perigo' ou 'esforço' passou.",
          type: "text",
          content: [
            "Pare por um momento. Solte os ombros.",
            "Diga para si mesmo: 'Acabou. Eu consegui.'",
            "Sinta onde no seu corpo o relaxamento começa (ombros, mandíbula, mãos).",
            "Fique com essa sensação por 30 segundos, sem correr para a próxima tarefa.",
            "Esse é o momento de recarregar."
          ]
        }
      },
      { level: 2, label: "Serenidade", valence: 7.0, arousal: 2.0, desc: "Paz interior", examples: "Meditação", regulation: "Manter", feedback: "Aproveite a calma.", practice: { title: "Apreciação", description: "Foque no momento presente.", type: "text", content: ["Respire suavemente."] } },
      { level: 3, label: "Alegria", valence: 8.0, arousal: 5.0, desc: "Felicidade leve", examples: "Encontrar amigo", regulation: "Compartilhar", feedback: "Sorria e expresse sua alegria.", practice: { title: "Expressão", description: "Mostre sua alegria.", type: "text", content: ["Sorria para alguém."] } },
      { level: 4, label: "Animação", valence: 8.5, arousal: 7.0, desc: "Energia positiva", examples: "Boa notícia", regulation: "Canalizar", feedback: "Use essa energia para algo produtivo.", practice: { title: "Ação Positiva", description: "Faça algo que gosta.", type: "text", content: ["Dance ou cante."] } },
      { level: 5, label: "Entusiasmo", valence: 9.0, arousal: 8.0, desc: "Vontade de agir", examples: "Novo projeto", regulation: "Focar", feedback: "Aproveite a motivação.", practice: { title: "Planejamento", description: "Organize suas ideias.", type: "text", content: ["Escreva seus planos."] } },
      { level: 6, label: "Êxtase", valence: 9.5, arousal: 9.0, desc: "Felicidade intensa", examples: "Grande vitória", regulation: "Celebrar", feedback: "Comemore suas conquistas.", practice: { title: "Celebração", description: "Compartilhe a vitória.", type: "text", content: ["Comemore com amigos."] } },
      { 
        level: 7, label: "Euforia", valence: 9.5, arousal: 9.5, desc: "Pico máximo", examples: "Grande conquista", regulation: "Aterrar", feedback: "Aproveite a energia, mas evite prometer coisas ou tomar decisões financeiras que não pode cumprir amanhã.",
        practice: {
          title: "Aterramento na Euforia",
          description: "Mantenha os pés no chão enquanto a cabeça voa.",
          type: "text",
          content: [
            "A euforia é deliciosa, mas pode nos cegar para riscos.",
            "Sinta seus pés firmes no chão.",
            "Celebre muito, grite se quiser!",
            "REGRA DE OURO: Não faça promessas financeiras ou de longo prazo nas próximas 24h.",
            "Apenas curta o momento presente sem comprometer o futuro."
          ]
        }
      }
    ]
  },
  tristeza: {
    name: "Tristeza",
    emoji: "😢",
    icon: Frown,
    color: "from-sky-400 via-blue-500 to-indigo-600",
    valenceBase: 3.0,
    colorKey: 'tristeza',
    levels: [
      { 
        level: 1, label: "Desapontamento", valence: 4.0, arousal: 3.5, desc: "Expectativas não atendidas", examples: "Plano cancelado", regulation: "Reestruturação", feedback: "É normal se frustrar. Ajuste a expectativa e tente focar no que ainda está sob seu controle.",
        practice: { title: "Ajuste de Rota", description: "Cognição para lidar com quebra de expectativas.", type: "text", content: ["Qual era a expectativa?", "Qual a realidade?", "O que ainda é possível fazer hoje com o que sobrou?"] }
      },
      { level: 2, label: "Chateação", valence: 3.5, arousal: 4.0, desc: "Incômodo leve", examples: "Pequena perda", regulation: "Aceitação", feedback: "Permita-se sentir.", practice: { title: "Validação", description: "Reconheça o sentimento.", type: "text", content: ["Diga: 'Tudo bem estar chateado'."] } },
      { level: 3, label: "Tristeza", valence: 3.0, arousal: 3.0, desc: "Dor emocional", examples: "Fim de ciclo", regulation: "Acolhimento", feedback: "Seja gentil consigo mesmo.", practice: { title: "Autocompaixão", description: "Trate-se com carinho.", type: "text", content: ["Abrace a si mesmo."] } },
      { level: 4, label: "Angústia", valence: 2.5, arousal: 6.0, desc: "Aperto no peito", examples: "Incerteza", regulation: "Expressão", feedback: "Fale sobre o que sente.", practice: { title: "Desabafo", description: "Coloque para fora.", type: "text", content: ["Escreva ou fale com alguém."] } },
      { level: 5, label: "Melancolia", valence: 2.0, arousal: 2.0, desc: "Tristeza profunda e reflexiva", examples: "Luto", regulation: "Contemplação", feedback: "Dê tempo ao tempo.", practice: { title: "Reflexão", description: "Pense sobre o significado.", type: "text", content: ["Medite sobre a perda."] } },
      { level: 6, label: "Desolação", valence: 1.5, arousal: 4.0, desc: "Sensação de vazio", examples: "Grande perda", regulation: "Busca de Apoio", feedback: "Não fique sozinho.", practice: { title: "Conexão", description: "Procure ajuda.", type: "text", content: ["Ligue para um amigo."] } },
      { 
        level: 7, label: "Desespero", valence: 1.0, arousal: 5.5, desc: "Sem esperança", examples: "Depressão", regulation: "Mergulho Simulado", feedback: "Sua mente pode estar mentindo sobre o futuro agora. Por favor, contate alguém da sua rede de apoio.",
        practice: { title: "Mergulho Simulado (Reflexo de Mergulho)", description: "Técnica TIPP da DBT para baixar a frequência cardíaca instantaneamente.", type: "text", content: ["ATENÇÃO: Use se estiver em crise extrema.", "Pegue uma bacia com água gelada (ou bolsa de gelo).", "Prenda a respiração e mergulhe o rosto.", "Segure por 30 segundos."] }
      }
    ]
  },
  raiva: {
    name: "Raiva", emoji: "😡", icon: Flame, color: "from-amber-500 via-red-600 to-rose-700", valenceBase: 3.0, colorKey: 'raiva',
    levels: [
        { level: 1, label: "Aversão", valence: 4.5, arousal: 4.0, desc: "Repulsa leve", examples: "Inconveniente", regulation: "Foco", feedback: "Escolha onde focar.", practice: { title: "Mudança de Foco", description: "Redirecione.", type: "text", content: ["Isso merece sua energia?"] } },
        { level: 2, label: "Irritação", valence: 4.0, arousal: 5.0, desc: "Incômodo persistente", examples: "Barulho", regulation: "Pausa", feedback: "Respire antes de reagir.", practice: { title: "Respiração", description: "Acalme o corpo.", type: "text", content: ["Conte até 10."] } },
        { level: 3, label: "Frustração", valence: 3.5, arousal: 6.0, desc: "Obstáculo", examples: "Falha", regulation: "Reavaliação", feedback: "Tente outra abordagem.", practice: { title: "Nova Perspectiva", description: "Mude o ângulo.", type: "text", content: ["O que posso aprender?"] } },
        { level: 4, label: "Raiva", valence: 3.0, arousal: 7.0, desc: "Sentimento de injustiça", examples: "Ofensa", regulation: "Assertividade", feedback: "Expresse-se com clareza.", practice: { title: "Comunicação", description: "Fale sem agredir.", type: "text", content: ["Use 'Eu sinto...'"] } },
        { level: 5, label: "Indignação", valence: 2.5, arousal: 8.0, desc: "Revolta moral", examples: "Injustiça", regulation: "Ação Construtiva", feedback: "Use a raiva para o bem.", practice: { title: "Canalização", description: "Transforme em ação.", type: "text", content: ["Defenda uma causa."] } },
        { level: 6, label: "Ira", valence: 2.0, arousal: 9.0, desc: "Raiva intensa", examples: "Traição", regulation: "Afastamento", feedback: "Saia da situação.", practice: { title: "Distanciamento", description: "Proteja-se.", type: "text", content: ["Vá dar uma volta."] } },
        { level: 7, label: "Fúria", valence: 1.5, arousal: 9.5, desc: "Explosão", examples: "Agressividade", regulation: "Gelo", feedback: "PERIGO: Julgamento comprometido.", practice: { title: "Choque Térmico (Gelo)", description: "Interrompa o sequestro.", type: "text", content: ["Segure gelo na mão fechada."] } }
    ]
  },
  medo: {
    name: "Medo", emoji: "😨", icon: AlertCircle, color: "from-fuchsia-500 via-purple-600 to-violet-800", valenceBase: 3.0, colorKey: 'medo',
    levels: [
        { level: 1, label: "Nervosismo", valence: 4.5, arousal: 5.0, desc: "Agitação pré-evento", examples: "Apresentação", regulation: "Postura", feedback: "Use a energia.", practice: { title: "Postura de Poder", description: "Amy Cuddy.", type: "text", content: ["Peito aberto por 2 min."] } },
        { level: 2, label: "Insegurança", valence: 4.0, arousal: 5.5, desc: "Dúvida", examples: "Novo desafio", regulation: "Preparação", feedback: "Confie no seu preparo.", practice: { title: "Revisão", description: "Lembre-se do que sabe.", type: "text", content: ["Liste suas forças."] } },
        { level: 3, label: "Ansiedade", valence: 3.5, arousal: 6.5, desc: "Preocupação futura", examples: "Prova", regulation: "Aterramento", feedback: "Volte ao presente.", practice: { title: "Foco no Agora", description: "Sinta o ambiente.", type: "text", content: ["Nomeie 5 coisas que vê."] } },
        { level: 4, label: "Medo", valence: 3.0, arousal: 7.5, desc: "Ameaça percebida", examples: "Perigo", regulation: "Avaliação", feedback: "O perigo é real?", practice: { title: "Teste de Realidade", description: "Analise os fatos.", type: "text", content: ["Quais são as evidências?"] } },
        { level: 5, label: "Temor", valence: 2.5, arousal: 8.5, desc: "Ameaça iminente", examples: "Risco alto", regulation: "Proteção", feedback: "Busque segurança.", practice: { title: "Plano de Ação", description: "Saiba o que fazer.", type: "text", content: ["Crie uma rota de fuga."] } },
        { level: 6, label: "Pavor", valence: 2.0, arousal: 9.5, desc: "Medo extremo", examples: "Fobia", regulation: "Respiração", feedback: "Acalme o sistema nervoso.", practice: { title: "Respiração 4-7-8", description: "Controle a respiração.", type: "text", content: ["Inspire 4, segure 7, expire 8."] } },
        { level: 7, label: "Pânico", valence: 1.0, arousal: 10.0, desc: "Onda avassaladora", examples: "Ataque", regulation: "Grounding Físico", feedback: "Vai passar.", practice: { title: "Ancoragem Física", description: "Sobreviva à onda.", type: "text", content: ["Sentar no chão."] } }
    ]
  },
  surpresa: {
    name: "Surpresa", emoji: "😲", icon: Zap, color: "from-cyan-400 via-sky-500 to-blue-500", valenceBase: 5.0, colorKey: 'surpresa',
    levels: [
        { level: 1, label: "Surpresa", valence: 5.0, arousal: 5.5, desc: "Reação instantânea", examples: "Inesperado", regulation: "Pausa", practice: { title: "Micro-Pausa", description: "Evite reação.", type: "text", content: ["Pare. Respire."] } },
        { level: 2, label: "Curiosidade", valence: 6.0, arousal: 6.0, desc: "Interesse", examples: "Novidade", regulation: "Exploração", practice: { title: "Investigação", description: "Faça perguntas.", type: "text", content: ["O que é isso?"] } },
        { level: 3, label: "Fascínio", valence: 7.0, arousal: 6.5, desc: "Atenção cativada", examples: "Arte", regulation: "Apreciação", practice: { title: "Contemplação", description: "Observe os detalhes.", type: "text", content: ["Foque nas cores e formas."] } },
        { level: 4, label: "Assombro", valence: 8.0, arousal: 7.5, desc: "Maravilhamento", examples: "Natureza", regulation: "Gratidão", practice: { title: "Perspectiva", description: "Veja o todo.", type: "text", content: ["Olhe para o céu."] } },
        { level: 5, label: "Choque", valence: 4.0, arousal: 8.5, desc: "Impacto repentino", examples: "Notícia ruim", regulation: "Estabilização", practice: { title: "Processamento", description: "Aceite a informação.", type: "text", content: ["Repita o que ouviu."] } },
        { level: 6, label: "Perplexidade", valence: 3.0, arousal: 8.0, desc: "Confusão", examples: "Incompreensível", regulation: "Busca de Sentido", practice: { title: "Análise", description: "Busque lógica.", type: "text", content: ["Peça explicações."] } },
        { level: 7, label: "Espanto", valence: 5.0, arousal: 9.0, desc: "Reação máxima", examples: "Extraordinário", regulation: "Respiração", practice: { title: "Estabilização", description: "Verifique segurança.", type: "text", content: ["Respire e verifique fatos."] } }
    ]
  },
  nojo: {
    name: "Nojo", emoji: "🤢", icon: ThumbsDown, color: "from-lime-500 via-green-600 to-teal-700", valenceBase: 3.0, colorKey: 'nojo',
    levels: [
        { level: 1, label: "Desprezo", valence: 4.0, arousal: 4.5, desc: "Nojo social", examples: "Antiético", regulation: "Limites", practice: { title: "Reforço de Valores", description: "Afirme quem você é.", type: "text", content: ["Reafirme valores."] } },
        { level: 2, label: "Desgosto", valence: 3.5, arousal: 5.0, desc: "Insatisfação", examples: "Comida ruim", regulation: "Recusa", practice: { title: "Assertividade", description: "Expresse desagrado.", type: "text", content: ["Diga 'não gosto'."] } },
        { level: 3, label: "Repulsa", valence: 3.0, arousal: 6.0, desc: "Afastamento", examples: "Cheiro ruim", regulation: "Evitação", practice: { title: "Distância Física", description: "Saia de perto.", type: "text", content: ["Dê um passo atrás."] } },
        { level: 4, label: "Nojo", valence: 2.5, arousal: 7.0, desc: "Rejeição", examples: "Sujeira", regulation: "Limpeza", practice: { title: "Higiene", description: "Limpe-se.", type: "text", content: ["Lave as mãos."] } },
        { level: 5, label: "Repugnância", valence: 2.0, arousal: 7.5, desc: "Forte aversão", examples: "Cena forte", regulation: "Desvio de Olhar", practice: { title: "Proteção Visual", description: "Feche os olhos.", type: "text", content: ["Olhe para outro lado."] } },
        { level: 6, label: "Náusea", valence: 1.5, arousal: 8.0, desc: "Reação física", examples: "Enjoo", regulation: "Ar Fresco", practice: { title: "Ventilação", description: "Busque ar puro.", type: "text", content: ["Vá para a janela."] } },
        { level: 7, label: "Aversão", valence: 2.0, arousal: 8.0, desc: "Nojo máximo", examples: "Náusea", regulation: "Respiração", practice: { title: "Controle de Náusea", description: "Estabilize.", type: "text", content: ["Evite cheiros."] } }
    ]
  },
  amor: {
    name: "Amor", emoji: "🥰", icon: Heart, color: "from-pink-400 via-rose-500 to-fuchsia-600", valenceBase: 8.0, colorKey: 'amor',
    levels: [
        { level: 1, label: "Simpatia", valence: 6.0, arousal: 4.0, desc: "Conexão leve", examples: "Sorriso social", regulation: "Aproximação", practice: { title: "Espelhamento", description: "Sincronize.", type: "text", content: ["Sorria genuinamente."] } },
        { level: 2, label: "Carinho", valence: 7.0, arousal: 4.5, desc: "Afeto", examples: "Abraço", regulation: "Toque", practice: { title: "Contato Físico", description: "Abrace.", type: "text", content: ["Dê um abraço apertado."] } },
        { level: 3, label: "Afeto", valence: 7.5, arousal: 5.0, desc: "Sentimento terno", examples: "Cuidado", regulation: "Atenção", practice: { title: "Cuidado Ativo", description: "Faça algo bom.", type: "text", content: ["Faça um chá para alguém."] } },
        { level: 4, label: "Amor", valence: 8.0, arousal: 6.0, desc: "Vínculo profundo", examples: "Família", regulation: "Expressão", practice: { title: "Declaração", description: "Fale seus sentimentos.", type: "text", content: ["Diga o quanto a pessoa importa."] } },
        { level: 5, label: "Paixão", valence: 8.5, arousal: 8.0, desc: "Desejo intenso", examples: "Romance", regulation: "Canalização", practice: { title: "Romance", description: "Planeje algo especial.", type: "text", content: ["Faça uma surpresa."] } },
        { level: 6, label: "Adoração", valence: 9.0, arousal: 7.0, desc: "Devoção", examples: "Ídolo", regulation: "Equilíbrio", practice: { title: "Autocuidado", description: "Lembre-se de si mesmo.", type: "text", content: ["Faça algo só para você."] } },
        { level: 7, label: "Unidade", valence: 9.5, arousal: 6.0, desc: "Fusão de identidades", examples: "Espiritual", regulation: "Aterrar", practice: { title: "Respiração Compartilhada", description: "Sincronia total.", type: "text", content: ["Respirem no mesmo ritmo."] } }
    ]
  }
};

interface InsightData {
    layman: { description: string; advice: string };
    scientific: { mechanism: string; source: string };
    body: { sensation: string; why: string };
}

export const EMOTION_INSIGHTS: Record<string, Record<number, InsightData>> = {
  alegria: {
    1: {
      layman: {
        description: "Aquele 'ufa!' gostoso depois de terminar algo difícil. Seu corpo finalmente entende que pode descansar.",
        advice: "Não corra para a próxima tarefa. Saboreie esse momento por 30 segundos."
      },
      scientific: {
        mechanism: "Ativação moderada do Núcleo Accumbens via Dopamina fásica. Redução da atividade na Amígdala (sinal de segurança) e queda dos níveis de Cortisol circulante.",
        source: "Berridge & Kringelbach (2015), 'Pleasure Systems in the Brain'."
      },
      body: {
        sensation: "Os ombros descem, o maxilar destrava e você solta um suspiro longo involuntário.",
        why: "Mudança do domínio Simpático (luta/fuga) para o Parassimpático (descanso/digestão)."
      }
    },
    7: {
      layman: {
        description: "Você está voando! O mundo parece perfeito e você sente que pode fazer qualquer coisa. Cuidado: você está 'bêbado' de felicidade.",
        advice: "Aproveite a energia, mas NÃO tome decisões financeiras ou promessas de longo prazo agora."
      },
      scientific: {
        mechanism: "Hipofrontalidade Transiente: O Córtex Pré-frontal (julgamento) reduz atividade, enquanto o Sistema Límbico está em hiperativação dopaminérgica e opióide.",
        source: "Dietrich (2004), 'Neurocognitive mechanisms underlying the experience of flow'."
      },
      body: {
        sensation: "Você não sente cansaço nem dor. O tempo parece distorcido. Energia física inesgotável.",
        why: "Liberação massiva de Endorfinas (analgesia) e Norepinefrina (alerta)."
      }
    }
  },
  tristeza: {
    1: {
      layman: {
        description: "Uma expectativa não foi atendida. É como um pequeno tropeço mental.",
        advice: "Ajuste a rota. O que ainda é possível fazer hoje com o que sobrou?"
      },
      scientific: {
        mechanism: "Erro de Predição de Recompensa Negativo (Reward Prediction Error) processado pela Habênula Lateral, inibindo neurônios de dopamina.",
        source: "Schultz (2016), 'Dopamine reward prediction-error signaling'."
      },
      body: {
        sensation: "Queda súbita de energia, olhar baixo, suspiro.",
        why: "Retirada abrupta do estímulo dopaminérgico antecipatório."
      }
    },
    7: {
      layman: {
        description: "O fundo do poço. Parece que a dor nunca vai passar e que nada faz sentido. É o cérebro gritando por socorro.",
        advice: "Isso é uma tempestade biológica, não uma verdade eterna. Peça ajuda. Apenas sobreviva hoje."
      },
      scientific: {
        mechanism: "Desregulação do eixo HPA com níveis tóxicos de Cortisol. Atrofia funcional do Hipocampo (memória positiva inacessível) e hiperatividade do Córtex Cingulado Anterior (dor psíquica).",
        source: "Sapolsky (2000), 'Glucocorticoids and Hippocampal Atrophy'."
      },
      body: {
        sensation: "Dor física no peito, peso de chumbo nos membros, paralisia.",
        why: "Ativação da Via da Dor Social (Ínsula Anterior e CCA) sobrepondo-se às vias de dor física."
      }
    }
  },
  raiva: {
    1: {
      layman: { description: "Algo te incomodou levemente. Como uma pedra no sapato.", advice: "Decida agora: vale a pena gastar energia com isso ou é melhor ignorar?" },
      scientific: { mechanism: "Leve ativação da Amígdala detectando dissonância. O Córtex Pré-Frontal mantém total controle inibitório.", source: "Davidson et al. (2000)." },
      body: { sensation: "Leve tensão na mandíbula ou foco visual mais estreito.", why: "Preparação preliminar do sistema motor para ação potencial." }
    },
    7: {
      layman: { description: "Explosão vulcânica. Você não está pensando, está apenas reagindo para destruir a ameaça.", advice: "PARE. Não fale, não digite, não decida. Saia de perto e esfrie o corpo (gelo)." },
      scientific: { mechanism: "Sequestro da Amígdala (Amygdala Hijack). O Córtex Pré-Frontal (razão) é 'desligado' quimicamente por excesso de catecolaminas.", source: "Goleman (1995); LeDoux (1996)." },
      body: { sensation: "Visão de túnel, tremores, força descomunal, analgesia (não sente dor).", why: "Descarga maciça de Adrenalina e Noradrenalina preparando para combate mortal." }
    }
  },
  medo: {
    1: {
        layman: { description: "Frio na barriga antes de algo importante. É seu corpo te dando energia extra.", advice: "Use essa energia para se preparar melhor. Diga: 'Estou pronto'." },
        scientific: { mechanism: "Ativação do Locus Coeruleus liberando Noradrenalina para aumentar a vigilância e atenção.", source: "Aston-Jones & Cohen (2005)." },
        body: { sensation: "Borboletas no estômago, mãos levemente suadas.", why: "O sangue começa a ser desviado da digestão para os músculos (vasoconstrição esplâncnica)." }
    },
    7: {
        layman: { description: "Terror absoluto. Você sente que vai morrer ou perder o controle. O mundo parece irreal.", advice: "Use o chão. Sinta o chão. Respire contando. É apenas química, vai passar." },
        scientific: { mechanism: "Colapso funcional. Ativação paradoxal do Sistema Nervoso Simpático (acelerador) e Vagal Dorsal (freio de emergência/congelamento).", source: "Porges (2011), 'Polyvagal Theory'." },
        body: { sensation: "Tontura, falta de ar, sensação de desmaio ou irrealidade (desrealização).", why: "Hipocapnia (baixa de CO2) por hiperventilação e dissociação peritraumática." }
    }
  }
};