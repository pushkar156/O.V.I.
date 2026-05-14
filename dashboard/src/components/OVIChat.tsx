"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { oviClient } from '@/lib/ovi-client';
import { VoiceOrb } from './VoiceOrb';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export const OVIChat: React.FC<{ conversationId?: string, onNewConversation?: (id: string) => void }> = ({ conversationId, onNewConversation }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isWoken, setIsWoken] = useState(false);
  const [volume, setVolume] = useState(0);
  const [currentConvId, setCurrentConvId] = useState<string | undefined>(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (data: any) => {
      if (data.type === "wake") {
        setIsWoken(true);
        // Auto-reset after a few seconds if no interaction
        setTimeout(() => setIsWoken(false), 5000);
      }
    };

    oviClient.onMessage(handleMessage);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Sync internal ID with prop
  useEffect(() => {
    setCurrentConvId(conversationId);
  }, [conversationId]);

  // Load History when internal ID changes
  useEffect(() => {
    if (currentConvId) {
      oviClient.getChatHistory(currentConvId).then(history => {
        const formatted: Message[] = history.map((h: any, i: number) => ({
          id: `hist-${i}`,
          role: h.role,
          content: h.content
        }));
        setMessages(formatted);
      }).catch(console.error);
    } else {
      setMessages([]);
    }
  }, [currentConvId]);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setVolume(0);
      const audioBlob = await oviClient.stopRecording();
      
      try {
        // 1. Send real audio to backend
        const response = await oviClient.sendVoiceCommand(audioBlob);
        
        // 2. Add user transcription to chat
        const userMsg: Message = { 
          id: Date.now().toString(), 
          role: 'user', 
          content: response.transcription 
        };
        setMessages(prev => [...prev, userMsg]);

        // 3. Add AI response to chat
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: response.response 
        };
        setMessages(prev => [...prev, aiMsg]);

        // 4. Play the AI's voice response
        if (response.audio_url) {
          oviClient.playResponse(response.audio_url);
        }
      } catch (error) {
        console.error("Voice Error:", error);
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error processing your voice command."
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } else {
      await oviClient.startRecording((vol) => setVolume(vol));
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      // Use the internal currentConvId to ensure we stay in the same thread
      const response = await oviClient.chat(input, currentConvId);

      // Lock the ID immediately if this was a new conversation
      if (!currentConvId && response.conversation_id) {
        setCurrentConvId(response.conversation_id);
        if (onNewConversation) onNewConversation(response.conversation_id);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error: Neural Link Offline."
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const getBarHeight = (index: number) => {
    if (!isRecording) {
      const idleHeights = [8, 16, 24, 12, 32, 18, 12];
      return idleHeights[index];
    }
    const baseHeight = 12;
    const modifier = Math.sin((index + 1) * Math.PI / 4) * 0.5 + 0.5;
    const dynamicHeight = Math.max(baseHeight, volume * 1.5 * modifier);
    return Math.min(100, dynamicHeight);
  };

  return (
    <section className="flex-1 h-full bg-surface-container-lowest dark:bg-[#1c1b1b] rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none transition-all duration-300 dark:bg-[radial-gradient(circle_at_50%_50%,_#ffb3ae_0%,_transparent_70%)]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #CD5656 0%, transparent 70%)" }}></div>

      <div className="flex-1 overflow-y-auto z-10 px-4 md:px-8 pt-8 pb-32 flex flex-col scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center relative">
            <div className="relative mb-8 flex items-center justify-center cursor-pointer" onClick={toggleRecording}>
              <VoiceOrb 
                state={isRecording ? "listening" : isWoken ? "speaking" : "idle"} 
              />
              {!isRecording && !isWoken && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#CD5656] opacity-50">mic</span>
                </div>
              )}
            </div>

            <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface dark:text-[#e5e2e1] mb-2 z-10">
              {isRecording ? "Listening..." : "How can I help you today?"}
            </h3>
            <p className="font-label text-sm text-on-surface-variant dark:text-[#e5e2e1]/60 z-10">
              {isRecording ? "Speak your directive clearly." : "System listening for operational directives..."}
            </p>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, filter: "blur(8px)", scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] md:max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                      ? 'bg-[#CD5656] dark:bg-[#cc3a3a] text-white dark:text-[#fff2f0] rounded-br-sm shadow-md'
                      : 'bg-surface-container-high dark:bg-[#2a2a2a] text-on-surface dark:text-[#e5e2e1] rounded-bl-sm border border-[#AF3E3E]/10 dark:border-[#5b403d]/15 shadow-sm'
                    }`}>
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:left-8 z-20">
        <form onSubmit={handleSubmit} className="bg-surface-container dark:bg-[#201f1f] rounded-xl p-2 flex items-center gap-2 md:gap-4 shadow-xl border border-[#AF3E3E]/10 dark:border-[#5b403d]/15">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${isRecording ? 'text-white dark:text-[#fff2f0] bg-[#CD5656] dark:bg-[#cc3a3a] animate-pulse' : 'text-[#CD5656] dark:text-[#ffb3ae] hover:bg-surface-variant dark:hover:bg-[#353534]'}`}
          >
            <span className="material-symbols-outlined">{isRecording ? 'stop_circle' : 'mic'}</span>
          </button>
          <input
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 font-['Lexend'] text-on-surface dark:text-[#e5e2e1] text-sm w-full min-w-0"
            placeholder="Type a command or ask a question..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-[#AF3E3E] dark:bg-[#ffb3ae]/10 text-white dark:text-[#ffb3ae] p-2 md:p-2.5 rounded-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-[#9f3f41] dark:hover:bg-[#ffb3ae]/20 shrink-0 border border-transparent dark:border-outline-variant/10">
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </section>
  );
};
