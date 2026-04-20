"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, MessageSquare, Send, Bot, User, Cpu } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolUsed?: string;
}

export const OVIChat: React.FC = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
      { id: '1', role: 'assistant', content: "Systems online. How can I assist you today?" }
    ]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setHistory(prev => [input, ...prev]);
        setHistoryIndex(-1);
        setInput("");

        // Simulated AI Response
        setTimeout(() => {
          const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: "Processing your command...", toolUsed: "SystemControl" };
          setMessages(prev => [...prev, aiMsg]);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInput(history[nextIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        const nextIndex = historyIndex - 1;
        if (nextIndex >= -1) {
          setHistoryIndex(nextIndex);
          setInput(nextIndex === -1 ? "" : history[nextIndex]);
        }
      }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[600px] z-50">
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto pr-4 mb-4 scrollbar-hide space-y-4">
               <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <GlassPanel 
                        variant={msg.role === 'user' ? 'active' : 'default'}
                        className="px-4 py-2"
                      >
                         <p className="text-sm leading-relaxed">{msg.content}</p>
                      </GlassPanel>
                      
                      {msg.toolUsed && (
                        <div className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          <Cpu size={10} className="text-primary" />
                          <span className="text-[8px] font-mono text-primary uppercase">Executed: {msg.toolUsed}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
               </AnimatePresence>
               <div ref={messagesEndRef} />
            </div>

            {/* Input Terminal */}
            <GlassPanel className="p-1" hoverGlow>
                <form onSubmit={handleSubmit} className="flex items-center px-4 gap-4 bg-white/[0.02]">
                    <Terminal size={20} className="text-white/20" />
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter direct command..." 
                        className="w-full bg-transparent border-none outline-none py-4 text-sm placeholder:text-white/20 text-white font-medium"
                    />
                    <button 
                        type="submit"
                        className="p-2 rounded-lg hover:bg-primary/10 text-white/40 hover:text-primary transition-colors"
                    >
                        {input.trim() ? <Send size={20} /> : <MessageSquare size={20} />}
                    </button>
                </form>
            </GlassPanel>
        </div>
    );
};
