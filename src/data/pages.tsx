import type { ReactNode } from "react";
import { HomeIcon, UserIcon, CodeIcon, CalendarIcon, ActivityIcon, PackageIcon } from "@/components/icons";

interface NavEntry {
  icon: () => ReactNode;
  label: string;
}

interface Page {
  /** Tab label — use a filename to keep the IDE illusion. */
  title: string;
  /** Present = show in the activity bar and command palette. */
  nav?: NavEntry;
}

/**
 * Page metadata: the single source of truth for tabs, activity-bar icons,
 * command-palette entries, terminal commands and #hash routes.
 *
 * Deliberately imports nothing but icons — everything else in the app imports
 * this module, so pulling in page components here would create a cycle. The
 * matching view for each id lives in the `views` map in Editor.tsx, which
 * TypeScript will refuse to compile until you add the new entry.
 */
export const pages = {
  welcome: { title: "Welcome" },
  home: { title: "README.md", nav: { icon: HomeIcon, label: "Home" } },
  about: { title: "abhishek.md", nav: { icon: UserIcon, label: "About" } },
  skills: { title: "skills.ts", nav: { icon: CodeIcon, label: "Skills" } },
  experience: { title: "experience.json", nav: { icon: CalendarIcon, label: "Experience" } },
  projects: { title: "projects.json", nav: { icon: PackageIcon, label: "Projects" } },
  github: { title: "github_stats.md", nav: { icon: ActivityIcon, label: "GitHub Stats" } },
} satisfies Record<string, Page>;

export type PageId = keyof typeof pages;

export const isPageId = (value: string): value is PageId => value in pages;

/** Pages shown in the activity bar / palette, in declaration order. */
export const navPages: (NavEntry & { id: PageId; title: string })[] = (Object.entries(pages) as [PageId, Page][]).flatMap(([id, page]) => (page.nav ? [{ id, title: page.title, ...page.nav }] : []));
