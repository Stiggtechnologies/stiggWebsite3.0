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

    const { campaignId } = await req.json();

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active');

    if (subscribersError) {
      throw new Error(`Error fetching subscribers: ${subscribersError.message}`);
    }

    // Update campaign status to sending
    await supabase
      .from('newsletter_campaigns')
      .update({ status: 'sending', recipient_count: subscribers?.length || 0 })
      .eq('id', campaignId);

    // Send newsletter to each subscriber
    const notifications = [];
    for (const subscriber of subscribers || []) {
      notifications.push({
        type: 'email',
        recipient: subscriber.email,
        subject: campaign.subject,
        message: campaign.content,
        metadata: {
          campaignId,
          subscriberId: subscriber.id,
          interests: subscriber.interests,
        },
      });
    }

    // Batch insert notifications
    if (notifications.length > 0) {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Error creating notifications:', notifError);
      }
    }

    // Update campaign status to sent
    await supabase
      .from('newsletter_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    // Update subscriber last_sent_at
    const subscriberIds = subscribers?.map(s => s.id) || [];
    if (subscriberIds.length > 0) {
      await supabase
        .from('newsletter_subscribers')
        .update({ last_sent_at: new Date().toISOString() })
        .in('id', subscriberIds);
    }

    // Send admin copy notification
    await supabase
      .from('notifications')
      .insert([{
        type: 'email',
        recipient: 'admin@stigg.ca',
        subject: `Newsletter Sent: ${campaign.subject}`,
        message: `Newsletter campaign "${campaign.title}" has been sent to ${subscribers?.length || 0} subscribers.\n\nSubject: ${campaign.subject}\n\n--- EMAIL CONTENT ---\n\n${campaign.content}\n\n--- END CONTENT ---`,
        metadata: {
          type: 'newsletter_campaign',
          action: 'sent',
          campaignId,
          recipientCount: subscribers?.length || 0,
        },
      }]);

    return new Response(
      JSON.stringify({
        success: true,
        campaignId,
        recipientCount: subscribers?.length || 0,
        message: 'Newsletter sent successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in newsletter-sender:', error);
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