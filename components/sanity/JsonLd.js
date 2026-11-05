import { jsonLdString } from "@/sanity/lib/metadata";

/** Renders structured data as inert JSON (`<` is escaped, so CMS text can't close the tag). */
export default function JsonLd({ data }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
