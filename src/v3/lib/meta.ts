import { SITE_URL } from "../site";
import type { V3Route } from "../routes";

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

/**
 * Writes the document title, description, canonical URL and Open Graph / Twitter
 * tags for the active route.
 *
 * The prerendered HTML already carries these, so this only matters for
 * client-side navigation and for the not-found page. Passing `undefined`
 * produces the "page not found" metadata.
 */
export const applyRouteMeta = (route: V3Route | undefined) => {
  const title = route?.title ?? "Page not found – Abhishek Ezhava";
  const description = route?.description ?? "The requested portfolio page could not be found.";
  const path = route?.path ?? window.location.pathname;
  const canonical = `${SITE_URL}${path}`;

  document.title = title;
  upsertMeta('meta[name="description"]', "name", "description", description);
  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", description);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

  let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalElement) {
    canonicalElement = document.createElement("link");
    canonicalElement.rel = "canonical";
    document.head.appendChild(canonicalElement);
  }
  canonicalElement.href = canonical;
};
