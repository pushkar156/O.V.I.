"use client";

import React from 'react';
import { Tablet, Laptop, Smartphone, Dot } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const DeviceStatus: React.FC = () => {
    const devices = [
        { name: "OVI-Desktop (Host)", type: "desktop", status: "online", icon: Laptop },
        { name: "Pixel 8 Pro", type: "mobile", status: "online", icon: Smartphone },
        { name: "Kitchen-Hub", type: "tablet", status: "offline", icon: Tablet },
    ];

    return (
        <GlassPanel className="p-4 w-full">
            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-4">Neural Mesh</h3>
            <div className="flex flex-col gap-3">
                {devices.map((device, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-3">
                            <device.icon size={16} className="text-white/40 group-hover:text-primary transition-colors" />
                            <span className="text-xs font-medium text-white/80">{device.name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className={`text-[8px] uppercase font-mono mr-1 ${device.status === 'online' ? 'text-primary' : 'text-white/20'}`}>
                                {device.status}
                            </span>
                            <Dot className={device.status === 'online' ? 'text-primary animate-pulse' : 'text-white/10'} />
                        </div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
};
