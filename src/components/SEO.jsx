import { useEffect } from "react";
import {
  SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE,
  GOOGLE_SITE_VERIFICATION, absUrl,
} from "../seo/site.js";

// Lightweight head manager for this Vite SPA (no extra dependency).
// Every public page renders <SEO .../> once. Private/app pages render
// <SEO noindex title="..."/> so they are never indexed.

function upsertMeta(selectorAttr, key, content) {
  let el = document.head.querySelector(`meta[${selectorAttr}="${key}"]`);
  if (content == null || content === "") { if (el && el.dataset.seoManaged) el.remove(); return; }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(selectorAttr, key);
    el.dataset.seoManaged = "1";
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"][data-seo-managed], link[rel="${rel}"]:not([data-seo-managed])`);
  // Only manage one canonical; reuse the static one from index.html if present.
  if (rel === "canonical") el = document.head.querySelector('link[rel="canonical"]');
  if (!href) { if (el && el.dataset.seoManaged) el.remove(); return; }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.dataset.seoManaged = "1";
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(blocks) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
  if (!blocks) return;
  const list = Array.isArray(blocks) ? blocks : [blocks];
  list.filter(Boolean).forEach((data) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.dataset.seoJsonld = "1";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  });
}

export default function SEO({
  title,
  description,
  path,            // route path, e.g. "/features/teleprompter" — builds the canonical URL
  canonical,       // full canonical URL (overrides path)
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  structuredData,  // object or array of JSON-LD blocks
}) {
  useEffect(() => {
    const t = title || DEFAULT_TITLE;
    const d = description || DEFAULT_DESCRIPTION;
    const url = canonical || (path ? absUrl(path) : SITE_URL + "/");
    const img = ogImage ? (ogImage.startsWith("http") ? ogImage : absUrl(ogImage)) : DEFAULT_OG_IMAGE;

    document.title = t;
    upsertMeta("name", "description", d);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertLink("canonical", noindex ? "" : url);

    // Open Graph
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:title", ogTitle || t);
    upsertMeta("property", "og:description", ogDescription || d);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);

    // Twitter
    upsertMeta("name", "twitter:card", twitterCard);
    upsertMeta("name", "twitter:title", ogTitle || t);
    upsertMeta("name", "twitter:description", ogDescription || d);
    upsertMeta("name", "twitter:image", img);

    // Search Console verification (rendered only when a real token is configured)
    if (GOOGLE_SITE_VERIFICATION) upsertMeta("name", "google-site-verification", GOOGLE_SITE_VERIFICATION);

    setJsonLd(structuredData);
  }, [title, description, path, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard, noindex, structuredData]);

  return null;
}
