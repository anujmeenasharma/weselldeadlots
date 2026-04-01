import ClientLayout from "./clientLayout";
import Navbar from "@/components/Partials/Navbar";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Partials/Footer";
import WhatsAppButton from "@/components/WhatsappButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

import Script from "next/script";
import MetaPixel from "@/components/MetaPixel";

export const metadata = {
  metadataBase: new URL("https://weselldeadlots.com"),
  title: "Wholesale Industrial Surplus UAE | WeSellDeadLots",
  description: "Shop discounted industrial surplus in UAE – tools, MRO, construction stock & more. Bulk deals for resellers, exporters, and contractors.",
  keywords: ["Industrial Surplus", "UAE", "Wholesale Tools", "MRO", "Electrical Materials", "Hardware Supplies", "WeSellDeadLots", "Surplus Inventory", "Used Industrial tools"],
  publisher: "WeSellDeadLots",
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WeSellDeadLots",
  "url": "https://www.weselldeadlots.com",
  "logo": "https://www.weselldeadlots.com/images/logo.png",
  "description": "WeSellDeadLots is a UAE-based wholesale platform selling surplus and liquidation inventory in tools, industrial, electrical, and automation categories.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Street no:19 - Industrial Area 3",
    "addressLocality": "Sharjah",
    "addressRegion": "Sharjah",
    "postalCode": "00000",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+971 55 274 8974",
    "contactType": "Sales",
    "areaServed": "AE",
    "availableLanguage": ["English"]
  },
  "foundingDate": "2020",
  "sameAs": [
    "https://www.linkedin.com/company/weselldeadlots"
  ]
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Wholesale Dead Lots & Surplus Inventory Sales",
  "description": "Wholesale supplier of dead lots, surplus, and overstock inventory across multiple product categories, serving bulk buyers and businesses in the UAE.",
  "provider": {
    "@type": "Organization",
    "name": "We Sell Dead Lots",
    "url": "https://www.weselldeadlots.com/"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United Arab Emirates"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
      </head>
      <body className={montserrat.variable}>
        {/* Google Tag Manager */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>

        <MetaPixel />

        <ClientLayout>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </ClientLayout>
      </body>
    </html>
  );
}