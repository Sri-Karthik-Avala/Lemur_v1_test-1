export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export const seoConfigs: Record<string, SEOConfig> = {
  home: {
    title: 'Lemur AI - Meeting Intelligence Platform',
    description: 'Transform your meetings with AI-powered transcription, action item extraction, and intelligent follow-ups. Perfect for B2B IT consulting teams.',
    keywords: 'meeting intelligence, AI transcription, action items, meeting notes, B2B consulting, meeting analysis, productivity tools, meeting assistant',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Lemur AI',
      description: 'AI-powered meeting intelligence platform for B2B IT consulting teams',
      url: 'https://lemur-ai.com',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      creator: {
        '@type': 'Organization',
        name: 'Lemur AI',
        url: 'https://lemur-ai.com'
      },
      featureList: [
        'AI-powered meeting transcription',
        'Automatic action item extraction',
        'Meeting summaries and insights',
        'Follow-up email generation',
        'Meeting analytics and reporting'
      ]
    }
  },
  
  dashboard: {
    title: 'Dashboard - Meeting Overview',
    description: 'View your meeting analytics, recent meetings, and key insights. Track productivity and manage your meeting intelligence data.',
    keywords: 'meeting dashboard, analytics, productivity tracking, meeting insights, business intelligence',
    noIndex: true // Private page
  },
  
  meetings: {
    title: 'Meetings - All Your Meeting Records',
    description: 'Browse all your recorded meetings, view transcripts, action items, and meeting summaries. Organize and search your meeting history.',
    keywords: 'meeting history, meeting records, transcripts, action items, meeting search, meeting organization',
    noIndex: true // Private page
  },
  
  meetingDetails: {
    title: 'Meeting Details - {meetingTitle}',
    description: 'View detailed meeting information including transcript, action items, summary, and AI-generated insights for {meetingTitle}.',
    keywords: 'meeting transcript, action items, meeting summary, meeting insights, meeting analysis',
    type: 'article' as const,
    noIndex: true // Private page
  },
  
  clients: {
    title: 'Clients - Manage Your Client Relationships',
    description: 'Manage your client relationships, view client meeting history, and track engagement metrics across all your business relationships.',
    keywords: 'client management, CRM, client meetings, relationship tracking, business clients',
    noIndex: true // Private page
  },
  
  clientDetail: {
    title: 'Client Details - {clientName}',
    description: 'View detailed client information, meeting history, and relationship insights for {clientName}.',
    keywords: 'client profile, client meetings, client relationship, business relationship management',
    type: 'profile' as const,
    noIndex: true // Private page
  },
  
  login: {
    title: 'Login - Access Your Meeting Intelligence',
    description: 'Sign in to your Lemur AI account to access your meeting transcripts, action items, and AI-powered meeting insights.',
    keywords: 'login, sign in, meeting platform access, user authentication',
    noIndex: true // No need to index login pages
  },
  
  signup: {
    title: 'Sign Up - Start Your Meeting Intelligence Journey',
    description: 'Create your Lemur AI account and start transforming your meetings with AI-powered transcription and intelligent insights.',
    keywords: 'sign up, register, create account, meeting intelligence, AI transcription',
  },
  
  waitlist: {
    title: 'Join the Waitlist - Early Access to Meeting Intelligence',
    description: 'Join the Lemur AI waitlist for early access to our revolutionary meeting intelligence platform. Be among the first to experience AI-powered meeting transformation.',
    keywords: 'waitlist, early access, meeting intelligence, AI meetings, beta access',
  },
  
  settings: {
    title: 'Settings - Customize Your Meeting Experience',
    description: 'Customize your Lemur AI experience with personalized settings for transcription, notifications, integrations, and more.',
    keywords: 'settings, preferences, customization, account settings, meeting preferences',
    noIndex: true // Private page
  }
};

export const generateMeetingDetailsSEO = (meeting: { title: string; description?: string; date: string }): SEOConfig => {
  const config = seoConfigs.meetingDetails;
  return {
    ...config,
    title: config.title.replace('{meetingTitle}', meeting.title),
    description: config.description.replace('{meetingTitle}', meeting.title),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: meeting.title,
      description: meeting.description || `Meeting details for ${meeting.title}`,
      startDate: meeting.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      organizer: {
        '@type': 'Organization',
        name: 'Lemur AI'
      }
    }
  };
};

export const generateClientDetailsSEO = (client: { name: string; description?: string }): SEOConfig => {
  const config = seoConfigs.clientDetail;
  return {
    ...config,
    title: config.title.replace('{clientName}', client.name),
    description: config.description.replace('{clientName}', client.name),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: client.name,
      description: client.description || `Client profile for ${client.name}`
    }
  };
};
