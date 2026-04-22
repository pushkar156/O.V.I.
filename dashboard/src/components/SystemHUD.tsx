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

  // Simulated live updates (replace with OVIClient later)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 10 - 5))),
        network_speed: Math.max(0.1, Math.min(5.0, prev.network_speed + (Math.random() * 0.4 - 0.2))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-surface-container p-6 rounded-2xl border border-[#AF3E3E]/10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-on-surface">System Vitals</h3>
        <span className="material-symbols-outlined text-[#AF3E3E]/50">monitoring</span>
      </div>
      
      <div className="space-y-6">
        <SystemWidget 
          label="CPU Usage" 
          value={Math.round(stats.cpu)} 
          unit="%" 
          progress={stats.cpu} 
        />
        <SystemWidget 
          label="Memory Allocation" 
          value={stats.ram_used.toFixed(1)} 
          unit={` / ${stats.ram_total} GB`} 
          progress={stats.ram_percent} 
        />
        <SystemWidget 
          label="Bandwidth Sync" 
          value={stats.network_speed.toFixed(1)} 
          unit=" GB/s" 
          progress={Math.min((stats.network_speed / 5) * 100, 100)} 
        />
      </div>
    </section>
  );
};
