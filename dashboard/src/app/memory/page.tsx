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

export default function MemoryPage() {
  const [search, setSearch] = useState("");

  const facts = [
    { title: "User Preference", detail: "Prefers the Obsidian Command tactical dark mode.", date: "2 days ago" },
    { title: "Project Status", detail: "O.V.I. Phase 3 UI integration is fully complete.", date: "5 hours ago" },
    { title: "System Note", detail: "Ollama is running qwen2.5:1.5b locally on GPU.", date: "Yesterday" },
  ];

  return (
    <main className="flex h-screen w-full bg-background dark:bg-[#131313] text-on-background dark:text-[#e5e2e1] overflow-hidden p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
        
        {/* Memory Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-4">
             <Link href="/" className="flex items-center gap-2 text-[#AF3E3E]/70 dark:text-[#a6bcc7] hover:text-[#CD5656] dark:hover:text-[#e5e2e1] transition-colors group w-fit">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase font-['Lexend'] tracking-widest font-bold">Back to HUD</span>
             </Link>
             <div>
                <h1 className="text-3xl md:text-4xl font-black font-['Public_Sans'] text-[#AF3E3E] dark:text-[#ffb3ae] flex items-center gap-3">
                    <Brain className="text-[#CD5656] dark:text-[#cc3a3a]" size={36} />
                    Neural Memory
                </h1>
                <p className="text-on-surface-variant dark:text-[#a6bcc7] text-sm mt-1 font-['Lexend']">Archived intelligence and extracted world facts.</p>
             </div>
          </div>
          
          <div className="bg-surface-container-high dark:bg-[#201f1f] px-4 py-3 flex items-center gap-3 rounded-xl border border-[#AF3E3E]/10 dark:border-[#5b403d]/15 shadow-sm w-full md:w-auto">
             <Search size={18} className="text-[#AF3E3E]/50 dark:text-[#a6bcc7]" />
             <input 
               type="text" 
               placeholder="Search synapses..." 
               className="bg-transparent border-none outline-none text-sm w-full md:w-64 text-on-surface dark:text-[#e5e2e1] placeholder:text-on-surface-variant/50 dark:placeholder:text-[#e5e2e1]/30 font-['Lexend']"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </header>

        {/* Memory Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden pb-8">
          
          {/* Left: Long Term Facts */}
          <section className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
            <h3 className="text-[10px] uppercase tracking-widest text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-bold font-['Lexend'] flex items-center gap-2">
                <Database size={14} /> Extracted Data
            </h3>
            {facts.map((fact, idx) => (
              <div key={idx} className="bg-surface-container dark:bg-[#1c1b1b] p-6 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all group relative shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[#CD5656] dark:text-[#ffb3ae] text-sm font-bold font-headline">{fact.title}</h4>
                    <span className="text-[10px] text-on-surface-variant/60 dark:text-[#a6bcc7] font-mono">{fact.date}</span>
                 </div>
                 <p className="text-on-surface-variant dark:text-[#e5e2e1]/80 text-sm leading-relaxed font-body">{fact.detail}</p>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                    <button className="text-[#AF3E3E]/50 dark:text-[#a6bcc7] hover:text-[#DA6C6C] dark:hover:text-[#ffb3ae] transition-colors"><Bookmark size={16} /></button>
                    <button className="text-[#AF3E3E]/50 dark:text-[#a6bcc7] hover:text-red-600 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                 </div>
              </div>
            ))}
          </section>

          {/* Right: Recent Interactions */}
          <section className="flex flex-col gap-4">
             <h3 className="text-[10px] uppercase tracking-widest text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-bold font-['Lexend'] flex items-center gap-2">
                <Clock size={14} /> Temporal Buffer
            </h3>
             <div className="bg-surface-container dark:bg-[#1c1b1b] border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 rounded-2xl flex-1 p-6 flex flex-col gap-6 shadow-sm overflow-y-auto scrollbar-hide">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-l-2 border-[#CD5656]/20 dark:border-[#5b403d] pl-4 py-1">
                        <p className="text-[10px] text-[#CD5656] dark:text-[#a6bcc7] font-bold tracking-wider mb-1">SESSION_ID_{1024 + i}</p>
                        <p className="text-xs text-on-surface-variant dark:text-[#e5e2e1]/70 mb-2">Discussed system optimization and hardware monitoring.</p>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#CD5656] dark:bg-[#cc3a3a]" />
                           <span className="text-[9px] text-[#AF3E3E]/70 dark:text-[#a6bcc7] uppercase font-bold tracking-wider">14 Messages</span>
                        </div>
                    </div>
                ))}
                <div className="mt-auto pt-6 border-t border-[#AF3E3E]/10 dark:border-[#5b403d]/30">
                   <button className="w-full py-3 bg-[#CD5656]/10 dark:bg-[#353534] text-[#CD5656] dark:text-[#ffb3ae] border border-[#CD5656]/20 dark:border-transparent rounded-lg text-xs uppercase tracking-widest hover:bg-[#CD5656]/20 dark:hover:bg-[#cc3a3a] dark:hover:text-white transition-all font-bold">
                        Purge Buffer
                   </button>
                </div>
             </div>
          </section>
        </div>
      </div>
    </main>
  );
}
