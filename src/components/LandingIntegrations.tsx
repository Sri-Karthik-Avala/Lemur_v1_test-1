import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Video, FileText, Calendar, Database, Zap, Globe, ArrowRight, Users, Briefcase } from 'lucide-react';

const LandingIntegrations: React.FC = () => {
  const consultingTools = [
    { name: 'Google Workspace', icon: Mail, color: 'text-red-500 dark:text-red-400' },
    { name: 'Microsoft Teams', icon: Video, color: 'text-blue-500 dark:text-blue-400' },
    { name: 'Cisco WebEx', icon: Video, color: 'text-green-600 dark:text-green-500' },
    { name: 'Zoom', icon: Users, color: 'text-blue-600 dark:text-blue-500' },
    { name: 'Google Meet', icon: Video, color: 'text-green-500 dark:text-green-400' }
  ];

  return (
    <section id="integrations" className="py-20 md:py-40 bg-gray-50 dark:bg-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Minimal background element */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/3 dark:bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header - Apple Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          {/* Subtle intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-lg font-medium tracking-wide mb-6 md:mb-8"
          >
            No Workflow Disruption
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-6 md:mb-8"
          >
            Plugs into your
            <br />
            <motion.span 
              className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              existing toolkit.
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto text-center"
          >
            You don't need new tools. You need your existing tools to work smarter. 
            Lemur connects everything you already use—seamlessly.
          </motion.p>
        </motion.div>

        {/* Integration Icons - Floating Grid */}
        <div className="flex flex-wrap justify-center items-end gap-8 sm:gap-10 md:gap-12 mb-16 md:mb-32 max-w-4xl mx-auto">
          {consultingTools.map((tool, index) => (
                          <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5
                }}
                className="group text-center flex flex-col items-center min-w-[100px]"
              >
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:shadow-xl transition-all duration-300 mx-auto">
                <tool.icon className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 ${tool.color}`} />
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-xs sm:text-sm md:text-sm text-gray-600 dark:text-gray-400 mt-3 sm:mt-3 md:mt-4 block font-medium leading-tight text-center"
              >
                {tool.name}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Three Key Benefits for Consultants */}
       
        {/* Single Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
                      <div className="bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 text-center shadow-lg">
            
            {/* Central value proposition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                Works with your existing
                <br />
                <span className="text-gray-600 dark:text-gray-400">
                  consulting toolkit.
                </span>
              </h3>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-12 leading-relaxed text-justify">
                Lemur integrates seamlessly with the tools you already use daily. No workflow disruption, 
                no learning curve - just instant intelligence layered on top of your existing processes.
              </p>

              {/* Key integration benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 mb-1 md:mb-2">30sec</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Setup Time</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500 mb-1 md:mb-2">Zero</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Training Required</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500 mb-1 md:mb-2">5+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Platform Integrations</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Clean CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="inline-flex items-center space-x-3 text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors duration-300 cursor-pointer"
          >
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">Connect your tools in minutes</span>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default LandingIntegrations; 