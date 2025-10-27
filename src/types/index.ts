// Theme types
export type ThemeId = 'dark-plus' | 'light-plus' | 'monokai' | 'solarized-dark' | 'night' | 'gaming' | 'invert';

export interface Theme {
  id: ThemeId;
  name: string;
}

// Page types
export type PageId = 'home' | 'about' | 'skills' | 'experience' | 'github' | 'welcome';

export interface PageContent {
  title: string;
  type: 'markdown' | 'custom' | 'custom_skills';
  content?: string;
  data?: ExperienceData[] | SkillCategory[];
}

export interface ExperienceData {
  role: string;
  company: string;
  date: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  id: string;
  skills: string[];
}

// Terminal types
export interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'comment';
}

// Firebase types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// GitHub theme mapping
export interface GitHubThemeMap {
  stats: Record<ThemeId, string>;
  activity: Record<ThemeId, string>;
  views: Record<ThemeId, string>;
}

