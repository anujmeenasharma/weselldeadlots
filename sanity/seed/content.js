/**
 * Existing website content, extracted from the original hard-coded components.
 *
 * Used in two places:
 *  1. `npm run sanity:seed` uploads these documents (and their images from /public) to Sanity.
 *  2. The frontend falls back to these documents when Sanity isn't configured yet or a
 *     document hasn't been created, so the site never renders empty.
 *
 * Once Sanity is seeded, edit content in the Studio — not here.
 */

// ---------- helpers ----------
let keyCounter = 0;
const key = (prefix = "k") => `${prefix}${(keyCounter++).toString(36)}`;
const keyed = (items, prefix) => items.map((item) => ({ _key: key(prefix), ...item }));

const img = (path, alt = "") => ({ _type: "image", _localPath: path, alt });
const file = (path) => ({ _type: "file", _localPath: path });

const internal = (label, path, extra = {}) => ({ _type: "link", label, linkType: "internal", path, ...extra });
const external = (label, url, extra = {}) => ({ _type: "link", label, linkType: "external", url, ...extra });

const span = (text, marks = []) => ({ _type: "span", _key: key("s"), text, marks });
const block = (style, children, extra = {}) => ({
  _type: "block",
  _key: key("b"),
  style,
  markDefs: [],
  children: Array.isArray(children) ? children : [span(children)],
  ...extra,
});
const p = (text) => block("normal", text);
const bullets = (items) => items.map((t) => block("normal", t, { listItem: "bullet", level: 1 }));

const SELL_TRACKING = { trackingEvent: "SellWithUsClick" };

// ---------- site-wide ----------
export const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "WeSellDeadLots",
  siteDescription:
    "Shop discounted industrial surplus in UAE – tools, MRO, construction stock & more. Bulk deals for resellers, exporters, and contractors.",
  globalCta: internal("Sell with us", "/sell-with-us", SELL_TRACKING),
  copyrightText: "© 2025 We Sell Dead Lots | A Brand of Chaudary Anwar Tr. Co. L.L.C. All Rights Reserved",
  logo: img("/brand.png", "brand logo"),
  logoDark: img("/wsdl.png", "We Sell Dead Lots"),
  favicon: null,
  primaryColor: "#1392f9",
  secondaryColor: "#78C93D",
  contactEmail: "sales@weselldeadlots.com",
  phone: "+971 55 274 8974",
  whatsappNumber: "971552748974",
  whatsappMessage: "Hello I want to know more",
  whatsappChannelUrl: "",
  whatsappChannelLabel: "",
  address: {
    displayText: "Industrial Area 3, Sharjah, UAE.",
    street: "Street no:19 - Industrial Area 3",
    locality: "Sharjah",
    region: "Sharjah",
    postalCode: "00000",
    countryCode: "AE",
  },
  socialLinks: keyed([{ _type: "socialLink", platform: "linkedin", url: "https://www.linkedin.com/company/weselldeadlots" }], "soc"),
  defaultSeo: {
    _type: "seo",
    metaTitle: "Wholesale Industrial Surplus UAE | WeSellDeadLots",
    metaDescription:
      "Shop discounted industrial surplus in UAE – tools, MRO, construction stock & more. Bulk deals for resellers, exporters, and contractors.",
    keywords: [
      "Industrial Surplus",
      "UAE",
      "Wholesale Tools",
      "MRO",
      "Electrical Materials",
      "Hardware Supplies",
      "WeSellDeadLots",
      "Surplus Inventory",
      "Used Industrial tools",
    ],
    noIndex: false,
    noFollow: false,
  },
  publisher: "WeSellDeadLots",
  announcementBar: { enabled: false, text: "", link: null },
  organization: {
    name: "WeSellDeadLots",
    url: "https://www.weselldeadlots.com",
    logoUrl: "https://www.weselldeadlots.com/images/logo.png",
    description:
      "WeSellDeadLots is a UAE-based wholesale platform selling surplus and liquidation inventory in tools, industrial, electrical, and automation categories.",
    foundingDate: "2020",
    contactType: "Sales",
    areaServed: "AE",
    languages: ["English"],
  },
  service: {
    name: "Wholesale Dead Lots & Surplus Inventory Sales",
    description:
      "Wholesale supplier of dead lots, surplus, and overstock inventory across multiple product categories, serving bulk buyers and businesses in the UAE.",
    providerName: "We Sell Dead Lots",
    providerUrl: "https://www.weselldeadlots.com/",
    areaServed: "United Arab Emirates",
  },
};

