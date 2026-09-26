/**
 * Single source of truth for identity and canonical URLs.
 *
 * The values live in `site.json` rather than in TypeScript so that both the
 * browser bundle and `scripts/prerender.mjs` read exactly the same strings.
 * The GitHub username used to be hardcoded in five places with three
 * different (mostly wrong) values.
 *
 * Note: the résumé also carries a personal phone number. It is deliberately
 * NOT here — a public portfolio page is a scraping target. Add it only if you
 * want it indexed.
 */
import site from "./site.json";

/** Canonical origin, without a trailing slash. Used for canonical tags, OG URLs, robots and sitemap. */
export const SITE_URL: string = site.siteUrl;

export const identity = {
  name: site.name,
  jobTitle: site.jobTitle,
  email: site.email,
} as const;

export const links = {
  github: site.githubUrl,
  linkedin: site.linkedinUrl,
  email: `mailto:${site.email}`,
} as const;
