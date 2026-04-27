import React from 'react';

export const ClientLogos: React.FC = () => {
  // Using actual client logos from uploaded files
  const clients = [
    { 
      name: 'Canadian Tire', 
      logo: '/canadiantire.jpg',
      alt: 'Canadian Tire - Retail Security Services'
    },
    { 
      name: 'McDonald\'s', 
      logo: '/mcdonalds.jpg',
      alt: 'McDonald\'s - Restaurant Security Services'
    },
    { 
      name: 'Holiday Inn', 
      logo: '/Holiday Inn.png',
      alt: 'Holiday Inn - Hotel Security Services'
    },
    { 
      name: 'Radisson Hotel', 
      logo: '/radisson.jpg',
      alt: 'Radisson Hotel - Hospitality Security'
    },
    { 
      name: 'Clearwater Suite Hotel', 
      logo: '/Clearwater Suite Hotel.png',
      alt: 'Clearwater Suite Hotel - Hotel Security'
    },
    { 
      name: 'Nomad Hotel', 
      logo: '/Nomad Hotel.png',
      alt: 'Nomad Hotel - Boutique Hotel Security'
    },
    { 
      name: 'RCMP', 
      logo: '/rcmp.jpg',
      alt: 'Royal Canadian Mounted Police - Law Enforcement Partnership'
    },
    { 
      name: 'BBB Accredited', 
      logo: '/bbb.jpg',
      alt: 'Better Business Bureau Accredited Business'
    },
    { 
      name: 'Fort McKay First Nation', 
      logo: '/FirstNation.jpeg',
      alt: 'Fort McKay First Nation - Community Security'
    },
    { 
      name: 'Mikisew Group', 
      logo: '/mikesew.jpg',
      alt: 'Mikisew Group - Industrial Security Services'
    },
    { 
      name: 'Casman Group', 
      logo: '/Casman.jpg',
      alt: 'Casman Group - Construction Security'
    },
    { 
      name: 'Wood Buffalo Housing', 
      logo: '/wbhdc.jpg',
      alt: 'Wood Buffalo Housing Development Corporation'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-gray-600">
            We're proud to serve businesses across Alberta
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 w-full h-24 flex items-center justify-center group relative overflow-hidden">
                <img
                  src={client.logo}
                  alt={client.alt}
                  className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-105"
                />
                {/* Overlay with company name on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-85 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                    {client.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-6">
            Serving 500+ clients across Alberta since 2014
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">Licensed & Insured</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-medium">24/7 Service</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-stigg-red rounded-full mr-2"></div>
              <span className="font-medium">Emergency Response</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="font-medium">Alberta Wide Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};