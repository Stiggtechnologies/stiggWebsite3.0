import React from 'react';
import { SEOHead } from '../components/SEOHead';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Terms of Service | Stigg Security Inc."
        description="Understand the terms and conditions for using our services and website. Your security is our priority."
        keywords="terms of service, service conditions, security terms"
        canonicalUrl="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> March 1, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the services provided by Stigg Security Inc., you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Services</h2>
              <p className="text-gray-700 mb-4">
                Stigg Security Inc. provides comprehensive security services including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Security guard services</li>
                <li>Surveillance and alarm system installation</li>
                <li>Virtual security guard services</li>
                <li>IT support and infrastructure services</li>
                <li>Emergency response services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Agreements</h2>
              <p className="text-gray-700 mb-4">
                Specific terms for each service will be outlined in separate service agreements. These Terms of Service apply to all services unless specifically modified in individual service contracts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Client Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Clients are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing accurate information about security needs</li>
                <li>Ensuring access to premises for service delivery</li>
                <li>Timely payment of invoices</li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>Reporting any changes to security requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Payment terms are as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Invoices are due within 30 days of the invoice date</li>
                <li>Late payments may incur additional charges</li>
                <li>Services may be suspended for non-payment</li>
                <li>All prices are in Canadian dollars</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Stigg Security Inc.'s liability is limited to the extent permitted by law. We maintain comprehensive insurance coverage for our services. Our liability shall not exceed the amount paid for the specific service in question.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Confidentiality</h2>
              <p className="text-gray-700 mb-4">
                We maintain strict confidentiality regarding all client information and security arrangements. All personnel are bound by confidentiality agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate services with appropriate notice as specified in the service agreement. Emergency termination may occur in cases of safety concerns or breach of terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of the Province of Alberta, Canada. Any disputes will be resolved in Alberta courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Emergency Services</h2>
              <p className="text-gray-700 mb-4">
                For immediate emergencies, contact local emergency services (911) first, then contact our 24/7 emergency line at 1-587-644-4644 or 780-215-2887.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions regarding these Terms of Service, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Stigg Security Inc.</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  Email: admin@stigg.ca
                </p>
                <p className="text-gray-700 mb-2">
                  Phone: 1-587-644-4644 | 780-215-2887
                </p>
                <p className="text-gray-700">
                  Address: 200 Parent Way, Fort McMurray, AB T9H 5E6
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. Changes will be posted on our website and take effect immediately upon posting.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};