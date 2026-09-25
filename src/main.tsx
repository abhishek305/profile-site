import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import V3App from "./v3/V3App.tsx";
import { legacyRedirects } from "./v3/routes.ts";
import "./styles/index.css";
import "./v3/styles.css";

const isLegacyPath = window.location.pathname === "/v1" || window.location.pathname.startsWith("/v1/");
const legacyHash = decodeURIComponent(window.location.hash.slice(1));

// Old root hash URLs belong to the retired public shell. Keep the old IDE
// available at /v1, but send the old public links into the path-based V3 site.
if (!isLegacyPath && legacyRedirects[legacyHash]) {
  window.location.replace(legacyRedirects[legacyHash]);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isLegacyPath ? <App /> : <V3App />}
  </React.StrictMode>,
);
