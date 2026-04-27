import { useState } from 'react';

interface QuoteSubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  propertyType: string;
  securityConcerns?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

interface AutomationResponse {
  success: boolean;
  ticketId?: string;
  priority?: 'HIGH' | 'NORMAL' | 'EMERGENCY';
  estimatedResponse?: string;
  error?: string;
}

export const useQuoteAutomation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<AutomationResponse | null>(null);

  // Calculate lead score for prioritization
  const calculateLeadScore = (data: QuoteSubmissionData): number => {
    let score = 0;
    
    // Timeline urgency scoring
    const timelineScores = {
      'immediate': 50,
      '1-week': 30,
      '1-month': 15,
      'planning': 5
    };
    score += timelineScores[data.timeline as keyof typeof timelineScores] || 0;

    // Budget scoring
    const budgetScores = {
      'over-50k': 40,
      '30k-50k': 30,
      '15k-30k': 20,
      '5k-15k': 10,
      'under-5k': 5
    };
    score += budgetScores[data.budget as keyof typeof budgetScores] || 0;

    // Service type scoring
    const serviceScores = {
      'multiple': 25,
      'security-guards': 20,
      'surveillance': 15,
      'virtual-guard': 15,
      'it-support': 10
    };
    score += serviceScores[data.serviceType as keyof typeof serviceScores] || 0;

    // Emergency keywords in message
    const emergencyKeywords = ['emergency', 'immediate', 'urgent', 'asap', 'break-in', 'theft', 'incident'];
    const messageText = (data.message || '').toLowerCase() + (data.securityConcerns || '').toLowerCase();
    const hasEmergencyKeywords = emergencyKeywords.some(keyword => messageText.includes(keyword));
    if (hasEmergencyKeywords) score += 30;

    // Company name indicates business client
    if (data.company && data.company.trim()) score += 10;

    return Math.min(100, score);
  };

  // Determine priority based on score
  const determinePriority = (score: number): 'HIGH' | 'NORMAL' | 'EMERGENCY' => {
    if (score >= 80) return 'EMERGENCY';
    if (score >= 50) return 'HIGH';
    return 'NORMAL';
  };

  // Generate ticket ID
  const generateTicketId = (email: string): string => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `STG-${date}-${emailPrefix}-${random}`;
  };

  // Submit quote request with automation
  const submitQuoteRequest = async (data: QuoteSubmissionData): Promise<AutomationResponse> => {
    setIsSubmitting(true);

    try {
      // Calculate lead score and priority
      const leadScore = calculateLeadScore(data);
      const priority = determinePriority(leadScore);
      const ticketId = generateTicketId(data.email);

      // Save to database
      const { submitQuoteRequest: saveQuote } = await import('../services/contactService');
      const savedQuote = await saveQuote({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceType: data.serviceType,
        propertyType: data.propertyType,
        securityConcerns: data.securityConcerns,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message
      });

      // Trigger notification Edge Function
      try {
        const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
        const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/quote-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            quoteId: savedQuote.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            serviceType: data.serviceType,
            priority: priority.toLowerCase(),
            slaDeadline: savedQuote.sla_deadline,
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the quote submission if notification fails
      }

      // Prepare automation payload
      const automationPayload = {
        ...data,
        ticketId,
        leadScore,
        priority,
        timestamp: new Date().toISOString(),
        source: 'website_quote_form',
        estimatedResponseTime: priority === 'EMERGENCY' ? '30 minutes' :
                              priority === 'HIGH' ? '1 hour' : '2 hours'
      };

      // In a real implementation, this would be your n8n webhook URL
      // For now, we'll simulate the automation response
      const response = await simulateN8nWebhook(automationPayload);

      setLastResponse(response);
      return response;

    } catch (error) {
      const errorResponse: AutomationResponse = {
        success: false,
        error: 'Failed to process quote request. Please try again or call us directly.'
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate n8n webhook response (replace with actual webhook call)
  const simulateN8nWebhook = async (payload: any): Promise<AutomationResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the payload (in real implementation, this goes to n8n)
    console.log('Quote Automation Triggered:', payload);

    // Simulate successful automation response
    return {
      success: true,
      ticketId: payload.ticketId,
      priority: payload.priority,
      estimatedResponse: payload.estimatedResponseTime
    };
  };

  return {
    submitQuoteRequest,
    isSubmitting,
    lastResponse,
    calculateLeadScore,
    determinePriority
  };
};