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
  progress
}) => {
  // Threshold logic
  const getColor = (val: number) => {
    if (val < 60) return "#22c55e"; // Green
    if (val < 85) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const color = getColor(progress);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 flex items-center gap-4 w-full max-w-xs"
    >
      {/* Progress Ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
         <svg className="w-full h-full -rotate-90">
            <circle
              cx="32" cy="32" r="28"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="transparent"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={175.92}
              animate={{ strokeDashoffset: 175.92 - (175.92 * progress) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color}44)` }}
            />
         </svg>
         <div className="absolute">
            <Icon size={18} style={{ color }} className="opacity-60" />
         </div>
      </div>

      {/* Numerical Data */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {value}
          </span>
          <span className="text-[10px] text-white/20 font-mono uppercase">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};
