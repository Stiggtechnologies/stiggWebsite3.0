import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Target,
  Mail,
  Phone,
  Calendar,
  Settings,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { aiAutomation, Lead, HumanTask } from '../services/aiAutomation';

export const AIAutomationDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [humanTasks, setHumanTasks] = useState<HumanTask[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'leads' | 'tasks' | 'analytics'>('overview');
  const [filterPriority, setFilterPriority] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [hotLeads, warmLeads, coldLeads, tasks, dashboardMetrics] = await Promise.all([
        aiAutomation.getLeadsByPriority('hot'),
        aiAutomation.getLeadsByPriority('warm'),
        aiAutomation.getLeadsByPriority('cold'),
        aiAutomation.getHumanTasks(),
        aiAutomation.getAutomationMetrics()
      ]);

      setLeads([...hotLeads, ...warmLeads, ...coldLeads]);
      setHumanTasks(tasks);
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleTaskApproval = async (taskId: string, approved: boolean) => {
    try {
      if (approved) {
        await aiAutomation.approveTask(taskId);
      } else {
        await aiAutomation.rejectTask(taskId, 'Manual review required');
      }
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to handle task:', error);
    }
  };

  const toggleAutomation = async (leadId: string, enabled: boolean) => {
    try {
      if (enabled) {
        aiAutomation.enableAutomation(leadId);
      } else {
        aiAutomation.disableAutomation(leadId);
      }
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const filteredLeads = filterPriority === 'all' 
    ? leads 
    : leads.filter(lead => lead.priority === filterPriority);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'text-red-600 bg-red-100';
      case 'warm': return 'text-yellow-600 bg-yellow-100';
      case 'cold': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'text-purple-600 bg-purple-100';
      case 'consideration': return 'text-blue-600 bg-blue-100';
      case 'decision': return 'text-orange-600 bg-orange-100';
      case 'customer': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-stigg-red mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading AI Automation Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-stigg-red mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Sales & Marketing Automation</h1>
                <p className="text-gray-600">Intelligent lead management with human oversight</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-stigg-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'tasks', label: 'Human Tasks', icon: AlertCircle },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-stigg-red text-stigg-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.id === 'tasks' && humanTasks.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    {humanTasks.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Automated</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.automatedLeads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 text-stigg-red w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Human Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{humanTasks.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Priority Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(metrics.priorityDistribution).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          priority === 'hot' ? 'bg-red-500' :
                          priority === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Effectiveness</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Open Rate</span>
                    <span className="text-sm font-bold text-gray-900">
                      {metrics.automationEffectiveness.emailOpenRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Click Rate</span>
                    <span className="text-sm font-bold text-gray-900">
                      {metrics.automationEffectiveness.emailClickRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Automation Conversion</span>
                    <span className="text-sm font-bold text-gray-900">
                      {metrics.automationEffectiveness.automationConversionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="text-sm font-bold text-gray-900">
                      {metrics.automationEffectiveness.averageResponseTime}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {selectedTab === 'leads' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                  >
                    <option value="all">All Priorities</option>
                    <option value="hot">Hot Leads</option>
                    <option value="warm">Warm Leads</option>
                    <option value="cold">Cold Leads</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Automation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.name || lead.email}
                            </div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{lead.score}</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-stigg-red h-2 rounded-full"
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(lead.stage)}`}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleAutomation(lead.id, !lead.automationEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                lead.automationEnabled ? 'bg-stigg-red' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  lead.automationEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            {lead.humanOverride && (
                              <span className="ml-2 text-xs text-orange-600 font-medium">Manual</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900">
                              <Calendar className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Human Tasks Tab */}
        {selectedTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Human Tasks</h3>
              {humanTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending tasks. AI automation is running smoothly!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {humanTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-3 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-sm text-gray-500">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {new Date(task.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">{task.description}</h4>
                          {task.assignedTo && (
                            <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleTaskApproval(task.id, true)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleTaskApproval(task.id, false)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            {/* Source Performance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(metrics.sourcePerformance).map(([source, data]: [string, any]) => (
                      <tr key={source}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.avgScore.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.conversions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.count > 0 ? ((data.conversions / data.count) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stage Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Stage Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics.stageDistribution).map(([stage, count]) => (
                  <div key={stage} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{stage}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};