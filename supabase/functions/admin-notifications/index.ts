import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { SMTPClient } from 'npm:emailjs@4.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ADMIN_EMAIL = 'admin@stigg.ca';

interface NotificationRequest {
  type: 'contact' | 'quote' | 'newsletter_signup' | 'lead' | 'blog_post' | 'newsletter_campaign';
  data: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, data } = await req.json() as NotificationRequest;

    let emailSubject = '';
    let emailMessage = '';
    let priority = 'normal';

    switch (type) {
      case 'contact':
        emailSubject = `New Contact Form Submission - ${data.name}`;
        emailMessage = `
NEW CONTACT FORM SUBMISSION

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject}

Message:
${data.message}

Source: ${data.source}
Submitted: ${new Date().toLocaleString()}

Respond to: ${data.email}
        `.trim();
        priority = 'normal';
        break;

      case 'quote':
        emailSubject = `[LEAD] Quote Request - ${data.firstName} ${data.lastName}`;
        emailMessage = `
NEW LEAD FROM QUOTE REQUEST

Customer: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Service: ${data.serviceType}
Priority: ${data.priority}

SLA Deadline: ${new Date(data.slaDeadline).toLocaleString()}

View in Operations Dashboard
        `.trim();
        priority = data.priority === 'urgent' || data.priority === 'high' ? 'high' : 'normal';
        break;

      case 'newsletter_signup':
        emailSubject = `New Newsletter Subscriber - ${data.email}`;
        emailMessage = `
NEW NEWSLETTER SUBSCRIBER

Email: ${data.email}
Name: ${data.name || 'Not provided'}
Interests: ${data.interests?.join(', ') || 'None selected'}

Subscribed: ${new Date().toLocaleString()}

Total Active Subscribers: Check Newsletter Manager
        `.trim();
        priority = 'low';
        break;

      case 'lead':
        emailSubject = `[${data.priority.toUpperCase()}] New Lead - ${data.name || data.email}`;
        emailMessage = `
NEW LEAD CAPTURED

Email: ${data.email}
Name: ${data.name || 'Not provided'}
Company: ${data.company || 'Not provided'}
Phone: ${data.phone || 'Not provided'}

Lead Score: ${data.score}/100
Priority: ${data.priority.toUpperCase()}
Stage: ${data.stage}
Source: ${data.source}

Interests: ${data.interests?.join(', ') || 'None'}

Last Activity: ${new Date(data.lastActivity).toLocaleString()}

${data.priority === 'hot' ? '🔥 HOT LEAD - IMMEDIATE FOLLOW-UP REQUIRED!' : ''}

View in Operations Dashboard → Hot Leads
        `.trim();
        priority = data.priority === 'hot' ? 'high' : 'normal';
        break;

      case 'blog_post':
        emailSubject = `New Blog Post ${data.status === 'published' ? 'Published' : 'Created'}: ${data.title}`;
        emailMessage = `
NEW BLOG POST ${data.status.toUpperCase()}

Title: ${data.title}
Author: ${data.author}
Category: ${data.category}
Status: ${data.status}

Excerpt:
${data.excerpt}

${data.status === 'published' ? `View at: ${supabaseUrl.replace('.supabase.co', '')}/blog/${data.slug}` : 'Not yet published'}

${data.status === 'scheduled' ? `Scheduled for: ${new Date(data.publishDate).toLocaleString()}` : ''}

Manage in Blog Admin
        `.trim();
        priority = 'low';
        break;

      case 'newsletter_campaign':
        emailSubject = `Newsletter Campaign ${data.action}: ${data.title}`;
        
        if (data.action === 'sent') {
          emailMessage = `
NEWSLETTER CAMPAIGN SENT

Campaign: ${data.title}
Subject: ${data.subject}

Recipients: ${data.recipientCount}
Sent: ${new Date().toLocaleString()}

--- EMAIL CONTENT ---

${data.content}

--- END CONTENT ---

Track performance in Newsletter Manager
          `.trim();
        } else if (data.action === 'created') {
          emailMessage = `
NEWSLETTER CAMPAIGN CREATED

Campaign: ${data.title}
Subject: ${data.subject}
Status: ${data.status}

${data.scheduledFor ? `Scheduled for: ${new Date(data.scheduledFor).toLocaleString()}` : 'Not scheduled (draft)'}

--- EMAIL PREVIEW ---

${data.content}

--- END PREVIEW ---

Manage in Newsletter Manager
          `.trim();
        }
        priority = 'low';
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    // Save notification to database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert([{
        type: 'email',
        recipient: ADMIN_EMAIL,
        subject: emailSubject,
        message: emailMessage,
        metadata: { notificationType: type, priority, data },
      }]);

    if (notifError) {
      console.error('Error saving notification:', notifError);
    }

    // Send email via Mochahost SMTP
    try {
      const smtpHost = Deno.env.get('SMTP_HOST') || 'mail.stigg.ca';
      const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
      const smtpUser = Deno.env.get('SMTP_USER') || 'admin@stigg.ca';
      const smtpPass = Deno.env.get('SMTP_PASSWORD');
      const smtpFromName = Deno.env.get('SMTP_FROM_NAME') || 'Stigg Security';

      if (smtpPass) {
        const client = new SMTPClient({
          user: smtpUser,
          password: smtpPass,
          host: smtpHost,
          port: smtpPort,
          tls: true,
        });

        await client.sendAsync({
          from: `${smtpFromName} <${smtpUser}>`,
          to: ADMIN_EMAIL,
          subject: emailSubject,
          text: emailMessage,
        });

        console.log('Email sent via Mochahost SMTP:', {
          type,
          recipient: ADMIN_EMAIL,
          subject: emailSubject,
        });
      } else {
        console.log('SMTP not configured, notification saved to database only');
      }
    } catch (emailError) {
      console.error('Error sending email via SMTP:', emailError);
      // Continue anyway - notification is saved to database
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin notification sent',
        type,
        recipient: ADMIN_EMAIL,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in admin-notifications:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});