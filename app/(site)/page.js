import SectionRenderer from "@/components/sanity/SectionRenderer";
import { getHomePage, getSiteSettings } from "@/sanity/lib/content";
import { buildPageMetadata } from "@/sanity/lib/metadata";

// Revalidate the homepage every 10 minutes (ISR) for Shopify product data.
// Sanity content is revalidated on publish via /api/revalidate.
export const revalidate = 600;

export async function generateMetadata() {
  const home = await getHomePage();
  // Title/description fall back to the site defaults set in the root layout.
  return buildPageMetadata(home?.seo, { path: "/" });
}

export default async function Page() {
  // Sections (order, visibility and content) come from the Sanity Homepage document.
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()]);

  return (
    <div>
      <SectionRenderer sections={home?.sections} settings={settings} />
    </div>
  );
}
