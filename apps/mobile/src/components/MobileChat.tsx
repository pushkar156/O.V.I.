import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { oviMobile } from '../lib/api';

const MobileChat = ({ sessionID, onSetSession }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await oviMobile.sendChat(input, sessionID);
      if (res.conversation_id && !sessionID) {
        onSetSession(res.conversation_id);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural Link Offline." }]);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-[#1c1b1b]">
      {/* Messaging Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pt-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 px-10 text-center">
            <Bot className="w-12 h-12 text-[#AF3E3E] mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb3ae]">Awaiting Directives</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              m.role === 'user' 
              ? 'bg-[#AF3E3E] border-[#ffb3ae]/20 text-white' 
              : 'bg-[#2a2a2a] border-[#AF3E3E]/20 text-[#ffb3ae]'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
              m.role === 'user' 
              ? 'bg-[#AF3E3E] text-white rounded-tr-none font-medium' 
              : 'bg-[#2a2a2a] text-[#e5e2e1] rounded-tl-none border border-[#AF3E3E]/5'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 mb-28">
        <form onSubmit={handleSend} className="bg-[#201f1f] border border-[#AF3E3E]/20 rounded-2xl p-2 flex gap-2 shadow-2xl">
          <input 
            className="flex-1 bg-transparent border-none outline-none px-4 text-xs text-[#e5e2e1] placeholder:text-white/10 font-medium" 
            placeholder="Send directive to Core..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="w-11 h-11 bg-[#AF3E3E] rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-[0_0_15px_rgba(175,62,62,0.3)]">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileChat;
