import React, { useContext } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { ReloadPrompt } from "./pages/Prompt";
import Login2 from "./components/login/Login2";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Page_404 from "./components/page_404/Page_404";
import { DataContext } from "./context/DataContext";

// import Delete_vehicule from "./components/delete_vehicule/Delete_vehicule";
import ProtectedChangePassword from "./pages/ProtectedChangePassword";
import Header from "./components/home/Header";
import Navigation_bar from "./components/home/Navigation_bar";
import SideBar from "./components/home/SideBar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import ModifierPage from "./pages/ModifierPage";
import AjouterPage from "./pages/AjouterPage";
import ProfilUserPage from "./pages/ProfilUserPage";
import DetailsVehiculePage from "./pages/DetailsVehiculePage";
import LocationPage from "./pages/LocationPage";
import HistoriquePage from "./pages/HistoriquePage";
import RapportPageDetails from "./pages/RapportPageDetails";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Utilisation de useNavigate

  const { isAuthenticated } = useContext(DataContext);

  React.useEffect(() => {
    // Redirige vers /home si l'utilisateur est authentifié et se rend sur "/login"
    if (isAuthenticated && location.pathname === "/login") {
      navigate("/home"); // Utilisation correcte de navigate
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Liste des chemins où le footer ne doit pas apparaître
  const hideComponentRoutes = ["/login"];

  // Vérification si le chemin actuel correspond à l'un des chemins dans hideComponentRoutes
  const shouldHideComponent = hideComponentRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="dark:bg-gray-700 min-h-screen">
      <div className="dark:bg-slate-800/70 dark:border dark:border-slate-800">
        {/* Popup qui Permet a l'utilisateur de reload la page quand il y a mise a jour */}
        <div className="z-50 ">{/* <ReloadPrompt /> */}</div>

        {/* Composant pour faire défiler vers le haut */}
        <ScrollToTop />

        {/* Ces composant vont pouvoir apparaitre dans tous les page, sauf dans /login */}
        <div className="absolute z-[100000000000000000000000000]">
          {!shouldHideComponent && <Header />}
          {!shouldHideComponent && <Navigation_bar />}
          {!shouldHideComponent && <SideBar />}
        </div>

        {/* <Login2 /> */}

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login2 />} />

          <Route
            path="/home"
            element={<PrivateRoute element={<HomePage />} />}
          />
          <Route
            path="/ajouter_vehicule"
            element={<PrivateRoute element={<AjouterPage />} />}
          />
          <Route
            path="/modifier_vehicule"
            element={<PrivateRoute element={<ModifierPage />} />}
          />

          <Route
            path="/User_Profile"
            element={<PrivateRoute element={<ProfilUserPage />} />}
          />

       
          <Route
            path="/Groupe_vehicule_location"
            element={<PrivateRoute element={<LocationPage />} />}
          />
          <Route
            path="/voiture_details"
            element={<PrivateRoute element={<DetailsVehiculePage />} />}
          />
          <Route
            path="/voiture_historique"
            element={<PrivateRoute element={<HistoriquePage />} />}
          />

          <Route
            path="/rapport_page_details"
            element={<PrivateRoute element={<RapportPageDetails />} />}
          />

          <Route
            path="/Change_Password"
            element={<ProtectedChangePassword />}
          />

          <Route path="*" element={<Page_404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
