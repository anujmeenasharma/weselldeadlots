import { defineField, defineType } from "sanity";
import { LinkIcon } from "../../icons";

export const linkFields = [
  defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({
    name: "linkType",
    title: "Link type",
    type: "string",
    options: {
      list: [
        { title: "Internal page (on this website)", value: "internal" },
        { title: "External URL", value: "external" },
      ],
      layout: "radio",
      direction: "horizontal",
    },
    initialValue: "internal",
  }),
  defineField({
    name: "path",
    title: "Internal path",
    type: "string",
    description: 'Path on this website, e.g. "/contact", "/categories/electrical" or "#categories".',
    hidden: ({ parent }) => parent?.linkType === "external",
    validation: (Rule) =>
      Rule.custom((value, ctx) => {
        if (ctx.parent?.linkType === "external") return true;
        if (!value) return "Enter a path";
        return value.startsWith("/") || value.startsWith("#") ? true : 'Internal paths must start with "/" or "#"';
      }),
  }),
  defineField({
    name: "url",
    title: "External URL",
    type: "url",
    hidden: ({ parent }) => parent?.linkType !== "external",
    validation: (Rule) =>
      Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).custom((value, ctx) =>
        ctx.parent?.linkType === "external" && !value ? "Enter a URL" : true,
      ),
  }),
  defineField({ name: "openInNewTab", title: "Open in new tab", type: "boolean", initialValue: false }),
  defineField({
    name: "variant",
    title: "Button style",
    type: "string",
    options: { list: ["default", "primary", "outline"] },
    initialValue: "default",
    description: "Only used where the link is rendered as a button.",
  }),
  defineField({
    name: "trackingEvent",
    title: "Tracking event (optional)",
    type: "string",
    description: "Meta Pixel custom event fired on click, e.g. SellWithUsClick.",
  }),
  defineField({ name: "hidden", title: "Hide", type: "boolean", initialValue: false }),
];

const linkPreview = {
  select: { title: "label", path: "path", url: "url", type: "linkType", hidden: "hidden" },
  prepare: ({ title, path, url, type, hidden }) => ({
    title: `${hidden ? "[hidden] " : ""}${title || "Untitled link"}`,
    subtitle: type === "external" ? url : path,
  }),
};

export const link = defineType({
  name: "link",
  title: "Link / Button",
  type: "object",
  icon: LinkIcon,
  fields: linkFields,
  preview: linkPreview,
});

export const navItem = defineType({
  name: "navItem",
  title: "Menu item",
  type: "object",
  icon: LinkIcon,
  fields: [
    ...linkFields,
    defineField({
      name: "children",
      title: "Dropdown items",
      type: "array",
      of: [{ type: "link" }],
      description: "Optional. Adds a dropdown menu under this item.",
    }),
  ],
  preview: linkPreview,
});
