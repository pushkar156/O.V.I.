"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SystemWidgetProps {
  label: string;
  value: string | number;
  unit?: string;
  progress: number; // 0 to 100
  colorClass?: string; // Optional tailwind color class override
}

export const SystemWidget: React.FC<SystemWidgetProps> = ({ 
  label, 
  value, 
  unit = "", 
  progress,
  colorClass = "bg-[#CD5656]"
}) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-label text-xs text-on-surface-variant">{label}</span>
        <span className="font-label text-xs font-bold text-[#CD5656]">
          {value}{unit}
        </span>
      </div>
      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
