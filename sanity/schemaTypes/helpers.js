import { defineField } from "sanity";

/** Image field with hotspot/crop, alt text and caption. */
export function imageField(name, title, options = {}) {
  const { description, required = false, group, hidden, fieldset } = options;
  return defineField({
    name,
    title,
    type: "image",
    description,
    group,
    hidden,
    fieldset,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        description: "Describe the image for screen readers and SEO.",
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
    ],
    validation: required ? (Rule) => Rule.required() : undefined,
  });
}

/** Standard "Hide this section" toggle used by every page-builder section. */
export const hiddenField = defineField({
  name: "hidden",
  title: "Hide this section",
  type: "boolean",
  description: "Hidden sections are kept in the CMS but not shown on the website.",
  initialValue: false,
});

export { HEX_COLOR } from "../lib/validation";

/** Slugs used by built-in routes — CMS pages cannot use them. */
export const RESERVED_SLUGS = [
  "api",
  "admin",
  "studio",
  "arabic",
  "blogs",
  "categories",
  "category",
  "contact",
  "product",
  "search",
  "sell-with-us",
  "_next",
];
