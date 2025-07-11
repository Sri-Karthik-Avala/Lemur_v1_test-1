import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Brain, Building2, ChevronDown, Sparkles, Settings, Plus, Search, MoreHorizontal, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../utils/cn';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'brain';
  timestamp: Date;
  brainType?: 'company' | 'personal';
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  brainType: 'company' | 'personal';
  messages: Message[];
}

type BrainType = 'company' | 'personal';

// Comprehensive mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Company Onboarding Process',
    lastMessage: 'What are the steps for new employee onboarding?',
    timestamp: new Date(Date.now() - 3600000),
    brainType: 'company',
    messages: [
    {
      id: '1',
      content: 'Hello! I\'m your **Company Brain**, trained on all organizational knowledge. I can help you with:\n\n• **Company policies** and procedures\n• **Internal processes** and workflows\n• **Team information** and contacts\n• **Project status** and documentation\n• **Compliance** and regulatory questions\n• **Historical context** and decisions\n\nWhat would you like to explore?',
      sender: 'brain',
        timestamp: new Date(Date.now() - 3700000),
        brainType: 'company'
      },
      {
        id: '2',
        content: 'What are the steps for new employee onboarding?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        content: 'Based on our **company knowledge base**, here\'s our comprehensive onboarding process:\n\n**Week 1: Administrative Setup**\n• HR paperwork and documentation\n• IT equipment provisioning\n• Office space allocation\n• Security badge and access setup\n\n**Week 2: Department Integration**\n• Team introductions and meetings\n• Role-specific training sessions\n• Mentorship program assignment\n• Initial project briefings\n\n**Week 3-4: Skills Development**\n• Company culture workshops\n• Technical skill assessments\n• Compliance training completion\n• Performance goal setting\n\nThis process ensures new hires are fully integrated and productive within their first month.',
        sender: 'brain',
        timestamp: new Date(Date.now() - 3500000),
        brainType: 'company'
      }
    ]
  },
  {
    id: '2',
    title: 'HR Policy Questions',
    lastMessage: 'Can you explain the leave policy for remote workers?',
    timestamp: new Date(Date.now() - 7200000),
    brainType: 'company',
    messages: [
      {
        id: '1',
        content: 'Can you explain the leave policy for remote workers?',
        sender: 'user',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: '2',
        content: 'From our **internal HR policies**, here\'s the leave policy for remote workers:\n\n**Vacation Time**\n• 15 days annually for employees 0-2 years\n• 20 days annually for employees 3-5 years\n• 25 days annually for employees 5+ years\n\n**Sick Leave**\n• 10 days annually (non-accumulative)\n• Doctor\'s note required for 3+ consecutive days\n• Mental health days included\n\n**Remote-Specific Policies**\n• Flexible time zone arrangements\n• No geographic restrictions for leave\n• Video call check-ins for extended leave\n• Equipment return not required for short leaves\n\n**Application Process**\n• Submit request 2 weeks in advance\n• Use company portal for tracking\n• Manager approval required for 5+ consecutive days',
        sender: 'brain',
        timestamp: new Date(Date.now() - 7100000),
        brainType: 'company'
      }
    ]
  },
  {
    id: '3',
    title: 'Personal Task Management',
    lastMessage: 'Help me organize my daily tasks for better productivity',
    timestamp: new Date(Date.now() - 10800000),
    brainType: 'personal',
    messages: [
      {
        id: '1',
        content: 'Hello! I\'m your **Personal Brain**, tailored to your individual needs and preferences. I can assist with:\n\n• **Personal productivity** and task management\n• **Goal setting** and tracking\n• **Schedule optimization** based on your patterns\n• **Personal preferences** and habits\n• **Work-life balance** strategies\n• **Custom workflows** for your specific needs\n\nHow can I help you today?',
        sender: 'brain',
        timestamp: new Date(Date.now() - 11000000),
        brainType: 'personal'
      },
      {
        id: '2',
        content: 'Help me organize my daily tasks for better productivity',
        sender: 'user',
        timestamp: new Date(Date.now() - 10800000)
      },
      {
        id: '3',
        content: 'Based on your **personal preferences and work patterns**, here\'s a customized task organization system:\n\n**Morning Power Block (9-11 AM)**\n• High-focus deep work tasks\n• Complex problem-solving\n• Creative projects\n\n**Midday Communication (11 AM-1 PM)**\n• Email responses\n• Team meetings\n• Quick collaborative tasks\n\n**Afternoon Execution (2-4 PM)**\n• Administrative tasks\n• Follow-ups and planning\n• Documentation\n\n**Personal Productivity Tips**\n• Use the 2-minute rule for quick tasks\n• Batch similar activities together\n• Take 15-minute breaks every hour\n• End each day by planning tomorrow\n\nThis aligns with your natural energy patterns and maximizes your productive hours.',
        sender: 'brain',
        timestamp: new Date(Date.now() - 10700000),
        brainType: 'personal'
      }
    ]
  },
  {
    id: '4',
    title: 'Project Documentation',
    lastMessage: 'Where can I find the latest project specifications?',
    timestamp: new Date(Date.now() - 14400000),
    brainType: 'company',
    messages: [
      {
        id: '1',
        content: 'Where can I find the latest project specifications?',
        sender: 'user',
        timestamp: new Date(Date.now() - 14400000)
      },
      {
        id: '2',
        content: 'From our **comprehensive company data**, here are the locations for project specifications:\n\n**Primary Documentation Hub**\n• Confluence space: /projects/specifications\n• Latest versions always in "Current" folder\n• Historical versions in "Archive" section\n\n**Project-Specific Locations**\n• **Alpha Project**: SharePoint > Engineering > Alpha-Specs-v3.2\n• **Beta Initiative**: Google Drive > Projects > Beta > Requirements\n• **Gamma System**: GitLab > Documentation > specs-2024\n\n**Access Requirements**\n• All specs require project team membership\n• Request access through IT portal\n• Manager approval for cross-project access\n\n**Update Schedule**\n• Specifications reviewed monthly\n• Change notifications via Slack #project-updates\n• Version control maintained in all systems\n\nWould you like me to help you access any specific project documentation?',
        sender: 'brain',
        timestamp: new Date(Date.now() - 14300000),
        brainType: 'company'
      }
    ]
  },
  {
    id: '5',
    title: 'Meeting Preparation',
    lastMessage: 'Prepare talking points for tomorrow\'s client presentation',
    timestamp: new Date(Date.now() - 18000000),
    brainType: 'personal',
    messages: [
      {
        id: '1',
        content: 'Prepare talking points for tomorrow\'s client presentation',
        sender: 'user',
        timestamp: new Date(Date.now() - 18000000)
      },
      {
        id: '2',
        content: 'Based on your **personal data and preferences**, here are tailored talking points for your client presentation:\n\n**Opening Hook (2 minutes)**\n• Start with the client\'s recent success story you mentioned last week\n• Connect their growth to the solution you\'re proposing\n• Use the storytelling approach you prefer\n\n**Core Value Proposition (5 minutes)**\n• Focus on ROI metrics (you excel at financial discussions)\n• Include the case study from your previous presentation\n• Address their specific pain points from your notes\n\n**Technical Deep-dive (8 minutes)**\n• Use visual demonstrations (matches your presentation style)\n• Include the comparison chart you created\n• Prepare for technical questions in your specialty areas\n\n**Closing and Next Steps (3 minutes)**\n• Clear timeline with milestones\n• Specific action items for both parties\n• Follow your usual direct communication approach\n\n**Personal Reminders**\n• Bring backup slides for the pricing discussion\n• Have your calculator ready for real-time adjustments\n• Remember to ask about their Q1 budget planning',
        sender: 'brain',
        timestamp: new Date(Date.now() - 17900000),
        brainType: 'personal'
      }
    ]
  },
  {
    id: '6',
    title: 'Code Review Guidelines',
    lastMessage: 'What are our code review standards for security?',
    timestamp: new Date(Date.now() - 21600000),
    brainType: 'company',
    messages: [
      {
        id: '1',
        content: 'What are our code review standards for security?',
        sender: 'user',
        timestamp: new Date(Date.now() - 21600000)
      },
      {
        id: '2',
        content: 'Based on our **established workflows and company policies**, here are our security-focused code review standards:\n\n**Mandatory Security Checks**\n• Input validation and sanitization\n• Authentication and authorization verification\n• SQL injection prevention\n• XSS protection implementation\n• Dependency vulnerability scanning\n\n**Review Process Requirements**\n• Minimum 2 reviewers for security-critical code\n• Security team approval for authentication changes\n• Automated security scanning must pass\n• Manual penetration testing for major features\n\n**Security Checklist Items**\n• ✓ Secrets and API keys not hardcoded\n• ✓ HTTPS enforced for all endpoints\n• ✓ Error messages don\'t expose sensitive data\n• ✓ Access controls properly implemented\n• ✓ Logging includes security events\n\n**Compliance Standards**\n• OWASP Top 10 vulnerabilities addressed\n• SOC 2 Type II requirements met\n• GDPR data protection compliance\n• Industry-specific regulations followed\n\n**Tools Integration**\n• SonarQube security rules enforced\n• Snyk vulnerability scanning\n• GitHub security alerts monitored\n• Regular security training completion required',
        sender: 'brain',
        timestamp: new Date(Date.now() - 21500000),
      brainType: 'company'
    }
    ]
  }
];

