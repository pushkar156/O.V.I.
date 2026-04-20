"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface VoiceOrbProps {
  isListening?: boolean;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ isListening }) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Pulse Rings */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 blur-sm"
      />
      
      {/* Main Holographic Sphere */}
      <motion.div 
        animate={isListening ? { scale: [1, 1.05, 1], rotate: 360 } : { rotate: 360 }}
        transition={{ scale: { duration: 1.5, repeat: Infinity }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
        className="relative w-48 h-48 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.2)]"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 animate-pulse-slow" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="w-24 h-24 bg-primary rounded-full blur-[40px] opacity-40 animate-pulse" />
      </motion.div>
    </div>
  );
};
