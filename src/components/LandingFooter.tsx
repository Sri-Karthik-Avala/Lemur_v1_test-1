import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Twitter, Linkedin, Github } from 'lucide-react';

const LandingFooter: React.FC = () => {
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' }
  ];

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Brand */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
              <img
                src="/logo_lemur.png"
                alt="Lemur"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Lemur</span>
          </div>
          
          {/* Tagline */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-8">
            Give your company a brain. Transform scattered information into organized intelligence.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors duration-200"
              >
                <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center space-x-2">
            <span>© 2025</span>
            <div className="w-4 h-4 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center">
              <img
                src="/logo_lemur.png"
                alt="Lemur"
                className="w-3 h-3 object-contain"
              />
            </div>
            <span>Lemur AI. All rights reserved.</span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
};

export default LandingFooter; 