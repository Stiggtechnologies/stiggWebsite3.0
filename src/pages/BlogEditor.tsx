import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar } from 'lucide-react';
import { createPost, updatePost, getAllPostsAdmin } from '../services/blogService';
import { getAllCategories } from '../services/blogService';

export const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewPost = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Stigg Security Team',
    read_time: 5,
    category: '',
    tags: '',
    image_url: '',
    featured: false,
    status: 'draft' as 'draft' | 'scheduled' | 'published',
    publish_date: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    if (!isNewPost) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    const cats = await getAllCategories();
    setCategories(cats);
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const posts = await getAllPostsAdmin();
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          read_time: post.read_time,
          category: post.category,
          tags: post.tags.join(', '),
          image_url: post.image_url || '',
          featured: post.featured,
          status: post.status,
          publish_date: post.publish_date ? post.publish_date.split('T')[0] : '',
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          seo_keywords: post.seo_keywords.join(', ')
        });
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seo_title: prev.seo_title || title
    }));
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: calculateReadTime(content)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo_keywords: formData.seo_keywords.split(',').map(k => k.trim()).filter(Boolean),
        publish_date: formData.status === 'scheduled' && formData.publish_date
          ? new Date(formData.publish_date).toISOString()
          : null,
        published_at: formData.status === 'published' && !formData.publish_date
          ? new Date().toISOString()
          : null
      };

      if (isNewPost) {
        await createPost(postData);
      } else {
        await updatePost(id!, postData);
      }

      alert('Post saved successfully!');
      navigate('/blog-admin');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/blog-admin"
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNewPost ? 'Create New Post' : 'Edit Post'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isNewPost ? 'Write and schedule your blog post' : 'Update your blog post'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /blog/{formData.slug || 'your-post-slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="Brief summary of the post"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content (Markdown) *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent font-mono text-sm"
                placeholder="Write your post content in Markdown format..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use Markdown formatting: # for headers, ** for bold, - for lists, etc.
              </p>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="Security, AI, Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="/path-to-image.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-stigg-red focus:ring-stigg-red border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured Post (show prominently on blog page)
                </label>
              </div>
            </div>
          </div>

          {/* SEO Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description *
                </label>
                <textarea
                  required
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="Meta description for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          {/* Publishing Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Publishing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Publish Date *
                  </label>
                  <input
                    type="date"
                    required={formData.status === 'scheduled'}
                    value={formData.publish_date}
                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stigg-red focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Post will be automatically published on this date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              to="/blog-admin"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-800 transition-colors inline-flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
