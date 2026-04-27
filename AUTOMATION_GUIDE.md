# Complete Automation Guide

## Overview
This guide covers all three automation systems implemented:
1. **2-Hour Quote Response System** - Automated SLA tracking and notifications
2. **Newsletter Management** - Automated creation and distribution
3. **Lead Management** - Real-time qualified lead tracking

---

## 1. Quote Response Automation (2-Hour SLA)

### How It Works

#### Automatic SLA Deadline Setting
When a quote request is submitted:
1. Quote saved to database with automatic SLA deadline (created_at + 2 hours)
2. Priority calculated based on timeline, budget, and urgency keywords
3. Real-time notification sent to operations team
4. SLA timer starts tracking automatically

#### Notification Flow
```
Quote Submitted
    ↓
Priority Calculated (urgent/high/medium/low)
    ↓
Edge Function: quote-notification
    ↓
Email to admin@stigg.ca
    ↓
SMS for high/urgent priorities (to 587-210-2167)
    ↓
Notification logged in database
```

#### SLA Monitoring
- **SLA Monitor Edge Function** checks every 30 minutes
- Escalation alerts at:
  - 30 minutes before deadline
  - At deadline
  - Every hour after deadline
- Tracks SLA compliance metrics

### Access the Dashboard

**Operations Dashboard:** `/operations`

Features:
- Real-time quote tracking
- Visual SLA countdown timers
- Overdue alert banner
- One-click email/call actions
- Mark as responded button
- Priority-based sorting

### Manual Actions

#### Responding to Quotes
1. Go to `/operations`
2. Find the quote (sorted by urgency)
3. Click "Send Quote" button (opens email)
4. After sending, click "Mark Responded"
5. System automatically:
   - Records response time
   - Calculates if SLA was met
   - Updates dashboard

#### Monitoring SLA Compliance
```sql
-- View SLA performance
SELECT
  status,
  sla_met,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (response_sent_at - created_at)) / 60) as avg_response_minutes
FROM quote_requests
WHERE response_sent_at IS NOT NULL
GROUP BY status, sla_met;
```

### API Endpoints

#### Quote Notification (Auto-triggered)
```
POST https://[your-project].supabase.co/functions/v1/quote-notification
Headers: {
  Content-Type: application/json,
  Authorization: Bearer [anon-key]
}
Body: {
  quoteId: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "555-1234",
  serviceType: "security-guards",
  priority: "high",
  slaDeadline: "2025-10-17T22:00:00Z"
}
```

#### SLA Monitor (Scheduled/Manual)
```
POST https://[your-project].supabase.co/functions/v1/sla-monitor
Headers: {
  Content-Type: application/json,
  Authorization: Bearer [anon-key]
}

Returns: {
  overdueCount: 2,
  escalationsSent: 2,
  upcomingDeadlines: 3,
  overdueQuotes: [...],
  upcomingQuotes: [...]
}
```

### Setting Up Scheduled Monitoring

#### Option 1: Cron Job (Recommended)
Set up a cron job to call the SLA monitor every 15 minutes:

```bash
# Add to crontab
*/15 * * * * curl -X POST \
  https://[your-project].supabase.co/functions/v1/sla-monitor \
  -H "Authorization: Bearer [your-anon-key]"
```

#### Option 2: GitHub Actions
```yaml
name: SLA Monitor
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes

jobs:
  check-sla:
    runs-on: ubuntu-latest
    steps:
      - name: Check SLA
        run: |
          curl -X POST \
            ${{ secrets.SUPABASE_URL }}/functions/v1/sla-monitor \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

#### Option 3: Supabase Cron (If available)
Check if your Supabase plan supports pg_cron for database-level scheduling.

---

## 2. Newsletter Automation

### How It Works

#### Creating Campaigns
1. Access `/newsletter-manager`
2. Click "New Campaign"
3. Fill in:
   - Campaign Title (internal reference)
   - Email Subject (what subscribers see)
   - Content (email body)
   - Schedule (optional - send now or later)

#### Distribution Process
```
Campaign Created
    ↓
Status: draft or scheduled
    ↓
Click "Send Now" or wait for schedule
    ↓
Edge Function: newsletter-sender
    ↓
Fetch all active subscribers
    ↓
Create email notification for each
    ↓
Update campaign status to 'sent'
    ↓
Track opens & clicks (future integration)
```

### Newsletter Manager Dashboard

**Access:** `/newsletter-manager`

Features:
- Campaign creation wizard
- Subscriber count tracking
- Open/click rate metrics
- Send now or schedule
- Campaign history
- Draft management

### Subscriber Management

#### View All Subscribers
```sql
SELECT
  email,
  name,
  interests,
  status,
  subscribed_at,
  last_sent_at
