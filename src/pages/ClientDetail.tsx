import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Calendar, 
  Mail, 
  ChevronLeft, 
  Clock, 
  Video,
  CheckCircle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';
import { ApiService } from '../services/api'; // Adjust import path as needed
// new changes 
// API Meeting interface matching your backend response
interface ApiMeeting {
  id: number;
  "Meeting title": string;
  Date: string;
  "Time start": string;
  "Time end": string | null;
  "User id": number;
  "Client id": number;
  "Bot id": string;
  "Meeting status": string;
  "External meeting": boolean;
}

interface ApiMeetingsResponse {
  client_name: string;
  meetings: ApiMeeting[];
  total_meetings: number;
}

// Client interface based on API response
interface Client {
  id: string;
  name: string;
  total_meetings: number;
}

export const ClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [meetings, setMeetings] = useState<ApiMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');



  useEffect(() => {
    const loadClientData = async () => {
      if (!clientId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await ApiService.getClientMeetings(clientId);
        
        // Set client data from API response
        setClient({
          id: clientId,
          name: data.client_name,
          total_meetings: data.total_meetings
        });

        // Set meetings
        setMeetings(data.meetings);

        // Update document title
        document.title = `${data.client_name} | Lemur AI`;

      } catch (error) {
        setError('Failed to load client data');
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId]);

  const handleGoBack = () => {
    navigate('/clients');
  };

  const handleMeetingClick = (meetingId: number) => {
    navigate(`/meetings/${meetingId}`);
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    // Handle the time format from API (e.g., "11:19:15+00")
    const cleanTime = timeString.split('+')[0]; // Remove timezone part
    const fullDateString = `${dateString}T${cleanTime}`;
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

  const getDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Duration unknown';
    
    const cleanStartTime = startTime.split('+')[0];
    const cleanEndTime = endTime.split('+')[0];
    
    const [startHours, startMinutes] = cleanStartTime.split(':').map(Number);
    const [endHours, endMinutes] = cleanEndTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const diffMins = endTotalMinutes - startTotalMinutes;
    
    return diffMins > 0 ? `${diffMins} min` : 'Duration unknown';
  };

  const getPlatformIcon = (platform: string) => {
    return <Video className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'scheduled':
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'COMPLETED';
      case 'scheduled':
        return 'SCHEDULED';
      case 'in-progress':
        return 'IN PROGRESS';
      default:
        return status.toUpperCase();
    }
  };

  // Filter meetings based on status
  const upcomingMeetings = meetings.filter(m => 
    m["Meeting status"].toLowerCase() === 'scheduled' || 
    m["Meeting status"].toLowerCase() === 'in-progress'
  );
  
  const completedMeetings = meetings.filter(m => 
    m["Meeting status"].toLowerCase() === 'done' || 
    m["Meeting status"].toLowerCase() === 'completed'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Loading client details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {error || 'Client not found'}
            </div>
            <Button onClick={handleGoBack} variant="outline">
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              Back to Clients
            </Button>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Client Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold md:text-3xl" style={{ color: 'var(--text-primary)' }}>
                      {client.name}
                    </h1>
                    <p className="text-lg mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Client ID: {client.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg min-w-[280px]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Meeting Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Meetings</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {client.total_meetings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {upcomingMeetings.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {completedMeetings.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'upcoming', label: `Upcoming (${upcomingMeetings.length})`, icon: Calendar },
                { id: 'completed', label: `Completed (${completedMeetings.length})`, icon: CheckCircle }
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

          {/* Meetings Content */}
          <div className="space-y-6">
            {activeTab === 'upcoming' && (
              <div>
                {upcomingMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingMeetings.map(meeting => {
                      const dateTime = formatDateTime(meeting.Date, meeting["Time start"]);
                      return (
                        <motion.div
                          key={meeting.id}
                          className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
                          onClick={() => handleMeetingClick(meeting.id)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon('other')}
                              <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded-full',
                                getStatusColor(meeting["Meeting status"])
                              )}>
                                {getStatusLabel(meeting["Meeting status"])}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {meeting["Meeting title"]}
                          </h3>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{dateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{dateTime.time} • {getDuration(meeting["Time start"], meeting["Time end"])}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Video className="h-4 w-4" />
                              <span>{meeting["External meeting"] ? 'External' : 'Internal'}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No upcoming meetings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Schedule a new meeting with {client.name} to get started.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                {completedMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedMeetings.map(meeting => {
                      const dateTime = formatDateTime(meeting.Date, meeting["Time start"]);
                      return (
                        <motion.div
                          key={meeting.id}
                          className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
                          onClick={() => handleMeetingClick(meeting.id)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon('other')}
                              <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded-full',
                                getStatusColor(meeting["Meeting status"])
                              )}>
                                {getStatusLabel(meeting["Meeting status"])}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {meeting["Meeting title"]}
                          </h3>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{dateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{dateTime.time} • {getDuration(meeting["Time start"], meeting["Time end"])}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Video className="h-4 w-4" />
                              <span>{meeting["External meeting"] ? 'External' : 'Internal'}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No completed meetings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Completed meetings with {client.name} will appear here.
                    </p>
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