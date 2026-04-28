import { supabase } from '../lib/supabase';

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
}

export interface QuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  propertyType?: string;
  securityConcerns?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
}

export async function submitContactForm(data: ContactSubmission) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([{
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      source: data.source || 'contact'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }

  // Send admin notification
  try {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        type: 'contact',
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          source: data.source || 'contact',
        },
      }),
    });
  } catch (notifError) {
    console.error('Error sending admin notification:', notifError);
  }

  return result;
}

export async function submitQuoteRequest(data: QuoteRequest) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: result, error } = await supabase
    .from('quote_requests')
    .insert([{
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      service_type: data.serviceType,
      property_type: data.propertyType || null,
      security_concerns: data.securityConcerns || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      message: data.message || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting quote request:', error);
    throw error;
  }

  // Send admin notification via quote-notification edge function
  try {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        type: 'quote',
        data: {
          quoteId: result.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          serviceType: data.serviceType,
          priority: result.priority,
          slaDeadline: result.sla_deadline,
        },
      }),
    });
  } catch (notifError) {
    console.error('Error sending quote notification:', notifError);
  }

  return result;
}

export async function subscribeToNewsletter(data: NewsletterSubscription) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: result, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email: data.email,
      name: data.name || null,
      interests: data.interests || []
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email is already subscribed to our newsletter.');
    }
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }

  // Send admin notification
  try {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        type: 'newsletter_signup',
        data: {
          email: data.email,
          name: data.name,
          interests: data.interests,
        },
      }),
    });
  } catch (notifError) {
    console.error('Error sending admin notification:', notifError);
  }

  return result;
}

export async function saveLead(leadData: any) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: existingLead } = await supabase
    .from('leads')
    .select('id')
    .eq('email', leadData.email)
    .maybeSingle();

  if (existingLead) {
    const { data: result, error } = await supabase
      .from('leads')
      .update({
        name: leadData.name || null,
        company: leadData.company || null,
        phone: leadData.phone || null,
        source: leadData.source,
        score: leadData.score || 0,
        priority: leadData.priority || 'cold',
        stage: leadData.stage || 'awareness',
        interests: leadData.interests || [],
        behavior: leadData.behavior || {},
        demographics: leadData.demographics || {},
        touchpoints: leadData.touchpoints || [],
        last_activity: new Date().toISOString(),
        assigned_to: leadData.assignedTo || null,
        automation_enabled: leadData.automationEnabled !== false,
        human_override: leadData.humanOverride || false
      })
      .eq('id', existingLead.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }

    return result;
  } else {
    const { data: result, error } = await supabase
      .from('leads')
      .insert([{
        email: leadData.email,
        name: leadData.name || null,
        company: leadData.company || null,
        phone: leadData.phone || null,
        source: leadData.source,
        score: leadData.score || 0,
        priority: leadData.priority || 'cold',
        stage: leadData.stage || 'awareness',
        interests: leadData.interests || [],
        behavior: leadData.behavior || {},
        demographics: leadData.demographics || {},
        touchpoints: leadData.touchpoints || [],
        assigned_to: leadData.assignedTo || null,
        automation_enabled: leadData.automationEnabled !== false,
        human_override: leadData.humanOverride || false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    // Send admin notification for hot leads
    if (result && (result.priority === 'hot' || result.score >= 70)) {
      try {
        const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
        const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            type: 'lead',
            data: {
              email: result.email,
              name: result.name,
              company: result.company,
              phone: result.phone,
              score: result.score,
              priority: result.priority,
              stage: result.stage,
              source: result.source,
              interests: result.interests,
              lastActivity: result.last_activity,
            },
          }),
        });
      } catch (notifError) {
        console.error('Error sending admin notification:', notifError);
      }
    }

    return result;
  }
}

export async function saveChatSession(sessionData: any) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: result, error } = await supabase
    .from('ai_chat_sessions')
    .insert([{
      session_id: sessionData.sessionId,
      user_id: sessionData.userId,
      messages: sessionData.messages || [],
      lead_score: sessionData.leadScore || 0,
      service_type: sessionData.serviceType || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving chat session:', error);
    throw error;
  }

  return result;
}

export async function updateChatSession(sessionId: string, updates: any) {
  if (!supabase) {
    throw new Error('Database is not configured');
  }

  const { data: result, error } = await supabase
    .from('ai_chat_sessions')
    .update({
      messages: updates.messages,
      lead_score: updates.leadScore,
      updated_at: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating chat session:', error);
    throw error;
  }

  return result;
}
