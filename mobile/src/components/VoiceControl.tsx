import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    // In a real PWA, we'd trigger haptic feedback here
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setIsListening(!isListening);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 text-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Animated Rings */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.2 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-2 border-[#CD5656] rounded-full"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0.1 }}
                exit={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 border-2 border-[#ffb3ae] rounded-full"
              />
            </>
          )}
        </AnimatePresence>

        {/* The Core Orb */}
        <motion.div
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
            boxShadow: isListening 
              ? '0 0 80px rgba(205, 86, 86, 0.4)' 
              : '0 0 20px rgba(255, 255, 255, 0.05)'
          }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={toggleListening}
          className={`w-48 h-48 rounded-full flex items-center justify-center z-10 cursor-pointer transition-all duration-500 ${
            isListening ? 'bg-[#CD5656]' : 'bg-white/5 border border-white/10'
          }`}
        >
          <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-white animate-pulse' : 'bg-white/20'}`}></div>
        </motion.div>

        {/* Background Glow */}
        <div className={`absolute inset-[-40px] rounded-full blur-[60px] transition-all duration-1000 ${
          isListening ? 'bg-[#CD5656]/30' : 'bg-transparent'
        }`}></div>
      </div>

      <div className="mt-12 space-y-2">
        <h2 className="text-2xl font-bold font-['Sora'] text-white">
          {isListening ? "Listening..." : "O.V.I. Core"}
        </h2>
        <p className="text-white/40 text-sm font-medium">
          {isListening ? "I'm ready for your command" : "Tap to establish neural link"}
        </p>
      </div>

      {/* Suggested Actions (Micro-interactions) */}
      {!isListening && (
        <div className="absolute bottom-10 flex gap-3">
          {['Lock PC', 'Capture', 'Status'].map(action => (
            <button 
              key={action}
              className="px-4 py-2 rounded-full glass text-[10px] uppercase font-bold tracking-widest text-white/60"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
