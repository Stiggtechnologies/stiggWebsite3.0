# n8n Setup Guide for Stigg Security Quote Automation

## 🚀 Quick Setup Instructions

### Step 1: Import the Workflow
1. Open your n8n instance at `http://localhost:5678`
2. Click **"New Workflow"** or **"Import from File"**
3. Copy the JSON from `01-quote-automation-basic.json`
4. Paste it into the import dialog
5. Click **"Import"**

### Step 2: Configure the Webhook
1. Click on the **"Quote Request Webhook"** node
2. Copy the webhook URL (it will look like: `http://localhost:5678/webhook/stigg-quote-request`)
3. Update your `.env` file with this URL

### Step 3: Configure Email Settings
1. Click on **"Send Confirmation Email"** node
2. Set up your email credentials:
   - **Gmail**: Use App Password (not regular password)
   - **SMTP**: Use your business email settings

### Step 4: Configure Slack (Optional)
1. Click on **"Notify Team (Slack)"** node
2. Create a Slack webhook URL:
   - Go to https://api.slack.com/apps
   - Create new app → Incoming Webhooks
   - Copy webhook URL

### Step 5: Configure Google Sheets CRM
1. Click on **"Log to CRM (Google Sheets)"** node
2. Create a Google Sheet with these columns:
   ```
   Timestamp | Ticket ID | Name | Email | Phone | Company | Service Type | Property Type | Budget | Timeline | Priority | Lead Score | Status | Assigned To | Response Due
   ```
3. Share the sheet with your n8n Google account
4. Copy the sheet ID from the URL

### Step 6: Test the Workflow
1. Click **"Execute Workflow"** in n8n
2. Submit a test quote on your website
3. Check that all nodes execute successfully

## 🔧 Environment Variables Needed

Add these to your `.env` file:

```env
# n8n Webhook URL (from Step 2)
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/stigg-quote-request

# Optional: For production deployment
VITE_N8N_PRODUCTION_URL=https://your-n8n-domain.com/webhook/stigg-quote-request
```

## 📧 Email Configuration Options

### Option 1: Gmail (Recommended)
```
Host: smtp.gmail.com
Port: 587
Security: STARTTLS
Username: your-email@gmail.com
Password: [App Password - NOT your regular password]
```

### Option 2: Business Email
```
Host: mail.your-domain.com
Port: 587 or 465
Security: STARTTLS or SSL/TLS
Username: admin@stigg.ca
Password: [Your email password]
```

## 🚨 Emergency SMS Setup (Optional)

### Twilio Configuration:
1. Sign up at https://twilio.com
2. Get Account SID and Auth Token
3. Buy a phone number
4. Configure in the "Send Emergency SMS" node

## 📊 Google Sheets CRM Template

Create a new Google Sheet with this structure:

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | When submitted | 2024-01-15 14:30:00 |
| Ticket ID | Unique identifier | STG-20240115-JOHN-A1B2 |
| Name | Full name | John Smith |
| Email | Email address | john@company.com |
| Phone | Phone number | 587-210-2167 |
| Company | Company name | ABC Corp |
| Service Type | Requested service | security-guards |
| Property Type | Property type | office |
| Budget | Budget range | 5k-10k |
| Timeline | When needed | immediate |
| Priority | AUTO: HIGH/NORMAL/EMERGENCY | HIGH |
| Lead Score | AUTO: 0-100 | 75 |
| Status | NEW/CONTACTED/QUOTED/CLOSED | NEW |
| Assigned To | Team member | Sarah Johnson |
| Response Due | AUTO: Deadline | 2024-01-15 15:30:00 |

## 🔄 Workflow Execution Flow

```
1. Website Form Submitted
   ↓
2. Webhook Receives Data
   ↓
3. Process & Score Lead (AUTO)
   ↓
4. Send Confirmation Email (AUTO)
   ↓
5. Notify Team via Slack (AUTO)
   ↓
6. Log to Google Sheets CRM (AUTO)
   ↓
7. Check if Emergency (AUTO)
   ↓
8. Send Emergency Alerts if needed (AUTO)
```

## 🚀 Testing Checklist

- [ ] Webhook URL is accessible
- [ ] Email confirmation sends successfully
- [ ] Slack notification appears in channel
- [ ] Google Sheets row is created
- [ ] Emergency detection works for urgent keywords
- [ ] Lead scoring calculates correctly
- [ ] All data fields are captured properly

## 🔧 Troubleshooting

### Common Issues:

1. **Webhook not receiving data**
   - Check if n8n is running
   - Verify webhook URL in .env file
   - Check browser network tab for errors

2. **Email not sending**
   - Verify SMTP credentials
   - Check spam folder
   - Try Gmail App Password instead of regular password

3. **Slack notifications not working**
   - Verify webhook URL
   - Check Slack app permissions
   - Test webhook URL directly

4. **Google Sheets not updating**
   - Check sheet permissions
   - Verify sheet ID in workflow
   - Ensure Google account is connected

## 📞 Support

If you need help with setup:
1. Check the n8n execution log for errors
2. Test each node individually
3. Verify all credentials and URLs
4. Check the browser console for JavaScript errors

## 🎯 Next Steps After Setup

Once this workflow is running:
1. Monitor lead quality and response times
2. Set up additional workflows for follow-up sequences
3. Add more sophisticated lead routing
4. Implement quote generation automation