"use client";

import React from 'react';
import { Tablet, Laptop, Smartphone, Dot } from 'lucide-react';

export const DeviceStatus: React.FC = () => {
    const devices = [
        { name: "OVI-Desktop (Host)", type: "desktop", status: "online", icon: Laptop },
        { name: "Pixel 8 Pro", type: "mobile", status: "online", icon: Smartphone },
        { name: "Kitchen-Hub", type: "tablet", status: "offline", icon: Tablet },
    ];

    return (
        <section className="bg-surface-container dark:bg-[#201f1f] p-6 rounded-2xl border border-[#AF3E3E]/10 dark:border-[#5b403d]/15 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold text-on-surface dark:text-[#e5e2e1]">Fleet Overview</h3>
                <span className="material-symbols-outlined text-[#AF3E3E]/50 dark:text-[#a6bcc7]">hub</span>
            </div>
            
            <div className="flex flex-col gap-4">
                {devices.map((device, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-default p-2 -mx-2 rounded-lg hover:bg-[#AF3E3E]/5 dark:hover:bg-[#353534] transition-colors">
                        <div className="flex items-center gap-3">
                            <device.icon size={18} className="text-[#AF3E3E]/60 dark:text-[#a6bcc7] group-hover:text-[#CD5656] dark:group-hover:text-[#ffb3ae] transition-colors" />
                            <span className="text-sm font-medium text-on-surface dark:text-[#e5e2e1]">{device.name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className={`text-[10px] uppercase font-bold tracking-wider mr-1 ${device.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant/50 dark:text-white/20'}`}>
                                {device.status}
                            </span>
                            <Dot className={device.status === 'online' ? 'text-green-600 dark:text-green-400 animate-pulse' : 'text-on-surface-variant/30 dark:text-white/10'} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
