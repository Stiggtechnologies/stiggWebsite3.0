import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle, Phone, Mail } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { ImageGallery } from '../components/ImageGallery';
import { AIAssistant } from '../components/AIAssistant';
import { assets, getServiceImage } from '../data/assets';

export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const services = {
    'security-guards': {
      title: 'Security Guard Services',
      seoTitle: 'Security Guard Services in Alberta | Trained, Licensed, Reliable',
      seoDescription: 'Professional security guards for retail, construction, residential & events. Fully licensed and trained personnel. Available across Alberta.',
      description: 'Professional, licensed security personnel providing comprehensive on-site protection for your facility, ensuring safety and peace of mind.',
      image: assets.services.securityGuards.main,
      gallery: assets.services.securityGuards.gallery,
      benefits: [
        'Immediate response to security incidents',
        'Crime deterrent through visible presence',
        'Professional incident documentation',
        'Access control and visitor management',
        'Emergency response coordination'
      ],
      clientTypes: [
        'Corporate offices and business centers',
        'Retail stores and shopping centers',
        'Industrial facilities and warehouses',
        'Construction sites and development projects',
        'Healthcare facilities and hospitals',
        'Educational institutions and schools'
      ],
      process: [
        'Initial security assessment and consultation',
        'Customized security plan development',
        'Officer selection and specialized training',
        'Implementation and ongoing supervision',
        'Regular reporting and service optimization'
      ],
      faqs: [
        {
          question: 'Are your security guards licensed and insured?',
          answer: 'Yes, all our security officers are fully licensed by the Alberta government and undergo comprehensive background checks. We maintain full liability insurance and bonding coverage.'
        },
        {
          question: 'What training do your security guards receive?',
          answer: 'Our guards receive initial certification training plus ongoing professional development in areas such as conflict resolution, emergency response, report writing, and customer service.'
        },
        {
          question: 'Can you provide both uniformed and plainclothes security?',
          answer: 'Absolutely. We offer both uniformed officers for visible deterrence and plainclothes officers for discrete security needs, depending on your specific requirements.'
        },
        {
          question: 'How quickly can you deploy security guards?',
          answer: 'For emergency situations, we can deploy guards within 2-4 hours. For planned security needs, we typically require 24-48 hours to ensure proper briefing and preparation.'
        }
      ]
    },
    'surveillance': {
      title: 'Surveillance & Alarm Systems',
      seoTitle: 'Surveillance Camera & Alarm Installation | Fort McMurray & Calgary',
      seoDescription: 'Get top-tier CCTV, motion sensors, and remote monitoring. Stigg installs and maintains security systems to protect your property 24/7.',
      description: 'Advanced monitoring and alert systems featuring cutting-edge technology for comprehensive property protection and real-time threat detection.',
      image: assets.services.surveillance.main,
      gallery: assets.services.surveillance.gallery,
      benefits: [
        '24/7 automated monitoring and recording',
        'High-definition video quality and night vision',
        'Remote access via mobile apps and web portals',
        'Intelligent motion detection and alerts',
        'Cloud-based storage and backup systems'
      ],
      clientTypes: [
        'Retail businesses and shopping centers',
        'Office buildings and corporate facilities',
        'Manufacturing plants and warehouses',
        'Parking lots and outdoor facilities',
        'Residential complexes and condominiums',
        'Schools and educational institutions'
      ],
      process: [
        'Comprehensive site security assessment',
        'System design and equipment selection',
        'Professional installation and testing',
        'User training and system optimization',
        'Ongoing maintenance and support services'
      ],
      faqs: [
        {
          question: 'What types of cameras do you install?',
          answer: 'We install a variety of high-definition IP cameras including dome, bullet, and PTZ cameras with features like night vision, motion detection, and weather resistance.'
        },
        {
          question: 'Can I access my cameras remotely?',
          answer: 'Yes, our systems include mobile apps and web portals that allow you to view live feeds, review recordings, and receive alerts from anywhere with internet access.'
        },
        {
          question: 'How long is video footage stored?',
          answer: 'Storage duration depends on your needs and local regulations. We offer both local and cloud storage options with retention periods from 30 days to several months.'
        },
        {
          question: 'Do you provide system maintenance?',
          answer: 'Yes, we offer comprehensive maintenance packages including regular system checks, software updates, cleaning, and immediate repair services when needed.'
        }
      ]
    },
    'virtual-guard': {
      title: 'Virtual Security Guard',
      seoTitle: 'AI Virtual Security Guard | Remote Monitoring for Alberta Properties',
      seoDescription: 'Monitor your site 24/7 with our AI-powered virtual guard. Real-time detection, alerts, and police integration—without the cost of onsite staff.',
      description: 'AI-powered remote monitoring service combining advanced technology with human expertise for intelligent threat detection and rapid response.',
      image: assets.services.virtualGuard.main,
      gallery: assets.services.virtualGuard.gallery,
      benefits: [
        'AI-powered threat detection and analysis',
        'Real-time alerts and immediate response',
        'Two-way audio communication capabilities',
        'Cost-effective alternative to on-site guards',
        'Integration with existing security systems'
      ],
      clientTypes: [
        'Remote locations and unmanned facilities',
        'Construction sites and development projects',
        'Small to medium-sized businesses',
        'After-hours monitoring for retail stores',
        'Vacation properties and seasonal businesses',
        'Agricultural facilities and equipment yards'
      ],
      process: [
        'Assessment of current security infrastructure',
        'AI system integration and configuration',
        'Monitoring center connection and testing',
        'Staff training on system operation',
        'Continuous monitoring and optimization'
      ],
      faqs: [
        {
          question: 'How does AI threat detection work?',
          answer: 'Our AI system analyzes video feeds in real-time, identifying unusual activities, unauthorized access, and potential threats. It can distinguish between normal activities and genuine security concerns.'
        },
        {
          question: 'What happens when a threat is detected?',
          answer: 'When a threat is identified, our monitoring center receives an immediate alert. Our operators can communicate through two-way audio, contact authorities if needed, and notify you instantly.'
        },
        {
          question: 'Can virtual guards replace physical security?',
          answer: 'Virtual guards are excellent for monitoring and detection but work best as part of a comprehensive security plan. They can significantly reduce the need for on-site guards while maintaining high security levels.'
        },
        {
          question: 'What are the cost savings compared to traditional guards?',
          answer: 'Virtual guard services typically cost 60-80% less than traditional security guards while providing 24/7 coverage and AI-enhanced detection capabilities.'
        }
      ]
    },
    'it-support': {
      title: 'IT Support & Infrastructure',
      seoTitle: 'Business IT Support Services | Network Security & Data Protection',
      seoDescription: 'Keep your business secure with managed IT services, firewalls, data backup, and cybersecurity solutions. Serving Alberta-based SMEs.',
      description: 'Comprehensive IT solutions and cybersecurity services designed to protect your digital assets and ensure business continuity.',
      image: assets.services.itSupport.main,
      gallery: assets.services.itSupport.gallery,
      benefits: [
        'Proactive cybersecurity threat monitoring',
        'Network security assessment and hardening',
        'Data backup and disaster recovery solutions',
        'Employee cybersecurity training programs',
        '24/7 IT support and emergency response'
      ],
      clientTypes: [
        'Small to medium-sized businesses',
        'Professional services firms',
        'Healthcare practices and clinics',
        'Financial services companies',
        'Legal offices and law firms',
        'Non-profit organizations'
      ],
      process: [
        'Comprehensive IT security assessment',
        'Risk analysis and vulnerability identification',
        'Security solution implementation',
        'Staff training and policy development',
        'Ongoing monitoring and maintenance'
      ],
      faqs: [
        {
          question: 'What cybersecurity services do you offer?',
          answer: 'We provide firewall management, antivirus solutions, email security, network monitoring, vulnerability assessments, and employee training programs to protect against cyber threats.'
        },
        {
          question: 'Do you provide 24/7 IT support?',
          answer: 'Yes, we offer round-the-clock IT support with emergency response capabilities. Our team can remotely diagnose and resolve many issues immediately.'
        },
        {
          question: 'How do you handle data backup and recovery?',
          answer: 'We implement automated backup systems with both local and cloud storage options. Our disaster recovery plans ensure minimal downtime and data loss in case of system failures.'
        },
        {
          question: 'Can you help with compliance requirements?',
          answer: 'Absolutely. We assist with various compliance requirements including PIPEDA, industry-specific regulations, and can help implement necessary security controls and documentation.'
        }
      ]
    }
  };

  const service = services[serviceId as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={service.seoTitle}
        description={service.seoDescription}
        keywords={`${service.title.toLowerCase()}, alberta security, fort mcmurray, calgary`}
        canonicalUrl={`/services/${serviceId}`}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <nav className="mb-6">
                <Link to="/services" className="text-blue-200 hover:text-white">
                  Services
                </Link>
                <span className="mx-2 text-blue-200">›</span>
                <span className="text-white">{service.title}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {service.description}
              </p>
              <Link
                to="/quote"
                className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Get Your Free Quote Today - Response Within 2 Hours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div>
              <img
                src={service.image}
                alt={service.title}
                className="rounded-lg shadow-xl w-full h-80 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Who It's For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.clientTypes.map((clientType, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{clientType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {service.process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-stigg-red text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageGallery 
            images={service.gallery} 
            title={`${service.title} Gallery`}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-stigg-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today to discuss your security needs and receive a customized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quote"
                className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Get Your Free Quote Today - Response Within 2 Hours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <div className="flex items-center justify-center space-x-6">
                <a
                  href="tel:1-587-644-4644"
                  className="flex items-center text-white hover:text-red-200 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  1-587-644-4644 (24/7 Emergency)
                </a>
                <a
                  href="mailto:admin@stigg.ca"
                  className="flex items-center text-white hover:text-red-200 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  admin@stigg.ca
                </a>
              </div>
            </div>
            
            {/* Guarantee */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-2">
                <svg className="h-4 w-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">100% Satisfaction Guaranteed or Your Money Back</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service-Specific AI Assistant */}
      {showAIAssistant && (
        <AIAssistant
          serviceType={serviceId}
          userProfile={{
            currentService: service.title,
            pageContext: 'service-detail'
          }}
          onLeadCapture={(leadData) => {
            console.log('Service-specific lead captured:', leadData);
            setShowAIAssistant(false);
          }}
        />
      )}

      {/* Floating AI Assistant Trigger */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowAIAssistant(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-sm font-semibold">Ask AI Expert</span>
        </button>
      </div>
    </div>
  );
};