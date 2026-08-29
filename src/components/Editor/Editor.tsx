import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import type { PageId } from "@/data/pages";
import { aboutMarkdown, homeMarkdown, impactStats } from "@/data/content";
import WelcomePage from "./pages/WelcomePage";
import MarkdownPage from "./pages/MarkdownPage";
import SkillsPage from "./pages/SkillsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";
import GitHubPage from "./pages/GitHubPage";

/** Record<PageId, ...> makes this exhaustive: a new page in pages.tsx won't compile until it has a view. */
const views: Record<PageId, () => ReactNode> = {
  welcome: () => <WelcomePage />,
  home: () => (
    <MarkdownPage content={homeMarkdown}>
      <dl className="impact-row">
        {impactStats.map((stat) => (
          <div key={stat.label} className="impact-stat">
            <dt className="impact-value font-mono">{stat.value}</dt>
            <dd className="impact-label">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </MarkdownPage>
  ),
  about: () => <MarkdownPage content={aboutMarkdown} />,
  skills: () => <SkillsPage />,
  experience: () => <ExperiencePage />,
  projects: () => <ProjectsPage />,
  github: () => <GitHubPage />,
};

const Editor = () => {
  const activeTab = useAppSelector((state) => state.tabs.activeTab);
  const view = (activeTab && views[activeTab]) || views.welcome;

  // key forces a remount per tab so the page-enter animation replays.
  return (
    <div key={activeTab ?? "welcome"} className="editor-window page-enter flex-1 p-6 md:p-12 overflow-y-auto">
      {view()}
    </div>
  );
};

export default Editor;
