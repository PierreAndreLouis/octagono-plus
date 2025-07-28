import React, {
  useContext,
  Suspense,
  useEffect,
  useState,
  useMemo,
} from "react";
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
import SuccèsÉchecMessagePopup from "./components/Reutilisable/SuccèsÉchecMessagePopup";
import GoogleTranslate from "./components/home/GoogleTranslate";

/////////////////////////////////////////////////////////

import { IoLogInOutline } from "react-icons/io5";

import { useTranslation } from "react-i18next";

const DashboardContaintMaintComponant = React.lazy(() =>
  import("./components/dashboard_containt/DashboardContaintMaintComponant")
);

const GestionDesCompts = React.lazy(() => import("./pages/GestionDesCompts"));
const ListeDesUtilisateur = React.lazy(() =>
  import("./pages/ListeDesUtilisateur")
);
const ListeDesVehiculesGestion = React.lazy(() =>
  import("./pages/ListeDesVehiculesGestion")
);
const ListeDesGroupes = React.lazy(() => import("./pages/ListeDesGroupes"));
const CreateNewAccountPage = React.lazy(() =>
  import("./components/gestion_des_comptes/CreateNewAccountPage")
);
const ModifyAccountPage = React.lazy(() =>
  import("./components/gestion_des_comptes/ModifyAccountPage")
);
const CreateNewUserGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/CreateNewUserGestion")
);
const ModifyUserGroupeGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/ModifyUserGroupeGestion")
);
const CreateNewGroupeGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/CreateNewGroupeGestion")
);
const ModifyGroupeGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/ModifyGroupeGestion")
);
const CreateNewDeviceGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/CreateNewDeviceGestion")
);
const ModifyDeviceGestion = React.lazy(() =>
  import("./components/gestion_des_comptes/ModifyDeviceGestion")
);

const LocationPage = React.lazy(() => import("./pages/LocationPage"));
const GestionGeofences = React.lazy(() => import("./pages/GestionGeofences"));
const ListeDesAlertsGestion = React.lazy(() =>
  import("./pages/ListeDesAlertsGestion")
);
const InfoUserComponent = React.lazy(() =>
  import("./components/profile/InfoUserComponent")
);
const GestionDesRoles = React.lazy(() => import("./pages/GestionDesRoles"));
const CreateNewRole = React.lazy(() =>
  import("./components/gestion_des_comptes/CreateNewRole")
);

const DetailsVehiculePage = React.lazy(() =>
  import("./pages/DetailsVehiculePage")
);
const HistoriquePage = React.lazy(() => import("./pages/HistoriquePage"));
const RapportPageDetails = React.lazy(() =>
  import("./pages/RapportPageDetails")
);

const DocInstallation = React.lazy(() =>
  import("./components/documentation/DocInstallation")
);
const SeConnecter = React.lazy(() =>
  import("./components/documentation/SeConnecter")
);
const DocGestionAppareil = React.lazy(() =>
  import("./components/documentation/DocGestionAppareil")
);
const DocPositionAppareil = React.lazy(() =>
  import("./components/documentation/DocPositionAppareil")
);
const DocTrajetVehicule = React.lazy(() =>
  import("./components/documentation/DocTrajetVehicule")
);
const DocHistorique = React.lazy(() =>
  import("./components/documentation/DocHistorique")
);
const DocGestionGeozone = React.lazy(() =>
  import("./components/documentation/DocGestionGeozone")
);
const DocRapportUnite = React.lazy(() =>
  import("./components/documentation/DocRapportUnite")
);
const DocRapportGroupe = React.lazy(() =>
  import("./components/documentation/DocRapportGroupe")
);
const DocAddVehicule = React.lazy(() =>
  import("./components/documentation/DocAddVehicule")
);
const DocModifierVehicule = React.lazy(() =>
  import("./components/documentation/DocModifierVehicule")
);
const DocLocationVehicule = React.lazy(() =>
  import("./components/documentation/DocLocationVehicule")
);

