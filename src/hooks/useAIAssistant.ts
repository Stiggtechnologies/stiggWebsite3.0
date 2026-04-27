import { useState, useEffect } from 'react';
import { stiggAI } from '../services/openaiService';

interface UseAIAssistantProps {
  serviceType?: string;
  userProfile?: any;
  autoStart?: boolean;
}

export const useAIAssistant = ({
  serviceType,
  userProfile,
  autoStart = false
}: UseAIAssistantProps = {}) => {
  const [isActive, setIsActive] = useState(autoStart);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [leadScore, setLeadScore] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const sendMessage = async (message: string) => {
    try {
      const response = await stiggAI.processMessage(
        message,
        userId,
        sessionId,
        {
          serviceType,
          userProfile
        }
      );

      setConversationHistory(prev => [
        ...prev,
        { type: 'user', content: message, timestamp: new Date() },
        { type: 'assistant', content: response.response, timestamp: new Date() }
      ]);

      if (response.leadScore) {
        setLeadScore(response.leadScore);
      }

      return response;
    } catch (error) {
      console.error('AI Assistant Error:', error);
      throw error;
    }
  };

  const getServiceRecommendations = async (industry: string, concerns: string[]) => {
    try {
      const result = await stiggAI.getServiceRecommendations(industry, concerns);
      setRecommendations(result.recommendations);
      return result;
    } catch (error) {
      console.error('Recommendations Error:', error);
      return { recommendations: [], reasoning: '' };
    }
  };

  const startConversation = () => {
    setIsActive(true);
  };

  const endConversation = () => {
    setIsActive(false);
  };

  const resetConversation = () => {
    setConversationHistory([]);
    setLeadScore(0);
    setRecommendations([]);
  };

  return {
    isActive,
    sessionId,
    userId,
    conversationHistory,
    leadScore,
    recommendations,
    sendMessage,
    getServiceRecommendations,
    startConversation,
    endConversation,
    resetConversation
  };
};