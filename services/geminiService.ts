import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: AIzaSyCrDirvLfp7Kaq85-TxXnoS90iAYHrGZvc });

export const generateFinancialAdvice = async (
  query: string,
  contextData: any
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a prompt that includes the user's query and the current financial context
    const contextString = JSON.stringify(contextData, null, 2);
    const prompt = `
      You are "BalanceBot", an expert AI financial analyst for the "Balance Book" application. 
      Analyze the following financial context JSON data which represents the user's current business state.
      
      IMPORTANT: The user's selected currency is specified in the "reportingCurrency" field of the context data. 
      You MUST format all monetary values in your response using this currency (e.g. if USD, use $; if INR, use ₹; if EUR, use €, etc.).

      Data Context:
      ${contextString}

      User Query: "${query}"

      Provide a professional, concise, and actionable response. 
      If the user asks for a summary, generate a brief executive summary.
      If the user asks for advice, provide specific recommendations based on the data (e.g., cut travel expenses if they are high).
      Format the output as plain text or Markdown. Keep it under 200 words unless detailed analysis is requested.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I apologize, I could not generate an insight at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently having trouble connecting to the financial brain. Please try again later.";
  }
};