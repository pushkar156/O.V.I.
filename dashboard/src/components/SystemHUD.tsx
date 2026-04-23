"use client";

import React, { useEffect, useState } from 'react';
import { SystemWidget } from './SystemWidget';

// Mock data to simulate WebSocket feed before we hook it up
export const SystemHUD: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: 42,
    ram_used: 8.4,
    ram_total: 16.0,
    ram_percent: 52.5,
    network_speed: 1.2,
  });

  const [history, setHistory] = useState<{time: string, cpu: number, ram: number, net: number}[]>([]);

  // Simulated live updates (replace with OVIClient later)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const nextCpu = Math.max(10, Math.min(100, prev.cpu + (Math.random() * 20 - 10)));
        const nextNet = Math.max(0.1, Math.min(5.0, prev.network_speed + (Math.random() * 0.8 - 0.4)));
        const nextRam = prev.ram_percent + (Math.random() * 2 - 1); // Slow variance

        const now = new Date();
        const timeStr = `${now.getSeconds()}s`;

        setHistory(h => {
          const newHistory = [...h, { time: timeStr, cpu: nextCpu, ram: nextRam, net: nextNet }];
          if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
          return newHistory;
        });

        return {
          ...prev,
          cpu: nextCpu,
          network_speed: nextNet,
          ram_percent: nextRam,
          ram_used: (nextRam / 100) * prev.ram_total
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-surface-container dark:bg-[#201f1f] p-6 rounded-2xl border border-[#AF3E3E]/10 dark:border-[#5b403d]/15 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-on-surface dark:text-[#e5e2e1]">System Vitals</h3>
        <span className="material-symbols-outlined text-[#AF3E3E]/50 dark:text-[#a6bcc7]">monitoring</span>
      </div>
      
      <div className="space-y-6">
        <SystemWidget 
          label="CPU Usage" 
          value={Math.round(stats.cpu)} 
          unit="%" 
          progress={stats.cpu} 
          dataKey="cpu"
          history={history}
        />
        <SystemWidget 
          label="Memory Allocation" 
          value={stats.ram_used.toFixed(1)} 
          unit={` / ${stats.ram_total} GB`} 
          progress={stats.ram_percent} 
          dataKey="ram"
          history={history}
        />
        <SystemWidget 
          label="Bandwidth Sync" 
          value={stats.network_speed.toFixed(1)} 
          unit=" GB/s" 
          progress={Math.min((stats.network_speed / 5) * 100, 100)} 
          dataKey="net"
          history={history}
        />
      </div>
    </section>
  );
};
