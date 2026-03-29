import { GoogleGenerativeAI } from "@google/generative-ai";

/ Vite pattern to read the Vercel key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const analyzeLeadWithAI = async (leadData: any, chatHistory: any[]) => {

try {

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `
You are the Sales Brain of Radar CRM.
Analyze the following real estate lead from Goiânia:

Name: ${leadData.name}
Interest: ${leadData.property_interest}
Conversation History: ${JSON.stringify(chatHistory)}

Provide a short analysis on the urgency of purchase and the next best action for the broker Reginaldo. `;

const result = await model.generateContent(prompt);

const response = await result.response;

return response.text();

} catch (error) {

console.error("Error in AI analysis:", error);

return "The Brain is processing the information. Please try again shortly.";

}
};