export const navigation = {
  _id: "navigation",
  _type: "navigation",
  logo: null,
  logoLink: "/",
  items: keyed(
    [
      { ...internal("Categories", "/categories"), _type: "navItem" },
      { ...internal("Blogs", "/blogs"), _type: "navItem" },
      { ...internal("Contact us", "/contact"), _type: "navItem" },
    ],
    "nav",
  ),
  ctaButton: internal("Sell with us", "/sell-with-us", { variant: "primary", ...SELL_TRACKING }),
  mobileCtaButton: external("Sell with us", "https://hashim8803-wbds.odoo.com/get-a-free-valuation-dead-lots", {
    variant: "primary",
    ...SELL_TRACKING,
  }),
  showSearch: true,
  showLanguageSwitcher: true,
};

export const footer = {
  _id: "footer",
  _type: "footer",
  showLogo: false,
  logo: null,
  description: "",
  columns: keyed(
    [
      {
        _type: "footerColumn",
        heading: "Quick Links",
        links: keyed(
          [
            internal("Categories", "/categories"),
            internal("Contact Us", "/contact"),
            internal("Sell With Us", "/sell-with-us", SELL_TRACKING),
            internal("Blogs", "/blogs"),
            internal("Terms & Condition", "/terms"),
            internal("Privacy Policy", "/privacy"),
          ],
          "fl",
        ),
      },
    ],
    "col",
  ),
  showContactInfo: false,
  showSocialLinks: false,
  newsletter: { enabled: false },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14428.120347420798!2d55.4041113!3d25.3031932!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f96ee666a7d%3A0xf29ba26bd7c31055!2sWe%20Sell%20Dead%20Lots!5e0!3m2!1sen!2sin!4v1746203658792!5m2!1sen!2sin",
  legalLinks: [],
  copyrightText: "",
};

// ---------- homepage ----------
const cat = (title, image, link) => ({ _type: "categoryCard", title, image: img(image, title), link });