FROM newsletter_subscribers
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

#### Segment by Interest
```sql
SELECT
  email,
  interests
FROM newsletter_subscribers
WHERE status = 'active'
  AND 'security-guards' = ANY(interests);
```

### API Endpoints

#### Send Newsletter
```
POST https://[your-project].supabase.co/functions/v1/newsletter-sender
Headers: {
  Content-Type: application/json,
  Authorization: Bearer [anon-key]
}
Body: {
  campaignId: "uuid-of-campaign"
}

Returns: {
  success: true,
  campaignId: "uuid",
  recipientCount: 145,
  message: "Newsletter sent successfully"
}
```

### Best Practices

1. **Frequency:** Weekly or bi-weekly to avoid unsubscribes
2. **Content:** Mix of education + value + soft promotion
3. **Timing:** Tuesday-Thursday, 10am-2pm best open rates
4. **Segmentation:** Use interest tags for targeted content
5. **Testing:** Always review preview before sending

### Content Templates

#### Monthly Security Newsletter
```
Subject: Your Monthly Security Update - [Month]

Hi [Name],

Here's what's new in security this month:

🔒 Security Tip: [Practical advice]
📰 Industry News: [Relevant update]
💡 Case Study: [Client success story]
🎁 Special Offer: [Optional promotion]

Stay safe,
Stigg Security Team

[Unsubscribe Link]
```

---

## 3. Lead Management System

### How It Works

#### Automatic Lead Scoring
Leads are scored (0-100) based on:
- **Behavioral signals** (40 points)
  - Time on site
  - Pages visited
  - High-intent pages (/quote, /services)
  - Form submissions
- **Demographics** (30 points)
  - Company size
  - Decision maker role
  - Budget indication
- **Engagement** (20 points)
  - Email opens/clicks
  - Chat interactions
  - Return visits
- **Intent** (10 points)
  - Service interests
  - Timeline urgency

#### Priority Classification
- **Hot (70-100):** Immediate follow-up required
- **Warm (40-69):** Follow-up within 24 hours
- **Cold (0-39):** Nurture campaign

### Operations Dashboard

**Access:** `/operations` → Hot Leads Tab

Features:
- Real-time hot lead list (score 70+)
- Lead score badges
- One-click contact actions
- Interest tags
- Last activity timestamp
- Stage tracking

### Lead Sources

Leads are captured from:
1. **Contact Form** → Medium priority
2. **Quote Request** → High priority (scored)
3. **Newsletter Signup** → Low-medium priority
4. **AI Chatbot** → Scored based on conversation
5. **Lead Capture Widget** → Behavioral triggers

### Quick Actions

#### Get All Hot Leads
```sql
SELECT * FROM get_hot_leads();
```

#### Manual Lead Assignment
```sql
UPDATE leads
SET assigned_to = 'john@stigg.ca',
    stage = 'consideration'
WHERE id = '[lead-id]';
```

#### Lead Activity Log
```sql
SELECT
  email,
  score,
  priority,
  last_activity,
  interests,
  touchpoints
FROM leads
WHERE priority = 'hot'
ORDER BY score DESC, last_activity DESC;
```

### Integration Points

#### CRM Sync
Export leads to your CRM:
```sql
-- Export hot leads for CRM import
SELECT
  email,
  name,
  company,
  phone,
  score as lead_score,
  priority,
  stage,
  array_to_string(interests, ', ') as interests,
  last_activity,
  created_at
FROM leads
WHERE priority = 'hot'
  AND stage != 'customer'
  AND created_at > NOW() - INTERVAL '7 days';
```

#### Automation Triggers
Set up automated actions based on lead score:
- Score > 80: Immediate SMS + email to sales
- Score 70-80: Email to sales within 1 hour
- Score 40-69: Add to nurture campaign
- Score < 40: Newsletter only

---

## Email Integration

### Connecting Email Service

#### Option 1: SendGrid
1. Sign up for SendGrid
2. Get API key
3. Update Edge Functions to use SendGrid API
4. Replace console.log with actual send

```typescript
// In Edge Function
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

await sgMail.send({
  to: recipient,
  from: 'admin@stigg.ca',
  subject: subject,
  text: message,
  html: htmlContent
});
```

#### Option 2: Resend (Recommended)
```typescript
import { Resend } from 'npm:resend@1.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

await resend.emails.send({
  from: 'admin@stigg.ca',
  to: recipient,
  subject: subject,
  html: message
});
```

### SMS Integration

