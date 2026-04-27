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

    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('publish_date', now)
      .order('publish_date', { ascending: true });

    if (fetchError) {
      throw new Error(`Error fetching scheduled posts: ${fetchError.message}`);
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No posts to publish',
          publishedCount: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const publishedPosts = [];
    const errors = [];

    for (const post of scheduledPosts) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: now,
        })
        .eq('id', post.id);

      if (updateError) {
        errors.push({
          postId: post.id,
          title: post.title,
          error: updateError.message,
        });
      } else {
        publishedPosts.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          publishedAt: now,
        });

        await supabase
          .from('notifications')
          .insert([{
            type: 'email',
            recipient: 'admin@stigg.ca',
            subject: `Blog Published: ${post.title}`,
            message: `The blog post "${post.title}" has been automatically published.\n\nSlug: ${post.slug}\nPublished: ${new Date(now).toLocaleString()}\n\nView at: ${supabaseUrl.replace('supabase.co', 'ca')}/blog/${post.slug}`,
            metadata: {
              type: 'blog_published',
              postId: post.id,
              slug: post.slug,
            },
          }]);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        publishedCount: publishedPosts.length,
        publishedPosts,
        errors: errors.length > 0 ? errors : undefined,
        message: `Published ${publishedPosts.length} blog post(s)`,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in publish-scheduled-blogs:', error);
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