import React from "react";
import ReactDOM from "react-dom/client";
import V3App from "./v3/V3App.tsx";
import { legacyRedirects } from "./v3/routes.ts";
import "./v3/styles.css";

const legacyHash = decodeURIComponent(window.location.hash.slice(1));

// The old public shell used root hash URLs. Those links are still in the wild,
// so send them to the matching path-based route.
if (legacyRedirects[legacyHash]) {
  window.location.replace(legacyRedirects[legacyHash]);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <V3App />
  </React.StrictMode>,
);
