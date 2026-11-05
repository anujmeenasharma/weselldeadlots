import Landing from "@/components/Pages/Home/Landing";
import TodaysDeals from "@/components/Pages/Home/TodaysDeals";
import ExploreAllLots from "@/components/Pages/Home/ExploreAllLots";
import Category from "@/components/Pages/Home/Category";
import FAQ from "@/components/Partials/FAQ";
import HeroParallax from "./HeroParallax";
import {
  CallToAction,
  ContactInfo,
  Gallery,
  ImageWithText,
  LegalContent,
  LogoShowcase,
  PageHeader,
  RichTextBlock,
  Stats,
  Testimonials,
  Video,
} from "./sections/ContentSections";
import { fetchExploreLots, fetchTodaysDeals } from "@/lib/shopify";
import { qrSvg } from "@/lib/qr";
import { whatsappQrTarget } from "@/lib/whatsapp";

async function Hero({ section, settings }) {
  const target = section.showChannelQr !== false ? whatsappQrTarget(settings) : null;
  const channelQr = target ? { ...target, svg: await qrSvg(target.url) } : null;
  const landing = <Landing section={section} channelQr={channelQr?.svg ? channelQr : null} />;
  return section.parallax === false ? landing : <HeroParallax>{landing}</HeroParallax>;
}

async function ProductCarouselSection({ section }) {
  const products = await fetchTodaysDeals(section.collectionHandle, section.productCount);
  return <TodaysDeals products={products} heading={section.heading} />;
}

async function ProductGridSection({ section }) {
  const pageSize = section.pageSize || 25;
  const data = await fetchExploreLots(pageSize);
  return (
    <ExploreAllLots
      initialProducts={data?.edges || []}
      initialPageInfo={data?.pageInfo || { hasNextPage: false, endCursor: null }}
      heading={section.heading}
      pageSize={pageSize}
      loadMoreLabel={section.loadMoreLabel || undefined}
      loadingLabel={section.loadingLabel || undefined}
    />
  );
}

/**
 * Whitelist of renderable section types. Anything not listed here is ignored,
 * so CMS content can never inject arbitrary components or code.
 */
const SECTION_COMPONENTS = {
  heroSection: Hero,
  productCarouselSection: ProductCarouselSection,
  productGridSection: ProductGridSection,
  categoryBrowserSection: Category,
  pageHeaderSection: PageHeader,
  legalContentSection: LegalContent,
  richTextSection: RichTextBlock,
  imageWithTextSection: ImageWithText,
  gallerySection: Gallery,
  statsSection: Stats,
  faqSection: FAQ,
  ctaSection: CallToAction,
  videoSection: Video,
  logoShowcaseSection: LogoShowcase,
  testimonialsSection: Testimonials,
  contactInfoSection: ContactInfo,
};

export default function SectionRenderer({ sections, settings }) {
  return (sections || [])
    .filter((section) => section && !section.hidden && SECTION_COMPONENTS[section._type])
    .map((section, index) => {
      const Component = SECTION_COMPONENTS[section._type];
      return <Component key={section._key || index} section={section} settings={settings} />;
    });
}
