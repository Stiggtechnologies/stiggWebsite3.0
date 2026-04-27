import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { AIAutomationDashboard } from '../components/AIAutomationDashboard';

export const AutomationDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="AI Automation Dashboard | Stigg Security Inc."
        description="Manage your AI-powered sales and marketing automation with intelligent lead scoring and human oversight."
        keywords="AI automation, lead scoring, sales automation, marketing automation"
        canonicalUrl="/automation-dashboard"
      />
      <AIAutomationDashboard />
    </div>
  );
};