import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Bot, X, ArrowRight, Search, Zap, Brain, FileText, FolderOpen, MessageSquare, Users, BookOpen, Lightbulb, TrendingUp } from "lucide-react";

export default function LandingBrainOverlay() {
  const [activeSection, setActiveSection] = useState<'knowledge' | 'agents' | null>(null);
  const [flowState, setFlowState] = useState<'input' | 'processing' | 'output'>('input');
  const [dataPoints, setDataPoints] = useState<Array<{id: number, x: number, y: number, type: 'knowledge' | 'insight'}>>([]);

  const handleSectionClick = (section: 'knowledge' | 'agents') => {
    setActiveSection(section);
  };

  const closeModal = () => {
    setActiveSection(null);
  };

  // Continuous flow animation cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      setFlowState(prev => {
        if (prev === 'input') return 'processing';
        if (prev === 'processing') return 'output';
        return 'input';
      });
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  // Generate flowing data points
  useEffect(() => {
    const generateDataPoints = () => {
      const points = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 400 + 150,
        y: Math.random() * 100 + 100,
        type: Math.random() > 0.5 ? 'knowledge' : 'insight' as 'knowledge' | 'insight'
      }));
      setDataPoints(points);
    };

    generateDataPoints();
    const interval = setInterval(generateDataPoints, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30 relative overflow-hidden transition-all duration-700">
      {/* Background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-6 md:mb-8"
          >
            Knowledge becomes
            <br />
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              intelligence.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Your consulting knowledge transforms into intelligent insights that clients pay premium for.
          </motion.p>
        </motion.div>

        {/* Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto mb-12 md:mb-20"
        >
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 shadow-2xl">
            
            {/* Flow Container */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 lg:space-x-16">
              
              {/* Input */}
              <motion.div
                className="flex flex-col items-center text-center"
                animate={{
                  scale: flowState === 'input' ? 1.05 : 1,
                  opacity: flowState === 'input' ? 1 : 0.8
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl md:rounded-3xl flex items-center justify-center cursor-pointer shadow-xl mb-4 md:mb-6"
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleSectionClick('knowledge')}
                  animate={{
                    boxShadow: flowState === 'input' 
                      ? "0 20px 40px rgba(59, 130, 246, 0.3)" 
                      : "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <Database className="h-12 w-12 md:h-16 md:w-16 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h3 className="text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1 md:mb-2">
                  Store
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm max-w-xs">
                  Documents & expertise
                </p>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="h-8 w-8 md:h-12 md:w-12 text-blue-500 rotate-90 md:rotate-0" />
              </motion.div>

              {/* Processing */}
              <motion.div
                className="flex flex-col items-center text-center"
                animate={{
                  scale: flowState === 'processing' ? 1.1 : 1,
                  opacity: flowState === 'processing' ? 1 : 0.8
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center shadow-xl mb-4 md:mb-6"
                  animate={{
                    rotate: flowState === 'processing' ? 360 : 0,
                    boxShadow: flowState === 'processing' 
                      ? "0 25px 50px rgba(34, 197, 94, 0.4)" 
                      : "0 15px 35px rgba(0,0,0,0.1)"
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <Brain className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  Process
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
                  AI analyzes & connects
                </p>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <ArrowRight className="h-8 w-8 md:h-12 md:w-12 text-purple-500 rotate-90 md:rotate-0" />
              </motion.div>

              {/* Output */}
              <motion.div
                className="flex flex-col items-center text-center"
                animate={{
                  scale: flowState === 'output' ? 1.05 : 1,
                  opacity: flowState === 'output' ? 1 : 0.8
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl md:rounded-3xl flex items-center justify-center cursor-pointer shadow-xl mb-4 md:mb-6"
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleSectionClick('agents')}
                  animate={{
                    boxShadow: flowState === 'output' 
                      ? "0 20px 40px rgba(147, 51, 234, 0.3)" 
                      : "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <Lightbulb className="h-12 w-12 md:h-16 md:w-16 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <h3 className="text-lg md:text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1 md:mb-2">
                  Deliver
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm max-w-xs">
                  Insights & proposals
                </p>
              </motion.div>
            </div>

            {/* Flowing particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl md:rounded-3xl">
              <AnimatePresence>
                {dataPoints.map((point) => (
                  <motion.div
                    key={point.id}
                    className={`absolute w-3 h-3 rounded-full ${
                      point.type === 'knowledge' 
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                        : 'bg-purple-500 shadow-lg shadow-purple-500/50'
                    }`}
                    initial={{ 
                      x: point.type === 'knowledge' ? 100 : 450,
                      y: point.y,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      x: point.type === 'knowledge' ? 450 : 100,
                      y: point.y + (Math.sin(point.id * 0.5) * 30),
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.8, 1]
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Interactive Modals */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[80vh] overflow-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeSection === 'knowledge' ? 'Knowledge Vault' : 'AI Agents'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {activeSection === 'knowledge' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: FileText, title: "Documents", desc: "PDFs, presentations, reports" },
                        { icon: MessageSquare, title: "Communications", desc: "Emails, messages, calls" },
                        { icon: Users, title: "Client Data", desc: "Profiles, preferences, history" },
                        { icon: BookOpen, title: "Knowledge Base", desc: "Best practices, templates" },
                        { icon: FolderOpen, title: "Project Files", desc: "Deliverables, assets, notes" },
                        { icon: TrendingUp, title: "Analytics", desc: "Performance, insights, trends" }
                      ].map((item, idx) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/50"
                        >
                          <item.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'agents' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          icon: Bot, 
                          title: "Proposal Generator", 
                          desc: "Creates tailored proposals from your knowledge base and client history",
                          color: "purple"
                        },
                        { 
                          icon: Search, 
                          title: "Research Assistant", 
                          desc: "Finds relevant information across all your documents instantly",
                          color: "green"
                        },
                        { 
                          icon: Lightbulb, 
                          title: "Insight Engine", 
                          desc: "Identifies patterns and opportunities across client engagements",
                          color: "yellow"
                        },
                        { 
                          icon: Zap, 
                          title: "Action Optimizer", 
                          desc: "Suggests next best actions based on successful past engagements",
                          color: "red"
                        }
                      ].map((agent, idx) => (
                        <motion.div
                          key={agent.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-6 bg-gradient-to-br ${
                            agent.color === 'purple' ? 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800/50' :
                            agent.color === 'green' ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/50' :
                            agent.color === 'yellow' ? 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800/50' :
                            'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800/50'
                          } rounded-2xl border`}
                        >
                          <agent.icon className={`h-8 w-8 mb-4 ${
                            agent.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                            agent.color === 'green' ? 'text-green-600 dark:text-green-400' :
                            agent.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`} />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{agent.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{agent.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 