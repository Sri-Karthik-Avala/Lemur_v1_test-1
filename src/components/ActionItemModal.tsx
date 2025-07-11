import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Calendar, 
  AlertCircle, 
  Save,
  Plus
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from '../utils/cn';

interface ActionItem {
  id: string;
  content: string;
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface ActionItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (actionItem: Omit<ActionItem, 'id'>) => void;
  existingItem?: ActionItem;
  title?: string;
}

export const ActionItemModal: React.FC<ActionItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingItem,
  title = 'Add Action Item'
}) => {
  const [formData, setFormData] = useState({
    content: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'completed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setFormData({
        content: existingItem.content,
        assignee: existingItem.assignee || '',
        dueDate: existingItem.dueDate || '',
        priority: existingItem.priority,
        status: existingItem.status
      });
    } else {
      // Reset form for new item
      setFormData({
        content: '',
        assignee: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
      });
    }
    setErrors({});
  }, [existingItem, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Action item description is required';
    } else if (formData.content.trim().length < 5) {
      newErrors.content = 'Description must be at least 5 characters';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onSave({
        content: formData.content.trim(),
        assignee: formData.assignee.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        status: formData.status
      });

      onClose();
    } catch (error) {
      console.error('Error saving action item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const defaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 1 week from now
    return date.toISOString().split('T')[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {existingItem ? 'Edit Action Item' : title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Describe what needs to be done..."
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg resize-none",
                      "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                      "border-gray-300 dark:border-gray-600",
                      "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      "placeholder-gray-500 dark:placeholder-gray-400",
                      errors.content && "border-red-500 dark:border-red-400"
                    )}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignee
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.assignee}
                      onChange={(e) => handleInputChange('assignee', e.target.value)}
                      placeholder="Enter assignee name..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={cn(
                        "pl-10",
                        errors.dueDate && "border-red-500 dark:border-red-400"
                      )}
                    />
                  </div>
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.dueDate}
                    </p>
                  )}
                  {!formData.dueDate && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('dueDate', defaultDueDate())}
                      className="text-blue-500 hover:text-blue-600 text-sm mt-1"
                    >
                      Set to next week
                    </button>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => handleInputChange('priority', priority)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                          formData.priority === priority
                            ? priority === 'high'
                              ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                              : priority === 'medium'
                              ? "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                              : "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                            : "bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status (only show for existing items) */}
                {existingItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['pending', 'completed'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleInputChange('status', status)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                            formData.status === status
                              ? status === 'completed'
                                ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                                : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                              : "bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          {status === 'completed' ? 'Completed' : 'Pending'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                    leftIcon={isSubmitting ? undefined : existingItem ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  >
                    {isSubmitting ? 'Saving...' : existingItem ? 'Update' : 'Add Item'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 