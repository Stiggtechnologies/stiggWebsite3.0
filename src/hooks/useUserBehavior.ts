import { useState, useEffect } from 'react';

interface UserBehavior {
  pagesVisited: string[];
  timeOnSite: number;
  scrollDepth: number;
  interactions: number;
  referrer: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useUserBehavior = () => {
  const [behavior, setBehavior] = useState<UserBehavior>({
    pagesVisited: [],
    timeOnSite: 0,
    scrollDepth: 0,
    interactions: 0,
    referrer: document.referrer || 'direct',
    deviceType: getDeviceType()
  });

  const [sessionStart] = useState(Date.now());

  function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Track page visits
  useEffect(() => {
    const currentPath = window.location.pathname;
    setBehavior(prev => ({
      ...prev,
      pagesVisited: prev.pagesVisited.includes(currentPath) 
        ? prev.pagesVisited 
        : [...prev.pagesVisited, currentPath]
    }));
  }, []);

  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setBehavior(prev => ({
        ...prev,
        timeOnSite: Math.floor((Date.now() - sessionStart) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStart]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setBehavior(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercent)
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track interactions
  const trackInteraction = (type: string, data?: any) => {
    setBehavior(prev => ({
      ...prev,
      interactions: prev.interactions + 1
    }));

    // Log interaction for analytics
    console.log('User interaction:', { type, data, timestamp: Date.now() });
  };

  // Determine if user should see lead capture
  const shouldShowLeadCapture = () => {
    const { timeOnSite, scrollDepth, pagesVisited, interactions } = behavior;
    
    // AI-based trigger conditions
    const conditions = [
      timeOnSite > 120 && scrollDepth > 50, // Engaged reader
      pagesVisited.length > 2, // Multi-page visitor
      pagesVisited.includes('/services') || pagesVisited.includes('/quote'), // High-intent pages
      interactions > 3 // Active user
    ];

    return conditions.some(condition => condition);
  };

  return {
    behavior,
    trackInteraction,
    shouldShowLeadCapture
  };
};