import ClientLayout from "./clientLayout";
import Navbar from "@/components/Partials/Navbar";
import { Montserrat } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Partials/Footer";
import WhatsAppButton from "@/components/WhatsappButton";
import AnnouncementBar from "@/components/sanity/AnnouncementBar";
import JsonLd from "@/components/sanity/JsonLd";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

import Script from "next/script";
import MetaPixel from "@/components/MetaPixel";
import { draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import GoogleTranslate from "@/components/GoogleTranslate";
import { getFooter, getNavigation, getSiteSettings } from "@/sanity/lib/content";
import { buildRootMetadata } from "@/sanity/lib/metadata";
import { HEX_COLOR } from "@/sanity/lib/validation";

export async function generateMetadata() {
  return buildRootMetadata(await getSiteSettings());
}

function organizationLd(settings) {
  const org = settings?.organization || {};
  const address = settings?.address || {};
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name || settings?.siteName,
    url: org.url,
    logo: org.logoUrl,
    description: org.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.phone,
      contactType: org.contactType,
      areaServed: org.areaServed,
      availableLanguage: org.languages,
    },
    foundingDate: org.foundingDate,
    sameAs: (settings?.socialLinks || []).map((s) => s.url).filter(Boolean),
  };
}

function serviceLd(settings) {
  const service = settings?.service;
  if (!service?.name) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "Organization", name: service.providerName, url: service.providerUrl },
    areaServed: { "@type": "Country", name: service.areaServed },
  };
}

/** Brand colours from Website Settings, exposed as CSS variables (validated hex only). */
function brandStyle(settings) {
  const vars = [];
  if (HEX_COLOR.test(settings?.primaryColor || "")) vars.push(`--brand-primary:${settings.primaryColor}`);
  if (HEX_COLOR.test(settings?.secondaryColor || "")) vars.push(`--brand-secondary:${settings.secondaryColor}`);
  return vars.length ? `:root{${vars.join(";")}}` : null;
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const [settings, navigation, footer, draft] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
    draftMode(),
  ]);
  const brandCss = brandStyle(settings);

  return (
    <html lang="en" dir={dir}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:"
        />
        <JsonLd data={organizationLd(settings)} />
        <JsonLd data={serviceLd(settings)} />
        {brandCss && <style>{brandCss}</style>}
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

        <GoogleTranslate />
        <ClientLayout>
          <AnnouncementBar announcement={settings?.announcementBar} />
          <Navbar navigation={navigation} settings={settings} />
          {children}
          <Footer footer={footer} settings={settings} />
          <WhatsAppButton number={settings?.whatsappNumber} message={settings?.whatsappMessage} />
        </ClientLayout>
        {draft.isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
