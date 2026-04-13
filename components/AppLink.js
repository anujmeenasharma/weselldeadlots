"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLink({ href, children, className, onClick, ...props }) {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/arabic");

  // If href is absolute or external, don't modify
  if (typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel"))) {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  // Prepend /arabic if the current route is arabic and href is a root path
  let targetHref = href;
  if (isArabic && typeof href === "string" && href.startsWith("/")) {
    targetHref = `/arabic${href === "/" ? "" : href}`;
  }

  return (
    <Link href={targetHref} className={className} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
