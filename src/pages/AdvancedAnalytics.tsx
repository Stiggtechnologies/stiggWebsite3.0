import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { HeatmapViewer } from '../components/HeatmapViewer';
import { SessionReplayViewer } from '../components/SessionReplayViewer';
import {
  Globe,
  MousePointer,
  Activity,
  Users,
  TrendingUp,
  MapPin,
  LogOut,
  PlayCircle,
  Flame,
  BarChart3
} from 'lucide-react';

export const AdvancedAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState(7);
  const [selectedPage, setSelectedPage] = useState('/');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    avgSessionDuration: 0,
    bounceRate: 0,
    avgScrollDepth: 0,
    totalClicks: 0,
    topCountries: [] as Array<{ country: string; count: number }>,
    topCities: [] as Array<{ city: string; count: number }>,
    deviceBreakdown: [] as Array<{ device_type: string; count: number }>,
    exitPages: [] as Array<{ exit_page: string; count: number }>,
    engagementMetrics: {
      highEngagement: 0,
      mediumEngagement: 0,
      lowEngagement: 0,
    },
    topClickedElements: [] as Array<{ element: string; clicks: number }>,
  });

  useEffect(() => {
    fetchAdvancedAnalytics();
  }, [dateRange]);

  const fetchAdvancedAnalytics = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      // Fetch session metrics
      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('session_duration, bounce, avg_scroll_depth, total_clicks')
        .gte('created_at', startDate.toISOString());

      const avgDuration = sessions && sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.session_duration || 0), 0) / sessions.length)
        : 0;

      const bounceRate = sessions && sessions.length > 0
        ? (sessions.filter(s => s.bounce).length / sessions.length) * 100
        : 0;

      const avgScroll = sessions && sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.avg_scroll_depth || 0), 0) / sessions.length)
        : 0;

      const totalClicks = sessions && sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.total_clicks || 0), 0)
        : 0;

      // Engagement metrics
      const highEngagement = sessions?.filter(s =>
        (s.session_duration || 0) > 180 && (s.total_clicks || 0) > 5
      ).length || 0;

      const mediumEngagement = sessions?.filter(s =>
        (s.session_duration || 0) > 60 && (s.session_duration || 0) <= 180
      ).length || 0;

      const lowEngagement = (sessions?.length || 0) - highEngagement - mediumEngagement;

      // Geographic data
      const { data: geoData } = await supabase
        .from('geographic_data')
        .select('country, city')
        .gte('created_at', startDate.toISOString());

      const countryCount: Record<string, number> = {};
      const cityCount: Record<string, number> = {};

      geoData?.forEach((geo) => {
        if (geo.country) {
          countryCount[geo.country] = (countryCount[geo.country] || 0) + 1;
        }
        if (geo.city) {
          cityCount[geo.city] = (cityCount[geo.city] || 0) + 1;
        }
      });

      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const topCities = Object.entries(cityCount)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Device breakdown
      const { data: deviceData } = await supabase
        .from('analytics_sessions')
        .select('device_type')
        .gte('created_at', startDate.toISOString());

      const deviceCount: Record<string, number> = {};
      deviceData?.forEach((d) => {
        const device = d.device_type || 'Unknown';
        deviceCount[device] = (deviceCount[device] || 0) + 1;
      });

      const deviceBreakdown = Object.entries(deviceCount)
        .map(([device_type, count]) => ({ device_type, count }));

      // Exit pages
      const { data: exitData } = await supabase
        .from('exit_pages')
        .select('exit_page')
        .gte('created_at', startDate.toISOString());

      const exitCount: Record<string, number> = {};
      exitData?.forEach((e) => {
        exitCount[e.exit_page] = (exitCount[e.exit_page] || 0) + 1;
      });

      const exitPages = Object.entries(exitCount)
        .map(([exit_page, count]) => ({ exit_page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top clicked elements
      const { data: clickData } = await supabase
        .from('click_events')
        .select('element_selector, element_text')
        .gte('created_at', startDate.toISOString());

      const elementCount: Record<string, number> = {};
      clickData?.forEach((click) => {
        const element = click.element_text || click.element_selector || 'Unknown';
        const truncated = element.substring(0, 50);
        elementCount[truncated] = (elementCount[truncated] || 0) + 1;
      });

      const topClickedElements = Object.entries(elementCount)
        .map(([element, clicks]) => ({ element, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      setStats({
        avgSessionDuration: avgDuration,
        bounceRate,
        avgScrollDepth: avgScroll,
        totalClicks,
        topCountries,
        topCities,
        deviceBreakdown,
        exitPages,
        engagementMetrics: {
          highEngagement,
          mediumEngagement,
          lowEngagement,
        },
        topClickedElements,
      });
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600 mt-1">Deep insights into user behavior</p>
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

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Session Duration</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {Math.floor(stats.avgSessionDuration / 60)}:{(stats.avgSessionDuration % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bounce Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.bounceRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Scroll Depth</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.avgScrollDepth}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalClicks.toLocaleString()}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">High Engagement (3+ min, 5+ clicks)</span>
                <span className="font-medium">{stats.engagementMetrics.highEngagement}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{
                    width: `${(stats.engagementMetrics.highEngagement / (stats.engagementMetrics.highEngagement + stats.engagementMetrics.mediumEngagement + stats.engagementMetrics.lowEngagement || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Medium Engagement (1-3 min)</span>
                <span className="font-medium">{stats.engagementMetrics.mediumEngagement}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full"
                  style={{
                    width: `${(stats.engagementMetrics.mediumEngagement / (stats.engagementMetrics.highEngagement + stats.engagementMetrics.mediumEngagement + stats.engagementMetrics.lowEngagement || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Low Engagement (&lt;1 min)</span>
                <span className="font-medium">{stats.engagementMetrics.lowEngagement}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full"
                  style={{
                    width: `${(stats.engagementMetrics.lowEngagement / (stats.engagementMetrics.highEngagement + stats.engagementMetrics.mediumEngagement + stats.engagementMetrics.lowEngagement || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Geographic Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Countries</h2>
            </div>
            <div className="space-y-3">
              {stats.topCountries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No geographic data yet</p>
              ) : (
                stats.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-900">{country.country}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(country.count / stats.topCountries[0].count) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-medium w-8 text-right">
                        {country.count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Cities</h2>
            </div>
            <div className="space-y-3">
              {stats.topCities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No city data yet</p>
              ) : (
                stats.topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-900">{city.city}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(city.count / stats.topCities[0].count) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-medium w-8 text-right">
                        {city.count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Exit Pages */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <LogOut className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Exit Pages</h2>
            </div>
            <div className="space-y-3">
              {stats.exitPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-900 truncate flex-1">{page.exit_page}</span>
                  <span className="text-gray-600 font-medium ml-4">{page.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clicked Elements */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MousePointer className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Most Clicked Elements</h2>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.topClickedElements.map((element, index) => (
                <div key={index} className="flex items-center justify-between py-1 text-sm">
                  <span className="text-gray-900 truncate flex-1">{element.element}</span>
                  <span className="text-gray-600 font-medium ml-4">{element.clicks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Flame className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">View Heatmap</h3>
            <p className="text-sm mt-2 opacity-90">
              See where users click on your pages
            </p>
          </button>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <PlayCircle className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Session Replay</h3>
            <p className="text-sm mt-2 opacity-90">
              Watch user interactions (View from main analytics dashboard)
            </p>
          </div>
        </div>
      </div>

      {showHeatmap && <HeatmapViewer pagePath={selectedPage} dateRange={dateRange} />}
      {selectedSession && (
        <SessionReplayViewer
          sessionId={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};
