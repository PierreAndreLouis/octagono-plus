import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { IoClose, IoEarth, IoMenu } from "react-icons/io5";
import {
  MdGTranslate,
  MdInstallDesktop,
  MdLocationPin,
  MdLogout,
  MdSpaceDashboard,
  MdSwitchAccount,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";

import { PiIntersectThreeBold } from "react-icons/pi";
import {
  FaArrowLeft,
  FaCar,
  FaChevronDown,
  FaSearch,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { GoDot } from "react-icons/go";
import DashboardContaintMaintComponant from "../components/dashboard_containt/DashboardContaintMaintComponant";
import GestionDesCompts from "./GestionDesCompts";
import ListeDesUtilisateur from "./ListeDesUtilisateur";
import ListeDesVehiculesGestion from "./ListeDesVehiculesGestion";
import ListeDesGroupes from "./ListeDesGroupes";
import CreateNewAccountPage from "../components/gestion_des_comptes/CreateNewAccountPage";
import ModifyAccountPage from "../components/gestion_des_comptes/ModifyAccountPage";
import CreateNewUserGestion from "../components/gestion_des_comptes/CreateNewUserGestion";
import ModifyUserGroupeGestion from "../components/gestion_des_comptes/ModifyUserGroupeGestion";
import CreateNewGroupeGestion from "../components/gestion_des_comptes/CreateNewGroupeGestion";
import ModifyGroupeGestion from "../components/gestion_des_comptes/ModifyGroupeGestion";
import CreateNewDeviceGestion from "../components/gestion_des_comptes/CreateNewDeviceGestion";
import ModifyDeviceGestion from "../components/gestion_des_comptes/ModifyDeviceGestion";
import ChooseOtherAccountDashboard from "../components/dashboard_containt/ChooseOtherAccountDashboard";
import GestionUserOptionsPopup from "../components/gestion_des_comptes/GestionUserOptionsPopup";
import Logout from "../components/login/Logout";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import ChooseOtherGroupeDashboard from "../components/dashboard_containt/ChooseOtherGroupeDashboard";
import LocationPage from "./LocationPage";
import { FaLocationPin } from "react-icons/fa6";
import GestionGeofences from "./GestionGeofences";
import GoogleTranslate from "../components/home/GoogleTranslate";
import ListeDesAlertsGestion from "./ListeDesAlertsGestion";
import { FiAlertCircle } from "react-icons/fi";
import InfoUserComponent from "../components/profile/InfoUserComponent";
import { useTranslation } from "react-i18next";
import GestionDesRoles from "./GestionDesRoles";
import { BiUniversalAccess } from "react-icons/bi";
import CreateNewRole from "../components/gestion_des_comptes/CreateNewRole";
import HeaderDashboardSysadmin from "../components/dashboard_containt/HeaderDashboardSysadmin";
import SideBarSysadmin from "../components/dashboard_containt/SideBarSysadmin";
import DetailsVehiculePage from "./DetailsVehiculePage";
import HistoriquePage from "./HistoriquePage";
import RapportPageDetails from "./RapportPageDetails";
import Navigation_bar from "../components/home/Navigation_bar";

function DashboardAdminPage() {
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
    isAuthenticated,
    adminPassword,
    password,
  } = useContext(DataContext);

  useEffect(() => {
    setDonneeFusionnéForRapport([]);
  }, [currentAccountSelected, isDashboardHomePage]);

  // Données des véhicules avec heures différentes

  const [t, i18n] = useTranslation();

  const [allDevices, setAllDevices] = useState([]);
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const data = isDashboardHomePage
    ? currentAccountSelected?.accountDevices || accountDevices
    : dataFusionné;

  useEffect(() => {
    setAllDevices(data);
  }, [
    accountDevices,
    currentAccountSelected,
    isDashboardHomePage,
    mergedDataHome,
  ]);

  useEffect(() => {
    setAllDevices(data);
  }, []);

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
    } else {
      // Pas d'historique, on revient au fallback "Dashboard"
      setDocumentationPage("Dashboard");
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
  const hideComponentRoutes = ["/login"];

  // Vérification si le chemin actuel correspond à l'un des chemins dans hideComponentRoutes
  const shouldHideComponent = hideComponentRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  //
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reactiverSessionUser = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (
      (adminPassword && inputPassword === adminPassword) ||
      (password && inputPassword === password)
    ) {
      resetInteraction();
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
  //
  //
  //
  //
  //

  return (
    // <>
    <div className="transition-all bg-gray-100">
      {/* {!readDocumentation && ( */}
      <div className="absolute z-[8]">
        {!shouldHideComponent && (
          <Navigation_bar
            documentationPage={documentationPage}
            setDocumentationPage={setDocumentationPage}
          />
        )}
      </div>
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
      <HeaderDashboardSysadmin
        readDocumentationSideBar={readDocumentationSideBar}
        setDocumentationPage={setDocumentationPage}
        setChooseOtherAccountGestion={setChooseOtherAccountGestion}
        setChooseOneAccountToContinue={setChooseOneAccountToContinue}
        setChooseAccountFromGeozoneSection={setChooseAccountFromGeozoneSection}
        setReadDocumentationSideBar={setReadDocumentationSideBar}
      />
      <div className="flex gap-5 bg-white pb-14">
        {/* Side Bar */}
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
        />
        {/* Side Bar 2 */}
        <div
          className={`${
            readDocumentationSideBar ? "translate-x-0" : "-translate-x-[100%]"
          } ${
            !readDocumentationSideBar ? "hidden" : "lg:flex"
          } transition-all lg:translate-x-0-- bg-white hidden --  lg:relative left-0 top-[5rem] p-4 z-[0]  min-w-[17rem] max-w-[17rem] min-h-[100vh]`}
        ></div>

        <div
          className="relative w-full pb-4 mb-10 pt-4 rounded-lg bg-gray-100
          md:px-4 min-h-screen mt-[2rem] md:mt-[4rem]  pb-32- mx-auto"
        >
          {(dashboardLoadingEffect || dashboardLoadingEffectLogin) && (
            <div className="fixed  shadow-lg-- shadow-black/10 max- w-[5rem]  rounded-full max- h-[5rem] left-[50%] -translate-x-[50%] top-[40%]  z-30 inset-0 bg-white/0 -200/50">
              <div className="w-full h-full flex justify-center items-center">
                <div className="border-blue-500 h-10 w-10 animate-spin rounded-full border-4 border-t-gray-100/0" />
              </div>
            </div>
          )}
          {/* container */}
          {/* <div>
            <p>
              Temps depuis la dernière interaction :{" "}
              {Math.floor(timeSinceLastInteraction / 1000)} secondes
            </p>
            {isUserNotInteractingNow ? (
              <p>L'utilisateur est inactif depuis plus de 10 secondes.</p>
            ) : (
              <p>L'utilisateur est actif.</p>
            )}
            <button onClick={resetInteraction}>
              Réinitialiser l'interaction
            </button>
          </div> */}
          {isUserNotInteractingNow && isAuthenticated && (
            <div className="fixed inset-0 z-[999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999] bg-black/50 backdrop-blur-sm-- flex justify-center items-center">
              <form
                onSubmit={reactiverSessionUser}
                className="w-[95vw] mx-auto md:max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Session inactive
                </h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                  Inactivité de 30 minutes détectée. Veuillez confirmer votre
                  mot de passe pour continuer.
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
                  placeholder="Confirmer ton Mot de passe"
                  required
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                />
                <button
                  type="submit"
                  // onClick={() => {
                  //   resetInteraction();
                  // }}
                  className="bg-orange-600 text-white text-sm font-medium px-4 py-3 rounded-xl w-full hover:bg-orange-700 transition-all duration-150"
                >
                  Confirmer
                </button>
              </form>
            </div>
          )}
          {documentationPage === "Dashboard" && (
            <DashboardContaintMaintComponant
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
              setDocumentationPage={setDocumentationPage}
              setChosseOtherGroupeDashboard={setChosseOtherGroupeDashboard}
              allDevices={allDevices}
            />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_comptes" && (
            <GestionDesCompts setDocumentationPage={setDocumentationPage} />
          )}
          {documentationPage === "Ajouter_nouveau_compte" && (
            <CreateNewAccountPage setDocumentationPage={setDocumentationPage} />
          )}
          {documentationPage === "Modifier_compte" && (
            <ModifyAccountPage setDocumentationPage={setDocumentationPage} />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_utilisateurs" && (
            <ListeDesUtilisateur
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {documentationPage === "Ajouter_nouveau_utilisateur" && (
            <CreateNewUserGestion
              documentationPage={documentationPage}
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {documentationPage === "Modifier_utilisateur" && (
            <ModifyUserGroupeGestion
              setDocumentationPage={setDocumentationPage}
            />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_appareils" && (
            <ListeDesVehiculesGestion
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {documentationPage === "Ajouter_nouveau_appareil" && (
            <CreateNewDeviceGestion
              setDocumentationPage={setDocumentationPage}
              documentationPage={documentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {documentationPage === "Modifier_appareil" && (
            <ModifyDeviceGestion setDocumentationPage={setDocumentationPage} />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_alerts" && (
            <ListeDesAlertsGestion
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_roles" && (
            <GestionDesRoles
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {documentationPage === "Ajouter_nouveau_role" && (
            <CreateNewRole
              accountIdFromRole={accountIdFromRole}
              documentationPage={documentationPage}
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Localisation_devices" && (
            <LocationPage
              isDashBoardComptnent={isDashBoardComptnent}
              setDocumentationPage={setDocumentationPage}
            />
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_des_groupes" && (
            <ListeDesGroupes
              setDocumentationPage={setDocumentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}{" "}
          {documentationPage === "Ajouter_nouveau_groupe" && (
            <CreateNewGroupeGestion
              setDocumentationPage={setDocumentationPage}
              documentationPage={documentationPage}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
            />
          )}{" "}
          {documentationPage === "Modifier_groupe" && (
            <ModifyGroupeGestion setDocumentationPage={setDocumentationPage} />
          )}{" "}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "userInfo" && (
            <InfoUserComponent setDocumentationPage={setDocumentationPage} />
          )}{" "}
          {documentationPage === "Info_appareil" && <DetailsVehiculePage />}{" "}
          {/*  */}
          {/*  */}
          {/*  */}
          {documentationPage === "Gestion_geofences" && (
            <GestionGeofences
              setDocumentationPage={setDocumentationPage}
              isDashBoardComptnent={isDashBoardComptnent}
              setChooseOtherAccountGestion={setChooseOtherAccountGestion}
              setChooseOneAccountToContinue={setChooseOneAccountToContinue}
              chooseAccountFromGeozoneSection={chooseAccountFromGeozoneSection}
              setChooseAccountFromGeozoneSection={
                setChooseAccountFromGeozoneSection
              }
            />
          )}{" "}
          {/*  */}
          {(documentationPage === "Historique_appareil" ||
            documentationPage === "Trajet_appareil") && <HistoriquePage />}{" "}
          {documentationPage === "Rapport_unite" && <RapportPageDetails />}{" "}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          <p className="absolute -bottom-8 text-gray-500 text-sm right-4">
            30/06/2025 _ 3
          </p>
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
      </div>
    </div>
    // </>
  );
}

export default DashboardAdminPage;
