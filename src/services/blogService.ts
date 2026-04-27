import { supabase } from '../lib/supabase';
import type { BlogPost } from '../data/blogPosts';

// Convert database row to BlogPost format
function dbRowToBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: new Date(row.published_at || row.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: row.read_time,
    category: row.category,
    tags: row.tags,
    image: row.image_url || '/slide-1.jpg',
    featured: row.featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords
  };
}

// Fetch all published posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Fetch featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Fetch post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!data) return null;

  // Increment view count
  await incrementViewCount(slug);

  return dbRowToBlogPost(data);
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_post_view', { post_slug: slug });

  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

// Fetch posts by category
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Fetch all categories
export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('name')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.map(cat => cat.name);
}

// Fetch related posts
export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentPost.id)
    .or(`category.eq.${currentPost.category},tags.cs.{${currentPost.tags.join(',')}}`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Fetch recent posts
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .textSearch('title', query, { type: 'websearch' })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data.map(dbRowToBlogPost);
}

// Admin functions (require authentication)

// Create new blog post
export async function createPost(post: any) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  // Send admin notification
  try {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

    await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        type: 'blog_post',
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          author: data.author,
          category: data.category,
          status: data.status,
          publishDate: data.publish_date,
        },
      }),
    });
  } catch (notifError) {
    console.error('Error sending admin notification:', notifError);
  }

  return data;
}

// Update blog post
export async function updatePost(id: string, updates: any) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }

  // Send admin notification if published
  if (data && data.status === 'published' && updates.status === 'published') {
    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
      const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/functions/v1/admin-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          type: 'blog_post',
          data: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            author: data.author,
            category: data.category,
            status: data.status,
            publishDate: data.published_at,
          },
        }),
      });
    } catch (notifError) {
      console.error('Error sending admin notification:', notifError);
    }
  }

  return data;
}

// Delete blog post
export async function deletePost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Get all posts including drafts and scheduled (for admin)
export async function getAllPostsAdmin() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin posts:', error);
    throw error;
  }

  return data;
}

// Auto-publish scheduled posts (call this periodically)
export async function autoPublishScheduledPosts() {
  const { error } = await supabase.rpc('auto_publish_scheduled_posts');

  if (error) {
    console.error('Error auto-publishing posts:', error);
    throw error;
  }
}
