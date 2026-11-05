// Helpers for the reusable `link` object used by every CMS-driven button / link.

const SAFE_PROTOCOL = /^(https?:|mailto:|tel:)/i;

/** Only allow relative paths, anchors and http(s)/mailto/tel URLs. Blocks javascript: etc. */
export function safeHref(href) {
  if (typeof href !== "string") return null;
  const value = href.trim();
  if (!value) return null;
  if (value.startsWith("/") || value.startsWith("#")) return value;
  if (SAFE_PROTOCOL.test(value)) return value;
  return null;
}

export function linkHref(link) {
  if (!link) return null;
  const raw = link.linkType === "external" ? link.url : link.path ?? link.url;
  return safeHref(raw);
}

/** Visible links only, with a resolved href. */
export function visibleLinks(links) {
  return (links || []).filter((l) => l && !l.hidden && linkHref(l));
}

export function linkTargetProps(link) {
  return link?.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export function trackLinkClick(link) {
  if (link?.trackingEvent && typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", link.trackingEvent);
  }
}
