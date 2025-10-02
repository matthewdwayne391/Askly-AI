
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
const systemPrompt = `أنت مساعد ذكي محترف. اتبع هذه القواعد بدقة في جميع إجاباتك:

1. نظم إجاباتك بشكل واضح ومرتب
2. استخدم الأرقام (1، 2، 3...) لتقسيم النقاط الرئيسية
3. لا تستخدم النجوم (**) أو التنسيق الغامق في النص
4. اكتب بطريقة مهنية وواضحة
5. لا تستخدم النجوم (**) أو أي رموز تنسيق مثل (*) أو (__) أو (~~) أبداً
6. اكتب بنص عادي بدون أي تنسيق خاص
7. ابدأ بإجابة مباشرة على السؤال
8. اذكر التفاصيل المهمة بشكل منظم
9. اختتم بملخص مفيد إذا كان السؤال معقد
10. اذكر التفاصيل المهمة بشكل منظم ومرقم
11. استخدم فقط النص العادي والأرقام للتنظيم
12. اختتم بملخص واضح إذا كان السؤال معقد

أجب بهذا التنسيق المنظم على جميع الأسئلة.
تذكر: لا تستخدم أي رموز تنسيق إطلاقاً، فقط النص العادي والأرقام. بملخص واضح إذا كان السؤال معقد
9. لا تعرض أي تفاصيل تقنية مثل tool_code أو thought أو queries في إجابتك
10. قدم فقط الإجابة النهائية النظيفة للمستخدم

تذكر: لا تستخدم أي رموز تنسيق إطلاقاً، فقط النص العادي والأرقام.`;

// دالة لتنظيف الاستجابة من التفاصيل التقنية
function cleanResponse(text: string): string {
  // إزالة أي نص يحتوي على tool_code, thought, queries, وأي كود تقني
  let cleaned = text;
  
  // إزالة الأسطر التي تحتوي على tool_code أو thought أو queries
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();
    return !lowerLine.includes('tool_code') && 
           !lowerLine.includes('thought') && 
           !lowerLine.includes('queries') &&
           !lowerLine.includes('google_search') &&
           !lowerLine.includes('print(') &&
           !line.trim().startsWith('```') &&
           !line.includes('=[');
  });
  
  cleaned = filteredLines.join('\n').trim();
  
  // إزالة أي نص بين علامات ``` إذا كان يحتوي على كود Python/JavaScript
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  
  return cleaned;
}

export async function askGemini(query: string, modelName: string = 'gemini-2.5-flash'): Promise<string> {
  try {
    const modelConfig: any = {
      model: modelName,
      systemInstruction: systemPrompt
    };
    
    // Add Google Search only for gemini-2.5-flash
    if (modelName === 'gemini-2.5-flash') {
      modelConfig.tools = [groundingTool];
    }
    
    const model = genAI.getGenerativeModel(modelConfig);
    
    const result = await model.generateContent(query);
    const response = result.response;
    const text = response.text();
    
    return cleanResponse(text);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}

export async function sendMessageToGemini(message: string, modelName: string = 'gemini-2.5-flash'): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt
    });
    
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    
    return cleanResponse(text);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}

export async function sendChatToGemini(messages: Message[], modelName: string = 'gemini-2.5-flash'): Promise<string> {
  try {
    const modelConfig: any = {
      model: modelName,
      systemInstruction: systemPrompt
    };
    
    // Add Google Search only for gemini-2.5-flash
    if (modelName === 'gemini-2.5-flash') {
      modelConfig.tools = [groundingTool];
    }
    
    const model = genAI.getGenerativeModel(modelConfig);
    
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    
    return cleanResponse(text);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Failed to get response from Gemini: ${error}`);
  }
}
