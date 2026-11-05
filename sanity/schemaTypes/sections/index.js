import { defineField, defineType } from "sanity";
import {
  BlockContentIcon,
  BulbOutlineIcon,
  CommentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HelpCircleIcon,
  ImagesIcon,
  BasketIcon,
  PlayIcon,
  StarIcon,
  TagsIcon,
  ThListIcon,
  ChartUpwardIcon,
  ImageIcon,
  MasterDetailIcon,
} from "../../icons";
import { hiddenField, imageField } from "../helpers";

const headingField = (initialValue) =>
  defineField({ name: "heading", title: "Heading", type: "string", initialValue });

function preview(title, fallback) {
  return {
    select: { heading: "heading", hidden: "hidden" },
    prepare: ({ heading, hidden }) => ({
      title: `${hidden ? "[hidden] " : ""}${heading || fallback}`,
      subtitle: title,
    }),
  };
}

/** Full-screen hero with background video (homepage "Landing"). */
export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  icon: MasterDetailIcon,
  fieldsets: [
    { name: "media", title: "Background media", options: { collapsible: true } },
    { name: "bottom", title: "Bottom bar", options: { collapsible: true } },
    { name: "explore", title: "Explore button", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: "heading", title: "Main heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "backgroundVideo",
      title: "Background video (upload)",
      type: "file",
      options: { accept: "video/*" },
      fieldset: "media",
    }),
    defineField({
      name: "backgroundVideoUrl",
      title: "Background video URL",
      type: "url",
      description: "Direct .mp4 URL. Used when no video is uploaded.",
      fieldset: "media",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"], allowRelative: true }),
    }),
    imageField("backgroundImage", "Background image", {
      fieldset: "media",
      description: "Used when no video is set, and as the video poster.",
    }),
    defineField({ name: "bottomLeftText", title: "Bottom-left text", type: "string", fieldset: "bottom" }),
    defineField({ name: "badgeText", title: "Bottom-centre badge text", type: "string", fieldset: "bottom" }),
    defineField({ name: "showDivider", title: "Show divider line", type: "boolean", initialValue: true, fieldset: "bottom" }),
    imageField("exploreImage", "Explore button image", { fieldset: "explore" }),
    defineField({
      name: "exploreLink",
      title: "Explore button link",
      type: "string",
      description: 'Path or anchor, e.g. "#categories"',
      fieldset: "explore",
    }),
    defineField({
      name: "parallax",
      title: "Scroll parallax effect",
      type: "boolean",
      initialValue: true,
      description: "Keeps the original scroll animation (homepage).",
    }),
    hiddenField,
  ],
  preview: preview("Hero", "Hero"),
});

export const productCarouselSection = defineType({
  name: "productCarouselSection",
  title: "Product carousel (Shopify)",
  type: "object",
  icon: BasketIcon,
  fields: [
    headingField("Today's Deals"),
    defineField({
      name: "collectionHandle",
      title: "Shopify collection handle",
      type: "string",
      initialValue: "today-deal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productCount",
      title: "Number of products",
      type: "number",
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(50).integer(),
    }),
    hiddenField,
  ],
  preview: preview("Product carousel", "Product carousel"),
});

export const productGridSection = defineType({
  name: "productGridSection",
  title: "All products grid (Shopify)",
  type: "object",
  icon: ThListIcon,
  fields: [
    headingField("Explore All Lots"),
    defineField({
      name: "pageSize",
      title: "Products per page",
      type: "number",
      initialValue: 25,
      validation: (Rule) => Rule.min(1).max(100).integer(),
    }),
    defineField({ name: "loadMoreLabel", title: '"Load more" label', type: "string", initialValue: "Load More" }),
    defineField({ name: "loadingLabel", title: '"Loading" label', type: "string", initialValue: "Loading..." }),
    hiddenField,
  ],
  preview: preview("All products grid", "All products"),
});

export const categoryBrowserSection = defineType({
  name: "categoryBrowserSection",
  title: "Category browser",
  type: "object",
  icon: TagsIcon,
  fields: [
    headingField("Categories"),
    defineField({
      name: "anchorId",
      title: "Anchor id",
      type: "string",
      initialValue: "categories",
      description: 'Lets buttons link to this section, e.g. "#categories".',
    }),
    defineField({ name: "viewProductsLabel", title: "Card hover label", type: "string", initialValue: "View Products" }),
    defineField({ name: "groups", title: "Category groups", type: "array", of: [{ type: "categoryGroup" }] }),
    hiddenField,
  ],
  preview: preview("Category browser", "Categories"),
});

export const pageHeaderSection = defineType({
  name: "pageHeaderSection",
  title: "Page header (dark banner)",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "backLabel", title: "Back link label", type: "string", initialValue: "Back" }),
    defineField({ name: "backPath", title: "Back link path", type: "string", initialValue: "/" }),
    imageField("backgroundImage", "Background image (optional)"),
    hiddenField,
  ],
  preview: preview("Page header", "Page header"),
});

