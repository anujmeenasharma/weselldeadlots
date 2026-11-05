import { link, navItem } from "./objects/link";
import { seo } from "./objects/seo";
import { richText } from "./objects/richText";
import {
  socialLink,
  faqItem,
  categoryCard,
  categoryGroup,
  contactLine,
  legalSection,
  testimonialItem,
  statItem,
  logoItem,
  countryStates,
} from "./objects/misc";
import { sectionTypes } from "./sections";
import { siteSettings, navigation, footer } from "./documents/settings";
import { homePage, page, contactPage, sellPage, blogSettings, blogPost } from "./documents/pages";

export const schemaTypes = [
  // Documents
  siteSettings,
  navigation,
  footer,
  homePage,
  contactPage,
  sellPage,
  blogSettings,
  page,
  blogPost,
  // Reusable objects
  link,
  navItem,
  seo,
  richText,
  socialLink,
  faqItem,
  categoryCard,
  categoryGroup,
  contactLine,
  legalSection,
  testimonialItem,
  statItem,
  logoItem,
  countryStates,
  // Page-builder sections
  ...sectionTypes,
];

/** Documents that exist exactly once (fixed _id = type name). */
export const SINGLETON_TYPES = ["siteSettings", "navigation", "footer", "homePage", "contactPage", "sellPage", "blogSettings"];
