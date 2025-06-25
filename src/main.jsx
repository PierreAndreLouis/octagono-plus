import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./db.js"; // Assurez-vous que le chemin d'accès est correct selon votre structure de dossier
import "./firebaseConfig.js";
import { BrowserRouter as Router } from "react-router-dom";
import DataContextProvider from "./context/DataContext.jsx";
import ThemeProvider from "./theme/ThemeProvider.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./theme/store.js";
import { PersistGate } from "redux-persist/integration/react";
import i18next from "i18next";

import english from "./traduction/anglais/language.json";
import français from "./traduction/francais/language.json";
import espagnol from "./traduction/espagnol/language.json";
import { I18nextProvider } from "react-i18next";

const savedLang = localStorage.getItem("lang") || "fr";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

// console.log = () => {}; // désactive tous les console.log

i18next.init({
  interpolation: { escapeValue: false },
  lng: savedLang,
  resources: {
    en: { translation: english },
    fr: { translation: français },
    es: { translation: espagnol },
  },
});

// import DataContextProvider from "./context/DataContext.js"; // Le provider du contexte

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <I18nextProvider i18n={i18next}>
        <DataContextProvider>
          <PersistGate persistor={persistor}>
            <Provider store={store}>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </Provider>
          </PersistGate>
        </DataContextProvider>
      </I18nextProvider>
    </Router>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
