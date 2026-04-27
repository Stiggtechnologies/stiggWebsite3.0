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

    const now = new Date().toISOString();

    const { data: scheduledCampaigns, error: fetchError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true });

    if (fetchError) {
      throw new Error(`Error fetching scheduled campaigns: ${fetchError.message}`);
    }

    if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No newsletters to send',
          sentCount: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const sentCampaigns = [];
    const errors = [];

    for (const campaign of scheduledCampaigns) {
      const { data: subscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active');

      if (subscribersError) {
        errors.push({
          campaignId: campaign.id,
          title: campaign.title,
          error: subscribersError.message,
        });
        continue;
      }

      await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sending',
          recipient_count: subscribers?.length || 0,
        })
        .eq('id', campaign.id);

      const notifications = [];
      for (const subscriber of subscribers || []) {
        notifications.push({
          type: 'email',
          recipient: subscriber.email,
          subject: campaign.subject,
          message: campaign.content,
          metadata: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            interests: subscriber.interests,
          },
        });
      }

      if (notifications.length > 0) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notifError) {
          errors.push({
            campaignId: campaign.id,
            title: campaign.title,
            error: notifError.message,
          });
          continue;
        }
      }

      const { error: updateError } = await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sent',
          sent_at: now,
        })
        .eq('id', campaign.id);

      if (updateError) {
        errors.push({
          campaignId: campaign.id,
          title: campaign.title,
          error: updateError.message,
        });
      } else {
        sentCampaigns.push({
          id: campaign.id,
          title: campaign.title,
          subject: campaign.subject,
          recipientCount: subscribers?.length || 0,
          sentAt: now,
        });

        const subscriberIds = subscribers?.map(s => s.id) || [];
        if (subscriberIds.length > 0) {
          await supabase
            .from('newsletter_subscribers')
            .update({ last_sent_at: now })
            .in('id', subscriberIds);
        }

        await supabase
          .from('notifications')
          .insert([{
            type: 'email',
            recipient: 'admin@stigg.ca',
            subject: `Newsletter Sent: ${campaign.subject}`,
            message: `Newsletter campaign "${campaign.title}" has been automatically sent to ${subscribers?.length || 0} subscribers.\n\nSubject: ${campaign.subject}\nSent: ${new Date(now).toLocaleString()}`,
            metadata: {
              type: 'newsletter_sent',
              campaignId: campaign.id,
              recipientCount: subscribers?.length || 0,
            },
          }]);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sentCount: sentCampaigns.length,
        sentCampaigns,
        errors: errors.length > 0 ? errors : undefined,
        message: `Sent ${sentCampaigns.length} newsletter campaign(s)`,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in send-scheduled-newsletters:', error);
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