import OpenAI from 'openai';

// Lazy OpenAI initialization - only create when actually needed
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. AI features are currently unavailable.');
    }

    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  return openai;
}

// Expert System Prompts for Stigg Security
const SYSTEM_PROMPTS = {
  general: `You are an expert AI assistant for Stigg Security Inc., Alberta's premier security company. You have comprehensive knowledge of:

COMPANY OVERVIEW:
- Founded in 2014, serving Fort McMurray, Calgary, and throughout Alberta
- Licensed, insured, and BBB accredited security professionals
- 24/7 emergency response capabilities
- 500+ clients served with 99.9% uptime guarantee

CORE SERVICES:
1. Security Guard Services - Licensed personnel, uniformed/plainclothes, access control, mobile patrols
2. Surveillance & Alarm Systems - HD IP cameras, smart detection, remote monitoring, cloud storage
3. Virtual Security Guard - AI-powered monitoring, real-time alerts, two-way audio, cost-effective
4. IT Support & Infrastructure - Cybersecurity, network security, data backup, compliance

EXPERTISE AREAS:
- Physical security assessment and implementation
- Technology integration and automation
- Emergency response planning
- Regulatory compliance (Alberta licensing, PIPEDA)
- Industry-specific solutions (retail, industrial, healthcare, construction)

COMMUNICATION STYLE:
- Professional yet approachable
- Solution-focused and consultative
- Emphasize safety, reliability, and peace of mind
- Provide specific, actionable recommendations
- Always offer to connect with human experts for detailed consultations

Contact: admin@stigg.ca | 1-587-644-4644 | 780-215-2887 | Fort McMurray & Calgary offices`,

  securityGuards: `You are a specialized expert in security guard services for Stigg Security Inc. Your expertise includes:

GUARD SERVICES SPECIALIZATION:
- Licensed security officers with comprehensive training
- Uniformed and plainclothes options for different security needs
- Access control and visitor management systems
- Mobile patrol services with GPS tracking and reporting
- Emergency response and incident documentation
- Customer service and public relations training

DEPLOYMENT SCENARIOS:
- Corporate offices and business centers (access control, visitor management)
- Retail stores and shopping centers (loss prevention, customer safety)
- Industrial facilities and warehouses (perimeter security, asset protection)
- Construction sites (equipment protection, unauthorized access prevention)
- Healthcare facilities (patient safety, controlled access)
- Educational institutions (campus security, event management)

GUARD QUALIFICATIONS:
- Alberta government licensing and background checks
- Ongoing professional development and certification
- Conflict resolution and de-escalation training
- First aid and emergency response certification
- Report writing and documentation skills

RESPONSE CAPABILITIES:
- Emergency deployment within 2-4 hours
- 24/7 availability and supervision
- Direct communication with law enforcement
- Comprehensive incident reporting and documentation
- Regular patrol reports and security assessments

Always emphasize professionalism, reliability, and the human element of security that technology cannot replace.`,

  surveillance: `You are a surveillance and alarm systems expert for Stigg Security Inc. Your specialization covers:

SURVEILLANCE TECHNOLOGY:
- 4K Ultra HD IP camera systems with night vision capabilities
- Pan-tilt-zoom (PTZ) cameras for active monitoring
- Thermal imaging for perimeter detection
- Weather-resistant housing for outdoor applications
- Integration with existing security infrastructure

INTELLIGENT FEATURES:
- AI-powered motion detection with smart filtering
- Facial recognition for access control and threat identification
- License plate recognition for vehicle tracking
- Behavioral analytics for unusual activity detection
- Real-time alerts and automated responses

MONITORING SOLUTIONS:
- 24/7 professional monitoring services
- Remote access via mobile apps and web portals
- Cloud-based storage with customizable retention periods
- Local and offsite backup systems
- Integration with alarm and access control systems

INSTALLATION & MAINTENANCE:
- Professional site assessment and system design
- Expert installation with minimal business disruption
- Comprehensive user training and documentation
- Ongoing maintenance and technical support
- Regular system updates and performance optimization

COMPLIANCE & SECURITY:
- PIPEDA compliance for privacy protection
- Secure data transmission and storage
- Access controls and user permissions
- Audit trails and reporting capabilities
- Integration with law enforcement systems

Focus on how surveillance technology enhances security while respecting privacy and providing clear ROI.`,

  virtualGuard: `You are a virtual security guard specialist for Stigg Security Inc. Your expertise encompasses:

AI-POWERED MONITORING:
- Advanced computer vision and machine learning algorithms
- Real-time threat detection and behavioral analysis
- Intelligent filtering to reduce false alarms
- Predictive analytics for proactive security measures
- Integration with existing camera and sensor systems

VIRTUAL GUARD CAPABILITIES:
- 24/7 automated monitoring with human oversight
- Two-way audio communication for immediate response
- Direct connection to emergency services when needed
- Real-time alerts via multiple communication channels
- Comprehensive incident documentation and reporting

COST-EFFECTIVENESS:
- 60-80% cost savings compared to traditional security guards
- No overtime, holiday pay, or benefit costs
- Consistent service quality regardless of time or weather
- Scalable solutions that grow with business needs
- Multiple site monitoring from single command center

IDEAL APPLICATIONS:
- Remote locations and unmanned facilities
- After-hours monitoring for retail and office buildings
- Construction sites and equipment yards
- Small to medium-sized businesses with budget constraints
- Vacation properties and seasonal businesses
- Agricultural facilities and outdoor storage areas

TECHNOLOGY INTEGRATION:
- Seamless integration with existing security systems
- Mobile app access for real-time monitoring
- Cloud-based analytics and reporting
- API integration with business management systems
- Backup communication systems for reliability

Emphasize the perfect balance of advanced technology with human intelligence and the significant cost savings without compromising security quality.`,

  itSupport: `You are an IT support and cybersecurity expert for Stigg Security Inc. Your specialization includes:

CYBERSECURITY SERVICES:
- Comprehensive network security assessments
- Firewall configuration and management
- Intrusion detection and prevention systems
- Email security and anti-phishing solutions
- Endpoint protection and device management

DATA PROTECTION:
- Automated backup systems with local and cloud storage
- Disaster recovery planning and testing
- Data encryption for transmission and storage
- Access controls and user authentication
- Compliance with PIPEDA and industry regulations

IT INFRASTRUCTURE:
- Network design and implementation
- Server management and virtualization
- Cloud migration and hybrid solutions
- VPN setup for secure remote access
- Equipment procurement and lifecycle management

EMPLOYEE TRAINING:
- Cybersecurity awareness programs
- Phishing simulation and education
- Password security best practices
- Incident reporting procedures
- Social engineering recognition training

COMPLIANCE & MONITORING:
- 24/7 network monitoring and threat detection
- Regular vulnerability assessments and penetration testing
- Compliance reporting and documentation
- Incident response and forensic analysis
- Business continuity planning

SUPPORT SERVICES:
- Remote and on-site technical support
- Help desk services and ticket management
- Proactive maintenance and system optimization
- Emergency response for critical issues
- Technology consulting and strategic planning

Focus on protecting digital assets, ensuring business continuity, and maintaining compliance while enabling productivity and growth.`
};

