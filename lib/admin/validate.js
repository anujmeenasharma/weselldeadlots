// Shared validation for the admin panel (runs in the browser and again on the server).
import { DOCUMENTS, SECTION_TYPES } from "./config";

const PATTERNS = {
  path: { test: (v) => /^(\/|#)/.test(v), message: 'Must start with "/" (a page) or "#" (a section)' },
  kebab: { test: (v) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), message: "Use lowercase letters, numbers and dashes only" },
  phone: { test: (v) => /^\+?[0-9]{6,15}$/.test(v), message: "Digits only, with country code" },
};

const URL_RE = /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const RESERVED_SLUGS = ["api", "admin", "studio", "arabic", "blogs", "categories", "category", "contact", "product", "search", "sell-with-us", "_next"];

const isEmpty = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

function validateLink(value, path, errors, required) {
  if (!value || (!value.label && !value.path && !value.url)) {
    if (required) errors.push({ path, message: "Add a link" });
    return;
  }
  if (!value.label) errors.push({ path: `${path}.label`, message: "Add the text people will see" });
  if (value.linkType === "external") {
    if (!value.url) errors.push({ path: `${path}.url`, message: "Add the website address" });
    else if (!URL_RE.test(value.url)) errors.push({ path: `${path}.url`, message: "Must start with https://, mailto: or tel:" });
  } else if (!value.path) {
    errors.push({ path: `${path}.path`, message: "Choose where this goes" });
  } else if (!PATTERNS.path.test(value.path)) {
    errors.push({ path: `${path}.path`, message: PATTERNS.path.message });
  }
}

function validateFields(fields, data, basePath, errors, context) {
  for (const field of fields) {
    const value = data?.[field.name];
    const path = basePath ? `${basePath}.${field.name}` : field.name;

    if (field.required && isEmpty(value) && field.type !== "link" && field.type !== "slug") {
      errors.push({ path, message: "This is required" });
      continue;
    }

    switch (field.type) {
      case "url":
        if (value && !URL_RE.test(value)) errors.push({ path, message: "Must be a full link starting with https://" });
        break;
      case "email":
        if (value && !EMAIL_RE.test(value)) errors.push({ path, message: "That doesn't look like an email address" });
        break;
      case "color":
        if (value && !HEX_RE.test(value)) errors.push({ path, message: "Use a colour like #1392f9" });
        break;
      case "number":
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value !== "number" || Number.isNaN(value)) errors.push({ path, message: "Must be a number" });
          else if (field.min !== undefined && value < field.min) errors.push({ path, message: `Must be at least ${field.min}` });
          else if (field.max !== undefined && value > field.max) errors.push({ path, message: `Must be at most ${field.max}` });
        }
        break;
      case "text":
        if (value && field.pattern && PATTERNS[field.pattern] && !PATTERNS[field.pattern].test(value)) {
          errors.push({ path, message: PATTERNS[field.pattern].message });
        }
        break;
      case "slug": {
        const current = value?.current;
        if (!current) {
          if (field.required) errors.push({ path, message: "Choose a web address" });
        } else if (!SLUG_RE.test(current)) {
          errors.push({ path, message: "Use lowercase letters, numbers and dashes only" });
        } else if (context.type === "page" && RESERVED_SLUGS.includes(current)) {
          errors.push({ path, message: `"/${current}" is already used by the website` });
        }
        break;
      }
      case "link":
        validateLink(value, path, errors, field.required);
        break;
      case "group":
        validateFields(field.fields, value, path, errors, context);
        break;
      case "seo":
        if (value?.canonicalUrl && !/^(\/|https?:\/\/)/.test(value.canonicalUrl)) {
          errors.push({ path: `${path}.canonicalUrl`, message: 'Must start with "/" or https://' });
        }
        if (value?.structuredData) {
          try {
            JSON.parse(value.structuredData);
          } catch {
            errors.push({ path: `${path}.structuredData`, message: "This isn't valid JSON" });
          }
        }
        break;
      case "items":
        (value || []).forEach((item) => {
          const itemPath = `${path}.${item._key}`;
          if (field.itemType === "link" || field.linkFields) validateLink(item, itemPath, errors, true);
          if (field.fields?.length) validateFields(field.fields, item, itemPath, errors, context);
        });
        if (field.itemType === "categoryGroup") {
          const seen = new Set();
          (value || []).forEach((item) => {
            if (item.key && seen.has(item.key)) errors.push({ path: `${path}.${item._key}.key`, message: "Two categories have the same id" });
            seen.add(item.key);
          });
        }
        break;
      case "sections":
        (value || []).forEach((section) => {
          const def = SECTION_TYPES[section._type];
          if (def) validateFields(def.fields, section, `${path}.${section._key}`, errors, context);
        });
        break;
      default:
        break;
    }
  }
}

/** Returns [{ path, message }] — empty when the document is valid. */
export function validateDocument(type, doc) {
  const config = DOCUMENTS[type];
  if (!config) return [{ path: "", message: "Unknown document type" }];
  const errors = [];
  validateFields(config.tabs.flatMap((tab) => tab.fields), doc, "", errors, { type });
  return errors;
}
