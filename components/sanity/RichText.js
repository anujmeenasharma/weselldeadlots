import { PortableText } from "next-sanity";
import { imageAlt, imageUrl } from "@/sanity/lib/image";
import { safeHref } from "@/sanity/lib/links";

const TEXT = "text-gray-700 text-base sm:text-lg";

const link = ({ value, children }) => {
  const href = safeHref(value?.href);
  if (!href) return <>{children}</>;
  const external = value?.openInNewTab || /^https?:/i.test(href);
  return (
    <a href={href} className="text-blue-600 underline hover:text-blue-800" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
};

const image = ({ value }) => {
  const src = imageUrl(value, { width: 1200 });
  if (!src) return null;
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={imageAlt(value)} loading="lazy" className="w-full h-auto rounded-lg" />
      {value.caption && <figcaption className="text-sm text-gray-500 mt-2">{value.caption}</figcaption>}
    </figure>
  );
};

/** Styled components matching the site's policy pages (also used by generic rich-text sections). */
const styledComponents = (strongClass) => ({
  block: {
    normal: ({ children }) => <p className={`${TEXT} mb-4 leading-relaxed`}>{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className={`${TEXT} border-l-4 border-gray-300 pl-4 italic mb-4`}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-2 ml-4 sm:ml-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className={`space-y-2 ml-8 sm:ml-10 mb-4 list-decimal ${TEXT}`}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={TEXT}>• {children}</li>,
    number: ({ children }) => <li className={TEXT}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className={strongClass}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link,
  },
  types: { image },
});

/** Semantic tags only — for containers that style descendants themselves (blog articles). */
const plainComponents = {
  marks: {
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => {
      const href = safeHref(value?.href);
      if (!href) return <>{children}</>;
      return (
        <a href={href} {...(value?.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: { image },
};

/**
 * Safe Portable Text renderer. Only known block/mark types render; there is no raw HTML path,
 * and links are restricted to http(s), mailto, tel and relative URLs.
 */
export default function RichText({ value, variant = "styled", strongClass = "font-semibold text-gray-900", className }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const components = variant === "plain" ? plainComponents : styledComponents(strongClass);
  return (
    <div className={className ?? "[&>*:last-child]:mb-0"}>
      <PortableText value={value} components={components} />
    </div>
  );
}
