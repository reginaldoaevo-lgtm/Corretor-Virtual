import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const analyzeLeadWithAI = async (leadData: any, chatHistory: any[]) => {

try {

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `
Analyze the following real estate lead from Goiânia:

Name: ${leadData.name}
Interest: ${leadData.property_interest}
History: ${JSON.stringify(chatHistory)}
Provide an urgency analysis and next action for the broker.

`;

const result = await model.generateContent(prompt);

const response = await result.response;

return response.text();

} catch (error) {
console.error("AI Error:", error);

return "The Brain is processing the information.";

}
};
