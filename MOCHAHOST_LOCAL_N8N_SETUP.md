# Mochahost SMTP + Local n8n Setup Guide

## Overview
This guide configures your system to use:
- **Mochahost SMTP** for all email sending (no additional cost!)
- **Local n8n** installation for advanced automation

---

## Part 1: Mochahost SMTP Configuration

### Step 1: Get Your SMTP Credentials from Mochahost

1. **Log in to Mochahost cPanel**
   - Go to your Mochahost account
   - Access cPanel

2. **Find Email Account Settings**
   - Click "Email Accounts"
   - Find `admin@stigg.ca` (or your admin email)
   - Click "Connect Devices" or "Configure Mail Client"

3. **Note Your SMTP Settings:**
   ```
   Outgoing Server (SMTP): mail.stigg.ca
   SMTP Port: 587 (TLS) or 465 (SSL)
   SMTP Username: admin@stigg.ca
   SMTP Password: [your email password]
   SMTP Authentication: Required
   Encryption: TLS/STARTTLS
   ```

### Step 2: Add SMTP Credentials to Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions Secrets**
   - Click "Edge Functions" in sidebar
   - Click "Manage secrets"

3. **Add SMTP Secrets:**
   ```
   SMTP_HOST=mail.stigg.ca
   SMTP_PORT=587
   SMTP_USER=admin@stigg.ca
   SMTP_PASSWORD=your_email_password_here
   SMTP_FROM_NAME=Stigg Security
   ```

   Click "Add secret" for each one.

### Step 3: Redeploy Edge Functions

The Edge Function has been updated to use Mochahost SMTP. Redeploy it:

```bash
cd /tmp/cc-agent/51705706/project

# Redeploy admin-notifications function
supabase functions deploy admin-notifications

# This will now use Mochahost SMTP automatically!
```

### Step 4: Test SMTP

Test that emails are sending:

1. **Submit a test quote:**
   - Go to https://stiggsecurity.ca/quote
   - Fill out form
   - Submit

2. **Check your inbox:**
   - You should receive email at admin@stigg.ca
   - Check spam folder if not in inbox

3. **Debug if needed:**
   - Go to Supabase Dashboard
   - Edge Functions → admin-notifications → Logs
   - Look for "Email sent via Mochahost SMTP" or errors

---

## Part 2: Local n8n Installation

### Why Local n8n?
- Free forever (no cloud costs)
- Full control
- Better for sensitive data
- Unlimited workflows

### Step 1: Install n8n Locally

**Option A: Using npm (Recommended)**
```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Access at: http://localhost:5678
```

**Option B: Using Docker**
```bash
# Run n8n in Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at: http://localhost:5678
```

**Option C: Using pnpm**
```bash
# Install pnpm if not installed
npm install -g pnpm

# Install n8n
pnpm install -g n8n

# Start n8n
n8n start
```

### Step 2: Initial n8n Setup

1. **Open n8n**
   - Go to http://localhost:5678
   - First time: Create admin account
   - Email: admin@stigg.ca
   - Password: [choose secure password]

2. **Configure Settings**
   - Click your profile (top right)
   - Settings → n8n Settings
   - Set timezone to your local timezone
   - Enable "Save manual executions"

### Step 3: Import Workflows

1. **Import Quote Automation**
   - Click "Workflows"
   - Click "Import from File"
   - Select `/tmp/cc-agent/51705706/project/n8n-workflows/01-quote-automation-basic.json`
   - Click "Import"

2. **Import Advanced Lead Routing**
   - Repeat with `02-advanced-lead-routing.json`

### Step 4: Configure Mochahost SMTP in n8n

1. **Add SMTP Credentials**
   - In n8n, click "Credentials" (left sidebar)
   - Click "Add Credential"
   - Search for "SMTP"
   - Fill in:
     ```
     Host: mail.stigg.ca
     Port: 587
     Secure: Use TLS
     User: admin@stigg.ca
     Password: [your email password]
     From Email: admin@stigg.ca
     From Name: Stigg Security
     ```

2. **Update Email Send Nodes**
   - Open the quote automation workflow
   - Find the "Send Confirmation Email" node
   - If it's a Gmail node, replace with "Send Email" node
   - Set credential to your Mochahost SMTP
   - Configure:
     ```
     To Email: {{$json.email}}
     Subject: Quote Request Received
     Text/HTML: [your email template]
     ```

### Step 5: Expose Local n8n for Webhooks

Since n8n is running locally, webhooks from your website won't work directly. Here are solutions:

