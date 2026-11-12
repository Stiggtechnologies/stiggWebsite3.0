// Client for the Stigg "AI Security Expert" chat.
// The model call happens server-side in /api/chat (Vercel AI Gateway with an
// OpenRouter free-model fallback); no AI provider keys are shipped to the browser.

const CHAT_ENDPOINT = '/api/chat';
const REQUEST_TIMEOUT_MS = 45_000;

const CONTACT_FALLBACK =
  'I apologize, but I\'m experiencing technical difficulties. Please contact our team directly at admin@stigg.ca, call 1-587-644-4644, or text/call 780-215-2887 for immediate assistance.';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Conversation Context Management
interface ConversationContext {
  userId: string;
  sessionId: string;
  messages: ChatMessage[];
  userProfile?: {
    industry?: string;
    companySize?: string;
    securityConcerns?: string[];
    previousInteractions?: string[];
  };
  leadData?: {
    email?: string;
    phone?: string;
    company?: string;
    interests?: string[];
  };
}

class StiggAIAssistant {
  private conversations: Map<string, ConversationContext> = new Map();
  private knowledgeBase: Map<string, any> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Comprehensive knowledge base for Stigg Security
    this.knowledgeBase.set('services', {
      'security-guards': {
        name: 'Security Guard Services',
        description: 'Professional licensed security personnel',
        features: ['24/7 availability', 'Licensed officers', 'Mobile patrols', 'Access control'],
        pricing: 'Starting from $25/hour',
        deploymentTime: '2-4 hours for emergency, 24-48 hours for planned'
      },
      'surveillance': {
        name: 'Surveillance & Alarm Systems',
        description: 'Advanced monitoring and detection systems',
        features: ['4K cameras', 'AI detection', 'Remote monitoring', 'Cloud storage'],
        pricing: 'Custom quote based on requirements',
        deploymentTime: '1-2 weeks for installation'
      },
      'virtual-guard': {
        name: 'Virtual Security Guard',
        description: 'AI-powered remote monitoring service',
        features: ['AI threat detection', 'Two-way audio', 'Real-time alerts', 'Cost-effective'],
        pricing: '60-80% less than traditional guards',
        deploymentTime: '3-5 days for setup'
      },
      'it-support': {
        name: 'IT Support & Infrastructure',
        description: 'Comprehensive cybersecurity and IT solutions',
        features: ['Network security', 'Data backup', 'Compliance', '24/7 monitoring'],
        pricing: 'Monthly managed service plans available',
        deploymentTime: '1-2 weeks for full implementation'
      }
    });

    this.knowledgeBase.set('industries', {
      retail: {
        commonConcerns: ['Shoplifting', 'Employee theft', 'Customer safety', 'After-hours security'],
        recommendedServices: ['security-guards', 'surveillance', 'virtual-guard'],
        caseStudies: ['Reduced theft by 75% at major retail chain', 'Improved customer confidence']
      },
      construction: {
        commonConcerns: ['Equipment theft', 'Vandalism', 'Unauthorized access', 'Safety compliance'],
        recommendedServices: ['mobile-patrols', 'surveillance', 'virtual-guard'],
        caseStudies: ['Protected $2M in equipment', 'Zero theft incidents over 18 months']
      },
      healthcare: {
        commonConcerns: ['Patient safety', 'Controlled access', 'Emergency response', 'PIPEDA compliance'],
        recommendedServices: ['security-guards', 'access-control', 'surveillance'],
        caseStudies: ['Enhanced patient safety scores', 'Improved emergency response times']
      },
      office: {
        commonConcerns: ['Access control', 'After-hours security', 'Visitor management', 'Data protection'],
        recommendedServices: ['access-control', 'surveillance', 'it-support'],
        caseStudies: ['Streamlined visitor management', 'Enhanced cybersecurity posture']
      }
    });

