import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-black h-[40vh] flex items-center text-white py-12 px-10 sm:px-10 lg:px-20">
        <div className="w-full mx-auto">
          <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Back</span>
          </button>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="lg:w-[70%] px-10 sm:px-10 lg:px-20 py-12 sm:py-16">
        {/* Effective Date */}
        <div className="mb-8 space-y-1">
          <p className="text-gray-800 text-base sm:text-lg">
            Effective Date : February 22, 2025
          </p>
          <p className="text-gray-800 text-base sm:text-lg">
            Last Updated : February 22, 2025
          </p>
        </div>

        {/* Introduction */}
        <p className="text-gray-700 text-base sm:text-lg mb-12 leading-relaxed">
          WeSellDeadLots values your privacy and is committed to protecting your personal
          information. This Privacy Policy outlines how we collect, use, and protect your data when you
          visit our website, www.weselldeadlots.com.
        </p>

        {/* Section 1: Who We Are */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            1. Who We Are
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
            We Sell Dead Lots is a registered general trading company based in Sharjah, United Arab
            Emirates (UAE), specializing in electrical materials, electronics, and hardware supplies.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Our website provides information and services related to the wholesale and retail distribution of
            these products.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            We may collect the following information:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6 mb-4">
            <li className="text-gray-700 text-base sm:text-lg">
              • Personal details (name, email address, phone number)
            </li>
            <li className="text-gray-700 text-base sm:text-lg">• Company name and address</li>
            <li className="text-gray-700 text-base sm:text-lg">• Billing and shipping information</li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Communication records (emails, messages)
            </li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Website usage data (IP address, browser type, device information)
            </li>
          </ul>
          <p className="text-gray-700 text-base sm:text-lg mb-3 leading-relaxed">
            We collect information when:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg">• You fill out forms on our website</li>
            <li className="text-gray-700 text-base sm:text-lg">
              • You contact us via email, WhatsApp, or phone
            </li>
            <li className="text-gray-700 text-base sm:text-lg">
              • You make inquiries, place orders, or request quotes
            </li>
          </ul>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            3. How We Use Your Information
          </h2>
          <ul className="space-y-2 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg">
              • Process orders, quotes, and inquiries
            </li>
            <li className="text-gray-700 text-base sm:text-lg">• Respond to customer service requests</li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Send updates, promotions, and newsletters (only if you opt-in)
            </li>
            <li className="text-gray-700 text-base sm:text-lg">• Improve our website and services</li>
            <li className="text-gray-700 text-base sm:text-lg">• Comply with UAE legal requirements</li>
          </ul>
        </section>

        {/* Section 4: Sharing Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            4. Sharing Your Information
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            We do not sell, trade, or rent your personal data to third parties.
          </p>
          <p className="text-gray-700 text-base sm:text-lg mb-3 leading-relaxed">
            We may share information with:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg">• Shipping partners to deliver products</li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Payment service providers for secure transactions
            </li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Legal authorities if required by UAE law.
            </li>
          </ul>
        </section>

        {/* Section 5: Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            5. Data Security
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            We implement security measures to protect your personal information, including:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6 mb-4">
            <li className="text-gray-700 text-base sm:text-lg">• SSL encryption on our website</li>
            <li className="text-gray-700 text-base sm:text-lg">• Secure payment gateways</li>
            <li className="text-gray-700 text-base sm:text-lg">• Access restrictions to sensitive data</li>
          </ul>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            However, no system is 100% secure, and we encourage users to take their own precautions as
            well.
          </p>
        </section>

        {/* Section 6: Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            6. Your Rights
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            You have the right to:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6 mb-4">
            <li className="text-gray-700 text-base sm:text-lg">• Access your personal information</li>
            <li className="text-gray-700 text-base sm:text-lg">• Correct inaccurate information</li>
            <li className="text-gray-700 text-base sm:text-lg">• Request deletion of your data</li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Withdraw consent for marketing communications
            </li>
          </ul>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            To exercise any of these rights, please contact us directly.
          </p>
        </section>

        {/* Section 7: Cookies & Tracking */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            7. Cookies & Tracking
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            Our website uses cookies to improve your browsing experience. Cookies help us:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6 mb-4">
            <li className="text-gray-700 text-base sm:text-lg">• Understand visitor behavior</li>
            <li className="text-gray-700 text-base sm:text-lg">• Save your preferences</li>
            <li className="text-gray-700 text-base sm:text-lg">• Provide a smoother user experience</li>
          </ul>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            You can disable cookies in your browser settings if you prefer.
          </p>
        </section>

        {/* Section 8: Changes to This Policy */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our services, laws, or
            best practices. Any updates will be posted on this page with an updated effective date.
          </p>
        </section>

        {/* Section 9: Contact Us */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            9. Contact Us
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            For any questions regarding these Terms and Conditions, please contact us:
          </p>
          <div className="space-y-3 ml-4 sm:ml-6">
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg">📧</span>
              <p className="text-gray-700 text-base sm:text-lg">
                Email: sales@weselldeadlots.com
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg">📞</span>
              <p className="text-gray-700 text-base sm:text-lg">
                Phone: +971 55 274 8974
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg">📍</span>
              <p className="text-gray-700 text-base sm:text-lg">
                Address: Industrial Area 3, Sharjah, UAE.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}