'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import Sidebar from './Sidebar';
import ChatTab from './tabs/ChatTab';
import ReportTab from './tabs/ReportTab';
import AlertTab from './tabs/AlertTab';
import { MessageSquare, FileText, Bell } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  updatedAt: number;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingReportText, setPendingReportText] = useState('');

  // Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');

  const handleReportAnalyzed = (text: string) => {
    setPendingReportText(text);
    setActiveTab('chat');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
      <Sidebar 
        user={user}
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        onNewChat={() => setActiveSessionId('')}
      />
      
      <div className="flex-1 glass-panel p-4 md:p-6 h-full flex flex-col min-h-0">
        <div className="flex border-b border-gray-700 mb-6 tabs-header overflow-x-auto">
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={18} /> Health Chat
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <FileText size={18} /> Analyze Medical Report
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('alert')}
          >
            <Bell size={18} /> Alert Center
          </button>
        </div>

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
