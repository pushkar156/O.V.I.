import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Laptop, Zap, RefreshCw, MoreVertical, Shield } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-['Sora'] text-white">Active Mesh</h2>
        <button onClick={fetchDevices} className="p-2 glass rounded-lg text-[#CD5656]">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Primary Desktop (Local) */}
        <DeviceCard 
          name="Main Station" 
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
          <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No remote agents found</p>
          </div>
        )}
      </div>

      {/* Security Quick Actions */}
      <div className="mt-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-2">Global Protocols</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="text-[10px] font-bold text-red-500 uppercase">Panic Lock</span>
          </button>
          <button className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-500 uppercase">Flush Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function DeviceCard({ name, type, status, vitals }: any) {
  const Icon = type === 'desktop' ? Monitor : type === 'laptop' ? Laptop : Smartphone;
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="glass p-5 rounded-3xl flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#CD5656]/10 flex items-center justify-center text-[#CD5656]">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-white">{name}</h4>
        <div className="flex gap-3 mt-1">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">CPU: {vitals.cpu}</span>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">RAM: {vitals.ram}</span>
        </div>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full text-white/40">
        <MoreVertical className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

export default MeshControl;
