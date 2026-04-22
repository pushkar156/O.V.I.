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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
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
      await oviClient.startRecording();
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

  return (
    <section className="flex-1 bg-surface-container-lowest rounded-2xl border border-[#AF3E3E]/5 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #CD5656 0%, transparent 70%)" }}></div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto z-10 px-4 md:px-8 pt-8 pb-32 flex flex-col scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div 
              onClick={toggleRecording}
              className={`mb-6 inline-flex p-4 rounded-full cursor-pointer transition-all duration-300 ${isRecording ? 'bg-[#CD5656] text-white shadow-[0_0_40px_rgba(205,86,86,0.6)] scale-110 animate-pulse' : 'bg-[#CD5656]/5 text-[#CD5656] shadow-[0_0_20px_rgba(205,86,86,0.1)] hover:bg-[#CD5656]/10'}`}
            >
              <span className="material-symbols-outlined text-5xl">mic</span>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">
              {isRecording ? "Listening..." : "How can I help you today?"}
            </h3>
            <p className="font-label text-sm text-on-surface-variant">
              {isRecording ? "Speak your directive clearly." : "System listening for operational directives..."}
            </p>

            {/* Static Waveform from design */}
            <div className={`absolute bottom-32 w-full h-24 flex items-center justify-center gap-1 pointer-events-none transition-opacity duration-500 ${isRecording ? 'opacity-80' : 'opacity-30'}`}>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_1s_infinite]' : 'h-8'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_1.2s_infinite]' : 'h-16'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_0.8s_infinite]' : 'h-24'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_1.5s_infinite]' : 'h-12'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_0.9s_infinite]' : 'h-32'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_1.1s_infinite]' : 'h-18'}`}></div>
              <div className={`w-1.5 bg-[#CD5656] rounded-full ${isRecording ? 'animate-[bounce_1.3s_infinite]' : 'h-12'}`}></div>
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
                      ? 'bg-[#CD5656] text-white rounded-br-sm shadow-md' 
                      : 'bg-surface-container-high text-on-surface rounded-bl-sm border border-[#AF3E3E]/10'
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
        <form onSubmit={handleSubmit} className="bg-surface-container rounded-xl p-2 flex items-center gap-2 md:gap-4 shadow-xl border border-[#AF3E3E]/10">
          <button 
            type="button" 
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${isRecording ? 'text-white bg-[#CD5656] animate-pulse' : 'text-[#CD5656] hover:bg-surface-variant'}`}
          >
            <span className="material-symbols-outlined">{isRecording ? 'stop_circle' : 'mic'}</span>
          </button>
          <input 
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 font-['Lexend'] text-on-surface text-sm w-full min-w-0" 
            placeholder="Type a command or ask a question..." 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-[#AF3E3E] text-white p-2 md:p-2.5 rounded-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-[#9f3f41] shrink-0">
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </section>
  );
};
