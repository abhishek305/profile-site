export type DemoKind = "mcp" | "architect" | "crowdly" | "latex";

export type ThemeName = "light" | "dark";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  navLabel: string;
  /** Home-page section id, targeted by the section rail and `#hash` links. */
  anchor: string;
  tagline: string;
  paragraphs: string[];
  demo: DemoKind;
  stack: string[];
  links: ProjectLink[];
  facts: string[];
  tryThis: string;
  disclaimer: string;
  /** One-line hook used in the hero's list of playable chapters. */
  highlight: string;
}

export interface ResultClaim {
  value: string;
  explanation: string;
}

export interface ExperienceRole {
  title: string;
  dates: string;
  bullets: string[];
}

export interface Repository {
  name: string;
  description: string;
  stack: string;
  links: ProjectLink[];
}

export interface DefinitionItem {
  label: string;
  value: string;
}

export type RouteKind =
  | "home"
  | "work"
  | "project"
  | "experience"
  | "code"
  | "about"
  | "contact"
  | "resume";
