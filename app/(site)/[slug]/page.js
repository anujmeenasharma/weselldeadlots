import { notFound } from "next/navigation";
import SectionRenderer from "@/components/sanity/SectionRenderer";
import JsonLd from "@/components/sanity/JsonLd";
import { getPageBySlug, getSiteSettings } from "@/sanity/lib/content";
import { buildPageMetadata, parseStructuredData } from "@/sanity/lib/metadata";

// CMS-managed pages (e.g. /privacy, /terms, and any page created in Sanity Studio → Pages).
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page Not Found", robots: { index: false } };
  return buildPageMetadata(page.seo, { path: `/${slug}`, title: page.title });
}

export default async function CmsPage({ params }) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()]);
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={parseStructuredData(page.seo?.structuredData)} />
      <SectionRenderer sections={page.sections} settings={settings} />
    </div>
  );
}