const BrainChatInterface = () => {
  const [selectedBrain, setSelectedBrain] = useState<BrainType>('company');
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>(mockConversations[0].messages);
  const [inputValue, setInputValue] = useState('');
  const [showBrainSelector, setShowBrainSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Update messages when active conversation changes
    const conversation = conversations.find(c => c.id === activeConversation);
    if (conversation) {
      setMessages(conversation.messages);
      setSelectedBrain(conversation.brainType);
    }
  }, [activeConversation, conversations]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Update messages
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation in the list
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            lastMessage: inputValue,
            timestamp: new Date()
          }
        : conv
    ));

    setInputValue('');
    setIsTyping(true);

    // Simulate brain response with more varied and context-aware responses
    setTimeout(() => {
      setIsTyping(false);
      
      const contextAwareResponses = {
        company: [
          'Based on our **company knowledge base** and established procedures, here\'s the information you need:\n\nAccording to our internal documentation, this aligns with our current organizational standards and best practices. Let me provide you with the specific details from our verified company data.',
          'From our **comprehensive organizational database**, I can provide you with this guidance:\n\nOur company policies and historical data show that this approach has been successful in similar situations. Here\'s how we typically handle this based on our institutional knowledge.',
          'Drawing from our **internal systems and workflows**, here\'s the relevant information:\n\nThis recommendation is based on our established company procedures and has been validated through our quality assurance processes and team expertise.',
          'According to our **company documentation and team knowledge**, here\'s what I can tell you:\n\nThis information comes directly from our internal resources and reflects our current organizational capabilities and standards.',
          'Based on our **institutional knowledge and company data**, here\'s the guidance you\'re looking for:\n\nThis approach aligns with our company culture and has been refined through years of operational experience across different departments.'
        ],
        personal: [
          'Based on your **personal preferences and individual work patterns**, here\'s my tailored recommendation:\n\nConsidering your specific goals and the context I have about your working style, this approach should integrate seamlessly with your existing workflows and productivity patterns.',
          'Looking at your **personal data and documented preferences**, I can suggest:\n\nThis solution takes into account your unique situation and should align well with your individual objectives and the patterns I\'ve observed in your work habits.',
          'From your **individual knowledge base and personal context**, here\'s what I recommend:\n\nThis approach is customized to your specific needs and should complement your established routines while helping you achieve your personal and professional goals.',
          'Based on your **personal working style and preferences**, here\'s the best path forward:\n\nThis recommendation considers your individual strengths and previous successful strategies, ensuring it fits naturally into your personal productivity system.',
          'Considering your **individual goals and work patterns**, here\'s my personalized advice:\n\nThis solution is tailored specifically for you, taking into account your unique circumstances and the approaches that have worked best for you in the past.'
        ]
      };

      const responses = contextAwareResponses[selectedBrain];
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'brain',
        timestamp: new Date(),
        brainType: selectedBrain
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation with AI response
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage, aiResponse],
              lastMessage: aiResponse.content.substring(0, 50) + '...',
              timestamp: new Date()
            }
          : conv
      ));
    }, 1500 + Math.random() * 1000); // Variable response time for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBrainSwitch = (brainType: BrainType) => {
    setSelectedBrain(brainType);
    setShowBrainSelector(false);
    
    const contextMessage: Message = {
      id: Date.now().toString(),
      content: brainType === 'company' 
        ? '**Switched to Company Brain**\n\nI now have access to all organizational data, policies, procedures, and company knowledge. Ready to assist with company-related questions, internal processes, team information, and institutional guidance!'
        : '**Switched to Personal Brain**\n\nI now have access to your personal data, preferences, work patterns, and individual context. How can I help with your personal tasks, productivity optimization, or customized solutions?',
      sender: 'brain',
      timestamp: new Date(),
      brainType: brainType
    };
    
    setMessages(prev => [...prev, contextMessage]);
    
    // Update current conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { 
            ...conv, 
            messages: [...conv.messages, contextMessage],
            brainType: brainType,
            lastMessage: contextMessage.content.substring(0, 50) + '...',
            timestamp: new Date()
          }
        : conv
    ));
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: 'Start a new conversation...',
      timestamp: new Date(),
      brainType: selectedBrain,
      messages: [{
        id: Date.now().toString(),
        content: selectedBrain === 'company' 
          ? 'Hello! I\'m your **Company Brain**, ready to help with organizational knowledge, policies, procedures, and company-related questions. What would you like to explore?'
          : 'Hello! I\'m your **Personal Brain**, here to assist with your individual needs, preferences, and personal productivity. How can I help you today?',
        sender: 'brain',
        timestamp: new Date(),
        brainType: selectedBrain
      }]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    setSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const getBrainInfo = (brainType: BrainType) => {
    return brainType === 'company' 
      ? { 
          name: 'Company Brain', 
          icon: Building2, 
          description: 'Organizational knowledge & policies'
        }
      : { 
          name: 'Personal Brain', 
          icon: User, 
          description: 'Your personal data & preferences'
        };
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const currentBrainInfo = getBrainInfo(selectedBrain);
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <div className="flex overflow-hidden" style={{ background: 'var(--bg-primary)', height: 'calc(100vh - 64px)' }}>
      {/* Mobile Hamburger Menu - HIDDEN on smaller screens */}
      <button
        className="hidden"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open conversation list"
      >
        <Menu className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
      </button>

      {/* Sidebar Overlay (Mobile) - HIDDEN on smaller screens */}
      {false && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50" 
          onClick={() => setSidebarOpen(false)} 
          style={{ top: '64px' }}
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div
        className={cn(
          "fixed md:relative md:flex z-30 w-80 border-r flex-col transition-transform duration-300 ease-in-out",
          "md:translate-x-0 -translate-x-full"
        )}
        style={{ 
          background: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)',
          height: 'calc(100vh - 64px)',
          top: '0'
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Brain Conversations
            </h1>
            {/* Mobile Close Button - HIDDEN on smaller screens */}
            <button
              className="hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close conversation list"
            >
              <X className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
          <button
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--gradient-primary)', color: 'white' }}
            onClick={handleNewChat}
          >
            <Plus className="h-5 w-5" />
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all hover:scale-105 border",
                  conversation.id === activeConversation
                    ? "border-blue-500 shadow-lg"
                    : "hover:shadow-md"
                )}
                style={{
                  background: conversation.id === activeConversation 
                    ? 'var(--bg-accent)' 
                    : 'var(--bg-secondary)',
                  borderColor: conversation.id === activeConversation 
                    ? 'var(--accent-primary)' 
                    : 'var(--border-primary)'
                }}
                onClick={() => handleConversationSelect(conversation.id)}
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
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat Header with Brain Selector */}
        <div className="p-4 md:p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                <currentBrainInfo.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {currentBrainInfo.name}
                </h1>
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {currentConversation?.title || 'Select a conversation'}
                </p>
              </div>
            </div>
            
            {/* Brain Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBrainSelector(!showBrainSelector)}
                rightIcon={<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showBrainSelector ? 'rotate-180' : ''}`} />}
              >
                Switch Brain
              </Button>
              
              {showBrainSelector && (
                <div 
                  className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl z-20 overflow-hidden border"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-primary)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div className="p-2">
                    {(['company', 'personal'] as BrainType[]).map((brainType) => {
                      const brainInfo = getBrainInfo(brainType);
                      return (
                        <button
                          key={brainType}
                          onClick={() => handleBrainSwitch(brainType)}
                          className="w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-200 hover:scale-105"
                          style={{
                            background: selectedBrain === brainType ? 'var(--bg-accent)' : 'transparent'
                          }}
                        >
                          <div className="p-2 rounded-lg" style={{ background: 'var(--bg-accent)' }}>
                            <brainInfo.icon className="w-5 h-5" style={{ color: 'var(--text-accent)' }} />
                          </div>
                          <div>
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{brainInfo.name}</div>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{brainInfo.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-6" style={{ background: 'var(--bg-secondary)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'brain' && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  {message.brainType === 'company' ? (
                    <Building2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  ) : (
                    <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  )}
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2 md:py-3 border ${
                  message.sender === 'user' ? '' : ''
                }`}
                style={{
                  background: message.sender === 'user' ? 'var(--gradient-primary)' : 'var(--bg-primary)',
                  color: message.sender === 'user' ? 'white' : 'var(--text-primary)',
                  borderColor: message.sender === 'user' ? 'transparent' : 'var(--border-primary)'
                }}
              >
                <div className="prose prose-sm md:prose-base max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 md:mb-2 last:mb-0 text-xs md:text-sm" style={{ color: 'inherit' }}>
                      {line.includes('**') ? (
                        line.split('**').map((part, idx) => 
                          idx % 2 === 1 ? (
                            <strong key={idx} style={{ color: 'inherit' }}>{part}</strong>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        )
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
                <div className="text-xs mt-1 md:mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                {selectedBrain === 'company' ? (
                  <Building2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                ) : (
                  <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                )}
              </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2 h-2 rounded-full opacity-70" style={{ background: 'var(--text-secondary)' }} />
              <div className="w-2 h-2 rounded-full opacity-50" style={{ background: 'var(--text-secondary)' }} />
              <div className="w-2 h-2 rounded-full opacity-30" style={{ background: 'var(--text-secondary)' }} />
                <span className="ml-2 text-xs md:text-sm">Brain is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex-shrink-0" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message your ${selectedBrain} brain...`}
                className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-primary)',
                  minHeight: '44px',
                  maxHeight: '200px'
                }}
                rows={1}
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isTyping}
              className="mb-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-center mt-1 md:mt-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="hidden md:inline">Press Enter to send • Shift + Enter for new line</span>
            <span className="md:hidden">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainChatInterface;