import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-black/40">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
              ? 'bg-[#CD5656] text-white rounded-br-none' 
              : 'glass text-white rounded-bl-none border-white/5'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 mb-32">
        <form onSubmit={handleSend} className="glass rounded-2xl p-2 flex gap-2">
          <input 
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white placeholder:text-white/20" 
            placeholder="Neural Directive..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="w-10 h-10 bg-[#CD5656] rounded-xl flex items-center justify-center text-white">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileChat;