**Option A: Use Tunneling (Development)**
```bash
# Install ngrok
brew install ngrok  # Mac
# or download from ngrok.com

# Expose n8n to internet
ngrok http 5678

# You'll get a URL like: https://abc123.ngrok.io
# Use this as your webhook URL
```

**Option B: Deploy to Server (Production)**
```bash
# On your server (DigitalOcean, AWS, etc.)
# Install n8n
npm install -g n8n

# Run as service with PM2
npm install -g pm2
pm2 start n8n
pm2 save
pm2 startup

# Configure reverse proxy with nginx
# Point n8n.stigg.ca to your server
```

**Option C: Hybrid Approach (Recommended)**
- Use Supabase Edge Functions for webhooks
- Use local n8n for complex workflows
- Supabase triggers n8n via HTTP

### Step 6: Connect Website to Local n8n

**If using ngrok:**
```bash
# Start ngrok
ngrok http 5678

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Update .env:**
```bash
VITE_N8N_WEBHOOK_URL=https://abc123.ngrok.io/webhook/stigg-quote-request
```

**If n8n is on same machine as website:**
```bash
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/stigg-quote-request
```

---

## Part 3: n8n + Mochahost SMTP Integration

### Configure Email Workflows

1. **Open Quote Automation Workflow**
   - Click "Workflows"
   - Open "Stigg Security - Quote Request Automation"

2. **Update Email Nodes:**

**Customer Confirmation Email:**
```
Node: Send Email
Credential: Mochahost SMTP
From: Stigg Security <admin@stigg.ca>
To: {{$json.email}}
Subject: Quote Request Received - Ref#{{$json.ticketId}}
Text:
Hi {{$json.firstName}},

Thank you for requesting a security quote from Stigg Security!

We've received your information and our team is reviewing your needs right now.

What happens next:
✓ Security specialist assigned (within 15 minutes)
✓ Initial assessment completed (within 1 hour)
✓ Detailed quote delivered (within 2 hours)

Your Reference Number: {{$json.ticketId}}
Your Priority Level: {{$json.priority}}

Need immediate assistance? Call us:
📞 587-210-2167 (Operations)
📞 780-215-2887 (Support)

Best regards,
Stigg Security Team

---
Stigg Security Inc.
📧 admin@stigg.ca
🌐 www.stigg.ca
```

**Admin Notification Email:**
```
Node: Send Email
Credential: Mochahost SMTP
From: Stigg Security <admin@stigg.ca>
To: admin@stigg.ca
Subject: [{{$json.priority}}] New Quote - {{$json.firstName}} {{$json.lastName}}
Text:
NEW QUOTE REQUEST

Customer: {{$json.firstName}} {{$json.lastName}}
Email: {{$json.email}}
Phone: {{$json.phone}}
Company: {{$json.company}}

Service: {{$json.serviceType}}
Property: {{$json.propertyType}}
Budget: {{$json.budget}}
Timeline: {{$json.timeline}}

Priority: {{$json.priority}}
Lead Score: {{$json.leadScore}}/100
Ticket ID: {{$json.ticketId}}

Message:
{{$json.message}}

Response Required Within: 2 HOURS
View in Dashboard: https://stiggsecurity.ca/operations
```

3. **Save and Activate**
   - Click "Save"
   - Toggle "Active" switch on

---

## Part 4: Testing Complete System

### Test 1: Email via Supabase Edge Functions

```bash
# Submit contact form
curl -X POST https://stiggsecurity.ca/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing SMTP"
  }'

# Check:
# 1. Email arrives at admin@stigg.ca
# 2. Check Supabase logs for success
```

### Test 2: Email via n8n + SMTP

```bash
# Submit quote form
# Go to https://stiggsecurity.ca/quote
# Fill out and submit

# Check:
# 1. n8n execution shows success
# 2. Customer receives confirmation email
# 3. Admin receives notification email
# 4. All from admin@stigg.ca via Mochahost
```

### Test 3: Full Integration

1. **Submit Quote:**
   - Website form → Supabase
   - Supabase → n8n webhook
   - n8n → Mochahost SMTP emails
   - Emails delivered

2. **Verify:**
   - Check n8n Executions tab
   - Check email inbox
   - Check Operations Dashboard
   - Confirm data in Supabase

---

## Part 5: Running n8n as Background Service

### Keep n8n Running 24/7

**Option A: Using PM2 (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start n8n with PM2
pm2 start n8n

# Save configuration
pm2 save

# Set up auto-start on reboot
pm2 startup

# Monitor
pm2 status
pm2 logs n8n
```

