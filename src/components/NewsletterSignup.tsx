import React, { useState } from 'react';
import { Mail, CheckCircle, Loader, Gift, TrendingUp, Shield } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  showBenefits?: boolean;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  variant = 'inline', 
  showBenefits = true 
}) => {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [leadScore, setLeadScore] = useState(0);

  const interestOptions = [
    { id: 'security-guards', label: 'Security Guard Services', score: 25 },
    { id: 'surveillance', label: 'Surveillance Systems', score: 20 },
    { id: 'virtual-guard', label: 'Virtual Security', score: 30 },
    { id: 'it-support', label: 'IT Security', score: 15 },
    { id: 'emergency-response', label: 'Emergency Planning', score: 10 },
    { id: 'industry-news', label: 'Industry News', score: 5 }
  ];

  const benefits = [
    { icon: TrendingUp, text: 'Weekly security industry insights' },
    { icon: Shield, text: 'Exclusive security tips and best practices' },
    { icon: Gift, text: 'Free security assessment guide' }
  ];

  const handleInterestChange = (interestId: string) => {
    const newInterests = interests.includes(interestId)
      ? interests.filter(id => id !== interestId)
      : [...interests, interestId];
    
    setInterests(newInterests);
    
    // Calculate AI lead score based on interests
    const score = newInterests.reduce((total, id) => {
      const option = interestOptions.find(opt => opt.id === id);
      return total + (option?.score || 0);
    }, 0);
    setLeadScore(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { subscribeToNewsletter } = await import('../services/contactService');
      await subscribeToNewsletter({
        email,
        interests
      });

      setIsSubscribed(true);

      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
        setInterests([]);
        setLeadScore(0);
      }, 3000);
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      if (error.message?.includes('already subscribed')) {
        alert('This email is already subscribed to our newsletter.');
      }
      setIsSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Our Community!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for subscribing. Check your email for your free security assessment guide.
        </p>
        {leadScore > 50 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-800 text-sm">
              <strong>Priority Lead Detected:</strong> Our security consultant will contact you within 24 hours 
              to discuss your specific security needs.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${variant === 'modal' ? 'max-w-md mx-auto' : 'w-full'} ${variant === 'inline' ? 'bg-white' : ''}`}>
      <div className="text-center mb-6">
        <div className={`${variant === 'inline' ? 'bg-stigg-red text-white' : 'bg-white bg-opacity-20 text-white'} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Mail className="h-6 w-6" />
        </div>
        <h3 className={`text-2xl font-bold ${variant === 'inline' ? 'text-gray-900' : 'text-white'} mb-2`}>
          Join Our Security Community
        </h3>
        <p className={variant === 'inline' ? 'text-gray-700' : 'text-gray-200'}>
          Weekly insights, tips, and industry updates from security experts.
        </p>
      </div>

      {showBenefits && (
        <div className="mb-6">
          <h4 className={`text-sm font-semibold ${variant === 'inline' ? 'text-gray-900' : 'text-white'} mb-3`}>What you'll receive:</h4>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex items-center text-sm ${variant === 'inline' ? 'text-gray-700' : 'text-gray-200'}`}>
                <benefit.icon className={`h-4 w-4 ${variant === 'inline' ? 'text-stigg-red' : 'text-white'} mr-3`} />
                {benefit.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={`block text-sm font-medium ${variant === 'inline' ? 'text-gray-900' : 'text-white'} mb-2`}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${variant === 'inline' ? 'focus:ring-stigg-red' : 'focus:ring-white'} text-gray-900 placeholder-gray-500 bg-white`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${variant === 'inline' ? 'text-gray-900' : 'text-white'} mb-3`}>
            What security topics interest you? (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {interestOptions.map((option) => (
              <label key={option.id} className={`flex items-center ${variant === 'inline' ? 'text-gray-800' : 'text-white'}`}>
                <input
                  type="checkbox"
                  checked={interests.includes(option.id)}
                  onChange={() => handleInterestChange(option.id)}
                  className={`rounded border-gray-300 ${variant === 'inline' ? 'text-stigg-red focus:ring-stigg-red' : 'text-white focus:ring-white'} bg-white`}
                />
                <span className={`ml-2 text-sm ${variant === 'inline' ? 'text-gray-700' : 'text-gray-200'}`}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {leadScore > 0 && (
          <div className={`${variant === 'inline' ? 'bg-blue-50 border border-blue-200' : 'bg-white bg-opacity-20 border border-white border-opacity-30'} rounded-lg p-3`}>
            <p className={`${variant === 'inline' ? 'text-blue-800' : 'text-white'} text-sm`}>
              <strong>AI Assessment:</strong> Based on your interests, you may benefit from a 
              {leadScore > 50 ? ' priority consultation' : ' security assessment'}.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className={`w-full ${variant === 'inline' ? 'bg-stigg-red text-white hover:bg-stigg-red-dark' : 'bg-white text-gray-900 hover:bg-gray-100'} py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm`}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Subscribing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </button>

        <p className={`text-xs ${variant === 'inline' ? 'text-gray-600' : 'text-gray-300'} text-center`}>
          We respect your privacy. Unsubscribe at any time. No spam, ever.
        </p>
      </form>
    </div>
  );
};