// --- Page Metadata ---
/**
 * @page Meetings
 * @description Enhanced meetings page with calendar, upcoming/previous meetings, and metadata. No backend integration.
 * @author Lemur
 * @lastModified 2024-06-09
 * @meta Helmet: <title>Meetings | Lemur AI</title> <meta name="description" content="Enhanced meetings page with calendar, upcoming/previous meetings, and metadata." />
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, List, Grid, Plus, Users, Video, FileText, ArrowRight, ArrowLeft, PlayCircle, BookOpen, StickyNote, Bot, Video as VideoIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { JoinMeetingModal } from '../components/JoinMeetingModal';
import { cn } from '../utils/cn';
import { Calendar } from '../components/Calendar';
// Static demo data removed – everything comes from backend
import { Meeting, ActionItem } from '../types';
import { ApiService } from '../services/api';
import { useToastStore } from '../stores/toastStore';
import { useAuthStore } from '../stores/authStore';

const calendarViews = ['month', 'week', 'day'] as const;
type CalendarView = typeof calendarViews[number];

export const Meetings: React.FC = () => {
  // --- Metadata for internal use ---
  const metadata = {
    page: 'Meetings',
    description: 'Enhanced meetings page with calendar, upcoming/previous meetings, and metadata. No backend integration.',
    author: 'Lemur',
    lastModified: '2024-06-09',
  };

  // --- Hooks ---
  const navigate = useNavigate();
  const { success, error } = useToastStore();
  const { user } = useAuthStore();

  // --- State ---
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [isJoinMeetingModalOpen, setIsJoinMeetingModalOpen] = useState(false);
  const [loadingTranscripts, setLoadingTranscripts] = useState<Record<string, boolean>>({});
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const processedMeetings = useRef<Set<string>>(new Set());
  const retryAttempts = useRef<Map<string, number>>(new Map());

  // Fetch meetings from backend on component mount
  useEffect(() => {
    const fetchBackendMeetings = async () => {
      try {
        const raw = await ApiService.getMyMeetings();

        const mapped: Meeting[] = (raw || []).map((m: any) => {
          const statusRaw = (m["Meeting status"] || '').toLowerCase();
          
          // Enhanced status mapping to handle bot states
          let status: any;
          
          // Handle bot recording states
          if (['bot.in_call_recording', 'in_call_recording'].includes(statusRaw)) {
            status = 'in_call_recording';
          } else if (['bot.joining_call', 'bot.in_waiting_room', 'bot.in_call_not_recording', 'bot.recording_permission_allowed'].includes(statusRaw)) {
            status = 'in_progress';
          } else if (['in_waiting_room', 'in_progress', 'joining', 'waiting', 'call_started'].includes(statusRaw)) {
            status = 'in_progress';
          } else if (['bot.call_ended', 'bot.done', 'done', 'call_ended', 'media_expired', 'completed', 'finished'].includes(statusRaw)) {
            status = 'completed';
          } else if (['bot.fatal', 'bot.recording_permission_denied'].includes(statusRaw)) {
            status = 'failed';
          } else {
            status = statusRaw || 'unknown';
          }

          return {
            id: String(m.id),
            title: m["Meeting title"] || 'Untitled Meeting',
            description: status === 'in_call_recording' ? 'Bot is currently recording the meeting.' : 
                        status === 'in_progress' ? 'Meeting is currently in progress.' : '',
            meetingLink: '',
            date: m["Date"],
            startTime: (m["Time start"] || '').substring(0,5) || '00:00',
            endTime: (m["Time end"] || '').substring(0,5) || '00:00',
            attendees: [],
            status: status,
            platform: 'meet',
            clientId: m["Client id"] ? String(m["Client id"]) : undefined,
            meetingType: m["External meeting"] ? 'external' : 'internal',
            bot_id: m["Bot id"],
            actionItems: [],
            tags: [],
          } as Meeting;
        });

        // Store all meetings regardless of status
        setAllMeetings(mapped);
      } catch (err) {
        console.error('Failed to fetch backend meetings:', err);
      }
    };

    fetchBackendMeetings();
  }, []);

  // Categorize meetings based on status (must be before useEffects that use these variables)
  const recordingMeetings = allMeetings.filter(m => m.status === 'in_call_recording');
  const activeMeetings = allMeetings.filter(m => m.status === 'in_progress');
  // Combine both recording and in_progress meetings as "ongoing"
  const ongoingMeetings = [...recordingMeetings, ...activeMeetings];
  const upcomingMeetings = allMeetings.filter(m => m.status === 'scheduled');
  const completedMeetings = allMeetings.filter(m => ['completed', 'done', 'call_ended', 'media_expired', 'finished'].includes(String(m.status)));
  const failedMeetings = allMeetings.filter(m => m.status === 'failed');
  const unknownMeetings = allMeetings.filter(m => !['in_call_recording', 'in_progress', 'scheduled', 'completed', 'done', 'call_ended', 'media_expired', 'finished', 'failed'].includes(String(m.status)));

  // Meeting completion is now handled by the backend status updates
  // We'll only move meetings to completed when the backend reports they're done
  
  // Periodic polling for ongoing meetings to update status and trigger AI analysis
  useEffect(() => {
    if (ongoingMeetings.length === 0) return;
    
    const pollInterval = setInterval(async () => {
      try {
        // Refresh meeting data from backend
        const raw = await ApiService.getMyMeetings();
        const mapped: Meeting[] = (raw || []).map((m: any) => {
          const statusRaw = (m["Meeting status"] || '').toLowerCase();
          
          // Enhanced status mapping to handle bot states
          let status: any;
          
          // Handle bot recording states
          if (['bot.in_call_recording', 'in_call_recording'].includes(statusRaw)) {
            status = 'in_call_recording';
          } else if (['bot.joining_call', 'bot.in_waiting_room', 'bot.in_call_not_recording', 'bot.recording_permission_allowed'].includes(statusRaw)) {
            status = 'in_progress';
          } else if (['in_waiting_room', 'in_progress', 'joining', 'waiting', 'call_started'].includes(statusRaw)) {
            status = 'in_progress';
          } else if (['bot.call_ended', 'bot.done', 'done', 'call_ended', 'media_expired', 'completed', 'finished'].includes(statusRaw)) {
            status = 'completed';
          } else if (['bot.fatal', 'bot.recording_permission_denied'].includes(statusRaw)) {
            status = 'failed';
          } else {
            status = statusRaw || 'unknown';
          }

          return {
            id: String(m.id),
            title: m["Meeting title"] || 'Untitled Meeting',
            description: status === 'in_call_recording' ? 'Bot is currently recording the meeting.' : 
                        status === 'in_progress' ? 'Meeting is currently in progress.' : '',
            meetingLink: '',
            date: m["Date"],
            startTime: (m["Time start"] || '').substring(0,5) || '00:00',
            endTime: (m["Time end"] || '').substring(0,5) || '00:00',
            attendees: [],
            status: status,
            platform: 'meet',
            clientId: m["Client id"] ? String(m["Client id"]) : undefined,
            meetingType: m["External meeting"] ? 'external' : 'internal',
            bot_id: m["Bot id"],
            actionItems: [],
            tags: [],
          } as Meeting;
        });
        
        setAllMeetings(mapped);
      } catch (err) {
        console.error('Failed to poll meeting updates:', err);
      }
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(pollInterval);
  }, [ongoingMeetings.length]);

  // Efficiently trigger getMeetingOutput for overdue in-progress meetings and then analyzeMeeting for AI insights
  useEffect(() => {
    const now = new Date();
    allMeetings.forEach(meeting => {
      const meetingEnd = new Date(`${meeting.date}T${meeting.endTime}`);
      const meetingStart = new Date(`${meeting.date}T${meeting.startTime}`);
      // Check if meeting should be processed (ended or actively recording for >2min, or unknown status)
      const shouldProcessMeeting = (
        // Case 1: Meeting has ended (overdue meetings)
        (['in_progress', 'in_call_recording', 'unknown'].includes(String(meeting.status)) && meetingEnd < now)
      ) || (
        // Case 2: Meeting is actively recording and has been going for at least 2 minutes
        meeting.status === 'in_call_recording' &&
        meetingStart < now &&
        (now.getTime() - meetingStart.getTime()) > 2 * 60 * 1000 // 2 minutes
      ) || (
        // Case 3: Unknown meetings - always try to process if they have a bot_id
        meeting.status === 'unknown' && meeting.bot_id
      );
      
      if (
        shouldProcessMeeting &&
        meeting.bot_id &&
        !processedMeetings.current.has(meeting.id)
      ) {
        processedMeetings.current.add(meeting.id);
        ApiService.getMeetingOutput(meeting.bot_id)
          .then((transcriptData) => {
            // Check if we have actual transcript content before proceeding with analysis
            if (transcriptData && (transcriptData.transcript || transcriptData.raw_transcript)) {
              // After transcript is fetched, immediately fetch AI insights
              ApiService.analyzeMeeting(meeting.id)
                .then(res => {
                  setAllMeetings(prev => prev.map(m => {
                    if (m.id !== meeting.id) return m;
                    let newActionItems = m.actionItems;
                    if (Array.isArray(res.insights?.action_items) && res.insights?.action_items.length > 0) {
                      if (typeof res.insights.action_items[0] === 'object') {
                        newActionItems = res.insights.action_items as ActionItem[];
                      } else if (typeof res.insights.action_items[0] === 'string') {
                        newActionItems = res.insights.action_items.map((content: string) => ({
                          id: crypto.randomUUID(),
                          content,
                          status: 'pending',
                          priority: 'medium'
                        })) as unknown as ActionItem[];
                      }
                    }
                    return {
                      ...m,
                      summary: res.insights?.summary ?? m.summary,
                      actionItems: newActionItems
                    };
                  }));
                })
                .catch(() => {});
            } else {
              // No transcript available yet, remove from processed set to retry later
              // But only if we haven't tried too many times
              const attempts = retryAttempts.current.get(meeting.id) || 0;
              if (attempts < 3) {
                processedMeetings.current.delete(meeting.id);
                retryAttempts.current.set(meeting.id, attempts + 1);
              }
            }
          })
          .catch(() => {
            // Optionally remove from set on error to retry later, but limit attempts
            const attempts = retryAttempts.current.get(meeting.id) || 0;
            if (attempts < 3) {
              processedMeetings.current.delete(meeting.id);
              retryAttempts.current.set(meeting.id, attempts + 1);
            }
          });
      }
    });
  }, [allMeetings]);

  // Meeting categorization moved earlier in the file

  // Debug: Log meetings data
  console.log('🔍 Meetings Page Debug:', {
    totalMeetings: allMeetings.length,
    recordingMeetings: recordingMeetings.length,
    activeMeetings: activeMeetings.length,
    ongoingMeetings: ongoingMeetings.length,
    upcomingMeetings: upcomingMeetings.length,
    completedMeetings: completedMeetings.length,
    failedMeetings: failedMeetings.length,
    unknownMeetings: unknownMeetings.length,
    calendarView
  });

  // --- Handlers ---
  const handleMeetingClick = (meeting: Meeting) => {
    console.log('Meeting clicked:', meeting);
    // Store meeting data in sessionStorage for MeetingDetails page
    sessionStorage.setItem('meetingContext', JSON.stringify({
      fromMeetings: true,
      meeting: meeting
    }));
    navigate(`/meetings/${meeting.id}`);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
  };

  const handleGetTranscript = async (meeting: Meeting) => {
    if (!meeting.bot_id) {
      error('No Recording Available', 'This meeting does not have an associated recording bot.');
      return;
    }

    setLoadingTranscripts(prev => ({ ...prev, [meeting.id]: true }));
    try {
      const transcriptResponse = await ApiService.getMeetingOutput(meeting.bot_id);
      success('Transcription Retrieved', transcriptResponse.message || `Meeting transcription for "${meeting.title}" has been loaded successfully.`);
      
      // Store transcript data in sessionStorage **scoped by meeting ID** and navigate
      sessionStorage.setItem(`transcriptData_${meeting.id}`, JSON.stringify(transcriptResponse));
      handleMeetingClick(meeting);
    } catch (err: any) {
      error('Failed to Load Transcription', err.message || 'Unable to retrieve meeting transcription.');
    } finally {
      setLoadingTranscripts(prev => ({ ...prev, [meeting.id]: false }));
    }
  };

  const handleGetVideo = async (meeting: Meeting) => {
    if (!meeting.bot_id) {
      error('No Video Available', 'This meeting does not have an associated recording.');
      return;
    }

    try {
      const videoResponse = await ApiService.getVideoUrl(meeting.bot_id);
      if (videoResponse.video_url) {
        window.open(videoResponse.video_url, '_blank');
        success('Video Opened', 'Meeting video has been opened in a new tab.');
      }
    } catch (err: any) {
      error('Failed to Load Video', err.message || 'Unable to retrieve meeting video.');
    }
  };

  // Helper function to format meeting time
  const formatMeetingTime = (meeting: Meeting) => {
    const date = new Date(meeting.date);
    const startTime = meeting.startTime;
    const endTime = meeting.endTime;
    
    return `${date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    })} • ${startTime} - ${endTime}`;
  };

  // Helper function to get status color and label
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'in_call_recording':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Recording' };
      case 'in_progress':
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'In Progress' };
      case 'scheduled':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Scheduled' };
      case 'completed':
      case 'done':
      case 'call_ended':
      case 'media_expired':
      case 'finished':
        return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', label: 'Completed' };
      case 'failed':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Failed' };
      default:
        return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: status || 'Unknown' };
    }
  };

  // Helper function to get bot status description
  const getBotStatusDescription = (botStatus: string) => {
    switch (botStatus) {
      case 'bot.joining_call':
        return 'Bot is connecting to the meeting...';
      case 'bot.in_waiting_room':
        return 'Bot is waiting in the meeting room';
      case 'bot.in_call_not_recording':
        return 'Bot joined but not recording yet';
      case 'bot.recording_permission_allowed':
        return 'Recording permission granted';
      case 'bot.recording_permission_denied':
        return 'Recording permission denied';
      case 'bot.in_call_recording':
        return 'Bot is actively recording the meeting';
      case 'bot.call_ended':
        return 'Bot has left the call';
      case 'bot.done':
        return 'Recording complete and uploaded';
      case 'bot.fatal':
        return 'Bot encountered an error';
      default:
        return 'Bot status unknown';
    }
  };

  // Banner for ongoing meetings that are being recorded - REMOVED
  const ongoingMeetingsBanner = null; // Removed the banner component

  // Recording Meetings List (standalone, not in banner) - REMOVED since it's not used
  // This was causing JSX syntax errors

  // --- UI ---
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Helmet: <title>Meetings | Lemur AI</title> <meta name="description" content="Enhanced meetings page with calendar, upcoming/previous meetings, and metadata." /> */}
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Ongoing Meetings Banner - REMOVED */}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="animate-fade-in"
        >
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Meetings
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your meetings and let Lemur AI join to record and analyze
              </p>
            </div>
            <Button
              onClick={() => setIsJoinMeetingModalOpen(true)}
              leftIcon={<Bot className="h-5 w-5" />}
              className="shrink-0"
            >
              Join Meeting
            </Button>
          </div>

          {/* Active Meetings Alert (for meetings in progress but not recording) */}
          {activeMeetings.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {activeMeetings.length} Active Meeting{activeMeetings.length > 1 ? 's' : ''} in Progress
                </span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                AI bots are currently setting up for {activeMeetings.length} meeting{activeMeetings.length > 1 ? 's' : ''}. They will automatically appear in Previous Meetings when completed.
              </p>

              {/* Active Meetings List */}
              <div className="flex flex-col gap-3">
                {activeMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-lg bg-white dark:bg-gray-900 shadow-sm border-[0.25px] border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                    onClick={() => handleMeetingClick(meeting)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                        {meeting.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {formatMeetingTime(meeting)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Status: {meeting.status.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getBotStatusDescription(meeting.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Meetings Alert */}
          {failedMeetings.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-medium text-red-900 dark:text-red-100">
                  {failedMeetings.length} Failed Meeting{failedMeetings.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                Some meetings encountered issues with bot recording. Please check the details below.
              </p>

              {/* Failed Meetings List */}
              <div className="flex flex-col gap-3">
                {failedMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-red-200 dark:border-red-700 p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                    onClick={() => handleMeetingClick(meeting)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                        {meeting.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {formatMeetingTime(meeting)}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {getBotStatusDescription(meeting.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar & Meetings Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Calendar
                </h2>
                <div className="flex gap-2">
                  {calendarViews.map((view) => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view)}
                      className={cn(
                        'px-3 py-1 text-sm rounded-md font-medium transition-colors',
                        calendarView === view
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      )}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Calendar
                meetings={allMeetings}
                view={calendarView}
                onDateSelect={handleDateSelect}
                onMeetingClick={handleMeetingClick}
              />
            </div>

            <div className="flex-1 xl:flex-[1] min-w-0 flex flex-col gap-6">
              {/* Upcoming Meetings */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Meetings
                  </h3>
                  <Video className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    {upcomingMeetings.length} meetings
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {upcomingMeetings.map(meeting => {
                    const statusInfo = getStatusInfo(meeting.status);
                    return (
                      <div 
                        key={meeting.id} 
                        className="rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md border-[0.25px] border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                        onClick={() => handleMeetingClick(meeting)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                            {meeting.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            {formatMeetingTime(meeting)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Platform: {meeting.platform?.toUpperCase() || 'N/A'}
                          </div>
                          {meeting.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                              {meeting.description}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                            {statusInfo.label}
                          </div>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            meeting.meetingType === 'external' 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          )}>
                            {meeting.meetingType}
                          </div>
                          <PlayCircle className="h-7 w-7 text-green-500 dark:text-green-400 hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Ongoing Meetings */}
              {ongoingMeetings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Ongoing Meetings
                    </h3>
                    <div className="relative">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      {ongoingMeetings.length} meetings
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {ongoingMeetings.map(meeting => {
                      const statusInfo = getStatusInfo(meeting.status);
                      return (
                        <div 
                          key={meeting.id} 
                          className="rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md border-[0.25px] border-gray-200 dark:border-gray-800 p-4 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => handleMeetingClick(meeting)}
                            >
                              <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                                {meeting.title}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                {formatMeetingTime(meeting)}
                              </div>
                              <div className="mb-2">
                                <div className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                                  {statusInfo.label}
                                </div>
                              </div>
                              {meeting.summary && (
                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                  <strong>Summary:</strong> {meeting.summary.substring(0, 150)}...
                                </div>
                              )}
                              {meeting.actionItems && meeting.actionItems.length > 0 && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {meeting.actionItems.length} action item(s) assigned
                                </div>
                              )}
                            </div>
                            
                            {/* AI Analysis Section */}
                            {meeting.bot_id && (
                              <div className="flex flex-col gap-2 shrink-0">
                                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                  <Bot className="h-3 w-3" />
                                  <span>AI Analysis</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleGetTranscript(meeting)}
                                    isLoading={loadingTranscripts[meeting.id]}
                                    leftIcon={<FileText className="h-3 w-3 text-purple-500" />}
                                    className="text-xs py-1 px-2"
                                  >
                                    Transcript
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleGetVideo(meeting)}
                                    leftIcon={<VideoIcon className="h-3 w-3 text-blue-500" />}
                                    className="text-xs py-1 px-2"
                                  >
                                    Video
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Previous Meetings */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Previous Meetings
                  </h3>
                  <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    {completedMeetings.length} meetings
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {completedMeetings.map(meeting => {
                    const statusInfo = getStatusInfo(meeting.status);
                    return (
                      <div 
                        key={meeting.id} 
                        className="rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md border-[0.25px] border-gray-200 dark:border-gray-800 p-4 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleMeetingClick(meeting)}
                          >
                            <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                              {meeting.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              {formatMeetingTime(meeting)}
                            </div>
                            <div className="mb-2">
                              <div className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                                {statusInfo.label}
                              </div>
                            </div>
                            {meeting.summary && (
                              <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                <strong>Summary:</strong> {meeting.summary.substring(0, 150)}...
                              </div>
                            )}
                            {meeting.actionItems && meeting.actionItems.length > 0 && (
                              <div className="text-xs text-blue-600 dark:text-blue-400">
                                {meeting.actionItems.length} action item(s) assigned
                              </div>
                            )}
                          </div>
                          
                          {/* AI Analysis Section */}
                          {meeting.bot_id && (
                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <Bot className="h-3 w-3" />
                                <span>AI Analysis</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleGetTranscript(meeting)}
                                  isLoading={loadingTranscripts[meeting.id]}
                                  leftIcon={<FileText className="h-3 w-3 text-purple-500" />}
                                  className="text-xs py-1 px-2"
                                >
                                  Transcript
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleGetVideo(meeting)}
                                  leftIcon={<VideoIcon className="h-3 w-3 text-blue-500" />}
                                  className="text-xs py-1 px-2"
                                >
                                  Video
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unknown Status Meetings */}
              {unknownMeetings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Unknown Meetings
                    </h3>
                    <StickyNote className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      {unknownMeetings.length} meetings
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {unknownMeetings.map(meeting => {
                      const statusInfo = getStatusInfo(meeting.status);
                      return (
                        <div 
                          key={meeting.id} 
                          className="rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md border-[0.25px] border-gray-200 dark:border-gray-800 p-4 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => handleMeetingClick(meeting)}
                            >
                              <div className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                                {meeting.title}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                {formatMeetingTime(meeting)}
                              </div>
                              <div className="mb-2">
                                <div className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                                  {statusInfo.label}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Platform: {meeting.platform?.toUpperCase() || 'N/A'}
                              </div>
                              {meeting.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                  {meeting.description}
                                </div>
                              )}
                              {/* SUMMARY AND ACTION ITEMS - PROPERLY POSITIONED */}
                              {meeting.summary && (
                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 mt-2">
                                  <strong>Summary:</strong> {meeting.summary.substring(0, 150)}...
                                </div>
                              )}
                              {meeting.actionItems && meeting.actionItems.length > 0 && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {meeting.actionItems.length} action item(s) assigned
                                </div>
                              )}
                            </div>
                            
                            {/* AI ANALYSIS SECTION - MOVED TO SEPARATE COLUMN */}
                            {meeting.bot_id && (
                              <div className="flex flex-col gap-2 shrink-0">
                                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                  <Bot className="h-3 w-3" />
                                  <span>AI Analysis</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleGetTranscript(meeting)}
                                    isLoading={loadingTranscripts[meeting.id]}
                                    leftIcon={<FileText className="h-3 w-3 text-purple-500" />}
                                    className="text-xs py-1 px-2"
                                  >
                                    Transcript
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleGetVideo(meeting)}
                                    leftIcon={<VideoIcon className="h-3 w-3 text-blue-500" />}
                                    className="text-xs py-1 px-2"
                                  >
                                    Video
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              

              
              
            </div>
          </div>
        </motion.div>
      </main>

      {/* Join Meeting Modal */}
      <JoinMeetingModal
        isOpen={isJoinMeetingModalOpen}
        onClose={() => setIsJoinMeetingModalOpen(false)}
      />
    </div>
  );
};