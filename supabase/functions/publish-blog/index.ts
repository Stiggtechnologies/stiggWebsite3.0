import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    const blogPosts = await req.json();

    const results = [];

    for (const post of blogPosts) {
      // Check if exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(post)
          .eq('id', existing.id);

        results.push({
          slug: post.slug,
          action: 'updated',
          success: !error,
          error: error?.message
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([post]);

        results.push({
          slug: post.slug,
          action: 'inserted',
          success: !error,
          error: error?.message
        });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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
