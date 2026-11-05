import { defineField, defineType } from "sanity";
import { SearchIcon } from "../../icons";
import { imageField } from "../helpers";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: false },
  fieldsets: [
    { name: "social", title: "Social sharing (Open Graph / Twitter)", options: { collapsible: true, collapsed: true } },
    { name: "advanced", title: "Advanced", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "metaTitle",
      title: "SEO title",
      type: "string",
      description: "Shown in search results and the browser tab. Leave empty to use the default.",
      validation: (Rule) => Rule.max(70).warning("Titles over 70 characters may be truncated."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170).warning("Descriptions over 170 characters may be truncated."),
    }),
    defineField({
      name: "keywords",
      title: "Meta keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "string",
      description: "Leave empty to use this page's own URL. Accepts a path (\"/contact\") or a full URL.",
      fieldset: "advanced",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines (noindex)",
      type: "boolean",
      initialValue: false,
      fieldset: "advanced",
    }),
    defineField({
      name: "noFollow",
      title: "Don't follow links (nofollow)",
      type: "boolean",
      initialValue: false,
      fieldset: "advanced",
    }),
    defineField({
      name: "structuredData",
      title: "Structured data (JSON-LD)",
      type: "text",
      rows: 6,
      fieldset: "advanced",
      description:
        "Optional extra schema.org JSON-LD object. Must be valid JSON. It is rendered as data only and never executed.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          try {
            JSON.parse(value);
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
    defineField({ name: "ogTitle", title: "Open Graph title", type: "string", fieldset: "social" }),
    defineField({ name: "ogDescription", title: "Open Graph description", type: "text", rows: 2, fieldset: "social" }),
    imageField("ogImage", "Open Graph image", { fieldset: "social", description: "Recommended size 1200×630." }),
    defineField({ name: "twitterTitle", title: "Twitter title", type: "string", fieldset: "social" }),
    defineField({ name: "twitterDescription", title: "Twitter description", type: "text", rows: 2, fieldset: "social" }),
    imageField("twitterImage", "Twitter image", { fieldset: "social" }),
  ],
});
