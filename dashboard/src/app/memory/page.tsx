"use client";

import React, { useState } from "react";
import { 
  Search, 
  Brain, 
  Clock, 
  Database,
  ArrowLeft,
  Trash2,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/GlassPanel";

export default function MemoryPage() {
  const [search, setSearch] = useState("");

  const facts = [
    { title: "User Preference", detail: "Likes dark mode interfaces with high contrast.", date: "2 days ago" },
    { title: "Project Status", detail: "O.V.I. Phase 3 is 95% complete.", date: "5 hours ago" },
    { title: "System Note", detail: "Ollama is running qwen2.5:1.5b locally.", date: "Yesterday" },
  ];

  return (
    <main className="flex h-screen w-full bg-cosmic overflow-hidden p-8">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
        
        {/* Memory Header */}
        <header className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
             <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase font-mono tracking-widest">Back to HUD</span>
             </Link>
             <div>
                <h1 className="text-4xl font-bold tracking-tighter text-glow-cyan flex items-center gap-3">
                    <Brain className="text-primary" size={36} />
                    Neural Memory
                </h1>
                <p className="text-white/40 text-sm mt-1">Archived intelligence and extracted world facts.</p>
             </div>
          </div>
          
          <div className="glass-panel px-4 py-2 flex items-center gap-3 ghost-border">
             <Search size={18} className="text-white/20" />
             <input 
               type="text" 
               placeholder="Search synapses..." 
               className="bg-transparent border-none outline-none text-sm w-64"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </header>

        {/* Memory Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-8">
          
          {/* Left: Long Term Facts */}
          <section className="md:col-span-2 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
                <Database size={12} /> Extracted Data
            </h3>
            {facts.map((fact, idx) => (
              <GlassPanel key={idx} className="p-6 group relative" hoverGlow>
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="text-primary text-sm font-bold tracking-tight">{fact.title}</h4>
                    <span className="text-[10px] text-white/20 font-mono">{fact.date}</span>
                 </div>
                 <p className="text-white/70 text-sm leading-relaxed">{fact.detail}</p>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    <button className="text-white/20 hover:text-primary transition-colors"><Bookmark size={14} /></button>
                 </div>
              </GlassPanel>
            ))}
          </section>

          {/* Right: Recent Interactions */}
          <section className="flex flex-col gap-4">
             <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-mono flex items-center gap-2">
                <Clock size={12} /> Temporal Buffer
            </h3>
             <GlassPanel className="flex-1 p-6 flex flex-col gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-l border-white/5 pl-4 py-1">
                        <p className="text-[10px] text-primary/50 font-mono mb-1">SESSION_ID_{1024 + i}</p>
                        <p className="text-xs text-white/60 mb-2">Discussed system optimization and hardware monitoring.</p>
                        <div className="flex items-center gap-2">
                           <div className="w-1 h-1 rounded-full bg-primary" />
                           <span className="text-[8px] text-white/20 uppercase font-mono">14 Messages</span>
                        </div>
                    </div>
                ))}
                <div className="mt-auto pt-4 border-t border-white/5">
                   <button className="w-full py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all font-bold">
                        Purge Buffer
                   </button>
                </div>
             </GlassPanel>
          </section>
        </div>
      </div>
    </main>
  );
}
