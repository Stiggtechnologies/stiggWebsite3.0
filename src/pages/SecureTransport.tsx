import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle, Phone, Mail, Truck, Shield, MapPin, Clock, FileCheck, Radio } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const SecureTransport: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const whatWeTransport = [
    'Industrial electronics, sensors, and control equipment',
    'High-value tools and specialized machinery',
    'Servers, networking gear, and IT hardware',
    'Prototypes, R&D materials, and confidential items',
    'Pharmacy and medical supplies (non-temperature-controlled)',
    'Legal and financial documents, evidence, and media',
    'Luxury goods, artwork, jewelry, and collectibles',
    'Critical business assets during residential or commercial moves'
  ];

  const whoItsFor = [
    'Oil sands and industrial operators',
    'Construction companies & trades',
    'IT & data centre teams',
    'Law firms and corporate legal departments',
    'Healthcare & pharmacy operations',
    'High-net-worth individuals',
    'Government agencies',
    'Insurance & recovery specialists'
  ];

  const processSteps = [
    {
      title: 'Risk Assessment & Service Level Selection',
      description: 'We evaluate shipment value, sensitivity, and risk level to recommend the right protection.'
    },
    {
      title: 'Pre-Trip Planning & Documentation',
      description: 'Includes route planning, verification, and chain-of-custody document setup.'
    },
    {
      title: 'Secure Pickup',
      description: 'Licensed personnel verify identity, inspect items, and prepare secure packaging/seals.'
    },
    {
      title: 'In-Transit Protection & Tracking',
      description: 'Items transported in secure Stigg Logistics vehicles with optional guard escort and GPS monitoring.'
    },
    {
      title: 'Delivery & Final Verification',
      description: 'Receiver identity is confirmed, seals inspected, and chain-of-custody finalized.'
    },
    {
      title: 'Post-Trip Reporting (Optional)',
      description: 'Full documentation for corporate and insurance requirements.'
    }
  ];

  const securityLayers = [
    {
      icon: Shield,
      title: 'Licensed Security Personnel',
      description: 'Trained and vetted professionals handling your valuable assets'
    },
    {
      icon: Truck,
      title: 'Dedicated Secure Vehicles',
      description: 'Purpose-built transportation with advanced security features'
    },
    {
      icon: Radio,
      title: 'GPS Tracking & Live Updates',
      description: 'Real-time location monitoring and status updates throughout transit'
    },
    {
      icon: FileCheck,
      title: 'Documented Chain-of-Custody',
      description: 'Complete documentation from pickup to delivery for legal compliance'
    },
    {
      icon: CheckCircle,
      title: 'Insurance & Risk Management Compliance',
      description: 'Full coverage and adherence to industry standards'
    }
  ];

  const faqs = [
    {
      question: 'What qualifies as a high-value item?',
      answer: 'Anything where loss or damage would cause significant financial, legal, or operational impact. This includes expensive equipment, irreplaceable prototypes, confidential documents, or items critical to business operations.'
    },
    {
      question: 'Can you handle confidential documents or evidence?',
      answer: 'Yes. We maintain strict chain-of-custody protocols suitable for legal and institutional requirements. Our documentation and security measures meet the standards required by law firms, government agencies, and corporate legal departments.'
    },
    {
      question: 'Do you offer same-day secure transport?',
      answer: 'Yes, subject to availability and risk level. For urgent shipments, contact us immediately and we will assess if same-day service is feasible based on your location, item type, and security requirements.'
    },
    {
      question: 'How do you ensure safe delivery?',
      answer: 'We use multiple security layers: licensed guards, secure vehicles with GPS tracking, tamper-evident seals, identity verification at both pickup and delivery, and complete chain-of-custody documentation throughout the entire transport process.'
    },
    {
      question: 'Do you provide long-distance secure transport?',
      answer: 'Yes—across Alberta and select Western Canadian routes. We regularly transport between Fort McMurray, Calgary, Edmonton, Red Deer, Grande Prairie, and other major centers, as well as oil sands sites and remote industrial locations.'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Secure Transportation of High-Value Goods | Stigg Security"
        description="Licensed guards, secure vehicles, and GPS-tracked chain-of-custody transport for high-value items across Alberta & Western Canada. Request a secure transport quote today."
        keywords="secure transport, high-value goods, armored transport, chain of custody, Alberta, Fort McMurray, Calgary"
        canonicalUrl="/services/secure-transport-high-value-goods"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <nav className="mb-6">
              <Link to="/services" className="text-red-200 hover:text-white">
                Services
              </Link>
              <span className="mx-2 text-red-200">›</span>
              <span className="text-white">Secure Transportation of High-Value Goods</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Secure Transportation of High-Value Goods
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Stigg Security provides professional, fully documented secure transport for high-value and sensitive items across Alberta and Western Canada. By combining licensed security professionals with dedicated Stigg Logistics vehicles, we offer a protection standard that ordinary couriers, movers, or hot-shot services cannot match. Whether you're transporting electronics, industrial equipment, confidential documents, or luxury goods, Stigg ensures your shipment arrives safely and securely.
            </p>
            <Link
              to="/quote"
              className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Request Secure Transport Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What We Transport Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatWeTransport.map((item, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <CheckCircle className="h-5 w-5 text-stigg-red mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Who This Is For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoItsFor.map((client, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="bg-red-100 text-stigg-red w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{client}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Secure Transport Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Secure Transport Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start mb-4">
                  <div className="bg-stigg-red text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Layers & Chain-of-Custody Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Security Layers & Chain-of-Custody</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityLayers.map((layer, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <layer.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{layer.title}</h3>
                <p className="text-gray-600">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start">
              <MapPin className="h-12 w-12 text-stigg-red mr-6 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Area</h2>
                <p className="text-lg text-gray-700">
                  Based in Fort McMurray and Calgary, Stigg provides secure transport throughout Alberta and Western Canada, including Edmonton, Red Deer, Leduc, Grande Prairie, Lloydminster, and all oil sands sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start">
              <Clock className="h-12 w-12 text-stigg-red mr-6 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Overview</h2>
                <p className="text-lg text-gray-700">
                  All secure transport jobs are priced according to shipment value, distance, risk level, and required security tier. Pricing includes driver + secure vehicle, optional security guard escort, and documentation. Contact us for a detailed quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
            <h2 className="text-3xl font-bold mb-4">Ready to Book Secure Transport?</h2>
            <p className="text-xl text-red-100 mb-8">
              Contact us today to discuss your transport needs and receive a customized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/quote"
                className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Request Secure Transport Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a
                href="tel:780-743-1855"
                className="flex items-center text-white hover:text-red-200 transition-colors text-lg"
              >
                <Phone className="h-6 w-6 mr-2" />
                (780) 743-1855
              </a>
              <a
                href="mailto:secure@stigg.ca"
                className="flex items-center text-white hover:text-red-200 transition-colors text-lg"
              >
                <Mail className="h-6 w-6 mr-2" />
                secure@stigg.ca
              </a>
            </div>

            {/* Guarantee */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-3">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">100% Satisfaction Guaranteed or Your Money Back</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
