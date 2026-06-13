'use client';

import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Plus, MessageSquare, Stethoscope, X } from 'lucide-react';
import { ChatSession } from './Dashboard';

interface SidebarProps {
  user: User;
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  onNewChat: () => void;
  onClose?: () => void;
}

export default function Sidebar({
  user,
  sessions,
  activeSessionId,
  setActiveSessionId,
  onNewChat,
  onClose
}: SidebarProps) {
  return (
    <div className="w-full md:w-72 glass-panel p-5 flex flex-col gap-6 h-full overflow-y-auto">
      {/* Qureon Brand */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-cyan-400" size={20} />
          <span className="text-base font-bold tracking-wide text-cyan-300">Qureon</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-medium text-cyan-400 truncate">{user.email}</p>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="text-gray-400 hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      <hr className="border-gray-700" />

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200">💬 Chat History</h3>
          <button 
            onClick={onNewChat}
            className="p-1 rounded bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50 transition-colors"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No previous chats</p>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  if (onClose) onClose();
                }}
                className={`w-full text-left p-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  activeSessionId === session.id 
                    ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/50' 
                    : 'text-gray-400 hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <MessageSquare size={14} className="opacity-70" />
                <span className="truncate flex-1">{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
