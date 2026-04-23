"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { SystemHUD } from "@/components/SystemHUD";
import { OVIChat } from "@/components/OVIChat";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (Navigation) */}
      <aside className={`h-screen w-64 border-r fixed left-0 top-0 border-[#AF3E3E]/10 dark:border-[#5b403d]/15 bg-[#EAEBD0] dark:bg-[#1c1b1b]/95 backdrop-blur-xl flex flex-col py-6 shadow-sm z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold font-['Public_Sans'] text-[#AF3E3E] dark:text-[#ffb3ae]">O.V.I. Command</h1>
            <p className="font-['Lexend'] text-xs text-[#AF3E3E]/70 dark:text-white/40 uppercase tracking-widest">Operational Intelligence</p>
          </div>
          <button 
            className="lg:hidden text-[#AF3E3E] dark:text-[#ffb3ae] p-1"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          <a className="flex items-center gap-3 px-4 py-3 text-[#CD5656] dark:text-[#fff2f0] font-bold border-r-4 border-[#CD5656] dark:border-transparent bg-[#DA6C6C]/10 dark:bg-[#cc3a3a] rounded-lg mx-2 transition-colors" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-['Lexend'] text-sm">Command Center</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-['Lexend'] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1] rounded-lg mx-2 transition-colors" href="/memory">
            <span className="material-symbols-outlined">psychology</span>
            <span className="text-sm">AI Analytics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-['Lexend'] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1] rounded-lg mx-2 transition-colors" href="#">
            <span className="material-symbols-outlined">health_and_safety</span>
            <span className="text-sm">System Health</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-['Lexend'] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1] rounded-lg mx-2 transition-colors" href="#">
            <span className="material-symbols-outlined">hub</span>
            <span className="text-sm">Fleet Overview</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-['Lexend'] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1] rounded-lg mx-2 transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </a>
        </nav>
        <div className="px-4 mt-auto">
          <button className="w-full bg-[#CD5656] dark:bg-surface-container-lowest dark:text-[#ffb3ae] text-white py-3 rounded-lg font-['Lexend'] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md dark:border dark:border-outline-variant/10">
            <span className="material-symbols-outlined text-sm">add</span>
            New Simulation
          </button>
        </div>
      </aside>

      {/* Top Header */}
      <header className="h-16 w-full sticky top-0 z-30 border-b border-[#AF3E3E]/10 dark:border-[#5b403d]/15 bg-[#EAEBD0]/95 dark:bg-[#131313]/95 backdrop-blur-md flex justify-between items-center px-4 lg:px-6 lg:pl-72 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 text-[#AF3E3E] dark:text-[#ffb3ae]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="text-lg font-black font-['Public_Sans'] text-[#AF3E3E] dark:text-[#ffb3ae] hidden sm:block">O.V.I. System</h2>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="relative group hidden md:block">
            <input className="bg-surface-container-low dark:bg-surface-container-lowest dark:border dark:border-[#5b403d]/15 border-none rounded-lg py-1.5 pl-10 pr-4 text-sm w-48 lg:w-64 dark:text-[#e5e2e1] focus:ring-2 focus:ring-[#DA6C6C] dark:focus:ring-transparent outline-none transition-all font-['Lexend'] placeholder:text-[#e5e2e1]/30" placeholder="Execute command..." type="text"/>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#ffb3ae]/60 text-lg">search</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-[#AF3E3E]/80 dark:text-[#ffb3ae] hover:text-[#CD5656] dark:hover:bg-[#353534]/50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}
            <button className="p-2 text-[#AF3E3E]/80 dark:text-[#ffb3ae] hover:text-[#CD5656] dark:hover:bg-[#353534]/50 rounded-lg transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-2 text-[#AF3E3E]/80 dark:text-[#ffb3ae] hover:text-[#CD5656] dark:hover:bg-[#353534]/50 rounded-lg transition-colors hidden sm:block"><span className="material-symbols-outlined">settings_input_component</span></button>
            <div className="h-8 w-8 rounded-full border-2 border-[#CD5656] dark:border-[#ffb3ae]/20 overflow-hidden ml-2">
                <div className="w-full h-full bg-[#CD5656] dark:bg-[#1c1b1b]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 min-h-[calc(100vh-64px)] xl:h-[calc(100vh-64px)] flex flex-col xl:flex-row gap-6 lg:gap-8 overflow-x-hidden xl:overflow-hidden">
        
        {/* Center Panel (Chat & Tools) */}
        <div className="flex-1 flex flex-col gap-6 min-h-[600px] xl:min-h-0 xl:h-full">
          <OVIChat />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 shrink-0">
            <div className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all">
              <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
                <span className="material-symbols-outlined">sync</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Sync</h4>
                <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Update fleet</p>
              </div>
            </div>
            <div className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all">
              <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Hub</h4>
                <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Manage connections</p>
              </div>
            </div>
            <div className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all">
              <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Vault</h4>
                <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Encrypted assets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (System Vitals) */}
        <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0 xl:overflow-y-auto scrollbar-hide xl:pb-4">
          <SystemHUD />

          <section className="flex-1 bg-[#CD5656] dark:bg-surface-container-lowest dark:border dark:border-[#5b403d]/15 rounded-2xl p-6 text-white relative overflow-hidden group min-h-[200px]">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[120px] dark:text-[#ffb3ae]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 dark:bg-[#353534] text-[10px] font-bold uppercase tracking-widest mb-4 dark:text-primary">Daily Insight</span>
              <h4 className="font-headline text-xl font-bold mb-3 leading-tight dark:text-[#e5e2e1]">Neural patterns suggest 12% optimization in data routing.</h4>
              <p className="font-body text-sm text-white/80 dark:text-[#a6bcc7] mb-6">Review the latest fleet telemetry to apply these changes automatically.</p>
              <button className="w-full bg-white dark:bg-[#ffb3ae] text-[#CD5656] dark:text-[#131313] py-3 rounded-lg font-label font-bold text-xs hover:bg-[#EAEBD0] dark:hover:bg-[#ffdad7] transition-colors mt-auto shadow-md">
                  OPTIMIZE NOW
              </button>
            </div>
          </section>

          <div className="bg-surface-container-highest dark:bg-[#1c1b1b] dark:border dark:border-[#5b403d]/15 p-4 rounded-xl flex items-center gap-3">
            <div className="h-2.5 w-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="font-label text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant dark:text-on-surface-variant">System Status: Nominal</span>
          </div>
        </aside>
      </main>
    </>
  );
}
