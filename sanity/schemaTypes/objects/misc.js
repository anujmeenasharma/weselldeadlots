import { defineField, defineType } from "sanity";
import { HelpCircleIcon, ImageIcon, TagIcon, UserIcon } from "../../icons";
import { hiddenField, imageField } from "../helpers";

export const SOCIAL_PLATFORMS = ["linkedin", "facebook", "instagram", "x", "youtube", "tiktok", "whatsapp", "other"];

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: SOCIAL_PLATFORMS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      description: "Line breaks are preserved. Start a line with • for a bullet.",
      validation: (Rule) => Rule.required(),
    }),
    hiddenField,
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

/** Icon names available for category groups (rendered with lucide-react). */
export const CATEGORY_ICONS = [
  "Home",
  "Zap",
  "Wrench",
  "Settings",
  "Droplets",
  "Anchor",
  "Laptop",
  "ShoppingBag",
  "Plane",
  "Package",
  "Factory",
  "Truck",
  "Cpu",
  "Hammer",
  "Shirt",
  "Lightbulb",
  "Flame",
  "Shield",
];

export const categoryCard = defineType({
  name: "categoryCard",
  title: "Category card",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    imageField("image", "Image"),
    defineField({
      name: "link",
      title: "Link path",
      type: "string",
      description: 'e.g. "/categories/electrical/switchgear"',
      validation: (Rule) => Rule.required().custom((v) => (!v || v.startsWith("/") ? true : 'Must start with "/"')),
    }),
    hiddenField,
  ],
  preview: { select: { title: "title", subtitle: "link", media: "image" } },
});

export const categoryGroup = defineType({
  name: "categoryGroup",
  title: "Category group",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "key",
      title: "Identifier",
      type: "string",
      description: "Lowercase id, e.g. building-material. Must be unique within this section.",
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, { name: "lowercase-with-dashes" }),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: CATEGORY_ICONS },
      initialValue: "Package",
    }),
    defineField({ name: "items", title: "Sub-categories", type: "array", of: [{ type: "categoryCard" }] }),
    hiddenField,
  ],
  preview: { select: { title: "name", subtitle: "icon" } },
});

export const contactLine = defineType({
  name: "contactLine",
  title: "Contact line",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon (emoji)", type: "string", description: "e.g. 📧 📞 📍" }),
    defineField({ name: "text", title: "Text", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "text", subtitle: "icon" } },
});

export const legalSection = defineType({
  name: "legalSection",
  title: "Policy section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({
      name: "contactLines",
      title: "Contact lines (optional)",
      type: "array",
      of: [{ type: "contactLine" }],
    }),
  ],
  preview: { select: { title: "heading" } },
});

export const testimonialItem = defineType({
  name: "testimonialItem",
  title: "Testimonial",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Client name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "designation", title: "Designation / company", type: "string" }),
    imageField("image", "Client photo"),
    defineField({ name: "quote", title: "Testimonial", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    hiddenField,
  ],
  preview: { select: { title: "name", subtitle: "designation", media: "image" } },
});

export const statItem = defineType({
  name: "statItem",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "label", title: "Label", type: "string" }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const logoItem = defineType({
  name: "logoItem",
  title: "Logo",
  type: "object",
  fields: [
    imageField("image", "Logo", { required: true }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "url",
      title: "Link (optional)",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { select: { title: "name", media: "image" } },
});

export const countryStates = defineType({
  name: "countryStates",
  title: "Country",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Country", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "states",
      title: "States / regions",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: { select: { title: "name" } },
});
