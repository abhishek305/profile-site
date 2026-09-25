import routeData from "./route-data.json";

export interface V3Route {
  path: string;
  label: string;
  title: string;
  description: string;
  kind: "home" | "work" | "project" | "experience" | "code" | "about" | "contact";
  projectSlug?: string;
}

export const v3Routes = routeData as V3Route[];

export const normalizePath = (path: string): string => {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

export const routeForPath = (path: string): V3Route | undefined =>
  v3Routes.find((route) => route.path === normalizePath(path));

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

export const legacyRedirects: Record<string, string> = {
  home: "/",
  welcome: "/",
  about: "/about",
  skills: "/about#skills",
  experience: "/experience",
  projects: "/work",
  github: "/code",
};
