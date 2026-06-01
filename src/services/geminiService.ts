import { GoogleGenAI, Type } from "@google/genai";
import { safeLocalStorage } from "../lib/storage";

export interface GlobalAnalysisItem {
  contactId: string;
  contactName: string;
  observation: string;
  behavioralSummary: string;
  nextAction: string;
  suggestedTemperature: 'Frio' | 'Morno' | 'Quente';
}

const validateKey = (key: string) => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.length > 10 && 
         trimmed !== 'YOUR_API_KEY' && 
         !trimmed.includes('MY_GEMINI') &&
         !trimmed.includes('PLACEHOLDER');
};

// Helper to get the AI client with the latest API key
function getAIClient() {
  // 1. Check manual key first (user intent is strongest here)
  const localKey = safeLocalStorage.getItem('RADAR_CRM_GEMINI_KEY') || '';
  if (localKey && validateKey(localKey)) {
    const apiKey = localKey.trim();
    return { ai: new GoogleGenAI({ apiKey }), apiKey };
  }

  // 2. Check environment variables
  const envKey = [
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    process.env.GEMINI_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  ].find(key => key && key !== 'undefined' && key !== 'null' && key !== '' && validateKey(key));

  const apiKey = (envKey || localKey || '').trim();
  
  if (!apiKey) {
    console.error("❌ Erro: Chave de API do Gemini não encontrada.");
    throw new Error("Chave de API ausente. Por favor, adicione NEXT_PUBLIC_GEMINI_API_KEY nos Secrets ou insira no App.");
  }

  // Log masked key for verification in browser console
  const maskedKey = `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;
  console.log(`🔑 [DEBUG] Chave detectada: ${maskedKey} | Origem: ${envKey ? 'Env' : 'Local'} | Tamanho: ${apiKey.length} caracteres`);

  return { ai: new GoogleGenAI({ apiKey }), apiKey };
}

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1500): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || String(error);
      
      // Check for retryable errors: 503 (High Demand), 429 (Quota), or generic network errors
      const isRetryable = errorMessage.includes("503") || 
                          errorMessage.includes("Service Unavailable") ||
                          errorMessage.includes("high demand") ||
                          errorMessage.includes("temporary") ||
                          errorMessage.includes("429") ||
                          errorMessage.includes("Too Many Requests") ||
                          errorMessage.includes("fetch") ||
                          errorMessage.includes("NetworkError");
      
      if (isRetryable && i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i); // Exponential backoff: 1.5s, 3s, 6s
        console.warn(`⚠️ Gemini API ocupada ou indisponível (Tentativa ${i + 1}/${maxRetries}). Aguardando ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateRadarResponse(conversation: string, contactName: string, property: string, imageBase64?: string, audioBase64?: string) {
  const { ai } = getAIClient();

  console.log(`🤖 Iniciando análise comportamental para: ${contactName}`);
  
  try {
    const parts: any[] = [
      {
        text: `Você é um Especialista em Análise e Comportamento do Cliente Radar. 
        Sua missão é analisar profundamente a interação com o cliente ${contactName} e fornecer a melhor resposta e estratégia de conversão.
        
        Dados fornecidos:
        - Nome do Cliente: ${contactName}
        - Produto/Imóvel: ${property}
        - Histórico de Conversa: ${conversation || "Nenhum texto fornecido"}
        
        Se um print (imagem) ou áudio foi fornecido, analise visualmente/auditivamente as mensagens, o tom de voz e as intenções implícitas do cliente.
        
        Forneça:
        1. idealResponse: Uma resposta persuasiva, empática e profissional adaptada ao comportamento detectado.
        2. masterStrategy: Uma análise psicológica do comportamento do cliente e o porquê dessa abordagem.
        3. suggestedTemperature: Classifique o lead como 'Frio', 'Morno' ou 'Quente' baseado no interesse demonstrado.`
      }
    ];

    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: base64Data
        }
      });
    }

    if (audioBase64) {
      const base64Data = audioBase64.split(',')[1] || audioBase64;
      parts.push({
        inlineData: {
          mimeType: "audio/mp3",
          data: base64Data
        }
      });
    }

    const response = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: "Você é um expert em psicologia de vendas e comportamento do consumidor. Analise prints de conversas, áudios (transcreva-os internamente) e textos colados para criar respostas que quebrem objeções e gerem desejo imediato. Classifique a temperatura do lead: 'Quente' (alto interesse, pronto para agir), 'Morno' (interessado mas com dúvidas/objeções) ou 'Frio' (baixo interesse ou desengajado).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idealResponse: { type: Type.STRING, description: "A resposta sugerida para enviar ao cliente" },
            masterStrategy: { type: Type.STRING, description: "Análise do comportamento e estratégia recomendada" },
            suggestedTemperature: { type: Type.STRING, enum: ["Frio", "Morno", "Quente"], description: "Classificação da temperatura do lead" }
          },
          required: ["idealResponse", "masterStrategy", "suggestedTemperature"]
        }
      }
    }));

    console.log("✅ Análise comportamental concluída.");
    try {
      const cleanedText = response.text.replace(/```json\n?|```/g, '').trim();
      const result = JSON.parse(cleanedText || '{}');
      return {
        ...result,
        timestamp: new Date().toISOString()
      };
    } catch (parseError) {
      console.error("❌ Erro ao parsear JSON do Gemini:", parseError, response.text);
      return { idealResponse: "Erro ao processar resposta da IA.", masterStrategy: "Erro de formato na resposta." };
    }
  } catch (e: any) {
    console.error("❌ Erro na chamada do Gemini:", e);
    if (e.message?.includes("API key not valid")) {
      throw new Error("A chave de API inserida é inválida. Por favor, verifique se copiou a chave completa do AI Studio e se não há espaços extras.");
    }
    if (e.message?.includes("Quota exceeded") || e.message?.includes("429")) {
      throw new Error("Limite de uso da API Gemini excedido. Tente novamente em alguns minutos ou verifique sua cota no Google Cloud.");
    }
    if (e.message?.includes("503") || e.message?.includes("high demand") || e.message?.includes("UNAVAILABLE")) {
      throw new Error("O modelo Gemini está com alta demanda no momento. Por favor, aguarde alguns segundos e tente novamente.");
    }
    throw e;
  }
}

