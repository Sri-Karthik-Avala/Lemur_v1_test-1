import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle,
  Plus,
  Download,
  Edit3,
  Copy,
  Check,
  Trash2,
  Loader
} from 'lucide-react';
import { Button } from './Button';
import { ActionItemModal } from './ActionItemModal';
import { useDataStore } from '../stores/dataStore';
import { cn } from '../utils/cn';

interface ActionItem {
  id: string;
  content: string;
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  meetingId?: string;
}

interface ProfessionalActionItemsProps {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
}

export const ProfessionalActionItems: React.FC<ProfessionalActionItemsProps> = ({
  meetingId,
  meetingTitle,
  meetingDate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data store hooks
  const { 
    addActionItem, 
    updateActionItem, 
    deleteActionItem, 
    toggleActionItemStatus,
    getActionItemsByMeeting,
    initializeData
  } = useDataStore();

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Get action items for this meeting
  const actionItems = getActionItemsByMeeting(meetingId);

  // Handler functions
  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: ActionItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleToggleStatus = async (itemId: string) => {
    try {
      setIsLoading(true);
      toggleActionItemStatus(itemId);
      console.log('Action item status updated');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this action item?')) {
      return;
    }

    try {
      setIsLoading(true);
      deleteActionItem(itemId);
      console.log('Action item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (itemData: Omit<ActionItem, 'id'>) => {
    try {
      setIsLoading(true);
      
      if (editingItem) {
        // Update existing item
        updateActionItem(editingItem.id, itemData);
        console.log('Action item updated');
      } else {
        // Add new item
        const newItem = {
          ...itemData,
          id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          meetingId
        };
        addActionItem(newItem);
        console.log('Action item added');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyItem = async (item: ActionItem) => {
    const text = `Action Item: ${item.content}\nAssigned to: ${item.assignee || 'Unassigned'}\nDue Date: ${item.dueDate || 'No due date'}\nPriority: ${item.priority.toUpperCase()}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportReport = () => {
    const report = generateActionItemsReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `action-items-${meetingDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateActionItemsReport = () => {
    const header = `ACTION ITEMS REPORT
Meeting: ${meetingTitle}
Date: ${meetingDate}
Generated: ${new Date().toLocaleDateString()}

========================================

`;

    const itemsText = actionItems.map((item, index) => {
      return `${index + 1}. ${item.content}
   Assignee: ${item.assignee || 'Unassigned'}
   Due Date: ${item.dueDate || 'No due date'}
   Priority: ${item.priority.toUpperCase()}
   Status: ${item.status.toUpperCase()}

`;
    }).join('');

    const summary = `
========================================
SUMMARY
Total Action Items: ${actionItems.length}
Pending: ${actionItems.filter(item => item.status === 'pending').length}
Completed: ${actionItems.filter(item => item.status === 'completed').length}
High Priority: ${actionItems.filter(item => item.priority === 'high').length}
`;

    return header + itemsText + summary;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Action Items Generated
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          AI analysis did not identify any specific action items from this meeting.
        </p>
        <Button onClick={handleAddItem} leftIcon={<Plus className="h-4 w-4" />}>
          Add Manual Action Item
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Generated on {meetingDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              leftIcon={<Download className="h-4 w-4" />}
              disabled={isLoading}
            >
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleAddItem}
              leftIcon={<Plus className="h-4 w-4" />}
              disabled={isLoading}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 dark:text-gray-400">
                Total: <span className="font-medium text-gray-900 dark:text-white">{actionItems.length}</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Pending: <span className="font-medium text-amber-600 dark:text-amber-400">
                  {actionItems.filter(item => item.status === 'pending').length}
                </span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Completed: <span className="font-medium text-green-600 dark:text-green-400">
                  {actionItems.filter(item => item.status === 'completed').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
          {actionItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                item.status === 'completed' 
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" 
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className={cn(
                        "text-gray-900 dark:text-white font-medium mb-2",
                        item.status === 'completed' && "line-through text-gray-500 dark:text-gray-400"
                      )}>
                        {item.content}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <User className="h-3 w-3" />
                          <span>{item.assignee || 'Unassigned'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{item.dueDate || 'No due date'}</span>
                        </div>
                        
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getPriorityColor(item.priority)
                        )}>
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyItem(item)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(item.id)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <CheckCircle className={cn(
                          "h-3 w-3",
                          item.status === 'completed' ? "text-green-500" : "text-gray-400"
                        )} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Item Modal */}
      <ActionItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
        existingItem={editingItem || undefined}
      />
    </>
  );
}; 