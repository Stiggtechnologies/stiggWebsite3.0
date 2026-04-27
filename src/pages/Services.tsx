import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, Zap, ArrowRight, Truck } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { getServiceImage } from '../data/assets';

export const Services: React.FC = () => {
  const services = [
    {
      id: 'security-guards',
      icon: Users,
      title: 'Security Guard Services',
      description: 'Professional, licensed security personnel providing on-site protection for your facility.',
      features: [
        'Licensed and trained security officers',
        'Uniformed and plainclothes options',
        'Access control and visitor management',
        'Emergency response and incident reporting',
        'Mobile patrol services'
      ],
      image: getServiceImage('security-guards')
    },
    {
      id: 'surveillance',
      icon: Eye,
      title: 'Surveillance & Alarm Systems',
      description: 'State-of-the-art monitoring and alert systems for comprehensive property protection.',
      features: [
        'HD IP camera systems',
        'Smart motion detection',
        'Remote monitoring capabilities',
        'Integrated alarm systems',
        'Cloud-based storage and access'
      ],
      image: getServiceImage('surveillance')
    },
    {
      id: 'virtual-guard',
      icon: Eye,
      title: 'Virtual Security Guard',
      description: 'AI-powered remote monitoring with real-time threat detection and response.',
      features: [
        'AI-powered threat detection',
        '24/7 remote monitoring',
        'Instant alert notifications',
        'Two-way audio communication',
        'Integration with existing systems'
      ],
      image: getServiceImage('virtual-guard')
    },
    {
      id: 'it-support',
      icon: Zap,
      title: 'IT Support & Infrastructure',
      description: 'Comprehensive IT solutions and cybersecurity services for your business.',
      features: [
        'Network security assessment',
        'Firewall configuration and management',
        'Cybersecurity training',
        'Data backup and recovery',
        'IT infrastructure consulting'
      ],
      image: getServiceImage('it-support')
    },
    {
      id: 'secure-transport-high-value-goods',
      icon: Truck,
      title: 'Secure Transport of High-Value Goods',
      description: 'Professional secure transportation for high-value and sensitive items across Alberta and Western Canada.',
      features: [
        'Licensed security personnel',
        'GPS-tracked secure vehicles',
        'Documented chain-of-custody',
        'Industrial equipment & electronics',
        'Legal documents & confidential materials'
      ],
      image: getServiceImage('security-guards')
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Security Services | Stigg Security Inc."
        description="Comprehensive security solutions including guard services, surveillance systems, virtual monitoring, and IT support across Alberta."
        keywords="security services, guard services, surveillance, virtual security, IT support, Alberta"
        canonicalUrl="/services"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Security Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive protection solutions tailored to your specific security needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/services/${service.id}`}
                      className="bg-stigg-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-stigg-800 transition-colors inline-flex items-center justify-center"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/quote"
                      className="border-2 border-stigg-red text-stigg-red px-6 py-3 rounded-lg font-semibold hover:bg-stigg-red hover:text-white transition-colors inline-flex items-center justify-center"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img
                    src={getServiceImage(service.id)}
                    alt={service.title}
                    className="rounded-lg shadow-xl w-full h-80 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Secure Your Property?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your security needs and receive a customized protection plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-stigg-red text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-stigg-800 transition-colors inline-flex items-center justify-center"
            >
              Get Your Free Quote Today - Response Within 2 Hours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-stigg-red text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-stigg-red hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-green-50 text-green-800 px-6 py-3 rounded-full">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">100% Satisfaction Guaranteed • Protected 500+ Alberta Businesses Since 2014</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};