const categoryGroups = [
  {
    key: "building-material",
    name: "Building Material",
    icon: "Home",
    items: [
      cat("HVAC SYSTEM", "/images/categories/building-material/HVAC SYSTEM.jpg", "/categories/building-material/hvac-system"),
      cat("FIRE & SAFETY", "/images/categories/building-material/fire and safety.jpg", "/categories/building-material/fire-and-safety"),
      cat(
        "SANITARY / PLUMBING SYSTEM",
        "/images/categories/building-material/sanitary and plumbing system.jpg",
        "/categories/building-material/sanitary-plumbing-system",
      ),
      cat("HARDWARE", "/images/categories/building-material/hardware.jpg", "/categories/building-material/hardware"),
    ],
  },
  {
    key: "electrical",
    name: "Electrical",
    icon: "Zap",
    items: [
      cat("SWITCHGEAR", "/images/categories/electrical/Switchgear.jpg", "/categories/electrical/switchgear"),
      cat("AUTOMATION & PLC", "/images/categories/electrical/automation and plc.jpg", "/categories/electrical/automation-and-plc"),
      cat("CABLES & WIRES", "/images/categories/electrical/cables and wires.jpg", "/categories/electrical/cables-and-wires"),
      cat("SWITCHES & SOCKETS", "/images/categories/electrical/switch and socket.jpg", "/categories/electrical/switches-and-sockets"),
      cat("LIGHTING", "/images/categories/electrical/Lighting.jpg", "/categories/electrical/lighting"),
      cat("ELECTRONICS", "/images/categories/electrical/Electronics.jpg", "/categories/electrical/electronics"),
      cat("HARDWARE", "/images/categories/electrical/hardware.jpg", "/categories/electrical/hardware"),
    ],
  },
  {
    key: "tools",
    name: "Tools",
    icon: "Wrench",
    items: [
      cat("POWER TOOLS", "/images/categories/tools/power tools (5).jpg", "/categories/tools/power-tools"),
      cat("HAND TOOLS", "/images/categories/tools/hand tools.jpg", "/categories/tools/hand-tools"),
      cat("POWER TOOLS ACCESSORIES", "/images/categories/tools/power tools accessories.jpg", "/categories/tools/power-tools-accessories"),
      cat("OTHER TOOLS", "/images/categories/tools/other tools.png", "/categories/tools/other-tools"),
    ],
  },
  {
    key: "industrial-equipment",
    name: "Industrial Equipment",
    icon: "Settings",
    items: [
      cat("MACHINERY", "/images/categories/industrial-equipment/machinery.jpg", "/categories/industrial-equipment/machinery"),
      cat("BEARINGS", "/images/categories/industrial-equipment/bearings.jpg", "/categories/industrial-equipment/bearings"),
      cat(
        "HYDRAULIC COMPONENTS",
        "/images/categories/industrial-equipment/hydraulic components.jpg",
        "/categories/industrial-equipment/hydraulic-components",
      ),
      cat("MOTORS", "/images/categories/industrial-equipment/motors.jpeg", "/categories/industrial-equipment/motors"),
      cat("GENERATORS", "/images/categories/industrial-equipment/generators.png", "/categories/industrial-equipment/generators"),
    ],
  },
  {
    key: "oil-and-gas-aerospace",
    name: "Oil & Gas & Aerospace Material",
    icon: "Droplets",
    items: [
      cat("DRILLING EQUIPMENT", "/images/categories/oil-and-gas/drilling equipments.png", "/categories/oil-and-gas/drilling-equipment"),
      cat("VALVES & FLOW CONTROL", "/images/categories/oil-and-gas/valves and flow meter.jpg", "/categories/oil-and-gas/valves-and-flow-control"),
      cat("PUMPS & COMPRESSORS", "/images/categories/oil-and-gas/pumps and compressors.jpg", "/categories/oil-and-gas/pumps-and-compressors"),
      cat(
        "MEASUREMENT & INSTRUMENTATION",
        "/images/categories/oil-and-gas/measurement and instrumentation.jpg",
        "/categories/oil-and-gas/measurement-and-instrumentation",
      ),
      cat(
        "AIRCRAFT STRUCTURAL MATERIAL",
        "/images/categories/oil-and-gas/aircraft structural materail.jpg",
        "/categories/oil-and-gas/aircraft-structural-material",
      ),
      cat("AIRCRAFT FASTENERS", "/images/categories/oil-and-gas/aircraft fastner.jpg", "/categories/oil-and-gas/aircraft-fasteners"),
      cat(
        "AIRCRAFT ELECTRICAL COMPONENTS",
        "/images/categories/oil-and-gas/aircraft electrical component.jpg",
        "/categories/oil-and-gas/aircraft-electrical-components",
      ),
      cat(
        "AIRCRAFT HYDRAULIC SYSTEM",
        "/images/categories/oil-and-gas/aircraft hydraulic system.jpg",
        "/categories/oil-and-gas/aircraft-hydraulic-system",
      ),
      cat(
        "AIRCRAFT MAINTENANCE MATERIAL",
        "/images/categories/oil-and-gas/Aircraft maintanance material.jpg",
        "/categories/oil-and-gas/aircraft-maintenance-material",
      ),
    ],
  },
  {
    key: "marine",
    name: "Marine",
    icon: "Anchor",
    items: [
      cat("MARINE ENGINE SYSTEM", "/images/categories/marine/marine engine system.jpg", "/categories/marine/marine-engine-system"),
      cat("MARINE ELECTRICAL SYSTEM", "/images/categories/marine/marine electrical system.jpg", "/categories/marine/marine-electrical-system"),
      cat(
        "MARINE NAVIGATION & COMMUNICATION",
        "/images/categories/marine/marine navigation and communication.jpg",
        "/categories/marine/marine-navigation-and-communication",
      ),
      cat("MARINE SAFETY EQUIPMENT", "/images/categories/marine/marine safety equipment .jpg", "/categories/marine/marine-safety-equipment"),
      cat("DECK & MOORING EQUIPMENT", "/images/categories/marine/deck and mooring equipment.jpg", "/categories/marine/deck-and-mooring-equipment"),
    ],
  },
  {
    key: "computers-and-it",
    name: "Computers & IT",
    icon: "Laptop",
    items: [
      cat("COMPUTERS & LAPTOPS", "/images/categories/it/Computer and laptop.png", "/categories/computers-and-it/computers-and-laptops"),
      cat("PC / LAPTOP ACCESSORIES", "/images/categories/it/PC Laptop accessories.jpg", "/categories/computers-and-it/pc-laptop-accessories"),
      cat("BATTERY", "/images/categories/it/batteries.jpg", "/categories/computers-and-it/battery"),
      cat("NETWORKING DEVICES", "/images/categories/it/networking devices.png", "/categories/computers-and-it/networking-devices"),
      cat("DATA STORAGE", "/images/categories/it/data storage.png", "/categories/computers-and-it/data-storage"),
    ],
  },
  {
    key: "consumer-goods",
    name: "Consumer Goods",
    icon: "ShoppingBag",
    items: [
      cat("GARMENTS", "/images/categories/consumer-goods/Garments.jpg", "/categories/consumer-goods/garments"),
      cat(
        "COSMETICS & PERSONAL CARE",
        "/images/categories/consumer-goods/cosmetics and personal care.jpg",
        "/categories/consumer-goods/cosmetics-and-personal-care",
      ),
      cat("TOYS & GAMES", "/images/categories/consumer-goods/toys and games.jpg", "/categories/consumer-goods/toys-and-games"),
      cat("KIDS ESSENTIALS", "/images/categories/consumer-goods/kids essentials.jpg", "/categories/consumer-goods/kids-essentials"),
      cat("FOOTWEAR", "/images/categories/consumer-goods/footwear.jpg", "/categories/consumer-goods/footwear"),
    ],
  },
];

