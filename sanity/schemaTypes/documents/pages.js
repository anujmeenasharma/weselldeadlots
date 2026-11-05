import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon, HomeIcon, EnvelopeIcon, UploadIcon, ComposeIcon, EditIcon } from "../../icons";
import { RESERVED_SLUGS, imageField } from "../helpers";
import { PAGE_SECTION_TYPES } from "../sections";

const sectionsField = (types = PAGE_SECTION_TYPES, group) =>
  defineField({
    name: "sections",
    title: "Page sections",
    type: "array",
    group,
    description: "Add, remove, reorder (drag) or hide sections.",
    of: types.map((type) => defineArrayMember({ type })),
    options: { insertMenu: { views: [{ name: "list" }] } },
  });

const seoField = (group = "seo") => defineField({ name: "seo", title: "SEO", type: "seo", group });

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Internal title", type: "string", initialValue: "Homepage", group: "content" }),
    sectionsField(PAGE_SECTION_TYPES, "content"),
    seoField(),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Page title", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      description: "The page will be available at /your-slug.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const value = slug?.current;
          if (!value) return true;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return "Use lowercase letters, numbers and dashes only";
          if (RESERVED_SLUGS.includes(value)) return `"${value}" is used by a built-in page`;
          return true;
        }),
    }),
    defineField({
      name: "status",
      title: "Visibility",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Hidden (returns 404)", value: "hidden" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "live",
    }),
    sectionsField(PAGE_SECTION_TYPES, "content"),
    seoField(),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", status: "status" },
    prepare: ({ title, slug, status }) => ({
      title: `${status === "hidden" ? "[hidden] " : ""}${title}`,
      subtitle: slug ? `/${slug}` : "No slug",
    }),
  },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "form", title: "Form" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 2,
      group: "content",
      description: "Press Enter for a line break.",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, group: "content" }),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed URL", type: "url", group: "content" }),
    defineField({ name: "formHeading", title: "Form heading", type: "string", group: "form" }),
    defineField({
      name: "placeholders",
      title: "Field placeholders",
      type: "object",
      group: "form",
      fields: ["name", "email", "phone", "subject"].map((n) => defineField({ name: n, type: "string" })),
    }),
    defineField({
      name: "errors",
      title: "Validation messages",
      type: "object",
      group: "form",
      fields: ["name", "email", "phone", "subject", "general"].map((n) => defineField({ name: n, type: "string" })),
    }),
    defineField({ name: "submitLabel", title: "Submit button label", type: "string", group: "form" }),
    defineField({ name: "sendingLabel", title: "Sending label", type: "string", group: "form" }),
    defineField({ name: "successMessage", title: "Success message", type: "string", group: "form" }),
    defineField({ name: "faq", title: "FAQ section", type: "faqSection", group: "faq" }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});

export const sellPage = defineType({
  name: "sellPage",
  title: "Sell With Us Page",
  type: "document",
  icon: UploadIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "form", title: "Form" },
    { name: "options", title: "Dropdown options" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro text", type: "string", group: "hero" }),
    imageField("heroImage", "Hero background image", { group: "hero" }),
    defineField({
      name: "labels",
      title: "Field labels",
      type: "object",
      group: "form",
      fields: ["company", "mobile", "email", "category", "costPrice", "askPrice", "country", "state"].map((n) =>
        defineField({ name: n, type: "string" }),
      ),
    }),
    defineField({
      name: "placeholders",
      title: "Field placeholders",
      type: "object",
      group: "form",
      fields: ["company", "mobile", "email", "category", "country", "state", "stateDisabled"].map((n) =>
        defineField({ name: n, type: "string" }),
      ),
    }),
    defineField({
      name: "submitLabels",
      title: "Submit button labels",
      type: "object",
      group: "form",
      fields: ["idle", "loading", "success", "error"].map((n) => defineField({ name: n, type: "string" })),
    }),
    defineField({ name: "stockCategories", title: "Stock categories", type: "array", of: [{ type: "string" }], group: "options" }),
    defineField({
      name: "currencies",
      title: "Currencies",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "options",
    }),
    defineField({ name: "defaultCurrency", title: "Default currency", type: "string", group: "options", initialValue: "AED" }),
    defineField({ name: "countries", title: "Countries & states", type: "array", of: [{ type: "countryStates" }], group: "options" }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: "Sell With Us Page" }) },
});

export const blogSettings = defineType({
  name: "blogSettings",
  title: "Blog Page Settings",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Hero title", type: "string", group: "content" }),
    defineField({ name: "heroDescription", title: "Hero description", type: "text", rows: 2, group: "content" }),
    imageField("heroImage", "Hero background image", { group: "content" }),
    defineField({ name: "backLabel", title: "Back link label", type: "string", group: "content" }),
    defineField({ name: "searchPlaceholder", title: "Search placeholder", type: "string", group: "content" }),
    defineField({ name: "cardLabel", title: "Card category label", type: "string", group: "content" }),
    defineField({ name: "readMoreText", title: "Fallback excerpt text", type: "string", group: "content" }),
    defineField({ name: "publishedLabel", title: "Published label", type: "string", group: "content" }),
    defineField({ name: "loadMoreLabel", title: "Load more label", type: "string", group: "content" }),
    defineField({ name: "loadingLabel", title: "Loading label", type: "string", group: "content" }),
    defineField({ name: "emptyMessage", title: "No results message", type: "string", group: "content" }),
    defineField({ name: "postLabel", title: "Article page label", type: "string", group: "content" }),
    defineField({ name: "fallbackImageUrl", title: "Fallback card image URL", type: "url", group: "content" }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: "Blog Page Settings" }) },
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: EditIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, group: "content" }),
    imageField("mainImage", "Featured image", { group: "content" }),
    defineField({ name: "body", title: "Body", type: "richText", group: "content" }),
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      group: "meta",
      fields: [defineField({ name: "name", title: "Name", type: "string" }), imageField("image", "Photo")],
    }),
    defineField({ name: "category", title: "Category", type: "string", group: "meta" }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "meta" }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "updatedAt", title: "Updated date", type: "datetime", group: "meta" }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      validation: (Rule) => Rule.max(6),
    }),
    seoField(),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "mainImage" } },
});
