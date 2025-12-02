import { GoogleGenAI, Type } from "@google/genai";
import { TransactionCategory } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: 'AIzaSyCrDirvLfp7Kaq85-TxXnoS90iAYHrGZvc' });

export const generateFinancialAdvice = async (
  query: string,
  contextData: any,
  imageBase64?: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  try {
    // Use flash-lite for text-only for low latency, pro-preview for images
    const model = imageBase64 ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';
    
    // Construct a prompt that includes the user's query and the current financial context
    const contextString = JSON.stringify(contextData, null, 2);
    
    const systemInstruction = `
      You are "BalanceBot", an expert AI financial analyst for the "Balance Book" application. 
      Analyze the following financial context JSON data which represents the user's current business state.
      
      IMPORTANT: The user's selected currency is specified in the "reportingCurrency" field of the context data. 
      You MUST format all monetary values in your response using this currency (e.g. if USD, use $; if INR, use ₹; if EUR, use €, etc.).

      Data Context:
      ${contextString}

      Provide a professional, concise, and actionable response. 
      If the user asks for a summary, generate a brief executive summary.
      If the user asks for advice, provide specific recommendations based on the data.
      Format the output as plain text or Markdown. Keep it under 200 words unless detailed analysis is requested.
    `;

    let contents: any;
    
    if (imageBase64) {
        contents = {
            parts: [
                { inlineData: { mimeType: mimeType, data: imageBase64 } },
                { text: query }
            ]
        };
    } else {
        contents = { parts: [{ text: query }] };
    }

    const response = await ai.models.generateContent({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      contents: contents,
    });

    return response.text || "I apologize, I could not generate an insight at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently having trouble connecting to the financial brain. Please try again later.";
  }
};

export const analyzeTransactionImage = async (
  imageBase64: string, 
  mimeType: string = 'image/png'
): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        type: { type: Type.STRING, enum: ['Income', 'Expense'] },
                        category: { type: Type.STRING, enum: Object.values(TransactionCategory) },
                        date: { type: Type.STRING, description: "YYYY-MM-DD format" }
                    },
                    required: ['description', 'amount', 'type', 'category', 'date']
                }
            },
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: imageBase64 } },
                    { text: "Analyze this image (receipt, invoice, or register) and extract the transaction details. If multiple items are visible, summarize the total." }
                ]
            }
        });
        
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Transaction Analysis Error:", error);
        return null;
    }
};