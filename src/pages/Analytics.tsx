import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  TrendingUp,
  Users,
  MousePointer,
  Target,
  BarChart3,
  Calendar,
  ExternalLink,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AnalyticsData {
  totalPageViews: number;
  uniqueSessions: number;
  totalConversions: number;
  conversionRate: number;
  topPages: { path: string; views: number }[];
  topSources: { source: string; sessions: number }[];
  formMetrics: {
    quote: { views: number; starts: number; submits: number; success: number };
    contact: { views: number; starts: number; submits: number; success: number };
  };
  recentConversions: Array<{
    event_name: string;
    created_at: string;
    metadata: any;
  }>;
  deviceBreakdown: { device_type: string; count: number }[];
}

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setData(null);
        return;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      // Total page views
      const { count: pageViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Unique sessions
      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('session_id')
        .gte('created_at', startDate.toISOString());

      // Total conversions
      const { count: conversions } = await supabase
        .from('conversion_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Top pages
      const { data: topPagesData } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', startDate.toISOString());

      const pageCount: Record<string, number> = {};
      topPagesData?.forEach((view) => {
        pageCount[view.page_path] = (pageCount[view.page_path] || 0) + 1;
      });

      const topPages = Object.entries(pageCount)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Top sources
      const { data: sourcesData } = await supabase
        .from('analytics_sessions')
        .select('utm_source, referrer')
        .gte('created_at', startDate.toISOString());

      const sourceCount: Record<string, number> = {};
      sourcesData?.forEach((session) => {
        const source = session.utm_source || session.referrer || 'Direct';
        sourceCount[source] = (sourceCount[source] || 0) + 1;
      });

      const topSources = Object.entries(sourceCount)
        .map(([source, sessions]) => ({ source, sessions }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5);

      // Form metrics
      const { data: formEvents } = await supabase
        .from('form_events')
        .select('form_type, event_type')
        .gte('created_at', startDate.toISOString());

      const quoteMetrics = {
        views: formEvents?.filter(e => e.form_type === 'quote' && e.event_type === 'view').length || 0,
        starts: formEvents?.filter(e => e.form_type === 'quote' && e.event_type === 'start').length || 0,
        submits: formEvents?.filter(e => e.form_type === 'quote' && e.event_type === 'submit').length || 0,
        success: formEvents?.filter(e => e.form_type === 'quote' && e.event_type === 'success').length || 0,
      };

      const contactMetrics = {
        views: formEvents?.filter(e => e.form_type === 'contact' && e.event_type === 'view').length || 0,
        starts: formEvents?.filter(e => e.form_type === 'contact' && e.event_type === 'start').length || 0,
        submits: formEvents?.filter(e => e.form_type === 'contact' && e.event_type === 'submit').length || 0,
        success: formEvents?.filter(e => e.form_type === 'contact' && e.event_type === 'success').length || 0,
      };

      // Recent conversions
      const { data: recentConversions } = await supabase
        .from('conversion_events')
        .select('event_name, created_at, metadata')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      // Device breakdown
      const { data: deviceData } = await supabase
        .from('analytics_sessions')
        .select('device_type')
        .gte('created_at', startDate.toISOString());

      const deviceCount: Record<string, number> = {};
      deviceData?.forEach((session) => {
        const device = session.device_type || 'Unknown';
        deviceCount[device] = (deviceCount[device] || 0) + 1;
      });

      const deviceBreakdown = Object.entries(deviceCount)
        .map(([device_type, count]) => ({ device_type, count }));

      const conversionRate = sessions?.length
        ? ((conversions || 0) / sessions.length) * 100
        : 0;

      setData({
        totalPageViews: pageViews || 0,
        uniqueSessions: sessions?.length || 0,
        totalConversions: conversions || 0,
        conversionRate,
        topPages,
        topSources,
        formMetrics: {
          quote: quoteMetrics,
          contact: contactMetrics,
        },
        recentConversions: recentConversions || [],
        deviceBreakdown,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track visitor behavior and conversions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDateRange(7)}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 7
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange(30)}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 30
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange(90)}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 90
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.totalPageViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.uniqueSessions.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.totalConversions.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {data.conversionRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h2>
            <div className="space-y-3">
              {data.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-600 font-medium">{index + 1}.</span>
                    <span className="text-gray-900 truncate">{page.path}</span>
                  </div>
                  <span className="text-gray-600 font-medium">{page.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
            <div className="space-y-3">
              {data.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-600 font-medium">{index + 1}.</span>
                    <span className="text-gray-900 truncate">{source.source}</span>
                  </div>
                  <span className="text-gray-600 font-medium">{source.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Funnels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quote Form Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Form Funnel</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Viewed</span>
                  <span className="font-medium">{data.formMetrics.quote.views}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Started</span>
                  <span className="font-medium">{data.formMetrics.quote.starts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.quote.starts / data.formMetrics.quote.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-medium">{data.formMetrics.quote.submits}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.quote.submits / data.formMetrics.quote.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Success</span>
                  <span className="font-medium text-green-600">{data.formMetrics.quote.success}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.quote.success / data.formMetrics.quote.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Form Funnel</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Viewed</span>
                  <span className="font-medium">{data.formMetrics.contact.views}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Started</span>
                  <span className="font-medium">{data.formMetrics.contact.starts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.contact.starts / data.formMetrics.contact.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-medium">{data.formMetrics.contact.submits}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.contact.submits / data.formMetrics.contact.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Success</span>
                  <span className="font-medium text-green-600">{data.formMetrics.contact.success}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(data.formMetrics.contact.success / data.formMetrics.contact.views) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Breakdown & Recent Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
            <div className="space-y-3">
              {data.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-900 capitalize">{device.device_type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(device.count / data.uniqueSessions) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-600 font-medium w-12 text-right">
                      {device.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversions</h2>
            <div className="space-y-3">
              {data.recentConversions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No conversions yet</p>
              ) : (
                data.recentConversions.map((conversion, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900 font-medium capitalize">
                        {conversion.event_name.replace(/_/g, ' ')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(conversion.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
