import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  const services = [
    { id: 'security-guards', name: 'Security Guard Services', path: '/services/security-guards' },
    { id: 'surveillance', name: 'Surveillance & Alarm Systems', path: '/services/surveillance' },
    { id: 'virtual-guard', name: 'Virtual Security Guard', path: '/services/virtual-guard' },
    { id: 'it-support', name: 'IT Support', path: '/services/it-support' },
    { id: 'secure-transport', name: 'Secure Transport (High-Value Goods)', path: '/services/secure-transport-high-value-goods' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/download Stigg.jpeg"
              alt="Stigg Security Inc."
              className="h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-text-secondary hover:text-stigg-red transition-colors ${
                isActive('/') ? 'text-stigg-red font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-text-secondary hover:text-stigg-red transition-colors ${
                isActive('/about') ? 'text-stigg-red font-semibold' : ''
              }`}
            >
              About Us
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center text-text-secondary hover:text-stigg-red transition-colors"
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200">
                  <div className="py-2">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={service.path}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-red-50 hover:text-stigg-red transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className={`text-text-secondary hover:text-stigg-red transition-colors ${
                isActive('/blog') ? 'text-stigg-red font-semibold' : ''
              }`}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`text-text-secondary hover:text-stigg-red transition-colors ${
                isActive('/contact') ? 'text-stigg-red font-semibold' : ''
              }`}
            >
              Contact
            </Link>
            <Link
              to="/quote"
              className="bg-stigg-red text-white px-6 py-2 rounded-full hover:bg-stigg-red-dark transition-colors font-semibold shadow-sm"
            >
              Free Quote - 2hr Response
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-stigg-red transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-text-secondary hover:text-stigg-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-text-secondary hover:text-stigg-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              {/* Mobile Services */}
              <div className="space-y-2">
                <div className="text-text-primary font-medium">Services</div>
                <div className="pl-4 space-y-2">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={service.path}
                      className="block text-sm text-text-muted hover:text-stigg-red transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/blog"
                className="text-text-secondary hover:text-stigg-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="text-text-secondary hover:text-stigg-red transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/quote"
                className="bg-stigg-red text-white px-6 py-2 rounded-full hover:bg-stigg-red-dark transition-colors font-semibold text-center shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};