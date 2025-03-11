import React, { useContext, useRef, useState } from "react";
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
  Link,
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
import GestionGeofences from "./pages/GestionGeofences";
import { IoClose, IoMenu } from "react-icons/io5";
import { IoIosAddCircleOutline, IoMdLogIn } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { RiPinDistanceLine } from "react-icons/ri";
import { GiPathDistance } from "react-icons/gi";
import { TbPointFilled } from "react-icons/tb";
import html2pdf from "html2pdf.js";
import SeConnecter from "./components/documentation/SeConnecter";
import DocAddVehicule from "./components/documentation/DocAddVehicule";
import DocModifierVehicule from "./components/documentation/DocModifierVehicule";
import DocLocationVehicule from "./components/documentation/DocLocationVehicule";
import DocTrajetVehicule from "./components/documentation/DocTrajetVehicule";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Utilisation de useNavigate

  const {
    isAuthenticated,
    readDocumentation,
    setReadDocumentation,
    seConnecterRef,
    docAddVehiculeRef,
    documentationPage,
    setDocumentationPage,
    docModifierVehiculeRef,
    docLocalisationVehiculeRef,
    scrollToTop,
    docTrajetVehiculeRef,
  } = useContext(DataContext);

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

  const [readDocumentationSideBar, setReadDocumentationSideBar] =
    useState(false);

  const generatePersonelPDF = () => {
    setTimeout(() => {
      let element;
      let pdfTitre;
      if (documentationPage === "connecter") {
        element = seConnecterRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment se connecter";
      } else if (documentationPage === "ajouter_véhicule") {
        element = docAddVehiculeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment ajouter un nouveau appareil";
      } else if (documentationPage === "modifier_véhicule") {
        element = docModifierVehiculeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment modifier ou supprimer un appareil";
      } else if (documentationPage === "localisation_véhicule") {
        element = docLocalisationVehiculeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir la position d'un appareil";
      } else if (documentationPage === "trajet_véhicule") {
        element = docTrajetVehiculeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir le trajet d'un appareil";
      }

      html2pdf().from(element).save(`${pdfTitre}.pdf`);
    }, 1000); // Délai d'attente de 2 secondes
  };

  const closeSideBar = (value) => {
    if (window.innerWidth < 1024) {
      // lg = 1024px en Tailwind
      setReadDocumentationSideBar(value);
    }
  };

  return (
    <div className="dark:bg-gray-700 min-h-screen">
      <div className="dark:bg-slate-800/70 dark:border dark:border-slate-800">
        {/* Popup qui Permet a l'utilisateur de reload la page quand il y a mise a jour */}
        <div className="z-50 ">{/* <ReloadPrompt /> */}</div>

        {/* Composant pour faire défiler vers le haut */}
        <ScrollToTop />

        {/* Ces composant vont pouvoir apparaitre dans tous les page, sauf dans /login */}
        {!readDocumentation && (
          <div className="absolute z-[100000000000000000000000000]">
            {!shouldHideComponent && <Header />}
            {!shouldHideComponent && <Navigation_bar />}
            {!shouldHideComponent && <SideBar />}
          </div>
        )}

        {/* <Login2 /> */}

        {readDocumentation ? (
          <div className="transition-all">
            {/* télécharger */}
            <div className="fixed top-[4rem] right-[1rem] z-30">
              <div
                onClick={() => {
                  generatePersonelPDF();
                  // generatePersonelPDF();
                  // setPdfDownloadPupup(false);
                }}
                className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
              >
                <p className="hidden md:block">Télécharger en PDF</p>
                <img className="w-[2rem]" src="/img/pdf_download.png" alt="" />
              </div>
            </div>

            <header className="fixed z-[2] top-0 left-0 right-0 bg-white">
              <div className="flex shadow-lg shadow-black/20 justify-between items-center px-4 py-2">
                <Link
                  to="/home?tab=acceuil"
                  className="flex items-center gap-3"
                  onClick={() => {
                    setReadDocumentation(false);
                  }}
                >
                  <img src="/img/cars/logo.png" className="w-10" alt="Logo" />
                  <h2 className="text-md sm:text-2xl font-bold opacity-70">
                    Octagono-<span className="text-orange-600">PLus</span>
                  </h2>
                </Link>
                <div className="flex gap-4 items-center">
                  <div
                    onClick={() => {
                      setReadDocumentationSideBar(!readDocumentationSideBar);
                    }}
                    className="flex lg:hidden-- cursor-pointer text-gray-700 items-center gap-3 text-xl"
                  >
                    <IoMenu className="text-2xl text-orange-600" />
                    <p className="text-[1rem] font-semibold md:text-[1.1rem]">
                      Menu
                    </p>
                  </div>
                  <IoClose
                    onClick={() => {
                      setReadDocumentation(false);
                    }}
                    className="text-3xl cursor-pointer text-red-600"
                  />
                </div>
              </div>
            </header>

            <div className="flex gap-5">
              <sidebar
                className={`${
                  readDocumentationSideBar
                    ? "translate-x-0"
                    : "-translate-x-[100%]"
                }  transition-all lg:translate-x-0-- bg-white fixed   lg:relative-- left-0 top-[5rem] p-4 z-[1] shadow-lg shadow-black/20 min-w-[22rem] max-w-[25rem] min-h-[100vh]`}
              >
                <div className="border-b py-2 flex justify-between items-center">
                  <h3 className="font-semibold ml-4 text-xl">
                    Manuel d'utilisation
                  </h3>
                  <IoClose
                    onClick={() => {
                      setReadDocumentationSideBar(false);
                    }}
                    className="text-3xl lg:hidden-- text-red-600 cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => {
                    closeSideBar(!readDocumentationSideBar);
                    scrollToTop();
                  }}
                  className="h-[70vh] mt-5 font-semibold-- flex flex-col overflow-auto"
                >
                  <div
                    onClick={() => {
                      setDocumentationPage("connecter");
                    }}
                    className={`${
                      documentationPage === "connecter" ? "bg-orange-50" : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <IoMdLogIn className="text-2xl text-orange-600" />
                    <p>Se connecter</p>
                  </div>
                  <div
                    onClick={() => {
                      setDocumentationPage("ajouter_véhicule");
                    }}
                    className={`${
                      documentationPage === "ajouter_véhicule"
                        ? "bg-orange-50"
                        : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <IoIosAddCircleOutline className="text-2xl text-orange-600" />
                    <p>Ajouter un véhicule</p>
                  </div>

                  <div
                    onClick={() => {
                      setDocumentationPage("modifier_véhicule");
                    }}
                    className={`${
                      documentationPage === "modifier_véhicule"
                        ? "bg-orange-50"
                        : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <FaRegEdit className="text-xl text-orange-600" />
                    <p>Modifier ou Supprimer un appareil</p>
                  </div>
                  {/* <div className="flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3">
                    <FaRegEdit className="text-xl text-orange-600" />
                    <p>Modifier ou Supprimer un appareil</p>
                  </div> */}

                  <div
                    onClick={() => {
                      setDocumentationPage("localisation_véhicule");
                    }}
                    className={`${
                      documentationPage === "localisation_véhicule"
                        ? "bg-orange-50"
                        : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <LuMapPin className="text-xl text-orange-600" />
                    <p>Voir la position d'un véhicule</p>
                  </div>

                  {/* <div className="flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3">
                    <LuMapPin className="text-2xl text-orange-600" />
                    <p>Voir la position d'un véhicule</p>
                  </div> */}
                  <div
                    onClick={() => {
                      setDocumentationPage("trajet_véhicule");
                    }}
                    className={`${
                      documentationPage === "trajet_véhicule"
                        ? "bg-orange-50"
                        : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <GiPathDistance className="text-xl text-orange-600" />
                    <p>Voir le trajet d'un véhicule</p>
                  </div>

                  {/* <div className="flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3">
                    <RiPinDistanceLine className="text-2xl text-orange-600" />
                    <p>Voir le trajet d'un véhicule</p>
                  </div> */}

                  {/* <div className="flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3">
                    <GiPathDistance className="text-2xl text-orange-600" />
                    <p>Retracer le trajet d'un véhicule</p>
                  </div> */}
                </div>
              </sidebar>

              <sidebar
                className={`${
                  readDocumentationSideBar
                    ? "translate-x-0"
                    : "-translate-x-[100%]"
                } ${
                  !readDocumentationSideBar ? "hidden" : "lg:flex"
                } transition-all lg:translate-x-0-- bg-white hidden --  lg:relative left-0 top-[5rem] p-4 z-[0]  min-w-[21rem] max-w-[25rem] min-h-[100vh]`}
              ></sidebar>
              <div className="w-full mx-auto">
                {/* content */}
                {documentationPage === "connecter" && <SeConnecter />}
                {documentationPage === "ajouter_véhicule" && <DocAddVehicule />}
                {documentationPage === "modifier_véhicule" && (
                  <DocModifierVehicule />
                )}

                {documentationPage === "localisation_véhicule" && (
                  <DocLocationVehicule />
                )}

                {documentationPage === "trajet_véhicule" && (
                  <DocTrajetVehicule />
                )}
              </div>
            </div>
          </div>
        ) : (
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
              path="/gestion_geofences"
              element={<PrivateRoute element={<GestionGeofences />} />}
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
        )}
      </div>
    </div>
  );
}

export default App;
