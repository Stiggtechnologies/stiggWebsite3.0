import React from 'react';
import { assets } from '../data/assets';

export const GuardHeadshotReview: React.FC = () => {
  const guardHeadshots = [
    {
      name: 'Professional Security Guard #1',
      image: '/guards/guard head shot.jpeg',
      currentUsage: [
        'TeamShowcase component (About page)',
        'Assets fallback for team photos',
        'Random guard image selection'
      ]
    },
    {
      name: 'Female Security Guard',
      image: '/guards/guard Woman head shot.jpeg',
      currentUsage: [
        'TeamShowcase component (About page)',
        'Team photos array in assets',
        'Random guard image selection'
      ]
    },
    {
      name: 'Female Security Officer',
      image: '/guards/Guard woman.jpeg',
      currentUsage: [
        'TeamShowcase component (About page)',
        'Team photos array in assets',
        'Security guards gallery'
      ]
    }
  ];

  const otherGuardImages = [
    {
      name: 'Guard Close-up',
      image: '/guards/Guard close up.webp',
      usage: 'Security guards service gallery'
    },
    {
      name: 'Standing Guard #1',
      image: '/guards/guard standing.webp',
      usage: 'Security guards hero and gallery'
    },
    {
      name: 'Standing Guard #2',
      image: '/guards/Gurad Stading 2.jpeg',
      usage: 'Security guards gallery'
    },
    {
      name: 'Airport Security',
      image: '/guards/guard airport 2 .jpeg',
      usage: 'Security guards gallery and field operations'
    },
    {
      name: 'Main Guard Image',
      image: '/guards/Guard.jpeg',
      usage: 'Primary security guard service image, contact hero, service highlights'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Security Guard Headshots Review
        </h1>
        
        {/* Professional Headshots Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Professional Headshots (Used in Team Section)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guardHeadshots.map((guard, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={guard.image}
                    alt={guard.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{guard.name}</h3>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Currently Used In:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {guard.currentUsage.map((usage, usageIndex) => (
                        <li key={usageIndex} className="flex items-start">
                          <span className="w-2 h-2 bg-stigg-red rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {usage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Guard Images Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Other Security Guard Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherGuardImages.map((guard, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video">
                  <img
                    src={guard.image}
                    alt={guard.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{guard.name}</h3>
                  <p className="text-sm text-gray-600">{guard.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Summary */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Current Implementation Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-stigg-red">
                TeamShowcase Component (About Page)
              </h3>
              <p className="text-gray-600 mb-4">
                Displays 3 professional headshots with role descriptions:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Professional Security Guard (guard head shot.jpeg)</li>
                <li>• Security Specialist (guard Woman head shot.jpeg)</li>
                <li>• Technical Support (Tech support.png)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-stigg-red">
                Assets Configuration
              </h3>
              <p className="text-gray-600 mb-4">
                Guard headshots are organized in the assets system:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code>assets.team.guards[]</code> - Array of 3 headshots</li>
                <li>• <code>getRandomGuardImage()</code> - Random selection function</li>
                <li>• Used across multiple components for consistency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* File Paths Reference */}
        <section className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">File Paths Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <h4 className="font-semibold mb-2">Headshot Files:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>/guard head shot.jpeg</li>
                <li>/guard Woman head shot.jpeg</li>
                <li>/Guard woman.jpeg</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Implementation Files:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>src/data/assets.ts</li>
                <li>src/components/TeamShowcase.tsx</li>
                <li>src/pages/About.tsx</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};