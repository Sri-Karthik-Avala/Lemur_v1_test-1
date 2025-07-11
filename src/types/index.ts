export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Meeting {
  meetingLink: string;
  description: string;
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: Attendee[];
  status: MeetingStatus;
  transcript?: string;
  summary?: string;
  actionItems?: ActionItem[];
  tags?: string[];
  recordingUrl?: string;
  joinUrl?: string;
  platform?: 'zoom' | 'teams' | 'meet' | 'other';
  clientId?: string;
  meetingType?: 'internal' | 'external';
  bot_id?: string;
  /**
   * The ID of the user who owns / created this meeting locally.
   * This allows us to filter out meetings that belong to other accounts
   * once multiple users log into the same browser.
   */
  userId?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

export interface ActionItem {
  id: string;
  content: string;
  assignee?: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ClientFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  contacts?: Attendee[];
  meetings?: Meeting[];
  files?: ClientFile[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  description?: string;
  logo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InsightItem {
  id: string;
  type: 'client_need' | 'project_scope' | 'risk' | 'opportunity' | 'follow_up';
  content: string;
  confidence: number;
  relatedActionItems?: string[];
}

export type MeetingStatus = 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'processing'
  | 'failed';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Brain and Knowledge System Types
export interface BrainContext {
  id: string;
  name: string;
  type: 'personal' | 'company';
  description: string;
  icon: string;
  metadata?: {
    documentCount?: number;
    lastUpdated?: Date;
    indexedSize?: number;
  };
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  tags?: string[];
  source: 'manual' | 'meeting' | 'client' | 'integration';
  associatedClientId?: string;
  associatedMeetingId?: string;
  metadata?: {
    extractedText?: string;
    summary?: string;
    keyTopics?: string[];
  };
}

export interface AIInteraction {
  id: string;
  brainContextId: string;
  query: string;
  response: string;
  timestamp: Date;
  files?: string[];
  confidence?: number;
}

// Enhanced Client Types
export interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface ClientActivity {
  id: string;
  type: 'meeting' | 'file_upload' | 'note' | 'interaction';
  timestamp: Date;
  description: string;
  metadata?: any;
}

// Enhanced Meeting Types
export interface MeetingInsight {
  id: string;
  meetingId: string;
  type: 'summary' | 'decision' | 'action_item' | 'risk' | 'opportunity';
  content: string;
  confidence: number;
  extractedAt: Date;
  relatedEntities?: string[];
}

// Dashboard Metrics
export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
  icon?: string;
}