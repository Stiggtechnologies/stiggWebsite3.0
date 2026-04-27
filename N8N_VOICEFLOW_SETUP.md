# Complete n8n + Voiceflow Integration Guide

## 🎯 What This Sets Up

### Email Automation (n8n):
- ✅ Customer confirmation emails
- ✅ Admin notifications for all leads
- ✅ SMS alerts for urgent requests
- ✅ Slack team notifications
- ✅ CRM logging (Google Sheets)
- ✅ Automated follow-ups

### Call Answering (Voiceflow + Twilio):
- ✅ 24/7 AI phone answering
- ✅ Emergency routing
- ✅ Quote collection via phone
- ✅ Call logging to database
- ✅ Automatic notifications

---

## Part 1: n8n Email Automation

### Step 1: Create n8n Account

**Option A: n8n Cloud (Recommended)**
1. Go to https://n8n.io
2. Click "Get Started Free"
3. Sign up (Free tier: 5,000 executions/month)
4. Access your workspace

**Option B: Self-Hosted (Free Forever)**
```bash
# Using Docker
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

# Access at http://localhost:5678
```

---

### Step 2: Import Workflow

1. Download workflow from your project:
   - `/n8n-workflows/01-quote-automation-basic.json`

2. In n8n:
   - Click "Workflows"
   - Click "Import"
   - Upload the JSON file
   - Workflow will appear

---

### Step 3: Configure Email (Choose One)

#### Option A: Gmail (Free, Easy)
1. In n8n, go to "Credentials"
2. Click "Add Credential"
3. Search for "Gmail OAuth2"
4. Click "Connect My Account"
5. Follow Google login prompts
6. Grant permissions

**Update workflow:**
- Find "Send Confirmation Email" node
- Set credential to your Gmail
- Set "From" to your Gmail address

#### Option B: SendGrid (Professional)
1. Sign up at https://sendgrid.com
2. Free tier: 100 emails/day
3. Get API key:
   - Settings → API Keys → Create API Key
   - Full Access
   - Copy key

**Add to n8n:**
- Credentials → Add "SendGrid"
- Paste API key

**Update workflow:**
- Replace Gmail node with HTTP Request node
- Method: POST
- URL: `https://api.sendgrid.com/v3/mail/send`
- Headers:
  ```
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "personalizations": [{
      "to": [{"email": "{{$json.email}}"}],
      "subject": "Quote Received"
    }],
    "from": {"email": "quotes@stigg.ca"},
    "content": [{
      "type": "text/plain",
      "value": "Thank you for your quote request..."
    }]
  }
  ```

#### Option C: Resend (Developer-Friendly)
1. Sign up at https://resend.com
2. Get API key
3. Use HTTP Request node:
   ```
   POST https://api.resend.com/emails
   Header: Authorization: Bearer YOUR_API_KEY
   Body: {
     "from": "quotes@stigg.ca",
     "to": "customer@email.com",
     "subject": "Quote Received",
     "html": "<p>Thank you...</p>"
   }
   ```

---

### Step 4: Configure SMS (Twilio)

1. **Sign up for Twilio**
   - Go to https://twilio.com
   - Create account (free trial credit)
   - Get Account SID and Auth Token

2. **Buy Phone Number**
   - Console → Phone Numbers → Buy a Number
   - Choose a local Canadian number
   - Cost: ~$1.15/month

3. **Add to n8n**
   - Credentials → Add "Twilio"
   - Account SID: `ACxxxxxxxxxx`
   - Auth Token: `your_token`

4. **Update Workflow**
   - Find "Send Emergency SMS" node
   - Set "From": Your Twilio number
   - Set "To": +15872102167 (operations)

**SMS Costs:**
- Outgoing: $0.0079/SMS
- ~$5-10/month typical use

---

### Step 5: Configure Slack (Optional)

1. **Create Slack App**
   - Go to https://api.slack.com/apps
   - Create New App → From Scratch
   - Name: "Stigg Security Alerts"
   - Choose your workspace

2. **Add Permissions**
   - OAuth & Permissions
   - Add scopes: `chat:write`, `chat:write.public`
   - Install to Workspace
   - Copy "Bot User OAuth Token"

3. **Get Channel ID**
   - In Slack, right-click channel
   - View Channel Details
   - Scroll down, copy ID (e.g., `C123ABC456`)

4. **Add to n8n**
   - Credentials → Add "Slack OAuth2"
   - Paste Bot Token

5. **Update Workflow**
   - Find "Notify Team (Slack)" node
   - Replace `YOUR_SLACK_CHANNEL_ID` with actual ID

---

### Step 6: Get Webhook URL

1. In n8n, open the workflow
2. Click "Quote Request Webhook" node
3. Click "Execute Node" to activate
4. Copy the "Production URL"
   - Example: `https://your-n8n.app/webhook/stigg-quote-request`

