import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, TrendingUp, Users, Mail, Phone, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Quote {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_type: string;
  priority: string;
  status: string;
  created_at: string;
  sla_deadline: string;
  sla_met: boolean | null;
  response_sent_at: string | null;
}

interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  score: number;
  priority: string;
  stage: string;
  interests: string[];
  last_activity: string;
  assigned_to: string;
}

export const OperationsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'leads' | 'contacts'>('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [overdueQuotes, setOverdueQuotes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingQuotes: 0,
    overdueQuotes: 0,
    hotLeads: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Load pending quotes
      const { data: quotesData } = await supabase
        .from('quote_requests')
        .select('*')
        .in('status', ['pending', 'reviewed'])
        .order('created_at', { ascending: false });

      setQuotes(quotesData || []);

      // Load overdue quotes
      const { data: overdueData } = await supabase.rpc('get_overdue_quotes');
      setOverdueQuotes(overdueData || []);

      // Load hot leads
      const { data: leadsData } = await supabase.rpc('get_hot_leads');
      setHotLeads(leadsData || []);

      // Calculate stats
      setStats({
        pendingQuotes: quotesData?.length || 0,
        overdueQuotes: overdueData?.length || 0,
        hotLeads: leadsData?.length || 0,
        avgResponseTime: 45, // Calculate from actual data
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const markAsResponded = async (quoteId: string) => {
    try {
      if (!supabase) return;

      await supabase.rpc('mark_quote_responded', { quote_id: quoteId });
      loadDashboardData();
    } catch (error) {
      console.error('Error marking quote as responded:', error);
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const diff = deadlineTime - now;

    if (diff < 0) {
      const hoursOverdue = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
      const minutesOverdue = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      return { text: `${hoursOverdue}h ${minutesOverdue}m OVERDUE`, color: 'text-red-600', overdue: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0 && minutes < 30) {
      return { text: `${minutes}m remaining`, color: 'text-orange-600', overdue: false };
    }

    return { text: `${hours}h ${minutes}m remaining`, color: 'text-green-600', overdue: false };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stigg-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and lead management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingQuotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Overdue SLA</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueQuotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-green-600">{stats.hotLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Alert Banner */}
        {overdueQuotes.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-red-800 font-semibold">
                  {overdueQuotes.length} quote{overdueQuotes.length > 1 ? 's' : ''} overdue! Immediate action required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'quotes'
                    ? 'border-b-2 border-stigg-red text-stigg-red'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Quote Requests ({quotes.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'leads'
                    ? 'border-b-2 border-stigg-red text-stigg-red'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Hot Leads ({hotLeads.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                {quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending quotes. Great job!</p>
                  </div>
                ) : (
                  quotes.map((quote) => {
                    const timeRemaining = getTimeRemaining(quote.sla_deadline);
                    return (
                      <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                {quote.first_name} {quote.last_name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(quote.priority)}`}>
                                {quote.priority.toUpperCase()}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {quote.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {quote.phone || 'N/A'}
                              </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Service:</strong> {quote.service_type}
                            </p>

                            <div className="flex items-center text-sm">
                              <Clock className={`h-4 w-4 mr-2 ${timeRemaining.color}`} />
                              <span className={`font-semibold ${timeRemaining.color}`}>
                                {timeRemaining.text}
                              </span>
                              <span className="text-gray-500 ml-2">
                                (Deadline: {new Date(quote.sla_deadline).toLocaleString()})
                              </span>
                            </div>
                          </div>

                          <div className="ml-4 flex flex-col space-y-2">
                            <a
                              href={`mailto:${quote.email}`}
                              className="bg-stigg-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stigg-red-dark transition-colors text-center"
                            >
                              Send Quote
                            </a>
                            <button
                              onClick={() => markAsResponded(quote.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                              Mark Responded
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4">
                {hotLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hot leads at the moment.</p>
                  </div>
                ) : (
                  hotLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              {lead.name || lead.email}
                            </h3>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                              SCORE: {lead.score}/100
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {lead.phone}
                              </div>
                            )}
                          </div>

                          {lead.company && (
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Company:</strong> {lead.company}
                            </p>
                          )}

                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Interests:</strong> {lead.interests.join(', ')}
                          </p>

                          <p className="text-sm text-gray-600">
                            <strong>Stage:</strong> {lead.stage} |
                            <strong className="ml-2">Last Activity:</strong> {new Date(lead.last_activity).toLocaleString()}
                          </p>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="bg-stigg-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stigg-red-dark transition-colors text-center"
                          >
                            Contact Lead
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-center"
                            >
                              Call Now
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
