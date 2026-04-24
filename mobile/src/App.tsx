import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, Smartphone, Settings, Monitor, Zap } from 'lucide-react';
import { oviMobile } from './lib/api';

// Components
import VoiceControl from './components/VoiceControl';
import MeshControl from './components/MeshControl';
import MobileChat from './components/MobileChat';

type Tab = 'chat' | 'voice' | 'mesh';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('voice');
  const [sessionID, setSessionID] = useState<string | undefined>();

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-[#0d0d0d]">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#CD5656] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ffb3ae] blur-[120px] rounded-full opacity-50"></div>
      </div>

      {/* Header */}
      <header className="safe-area-top p-6 flex justify-between items-center z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold font-['Public_Sans'] text-[#CD5656]">O.V.I.</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Remote Terminal</p>
        </div>
        <div className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <Settings className="w-5 h-5 text-white/60" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'voice' && (
            <motion.div 
              key="voice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full"
            >
              <VoiceControl />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="h-full"
            >
              <MobileChat sessionID={sessionID} onSetSession={setSessionID} />
            </motion.div>
          )}

          {activeTab === 'mesh' && (
            <motion.div 
              key="mesh"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="h-full"
            >
              <MeshControl />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="safe-area-bottom h-20 bg-black/40 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-4 z-20">
        <NavItem 
          icon={<MessageSquare className="w-6 h-6" />} 
          label="Chat" 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
        />
        <div className="relative -top-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('voice')}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              activeTab === 'voice' 
              ? 'bg-[#CD5656] text-white' 
              : 'bg-white/10 text-white/60'
            }`}
          >
            <Mic className="w-8 h-8" />
          </motion.button>
        </div>
        <NavItem 
          icon={<Smartphone className="w-6 h-6" />} 
          label="Mesh" 
          active={activeTab === 'mesh'} 
          onClick={() => setActiveTab('mesh')} 
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#CD5656]' : 'text-white/40'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

export default App;
