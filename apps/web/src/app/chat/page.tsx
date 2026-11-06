"use client";

import React, { useEffect, useState } from "react";
import { OVIChat } from "@/components/OVIChat";
import { oviClient } from "@/lib/ovi-client";
import { useChat } from "@/context/ChatContext";

export default function ChatPage() {
  const { sessions, activeSessionId, setActiveSessionId, refreshSessions } = useChat();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      await oviClient.deleteChatSession(id);
      if (activeSessionId === id) setActiveSessionId(undefined);
      refreshSessions();
    }
  };

  const handleStartEdit = (e: React.MouseEvent, session: any) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await oviClient.updateChatTitle(id, editTitle);
      setEditingId(null);
      refreshSessions();
    }
  };

  return (
    <main className="p-4 lg:p-6 flex gap-6 flex-1 bg-[#EAEBD0] dark:bg-[#131313] min-h-0">

      {/* Left Sidebar (History) - Sticky & Independent Scroll */}
      <aside className="w-64 sticky top-20 flex flex-col h-[calc(100vh-110px)] shrink-0 hidden md:flex border-r border-[#AF3E3E]/10 dark:border-[#5b403d]/15 pr-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="font-headline font-bold text-lg text-on-surface dark:text-[#e5e2e1]">Chat History</h2>
          <button
            onClick={() => setActiveSessionId(undefined)}
            className="text-[#CD5656] dark:text-[#ffb3ae] hover:bg-[#CD5656]/10 p-1.5 rounded-lg transition-colors border border-[#CD5656]/20">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pb-6 pr-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className="relative group"
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-2 p-2 bg-surface-variant dark:bg-[#353534] rounded-xl border border-[#AF3E3E]/20">
                  <input
                    autoFocus
                    className="bg-transparent border-none outline-none text-xs w-full text-on-surface dark:text-[#e5e2e1]"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(session.id)}
                  />
                  <button onClick={() => handleSaveEdit(session.id)} className="text-[#CD5656]"><span className="material-symbols-outlined text-sm">check</span></button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm font-body truncate border flex items-center justify-between ${activeSessionId === session.id
                      ? 'bg-[#CD5656]/10 dark:bg-[#cc3a3a]/20 text-[#CD5656] dark:text-[#ffb3ae] border-[#CD5656]/30'
                      : 'hover:bg-surface-variant dark:hover:bg-[#353534] text-on-surface dark:text-[#e5e2e1]/80 border-transparent hover:border-[#AF3E3E]/10 dark:hover:border-[#5b403d]/30'
                    }`}>
                  <span className="truncate flex-1">{session.title}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <span onClick={(e) => handleStartEdit(e, session)} className="material-symbols-outlined text-xs hover:text-[#CD5656] cursor-pointer">edit</span>
                    <span onClick={(e) => handleDelete(e, session.id)} className="material-symbols-outlined text-xs hover:text-[#CD5656] cursor-pointer">delete</span>
                  </div>
                </button>
              )}
            </div>
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
      <div className="flex-1 flex flex-col h-[calc(100vh-110px)] sticky top-20 min-w-0">
        <OVIChat
          conversationId={activeSessionId}
          onNewConversation={(id) => {
            setActiveSessionId(id);
            refreshSessions();
          }}
        />
      </div>

    </main>
  );
}
