import React from 'react';
import { Shield, Award, CheckCircle, Star } from 'lucide-react';

export const CertificationBadges: React.FC = () => {
  const certifications = [
    {
      icon: Shield,
      title: 'Alberta Licensed',
      description: 'Fully licensed security services provider',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Award,
      title: 'Insured & Bonded',
      description: 'Comprehensive liability coverage',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: CheckCircle,
      title: 'BBB Accredited',
      description: 'Better Business Bureau member',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Star,
      title: 'ISO Certified',
      description: 'Quality management standards',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Certifications & Credentials
          </h2>
          <p className="text-lg text-gray-600">
            Your assurance of professional, reliable security services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="text-center">
              <div className={`${cert.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <cert.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
              <p className="text-gray-600">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};