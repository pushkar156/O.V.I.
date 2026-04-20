"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemWidgetProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  progress: number; // 0 to 100
  color?: string;
}

export const SystemWidget: React.FC<SystemWidgetProps> = ({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  progress,
  color = "var(--primary)" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel ghost-border rounded-2xl p-4 flex items-center gap-4 w-full max-w-xs"
    >
      {/* Progress Ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
         <svg className="w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/5"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={175.92}
              initial={{ strokeDashoffset: 175.92 }}
              animate={{ strokeDashoffset: 175.92 - (175.92 * progress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            />
         </svg>
         <div className="absolute">
            <Icon size={18} className="text-white/40" />
         </div>
      </div>

      {/* Numerical Data */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold tracking-tight">{value}</span>
          <span className="text-xs text-white/40">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};
