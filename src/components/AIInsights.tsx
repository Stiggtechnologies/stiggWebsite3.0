import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, MessageSquare, Target, Zap } from 'lucide-react';
import { stiggAI } from '../services/openaiService';

interface AIInsightsProps {
  userBehavior?: {
    pagesVisited: string[];
    timeOnSite: number;
    scrollDepth: number;
    deviceType: string;
  };
  onRecommendation?: (recommendation: any) => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  userBehavior,
  onRecommendation
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userBehavior) {
      generateInsights();
    }
  }, [userBehavior]);

  const generateInsights = async () => {
    if (!userBehavior) return;

    setLoading(true);
    try {
      // Analyze user behavior to generate insights
      const behaviorInsights = analyzeBehavior(userBehavior);
      
      // Get AI recommendations based on behavior
      if (behaviorInsights.detectedInterests.length > 0) {
        const aiRecommendations = await stiggAI.getServiceRecommendations(
          behaviorInsights.likelyIndustry,
          behaviorInsights.detectedInterests
        );
        setRecommendations(aiRecommendations.recommendations);
      }

      setInsights(behaviorInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeBehavior = (behavior: any) => {
    const insights = {
      engagementLevel: 'low',
      detectedInterests: [] as string[],
      likelyIndustry: 'general',
      urgencyScore: 0,
      recommendedActions: [] as string[]
    };

    // Analyze engagement level
    if (behavior.timeOnSite > 300 && behavior.scrollDepth > 75) {
      insights.engagementLevel = 'high';
      insights.urgencyScore += 30;
    } else if (behavior.timeOnSite > 120 || behavior.scrollDepth > 50) {
      insights.engagementLevel = 'medium';
      insights.urgencyScore += 15;
    }

    // Detect interests from pages visited
    behavior.pagesVisited.forEach((page: string) => {
      if (page.includes('security-guards')) {
        insights.detectedInterests.push('physical security');
        insights.urgencyScore += 20;
      }
      if (page.includes('surveillance')) {
        insights.detectedInterests.push('monitoring');
        insights.urgencyScore += 15;
      }
      if (page.includes('virtual-guard')) {
        insights.detectedInterests.push('cost-effective solutions');
        insights.urgencyScore += 25;
      }
      if (page.includes('it-support')) {
        insights.detectedInterests.push('cybersecurity');
        insights.urgencyScore += 20;
      }
      if (page.includes('quote')) {
        insights.urgencyScore += 40;
        insights.recommendedActions.push('Immediate consultation offer');
      }
      if (page.includes('contact')) {
        insights.urgencyScore += 35;
        insights.recommendedActions.push('Direct contact follow-up');
      }
    });

    // Infer likely industry
    if (insights.detectedInterests.includes('cybersecurity')) {
      insights.likelyIndustry = 'office';
    } else if (insights.detectedInterests.includes('physical security')) {
      insights.likelyIndustry = 'retail';
    }

    // Generate recommended actions
    if (insights.urgencyScore > 50) {
      insights.recommendedActions.push('Priority lead - immediate response');
    } else if (insights.urgencyScore > 25) {
      insights.recommendedActions.push('Qualified lead - follow up within 24 hours');
    } else {
      insights.recommendedActions.push('Nurture with educational content');
    }

    return insights;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">AI Visitor Insights</h3>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            insights.engagementLevel === 'high' ? 'text-green-600' :
            insights.engagementLevel === 'medium' ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {insights.engagementLevel.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">Engagement Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{insights.urgencyScore}</div>
          <div className="text-sm text-gray-600">Urgency Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{insights.detectedInterests.length}</div>
          <div className="text-sm text-gray-600">Detected Interests</div>
        </div>
      </div>

      {/* Detected Interests */}
      {insights.detectedInterests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Detected Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.detectedInterests.map((interest: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            AI Recommendations
          </h4>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onRecommendation && onRecommendation(rec)}
              >
                <div className="font-medium text-gray-900">{rec.name}</div>
                <div className="text-sm text-gray-600">{rec.description}</div>
                <div className="text-xs text-blue-600 mt-1">
                  Relevance: {rec.relevance}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Recommended Actions
        </h4>
        <div className="space-y-2">
          {insights.recommendedActions.map((action: string, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
              <span className="text-sm text-gray-700">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            // Trigger AI assistant with context
            const event = new CustomEvent('openAIAssistant', {
              detail: { insights, recommendations }
            });
            window.dispatchEvent(event);
          }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat with AI Security Expert
        </button>
      </div>
    </div>
  );
};