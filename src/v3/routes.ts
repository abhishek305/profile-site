import routeData from "./route-data.json";
import type { RouteKind } from "./types";

export interface V3Route {
  path: string;
  label: string;
  title: string;
  description: string;
  kind: RouteKind;
  projectSlug?: string;
}

export const v3Routes = routeData as V3Route[];

export const normalizePath = (path: string): string => {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

export const routeForPath = (path: string): V3Route | undefined =>
  v3Routes.find((route) => route.path === normalizePath(path));

/** Section ids on the home page, in document order. Drives the section rail. */
export const homeSectionIds = [
  "intro",
  "mcp",
  "architect-agent",
  "crowdly",
  "latex",
  "results",
  "experience",
  "github",
  "about",
  "contact",
] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

export const homeSectionLabels: Record<HomeSectionId, string> = {
  intro: "Intro",
  mcp: "MCP Profile Hub",
  "architect-agent": "architect-agent",
  crowdly: "Crowdly",
  latex: "LaTeX Live Editor",
  results: "Results",
  experience: "Experience",
  github: "Code on GitHub",
  about: "About",
  contact: "Contact",
};

/**
 * Root hash URLs published by the retired public shell. Those links are still in
 * the wild, so they are mapped to their equivalent path-based route.
 */
export const legacyHashRedirects: Record<string, string> = {
  home: "/",
  welcome: "/",
  about: "/about",
  skills: "/about#skills",
  experience: "/experience",
  projects: "/work",
  github: "/code",
};
