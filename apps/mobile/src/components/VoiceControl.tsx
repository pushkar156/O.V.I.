import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setIsListening(!isListening);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 text-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* PC-Style Visualizer Rings */}
        <AnimatePresence>
          {isListening && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5 + (i * 0.3), opacity: 0.2 - (i * 0.05) }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute inset-0 border border-[#AF3E3E] rounded-[2.5rem]"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* The O.V.I. Core (Updated to match Dashboard Logo/Theme) */}
        <motion.div
          animate={{
            scale: isListening ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={toggleListening}
          className={`w-44 h-44 rounded-[3rem] flex items-center justify-center z-10 cursor-pointer transition-all duration-500 border ${
            isListening 
            ? 'bg-[#AF3E3E] border-[#ffb3ae]/50 shadow-[0_0_50px_rgba(175,62,62,0.5)]' 
            : 'bg-[#2a2a2a] border-[#AF3E3E]/20 shadow-xl'
          }`}
        >
          <div className="flex gap-1.5 items-center">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                animate={{ height: isListening ? [16, 40, 16] : 16 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className={`w-1.5 rounded-full ${isListening ? 'bg-white' : 'bg-[#AF3E3E]'}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Background Glow */}
        <div className={`absolute inset-[-40px] rounded-full blur-[80px] transition-all duration-1000 ${
          isListening ? 'bg-[#AF3E3E]/20' : 'bg-transparent'
        }`}></div>
      </div>

      <div className="mt-12 space-y-3">
        <h2 className="text-xl font-bold font-['Sora'] text-[#e5e2e1] uppercase tracking-widest">
          {isListening ? "Listening..." : "O.V.I. Core"}
        </h2>
        <p className="text-[#ffb3ae]/40 text-[10px] font-black uppercase tracking-[0.2em]">
          {isListening ? "System accepting directives" : "Tap for neural synchronization"}
        </p>
      </div>

      {/* Suggested Actions (Dashboard Style) */}
      {!isListening && (
        <div className="absolute bottom-12 grid grid-cols-3 gap-3 w-full px-6">
          {['Lock', 'Capture', 'Status'].map(action => (
            <button 
              key={action}
              className="py-3 rounded-xl bg-[#2a2a2a] border border-[#AF3E3E]/10 text-[9px] uppercase font-black tracking-widest text-[#ffb3ae]/80"
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