export const homePage = {
  _id: "homePage",
  _type: "homePage",
  title: "Homepage",
  sections: keyed(
    [
      {
        _type: "heroSection",
        heading: "Unbeatable Prices on Quality Surplus Inventory",
        description:
          "We Sell Dead Lots is your trusted wholesale supplier in UAE for quality overstock, surplus, and discontinued products. From electronics to household and industrial supplies, we offer unbeatable prices on branded stock. Discover bulk deals, save more, and shop confidently with reliable dead stock suppliers in UAE.",
        backgroundVideo: file("/videos/home.mp4"),
        bottomLeftText: "We specialize in giving unsold inventory a second life",
        badgeText: "UNBEATABLE PRICING",
        showDivider: true,
        exploreImage: img("/icons/explore.svg", "Explore"),
        exploreLink: "#categories",
        showChannelQr: true,
        parallax: true,
        hidden: false,
      },
      { _type: "productCarouselSection", heading: "Today's Deals", collectionHandle: "today-deal", productCount: 10, hidden: false },
      {
        _type: "categoryBrowserSection",
        heading: "Categories",
        anchorId: "categories",
        viewProductsLabel: "View Products",
        groups: keyed(
          categoryGroups.map((g) => ({ _type: "categoryGroup", ...g, items: keyed(g.items, "cc"), hidden: false })),
          "cg",
        ),
        hidden: false,
      },
      {
        _type: "productGridSection",
        heading: "Explore All Lots",
        pageSize: 25,
        loadMoreLabel: "Load More",
        loadingLabel: "Loading...",
        hidden: false,
      },
    ],
    "sec",
  ),
  seo: { _type: "seo", canonicalUrl: "/" },
};

// ---------- contact ----------
const faqs = [
  [
    "What types of products do you offer?",
    "We specialize in a wide range of dead lots, surplus, and overstock products, including electrical materials, electronic components, industrial hardware, and power tools.\nOur products are sourced from trusted international suppliers and are available for wholesale and bulk buyers.",
  ],
  ["Where are you located?", "Our company is based in Sharjah, United Arab Emirates (UAE), and we supply products across the UAE."],
  [
    "Do you offer bulk discounts for large orders?",
    "Yes, we offer special pricing for bulk and wholesale orders.\nFor inquiries, please contact us via WhatsApp at +971 55 274 8974 or email us at sales@weselldeadlots.com.",
  ],
  [
    "Are your products original and certified?",
    "Yes. We supply genuine, high-quality products. Many of our electrical and hardware items meet recognized international quality standards, depending on the product category and supplier.",
  ],
  [
    "Do you deliver outside of the UAE?",
    "Yes, we offer international shipping.\nShipping charges and delivery timelines vary by destination. Please contact us for a custom shipping quote.",
  ],
  [
    "How long does delivery take within the UAE?",
    "For in-stock items, delivery within the UAE typically takes 1–3 business days.\nBulk or special orders may take slightly longer, depending on availability.",
  ],
  [
    "What payment methods do you accept?",
    "We accept multiple secure payment methods, including:\n• Bank Transfers\n• Cash on Delivery (within UAE, for select orders)\n• Credit/Debit Cards\n• Other secure payment options (details provided upon invoice)",
  ],
  [
    "Can I return or exchange a product?",
    "Yes, we follow a Returns & Refunds Policy:\n• Products must be returned within 10 days of delivery\n• Items must be unused and in original packaging\n• Certain custom orders and specialized electrical components may be non-returnable\nPlease refer to our full Returns Policy for complete details.",
  ],
  [
    "How can I contact you for urgent inquiries?",
    "For urgent inquiries, you can contact us via:\n• WhatsApp: +971 55 274 8974\n• Email: sales@weselldeadlots.com\n• Visit our office in Sharjah, UAE",
  ],
  [
    "Do you offer warranty on your products?",
    "Some products may include a manufacturer’s warranty, depending on the product and supplier.\nWarranty terms vary by category, so we recommend confirming details with our sales team at the time of order.",
  ],
];

