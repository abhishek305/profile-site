import { useMemo } from "react";
import { Footer } from "./components/layout/Footer";
import { Rail } from "./components/layout/Rail";
import { TopBar } from "./components/layout/TopBar";
import { ToastProvider } from "./components/ui/Toast";
import { useRouteMeta } from "./hooks/useRouteMeta";
import { useTheme } from "./hooks/useTheme";
import { normalizePath, routeForPath } from "./routes";
import { PageContent } from "./routes/pages";

const V3App = () => {
  const path = normalizePath(window.location.pathname);
  const route = useMemo(() => routeForPath(path), [path]);
  const { theme, toggleTheme } = useTheme();

  useRouteMeta(route);

  const isHome = route?.kind === "home";

  return (
    <ToastProvider>
      <div className="v3-app">
        <a className="skip" href="#main">
          Skip to content
        </a>

        <TopBar theme={theme} onThemeChange={toggleTheme} />

        <div className={`layout ${isHome ? "" : "deep-layout"}`}>
          {isHome && <Rail />}
          <main id="main" tabIndex={-1}>
            <PageContent route={route} />
          </main>
        </div>

        <Footer />
      </div>
    </ToastProvider>
  );
};

export default V3App;
