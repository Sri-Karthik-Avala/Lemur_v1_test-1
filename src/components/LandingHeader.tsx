import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LandingThemeToggle from './LandingThemeToggle';

const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Don't show header on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Use Cases', id: 'use-cases' },
    { name: 'Integrations', id: 'integrations' }
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3 flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.div 
                className="relative"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500"></div>
                <img 
                  src="/logo_lemur.png" 
                  alt="Lemur AI" 
                  className="relative h-10 w-10 lg:h-12 lg:w-12 object-contain p-2 transition-all duration-500 filter drop-shadow-sm"
                />
              </motion.div>
              
              <motion.span 
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white transition-all duration-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Lemur
                <motion.span 
                  className="text-blue-500 dark:text-blue-400 transition-colors duration-500"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  AI
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleSmoothScroll(item.id)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg relative group bg-transparent border-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 dark:bg-blue-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.button>
            ))}
          </nav>

          {/* Desktop Auth & CTA Section */}
          <div className="hidden lg:flex items-center space-x-6">
            <LandingThemeToggle />
            
            {/* Auth Buttons Group */}
            <Link to="/login">
              <motion.button
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Log In
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="lg:hidden flex items-center space-x-3">
            <LandingThemeToggle />
            <motion.button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          height: isMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="lg:hidden bg-white/98 dark:bg-black/98 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
      >
        <motion.div 
          className="px-4 py-6 space-y-4"
          initial={{ y: -20 }}
          animate={{ y: isMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleSmoothScroll(item.id)}
                className="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-base font-medium py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent border-none cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                whileHover={{ x: 4 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
          
          {/* Mobile Auth Section */}
          <motion.div 
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600">
                Log In
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default LandingHeader; 