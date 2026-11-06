"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { oviClient } from '@/lib/ovi-client';

interface ChatContextType {
  activeSessionId: string | undefined;
  setActiveSessionId: (id: string | undefined) => void;
  sessions: any[];
  refreshSessions: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [sessions, setSessions] = useState<any[]>([]);

  const refreshSessions = async () => {
    try {
      const data = await oviClient.getChatSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <ChatContext.Provider value={{ activeSessionId, setActiveSessionId, sessions, refreshSessions }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
