import React, { useState } from 'react';
import { Brain, User, Building, ChevronDown, FileText, Clock, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainContext } from '../types';
import { cn } from '../utils/cn';

interface BrainContextSwitcherProps {
  selectedBrain: BrainContext;
  onBrainChange: (brain: BrainContext) => void;
  className?: string;
}

const defaultBrains: BrainContext[] = [
  {
    id: 'personal',
    name: 'Your Brain',
    type: 'personal',
    description: 'Personalized assistant trained on your documents, notes, and history',
    icon: 'user',
    metadata: {
      documentCount: 42,
      lastUpdated: new Date(),
      indexedSize: 2.1
    }
  },
  {
    id: 'company',
    name: 'Company Brain',
    type: 'company',
    description: 'Collective assistant trained on organization-wide knowledge',
    icon: 'building',
    metadata: {
      documentCount: 1247,
      lastUpdated: new Date(),
      indexedSize: 15.8
    }
  }
];

export const BrainContextSwitcher: React.FC<BrainContextSwitcherProps> = ({
  selectedBrain,
  onBrainChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <User className="h-5 w-5" />;
      case 'building':
        return <Building className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const formatSize = (size: number) => {
    return `${size.toFixed(1)} GB`;
  };

  const formatDocumentCount = (count: number) => {
    return count > 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Selected Brain Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              background: selectedBrain.type === 'personal' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            {getIcon(selectedBrain.icon)}
          </div>
          <div className="text-left">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {selectedBrain.name}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedBrain.metadata?.documentCount} docs • {formatSize(selectedBrain.metadata?.indexedSize || 0)}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={cn("h-5 w-5 transition-transform duration-200", isOpen && "rotate-180")} 
          style={{ color: 'var(--text-secondary)' }}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 z-50 mt-2 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-secondary)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="p-2">
                {defaultBrains.map((brain) => {
                  const isSelected = brain.id === selectedBrain.id;
                  return (
                    <button
                      key={brain.id}
                      onClick={() => {
                        onBrainChange(brain);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-lg p-4 text-left transition-all duration-200",
                        isSelected && "ring-2"
                      )}
                      style={{
                        background: isSelected ? 'var(--bg-accent)' : 'transparent',
                        ringColor: isSelected ? 'var(--border-accent)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'var(--bg-secondary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div 
                        className="flex h-12 w-12 items-center justify-center rounded-lg"
                        style={{
                          background: brain.type === 'personal' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white'
                        }}
                      >
                        {getIcon(brain.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {brain.name}
                          </h3>
                          {isSelected && (
                            <div 
                              className="rounded-full px-2 py-1 text-xs font-medium"
                              style={{
                                background: 'var(--bg-accent)',
                                color: 'var(--text-accent)'
                              }}
                            >
                              Active
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-5" style={{ color: 'var(--text-secondary)' }}>
                          {brain.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {formatDocumentCount(brain.metadata?.documentCount || 0)} documents
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {formatSize(brain.metadata?.indexedSize || 0)} indexed
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated today
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div 
                className="border-t px-4 py-3"
                style={{ borderColor: 'var(--border-secondary)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Switch between your personal knowledge base and your organization's collective intelligence.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 