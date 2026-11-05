import { draftMode } from "next/headers";
import { client } from "./client";
import { isSanityConfigured } from "../env";

// Server-only token used for draft previews. Never exposed to the browser.
const readToken = process.env.SANITY_API_READ_TOKEN;

// With a webhook configured, cached content lives until Sanity tells us it changed.
// Without one, fall back to time-based revalidation so edits still appear within a minute.
const DEFAULT_REVALIDATE = process.env.SANITY_REVALIDATE_SECRET ? false : 60;

async function isDraftModeEnabled() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // draftMode() is unavailable outside a request (e.g. at build time for sitemap.xml).
    return false;
  }
}

/**
 * Fetch from Sanity on the server.
 * - Published content is cached and tagged (`sanity`, plus the given tags) for webhook revalidation.
 * - In draft mode, drafts are fetched uncached with the server-side read token.
 * - Returns `null` instead of throwing so pages can fall back gracefully.
 */
export async function sanityFetch({ query, params = {}, tags = [] }) {
  if (!isSanityConfigured) return null;

  const isDraft = readToken ? await isDraftModeEnabled() : false;

  try {
    if (isDraft) {
      return await client.fetch(query, params, {
        perspective: "drafts",
        token: readToken,
        useCdn: false,
        stega: false,
        cache: "no-store",
      });
    }
    return await client.fetch(query, params, {
      stega: false,
      next: { revalidate: DEFAULT_REVALIDATE, tags: ["sanity", ...tags] },
    });
  } catch (error) {
    console.error("[sanity] fetch failed:", error?.message || error);
    return null;
  }
}