    this.knowledgeBase.set('compliance', {
      alberta: {
        licensing: 'All guards licensed by Alberta Justice and Solicitor General',
        insurance: 'Comprehensive liability and bonding coverage',
        training: 'Ongoing professional development requirements'
      },
      pipeda: {
        dataProtection: 'Strict privacy controls for surveillance data',
        retention: 'Customizable data retention policies',
        access: 'Controlled access to recorded information'
      }
    });
  }

  async processMessage(
    message: string,
    userId: string,
    sessionId: string,
    context?: {
      serviceType?: string;
      userProfile?: any;
      leadData?: any;
    }
  ): Promise<{
    response: string;
    suggestions?: string[];
    leadScore?: number;
    nextActions?: string[];
    requiresHuman?: boolean;
  }> {
    try {
      // Get or create conversation context
      const conversationKey = `${userId}-${sessionId}`;
      let conversation = this.conversations.get(conversationKey);

      if (!conversation) {
        conversation = {
          userId,
          sessionId,
          messages: [],
          userProfile: context?.userProfile,
          leadData: context?.leadData
        };
        this.conversations.set(conversationKey, conversation);
      }

      const response = await this.requestChatCompletion({
        message,
        history: conversation.messages.slice(-10), // Keep last 10 messages for context
        serviceType: context?.serviceType,
        userProfile: conversation.userProfile
      });

      // Update conversation history
      conversation.messages.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );

      // Analyze the conversation for lead scoring and next actions
      const analysis = await this.analyzeConversation(conversation, message, response);

      return {
        response,
        suggestions: this.generateSuggestions(message, context?.serviceType),
        leadScore: analysis.leadScore,
        nextActions: analysis.nextActions,
        requiresHuman: analysis.requiresHuman
      };

    } catch (error) {
      console.error('AI Assistant Error:', error);
      return {
        response: CONTACT_FALLBACK,
        requiresHuman: true
      };
    }
  }

  private async requestChatCompletion(payload: {
    message: string;
    history: ChatMessage[];
    serviceType?: string;
    userProfile?: ConversationContext['userProfile'];
  }): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = (await res.json().catch(() => null)) as { response?: string; error?: string } | null;
      if (!res.ok || !data?.response) {
        throw new Error(`AI chat unavailable (${res.status}${data?.error ? `: ${data.error}` : ''})`);
      }
      return data.response;
    } finally {
      clearTimeout(timer);
    }
  }

  private async analyzeConversation(
    conversation: ConversationContext,
    message: string,
    response: string
  ): Promise<{
    leadScore: number;
    nextActions: string[];
    requiresHuman: boolean;
  }> {
    let leadScore = 0;
    const nextActions: string[] = [];
    let requiresHuman = false;

    // Analyze message for buying signals
    const messageLower = message.toLowerCase();
    
    // High-intent keywords
    if (messageLower.includes('quote') || messageLower.includes('price') || messageLower.includes('cost')) {
      leadScore += 30;
      nextActions.push('Send pricing information');
      nextActions.push('Schedule consultation');
    }

    if (messageLower.includes('when') || messageLower.includes('how soon') || messageLower.includes('timeline')) {
      leadScore += 25;
      nextActions.push('Discuss implementation timeline');
    }

    if (messageLower.includes('contract') || messageLower.includes('agreement') || messageLower.includes('sign')) {
      leadScore += 40;
      requiresHuman = true;
      nextActions.push('Connect with sales specialist');
    }

    // Medium-intent keywords
    if (messageLower.includes('compare') || messageLower.includes('options') || messageLower.includes('features')) {
      leadScore += 20;
      nextActions.push('Provide detailed comparison');
    }

    if (messageLower.includes('demo') || messageLower.includes('see') || messageLower.includes('show')) {
      leadScore += 25;
      nextActions.push('Schedule product demonstration');
    }

    // Industry-specific scoring
    if (conversation.userProfile?.industry) {
      leadScore += 15;
      nextActions.push(`Provide ${conversation.userProfile.industry}-specific case studies`);
    }

    // Conversation length scoring
    if (conversation.messages.length > 6) {
      leadScore += 20;
      nextActions.push('Offer personal consultation');
    }

    // Complex questions requiring human expertise
    if (messageLower.includes('compliance') || messageLower.includes('regulation') || messageLower.includes('legal')) {
      requiresHuman = true;
      nextActions.push('Connect with compliance specialist');
    }

    return {
      leadScore: Math.min(100, leadScore),
      nextActions,
      requiresHuman
    };
  }

  private generateSuggestions(message: string, serviceType?: string): string[] {
    const suggestions: string[] = [];
    const messageLower = message.toLowerCase();

    // Service-specific suggestions
    if (serviceType === 'security-guards' || messageLower.includes('guard')) {
      suggestions.push('What are your guard licensing requirements?');
      suggestions.push('Can you provide both uniformed and plainclothes guards?');
      suggestions.push('What is your emergency response time?');
    } else if (serviceType === 'surveillance' || messageLower.includes('camera')) {
      suggestions.push('What camera resolution do you offer?');
      suggestions.push('Can I access cameras remotely?');
      suggestions.push('How long is video footage stored?');
    } else if (serviceType === 'virtual-guard' || messageLower.includes('virtual')) {
      suggestions.push('How does AI threat detection work?');
      suggestions.push('What are the cost savings vs traditional guards?');
      suggestions.push('Can virtual guards call police directly?');
    } else if (serviceType === 'it-support' || messageLower.includes('cyber')) {
      suggestions.push('What cybersecurity services do you provide?');
      suggestions.push('Do you offer 24/7 IT support?');
      suggestions.push('How do you handle data backup?');
    } else {
      // General suggestions
      suggestions.push('What security services do you recommend for my industry?');
      suggestions.push('Can I get a free security assessment?');
      suggestions.push('What are your response times for emergencies?');
      suggestions.push('Do you serve my area in Alberta?');
    }

    return suggestions;
  }

  // Public methods for integration
  async getServiceRecommendations(
    industry: string,
    concerns: string[],
    budget?: string
  ): Promise<{
    recommendations: any[];
    reasoning: string;
  }> {
    const industryData = this.knowledgeBase.get('industries')?.[industry];
    const services = this.knowledgeBase.get('services');

    if (!industryData || !services) {
      return {
        recommendations: [],
        reasoning: 'Unable to provide recommendations at this time.'
      };
    }

    const recommendations = industryData.recommendedServices.map((serviceId: string) => ({
      ...services[serviceId],
      id: serviceId,
      relevance: this.calculateRelevance(serviceId, concerns)
    })).sort((a: any, b: any) => b.relevance - a.relevance);

    const reasoning = `Based on your ${industry} industry and concerns about ${concerns.join(', ')}, I recommend these services in order of priority. ${industryData.caseStudies[0]} with similar clients.`;

    return {
      recommendations,
      reasoning
    };
  }

  private calculateRelevance(serviceId: string, concerns: string[]): number {
    // Simple relevance scoring based on service capabilities
    const serviceCapabilities: Record<string, string[]> = {
      'security-guards': ['theft', 'vandalism', 'access', 'emergency', 'customer'],
      'surveillance': ['monitoring', 'theft', 'vandalism', 'evidence', 'remote'],
      'virtual-guard': ['cost', 'remote', 'monitoring', 'ai', 'automation'],
      'it-support': ['cyber', 'data', 'network', 'compliance', 'backup']
    };

    const capabilities = serviceCapabilities[serviceId] || [];
    let relevance = 0;

    concerns.forEach(concern => {
      capabilities.forEach(capability => {
        if (concern.toLowerCase().includes(capability)) {
          relevance += 1;
        }
      });
    });

    return relevance;
  }

  // Cleanup old conversations
  cleanupOldConversations(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [key, conversation] of this.conversations.entries()) {
      // Simple cleanup based on last message timestamp
      if (conversation.messages.length > 0) {
        const lastMessageTime = new Date(conversation.messages[conversation.messages.length - 1].content || '').getTime();
        if (now - lastMessageTime > maxAge) {
          this.conversations.delete(key);
        }
      }
    }
  }
}

// Export singleton instance
export const stiggAI = new StiggAIAssistant();

// Export types for use in components
export type { ConversationContext };