#### Twilio Setup
```typescript
import twilio from 'npm:twilio@4.0.0';

const client = twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

await client.messages.create({
  body: message,
  from: '+15871234567', // Your Twilio number
  to: '+15872102167'    // Operations number
});
```

---

## Monitoring & Analytics

### Key Metrics Dashboard

#### Quote Response Performance
```sql
-- Overall SLA compliance
SELECT
  COUNT(*) FILTER (WHERE sla_met = true) * 100.0 / COUNT(*) as sla_compliance_rate,
  AVG(EXTRACT(EPOCH FROM (response_sent_at - created_at)) / 60) as avg_response_minutes,
  COUNT(*) FILTER (WHERE response_sent_at IS NULL AND sla_deadline < NOW()) as currently_overdue
FROM quote_requests
WHERE created_at > NOW() - INTERVAL '30 days';
```

#### Newsletter Performance
```sql
-- Campaign effectiveness
SELECT
  title,
  recipient_count,
  open_count,
  click_count,
  (open_count * 100.0 / NULLIF(recipient_count, 0)) as open_rate,
  (click_count * 100.0 / NULLIF(open_count, 0)) as click_through_rate
FROM newsletter_campaigns
WHERE status = 'sent'
ORDER BY sent_at DESC;
```

#### Lead Conversion Funnel
```sql
-- Lead conversion rates by priority
SELECT
  priority,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE stage = 'customer') as converted,
  (COUNT(*) FILTER (WHERE stage = 'customer') * 100.0 / COUNT(*)) as conversion_rate
FROM leads
GROUP BY priority
ORDER BY
  CASE priority
    WHEN 'hot' THEN 1
    WHEN 'warm' THEN 2
    ELSE 3
  END;
```

---

## Troubleshooting

### Quote Notifications Not Sending

1. Check Edge Function logs:
```bash
# View function logs in Supabase Dashboard
# Project → Edge Functions → quote-notification → Logs
```

2. Verify database trigger:
```sql
-- Check if SLA deadline is being set
SELECT id, created_at, sla_deadline
FROM quote_requests
ORDER BY created_at DESC
LIMIT 5;
```

3. Test notification manually:
```bash
curl -X POST https://[project].supabase.co/functions/v1/quote-notification \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"quoteId":"test-id","firstName":"Test",...}'
```

### Newsletter Not Sending

1. Check campaign status:
```sql
SELECT id, title, status, scheduled_for
FROM newsletter_campaigns
WHERE status != 'sent';
```

2. Verify subscribers:
```sql
SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active';
```

3. Check Edge Function response:
```bash
curl -X POST https://[project].supabase.co/functions/v1/newsletter-sender \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"[campaign-id]"}'
```

### Leads Not Appearing

1. Check lead creation:
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;
```

2. Verify hot lead function:
```sql
SELECT * FROM get_hot_leads();
```

3. Check scoring logic in `contactService.saveLead()`

---

## Security Considerations

### Row Level Security
All tables have RLS enabled:
- Public can INSERT (submit forms)
- Only authenticated users can SELECT/UPDATE
- Prevents unauthorized data access

### API Key Security
- Never expose service role key in frontend
- Use anon key for public operations
- Edge Functions have automatic access to service role

### Data Privacy
- Newsletter unsubscribe required by law
- Store minimal PII
- Regular data cleanup recommended

---

## Next Steps

### Immediate Actions
1. ✅ Test quote submission → check `/operations` for new quote
2. ✅ Create test newsletter campaign → send to yourself
3. ✅ Submit contact form → verify lead creation
4. ✅ Set up cron job for SLA monitoring
5. ⚠️ Connect email service (SendGrid or Resend)
6. ⚠️ Connect SMS service (Twilio)

### Future Enhancements
- [ ] Email template builder
- [ ] SMS alerts for hot leads
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] WhatsApp notifications
- [ ] Mobile app for operations team
- [ ] Automated lead assignment based on availability
- [ ] A/B testing for newsletters
- [ ] Advanced analytics dashboard

---

## Support & Access

### Dashboard URLs
- **Operations Dashboard:** `https://[your-domain]/operations`
- **Newsletter Manager:** `https://[your-domain]/newsletter-manager`
- **Blog Admin:** `https://[your-domain]/blog-admin`
- **Automation Dashboard:** `https://[your-domain]/automation-dashboard`

### Database Access
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[your-project-id]
- **SQL Editor:** Available in Supabase Dashboard
- **Table Editor:** Visual interface for data management

### Edge Functions
- **quote-notification:** Quote SLA tracking
- **sla-monitor:** Overdue monitoring
- **newsletter-sender:** Email distribution

All functions deployed and ready to use!
