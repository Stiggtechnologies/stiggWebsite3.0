import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: pendingQuotes, error: fetchError } = await supabase
      .from('quote_requests')
      .select('*')
      .in('status', ['pending', 'reviewed'])
      .is('response_sent_at', null)
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Error fetching pending quotes: ${fetchError.message}`);
    }

    if (!pendingQuotes || pendingQuotes.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No pending quotes to follow up',
          followupsCount: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const followups = [];

    for (const quote of pendingQuotes) {
      const createdAt = new Date(quote.created_at);
      const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      let shouldFollowUp = false;
      let followupType = '';
      let followupMessage = '';

      if (hoursSinceCreated >= 24 && hoursSinceCreated < 25 && quote.created_at >= twentyFourHoursAgo) {
        shouldFollowUp = true;
        followupType = '24-hour';
        followupMessage = `Hi ${quote.first_name},\n\nWe wanted to follow up on your security quote request from yesterday.\n\nOur team is working on preparing a detailed proposal for your ${quote.service_type} needs. We should have your customized quote ready within the next few hours.\n\nIf you have any questions or would like to discuss your requirements, please don't hesitate to call us at 587-210-2167.\n\nBest regards,\nStigg Security Team`;
      } else if (hoursSinceCreated >= 48 && hoursSinceCreated < 49 && quote.created_at >= fortyEightHoursAgo) {
        shouldFollowUp = true;
        followupType = '48-hour';
        followupMessage = `Hi ${quote.first_name},\n\nWe notice we haven't heard back from you regarding your security quote request.\n\nWe're still very interested in helping secure your ${quote.property_type || 'property'} with our ${quote.service_type} services.\n\nIs there anything we can answer or clarify? We're here to help!\n\nCall us: 587-210-2167\nEmail: admin@stigg.ca\n\nBest regards,\nStigg Security Team`;
      } else if (hoursSinceCreated >= 168 && hoursSinceCreated < 169 && quote.created_at >= sevenDaysAgo) {
        shouldFollowUp = true;
        followupType = '7-day';
        followupMessage = `Hi ${quote.first_name},\n\nIt's been a week since your security quote request, and we wanted to check in one last time.\n\nWe understand that timing matters, and we'd still love to help protect your ${quote.property_type || 'property'}.\n\nIf your needs have changed or you'd like to discuss different options, we're flexible and ready to work with you.\n\nNo pressure - just letting you know we're here when you need us.\n\nStigg Security Team\n587-210-2167 | admin@stigg.ca`;
      }

      if (shouldFollowUp) {
        followups.push({
          type: 'email',
          recipient: quote.email,
          subject: `Following up on your Stigg Security quote request`,
          message: followupMessage,
          metadata: {
            quoteId: quote.id,
            followupType,
            daysSinceCreated: Math.floor(hoursSinceCreated / 24),
          },
        });

        await supabase
          .from('notifications')
          .insert([{
            type: 'email',
            recipient: 'admin@stigg.ca',
            subject: `${followupType} Follow-up Sent: ${quote.first_name} ${quote.last_name}`,
            message: `Automatic ${followupType} follow-up email has been sent to ${quote.email} for quote #${quote.id}.\n\nCustomer: ${quote.first_name} ${quote.last_name}\nService: ${quote.service_type}\nCreated: ${new Date(quote.created_at).toLocaleString()}`,
            metadata: {
              type: 'quote_followup',
              quoteId: quote.id,
              followupType,
            },
          }]);
      }
    }

    if (followups.length > 0) {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(followups);

      if (notifError) {
        throw new Error(`Error creating follow-up notifications: ${notifError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        followupsCount: followups.length,
        pendingQuotesTotal: pendingQuotes.length,
        message: `Sent ${followups.length} follow-up email(s)`,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in quote-followups:', error);
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