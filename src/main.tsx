import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  LeanScopeClient,
  LeanScopeClientApp,
} from "@leanscope/api-client/node";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
      <App />
    </LeanScopeClientApp>
  </React.StrictMode>,
);
