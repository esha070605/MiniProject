'use client';

import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Plus, MessageSquare, Stethoscope, X, Globe } from 'lucide-react';
import { ChatSession } from './Dashboard';

const LANGUAGES = [
  { code: null,       label: '🌐 Auto (Default)' },
  { code: 'English',  label: '🇬🇧 English' },
  { code: 'Hindi',    label: '🇮🇳 हिन्दी (Hindi)' },
  { code: 'Tamil',    label: '🇮🇳 தமிழ் (Tamil)' },
  { code: 'Telugu',   label: '🇮🇳 తెలుగు (Telugu)' },
  { code: 'Kannada',  label: '🇮🇳 ಕನ್ನಡ (Kannada)' },
  { code: 'Marathi',  label: '🇮🇳 मराठी (Marathi)' },
  { code: 'Bengali',  label: '🇮🇳 বাংলা (Bengali)' },
  { code: 'Gujarati', label: '🇮🇳 ગુજરાતી (Gujarati)' },
  { code: 'Punjabi',  label: '🇮🇳 ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'Malayalam',label: '🇮🇳 മലയാളം (Malayalam)' },
  { code: 'Urdu',     label: '🇵🇰 اردو (Urdu)' },
  { code: 'French',   label: '🇫🇷 Français (French)' },
  { code: 'Spanish',  label: '🇪🇸 Español (Spanish)' },
];

interface SidebarProps {
  user: User;
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  onNewChat: () => void;
  onClose?: () => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (lang: string | null) => void;
}

export default function Sidebar({
  user,
  sessions,
  activeSessionId,
  setActiveSessionId,
  onNewChat,
  onClose,
  selectedLanguage,
  setSelectedLanguage,
}: SidebarProps) {
  return (
    <div className="w-full md:w-72 glass-panel p-5 flex flex-col gap-5 h-full overflow-y-auto">
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

      {/* User info + logout */}
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

      {/* Language Selector */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          <Globe size={13} />
          Chat Language
        </label>
        <div className="relative">
          <select
            value={selectedLanguage ?? ''}
            onChange={(e) => setSelectedLanguage(e.target.value === '' ? null : e.target.value)}
            className="w-full input-field py-2 pl-3 pr-8 text-sm appearance-none cursor-pointer bg-slate-900/60 border border-cyan-800/40 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code ?? 'auto'} value={lang.code ?? ''}>
                {lang.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {selectedLanguage && (
          <p className="mt-1.5 text-xs text-cyan-400 opacity-80">
            ✓ Responses will be in {selectedLanguage}
          </p>
        )}
      </div>

      <hr className="border-gray-700" />

      {/* Chat History */}
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
