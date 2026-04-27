import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Eye, Zap, ArrowRight, Star, CheckCircle, Truck } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { ClientLogos } from '../components/ClientLogos';
import { CertificationBadges } from '../components/CertificationBadges';
import { ServiceHighlights } from '../components/ServiceHighlights';
import { assets } from '../data/assets';
import { getFeaturedPosts } from '../data/blogPosts';
import { SecurityAssessment } from '../components/SecurityAssessment';

export const Home: React.FC = () => {
  const services = [
    {
      icon: Users,
      title: 'Security Guard Services',
      description: 'Professional, licensed security personnel for your facility',
      link: '/services/security-guards'
    },
    {
      icon: Eye,
      title: 'Surveillance & Alarm Systems',
      description: 'Advanced monitoring and alert systems for complete protection',
      link: '/services/surveillance'
    },
    {
      icon: Shield,
      title: 'Virtual Security Guard',
      description: 'AI-powered remote monitoring and rapid response',
      link: '/services/virtual-guard'
    },
    {
      icon: Zap,
      title: 'IT Support & Infrastructure',
      description: 'Comprehensive IT solutions and cybersecurity services',
      link: '/services/it-support'
    },
    {
      icon: Truck,
      title: 'Secure Transport of High-Value Goods',
      description: 'End-to-end secure transportation for high-value and sensitive items—industrial equipment, electronics, prototypes, critical documents, pharmaceuticals, and more. Includes licensed guards, GPS-tracked vehicles, and documented chain-of-custody from pickup to delivery.',
      link: '/services/secure-transport-high-value-goods'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Industrial Solutions Ltd.',
      text: 'Stigg Security has been protecting our facilities for 3 years. Their professionalism and reliability are unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Alberta Construction Corp',
      text: 'The virtual guard service is incredible. 24/7 monitoring with instant alerts has given us complete peace of mind.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      company: 'Retail Plaza Management',
      text: 'From installation to ongoing support, their team exceeded our expectations. Highly recommend!',
      rating: 5
    }
  ];

  const featuredBlogPosts = getFeaturedPosts().slice(0, 3);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Stigg Security Inc. | Alberta's Trusted Security, Surveillance & Secure Transport Partner"
        description="Stigg Security protects your people, property, and high-value assets with professional security guards, AI-enabled surveillance, and secure transportation across Alberta and Western Canada."
        keywords="security services, security guards, surveillance systems, virtual security, IT support, secure transport, high-value goods, Alberta, Fort McMurray, Calgary"
        canonicalUrl="/"
        schema="LocalBusiness"
      />
      {/* Hero Section */}
      <section className="relative gradient-primary text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `url(${assets.hero.main})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Alberta's Trusted Security, Surveillance & Secure Transport Partner
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white opacity-95">
                Stigg Security protects your people, property, and high-value assets with professional security guards, AI-enabled surveillance, and secure transportation of high-value goods across Alberta and Western Canada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quote"
                  className="bg-stigg-red text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-stigg-red-dark transition-colors inline-flex items-center justify-center shadow-lg"
                >
                  Request a Security & Secure Transport Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/services/secure-transport-high-value-goods"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-stigg-red transition-colors inline-flex items-center justify-center"
                >
                  Learn About Secure Transport
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <ClientLogos />

      {/* Company Intro */}
      <section className="py-16 section-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Your Trusted Security Partner
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Since 2014, we've protected 500+ Alberta businesses and communities with our proven security solutions. 
              Stigg Security Inc. combines traditional security expertise with cutting-edge technology 
              to deliver comprehensive protection solutions backed by our 100% Satisfaction Guarantee.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-50 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-text-secondary">Fully licensed security professionals with comprehensive insurance coverage</p>
            </div>
            <div className="text-center">
              <div className="bg-stigg-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
              <p className="text-text-secondary">Round-the-clock surveillance and immediate response capabilities</p>
            </div>
            <div className="text-center">
              <div className="bg-stigg-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Technology</h3>
              <p className="text-text-secondary">State-of-the-art security systems and AI-powered solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Security Assessment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Discover Your Security Needs
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Take our 2-minute assessment to get personalized security recommendations and instant pricing
            </p>
          </div>
          <SecurityAssessment />
        </div>
      </section>

      {/* Certifications */}
      <CertificationBadges />

      {/* Service Highlights */}
      <ServiceHighlights />

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Our Security Services
            </h2>
            <p className="text-lg text-text-secondary">
              Comprehensive protection solutions tailored to your specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-text-secondary mb-4">{service.description}</p>
                <Link
                  to={service.link}
                  className="text-stigg-red hover:text-stigg-red-dark font-semibold inline-flex items-center"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Secure Transport - Full Width Card */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="bg-red-100 text-stigg-red w-20 h-20 rounded-lg flex items-center justify-center">
                  <Truck className="h-10 w-10" />
                </div>
              </div>
              <div className="lg:col-span-9">
                <h3 className="text-2xl font-semibold mb-2">{services[4].title}</h3>
                <p className="text-text-secondary">{services[4].description}</p>
              </div>
              <div className="lg:col-span-2 flex justify-center lg:justify-end">
                <Link
                  to={services[4].link}
                  className="bg-stigg-red text-white px-6 py-3 rounded-full font-semibold hover:bg-stigg-red-dark transition-colors inline-flex items-center shadow-sm"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Transport Callout Strip */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left lg:flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Need to move something valuable or sensitive?
              </h2>
              <p className="text-lg text-gray-200">
                Stigg provides secure, documented transportation of high-value goods from Fort McMurray and Calgary to destinations across Alberta and Western Canada.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/services/secure-transport-high-value-goods"
                className="bg-stigg-red text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-stigg-red-dark transition-colors inline-flex items-center shadow-lg"
              >
                Book Secure Transport
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 section-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-text-secondary">
              Trusted by businesses across Alberta
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Latest Security Insights
            </h2>
            <p className="text-lg text-text-secondary">
              Stay informed with our expert security advice and industry updates
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-red-100 text-stigg-red px-2 py-1 rounded-full text-xs font-medium mr-2">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime} min read</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-text-secondary mb-4">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-stigg-red hover:text-stigg-red-dark font-semibold inline-flex items-center"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 section-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Protect Your Property Today
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Don't wait for a security incident. Get professional protection with our 100% Satisfaction Guarantee.
          </p>
          
          {/* Emergency Contact - Prominent */}
          <div className="bg-red-600 text-white rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-white text-red-600 rounded-full p-2 mr-3">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">24/7 EMERGENCY RESPONSE</div>
                <div className="text-2xl font-bold">1-587-644-4644 | 780-215-2887</div>
              </div>
            </div>
            <div className="text-sm opacity-90">
              Emergency response within 15 minutes • Available 365 days a year
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-lg"
            >
              Get Your Free Quote Today - Response Within 2 Hours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-stigg-red transition-colors inline-flex items-center justify-center shadow-lg"
            >
              Contact Us
            </Link>
          </div>
          
          {/* Guarantee Badge */}
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-white bg-opacity-10 rounded-full px-6 py-3 flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">100% Satisfaction Guaranteed or Your Money Back</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};