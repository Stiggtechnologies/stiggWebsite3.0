import React, { useState, useEffect } from 'react';
import { Mail, Send, Calendar, Users, Eye, MousePointer, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  scheduled_for: string | null;
  sent_at: string | null;
  recipient_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

export const NewsletterManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    scheduled_for: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Load campaigns
      const { data: campaignsData } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      setCampaigns(campaignsData || []);

      // Load subscribers
      const { data: subscribersData } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active')
        .order('subscribed_at', { ascending: false });

      setSubscribers(subscribersData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!supabase) {
        throw new Error('Database is not configured');
      }

      const campaignData: any = {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
        status: formData.scheduled_for ? 'scheduled' : 'draft',
      };

      if (formData.scheduled_for) {
        campaignData.scheduled_for = formData.scheduled_for;
      }

      const { data: newCampaign, error } = await supabase
        .from('newsletter_campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;

      // Send admin notification
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            type: 'newsletter_campaign',
            data: {
              action: 'created',
              title: formData.title,
              subject: formData.subject,
              content: formData.content,
              status: campaignData.status,
              scheduledFor: formData.scheduled_for,
            },
          }),
        });
      } catch (notifError) {
        console.error('Error sending admin notification:', notifError);
      }

      setShowCreateForm(false);
      setFormData({
        title: '',
        subject: '',
        content: '',
        scheduled_for: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this newsletter to all active subscribers?')) {
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/newsletter-sender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ campaignId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Newsletter sent to ${result.recipientCount} subscribers!`);
        loadData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send newsletter');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stigg-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Newsletter Manager</h1>
              <p className="text-gray-600 mt-1">Create and manage newsletter campaigns</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">32%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <MousePointer className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
              <form onSubmit={createCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    placeholder="Monthly Security Newsletter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    placeholder="Your Monthly Security Update"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    placeholder="Newsletter content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule For (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_for"
                    value={formData.scheduled_for}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-stigg-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors"
                  >
                    Create Campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Campaigns</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No campaigns yet. Create your first one!</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {campaign.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                          {campaign.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Subject:</strong> {campaign.subject}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {campaign.sent_at && (
                          <>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {campaign.recipient_count} sent
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {campaign.open_count} opens ({Math.round((campaign.open_count / campaign.recipient_count) * 100)}%)
                            </div>
                            <div className="flex items-center">
                              <MousePointer className="h-4 w-4 mr-1" />
                              {campaign.click_count} clicks ({Math.round((campaign.click_count / campaign.recipient_count) * 100)}%)
                            </div>
                          </>
                        )}
                        {campaign.scheduled_for && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Scheduled: {new Date(campaign.scheduled_for).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => sendCampaign(campaign.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send Now
                        </button>
                      )}
                      {campaign.status !== 'sent' && (
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
