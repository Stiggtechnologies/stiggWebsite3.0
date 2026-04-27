import React from 'react';
import { Truck, Shield, Eye, Zap } from 'lucide-react';
import { assets } from '../data/assets';

export const OperationsShowcase: React.FC = () => {
  const operations = [
    {
      icon: Truck,
      title: 'Mobile Patrol Services',
      description: 'Professional security vehicles for comprehensive site coverage',
      image: assets.operations.vehicles[0],
      features: ['Marked security vehicles', 'GPS tracking', 'Emergency response', 'Regular patrols']
    },
    {
      icon: Shield,
      title: 'On-Site Security',
      description: 'Dedicated security personnel for your facility',
      image: assets.services.securityGuards.main,
      features: ['Licensed guards', 'Access control', 'Incident reporting', '24/7 coverage']
    },
    {
      icon: Eye,
      title: 'Surveillance Systems',
      description: 'Advanced monitoring and detection technology',
      image: assets.services.surveillance.main,
      features: ['HD cameras', 'Motion detection', 'Remote monitoring', 'Cloud storage']
    },
    {
      icon: Zap,
      title: 'Technical Support',
      description: 'Expert IT and cybersecurity services',
      image: assets.services.itSupport.main,
      features: ['Network security', 'System maintenance', 'Emergency support', 'Consultation']
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Operations in Action
          </h2>
          <p className="text-lg text-gray-600">
            See how we deliver comprehensive security solutions across Alberta
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {operations.map((operation, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={operation.image}
                  alt={operation.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-stigg-red text-white p-2 rounded-full">
                  <operation.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{operation.title}</h3>
                <p className="text-gray-600 mb-4">{operation.description}</p>
                <ul className="space-y-2">
                  {operation.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-stigg-red rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};