import React, { useState, useEffect } from 'react';
import { CheckCircle, Phone, Mail } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { useQuoteAutomation } from '../hooks/useQuoteAutomation';
import { trackFormEvent, trackConversion } from '../services/analyticsService';

export const Quote: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    propertyType: '',
    securityConcerns: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const { submitQuoteRequest, isSubmitting: isAutomating } = useQuoteAutomation();

  useEffect(() => {
    trackFormEvent('quote', 'view');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (!formStarted) {
      setFormStarted(true);
      trackFormEvent('quote', 'start');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    trackFormEvent('quote', 'submit');

    try {
      const automationResponse = await submitQuoteRequest(formData);

      if (automationResponse.success) {
        console.log('Quote automation triggered:', automationResponse);
        trackFormEvent('quote', 'success');
        trackConversion('quote_submitted', 'conversion', 1, {
          service_type: formData.serviceType,
          budget: formData.budget,
          timeline: formData.timeline
        });
        setIsSubmitted(true);
      } else {
        console.error('Automation failed:', automationResponse.error);
        trackFormEvent('quote', 'error', { error_message: automationResponse.error });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      trackFormEvent('quote', 'error', { error_message: String(error) });
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in our security services. Our team will review your request and contact you within 2 hours as promised.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>✅ Confirmation email sent to your inbox</li>
              <li>🔄 Security specialist assigned (within 15 minutes)</li>
              <li>📋 Initial assessment completed (within 1 hour)</li>
              <li>📧 Detailed quote delivered (within 2 hours)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center text-blue-600">
              <Phone className="h-5 w-5 mr-2" />
              <span>1-587-644-4644</span>
            </div>
            <div className="flex items-center justify-center text-blue-600">
              <Mail className="h-5 w-5 mr-2" />
              <span>admin@stigg.ca</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Request a Security Quote | Stigg Security Inc."
        description="Get a fast and personalized security assessment. Fill out our form for guard services, surveillance, virtual monitoring & more."
        keywords="security quote, free assessment, security consultation, alberta security services"
        canonicalUrl="/quote"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get Your Free Security Quote Today
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Tell us about your security needs and we'll respond within 2 hours with a customized solution. 100% Satisfaction Guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Form Section */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Request Your Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    />
                  </div>

                  {/* Service Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Type *
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        required
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        <option value="">Select a service</option>
                        <option value="security-guards">Security Guard Services</option>
                        <option value="surveillance">Surveillance & Alarm Systems</option>
                        <option value="virtual-guard">Virtual Security Guard</option>
                        <option value="it-support">IT Support & Infrastructure</option>
                        <option value="secure-transport">Secure Transport of High-Value Goods</option>
                        <option value="multiple">Multiple Services</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type *
                      </label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        required
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        <option value="">Select property type</option>
                        <option value="office">Office Building</option>
                        <option value="retail">Retail Store</option>
                        <option value="industrial">Industrial Facility</option>
                        <option value="construction">Construction Site</option>
                        <option value="healthcare">Healthcare Facility</option>
                        <option value="educational">Educational Institution</option>
                        <option value="residential">Residential Complex</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="securityConcerns" className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Security Concerns
                    </label>
                    <textarea
                      id="securityConcerns"
                      name="securityConcerns"
                      rows={3}
                      value={formData.securityConcerns}
                      onChange={handleInputChange}
                      placeholder="Tell us about your specific security concerns..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-30k">$15,000 - $30,000</option>
                        <option value="30k-50k">$30,000 - $50,000</option>
                        <option value="over-50k">Over $50,000</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      >
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate (within 1 week)</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="2-3-months">2-3 months</option>
                        <option value="planning">Planning phase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any additional details about your security needs..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAutomating}
                    className="w-full bg-stigg-red text-white py-4 px-6 rounded-lg font-semibold hover:bg-stigg-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isAutomating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Your Request...
                      </>
                    ) : (
                      'Get My Free Quote - Response Within 2 Hours'
                    )}
                  </button>
                </form>
              </div>

              {/* Info Section */}
              <div className="md:w-1/3 bg-red-50 p-8">
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Stigg Security"
                    className="h-20 w-auto mr-3"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">Why Choose Us?</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-700">Free, no-obligation quotes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-700">Licensed and insured professionals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-700">24/7 emergency response</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-700">Customized security solutions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-700">Advanced technology integration</span>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Need immediate assistance?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-stigg-red">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">1-587-644-4644</span>
                    </div>
                    <div className="flex items-center text-stigg-red">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">admin@stigg.ca</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};