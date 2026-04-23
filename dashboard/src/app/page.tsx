"use client";

import React from "react";
import { motion } from "framer-motion";
import { SystemHUD } from "@/components/SystemHUD";
import { OVIChat } from "@/components/OVIChat";
import { DeviceStatus } from "@/components/DeviceStatus";

export default function DashboardPage() {
  return (
    <main className="p-4 lg:p-8 xl:h-[calc(100vh-64px)] flex flex-col xl:flex-row gap-6 lg:gap-8 overflow-x-hidden xl:overflow-hidden flex-1">
      
      {/* Center Panel (Chat & Tools) */}
      <div className="flex-1 flex flex-col gap-6 min-h-[600px] xl:min-h-0 xl:h-full">
        <OVIChat />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 shrink-0">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all shadow-sm"
          >
            <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Sync</h4>
              <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Update fleet</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all shadow-sm"
          >
            <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Hub</h4>
              <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Manage connections</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-surface-container-high dark:bg-[#201f1f] p-4 lg:p-5 rounded-2xl border border-[#AF3E3E]/5 dark:border-[#5b403d]/15 flex items-center gap-4 group cursor-pointer hover:border-[#CD5656]/30 dark:hover:border-[#ffb3ae]/30 transition-all shadow-sm"
          >
            <div className="p-3 bg-white dark:bg-[#353534] rounded-xl text-[#CD5656] dark:text-[#ffb3ae] shadow-sm">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm dark:text-[#e5e2e1]">Vault</h4>
              <p className="font-label text-xs text-on-surface-variant dark:text-on-surface-variant">Encrypted assets</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar (System Vitals & Fleet) */}
      <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0 xl:overflow-y-auto scrollbar-hide xl:pb-4">
        <SystemHUD />
        <DeviceStatus />

        <div className="bg-surface-container-highest dark:bg-[#1c1b1b] dark:border dark:border-[#5b403d]/15 p-4 rounded-xl flex items-center gap-3">
          <div className="h-2.5 w-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-label text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant dark:text-on-surface-variant">System Status: Nominal</span>
        </div>
      </aside>
    </main>
  );
}
