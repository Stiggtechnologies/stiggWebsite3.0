# Automatic Deployment Setup for stigg.ca

This guide will set up automatic deployment so every code change automatically updates your live website.

## Option 1: Netlify (Recommended - Free & Easy)

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it `stigg-security` (or any name you prefer)
   - Make it private or public
   - Don't initialize with README (we already have code)

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/stigg-security.git
   git add .
   git commit -m "Initial commit with automatic deployment setup"
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. **Sign up/Login to Netlify:**
   - Go to https://netlify.com
   - Sign up with GitHub (easiest option)

2. **Import your repository:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your `stigg-security` repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Configure environment variables:**
   - In Netlify dashboard: Site settings → Environment variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://nabhqadhqehpxogvzuwu.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYmhxYWRocWVocHhvZ3Z6dXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU4ODIsImV4cCI6MjA3NTk3MTg4Mn0.w_0joKojLI0YSP8e6Ng6KaKY13w0aj8SpkrUcoRHicQ
     VITE_OPENAI_API_KEY=your_openai_key_here
     ```

4. **Deploy:**
   - Click "Deploy site"
   - Wait 2-3 minutes for initial build

### Step 3: Connect Your Domain (stigg.ca)

1. **In Netlify dashboard:**
   - Go to Domain settings
   - Click "Add custom domain"
   - Enter `stigg.ca`
   - Click "Verify"

2. **Update DNS settings at your domain registrar:**
   - Add these DNS records:

   **For Apex Domain (stigg.ca):**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

3. **Enable HTTPS:**
   - Netlify will auto-provision SSL certificate
   - Takes 5-10 minutes after DNS propagation

### Step 4: Automatic Deployments

✅ **You're done!** Now whenever you:
- Push code to GitHub → Netlify automatically rebuilds and deploys
- Publish blog posts in Supabase → Website pulls them automatically
- Make any changes → Live in 2-3 minutes

---

## Option 2: Vercel (Alternative)

### Quick Setup:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add environment variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_OPENAI_API_KEY
   ```

4. **Connect domain:**
   - Follow prompts to add stigg.ca
   - Update DNS to point to Vercel

---

## How It Works

### Automatic Deployment Flow:

```
You make changes → Push to GitHub → Netlify detects change →
Builds project → Runs tests → Deploys to stigg.ca → Live in 2-3 min
```

### Blog Posts:

```
Create blog in Supabase → Publish → Instantly visible on stigg.ca
(No deployment needed - data comes from database)
```

### Future Updates:

```bash
# Make your changes
git add .
git commit -m "Updated X feature"
git push

# That's it! Live in 2-3 minutes automatically
```

---

## Monitoring & Rollback

### View Deployments:
- Netlify dashboard shows all deployments
- See build logs, errors, and status
- Each deployment gets unique URL for testing

### Rollback:
- Click any previous deployment
- Click "Publish deploy"
- Instant rollback to that version

---

## Benefits

✅ **Automatic updates** - Push code, it goes live
✅ **Preview builds** - Test before going live
✅ **Instant rollback** - One-click revert to any version
✅ **Free SSL** - Automatic HTTPS certificates
✅ **CDN** - Global fast loading
✅ **Build logs** - See what went wrong if issues occur
✅ **Branch deployments** - Test features before merging

---

## Troubleshooting

### Build fails:
- Check build logs in Netlify dashboard
- Verify environment variables are set correctly

### Domain not connecting:
- DNS can take 24-48 hours to propagate
- Verify DNS records are correct

### Blog posts not showing:
- Check Supabase connection
- Verify RLS policies allow public reads
- Check browser console for errors

---

## Next Steps

1. Push code to GitHub
2. Connect to Netlify
3. Add domain
4. Start making changes with confidence!

Every future update will automatically deploy to stigg.ca.
