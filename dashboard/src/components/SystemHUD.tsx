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

  // Listen to WebSocket for live updates
  useEffect(() => {
    let lastNetworkBytes = 0;
    
    // Handler for messages from the WebSocket
    const handleMessage = (data: any) => {
      if (data.type === "stats") {
        const { local: payload, agents } = data.payload;
        
        if (!payload) return;

        // Calculate network speed (MB/s) since last ping
        const currentBytes = payload.network.bytes_recv + payload.network.bytes_sent;
        let speedMBps = 0;
        if (lastNetworkBytes > 0) {
          speedMBps = (currentBytes - lastNetworkBytes) / (1024 * 1024) / 2;
        }
        lastNetworkBytes = currentBytes;

        const now = new Date();
        const timeStr = `${now.getSeconds()}s`;

        setStats({
          cpu: payload.cpu,
          ram_percent: payload.ram.percent,
          ram_used: payload.ram.used,
          ram_total: payload.ram.total,
          network_speed: speedMBps,
        });

        setHistory(h => {
          const newHistory = [...h, { 
            time: timeStr, 
            cpu: payload.cpu, 
            ram: payload.ram.percent, 
            net: speedMBps 
          }];
          if (newHistory.length > 20) newHistory.shift();
          return newHistory;
        });
      }
    };

    import("@/lib/ovi-client").then(({ oviClient }) => {
       oviClient.onMessage(handleMessage);
    });

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
