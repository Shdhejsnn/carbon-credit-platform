import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home";
import "./styles.css"; // Add styles

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
