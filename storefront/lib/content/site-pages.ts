export interface SitePage {
  slug: string
  title: string
  summary: string
  sections: Array<{
    heading: string
    body: string[]
  }>
}

export const sitePages: Record<string, SitePage> = {
  faq: {
    slug: "faq",
    title: "Frequently Asked Questions",
    summary: "Quick answers about orders, custom magnets, shipping, and returns.",
    sections: [
      {
        heading: "Orders",
        body: [
          "Most ready-to-ship magnets leave our studio within 1 to 3 business days.",
          "Custom orders usually take 5 to 7 business days because we prepare and review artwork before production.",
        ],
      },
      {
        heading: "Custom designs",
        body: [
          "You can upload a photo or idea through our custom service page and we will send back a confirmation before production starts.",
          "If your artwork needs cleanup, we will let you know before charging for any advanced design work.",
        ],
      },
      {
        heading: "Support",
        body: [
          "If something looks wrong with your order, contact us within 7 days of delivery and we will help with a replacement or refund.",
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping Information",
    summary: "Estimated timelines, tracking expectations, and packaging details.",
    sections: [
      {
        heading: "Processing and delivery",
        body: [
          "Domestic orders typically arrive within 5 to 8 business days after dispatch.",
          "International delivery usually takes 7 to 15 business days depending on customs and local carriers.",
        ],
      },
      {
        heading: "Tracking",
        body: [
          "Tracking is emailed once your parcel is scanned by the carrier.",
          "Please allow up to 24 hours for the first tracking event to appear after dispatch.",
        ],
      },
      {
        heading: "Packaging",
        body: [
          "Magnets are packed in rigid mailers or small gift-ready boxes to prevent chipping during transit.",
        ],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Return Policy",
    summary: "How returns, exchanges, and damaged-item claims are handled.",
    sections: [
      {
        heading: "Standard returns",
        body: [
          "Unused non-custom products can be returned within 30 days of delivery.",
          "Refunds are issued to the original payment method after the returned item is inspected.",
        ],
      },
      {
        heading: "Damaged packages",
        body: [
          "If an item arrives damaged, send photos of the package and product and we will arrange a replacement quickly.",
        ],
      },
      {
        heading: "Custom items",
        body: [
          "Custom-made magnets are non-returnable unless they arrive damaged or do not match the approved proof.",
        ],
      },
    ],
  },
  "size-guide": {
    slug: "size-guide",
    title: "Size Guide",
    summary: "Typical dimensions for single magnets, sets, and custom formats.",
    sections: [
      {
        heading: "Standard sizes",
        body: [
          "Most souvenir magnets are between 5 and 8 cm on the longest side.",
          "Layered 3D magnets are usually thicker and slightly heavier than flat printed pieces.",
        ],
      },
      {
        heading: "Custom sizing",
        body: [
          "For custom orders, we can suggest the best size based on your design detail, intended use, and budget.",
        ],
      },
      {
        heading: "Need help choosing",
        body: [
          "If you are not sure which size works best, contact our team and we will recommend options before production.",
        ],
      },
    ],
  },
  blog: {
    slug: "blog",
    title: "Magnetique Journal",
    summary: "Stories about travel keepsakes, gift ideas, and custom magnet inspiration.",
    sections: [
      {
        heading: "What we publish",
        body: [
          "We share design inspiration, travel-themed collections, gifting guides, and behind-the-scenes production notes.",
        ],
      },
      {
        heading: "Featured topics",
        body: [
          "Popular topics include destination magnet collections, seasonal gift sets, and custom family keepsakes.",
        ],
      },
    ],
  },
  careers: {
    slug: "careers",
    title: "Careers",
    summary: "We are building a small team focused on thoughtful products and reliable fulfillment.",
    sections: [
      {
        heading: "Who we look for",
        body: [
          "We value product-minded people who care about craft, customer communication, and steady execution.",
        ],
      },
      {
        heading: "Current status",
        body: [
          "We are not actively hiring for every role year-round, but we always welcome strong portfolios and partnership inquiries.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "A plain-language overview of what information we collect and why.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "We collect order details, contact information, and the minimum technical data needed to operate the storefront securely.",
        ],
      },
      {
        heading: "How it is used",
        body: [
          "Information is used to fulfill orders, respond to support requests, prevent fraud, and improve the shopping experience.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can contact us to update your account information or request removal of non-essential data where applicable.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    summary: "The main terms that apply when browsing, ordering, or requesting custom work.",
    sections: [
      {
        heading: "Orders and pricing",
        body: [
          "Orders are accepted subject to stock availability, payment confirmation, and review of custom artwork where applicable.",
        ],
      },
      {
        heading: "Product presentation",
        body: [
          "We aim to present colors and materials accurately, but slight variation can occur because of screens and handmade finishes.",
        ],
      },
      {
        heading: "Custom work",
        body: [
          "By submitting artwork, you confirm you have the right to use that content for production.",
        ],
      },
    ],
  },
}