export async function analyzeAllContacts(contacts: any[]): Promise<GlobalAnalysisItem[]> {
  if (contacts.length === 0) return [];
  const { ai } = getAIClient();

  console.log(`🤖 Iniciando análise global de ${contacts.length} contatos.`);

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é o Especialista em Comportamento do Consumidor da Radar CRM. 
      Analise o status atual destes leads e forneça uma análise estratégica individual focada em gatilhos mentais e comportamento.
      
      Contatos:
      ${JSON.stringify(contacts.map(c => ({ 
        name: c.name, 
        status: c.status, 
        temperature: c.temperature, 
        property: c.property,
        behavioralHistory: c.behavioralHistory || (c.behavioralAnalysis ? [c.behavioralAnalysis] : [])
      })))}`,
      config: {
        systemInstruction: "Você é um estrategista de vendas focado em psicologia aplicada. Analise os leads e identifique o perfil comportamental de cada um para sugerir a melhor abordagem. Classifique a temperatura do lead: 'Quente' (alto interesse), 'Morno' (médio interesse) ou 'Frio' (baixo interesse).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              contactId: { type: Type.STRING },
              contactName: { type: Type.STRING },
              observation: { type: Type.STRING, description: "Observação crítica sobre o estado atual do lead" },
              behavioralSummary: { type: Type.STRING, description: "Resumo da análise comportamental individual (se houver)" },
              nextAction: { type: Type.STRING, description: "Ação imediata recomendada para avançar no funil" },
              suggestedTemperature: { type: Type.STRING, enum: ["Frio", "Morno", "Quente"], description: "Classificação da temperatura do lead" }
            },
            required: ["contactId", "contactName", "observation", "behavioralSummary", "nextAction", "suggestedTemperature"]
          }
        }
      }
    }));

    console.log("✅ Análise global recebida com sucesso.");
    let parsed = [];
    try {
      const cleanedText = response.text.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(cleanedText || '[]');
    } catch (parseError) {
      console.error("❌ Erro ao parsear JSON global do Gemini:", parseError, response.text);
      return [];
    }
    return parsed.map((item: any, index: number) => ({
      ...item,
      contactId: contacts[index]?.id || item.contactId
    }));
  } catch (e: any) {
    console.error("❌ Erro na análise global do Gemini:", e);
    if (e.message?.includes("API key not valid")) {
      throw new Error("A chave de API inserida é inválida. Por favor, verifique se copiou a chave completa do AI Studio e se não há espaços extras.");
    }
    if (e.message?.includes("Quota exceeded") || e.message?.includes("429")) {
      throw new Error("Limite de uso da API Gemini excedido. Tente novamente em alguns minutos ou verifique sua cota no Google Cloud.");
    }
    if (e.message?.includes("503") || e.message?.includes("high demand") || e.message?.includes("UNAVAILABLE")) {
      throw new Error("O modelo Gemini está com alta demanda no momento. Por favor, aguarde alguns segundos e tente novamente.");
    }
    throw e;
  }
}

export async function testGeminiConnection() {
  try {
    const { ai } = getAIClient();
    console.log("🧪 Testando conexão com Gemini...");
    const response = await callWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
    }));
    const success = !!response.text;
    if (success) {
      console.log("✅ Conexão Gemini OK!");
    }
    return success;
  } catch (e: any) {
    if (e.message?.includes("Quota exceeded") || e.message?.includes("429")) {
      console.warn("⚠️ Gemini Quota Exceeded during connection test. Assuming key is valid but quota is full.");
      return true; // Return true because the key is likely valid if we got a quota error
    }
    console.error("❌ Erro crítico no teste de conexão Gemini:", e);
    if (e.message) console.error("Mensagem de erro detalhada:", e.message);
    return false;
  }
}