export const contactPage = {
  _id: "contactPage",
  _type: "contactPage",
  heading: "Let's get\nin touch",
  description: "Great! We're excited to hear from you and let's start something special together. contact us for inquiry",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.337651086552!2d55.4883495!3d25.3184976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f4007323871%3A0xe53fa045862d85d7!2sSharjah%2C%20United%20Arab%20Emirates!5e0!3m2!1sen!2suk!4v1709123456789!5m2!1sen!2suk",
  formHeading: "Say Hello!",
  placeholders: { name: "[Your name/company name]", email: "[Email]", phone: "[Phone]", subject: "[Subject]" },
  errors: {
    name: "Name is required",
    email: "Valid email is required",
    phone: "Valid phone number is required",
    subject: "Subject is required",
    general: "Error sending message. Please try again later.",
  },
  submitLabel: "Submit",
  sendingLabel: "Sending...",
  successMessage: "Message sent successfully!",
  faq: {
    _type: "faqSection",
    heading: "FAQs",
    enableSchema: true,
    hidden: false,
    items: keyed(
      faqs.map(([question, answer]) => ({ _type: "faqItem", question, answer, hidden: false })),
      "faq",
    ),
  },
  seo: { _type: "seo", canonicalUrl: "/contact" },
};

// ---------- sell with us ----------
export const sellPage = {
  _id: "sellPage",
  _type: "sellPage",
  heading: "Sell With Us",
  intro: "Fill out the form below, and our team will provide a valuation within 24–48 hours.",
  heroImage: null,
  labels: {
    company: "Your company is a?",
    mobile: "Mobile Number",
    email: "Email ID",
    category: "What kind of dead stock do you want?",
    costPrice: "Cost Price",
    askPrice: "Asking Price",
    country: "Country",
    state: "State",
  },
  placeholders: {
    company: "[Enter your company function]",
    mobile: "[Mobile Number]",
    email: "[Email ID]",
    category: "[ Select category of your dead stock ]",
    country: "[ Select Country ]",
    state: "[ Select State ]",
    stateDisabled: "[ Select Country first ]",
  },
  submitLabels: { idle: "Submit", loading: "Sending...", success: "Sent! ✓", error: "Failed. Retry" },
  stockCategories: [
    "Electronics",
    "Clothing & Apparel",
    "Footwear",
    "Furniture & Home Decor",
    "Toys & Games",
    "Sports & Fitness",
    "Beauty & Personal Care",
    "Books & Stationery",
    "Automotive Parts",
    "Food & Beverages",
    "Industrial Equipment",
    "Other",
  ],
  currencies: ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "KWD"],
  defaultCurrency: "AED",
  countries: keyed(
    [
      ["United Arab Emirates", ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]],
      ["United States", ["California", "New York", "Texas", "Florida", "Illinois"]],
      ["India", ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"]],
      ["United Kingdom", ["England", "Scotland", "Wales", "Northern Ireland"]],
      ["Saudi Arabia", ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"]],
      ["Qatar", ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor"]],
      ["Kuwait", ["Kuwait City", "Hawalli", "Ahmadi", "Jahra"]],
    ].map(([name, states]) => ({ _type: "countryStates", name, states })),
    "cty",
  ),
  seo: { _type: "seo" },
};

// ---------- blog ----------
export const blogSettings = {
  _id: "blogSettings",
  _type: "blogSettings",
  heroTitle: "Blog",
  heroDescription: "Discover insights, tips, and stories to inform and inspire your journey.",
  heroImage: img("/images/blogs/blogs.webp", "Blog Hero Background"),
  backLabel: "Back",
  searchPlaceholder: "Search articles...",
  cardLabel: "Business Blog",
  readMoreText: "Click to read more...",
  publishedLabel: "Published on",
  loadMoreLabel: "Load More",
  loadingLabel: "Loading blogs...",
  emptyMessage: "No articles found matching",
  postLabel: "Dead Stock Blog",
  fallbackImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
  seo: { _type: "seo", canonicalUrl: "/blogs" },
};

// ---------- legal pages (dynamic `page` documents) ----------
const contactLines = keyed(
  [
    { _type: "contactLine", icon: "📧", text: "Email: sales@weselldeadlots.com" },
    { _type: "contactLine", icon: "📞", text: "Phone: +971 55 274 8974" },
    { _type: "contactLine", icon: "📍", text: "Address: Industrial Area 3, Sharjah, UAE." },
  ],
  "cl",
);
const COPYRIGHT_LINE = "© 2025 We Sell Dead Lots | A Brand of Chaudary Anwar Tr. Co. L.L.C. All Rights Reserved";

const legalSection = (heading, body, extra = {}) => ({ _type: "legalSection", heading, body, ...extra });

export const privacyPage = {
  _id: "page-privacy",
  _type: "page",
  title: "Privacy Policy",
  slug: { _type: "slug", current: "privacy" },
  status: "live",
  sections: keyed(
    [
      { _type: "pageHeaderSection", heading: "Privacy Policy", backLabel: "Back", backPath: "/", hidden: false },
      {
        _type: "legalContentSection",
        effectiveDate: "2025-02-22",
        lastUpdated: "2025-02-22",
        effectiveLabel: "Effective Date",
        updatedLabel: "Last Updated",
        intro: [
          p(
            "WeSellDeadLots values your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you visit our website, www.weselldeadlots.com.",
          ),
        ],
        sections: keyed(
          [
            legalSection("1. Who We Are", [
              p(
                "We Sell Dead Lots is a registered general trading company based in Sharjah, United Arab Emirates (UAE), specializing in electrical materials, electronics, and hardware supplies.",
              ),
              p("Our website provides information and services related to the wholesale and retail distribution of these products."),
            ]),
            legalSection("2. Information We Collect", [
              p("We may collect the following information:"),
              ...bullets([
                "Personal details (name, email address, phone number)",
                "Company name and address",
                "Billing and shipping information",
                "Communication records (emails, messages)",
                "Website usage data (IP address, browser type, device information)",
              ]),
              p("We collect information when:"),
              ...bullets([
                "You fill out forms on our website",
                "You contact us via email, WhatsApp, or phone",
                "You make inquiries, place orders, or request quotes",
              ]),
            ]),
            legalSection(
              "3. How We Use Your Information",
              bullets([
                "Process orders, quotes, and inquiries",
                "Respond to customer service requests",
                "Send updates, promotions, and newsletters (only if you opt-in)",
                "Improve our website and services",
                "Comply with UAE legal requirements",
              ]),
            ),
            legalSection("4. Sharing Your Information", [
              p("We do not sell, trade, or rent your personal data to third parties."),
              p("We may share information with:"),
              ...bullets([
                "Shipping partners to deliver products",
                "Payment service providers for secure transactions",
                "Legal authorities if required by UAE law.",
              ]),
            ]),
            legalSection("5. Data Security", [
              p("We implement security measures to protect your personal information, including:"),
              ...bullets(["SSL encryption on our website", "Secure payment gateways", "Access restrictions to sensitive data"]),
              p("However, no system is 100% secure, and we encourage users to take their own precautions as well."),
            ]),
            legalSection("6. Your Rights", [
              p("You have the right to:"),
              ...bullets([
                "Access your personal information",
                "Correct inaccurate information",
                "Request deletion of your data",
                "Withdraw consent for marketing communications",
              ]),
              p("To exercise any of these rights, please contact us directly."),
              p(COPYRIGHT_LINE),
            ]),
            legalSection("7. Cookies & Tracking", [
              p("Our website uses cookies to improve your browsing experience. Cookies help us:"),
              ...bullets(["Understand visitor behavior", "Save your preferences", "Provide a smoother user experience"]),
              p("You can disable cookies in your browser settings if you prefer."),
            ]),
            legalSection("8. Changes to This Policy", [
              p(
                "We may update this Privacy Policy from time to time to reflect changes in our services, laws, or best practices. Any updates will be posted on this page with an updated effective date.",
              ),
            ]),
            legalSection("9. Contact Us", [p("For any questions regarding these Terms and Conditions, please contact us:")], {
              contactLines,
            }),
          ],
          "ls",
        ),
        hidden: false,
      },
    ],
    "psec",
  ),
  seo: { _type: "seo", canonicalUrl: "/privacy" },
};

export const termsPage = {
  _id: "page-terms",
  _type: "page",
  title: "Terms and Conditions",
  slug: { _type: "slug", current: "terms" },
  status: "live",
  sections: keyed(
    [
      { _type: "pageHeaderSection", heading: "Terms and Conditions", backLabel: "Back", backPath: "/", hidden: false },
      {
        _type: "legalContentSection",
        effectiveDate: "2025-02-22",
        lastUpdated: "2025-02-22",
        effectiveLabel: "Effective Date",
        updatedLabel: "Last Updated",
        intro: [
          block("normal", [
            span('By using WeSellDeadLots ("we," "our," or "us") and our services through '),
            span("www.weselldeadlots.com", ["strong"]),
            span(' (the "Site"), you ("you" or "User") agree to these Terms and Conditions.'),
          ]),
        ],
        sections: keyed(
          [
            legalSection("1. Products and Services", [
              p("We supply a wide range of quality products including but not limited to:"),
              ...bullets(["Electrical Motors", "Power Tools", "Wiring Accessories", "Industrial Electronics", "Hardware Supplies"]),
              p(
                "All product descriptions, images, and specifications are provided for informational purposes and are subject to change without prior notice.",
              ),
            ]),
            legalSection("2. Pricing and Payment", [
              p("All prices listed on our website are in AED (United Arab Emirates Dirham) unless stated otherwise."),
            ]),
            legalSection(
              "3. Shipping and Delivery",
              bullets([
                "We offer local shipping.",
                "Delivery timelines may vary based on stock availability, shipping destination, and logistics.",
                "Shipping charges, customs duties, and taxes are the responsibility of the buyer unless stated otherwise.",
              ]),
            ),
            legalSection("4. Returns and Refunds", [
              p("Products can be returned within 10 days of delivery if they are unused and in their original packaging."),
            ]),
            legalSection("5. Limitation of Liability", [
              p("We strive to ensure the accuracy of all information on our website. However, we are not liable for:"),
              ...bullets([
                "Any indirect, incidental, or consequential damages arising from the use of our products or services.",
                "Any errors or omissions in product descriptions or pricing.",
              ]),
            ]),
            legalSection("6. Intellectual Property", [
              p(
                "All content, logos, graphics, and images on this website are the property of We Sell Dead Lots and are protected by intellectual property laws. Unauthorized use or reproduction is prohibited.",
              ),
              p(COPYRIGHT_LINE),
            ]),
            legalSection("7. Governing Law", [
              p(
                "These Terms shall be governed and interpreted in accordance with the laws of the United Arab Emirates. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Sharjah, UAE.",
              ),
            ]),
            legalSection("8. Contact Information", [p("For any questions regarding these Terms and Conditions, please contact us:")], {
              contactLines: contactLines.map((l) => ({ ...l, _key: key("cl") })),
            }),
          ],
          "ts",
        ),
        hidden: false,
      },
    ],
    "tsec",
  ),
  seo: { _type: "seo", canonicalUrl: "/terms" },
};

export const seedDocuments = [
  siteSettings,
  navigation,
  footer,
  homePage,
  contactPage,
  sellPage,
  blogSettings,
  privacyPage,
  termsPage,
];

/** Fallback lookups used by the frontend when Sanity has no document yet. */
export const defaultsByType = {
  siteSettings,
  navigation,
  footer,
  homePage,
  contactPage,
  sellPage,
  blogSettings,
};

export const defaultPages = [privacyPage, termsPage];
