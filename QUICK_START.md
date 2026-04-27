# Quick Start: Blog Management System

## 🚀 You're Ready to Go!

Your database-driven blog management system is fully installed and ready to use.

## Step 1: Access the Admin Panel

Visit: **`/blog-admin`**

Example: `https://yourwebsite.com/blog-admin`

## Step 2: Create Your First Scheduled Post

1. Click **"New Post"**
2. Fill in the form:
   - **Title**: Your post title
   - **Content**: Write in Markdown
   - **Category**: Choose from dropdown
   - **Status**: Select "Scheduled"
   - **Publish Date**: Set future date
3. Click **"Save Post"**

✅ **Done!** The post will automatically publish on that date.

## For Your 6-Month Schedule

Repeat Step 2 for each post in your schedule:
- Post 1: Schedule for Week 1
- Post 2: Schedule for Week 2
- Post 3: Schedule for Week 3
- ...and so on

Each post will auto-publish on its scheduled date!

## Important: Enable Auto-Publishing

For posts to publish automatically, you need to set up a cron job (one-time setup).

**Choose one option:**

### Option A: Simple Client-Side Check (Easiest)
Add this to your `src/App.tsx`:

```typescript
import { autoPublishScheduledPosts } from './services/blogService';

// Inside your App component, add:
useEffect(() => {
  // Check on app load and every hour
  autoPublishScheduledPosts().catch(console.error);
  const interval = setInterval(() => {
    autoPublishScheduledPosts().catch(console.error);
  }, 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### Option B: Supabase Edge Function (Most Reliable)
See `AUTO_PUBLISH_SETUP.md` for complete instructions.

## Managing Posts

**View all posts**: `/blog-admin`
- Filter by Draft, Scheduled, or Published
- Edit any post (pencil icon)
- Delete posts (trash icon)
- View published posts (eye icon)

**Edit a post**: Click the pencil icon
**Delete a post**: Click the trash icon
**View stats**: See the dashboard at bottom

## Checking Public Blog

Your public blog automatically shows:
- **All published posts**: `/blog`
- **Individual posts**: `/blog/post-slug`

Scheduled posts won't appear until their publish date arrives.

## Need Help?

- **Full guide**: `BLOG_SYSTEM_GUIDE.md`
- **Auto-publish setup**: `AUTO_PUBLISH_SETUP.md`
- **Technical details**: `BLOG_SYSTEM_SUMMARY.md`

## ✅ Checklist

- [ ] Access `/blog-admin`
- [ ] Create a test scheduled post
- [ ] Set up auto-publish (choose one option above)
- [ ] Add your 6-month schedule
- [ ] Verify posts appear on `/blog` when published

---

**That's it! You're ready to schedule 6 months of blog posts.** 🎉

No more code changes needed for day-to-day blog management!
