// Central Sanity configuration. All values come from environment variables.
// NEXT_PUBLIC_* values are safe to expose (project id / dataset are public identifiers).
// Tokens (SANITY_API_READ_TOKEN / SANITY_API_WRITE_TOKEN) are server-only and must never
// be prefixed with NEXT_PUBLIC_.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";
export const studioUrl = "/studio";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://weselldeadlots.com").replace(/\/$/, "");

/** True when a Sanity project has been connected through env vars. */
export const isSanityConfigured = Boolean(projectId);
