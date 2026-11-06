"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type OrbState = "idle" | "listening" | "processing" | "speaking";

interface VoiceOrbProps {
  state?: OrbState;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state = "idle" }) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <AnimatePresence mode="wait">
        {/* State: Listening - Expanding Rings */}
        {state === "listening" && (
          <motion.div 
            key="listening-rings"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                className="absolute w-40 h-40 border border-primary/40 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core */}
      <motion.div 
        animate={{ 
          scale: state === "speaking" ? [1, 1.1, 1] : 1,
          rotate: state === "processing" ? 360 : 0
        }}
        transition={state === "processing" ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
        className="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden"
      >
        {/* Core Glow */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          state === "idle" ? "bg-primary/20" : 
          state === "listening" ? "bg-primary/40" : 
          state === "processing" ? "bg-secondary/30" : 
          "bg-indigo-400/40"
        }`} />
        
        {/* Inner Pulse */}
        <motion.div 
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 bg-primary blur-[40px] rounded-full"
        />

        {/* The "Hologram" Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </motion.div>

      {/* Ambient Breathing (Standard for all states) */}
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full"
      />
    </div>
  );
};
