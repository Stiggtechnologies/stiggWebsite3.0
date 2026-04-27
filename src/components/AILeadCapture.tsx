import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Users, X } from 'lucide-react';

interface LeadData {
  id: string;
  email: string;
  interests: string[];
  behavior: {
    pagesVisited: string[];
    timeOnSite: number;
    downloadedResources: string[];
    formInteractions: number;
  };
  leadScore: number;
  priority: 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
}

interface AILeadCaptureProps {
  isVisible: boolean;
  onClose: () => void;
  userBehavior: {
    pagesVisited: string[];
    timeOnSite: number;
    scrollDepth: number;
  };
}

export const AILeadCapture: React.FC<AILeadCaptureProps> = ({
  isVisible,
  onClose,
  userBehavior
}) => {
  const [leadScore, setLeadScore] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    role: '',
    securityChallenges: [] as string[]
  });

  const securityChallenges = [
    { id: 'theft', label: 'Theft & Vandalism', weight: 25 },
    { id: 'access-control', label: 'Access Control', weight: 20 },
    { id: 'surveillance', label: 'Surveillance Gaps', weight: 30 },
    { id: 'cybersecurity', label: 'Cybersecurity', weight: 35 },
    { id: 'emergency-response', label: 'Emergency Preparedness', weight: 15 },
    { id: 'compliance', label: 'Regulatory Compliance', weight: 20 }
  ];

  // AI Lead Scoring Algorithm
  useEffect(() => {
    let score = 0;

    // Behavior-based scoring
    if (userBehavior.timeOnSite > 300) score += 20; // 5+ minutes
    if (userBehavior.timeOnSite > 600) score += 10; // 10+ minutes
    if (userBehavior.scrollDepth > 75) score += 15; // High engagement
    if (userBehavior.pagesVisited.length > 3) score += 20; // Multiple pages

    // Page-specific scoring
    if (userBehavior.pagesVisited.includes('/services')) score += 25;
    if (userBehavior.pagesVisited.includes('/quote')) score += 35;
    if (userBehavior.pagesVisited.includes('/contact')) score += 30;

    // Challenge-based scoring
    const challengeScore = formData.securityChallenges.reduce((total, challengeId) => {
      const challenge = securityChallenges.find(c => c.id === challengeId);
      return total + (challenge?.weight || 0);
    }, 0);

    score += challengeScore;
    setLeadScore(score);

    // AI Recommendation Engine
    if (score > 80) {
      setRecommendation('High-priority lead: Immediate consultation recommended');
    } else if (score > 50) {
      setRecommendation('Qualified lead: Schedule follow-up within 48 hours');
    } else if (score > 25) {
      setRecommendation('Potential lead: Add to nurture campaign');
    } else {
      setRecommendation('Early-stage prospect: Provide educational content');
    }
  }, [userBehavior, formData.securityChallenges]);

  const handleChallengeChange = (challengeId: string) => {
    setFormData(prev => ({
      ...prev,
      securityChallenges: prev.securityChallenges.includes(challengeId)
        ? prev.securityChallenges.filter(id => id !== challengeId)
        : [...prev.securityChallenges, challengeId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const leadData: LeadData = {
      id: `lead_${Date.now()}`,
      email: formData.email,
      interests: formData.securityChallenges,
      behavior: {
        pagesVisited: userBehavior.pagesVisited,
        timeOnSite: userBehavior.timeOnSite,
        downloadedResources: [],
        formInteractions: 1
      },
      leadScore,
      priority: leadScore > 80 ? 'high' : leadScore > 50 ? 'medium' : 'low',
      source: 'ai_lead_capture',
      timestamp: new Date().toISOString()
    };

    console.log('AI Lead Captured:', leadData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Security Assessment</h3>
                <p className="text-sm text-gray-600">Personalized recommendations in 60 seconds</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">AI Analysis</span>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              Based on your browsing behavior, you're showing high interest in security solutions.
            </p>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">Lead Score: {leadScore}/100</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your role</option>
                <option value="owner">Business Owner</option>
                <option value="manager">Facility Manager</option>
                <option value="security">Security Manager</option>
                <option value="it">IT Manager</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are your main security challenges? (Select all that apply)
              </label>
              <div className="space-y-2">
                {securityChallenges.map((challenge) => (
                  <label key={challenge.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.securityChallenges.includes(challenge.id)}
                      onChange={() => handleChallengeChange(challenge.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{challenge.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {recommendation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-900">AI Recommendation</span>
                </div>
                <p className="text-sm text-green-800 mt-1">{recommendation}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get My Personalized Security Assessment
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your information is secure and will only be used to provide you with relevant security insights.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};