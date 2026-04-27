import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  schema?: 'Article' | 'LocalBusiness' | 'WebPage' | 'Service';
  article?: {
    datePublished?: string;
    dateModified?: string;
    author?: string;
    category?: string;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = '/security-hero.jpg',
  canonicalUrl,
  schema = 'WebPage',
  article
}) => {
  const fullTitle = title.includes('Stigg Security') ? title : `${title} | Stigg Security Inc.`;
  const baseUrl = 'https://www.stigg.ca';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const getStructuredData = () => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Stigg Security Inc.",
      "description": "Professional security services in Alberta including security guards, AI-powered surveillance, secure transport, and integrated security solutions.",
      "url": baseUrl,
      "telephone": "+1-780-743-1855",
      "email": "info@stigg.ca",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Alberta",
        "addressCountry": "CA"
      },
      "areaServed": [
        {"@type": "City", "name": "Fort McMurray"},
        {"@type": "City", "name": "Edmonton"},
        {"@type": "City", "name": "Calgary"},
        {"@type": "City", "name": "Red Deer"},
        {"@type": "City", "name": "Grande Prairie"}
      ],
      "priceRange": "$$",
      "sameAs": [
        "https://www.facebook.com/stiggsecurity",
        "https://www.linkedin.com/company/stigg-security"
      ],
      "logo": `${baseUrl}/logo.png`,
      "image": fullImageUrl
    };

    if (schema === 'Article' && article) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": fullImageUrl,
        "datePublished": article.datePublished || new Date().toISOString(),
        "dateModified": article.dateModified || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": article.author || "Stigg Security Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Stigg Security Inc.",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullCanonicalUrl
        },
        "articleSection": article.category,
        "keywords": keywords,
        "url": fullCanonicalUrl
      };
    }

    if (schema === 'Service') {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": title,
        "provider": organizationSchema,
        "areaServed": {
          "@type": "State",
          "name": "Alberta"
        },
        "description": description,
        "url": fullCanonicalUrl
      };
    }

    if (schema === 'LocalBusiness') {
      return organizationSchema;
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": fullCanonicalUrl,
      "publisher": organizationSchema
    };
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={schema === 'Article' ? 'article' : 'website'} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Stigg Security Inc." />
      <meta property="og:locale" content="en_CA" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Article-specific tags */}
      {schema === 'Article' && article && (
        <>
          <meta property="article:published_time" content={article.datePublished || new Date().toISOString()} />
          <meta property="article:modified_time" content={article.dateModified || new Date().toISOString()} />
          <meta property="article:author" content={article.author || 'Stigg Security Team'} />
          {article.category && <meta property="article:section" content={article.category} />}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Schema.org Structured Data for AI Search */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>

      {/* Additional meta tags for AI search optimization */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="geo.region" content="CA-AB" />
      <meta name="geo.placename" content="Alberta" />
    </Helmet>
  );
};