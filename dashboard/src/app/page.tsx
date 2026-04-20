"use client";

import React, { useState } from "react";
import { 
  Activity, 
  MessageSquare, 
  Cpu, 
  Settings, 
  Grid
} from "lucide-react";
import { SystemHUD } from "@/components/SystemHUD";
import { VoiceOrb } from "@/components/VoiceOrb";
import { OVIChat } from "@/components/OVIChat";
import { DeviceStatus } from "@/components/DeviceStatus";

export default function DashboardPage() {
  const [isListening, setIsListening] = useState(false);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-cosmic">
      {/* 1. Neural Navigation Sidebar */}
      <aside className="w-20 glass-panel ghost-border flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer hover:scale-105 transition-transform">
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
        <header className="flex justify-between items-center mb-6 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-glow-cyan">O.V.I. Command Center</h1>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase italic">The Ethereal Intelligence v0.1</p>
          </div>
          <div className="flex gap-4">
             <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 ghost-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono">Neural Link: Online</span>
             </div>
          </div>
        </header>

        <div className="flex flex-1 gap-8 relative overflow-hidden">
          {/* Left Column: Vision & Action */}
          <div className="flex-[2] flex flex-col items-center justify-center relative">
            <VoiceOrb isListening={isListening} />
            <p className="mt-12 text-white/40 font-mono text-xs tracking-[0.3em] uppercase">
              {isListening ? "Listening for command..." : "Awaiting Wake Word"}
            </p>
          </div>

          {/* Right Column: Status HUD */}
          <div className="flex-1 flex flex-col gap-6 py-6 z-10 max-w-xs">
            <SystemHUD />
            <DeviceStatus />
          </div>
        </div>

        {/* Bottom Command HUD */}
        <footer className="mt-auto px-20 z-10 pb-4">
          <OVIChat />
        </footer>
      </section>
    </main>
  );
}
