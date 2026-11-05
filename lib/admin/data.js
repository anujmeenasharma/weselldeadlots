// Server-only data loading for admin pages (always fresh, never cached).
import { getWriteClient } from "./sanityWrite";
import { SITE_PATHS } from "./config";

const opts = { cache: "no-store" };

export async function getDocumentById(id) {
  return getWriteClient().fetch(`*[_id == $id][0]`, { id }, opts);
}

export async function listDocuments(type) {
  return getWriteClient().fetch(
    `*[_type == $type && !(_id in path("drafts.**"))] | order(_updatedAt desc){
      _id, _updatedAt, title, status, publishedAt, "slug": slug.current, "image": mainImage
    }`,
    { type },
    opts,
  );
}

export async function listPostOptions() {
  return getWriteClient().fetch(`*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(title asc){ _id, title }`, {}, opts);
}

/** Paths offered as suggestions in link fields: built-in pages + every CMS page. */
export async function getSitePaths() {
  const slugs = await getWriteClient().fetch(`*[_type == "page" && defined(slug.current)].slug.current`, {}, opts);
  return [...new Set([...SITE_PATHS, ...slugs.map((s) => `/${s}`)])];
}

export async function getOverview() {
  return getWriteClient().fetch(
    `{
      "pages": count(*[_type == "page" && !(_id in path("drafts.**"))]),
      "posts": count(*[_type == "blogPost" && !(_id in path("drafts.**"))]),
      "recent": *[!(_id in path("drafts.**")) && _type in ["siteSettings","navigation","footer","homePage","contactPage","sellPage","blogSettings","page","blogPost"]] | order(_updatedAt desc)[0...6]{ _id, _type, _updatedAt, title }
    }`,
    {},
    opts,
  );
}
