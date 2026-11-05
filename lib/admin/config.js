/**
 * Plain-language description of everything editable in the admin panel.
 * Shared by the browser (forms) and the server (validation). Field names match the
 * Sanity schema in sanity/schemaTypes, so the website and Sanity Studio stay in sync.
 *
 * Field types: text, textarea, url, email, number, toggle, choice, tags, list (strings),
 * image, video, link, richText, date, datetime, color, slug, group (object),
 * items (array of objects), sections, seo, postPicker.
 */

// ---------- reusable field builders ----------
const t = (name, label, extra = {}) => ({ name, label, type: "text", ...extra });
const ta = (name, label, extra = {}) => ({ name, label, type: "textarea", rows: 3, ...extra });
const img = (name, label, extra = {}) => ({ name, label, type: "image", ...extra });
const link = (name, label, extra = {}) => ({ name, label, type: "link", ...extra });
const toggle = (name, label, extra = {}) => ({ name, label, type: "toggle", ...extra });
const hiddenToggle = { name: "hidden", label: "Hide this", type: "toggle", help: "Keeps it saved but doesn't show it on the website." };

export const SITE_PATHS = ["/", "/categories", "/blogs", "/contact", "/sell-with-us", "/search", "/privacy", "/terms", "#categories"];

const LINK_ITEM = {
  type: "link",
  _type: "link",
  label: "Link",
  newItem: () => ({ _type: "link", label: "New link", linkType: "internal", path: "/" }),
};

const linkList = (name, label, extra = {}) => ({
  name,
  label,
  type: "items",
  itemType: "link",
  itemLabel: "link",
  titleField: "label",
  ...extra,
});

const faqItems = {
  name: "items",
  label: "Questions",
  type: "items",
  itemType: "faqItem",
  itemLabel: "question",
  titleField: "question",
  fields: [
    t("question", "Question", { required: true }),
    ta("answer", "Answer", { rows: 5, required: true, help: "Each new line shows as a new line. Start a line with • for a bullet." }),
    hiddenToggle,
  ],
};

