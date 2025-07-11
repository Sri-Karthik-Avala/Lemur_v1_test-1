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
import { getMeetingsByClientId } from '../data/meetings';
import { Meeting } from '../types';

// Mock client data - matching the structure from Clients.tsx
interface MockClient {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  industry?: string;
  contact_email?: string;
  contact_name?: string;
}

const mockClientsData: MockClient[] = [
  {
    id: 'client-1',
    name: 'TechCorp Industries',
    description: 'Leading technology company specializing in cloud infrastructure and AI solutions',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-08T14:22:00Z',
    industry: 'Technology',
    contact_email: 'sarah.johnson@techcorp.com',
    contact_name: 'Sarah Johnson'
  },
  {
    id: 'client-2',
    name: 'GreenEnergy Solutions',
    description: 'Renewable energy company focused on solar and wind power installations',
    created_at: '2024-02-20T08:15:00Z',
    updated_at: '2024-12-07T16:45:00Z',
    industry: 'Energy',
    contact_email: 'mike.chen@greenenergy.com',
    contact_name: 'Mike Chen'
  },
  {
    id: 'client-3',
    name: 'HealthFirst Medical',
    description: 'Healthcare provider network with 50+ locations across the region',
    created_at: '2024-03-10T11:20:00Z',
    updated_at: '2024-12-06T09:30:00Z',
    industry: 'Healthcare',
    contact_email: 'dr.williams@healthfirst.com',
    contact_name: 'Dr. Emily Williams'
  },
  {
    id: 'client-4',
    name: 'FinanceMax Group',
    description: 'Investment banking and financial services company',
    created_at: '2024-04-05T13:45:00Z',
    updated_at: '2024-12-05T11:15:00Z',
    industry: 'Finance',
    contact_email: 'robert.clark@financemax.com',
    contact_name: 'Robert Clark'
  },
  {
    id: 'client-5',
    name: 'EduTech Academy',
    description: 'Online education platform providing professional certification courses',
    created_at: '2024-05-12T09:00:00Z',
    updated_at: '2024-12-04T15:20:00Z',
    industry: 'Education',
    contact_email: 'lisa.martinez@edutech.com',
    contact_name: 'Lisa Martinez'
  },
  {
    id: 'client-6',
    name: 'RetailPlus Chain',
    description: 'Multi-brand retail chain with e-commerce and physical stores',
    created_at: '2024-06-18T14:30:00Z',
    updated_at: '2024-12-03T12:40:00Z',
    industry: 'Retail',
    contact_email: 'james.wilson@retailplus.com',
    contact_name: 'James Wilson'
  }
];

export const ClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<MockClient | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  useEffect(() => {
    if (!clientId) return;

    // Find client
    const foundClient = mockClientsData.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      document.title = `${foundClient.name} | Lemur AI`;
    }

    // Get meetings for this client
    const clientMeetings = getMeetingsByClientId(clientId);
    setMeetings(clientMeetings);
  }, [clientId]);

  const handleGoBack = () => {
    navigate('/clients');
  };

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };

  const formatDateTime = (dateString: string, timeString: string) => {
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

  const getDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const diffMins = endTotalMinutes - startTotalMinutes;
    return `${diffMins} min`;
  };

  const getPlatformIcon = (platform: string) => {
    return <Video className="h-4 w-4" />;
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const completedMeetings = meetings.filter(m => m.status === 'completed');

  if (!client) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Client not found
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
                      {client.industry} • Client since {new Date(client.created_at).getFullYear()}
                    </p>
                  </div>
                </div>

                {client.description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {client.description}
                  </p>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.contact_name && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {client.contact_name}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Primary Contact
                        </div>
                      </div>
                    </div>
                  )}
                  {client.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {client.contact_email}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Email
                        </div>
                      </div>
                    </div>
                  )}
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
                      {meetings.length}
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
                      const dateTime = formatDateTime(meeting.date, meeting.startTime);
                      return (
                        <motion.div
                          key={meeting.id}
                          className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
                          onClick={() => handleMeetingClick(meeting.id)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(meeting.platform || 'other')}
                              <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded-full',
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              )}>
                                SCHEDULED
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {meeting.title}
                          </h3>

                          {meeting.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {meeting.description}
                            </p>
                          )}

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{dateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{dateTime.time} • {getDuration(meeting.startTime, meeting.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4" />
                              <span>{meeting.attendees.length} attendees</span>
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
                      const dateTime = formatDateTime(meeting.date, meeting.startTime);
                      return (
                        <motion.div
                          key={meeting.id}
                          className="bg-white/90 dark:bg-gray-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
                          onClick={() => handleMeetingClick(meeting.id)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(meeting.platform || 'other')}
                              <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded-full',
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              )}>
                                COMPLETED
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {meeting.title}
                          </h3>

                          {meeting.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {meeting.description}
                            </p>
                          )}

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{dateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{dateTime.time} • {getDuration(meeting.startTime, meeting.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4" />
                              <span>{meeting.attendees.length} attendees</span>
                            </div>
                            {meeting.actionItems && meeting.actionItems.length > 0 && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <FileText className="h-4 w-4" />
                                <span>{meeting.actionItems.length} action items</span>
                              </div>
                            )}
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