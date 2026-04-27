// Optimized Asset Configuration for Stigg Security Inc.
// Strategic image placement with proper sizing and context alignment
// Mix of company photos and professional stock images

export const assets = {
  // Company Branding - Your actual company logo
  logo: {
    main: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400', // Professional security logo
    white: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400', // White version for dark backgrounds
    favicon: '/favicon.ico'
  },

  // Hero Images - Mix of company and stock photos
  hero: {
    main: '/banner.jpg', // Company banner
    about: '/about.jpg', // Company team photo
    services: '/guards/guard standing.webp', // Your security guard
    contact: '/guards/guard standing.webp', // Your guard standing
    blog: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1920', // Stock tech security
    quote: '/guards/Guard close up.webp' // Your guard close-up
  },

  // Service-Specific Assets - Your company photos with stock supplements
  services: {
    securityGuards: {
      main: '/guards/guard head shot.jpeg', // Your professional guard
      hero: '/guards/guard standing.webp', // Your guard standing
      gallery: [
        '/guards/guard head shot.jpeg', // Your guard photos
        '/guards/guard standing.webp',
        '/guards/Guard close up.webp',
        '/guards/guard Woman head shot.jpeg',
        '/guards/guard airport 2 .jpeg',
        'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock supplement
        'https://images.pexels.com/photos/8761744/pexels-photo-8761744.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock supplement
      ]
    },
    surveillance: {
      main: '/alarm1 (1).jpg', // Your surveillance equipment
      hero: '/slide-2.jpg', // Your monitoring setup
      gallery: [
        '/alarm1 (1).jpg', // Your equipment photos
        '/slide-2.jpg',
        '/auto.jpg',
        'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock CCTV
        'https://images.pexels.com/photos/96612/pexels-photo-96612.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock camera
        'https://images.pexels.com/photos/2582928/pexels-photo-2582928.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock surveillance system
      ]
    },
    virtualGuard: {
      main: '/slide-1.jpg', // Your AI monitoring
      hero: '/slide-1.jpg', // Your virtual security
      gallery: [
        '/slide-1.jpg', // Your tech photos
        '/Tech support.png',
        '/Onsite Tech.png',
        '/auto.jpg',
        'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock AI monitoring
        'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock tech
      ]
    },
    itSupport: {
      main: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock IT professional
      hero: '/Tech support.png', // Your tech team
      gallery: [
        'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock IT professional
        '/Tech support.png',
        '/Onsite Tech.png',
        'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock network installation
        'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock IT equipment
        'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock tech support
      ]
    }
  },

  // Team Photos - Your company team
  team: {
    guards: [
      '/guards/guard head shot.jpeg', // Your guard headshots
      '/guards/guard Woman head shot.jpeg',
      '/guards/Guard close up.webp',
      '/guards/guard standing.webp'
    ],
    technical: [
      '/Tech support.png', // Your tech team
      '/Onsite Tech.png',
      'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' // Stock supplement
    ]
  },

  // Company Vehicles & Field Operations - YOUR branded vehicles!
  operations: {
    vehicles: [
      '/stigg Van.jpeg', // YOUR Stigg branded vehicle - PRIMARY!
      '/Van contruction site.webp', // YOUR vehicle at construction site
      '/Van 3.webp', // YOUR vehicle angle
      'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock supplement
    ],
    fieldWork: [
      '/Van contruction site.webp', // YOUR active work site
      '/guards/guard airport 2 .jpeg', // YOUR field deployment
      'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock site
    ]
  },

  // Equipment & Technology - Your equipment with stock supplements
  equipment: {
    surveillance: [
      '/alarm1 (1).jpg', // YOUR surveillance equipment
      '/auto.jpg', // YOUR automated systems
      'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock camera
      'https://images.pexels.com/photos/96612/pexels-photo-96612.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock surveillance
    ],
    it: [
      'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800', // Stock network installation
      '/Tech support.png', // YOUR tech support
      '/Onsite Tech.png', // YOUR onsite tech
      'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock IT
    ]
  },

  // Blog & Content Images - Mix of your photos and stock
  blog: {
    defaultThumbnail: '/slide-1.jpg', // Your default
    categories: {
      technology: '/slide-1.jpg', // Your tech
      guards: '/guards/guard head shot.jpeg', // Your guards
      surveillance: '/alarm1 (1).jpg', // Your surveillance
      vehicles: '/stigg Van.jpeg', // YOUR branded van!
      it: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=400', // Stock IT professional
      cybersecurity: '/Tech support.png', // Your tech support
      emergency: '/guards/guard airport 2 .jpeg', // Your emergency response
      stock_tech: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=400', // Stock supplement
      stock_security: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400' // Stock supplement
    }
  },

  // Client Testimonials - Your company photos
  testimonials: {
    backgrounds: [
      '/about.jpg', // Your business setting
      '/guards/guard head shot.jpeg', // Your security professional
      '/stigg Van.jpeg', // YOUR service delivery!
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800' // Stock supplement
    ]
  },

  // Page-specific optimized images - Your photos prioritized
  pages: {
    home: {
      hero: '/banner.jpg', // YOUR banner
      services: '/guards/guard head shot.jpeg', // YOUR guard
      testimonials: '/about.jpg' // YOUR team
    },
    about: {
      hero: '/about.jpg', // YOUR team/company
      story: '/stigg Van.jpeg', // YOUR company vehicle!
      values: '/guards/guard head shot.jpeg' // YOUR professional
    },
    contact: {
      hero: '/guards/guard standing.webp', // YOUR approachable guard
      office: '/about.jpg' // YOUR office
    }
  },

  // Fallback images - Your photos first, stock as backup
  fallback: {
    hero: '/banner.jpg', // YOUR banner
    service: '/guards/guard head shot.jpeg', // YOUR guard
    team: '/guards/guard head shot.jpeg', // YOUR headshot
    equipment: '/alarm1 (1).jpg', // YOUR equipment
    vehicle: '/stigg Van.jpeg' // YOUR branded vehicle!
  }
};

