import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { getPostBySlug as getStaticPostBySlug, getRelatedPosts as getStaticRelatedPosts } from '../data/blogPosts';
import { getPostBySlug as getDbPostBySlug, getRelatedPosts as getDbRelatedPosts } from '../services/blogService';
import { BlogEngagement } from '../components/BlogEngagement';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { useUserBehavior } from '../hooks/useUserBehavior';
import type { BlogPost as BlogPostType } from '../data/blogPosts';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackInteraction } = useUserBehavior();

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);

      // Try database first
      const dbPost = await getDbPostBySlug(postSlug);

      if (dbPost) {
        setPost(dbPost);
        const related = await getDbRelatedPosts(dbPost, 3);
        setRelatedPosts(related);
      } else {
        // Fallback to static data
        const staticPost = getStaticPostBySlug(postSlug);
        if (staticPost) {
          setPost(staticPost);
          setRelatedPosts(getStaticRelatedPosts(staticPost, 3));
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      // Fallback to static data
      const staticPost = slug ? getStaticPostBySlug(slug) : null;
      if (staticPost) {
        setPost(staticPost);
        setRelatedPosts(getStaticRelatedPosts(staticPost, 3));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stigg-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-800 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleEngagement = (type: string, data: any) => {
    trackInteraction(type, data);
    // In a real app, this would send data to analytics service
    console.log('Blog engagement:', { type, data, postId: post.id });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={post.seoTitle}
        description={post.seoDescription}
        keywords={post.seoKeywords.join(', ')}
        canonicalUrl={`/blog/${post.slug}`}
        schema="Article"
        article={{
          datePublished: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
          dateModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
          author: post.author,
          category: post.category
        }}
      />
      
      {/* Blog Engagement Component */}
      <BlogEngagement post={post} onEngagement={handleEngagement} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link to="/blog" className="text-blue-200 hover:text-white inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </nav>
          
          <div className="mb-6">
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
              {post.category}
            </span>
            <span className="text-blue-200 text-sm">
              {post.readTime} minute read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center text-blue-100 space-x-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover object-center rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Article Body */}
            <div 
              className="prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-stigg-red prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:text-gray-700 prose-ul:space-y-2 prose-ol:text-gray-700 prose-ol:space-y-2 prose-li:mb-2 prose-li:leading-relaxed prose-a:text-stigg-red prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-blockquote:border-l-4 prose-blockquote:border-stigg-red prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800 max-w-none"
              dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }}
            />
            
            {/* Tags */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-5 w-5 text-gray-500 mr-2" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-stigg-red" />
                About the Author
              </h3>
              <p className="text-gray-800 leading-relaxed">
                <strong>{post.author}</strong> is a security industry expert with extensive experience in 
                {post.category.toLowerCase()} and comprehensive security solutions. 
                They regularly contribute insights on the latest security trends and best practices.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Newsletter Signup */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                <NewsletterSignup variant="inline" showBenefits={false} />
              </div>
              
              {/* CTA */}
              <div className="bg-stigg-red text-white p-6 rounded-lg text-center shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Need Professional Security Services?</h3>
                <p className="mb-6 text-white opacity-90">
                  Our expert team can help implement the security solutions discussed in this article.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/quote"
                    className="bg-white text-stigg-red px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md"
                  >
                    Get Free Quote
                  </Link>
                  <Link
                    to="/contact"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-stigg-red transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-red-100 text-stigg-red px-3 py-1 rounded-full text-sm font-medium mr-2">
                        {relatedPost.category}
                      </span>
                      <span className="text-xs text-gray-500">{relatedPost.readTime} min</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {relatedPost.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-stigg-red hover:text-stigg-red-dark font-semibold text-sm inline-flex items-center"
                    >
                      Read More
                      <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Helper function to format blog content with proper HTML structure
function formatBlogContent(content: string): string {
  return content
    // Convert markdown headers to HTML
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 scroll-mt-20">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b-2 border-gray-200 pb-2 scroll-mt-20">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-stigg-red mb-3 mt-6 scroll-mt-20">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold text-gray-900 mb-2 mt-4 scroll-mt-20">$1</h4>')
    
    // Convert markdown links to HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-stigg-red hover:text-stigg-red-dark underline font-medium">$1</a>')
    
    // Convert markdown bold to HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    
    // Convert markdown italic to HTML
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    
    // Convert markdown code to HTML
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-900 border">$1</code>')
    
    // Convert markdown unordered lists to HTML with better styling
    .replace(/^- (.*$)/gm, '<li class="flex items-start mb-3"><span class="w-2 h-2 bg-stigg-red rounded-full mr-3 mt-2 flex-shrink-0"></span><span class="text-gray-800 leading-relaxed">$1</span></li>')
    .replace(/(<li class="flex.*?<\/li>\s*)+/gs, '<ul class="space-y-2 mb-6">$&</ul>')
    
    // Convert numbered lists with better styling
    .replace(/^(\d+)\. (.*$)/gm, '<li class="flex items-start mb-3"><span class="bg-stigg-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">$1</span><span class="text-gray-800 leading-relaxed">$2</span></li>')
    .replace(/(<li class="flex.*?numbered.*?<\/li>\s*)+/gs, '<ol class="space-y-2 mb-6">$&</ol>')
    
    // Convert paragraphs with better spacing
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/^(?!<[h|u|o|l])(.+)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed">$1</p>')
    
    // Clean up extra paragraph tags
    .replace(/<p><\/p>/g, '')
    .replace(/<p class="[^"]*">(<[h|u|o|l])/g, '$1')
    .replace(/(<\/[h|u|o|l][^>]*>)<\/p>/g, '$1')
    
    // Add section breaks for better readability
    .replace(/(<h2[^>]*>.*?<\/h2>)/g, '<div class="mt-10 mb-6">$1</div>')
    .replace(/(<h3[^>]*>.*?<\/h3>)/g, '<div class="mt-8 mb-4">$1</div>');
}