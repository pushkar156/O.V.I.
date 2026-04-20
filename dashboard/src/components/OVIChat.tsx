"use client";

import React, { useState } from 'react';
import { Terminal, MessageSquare, Send } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const OVIChat: React.FC = () => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        // Logic to send to API will go in lib/ovi-client.ts
        console.log("Sending command:", input);
        setInput("");
    };

    return (
        <div className="w-full max-w-3xl mx-auto z-50">
            <GlassPanel className="p-1 mb-4" hoverGlow>
                <form onSubmit={handleSubmit} className="flex items-center px-4 gap-4 bg-white/[0.02]">
                    <Terminal size={20} className="text-white/20" />
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter direct command..." 
                        className="w-full bg-transparent border-none outline-none py-4 text-sm placeholder:text-white/20 text-white"
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