export const legalContentSection = defineType({
  name: "legalContentSection",
  title: "Policy / legal content",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "effectiveDate", title: "Effective date", type: "date" }),
    defineField({ name: "lastUpdated", title: "Last updated", type: "date" }),
    defineField({ name: "effectiveLabel", title: "Effective date label", type: "string", initialValue: "Effective Date" }),
    defineField({ name: "updatedLabel", title: "Last updated label", type: "string", initialValue: "Last Updated" }),
    defineField({ name: "intro", title: "Introduction", type: "richText" }),
    defineField({ name: "sections", title: "Sections", type: "array", of: [{ type: "legalSection" }] }),
    hiddenField,
  ],
  preview: {
    select: { first: "sections.0.heading", hidden: "hidden" },
    prepare: ({ first, hidden }) => ({ title: `${hidden ? "[hidden] " : ""}Policy content`, subtitle: first }),
  },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  icon: BlockContentIcon,
  fields: [headingField(), defineField({ name: "body", title: "Body", type: "richText" }), hiddenField],
  preview: preview("Rich text", "Rich text"),
});

export const imageWithTextSection = defineType({
  name: "imageWithTextSection",
  title: "Image with text",
  type: "object",
  icon: ImageIcon,
  fields: [
    headingField(),
    defineField({ name: "subheading", title: "Subheading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    imageField("image", "Image"),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: { list: ["left", "right"], layout: "radio", direction: "horizontal" },
      initialValue: "right",
    }),
    defineField({ name: "buttons", title: "Buttons", type: "array", of: [{ type: "link" }] }),
    hiddenField,
  ],
  preview: preview("Image with text", "Image with text"),
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Image gallery",
  type: "object",
  icon: ImagesIcon,
  fields: [
    headingField(),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [imageField("image", "Image")],
      options: { layout: "grid" },
    }),
    hiddenField,
  ],
  preview: preview("Gallery", "Gallery"),
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics",
  type: "object",
  icon: ChartUpwardIcon,
  fields: [headingField(), defineField({ name: "items", title: "Statistics", type: "array", of: [{ type: "statItem" }] }), hiddenField],
  preview: preview("Statistics", "Statistics"),
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    headingField("FAQs"),
    defineField({ name: "items", title: "Questions", type: "array", of: [{ type: "faqItem" }] }),
    defineField({
      name: "enableSchema",
      title: "Add FAQ structured data (SEO)",
      type: "boolean",
      initialValue: true,
    }),
    hiddenField,
  ],
  preview: preview("FAQ", "FAQs"),
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    headingField(),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "buttons", title: "Buttons", type: "array", of: [{ type: "link" }] }),
    imageField("backgroundImage", "Background image"),
    hiddenField,
  ],
  preview: preview("Call to action", "Call to action"),
});

export const videoSection = defineType({
  name: "videoSection",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fields: [
    headingField(),
    defineField({ name: "videoFile", title: "Video (upload)", type: "file", options: { accept: "video/*" } }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo or a direct .mp4 link. Used when no file is uploaded.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    imageField("poster", "Poster image"),
    hiddenField,
  ],
  preview: preview("Video", "Video"),
});

export const logoShowcaseSection = defineType({
  name: "logoShowcaseSection",
  title: "Logo showcase",
  type: "object",
  icon: StarIcon,
  fields: [headingField(), defineField({ name: "logos", title: "Logos", type: "array", of: [{ type: "logoItem" }] }), hiddenField],
  preview: preview("Logo showcase", "Logos"),
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  icon: CommentIcon,
  fields: [
    headingField("What our clients say"),
    defineField({ name: "items", title: "Testimonials", type: "array", of: [{ type: "testimonialItem" }] }),
    hiddenField,
  ],
  preview: preview("Testimonials", "Testimonials"),
});

export const contactInfoSection = defineType({
  name: "contactInfoSection",
  title: "Contact information",
  type: "object",
  icon: EnvelopeIcon,
  description: "Shows the email, phone and address from Website Settings.",
  fields: [
    headingField("Contact us"),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed URL", type: "url" }),
    hiddenField,
  ],
  preview: preview("Contact information", "Contact"),
});

/** Section types available to the generic page builder. */
export const PAGE_SECTION_TYPES = [
  "heroSection",
  "pageHeaderSection",
  "legalContentSection",
  "richTextSection",
  "imageWithTextSection",
  "gallerySection",
  "statsSection",
  "categoryBrowserSection",
  "productCarouselSection",
  "productGridSection",
  "faqSection",
  "testimonialsSection",
  "logoShowcaseSection",
  "videoSection",
  "ctaSection",
  "contactInfoSection",
];

export const sectionTypes = [
  heroSection,
  productCarouselSection,
  productGridSection,
  categoryBrowserSection,
  pageHeaderSection,
  legalContentSection,
  richTextSection,
  imageWithTextSection,
  gallerySection,
  statsSection,
  faqSection,
  ctaSection,
  videoSection,
  logoShowcaseSection,
  testimonialsSection,
  contactInfoSection,
];
