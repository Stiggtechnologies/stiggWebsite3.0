@@ .. @@
 
 ## Features
 
+### AI-Powered Customer Support
+- **OpenAI GPT-4 Integration**: Advanced AI assistant with expert knowledge of all security services
+- **Service-Specific Expertise**: Specialized prompts for security guards, surveillance, virtual guards, and IT support
+- **Intelligent Lead Scoring**: Automatic lead qualification and prioritization
+- **Human-in-the-Loop**: Seamless handoff to human specialists when needed
+- **Contextual Recommendations**: AI-powered service recommendations based on user behavior
+
 ### Comprehensive Security Services
 - **Security Guard Services**: Professional personnel, mobile patrols, access control
 - **Surveillance Systems**: HD cameras, AI detection, remote monitoring
@@ .. @@
 
 ## Environment Variables
 
+Create a `.env` file in the root directory:
+
+```env
+# OpenAI Configuration (for AI Assistant)
+VITE_OPENAI_API_KEY=your_openai_api_key_here
+```
+
+**Important**: In production, use a backend proxy instead of exposing API keys in the frontend.
+
 ## Development
 
 ```bash
@@ .. @@
 npm run build
 ```
## Quote Automation with n8n

### Setup Instructions

1. **Import the n8n Workflow:**
   - Copy the JSON from `n8n-workflows/01-quote-automation-basic.json`
   - Import into your n8n instance
   - Configure the webhook URL in your environment

2. **Required Integrations:**
   - **Email Service:** Configure SMTP or Gmail integration
   - **Slack:** Set up Slack webhook for team notifications
   - **Google Sheets:** Create a spreadsheet for CRM logging
   - **Twilio (Optional):** For emergency SMS alerts

3. **Environment Variables:**
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/stigg-quote-request
   ```

4. **Workflow Features:**
   - ✅ Instant email confirmation (0-2 minutes)
   - ✅ Team Slack notifications with priority levels
   - ✅ CRM logging with lead scoring
   - ✅ Emergency routing for urgent requests
   - ✅ Automated response time tracking

### Lead Scoring Algorithm

The system automatically scores leads based on:
- **Timeline urgency** (immediate = 50 points)
- **Budget range** (higher budget = more points)
- **Service complexity** (multiple services = higher score)
- **Emergency keywords** in messages (+30 points)
- **Business vs individual** (+10 points for companies)

**Priority Levels:**
- 🚨 **EMERGENCY** (80+ points): 30-minute response
- ⚡ **HIGH** (50-79 points): 1-hour response  
- 📋 **STANDARD** (<50 points): 2-hour response

 
+## AI Assistant Configuration
+
+The AI assistant uses OpenAI GPT-4 with specialized prompts for different security services:
+
+### Expert System Prompts
+- **General Security Consultant**: Comprehensive knowledge of all services
+- **Security Guards Specialist**: Physical security, personnel deployment, licensing
+- **Surveillance Expert**: Camera systems, monitoring, AI detection
+- **Virtual Guard Specialist**: Remote monitoring, cost-effectiveness, AI integration
+- **IT Security Expert**: Cybersecurity, network protection, compliance
+
+### Features
+- **Contextual Understanding**: Analyzes user behavior and page context
+- **Lead Scoring**: Automatic qualification based on conversation content
+- **Service Recommendations**: AI-powered suggestions based on industry and needs
+- **Human Handoff**: Intelligent escalation for complex queries
+- **Multi-turn Conversations**: Maintains context across conversation history
+
 ## Deployment
 
 The application is optimized for deployment on modern hosting platforms: