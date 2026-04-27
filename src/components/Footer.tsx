import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/download Stigg.jpeg"
                alt="Stigg Security Inc."
                className="h-20 w-auto"
              />
            </div>
            <p className="text-gray-200 text-sm">
              Alberta's trusted security partner, providing comprehensive protection solutions for businesses and properties across the province.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-gray-300 hover:text-white transition-colors">
                  Get Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/security-guards" className="text-gray-300 hover:text-white transition-colors">
                  Security Guards
                </Link>
              </li>
              <li>
                <Link to="/services/surveillance" className="text-gray-300 hover:text-white transition-colors">
                  Surveillance Systems
                </Link>
              </li>
              <li>
                <Link to="/services/virtual-guard" className="text-gray-300 hover:text-white transition-colors">
                  Virtual Security
                </Link>
              </li>
              <li>
                <Link to="/services/it-support" className="text-gray-300 hover:text-white transition-colors">
                  IT Support
                </Link>
              </li>
              <li>
                <Link to="/services/secure-transport-high-value-goods" className="text-gray-300 hover:text-white transition-colors">
                  Secure Transportation of High-Value Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-stigg-red" />
                <div className="text-gray-200">
                  <div className="font-semibold">24/7 Emergency: 1-587-644-4644 | 780-215-2887</div>
                  <div className="text-sm">Response within 15 minutes</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-stigg-red" />
                <span className="text-gray-200">admin@stigg.ca</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-stigg-red mt-1" />
                <div className="text-gray-200">
                  <div>200 Parent Way, Fort McMurray, AB T9H 5E6</div>
                  <div>121 8 Ave SE, High River, AB T1V 1R8</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-stigg-red" />
                <span className="text-gray-200">24/7 Emergency Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Stigg Security Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};