# Auto-Publishing Setup for Scheduled Blog Posts

## How Auto-Publishing Works

When you schedule a blog post:
1. Set the post status to "Scheduled"
2. Set a future publish date
3. Save the post

The system will automatically publish the post on that date using the `auto_publish_scheduled_posts()` database function.

## Setup Options

### Option 1: Supabase Edge Function (Recommended)

Create a Supabase Edge Function that runs on a schedule:

```typescript
// supabase/functions/auto-publish-posts/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Call the auto-publish function
  const { error } = await supabase.rpc('auto_publish_scheduled_posts');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

Then set up a Supabase Cron Job to run this function hourly.

### Option 2: External Cron Service

Use a service like:
- **Vercel Cron** (if hosting on Vercel)
- **GitHub Actions** (scheduled workflow)
- **EasyCron** (external cron service)
- **Zapier** or **Make** (automation platforms)

Example GitHub Actions workflow:

```yaml
# .github/workflows/auto-publish.yml
name: Auto-Publish Scheduled Posts

on:
  schedule:
    - cron: '0 * * * *'  # Run every hour

jobs:
  auto-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Call auto-publish function
        run: |
          curl -X POST 'https://your-supabase-url.supabase.co/rest/v1/rpc/auto_publish_scheduled_posts' \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

### Option 3: Manual Database Trigger (PostgreSQL)

Set up a PostgreSQL cron extension in Supabase:

```sql
-- Enable pg_cron extension (ask Supabase support if not available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the auto-publish function to run every hour
SELECT cron.schedule(
  'auto-publish-posts',
  '0 * * * *',
  $$SELECT auto_publish_scheduled_posts()$$
);
```

### Option 4: Client-Side Check (Simplest)

Add this to your main App component:

```typescript
// In App.tsx or main layout
import { autoPublishScheduledPosts } from './services/blogService';

useEffect(() => {
  // Check for scheduled posts on app load
  autoPublishScheduledPosts().catch(console.error);

  // Check every hour
  const interval = setInterval(() => {
    autoPublishScheduledPosts().catch(console.error);
  }, 60 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

**Note**: This only works when someone visits your site, but may be sufficient for many use cases.

## Testing Auto-Publish

1. Create a test post
2. Set status to "Scheduled"
3. Set publish date to 1 minute from now
4. Wait and refresh the blog page
5. The post should appear automatically

## Manual Trigger

You can manually trigger auto-publishing by calling the function directly:

### Via Supabase Dashboard:
1. Go to SQL Editor
2. Run: `SELECT auto_publish_scheduled_posts();`

### Via API:
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/rpc/auto_publish_scheduled_posts' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Via Admin Panel:
You could add a "Publish Now" button in the admin interface.

## Monitoring

Check your scheduled posts in the admin panel (`/blog-admin`):
- Filter by "Scheduled" status
- See the scheduled publish date
- Monitor when posts go live

## Best Practices

1. **Schedule posts at consistent times** (e.g., always 9 AM)
2. **Test with near-future dates** before scheduling far in advance
3. **Keep buffer time** - don't schedule too close to current time
4. **Monitor your cron job** - ensure it's running reliably
5. **Set up alerts** if auto-publishing fails

## Troubleshooting

### Posts not auto-publishing?
- Check cron job is running
- Verify publish date format is correct
- Ensure status is exactly "scheduled"
- Check database function works: `SELECT auto_publish_scheduled_posts();`

### How to republish if something fails?
1. Go to `/blog-admin`
2. Edit the post
3. Change status back to "scheduled" or directly to "published"
4. Save

## Current Setup Status

✅ Database function created: `auto_publish_scheduled_posts()`
✅ Posts can be scheduled via admin panel
✅ Manual triggering works via SQL

⚠️ **Action Needed**: Set up one of the cron options above for automatic publishing

## Recommended: Option 1 (Supabase Edge Function)

This is the most reliable and doesn't depend on external services or client visits.

1. Create the edge function (shown above)
2. Set up Supabase Cron (available in Supabase dashboard)
3. Test with a near-future post
4. Monitor in Supabase logs

---

**Your scheduled posts are ready - just add a cron trigger using one of the options above!**
