import React, { useState, useEffect } from 'react';
import { X, Video, Bot, Link as LinkIcon, Type, AlertCircle, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { useToastStore } from '../stores/toastStore';
import { ApiService, MyClientsResponse } from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinMeetingModal: React.FC<JoinMeetingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; title?: string; client?: string }>({});
  const [meetingType, setMeetingType] = useState<'internal' | 'external'>('internal');
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [clients, setClients] = useState<Array<{ client_id: number; client_name: string }>>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientLoading, setNewClientLoading] = useState(false);
  
  const { success: showSuccess, error: showError } = useToastStore();
  const { user } = useAuthStore();

  // Load clients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    setClientsLoading(true);
    try {
      const response = await ApiService.getMyClients();

      // Normalize the returned shape to { client_id, client_name }
      const normalized = response.clients.map((c: any) => ({
        client_id: c.client_id ?? c.id,
        client_name: c.client_name ?? c.name,
      }));

      setClients(normalized);

      // DEBUG: remove later
      console.log('🔄 Loaded clients:', normalized);
    } catch (error) {
      console.error('Failed to load clients:', error);
      showError('Failed to Load Clients', 'Could not load your client list. Please try again.');
    } finally {
      setClientsLoading(false);
    }
  };

  const handleAddNewClient = async () => {
    const trimmedName = newClientName.trim();
    if (!trimmedName) {
      return;
    }

    setNewClientLoading(true);
    try {
      let shouldCreateRelationship = true;
      try {
        // First try to validate if the client already exists and/or the user has access
        const validation = await ApiService.validateClient(trimmedName);

        if (validation.exists && validation.has_access) {
          // User already has access – simply select the existing client and skip creation
          if (validation.client_id !== undefined) {
            setSelectedClient({ id: validation.client_id, name: trimmedName });
          }
          setShowAddClientModal(false);
          setNewClientName('');
          showSuccess('Client Selected', `${trimmedName} is already available and has been selected.`);
          // Refresh client list in case it was not present
          await loadClients();
          shouldCreateRelationship = false;
        }
      } catch (err: any) {
        // If the validate endpoint is not found (404) or any other error, we'll proceed to create the relationship
        if (err.response && err.response.status !== 404) {
          // For non-404 errors, surface to user
          throw err;
        }
      }

      let response: any = null;
      if (shouldCreateRelationship) {
        response = await ApiService.createClientRelationship(trimmedName);
      }

      const effectiveClient = response ?? { client_id: shouldCreateRelationship ? undefined : undefined, client_name: trimmedName };

      // Add the new client to the list (or update if it already existed)
      if (effectiveClient.client_id) {
        const newClient = {
          client_id: effectiveClient.client_id,
          client_name: effectiveClient.client_name,
        };
        setClients((prev) => [...prev, newClient]);
        // Auto-select the new client
        setSelectedClient({ id: effectiveClient.client_id, name: effectiveClient.client_name });
      }

      // Close modal and reset (if not already closed)
      setShowAddClientModal(false);
      setNewClientName('');

      if (shouldCreateRelationship && response) {
        showSuccess('Client Added', `Successfully added ${response.client_name}`);
      }

      // Refresh client list to ensure consistency with backend
      await loadClients();
       
    } catch (error: any) {
      showError(
        'Failed to Add Client',
        error.message || 'Could not add the new client. Please try again.'
      );
    } finally {
      setNewClientLoading(false);
    }
  };

  const validateUrl = (url: string) => {
    // Basic URL validation for common meeting platforms
    const meetingPlatforms = [
      'zoom.us',
      'meet.google.com',
      'teams.microsoft.com',
      'webex.com',
      'bluejeans.com',
      'gotomeeting.com',
      'whereby.com'
    ];
    
    try {
      const urlObj = new URL(url);
      return meetingPlatforms.some(platform => urlObj.hostname.includes(platform));
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the new API endpoint with updated parameters
      const data = await ApiService.joinMeetingNew(
        meetingUrl.trim(),
        meetingTitle.trim(),
        meetingType === 'external',
        selectedClient?.id
      );

      // Store the meeting with bot_id for future transcript retrieval
      const meetingData = {
        id: `meeting_${Date.now()}`,
        title: meetingTitle.trim(),
        description: `AI Bot joined meeting: ${meetingTitle.trim()}`,
        meetingLink: meetingUrl.trim(),
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toTimeString().slice(0, 5),
        endTime: new Date(Date.now() + 3600000).toTimeString().slice(0, 5), // 1 hour later
        attendees: [
          { id: 'bot1', name: 'Lemur AI Bot', email: 'bot@lemurai.com' },
          { id: 'user1', name: 'You', email: 'user@example.com' }
        ],
        status: 'in_progress' as const,
        bot_id: data.bot_id, // Store the bot_id for transcript retrieval
        meetingType: meetingType,
        platform: 'meet' as const,
        actionItems: [],
        tags: [],
        userId: user?.id,
        clientId: selectedClient?.id,
        clientName: selectedClient?.name
      };

      // No localStorage: backend will include this meeting in /mymeetings

      const successMessage = meetingType === 'internal' 
        ? `Internal meeting "${meetingTitle.trim()}" created successfully!`
        : `Bot joined external meeting "${meetingTitle.trim()}"${selectedClient ? ` for ${selectedClient.name}` : ''} successfully!`;
      
      showSuccess(
        'Meeting Created!',
        `${data.bot_id ? `Bot ID: ${data.bot_id} - ` : ''}${data.message || successMessage}`
      );

      // Reset form
      setMeetingUrl('');
      setMeetingTitle('');
      setSelectedClient(null);
      setMeetingType('internal');
      setErrors({});
      onClose();

    } catch (error: any) {
      showError(
        'Failed to Create Meeting', 
        error.message || error.response?.data?.detail || error.response?.data?.message || 'Please check your meeting details and try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setMeetingUrl('');
      setMeetingTitle('');
      setErrors({});
      onClose();
    }
  };

  const validateForm = () => {
    // Reset errors
    setErrors({});

    const newErrors: { url?: string; title?: string; client?: string } = {};

    if (!meetingUrl.trim()) {
      newErrors.url = 'Meeting URL is required';
    } else if (meetingType === 'external' && !validateUrl(meetingUrl)) {
      newErrors.url =
        'Please enter a valid meeting URL from supported platforms (Zoom, Google Meet, Teams, etc.)';
    }

    if (!meetingTitle.trim()) {
      newErrors.title = 'Meeting title is required';
    }

    if (meetingType === 'external' && !selectedClient) {
      newErrors.client = 'Please select a client for external meetings';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="md"
      showCloseButton={false}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Join Meeting
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send Lemur AI bot to join and record a meeting
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
{/* Meeting URL Input */}
          <div>
            <Input
              id="meetingUrl"
              type="url"
              label="Meeting URL"
              placeholder="https://zoom.us/j/1234567890 or https://meet.google.com/abc-defg-hij"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              error={errors.url}
              leftIcon={<LinkIcon className="h-5 w-5 text-gray-400" />}
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported platforms: Zoom, Google Meet, Microsoft Teams, WebEx, and more
            </p>
          </div>

          {/* Meeting Title Input */}
          <div>
            <Input
              id="meetingTitle"
              type="text"
              label="Meeting Title"
              placeholder="e.g., Client Strategy Discussion, Team Standup"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              error={errors.title}
              leftIcon={<Type className="h-5 w-5 text-gray-400" />}
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This helps you identify the recording later
            </p>
          </div>

          {/* Meeting Type Toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 select-none">
              <input
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={meetingType === 'internal'}
                onChange={() => setMeetingType('internal')}
                disabled={isLoading}
              />
              <span className="ml-2">Internal Meeting</span>
            </label>
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 select-none">
              <input
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={meetingType === 'external'}
                onChange={() => setMeetingType('external')}
                disabled={isLoading}
              />
              <span className="ml-2">External Meeting</span>
            </label>
          </div>

          {/* Client Dropdown (only for External Meetings) */}
          {meetingType === 'external' && (
            <div>
              <div className="relative" onClick={() => setShowClientDropdown(!showClientDropdown)}>
                <button
                  type="button"
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer sm:text-sm text-gray-900 dark:text-gray-100"
                  aria-haspopup="listbox"
                  aria-expanded="true"
                >
                  <span className="block truncate">
                    {selectedClient?.name || 'Select Client'}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </button>
                {showClientDropdown && (
                  <ul
                    tabIndex={-1}
                    role="listbox"
                    className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  >
                    {clients.map((client) => (
                      <li
                        key={client.client_id}
                        role="option"
                        className="text-gray-900 dark:text-white cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 dark:hover:bg-blue-700/30"
                        onClick={() => {
                          setSelectedClient({ id: client.client_id, name: client.client_name });
                          setShowClientDropdown(false);
                        }}
                      >
                        <span className="font-normal block truncate">
                          {client.client_name}
                        </span>
                      </li>
                    ))}
                    {/* Option to add a new client */}
                    <li
                      key="add_new_client"
                      role="option"
                      className="text-blue-600 dark:text-blue-400 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 dark:hover:bg-blue-700/30"
                      onClick={() => {
                        setShowAddClientModal(true);
                        setShowClientDropdown(false);
                      }}
                    >
                      <span className="font-normal block truncate">
                        <Plus className="inline-block w-4 h-4 mr-2" /> Add New Client...
                      </span>
                    </li>
                  </ul>
                )}
              </div>
              {errors.client && <p className="mt-2 text-sm text-red-600">{errors.client}</p>}
            </div>
          )}

          {/* Add New Client Modal */}
          {showAddClientModal && (
            <Modal isOpen={showAddClientModal} onClose={() => setShowAddClientModal(false)} size="sm">
              <h3 className="text-lg font-medium text-gray-900">Add New Client</h3>
              <div className="mt-2">
                <Input
                  id="newClientName"
                  type="text"
                  label="Client Name"
                  placeholder="Enter client name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  disabled={newClientLoading}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAddClientModal(false)}
                  disabled={newClientLoading}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNewClient}
                  isLoading={newClientLoading}
                  className="bg-blue-600"
                >
                  Add Client
                </Button>
              </div>
            </Modal>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm">
                <p className="text-blue-900 dark:text-blue-100 font-semibold mb-3">
                  What happens next:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Bot joins the meeting automatically</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Records audio and video (if available)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Generates transcript and summary</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Creates action items and follow-ups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Video className="h-5 w-5" />}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? 'Joining...' : 'Join Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}; 