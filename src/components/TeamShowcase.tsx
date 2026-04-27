import React from 'react';
import { assets } from '../data/assets';

export const TeamShowcase: React.FC = () => {
  const teamMembers = [
    {
      name: 'Professional Security Guard',
      role: 'Licensed Security Officer',
      image: assets.team.guards[0],
      description: 'Experienced in facility protection and emergency response'
    },
    {
      name: 'Security Specialist',
      role: 'Senior Security Officer',
      image: assets.team.guards[1],
      description: 'Expert in access control and visitor management'
    },
    {
      name: 'Technical Support',
      role: 'IT Security Specialist',
      image: assets.team.guards[2],
      description: 'Specialized in cybersecurity and network protection'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Professional Team
          </h2>
          <p className="text-lg text-gray-600">
            Experienced, licensed, and dedicated security professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-stigg-red font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};