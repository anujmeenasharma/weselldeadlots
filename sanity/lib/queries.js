import { defineQuery } from "next-sanity";

// Singletons use a fixed _id equal to their type, so drafts resolve via the perspective.
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);
export const NAVIGATION_QUERY = defineQuery(`*[_type == "navigation"][0]`);
export const FOOTER_QUERY = defineQuery(`*[_type == "footer"][0]`);
export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]`);
export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0]`);
export const SELL_PAGE_QUERY = defineQuery(`*[_type == "sellPage"][0]`);
export const BLOG_SETTINGS_QUERY = defineQuery(`*[_type == "blogSettings"][0]`);

export const PAGE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]`,
);

export const PAGES_FOR_SITEMAP_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)]{ "slug": slug.current, status, "noIndex": seo.noIndex, _updatedAt }`,
);

const POST_CARD = `_id, title, "slug": slug.current, excerpt, mainImage, publishedAt, category`;

export const BLOG_POSTS_QUERY = defineQuery(
  `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){ ${POST_CARD} }`,
);

export const BLOG_POST_QUERY = defineQuery(
  `*[_type == "blogPost" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    "relatedPosts": relatedPosts[]->{ ${POST_CARD} }
  }`,
);

export const BLOG_POSTS_FOR_SITEMAP_QUERY = defineQuery(
  `*[_type == "blogPost" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, publishedAt, updatedAt, _updatedAt }`,
);
