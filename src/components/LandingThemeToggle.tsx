import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const LandingThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-18 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-purple-900 rounded-full p-1.5 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Enhanced background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDarkMode 
            ? "0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)" 
            : "0 0 25px rgba(59, 130, 246, 0.3), 0 0 50px rgba(99, 102, 241, 0.15)"
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      
      {/* Toggle circle with enhanced styling */}
      <motion.div
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-lg transition-all duration-700 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white transform translate-x-8' 
            : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white transform translate-x-0'
        }`}
        animate={{
          x: isDarkMode ? 32 : 0,
          rotate: isDarkMode ? 180 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.7 
        }}
      >
        <motion.div
          key={isDarkMode ? 'moon' : 'sun'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </motion.div>
      </motion.div>

      {/* Subtle decorative elements */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 dark:from-white/5 dark:to-white/10 pointer-events-none" />
      
      {/* Status indicator dots */}
      <div className="absolute top-2 left-2 flex space-x-1">
        <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
          !isDarkMode ? 'bg-yellow-400 opacity-100' : 'bg-gray-400 opacity-30'
        }`} />
        <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
          isDarkMode ? 'bg-blue-400 opacity-100' : 'bg-gray-400 opacity-30'
        }`} />
      </div>
    </motion.button>
  );
};

export default LandingThemeToggle; 