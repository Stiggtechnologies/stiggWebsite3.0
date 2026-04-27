import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface QuoteNotification {
  quoteId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceType: string;
  priority: string;
  slaDeadline: string;
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

    const { quoteId, firstName, lastName, email, phone, serviceType, priority, slaDeadline } = await req.json() as QuoteNotification;

    // Send notifications to operations team
    const notifications = [];

    // 1. Email notification to admin
    const emailNotification = {
      type: 'email',
      recipient: 'admin@stigg.ca',
      subject: `[${priority}] New Quote Request - ${firstName} ${lastName}`,
      message: `
New quote request received:

Customer: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${serviceType}
Priority: ${priority}
SLA Deadline: ${new Date(slaDeadline).toLocaleString()}

Please respond within 2 hours to meet SLA.

View quote: ${supabaseUrl}/dashboard/quotes/${quoteId}
      `.trim(),
      metadata: { quoteId, priority, serviceType },
    };

    // 2. SMS notification for high priority
    if (priority === 'high' || priority === 'urgent') {
      const smsNotification = {
        type: 'sms',
        recipient: '1-587-644-4644',
        subject: null,
        message: `URGENT: New ${priority} quote request from ${firstName} ${lastName} for ${serviceType}. Respond within 2 hours. Check email for details.`,
        metadata: { quoteId, priority },
      };
      notifications.push(smsNotification);
    }

    notifications.push(emailNotification);

    // Save notifications to database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notifError) {
      console.error('Error saving notifications:', notifError);
    }

    // Update quote with notification tracking
    const { error: updateError } = await supabase
      .from('quote_requests')
      .update({
        notifications_sent: notifications.map(n => ({
          type: n.type,
          recipient: n.recipient,
          sent_at: new Date().toISOString(),
        })),
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Error updating quote:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notifications sent',
        notificationCount: notifications.length,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in quote-notification:', error);
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