---

### Step 7: Connect to Your Website

Add this to `/tmp/cc-agent/51705706/project/src/hooks/useQuoteAutomation.ts`:

After the Supabase save, add:

```typescript
// Send to n8n for email automation
try {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (n8nWebhookUrl) {
    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketId: savedQuote.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceType: data.serviceType,
        propertyType: data.propertyType,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message,
        priority: priority,
        leadScore: leadScore,
        timestamp: new Date().toISOString()
      }),
    });
  }
} catch (n8nError) {
  console.error('n8n webhook failed:', n8nError);
  // Don't fail the quote if n8n is down
}
```

Add to `.env`:
```bash
VITE_N8N_WEBHOOK_URL=https://your-n8n.app/webhook/stigg-quote-request
```

---

### Step 8: Test Email Automation

1. **Activate Workflow**
   - Toggle switch to "Active" in n8n

2. **Submit Test Quote**
   - Go to https://stiggsecurity.ca/quote
   - Fill out form
   - Submit

3. **Verify:**
   - ✅ Customer receives confirmation email
   - ✅ Admin receives notification at admin@stigg.ca
   - ✅ Slack message (if configured)
   - ✅ SMS if urgent (if configured)

4. **Check n8n Logs**
   - Go to "Executions"
   - See successful run
   - Debug any errors

---

## Part 2: Voiceflow Call Answering

### Step 1: Create Voiceflow Account

1. Go to https://voiceflow.com
2. Sign up (Free: 1,000 interactions/month)
3. Click "Create Project"
4. Choose "Phone Assistant"
5. Name: "Stigg Security Call System"

---

### Step 2: Build Call Flow

#### Main Structure:

```
START
  ↓
[Welcome Message]
  ↓
[Menu Options]
  ├─ 1 → Emergency → Transfer to Operations
  ├─ 2 → Quote → Collect Info → Save
  ├─ 3 → Support → Transfer to Support
  └─ 0 → Repeat Menu
```

#### Step-by-Step in Voiceflow:

1. **Add Start Block**
   - Already there by default

2. **Add Speak Block (Welcome)**
   - Text: "Thank you for calling Stigg Security, Alberta's trusted security partner. For emergencies requiring immediate dispatch, press 1. For a security quote, press 2. For existing customers, press 3."

3. **Add Buttons Block (Menu)**
   - Button 1: "Emergency" → path: emergency
   - Button 2: "Quote" → path: quote
   - Button 3: "Support" → path: support

4. **Emergency Path:**
   - Add Speak: "Connecting you to our operations team now."
   - Add Integration: "Transfer Call"
   - Phone number: +15872102167

5. **Quote Path:**
   - Add Speak: "I'll help you get a quote. May I have your name?"
   - Add Capture: Variable = `firstName`
   - Add Speak: "What's your phone number?"
   - Add Capture: Variable = `phone`
   - Add Speak: "And your email?"
   - Add Capture: Variable = `email`
   - Add Speak: "What service are you interested in?"
   - Add Capture: Variable = `serviceType`
   - Add Speak: "Thank you! You'll receive a quote within 2 hours."
   - Add API Call (see below)

6. **Support Path:**
   - Add Speak: "Transferring to support."
   - Add Integration: "Transfer Call"
   - Phone number: +17802152887

---

### Step 3: Add API Integration

In the Quote path, after collecting info:

1. **Add API Block**
2. **Method:** POST
3. **URL:** `https://nabhqadhqehpxogvzuwu.supabase.co/rest/v1/quote_requests`
4. **Headers:**
   ```
   apikey: your_supabase_anon_key
   Authorization: Bearer your_supabase_anon_key
   Content-Type: application/json
   Prefer: return=representation
   ```
5. **Body:**
   ```json
   {
     "first_name": "{firstName}",
     "last_name": "",
     "email": "{email}",
     "phone": "{phone}",
     "service_type": "{serviceType}",
     "message": "Quote requested via phone call",
     "source": "phone"
   }
   ```

---

### Step 4: Connect Twilio

1. **In Twilio Console:**
   - Go to Phone Numbers
   - Click your number
   - Under "Voice & Fax"
   - "A Call Comes In" → Webhook
   - Paste Voiceflow webhook URL

2. **Get Voiceflow Webhook:**
   - In Voiceflow, go to "Integrations"
   - Enable "Twilio"
   - Copy the webhook URL
   - Example: `https://runtime.voiceflow.com/phone/12345`

3. **Save in Twilio**

**Call Costs:**
- Incoming: $0.0085/minute
- Estimate: $20-50/month

---

### Step 5: Test Call System

1. **Call Your Twilio Number**
   - From your phone: Call the number
   - Should hear welcome message

