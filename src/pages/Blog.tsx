import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { allBlogPosts as staticBlogPosts, getFeaturedPosts as getStaticFeaturedPosts, getAllCategories as getStaticCategories } from '../data/blogPosts';
import { getAllPosts, getFeaturedPosts as getDbFeaturedPosts, getAllCategories as getDbCategories } from '../services/blogService';
import { NewsletterSignup } from '../components/NewsletterSignup';
import type { BlogPost } from '../data/blogPosts';

export const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>(getStaticFeaturedPosts());
  const [categories, setCategories] = useState<string[]>(['All', ...getStaticCategories()]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      // Try to load from database first
      const [posts, featured, cats] = await Promise.all([
        getAllPosts(),
        getDbFeaturedPosts(),
        getDbCategories()
      ]);

      // If we got data from database, use it
      if (posts.length > 0) {
        setBlogPosts(posts);
        setFeaturedPosts(featured.length > 0 ? featured : posts.slice(0, 3));
        setCategories(['All', ...cats]);
      }
      // Otherwise, keep using static data as fallback
    } catch (error) {
      console.error('Error loading blog data:', error);
      // Fallback to static data (already initialized)
    } finally {
      setLoading(false);
    }
  };

  const featuredPost = featuredPosts[0] || blogPosts[0];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Security Blog | Industry Trends, AI Surveillance, Alberta Tips"
        description="Read expert insights on property protection, security guard trends, AI surveillance, and commercial security best practices in Alberta."
        keywords="security blog, industry trends, AI surveillance, alberta security tips, property protection"
        canonicalUrl="/blog"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security Insights & Tips
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Stay informed with the latest security trends, best practices, and expert advice.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-red-100 text-stigg-red px-3 py-1 rounded-full text-sm font-medium mr-2">
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-gray-500">{featuredPost.readTime} min read</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="mr-4">{featuredPost.date}</span>
                    <User className="h-4 w-4 mr-2" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-800 transition-colors inline-flex items-center"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-red-100 hover:text-stigg-red transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-red-100 text-stigg-red px-3 py-1 rounded-full text-sm font-medium mr-2">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime} min</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="mr-4">{post.date}</span>
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-stigg-red hover:text-stigg-800 font-semibold inline-flex items-center"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Stay Ahead of Security Trends</h2>
          <p className="text-xl text-gray-200 mb-8">
            Get expert insights, industry updates, and exclusive security tips delivered to your inbox.
          </p>
          <NewsletterSignup variant="inline" showBenefits={true} />
        </div>
      </section>
    </div>
  );
};