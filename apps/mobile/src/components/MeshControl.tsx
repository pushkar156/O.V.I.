import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Laptop, RefreshCw, ChevronRight, Activity } from 'lucide-react';
import { oviMobile } from '../lib/api';

const MeshControl = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await oviMobile.getDevices();
      setDevices(data.agents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto pb-32">
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#AF3E3E] mb-1">Fleet Management</p>
          <h2 className="text-xl font-bold font-['Sora'] text-white">Device Mesh</h2>
        </div>
        <button 
          onClick={fetchDevices} 
          className="w-10 h-10 rounded-xl bg-[#2a2a2a] border border-[#AF3E3E]/20 flex items-center justify-center text-[#ffb3ae]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Local Station */}
        <DeviceCard 
          name="Core Station" 
          type="desktop" 
          status="online" 
          vitals={{ cpu: '12%', ram: '8GB' }}
        />

        {/* Remote Agents */}
        {devices.map((device, idx) => (
          <DeviceCard 
            key={idx}
            name={device.name} 
            type={device.name.toLowerCase().includes('laptop') ? 'laptop' : 'phone'} 
            status="online" 
            vitals={{ cpu: `${device.system_info.cpu_percent || 0}%`, ram: `${device.system_info.memory_percent || 0}%` }}
          />
        ))}

        {devices.length === 0 && !loading && (
          <div className="p-12 border border-dashed border-[#AF3E3E]/20 rounded-3xl text-center bg-[#AF3E3E]/5">
            <Activity className="w-8 h-8 text-[#AF3E3E]/30 mx-auto mb-3" />
            <p className="text-[#ffb3ae]/20 text-[9px] font-black uppercase tracking-widest">No remote agents synchronized</p>
          </div>
        )}
      </div>

      {/* PC Style Action Buttons */}
      <div className="mt-10 space-y-3">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-[#AF3E3E] mb-4 px-2">System Protocols</h3>
        <div className="grid grid-cols-1 gap-3">
          <button className="bg-[#AF3E3E]/10 border border-[#AF3E3E]/20 p-5 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#AF3E3E] rounded-lg text-white">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white uppercase">Sync Fleet</span>
                <span className="block text-[8px] text-[#ffb3ae]/40 font-bold uppercase tracking-tighter">Update all agent configs</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#AF3E3E]" />
          </button>
        </div>
      </div>
    </div>
  );
};

function DeviceCard({ name, type, vitals }: any) {
  const Icon = type === 'desktop' ? Monitor : type === 'laptop' ? Laptop : Smartphone;
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-[#2a2a2a] border border-[#AF3E3E]/10 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[#AF3E3E]" />
      <div className="w-12 h-12 rounded-xl bg-[#AF3E3E]/10 flex items-center justify-center text-[#ffb3ae] border border-[#AF3E3E]/5">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-white tracking-tight">{name}</h4>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        </div>
        <div className="flex gap-4 mt-1.5">
          <div className="flex flex-col">
            <span className="text-[7px] text-[#AF3E3E] font-black uppercase tracking-widest mb-0.5">LOAD</span>
            <span className="text-[10px] text-[#ffb3ae]/60 font-bold">{vitals.cpu}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-[#AF3E3E] font-black uppercase tracking-widest mb-0.5">MEM</span>
            <span className="text-[10px] text-[#ffb3ae]/60 font-bold">{vitals.ram}</span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-white/10" />
    </motion.div>
  );
}

export default MeshControl;
