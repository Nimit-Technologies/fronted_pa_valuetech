import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";

const root = (
  <ErrorBoundary>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Toaster position="top-right" richColors />
          <App />
        </PersistGate>
      </Provider>
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
