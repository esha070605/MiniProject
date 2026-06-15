'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Sidebar from './Sidebar';
import ChatTab from './tabs/ChatTab';
import ReportTab from './tabs/ReportTab';
import AlertTab from './tabs/AlertTab';
import { MessageSquare, FileText, Bell, Menu, Plus, LogOut, Stethoscope } from 'lucide-react';

interface DashboardProps {
  user: User;
  isAdmin: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  updatedAt: number;
}

export default function Dashboard({ user, isAdmin }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingReportText, setPendingReportText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');

  // Load active tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('dashboard_active_tab');
      // If not admin and saved tab was alert, fall back to chat
      if (savedTab && (savedTab !== 'alert' || isAdmin)) {
        setActiveTab(savedTab);
      }
    }
  }, [isAdmin]);

  const handleTabChange = (tab: string) => {
    // Guard: non-admins cannot access the alert tab
    if (tab === 'alert' && !isAdmin) return;
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_active_tab', tab);
    }
  };

  const handleReportAnalyzed = (text: string) => {
    setPendingReportText(text);
    handleTabChange('chat');
  };

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-6 h-full min-h-0 w-full relative">
      
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/60 border-b border-gray-800 md:hidden w-full z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-gray-800/60 transition-colors"
          >
            <Menu size={22} />
          </button>
          <span className="text-lg font-bold text-cyan-300 flex items-center gap-2">
            <Stethoscope size={20} className="text-cyan-400" />
            Qureon
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setActiveSessionId('');
              setActiveTab('chat');
            }}
            className="p-1.5 rounded-lg bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50 transition-colors"
            title="New Chat"
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={() => auth.signOut()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Persistent on Desktop, Slide-out Drawer on Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto md:h-full md:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          user={user}
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          onNewChat={() => {
            setActiveSessionId('');
            setIsSidebarOpen(false);
            setActiveTab('chat');
          }}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      {/* Main Content Pane */}
      <div className="flex-1 glass-panel rounded-none md:rounded-xl border-x-0 md:border border-y-0 md:border p-4 md:p-6 md:h-full flex flex-col min-h-0 overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-gray-700 mb-6 tabs-header overflow-x-auto scrollbar-none">
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => handleTabChange('chat')}
          >
            <MessageSquare size={16} /> Health Chat
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => handleTabChange('report')}
          >
            <FileText size={16} /> Analyze Medical Report
          </button>
          {/* Alert Center tab — only visible to admins */}
          {isAdmin && (
            <button 
              className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${activeTab === 'alert' ? 'active' : ''}`}
              onClick={() => handleTabChange('alert')}
            >
              <Bell size={16} /> Alert Center
              <span className="ml-1 text-xs bg-red-500/80 text-white px-1.5 py-0.5 rounded-full font-semibold">Admin</span>
            </button>
          )}
        </div>

        {/* Tab Content Panels */}
        <div className={`flex-1 flex flex-col min-h-0 ${activeTab !== 'chat' ? 'overflow-y-auto' : ''}`}>
          {activeTab === 'chat' && (
            <ChatTab 
              pendingReportText={pendingReportText} 
              clearPendingReport={() => setPendingReportText('')} 
              sessions={sessions}
              setSessions={setSessions}
              activeSessionId={activeSessionId}
              setActiveSessionId={setActiveSessionId}
            />
          )}
          {activeTab === 'report' && <ReportTab onReportAnalyzed={handleReportAnalyzed} />}
          {activeTab === 'alert' && <AlertTab />}
        </div>
      </div>
    </div>
  );
}
