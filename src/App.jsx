import React, { useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { ReloadPrompt } from "./pages/Prompt";
import Login2 from "./components/login/Login2";
import { GoTrash } from "react-icons/go";

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
import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoEarth,
  IoMenu,
} from "react-icons/io5";
import { IoIosAddCircleOutline, IoMdLogIn, IoMdStats } from "react-icons/io";
import { FaCar, FaRegEdit } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { RiPinDistanceLine } from "react-icons/ri";
import { GiPathDistance, GiTrashCan } from "react-icons/gi";
import { TbCameraCheck, TbPointFilled } from "react-icons/tb";
import html2pdf from "html2pdf.js";
import SeConnecter from "./components/documentation/SeConnecter";
import DocAddVehicule from "./components/documentation/DocAddVehicule";
import DocModifierVehicule from "./components/documentation/DocModifierVehicule";
import DocLocationVehicule from "./components/documentation/DocLocationVehicule";
import DocTrajetVehicule from "./components/documentation/DocTrajetVehicule";
import { MdInstallDesktop } from "react-icons/md";
import DocInstallation from "./components/documentation/DocInstallation";
import DocGestionAppareil from "./components/documentation/DocGestionAppareil";
import DocPositionAppareil from "./components/documentation/DocPositionAppareil";
import DocHistorique from "./components/documentation/DocHistorique";
import DocGestionGeozone from "./components/documentation/DocGestionGeozone";
import DocRapportUnite from "./components/documentation/DocRapportUnite";
import DocRapportGroupe from "./components/documentation/DocRapportGroupe";
import GestionDesCompts from "./pages/GestionDesCompts";
import ListeDesUtilisateur from "./pages/ListeDesUtilisateur";
import ListeDesVehiculesGestion from "./pages/ListeDesVehiculesGestion";
import ListeDesGroupes from "./pages/ListeDesGroupes";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import SuccèsÉchecMessagePopup from "./components/Reutilisable/SuccèsÉchecMessagePopup";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

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
    testRef,
    docInstallationRef,
    installation_sur_application_ref,
    installation_sur_chrome_ref,

    ajouter_nouveau_appareil_section_ref,
    modidier_appareil_section_ref,
    supprimer_appareil_section_ref,
    //
    voir_position_appareil_ref,
    position_choisir_autre_appareil_ref,
    position_voir_tous_appareil_ref,
    position_type_de_vue_ref,
    voir_trajet_ref,
    trajet_recentrer_ref,
    trajet_choix_autre_appareil_ref,
    trajet_type_de_vue_ref,
    trajet_recherche_ref,
    trajet_retracer_trajet_ref,
    voir_historique_appareil_ref,
    voir_position_historiquer_sur_carte_ref,
    historique_choix_autre_appareil_ref,
    historique_recherche_ref,
    aller_page_rapport_unite_ref,
    rapport_unite_autre_appareil_ref,
    rapport_unite_recherche_ref,
    rapport_unite_telecherche_pdf_ref,
    voir_rapport_groupe_ref,
    rapport_groupe_recherche_ref,
    rapport_groupe_telecharger_pdf_ref,
    creer_geozone_ref,
    modifier_geozone_ref,
    //
    docGestionAppareilRef,
    docPositionAppareilRef,
    docHistoriqueRef,
    docRapportUniteRef,
    docRapportGroupeRef,
    docGestionGeozoneRef,
    account,
    error,
    setError,
    isDashboardHomePage,
    setIsDashboardHomePage,
  } = useContext(DataContext);

  React.useEffect(() => {
    // Redirige vers /home si l'utilisateur est authentifié et se rend sur "/login"
    if (isAuthenticated && location.pathname === "/login") {
      navigate(isDashboardHomePage ? "/dashboard_admin_page" : "/home"); // Utilisation correcte de navigate
    }
  }, [isAuthenticated, isDashboardHomePage, location.pathname, navigate]);

  // Liste des chemins où le footer ne doit pas apparaître
  const hideComponentRoutes = ["/login"];

  // Vérification si le chemin actuel correspond à l'un des chemins dans hideComponentRoutes
  const shouldHideComponent = hideComponentRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const [readDocumentationSideBar, setReadDocumentationSideBar] =
    useState(true);

  const generatePersonelPDF = () => {
    setTimeout(() => {
      let element;
      let pdfTitre;

      //
      if (documentationPage === "connecter") {
        element = seConnecterRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment se connecter";
      }
      //
      else if (documentationPage === "gestionAppareil") {
        element = docGestionAppareilRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment ajouter, modifier ou supprimer un appareil";
      }
      //
      else if (documentationPage === "positionAppareil") {
        element = docPositionAppareilRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir la position géographique un appareil";
      }
      //
      else if (documentationPage === "trajetAppareil") {
        element = docTrajetVehiculeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir le trajet d'un appareil";
      }
      //
      else if (documentationPage === "historiqueAppareil") {
        element = docHistoriqueRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir l'historique des mises a jour";
      }
      //
      else if (documentationPage === "rapportUnite") {
        element = docRapportUniteRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir la page Rapport unite";
      }
      //
      else if (documentationPage === "rapportGroupe") {
        element = docRapportGroupeRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment voir la page Rapport groupe";
      }
      //
      else if (documentationPage === "gestionGeozone") {
        element = docGestionGeozoneRef.current; // Cible l'élément avec useRef
        pdfTitre = "comment créer ou modifier des geofences";
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

  const scrollToTitle = (titleRef) => {
    // testRef.current?.scrollIntoView({ behavior: "smooth" });

    if (titleRef.current) {
      const offset = 7 * 16; // 5rem en pixels (1rem = 16px par défaut)
      const topPosition =
        titleRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: topPosition - offset,
        behavior: "smooth",
      });
    }
  };

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

        {errors && (
          <div className="space-y-2 fixed flex justify-center w-full left-0 right-0  top-[3rem] z-[9999999999999999999999999999999999999999999999999999999999999999999999999]">
            {errors?.map((err) => (
              <div
                key={err.id}
                className="relative w-full max-w-[30rem] p-4 py-2 bg-red-100 text-red-800 rounded shadow-lg shadow-black/20"
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

        {/* <Login2 /> */}

        {isOffline && window.location.hostname !== "localhost" && (
          <div className="fixed z-[99999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/70">
            <div
              className={` bg-orange-50 max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[90vw] `}
            >
              <div
                className={` bg-orange-600 flex justify-center items-center py-4 px-4  mb-8 `}
              >
                <h2 className="font-bold text-white text-xl">
                  Pas de connexion Internet.
                </h2>
              </div>
              <div>
                <h3
                  className={`text-gray-800 block font-semibold text-lg py-4  text-center leading-6  mb-3 px-4`}
                >
                  Veuillez vérifier votre connexion Internet pour continuer.
                </h3>
              </div>
            </div>
          </div>
        )}
        <SuccèsÉchecMessagePopup />
        {readDocumentation ? (
          <div className="transition-all">
            {/* télécharger */}
            <div className="fixed  overflow-hidden rounded-lg bg-white shadow-lg shadow-black/10 top-[4rem] right-[1rem] z-30">
              <div
                onClick={() => {
                  generatePersonelPDF();
                  setWaitToDownload(true);
                  // generatePersonelPDF();
                }}
                className=" flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
              >
                <p className="hidden md:block">Télécharger en PDF</p>
                <img className="w-[2rem]" src="/img/pdf_download.png" alt="" />
              </div>
            </div>

            <header className="fixed z-[9999] top-0 left-0 right-0 bg-white">
              <div className="flex shadow-lg shadow-black/20 justify-between items-center md:px-10 px-4 py-2">
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
                    <IoMenu className="text-2xl min-w-[1.5rem] text-orange-600" />
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
              {/* Side Bar */}
              <div
                className={`${
                  readDocumentationSideBar
                    ? "translate-x-0"
                    : "-translate-x-[100%]"
                }  transition-all lg:translate-x-0-- bg-white fixed   lg:relative-- left-0 top-[3rem] p-4 z-[5999] shadow-lg shadow-black/20 min-w-[22rem]-- w-[80vw]-- w-[100vw] max-w-[22rem] min-h-[100vh]`}
              >
                <div className="border-b py-2 flex justify-between items-center">
                  <h3 className="font-semibold ml-4 text-xl">
                    Liste des fonctionnalités
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
                    // scrollToTop();
                  }}
                  className="h-[85vh] pb-52 mt-5 font-semibold-- flex flex-col overflow-auto"
                >
                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();
                        setDocumentationPage("installation");
                      }}
                      className={`${
                        documentationPage === "installation"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <MdInstallDesktop className="text-xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Installation</p>

                        <IoChevronDown
                          className={`${
                            documentationPage === "installation"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "installation"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(installation_sur_application_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Installation directement sur l'application</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(installation_sur_chrome_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Installation avec Google Chrome</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      scrollToTop();

                      setDocumentationPage("connecter");
                    }}
                    className={`${
                      documentationPage === "connecter" ? "bg-orange-50" : ""
                    } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                  >
                    <IoMdLogIn className="text-2xl min-w-[1.5rem] text-orange-600" />
                    <p>Se connecter</p>
                  </div>

                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();
                        setDocumentationPage("gestionAppareil");
                      }}
                      className={`${
                        documentationPage === "gestionAppareil"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <IoCarSportOutline className="text-2xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Gestion des appareils</p>

                        <IoChevronDown
                          className={`${
                            documentationPage === "gestionAppareil"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "gestionAppareil"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(ajouter_nouveau_appareil_section_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Ajouter un nouvel appareil</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(modidier_appareil_section_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Modifier un appareil</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(supprimer_appareil_section_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Supprimer un appareil</p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}

                  {/*  */}

                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();
                        setDocumentationPage("positionAppareil");
                      }}
                      className={`${
                        documentationPage === "positionAppareil"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Position d'un véhicule</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "positionAppareil"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "positionAppareil"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(voir_position_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Voir la position d'un véhicule </p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(position_choisir_autre_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Choisir un autre appareil</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(position_voir_tous_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Voir tous les autres appareils</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(position_type_de_vue_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Modifier la vue de la carte</p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}
                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();
                        setDocumentationPage("trajetAppareil");
                      }}
                      className={`${
                        documentationPage === "trajetAppareil"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <GiPathDistance className="text-xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Trajet d'un véhicule</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "trajetAppareil"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "trajetAppareil"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(voir_trajet_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Voir le trajet d'un véhicule</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(trajet_recentrer_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Recentrer la carte</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(trajet_choix_autre_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Choisir un autre appareil</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(trajet_type_de_vue_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Modifier la vue de la carte</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(trajet_recherche_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Recherche par intervalle de dates</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(trajet_retracer_trajet_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Retracer le trajet du véhicule</p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}

                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();

                        setDocumentationPage("historiqueAppareil");
                      }}
                      className={`${
                        documentationPage === "historiqueAppareil"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <IoMdStats className="text-xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Historique d'un appareil</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "historiqueAppareil"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "historiqueAppareil"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(voir_historique_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p> Voir l'historique de l'appareil</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(
                              voir_position_historiquer_sur_carte_ref
                            );
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Voir une position historique sur la carte</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(historique_choix_autre_appareil_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Choisir un autre appareil</p>
                      </div>

                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(historique_recherche_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Recherche par intervalle de dates </p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}

                  {/* <h3 className="font-bold text-gray-600 px-4 py-3 mt-5">
                    Rapport des appareils
                  </h3> */}
                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();

                        setDocumentationPage("rapportUnite");
                      }}
                      className={`${
                        documentationPage === "rapportUnite"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      {/* <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" /> */}
                      <p className="translate-x-1 text-xl font-bold min-w-[1.5rem] text-orange-600">
                        U
                      </p>
                      <div className="flex w-full justify-between">
                        <p>Rapport par unité</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "rapportUnite"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "rapportUnite"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(aller_page_rapport_unite_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p> Accéder à la page du rapport d’unité</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(aller_page_rapport_unite_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Choisir un autre appareil</p>
                      </div>

                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(rapport_unite_recherche_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Recherche par intervalle de dates</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(rapport_unite_telecherche_pdf_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Télécharger le rapport en PDF</p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}
                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();

                        setDocumentationPage("rapportGroupe");
                      }}
                      className={`${
                        documentationPage === "rapportGroupe"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <p className="translate-x-1 text-xl font-bold min-w-[1.5rem] text-orange-600">
                        G
                      </p>
                      {/* <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" /> */}
                      <div className="flex w-full justify-between">
                        <p>Rapport en groupe</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "rapportGroupe"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "rapportGroupe"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(voir_rapport_groupe_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p> Accéder à la page du rapport de groupe</p>
                      </div>

                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(rapport_groupe_recherche_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Effectuer une recherche</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(rapport_groupe_telecharger_pdf_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Télécharger le rapport en PDF / Excel</p>
                      </div>
                    </div>
                  </div>
                  {/* Fin */}

                  {/* <h3 className="font-bold text-gray-600 px-4 py-3 mt-5">
                    Gestion des Geozones
                  </h3> */}
                  {/* Debut */}
                  <div className="ajouter-appareil-container transition-all hover:border  hover:rounded-lg">
                    <div
                      onClick={() => {
                        scrollToTop();

                        setDocumentationPage("gestionGeozone");
                      }}
                      className={`${
                        documentationPage === "gestionGeozone"
                          ? "bg-orange-50"
                          : ""
                      } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
                    >
                      <IoEarth className="text-xl min-w-[1.5rem] text-orange-600" />
                      <div className="flex w-full justify-between">
                        <p>Gestion des géozones</p>
                        <IoChevronDown
                          className={`${
                            documentationPage === "gestionGeozone"
                              ? "rotate-180"
                              : "rotate-0"
                          } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        documentationPage === "gestionGeozone"
                          ? "max-h-[14rem] pb-6"
                          : ""
                      } ajouter-appareil-other overflow-hidden `}
                    >
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(creer_geozone_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p> Créer une géozone</p>
                      </div>
                      <div
                        onClick={() => {
                          setTimeout(() => {
                            scrollToTitle(modifier_geozone_ref);
                          }, 100);
                        }}
                        className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                      >
                        <TbPointFilled className="mt-1" />
                        <p>Modifier une géozone</p>
                      </div>

                      {/* <div className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--">
                        <TbPointFilled className="mt-1" />
                        <p>Recherche par intervale de date </p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Side Bar 2 */}
              <div
                className={`${
                  readDocumentationSideBar
                    ? "translate-x-0"
                    : "-translate-x-[100%]"
                } ${
                  !readDocumentationSideBar ? "hidden" : "lg:flex"
                } transition-all lg:translate-x-0-- bg-white hidden --  lg:relative left-0 top-[5rem] p-4 z-[0]  min-w-[21rem] max-w-[25rem] min-h-[100vh]`}
              ></div>

              {waitToDownload && (
                <div className="fixed z-[99999999999999] flex justify-center items-center inset-0 bg-black/50">
                  <div
                    className={` bg-orange-50 max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[90vw] `}
                  >
                    <div
                      className={` bg-orange-600 flex justify-center items-center py-4 px-4  mb-8 `}
                    >
                      <h2 className="font-bold text-white text-xl">
                        Téléchargement en cours...
                      </h2>
                    </div>
                    <div>
                      <h3
                        className={`text-gray-800 block font-semibold text-lg  text-center leading-6  mb-3 px-4`}
                      >
                        Cela peut prendre jusqu'a{" "}
                        <span className="font-bold">1 minute.</span>
                      </h3>
                    </div>
                    <div className="flex justify-center gap-2 mt-12">
                      <div
                        onClick={() => {
                          setWaitToDownload(false);
                        }}
                        className={` bg-orange-600 cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
                      >
                        Ok
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full pb-32 mx-auto">
                {/* content */}
                {documentationPage === "installation" && <DocInstallation />}
                {documentationPage === "connecter" && <SeConnecter />}
                {documentationPage === "gestionAppareil" && (
                  <DocGestionAppareil />
                )}
                {documentationPage === "positionAppareil" && (
                  <DocPositionAppareil />
                )}
                {documentationPage === "trajetAppareil" && (
                  <DocTrajetVehicule />
                )}
                {documentationPage === "historiqueAppareil" && (
                  <DocHistorique />
                )}
                {documentationPage === "gestionGeozone" && (
                  <DocGestionGeozone />
                )}

                {documentationPage === "rapportUnite" && <DocRapportUnite />}

                {documentationPage === "rapportGroupe" && <DocRapportGroupe />}

                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {documentationPage === "ajouter_véhicule" && <DocAddVehicule />}
                {documentationPage === "modifier_véhicule" && (
                  <DocModifierVehicule />
                )}

                {documentationPage === "localisation_véhicule" && (
                  <DocLocationVehicule />
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
                  <Navigate
                    // to={isDashboardHomePage ? "/home" : "/home"}
                    to={isDashboardHomePage ? "/dashboard_admin_page" : "/home"}
                  />
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
              path="/dashboard_admin_page"
              element={<PrivateRoute element={<DashboardAdminPage />} />}
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
            {/*  */}
            <Route
              path="/gestion_des_comptes"
              element={<PrivateRoute element={<GestionDesCompts />} />}
            />
            <Route
              path="/liste_des_utilisateurs"
              element={<PrivateRoute element={<ListeDesUtilisateur />} />}
            />
            <Route
              path="/liste_des_vehicules"
              element={<PrivateRoute element={<ListeDesVehiculesGestion />} />}
            />
            <Route
              path="/liste_des_groupes"
              element={<PrivateRoute element={<ListeDesGroupes />} />}
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
