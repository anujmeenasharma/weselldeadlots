import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from "@/components/AppLink";

export const metadata = {
  alternates: {
    canonical: '/terms'
  }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-black h-[40vh] flex items-center text-white py-12 px-10 sm:px-10 lg:px-20">
        <div className="w-full">
          <Link href="/" className="flex cursor-pointer items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Back</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light">
            Terms and Conditions
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
          By using WeSellDeadLots ("we," "our," or "us") and our services through{' '}
          <span className="font-medium">www.weselldeadlots.com</span> (the "Site"), you ("you" or "User") agree to these Terms and
          Conditions.
        </p>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            1. Products and Services
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            We supply a wide range of quality products including but not limited to:
          </p>
          <ul className="space-y-2 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg">• Electrical Motors</li>
            <li className="text-gray-700 text-base sm:text-lg">• Power Tools</li>
            <li className="text-gray-700 text-base sm:text-lg">• Wiring Accessories</li>
            <li className="text-gray-700 text-base sm:text-lg">• Industrial Electronics</li>
            <li className="text-gray-700 text-base sm:text-lg">• Hardware Supplies</li>
          </ul>
          <p className="text-gray-700 text-base sm:text-lg mt-4 leading-relaxed">
            All product descriptions, images, and specifications are provided for informational purposes and
            are subject to change without prior notice.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            2. Pricing and Payment
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            All prices listed on our website are in AED (United Arab Emirates Dirham) unless stated
            otherwise.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            3. Shipping and Delivery
          </h2>
          <ul className="space-y-3 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg leading-relaxed">
              • We offer local shipping.
            </li>
            <li className="text-gray-700 text-base sm:text-lg leading-relaxed">
              • Delivery timelines may vary based on stock availability, shipping destination, and logistics.
            </li>
            <li className="text-gray-700 text-base sm:text-lg leading-relaxed">
              • Shipping charges, customs duties, and taxes are the responsibility of the buyer unless stated
              otherwise.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            4. Returns and Refunds
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Products can be returned within 10 days of delivery if they are unused and in their original
            packaging.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
            We strive to ensure the accuracy of all information on our website. However, we are not liable for:
          </p>
          <ul className="space-y-3 ml-4 sm:ml-6">
            <li className="text-gray-700 text-base sm:text-lg leading-relaxed">
              • Any indirect, incidental, or consequential damages arising from the use of our products or
              services.
            </li>
            <li className="text-gray-700 text-base sm:text-lg leading-relaxed">
              • Any errors or omissions in product descriptions or pricing.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            6. Intellectual Property
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            All content, logos, graphics, and images on this website are the property of We Sell Dead Lots
            and are protected by intellectual property laws. Unauthorized use or reproduction is prohibited.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            7. Governing Law
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            These Terms shall be governed and interpreted in accordance with the laws of the United Arab
            Emirates. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in
            Sharjah, UAE.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            8. Contact Information
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