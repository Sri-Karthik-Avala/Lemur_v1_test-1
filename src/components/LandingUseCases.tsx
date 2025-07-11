import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Headphones, 
  FileText, 
  Zap, 
  Building,
  ArrowRight
} from 'lucide-react';

const LandingUseCases: React.FC = () => {
  const consultingRoles = [
    {
      icon: TrendingUp,
      title: "Business Consultants",
      description: "Turn every client conversation into competitive advantage",
      color: "text-emerald-500"
    },
    {
      icon: Users,
      title: "Management Advisors",
      description: "Never lose track of organizational insights",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "Strategy Consultants",
      description: "Build on every previous engagement",
      color: "text-orange-500"
    },
    {
      icon: Zap,
      title: "Process Experts",
      description: "Scale your expertise without the overhead",
      color: "text-yellow-500"
    },
    {
      icon: Headphones,
      title: "Client Success",
      description: "Remember every detail that matters",
      color: "text-purple-500"
    },
    {
      icon: Building,
      title: "Solo Practitioners",
      description: "Compete with the big firms on intelligence",
      color: "text-indigo-500"
    }
  ];

  return (
    <section id="use-cases" className="py-20 md:py-40 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Minimal background element */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/2 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header - Apple Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-24"
        >
          {/* Subtle intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-gray-500 dark:text-gray-400 text-sm md:text-lg font-medium tracking-wide mb-6 md:mb-8"
          >
            For Every Consultant
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[0.9] tracking-tight mb-6 md:mb-8"
          >
            From solo freelancer
            <br />
            to <motion.span 
              className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              consulting powerhouse.
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Whether you're a one-person consultancy or a growing firm, 
            <span className="inline-flex items-center space-x-1 mx-1">
              <img
                src="/logo_lemur.png"
                alt="Lemur"
                className="w-5 h-5 object-contain"
              />
              <span>Lemur</span>
            </span> 
            gives you the intelligence advantage that big consulting houses have—without the overhead.
          </motion.p>
        </motion.div>

        {/* Consulting Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-32">
          {consultingRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group text-center"
            >
              {/* Icon container */}
              <motion.div
                className="flex flex-col items-center mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 md:mb-6 group-hover:shadow-xl transition-shadow duration-300">
                  <role.icon className={`h-8 w-8 md:h-10 md:w-10 ${role.color}`} />
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                {role.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Single Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          
            {/* Central value proposition */}
            
          
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
            className="inline-flex items-center space-x-3 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-300 cursor-pointer"
          >
            <span className="text-sm md:text-lg font-medium flex items-center space-x-1">
              <span>Transform your consulting practice with</span>
              <img
                src="/logo_lemur.png"
                alt="Lemur"
                className="w-5 h-5 object-contain mx-1"
              />
              <span>Lemur</span>
            </span>
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

export default LandingUseCases; 