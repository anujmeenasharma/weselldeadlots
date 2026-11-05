import { cache } from "react";
import { sanityFetch } from "./fetch";
import {
  BLOG_POST_QUERY,
  BLOG_POSTS_FOR_SITEMAP_QUERY,
  BLOG_POSTS_QUERY,
  BLOG_SETTINGS_QUERY,
  CONTACT_PAGE_QUERY,
  FOOTER_QUERY,
  HOME_PAGE_QUERY,
  NAVIGATION_QUERY,
  PAGE_BY_SLUG_QUERY,
  PAGES_FOR_SITEMAP_QUERY,
  SELL_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import { defaultPages, defaultsByType } from "../seed/content";

/**
 * Document-level fallback: if Sanity returns a document it is used exactly as edited
 * (empty fields stay empty). Only when the document doesn't exist yet — or Sanity
 * isn't configured — do we use the original site content from sanity/seed/content.js.
 */
const singleton = (type, query) =>
  cache(async () => (await sanityFetch({ query, tags: [type] })) ?? defaultsByType[type]);

/** @returns {Promise<import("../types").SiteSettings>} */
export const getSiteSettings = singleton("siteSettings", SITE_SETTINGS_QUERY);
export const getNavigation = singleton("navigation", NAVIGATION_QUERY);
export const getFooter = singleton("footer", FOOTER_QUERY);
export const getHomePage = singleton("homePage", HOME_PAGE_QUERY);
export const getContactPage = singleton("contactPage", CONTACT_PAGE_QUERY);
export const getSellPage = singleton("sellPage", SELL_PAGE_QUERY);
export const getBlogSettings = singleton("blogSettings", BLOG_SETTINGS_QUERY);

export const getPageBySlug = cache(async (slug) => {
  const page = await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
  // A page that exists in Sanity always wins — including a hidden one, which must 404.
  if (page) return page.status === "hidden" ? null : page;
  // Sanity has no page with this slug: use a built-in default (privacy/terms) if one exists.
  return defaultPages.find((p) => p.slug.current === slug) ?? null;
});

export const getSitemapPages = async () => {
  const pages = await sanityFetch({ query: PAGES_FOR_SITEMAP_QUERY, tags: ["page"] });
  if (pages) {
    const slugs = new Set(pages.map((p) => p.slug));
    const live = pages.filter((p) => p.status !== "hidden" && !p.noIndex);
    // Built-in defaults that haven't been migrated yet are still live routes.
    defaultPages.forEach((p) => !slugs.has(p.slug.current) && live.push({ slug: p.slug.current }));
    return live;
  }
  return defaultPages.map((p) => ({ slug: p.slug.current }));
};

export const getBlogPosts = cache(async () => (await sanityFetch({ query: BLOG_POSTS_QUERY, tags: ["blogPost"] })) ?? []);

export const getBlogPost = cache((slug) =>
  sanityFetch({ query: BLOG_POST_QUERY, params: { slug }, tags: ["blogPost", `blogPost:${slug}`] }),
);

export const getSitemapPosts = async () =>
  (await sanityFetch({ query: BLOG_POSTS_FOR_SITEMAP_QUERY, tags: ["blogPost"] })) ?? [];
