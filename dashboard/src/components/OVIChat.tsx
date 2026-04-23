"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { oviClient } from '@/lib/ovi-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export const OVIChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setVolume(0);
      const audioBlob = await oviClient.stopRecording();
      // Here we would upload audioBlob to /api/voice
      // For now, let's just simulate the transcription arriving:
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: "Voice command received." };
      setMessages(prev => [...prev, userMsg]);
      
      setTimeout(() => {
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "Voice processed. Running command." };
        setMessages(prev => [...prev, aiMsg]);
      }, 800);
    } else {
      await oviClient.startRecording((vol) => setVolume(vol));
      setIsRecording(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulated AI Response
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "Acknowledged. I am processing your command through the neural mesh." };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Calculate dynamic heights based on base volume + some math math to make it look like a waveform
  const getBarHeight = (index: number) => {
    if (!isRecording) {
        // Idle state heights
        const idleHeights = [8, 16, 24, 12, 32, 18, 12];
        return idleHeights[index];
    }
    // Dynamic height based on volume and index
    const baseHeight = 12;
    const modifier = Math.sin((index + 1) * Math.PI / 4) * 0.5 + 0.5; // Creates a curve
    const dynamicHeight = Math.max(baseHeight, volume * 1.5 * modifier);
    return Math.min(100, dynamicHeight); // Cap at 100px
  };

  return (
    <section className="flex-1 bg-surface-container-lowest dark:bg-[#1c1b1b] rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none transition-all duration-300 dark:bg-[radial-gradient(circle_at_50%_50%,_#ffb3ae_0%,_transparent_70%)]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #CD5656 0%, transparent 70%)" }}></div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto z-10 px-4 md:px-8 pt-8 pb-32 flex flex-col scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div 
              onClick={toggleRecording}
              className={`mb-6 inline-flex p-4 rounded-full cursor-pointer transition-all duration-300 ${isRecording ? 'bg-[#CD5656] dark:bg-[#cc3a3a] text-white shadow-[0_0_40px_rgba(205,86,86,0.6)] dark:shadow-[0_0_40px_rgba(255,179,174,0.4)] scale-110 animate-pulse' : 'bg-[#CD5656]/5 dark:bg-[#ffb3ae]/10 text-[#CD5656] dark:text-[#ffb3ae] shadow-[0_0_20px_rgba(205,86,86,0.1)] dark:shadow-[0_0_20px_rgba(255,179,174,0.1)] hover:bg-[#CD5656]/10 dark:hover:bg-[#ffb3ae]/20'}`}
            >
              <span className="material-symbols-outlined text-5xl">mic</span>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface dark:text-[#e5e2e1] mb-2">
              {isRecording ? "Listening..." : "How can I help you today?"}
            </h3>
            <p className="font-label text-sm text-on-surface-variant dark:text-[#e5e2e1]/60">
              {isRecording ? "Speak your directive clearly." : "System listening for operational directives..."}
            </p>

            {/* Dynamic Web Audio API Waveform */}
            <div className={`absolute bottom-32 w-full h-24 flex items-center justify-center gap-1.5 pointer-events-none transition-opacity duration-500 ${isRecording ? 'opacity-90' : 'opacity-30'}`}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div 
                  key={i}
                  className="w-1.5 bg-[#CD5656] dark:bg-[#ffb3ae] rounded-full shadow-[0_0_10px_rgba(205,86,86,0.5)] dark:shadow-[0_0_10px_rgba(255,179,174,0.4)]"
                  animate={{ height: getBarHeight(i) }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col justify-end">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] md:max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#CD5656] dark:bg-[#cc3a3a] text-white dark:text-[#fff2f0] rounded-br-sm shadow-md' 
                      : 'bg-surface-container-high dark:bg-[#2a2a2a] text-on-surface dark:text-[#e5e2e1] rounded-bl-sm border border-[#AF3E3E]/10 dark:border-[#5b403d]/15'
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

      {/* Input Bar */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-20">
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
