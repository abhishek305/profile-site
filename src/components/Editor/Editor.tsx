import { useAppSelector } from "@/store/hooks";
import { pageContent } from "@/data/pageContent";
import WelcomePage from "./pages/WelcomePage";
import MarkdownPage from "./pages/MarkdownPage";
import SkillsPage from "./pages/SkillsPage";
import ExperiencePage from "./pages/ExperiencePage";
import GitHubPage from "./pages/GitHubPage";

const Editor = () => {
  const activeTab = useAppSelector((state) => state.tabs.activeTab);

  // Show welcome if no active tab
  if (!activeTab || activeTab === "welcome") {
    return (
      <div className="editor-window flex-1 p-8 md:p-12 overflow-y-auto">
        <WelcomePage />
      </div>
    );
  }

  const page = pageContent[activeTab];
  if (!page) {
    return (
      <div className="editor-window flex-1 p-8 md:p-12 overflow-y-auto">
        <WelcomePage />
      </div>
    );
  }

  // Route to appropriate page component
  let PageComponent;

  if (page.type === "markdown") {
    if (page.content === "github") {
      PageComponent = <GitHubPage />;
    } else {
      PageComponent = <MarkdownPage content={page.content || ""} />;
    }
  } else if (page.type === "custom_skills") {
    PageComponent = <SkillsPage />;
  } else if (page.type === "custom") {
    PageComponent = <ExperiencePage />;
  } else {
    PageComponent = <MarkdownPage content={page.content || ""} />;
  }

  return <div className="editor-window flex-1 p-8 md:p-12 overflow-y-auto">{PageComponent}</div>;
};

export default Editor;