**Option B: Using systemd (Linux)**
```bash
# Create service file
sudo nano /etc/systemd/system/n8n.service

# Add:
[Unit]
Description=n8n workflow automation
After=network.target

[Service]
Type=simple
User=youruser
ExecStart=/usr/local/bin/n8n start
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable n8n
sudo systemctl start n8n
sudo systemctl status n8n
```

**Option C: Using Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
    volumes:
      - ~/.n8n:/home/node/.n8n
```

```bash
docker-compose up -d
```

---

## Part 6: Troubleshooting

### SMTP Not Sending

**Issue:** Emails not arriving

**Solutions:**
1. **Verify SMTP credentials:**
   ```bash
   # Test with swaks
   swaks --to admin@stigg.ca \
     --from admin@stigg.ca \
     --server mail.stigg.ca:587 \
     --auth LOGIN \
     --auth-user admin@stigg.ca \
     --auth-password "YOUR_PASSWORD" \
     --tls
   ```

2. **Check Mochahost limits:**
   - cPanel → Email → Track Delivery
   - Look for bounces or rejections
   - Verify SPF/DKIM records

3. **Check Supabase logs:**
   - Edge Functions → admin-notifications → Logs
   - Look for SMTP errors

4. **Test in n8n:**
   - Open workflow
   - Click "Execute Workflow"
   - Check execution details

### n8n Webhook Not Receiving

**Issue:** Website can't reach n8n

**Solutions:**
1. **If using ngrok:**
   - Verify ngrok is running
   - Check URL hasn't changed
   - Update .env if needed

2. **If local:**
   - Can't receive external webhooks directly
   - Use Supabase Edge Function as proxy
   - Or deploy n8n to server

3. **Check webhook URL:**
   - In n8n, click webhook node
   - Copy "Test URL" or "Production URL"
   - Verify matches .env

### Emails Going to Spam

**Solutions:**
1. **Configure SPF record:**
   - In Mochahost DNS
   - Add TXT record:
   ```
   v=spf1 include:mochahost.com ~all
   ```

2. **Configure DKIM:**
   - In cPanel → Email → Authentication
   - Enable DKIM
   - Add DNS records shown

3. **Set up DMARC:**
   - Add TXT record:
   ```
   _dmarc.stigg.ca TXT "v=DMARC1; p=none; rua=mailto:admin@stigg.ca"
   ```

---

## Part 7: Production Checklist

### Before Going Live:

- [ ] SMTP credentials added to Supabase
- [ ] Edge Functions redeployed
- [ ] Test email received at admin@stigg.ca
- [ ] n8n installed and running
- [ ] n8n workflows imported
- [ ] n8n SMTP configured
- [ ] n8n set up as background service
- [ ] Webhook URL configured (if using)
- [ ] Test quote form end-to-end
- [ ] SPF/DKIM/DMARC configured
- [ ] Emails not going to spam

### Monitor:

- [ ] Check email delivery daily
- [ ] Monitor n8n executions
- [ ] Review Supabase Edge Function logs
- [ ] Test quote form weekly
- [ ] Verify Operations Dashboard updates

---

## Summary

### What You Have Now:

✅ **Mochahost SMTP Integration**
- All emails send from admin@stigg.ca
- No additional email costs
- Professional email delivery
- SPF/DKIM authentication

✅ **Local n8n Installation**
- Free forever
- Full workflow automation
- Email confirmations
- Admin notifications
- Slack integration ready
- CRM logging ready

✅ **Complete Email Flow:**
```
Quote Submitted
    ↓
Saved to Supabase
    ↓
Edge Function (admin-notifications)
    ↓
Mochahost SMTP
    ↓
Email delivered to admin@stigg.ca
    ↓
(Optional) n8n webhook triggered
    ↓
Customer confirmation sent via Mochahost SMTP
```

### Costs:

- **Mochahost SMTP:** $0 (included with hosting)
- **Local n8n:** $0 (self-hosted)
- **Supabase:** $0 (free tier)
- **Total:** $0/month!

### Next Steps:

1. Add SMTP credentials to Supabase (5 min)
2. Test email delivery (2 min)
3. Install local n8n (10 min)
4. Import workflows (5 min)
5. Configure SMTP in n8n (5 min)
6. Test complete system (5 min)

**Total setup time: ~30 minutes**

**You're ready to go live! 🚀**
