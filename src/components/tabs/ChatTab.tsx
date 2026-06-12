'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Trash2, Mic } from 'lucide-react';
import { EXAMPLE_QUESTIONS } from '@/lib/constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { ChatSession } from '../Dashboard';

interface ChatTabProps {
  pendingReportText: string;
  clearPendingReport: () => void;
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
}

export default function ChatTab({ pendingReportText, clearPendingReport, sessions, setSessions, activeSessionId, setActiveSessionId }: ChatTabProps) {
  const apiKey = 'sk_m1imoo4v_A16pmPR579gE75vHtz918B5S';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSession = sessions.find(s => s.id === activeSessionId) || { id: '', title: 'New Chat', messages: [], updatedAt: Date.now() };
  const messages = currentSession.messages;

  useEffect(() => {
    // Load sessions from local storage on mount
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('chatbot_sessions');
      const savedActiveId = localStorage.getItem('chatbot_active_session_id');
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions);
          setSessions(parsed);
          if (savedActiveId && parsed.find((s: ChatSession) => s.id === savedActiveId)) {
            setActiveSessionId(savedActiveId);
          } else if (parsed.length > 0) {
            setActiveSessionId(parsed[0].id);
          }
        } catch (e) {
          console.error("Failed to parse saved sessions");
        }
      }
      setIsLoaded(true);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('chatbot_sessions', JSON.stringify(sessions));
    if (activeSessionId) {
      localStorage.setItem('chatbot_active_session_id', activeSessionId);
    } else {
      localStorage.removeItem('chatbot_active_session_id');
    }
  }, [sessions, activeSessionId, isLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (pendingReportText) {
      const prompt = `I am uploading a medical diagnostic report. Please analyze the following text extracted from it and explain the findings simply and clearly to me.\n\nREPORT EXTRACT:\n${pendingReportText}`;
      handleSendMessage(prompt);
      clearPendingReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingReportText]);

  const updateSessionMessages = (newMessages: Message[], currentSessionId: string): string => {
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      setActiveSessionId(sessionId);
      
      // Auto-generate title from first user message
      const firstUserMessage = newMessages.find(m => m.role === 'user')?.content || 'New Chat';
      const title = firstUserMessage.length > 25 ? firstUserMessage.substring(0, 25) + '...' : firstUserMessage;

      setSessions(prev => [{ id: sessionId, title, messages: newMessages, updatedAt: Date.now() }, ...prev]);
    } else {
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: newMessages, updatedAt: Date.now() } : s));
    }
    return sessionId;
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || !apiKey) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    const workingSessionId = updateSessionMessages(newMessages, activeSessionId);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      // Keep only last 19 messages to avoid exceeding token limits
      let apiMessages = newMessages.slice(-19);
      if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
        apiMessages = apiMessages.slice(1);
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, apiKey })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      updateSessionMessages([...newMessages, { role: 'assistant', content: data.content }], workingSessionId);
    } catch (err: any) {
      updateSessionMessages([...newMessages, { role: 'assistant', content: `⚠️ Error: ${err.message}` }], workingSessionId);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = () => {
    const updatedSessions = sessions.filter(s => s.id !== activeSessionId);
    setSessions(updatedSessions);
    setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : '');
  };

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-medium text-cyan-400 mb-2">Start a conversation</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-md">
            Ask about any health topic — symptoms, prevention, outbreaks and more
          </p>
          
          <div className="w-full max-w-lg space-y-2">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Example Questions</p>
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button 
                key={i}
                className="w-full text-left p-3 rounded-lg border border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-900/20 text-sm text-gray-300 transition-colors"
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1">
                  <ReactMarkdown>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai max-w-[85%] flex items-center gap-2 text-cyan-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <form 
          className="flex gap-2 items-center"
          onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
        >
          {messages.length > 0 && (
            <button 
              type="button"
              className="p-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={deleteSession}
              title="Delete Chat"
            >
              <Trash2 size={18} />
            </button>
          )}

          <button
            type="button"
            className={`p-3 rounded-lg border transition-colors ${
              isListening ? 'border-red-500 bg-red-500/20 text-red-400 animate-pulse' : 'border-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
            onClick={toggleListen}
            title="Voice Input"
          >
            <Mic size={18} />
          </button>

          <textarea 
            ref={textareaRef}
            className="flex-1 input-field p-3 resize-none max-h-32 min-h-[48px] overflow-y-auto"
            rows={1}
            placeholder="Type your health question (Shift+Enter for new line)..."
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
          />
          <button 
            type="submit"
            className="btn-primary px-4 flex items-center justify-center disabled:opacity-50"
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
