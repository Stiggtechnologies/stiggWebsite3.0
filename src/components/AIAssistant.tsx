import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { stiggAI } from '../services/openaiService';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  leadScore?: number;
  nextActions?: string[];
  requiresHuman?: boolean;
}

interface AIAssistantProps {
  serviceType?: string;
  userProfile?: {
    industry?: string;
    companySize?: string;
    securityConcerns?: string[];
  };
  onLeadCapture?: (leadData: any) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  serviceType,
  userProfile,
  onLeadCapture
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadData, setLeadData] = useState({ email: '', phone: '', company: '' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        suggestions: getInitialSuggestions()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, serviceType]);

  const getWelcomeMessage = (): string => {
    if (serviceType) {
      const serviceNames = {
        'security-guards': 'Security Guard Services',
        'surveillance': 'Surveillance & Alarm Systems',
        'virtual-guard': 'Virtual Security Guard',
        'it-support': 'IT Support & Infrastructure'
      };
      
      const serviceName = serviceNames[serviceType as keyof typeof serviceNames];
      return `Hello! I'm your AI security expert specializing in ${serviceName}. I'm here to help you understand how our solutions can protect your business. What specific security challenges are you facing?`;
    }

    return `Hello! I'm your AI security consultant for Stigg Security Inc. I can help you with:

• Security guard services and mobile patrols
• Surveillance and alarm systems
• Virtual security guard solutions
• IT support and cybersecurity

What security concerns can I help you address today?`;
  };

  const getInitialSuggestions = (): string[] => {
    if (serviceType === 'security-guards') {
      return [
        'What guard services do you offer?',
        'How quickly can you deploy guards?',
        'Are your guards licensed and insured?',
        'Can you provide mobile patrol services?'
      ];
    } else if (serviceType === 'surveillance') {
      return [
        'What camera systems do you install?',
        'Can I monitor cameras remotely?',
        'How long is footage stored?',
        'Do you offer AI-powered detection?'
      ];
    } else if (serviceType === 'virtual-guard') {
      return [
        'How does virtual guard service work?',
        'What are the cost savings?',
        'Can virtual guards call police?',
        'What happens when threats are detected?'
      ];
    } else if (serviceType === 'it-support') {
      return [
        'What cybersecurity services do you provide?',
        'Do you offer 24/7 IT support?',
        'How do you protect against ransomware?',
        'Can you help with compliance requirements?'
      ];
    }

    return [
      'What security services do you recommend?',
      'Can I get a free security assessment?',
      'What are your emergency response times?',
      'Do you serve my area in Alberta?'
    ];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await stiggAI.processMessage(
        inputMessage,
        userId,
        sessionId,
        {
          serviceType,
          userProfile,
          leadData
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions,
        leadScore: response.leadScore,
        nextActions: response.nextActions,
        requiresHuman: response.requiresHuman
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if lead capture should be shown
      if (response.leadScore && response.leadScore > 60 && !showLeadCapture) {
        setShowLeadCapture(true);
      }

      // Handle human handoff
      if (response.requiresHuman) {
        const handoffMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'system',
          content: 'I apologize, but I\'m experiencing technical difficulties. Please contact our team directly at admin@stigg.ca, call 1-587-644-4644, or text/call 780-215-2887.',
          timestamp: new Date()
        };
        setTimeout(() => {
          setMessages(prev => [...prev, handoffMessage]);
        }, 1000);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please contact our team directly at admin@stigg.ca, call 1-587-644-4644, or text/call 780-215-2887.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const handleLeadCapture = () => {
    if (onLeadCapture) {
      onLeadCapture({
        ...leadData,
        source: 'ai_assistant',
        serviceType,
        sessionId,
        leadScore: messages[messages.length - 1]?.leadScore || 0
      });
    }
    setShowLeadCapture(false);
    
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: 'Thank you! I\'ve captured your information and one of our security specialists will contact you within 24 hours. Is there anything else I can help you with right now?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-stigg-red text-white p-4 rounded-full shadow-lg hover:bg-stigg-red-dark transition-colors group"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <Bot className="h-3 w-3" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-stigg-red text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Security Expert</h3>
            <p className="text-sm text-blue-100">Powered by GPT-4</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-stigg-red text-white' 
                  : message.type === 'system'
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start">
                  {message.type !== 'user' && (
                    <div className="mr-2 mt-1">
                      {message.type === 'system' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.leadScore && message.leadScore > 50 && (
                      <div className="mt-2 text-xs opacity-75">
                        Lead Score: {message.leadScore}/100
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <User className="h-4 w-4 ml-2 mt-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Suggested questions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Next Actions */}
            {message.nextActions && message.nextActions.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-sm font-medium text-green-800 mb-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Recommended Next Steps:
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  {message.nextActions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-green-500 rounded-full mr-2 mt-2"></span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-lg">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Get Priority Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              I can see you're seriously considering our security solutions. Let me connect you with a specialist for personalized assistance.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={leadData.email}
                onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={leadData.phone}
                onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
              />
              <input
                type="text"
                placeholder="Company name"
                value={leadData.company}
                onChange={(e) => setLeadData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleLeadCapture}
                disabled={!leadData.email}
                className="flex-1 bg-stigg-red text-white py-2 px-4 rounded-lg font-semibold hover:bg-stigg-red-dark transition-colors disabled:opacity-50"
              >
                Connect Me
              </button>
              <button
                onClick={() => setShowLeadCapture(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about our security services..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-stigg-red text-white p-2 rounded-lg hover:bg-stigg-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 mt-3 text-xs">
          <a
            href="tel:1-587-644-4644"
            className="flex items-center text-stigg-red hover:text-stigg-red-dark transition-colors"
          >
            <Phone className="h-3 w-3 mr-1" />
            Call Now
          </a>
          <a
            href="mailto:admin@stigg.ca"
            className="flex items-center text-stigg-red hover:text-stigg-red-dark transition-colors"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </a>
          <button
            onClick={() => setShowLeadCapture(true)}
            className="flex items-center text-stigg-red hover:text-stigg-red-dark transition-colors"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};