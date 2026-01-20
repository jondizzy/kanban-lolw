import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// this is where the rendering happens
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* this is what it renders */}
    <App />
  </StrictMode>,
);
