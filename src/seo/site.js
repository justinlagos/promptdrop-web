// Central site config for SEO. The production origin comes from VITE_SITE_URL
// when set; the Vercel default is the honest fallback.
const e = import.meta.env;
export const SITE_URL = String(e.VITE_SITE_URL || "https://promptdrop-web.vercel.app").replace(/\/+$/, "");
export const SITE_NAME = "PromptDrop";
export const DEFAULT_TITLE = "PromptDrop | Camera-Level Teleprompter for Better Video Recording";
export const DEFAULT_DESCRIPTION =
  "PromptDrop is a camera-level teleprompter that helps you read naturally on camera, record videos, clean awkward takes, and review browser meeting recordings.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/og-default.png`;
export const GOOGLE_SITE_VERIFICATION = e.VITE_GOOGLE_SITE_VERIFICATION || "";

export const absUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Shared structured-data builders.
export const orgId = `${SITE_URL}/#org`;
export const websiteId = `${SITE_URL}/#website`;

export function breadcrumbLd(items) {
  // items: [{ name, path }]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function faqLd(faqs) {
  // faqs: [{ q, a }] — answers must be plain text and honest.
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function articleLd({ title, description, path, datePublished, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absUrl(path),
    mainEntityOfPage: absUrl(path),
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: SITE_NAME, "@id": orgId },
    publisher: { "@type": "Organization", name: SITE_NAME, "@id": orgId },
    image: DEFAULT_OG_IMAGE,
  };
}
