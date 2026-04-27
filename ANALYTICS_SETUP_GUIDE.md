# Advanced Analytics Setup Guide

## Overview

Your website now has comprehensive analytics tracking comparable to enterprise-level solutions. This guide will help you complete the setup and integrate third-party services.

## What's Already Tracking

### ✅ Automatic Tracking (Active Now)
- **Page Views**: Every page visit with referrer, UTM params
- **Geographic Data**: Country, region, city (via IP geolocation)
- **Device & Browser**: Mobile/desktop/tablet detection
- **User Sessions**: Unique visitors, session duration
- **Click Tracking**: Every click with coordinates (for heatmaps)
- **Scroll Depth**: How far users scroll on each page
- **Form Interactions**: View, start, submit, success/error
- **Exit Pages**: Where users leave your site
- **Session Recording**: Lightweight event tracking
- **Conversions**: Quote and contact submissions

### 📊 Advanced Metrics Available
- Bounce rate
- Average session duration
- Engagement distribution (high/medium/low)
- Most clicked elements
- Traffic sources
- Form conversion funnels
- A/B testing support
- Cohort tracking

## Dashboards Available

### 1. Basic Analytics Dashboard
**URL**: `/analytics`

Shows:
- Total page views
- Unique visitors
- Conversion rate
- Top pages
- Traffic sources
- Form funnels
- Device breakdown
- Recent conversions

### 2. Advanced Analytics Dashboard
**URL**: `/analytics/advanced`

Shows:
- Session duration metrics
- Bounce rate
- Scroll depth
- Geographic heatmap data
- Engagement distribution
- Exit pages
- Top clicked elements
- Heatmap viewer
- Session replay viewer

## Third-Party Integration Setup

### 1. Google Analytics 4 (GA4)

**Current Status**: Placeholder installed

**To Complete Setup**:

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property for stigg.ca
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Replace placeholder in `index.html` line 121 & 126:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA4-ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'YOUR-GA4-ID');
   </script>
   ```

**Benefits**:
- Industry-standard analytics
- Integration with Google Ads
- Audience insights
- Custom reports

---

### 2. Google Search Console

**Setup Steps**:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add stigg.ca as a property
3. Verify ownership (use HTML tag method)
4. Add verification meta tag to `index.html`:
   ```html
   <meta name="google-site-verification" content="YOUR-VERIFICATION-CODE" />
   ```

**Benefits**:
- See search queries driving traffic
- Identify SEO opportunities
- Monitor search rankings
- Fix indexing issues

---

### 3. Facebook Pixel

**Setup Steps**:

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new Pixel
3. Get your Pixel ID
4. Add to `index.html` in `<head>`:
   ```html
   <!-- Facebook Pixel Code -->
   <script>
     !function(f,b,e,v,n,t,s)
     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
     n.queue=[];t=b.createElement(e);t.async=!0;
     t.src=v;s=b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t,s)}(window, document,'script',
     'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', 'YOUR-PIXEL-ID');
     fbq('track', 'PageView');
   </script>
   <noscript>
     <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=YOUR-PIXEL-ID&ev=PageView&noscript=1"/>
   </noscript>
   ```

5. Track custom events by updating `src/services/analyticsService.ts`:
   ```typescript
   // Add to trackConversion function
   if (typeof window.fbq === 'function') {
     window.fbq('track', 'Lead');
   }
   ```

**Benefits**:
- Track Facebook ad performance
- Create retargeting audiences
- Optimize ad delivery
- Measure ROI

---

### 4. Hotjar (Heatmaps & Session Recording)

**Note**: You already have custom heatmap and session recording built-in! But Hotjar offers more advanced features.

**Setup Steps**:

1. Sign up at [Hotjar](https://www.hotjar.com)
2. Create a new site
3. Get your Hotjar ID
4. Add tracking code to `index.html`:
   ```html
   <!-- Hotjar Tracking Code -->
   <script>
     (function(h,o,t,j,a,r){
       h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
       h._hjSettings={hjid:YOUR-HOTJAR-ID,hjsv:6};
       a=o.getElementsByTagName('head')[0];
       r=o.createElement('script');r.async=1;
       r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
       a.appendChild(r);
     })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
   </script>
   ```

**Benefits**:
- Advanced heatmaps
- Session recordings with video
- User feedback polls
- Conversion funnels

---

### 5. Microsoft Clarity (Free Alternative)

**Setup Steps**:

1. Sign up at [Microsoft Clarity](https://clarity.microsoft.com)
2. Create a project
3. Get your Clarity ID
4. Add to `index.html`:
   ```html
   <script type="text/javascript">
     (function(c,l,a,r,i,t,y){
       c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
       t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
       y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
     })(window, document, "clarity", "script", "YOUR-CLARITY-ID");
   </script>
   ```

**Benefits**:
- FREE session recordings
- FREE heatmaps
- Rage clicks detection
- Dead clicks detection

---

### 6. LinkedIn Insight Tag

**Setup Steps**:

1. Go to [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager)
2. Generate Insight Tag
3. Add to `index.html`:
   ```html
   <script type="text/javascript">
   _linkedin_partner_id = "YOUR-PARTNER-ID";
   window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
   window._linkedin_data_partner_ids.push(_linkedin_partner_id);
   </script><script type="text/javascript">
   (function(l) {
   if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
   window.lintrk.q=[]}
   var s = document.getElementsByTagName("script")[0];
   var b = document.createElement("script");
   b.type = "text/javascript";b.async = true;
   b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
   s.parentNode.insertBefore(b, s);})(window.lintrk);
   </script>
   <noscript>
   <img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=YOUR-PARTNER-ID&fmt=gif" />
   </noscript>
   ```

**Benefits**:
- Track LinkedIn ad performance
- B2B audience insights
- Professional demographic data

---

## IP Geolocation API

**Current**: Using ipapi.co (1,000 requests/day free)

**To increase limits**, consider:

1. **ipapi.co Pro** ($10/mo for 30,000 req/mo)
2. **IPGeolocation.io** ($15/mo for 50,000 req/mo)
3. **MaxMind GeoIP2** (Self-hosted, unlimited)

Update in `src/services/advancedAnalytics.ts`:
```typescript
// Change this line:
const response = await fetch('https://ipapi.co/json/');

