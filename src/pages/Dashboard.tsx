import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import ChatInterface from '../components/BrainChatInterface';

interface DashboardProps {
  production?: boolean;
}

const DashboardContent: React.FC<DashboardProps> = ({ production = false }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    // Set comprehensive page metadata
    document.title = 'AI Assistant Dashboard | Lemur AI - Intelligent Meeting Assistant';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access your AI-powered assistant dashboard with company and personal brain contexts. Get intelligent insights, manage conversations, and boost productivity with Lemur AI.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Access your AI-powered assistant dashboard with company and personal brain contexts. Get intelligent insights, manage conversations, and boost productivity with Lemur AI.';
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'AI assistant, dashboard, brain context, company knowledge, personal assistant, meeting intelligence, Lemur AI, productivity');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'AI assistant, dashboard, brain context, company knowledge, personal assistant, meeting intelligence, Lemur AI, productivity';
      document.head.appendChild(meta);
    }

    // Open Graph metadata
    const updateOrCreateOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateOGMeta('og:title', 'AI Assistant Dashboard | Lemur AI');
    updateOrCreateOGMeta('og:description', 'Intelligent AI assistant with company and personal brain contexts for enhanced productivity.');
    updateOrCreateOGMeta('og:type', 'website');
    updateOrCreateOGMeta('og:url', window.location.href);

    // Twitter Card metadata
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:title', 'AI Assistant Dashboard | Lemur AI');
    updateOrCreateTwitterMeta('twitter:description', 'Intelligent AI assistant with company and personal brain contexts for enhanced productivity.');
  }, []);

  // --- Redesigned Dashboard ---
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      
        <main className="flex-1 flex flex-col items-center justify-center px-0 sm:px-0 py-0 sm:py-0 min-h-screen">
          <div className="w-full h-full flex flex-col flex-1">
            <ChatInterface />
          </div>
        </main>
      
    </div>
  );
};

export default DashboardContent;

export const Dashboard = DashboardContent;
