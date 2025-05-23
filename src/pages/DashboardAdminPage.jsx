import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoEarth,
  IoMenu,
} from "react-icons/io5";
import {
  MdInstallDesktop,
  MdLocationPin,
  MdLogout,
  MdSpaceDashboard,
  MdSwitchAccount,
} from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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

function DashboardAdminPage() {
  const {
    scrollToTop,
    FormatDateHeure,
    setCurrentAccountSelected,
    comptes,
    accountDevices,
    accountGroupes,
    accountUsers,
    currentAccountSelected,
    listeGestionDesUsers,
    setListeGestionDesUsers,
    listeGestionDesGroupe,
    setListeGestionDesGroupe,
    listeGestionDesGroupeTitre,
    setListeGestionDesGroupeTitre,
    listeGestionDesVehicules,
    setListeGestionDesVehicules,
    gestionAccountData,
    dashboardLoadingEffect,
    setDashboardLoadingEffect,
    TestDeRequetteDevices,
    successCreateAccountGestionPoupu,
    setSuccessCreateAccountGestionPoupu,
    echecCreateAccountGestionPoupu,
    setEchecCreateAccountGestionPoupu,
    successModifyAccountGestionPopup,
    setSuccessModifyAccountGestionPopup,
    echecModifyAccountGestionPopup,
    setEchecModifyAccountGestionPopup,
    successCreateUserGestionPopup,
    setSuccessCreateUserGestionPopup,
    echecCreateUserGestionPopup,
    setEchecCreateUserGestionPopup,
    successModifyUserGestionPopup,
    setSuccessModifyUserGestionPopup,
    echecModifyUserGestionPopup,
    setEchecModifyUserGestionPopup,
    successAddVéhiculePopup,

    errorAddVéhiculePopup,
    setErrorAddVéhiculePopup,
    accountGeofences,
    listeGestionDesGeofences,
    setListeGestionDesGeofences,
  } = useContext(DataContext);

  // Données des véhicules avec heures différentes
  const vehiculeData = [
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
    {
      deviceID: "234234234",
      description: "nissan xterra",
      lastStartTime: "1746025200", // 06:00
      lastStopTime: "1746032400", // 08:00
    },
    {
      deviceID: "234234",
      description: "Camion mack",
      lastStartTime: "1746034200", // 08:30
      lastStopTime: "1746041400", // 10:30
    },
    {
      deviceID: "232344234",
      description: "Caracol de Paule",
      lastStartTime: "1746043200", // 11:00
      lastStopTime: "1746050400", // 13:00
    },
  ];

  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    setAllDevices(accountDevices);
  }, [accountDevices]);

  useEffect(() => {
    setAllDevices(accountDevices);
    console.log("reload...................................", accountDevices);
    setTimeout(() => {
      console.log("reload...................................", accountDevices);
    }, 5000);
  }, []);

  // Préparation des données pour le graphique
  const graphData = vehiculeData.map((item) => ({
    name: item.description.slice(0, 7), // 4 premières lettres
    fullName: item.description,
    start: parseInt(item.lastStartTime),
    stop: parseInt(item.lastStopTime),
  }));

  // Trouver les min/max des heures pour l'axe Y
  const allTimes = graphData?.flatMap((item) => [item.start, item.stop]);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  // Composant Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fullName = data.fullName;
      const startTime = FormatDateHeure(data.start).time;
      const stopTime = FormatDateHeure(data.stop).time;

      return (
        <div className="bg-white shadow-lg rounded p-2 text-sm border border-gray-100">
          <p className="text-gray-700 font-semibold">{fullName}</p>
          <p className="text-gray-600">Départ : {startTime}</p>
          <p className="text-gray-600">Arrivée : {stopTime}</p>
        </div>
      );
    }
    return null;
  };

  const barSpacing = 50; // 3rem en px
  const barCount = graphData.length;
  const fixedWidth = barCount * barSpacing;

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
  const [documentationPage, setDocumentationPage] = useState("Dashboard");

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

  // const filterGestionGroupData = searchInputTerm
  //   ? currentAccountSelected
  //     ? currentAccountSelected?.accountGroupes?.filter((item) =>
  //         item?.description
  //           .toLowerCase()
  //           .includes(searchInputTerm.toLowerCase())
  //       )
  //     : gestionAccountData?.accountGroupes?.filter((item) =>
  //         item?.description
  //           .toLowerCase()
  //           .includes(searchInputTerm.toLowerCase())
  //       )
  //   : accountGroupes;

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

  return (
    <div className="transition-all bg-gray-100">
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
      <header className="fixed z-[9999] top-0 left-0 right-0 bg-white">
        <div className="flex shadow-lg-- shadow-black/20 justify-between items-center md:px-10 px-4 py-2">
          <Link
            onClick={() => {
              // TestDeRequetteDevices();
            }}
            to="/dashboard_admin_page"
            className="flex items-center gap-3"
          >
            <img src="/img/cars/logo.png" className="w-7" alt="Logo" />
            <h2 className="text-md hidden md:block sm:text-xl font-bold opacity-70">
              Octagono<span className="text-orange-600">PLus</span>
            </h2>
          </Link>
          <div className="flex gap-4 items-center">
            <div
              onClick={() => {
                setChooseOtherAccountGestion(true);
                setChooseOneAccountToContinue(false);
                setChooseAccountFromGeozoneSection(false);
              }}
              className="flex cursor-pointer gap-2 items-center"
            >
              <FaUserCircle className="text-[1.4rem] text-gray-600" />
              <div className=" text-gray-800 flex flex-col gap-0">
                <p className="font-semibold max-w-[8rem] whitespace-nowrap text-ellipsis overflow-hidden text-gray-600">
                  {currentAccountSelected?.description || "Tous les comptes"}
                </p>
              </div>
              <FaChevronDown className="mt-1" />
            </div>
            <div
              onClick={() => {
                setReadDocumentationSideBar(!readDocumentationSideBar);
              }}
              className="flex lg:hidden-- cursor-pointer text-gray-700 items-center gap-3 text-xl"
            >
              <IoMenu className="text-[1.6rem] min-w-[1.5rem] text-orange-600" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex gap-5 bg-white">
        {/* Side Bar */}
        <div
          className={`${
            readDocumentationSideBar ? "translate-x-0" : "-translate-x-[100%]"
          }  transition-all lg:translate-x-0-- bg-white fixed   lg:relative-- left-0 top-[3rem] p-4 pt-3 z-[5999] shadow-lg lg:shadow-none shadow-black/20   w-[100vw] max-w-[18rem] min-h-[100vh]`}
        >
          <IoClose
            onClick={() => {
              setReadDocumentationSideBar(false);
            }}
            className="text-3xl absolute top-[7.5rem]- top-3 right-[1.1rem] lg:hidden-- text-red-600 cursor-pointer"
          />
          {documentationPage !== "Dashboard" && (
            <button
              onClick={backToPagePrecedent}
              // disabled={historyRef.current.length === 0}
              className={` ${
                documentationPage === "Localisation_devices"
                  ? "top-[7rem] md:top-[2rem]"
                  : "top-[.5rem] md:top-[2rem]"
              } text-xl border-- shadow-lg-- shadow-black/10 bg-white rounded-md px-2 py-1 flex gap-2 items-center absolute  -right-[6.6rem] md:-right-[7rem] lg:hidden-- text-gray-600 cursor-pointer`}
            >
              <FaArrowLeft />
              <span className="text-[1rem]">Retour</span>
            </button>
          )}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          <div
            onClick={() => {
              scrollToTop();
            }}
            className="h-[105vh] pb-52 mt-5 font-semibold-- flex flex-col overflow-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  setChooseOtherAccountGestion(true);
                  setChooseOneAccountToContinue(false);
                  setChooseAccountFromGeozoneSection(false);
                  closeSideBar();
                }}
                className={`$ flex items-center   justify-between  gap-2  border-b border-b-gray-200 py-4  cursor-pointer px-3`}
              >
                <FaUserCircle className="text-[3rem] min-w-[1.5rem] text-gray-500" />
                <div className="w-full">
                  <p className="text-gray-600 font-semibold">Compte Actuel</p>
                  <p className="text-orange-500 max-w-[10rem] whitespace-nowrap text-ellipsis overflow-hidden  ">
                    {currentAccountSelected
                      ? currentAccountSelected?.description
                      : "Tous les comptes"}
                  </p>
                </div>
                <FaChevronDown className="text-lg" />
              </div>
            </div>
            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  scrollToTop();
                  setDocumentationPage("Dashboard");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Dashboard" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <MdSpaceDashboard className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">Dashboard</p>
                </div>
              </div>
            </div>
            {!currentAccountSelected && (
              <div className="ajouter-appareil-container transition-all hover:border-b  ">
                <div
                  onClick={() => {
                    scrollToTop();
                    setDocumentationPage("Gestion_des_comptes");
                    closeSideBar();
                  }}
                  className={`${
                    documentationPage === "Gestion_des_comptes" ||
                    documentationPage === "Ajouter_nouveau_compte" ||
                    documentationPage === "Modifier_compte"
                      ? "bg-orange-50"
                      : ""
                  } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
                >
                  <MdSwitchAccount className="text-xl min-w-[1.5rem] text-orange-600" />
                  <div className="flex w-full justify-between">
                    <p className="text-gray-600 font-semibold">
                      Gestion des comptes ({comptes?.length})
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  if (currentAccountSelected) {
                    console.log(currentAccountSelected?.accountUsers);
                    setListeGestionDesUsers(
                      currentAccountSelected?.accountUsers
                    );
                  } else {
                    // setListeGestionDesUsers(accountUsers);
                    setListeGestionDesUsers([
                      ...Array.from(
                        new Map(
                          gestionAccountData
                            ?.flatMap((account) => account.accountUsers || [])
                            ?.map((user) => [user.userID, user])
                        ).values()
                      ),
                      ...accountUsers.filter(
                        (user) =>
                          !gestionAccountData
                            ?.flatMap((account) => account.accountUsers || [])
                            ?.some(
                              (existingUser) =>
                                existingUser.userID === user.userID
                            )
                      ),
                    ]);
                    // console.log([
                    //   ...Array.from(
                    //     new Map(
                    //       gestionAccountData
                    //         .flatMap((account) => account.accountUsers || [])
                    //         .map((user) => [user.userID, user])
                    //     ).values()
                    //   ),
                    //   ...accountUsers.filter(
                    //     (user) =>
                    //       !gestionAccountData
                    //         .flatMap((account) => account.accountUsers || [])
                    //         .some(
                    //           (existingUser) =>
                    //             existingUser.userID === user.userID
                    //         )
                    //   ),
                    // ]);
                    // setListeGestionDesUsers(
                    //   Array.from(
                    //     new Map(
                    //       gestionAccountData
                    //         .flatMap((account) => account.accountUsers)
                    //         .map((user) => [user.userID, user])
                    //     ).values()
                    //   )
                    // );
                  }
                  scrollToTop();
                  setDocumentationPage("Gestion_des_utilisateurs");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Gestion_des_utilisateurs"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <FaUsers className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    Gestion des Utilisateurs (
                    {currentAccountSelected
                      ? currentAccountSelected?.accountUsers?.length
                      : accountUsers?.length}
                    )
                  </p>
                </div>
              </div>
            </div>
            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  if (currentAccountSelected) {
                    setListeGestionDesGroupe(
                      currentAccountSelected?.accountGroupes
                    );
                    console.log(currentAccountSelected?.accountGroupes);
                    console.log("x", currentAccountSelected?.accountGroupes);
                    setListeGestionDesGroupeTitre("Tous les Groupe");
                  } else {
                    // setListeGestionDesGroupe(accountGroupes);
                    setListeGestionDesGroupe(
                      Array.from(
                        new Map(
                          gestionAccountData
                            ?.flatMap((account) => account.accountGroupes)
                            ?.map((group) => [group.groupID, group])
                        ).values()
                      )
                    );
                    setListeGestionDesGroupeTitre("Tous les Groupe");
                  }
                  scrollToTop();
                  setDocumentationPage("Gestion_des_groupes");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Gestion_des_groupes"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <PiIntersectThreeBold className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    Gestion des Groupe (
                    {currentAccountSelected
                      ? currentAccountSelected?.accountGroupes?.length
                      : accountGroupes?.length}
                    )
                  </p>
                </div>
              </div>
            </div>
            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  if (currentAccountSelected) {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                  } else {
                    setListeGestionDesVehicules(accountDevices);
                  }
                  scrollToTop();
                  setDocumentationPage("Gestion_des_appareils");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Gestion_des_appareils"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <FaCar className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    Gestion des Appareils (
                    {currentAccountSelected
                      ? currentAccountSelected?.accountDevices?.length
                      : accountDevices?.length}
                    )
                  </p>
                </div>
              </div>
            </div>

            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  if (currentAccountSelected) {
                    setListeGestionDesGeofences(
                      currentAccountSelected?.accountGeofences
                    );
                    console.log(
                      "xxxxxxxxxxxxxxxxxx",
                      currentAccountSelected?.accountGeofences
                    );
                  } else {
                    setListeGestionDesGeofences(accountGeofences);
                  }
                  scrollToTop();
                  setDocumentationPage("Gestion_geofences");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Gestion_geofences"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <IoEarth className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    Gestion des Geofences (
                    {currentAccountSelected
                      ? currentAccountSelected?.accountGeofences?.length
                      : accountGeofences?.length}
                    )
                  </p>
                </div>
              </div>
            </div>

            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  if (currentAccountSelected) {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                  } else {
                    setListeGestionDesVehicules(accountDevices);
                  }
                  scrollToTop();
                  setDocumentationPage("Localisation_devices");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Localisation_devices"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <MdLocationPin className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    Localisation Appareils (
                    {currentAccountSelected
                      ? currentAccountSelected?.accountDevices?.length
                      : accountDevices?.length}
                    )
                  </p>
                </div>
              </div>
            </div>

            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  // scrollToTop();
                  //   setDocumentationPage("installation");
                  closeSideBar();
                  setLogOutPopup(true);
                }}
                className={`${
                  documentationPage === "installation" ? "bg-orange-50" : ""
                } flex items-center ajouter-appareil-container-2 gap-2   border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <MdLogout className="text-xl min-w-[1.5rem] text-red-500" />
                <div className="flex w-full justify-between">
                  <p className="text-red-600 text-[1rem] font-semibold">
                    Déconnexion
                  </p>
                </div>
              </div>
            </div>
            {/* <div
              onClick={() => {
                // setLogOutPopup(true);
              }}
              className="flex text-red-600 font-semibold border-b border-gray-300 py-4 gap-4 text-lg hover:text-orange-500 cursor-pointer items-center dark:text-red-400 dark:border-gray-600 dark:hover:text-orange-400"
            >
              <MdLogout />
              <h3>Déconnexion</h3>
            </div> */}

            {/*  */}
          </div>
        </div>
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
          <p className="absolute -bottom-8 text-gray-500 text-sm right-4">
            25/05/2025 _ 1
          </p>
          {/* dashboardLoadingEffect */}
          {dashboardLoadingEffect && (
            <div className="fixed  shadow-lg shadow-black/10 max- w-[10rem]  rounded-full max- h-[10rem] left-[50%] -translate-x-[50%] top-[40%]  z-30 inset-0 bg-gray-200/50">
              <div className="w-full h-full flex justify-center items-center">
                <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
              </div>
            </div>
          )}
          {/* <div className="bg-white rounded-lg"> */}
          {/* container */}
          {/* <GestionDesCompts /> */}
          {/* <DashboardContaintMaintComponant /> */}
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
          {/*  */}
          {/*  */}
          {/* ListeDesUtilisateur */}
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
          {documentationPage === "Localisation_devices" && (
            <LocationPage
              isDashBoardComptnent={isDashBoardComptnent}
              setDocumentationPage={setDocumentationPage}
            />
          )}
          {/* <LocationPage /> */}
          {/* {showCreateNewDevicePage && (
        <CreateNewDeviceGestion
          setShowUserListeToSelectDevice={setShowUserListeToSelectDevice}
          setShowUserGroupeCategorieSection={setShowUserGroupeCategorieSection}
          setChooseOtherAccountGestion={setChooseOtherAccountGestion}
          setShowCreateNewDevicePage={setShowCreateNewDevicePage}
        />
      )}

      {showModifyNewDevicePage && (
        <ModifyDeviceGestion
          setShowModifyNewDevicePage={setShowModifyNewDevicePage}
        />
      )} */}
          {/*  */}
          {/*  */}
          {/*  */}
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
          {/*  */}
          {/*  */}
          {/*  */}
        </div>

        {/* {showCreateNewGroupePage && (
                <CreateNewGroupeGestion
                  setShowCreateNewGroupePage={setShowCreateNewGroupePage}
                />
              )}
        
              {showModifyNewGroupePage && (
                <ModifyGroupeGestion
                  setShowModifyNewGroupePage={setShowModifyNewGroupePage}
                />
              )} */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default DashboardAdminPage;

{
  /* Debut */
}
{
  /* <div className="ajouter-appareil-container transition-all hover:border-b  ">
  <div
    onClick={() => {
      scrollToTop();
      setDocumentationPage("gestionAppareil");
    }}
    className={`${
      documentationPage === "gestionAppareil" ? "bg-orange-50" : ""
    } flex items-center-- ajouter-appareil-container-2 gap-4  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
  >
    <IoCarSportOutline className="text-2xl min-w-[1.5rem] text-orange-600" />
    <div className="flex w-full justify-between">
      <p className="text-gray-600 font-semibold">Gestion des appareils</p>

      <IoChevronDown
        className={`${
          documentationPage === "gestionAppareil" ? "rotate-180" : "rotate-0"
        } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
      />
    </div>
  </div> */
}
{
  /* <div
                className={`${
                  documentationPage === "gestionAppareil"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    // setTimeout(() => {
                    //   scrollToTitle(ajouter_nouveau_appareil_section_ref);
                    // }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p>Ajouter un nouvel appareil</p>
                </div>
                <div
                  onClick={() => {
                    // setTimeout(() => {
                    //   scrollToTitle(modidier_appareil_section_ref);
                    // }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p>Modifier un appareil</p>
                </div>
                <div
                  onClick={() => {
                    // setTimeout(() => {
                    //   scrollToTitle(supprimer_appareil_section_ref);
                    // }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p>Supprimer un appareil</p>
                </div>
              </div> */
}
// </div>;
{
  /* Fin */
}
