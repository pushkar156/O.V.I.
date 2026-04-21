"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <>
      <aside className="h-screen w-64 border-r fixed left-0 top-0 border-[#AF3E3E]/10 bg-[#EAEBD0] flex flex-col py-6 shadow-sm z-50">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold font-['Public_Sans'] text-[#AF3E3E]">O.V.I. Command</h1>
          <p className="font-['Lexend'] text-xs text-[#AF3E3E]/70 uppercase tracking-widest">Operational Intelligence</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          <a className="flex items-center gap-3 px-4 py-3 text-[#CD5656] font-bold border-r-4 border-[#CD5656] bg-[#DA6C6C]/10 transition-colors" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-['Lexend'] text-sm">Command Center</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 font-['Lexend'] hover:bg-[#DA6C6C]/5 transition-colors" href="/memory">
            <span className="material-symbols-outlined">psychology</span>
            <span className="text-sm">AI Analytics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 font-['Lexend'] hover:bg-[#DA6C6C]/5 transition-colors" href="#">
            <span className="material-symbols-outlined">health_and_safety</span>
            <span className="text-sm">System Health</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 font-['Lexend'] hover:bg-[#DA6C6C]/5 transition-colors" href="#">
            <span className="material-symbols-outlined">hub</span>
            <span className="text-sm">Fleet Overview</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 font-['Lexend'] hover:bg-[#DA6C6C]/5 transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </a>
        </nav>
        <div className="px-4 mt-auto">
          <button className="w-full bg-[#CD5656] text-white py-3 rounded-lg font-['Lexend'] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md">
            <span className="material-symbols-outlined text-sm">add</span>
            New Simulation
          </button>
        </div>
      </aside>

      <header className="h-16 w-full sticky top-0 z-40 border-b border-[#AF3E3E]/10 bg-[#EAEBD0]/95 backdrop-blur-md flex justify-between items-center px-6 pl-72">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black font-['Public_Sans'] text-[#AF3E3E]">O.V.I. System</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input className="bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-[#DA6C6C] outline-none transition-all font-['Lexend']" placeholder="Search operational logs..." type="text"/>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#AF3E3E]/80 hover:text-[#CD5656] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-2 text-[#AF3E3E]/80 hover:text-[#CD5656] transition-colors"><span className="material-symbols-outlined">help</span></button>
            <div className="h-8 w-8 rounded-full border-2 border-[#CD5656] overflow-hidden">
                {/* Fallback image if Google link dies */}
                <div className="w-full h-full bg-[#CD5656]" />
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 p-8 h-[calc(100vh-64px)] flex gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <section className="flex-1 bg-surface-container-lowest rounded-2xl border border-[#AF3E3E]/5 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #CD5656 0%, transparent 70%)" }}></div>
            <div className="z-10 text-center">
              <div className="mb-6 inline-flex p-4 rounded-full bg-[#CD5656]/5 text-[#CD5656] animate-pulse">
                <span className="material-symbols-outlined text-5xl">mic</span>
              </div>
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-2">How can I help you today?</h3>
              <p className="font-label text-sm text-on-surface-variant">System listening for operational directives...</p>
            </div>

            <div className="absolute bottom-32 w-full h-24 opacity-30 flex items-center justify-center gap-1">
              <div className="w-1.5 bg-[#CD5656] rounded-full h-8"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-16"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-24"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-12"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-32"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-18"></div>
              <div className="w-1.5 bg-[#CD5656] rounded-full h-12"></div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-surface-container rounded-xl p-2 flex items-center gap-4 shadow-xl border border-[#AF3E3E]/10">
                <button className="p-2 text-[#CD5656] hover:bg-surface-variant rounded-lg transition-colors">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input className="flex-1 bg-transparent border-none outline-none focus:ring-0 font-['Lexend'] text-on-surface" placeholder="Type a command or ask a question..." type="text"/>
                <button className="bg-[#AF3E3E] text-white p-2.5 rounded-lg flex items-center justify-center active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container-high p-5 rounded-2xl border border-[#AF3E3E]/5 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 transition-all">
              <div className="p-3 bg-white rounded-xl text-[#CD5656] shadow-sm">
                <span className="material-symbols-outlined">sync</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm">Sync</h4>
                <p className="font-label text-xs text-on-surface-variant">Update fleet nodes</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-5 rounded-2xl border border-[#AF3E3E]/5 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 transition-all">
              <div className="p-3 bg-white rounded-xl text-[#CD5656] shadow-sm">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm">Hub</h4>
                <p className="font-label text-xs text-on-surface-variant">Manage connections</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-5 rounded-2xl border border-[#AF3E3E]/5 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 transition-all">
              <div className="p-3 bg-white rounded-xl text-[#CD5656] shadow-sm">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm">Vault</h4>
                <p className="font-label text-xs text-on-surface-variant">Encrypted assets</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-80 flex flex-col gap-6">
          <section className="bg-surface-container p-6 rounded-2xl border border-[#AF3E3E]/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-on-surface">System Vitals</h3>
              <span className="material-symbols-outlined text-[#AF3E3E]/50">monitoring</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label text-xs text-on-surface-variant">CPU Usage</span>
                  <span className="font-label text-xs font-bold text-[#CD5656]">42%</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-[#CD5656] rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label text-xs text-on-surface-variant">Memory Allocation</span>
                  <span className="font-label text-xs font-bold text-[#CD5656]">8.4 GB</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-[#CD5656] rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-label text-xs text-on-surface-variant">Bandwidth Sync</span>
                  <span className="font-label text-xs font-bold text-[#CD5656]">1.2 GB/s</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-[#CD5656] rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 bg-[#CD5656] rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">Daily Insight</span>
              <h4 className="font-headline text-xl font-bold mb-3 leading-tight">Neural patterns suggest 12% optimization in data routing.</h4>
              <p className="font-body text-sm text-white/80 mb-6">Review the latest fleet telemetry to apply these changes automatically.</p>
              <button className="w-full bg-white text-[#CD5656] py-3 rounded-lg font-label font-bold text-xs hover:bg-[#EAEBD0] transition-colors">
                  OPTIMIZE NOW
              </button>
            </div>
          </section>

          <div className="bg-surface-container-highest p-4 rounded-xl flex items-center gap-3">
            <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-label text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">System Status: Nominal</span>
          </div>
        </aside>
      </main>
    </>
  );
}
