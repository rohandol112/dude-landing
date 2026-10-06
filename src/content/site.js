/**
 * Global SEO + brand entity configuration.
 *
 * Single source of truth for site-wide metadata, structured data (@graph),
 * search intent clusters, and service catalogue.
 *
 * NOTE:
 * - Title has NO hyphen as requested: "Dudestrap Event Planning, Vendors & Custom Merch in India"
 * - Never add fake ratings, reviews, addresses, or vanity metrics.
 */
export const site = {
  // ---------------------------------------------------------------------------
  // CORE IDENTITY
  // ---------------------------------------------------------------------------
  url: "https://www.dudestrap.com",
  origin: "https://www.dudestrap.com",
  name: "Dudestrap",
  alternateName: "Düdestrap",
  tagline: "Your Ideas, Our Execution.",

  /**
   * Primary homepage title — no hyphen as requested.
   */
  title: "Dudestrap Event Planning, Vendors & Custom Merch in India",
  titleTemplate: "%s | Dudestrap",
  description:
    "Plan events, book vetted vendors and order custom merchandise with Dudestrap. Get clear quotations, protected payments and managed execution for weddings, birthdays, corporate events and more.",
  longDescription:
    "Dudestrap is an India-based managed marketplace for events, custom products and business requirements. Customers can discover and book event services, request custom merchandise, receive clear quotations, make protected payments and manage execution through one platform.",

  // ---------------------------------------------------------------------------
  // SEARCH INTENT
  // ---------------------------------------------------------------------------
  /**
   * Search intent clusters for content planning, structured data and search engines.
   */
  keywords: [
    // Brand
    "Dudestrap",
    "Düdestrap",
    "Dudestrap India",
    "Dudestrap events",

    // Event discovery
    "best event platform in India",
    "event planning app India",
    "event vendor platform India",
    "event booking platform India",
    "book event vendors online",
    "find event vendors",
    "event vendors near me",
    "event services near me",

    // Event planning
    "best event planners in India",
    "event planners in India",
    "event organisers in India",
    "event management services",
    "event management company India",
    "event planning services",
    "event organiser near me",

    // Weddings
    "wedding planners India",
    "wedding planners near me",
    "wedding decorators near me",
    "wedding decoration services",
    "wedding event vendors",
    "wedding stage decoration",
    "wedding event management",
    "wedding photographer booking",

    // Birthdays
    "birthday party planners",
    "birthday decoration near me",
    "birthday decorators",
    "birthday event planners",
    "birthday party decoration",
    "birthday party vendors",
    "kids birthday decoration",
    "birthday photographer",

    // Anniversary
    "anniversary decoration",
    "anniversary decorators",
    "anniversary event planning",

    // Corporate
    "corporate event management India",
    "corporate event planners",
    "corporate event organisers",
    "corporate event vendors",
    "office event planning",
    "company event management",
    "corporate conference organisers",
    "corporate event setup",

    // College events
    "college fest event management",
    "college fest organisers",
    "college event vendors",
    "college fest decoration",
    "college event management",

    // Event services
    "stage decoration",
    "stage setup services",
    "stage and decor setup",
    "event decoration",
    "event decorators",
    "event photographers",
    "event photography services",
    "event lighting services",
    "event sound system",
    "event production services",
    "event branding",
    "event printing services",

    // Merch
    "custom merchandise India",
    "custom merch India",
    "custom t-shirt printing India",
    "custom t-shirts online",
    "bulk custom t-shirts",
    "custom hoodies India",
    "custom apparel India",
    "event merchandise",
    "college fest merchandise",
    "corporate merchandise",

    // Corporate gifts
    "corporate gifts India",
    "custom corporate gifts",
    "employee welcome kits",
    "employee joining kits",
    "company welcome kits",
    "corporate gift boxes",
    "custom employee kits",

    // Print / branding
    "custom printing India",
    "bulk printing services",
    "event printing",
    "corporate printing",
    "print and branding",
    "custom branded products",

    // Procurement
    "business procurement platform",
    "custom product sourcing India",
    "bulk product sourcing",
    "managed procurement",
    "managed marketplace",
  ],

  /**
   * Search intent query groups for content architecture and section semantic tagging.
   */
  searchIntents: {
    events: [
      "event planning",
      "event vendor booking",
      "event management",
      "event services",
    ],
    weddings: [
      "wedding planning",
      "wedding decoration",
      "wedding vendors",
      "wedding photography",
    ],
    birthdays: [
      "birthday decoration",
      "birthday planning",
      "birthday vendors",
    ],
    corporateEvents: [
      "corporate event planning",
      "corporate events",
      "conference setup",
      "corporate event vendors",
    ],
    collegeEvents: [
      "college fest planning",
      "college fest vendors",
      "college event management",
    ],
    merchandise: [
      "custom merchandise",
      "custom t-shirts",
      "custom apparel",
      "event merchandise",
    ],
    corporateGifting: [
      "corporate gifts",
      "employee welcome kits",
      "onboarding kits",
      "custom gift boxes",
    ],
    printing: [
      "printing services",
      "event printing",
      "brand printing",
      "custom printing",
    ],
  },

  // ---------------------------------------------------------------------------
  // ENTITY / TOPICAL AUTHORITY
  // ---------------------------------------------------------------------------
  topics: [
    "Event planning",
    "Event management",
    "Event vendor booking",
    "Wedding planning",
    "Wedding decoration",
    "Birthday party planning",
    "Birthday party decoration",
    "Corporate event management",
    "College event management",
    "Stage and décor setup",
    "Event photography",
    "Event production",
    "Custom merchandise",
    "Custom apparel",
    "Corporate gifting",
    "Employee welcome kits",
    "Print and branding",
    "Business procurement",
    "Custom product sourcing",
  ],

  categories: [
    "Events",
    "Event Vendors",
    "Custom Products",
    "Merchandise",
    "Corporate Gifting",
    "Business Procurement",
  ],

  // ---------------------------------------------------------------------------
  // REGION
  // ---------------------------------------------------------------------------
  locale: "en_IN",
  language: "en-IN",
  country: {
    code: "IN",
    name: "India",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  currency: "INR",
  serviceLocations: [],

  // ---------------------------------------------------------------------------
  // CANONICALIZATION
  // ---------------------------------------------------------------------------
  canonical: "https://www.dudestrap.com/",
  trailingSlash: false,
  preferredHost: "www.dudestrap.com",

  // ---------------------------------------------------------------------------
  // ROBOTS
  // ---------------------------------------------------------------------------
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  // ---------------------------------------------------------------------------
  // BRAND
  // ---------------------------------------------------------------------------
  themeColor: "#FED900",
  backgroundColor: "#FCFCFB",
  logo: {
    default: "/icon-512.png",
    square: "/icon-512.png",
    width: 512,
    height: 512,
  },

  // ---------------------------------------------------------------------------
  // OPEN GRAPH
  // ---------------------------------------------------------------------------
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Dudestrap",
    title: "Dudestrap Event Planning, Vendors & Custom Merch in India",
    description:
      "Plan events, book vetted vendors and order custom merchandise through one managed platform.",
    url: "https://www.dudestrap.com/",
    images: [
      {
        url: "https://www.dudestrap.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dudestrap: Your Ideas, Our Execution.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // TWITTER / X CARDS
  // ---------------------------------------------------------------------------
  twitter: {
    card: "summary_large_image",
    title: "Dudestrap Event Planning, Vendors & Custom Merch in India",
    description:
      "Events, vetted vendors, custom merchandise and managed execution in one platform.",
    image: "https://www.dudestrap.com/og-image.jpg",
    site: null,
    creator: null,
  },

  // ---------------------------------------------------------------------------
  // IMAGES
  // ---------------------------------------------------------------------------
  ogImage: {
    path: "/og-image.jpg",
    url: "https://www.dudestrap.com/og-image.jpg",
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt: "Dudestrap: Your Ideas, Our Execution.",
  },

  // ---------------------------------------------------------------------------
  // SOCIAL / ENTITY RECONCILIATION
  // ---------------------------------------------------------------------------
  sameAs: [],

  // ---------------------------------------------------------------------------
  // BUSINESS INFO
  // ---------------------------------------------------------------------------
  business: {
    legalName: null,
    foundingDate: null,
    email: null,
    telephone: null,
    address: null,
    taxId: null,
  },

  contactPoints: [],

  // ---------------------------------------------------------------------------
  // SITE VERIFICATION
  // ---------------------------------------------------------------------------
  verification: {
    google: null,
    bing: null,
    yandex: null,
  },

  // ---------------------------------------------------------------------------
  // INDEXNOW
  // ---------------------------------------------------------------------------
  indexNowKey: "accc5f5bf7781a019aaee2feea0da049",

  // ---------------------------------------------------------------------------
  // SERVICE CATALOG
  // ---------------------------------------------------------------------------
  services: [
    {
      id: "event-planning",
      name: "Event Planning",
      serviceType: "Event Planning",
      description: "Managed event planning and execution through Dudestrap.",
    },
    {
      id: "event-vendors",
      name: "Event Vendor Booking",
      serviceType: "Event Vendor Marketplace",
      description: "Discover and book vetted vendors for event requirements.",
    },
    {
      id: "wedding-events",
      name: "Wedding Event Services",
      serviceType: "Wedding Event Services",
      description: "Wedding decoration, production and managed event requirements.",
    },
    {
      id: "birthday-events",
      name: "Birthday Event Services",
      serviceType: "Birthday Event Planning",
      description: "Birthday decorations and managed event requirements.",
    },
    {
      id: "corporate-events",
      name: "Corporate Event Management",
      serviceType: "Corporate Event Management",
      description: "Managed planning and execution for corporate events.",
    },
    {
      id: "college-events",
      name: "College Event Management",
      serviceType: "College Event Management",
      description: "Event requirements, production and merchandise for college events.",
    },
    {
      id: "event-photography",
      name: "Event Photography",
      serviceType: "Event Photography",
      description: "Photography services for events booked through Dudestrap.",
    },
    {
      id: "stage-decor",
      name: "Stage & Décor",
      serviceType: "Stage and Event Decoration",
      description: "Stage setup, décor and event production requirements.",
    },
    {
      id: "custom-merchandise",
      name: "Custom Merchandise",
      serviceType: "Custom Merchandise",
      description: "Custom apparel, merchandise and branded products for individuals, events and businesses.",
    },
    {
      id: "custom-tshirts",
      name: "Custom T-Shirt Printing",
      serviceType: "Custom T-Shirt Printing",
      description: "Custom printed T-shirts for events, communities and businesses.",
    },
    {
      id: "corporate-gifts",
      name: "Corporate Gifts",
      serviceType: "Corporate Gifting",
      description: "Custom corporate gifts and branded gifting requirements.",
    },
    {
      id: "employee-kits",
      name: "Employee Welcome Kits",
      serviceType: "Employee Welcome Kits",
      description: "Custom employee joining and onboarding kits for businesses.",
    },
    {
      id: "print-branding",
      name: "Print & Branding",
      serviceType: "Printing and Branding",
      description: "Managed printing and branding requirements for events and businesses.",
    },
    {
      id: "business-procurement",
      name: "Business Procurement",
      serviceType: "Managed Procurement",
      description: "Managed sourcing and execution for custom business requirements.",
    },
  ],

  // ---------------------------------------------------------------------------
  // INTENT PAGES ARCHITECTURE (for targeted landing pages / future routes)
  // ---------------------------------------------------------------------------
  seoPages: {
    weddings: {
      path: "/weddings",
      title: "Wedding Vendors & Event Planning in India",
      description: "Find vetted wedding vendors and manage decoration, photography, production and other wedding requirements with Dudestrap.",
      h1: "Everything your wedding needs. Managed in one place.",
      primaryKeyword: "wedding vendors India",
      secondaryKeywords: [
        "wedding planners India",
        "wedding decorators",
        "wedding vendors",
        "wedding event services",
      ],
    },
    birthdayDecoration: {
      path: "/birthday-decoration",
      title: "Birthday Decoration & Event Vendors | Dudestrap",
      description: "Plan birthday celebrations and book decoration and event services through Dudestrap.",
      h1: "Birthday setups without the vendor chaos.",
      primaryKeyword: "birthday decoration",
      secondaryKeywords: [
        "birthday decorators",
        "birthday event planners",
        "birthday party decoration",
      ],
    },
    corporateEvents: {
      path: "/corporate-events",
      title: "Corporate Event Planning & Vendors | Dudestrap",
      description: "Manage corporate event requirements, vendors, branding, production and merchandise through Dudestrap.",
      h1: "Corporate events. One team handling everything.",
      primaryKeyword: "corporate event management",
      secondaryKeywords: [
        "corporate event planners",
        "corporate event organisers",
        "corporate event vendors",
      ],
    },
    customMerchandise: {
      path: "/custom-merchandise",
      title: "Custom Merchandise & Bulk Merch in India | Dudestrap",
      description: "Order custom apparel, event merchandise and branded products with managed production and quality checks.",
      h1: "Custom merchandise, managed from brief to delivery.",
      primaryKeyword: "custom merchandise India",
      secondaryKeywords: [
        "custom merch",
        "custom apparel",
        "bulk merchandise",
        "event merchandise",
      ],
    },
    corporateGifts: {
      path: "/corporate-gifts",
      title: "Custom Corporate Gifts & Employee Kits | Dudestrap",
      description: "Source custom corporate gifts, employee welcome kits and branded products through Dudestrap.",
      h1: "Corporate gifting without procurement headaches.",
      primaryKeyword: "corporate gifts India",
      secondaryKeywords: [
        "employee welcome kits",
        "corporate gift boxes",
        "custom employee kits",
      ],
    },
  },
};
