import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Lead } from '../services/aiAutomation';

interface LeadScoringWidgetProps {
  lead: Lead;
  onScoreUpdate?: (newScore: number) => void;
}

export const LeadScoringWidget: React.FC<LeadScoringWidgetProps> = ({ lead, onScoreUpdate }) => {
  const [scoreBreakdown, setScoreBreakdown] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    calculateScoreBreakdown();
    generateRecommendations();
  }, [lead]);

  const calculateScoreBreakdown = () => {
    const breakdown = {
      behavioral: calculateBehavioralScore(),
      demographic: calculateDemographicScore(),
      engagement: calculateEngagementScore(),
      recency: calculateRecencyScore(),
      intent: calculateIntentScore()
    };

    setScoreBreakdown(breakdown);
  };

  const calculateBehavioralScore = () => {
    let score = 0;
    const behavior = lead.behavior;

    // Time on site
    if (behavior.timeOnSite > 300) score += 15;
    if (behavior.timeOnSite > 600) score += 10;

    // Page depth
    score += Math.min(20, behavior.pagesVisited.length * 3);

    // High-intent pages
    const highIntentPages = ['/services', '/quote', '/contact'];
    const highIntentVisits = behavior.pagesVisited.filter(page => 
      highIntentPages.some(intent => page.includes(intent))
    ).length;
    score += highIntentVisits * 8;

    // Engagement depth
    if (behavior.scrollDepth > 75) score += 10;
    score += behavior.downloads.length * 5;
    score += behavior.formSubmissions * 10;

    return Math.min(35, score);
  };

  const calculateDemographicScore = () => {
    let score = 0;
    const demographics = lead.demographics;

    // Company size
    const companySizeScores = {
      'enterprise': 25,
      'large': 20,
      'medium': 15,
      'small': 10,
      'startup': 5
    };
    score += companySizeScores[demographics.companySize as keyof typeof companySizeScores] || 0;

    // Role
    const roleScores = {
      'ceo': 25,
      'owner': 25,
      'cto': 20,
      'security-manager': 20,
      'facility-manager': 15,
      'it-manager': 15,
      'manager': 10,
      'employee': 5
    };
    score += roleScores[demographics.role as keyof typeof roleScores] || 0;

    // Decision maker bonus
    if (demographics.decisionMaker) score += 15;

    return Math.min(25, score);
  };

  const calculateEngagementScore = () => {
    let score = 0;

    // Email engagement
    if (lead.behavior.emailOpens > 0) score += 5;
    if (lead.behavior.emailClicks > 0) score += 10;
    score += Math.min(15, lead.behavior.emailOpens * 2);

    // Recent activity
    const daysSinceLastActivity = getDaysSince(lead.lastActivity);
    if (daysSinceLastActivity < 1) score += 15;
    else if (daysSinceLastActivity < 3) score += 10;
    else if (daysSinceLastActivity < 7) score += 5;

    return Math.min(20, score);
  };

  const calculateRecencyScore = () => {
    const daysSinceCreated = getDaysSince(lead.createdAt);
    
    if (daysSinceCreated < 1) return 10;
    if (daysSinceCreated < 7) return 8;
    if (daysSinceCreated < 30) return 5;
    return 0;
  };

  const calculateIntentScore = () => {
    let score = 0;

    // High-intent interests
    const highIntentInterests = ['security-guards', 'surveillance', 'emergency-response'];
    const highIntentCount = lead.interests.filter(interest => 
      highIntentInterests.includes(interest)
    ).length;
    score += highIntentCount * 8;

    // Multiple interests
    if (lead.interests.length > 2) score += 10;

    return Math.min(20, score);
  };

  const generateRecommendations = () => {
    const recs: string[] = [];

    if (lead.score >= 80) {
      recs.push('High-priority lead: Schedule immediate consultation');
      recs.push('Consider personal outreach from senior sales team');
    } else if (lead.score >= 60) {
      recs.push('Qualified lead: Follow up within 24 hours');
      recs.push('Send personalized proposal or case study');
    } else if (lead.score >= 40) {
      recs.push('Nurture with educational content');
      recs.push('Schedule follow-up in 3-5 days');
    } else {
      recs.push('Add to long-term nurture campaign');
      recs.push('Focus on building trust and awareness');
    }

    // Specific recommendations based on behavior
    if (lead.behavior.timeOnSite > 600) {
      recs.push('High engagement detected: Offer immediate consultation');
    }

    if (lead.behavior.pagesVisited.includes('/quote')) {
      recs.push('Visited quote page: Follow up on pricing questions');
    }

    if (lead.behavior.downloads.length > 0) {
      recs.push('Downloaded resources: Send related content');
    }

    setRecommendations(recs);
  };

  const getDaysSince = (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot Lead';
    if (score >= 60) return 'Warm Lead';
    if (score >= 40) return 'Qualified Lead';
    return 'Cold Lead';
  };

  if (!scoreBreakdown) {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-stigg-red mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">AI Lead Score Analysis</h3>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(lead.score)}`}>
            {lead.score}
          </div>
          <div className="text-sm text-gray-600">{getScoreLabel(lead.score)}</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4 mb-6">
        <h4 className="text-md font-semibold text-gray-900">Score Breakdown</h4>
        
        {Object.entries(scoreBreakdown).map(([category, score]) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">{category}</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                <div
                  className="bg-stigg-red h-2 rounded-full"
                  style={{ width: `${(score as number / 35) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          AI Recommendations
        </h4>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Insights */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Key Insights
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Time on Site:</span>
            <span className="ml-2 font-medium">{Math.floor(lead.behavior.timeOnSite / 60)}m {lead.behavior.timeOnSite % 60}s</span>
          </div>
          <div>
            <span className="text-gray-600">Pages Visited:</span>
            <span className="ml-2 font-medium">{lead.behavior.pagesVisited.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Email Opens:</span>
            <span className="ml-2 font-medium">{lead.behavior.emailOpens}</span>
          </div>
          <div>
            <span className="text-gray-600">Form Submissions:</span>
            <span className="ml-2 font-medium">{lead.behavior.formSubmissions}</span>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      {lead.score >= 70 && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                High-Priority Lead: Immediate Action Required
              </span>
            </div>
            <p className="text-sm text-red-700 mt-2">
              This lead shows strong buying signals and should be contacted within the next 2 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};