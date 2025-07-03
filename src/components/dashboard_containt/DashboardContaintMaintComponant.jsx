import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { ImEnlarge } from "react-icons/im";
import { FiAlertCircle } from "react-icons/fi";

import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoMenu,
} from "react-icons/io5";
import {
  MdInstallDesktop,
  MdLockOutline,
  MdPassword,
  MdSwitchAccount,
  MdUpdate,
} from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
// import { DataContext } from "../../context/DataContext";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PiIntersectThreeBold } from "react-icons/pi";
import {
  FaAngleDoubleRight,
  FaCar,
  FaChevronDown,
  FaLock,
  FaLockOpen,
  FaSearch,
  FaUnlockAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { GoDot } from "react-icons/go";
import { DataContext } from "../../context/DataContext";
import LocationPage from "../../pages/LocationPage";
import ListeDesVehiculesGestion from "../../pages/ListeDesVehiculesGestion";
import ListeDesUtilisateur from "../../pages/ListeDesUtilisateur";
import ListeDesGroupes from "../../pages/ListeDesGroupes";
import ListeDesAlertsGestion from "../../pages/ListeDesAlertsGestion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useTranslation } from "react-i18next";
import TableauRecapitulatifComptes from "./TableauRecapitulatifComptes";
import DeviceListeDashboard from "./DeviceListeDashboard";
import Graphe3BatonnetComptes from "./Graphe3BatonnetComptes";
import StatisticDashboard from "./StatisticDashboard";

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
    comptes,
    adminAccount,
    adminUsername,
    adminPassword,
    véhiculeDetails,
    setListeGestionDesVehicules,
    progressBarForLoadingData,
    statusDescriptions,
    isDashboardHomePage,
    mergedDataHome,
    progressAnimationStart,
    setProgressAnimationStart,
    runningAnimationProgressLoading,
    setRunningAnimationProgressLoading,
    runningAnimationProgressDuration,
    setRunningAnimationProgressDuration,
    homePageReload,
    username,
    fetchVehicleDataFromRapportGroupe,
    showAnnimationProgresseBarDashboard,
    setShowAnnimationProgresseBarDashboard,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const [expandSection, setExpandSection] = useState("");

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes

  const currentTimeSec = getCurrentTimestamp();
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
  //

  const DeviceDéplacer = allDevices?.filter((device) => {
    return device?.lastStopTime > todayTimestamp;
  });

  const EnDéplacement = allDevices?.filter((véhicule) => {
    const lastUpdateMs = véhicule?.véhiculeDetails?.[0]?.timestamp
      ? véhicule?.véhiculeDetails?.[0].timestamp * 1000
      : 0;

    const hasDetails = véhicule?.véhiculeDetails?.length > 0;
    const speed = véhicule?.véhiculeDetails?.[0]?.speedKPH ?? 0;
    const updatedRecently = currentTimeMs - lastUpdateMs <= tenMinutesInMs;

    const isActive = véhicule?.lastUpdateTime
      ? currentTime - véhicule.lastUpdateTime * 1000 < twentyFourHoursInMs
      : false;
    const updatedToday = lastUpdateMs >= todayTimestamp;

    return (
      hasDetails && isActive && speed >= 1 && updatedRecently && updatedToday
    );
  });

  const DeviceEnStationnement = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime < twentyFourHoursInSec;
  });

  const DeviceInactifs = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime > twentyFourHoursInSec;
  });

  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedDeplaces, setAnimatedDeplaces] = useState(0);
  const [animatedEnDéplacement, setAnimatedEnDéplacement] = useState(0);

  const [animatedStationnement, setAnimatedStationnement] = useState(0);
  const [animatedInactifs, setAnimatedInactifs] = useState(0);

  const preparationDownloadPDF = false;

  const animateValue = (start, end, duration, setter) => {
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(start + (end - start) * progress);
      setter(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    animateValue(animatedTotal, allDevices.length, 1000, setAnimatedTotal);
    animateValue(
      animatedDeplaces,
      DeviceDéplacer.length,
      1000,
      setAnimatedDeplaces
    );
    // animateValue(
    //   animatedEnDéplacement,
    //   EnDéplacement.length,
    //   1000,
    //   setAnimatedEnDéplacement
    // );
    animateValue(
      animatedStationnement,
      DeviceEnStationnement.length,
      1000,
      setAnimatedStationnement
    );
    animateValue(
      animatedInactifs,
      DeviceInactifs.length,
      1000,
      setAnimatedInactifs
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDevices]);

  //
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

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
            {t("AccountID")} :{" "}
            <span className="font-bold notranslate">{accountID}</span>{" "}
          </p>
          <p className="text-gray-600">
            {" "}
            {t("Départ")} : {startDate} /{" "}
            <span className="font-bold">{startTime}</span>
          </p>
          <p className="text-gray-600">
            {t("Arrivée")} : {stopDate} /{" "}
            <span className="font-bold">{stopTime}</span>
          </p>
          <p className="text-gray-600">
            {t("Durée trajet")} :{" "}
            <span className="font-bold"> {dureeTrajetStr}</span>
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

  const MIN_DISPLAY = 2; // px ou unité relative

  const transformValue = (value) => {
    if (value === 0) return MIN_DISPLAY;
    if (value <= 30) return Math.max(value * 2.5, MIN_DISPLAY);
    return Math.max(75 + (value - 30) * 0.5, MIN_DISPLAY);
  };

  // Préparation des données
  const formatBarData = (data) =>
    data?.map((account) => {
      const devices = account.accountDevices || [];
      const total = devices.length;
      const actifs = devices.filter(
        (d) => currentTimeSec - d?.lastUpdateTime < twentyFourHoursInSec
      ).length;

      const inactifs = total - actifs;

      return {
        name: account?.description, // fullName pour le popup
        shortName:
          (expandSection === "graphe"
            ? account?.description?.slice(0, 26)
            : account?.description?.slice(0, 6)) +
          "(" +
          account?.accountDevices?.length +
          ")", // 5 lettres pour l’axe X
        total,
        actifs,
        inactifs,
        totalDisplay: transformValue(total),
        actifsDisplay: transformValue(actifs),
        inactifsDisplay: transformValue(inactifs),
      };
    });

  //
  //
  //
  //
  //
  //
  //
  //
  const graphData2 = formatBarData(gestionAccountData)?.sort(
    (a, b) => b.total - a.total
  );

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

  const barSpacing2 = expandSection === "graphe" ? 160 : 70;
  const fixedWidth2 = graphData2?.length * barSpacing2;

  // Custom Tooltip pour afficher les vraies valeurs
  const CustomTooltip2 = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-lg rounded p-2 text-sm border border-gray-100">
          <p className="font-semibold">{data.name}</p>
          <p>
            {t("Total")} : <span className="font-bold">{data.total}</span>
          </p>
          <p>
            {t("Inactifs")} : <span className="font-bold">{data.inactifs}</span>
          </p>
          <p>
            {t("Actifs")} : <span className="font-bold">{data.actifs}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////
  /////////////////////////////////////

  const allVehicule = allDevices?.length;

  const activeVehicule = DeviceDéplacer?.length;

  const inactivVehicule = DeviceInactifs?.length;

  const parkingVehicule = DeviceEnStationnement?.length;

  const [animatedActivePct, setAnimatedActivePct] = useState(0);
  const [animatedInactivePct, setAnimatedInactivePct] = useState(0);
  const [animatedParkingPct, setAnimatedParkingPct] = useState(0);

  useEffect(() => {
    if (allVehicule === 0) return;

    // Réinitialise à zéro avant de lancer l’animation
    setAnimatedActivePct(0);
    setAnimatedInactivePct(0);
    setAnimatedParkingPct(0);

    // Attendre un petit moment pour laisser le temps au DOM de refléter le 0
    const timeout = setTimeout(() => {
      animateValue(0, activePct, 1000, setAnimatedActivePct);
      animateValue(0, inactivPct, 1000, setAnimatedInactivePct);
      animateValue(0, parkingPct, 1000, setAnimatedParkingPct);
    }, 50); // 50ms de délai suffit souvent

    return () => clearTimeout(timeout);
  }, [allDevices]);

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
      animatedInactivePct,
      "rgba(147,51,234,1)",
      "rgba(147,51,234,0.1)"
    ), // purple
    buildCircle(
      70,
      14,
      animatedParkingPct,
      "rgba(251,146,60,1)",
      "rgba(251,146,60,0.1)"
    ), // orange
    buildCircle(
      50,
      14,
      animatedActivePct,
      "rgba(34,197,94,1)",
      "rgba(34,197,94,0.1)"
    ), // green
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

  // Pour le loading lors du clique sur l'icon reload in home page.
  const [isLoading2, setIsLoading2] = useState(false);

  //Pour Simuler un délai de 10 secondes pour le loading de l'icon loading dans la page home
  const fetchNewDataDevices = () => {
    setDashboardLoadingEffect(true);
    setIsLoading2(true);
    setTimeout(() => {
      setIsLoading2(false);
    }, 5000);

    // const fetchAllOtherData = true;

    const accountUser = account || localStorage.getItem("account") || "";
    const usernameUser = username || localStorage.getItem("username") || "";
    const passwordUser = password || localStorage.getItem("password") || "";

    if (isDashboardHomePage) {
      fetchAllComptes(adminAccount, adminUsername, adminPassword);
      setShowAnnimationProgresseBarDashboard(true);
    } else {
      homePageReload(accountUser, usernameUser, passwordUser);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimeout(() => {
  //       fetchNewDataDevices();
  //     }, 1000);
  //   }, 1000 * 60 * 5);

  //   return () => clearInterval(intervalId);
  // }, []);

  const [showFistGrapheOption, setShowFistGrapheOption] = useState(false);
  const [showFistGrapheOption2, setShowFistGrapheOption2] = useState(false);

  function GrapheCirculaireDevices() {
    return (
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
    );
  }

  function GrapheDeDeplacementDesAppareils() {
    return (
      <div className="bg-white md:col-span-2- justify-between flex flex-col   p-3 h-full rounded-lg">
        {/* title section */}
        <div className="flex  mb-4 justify-between items-end ">
          <div className=" ">
            <div className="font-semibold flex items-center text-lg mb-4-- text-gray-700">
              <h2>Graphe de déplacement </h2>
              {!currentAccountSelected && (
                <FaAngleDoubleRight
                  onClick={() => {
                    setShowFistGrapheOption(!showFistGrapheOption);
                  }}
                  className="text-xl ml-3 mt-1 cursor-pointer"
                />
              )}
            </div>
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
              <p className="w-[.7rem] h-[.7rem] rounded-full bg-green-500"> </p>{" "}
              <p>Arriver</p>
            </div>
          </div>
        </div>
        <div className=" ">
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
                      animationDuration={1000}
                    />
                    <Bar
                      dataKey="stop"
                      fill="#22c55e"
                      name="Heure d'arrivée"
                      radius={[8, 8, 0, 0]}
                      barSize={8}
                      animationDuration={1000}
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
        </div>
      </div>
    );
  }

  const fromDashboard = true;
  const [
    showStatisticDeviceListeDashboard,
    setShowStatisticDeviceListeDashboard,
  ] = useState(false);

  const [statisticFilteredDeviceListe, setStatisticFilteredDeviceListe] =
    useState([]);
  const [
    statisticFilteredDeviceListeText,
    setStatisticFilteredDeviceListeText,
  ] = useState("");

  //
  //
  //

  function getMostRecentTimestamp(data) {
    if (data) {
      // console.log("data...............", data);
      const validTimestamps = data
        .map((véhicule) => parseInt(véhicule?.lastUpdateTime))
        .filter((timestamp) => !isNaN(timestamp));

      const mostRecentTimestamp =
        validTimestamps.length > 0 ? Math.max(...validTimestamps) : null; // ou une autre valeur par défaut

      return { mostRecentTimestamp };
    } else {
      console.log("Pas de donnees");
    }
  }

  // Pour stocker le timestamp le plus récent lorsque "data" change

  const [lastUpdate, setLastUpdate] = useState();
  const data = isDashboardHomePage
    ? currentAccountSelected?.accountDevices || accountDevices
    : dataFusionné;

  // Mettre à jour le timestamp le plus récent lorsque "data" change
  useEffect(() => {
    const result = getMostRecentTimestamp(data);
    if (result) {
      setLastUpdate(result); // garde l'objet { mostRecentTimestamp }
    }
    // console.log("result", result);
  }, [listeGestionDesVehicules, currentAccountSelected, accountDevices]);

  const getBackgroundColor = (code) => {
    switch (code) {
      case 0xf020:
        return "#d1f7c4"; // Vert clair - en mouvement
      case 0xf021:
        return "#ffe6cc"; // Orange - arrêté
      case 0xf022:
        return "#f0f0f0"; // Gris - parking
      case 0xf600:
        return "#ffcccc"; // Rouge - excès de vitesse
      case 0xfb00:
        return "#ffb3b3"; // Rouge foncé - alerte
      default:
        return "#e0e0e0"; // Gris par défaut
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

  const allData = (
    isDashboardHomePage
      ? currentAccountSelected
        ? currentAccountSelected?.accountDevices
        : accountDevices
      : dataFusionné
  )
    ?.flatMap((device) => device?.véhiculeDetails[0] || [])
    ?.filter((item) => item?.statusCode !== "0xF952");

  const statusCountMap = allData?.reduce((acc, item) => {
    const status = item.statusCode;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const dataPieChart = Object.entries(statusCountMap || {}).map(
    ([name, value]) => ({ name, value })
  );

  const COLORS = [
    "#f87171", // rouge clair
    "#34d399", // vert
    "#60a5fa", // bleu
    "#8b4cc7", // purple
    "#fbbf24", // jaune
    "#a78bfa", // violet clair
    "#fb7185", // rose
    "#38bdf8", // bleu clair
    "#4ade80", // vert clair
    "#facc15", // jaune vif
    "#818cf8", // indigo
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const CustomTooltipChartPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const code = parseInt(name, 16);
      const codeDescription = statusDescriptions[code] || "Statut inconnu";

      return (
        <div className="bg-white shadow-md rounded p-2 text-sm text-gray-800">
          <p>
            <strong>{t("Code")}:</strong> {name}
          </p>
          <p>
            <strong>{t("Quantité")}:</strong> {value}
          </p>
          <p>
            <strong>{t("Description")}:</strong> {codeDescription}
          </p>
        </div>
      );
    }

    return null;
  };

  const [unlockCarteScroll, setUnlockCarteScroll] = useState(false);

  const TouslesAlertesData = (
    isDashboardHomePage
      ? currentAccountSelected
        ? currentAccountSelected?.accountDevices
        : accountDevices
      : dataFusionné
  )
    ?.flatMap((device) => device?.véhiculeDetails[0] || [])
    ?.filter((item) => item?.statusCode !== "0xF952")
    ?.slice(0, 2);

  // useEffect(() => {
  //   if (runningAnimationProgressLoading && progressAnimationStart < 99) {
  //     const interval = setInterval(() => {
  //       setProgressAnimationStart((prev) => {
  //         if (prev >= 98) {
  //           clearInterval(interval);
  //           return 99;
  //         }
  //         return prev + 1;
  //       });
  //     }, runningAnimationProgressDuration);
  //     return () => clearInterval(interval);
  //   }
  // }, [
  //   runningAnimationProgressLoading,
  //   runningAnimationProgressDuration,
  //   progressAnimationStart,
  // ]);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (runningAnimationProgressLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setProgressAnimationStart((prev) => {
          if (prev >= 98) {
            clearInterval(intervalRef.current);
            setRunningAnimationProgressLoading(false);

            return 99;
          }
          return prev + 1;
        });
      }, runningAnimationProgressDuration);
    }

    return () => clearInterval(intervalRef.current);
  }, [runningAnimationProgressLoading, runningAnimationProgressDuration]);

  return (
    <div className="pb-6-">
      {showStatisticDeviceListeDashboard && (
        <div className="fixed px-3-- inset-0 bg-black/50 z-[99999999999999999999] flex justify-center items-center">
          <div className="bg-white overflow-hidden relative rounded-lg w-full md:max-w-[80vw]">
            <div className="absolute flex justify-center items-center top-0 left-0 right-0 h-[4rem] bg-orange-200 z-[8]">
              <h2 className="font-bold text-lg">
                {statisticFilteredDeviceListeText} - (
                {statisticFilteredDeviceListe?.length})
              </h2>
            </div>
            <IoClose
              onClick={() => {
                setShowStatisticDeviceListeDashboard(false);
                scrollToTop();
              }}
              className="absolute top-5 right-4 z-[99999999999] text-[1.6rem] cursor-pointer text-red-600"
            />
            <div className=" min-h-[80vh] max-h-[90vh] overflow-auto">
              <div>
                <ListeDesVehiculesGestion
                  setDocumentationPage={setDocumentationPage}
                  fromDashboard={fromDashboard}
                  statisticFilteredDeviceListe={statisticFilteredDeviceListe}
                  statisticFilteredDeviceListeText={
                    statisticFilteredDeviceListeText
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/*  */}
      {expandSection && (
        <div className="fixed mx-auto  flex-col bg-black/50 z-[99999999999999999999999] inset-0 flex justify-center items-center">
          <div className="w-full  mx-auto md:mx-auto overflow-hidden flex-  items-end- md:max-w-[90vw] --min-h-[70vh] max-h-[90vh]  bg-white rounded-lg">
            <div className="fixed rounded-full shadow-lg shadow-black/20 bg-white py-2 px-2 z-[9999999999999999999999] cursor-pointer top-10 right-[5vw] text-[2rem] text-red-500">
              <IoClose
                onClick={() => {
                  setExpandSection("");
                }}
              />
            </div>
            {expandSection === "carte" && (
              <div className="relative  translate-y-10--">
                <div className="w-full h-[15rem]-- overflow-hidden rounded-md ">
                  <LocationPage fromDashboard="true" />
                </div>
              </div>
            )}
            {expandSection === "graphe" && (
              <div className="h-full flex justify-between flex-col">
                <div className="w-full flex justify-center items-center py-3 font-bold text-xl">
                  <h2 className="mb-16">
                    {t("Graphe des Comptes")} ({comptes?.length})
                  </h2>
                </div>
                <Graphe3BatonnetComptes
                  graphData2={graphData2}
                  barSpacing2={barSpacing2}
                  CustomTooltip2={CustomTooltip2}
                  fixedWidth2={fixedWidth2}
                />
              </div>
            )}
            {expandSection === "tableau" && (
              <div className="h-full flex justify-between flex-col">
                <div className="w-full flex justify-center items-center py-3 font-bold text-xl">
                  <h2 className="mb-10">{t("Tableau des Comptes")}</h2>
                </div>
                <TableauRecapitulatifComptes isLongueur="true" />
              </div>
            )}
            {expandSection === "userListe" && (
              <div className="overflow-auto min- h-[90vh]">
                <div className="w-full flex justify-center items-center py-3 mt-5-- translate-y-8 font-bold text-xl">
                  <h2 className="mb-0">
                    {t("Liste des utilisateurs")} ({" "}
                    {currentAccountSelected
                      ? currentAccountSelected?.accountUsers?.length
                      : accountUsers?.length}
                    )
                  </h2>
                </div>
                <ListeDesUtilisateur
                  setDocumentationPage={setDocumentationPage}
                  fromExpandSectionDashboard="true"
                />
              </div>
            )}
            {expandSection === "userGroupe" && (
              <div className="overflow-auto min- h-[90vh]">
                <div className="w-full flex justify-center items-center py-3 mt-5-- translate-y-8 font-bold text-xl">
                  <h2 className="mb-0">
                    {t("Liste des Groupes")} ({" "}
                    {currentAccountSelected
                      ? currentAccountSelected?.accountGroupes?.length
                      : accountGroupes?.length}
                    )
                  </h2>
                </div>
                <ListeDesGroupes
                  setDocumentationPage={setDocumentationPage}
                  fromExpandSectionDashboard="true"
                />
              </div>
            )}

            {expandSection === "deviceAlerts" && (
              <div className="overflow-auto min- h-[90vh]">
                <div className="w-full flex justify-center items-center py-3 mt-5-- translate-y-8 font-bold text-xl">
                  <h2 className="mb-0">
                    {t("Liste des Alertes")} (
                    {/* {
                      listeGestionDesVehicules?.flatMap(
                        (device) => device?.véhiculeDetails[0] || []
                      )?.length
                    } */}
                    {
                      (isDashboardHomePage
                        ? listeGestionDesVehicules
                        : dataFusionné
                      )
                        ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                        ?.filter((item) => item?.statusCode !== "0xF952")
                        ?.length
                    }
                    )
                  </h2>
                </div>
                <ListeDesAlertsGestion
                  setDocumentationPage={setDocumentationPage}
                  fromExpandSectionDashboard="true"
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/*  */}
      {/* statistic box */}
      <StatisticDashboard
        setChosseOtherGroupeDashboard={setChosseOtherGroupeDashboard}
        lastUpdate={lastUpdate}
        fetchNewDataDevices={fetchNewDataDevices}
        isLoading2={isLoading2}
        setShowStatisticDeviceListeDashboard={
          setShowStatisticDeviceListeDashboard
        }
        setStatisticFilteredDeviceListe={setStatisticFilteredDeviceListe}
        setStatisticFilteredDeviceListeText={
          setStatisticFilteredDeviceListeText
        }
        animatedTotal={animatedTotal}
        animatedDeplaces={animatedDeplaces}
        animatedEnDéplacement={animatedEnDéplacement}
        DeviceEnStationnement={DeviceEnStationnement}
        animatedStationnement={animatedStationnement}
        DeviceInactifs={DeviceInactifs}
        animatedInactifs={animatedInactifs}
        DeviceDéplacer={DeviceDéplacer}
        EnDéplacement={EnDéplacement}
        allDevices={allDevices}
      />
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* {progressBarForLoadingData}-{progressAnimationStart} */}
      <div className="md:px-4-- pt-4 mx-2 md:mx-0">
        {progressBarForLoadingData > 0 &&
          progressBarForLoadingData < 100 &&
          !fetchVehicleDataFromRapportGroupe &&
          showAnnimationProgresseBarDashboard && (
            <div
              className="rounded-md shadow-sm shadow-black/10 overflow-hidden"
              style={{
                width: "100%",
                background: "#fff",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  width: `${progressAnimationStart}%`,
                  background: "#4caf50",
                  color: "#fff",
                  padding: "4px",
                  transition: "width 1s linear",
                  textAlign: "center",
                }}
              >
                <p className="font-semibold drop-shadow-2xl">
                  {Math.floor(progressAnimationStart)}%
                </p>
              </div>
            </div>
          )}

        {/* Graphe deplacement et graphe des véhicules */}
        <div className="grid grid-cols-1  md:grid-cols-2 items-stretch justify-center  gap-4 ">
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {/* Graphe des comptes */}
          <div
            className={`${
              currentAccountSelected || !isDashboardHomePage
                ? "order-2 md:order-1"
                : ""
            } bg-white shadow-lg shadow-black/5 relative md:col-span-2- justify-between flex flex-col   p-3 h-full rounded-lg`}
          >
            {/* title section */}
            <div className="flex relative   mb-4 justify-between items-end- ">
              {((currentAccountSelected && isDashboardHomePage) ||
                // currentAccountSelected ||

                !isDashboardHomePage) && (
                <div className="  min-w-[14rem]">
                  <div className="font-semibold flex items-center text-lg mb-4-- text-gray-700">
                    <h2>{t("Position des appareils")} </h2>
                    <p
                      onClick={() => {
                        setExpandSection("carte");
                      }}
                      className="font-semibold absolute top-1 right-0 text-sm underline cursor-pointer text-orange-500"
                    >
                      {t("Full Screen")}
                    </p>
                  </div>
                  <p className="text-gray-500">
                    {t("Nombre d'appareils")} (
                    {
                      (isDashboardHomePage
                        ? currentAccountSelected
                          ? currentAccountSelected?.accountDevices
                          : accountDevices
                        : dataFusionné
                      ).filter(
                        (v) =>
                          !(
                            v.lastValidLatitude === "0.0" ||
                            v.lastValidLongitude === "0.0" ||
                            v.lastValidLatitude === "" ||
                            v.lastValidLongitude === "" ||
                            v.véhiculeDetails.length <= 0
                          )
                      )?.length
                    }
                    )
                  </p>
                </div>
              )}

              {!showFistGrapheOption &&
                !currentAccountSelected &&
                isDashboardHomePage && (
                  <div>
                    <div className="  min-w-[14rem]">
                      <div className="font-semibold flex items-center text-lg mb-4-- text-gray-700">
                        <h2>{t("Graphe des Comptes")} </h2>
                        <p
                          onClick={() => {
                            setExpandSection("graphe");
                          }}
                          className="font-semibold absolute top-1 right-0 text-sm underline cursor-pointer text-orange-500"
                        >
                          {t("Full Screen")}
                        </p>
                      </div>
                      <p className="text-gray-500">
                        {t("Nombre de comptes")} ({comptes?.length})
                      </p>
                    </div>
                    <div className="flex   text-[.8rem] absolute bottom-[0rem] right-0 gap-2 sm:gap-4 text-gray-600  ">
                      <div className="flex gap-1 items-center ">
                        <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-green-500">
                          {" "}
                        </p>{" "}
                        <p>{t("Total")}</p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-orange-500">
                          {" "}
                        </p>{" "}
                        <p>{t("Actif")}</p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-purple-500">
                          {" "}
                        </p>{" "}
                        <p>{t("Inactif")}</p>
                      </div>
                    </div>{" "}
                  </div>
                )}
            </div>
            <div className=" max-h-[20rem] flex flex-col justify-between items-start overflow-x-auto overflow-y-hidden">
              {!currentAccountSelected && isDashboardHomePage && (
                <div>
                  <div>
                    <p>.</p>
                    <p>.</p>
                  </div>

                  <Graphe3BatonnetComptes
                    graphData2={graphData2}
                    barSpacing2={barSpacing2}
                    CustomTooltip2={CustomTooltip2}
                    fixedWidth2={fixedWidth2}
                  />
                </div>
              )}
              {(currentAccountSelected || !isDashboardHomePage) && (
                <div className="w-full h-[15rem]-- relative overflow-hidden rounded-md">
                  <LocationPage fromDashboard="true" />
                  {!unlockCarteScroll && (
                    <div className="absolute flex justify-center items-center inset-0 bg-black/10 z-[8]">
                      <div
                        onClick={() => {
                          setUnlockCarteScroll(true);
                        }}
                        className="w-[2.5rem] h-[2.5rem] flex justify-center items-center  rounded-full bg-white shadow-lg shadow-black/20 text-orange-500  cursor-pointer"
                      >
                        <FaUnlockAlt className="text-[1.3rem]" />
                      </div>
                    </div>
                  )}
                  {unlockCarteScroll && (
                    <div
                      onClick={() => {
                        setUnlockCarteScroll(false);
                      }}
                      className="absolute w-[2.5rem] h-[2.5rem] flex justify-center items-center  rounded-full bg-white shadow-lg shadow-black/20 text-orange-500 z-[8] top-[5.5rem] right-1 cursor-pointer"
                    >
                      <MdLockOutline className="text-[1.5rem]" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* )} */}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/* Graphe des Appareils */}
          <div
            className={`${
              currentAccountSelected || !isDashboardHomePage
                ? "order-1 md:order-1"
                : ""
            } bg-white shadow-lg shadow-black/5 relative flex flex-col justify-between- p-3 md:col-span-1- rounded-lg`}
          >
            <div className="flex items-center- items-start   mb-8">
              {showFistGrapheOption2 && (
                <h2 className="font-semibold text-lg text-gray-700">
                  {t("Tous les appareils")}
                </h2>
              )}
              {!showFistGrapheOption2 &&
                !currentAccountSelected &&
                isDashboardHomePage && (
                  <div className="flex w-full justify-between items-center">
                    <h2 className="font-semibold text-lg text-gray-700">
                      {t("Tableau des comptes")} ({comptes?.length})
                    </h2>
                    <p
                      onClick={() => {
                        setExpandSection("tableau");
                      }}
                      className="font-semibold absolute-- top-4 right-4 text-sm underline cursor-pointer text-orange-500"
                    >
                      {t("Full Screen")}
                    </p>
                  </div>
                )}

              {(currentAccountSelected || !isDashboardHomePage) && (
                <div>
                  <h2 className="font-semibold text-lg text-gray-700">
                    {t("Liste des Appareils")}
                  </h2>
                  <p
                    onClick={() => {
                      // setExpandSection("tableau");
                      // setDocumentationPage("Gestion_des_appareils");
                      setShowStatisticDeviceListeDashboard(true);
                      setStatisticFilteredDeviceListe(allDevices);
                      setStatisticFilteredDeviceListeText(
                        `${t("Tous les Appareils")}`
                      );
                    }}
                    className="font-semibold absolute top-4 right-4 text-sm underline cursor-pointer text-orange-500"
                  >
                    {t("Voir tous")}
                  </p>

                  <p className="text-gray-500">
                    {t("Nombre d'appareils")} (
                    {
                      (isDashboardHomePage
                        ? listeGestionDesVehicules
                        : dataFusionné
                      )?.length
                    }
                    )
                  </p>
                </div>
              )}
              {/* {!currentAccountSelected && ( */}
            </div>
            <div className="  rounded-md overflow-hidden ">
              {!currentAccountSelected && isDashboardHomePage && (
                <TableauRecapitulatifComptes isLongueur="false" />
              )}
              {(currentAccountSelected || !isDashboardHomePage) && (
                <DeviceListeDashboard />
              )}

              {/* {showFistGrapheOption2 && <GrapheCirculaireDevices />} */}
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {showFistGrapheOption2 && (
              <div className="flex  border-- border-purple-500 p-2 rounded-md bg-white/50-- shadow-lg- shadow-black/10 absolute left-1 right-1- top-[.7rem]- bottom-1 text-xs mt-6 flex-col- flex-wrap text-gray-600  gap-3 gap-y-0 items-start">
                <div className="flex  gap-1 items-center">
                  <p className="w-[.6rem] h-[.6rem] rounded-full bg-purple-500">
                    {" "}
                  </p>{" "}
                  <p>
                    {t("Hors service")} ({DeviceInactifs?.length})
                  </p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="w-[.6rem] h-[.6rem] rounded-full bg-green-500">
                    {" "}
                  </p>{" "}
                  <p>
                    {t("Déplacés")} ({DeviceDéplacer?.length})
                  </p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="w-[.6rem] h-[.6rem] rounded-full bg-orange-500">
                    {" "}
                  </p>{" "}
                  <p>
                    {t("Actifs")} ({DeviceEnStationnement?.length})
                  </p>
                </div>
              </div>
            )}
          </div>
          {/*  */}

          {/*  */}
        </div>

        {!currentAccountSelected && isDashboardHomePage && (
          <div className="w-full relative bg-white min-h-[15rem] max-h-[20rem] overflow-hidden rounded-lg mt-4">
            <div className="w-full overflow-hidden rounded-md z-0">
              <LocationPage fromDashboard="true" />
            </div>

            {!unlockCarteScroll && (
              <div className="absolute flex justify-center items-center inset-0 bg-black/20 z-[8]">
                <div
                  onClick={() => {
                    setUnlockCarteScroll(true);
                  }}
                  className="w-[2.5rem] h-[2.5rem] flex justify-center items-center  rounded-full bg-white shadow-lg shadow-black/20 text-orange-500  cursor-pointer"
                >
                  <FaUnlockAlt className="text-[1.3rem]" />
                </div>
              </div>
            )}

            {/* {!expandSection && ( */}
            <div
              onClick={() => {
                setExpandSection("carte");
              }}
              className="absolute w-[2.5rem] h-[2.5rem] flex justify-center items-center  rounded-full bg-white shadow-lg shadow-black/20 text-orange-500 z-[8] top-5 right-1 cursor-pointer"
            >
              <ImEnlarge className="text-[1.1rem]" />
            </div>
            {unlockCarteScroll && (
              <div
                onClick={() => {
                  setUnlockCarteScroll(false);
                }}
                className="absolute w-[2.5rem] h-[2.5rem] flex justify-center items-center  rounded-full bg-white shadow-lg shadow-black/20 text-orange-500 z-[8] top-[5.5rem] right-1 cursor-pointer"
              >
                <MdLockOutline className="text-[1.5rem]" />
              </div>
            )}
            {/* )} */}
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="bg-orange-100 shadow-inner md:col-span-2 shadow-black/10 -300/80 mt-6 p-3 rounded-lg">
            <div className="flex mb-4 justify-between items-center ">
              <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                {t("Tous les Alertes")} (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountDevices
                        ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                        ?.filter((item) => item?.statusCode !== "0xF952")
                        ?.length
                    : accountDevices
                        ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                        ?.filter((item) => item?.statusCode !== "0xF952")
                        ?.length
                  : dataFusionné
                      ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                      ?.filter((item) => item?.statusCode !== "0xF952")?.length}
                )
              </h2>
              <button
                onClick={() => {
                  if (!isDashboardHomePage) {
                    setListeGestionDesVehicules(dataFusionné);
                  } else if (currentAccountSelected) {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                  } else {
                    setListeGestionDesVehicules(accountDevices);
                  }
                  setExpandSection("deviceAlerts");
                }}
                className="py-1 text-sm px-4 rounded-md bg-orange-500 text-white font-semibold"
              >
                {t("Voir tous")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2-- gap-3">
              {TouslesAlertesData ? (
                TouslesAlertesData?.map((details, index) => {
                  const code = parseInt(details.statusCode, 16);
                  const codeDescription =
                    statusDescriptions[code] || "Statut inconnu";
                  const bgColor = getBackgroundColor(code);
                  const currentDevice = accountDevices?.find(
                    (d) => d.deviceID === details.deviceID
                  );
                  return (
                    <div
                      key={index}
                      onClick={() => {}}
                      className="shadow-lg- shadow-lg -inner-- border- border-orange-200 /0  relative overflow-hidden-- bg-gray-50 /50 shadow-black/10 flex gap-3 items-center- rounded-lg py-[.85rem] px-2 "
                    >
                      <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                        {index + 1}
                      </p>
                      <FiAlertCircle className="text-orange-500/80 hidden md:block min-w-[2.5rem] text-[2.5rem] mt-1" />
                      <div>
                        <FiAlertCircle className="text-orange-500/80 md:hidden min-w-[2.5rem] text-[2.5rem] mt-1" />

                        <p className="text-gray-600">
                          {t("Alerte")} :{" "}
                          <span className="font-bold">{codeDescription}</span>{" "}
                        </p>
                        <p className="text-gray-600">
                          {t("Code")} :{" "}
                          <span className="font-bold">
                            {details?.statusCode}
                          </span>{" "}
                        </p>
                        <p className="text-gray-600">
                          {t("Description")} :{" "}
                          <span className="font-bold">
                            {currentDevice?.description}
                          </span>{" "}
                        </p>
                        <p className="text-gray-600">
                          {t("Account ID")} :{" "}
                          <span className="font-bold notranslate ">
                            {details?.accountID}
                          </span>{" "}
                        </p>
                        <p className="text-gray-600 notranslate">
                          {t("Adresse")} :{" "}
                          <span className="notranslate">
                            <span className="font-bold notranslate">
                              {details?.address ||
                                `${t("Pas d'adresse disponible")}`}
                            </span>{" "}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          {t("Last update")} :{" "}
                          <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                            {FormatDateHeure(details?.timestamp).date}
                            <span className="px-2">/</span>{" "}
                            {FormatDateHeure(details?.timestamp).time}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full   justify-center items-center font-semibold text-lg">
                  <p className="mb-10 md:mt-20">{t("Pas de résultat")}</p>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 flex overflow-hidden flex-col justify-between bg-orange-100-- bg-white shadow-lg shadow-black/10 rounded-lg mt-6">
            <h2 className="font-semibold text-lg m-2 mb-0 mb-4-- text-gray-700">
              {t("Chart des Alertes")} (
              {isDashboardHomePage
                ? currentAccountSelected
                  ? currentAccountSelected?.accountDevices
                      ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                      ?.filter((item) => item?.statusCode !== "0xF952")?.length
                  : accountDevices
                      ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                      ?.filter((item) => item?.statusCode !== "0xF952")?.length
                : dataFusionné
                    ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                    ?.filter((item) => item?.statusCode !== "0xF952")?.length}
              )
            </h2>

            {dataPieChart?.length > 0 ? (
              <div className="w-full h-[15rem] scale-110 mt-10-- ">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dataPieChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataPieChart?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipChartPie />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-full   justify-center items-center font-semibold text-lg">
                <p className="mb-10 md:mt-20">{t("Pas de résultat")}</p>
              </div>
            )}
            <div className=" rounded-lg max-h-[6rem] flex flex-col gap-1 px-3 mb-2 overflow-auto">
              {dataPieChart
                ?.filter((item) => item?.statusCode !== "0xF952")
                ?.map((status, index) => {
                  const code = parseInt(status?.name, 16);
                  const codeDescription =
                    statusDescriptions[code] || `${t("Statut inconnu")}`;
                  const color = COLORS[index % COLORS.length]; // correspondance avec le PieChart

                  return (
                    <div key={index} className="flex gap-3 items-center">
                      <div
                        style={{ backgroundColor: color }}
                        className="min-w-[1rem] min-h-[1rem] rounded-full bg-orange-600--"
                      ></div>
                      <p>{status?.name}</p>
                      <p className="whitespace-nowrap">
                        {codeDescription} ({status?.value})
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Other info */}
        {isDashboardHomePage && (
          <div className="grid grid-cols-1 mt-5 md:grid-cols-2 items-stretch justify-center  gap-4 ">
            <div className="bg-white shadow-lg shadow-black/5 md:col-span-2-  p-3 h-full rounded-lg">
              <div className="flex mb-4 justify-between items-end ">
                <div className=" flex w-full justify-between items-center">
                  <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                    {t("Tous les Utilisateurs")} (
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
                      setExpandSection("userListe");
                      // setDocumentationPage("Gestion_des_utilisateurs");
                      // scrollToTop();
                    }}
                    className="py-1 text-sm px-4 rounded-md bg-orange-500 text-white font-semibold"
                  >
                    {t("Voir tous")}
                  </button>
                </div>
              </div>
              <div className="h-full max-h-[20rem]-- flex flex-col gap-4 overflow-auto-- overflow-hidden--">
                {(currentAccountSelected
                  ? currentAccountSelected?.accountUsers
                  : [
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
                    ]
                )?.slice(0, 3)?.length > 0 ? (
                  (currentAccountSelected
                    ? currentAccountSelected?.accountUsers
                    : [
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
                      ]
                  )
                    ?.slice(0, 3)
                    .map((user, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {}}
                          className="shadow-lg- shadow-inner border- border-gray-200 cursor-pointer relative overflow-hidden-- bg-gray-50 /50 shadow-black/10 flex gap-3 items-center- rounded-lg py-[.85rem] px-2 "
                        >
                          <FaUserCircle className="text-orange-500/80 text-[2.5rem] mt-1" />
                          <div>
                            <p className="text-gray-600">
                              {t("Nom de l'utilisateur")} :{" "}
                              <span className="font-bold notranslate">
                                {user?.description}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              {t("Account ID")} :{" "}
                              <span className="font-bold notranslate">
                                {user?.accountID}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              {t("Nombre d'appareil")} :{" "}
                              <span className="font-bold">
                                {user?.userDevices?.length}
                              </span>{" "}
                            </p>

                            <p className="text-gray-600">
                              {t("Nombre de Groupe")} :{" "}
                              <span className="font-bold">
                                {user?.userGroupes?.length}
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex h-full   justify-center items-center font-semibold text-lg">
                    <p className="mb-10 md:mt-10">{t("Pas de résultat")}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg shadow-black/5 flex flex-col justify-between p-3 md:col-span-1- mt-10 md:mt-0 rounded-lg">
              <div className=" flex pb-4 w-full justify-between items-center">
                <h2 className="font-semibold text-lg mb-4-- text-gray-700">
                  {t("Tous les Groupes")} (
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
                      setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
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
                      setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
                    }
                    setExpandSection("userGroupe");
                    // setDocumentationPage("Gestion_des_groupes");
                    // scrollToTop();
                  }}
                  className="py-1 text-sm px-4 rounded-md bg-orange-500 text-white font-semibold"
                >
                  {t("Voir tous")}
                </button>
              </div>
              <div className=" flex flex-col gap-4  h-full max-h-[20rem]-- overflow-y-auto--">
                {(currentAccountSelected
                  ? currentAccountSelected?.accountGroupes
                  : Array.from(
                      new Map(
                        gestionAccountData
                          ?.flatMap((account) => account.accountGroupes)
                          ?.map((group) => [group.groupID, group])
                      ).values()
                    )
                )?.slice(0, 4)?.length > 0 ? (
                  (currentAccountSelected
                    ? currentAccountSelected?.accountGroupes
                    : Array.from(
                        new Map(
                          gestionAccountData
                            ?.flatMap((account) => account.accountGroupes)
                            ?.map((group) => [group.groupID, group])
                        ).values()
                      )
                  )
                    ?.slice(0, 4)
                    ?.map((user, index) => {
                      return (
                        <div
                          key={index}
                          className="shadow-lg-- shadow-inner shadow-gray-500/10  cursor-pointer relative overflow-hidden-- bg-gray-50 /50 shadow-black/10-- flex gap-3 items-center- rounded-lg py-2 px-2 "
                        >
                          {/* <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                        {index + 1}
                      </p> */}
                          <PiIntersectThreeBold className="text-orange-500/80 text-[2.5rem] mt-1" />
                          <div>
                            <p className="text-gray-600">
                              {t("Account ID")} :{" "}
                              <span className="font-bold notranslate notranslate">
                                {user?.accountID}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              {t("Nom du Groupe")} :{" "}
                              <span className="font-bold notranslate">
                                {user?.description || "---"}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              {t("Nombre d'appareil")} :{" "}
                              <span className="font-bold">
                                {user?.groupeDevices?.length}
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex h-full   justify-center items-center font-semibold text-lg">
                    <p className="mb-10 md:mt-20">{t("Pas de résultat")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardContaintMaintComponant;
