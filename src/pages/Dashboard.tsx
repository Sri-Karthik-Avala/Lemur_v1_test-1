import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import ChatInterface from '../components/BrainChatInterface';
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seoConfig';

interface DashboardProps {
  production?: boolean;
}

const DashboardContent: React.FC<DashboardProps> = ({ production = false }) => {
  const { user } = useAuthStore();

  // --- Redesigned Dashboard ---
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <SEO {...seoConfigs.dashboard} />
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
