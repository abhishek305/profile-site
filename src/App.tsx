import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store";
import { useHashRoute } from "./hooks/useHashRoute";
import { useShortcuts } from "./hooks/useShortcuts";
import ActivityBar from "./components/ActivityBar/ActivityBar";
import TabsBar from "./components/TabsBar/TabsBar";
import Editor from "./components/Editor/Editor";
import Terminal from "./components/Terminal/Terminal";
import StatusBar from "./components/StatusBar/StatusBar";
import Matrix from "./components/Matrix/Matrix";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import SEO from "./components/SEO/SEO";

/** Inner component so the hooks can reach the store. */
const Shell = () => {
  useHashRoute();
  useShortcuts();

  return (
    <>
      <Matrix />
      <CommandPalette />
      <div className="flex w-full app-height overflow-hidden">
        <ActivityBar />
        <main className="flex-1 h-full flex flex-col min-w-0">
          <TabsBar />
          <Editor />
          <Terminal />
          <StatusBar />
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <SEO />
        <Shell />
      </HelmetProvider>
    </Provider>
  );
}

export default App;
