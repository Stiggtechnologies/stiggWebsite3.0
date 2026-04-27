import React, { useState } from 'react';
import { AIAssistant } from './AIAssistant';
import { useUserBehavior } from '../hooks/useUserBehavior';

export const ChatbotWidget: React.FC = () => {
  const { behavior } = useUserBehavior();

  const handleLeadCapture = (leadData: any) => {
    // In a real app, this would send to your CRM/database
    console.log('Lead captured from AI Assistant:', leadData);
    
    // You could integrate with your existing lead capture system here
    // For example, send to aiAutomation.processLead()
  };

  return (
    <AIAssistant
      userProfile={{
        deviceType: behavior.deviceType,
        referrer: behavior.referrer,
        pagesVisited: behavior.pagesVisited
      }}
      onLeadCapture={handleLeadCapture}
    />
  );
};