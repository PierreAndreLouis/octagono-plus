import React, { useContext, useEffect, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoMenu,
} from "react-icons/io5";
import {
  MdInstallDesktop,
  MdPassword,
  MdSwitchAccount,
  MdUpdate,
} from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
// import { DataContext } from "../../context/DataContext";

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
  FaCar,
  FaChevronDown,
  FaSearch,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { GoDot } from "react-icons/go";
import { DataContext } from "../../context/DataContext";

function DashboardContaintMaintComponant({
  setChooseOtherAccountGestion,
  setDocumentationPage,
  setChosseOtherGroupeDashboard,
  allDevices,
}) {
  const {
    scrollToTop,
    FormatDateHeure,
    currentAccountSelected,
    listeGestionDesVehicules,
    accountDevices,
    setListeGestionDesUsers,
    setShowSelectedUserOptionsPopup,
    setCurrentSelectedUserToConnect,
    accountUsers,
    accountGroupes,
    account,
    password,
    fetchAccountDevices,
    fetchAccountUsers,
    fetchUserDevices,
    fetchUserGroupes,
    dashboardLoadingEffect,
    setDashboardLoadingEffect,
    gestionAccountData,
    setListeGestionDesGroupe,
    setListeGestionDesGroupeTitre,
    fetchAllComptes,
    adminAccount,
    adminUser,
    adminPassword,
  } = useContext(DataContext);

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const currentTimeSec = getCurrentTimestamp();

  // const allDevices = currentAccountSelected
  //   ? currentAccountSelected?.accountDevices
  //   : accountDevices;

  const DeviceDéplacer = allDevices?.filter((device) => {
    return device?.lastStopTime > todayTimestamp;
  });

  const DeviceEnStationnement = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime < twentyFourHoursInSec;
  });

  const DeviceInactifs = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime > twentyFourHoursInSec;
  });

  // // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
  // const getTodayTimestamp = () => {
  //   const now = new Date();
  //   now.setHours(0, 0, 0, 0); // Minuit
  //   return Math.floor(now.getTime() / 1000); // Convertir en secondes
  // };
  // const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes
  // const todayTimestamp = getTodayTimestamp() * 1000;
  // const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  // const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

  // const allDevices = currentAccountSelected
  //   ? currentAccountSelected?.accountDevices
  //   : accountDevices;

  // const DeviceDéplacer = allDevices?.filter((device) => {
  //   const déplacer = device?.lastStopTime > todayTimestamp;
  //   return déplacer;
  // });

  // const DeviceEnStationnement = allDevices?.filter((device) => {
  //   const stationnement =
  //     currentTimeMs - device?.lastUpdateTime < twentyFourHoursInMs;
  //   return stationnement;
  // });

  // const DeviceInactifs = allDevices?.filter((device) => {
  //   const stationnement =
  //     currentTimeMs - device?.lastUpdateTime > twentyFourHoursInMs;
  //   return stationnement;
  // });

  // Données des véhicules avec heures différentes
  // const vehiculeData = [
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  //   {
  //     deviceID: "234234234",
  //     description: "nissan xterra",
  //     lastStartTime: "1746025200", // 06:00
  //     lastStopTime: "1746032400", // 08:00
  //   },
  //   {
  //     deviceID: "234234",
  //     description: "Camion mack",
  //     lastStartTime: "1746034200", // 08:30
  //     lastStopTime: "1746041400", // 10:30
  //   },
  //   {
  //     deviceID: "232344234",
  //     description: "Caracol de Paule",
  //     lastStartTime: "1746043200", // 11:00
  //     lastStopTime: "1746050400", // 13:00
  //   },
  // ];

  // Préparation des données pour le graphique
  const graphData =
    DeviceDéplacer &&
    DeviceDéplacer?.map((item) => ({
      name: item?.description.slice(0, 7), // 4 premières lettres
      fullName: item?.description,
      accountID: item?.accountID,
      // start: parseInt(item?.lastStartTime),
      start: parseInt(item?.lastStartTime),
      // start: 2 * 60 * 60 * 60 * 60 *60,
      stop: parseInt(item?.lastStopTime),
    }));

  const formatDuree = (seconds) => {
    if (!seconds || seconds < 0) return "0s";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`); // toujours afficher au moins les secondes

    return parts.join(" ");
  };

  // Trouver les min/max des heures pour l'axe Y
  const allTimes = graphData?.flatMap((item) => [item?.start, item?.stop]);
  const minTime = allTimes && Math.min(...allTimes);
  const maxTime = allTimes && Math.max(...allTimes);

  // Composant Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fullName = data?.fullName;
      const startTime = FormatDateHeure(data.start).time;
      const startDate = FormatDateHeure(data.start).date;
      const stopTime = FormatDateHeure(data.stop).time;
      const stopDate = FormatDateHeure(data.stop).date;
      const dureeTrajet = data.stop - data.start;
      const dureeTrajetStr = formatDuree(dureeTrajet);
      const accountID = data?.accountID;

      return (
        <div className="bg-white shadow-lg rounded p-2 mb-5 text-sm border border-gray-100">
          <p className="text-gray-700 font-semibold">{fullName}</p>
          <p className="text-gray-700 font-semibold--">
            AccountID :{" "}
            <span className="font-bold notranslate">{accountID}</span>{" "}
          </p>
          <p className="text-gray-600">
            {" "}
            Départ : {startDate} /{" "}
            <span className="font-bold">{startTime}</span>
          </p>
          <p className="text-gray-600">
            Arrivée : {stopDate} / <span className="font-bold">{stopTime}</span>
          </p>
          <p className="text-gray-600">
            Durée trajet : <span className="font-bold"> {dureeTrajetStr}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const barSpacing = 70; // 3rem en px
  const barCount = graphData.length;
  const fixedWidth = barCount * barSpacing;

  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////

  // const allVehicule = 100;
  // const activeVehicule = 50;
  // const inactivVehicule = 30;
  // const parkingVehicule = 20;

  const allVehicule = allDevices?.length;

  const activeVehicule = DeviceDéplacer?.length;

  const inactivVehicule = DeviceInactifs?.length;

  const parkingVehicule = DeviceEnStationnement?.length;

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
    buildCircle(
      90,
      14,
      inactivPct,
      "rgba(147,51,234,1)",
      "rgba(147,51,234,0.1)"
    ), // purple
    // buildCircle(90, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"), // green

    buildCircle(
      70,
      14,
      parkingPct,
      "rgba(251,146,60,1)",
      "rgba(251,146,60,0.1)"
    ), // orange
    // buildCircle(70, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"),// green

    buildCircle(50, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"), // green
  ];

  ///////////////////////////////////////////////////

  const [readDocumentationSideBar, setReadDocumentationSideBar] =
    useState(false);
  // const [documentationPage, setDocumentationPage] = useState("");

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

  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  // Pour le loading lors du clique sur l'icon reload in home page.
  const [isLoading2, setIsLoading2] = useState(false);

  //Pour Simuler un délai de 10 secondes pour le loading de l'icon loading dans la page home
  const fetchNewDataDevices = () => {
    setDashboardLoadingEffect(true);
    setIsLoading2(true);
    setTimeout(() => {
      setIsLoading2(false);
    }, 5000);
    const fetchAllOtherData = true;

    fetchAllComptes(adminAccount, adminUser, adminPassword, fetchAllOtherData);

    // fetchAccountDevices(id, pwd).catch((err) => {
    //   console.error("Erreur lors du chargement des devices :", err);
    //   setError("Erreur lors du chargement des devices.");
    // });

    // fetchAccountUsers(id, pwd)
    //   .then((users) => {
    //     fetchUserDevices(id, users);
    //     fetchUserGroupes(id, users);
    //   })
    //   .catch((err) => {
    //     console.error(
    //       "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
    //       err
    //     );
    //     setError("Erreur lors de la mise à jour des utilisateurs.");
    //   });
  };

  return (
    <div className="pb-6-">
      {/* statistic box */}
      <div className="md:px-4-- pt-3--">
        <div className="w-full h-full bg-white rounded-lg p-4">
          <div className=" relative mb-4 ">
            <div className="">
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-[1.1rem] md:text-xl text-gray-800">
                  {/* Statistiques pour les 7 derniers jours */}
                  Statistiques pour aujourd'hui
                </h1>
                <div
                  onClick={() => {
                    fetchNewDataDevices();
                  }}
                  className={`${
                    isLoading2 ? "animate-spin" : ""
                  }  text-orange-500 mt-1 min-w-8 min-h-6  cursor-pointer   dark:text-gray-200 `}
                >
                  <MdUpdate className="sm:text-[1.5rem] min-w-8 text-[1.6rem] mt-1-- sm:mt-0" />
                </div>
              </div>
              <p className="  font-semibold max-w-[12rem] sm:max-w-[24rem]  whitespace-nowrap text-ellipsis overflow-hidden text-orange-500">
                <span className="mr-1  text-gray-600">Compte :</span>
                <span className="notranslate">

                {currentAccountSelected
                  ? currentAccountSelected?.description
                  : "Tous les comptes"}
                  </span>
              </p>
            </div>
            <div
              onClick={() => {
                setChosseOtherGroupeDashboard(true);
              }}
              className="sm:border sm:hover:bg-gray-100 sm:bg-gray-50 cursor-pointer flex gap-1 sm:gap-3 items-center absolute right-0 py-2 sm:px-4 rounded-lg -bottom-2 sm:bottom-0"
            >
              <p className="font-semibold hidden sm:block">
                Sélectionner un Groupe
              </p>
              <p className="font-semibold sm:hidden">Groupe</p>
              <FaChevronDown className="mt-1" />
            </div>
          </div>

          {/* Liste des statistics */}
          <div className="grid grid-cols-2 gap-1.5 md:gap-4 md:grid-cols-4 items-center justify-between">
            {/*  */}
            <div className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg">
              <div className="border border-blue-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-blue-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Total
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {allDevices?.length}
                  </h2>
                </div>
                <div className="absolute mt-1.5 right-4 bottom-4 ">
                  <img
                    className=" w-8 md:w-10 lg:w-14--"
                    src="/img/home_icon/total.png"
                    alt="Total"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg">
              <div className="border border-green-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-green-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Déplacés
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {DeviceDéplacer?.length}
                  </h2>
                </div>
                <div className="absolute mt-1.5 right-4 bottom-4">
                  <img
                    className=" w-12 md:w-14 lg:w-14--"
                    src="/img/home_icon/active.png"
                    alt="Total"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg">
              <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      En Stationnement
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {DeviceEnStationnement?.length}
                  </h2>
                </div>
                <div className="absolute mt-1.5 right-4 bottom-4 ">
                  <img
                    className=" w-8 md:w-10 lg:w-14--"
                    src="/img/cars/parking.png"
                    alt="Total"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg">
              <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Inactifs
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {DeviceInactifs?.length}
                  </h2>
                </div>
                <div className="absolute mt-1.5 right-4 bottom-4 ">
                  <img
                    className=" w-8 md:w-10 lg:w-14--"
                    src="/img/home_icon/payer.png"
                    alt="Total"
                  />
                </div>
              </div>
            </div>
            {/*  */}
          </div>
        </div>{" "}
      </div>
      {/*  */}
      <div className="md:px-4-- pt-4">
        {/* Graphe deplacement et graphe des véhicules */}
        <div className="grid grid-cols-1  md:grid-cols-3 items-stretch justify-center  gap-4 ">
          {/* Graphe de déplacement */}
          <div className="bg-white md:col-span-2 justify-between flex flex-col   p-3 h-full rounded-lg">
            {/* title section */}
            <div className="flex  mb-4 justify-between items-end ">
              <div className=" ">
                <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                  Graphe de déplacement
                </h2>
                <p className="text-gray-500">
                  Appareils Déplacés ({DeviceDéplacer?.length})
                </p>
              </div>
              <div className="flex mb-1 text-[.8rem] flex-col sm:flex-row gap-0 text-gray-600  sm:gap-5  items-center">
                <div className="flex gap-1 items-center ">
                  <p className="w-[.7rem] h-[.7rem] rounded-full bg-orange-500">
                    {" "}
                  </p>{" "}
                  <p>Depart</p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="w-[.7rem] h-[.7rem] rounded-full bg-green-500">
                    {" "}
                  </p>{" "}
                  <p>Arriver</p>
                </div>
              </div>
            </div>
            <div className=" ">
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}

              {DeviceDéplacer.length > 0 ? (
                <div
                  className="w-full  flex flex-col justify-end h-[250px] overflow-x-auto p-4 pb-0 pl-0 bg-gray-100- rounded-xl"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div
                    // className="border-2 border-red-600 h-full"
                    style={{ width: `${fixedWidth}px`, height: "100%" }}
                  >
                    <ResponsiveContainer
                      //   className={"border-2 border-green-600"}
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        // className="border-2 h-full border-purple-800"
                        data={graphData}
                        layout="horizontal"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: -10,
                        }}
                        barCategoryGap={barSpacing - 10} // 10px barSize → 38px gap
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 12 }}
                          interval={0}
                        />
                        <YAxis
                          type="number"
                          domain={[minTime - 600, maxTime]}
                          tickFormatter={(tick) => FormatDateHeure(tick).time}
                          tick={{ fontSize: 12 }}
                          width={42}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="start"
                          fill="#f97316"
                          name="Heure de départ"
                          radius={[8, 8, 0, 0]}
                          barSize={8}
                        />
                        <Bar
                          dataKey="stop"
                          fill="#22c55e"
                          name="Heure d'arrivée"
                          radius={[8, 8, 0, 0]}
                          barSize={8}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="w-full  min-h-full flex justify-center items-center">
                  <p className="py-10 md:py-[6.8rem] font-semibold  text-lg text-gray-600">
                    Pas d'appareil déplacés{" "}
                  </p>
                </div>
              )}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
            </div>
          </div>
          {/* Graphe des Appareils */}
          <div className="bg-white relative flex flex-col justify-between- p-3 md:col-span-1 rounded-lg">
            <h2 className="font-semibold text-lg mb-8 text-gray-700">
              Tous les appareils
            </h2>
            <div className="  h-[15rem]-- ">
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}

              <div className="w-64- pb-10  w-full h-full h-64- flex items-center justify-center relative">
                <div className="w-full max-w-[13rem]  aspect-square flex items-center justify-center relative">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full absolute"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="95"
                      fill="none"
                      stroke="white"
                      strokeWidth="14"
                    />

                    {layers.map((layer, index) => (
                      <g key={index}>
                        <circle
                          cx={layer.cx}
                          cy={layer.cy}
                          r={layer.r}
                          fill="none"
                          stroke={layer.trackColor}
                          strokeWidth={layer.strokeWidth}
                        />
                        <circle
                          cx={layer.cx}
                          cy={layer.cy}
                          r={layer.r}
                          fill="none"
                          stroke={layer.stroke}
                          strokeWidth={layer.strokeWidth}
                          strokeDasharray={layer.strokeDasharray}
                          strokeDashoffset={layer.strokeDashoffset}
                          strokeLinecap={layer.strokeLinecap}
                          transform="rotate(-90 100 100)"
                        />
                      </g>
                    ))}
                  </svg>

                  <div className="absolute text-center">
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="text-2xl font-bold">{allVehicule}</p>
                  </div>
                </div>

                <div className="absolute text-center">
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="text-2xl font-bold">{allVehicule}</p>
                </div>
              </div>
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
              {/* Graphe ici... */}
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="flex  border-- border-purple-500 p-2 rounded-md bg-white/50-- shadow-lg- shadow-black/10 absolute left-1 right-1- top-[.7rem]- bottom-1 text-xs mt-6 flex-col- flex-wrap text-gray-600  gap-3 gap-y-0 items-start">
              <div className="flex  gap-1 items-center">
                <p className="w-[.6rem] h-[.6rem] rounded-full bg-purple-500">
                  {" "}
                </p>{" "}
                <p>Hors service ({DeviceInactifs?.length})</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="w-[.6rem] h-[.6rem] rounded-full bg-green-500">
                  {" "}
                </p>{" "}
                <p>Déplacés ({DeviceDéplacer?.length})</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="w-[.6rem] h-[.6rem] rounded-full bg-orange-500">
                  {" "}
                </p>{" "}
                <p>En stationnement ({DeviceEnStationnement?.length})</p>
              </div>
            </div>
          </div>
          {/*  */}

          {/*  */}
        </div>

        {/* Other info */}
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2 items-stretch justify-center  gap-4 ">
          {/* Graphe de déplacement */}
          <div className="bg-white md:col-span-2-  p-3 h-full rounded-lg">
            {/* title section */}
            <div className="flex mb-4 justify-between items-end ">
              <div className=" flex w-full justify-between items-center">
                <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                  Tous les Utilisateurs (
                  {currentAccountSelected
                    ? currentAccountSelected?.accountUsers?.length
                    : accountUsers?.length}
                  )
                </h2>
                <button
                  onClick={() => {
                    if (currentAccountSelected) {
                      setListeGestionDesUsers(
                        currentAccountSelected?.accountUsers
                      );
                    } else {
                      setListeGestionDesUsers(accountUsers);
                    }
                    setDocumentationPage("Gestion_des_utilisateurs");
                    scrollToTop();
                  }}
                  className="py-1 text-sm px-4 rounded-md bg-orange-500 text-white font-semibold"
                >
                  Voir tous
                </button>
              </div>
            </div>
            <div className="h-full max-h-[20rem] flex flex-col gap-4 overflow-auto">
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              {(currentAccountSelected
                ? currentAccountSelected?.accountUsers
                : [
                    ...Array.from(
                      new Map(
                        gestionAccountData
                          .flatMap((account) => account.accountUsers || [])
                          .map((user) => [user.userID, user])
                      ).values()
                    ),
                    ...accountUsers.filter(
                      (user) =>
                        !gestionAccountData
                          .flatMap((account) => account.accountUsers || [])
                          .some(
                            (existingUser) =>
                              existingUser.userID === user.userID
                          )
                    ),
                  ]
              )?.map((user, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setShowSelectedUserOptionsPopup(true);
                      setCurrentSelectedUserToConnect(user);
                      console.log("user", user);
                      // setCurrentAccountSelected(account);
                      // setListeGestionDesVehicules(account?.accountDevices);
                      // setChooseOtherAccountGestion(false);
                    }}
                    className="shadow-lg- shadow-inner border- border-gray-200 cursor-pointer relative overflow-hidden-- bg-gray-50 /50 shadow-black/10 flex gap-3 items-center- rounded-lg py-2 px-2 "
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                      {index + 1}
                    </p>
                    <FaUserCircle className="text-orange-500/80 text-[2.5rem] mt-1" />
                    <div>
                      <p className="text-gray-600">
                        Nom de l'utilisateur :{" "}
                        <span className="font-bold notranslate">{user?.description}</span>{" "}
                      </p>
                      <p className="text-gray-600">
                        Nombre d'appareil :{" "}
                        <span className="font-bold">
                          {user?.userDevices?.length}
                        </span>{" "}
                      </p>

                      <p className="text-gray-600">
                        Nombre de Groupe :{" "}
                        <span className="font-bold">
                          {user?.userGroupes?.length}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
            </div>
          </div>
          {/* Graphe des Appareils */}
          <div className="bg-white flex flex-col justify-between p-3 md:col-span-1- mt-10 md:mt-0 rounded-lg">
            <div className=" flex pb-4 w-full justify-between items-center">
              <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                Tous les Groupes (
                {currentAccountSelected
                  ? currentAccountSelected?.accountGroupes?.length
                  : accountGroupes?.length}
                )
              </h2>
              <button
                onClick={() => {
                  if (currentAccountSelected) {
                    setListeGestionDesGroupe(
                      currentAccountSelected?.accountGroupes
                    );
                    setListeGestionDesGroupeTitre("Tous les Groupe");
                  } else {
                    // setListeGestionDesGroupe(accountGroupes);
                    setListeGestionDesGroupe(
                      Array.from(
                        new Map(
                          gestionAccountData
                            .flatMap((account) => account.accountGroupes)
                            .map((group) => [group.groupID, group])
                        ).values()
                      )
                    );
                    setListeGestionDesGroupeTitre("Tous les Groupe");
                  }
                  setDocumentationPage("Gestion_des_groupes");
                  scrollToTop();
                }}
                className="py-1 text-sm px-4 rounded-md bg-orange-500 text-white font-semibold"
              >
                Voir tous
              </button>
            </div>
            <div className=" flex flex-col gap-4  h-full max-h-[20rem] overflow-y-auto">
              {/* ... */}
              {/* ... */}
              {/* ... */}
              {/* ... */}
              {/* ... */}

              {(currentAccountSelected
                ? currentAccountSelected?.accountGroupes
                : Array.from(
                    new Map(
                      gestionAccountData
                        .flatMap((account) => account.accountGroupes)
                        .map((group) => [group.groupID, group])
                    ).values()
                  )
              )?.map((user, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      // setShowSelectedUserOptionsPopup(true);
                      // setTimeout(() => {
                      //   setCurrentSelectedUserToConnect(user);
                      //   console.log("user", user);
                      // }, 1000);
                      // setCurrentAccountSelected(account);
                      // setListeGestionDesVehicules(account?.accountDevices);
                      // setChooseOtherAccountGestion(false);
                    }}
                    className="shadow-lg-- shadow-inner shadow-gray-500/10  cursor-pointer relative overflow-hidden-- bg-gray-50 /50 shadow-black/10-- flex gap-3 items-center- rounded-lg py-2 px-2 "
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                      {index + 1}
                    </p>
                    <PiIntersectThreeBold className="text-orange-500/80 text-[2.5rem] mt-1" />
                    <div>
                      <p className="text-gray-600">
                        Nom du Groupe :{" "}
                        <span className="font-bold notranslate">{user?.description}</span>{" "}
                      </p>
                      <p className="text-gray-600">
                        Nombre d'appareil :{" "}
                        <span className="font-bold">
                          {user?.groupeDevices?.length}
                        </span>{" "}
                      </p>

                      {/* <p className="text-gray-600">
                        Nombre d'utilisateur :{" "}
                        <span className="font-bold">
                          {user?.userGroupes?.length}
                        </span>{" "}
                      </p> */}
                    </div>
                  </div>
                );
              })}
              {/* ... */}
              {/* ... */}
              {/* ... */}
              {/* ... */}
              {/* ... */}
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/* <div className="flex text-xs mt-6 flex-row flex-wrap text-gray-600  gap-3 gap-y-0 items-center">
              <div className="flex gap-1 items-center">
                <p className="w-[.7rem] h-[.7rem] rounded-full bg-green-500">
                  {" "}
                </p>{" "}
                <p>Déplacé</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="w-[.7rem] h-[.7rem] rounded-full bg-orange-500">
                  {" "}
                </p>{" "}
                <p>En stationnement</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="w-[.7rem] h-[.7rem] rounded-full bg-purple-500">
                  {" "}
                </p>{" "}
                <p>Hors service</p>
              </div>
            </div> */}
          </div>
          {/*  */}

          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default DashboardContaintMaintComponant;
