"use client";

import React from "react";
import { 
  Activity, 
  MessageSquare, 
  Cpu, 
  Settings, 
  Mic, 
  Terminal,
  Grid
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* 1. Neural Navigation Sidebar */}
      <aside className="w-20 glass-panel ghost-border flex flex-col items-center py-8 gap-10">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <Activity className="text-background" size={24} />
        </div>
        
        <nav className="flex flex-col gap-6 text-white/50">
          <button className="p-3 rounded-lg hover:bg-white/10 hover:text-primary transition-all">
            <Grid size={24} />
          </button>
          <button className="p-3 rounded-lg hover:bg-white/10 hover:text-primary transition-all">
            <MessageSquare size={24} />
          </button>
          <button className="p-3 rounded-lg hover:bg-white/10 hover:text-primary transition-all">
            <Cpu size={24} />
          </button>
          <div className="flex-1" />
          <button className="p-3 rounded-lg hover:bg-white/10 hover:text-white transition-all">
            <Settings size={24} />
          </button>
        </nav>
      </aside>

      {/* 2. Main Holographic Surface */}
      <section className="flex-1 relative flex flex-col p-8">
        {/* Header HUD */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-glow-cyan">O.V.I. Command Center</h1>
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">System Status: Optimal</p>
          </div>
          <div className="flex gap-4">
             <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 ghost-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono">Neural Link: Online</span>
             </div>
          </div>
        </header>

        {/* Central Vision Area (Coming in 3.2) */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <div className="w-[500px] h-[500px] border border-primary/20 rounded-full animate-pulse-slow" />
             <div className="absolute w-[300px] h-[300px] border border-primary/10 rounded-full" />
          </div>
          
          <div className="text-center z-10">
             <div className="w-64 h-64 rounded-full bg-primary/5 flex items-center justify-center animate-glow-cyan border border-primary/20">
                <Mic size={80} className="text-primary/80 animate-pulse" />
             </div>
             <p className="mt-8 text-white/50 font-mono text-sm">Awaiting Voice Input...</p>
          </div>
        </div>

        {/* Bottom Command HUD */}
        <footer className="mt-auto">
          <div className="max-w-3xl mx-auto glass-panel p-1 rounded-2xl ghost-border overflow-hidden group focus-within:ring-1 ring-primary/40 transition-all">
             <div className="flex items-center px-4 gap-4 bg-white/[0.02]">
                <Terminal size={20} className="text-white/20" />
                <input 
                  type="text" 
                  placeholder="Enter direct command..." 
                  className="w-full bg-transparent border-none outline-none py-4 text-sm placeholder:text-white/20"
                />
                <button className="p-2 rounded-lg hover:bg-primary/10 text-white/40 hover:text-primary transition-colors">
                   <MessageSquare size={20} />
                </button>
             </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
