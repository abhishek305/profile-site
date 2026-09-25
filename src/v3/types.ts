export type DemoKind = "mcp" | "architect" | "crowdly" | "latex";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  navLabel: string;
  tagline: string;
  paragraphs: string[];
  demo: DemoKind;
  stack: string[];
  links: ProjectLink[];
  facts: string[];
  tryThis: string;
  disclaimer: string;
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

export interface SkillGroup {
  label: string;
  value: string;
}

export interface DefinitionItem {
  label: string;
  value: string;
}
