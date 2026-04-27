const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Import blog posts from the data file
const { allBlogPosts } = require('./src/data/blogPosts.ts');

async function publishBlogPosts() {
  console.log(`📝 Publishing ${allBlogPosts.length} blog posts to Supabase...`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of allBlogPosts) {
    try {
      // Convert the post to the database format
      const dbPost = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author_name: post.author,
        published_at: new Date(post.date).toISOString(),
        read_time_minutes: post.readTime,
        category: post.category,
        tags: post.tags,
        featured_image_url: post.image,
        is_featured: post.featured,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
        seo_keywords: post.seoKeywords,
        status: 'published',
        view_count: 0
      };

      // Check if post already exists by slug
      const { data: existing, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`❌ Error checking post "${post.title}":`, checkError.message);
        errorCount++;
        continue;
      }

      if (existing) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(dbPost)
          .eq('id', existing.id);

        if (updateError) {
          console.error(`❌ Error updating post "${post.title}":`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated: ${post.title}`);
          successCount++;
        }
      } else {
        // Insert new post
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([dbPost]);

        if (insertError) {
          console.error(`❌ Error inserting post "${post.title}":`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ Published: ${post.title}`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Unexpected error with post "${post.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total: ${allBlogPosts.length}`);
}

publishBlogPosts().catch(console.error);
