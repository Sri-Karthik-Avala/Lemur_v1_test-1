import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';

const LandingCTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !isLoading) {
      setIsLoading(true);
      setError(null);
      
      try {
        await ApiService.getAccess({ email });
        setIsSubmitted(true);
        setEmail('');
      } catch (err: any) {
        setError(err.message || 'Failed to submit. Please try again.');
        console.error('Early access submission failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="py-20 md:py-40 bg-gray-50 dark:bg-gray-950 relative overflow-hidden transition-colors duration-500">
      {/* Minimal background element */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

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
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-lg font-medium tracking-wide mb-6 md:mb-8"
          >
            Early Access
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-6 md:mb-8"
          >
            Ready to give your
            <br />
            company a
            <motion.span 
              className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {' '}brain?
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Join forward-thinking companies transforming their operations with 
            centralized intelligence. Early access includes priority support.
          </motion.p>
        </motion.div>

        {/* Single CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 md:mb-32"
        >
                      <div className="bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 text-center shadow-lg max-w-2xl mx-auto">
            
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Mail className="h-12 w-12 text-purple-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Get Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Get notified when early access opens
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                  
                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}
                  
                  <motion.button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ 
                      scale: !isLoading ? 1.02 : 1, 
                      boxShadow: !isLoading ? "0 20px 40px -10px rgba(139, 92, 246, 0.4)" : undefined
                    }}
                    whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                    disabled={isLoading}
                  >
                    <span>{isLoading ? 'Submitting...' : 'Get Access'}</span>
                    {!isLoading && (
                      <motion.div
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">🔒 Secure</span> — We respect your privacy
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Thanks for Joining! 🎉
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                  <p className="text-lg font-medium">
                    You will be getting an email confirmation shortly
                  </p>
                  <p>
                    We'll reach out to you with exclusive early access details and priority support.
                  </p>
                </div>
                
                {/* Additional benefits */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">✓</span>
                    <span>Priority access to early features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">✓</span>
                    <span>Exclusive product updates and roadmap insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500">✓</span>
                    <span>Direct line to our founders for feedback</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expected timeline: We'll be in touch within 24-48 hours
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-8 max-w-3xl mx-auto">
            {[
              { number: "Coming Soon", label: "Early Access Program" },
              
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default LandingCTASection; 