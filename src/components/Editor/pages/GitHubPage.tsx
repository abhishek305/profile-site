import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { githubThemeMap } from "@/constants/themes";
import type { ThemeId } from "@/types";

const GitHubPage = () => {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const getGitHubUrls = (theme: ThemeId) => {
    const ghStatsTheme = githubThemeMap.stats[theme] || "default";
    const ghActivityTheme = githubThemeMap.activity[theme] || "default";
    const ghViewsColor = githubThemeMap.views[theme] || "blueviolet";

    return {
      streak: `https://github-readme-streak-stats.herokuapp.com/?user=abhishek305&theme=${ghStatsTheme}&hide_border=true`,
      langs: `https://github-readme-stats.vercel.app/api/top-langs/?username=abhishek305&layout=compact&theme=${ghStatsTheme}&hide_border=true&langs_count=8`,
      activity: `https://github-readme-activity-graph.vercel.app/graph?username=abhishek305&theme=${ghActivityTheme}&hide_border=true&area=true`,
      views: `https://komarev.com/ghpvc/?username=OkayDexter&color=${ghViewsColor}&style=for-the-badge`,
    };
  };

  const [urls, setUrls] = useState(getGitHubUrls(currentTheme));
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({
    streak: false,
    langs: false,
    activity: false,
    views: false,
  });

  useEffect(() => {
    // Update URLs when theme changes
    setUrls(getGitHubUrls(currentTheme));
    // Reset loaded states
    setLoadedImages({
      streak: false,
      langs: false,
      activity: false,
      views: false,
    });
  }, [currentTheme]);

  const handleImageLoad = (key: string) => {
    setLoadedImages((prev) => ({ ...prev, [key]: true }));
  };

  const handleImageError = (key: string) => {
    setLoadedImages((prev) => ({ ...prev, [key]: true })); // Remove skeleton on error
  };

  return (
    <div className="md-content max-w-3xl mx-auto">
      <h1>GitHub Statistics</h1>
      <br />
      <div className="github-grid">
        {/* GitHub Streak */}
        <div className={`github-card ${!loadedImages.streak ? "skeleton" : ""}`}>
          <img src={urls.streak} alt="GitHub Streak" className={loadedImages.streak ? "loaded" : ""} onLoad={() => handleImageLoad("streak")} onError={() => handleImageError("streak")} />
        </div>

        {/* Top Languages */}
        <div className={`github-card ${!loadedImages.langs ? "skeleton" : ""}`}>
          <img src={urls.langs} alt="Abhishek's Top Languages" className={loadedImages.langs ? "loaded" : ""} onLoad={() => handleImageLoad("langs")} onError={() => handleImageError("langs")} />
        </div>

        {/* GitHub Activity Graph */}
        <div className={`github-card github-card-full ${!loadedImages.activity ? "skeleton" : ""}`}>
          <img src={urls.activity} alt="GitHub Activity Graph" className={loadedImages.activity ? "loaded" : ""} onLoad={() => handleImageLoad("activity")} onError={() => handleImageError("activity")} />
        </div>

        {/* Profile Views */}
        <div className={`github-card github-card-full profile-views-card ${!loadedImages.views ? "skeleton" : ""}`}>
          <img src={urls.views} alt="Profile Views" className={loadedImages.views ? "loaded" : ""} onLoad={() => handleImageLoad("views")} onError={() => handleImageError("views")} />
        </div>
      </div>
    </div>
  );
};

export default GitHubPage;
