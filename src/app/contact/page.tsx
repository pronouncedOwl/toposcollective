'use client';

import LazySection from '@/components/LazySection';
import ContactForm from '@/components/ContactForm';
import TurnstileProvider from '@/components/TurnstileProvider';

export default function ContactPage() {
  return (
    <TurnstileProvider>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <LazySection direction="fade" delay={0}>
          <div className="pt-32 pb-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center">
                <h1 className="text-giga font-bold text-gray-900 mb-6">
                  Contact Us
                </h1>
                <p className="text-xl text-gray-600">
                  We&apos;d love to hear from you!
                </p>
              </div>
            </div>
          </div>
        </LazySection>

        {/* Contact Information Section */}
        <LazySection direction="up" delay={100}>
          <div className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 text-center">
                Get in touch
              </h2>
              
              <div className="text-center space-y-4 mb-12">
                <p className="text-lg font-semibold text-gray-900">
                  Austin, Texas
                </p>
                <p className="text-lg text-gray-700">
                  <a href="tel:5128508560" className="hover:text-[#3b7d98] transition-colors">
                    (512) 850-8560
                  </a>
                </p>
                <p className="text-lg text-gray-700">
                  <a href="mailto:info@toposcollective.com" className="hover:text-[#3b7d98] transition-colors">
                    info@toposcollective.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </LazySection>

        {/* Contact Form Section */}
        <LazySection direction="up" delay={200}>
          <div className="py-20 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 text-center">
                Interested in working with Topos Collective, or staying up to date on our projects? Subscribe below.
              </h2>
              <p className="text-sm text-gray-600 mb-8 text-center">
                * indicates required
              </p>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </LazySection>
      </div>
    </TurnstileProvider>
  );
}

