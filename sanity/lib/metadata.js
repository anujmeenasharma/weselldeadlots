import { imageUrl } from "./image";
import { siteUrl } from "../env";

const absolute = (url) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ogImage = (image) => {
  const url = imageUrl(image, { width: 1200, height: 630 });
  return url ? [{ url: absolute(url), width: 1200, height: 630, alt: image?.alt || undefined }] : undefined;
};

/**
 * Build Next.js metadata for a page from its SEO object.
 * Only keys with values are returned, so anything unset inherits from the root layout
 * (which is built from the default SEO in Website Settings) — no duplicate tags.
 */
export function buildPageMetadata(seo = {}, { path, title, description } = {}) {
  const meta = {};
  const metaTitle = seo?.metaTitle || title;
  const metaDescription = seo?.metaDescription || description;

  if (metaTitle) meta.title = metaTitle;
  if (metaDescription) meta.description = metaDescription;
  if (seo?.keywords?.length) meta.keywords = seo.keywords;

  const canonical = seo?.canonicalUrl || path;
  if (canonical) meta.alternates = { canonical };

  if (seo?.noIndex || seo?.noFollow) {
    meta.robots = { index: !seo.noIndex, follow: !seo.noFollow };
  }

  const og = {
    title: seo?.ogTitle || metaTitle,
    description: seo?.ogDescription || metaDescription,
    images: ogImage(seo?.ogImage),
    url: canonical ? absolute(canonical) : undefined,
  };
  if (og.title || og.description || og.images) {
    meta.openGraph = Object.fromEntries(Object.entries(og).filter(([, v]) => v));
  }

  const tw = {
    title: seo?.twitterTitle || seo?.ogTitle || metaTitle,
    description: seo?.twitterDescription || seo?.ogDescription || metaDescription,
    images: ogImage(seo?.twitterImage || seo?.ogImage)?.map((i) => i.url),
  };
  if (tw.title || tw.description || tw.images) {
    meta.twitter = { card: "summary_large_image", ...Object.fromEntries(Object.entries(tw).filter(([, v]) => v)) };
  }

  return meta;
}

/** Site-wide defaults for the root layout. */
export function buildRootMetadata(settings) {
  const seo = settings?.defaultSeo || {};
  const title = seo.metaTitle || settings?.siteName;
  const description = seo.metaDescription || settings?.siteDescription;
  const faviconUrl = imageUrl(settings?.favicon, { width: 512, height: 512 });

  const meta = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    publisher: settings?.publisher || settings?.siteName,
    robots: { index: !seo.noIndex, follow: !seo.noFollow },
    openGraph: {
      type: "website",
      siteName: settings?.siteName,
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: ogImage(seo.ogImage),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      images: ogImage(seo.twitterImage || seo.ogImage)?.map((i) => i.url),
    },
  };
  if (faviconUrl) meta.icons = { icon: faviconUrl, apple: faviconUrl };
  return meta;
}

/** Safely serialise JSON-LD for a <script type="application/ld+json"> tag. */
export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Parse an editor-supplied JSON-LD string; invalid JSON is ignored. */
export function parseStructuredData(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
