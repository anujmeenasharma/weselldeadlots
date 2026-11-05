"use client";

import Link from "@/components/AppLink";
import { linkHref, linkTargetProps, trackLinkClick } from "@/sanity/lib/links";

/**
 * Renders a CMS `link` object through the existing AppLink (keeps the /arabic prefixing).
 * Returns null for hidden links or links without a safe destination.
 */
export default function CmsLink({ link, className, onClick, children }) {
  const href = linkHref(link);
  if (!link || link.hidden || !href) return null;
  return (
    <Link
      href={href}
      className={className}
      {...linkTargetProps(link)}
      onClick={(e) => {
        trackLinkClick(link);
        onClick?.(e);
      }}
    >
      {children ?? link.label}
    </Link>
  );
}
