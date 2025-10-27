import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store";
import ActivityBar from "./components/ActivityBar/ActivityBar";
import TabsBar from "./components/TabsBar/TabsBar";
import Editor from "./components/Editor/Editor";
import Terminal from "./components/Terminal/Terminal";
import StatusBar from "./components/StatusBar/StatusBar";
import Matrix from "./components/Matrix/Matrix";
import SEO from "./components/SEO/SEO";

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <SEO />
        <Matrix />
        <div className="flex w-full h-screen overflow-hidden">
          <ActivityBar />
          <main className="flex-1 h-full flex flex-col">
            <TabsBar />
            <Editor />
            <Terminal />
            <StatusBar />
          </main>
        </div>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
