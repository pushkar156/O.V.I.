"use client";

import React from 'react';
import { Cpu, HardDrive, Zap } from 'lucide-react';
import { SystemWidget } from './SystemWidget';

export const SystemHUD: React.FC = () => {
  return (
    <aside className="w-80 flex flex-col gap-4 z-10">
      <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-2">System Telemetry</h3>
      <SystemWidget 
        label="Process Load" 
        value="24" 
        unit="%" 
        icon={Cpu} 
        progress={24} 
        color="#00E5FF" 
      />
      <SystemWidget 
        label="Neural Memory" 
        value="4.2" 
        unit="GB" 
        icon={HardDrive} 
        progress={68} 
        color="#9D50FF" 
      />
      <SystemWidget 
        label="Energy Core" 
        value="92" 
        unit="%" 
        icon={Zap} 
        progress={92} 
        color="#64FFDA" 
      />
    </aside>
  );
};
