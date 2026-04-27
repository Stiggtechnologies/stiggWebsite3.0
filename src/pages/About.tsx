import React from 'react';
import { Award, Users, Clock, CheckCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { TeamShowcase } from '../components/TeamShowcase';
import { OperationsShowcase } from '../components/OperationsShowcase';

export const About: React.FC = () => {
  const values = [
    {
      icon: Award,
      title: 'Integrity',
      description: 'We operate with the highest ethical standards and complete transparency in all our dealings.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service delivery and client relationships.'
    },
    {
      icon: Users,
      title: 'Reliability',
      description: 'Our clients can count on us to be there when they need us most, 24/7/365.'
    },
    {
      icon: Clock,
      title: 'Innovation',
      description: 'We embrace new technologies and methods to provide the most effective security solutions.'
    }
  ];

  const stats = [
    { number: '10+', label: 'Years of Experience' },
    { number: '500+', label: 'Clients Served' },
    { number: '24/7', label: 'Monitoring Available' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Stigg Security Inc. | Alberta's Smart Security Partner"
        description="Learn about our mission, values, and leadership in providing AI-enhanced security and surveillance services throughout Alberta."
        keywords="about stigg security, alberta security company, mission values, security leadership"
        canonicalUrl="/about"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Stigg Security Inc.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Alberta's trusted security partner, dedicated to protecting what matters most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2014, Stigg Security Inc. began with a simple mission: to provide Alberta businesses 
                and property owners with reliable, professional security services they could trust. What started 
                as a small team of dedicated security professionals has grown into one of the province's most 
                respected security companies.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Based in Fort McMurray with operations extending to Calgary and throughout Alberta, we've built 
                our reputation on unwavering commitment to our clients' safety and security. Our team combines 
                decades of experience with cutting-edge technology to deliver comprehensive protection solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Licensed and insured security professionals</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 emergency response capabilities</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced security technology integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Comprehensive insurance coverage</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/about.jpg"
                alt="Stigg Security Team"
                className="rounded-lg shadow-xl w-full h-[300px] md:h-[400px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Track Record
            </h2>
            <p className="text-lg text-gray-600">
              Numbers that speak to our commitment and success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-stigg-red mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-100 text-stigg-red w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-stigg-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            To provide comprehensive, reliable security solutions that protect our clients' assets, 
            employees, and peace of mind through professional service, advanced technology, and 
            unwavering commitment to excellence.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <TeamShowcase />

      {/* Operations Section */}
      <OperationsShowcase />

      {/* Additional Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Stigg Security?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference that professional security services can make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Local Expertise</h3>
              <p className="text-gray-600">
                As an Alberta-based company, we understand the unique security challenges facing 
                businesses in our province. Our local knowledge and connections ensure rapid response 
                and effective solutions.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Advanced Technology</h3>
              <p className="text-gray-600">
                We leverage the latest in security technology, including AI-powered surveillance, 
                smart access control, and integrated monitoring systems to provide comprehensive protection.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Personalized Service</h3>
              <p className="text-gray-600">
                Every client receives customized security solutions tailored to their specific needs, 
                budget, and risk profile. We work closely with you to ensure optimal protection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};