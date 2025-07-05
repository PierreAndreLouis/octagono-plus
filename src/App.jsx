import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { DataContext } from "./context/DataContext";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Page_404 from "./components/page_404/Page_404";
import Login2 from "./components/login/Login2";
import Navigation_bar from "./components/home/Navigation_bar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import SuccèsÉchecMessagePopup from "./components/Reutilisable/SuccèsÉchecMessagePopup";
import GoogleTranslate from "./components/home/GoogleTranslate";




function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Utilisation de useNavigate

  const {
    isAuthenticated = false,
    readDocumentation,
    error,
    setError,
    isDashboardHomePage,
  } = useContext(DataContext);

  React.useEffect(() => {
    // Redirige vers /home si l'utilisateur est authentifié et se rend sur "/login"
    if (isAuthenticated && location.pathname === "/login") {
      navigate("/home"); // Utilisation correcte de navigate
    }
  }, [isAuthenticated, isDashboardHomePage, location.pathname, navigate]);

  // Liste des chemins où le footer ne doit pas apparaître
  const hideComponentRoutes = ["/login"];

  // Vérification si le chemin actuel correspond à l'un des chemins dans hideComponentRoutes
  const shouldHideComponent = hideComponentRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const [waitToDownload, setWaitToDownload] = useState(false);

  //
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // fonction pour gestion du message de connexion d'internet
  useEffect(() => {
    // Détecter la perte de connexion
    const handleOffline = () => setIsOffline(true);
    // Détecter le retour de la connexion
    const handleOnline = () => setIsOffline(false);

    // Ajouter les écouteurs d'événements
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Nettoyage des écouteurs d'événements
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  //
  const [errors, setErrors] = useState([]);

  const addError = (message) => {
    const id = Date.now() + Math.random();
    setErrors((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setErrors((prev) => prev.filter((err) => err.id !== id));
    }, 10000);
  };

  useEffect(() => {
    if (error) {
      addError(error);
      setError(null); // évite de l'ajouter plusieurs fois
    }
  }, [error]);

  return (
    <div className="dark:bg-gray-700 min-h-screen">
      <div className="dark:bg-slate-800/70 dark:border dark:border-slate-800">
        <ScrollToTop />

        <GoogleTranslate />

        {/* Ces composant vont pouvoir apparaitre dans tous les page, sauf dans /login */}
        {!readDocumentation && (
          <div className="absolute z-[10000000000000000000000000000000000000000]">
            {!shouldHideComponent && <Navigation_bar />}
          </div>
        )}

        {errors && (
          <div className="space-y-2 fixed flex flex-col items-center justify-center w-full left-0 right-0  top-[3rem] z-[9999999999999999999999999999999999999999999999999999999999999999999999999]">
            {errors?.map((err) => (
              <div
                key={err.id}
                className="relative w-full  mx-auto max-w-[30rem] p-4 py-2 bg-red-100 text-red-800 rounded shadow-lg shadow-black/20"
              >
                {err.message}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-red-500 animate-progress"
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
        )}
        <SuccèsÉchecMessagePopup />

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  // to={isDashboardHomePage ? "/home" : "/home"}
                  to={"/home"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login2 />} />

          <Route
            path="/home"
            element={<PrivateRoute element={<DashboardAdminPage />} />}
          />

          <Route
            path="/"
            element={<PrivateRoute element={<DashboardAdminPage />} />}
          />

          <Route path="*" element={<Page_404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
