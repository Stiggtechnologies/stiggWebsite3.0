import { supabase } from '../lib/supabase';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Geographic tracking using IP Geolocation API
export async function trackGeographicData() {
  try {
    if (!supabase) return;

    const sessionId = getSessionId();

    // Check if already tracked for this session
    const { data: existing } = await supabase
      .from('geographic_data')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existing) return;

    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    const geoData = await response.json();

    if (geoData.error) {
      console.warn('Geolocation error:', geoData.reason);
      return;
    }

    await supabase
      .from('geographic_data')
      .insert({
        session_id: sessionId,
        ip_address: geoData.ip ? hashIP(geoData.ip) : null,
        country: geoData.country_name,
        country_code: geoData.country_code,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
      });
  } catch (error) {
    console.error('Error tracking geographic data:', error);
  }
}

// Simple hash function for IP privacy
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Click tracking with heatmap data
export function initializeClickTracking() {
  document.addEventListener('click', async (event) => {
    try {
      if (!supabase) return;

      const target = event.target as HTMLElement;
      const sessionId = getSessionId();

      // Get element selector
      const selector = getElementSelector(target);
      const elementText = target.innerText?.substring(0, 100) || target.getAttribute('aria-label') || '';

      await supabase
        .from('click_events')
        .insert({
          session_id: sessionId,
          page_path: window.location.pathname,
          element_selector: selector,
          element_text: elementText,
          x_position: event.clientX,
          y_position: event.clientY,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        });

      // Update session clicks
      const { data: session } = await supabase
        .from('analytics_sessions')
        .select('total_clicks')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (session) {
        await supabase
          .from('analytics_sessions')
          .update({
            total_clicks: (session.total_clicks || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('session_id', sessionId);
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  });
}

// Get CSS selector for element
function getElementSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.className) {
      const classes = current.className.split(' ').filter(c => c).slice(0, 2);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

// Scroll depth tracking
export function initializeScrollTracking() {
  if (!supabase) return;

  let maxScrollDepth = 0;
  let scrollStartTime = Date.now();
  let scrollTimeout: NodeJS.Timeout;

  const trackScroll = async () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const scrollDepth = Math.min(
      Math.round(((scrollTop + windowHeight) / documentHeight) * 100),
      100
    );

    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(async () => {
        try {
          const sessionId = getSessionId();
          const timeToScroll = Math.floor((Date.now() - scrollStartTime) / 1000);

          await supabase
            .from('scroll_events')
            .insert({
              session_id: sessionId,
              page_path: window.location.pathname,
              max_scroll_depth: maxScrollDepth,
              page_height: documentHeight,
              viewport_height: windowHeight,
              time_to_scroll: timeToScroll,
            });

          // Update session avg scroll depth
          const { data: scrolls } = await supabase
            .from('scroll_events')
            .select('max_scroll_depth')
            .eq('session_id', sessionId);

          if (scrolls && scrolls.length > 0) {
            const avgDepth = Math.round(
              scrolls.reduce((sum, s) => sum + s.max_scroll_depth, 0) / scrolls.length
            );

            await supabase
              .from('analytics_sessions')
              .update({
                avg_scroll_depth: avgDepth,
                updated_at: new Date().toISOString(),
              })
              .eq('session_id', sessionId);
          }
        } catch (error) {
          console.error('Error tracking scroll:', error);
        }
      }, 1000);
    }
  };

  window.addEventListener('scroll', trackScroll, { passive: true });

  // Track initial scroll position
  trackScroll();
}

// Session recording (lightweight event tracking)
let recordingEvents: any[] = [];
let recordingStartTime = Date.now();

export function initializeSessionRecording() {
  const events = [
    'click',
    'input',
    'change',
    'submit',
    'scroll',
    'mousemove',
    'keydown'
  ];

  let mouseMoveTimeout: NodeJS.Timeout;

  events.forEach(eventType => {
    document.addEventListener(eventType, (event) => {
      // Throttle mousemove events
      if (eventType === 'mousemove') {
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
          recordEvent(eventType, event);
        }, 100);
      } else {
        recordEvent(eventType, event);
      }
    }, { passive: true });
  });

  // Save recording periodically
  setInterval(saveRecording, 30000); // Every 30 seconds

  // Save on page unload
  window.addEventListener('beforeunload', saveRecording);
}

function recordEvent(type: string, event: Event) {
  const target = event.target as HTMLElement;

  // Don't record sensitive data
  if (target && (target.type === 'password' || target.classList.contains('sensitive'))) {
    return;
  }

  const eventData: any = {
    type,
    timestamp: Date.now() - recordingStartTime,
    path: window.location.pathname,
  };

  if (type === 'click' || type === 'mousemove') {
    const mouseEvent = event as MouseEvent;
    eventData.x = mouseEvent.clientX;
    eventData.y = mouseEvent.clientY;
  }

  if (type === 'input' || type === 'change') {
    const inputElement = target as HTMLInputElement;
    // Only record non-sensitive field names
    if (inputElement.name && !inputElement.name.includes('password')) {
      eventData.field = inputElement.name;
      eventData.value = inputElement.value.substring(0, 50); // Truncate for privacy
    }
  }

  if (type === 'scroll') {
    eventData.scrollY = window.scrollY;
  }

  recordingEvents.push(eventData);

  // Limit recording size
  if (recordingEvents.length > 1000) {
    saveRecording();
  }
}

async function saveRecording() {
  if (recordingEvents.length === 0 || !supabase) return;

  try {
    const sessionId = getSessionId();
    const duration = Math.floor((Date.now() - recordingStartTime) / 1000);

    await supabase
      .from('session_recordings')
      .insert({
        session_id: sessionId,
        page_path: window.location.pathname,
        events: recordingEvents,
        duration,
      });

    recordingEvents = [];
    recordingStartTime = Date.now();
  } catch (error) {
    console.error('Error saving recording:', error);
  }
}

// Track exit page and session end
export function initializeExitTracking() {
  if (!supabase) return;

  let pageStartTime = Date.now();
  let sessionStartTime = Date.now();
  let pagesVisited = 0;

  // Track page changes
  const trackPageChange = () => {
    pagesVisited++;
    pageStartTime = Date.now();
  };

  window.addEventListener('popstate', trackPageChange);

  // Track exit
  window.addEventListener('beforeunload', async () => {
    try {
      const sessionId = getSessionId();
      const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
      const totalDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

      // Use sendBeacon for reliable sending on page unload
      const exitData = {
        session_id: sessionId,
        exit_page: window.location.pathname,
        time_on_page: timeOnPage,
        total_session_duration: totalDuration,
        pages_visited: pagesVisited,
      };

      await supabase.from('exit_pages').insert(exitData);

      // Update session
      await supabase
        .from('analytics_sessions')
        .update({
          exit_page: window.location.pathname,
          session_duration: totalDuration,
          bounce: pagesVisited <= 1,
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error tracking exit:', error);
    }
  });
}

// A/B Testing
export async function initializeABTest(testName: string, variants: string[]) {
  try {
    if (!supabase) return variants[0];

    const sessionId = getSessionId();

    // Check if session already has variant
    const { data: existing } = await supabase
      .from('ab_tests')
      .select('variant_name')
      .eq('test_name', testName)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existing) {
      return existing.variant_name;
    }

    // Assign random variant
    const variant = variants[Math.floor(Math.random() * variants.length)];

    await supabase
      .from('ab_tests')
      .insert({
        test_name: testName,
        variant_name: variant,
        session_id: sessionId,
        converted: false,
      });

    return variant;
  } catch (error) {
    console.error('Error initializing A/B test:', error);
    return variants[0]; // Return first variant as fallback
  }
}

export async function trackABTestConversion(testName: string) {
  try {
    if (!supabase) return;

    const sessionId = getSessionId();

    await supabase
      .from('ab_tests')
      .update({ converted: true })
      .eq('test_name', testName)
      .eq('session_id', sessionId);
  } catch (error) {
    console.error('Error tracking A/B test conversion:', error);
  }
}

// Cohort tracking
export async function trackCohort(cohortName: string, properties: Record<string, any> = {}) {
  try {
    if (!supabase) return;

    const sessionId = getSessionId();
    const firstVisitDate = new Date().toISOString().split('T')[0];

    await supabase
      .from('cohorts')
      .insert({
        cohort_name: cohortName,
        session_id: sessionId,
        first_visit_date: firstVisitDate,
        properties,
      });
  } catch (error) {
    console.error('Error tracking cohort:', error);
  }
}

// Initialize all advanced tracking
export function initializeAdvancedAnalytics() {
  trackGeographicData();
  initializeClickTracking();
  initializeScrollTracking();
  initializeSessionRecording();
  initializeExitTracking();
}
