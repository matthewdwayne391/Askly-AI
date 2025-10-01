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

export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
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
