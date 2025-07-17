import React from 'react';
import LandingHeader from '../components/LandingHeader';
import LandingHeroSection from '../components/LandingHeroSection';
import LandingBrainOverlay from '../components/LandingBrainOverlay';
import LandingDashboardPreview from '../components/LandingDashboardPreview';
import LandingHowItWorks from '../components/LandingHowItWorks';
import LandingUseCases from '../components/LandingUseCases';
import LandingIntegrations from '../components/LandingIntegrations';
import LandingCTASection from '../components/LandingCTASection';
import LandingFooter from '../components/LandingFooter';
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seoConfig';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <SEO {...seoConfigs.home} />
      <LandingHeader />
      <main>
        <LandingHeroSection />
       
        <LandingDashboardPreview />
        <LandingHowItWorks />
        <LandingUseCases />
        <LandingIntegrations />
        <LandingCTASection />
      </main>
      <LandingFooter />
    </div>
  );
};