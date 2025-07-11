// --- Component Metadata ---
/**
 * @component Sidebar
 * @description Brain chat sidebar for conversation navigation and new chat functionality
 * @author Lemur
 * @lastModified 2024-12-09
 */

import React, { useState } from 'react';
import { Plus, Menu, X, Building2, User } from 'lucide-react';
import { cn } from '../utils/cn';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  brainType: 'company' | 'personal';
}

const demoConversations: Conversation[] = [
  { id: '1', title: 'Company Onboarding Process', lastMessage: 'What are the steps for new employee...', timestamp: new Date(Date.now() - 3600000), brainType: 'company' },
  { id: '2', title: 'HR Policy Questions', lastMessage: 'Can you explain the leave policy...', timestamp: new Date(Date.now() - 7200000), brainType: 'company' },
  { id: '3', title: 'Personal Task Management', lastMessage: 'Help me organize my daily tasks...', timestamp: new Date(Date.now() - 10800000), brainType: 'personal' },
  { id: '4', title: 'Project Documentation', lastMessage: 'Where can I find the latest specs...', timestamp: new Date(Date.now() - 14400000), brainType: 'company' },
  { id: '5', title: 'Meeting Preparation', lastMessage: 'Prepare talking points for tomorrow...', timestamp: new Date(Date.now() - 18000000), brainType: 'personal' },
  { id: '6', title: 'Code Review Guidelines', lastMessage: 'What are our code review standards...', timestamp: new Date(Date.now() - 21600000), brainType: 'company' },
];

export const Sidebar: React.FC<{
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  activeConversationId?: string;
  onNewChat?: () => void;
  className?: string;
}> = ({
  conversations = demoConversations,
  onSelectConversation,
  activeConversationId,
  onNewChat,
  className
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelectConversation?.(id);
    setMobileOpen(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="sm:hidden fixed top-4 left-4 z-30 p-2 rounded-lg shadow"
        style={{ background: 'var(--bg-primary)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed sm:static z-50 top-0 left-0 h-full w-80 border-r flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          className
        )}
        style={{ 
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h1 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Brain Conversations
          </h1>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow transition-all hover-scale"
            style={{ background: 'var(--gradient-primary)', color: 'white' }}
            onClick={onNewChat}
          >
            <Plus className="h-5 w-5" />
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all hover-scale border",
                  conversation.id === activeConversationId
                    ? "border-blue-500"
                    : ""
                )}
                style={{
                  background: conversation.id === activeConversationId 
                    ? 'var(--bg-accent)' 
                    : 'var(--bg-secondary)',
                  borderColor: conversation.id === activeConversationId 
                    ? 'var(--accent-primary)' 
                    : 'var(--border-primary)'
                }}
                onClick={() => handleSelect(conversation.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: 'var(--bg-accent)' }}>
                      {conversation.brainType === 'company' ? (
                        <Building2 className="w-3 h-3" style={{ color: 'var(--text-accent)' }} />
                      ) : (
                        <User className="w-3 h-3" style={{ color: 'var(--text-accent)' }} />
                      )}
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {conversation.brainType === 'company' ? 'Company' : 'Personal'}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                  {conversation.title}
                </h3>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {conversation.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button
            className="absolute top-4 right-4 p-2 rounded-lg shadow"
            style={{ background: 'var(--bg-primary)' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
          </button>
        )}
      </aside>
    </>
  );
}; 