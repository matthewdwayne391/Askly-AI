import { createContext, useContext, useState, ReactNode } from 'react';
import type { Message } from './lib/gemini';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  isTemporary: boolean;
}

interface ConversationsContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (isTemporary?: boolean) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string) => void;
  updateCurrentConversation: (messages: Message[]) => void;
  clearTemporaryConversations: () => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConv] = useState<Conversation | null>(null);

  const createNewConversation = (isTemporary = false) => {
    const now = new Date();
    
    const getTimeString = (d: Date) => {
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      const minutesStr = minutes.toString().padStart(2, '0');
      return `${hours12}:${minutesStr} ${ampm}`;
    };
    
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const timeStr = getTimeString(now);
    
    const title = isTemporary 
      ? `محادثة مؤقتة - ${month}/${day} ${timeStr}`
      : `محادثة جديدة - ${month}/${day} ${timeStr}`;
    
    const newConv: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: now,
      isTemporary,
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConv(newConv);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConv(null);
    }
  };

  const setCurrentConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setCurrentConv(conv);
    }
  };

  const updateCurrentConversation = (messages: Message[]) => {
    if (!currentConversation) return;

    const title = messages.length > 0 ? messages[0].content.slice(0, 50) + '...' : 'محادثة جديدة';

    const updatedConv: Conversation = {
      ...currentConversation,
      messages,
      title,
    };

    setCurrentConv(updatedConv);
    setConversations((prev) =>
      prev.map((conv) => (conv.id === currentConversation.id ? updatedConv : conv))
    );
  };

  const clearTemporaryConversations = () => {
    setConversations((prev) => prev.filter((conv) => !conv.isTemporary));
    if (currentConversation?.isTemporary) {
      setCurrentConv(null);
    }
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        currentConversation,
        createNewConversation,
        deleteConversation,
        setCurrentConversation,
        updateCurrentConversation,
        clearTemporaryConversations,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used within ConversationsProvider');
  }
  return context;
}
