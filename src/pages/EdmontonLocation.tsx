import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle, Mail, MapPin, Phone, Clock } from 'lucide-react';

/**
 * Edmonton location page — DRAFT.
 *
 * Every field below is either verified or null (= UNKNOWN, not rendered).
 * Do not fill a null with a guess. Sources:
 *  - Premises address: signed AIM lease (Suite 100, 4936 87 Street NW, Edmonton)
 *    and albertainjurymanagement.ca (postal code T6E 5W3).
 *  - Email: stigg.ca/contact.
 *
 * Before launch (Orville's approval required):
 *  1. Landlord (BrenAlen) written consent for Stigg to occupy part of Suite 100.
 *  2. Set `telephone` to the dedicated Edmonton number once purchased.
 *  3. Set `hours` to real staffed hours.
 *  4. Decide `showStreetAddress` (false = service-area business, address hidden).
 *  5. Flip `launchReady` to true (removes the draft banner and noindex).
 */
const EDMONTON = {
  launchReady: false,
  showStreetAddress: false,
  name: 'Stigg Security Inc.',
  streetAddress: '4936 87 Street NW, Suite 100',
  locality: 'Edmonton',
  region: 'AB',
  postalCode: 'T6E 5W3',
  country: 'CA',
  telephone: null as string | null, // UNKNOWN — dedicated Edmonton local number not yet chosen
  hours: null as string | null, // UNKNOWN — staffed hours not yet set
  email: 'admin@stigg.ca',
  pageUrl: 'https://www.stigg.ca/locations/edmonton',
  serviceArea: [
    'Edmonton',
    'St. Albert',
    'Sherwood Park',
    'Strathcona County',
    'Spruce Grove',
    'Stony Plain',
    'Leduc',
    'Nisku',
    'Beaumont',
    'Fort Saskatchewan',
  ],
};

const services = [
  'Security guard services',
  'Virtual (AI-assisted) surveillance monitoring',
  'Video surveillance system installation',
  'Alarm system installation',
  'Secure transportation of high-value goods',
  'Site security assessments',
];

function buildSchema() {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: EDMONTON.locality,
    addressRegion: EDMONTON.region,
    addressCountry: EDMONTON.country,
  };
  if (EDMONTON.showStreetAddress) {
    address.streetAddress = EDMONTON.streetAddress;
    address.postalCode = EDMONTON.postalCode;
  }
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: EDMONTON.name,
    url: EDMONTON.pageUrl,
    email: EDMONTON.email,
    address,
    areaServed: EDMONTON.serviceArea.map((name) => ({ '@type': 'City', name })),
    parentOrganization: { '@type': 'Organization', name: 'Stigg Security Inc.', url: 'https://www.stigg.ca' },
    sameAs: ['https://www.linkedin.com/company/stigg-security-inc'],
  };
  if (EDMONTON.telephone) schema.telephone = EDMONTON.telephone;
  return schema;
}

export const EdmontonLocation: React.FC = () => {
  const mapQuery = encodeURIComponent(
    `${EDMONTON.streetAddress}, ${EDMONTON.locality}, ${EDMONTON.region} ${EDMONTON.postalCode}`
  );

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Security Services in Edmonton | Stigg Security Inc.</title>
        <meta
          name="description"
          content="Stigg Security serves Edmonton and area with security guards, AI-assisted surveillance monitoring, alarm and video system installation, and secure transport of high-value goods."
        />
        <link rel="canonical" href={EDMONTON.pageUrl} />
        <meta name="robots" content={EDMONTON.launchReady ? 'index, follow' : 'noindex, nofollow'} />
        <script type="application/ld+json">{JSON.stringify(buildSchema())}</script>
      </Helmet>

      {!EDMONTON.launchReady && (
        <div className="bg-yellow-100 text-yellow-900 text-center text-sm py-2 px-4">
          DRAFT — Edmonton page not approved for publication. Phone, hours and on-site details pending.
        </div>
      )}

      <section className="relative bg-gradient-to-r from-stigg-dark to-stigg-red text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Stigg Security in Edmonton</h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Stigg Security provides security guard services, AI-assisted surveillance monitoring, alarm and video
              surveillance installation, and secure transportation of high-value goods for businesses, industrial
              sites, and property managers across the Edmonton region. We work on-site at your property, alongside
              Stigg's Fort McMurray and High River teams.
            </p>
            <Link
              to="/quote"
              className="bg-white text-stigg-red px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Services in Edmonton</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((item) => (
              <div key={item} className="flex items-start bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <CheckCircle className="h-5 w-5 text-stigg-red mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600">
            Learn more about{' '}
            <Link to="/services/secure-transport-high-value-goods" className="text-stigg-red font-semibold">
              secure transportation of high-value goods
            </Link>{' '}
            or see{' '}
            <Link to="/services" className="text-stigg-red font-semibold">
              all services
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Area</h2>
          <p className="text-lg text-gray-700">{EDMONTON.serviceArea.join(' · ')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {EDMONTON.name} — Edmonton
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-stigg-red mr-3 flex-shrink-0" />
                <address className="not-italic">
                  {EDMONTON.showStreetAddress ? (
                    <>
                      {EDMONTON.streetAddress}
                      <br />
                      {EDMONTON.locality}, {EDMONTON.region} {EDMONTON.postalCode}
                    </>
                  ) : (
                    <>Serving {EDMONTON.locality}, {EDMONTON.region} and area (on-site service)</>
                  )}
                </address>
              </div>
              {EDMONTON.telephone && (
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-stigg-red mr-3" />
                  <a href={`tel:${EDMONTON.telephone}`}>
                    {EDMONTON.telephone}
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-stigg-red mr-3" />
                <a href={`mailto:${EDMONTON.email}`}>
                  {EDMONTON.email}
                </a>
              </div>
              {EDMONTON.hours && (
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-stigg-red mr-3" />
                  <span>{EDMONTON.hours}</span>
                </div>
              )}
            </div>
            <Link
              to="/contact"
              className="mt-8 bg-stigg-red text-white px-6 py-3 rounded-full font-semibold inline-flex items-center"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          {EDMONTON.showStreetAddress && (
            <iframe
              title="Stigg Security Edmonton map"
              className="w-full h-96 rounded-lg shadow-lg border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          )}
        </div>
      </section>
    </div>
  );
};
