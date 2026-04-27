import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Clock, Target } from 'lucide-react';

interface BlogAnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topPosts: Array<{
    title: string;
    views: number;
    engagement: number;
  }>;
  leadGeneration: {
    totalLeads: number;
    conversionRate: number;
    topSources: Array<{
      source: string;
      leads: number;
    }>;
  };
}

export const BlogAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<BlogAnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      // In a real app, this would be an API call
      const mockData: BlogAnalyticsData = {
        totalViews: 15420,
        uniqueVisitors: 8930,
        averageTimeOnPage: 245,
        bounceRate: 32.5,
        topPosts: [
          { title: 'AI-Powered Security Systems', views: 3420, engagement: 78 },
          { title: 'Cybersecurity Threats in 2024', views: 2890, engagement: 65 },
          { title: 'Remote Monitoring Solutions', views: 2340, engagement: 72 }
        ],
        leadGeneration: {
          totalLeads: 156,
          conversionRate: 1.75,
          topSources: [
            { source: 'Newsletter Signup', leads: 89 },
            { source: 'AI Lead Capture', leads: 45 },
            { source: 'Contact Form', leads: 22 }
          ]
        }
      };

      setAnalyticsData(mockData);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (!analyticsData) {
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Time on Page</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(analyticsData.averageTimeOnPage)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-100 text-stigg-red w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.bounceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {analyticsData.topPosts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{post.title}</h4>
                <p className="text-sm text-gray-600">{post.views.toLocaleString()} views</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{post.engagement}%</p>
                <p className="text-xs text-gray-600">engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Generation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Generation Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Leads Generated</span>
              <span className="text-2xl font-bold text-gray-900">{analyticsData.leadGeneration.totalLeads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-lg font-semibold text-green-600">{analyticsData.leadGeneration.conversionRate}%</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Top Lead Sources</h4>
            <div className="space-y-2">
              {analyticsData.leadGeneration.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{source.source}</span>
                  <span className="text-sm font-medium text-gray-900">{source.leads}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};