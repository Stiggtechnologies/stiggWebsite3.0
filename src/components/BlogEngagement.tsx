import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, MessageCircle, Eye, Clock } from 'lucide-react';
import { BlogPost } from '../data/blogPosts';

interface BlogEngagementProps {
  post: BlogPost;
  onEngagement: (type: string, data: any) => void;
}

export const BlogEngagement: React.FC<BlogEngagementProps> = ({ post, onEngagement }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (article) {
        const scrollTop = window.scrollY;
        const docHeight = article.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const progress = Math.min(100, Math.max(0, scrollPercent * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time spent reading
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    onEngagement('like', { postId: post.id, liked: !liked });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onEngagement('bookmark', { postId: post.id, bookmarked: !bookmarked });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onEngagement('share', { postId: post.id, platform });
    }
    setShowShareMenu(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-stigg-red transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Engagement Panel */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 space-y-3 z-30 hidden lg:block">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
          title="Like this article"
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            bookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`}
          title="Bookmark this article"
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
            title="Share this article"
          >
            <Share2 className="h-5 w-5" />
          </button>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute left-12 top-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-1 min-w-[120px]">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Email
              </button>
            </div>
          )}
        </div>

        {/* Reading Stats */}
        <div className="text-center pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(timeSpent)}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(readingProgress)}%
          </div>
        </div>
      </div>

      {/* Mobile Engagement Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center space-y-1 ${
              liked ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs">Like</span>
          </button>

          <button
            onClick={handleBookmark}
            className={`flex flex-col items-center space-y-1 ${
              bookmarked ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
            <span className="text-xs">Save</span>
          </button>

          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex flex-col items-center space-y-1 text-gray-600"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </button>

          <div className="flex flex-col items-center space-y-1 text-gray-600">
            <Eye className="h-5 w-5" />
            <span className="text-xs">{Math.round(readingProgress)}%</span>
          </div>
        </div>
      </div>
    </>
  );
};