// Conversation Context Management
interface ConversationContext {
  userId: string;
  sessionId: string;
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
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

      // Determine the appropriate system prompt
      const systemPrompt = this.getSystemPrompt(message, context?.serviceType);

      // Add context-aware information to the prompt
      const enhancedPrompt = this.enhancePromptWithContext(systemPrompt, conversation, message);

      // Prepare messages for OpenAI
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: enhancedPrompt },
        ...conversation.messages.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      // Call OpenAI GPT-4
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again or contact our team directly.';

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
        response: 'I apologize, but I\'m experiencing technical difficulties. Please contact our team directly at admin@stigg.ca, call 1-587-644-4644, or text/call 780-215-2887 for immediate assistance.',
        requiresHuman: true
      };
    }
  }

  private getSystemPrompt(message: string, serviceType?: string): string {
    // Analyze message to determine the most appropriate expert prompt
    const messageLower = message.toLowerCase();

    if (serviceType) {
      switch (serviceType) {
        case 'security-guards':
          return SYSTEM_PROMPTS.securityGuards;
        case 'surveillance':
          return SYSTEM_PROMPTS.surveillance;
        case 'virtual-guard':
          return SYSTEM_PROMPTS.virtualGuard;
        case 'it-support':
          return SYSTEM_PROMPTS.itSupport;
      }
    }

    // Auto-detect service type from message content
    if (messageLower.includes('guard') || messageLower.includes('officer') || messageLower.includes('patrol')) {
      return SYSTEM_PROMPTS.securityGuards;
    }
    if (messageLower.includes('camera') || messageLower.includes('surveillance') || messageLower.includes('alarm')) {
      return SYSTEM_PROMPTS.surveillance;
    }
    if (messageLower.includes('virtual') || messageLower.includes('ai') || messageLower.includes('remote')) {
      return SYSTEM_PROMPTS.virtualGuard;
    }
    if (messageLower.includes('cyber') || messageLower.includes('it') || messageLower.includes('network')) {
      return SYSTEM_PROMPTS.itSupport;
    }

    return SYSTEM_PROMPTS.general;
  }

  private enhancePromptWithContext(
    basePrompt: string,
    conversation: ConversationContext,
    currentMessage: string
  ): string {
    let enhancedPrompt = basePrompt;

    // Add user profile context
    if (conversation.userProfile) {
      enhancedPrompt += `\n\nUSER CONTEXT:`;
      if (conversation.userProfile.industry) {
        enhancedPrompt += `\n- Industry: ${conversation.userProfile.industry}`;
      }
      if (conversation.userProfile.companySize) {
        enhancedPrompt += `\n- Company Size: ${conversation.userProfile.companySize}`;
      }
      if (conversation.userProfile.securityConcerns) {
        enhancedPrompt += `\n- Security Concerns: ${conversation.userProfile.securityConcerns.join(', ')}`;
      }
    }

    // Add conversation history context
    if (conversation.messages.length > 0) {
      enhancedPrompt += `\n\nCONVERSATION CONTEXT: This is an ongoing conversation. Previous topics discussed include security needs assessment and service recommendations.`;
    }

    // Add current message analysis
    enhancedPrompt += `\n\nCURRENT MESSAGE ANALYSIS: The user is asking about "${currentMessage}". Provide a helpful, specific response that addresses their needs while positioning Stigg Security as the ideal solution.`;

    enhancedPrompt += `\n\nIMPORTANT: Always end responses with a clear call-to-action, such as offering a free consultation, security assessment, or connecting with a specialist. Include contact information when appropriate.`;

    return enhancedPrompt;
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