// ---------- page sections ----------
export const SECTION_TYPES = {
  heroSection: {
    label: "Big banner (hero)",
    description: "Full-screen banner with video or image, headline and text.",
    icon: "Monitor",
    titleField: "heading",
    fields: [
      t("heading", "Headline", { required: true }),
      ta("description", "Text under the headline", { rows: 4 }),
      { name: "backgroundVideo", label: "Background video", type: "video", help: "MP4 works best. Shown instead of the image." },
      { name: "backgroundVideoUrl", label: "…or video link", type: "url", help: "Direct link to an .mp4 file. Used only if no video is uploaded." },
      img("backgroundImage", "Background image", { help: "Shown when there's no video, and while the video loads." }),
      t("bottomLeftText", "Small text, bottom left"),
      t("badgeText", "Highlighted text, bottom middle"),
      toggle("showDivider", "Show the thin line on the bottom right", { default: true }),
      img("exploreImage", "Round 'Explore' button image"),
      t("exploreLink", "'Explore' button goes to", { help: 'A page or a section, e.g. #categories', suggestions: SITE_PATHS, pattern: "path" }),
      toggle("parallax", "Scroll animation", { default: true, help: "The banner slides and rounds its corners as you scroll." }),
      hiddenToggle,
    ],
  },
  productCarouselSection: {
    label: "Product slider (from Shopify)",
    description: "A sliding row of products from one Shopify collection.",
    icon: "ShoppingCart",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      t("collectionHandle", "Shopify collection", { required: true, help: "The collection's handle in Shopify, e.g. today-deal" }),
      { name: "productCount", label: "How many products", type: "number", min: 1, max: 50, default: 10 },
      hiddenToggle,
    ],
  },
  productGridSection: {
    label: "All products grid (from Shopify)",
    description: "Every product, newest first, with a 'Load more' button.",
    icon: "LayoutGrid",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      { name: "pageSize", label: "Products per load", type: "number", min: 1, max: 100, default: 25 },
      t("loadMoreLabel", "'Load more' button text"),
      t("loadingLabel", "Text while loading"),
      hiddenToggle,
    ],
  },
  categoryBrowserSection: {
    label: "Category browser",
    description: "Category list on the left, picture cards on the right.",
    icon: "FolderTree",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      t("viewProductsLabel", "Text shown on card hover", { help: 'e.g. "View Products"' }),
      t("anchorId", "Section name for links", { help: 'Lets buttons jump here with "#name". Default: categories' }),
      {
        name: "groups",
        label: "Categories",
        type: "items",
        itemType: "categoryGroup",
        itemLabel: "category",
        titleField: "name",
        fields: [
          t("name", "Category name", { required: true }),
          t("key", "Short id", { required: true, pattern: "kebab", help: "Lowercase with dashes, e.g. building-material. Must be unique." }),
          {
            name: "icon",
            label: "Icon",
            type: "choice",
            options: ["Home", "Zap", "Wrench", "Settings", "Droplets", "Anchor", "Laptop", "ShoppingBag", "Plane", "Package", "Factory", "Truck", "Cpu", "Hammer", "Shirt", "Lightbulb", "Flame", "Shield"].map((v) => ({ value: v, label: v })),
          },
          {
            name: "items",
            label: "Sub-category cards",
            type: "items",
            itemType: "categoryCard",
            itemLabel: "card",
            titleField: "title",
            imageField: "image",
            fields: [
              t("title", "Card title", { required: true }),
              img("image", "Picture"),
              t("link", "Opens page", { required: true, pattern: "path", help: "e.g. /categories/electrical/switchgear", suggestions: SITE_PATHS }),
              hiddenToggle,
            ],
          },
          hiddenToggle,
        ],
      },
      hiddenToggle,
    ],
  },
  pageHeaderSection: {
    label: "Page title banner",
    description: "Dark banner with the page title and a Back link.",
    icon: "PanelTop",
    titleField: "heading",
    fields: [
      t("heading", "Page title", { required: true }),
      t("backLabel", "Back link text"),
      t("backPath", "Back link goes to", { pattern: "path", suggestions: SITE_PATHS }),
      img("backgroundImage", "Background image (optional)"),
      hiddenToggle,
    ],
  },
  legalContentSection: {
    label: "Policy text",
    description: "Dates, an introduction and numbered sections — for privacy, terms, returns…",
    icon: "ScrollText",
    titleField: null,
    fields: [
      { name: "effectiveDate", label: "Effective date", type: "date" },
      { name: "lastUpdated", label: "Last updated", type: "date" },
      { name: "intro", label: "Introduction", type: "richText" },
      {
        name: "sections",
        label: "Sections",
        type: "items",
        itemType: "legalSection",
        itemLabel: "section",
        titleField: "heading",
        fields: [
          t("heading", "Heading", { required: true }),
          { name: "body", label: "Text", type: "richText" },
          {
            name: "contactLines",
            label: "Contact lines (optional)",
            type: "items",
            itemType: "contactLine",
            itemLabel: "line",
            titleField: "text",
            fields: [t("icon", "Emoji", { help: "e.g. 📧 📞 📍" }), t("text", "Text", { required: true })],
          },
        ],
      },
      t("effectiveLabel", "'Effective date' wording", { advanced: true }),
      t("updatedLabel", "'Last updated' wording", { advanced: true }),
      hiddenToggle,
    ],
  },
  richTextSection: {
    label: "Text block",
    description: "A title and formatted text.",
    icon: "Type",
    titleField: "heading",
    fields: [t("heading", "Title"), { name: "body", label: "Text", type: "richText" }, hiddenToggle],
  },
  imageWithTextSection: {
    label: "Picture with text",
    description: "A picture beside a title, text and buttons.",
    icon: "Image",
    titleField: "heading",
    fields: [
      t("subheading", "Small label above title"),
      t("heading", "Title"),
      { name: "body", label: "Text", type: "richText" },
      img("image", "Picture"),
      {
        name: "imagePosition",
        label: "Picture side",
        type: "choice",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
        default: "right",
      },
      linkList("buttons", "Buttons"),
      hiddenToggle,
    ],
  },
  gallerySection: {
    label: "Photo gallery",
    description: "A grid of pictures.",
    icon: "Images",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      {
        name: "images",
        label: "Pictures",
        type: "items",
        itemType: "image",
        itemLabel: "picture",
        bareImage: true,
        titleField: "alt",
        imageField: "_self",
        fields: [],
      },
      hiddenToggle,
    ],
  },
  statsSection: {
    label: "Numbers",
    description: "Big numbers with labels, e.g. '5,000+ lots sold'.",
    icon: "BarChart3",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      {
        name: "items",
        label: "Numbers",
        type: "items",
        itemType: "statItem",
        itemLabel: "number",
        titleField: "value",
        fields: [t("value", "Number", { required: true, help: "e.g. 5,000+" }), t("label", "Label")],
      },
      hiddenToggle,
    ],
  },
  faqSection: {
    label: "Questions & answers",
    description: "Expandable FAQ list (also helps Google).",
    icon: "HelpCircle",
    titleField: "heading",
    fields: [t("heading", "Title"), faqItems, toggle("enableSchema", "Show these FAQs in Google results", { default: true }), hiddenToggle],
  },
  testimonialsSection: {
    label: "Customer reviews",
    description: "Quotes from happy customers with star ratings.",
    icon: "MessageSquareQuote",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      {
        name: "items",
        label: "Reviews",
        type: "items",
        itemType: "testimonialItem",
        itemLabel: "review",
        titleField: "name",
        imageField: "image",
        fields: [
          t("name", "Customer name", { required: true }),
          t("designation", "Job title / company"),
          img("image", "Photo"),
          ta("quote", "What they said", { required: true, rows: 4 }),
          { name: "rating", label: "Stars", type: "number", min: 1, max: 5 },
          hiddenToggle,
        ],
      },
      hiddenToggle,
    ],
  },
  logoShowcaseSection: {
    label: "Logos",
    description: "A row of brand or partner logos.",
    icon: "BadgeCheck",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      {
        name: "logos",
        label: "Logos",
        type: "items",
        itemType: "logoItem",
        itemLabel: "logo",
        titleField: "name",
        imageField: "image",
        fields: [img("image", "Logo", { required: true }), t("name", "Name"), { name: "url", label: "Link (optional)", type: "url" }],
      },
      hiddenToggle,
    ],
  },
  videoSection: {
    label: "Video",
    description: "An uploaded video or a YouTube / Vimeo link.",
    icon: "PlayCircle",
    titleField: "heading",
    fields: [
      t("heading", "Title"),
      { name: "videoFile", label: "Upload video", type: "video" },
      { name: "videoUrl", label: "…or YouTube / Vimeo link", type: "url" },
      img("poster", "Cover picture"),
      hiddenToggle,
    ],
  },
  ctaSection: {
    label: "Call to action",
    description: "A highlighted message with buttons.",
    icon: "Megaphone",
    titleField: "heading",
    fields: [t("heading", "Title"), ta("description", "Text"), linkList("buttons", "Buttons"), img("backgroundImage", "Background image"), hiddenToggle],
  },
  contactInfoSection: {
    label: "Contact details",
    description: "Email, phone and address from Website basics, with a map.",
    icon: "Contact",
    titleField: "heading",
    fields: [t("heading", "Title"), ta("description", "Text", { rows: 2 }), { name: "mapEmbedUrl", label: "Google Maps embed link", type: "url" }, hiddenToggle],
  },
};