// Enhanced utility functions with context awareness
export const getAsset = (path: string): string => {
  const keys = path.split('.');
  let current: any = assets;

  for (const key of keys) {
    if (current[key]) {
      current = current[key];
    } else {
      return assets.fallback.hero;
    }
  }

  return typeof current === 'string' ? current : assets.fallback.hero;
};

export const getServiceImage = (serviceId: string): string => {
  switch (serviceId) {
    case 'security-guards':
      return assets.services.securityGuards.main;
    case 'surveillance':
      return assets.services.surveillance.main;
    case 'virtual-guard':
      return assets.services.virtualGuard.main;
    case 'it-support':
      return assets.services.itSupport.main;
    default:
      return assets.fallback.service;
  }
};

export const getContextualImage = (context: string, category?: string): string => {
  switch (context) {
    case 'hero':
      return assets.hero.main;
    case 'professional':
      return assets.services.securityGuards.main;
    case 'technology':
      return assets.services.virtualGuard.main;
    case 'team':
      return assets.team.guards[0];
    case 'vehicle':
      return assets.operations.vehicles[0];
    case 'blog':
      return category ? (assets.blog.categories[category as keyof typeof assets.blog.categories] || assets.blog.defaultThumbnail) : assets.blog.defaultThumbnail;
    default:
      return assets.fallback.hero;
  }
};

export const getRandomGuardImage = (): string => {
  const guards = assets.team.guards;
  return guards[Math.floor(Math.random() * guards.length)];
};

export const getServiceGallery = (serviceId: string): string[] => {
  switch (serviceId) {
    case 'security-guards':
      return assets.services.securityGuards.gallery;
    case 'surveillance':
      return assets.services.surveillance.gallery;
    case 'virtual-guard':
      return assets.services.virtualGuard.gallery;
    case 'it-support':
      return assets.services.itSupport.gallery;
    default:
      return [assets.fallback.service];
  }
};

// Image optimization utilities
export const getOptimizedImageProps = (imagePath: string, context: 'hero' | 'card' | 'thumbnail' | 'gallery') => {
  const baseProps = {
    src: imagePath,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };

  switch (context) {
    case 'hero':
      return {
        ...baseProps,
        className: 'w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover object-center',
        sizes: '100vw'
      };
    case 'card':
      return {
        ...baseProps,
        className: 'w-full h-48 md:h-56 object-cover object-center',
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      };
    case 'thumbnail':
      return {
        ...baseProps,
        className: 'w-full h-32 md:h-40 object-cover object-center',
        sizes: '(max-width: 768px) 50vw, 25vw'
      };
    case 'gallery':
      return {
        ...baseProps,
        className: 'w-full h-40 md:h-48 object-cover object-center cursor-pointer hover:opacity-90 transition-opacity',
        sizes: '(max-width: 768px) 50vw, 33vw'
      };
    default:
      return baseProps;
  }
};
