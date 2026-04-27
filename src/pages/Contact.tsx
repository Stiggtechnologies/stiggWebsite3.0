import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { trackFormEvent, trackConversion } from '../services/analyticsService';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  useEffect(() => {
    trackFormEvent('contact', 'view');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (!formStarted) {
      setFormStarted(true);
      trackFormEvent('contact', 'start');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    trackFormEvent('contact', 'submit');

    try {
      const { submitContactForm } = await import('../services/contactService');
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        source: 'contact'
      });

      trackFormEvent('contact', 'success');
      trackConversion('contact_submitted', 'conversion', 1);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      trackFormEvent('contact', 'error', { error_message: String(error) });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact Stigg Security | Offices in Fort McMurray & Calgary"
        description="Reach out to our expert team today. Call, email, or visit us for a custom security consultation anywhere in Alberta."
        keywords="contact stigg security, fort mcmurray office, calgary office, security consultation"
        canonicalUrl="/contact"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with our security experts. We're here to help protect what matters most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Emergency Contact Banner */}
          <div className="bg-red-600 text-white rounded-lg p-6 mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white text-red-600 rounded-full p-3 mr-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold">24/7 EMERGENCY SECURITY RESPONSE</div>
                <div className="text-3xl font-bold">1-587-644-4644 | 780-215-2887</div>
              </div>
            </div>
            <div className="text-lg">
              Emergency response within 15 minutes • Protected 500+ Alberta businesses since 2014
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">24/7 Emergency Line</p>
              <p className="text-stigg-red font-semibold">1-587-644-4644</p>
              <p className="text-stigg-red font-semibold">780-215-2887</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">General Inquiries</p>
              <p className="text-stigg-red font-semibold">admin@stigg.ca</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Locations</h3>
              <p className="text-gray-600">Fort McMurray, AB</p>
              <p className="text-gray-600">High River, AB</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-600">Office: Mon-Fri 8AM-6PM</p>
              <p className="text-gray-600">Emergency: 24/7/365</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    />
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
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Request a Quote</option>
                      <option value="service">Service Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="emergency">Emergency Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your security needs..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stigg-red"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stigg-red text-white py-4 px-6 rounded-lg font-semibold hover:bg-stigg-800 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-stigg-red mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Service Areas</h3>
                    <p className="text-gray-600">Fort McMurray & Calgary</p>
                    <p className="text-gray-600">Throughout Alberta</p>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Locations</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fort McMurray Office</h4>
                    <p className="text-gray-600">200 Parent Way</p>
                    <p className="text-gray-600">Fort McMurray, AB T9H 5E6</p>
                    <p className="text-stigg-red font-semibold">780-215-2887</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">High River Office</h4>
                    <p className="text-gray-600">121 8 Ave SE</p>
                    <p className="text-gray-600">High River, AB T1V 1R8</p>
                    <p className="text-stigg-red font-semibold">1-587-644-4644</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">Emergency Contact</h3>
                <p className="text-red-700 mb-3">
                  For immediate security emergencies, contact us 24/7:
                </p>
                <div className="flex items-center text-red-800 font-semibold">
                  <Phone className="h-5 w-5 mr-2" />
                  <div>
                    <div>1-587-644-4644</div>
                    <div>780-215-2887</div>
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