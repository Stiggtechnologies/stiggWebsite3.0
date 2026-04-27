/**
 * Migration Script: Move existing blog posts from static data to database
 *
 * Run this script once to migrate all existing blog posts to the database.
 * After migration, the app will use database posts, with static posts as fallback.
 */

import { supabase } from '../lib/supabase';
import { allBlogPosts } from '../data/blogPosts';

async function migrateBlogPosts() {
  console.log(`Starting migration of ${allBlogPosts.length} blog posts...`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of allBlogPosts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping "${post.title}" - already exists`);
        continue;
      }

      // Convert date string to ISO format
      const publishDate = new Date(post.date);

      // Insert the post
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          read_time: post.readTime,
          category: post.category,
          tags: post.tags,
          image_url: post.image,
          featured: post.featured,
          status: 'published',
          published_at: publishDate.toISOString(),
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          seo_keywords: post.seoKeywords,
          view_count: 0
        });

      if (error) {
        console.error(`Error migrating "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Migrated "${post.title}"`);
        successCount++;
      }
    } catch (error) {
      console.error(`Exception migrating "${post.title}":`, error);
      errorCount++;
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log(`Successfully migrated: ${successCount} posts`);
  console.log(`Failed: ${errorCount} posts`);
  console.log(`Total: ${allBlogPosts.length} posts`);
}

// Run migration
migrateBlogPosts()
  .then(() => {
    console.log('\nMigration finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
