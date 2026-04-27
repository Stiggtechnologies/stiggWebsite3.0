/*
  # Blog Management System with Scheduling

  ## Overview
  This migration creates a comprehensive blog management system with scheduling capabilities,
  allowing for automated publishing of blog posts without requiring code changes.

  ## 1. New Tables
    
    ### `blog_posts`
    - `id` (uuid, primary key) - Unique identifier
    - `title` (text) - Blog post title
    - `slug` (text, unique) - URL-friendly slug
    - `excerpt` (text) - Short summary
    - `content` (text) - Full blog post content (markdown)
    - `author` (text) - Author name
    - `read_time` (integer) - Estimated read time in minutes
    - `category` (text) - Post category
    - `tags` (text[]) - Array of tags
    - `image_url` (text) - Featured image URL
    - `featured` (boolean) - Featured post flag
    - `status` (text) - draft, scheduled, published, archived
    - `publish_date` (timestamptz) - When to publish (for scheduled posts)
    - `published_at` (timestamptz) - Actual publication timestamp
    - `seo_title` (text) - SEO optimized title
    - `seo_description` (text) - SEO meta description
    - `seo_keywords` (text[]) - SEO keywords array
    - `view_count` (integer) - Number of views
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp
    - `created_by` (uuid) - User who created the post
    - `updated_by` (uuid) - User who last updated the post

    ### `blog_categories`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text, unique) - Category name
    - `slug` (text, unique) - URL-friendly slug
    - `description` (text) - Category description
    - `created_at` (timestamptz) - Creation timestamp

  ## 2. Security
    - Enable RLS on all tables
    - Public read access for published posts
    - Authenticated users can manage posts (for admin interface)
    - View counts can be updated by anyone

  ## 3. Indexes
    - Index on slug for fast lookups
    - Index on status and publish_date for scheduled post queries
    - Index on category for filtering
    - Full-text search index on title and content

  ## 4. Functions
    - Auto-publish function to check for scheduled posts
    - View counter function
    - Slug generator function
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Stigg Security Team',
  read_time integer DEFAULT 5,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  publish_date timestamptz,
  published_at timestamptz,
  seo_title text NOT NULL,
  seo_description text NOT NULL,
  seo_keywords text[] DEFAULT '{}',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories

-- Anyone can read categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  USING (true);

-- Authenticated users can manage categories
CREATE POLICY "Authenticated users can insert categories"
  ON blog_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON blog_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON blog_categories FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for blog_posts

-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR status = 'scheduled');

-- Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Anyone can increment view count (special policy)
CREATE POLICY "Anyone can update view count"
  ON blog_posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_publish ON blog_posts(status, publish_date);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || content || ' ' || excerpt));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET status = 'published',
      published_at = now()
  WHERE status = 'scheduled'
    AND publish_date <= now()
    AND published_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_post_view(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug
    AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Insert default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Industry Trends', 'industry-trends', 'Latest trends and insights in the security industry'),
  ('Technology', 'technology', 'Security technology and innovation'),
  ('Business Strategy', 'business-strategy', 'Strategic approaches to security'),
  ('Property Management', 'property-management', 'Security for property managers'),
  ('Event Security', 'event-security', 'Event security best practices'),
  ('Small Business', 'small-business', 'Security solutions for small businesses'),
  ('Crime Prevention', 'crime-prevention', 'Crime prevention strategies'),
  ('Access Control', 'access-control', 'Access control systems and solutions'),
  ('AI Technology', 'ai-technology', 'Artificial intelligence in security')
ON CONFLICT (slug) DO NOTHING;