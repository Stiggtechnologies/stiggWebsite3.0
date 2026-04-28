import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          read_time: number;
          category: string;
          tags: string[];
          image_url: string | null;
          featured: boolean;
          status: 'draft' | 'scheduled' | 'published' | 'archived';
          publish_date: string | null;
          published_at: string | null;
          seo_title: string;
          seo_description: string;
          seo_keywords: string[];
          view_count: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author?: string;
          read_time?: number;
          category: string;
          tags?: string[];
          image_url?: string | null;
          featured?: boolean;
          status?: 'draft' | 'scheduled' | 'published' | 'archived';
          publish_date?: string | null;
          published_at?: string | null;
          seo_title: string;
          seo_description: string;
          seo_keywords?: string[];
          view_count?: number;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          read_time?: number;
          category?: string;
          tags?: string[];
          image_url?: string | null;
          featured?: boolean;
          status?: 'draft' | 'scheduled' | 'published' | 'archived';
          publish_date?: string | null;
          published_at?: string | null;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          view_count?: number;
          updated_by?: string | null;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
        };
      };
    };
  };
};
