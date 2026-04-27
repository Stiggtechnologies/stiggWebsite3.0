import { supabase } from '../lib/supabase';

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Get device type
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Get browser name
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  return 'Unknown';
}

// Parse UTM parameters from URL
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}

// Track page view
export async function trackPageView(path: string, title: string) {
  try {
    const sessionId = getSessionId();
    const utmParams = getUTMParams();

    const { error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        page_path: path,
        page_title: title,
        referrer: document.referrer || null,
        device_type: getDeviceType(),
        browser: getBrowser(),
        ...utmParams,
      });

    if (pageViewError) {
      console.error('Error tracking page view:', pageViewError);
      return;
    }

    // Update or create session
    const { data: existingSession } = await supabase
      .from('analytics_sessions')
      .select('id, page_views')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existingSession) {
      await supabase
        .from('analytics_sessions')
        .update({
          last_visit: new Date().toISOString(),
          page_views: existingSession.page_views + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);
    } else {
      await supabase
        .from('analytics_sessions')
        .insert({
          session_id: sessionId,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          page_views: 1,
          referrer: document.referrer || null,
          device_type: getDeviceType(),
          ...utmParams,
        });
    }

    // Send to Google Analytics if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  } catch (error) {
    console.error('Error in trackPageView:', error);
  }
}

// Track form event
export async function trackFormEvent(
  formType: 'quote' | 'contact' | 'newsletter',
  eventType: 'view' | 'start' | 'submit' | 'success' | 'error',
  metadata?: {
    field_name?: string;
    error_message?: string;
    [key: string]: any;
  }
) {
  try {
    const sessionId = getSessionId();

    await supabase
      .from('form_events')
      .insert({
        session_id: sessionId,
        form_type: formType,
        event_type: eventType,
        page_path: window.location.pathname,
        field_name: metadata?.field_name || null,
        error_message: metadata?.error_message || null,
        metadata: metadata || {},
      });

    // Send to Google Analytics if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', `form_${eventType}`, {
        form_type: formType,
        event_category: 'form_interaction',
      });
    }
  } catch (error) {
    console.error('Error tracking form event:', error);
  }
}

// Track conversion event
export async function trackConversion(
  eventName: string,
  eventCategory: string = 'conversion',
  eventValue?: number,
  metadata?: Record<string, any>
) {
  try {
    const sessionId = getSessionId();

    await supabase
      .from('conversion_events')
      .insert({
        session_id: sessionId,
        event_name: eventName,
        event_category: eventCategory,
        event_value: eventValue || null,
        page_path: window.location.pathname,
        metadata: metadata || {},
      });

    // Update session conversion status
    await supabase
      .from('analytics_sessions')
      .update({
        converted: true,
        conversion_type: eventName,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    // Send to Google Analytics if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        value: eventValue,
      });
    }
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}

// Track custom event
export async function trackEvent(
  eventName: string,
  eventCategory: string,
  eventValue?: number,
  metadata?: Record<string, any>
) {
  try {
    await supabase
      .from('conversion_events')
      .insert({
        session_id: getSessionId(),
        event_name: eventName,
        event_category: eventCategory,
        event_value: eventValue || null,
        page_path: window.location.pathname,
        metadata: metadata || {},
      });

    // Send to Google Analytics if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        value: eventValue,
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Initialize analytics
export function initializeAnalytics() {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);

  // Track page visibility changes (to calculate time on page)
  let startTime = Date.now();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // Could update page_views with duration here if needed
    } else {
      startTime = Date.now();
    }
  });
}

// Type declarations for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
