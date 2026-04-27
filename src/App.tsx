import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { AILeadCapture } from './components/AILeadCapture';
import { useUserBehavior } from './hooks/useUserBehavior';
import { trackPageView } from './services/analyticsService';
import { initializeAdvancedAnalytics } from './services/advancedAnalytics';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { SecureTransport } from './pages/SecureTransport';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Quote } from './pages/Quote';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { GuardHeadshotReview } from './components/GuardHeadshotReview';
import { AutomationDashboard } from './pages/AutomationDashboard';
import { BlogAdmin } from './pages/BlogAdmin';
import { BlogEditor } from './pages/BlogEditor';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { NewsletterManager } from './pages/NewsletterManager';
import { Analytics } from './pages/Analytics';
import { AdvancedAnalytics } from './pages/AdvancedAnalytics';

// Analytics tracker component
function AnalyticsTracker() {
  const location = useLocation();

  React.useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);

  return null;
}

function App() {
  const { behavior, shouldShowLeadCapture } = useUserBehavior();
  const [showLeadCapture, setShowLeadCapture] = React.useState(false);

  React.useEffect(() => {
    // Initialize advanced analytics once
    initializeAdvancedAnalytics();
  }, []);

  React.useEffect(() => {
    if (shouldShowLeadCapture() && !showLeadCapture) {
      // Delay showing lead capture to avoid being intrusive
      const timer = setTimeout(() => {
        setShowLeadCapture(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowLeadCapture, showLeadCapture]);

  return (
    <Router>
      <AnalyticsTracker />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/secure-transport-high-value-goods" element={<SecureTransport />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/guard-headshots-review" element={<GuardHeadshotReview />} />
            <Route path="/automation-dashboard" element={<AutomationDashboard />} />
            <Route path="/operations" element={<OperationsDashboard />} />
            <Route path="/newsletter-manager" element={<NewsletterManager />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analytics/advanced" element={<AdvancedAnalytics />} />
            <Route path="/blog-admin" element={<BlogAdmin />} />
            <Route path="/blog-admin/new" element={<BlogEditor />} />
            <Route path="/blog-admin/edit/:id" element={<BlogEditor />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotWidget />
        <AILeadCapture
          isVisible={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          userBehavior={behavior}
        />
      </div>
    </Router>
  );
}

export default App;