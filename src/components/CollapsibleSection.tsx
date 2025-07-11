import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  badgeColor?: string;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  className
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
        'w-full isolate',
        className
      )}
      style={{ contain: 'layout' }}
    >
      {/* Header */}
      <button
        onClick={toggleOpen}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-between',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
          'text-left relative z-10'
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              {badge && (
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
                  badgeColor
                )}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="text-gray-400 dark:text-gray-500"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: 'easeInOut',
              height: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }}
            style={{ 
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-6 relative">
                <div className="relative z-0">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 