import ChooseOtherAccountDashboard from "./components/dashboard_containt/ChooseOtherAccountDashboard";
import Logout from "./components/login/Logout";
import ChooseOtherGroupeDashboard from "./components/dashboard_containt/ChooseOtherGroupeDashboard";
import HeaderDashboardSysadmin from "./components/dashboard_containt/HeaderDashboardSysadmin";
import SideBarSysadmin from "./components/dashboard_containt/SideBarSysadmin";
import AjouterGeofence from "./components/location_vehicule/AjouterGeofence";

function App() {
  const {
    scrollToTop,
    accountDevices,
    currentAccountSelected,
    setListeGestionDesGroupeTitre,
    gestionAccountData,
    dashboardLoadingEffect,
    dashboardLoadingEffectLogin,
    setListeGestionDesGeofences,
    adminAccount,
    setChooseOtherLanguagePopup,
    setAjouterGeofencePopup,
    isDashboardHomePage,
    mergedDataHome,
    documentationPage,
    setDocumentationPage,
    setDonneeFusionnéForRapport,
    resetInteraction,
    isUserNotInteractingNow,
    isAuthenticated = false,
    adminPassword,
    password,
    versionApplication,
    account,
    username,
    adminUsername,
    readDocumentation,
    seConnecterRef,
    docGestionAppareilRef,
    docPositionAppareilRef,
    docHistoriqueRef,
    docRapportUniteRef,
    docRapportGroupeRef,
    docGestionGeozoneRef,
    clearCacheFonction,
    allDevices,
    setAllDevices,
  } = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate(); // Utilisation de useNavigate

  const { error, setError } = useContext(DataContext);

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

  //////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setDonneeFusionnéForRapport([]);
  }, [currentAccountSelected, isDashboardHomePage]);

  // Données des véhicules avec heures différentes

  const [t, i18n] = useTranslation();

  // const [allDevices, setAllDevices] = useState([]);
  // const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  // const data = isDashboardHomePage
  //   ? currentAccountSelected?.accountDevices || accountDevices
  //   : dataFusionné;

  // useEffect(() => {

  //   setAllDevices(data);
  // }, [
  //   accountDevices,
  //   currentAccountSelected,
  //   isDashboardHomePage,
  //   mergedDataHome,
  // ]);

  // useEffect(() => {
  //   setAllDevices(data);
  // }, []);

  /////////////////////////////////////

  const allVehicule = 100;
  const activeVehicule = 50;
  const inactivVehicule = 30;
  const parkingVehicule = 20;

  // Pourcentage
  const activePct = (activeVehicule / allVehicule) * 100;
  const inactivPct = (inactivVehicule / allVehicule) * 100;
  const parkingPct = (parkingVehicule / allVehicule) * 100;

  // Fonction pour construire les styles dynamiques
  const buildCircle = (radius, strokeWidth, percent, color, trackColor) => {
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset,
      stroke: color,
      strokeWidth,
      r: normalizedRadius,
      cx: 100,
      cy: 100,
      fill: "transparent",
      strokeLinecap: "round",
      transform: "rotate(0deg)", // rotation vers le haut
      transformOrigin: "center",
      trackColor,
    };
  };

  const layers = [
    buildCircle(90, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"), // green
    buildCircle(
      70,
      14,
      inactivPct,
      "rgba(147,51,234,1)",
      "rgba(147,51,234,0.1)"
    ), // purple
    buildCircle(
      50,
      14,
      parkingPct,
      "rgba(251,146,60,1)",
      "rgba(251,146,60,0.1)"
    ), // orange
  ];

  ///////////////////////////////////////////////////

  const [readDocumentationSideBar, setReadDocumentationSideBar] =
    useState(false);

  useEffect(() => {
    scrollToTop();
  }, [documentationPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1025) {
        setReadDocumentationSideBar(true);
      } else {
        setReadDocumentationSideBar(false);
      }
    };

    handleResize(); // exécute une fois au chargement

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSideBar = () => {
    if (window.innerWidth > 1025) {
      setReadDocumentationSideBar(true);
    } else {
      setReadDocumentationSideBar(false);
    }
  };

  const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
    useState(false);
  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? gestionAccountData?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : gestionAccountData;

  const noFilterGestionGroupData = currentAccountSelected
    ? currentAccountSelected?.accountGroupes
    : Array.from(
        new Map(
          gestionAccountData
            ?.flatMap((account) => account.accountGroupes)
            ?.map((group) => [group.groupID, group])
        ).values()
      );

  const filterGestionGroupData = searchInputTerm
    ? noFilterGestionGroupData?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : noFilterGestionGroupData;

  const [logOutPopup, setLogOutPopup] = useState(false);

  /////////////////////////////////////////////////////////////////////////////

  // Met à jour l'historique dans localStorage à chaque changement de page
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("customHistory")) || [];

    // Évite les doublons consécutifs dans l'historique
    if (storedHistory[storedHistory.length - 1] !== documentationPage) {
      storedHistory.push(documentationPage);
      localStorage.setItem("customHistory", JSON.stringify(storedHistory));
    }
  }, [documentationPage]);

  // Fonction pour revenir à la page précédente
  const backToPagePrecedent = () => {
    const storedHistory =
      JSON.parse(localStorage.getItem("customHistory")) || [];

    if (storedHistory.length > 1) {
      storedHistory.pop(); // Enlève la page actuelle
      const previousPage = storedHistory[storedHistory.length - 1];
      localStorage.setItem("customHistory", JSON.stringify(storedHistory));
      setDocumentationPage(previousPage);
      navigate(`/${previousPage}`);
    } else {
      // Pas d'historique, on revient au fallback "Dashboard"
      setDocumentationPage("Dashboard");
      navigate("/Dashboard");
      localStorage.setItem("customHistory", JSON.stringify(["Dashboard"]));
    }
  };

  const [chosseOtherGroupeDashboard, setChosseOtherGroupeDashboard] =
    useState(false);

  const isDashBoardComptnent = true;

  const [chooseOneAccountToContinue, setChooseOneAccountToContinue] =
    useState(false);

  const [chooseAccountFromGeozoneSection, setChooseAccountFromGeozoneSection] =
    useState(false);

  const [accountIdFromRole, setAccountIdFromRole] = useState("");

  // Liste des chemins où le footer ne doit pas apparaître

  //
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reactiverSessionUser = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (
      (adminPassword && inputPassword === adminPassword) ||
      (password && inputPassword === password)
    ) {
      clearCacheFonction();
      const storedAccount = account || localStorage.getItem("account");
      const storedUserName = username || localStorage.getItem("username");
      const storedPassword = password || localStorage.getItem("password");

      const storedAccountADM =
        adminAccount || localStorage.getItem("adminAccount");
      const storedUserNameADM =
        adminUsername || localStorage.getItem("adminUsername");
      const storedPasswordADM =
        adminPassword || localStorage.getItem("adminPassword");

      let accountID;
      let userID;
      let passwordID;

      if (isDashboardHomePage) {
        accountID = storedAccountADM;
        userID = storedUserNameADM;
        passwordID = storedPasswordADM;
      } else {
        accountID = storedAccount;
        userID = storedUserName;
        passwordID = storedPassword;
      }

      resetInteraction(accountID, userID, passwordID);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  //
  //
  //
  //
  //

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
  //
  //

  const LoadingLazyAnimation = () => {
    if (dashboardLoadingEffect) return null;

    return (
      <div className="w-full h-full min-h-[70vh] flex justify-center items-center bg-white rounded-lg">
        <div className="border-blue-500 h-10 w-10 animate-spin rounded-full border-4 border-t-gray-100/0" />
      </div>
    );
  };
  //
  //
  //

  const SideBarSpaceLeft = () => {
    return (
      <div
        className={`${
          readDocumentationSideBar ? "translate-x-0" : "-translate-x-[100%]"
        } ${
          !readDocumentationSideBar ? "hidden" : "lg:flex"
        } transition-all lg:translate-x-0--  --  lg:relative left-0 top-[5rem] lg:p-4 z-[0] min-w-0   lg:min-w-[21rem]   min-h-[100vh]`}
      ></div>
    );
  };

  const [showChooseUserToModifyMessage, setShowChooseUserToModifyMessage] =
    useState(false);
  const [showChooseGroupeToModifyMessage, setShowChooseGroupeToModifyMessage] =
    useState(false);
  const [
    showChooseAppareilToModifyMessage,
    setShowChooseAppareilToModifyMessage,
  ] = useState(false);
  const [
    showChooseGeofencesToModifyMessage,
    setShowChooseGeofencesToModifyMessage,
  ] = useState(false);

  const [showChooseCompteToModifyMessage, setShowChooseCompteToModifyMessage] =
    useState(false);

  const [showChooseItemToModifyMessage, setshowChooseItemToModifyMessage] =
    useState("");
  const [showChooseItemToModifyPage, setshowChooseItemToModifyPage] =
    useState("");

  useEffect(() => {
    if (showChooseItemToModifyMessage) {
      const timer = setTimeout(() => {
        setshowChooseItemToModifyMessage("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showChooseItemToModifyMessage]);

  return (
    <div className="dark:bg-gray-700 md:p-4 bg-gray-100">
      <div className="dark:bg-slate-800/70 dark:border dark:border-slate-800">
        <ScrollToTop />
        <GoogleTranslate />
        {/* {!readDocumentation && ( */}
        {/* <div className="absolute z-[8]">
          {!shouldHideComponent && (
            <Navigation_bar
              documentationPage={documentationPage}
              setDocumentationPage={setDocumentationPage}
            />
          )}
        </div> */}
        {/* )} */}
        <ChooseOtherAccountDashboard
          chooseOtherAccountGestion={chooseOtherAccountGestion}
          setChooseOtherAccountGestion={setChooseOtherAccountGestion}
          searchInputTerm={searchInputTerm}
          setSearchInputTerm={setSearchInputTerm}
          filterGestionAccountData={filterGestionAccountData}
          setAllDevices={setAllDevices}
          chooseOneAccountToContinue={chooseOneAccountToContinue}
          setChooseOneAccountToContinue={setChooseOneAccountToContinue}
          documentationPage={documentationPage}
          chooseAccountFromGeozoneSection={chooseAccountFromGeozoneSection}
          setAccountIdFromRole={setAccountIdFromRole}
        />
        <ChooseOtherGroupeDashboard
          chooseOtherAccountGestion={chosseOtherGroupeDashboard}
          setChooseOtherAccountGestion={setChosseOtherGroupeDashboard}
          searchInputTerm={searchInputTerm}
          setSearchInputTerm={setSearchInputTerm}
          filterGestionGroupData={filterGestionGroupData}
          setAllDevices={setAllDevices}
        />
        {logOutPopup && <Logout setLogOutPopup={setLogOutPopup} />} {/*  */}
        {isAuthenticated && (
          <HeaderDashboardSysadmin
            readDocumentationSideBar={readDocumentationSideBar}
            setDocumentationPage={setDocumentationPage}
            setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            setChooseOneAccountToContinue={setChooseOneAccountToContinue}
            setChooseAccountFromGeozoneSection={
              setChooseAccountFromGeozoneSection
            }
            setReadDocumentationSideBar={setReadDocumentationSideBar}
          />
        )}
        {isAuthenticated && (
          <SideBarSysadmin
            readDocumentationSideBar={readDocumentationSideBar}
            setReadDocumentationSideBar={setReadDocumentationSideBar}
            documentationPage={documentationPage}
            backToPagePrecedent={backToPagePrecedent}
            setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            setChooseOneAccountToContinue={setChooseOneAccountToContinue}
            setChooseAccountFromGeozoneSection={
              setChooseAccountFromGeozoneSection
            }
            closeSideBar={closeSideBar}
            setDocumentationPage={setDocumentationPage}
            setListeGestionDesGroupeTitre={setListeGestionDesGroupeTitre}
            setListeGestionDesGeofences={setListeGestionDesGeofences}
            setChooseOtherLanguagePopup={setChooseOtherLanguagePopup}
            setAjouterGeofencePopup={setAjouterGeofencePopup}
            setLogOutPopup={setLogOutPopup}
            generatePersonelPDF={generatePersonelPDF}
            //

            //
            showChooseItemToModifyMessage={showChooseItemToModifyMessage}
            setshowChooseItemToModifyMessage={setshowChooseItemToModifyMessage}
            showChooseItemToModifyPage={showChooseItemToModifyPage}
            setshowChooseItemToModifyPage={setshowChooseItemToModifyPage}
          />
        )}
        {/* Side Bar 2 */}
        {(dashboardLoadingEffect || dashboardLoadingEffectLogin) &&
          isAuthenticated && (
            <div className="fixed flex  shadow-lg-- shadow-black/10 max- w-[5rem]  rounded-full max- h-[5rem] left-[50%] -translate-x-[50%] top-[40%]  z-30 inset-0 bg-white/0 -200/50">
              <div
                className={`${
                  readDocumentationSideBar
                    ? "translate-x-0"
                    : "-translate-x-[100%]"
                } ${
                  !readDocumentationSideBar ? "hidden" : "lg:flex"
                } transition-all lg:translate-x-0-- bg-white/0 hidden min-w-[11.7rem]  lg:relative left-0 top-[5rem] z-[0]`}
              ></div>
              <div className="w-full h-full flex justify-center items-center">
                <div className="border-blue-500 h-10 w-10 animate-spin rounded-full border-4 border-t-gray-100/0" />
              </div>
            </div>
          )}
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
        {readDocumentation && (
          <div className="fixed overflow-hidden rounded-lg bg-white shadow-lg shadow-black/10 top-[5rem] right-[1rem] z-30">
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
        )}
        {/* container */}
        {isUserNotInteractingNow && isAuthenticated && (
          <div className="fixed inset-0 z-[9999999] backdrop-blur-sm bg-black/50 backdrop-blur-sm-- flex justify-center  items-center">
            <form
              onSubmit={reactiverSessionUser}
              className="w-[95vw] mx-auto md:max-w-md bg-white rounded-2xl py-8 px-2 md:p-8 shadow-2xl border border-gray-200"
            >
              <h2
                onClick={() => {
                  // clearCacheFonction();
                }}
                className="text-2xl font-bold text-gray-800 mb-3 text-center"
              >
                {t("Session inactive")}
              </h2>
              <p className="text-gray-600 text-sm mb-6 text-center">
                {t(
                  "Inactivité de 30 minutes détectée. Veuillez confirmer votre mot de passe pour continuer"
                )}
                .
              </p>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 mb-3 text-center">
                  {errorMessage}
                </p>
              )}
              <input
                id="password"
                name="password"
                type="password"
                placeholder={`${t("Confirmer ton Mot de passe")}`}
                required
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              />
              <div className="flex justify-center w-full items-center gap-2">
                <button
                  type="submit"
                  // onClick={() => {
                  //   resetInteraction();
                  // }}
                  className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg w-full hover:bg-orange-700 transition-all duration-150"
                >
                  {t("Confirmer")}
                </button>
                <div
                  onClick={() => {
                    setLogOutPopup(true);
                  }}
                  className="flex h-full py-[.2rem] cursor-pointer px-2 justify-center items-center text-2xl rounded-lg border-2 text-orange-600 border-orange-600"
                >
                  <IoLogInOutline />
                </div>
              </div>
            </form>
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
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <DashboardContaintMaintComponant
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          setDocumentationPage={setDocumentationPage}
                          setChosseOtherGroupeDashboard={
                            setChosseOtherGroupeDashboard
                          }
                          allDevices={allDevices}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <DashboardContaintMaintComponant
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          setDocumentationPage={setDocumentationPage}
                          setChosseOtherGroupeDashboard={
                            setChosseOtherGroupeDashboard
                          }
                          allDevices={allDevices}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Dashboard"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <DashboardContaintMaintComponant
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          setDocumentationPage={setDocumentationPage}
                          setChosseOtherGroupeDashboard={
                            setChosseOtherGroupeDashboard
                          }
                          allDevices={allDevices}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_des_comptes"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <GestionDesCompts
                          setDocumentationPage={setDocumentationPage}
                          showChooseItemToModifyMessage={
                            showChooseItemToModifyMessage
                          }
                          setshowChooseItemToModifyMessage={
                            setshowChooseItemToModifyMessage
                          }
                          showChooseItemToModifyPage={
                            showChooseItemToModifyPage
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />
          <Route
            path="/Ajouter_nouveau_compte"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <CreateNewAccountPage
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Modifier_compte"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ModifyAccountPage
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_des_utilisateurs"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ListeDesUtilisateur
                          setDocumentationPage={setDocumentationPage}
                          showChooseItemToModifyMessage={
                            showChooseItemToModifyMessage
                          }
                          setshowChooseItemToModifyMessage={
                            setshowChooseItemToModifyMessage
                          }
                          showChooseItemToModifyPage={
                            showChooseItemToModifyPage
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Ajouter_nouveau_utilisateur"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <CreateNewUserGestion
                          documentationPage={documentationPage}
                          setDocumentationPage={setDocumentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Modifier_utilisateur"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ModifyUserGroupeGestion
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_des_appareils"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ListeDesVehiculesGestion
                          setDocumentationPage={setDocumentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          showChooseItemToModifyMessage={
                            showChooseItemToModifyMessage
                          }
                          setshowChooseItemToModifyMessage={
                            setshowChooseItemToModifyMessage
                          }
                          showChooseItemToModifyPage={
                            showChooseItemToModifyPage
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Ajouter_nouveau_appareil"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <CreateNewDeviceGestion
                          setDocumentationPage={setDocumentationPage}
                          documentationPage={documentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Modifier_appareil"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ModifyDeviceGestion
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_des_roles"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <GestionDesRoles
                          setDocumentationPage={setDocumentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Ajouter_nouveau_role"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <CreateNewRole
                          accountIdFromRole={accountIdFromRole}
                          documentationPage={documentationPage}
                          setDocumentationPage={setDocumentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Localisation_devices"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <LocationPage
                          isDashBoardComptnent={isDashBoardComptnent}
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Ajouter_modifier_geofence"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <AjouterGeofence
                          isDashBoardComptnent={isDashBoardComptnent}
                          setDocumentationPage={setDocumentationPage}
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_des_groupes"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ListeDesGroupes
                          setDocumentationPage={setDocumentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          showChooseItemToModifyMessage={
                            showChooseItemToModifyMessage
                          }
                          setshowChooseItemToModifyMessage={
                            setshowChooseItemToModifyMessage
                          }
                          showChooseItemToModifyPage={
                            showChooseItemToModifyPage
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Ajouter_nouveau_groupe"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <CreateNewGroupeGestion
                          setDocumentationPage={setDocumentationPage}
                          documentationPage={documentationPage}
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Modifier_groupe"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <ModifyGroupeGestion
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/userInfo"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <InfoUserComponent
                          setDocumentationPage={setDocumentationPage}
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Info_appareil"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <DetailsVehiculePage />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Gestion_geofences"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <GestionGeofences
                          setDocumentationPage={setDocumentationPage}
                          isDashBoardComptnent={isDashBoardComptnent}
                          setChooseOtherAccountGestion={
                            setChooseOtherAccountGestion
                          }
                          setChooseOneAccountToContinue={
                            setChooseOneAccountToContinue
                          }
                          chooseAccountFromGeozoneSection={
                            chooseAccountFromGeozoneSection
                          }
                          setChooseAccountFromGeozoneSection={
                            setChooseAccountFromGeozoneSection
                          }
                          showChooseItemToModifyMessage={
                            showChooseItemToModifyMessage
                          }
                          setshowChooseItemToModifyMessage={
                            setshowChooseItemToModifyMessage
                          }
                          showChooseItemToModifyPage={
                            showChooseItemToModifyPage
                          }
                        />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Historique_appareil"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <HistoriquePage />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Trajet_appareil"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <HistoriquePage />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route
            path="/Rapport_unite"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <RapportPageDetails />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          {/*  */}
          <Route
            path="/installation_application"
            element={
              <PrivateRoute
                element={
                  <div className="flex mx-auto w-full justify-center mt-[3.2rem] bg-gray-100">
                    <SideBarSpaceLeft />
                    <div className="w-full">
                      <Suspense fallback={<LoadingLazyAnimation />}>
                        <DocInstallation />
                      </Suspense>
                    </div>
                  </div>
                }
              />
            }
          />

          <Route path="*" element={<Page_404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
