import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Use service role key to bypass RLS when publishing
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  serviceKey || envVars.VITE_SUPABASE_ANON_KEY
);

// Sample blog posts to publish
const blogPosts = [
  {
    title: 'Why Every Alberta Business Needs Professional Security in 2025',
    slug: 'alberta-business-security-2025',
    seoTitle: 'Professional Security for Alberta Businesses in 2025 | Stigg Security',
    seoDescription: 'Discover why Alberta businesses need guards, cameras & access control in 2025. Protect assets, staff & reputation with Stigg Security.',
    seoKeywords: ['alberta business security', 'professional security 2025', 'business protection alberta', 'security guards alberta', 'commercial security'],
    excerpt: 'As Alberta\'s economy evolves, so do security threats. Learn why professional security is no longer optional for businesses in 2025.',
    content: `# Why Every Alberta Business Needs Professional Security in 2025

The security landscape in Alberta has dramatically changed. With rising property crimes, sophisticated cyber threats, and evolving workplace safety requirements, professional security is no longer a luxury—it's a necessity.

## The Current Security Climate in Alberta

Recent statistics show a 23% increase in commercial break-ins across Alberta in 2024. Fort McMurray and Calgary have seen particularly concerning trends in equipment theft, retail shrinkage, cybersecurity breaches, and workplace violence incidents.

## The Professional Security Advantage

Professional security services provide 24/7 monitoring with trained personnel, direct law enforcement coordination, emergency response protocols, and incident documentation for insurance and legal purposes. Modern security combines human expertise with advanced technology including AI-powered surveillance, mobile integration, and regulatory compliance support.

Contact Stigg Security today for a free assessment and discover how we can protect your Alberta business in 2025 and beyond.`,
    author: 'Security Expert Team',
    date: 'January 15, 2025',
    readTime: 8,
    category: 'Industry Trends',
    tags: ['Business Security', 'Alberta', '2025 Trends', 'Professional Security', 'Risk Management'],
    image: '/guards/guard head shot.jpeg',
    featured: true
  },
  {
    title: 'How AI Cameras Detect Employee Theft and Shoplifting in Real Time',
    slug: 'ai-cameras-detect-theft-real-time',
    seoTitle: 'AI Cameras Prevent Theft in Real Time | Stigg Security Alberta',
    seoDescription: 'Discover how AI-powered cameras detect employee theft and shoplifting instantly. Protect your Alberta business with Stigg Security\'s smart surveillance.',
    seoKeywords: ['AI cameras Alberta', 'retail theft prevention', 'security surveillance Fort McMurray', 'AI surveillance Canada', 'employee theft detection'],
    excerpt: 'AI-powered security cameras don\'t just record incidents—they analyze behavior in real time to detect and prevent theft before it happens.',
    content: `# How AI Cameras Detect Employee Theft and Shoplifting in Real Time

Employee theft and shoplifting cost Alberta businesses millions every year. Even with traditional cameras in place, most theft is discovered after the fact, when it's too late to recover losses.

## The AI Advantage

AI-powered security cameras analyze behavior in real time using behavioral analytics, object recognition, motion tracking, and instant alerts. The system learns normal patterns and flags deviations instantly.

### Real-World Results

A Fort McMurray electronics retailer saw shrinkage drop by 70% within 45 days of installing AI-powered cameras. The system caught patterns of after-hours product removal and provided clear evidence that led to two employee terminations.

### Cost Justification
- System cost: $12,000 initial investment
- Prevented losses: $45,000 in first year
- Insurance savings: $1,800 annually
- Net benefit: $34,800 first year

Book a free demo of our AI-powered surveillance system today to see how intelligent monitoring can protect your Alberta business in real time.`,
    author: 'Security Technology Team',
    date: 'October 14, 2025',
    readTime: 8,
    category: 'Technology',
    tags: ['AI Cameras', 'Theft Prevention', 'Retail Security', 'Employee Theft', 'Smart Surveillance'],
    image: '/alarm1 (1).jpg',
    featured: true
  },
  {
    title: 'Security Guards vs. AI-Powered Cameras',
    slug: 'security-guards-vs-ai-cameras',
    seoTitle: 'Security Guards vs AI Cameras: Which Is Right for Your Alberta Business?',
    seoDescription: 'Compare security guards and AI-powered cameras. Learn which solution suits your Alberta property — or why a hybrid system works best.',
    seoKeywords: ['security guards vs cameras', 'ai security cameras', 'alberta security comparison', 'hybrid security systems', 'security solutions'],
    excerpt: 'Comparing human security guards with AI-powered surveillance to help you choose the best protection for your property.',
    content: `# Security Guards vs. AI-Powered Cameras: The Ultimate Comparison

Choosing between security guards and AI-powered cameras is one of the most important decisions for property protection.

## Security Guards: The Human Advantage

Professional security guards provide immediate physical response, customer service integration, complex situation handling, and legal authority. They're essential for high-traffic retail environments, events and gatherings, and properties requiring customer interaction.

## AI Cameras: The Technology Edge

AI surveillance systems offer 24/7 consistent monitoring, advanced detection capabilities, cost efficiency, and comprehensive coverage. They excel at large perimeter monitoring, remote facilities, and after-hours surveillance.

## The Hybrid Approach

The most effective security strategies combine both technologies. A Calgary retail chain achieved a 75% reduction in theft and 40% cost savings by using AI cameras for loss prevention monitoring combined with security guards for customer interaction.

Contact Stigg Security for a free assessment and discover the perfect security solution for your property.`,
    author: 'Michael Chen',
    date: 'January 12, 2025',
    readTime: 10,
    category: 'Technology',
    tags: ['Security Guards', 'AI Cameras', 'Comparison', 'Technology', 'Cost Analysis'],
    image: '/slide-1.jpg',
    featured: true
  }
];

async function publishBlogPosts() {
  console.log(`📝 Publishing ${blogPosts.length} blog posts to Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of blogPosts) {
    try {
      const dbPost = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        published_at: new Date(post.date).toISOString(),
        read_time: post.readTime,
        category: post.category,
        tags: post.tags,
        image_url: post.image,
        featured: post.featured,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
        seo_keywords: post.seoKeywords,
        status: 'published',
        view_count: 0
      };

      const { data: existing, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`❌ Error checking "${post.title}":`, checkError.message);
        errorCount++;
        continue;
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(dbPost)
          .eq('id', existing.id);

        if (updateError) {
          console.error(`❌ Error updating "${post.title}":`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated: ${post.title}`);
          successCount++;
        }
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([dbPost]);

        if (insertError) {
          console.error(`❌ Error inserting "${post.title}":`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ Published: ${post.title}`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Unexpected error with "${post.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total: ${blogPosts.length}`);
}

publishBlogPosts().catch(console.error);
