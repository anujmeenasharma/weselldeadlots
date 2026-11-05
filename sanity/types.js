/**
 * JSDoc types for CMS content (the project is JavaScript, so these give editor
 * IntelliSense without a TypeScript migration). They mirror sanity/schemaTypes.
 */

/**
 * @typedef {Object} SanityImage
 * @property {"image"} _type
 * @property {{ _ref: string, _type: "reference" }} [asset]
 * @property {string} [_localPath] Seed/fallback only: path inside /public
 * @property {string} [alt]
 * @property {string} [caption]
 * @property {{ x: number, y: number, height: number, width: number }} [hotspot]
 * @property {{ top: number, bottom: number, left: number, right: number }} [crop]
 */

/**
 * @typedef {Object} CmsLink
 * @property {string} label
 * @property {"internal"|"external"} [linkType]
 * @property {string} [path]
 * @property {string} [url]
 * @property {boolean} [openInNewTab]
 * @property {"default"|"primary"|"outline"} [variant]
 * @property {string} [trackingEvent]
 * @property {boolean} [hidden]
 */

/** @typedef {CmsLink & { children?: CmsLink[] }} NavItem */

/**
 * @typedef {Object} Seo
 * @property {string} [metaTitle]
 * @property {string} [metaDescription]
 * @property {string[]} [keywords]
 * @property {string} [canonicalUrl]
 * @property {boolean} [noIndex]
 * @property {boolean} [noFollow]
 * @property {string} [structuredData] JSON-LD string
 * @property {string} [ogTitle]
 * @property {string} [ogDescription]
 * @property {SanityImage} [ogImage]
 * @property {string} [twitterTitle]
 * @property {string} [twitterDescription]
 * @property {SanityImage} [twitterImage]
 */

/**
 * @typedef {Object} SiteSettings
 * @property {string} siteName
 * @property {string} [siteDescription]
 * @property {CmsLink} [globalCta]
 * @property {string} [copyrightText]
 * @property {SanityImage} [logo]
 * @property {SanityImage} [logoDark]
 * @property {SanityImage} [favicon]
 * @property {string} [primaryColor]
 * @property {string} [secondaryColor]
 * @property {string} [contactEmail]
 * @property {string} [phone]
 * @property {string} [whatsappNumber]
 * @property {string} [whatsappMessage]
 * @property {{ displayText?: string, street?: string, locality?: string, region?: string, postalCode?: string, countryCode?: string }} [address]
 * @property {{ platform: string, url: string }[]} [socialLinks]
 * @property {Seo} [defaultSeo]
 * @property {string} [publisher]
 * @property {{ enabled?: boolean, text?: string, link?: CmsLink }} [announcementBar]
 */

/**
 * @typedef {Object} Navigation
 * @property {SanityImage} [logo]
 * @property {string} [logoLink]
 * @property {NavItem[]} [items]
 * @property {CmsLink} [ctaButton]
 * @property {CmsLink} [mobileCtaButton]
 * @property {boolean} [showSearch]
 * @property {boolean} [showLanguageSwitcher]
 */

/**
 * @typedef {Object} Section
 * @property {string} _type One of the types in SECTION_COMPONENTS (components/sanity/SectionRenderer.js)
 * @property {string} _key
 * @property {boolean} [hidden]
 */

/**
 * @typedef {Object} Page
 * @property {string} title
 * @property {{ current: string }} slug
 * @property {"live"|"hidden"} [status]
 * @property {Section[]} [sections]
 * @property {Seo} [seo]
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} _id
 * @property {string} title
 * @property {string} slug
 * @property {string} [excerpt]
 * @property {SanityImage} [mainImage]
 * @property {Array} [body] Portable Text
 * @property {{ name?: string, image?: SanityImage }} [author]
 * @property {string} [category]
 * @property {string[]} [tags]
 * @property {string} publishedAt
 * @property {string} [updatedAt]
 * @property {BlogPost[]} [relatedPosts]
 * @property {Seo} [seo]
 */

export {};
