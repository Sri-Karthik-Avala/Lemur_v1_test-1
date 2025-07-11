import React, { useState } from 'react';
import { Calendar, Clock, Video, Users, ExternalLink, Play, Save, X, Plus, Brain, FileText, Edit, Trash2, ChevronDown, ChevronUp, Bot, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Meeting } from '../types';
import type { RealMeeting } from '../services/realMeetings';
import { RealMeeting as RealMeetingService } from '../services/realMeetings';
import { cn } from '../utils/cn';
import { formatDate, formatTime, getMeetingDuration } from '../utils/date-utils';
import { joinMeeting } from '../utils/button-actions';
import { useDataStore } from '../stores/dataStore';
import { Button } from './Button';
import { Input } from './Input';
import { OverlayEditModal, EditFormWrapper, FormSection, FormActions, InputGroup } from './OverlayEditModal';
import { useToastStore } from '../stores/toastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../services/api';

interface MeetingCardProps {
  meeting: Meeting | RealMeeting;
  className?: string;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, className }) => {
  const { id, title, date, startTime, endTime, attendees, status, platform } = meeting;

  // Handle both Meeting and RealMeeting types
  const meetingLink = (meeting as Meeting).meetingLink || '';
  const description = (meeting as Meeting).description || (meeting as RealMeeting).summary || '';
  const isRealMeeting = 'hasAIContent' in meeting;
  const hasAIContent = (meeting as RealMeeting).hasAIContent || false;
  const hasVideo = (meeting as RealMeeting).hasVideo || false;
  const botId = (meeting as Meeting).bot_id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: title,
    date: new Date(date).toISOString().split('T')[0],
    startTime: new Date(startTime).toTimeString().slice(0, 5),
    endTime: new Date(endTime).toTimeString().slice(0, 5),
    platform: platform || 'zoom',
    meetingLink: meetingLink,
    description: description,
    status: status,
  });
  const [attendeesList, setAttendeesList] = useState(attendees);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const { updateMeeting, deleteMeeting } = useDataStore();
  const { success, error } = useToastStore();

  const statusColors = {
    scheduled: 'badge badge-primary',
    in_progress: 'badge badge-success',
    completed: 'badge text-gray-600 dark:text-gray-400',
    cancelled: 'badge badge-error',
    processing: 'badge badge-warning',
    failed: 'badge badge-error',
  };

  const platformIcons = {
    zoom: { icon: Video, color: 'text-blue-600 dark:text-blue-400' },
    teams: { icon: Video, color: 'text-purple-600 dark:text-purple-400' },
    meet: { icon: Video, color: 'text-green-600 dark:text-green-400' },
    other: { icon: Video, color: 'text-dark-600 dark:text-dark-400' },
  };

  const duration = getMeetingDuration(startTime, endTime);
  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);

  const otherAttendees = attendees.length > 1
    ? `+${attendees.length - 1} others`
    : '';

  const platformKey = platform as keyof typeof platformIcons | undefined;
  const PlatformIcon = platformKey ? platformIcons[platformKey].icon : Video;
  const platformColor = platformKey ? platformIcons[platformKey].color : 'text-dark-600 dark:text-dark-400';

  // Check if meeting is completed and has bot_id for transcription
  const canFetchTranscript = status === 'completed' && botId;

  const handleFetchTranscript = async () => {
    if (!botId) return;
    
    setIsLoadingTranscript(true);
    try {
      const transcriptResponse = await ApiService.getMeetingOutput(botId);
      setTranscriptData(transcriptResponse);
      success('Transcription Retrieved', 'Meeting transcription has been loaded successfully.');
    } catch (err: any) {
      error('Failed to Load Transcription', err.message || 'Unable to retrieve meeting transcription.');
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  const handleGetVideo = async () => {
    if (!botId) return;
    
    try {
      const videoResponse = await ApiService.getVideoUrl(botId);
      if (videoResponse.video_url) {
        window.open(videoResponse.video_url, '_blank');
        success('Video Opened', 'Meeting video has been opened in a new tab.');
      }
    } catch (err: any) {
      error('Failed to Load Video', err.message || 'Unable to retrieve meeting video.');
    }
  };

  const handleJoinMeeting = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinMeeting(id);
  };

  const handleCardClick = () => {
    setIsEditModalOpen(true);
  };

  const addAttendee = () => {
    if (!newAttendeeEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAttendeeEmail)) {
      error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    const newAttendee = {
      id: Date.now().toString(),
      name: newAttendeeEmail.split('@')[0],
      email: newAttendeeEmail,
    };

    setAttendeesList([...attendeesList, newAttendee]);
    setNewAttendeeEmail('');
  };

  const removeAttendee = (attendeeId: string) => {
    setAttendeesList(attendeesList.filter(a => a.id !== attendeeId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.date || !formData.startTime || !formData.endTime) {
      error('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (attendeesList.length === 0) {
      error('No Attendees', 'Please add at least one attendee.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      const updatedMeeting: Meeting = {
        ...meeting,
        title: formData.title.trim(),
        date: startDateTime.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendees: attendeesList,
        platform: formData.platform,
        status: formData.status,
      };

      updateMeeting(id, updatedMeeting);
      success('Meeting Updated', 'Meeting has been updated successfully.');
      setIsEditModalOpen(false);
    } catch (err) {
      error('Save Failed', 'Failed to save the meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      deleteMeeting(id);
      success('Meeting Deleted', 'Meeting has been deleted successfully.');
      setIsEditModalOpen(false);
    } catch (err) {
      error('Delete Failed', 'Failed to delete the meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canJoin = status === 'scheduled' || status === 'in_progress';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'meeting-card',
        'rounded-xl shadow-sm border transition-all duration-200 p-6',
        'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700',
        'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
        'border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formattedDate} • {duration}
            </span>
            {platform && (
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={statusColors[status]}>{status}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Attendees */}
      {attendees.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {attendees.slice(0, 3).map((attendee, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {attendee.name}
              </span>
            ))}
            {attendees.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                +{attendees.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Transcription Section for Completed Meetings */}
      {canFetchTranscript && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                AI Meeting Analysis Available
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleFetchTranscript}
                isLoading={isLoadingTranscript}
                leftIcon={<FileText className="h-3 w-3" />}
                className="text-xs"
              >
                Get Transcript
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGetVideo}
                leftIcon={<PlayCircle className="h-3 w-3" />}
                className="text-xs"
              >
                Watch Video
              </Button>
            </div>
          </div>
          
          {transcriptData && (
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
              <div className="space-y-2">
                {transcriptData.summary && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Summary:</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                      {transcriptData.summary}
                    </p>
                  </div>
                )}
                {transcriptData.action_items && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Action Items:</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {transcriptData.action_items}
                    </p>
                  </div>
                )}
                {transcriptData.transcript && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Transcript:</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {transcriptData.transcript}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link
          to={`/meetings/${id}`}
          className="flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            leftIcon={<ExternalLink className="h-4 w-4" />}
          >
            View Details
          </Button>
        </Link>

        {canJoin && (
          <Button
            size="sm"
            onClick={handleJoinMeeting}
            leftIcon={<Play className="h-4 w-4" />}
            className="flex-shrink-0"
          >
            Join
          </Button>
        )}
      </div>

      {/* Professional Overlay Edit Modal - Portal renders outside component tree */}
      <OverlayEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Meeting"
        size="lg"
      >
        <EditFormWrapper onSubmit={handleSubmit}>
          <FormSection>
            <InputGroup label="Meeting Title" required>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter meeting title"
                required
              />
            </InputGroup>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InputGroup label="Date" required>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </InputGroup>
              <InputGroup label="Start Time" required>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </InputGroup>
              <InputGroup label="End Time" required>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputGroup label="Platform">
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="input w-full"
                >
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="meet">Google Meet</option>
                  <option value="other">Other</option>
                </select>
              </InputGroup>
              <InputGroup label="Status">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="input w-full"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </InputGroup>
            </div>

            <InputGroup label="Meeting Link">
              <Input
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="Enter meeting link"
                leftIcon={<Video className="h-4 w-4" />}
              />
            </InputGroup>

            <InputGroup label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Meeting agenda or description"
                rows={3}
                className="input w-full resize-none"
              />
            </InputGroup>
          </FormSection>

          <FormSection title="Attendees" description="Manage meeting attendees">
            <div className="flex gap-2 mb-3">
              <Input
                value={newAttendeeEmail}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
              <Button
                type="button"
                onClick={addAttendee}
                variant="outline"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add
              </Button>
            </div>

            {attendeesList.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {attendeesList.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {attendee.name ? attendee.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attendee.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttendee(attendee.id)}
                      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              leftIcon={<X className="h-4 w-4" />}
            >
              Delete Meeting
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </FormActions>
        </EditFormWrapper>
      </OverlayEditModal>
    </motion.div>
  );
};