const SECTION_ORDER = Object.keys(SECTION_TYPES);

const seoTab = { id: "seo", label: "Google & sharing", icon: "Search", fields: [{ name: "seo", label: "", type: "seo" }] };

// ---------- documents ----------
export const DOCUMENTS = {
  siteSettings: {
    label: "Website basics",
    icon: "Settings",
    description: "Name, logo, colours, contact details and Google defaults.",
    previewPath: "/",
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "Info",
        fields: [
          t("siteName", "Website name", { required: true }),
          ta("siteDescription", "Short description of the business"),
          t("copyrightText", "Copyright line", { help: "Shown at the very bottom of every page." }),
          link("globalCta", "Main call-to-action button"),
        ],
      },
      {
        id: "brand",
        label: "Logo & colours",
        icon: "Palette",
        fields: [
          img("logo", "Logo", { help: "Shown in the top menu." }),
          img("logoDark", "Logo for dark backgrounds", { help: "Used in the footer." }),
          img("favicon", "Browser tab icon", { help: "Square image, at least 512×512. Leave empty to keep the current one." }),
          { name: "primaryColor", label: "Main brand colour", type: "color", help: "Used for the main buttons." },
          { name: "secondaryColor", label: "Second brand colour", type: "color" },
        ],
      },
      {
        id: "contact",
        label: "Contact details",
        icon: "Phone",
        fields: [
          { name: "contactEmail", label: "Email", type: "email" },
          t("phone", "Phone"),
          t("whatsappNumber", "WhatsApp number", { pattern: "phone", help: "With country code, digits only, e.g. 971552748974. Leave empty to hide the WhatsApp button." }),
          t("whatsappMessage", "WhatsApp starting message"),
          {
            name: "address",
            label: "Address",
            type: "group",
            fields: [
              t("displayText", "Address as shown on the website"),
              t("street", "Street"),
              t("locality", "City"),
              t("region", "Emirate / region"),
              t("postalCode", "Postal code"),
              t("countryCode", "Country code", { help: "e.g. AE" }),
            ],
          },
          {
            name: "socialLinks",
            label: "Social media",
            type: "items",
            itemType: "socialLink",
            itemLabel: "social link",
            titleField: "platform",
            fields: [
              {
                name: "platform",
                label: "Platform",
                type: "choice",
                required: true,
                options: ["linkedin", "facebook", "instagram", "x", "youtube", "tiktok", "whatsapp", "other"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
              },
              { name: "url", label: "Link", type: "url", required: true },
            ],
          },
        ],
      },
      {
        id: "announcement",
        label: "Announcement bar",
        icon: "Megaphone",
        fields: [
          {
            name: "announcementBar",
            label: "",
            type: "group",
            fields: [toggle("enabled", "Show a message bar at the top of every page"), t("text", "Message"), link("link", "Link (optional)")],
          },
        ],
      },
      {
        id: "seo",
        label: "Google defaults",
        icon: "Search",
        fields: [
          { name: "defaultSeo", label: "", type: "seo", isDefault: true },
          t("publisher", "Publisher name", { advanced: true }),
        ],
      },
      {
        id: "business",
        label: "Business info for Google",
        icon: "Building2",
        fields: [
          {
            name: "organization",
            label: "Company",
            type: "group",
            fields: [
              t("name", "Company name"),
              { name: "url", label: "Website", type: "url" },
              { name: "logoUrl", label: "Logo link", type: "url" },
              ta("description", "Description"),
              t("foundingDate", "Founded (year)"),
              t("contactType", "Contact type", { help: "e.g. Sales" }),
              t("areaServed", "Country served (code)", { help: "e.g. AE" }),
              { name: "languages", label: "Languages", type: "tags" },
            ],
          },
          {
            name: "service",
            label: "Main service",
            type: "group",
            fields: [
              t("name", "Service name"),
              ta("description", "Description"),
              t("providerName", "Provided by"),
              { name: "providerUrl", label: "Provider website", type: "url" },
              t("areaServed", "Country served (name)"),
            ],
          },
        ],
      },
    ],
  },

  navigation: {
    label: "Top menu",
    icon: "Menu",
    description: "Menu links, dropdowns and the 'Sell with us' button.",
    previewPath: "/",
    tabs: [
      {
        id: "menu",
        label: "Menu",
        icon: "Menu",
        fields: [
          {
            name: "items",
            label: "Menu links",
            type: "items",
            itemType: "navItem",
            itemLabel: "menu link",
            titleField: "label",
            linkFields: true,
            fields: [linkList("children", "Dropdown links (optional)", { itemLabel: "dropdown link" })],
          },
          link("ctaButton", "Highlighted button (computer)"),
          link("mobileCtaButton", "Highlighted button (phone menu)", { help: "Leave empty to use the same as the computer button." }),
        ],
      },
      {
        id: "options",
        label: "Logo & options",
        icon: "SlidersHorizontal",
        fields: [
          img("logo", "Menu logo", { help: "Leave empty to use the logo from Website basics." }),
          t("logoLink", "Logo goes to", { pattern: "path", suggestions: SITE_PATHS }),
          toggle("showSearch", "Show search button", { default: true }),
          toggle("showLanguageSwitcher", "Show English / العربية switcher", { default: true }),
        ],
      },
    ],
  },

  footer: {
    label: "Footer",
    icon: "PanelBottom",
    description: "Links, map and copyright at the bottom of every page.",
    previewPath: "/contact",
    tabs: [
      {
        id: "links",
        label: "Links",
        icon: "Link",
        fields: [
          {
            name: "columns",
            label: "Link groups",
            type: "items",
            itemType: "footerColumn",
            itemLabel: "link group",
            titleField: "heading",
            fields: [t("heading", "Group title"), linkList("links", "Links")],
          },
          linkList("legalLinks", "Small links in the bottom bar"),
          t("copyrightText", "Copyright line", { help: "Leave empty to use the one from Website basics." }),
        ],
      },
      {
        id: "extras",
        label: "Logo, map & extras",
        icon: "Map",
        fields: [
          toggle("showLogo", "Show logo"),
          img("logo", "Footer logo", { help: "Leave empty to use the dark logo from Website basics." }),
          ta("description", "Short text"),
          { name: "mapEmbedUrl", label: "Background map (Google Maps embed link)", type: "url" },
          toggle("showContactInfo", "Show email, phone and address"),
          toggle("showSocialLinks", "Show social media links"),
          {
            name: "newsletter",
            label: "Extra message box",
            type: "group",
            fields: [toggle("enabled", "Show"), t("heading", "Title"), ta("text", "Text", { rows: 2 }), link("button", "Button")],
          },
        ],
      },
    ],
  },

  homePage: {
    label: "Home page",
    icon: "Home",
    description: "Banner, product sliders, categories and more — drag to reorder.",
    previewPath: "/",
    tabs: [{ id: "content", label: "Page sections", icon: "LayoutList", fields: [{ name: "sections", label: "", type: "sections" }] }, seoTab],
  },

  contactPage: {
    label: "Contact page",
    icon: "Mail",
    description: "Heading, map, form wording and FAQs.",
    previewPath: "/contact",
    tabs: [
      {
        id: "content",
        label: "Page text",
        icon: "Type",
        fields: [
          ta("heading", "Big heading", { rows: 2, help: "Press Enter to start a new line." }),
          ta("description", "Text under the heading"),
          { name: "mapEmbedUrl", label: "Google Maps embed link", type: "url" },
        ],
      },
      {
        id: "form",
        label: "Contact form",
        icon: "FormInput",
        fields: [
          t("formHeading", "Form title"),
          {
            name: "placeholders",
            label: "Hint text inside the boxes",
            type: "group",
            fields: [t("name", "Name box"), t("email", "Email box"), t("phone", "Phone box"), t("subject", "Subject box")],
          },
          t("submitLabel", "Send button"),
          t("sendingLabel", "Text while sending"),
          t("successMessage", "Message after sending"),
          {
            name: "errors",
            label: "Error messages",
            type: "group",
            fields: [t("name", "Missing name"), t("email", "Bad email"), t("phone", "Bad phone"), t("subject", "Missing subject"), t("general", "Sending failed")],
          },
        ],
      },
      {
        id: "faq",
        label: "FAQs",
        icon: "HelpCircle",
        fields: [{ name: "faq", label: "", type: "group", _type: "faqSection", fields: SECTION_TYPES.faqSection.fields }],
      },
      seoTab,
    ],
  },

  sellPage: {
    label: "Sell with us page",
    icon: "HandCoins",
    description: "Banner, form wording and dropdown choices.",
    previewPath: "/sell-with-us",
    tabs: [
      {
        id: "banner",
        label: "Banner",
        icon: "PanelTop",
        fields: [t("heading", "Title"), t("intro", "Text above the title"), img("heroImage", "Background image")],
      },
      {
        id: "form",
        label: "Form wording",
        icon: "FormInput",
        fields: [
          {
            name: "labels",
            label: "Questions",
            type: "group",
            fields: [
              t("company", "Company question"),
              t("mobile", "Mobile"),
              t("email", "Email"),
              t("category", "Stock category question"),
              t("costPrice", "Cost price"),
              t("askPrice", "Asking price"),
              t("country", "Country"),
              t("state", "State"),
            ],
          },
          {
            name: "placeholders",
            label: "Hint text inside the boxes",
            type: "group",
            fields: [
              t("company", "Company"),
              t("mobile", "Mobile"),
              t("email", "Email"),
              t("category", "Category"),
              t("country", "Country"),
              t("state", "State"),
              t("stateDisabled", "State (before a country is picked)"),
            ],
          },
          {
            name: "submitLabels",
            label: "Send button",
            type: "group",
            fields: [t("idle", "Normal"), t("loading", "While sending"), t("success", "After sending"), t("error", "If it fails")],
          },
        ],
      },
      {
        id: "options",
        label: "Dropdown choices",
        icon: "ListChecks",
        fields: [
          { name: "stockCategories", label: "Stock categories", type: "list", itemLabel: "category" },
          { name: "currencies", label: "Currencies", type: "tags" },
          t("defaultCurrency", "Default currency"),
          {
            name: "countries",
            label: "Countries",
            type: "items",
            itemType: "countryStates",
            itemLabel: "country",
            titleField: "name",
            fields: [t("name", "Country", { required: true }), { name: "states", label: "States / regions", type: "tags" }],
          },
        ],
      },
      seoTab,
    ],
  },

  blogSettings: {
    label: "Blog page",
    icon: "Newspaper",
    description: "Wording on the blog list and article pages.",
    previewPath: "/blogs",
    tabs: [
      {
        id: "content",
        label: "Blog list page",
        icon: "Newspaper",
        fields: [
          t("heroTitle", "Title"),
          ta("heroDescription", "Text under the title", { rows: 2 }),
          img("heroImage", "Banner image"),
          t("backLabel", "Back link text"),
          t("searchPlaceholder", "Search box hint"),
          t("cardLabel", "Label on each article card"),
          t("readMoreText", "Text when an article has no summary"),
          t("publishedLabel", "'Published on' wording"),
          t("loadMoreLabel", "'Load more' button"),
          t("loadingLabel", "Text while loading"),
          t("emptyMessage", "Text when search finds nothing"),
          { name: "fallbackImageUrl", label: "Picture for articles without one (link)", type: "url", advanced: true },
        ],
      },
      { id: "article", label: "Article page", icon: "FileText", fields: [t("postLabel", "Small label above the article title")] },
      seoTab,
    ],
  },

  page: {
    label: "Page",
    plural: "Pages",
    icon: "File",
    description: "Privacy, terms and any page you create.",
    collection: true,
    titleField: "title",
    previewPath: (doc) => (doc?.slug?.current ? `/${doc.slug.current}` : null),
    newDocument: () => ({
      _type: "page",
      title: "New page",
      status: "live",
      sections: [],
    }),
    tabs: [
      {
        id: "content",
        label: "Page sections",
        icon: "LayoutList",
        fields: [
          t("title", "Page name", { required: true }),
          { name: "slug", label: "Web address", type: "slug", source: "title", required: true },
          {
            name: "status",
            label: "Visibility",
            type: "choice",
            options: [
              { value: "live", label: "Live on the website" },
              { value: "hidden", label: "Hidden (nobody can open it)" },
            ],
            default: "live",
          },
          { name: "sections", label: "Sections", type: "sections" },
        ],
      },
      seoTab,
    ],
  },

  blogPost: {
    label: "Blog article",
    plural: "Blog articles",
    icon: "PenSquare",
    description: "Articles written here appear first on the blog.",
    collection: true,
    titleField: "title",
    previewPath: (doc) => (doc?.slug?.current ? `/blogs/${doc.slug.current}` : null),
    newDocument: () => ({ _type: "blogPost", title: "New article", publishedAt: new Date().toISOString() }),
    tabs: [
      {
        id: "content",
        label: "Article",
        icon: "PenSquare",
        fields: [
          t("title", "Title", { required: true }),
          { name: "slug", label: "Web address", type: "slug", source: "title", prefix: "/blogs/", required: true },
          ta("excerpt", "Short summary", { help: "Shown on the blog list and in Google." }),
          img("mainImage", "Main picture"),
          { name: "body", label: "Article text", type: "richText", tall: true },
        ],
      },
      {
        id: "details",
        label: "Details",
        icon: "Tags",
        fields: [
          { name: "publishedAt", label: "Published", type: "datetime", required: true },
          { name: "updatedAt", label: "Last updated", type: "datetime" },
          t("category", "Category"),
          { name: "tags", label: "Tags", type: "tags" },
          { name: "author", label: "Author", type: "group", fields: [t("name", "Name"), img("image", "Photo")] },
          { name: "relatedPosts", label: "Related articles", type: "postPicker" },
        ],
      },
      seoTab,
    ],
  },
};

export const SINGLETONS = ["siteSettings", "navigation", "footer", "homePage", "contactPage", "sellPage", "blogSettings"];

export const SECTION_TYPE_LIST = SECTION_ORDER.map((type) => ({ type, ...SECTION_TYPES[type] }));

export const LINK_ITEM_DEFAULT = LINK_ITEM.newItem;

/** All fields of a document type, flattened from its tabs. */
export function documentFields(type) {
  return (DOCUMENTS[type]?.tabs || []).flatMap((tab) => tab.fields);
}

export function previewPathFor(type, doc) {
  const p = DOCUMENTS[type]?.previewPath;
  return typeof p === "function" ? p(doc) : p || null;
}
