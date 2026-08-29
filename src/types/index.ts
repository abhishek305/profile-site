// Theme types
export type ThemeId = 'dark-plus' | 'light-plus' | 'monokai' | 'solarized-dark' | 'night' | 'gaming' | 'invert';

export interface Theme {
  id: ThemeId;
  name: string;
}

// PageId is derived from the page registry so adding a page needs no edit here.
export type { PageId } from '@/data/pages';

// Content types
export interface ExperienceData {
  role: string;
  company: string;
  date: string;
  highlights: string[];
  tech?: string[];
  /** Renders as a "Current" marker on the timeline. */
  current?: boolean;
}

export interface SkillCategory {
  category: string;
  id: string;
  skills: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  /** Source repository. */
  link?: string;
  /** Live, hosted version — rendered as a separate primary action. */
  demo?: string;
  highlight?: string;
}

// Terminal types
export interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'comment';
}

// GitHub theme mapping
export interface GitHubThemeMap {
  stats: Record<ThemeId, string>;
  activity: Record<ThemeId, string>;
  views: Record<ThemeId, string>;
}
