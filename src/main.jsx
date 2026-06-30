import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const root = (
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  import.meta.env.MODE === "development" ? (
    <React.StrictMode>{root}</React.StrictMode>
  ) : (
    root
  ),
);
