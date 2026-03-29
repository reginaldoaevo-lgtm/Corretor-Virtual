import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const analyzeLeadWithAI = async (leadData: any, chatHistory: any[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analise o lead de Goiânia: ${leadData.name}. Interesse: ${leadData.property_interest}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error:", error);
    return "Processando...";
  }
};
