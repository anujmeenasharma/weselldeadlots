import { defineField, defineType } from "sanity";
import { CogIcon, MenuIcon, BlockElementIcon } from "../../icons";
import { HEX_COLOR, imageField } from "../helpers";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "branding", title: "Branding" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Default SEO" },
    { name: "announcement", title: "Announcement bar" },
    { name: "schema", title: "Structured data" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Website name", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({ name: "siteDescription", title: "Website description", type: "text", rows: 3, group: "general" }),
    defineField({
      name: "globalCta",
      title: "Global call-to-action",
      type: "link",
      group: "general",
      description: "Reusable primary CTA (e.g. Sell with us).",
    }),
    defineField({ name: "copyrightText", title: "Copyright text", type: "string", group: "general" }),

    imageField("logo", "Logo", { group: "branding" }),
    imageField("logoDark", "Logo for dark backgrounds", { group: "branding" }),
    imageField("favicon", "Favicon", { group: "branding", description: "Square PNG, at least 512×512. Leave empty to keep the built-in favicon." }),
    defineField({
      name: "primaryColor",
      title: "Primary brand colour",
      type: "string",
      group: "branding",
      description: "Hex colour, e.g. #1392f9. Used for primary buttons.",
      validation: (Rule) => Rule.regex(HEX_COLOR, { name: "hex colour" }),
    }),
    defineField({
      name: "secondaryColor",
      title: "Secondary brand colour",
      type: "string",
      group: "branding",
      validation: (Rule) => Rule.regex(HEX_COLOR, { name: "hex colour" }),
    }),

    defineField({ name: "contactEmail", title: "Contact email", type: "string", group: "contact", validation: (Rule) => Rule.email() }),
    defineField({ name: "phone", title: "Phone number", type: "string", group: "contact" }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "International format, digits only, e.g. 971552748974. Leave empty to hide the WhatsApp button.",
      validation: (Rule) => Rule.regex(/^\+?[0-9]{6,15}$/, { name: "phone number" }),
    }),
    defineField({ name: "whatsappMessage", title: "WhatsApp pre-filled message", type: "string", group: "contact" }),
    defineField({
      name: "whatsappChannelUrl",
      title: "WhatsApp channel link (optional)",
      type: "url",
      group: "contact",
      description: "If set, the website QR codes open this channel instead of a chat with the WhatsApp number.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "whatsappChannelLabel",
      title: "Text under the WhatsApp QR code",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "displayText", title: "Display address", type: "string" }),
        defineField({ name: "street", title: "Street", type: "string" }),
        defineField({ name: "locality", title: "City", type: "string" }),
        defineField({ name: "region", title: "Region / emirate", type: "string" }),
        defineField({ name: "postalCode", title: "Postal code", type: "string" }),
        defineField({ name: "countryCode", title: "Country code (ISO)", type: "string", initialValue: "AE" }),
      ],
    }),
    defineField({ name: "socialLinks", title: "Social media links", type: "array", of: [{ type: "socialLink" }], group: "contact" }),

    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
    defineField({ name: "publisher", title: "Publisher name", type: "string", group: "seo" }),

    defineField({
      name: "announcementBar",
      title: "Announcement bar",
      type: "object",
      group: "announcement",
      fields: [
        defineField({ name: "enabled", title: "Show announcement bar", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "link", title: "Link", type: "link" }),
      ],
    }),

    defineField({
      name: "organization",
      title: "Organization (schema.org)",
      type: "object",
      group: "schema",
      fields: [
        defineField({ name: "name", title: "Organization name", type: "string" }),
        defineField({ name: "url", title: "Website URL", type: "url" }),
        defineField({ name: "logoUrl", title: "Logo URL", type: "url" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "foundingDate", title: "Founding year", type: "string" }),
        defineField({ name: "contactType", title: "Contact type", type: "string", initialValue: "Sales" }),
        defineField({ name: "areaServed", title: "Area served (country code)", type: "string" }),
        defineField({ name: "languages", title: "Languages", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
      ],
    }),
    defineField({
      name: "service",
      title: "Service (schema.org)",
      type: "object",
      group: "schema",
      fields: [
        defineField({ name: "name", title: "Service name", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "providerName", title: "Provider name", type: "string" }),
        defineField({ name: "providerUrl", title: "Provider URL", type: "url" }),
        defineField({ name: "areaServed", title: "Area served (country name)", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Website Settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    imageField("logo", "Navbar logo", { description: "Leave empty to use the logo from Website Settings." }),
    defineField({ name: "logoLink", title: "Logo link", type: "string", initialValue: "/" }),
    defineField({ name: "items", title: "Menu items", type: "array", of: [{ type: "navItem" }] }),
    defineField({ name: "ctaButton", title: "CTA button (desktop)", type: "link" }),
    defineField({
      name: "mobileCtaButton",
      title: "CTA button (mobile menu)",
      type: "link",
      description: "Leave empty to reuse the desktop CTA.",
    }),
    defineField({ name: "showSearch", title: "Show search button", type: "boolean", initialValue: true }),
    defineField({ name: "showLanguageSwitcher", title: "Show language switcher", type: "boolean", initialValue: true }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: BlockElementIcon,
  fields: [
    defineField({ name: "showLogo", title: "Show logo", type: "boolean", initialValue: false }),
    imageField("logo", "Footer logo", { description: "Leave empty to use the dark logo from Website Settings." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "columns",
      title: "Link columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({ name: "links", title: "Links", type: "array", of: [{ type: "link" }] }),
          ],
          preview: { select: { title: "heading" } },
        },
      ],
    }),
    defineField({ name: "showContactInfo", title: "Show contact details", type: "boolean", initialValue: false }),
    defineField({ name: "showSocialLinks", title: "Show social links", type: "boolean", initialValue: false }),
    defineField({
      name: "newsletter",
      title: "Newsletter / CTA block",
      type: "object",
      fields: [
        defineField({ name: "enabled", title: "Show", type: "boolean", initialValue: false }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
        defineField({ name: "button", title: "Button", type: "link" }),
      ],
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Background map (Google Maps embed URL)",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({ name: "legalLinks", title: "Legal links (bottom bar)", type: "array", of: [{ type: "link" }] }),
    defineField({
      name: "copyrightText",
      title: "Copyright text",
      type: "string",
      description: "Leave empty to use the copyright from Website Settings.",
    }),
  ],
  preview: { prepare: () => ({ title: "Footer" }) },
});
