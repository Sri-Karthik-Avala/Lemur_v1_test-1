// --- Page Metadata ---
/**
 * @page MeetingDetails
 * @description Simplified meeting details page that works with mock data. No backend integration.
 * @author Lemur
 * @lastModified 2024-12-09
 * @meta Helmet: <title>Meeting Details | Lemur AI</title> <meta name="description" content="View detailed meeting information including summary, transcript, and action items." />
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Calendar,
  ChevronLeft,
  PlayCircle,
  FileText,
  CheckCircle,
  Brain,
  Sparkles,
  Copy,
  Download,
  Mail,
  Share,
  Bot,
  Video as VideoIcon,
  StickyNote,
  Plus,
  Send,
  Edit3,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { ProfessionalActionItems } from '../components/ProfessionalActionItems';
import { ProfessionalMeetingSummary } from '../components/ProfessionalMeetingSummary';
import { ProfessionalEmailDrafts } from '../components/ProfessionalEmailDrafts';
import { useDataStore } from '../stores/dataStore';
import { cn } from '../utils/cn';
import { getMeetingById } from '../data/meetings';
import { Meeting } from '../types';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { ApiService } from '../services/api';
import { useToastStore } from '../stores/toastStore';

interface SimpleMeeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: Array<{ id: string; name: string; email: string }>;
  participants: string[];
  status: 'scheduled' | 'completed' | 'in_progress';
  summary: string;
  transcript: string;
  meetingType: 'internal' | 'external';
  actionItems: any[];
  tags: any[];
}

export const MeetingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'summary' | 'transcript' | 'video' | 'ai-insights'>('overview');
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  
  // Data store for action items
  const { getActionItemsByMeeting, initializeData, addActionItem } = useDataStore();
  
  // Get action items for this meeting
  const actionItems = meeting ? getActionItemsByMeeting(meeting.id) : [];

  const { success: showSuccess, error: showErrorToast } = useToastStore();

  // Dedicated handler for action items only
  const [isGeneratingActionItems, setIsGeneratingActionItems] = useState(false);
  const handleGenerateActionItems = async () => {
    if (!meeting) return;
    try {
      setIsGeneratingActionItems(true);
      const res = await ApiService.analyzeMeeting(meeting.id);
      if (Array.isArray(res.insights?.action_items) && res.insights.action_items.length > 0) {
        res.insights.action_items.forEach((content: string) => {
          const newItem = {
            id: crypto.randomUUID(),
            content,
            assignee: undefined,
            dueDate: undefined,
            status: 'pending' as const,
            priority: 'medium' as const,
            meetingId: meeting.id,
          };
          addActionItem(newItem);
        });
      }
      showSuccess('Action Items Generated', res.message || 'Action items generated.');
    } catch (err: any) {
      showErrorToast('Failed to Generate Action Items', err.message || 'Unable to generate action items.');
    } finally {
      setIsGeneratingActionItems(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (!id) return;

    // First try to get meeting from our comprehensive mock data
    const foundMeeting = getMeetingById(id);
    if (foundMeeting) {
      setMeeting(foundMeeting);
      document.title = `${foundMeeting.title} | Lemur AI`;
      return;
    }

    // Fallback: Try to get meeting from sessionStorage (passed from Meetings page)
    const meetingContext = sessionStorage.getItem('meetingContext');
    if (meetingContext) {
      try {
        const context = JSON.parse(meetingContext);
        if (context.meeting && context.meeting.id === id) {
          setMeeting(context.meeting);
          document.title = `${context.meeting.title} | Lemur AI`;
          return;
        }
      } catch (error) {
        console.error('Error parsing meeting context:', error);
      }
    }

    // Final fallback: Create a mock meeting if no data found
    const fallbackMeeting: Meeting = {
      id: id,
      title: 'Meeting Details',
      description: 'Meeting details not available',
      meetingLink: '#',
      date: '2024-12-09',
      startTime: '10:00',
      endTime: '11:00',
      attendees: [
        { id: '1', name: 'You', email: 'user@example.com' }
      ],
      status: 'completed',
      summary: 'Meeting summary not available. Please navigate back to the Meetings page and click on a meeting to view its details.',
      transcript: 'Transcript not available.',
      meetingType: 'internal',
      actionItems: [],
      tags: [],
      joinUrl: '#',
      platform: 'zoom'
    };
    setMeeting(fallbackMeeting);
    document.title = `Meeting Details | Lemur AI`;
  }, [id]);

  useEffect(() => {
    if (!meeting) return;

    const key = `transcriptData_${meeting.id}`;
    const storedTranscript = sessionStorage.getItem(key);

    if (storedTranscript) {
      try {
        setTranscriptData(JSON.parse(storedTranscript));
        return;
      } catch (error) {
        console.error('Error parsing stored transcriptData:', error);
      }
    }

    // Fallback: fetch live if we have a bot_id and nothing stored
    if (meeting.bot_id) {
      import('../services/api').then(({ ApiService }) => {
        ApiService.getMeetingOutput(meeting.bot_id as string)
          .then((data) => {
            setTranscriptData(data);
            sessionStorage.setItem(key, JSON.stringify(data));
          })
          .catch((err) => {
            console.error('Error fetching transcript:', err);
          });
      });
    }
  }, [meeting]);

  // Fetch video URL when the Video tab is selected
  useEffect(() => {
    const fetchVideo = async () => {
      if (!meeting?.bot_id || videoUrl || activeTab !== 'video') return;
      try {
        setIsLoadingVideo(true);
        const res = await ApiService.getVideoUrl(meeting.bot_id);
        if (res.video_url) {
          setVideoUrl(res.video_url);
        } else {
          showErrorToast('Video Unavailable', 'No video URL returned for this meeting.');
        }
      } catch (err: any) {
        showErrorToast('Failed to Load Video', err.message || 'Unable to retrieve meeting video.');
      } finally {
        setIsLoadingVideo(false);
      }
    };
    fetchVideo();
  }, [activeTab, meeting, videoUrl, showErrorToast]);

  // Analyze Meeting
  const handleAnalyzeMeeting = async () => {
    if (!meeting) return;
    try {
      setIsAnalyzing(true);
      const res = await ApiService.analyzeMeeting(meeting.id);

      // Map action items array (if any)
      if (Array.isArray(res.insights?.action_items) && res.insights.action_items.length > 0) {
        res.insights.action_items.forEach((content: string) => {
          const newItem = {
            id: crypto.randomUUID(),
            content,
            assignee: undefined,
            dueDate: undefined,
            status: 'pending' as const,
            priority: 'medium' as const,
            meetingId: meeting.id,
          };
          addActionItem(newItem);
        });
      }

      // Update summary
      setMeeting((prev) => prev ? { ...prev, summary: res.insights?.summary ?? prev.summary } : prev);

      showSuccess('Analysis Complete', res.message || 'Meeting analysis generated.');
    } catch (err: any) {
      showErrorToast('Analysis Failed', err.message || 'Unable to analyze meeting.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    // Create a proper date string from date and time
    const fullDateString = `${dateString}T${timeString}:00`;
    const date = new Date(fullDateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getDuration = () => {
    if (!meeting) return 'Unknown';
    // Parse time strings like "08:00" and "08:30"
    const [startHours, startMinutes] = meeting.startTime.split(':').map(Number);
    const [endHours, endMinutes] = meeting.endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const diffMins = endTotalMinutes - startTotalMinutes;
    return `${diffMins} minutes`;
  };

  const handleGoBack = () => {
    navigate('/meetings');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Loading meeting details...
            </div>
            <Button onClick={handleGoBack} variant="outline">
              Back to Meetings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const startDateTime = formatDateTime(meeting.date, meeting.startTime);
  const endDateTime = formatDateTime(meeting.date, meeting.endTime);

  return (
    <div className="min-h-screen bg-primary transition-colors duration-300">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="animate-fade-in"
        >
          {/* Header */}
          <div className="mb-8">
            <Button 
              onClick={handleGoBack}
              variant="outline" 
              size="sm" 
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Meetings
            </Button>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {meeting.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{startDateTime.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{startDateTime.time} - {endDateTime.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{meeting.attendees.length} participants</span>
                  </div>
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    meeting.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    meeting.status === 'scheduled' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                    meeting.status === 'in_progress' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  )}>
                    {meeting.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {meeting.status === 'scheduled' && (
                  <Button size="sm" variant="primary">
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'summary', label: 'Summary', icon: Sparkles },
                { id: 'transcript', label: 'Transcript', icon: StickyNote },
                { id: 'video', label: 'Video', icon: PlayCircle },
                { id: 'ai-insights', label: 'AI Insights', icon: Brain }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Meeting Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date & Time:</span>
                      <div className="mt-1">
                        <div className="text-gray-900 dark:text-gray-100">{startDateTime.date}</div>
                        <div className="text-gray-600 dark:text-gray-400">{startDateTime.time} - {endDateTime.time}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{getDuration()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100 capitalize">{meeting.meetingType}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Platform:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100 capitalize">{meeting.platform || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <div className={cn(
                        'inline-flex ml-2 px-2 py-1 text-xs font-medium rounded-full',
                        meeting.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                        meeting.status === 'scheduled' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                        meeting.status === 'in_progress' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      )}>
                        {meeting.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Participants:</span>
                      <div className="mt-2 space-y-2">
                        {meeting.attendees.map(attendee => (
                          <div key={attendee.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {attendee.name.charAt(0)}
                            </div>
                            <span className="text-gray-900 dark:text-gray-100">{attendee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Meeting Summary
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopy(meeting.summary || '')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Summary
                    </Button>
                    {meeting.status === 'completed' && (!meeting.summary || meeting.summary.length === 0) && (
                      <Button onClick={handleAnalyzeMeeting} isLoading={isAnalyzing} leftIcon={isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}>
                        {isAnalyzing ? 'Generating…' : 'Generate Summary'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {meeting.summary || 'No summary available for this meeting.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Meeting Transcript
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy((transcriptData?.transcript || meeting.transcript) ?? '')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Transcript
                  </Button>
                </div>
                {/* Show structured viewer if we have transcriptData */}
                {transcriptData ? (
                  <TranscriptViewer
                    transcript={transcriptData.raw_transcript || transcriptData.transcript || ''}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {meeting.transcript || 'Transcript not available for this meeting.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Video TAB */}
            {activeTab === 'video' && (
              <div className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Meeting Video
                </h3>
                {isLoadingVideo && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading video...</p>
                )}
                {!isLoadingVideo && videoUrl && (
                  <div className="w-full max-w-3xl mx-auto">
                    <video controls className="w-full h-auto rounded-lg" src={videoUrl} />
                  </div>
                )}
                {!isLoadingVideo && !videoUrl && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Video is not available for this meeting.</p>
                )}
              </div>
            )}

            {activeTab === 'ai-insights' && (
              <div className="space-y-6 relative isolate">
                {meeting.status === 'completed' ? (
                  <div className="space-y-6 w-full">
                    {/* Action Items Collapsible Section */}
                    <div className="relative">
                      <CollapsibleSection
                        title="Action Items & Tasks"
                        subtitle={`${actionItems.length} items identified`}
                        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                        defaultOpen={true}
                        badge={actionItems.filter(item => item.status === 'pending').length}
                        badgeColor="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      >
                        {meeting.status === 'completed' && actionItems.length === 0 && (
                          <Button onClick={handleGenerateActionItems} isLoading={isGeneratingActionItems} leftIcon={isGeneratingActionItems ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}>
                            {isGeneratingActionItems ? 'Generating…' : 'Generate Action Items'}
                          </Button>
                        )}
                        <ProfessionalActionItems
                          meetingId={meeting.id}
                          meetingTitle={meeting.title}
                          meetingDate={meeting.date}
                        />
                      </CollapsibleSection>
                    </div>

                    {/* Email Drafts Collapsible Section */}
                    <div className="relative">
                      <CollapsibleSection
                        title="Email Drafts"
                        subtitle="Ready-to-send follow-up communications"
                        icon={<Mail className="h-5 w-5 text-blue-500" />}
                        defaultOpen={false}
                        badge={3}
                        badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        <ProfessionalEmailDrafts
                          meetingTitle={meeting.title}
                          meetingDate={meeting.date}
                          attendees={meeting.attendees.map(attendee => attendee.name)}
                          actionItems={actionItems}
                          keyDecisions={[
                            'Approved project timeline with Q1 launch target',
                            'Allocated additional budget for technical infrastructure',
                            'Assigned project lead responsibilities'
                          ]}
                          nextMeetingDate="Thursday, June 15th at 2:00 PM"
                        />
                      </CollapsibleSection>
                    </div>

                    {/* AI Proposals Collapsible Section */}
                    <div className="relative">
                      <CollapsibleSection
                        title="AI-Generated Proposals"
                        subtitle="Smart business proposals based on meeting context"
                        icon={<FileText className="h-5 w-5 text-green-500" />}
                        defaultOpen={false}
                        badge="NEW"
                        badgeColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      >
                        <div className="space-y-4">
                          {/* Project Proposal */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">Project Implementation Proposal</h4>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm">
                              <div className="text-gray-700 dark:text-gray-300 space-y-3">
                                <div>
                                  <h5 className="font-semibold mb-2">Executive Summary</h5>
                                  <p>Based on our discussion, we propose a comprehensive solution to address your project requirements with a phased implementation approach that minimizes risk while maximizing value delivery.</p>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2">Proposed Timeline</h5>
                                  <p>• Phase 1: Requirements Analysis & Design (2 weeks)</p>
                                  <p>• Phase 2: Core Development (6 weeks)</p>
                                  <p>• Phase 3: Testing & Deployment (2 weeks)</p>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2">Investment</h5>
                                  <p>Total project cost: $85,000 - $110,000</p>
                                  <p>Payment terms: 30% upfront, 40% at milestone completion, 30% on delivery</p>
                                </div>
                                <div>
                                  <h5 className="font-semibold mb-2">Next Steps</h5>
                                  <p>1. Review and approve proposal</p>
                                  <p>2. Sign project agreement</p>
                                  <p>3. Schedule kick-off meeting</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Budget Proposal */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">Budget Allocation Proposal</h4>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm">
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-semibold mb-2">Development Resources</h5>
                                    <div className="space-y-1 text-gray-700 dark:text-gray-300">
                                      <p>Senior Developers: $45,000</p>
                                      <p>UI/UX Design: $15,000</p>
                                      <p>Project Management: $12,000</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold mb-2">Infrastructure & Tools</h5>
                                    <div className="space-y-1 text-gray-700 dark:text-gray-300">
                                      <p>Cloud Infrastructure: $8,000</p>
                                      <p>Development Tools: $5,000</p>
                                      <p>Testing & QA: $10,000</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center mt-4">
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Generate Custom Proposal
                            </Button>
                          </div>
                        </div>
                      </CollapsibleSection>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Pending States */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Action Items Pending
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Action items will be generated upon completion
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          AI Analysis Pending
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Analysis will be available after completion
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="text-center">
                        <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Email Templates Pending
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Templates will be generated after completion
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};