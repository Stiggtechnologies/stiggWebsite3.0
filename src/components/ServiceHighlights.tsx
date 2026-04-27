import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { assets } from '../data/assets';

export const ServiceHighlights: React.FC = () => {
  const highlights = [
    {
      title: 'Professional Security Guards',
      description: 'Licensed, trained, and experienced security personnel ready to protect your property.',
      image: assets.services.securityGuards.main,
      link: '/services/security-guards',
      stats: '50+ Licensed Guards'
    },
    {
      title: 'Mobile Patrol Units',
      description: 'Marked security vehicles providing comprehensive coverage across your property.',
      image: assets.operations.vehicles[0],
      link: '/services/security-guards',
      stats: '24/7 Mobile Response'
    },
    {
      title: 'Advanced Surveillance',
      description: 'State-of-the-art monitoring systems with real-time alerts and remote access.',
      image: assets.services.surveillance.main,
      link: '/services/surveillance',
      stats: 'HD Monitoring Systems'
    },
    {
      title: 'IT Security Solutions',
      description: 'Comprehensive cybersecurity and network protection for your business.',
      image: assets.services.itSupport.main,
      link: '/services/it-support',
      stats: 'Expert IT Support'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Security Solutions
          </h2>
          <p className="text-lg text-gray-600">
            From on-site guards to advanced technology, we've got you covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-40 object-cover object-center"
                />
                <div className="absolute bottom-2 right-2 bg-stigg-red text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {highlight.stats}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{highlight.description}</p>
                <Link
                  to={highlight.link}
                  className="text-stigg-red hover:text-stigg-800 font-semibold text-sm inline-flex items-center"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};