
import { GoogleGenAI } from "@google/genai";
import { Activity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getHealthInsights = async (activities: Activity[]) => {
  if (activities.length === 0) return "Comece a registrar suas atividades para receber insights personalizados!";

  const summary = activities.slice(-7).map(a => 
    `- ${a.date}: ${a.type} (${a.duration} min${a.distance ? `, ${a.distance}km` : ''})`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base nas minhas últimas atividades físicas:
      ${summary}
      
      Dê-me um feedback motivacional curto e uma dica de saúde baseada nesses dados. Seja breve e encorajador em Português do Brasil.`,
    });
    
    return response.text || "Continue se movendo! Você está indo muito bem.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o foco nos seus objetivos de saúde!";
  }
};
