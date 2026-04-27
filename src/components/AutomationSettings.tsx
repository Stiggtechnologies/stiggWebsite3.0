import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Save, X, Brain, Users, Mail, Phone } from 'lucide-react';
import { AutomationRule, AutomationTrigger, AutomationCondition, AutomationAction } from '../services/aiAutomation';

export const AutomationSettings: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [showRuleEditor, setShowRuleEditor] = useState(false);

  const triggerTypes = [
    { value: 'behavior', label: 'User Behavior' },
    { value: 'score', label: 'Lead Score Change' },
    { value: 'time', label: 'Time-based' },
    { value: 'stage', label: 'Stage Change' },
    { value: 'manual', label: 'Manual Trigger' }
  ];

  const conditionOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' }
  ];

  const actionTypes = [
    { value: 'email', label: 'Send Email', icon: Mail },
    { value: 'sms', label: 'Send SMS', icon: Phone },
    { value: 'call_schedule', label: 'Schedule Call', icon: Phone },
    { value: 'task_create', label: 'Create Task', icon: Users },
    { value: 'score_update', label: 'Update Score', icon: Brain },
    { value: 'stage_update', label: 'Update Stage', icon: Settings },
    { value: 'human_handoff', label: 'Human Handoff', icon: Users }
  ];

  const createNewRule = () => {
    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: 'New Automation Rule',
      trigger: {
        type: 'behavior',
        criteria: {}
      },
      conditions: [],
      actions: [],
      humanApprovalRequired: false,
      active: true
    };
    setEditingRule(newRule);
    setShowRuleEditor(true);
  };

  const saveRule = () => {
    if (!editingRule) return;

    const existingIndex = rules.findIndex(r => r.id === editingRule.id);
    if (existingIndex >= 0) {
      const updatedRules = [...rules];
      updatedRules[existingIndex] = editingRule;
      setRules(updatedRules);
    } else {
      setRules([...rules, editingRule]);
    }

    setEditingRule(null);
    setShowRuleEditor(false);
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  const addCondition = () => {
    if (!editingRule) return;

    const newCondition: AutomationCondition = {
      field: 'score',
      operator: 'greater_than',
      value: 50
    };

    setEditingRule({
      ...editingRule,
      conditions: [...editingRule.conditions, newCondition]
    });
  };

  const updateCondition = (index: number, condition: AutomationCondition) => {
    if (!editingRule) return;

    const updatedConditions = [...editingRule.conditions];
    updatedConditions[index] = condition;

    setEditingRule({
      ...editingRule,
      conditions: updatedConditions
    });
  };

  const removeCondition = (index: number) => {
    if (!editingRule) return;

    setEditingRule({
      ...editingRule,
      conditions: editingRule.conditions.filter((_, i) => i !== index)
    });
  };

  const addAction = () => {
    if (!editingRule) return;

    const newAction: AutomationAction = {
      type: 'email',
      config: {}
    };

    setEditingRule({
      ...editingRule,
      actions: [...editingRule.actions, newAction]
    });
  };

  const updateAction = (index: number, action: AutomationAction) => {
    if (!editingRule) return;

    const updatedActions = [...editingRule.actions];
    updatedActions[index] = action;

    setEditingRule({
      ...editingRule,
      actions: updatedActions
    });
  };

  const removeAction = (index: number) => {
    if (!editingRule) return;

    setEditingRule({
      ...editingRule,
      actions: editingRule.actions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-stigg-red mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
            </div>
            <button
              onClick={createNewRule}
              className="bg-stigg-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="p-6">
          {rules.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules configured</h3>
              <p className="text-gray-600 mb-6">Create your first automation rule to start intelligent lead management.</p>
              <button
                onClick={createNewRule}
                className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{rule.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                        {rule.humanApprovalRequired && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Requires Approval
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Trigger:</strong> {rule.trigger.type}</p>
                        <p><strong>Conditions:</strong> {rule.conditions.length} condition(s)</p>
                        <p><strong>Actions:</strong> {rule.actions.length} action(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleEditor(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rule Editor Modal */}
      {showRuleEditor && editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRule.id.startsWith('rule_') ? 'Create' : 'Edit'} Automation Rule
                </h3>
                <button
                  onClick={() => {
                    setEditingRule(null);
                    setShowRuleEditor(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingRule.active}
                      onChange={(e) => setEditingRule({ ...editingRule, active: e.target.checked })}
                      className="rounded border-gray-300 text-stigg-red focus:ring-stigg-red"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingRule.humanApprovalRequired}
                      onChange={(e) => setEditingRule({ ...editingRule, humanApprovalRequired: e.target.checked })}
                      className="rounded border-gray-300 text-stigg-red focus:ring-stigg-red"
                    />
                    <span className="ml-2 text-sm text-gray-700">Require Human Approval</span>
                  </label>
                </div>
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
                <select
                  value={editingRule.trigger.type}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    trigger: { ...editingRule.trigger, type: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                >
                  {triggerTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Conditions</label>
                  <button
                    onClick={addCondition}
                    className="text-stigg-red hover:text-stigg-red-dark text-sm font-medium"
                  >
                    + Add Condition
                  </button>
                </div>
                <div className="space-y-3">
                  {editingRule.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        placeholder="Field"
                        value={condition.field}
                        onChange={(e) => updateCondition(index, { ...condition, field: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, { ...condition, operator: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        {conditionOperators.map((op) => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Value"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, { ...condition, value: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                      <button
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Actions</label>
                  <button
                    onClick={addAction}
                    className="text-stigg-red hover:text-stigg-red-dark text-sm font-medium"
                  >
                    + Add Action
                  </button>
                </div>
                <div className="space-y-3">
                  {editingRule.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(index, { ...action, type: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        {actionTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Delay (minutes)"
                        value={action.delay || ''}
                        onChange={(e) => updateAction(index, { ...action, delay: parseInt(e.target.value) || undefined })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                      <button
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingRule(null);
                  setShowRuleEditor(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRule}
                className="bg-stigg-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};