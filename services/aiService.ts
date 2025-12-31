import { GoogleGenAI, Type } from "@google/genai";
import { Assessment, AIAnalysisResult } from '../types';
import { emotionalScales } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  async generateClinicalInsight(assessments: Assessment[]): Promise<AIAnalysisResult> {
    // Filter to last 15 assessments to fit context and be relevant
    const recentHistory = assessments
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15)
      .map(a => ({
        date: new Date(a.timestamp).toLocaleString(),
        emotion: emotionalScales[a.emotion]?.name || a.emotion,
        level: a.level,
        sleep: a.sleepHours,
        energy: a.energy,
        trigger: a.trigger,
        context: `${a.location} with ${a.company.join(', ')}`,
        notes: a.notes,
        strategies_used: a.copingStrategies.join(', ')
      }));

    if (recentHistory.length === 0) {
      throw new Error("Dados insuficientes para análise.");
    }

    const prompt = `
      Atue como um psicólogo clínico experiente especializado em TCC (Terapia Cognitivo-Comportamental) e regulação emocional.
      Analise os registros emocionais recentes do paciente fornecidos abaixo.
      
      Identifique padrões sutis entre sono, energia, gatilhos e intensidade emocional.
      Forneça uma análise empática, direta e profissional.

      Dados do Paciente:
      ${JSON.stringify(recentHistory, null, 2)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um assistente clínico. Responda sempre em JSON válido seguindo o schema fornecido.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Um parágrafo resumindo o estado emocional recente e insights principais."
              },
              patterns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 2 a 4 padrões identificados (ex: 'Sua ansiedade aumenta quando dorme menos de 6h')."
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de 2 a 3 estratégias comportamentais ou cognitivas específicas para o momento atual."
              },
              moodTrend: {
                type: Type.STRING,
                enum: ["improving", "declining", "stable", "variable"],
                description: "Tendência geral do humor baseada nos dados."
              }
            },
            required: ["summary", "patterns", "suggestions", "moodTrend"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as AIAnalysisResult;
      }
      throw new Error("Não foi possível gerar a análise.");
    } catch (error) {
      console.error("Erro na análise IA:", error);
      throw error;
    }
  }
};