import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    const { data: overdueQuotes, error: overdueError } = await supabase
      .rpc('get_overdue_quotes');

    if (overdueError) {
      throw new Error(`Error fetching overdue quotes: ${overdueError.message}`);
    }

    const escalations = [];
    for (const quote of overdueQuotes || []) {
      const hoursOverdue = quote.hours_overdue;
      
      const shouldEscalate = 
        (hoursOverdue >= 0.5 && hoursOverdue < 0.6) ||
        (hoursOverdue >= 1 && hoursOverdue % 1 < 0.1);

      if (shouldEscalate) {
        const escalationNotif = {
          type: 'email',
          recipient: 'admin@stigg.ca',
          subject: `⚠️ SLA BREACH: Quote ${quote.id} overdue by ${Math.round(hoursOverdue * 60)} minutes`,
          message: `
QUOTE SLA BREACH ALERT

Customer: ${quote.first_name} ${quote.last_name}
Email: ${quote.email}
Phone: ${quote.phone || 'N/A'}
Service: ${quote.service_type}
Priority: ${quote.priority}

Created: ${new Date(quote.created_at).toLocaleString()}
SLA Deadline: ${new Date(quote.sla_deadline).toLocaleString()}
Overdue by: ${Math.round(hoursOverdue * 60)} minutes

IMMEDIATE ACTION REQUIRED
          `.trim(),
          metadata: { quoteId: quote.id, hoursOverdue, escalation: true },
        };
        escalations.push(escalationNotif);
      }
    }

    if (escalations.length > 0) {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(escalations);

      if (notifError) {
        console.error('Error saving escalations:', notifError);
      }
    }

    const { data: upcomingQuotes, error: upcomingError } = await supabase
      .from('quote_requests')
      .select('*')
      .in('status', ['pending', 'reviewed'])
      .is('response_sent_at', null)
      .gte('sla_deadline', new Date().toISOString())
      .lte('sla_deadline', new Date(Date.now() + 30 * 60 * 1000).toISOString());

    if (upcomingError) {
      console.error('Error fetching upcoming deadlines:', upcomingError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        overdueCount: overdueQuotes?.length || 0,
        escalationsSent: escalations.length,
        upcomingDeadlines: upcomingQuotes?.length || 0,
        overdueQuotes: overdueQuotes || [],
        upcomingQuotes: upcomingQuotes || [],
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in sla-monitor:', error);
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