import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mic, Smartphone, 
  Cpu, Zap, Shield, LayoutGrid as HubIcon, 
  Settings, Battery, Activity 
} from 'lucide-react';

// Components
import VoiceControl from './components/VoiceControl';
import MeshControl from './components/MeshControl';
import MobileChat from './components/MobileChat';

type Tab = 'home' | 'chat' | 'mesh' | 'voice';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sessionID, setSessionID] = useState<string | undefined>();

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-[#1c1b1b]">
      {/* Dashboard Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(175,62,62,0.1)_0%,_transparent_50%)] pointer-events-none" />
      
      {/* Desktop-Style Header */}
      <header className="safe-area-top px-6 py-4 flex justify-between items-center z-10 border-b border-[#AF3E3E]/10 bg-[#201f1f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#AF3E3E] flex items-center justify-center shadow-[0_0_20px_rgba(175,62,62,0.3)] border border-white/10">
            <span className="text-white font-black text-sm">O</span>
          </div>
          <div>
            <h1 className="text-xs font-black font-['Sora'] text-white tracking-[0.2em] uppercase">O.V.I. Command</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
              <p className="text-[7px] uppercase tracking-[0.1em] text-[#ffb3ae]/60 font-black">Link: Nominal</p>
            </div>
          </div>
        </div>
        <Settings className="w-5 h-5 text-[#ffb3ae]/40" />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto pb-32"
            >
              {/* System HUD Card (Mobile Version of Desktop Sidebar) */}
              <div className="bg-[#2a2a2a] border border-[#AF3E3E]/15 p-5 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF3E3E]/5 blur-3xl rounded-full" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#AF3E3E]">System Vitals</span>
                  <Activity className="w-3 h-3 text-[#AF3E3E]" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <VitalItem icon={<Cpu className="w-4 h-4" />} label="CPU" value="12%" color="text-blue-400" />
                  <VitalItem icon={<Zap className="w-4 h-4" />} label="MEM" value="42%" color="text-purple-400" />
                  <VitalItem icon={<Battery className="w-4 h-4" />} label="BAT" value="98%" color="text-green-400" />
                </div>
              </div>

              {/* Chat Preview (Condensed OVIChat) */}
              <div className="flex-1 bg-[#2a2a2a]/40 border border-[#AF3E3E]/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 gap-4 min-h-[250px]">
                <div className="w-20 h-20 rounded-[2rem] bg-[#AF3E3E]/10 border border-[#AF3E3E]/20 flex items-center justify-center mb-2">
                  <Mic className="w-8 h-8 text-[#AF3E3E]" />
                </div>
                <h2 className="text-lg font-bold font-['Sora'] text-white">How can I help?</h2>
                <p className="text-[10px] text-[#ffb3ae]/40 font-bold uppercase tracking-widest leading-relaxed">
                  Awaiting operational directive<br/>Establish synchronization to proceed
                </p>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="mt-4 px-6 py-3 bg-[#AF3E3E] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Neural Entry
                </button>
              </div>

              {/* Desktop-Style Action Grid */}
              <div className="grid grid-cols-3 gap-4">
                <ActionCard icon={<RefreshCwIcon />} label="Sync" sub="Fleet" />
                <ActionCard icon={<HubIcon className="w-5 h-5" />} label="Hub" sub="Mesh" />
                <ActionCard icon={<Shield className="w-5 h-5" />} label="Vault" sub="Sec" />
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="chat" className="h-full">
              <MobileChat sessionID={sessionID} onSetSession={setSessionID} />
            </motion.div>
          )}

          {activeTab === 'mesh' && (
            <motion.div key="mesh" className="h-full">
              <MeshControl />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar (Desktop Sidebar Icons) */}
      <nav className="safe-area-bottom h-24 bg-[#1c1b1b] border-t border-[#AF3E3E]/10 flex justify-around items-center px-6 z-20">
        <NavItem 
          icon={<Zap className="w-5 h-5" />} 
          label="Control" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<MessageSquare className="w-5 h-5" />} 
          label="Neural" 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
        />
        <NavItem 
          icon={<Smartphone className="w-5 h-5" />} 
          label="Mesh" 
          active={activeTab === 'mesh'} 
          onClick={() => setActiveTab('mesh')} 
        />
      </nav>
    </div>
  );
}

function RefreshCwIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
}

function VitalItem({ icon, label, value, color }: any) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
      <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 mt-1">{label}</span>
      <span className="text-xs font-bold text-white tracking-tight">{value}</span>
    </div>
  );
}

function ActionCard({ icon, label, sub }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="bg-[#2a2a2a] border border-[#AF3E3E]/10 p-4 rounded-2xl flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#AF3E3E] group-active:bg-[#AF3E3E] group-active:text-white transition-colors shadow-inner">
        {icon}
      </div>
      <div className="text-center">
        <span className="block text-[10px] font-black text-white uppercase tracking-tighter">{label}</span>
        <span className="block text-[7px] text-[#ffb3ae]/40 font-bold uppercase tracking-[0.2em]">{sub}</span>
      </div>
    </motion.div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all w-20 ${active ? 'text-[#ffb3ae]' : 'text-white/20'}`}
    >
      <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-[#AF3E3E]/15 border border-[#AF3E3E]/20' : 'border border-transparent'}`}>
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

export default App;