// To your chosen provider:
const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=YOUR-KEY');
```

---

## Data Privacy & GDPR Compliance

### Required Actions:

1. **Update Privacy Policy**: Disclose all tracking
2. **Cookie Consent**: Add cookie banner
3. **Data Retention**: Set up automatic data deletion after 90 days
4. **User Rights**: Provide data export/deletion functionality

### Recommended Cookie Consent Solutions:

- **Cookiebot** (Free for small sites)
- **OneTrust**
- **Termly**

---

## Performance Monitoring

Consider adding:

1. **Sentry** - Error tracking
2. **LogRocket** - Bug reproduction
3. **New Relic** - Performance monitoring

---

## A/B Testing Setup

Built-in A/B testing is ready. Use it like this:

```typescript
import { initializeABTest, trackABTestConversion } from './services/advancedAnalytics';

// In your component
useEffect(() => {
  const variant = await initializeABTest('cta_button_test', ['blue', 'red', 'green']);
  setButtonColor(variant);
}, []);

// When user converts
const handleSubmit = async () => {
  await trackABTestConversion('cta_button_test');
  // ... rest of form submission
};
```

---

## Accessing Your Data

### Via Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to Table Editor
3. Query tables:
   - `page_views`
   - `analytics_sessions`
   - `click_events`
   - `scroll_events`
   - `conversion_events`
   - `geographic_data`
   - `form_events`
   - `exit_pages`
   - `session_recordings`
   - `ab_tests`
   - `cohorts`

### Via SQL:
```sql
-- Top performing pages
SELECT page_path, COUNT(*) as views
FROM page_views
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY page_path
ORDER BY views DESC
LIMIT 10;

-- Conversion rate by source
SELECT
  utm_source,
  COUNT(*) as sessions,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) as conversion_rate
FROM analytics_sessions
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY utm_source
ORDER BY conversion_rate DESC;
```

---

## Next Steps

1. ✅ Replace Google Analytics placeholder with real ID
2. ✅ Set up Google Search Console
3. ✅ Add Facebook Pixel if running Facebook ads
4. ✅ Consider Microsoft Clarity (FREE)
5. ✅ Review and update Privacy Policy
6. ✅ Add cookie consent banner
7. ✅ Monitor `/analytics` and `/analytics/advanced` dashboards daily

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **GA4 Setup Guide**: https://support.google.com/analytics/answer/9304153
- **Search Console Help**: https://support.google.com/webmasters
- **Facebook Pixel Guide**: https://www.facebook.com/business/help/952192354843755

---

## Troubleshooting

### No geographic data showing?
- Check browser console for errors
- Verify ipapi.co API is responding
- May need to wait for first visitor after deployment

### Heatmap not showing clicks?
- Ensure users are clicking (check click_events table)
- Try different page paths
- Verify date range includes recent data

### Session recordings empty?
- Recordings are saved every 30 seconds
- Check session_recordings table
- May need multiple page interactions to record

---

## Questions?

All analytics code is in:
- `src/services/analyticsService.ts` - Basic tracking
- `src/services/advancedAnalytics.ts` - Advanced features
- `src/pages/Analytics.tsx` - Basic dashboard
- `src/pages/AdvancedAnalytics.tsx` - Advanced dashboard