2. **Test Each Path:**
   - Press 1 → Should transfer to operations
   - Press 2 → Should collect quote info
   - Press 3 → Should transfer to support

3. **Verify Data:**
   - Check Supabase for new quote
   - Check if email sent (via n8n)
   - Check operations dashboard

---

## Part 3: Advanced Features

### Voiceflow Voice Cloning

1. Record 30 seconds of your voice
2. In Voiceflow:
   - Settings → Voice
   - Upload recording
   - Train voice model
3. All responses use your voice!

### Business Hours Routing

Add Condition Block:
```javascript
const now = new Date();
const hour = now.getHours();
const day = now.getDay();

// Mon-Fri 8am-6pm
if (day >= 1 && day <= 5 && hour >= 8 && hour < 18) {
  return "business_hours";
} else {
  return "after_hours";
}
```

Then:
- Business hours → Transfer to live person
- After hours → Collect info & promise callback

### Call Recording

In Twilio:
- Phone Number → Voice Configuration
- Enable "Record Calls"
- Store for 30 days

---

## Part 4: Complete Integration Flow

```
┌─────────────────────┐
│   CUSTOMER ACTION   │
└──────────┬──────────┘
           │
    ┌──────┴───────┐
    │              │
    ↓              ↓
[Website Form]  [Phone Call]
    │              │
    ↓              ↓
[Supabase DB]  [Voiceflow]
    │              │
    ↓              ↓
[n8n Webhook]  [Supabase DB]
    │              │
    ↓              ↓
┌───┴──────────────┴───┐
│  NOTIFICATIONS SENT  │
│  • Email to customer │
│  • Email to admin    │
│  • SMS if urgent     │
│  • Slack message     │
│  • Dashboard update  │
└──────────────────────┘
```

---

## Part 5: Cost Summary

| Service | Plan | Cost | What For |
|---------|------|------|----------|
| n8n | Cloud Free | $0 | Basic automation |
| n8n | Cloud Pro | $20/mo | Unlimited workflows |
| SendGrid | Free | $0 | 100 emails/day |
| Resend | Starter | $20/mo | 50k emails/mo |
| Twilio SMS | Pay-as-go | ~$10/mo | SMS alerts |
| Twilio Voice | Pay-as-go | ~$30/mo | Phone calls |
| Voiceflow | Free | $0 | 1k calls/mo |
| Voiceflow | Pro | $50/mo | Unlimited calls |
| Slack | Free | $0 | Basic features |

**Minimum Setup:** $0 (all free tiers)
**Recommended Setup:** $50-80/month
**Enterprise Setup:** $100-150/month

---

## Part 6: Testing Checklist

### Email Automation:
- [ ] Customer confirmation sends
- [ ] Admin notification sends
- [ ] SMS sends for urgent
- [ ] Slack message posts
- [ ] Data logs to Supabase
- [ ] Workflow shows success in n8n

### Call System:
- [ ] Call connects to Voiceflow
- [ ] Welcome message plays
- [ ] Menu options work
- [ ] Emergency transfer works
- [ ] Quote collection works
- [ ] Support transfer works
- [ ] Data saves to Supabase
- [ ] Notifications trigger

### Integration:
- [ ] Website form → Email → Dashboard
- [ ] Phone call → Database → Email
- [ ] All leads reach admin@stigg.ca
- [ ] Hot leads get SMS
- [ ] Everything logs correctly

---

## Part 7: Troubleshooting

### Email not sending?
- Check n8n execution logs
- Verify email credentials
- Test with HTTP Request node first
- Check spam folder

### SMS not sending?
- Verify Twilio credentials
- Check phone number format (+1...)
- Verify Twilio account funded
- Check execution logs

### Calls not working?
- Verify Twilio webhook URL
- Check Voiceflow project is published
- Test webhook manually
- Review Twilio call logs

### Data not saving?
- Check API URL is correct
- Verify Supabase keys
- Test API endpoint manually
- Review Supabase logs

---

## Support Resources

- **n8n Community:** https://community.n8n.io
- **Voiceflow Docs:** https://docs.voiceflow.com
- **Twilio Support:** https://support.twilio.com
- **Our Setup Files:** `/n8n-workflows/` in project

---

## Quick Start Summary

1. **Sign up for n8n** (5 minutes)
2. **Import workflow** (2 minutes)
3. **Connect Gmail** (3 minutes)
4. **Get webhook URL** (1 minute)
5. **Add to .env** (1 minute)
6. **Test quote form** (2 minutes)
7. **Sign up for Voiceflow** (5 minutes)
8. **Build call flow** (15 minutes)
9. **Connect Twilio** (5 minutes)
10. **Test phone call** (2 minutes)

**Total setup time: ~40 minutes**

**You're live! 🚀**
