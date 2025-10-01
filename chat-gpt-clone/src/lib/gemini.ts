
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('VITE_GOOGLE_API_KEY is not set. Gemini API will not work.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const groundingTool = {
  googleSearch: {},
};

// Professional system prompt for organized responses
const systemPrompt = `أنت مساعد ذكي محترف. اتبع هذه القواعد في جميع إجاباتك:

1. نظم إجاباتك بشكل واضح ومرتب
2. استخدم الأرقام (1، 2، 3...) لتقسيم النقاط الرئيسية
3. لا تستخدم النجوم (**) أو التنسيق الغامق في النص
4. اكتب بطريقة مهنية وواضحة
5. ابدأ بإجابة مباشرة على السؤال
6. اذكر التفاصيل المهمة بشكل منظم
7. اختتم بملخص مفيد إذا كان السؤال معقد

أجب بهذا التنسيق المنظم على جميع الأسئلة.`;

// Updated function with Google Search grounding
export async function askGemini(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      tools: [groundingTool],
      systemInstruction: systemPrompt
    });
    
    const result = await model.generateContent(query);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API with grounding:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}

export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt
    });
    
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}

export async function sendChatToGemini(messages: Message[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      tools: [groundingTool],
      systemInstruction: systemPrompt
    });
    
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}
