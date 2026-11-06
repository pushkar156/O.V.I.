"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useTheme } from 'next-themes';

interface SystemWidgetProps {
  label: string;
  value: string | number;
  unit?: string;
  progress: number; // 0 to 100
  colorClass?: string; // Optional tailwind color class override
  history?: any[];
  dataKey?: string;
}

export const SystemWidget: React.FC<SystemWidgetProps> = ({ 
  label, 
  value, 
  unit = "", 
  progress,
  colorClass = "bg-[#D97706] dark:bg-[#F59E0B]",
  history = [],
  dataKey
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between mb-2">
        <span className="font-label text-xs text-on-surface-variant dark:text-[#a6bcc7] group-hover:text-on-surface dark:group-hover:text-[#e5e2e1] transition-colors">{label}</span>
        <span className="font-label text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
          {value}{unit}
        </span>
      </div>
      <div className="h-2 w-full bg-surface-variant dark:bg-[#353534] rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full ${colorClass.includes('#D97706') ? 'bg-[#D97706] dark:bg-[#F59E0B]' : colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {isExpanded && history.length > 0 && dataKey && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 60, opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="w-full overflow-hidden"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={mounted && theme === 'dark' ? '#F59E0B' : '#D97706'}
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false} // Disable recharts built-in animation for smoother real-time feel
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
