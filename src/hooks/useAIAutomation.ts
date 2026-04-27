import { useState, useEffect } from 'react';
import { aiAutomation, Lead, HumanTask } from '../services/aiAutomation';

export const useAIAutomation = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [humanTasks, setHumanTasks] = useState<HumanTask[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hotLeads, warmLeads, coldLeads, tasks, automationMetrics] = await Promise.all([
        aiAutomation.getLeadsByPriority('hot'),
        aiAutomation.getLeadsByPriority('warm'),
        aiAutomation.getLeadsByPriority('cold'),
        aiAutomation.getHumanTasks(),
        aiAutomation.getAutomationMetrics()
      ]);

      setLeads([...hotLeads, ...warmLeads, ...coldLeads]);
      setHumanTasks(tasks);
      setMetrics(automationMetrics);
    } catch (error) {
      console.error('Failed to load automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const createLead = async (leadData: Partial<Lead>) => {
    try {
      const newLead = await aiAutomation.processLead(leadData);
      await loadData(); // Refresh data
      return newLead;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const updatedLead = await aiAutomation.updateLead(leadId, updates);
      await loadData(); // Refresh data
      return updatedLead;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  };

  const approveTask = async (taskId: string) => {
    try {
      await aiAutomation.approveTask(taskId);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to approve task:', error);
      throw error;
    }
  };

  const rejectTask = async (taskId: string, reason: string) => {
    try {
      await aiAutomation.rejectTask(taskId, reason);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to reject task:', error);
      throw error;
    }
  };

  const toggleAutomation = async (leadId: string, enabled: boolean) => {
    try {
      if (enabled) {
        aiAutomation.enableAutomation(leadId);
      } else {
        aiAutomation.disableAutomation(leadId);
      }
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to toggle automation:', error);
      throw error;
    }
  };

  const setHumanOverride = async (leadId: string, override: boolean) => {
    try {
      aiAutomation.setHumanOverride(leadId, override);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to set human override:', error);
      throw error;
    }
  };

  return {
    leads,
    humanTasks,
    metrics,
    loading,
    createLead,
    updateLead,
    approveTask,
    rejectTask,
    toggleAutomation,
    setHumanOverride,
    refreshData: loadData
  };
};