"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Command Center", href: "/", icon: "dashboard" },
    { name: "Neural Chat", href: "/chat", icon: "forum" },
    { name: "AI Analytics", href: "/memory", icon: "psychology" },
  ];

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
      <aside className={`h-screen border-r fixed left-0 top-0 border-[#AF3E3E]/10 dark:border-[#5b403d]/15 bg-[#EAEBD0] dark:bg-[#1c1b1b]/95 backdrop-blur-xl flex flex-col py-6 shadow-sm z-50 transition-all duration-300 lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        
        <div className={`px-6 mb-8 flex justify-between items-center ${isSidebarCollapsed ? 'px-4 flex-col gap-4' : ''}`}>
          {!isSidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold font-['Public_Sans'] text-[#AF3E3E] dark:text-[#ffb3ae]">O.V.I. Command</h1>
              <p className="font-['Lexend'] text-xs text-[#AF3E3E]/70 dark:text-white/40 uppercase tracking-widest">Operational Intelligence</p>
            </div>
          )}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#DA6C6C]/10 dark:hover:bg-[#353534] text-[#AF3E3E] dark:text-[#ffb3ae] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              {isSidebarCollapsed ? 'side_navigation' : 'menu_open'}
            </span>
          </button>

          <button 
            className="lg:hidden text-[#AF3E3E] dark:text-[#ffb3ae] p-1"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all font-['Lexend'] text-sm relative group ${
                  isActive 
                    ? 'text-[#CD5656] dark:text-[#fff2f0] font-bold bg-[#DA6C6C]/10 dark:bg-[#cc3a3a]' 
                    : 'text-[#AF3E3E]/70 dark:text-[#a6bcc7] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1]'
                } ${isSidebarCollapsed ? 'justify-center px-0 mx-1' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.name}</span>}
                
                {isSidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-[#1c1b1b] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                        {item.name}
                    </div>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-3 mb-4">
            <Link 
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-[#AF3E3E]/70 dark:text-[#a6bcc7] font-['Lexend'] hover:bg-[#DA6C6C]/5 dark:hover:bg-[#353534] dark:hover:text-[#e5e2e1] rounded-lg mx-2 transition-colors text-sm"
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </Link>
        </div>

        <div className="px-4 mt-auto">
          <button className="w-full bg-[#CD5656] dark:bg-surface-container-lowest dark:text-[#ffb3ae] text-white py-3 rounded-lg font-['Lexend'] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md dark:border dark:border-outline-variant/10">
            <span className="material-symbols-outlined text-sm">add</span>
            New Simulation
          </button>
        </div>
      </aside>

      {/* Top Header */}
      <header className={`h-16 w-full fixed top-0 z-30 border-b border-[#AF3E3E]/10 dark:border-[#5b403d]/15 bg-[#EAEBD0]/95 dark:bg-[#131313]/95 backdrop-blur-md flex justify-between items-center px-4 lg:px-6 transition-all duration-300 electron-drag select-none ${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'}`}>
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 text-[#AF3E3E] dark:text-[#ffb3ae] electron-no-drag"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="text-lg font-black font-['Public_Sans'] text-[#AF3E3E] dark:text-[#ffb3ae] hidden sm:block">
            {pathname === '/memory' ? 'AI Analytics' : 'O.V.I. System'}
          </h2>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="relative group hidden md:block electron-no-drag">
            <input className="bg-surface-container-low dark:bg-surface-container-lowest dark:border dark:border-[#5b403d]/15 border-none rounded-lg py-1.5 pl-10 pr-4 text-sm w-48 lg:w-64 dark:text-[#e5e2e1] focus:ring-2 focus:ring-[#DA6C6C] dark:focus:ring-transparent outline-none transition-all font-['Lexend'] placeholder:text-[#e5e2e1]/30" placeholder="Execute command..." type="text"/>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#ffb3ae]/60 text-lg">search</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 electron-no-drag">
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
            <div className="h-8 w-8 rounded-full border-2 border-[#CD5656] dark:border-[#ffb3ae]/20 overflow-hidden ml-2">
                <div className="w-full h-full bg-[#CD5656] dark:bg-[#1c1b1b]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className={`pt-16 transition-all duration-300 min-h-screen flex flex-col ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {children}
      </div>
    </>
  );
}
