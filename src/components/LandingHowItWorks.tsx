import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Brain, Zap, FileText, Mail, Users, Clock, Database, Bot, MessageSquare, FolderOpen, Send, Search, BookOpen, TrendingUp, Video, Monitor, ChevronLeft, ChevronRight, CalendarIcon, DollarSign, CheckCircle, Edit3, Copy } from 'lucide-react';

const LandingHowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'files' | 'chat'>('files');
  const [step1Tab, setStep1Tab] = useState<'calendar' | 'botjoin'>('calendar');
  const [step3Tab, setStep3Tab] = useState<'proposal' | 'email' | 'sow'>('proposal');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'user', content: 'Show me our most successful proposal patterns for tech clients' },
    { id: 2, type: 'ai', content: 'Based on 47 analyzed proposals, tech clients respond best to...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [botJoinStep, setBotJoinStep] = useState(0);

  useEffect(() => {
    if (activeTab === 'chat') {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setChatMessages(prev => [...prev, 
            { id: prev.length + 1, type: 'ai', content: 'I found 3 high-converting patterns: emphasis on ROI metrics, technical implementation roadmaps, and phased delivery approaches. Would you like me to generate a proposal using these patterns?' }
          ]);
        }, 2000);
      }, 1000);
    }
  }, [activeTab]);

  useEffect(() => {
    if (step1Tab === 'botjoin') {
      const interval = setInterval(() => {
        setBotJoinStep(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step1Tab]);

  return (
    <section id="how-it-works" className="relative py-20 md:py-40 bg-gray-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden scroll-mt-20">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-gray-500 dark:text-gray-400 text-sm md:text-lg font-medium tracking-wide mb-6 md:mb-8"
          >
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[0.9] tracking-tight mb-6 md:mb-8"
          >
            From meeting to
            <br />
            <motion.span 
              className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              proposals.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Watch how Lemur transforms every client interaction into actionable intelligence.
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-20 hidden lg:block"></div>
          
          {/* Step 1: Meeting Integration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-32 relative"
          >
            {/* Step Number - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 z-20 hidden lg:block">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-xl border-4 border-white dark:border-gray-950">
                1
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="lg:order-1 lg:pr-16">
                <div className="flex items-center mb-4 sm:mb-6 lg:hidden">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl mr-3 sm:mr-4 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Lemur Joins Your Meetings
                  </h3>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 hidden lg:block">
                  Lemur Joins Your Meetings
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                  Our AI assistant seamlessly integrates with your calendar and joins every client meeting. 
                  It captures transcripts, tracks action items, and syncs with all your communication platforms.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Auto-syncs with Google Calendar & Outlook</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Captures meeting transcripts & insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">Tracks follow-ups & commitments</span>
                  </div>
                </div>
              </div>
              <div className="lg:order-2 lg:pl-16">
                <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header with tabs */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2 sm:mr-3" />
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Calendar & Bot Integration</h4>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setStep1Tab('calendar')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          step1Tab === 'calendar' 
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Calendar
                      </button>
                      <button
                        onClick={() => setStep1Tab('botjoin')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          step1Tab === 'botjoin' 
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <Video className="h-4 w-4 inline mr-1" />
                        Bot Join
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="h-80">
                    {step1Tab === 'calendar' ? (
                      <div className="p-6">
                        {/* Mini Calendar View */}
                        <div className="space-y-4">
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h5>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              >
                                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button 
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              >
                                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* Mini Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                              <div key={day} className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
                                {day}
                              </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => {
                              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                              const isToday = date.toDateString() === new Date().toDateString();
                              const hasMeeting = [15, 18, 22, 25].includes(date.getDate()) && isCurrentMonth;
                              
                              return (
                                <div
                                  key={i}
                                  className={`text-xs p-1 rounded cursor-pointer transition-all ${
                                    isCurrentMonth 
                                      ? 'text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                                      : 'text-gray-400 dark:text-gray-600'
                                  } ${
                                    isToday ? 'bg-blue-500 text-white font-bold' : ''
                                  } ${
                                    hasMeeting ? 'ring-1 ring-green-400' : ''
                                  }`}
                                >
                                  {date.getDate()}
                                </div>
                              );
                            })}
                          </div>

                          {/* Upcoming Meetings */}
                          <div className="space-y-2">
                            <h6 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Today's Meetings</h6>
                            <div className="space-y-2">
                              <motion.div 
                                whileHover={{ x: 4 }}
                                className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50"
                              >
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 text-blue-500 mr-2" />
                                  <div>
                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Client Strategy Call</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">2:00 PM - 3:00 PM</div>
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              </motion.div>

                              <motion.div 
                                whileHover={{ x: 4 }}
                                className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50"
                              >
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 text-purple-500 mr-2" />
                                  <div>
                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Proposal Review</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">4:30 PM - 5:30 PM</div>
                                  </div>
                                </div>
                                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Lemur Ready</div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 h-full flex flex-col">
                        {/* Bot Join Simulation */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="text-center mb-6">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lemur Joining Meeting</h5>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Client Strategy Call - 2:00 PM</div>
                          </div>

                          {/* Video Call Interface Mockup */}
                          <div className="bg-gray-900 rounded-lg overflow-hidden">
                            {/* Video Call Header */}
                            <div className="bg-gray-800 p-3 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="text-white text-xs">zoom.us/j/123456789</div>
                              <div className="w-6"></div>
                            </div>

                            {/* Video Grid */}
                            <div className="p-4 grid grid-cols-2 gap-2">
                              {/* Client Video */}
                              <div className="bg-gray-700 rounded aspect-video flex items-center justify-center relative">
                                <Users className="h-8 w-8 text-gray-400" />
                                <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                                  John Smith
                                </div>
                              </div>

                              {/* Lemur Bot Video */}
                              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded aspect-video flex items-center justify-center relative">
                                <motion.div
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.8, 1, 0.8]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Bot className="h-8 w-8 text-white" />
                                </motion.div>
                                <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-1 ${
                                    botJoinStep >= 2 ? 'bg-green-400' : 'bg-red-400'
                                  }`}></div>
                                  Lemur AI
                                </div>
                              </div>
                            </div>

                            {/* Join Status Messages */}
                            <div className="p-4 space-y-2">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: botJoinStep >= 0 ? 1 : 0, x: botJoinStep >= 0 ? 0 : -20 }}
                                className="text-xs text-gray-300 flex items-center space-x-2"
                              >
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                <span>Lemur is joining the meeting...</span>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: botJoinStep >= 1 ? 1 : 0, x: botJoinStep >= 1 ? 0 : -20 }}
                                className="text-xs text-gray-300 flex items-center space-x-2"
                              >
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>Connected and ready to record</span>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: botJoinStep >= 2 ? 1 : 0, x: botJoinStep >= 2 ? 0 : -20 }}
                                className="text-xs text-gray-300 flex items-center space-x-2"
                              >
                                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                                <span>Now recording and analyzing...</span>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: botJoinStep >= 3 ? 1 : 0, x: botJoinStep >= 3 ? 0 : -20 }}
                                className="text-xs text-gray-300 flex items-center space-x-2"
                              >
                                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                                <span>Extracting key insights and action items</span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2: Centralized Brain */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-32 relative"
          >
            {/* Step Number - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 z-20 hidden lg:block">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-xl border-4 border-white dark:border-gray-950">
                2
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 lg:pl-16">
                <div className="flex items-center mb-6 lg:hidden">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Centralized Brain - We Learn About You
                  </h3>
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 hidden lg:block">
                  Centralized Brain - We Learn About You
                </h3>
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  Our AI builds contextual intelligence from every client interaction, past proposals, and project outcomes. 
                  It learns your consulting style, client preferences, and successful project patterns to become your 
                  personalized consulting assistant.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Previous Proposals & SOWs</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Learns from your successful proposals to replicate winning patterns for new clients.
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Client Relationship History</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Remembers client preferences, communication styles, and project requirements.
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Project Outcomes & Insights</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Tracks what worked, what didn't, and applies lessons to future engagements.
                  </div>
                </div>
              </div>
              <div className="lg:order-1 lg:pr-16">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header with tabs */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Brain className="h-6 w-6 text-purple-500 mr-3" />
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">Centralized Brain</h4>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setActiveTab('files')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          activeTab === 'files' 
                            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <FolderOpen className="h-4 w-4 inline mr-1" />
                        Files
                      </button>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          activeTab === 'chat' 
                            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        Chat
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="h-80">
                    {activeTab === 'files' ? (
                      <div className="p-6">
                        {/* File Explorer View */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Knowledge Repository</h5>
                          </div>
                          
                          {/* File Categories */}
                          <div className="space-y-2">
                            <motion.div 
                              whileHover={{ x: 4 }}
                              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-blue-500 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Proposals & SOWs</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Successful proposals and templates</div>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div 
                              whileHover={{ x: 4 }}
                              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-green-500 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Communications</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Client emails and correspondence</div>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div 
                              whileHover={{ x: 4 }}
                              className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 text-purple-500 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Transcripts</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Live meeting recordings and notes</div>
                                </div>
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Real-time sync</div>
                            </motion.div>

                            <motion.div 
                              whileHover={{ x: 4 }}
                              className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-orange-500 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Outcomes</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Completed project results and insights</div>
                                </div>
                              </div>
                            </motion.div>
                          </div>


                        </div>
                      </div>
                    ) : (
                      <div className="p-6 h-full flex flex-col">
                        {/* Chat Interface */}
                        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                          {chatMessages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[80%] p-3 rounded-lg ${
                                message.type === 'user' 
                                  ? 'bg-purple-500 text-white' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              }`}>
                                <div className="text-sm">{message.content}</div>
                              </div>
                            </motion.div>
                          ))}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-start"
                            >
                              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Chat Input */}
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <input
                            type="text"
                            placeholder="Ask about your consulting data..."
                            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                          />
                          <button className="p-2 text-purple-500 hover:text-purple-600 transition-colors">
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: AI Agent Outputs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-20 relative"
          >
            {/* Step Number - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 z-20 hidden lg:block">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-xl border-4 border-white dark:border-gray-950">
                3
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-1 lg:pr-16">
                <div className="flex items-center mb-6 lg:hidden">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    AI Agents Generate Perfect Outputs
                  </h3>
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 hidden lg:block">
                  AI Agents Generate Perfect Outputs
                </h3>
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  Based on your centralized intelligence, our AI agents automatically generate personalized proposals, 
                  follow-up emails, and SOWs that reflect your consulting style and client preferences. Every output 
                  is tailored to maximize conversion and client satisfaction.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Personalized Proposal Generation</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Creates tailored proposals using client history, successful patterns, and your consulting methodology.
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Smart Follow-up Communications</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Generates contextual follow-ups that reference specific meeting points and next steps.
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Instant SOW & Contract Creation</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm ml-8 -mt-2">
                    Produces detailed SOWs with accurate scope, timelines, and pricing based on similar projects.
                  </div>
                </div>
              </div>
              <div className="lg:order-2 lg:pl-16">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header with tabs */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Bot className="h-6 w-6 text-green-500 mr-3" />
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">AI Generated Outputs</h4>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setStep3Tab('proposal')}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                          step3Tab === 'proposal' 
                            ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <FileText className="h-3 w-3 inline mr-1" />
                        Proposal
                      </button>
                      <button
                        onClick={() => setStep3Tab('email')}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                          step3Tab === 'email' 
                            ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <Mail className="h-3 w-3 inline mr-1" />
                        Email
                      </button>
                      <button
                        onClick={() => setStep3Tab('sow')}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                          step3Tab === 'sow' 
                            ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <Zap className="h-3 w-3 inline mr-1" />
                        SOW
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="h-80 overflow-hidden">
                    {step3Tab === 'proposal' && (
                      <div className="p-6 h-full overflow-y-auto">
                        {/* Proposal Document */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Consulting Proposal - TechCorp Inc.</h5>
                            <div className="flex items-center space-x-2">
                              <Copy className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <Edit3 className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                          </div>
                          
                          <div className="space-y-3 text-xs">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Executive Summary</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                Based on our discussion regarding TechCorp's digital transformation initiatives, we propose a comprehensive consulting engagement to modernize your technology infrastructure and optimize operational efficiency...
                              </div>
                            </div>

                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                              <div className="font-semibold text-green-700 dark:text-green-300 mb-2">Proposed Solution</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                • Phase 1: Infrastructure Assessment (4 weeks)<br/>
                                • Phase 2: System Integration (8 weeks)<br/>
                                • Phase 3: Training & Optimization (6 weeks)
                              </div>
                            </div>

                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                              <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Investment & Timeline</div>
                              <div className="text-gray-600 dark:text-gray-400 flex justify-between">
                                <span>Total Investment: $185,000</span>
                                <span>Duration: 18 weeks</span>
                              </div>
                            </div>

                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                              <div className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Expected ROI</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                • 35% reduction in operational costs<br/>
                                • 50% improvement in system efficiency<br/>
                                • Break-even within 8 months
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Generated using 23 similar successful proposals</div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">94% win rate</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step3Tab === 'email' && (
                      <div className="p-6 h-full overflow-y-auto">
                        {/* Email Draft */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Follow-up Email Draft</h5>
                            <div className="flex items-center space-x-2">
                              <Copy className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <Edit3 className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            {/* Email Header */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-gray-500 dark:text-gray-400">To:</span>
                                <span className="text-gray-700 dark:text-gray-300">john.smith@techcorp.com</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Following up on our productive conversation about TechCorp's digital transformation</span>
                              </div>
                            </div>

                            {/* Email Body */}
                            <div className="p-4 space-y-3 text-xs">
                              <div className="text-gray-700 dark:text-gray-300">
                                <div className="mb-2">Hi John,</div>
                                <div className="mb-3">
                                  Thank you for taking the time to discuss TechCorp's digital transformation goals yesterday. I was particularly impressed by your vision for modernizing the infrastructure while maintaining operational continuity.
                                </div>
                                <div className="mb-3">
                                  As promised, I've attached a comprehensive proposal that addresses the key points we discussed:
                                </div>
                                <div className="mb-3 ml-4">
                                  • Phased implementation approach to minimize disruption<br/>
                                  • Integration with your existing SAP system<br/>
                                  • Team training and change management strategy<br/>
                                  • Clear ROI projections based on similar engagements
                                </div>
                                <div className="mb-3">
                                  I've structured this engagement based on our successful work with similar technology companies, where we achieved an average of 35% cost reduction and 50% efficiency improvement.
                                </div>
                                <div className="mb-3">
                                  Would you be available for a brief call this Friday to walk through the proposal and address any questions?
                                </div>
                                <div className="mt-4">
                                  Best regards,<br/>
                                  Alex Chen<br/>
                                  Senior Consultant
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Personalized using meeting transcript and client history</div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">87% response rate</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step3Tab === 'sow' && (
                      <div className="p-6 h-full overflow-y-auto">
                        {/* SOW Template */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Statement of Work Template</h5>
                            <div className="flex items-center space-x-2">
                              <Copy className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <Edit3 className="h-3 w-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                          </div>

                          <div className="space-y-3 text-xs">
                            {/* Project Overview */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-2">1. Project Overview</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                <strong>Client:</strong> TechCorp Inc.<br/>
                                <strong>Project:</strong> Digital Transformation Consulting<br/>
                                <strong>Duration:</strong> 18 weeks (Jan 15 - May 31, 2024)
                              </div>
                            </div>

                            {/* Scope of Work */}
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                              <div className="font-semibold text-green-700 dark:text-green-300 mb-2">2. Scope of Work</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                <strong>Phase 1:</strong> Infrastructure Assessment<br/>
                                <strong>Phase 2:</strong> System Integration Design<br/>
                                <strong>Phase 3:</strong> Implementation & Training
                              </div>
                            </div>

                            {/* Deliverables */}
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                              <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">3. Key Deliverables</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                • Current State Assessment Report<br/>
                                • Technology Roadmap<br/>
                                • Implementation Plan<br/>
                                • Training Materials & Documentation
                              </div>
                            </div>

                            {/* Payment Terms */}
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                              <div className="font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                4. Payment Terms
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">
                                <strong>Total:</strong> $185,000<br/>
                                <strong>Schedule:</strong> 30% upfront, 40% at Phase 2, 30% completion<br/>
                                <strong>Terms:</strong> Net 30 days
                              </div>
                            </div>

                            {/* Success Metrics */}
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">5. Success Metrics</div>
                              <div className="text-gray-600 dark:text-gray-400">
                                • 35% reduction in operational costs<br/>
                                • 50% improvement in system efficiency<br/>
                                • 95% user adoption within 30 days
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Auto-generated from proposal and legal templates</div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Ready for review</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks; 