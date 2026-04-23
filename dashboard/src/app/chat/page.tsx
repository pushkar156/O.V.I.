"use client";

import React, { useEffect, useState } from "react";
import { OVIChat } from "@/components/OVIChat";
import { oviClient } from "@/lib/ovi-client";

export default function ChatPage() {
  const [sessions, setSessions] = useState<{id: string, title: string, created_at: string}[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();

  useEffect(() => {
    oviClient.getChatSessions().then(setSessions).catch(console.error);
  }, []);

  return (
    <main className="p-4 lg:p-6 h-[calc(100vh-64px)] flex gap-6 overflow-hidden flex-1">
      
      {/* Left Sidebar (History) */}
      <aside className="w-64 flex flex-col gap-4 shrink-0 hidden md:flex border-r border-[#AF3E3E]/10 dark:border-[#5b403d]/15 pr-6">
        <div className="flex items-center justify-between mb-2">
            <h2 className="font-headline font-bold text-lg text-on-surface dark:text-[#e5e2e1]">Chat History</h2>
            <button 
                onClick={() => setActiveSessionId(undefined)}
                className="text-[#CD5656] dark:text-[#ffb3ae] hover:bg-[#CD5656]/10 p-1.5 rounded-lg transition-colors border border-[#CD5656]/20">
                <span className="material-symbols-outlined text-sm">add</span>
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pb-4">
            {sessions.map(session => (
                <button 
                    key={session.id} 
                    onClick={() => setActiveSessionId(session.id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors text-sm font-body truncate border ${
                        activeSessionId === session.id 
                            ? 'bg-[#CD5656]/10 dark:bg-[#cc3a3a]/20 text-[#CD5656] dark:text-[#ffb3ae] border-[#CD5656]/30' 
                            : 'hover:bg-surface-variant dark:hover:bg-[#353534] text-on-surface dark:text-[#e5e2e1]/80 border-transparent hover:border-[#AF3E3E]/10 dark:hover:border-[#5b403d]/30'
                    }`}>
                    {session.title}
                </button>
            ))}
            {sessions.length === 0 && (
                <div className="text-center mt-10">
                    <span className="material-symbols-outlined text-4xl text-[#CD5656]/30 dark:text-[#ffb3ae]/20 mb-2">history</span>
                    <p className="text-xs text-on-surface-variant dark:text-[#e5e2e1]/40">No chat history found.</p>
                </div>
            )}
        </div>
      </aside>

      {/* Center Panel (Chat Full Screen) */}
      <div className="flex-1 flex flex-col min-h-0">
        <OVIChat 
          conversationId={activeSessionId} 
          onNewConversation={(id) => {
            setActiveSessionId(id);
            oviClient.getChatSessions().then(setSessions).catch(console.error);
          }}
        />
      </div>
      
    </main>
  );
}
