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
  FaAngleDoubleRight,
  FaCar,
  FaChevronDown,
  FaSearch,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { GoDot } from "react-icons/go";
import { DataContext } from "../../context/DataContext";
import LocationPage from "../../pages/LocationPage";
import ListeDesVehiculesGestion from "../../pages/ListeDesVehiculesGestion";

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

  const DeviceDéplacer = allDevices?.filter((device) => {
    return device?.lastStopTime > todayTimestamp;
  });

  const DeviceEnStationnement = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime < twentyFourHoursInSec;
  });

  const DeviceInactifs = allDevices?.filter((device) => {
    return currentTimeSec - device?.lastUpdateTime > twentyFourHoursInSec;
  });

  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedDeplaces, setAnimatedDeplaces] = useState(0);
  const [animatedStationnement, setAnimatedStationnement] = useState(0);
  const [animatedInactifs, setAnimatedInactifs] = useState(0);

  const preparationDownloadPDF = false;

  // function animateValue(start, end, duration, setter) {
  //   const startTime = performance.now();

  //   function animate(currentTime) {
  //     const elapsed = currentTime - startTime;
  //     const progress = Math.min(elapsed / duration, 1);
  //     const value = start + (end - start) * progress;
  //     setter(parseFloat(value.toFixed(1)));

  //     if (progress < 1) {
  //       requestAnimationFrame(animate);
  //     }
  //   }

  //   requestAnimationFrame(animate);
  // }

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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //

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
            AccountID : <span className="font-bold">{accountID}</span>{" "}
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

  const MIN_DISPLAY = 2; // px ou unité relative

  // const transformValue = (value) => {
  //   if (value === 0) return MIN_DISPLAY;
  //   if (value <= 10) return Math.max(value * 7.5, MIN_DISPLAY);
  //   return Math.max(75 + (value - 10) * 0.5, MIN_DISPLAY);
  // };

  // const transformValue = (value) => {
  //   if (value === 0) return MIN_DISPLAY;
  //   if (value <= 20) return Math.max(value * 3.75, MIN_DISPLAY);
  //   return Math.max(75 + (value - 20) * 0.5, MIN_DISPLAY);
  // };
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
          account?.description?.slice(0, 6) +
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

  const graphData2 = formatBarData(gestionAccountData)?.sort(
    (a, b) => b.total - a.total
  );
  const barSpacing2 = 70;
  const fixedWidth2 = graphData2?.length * barSpacing2;

  // Custom Tooltip pour afficher les vraies valeurs
  const CustomTooltip2 = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-lg rounded p-2 text-sm border border-gray-100">
          <p className="font-semibold">{data.name}</p>
          <p>
            Total : <span className="font-bold">{data.total}</span>
          </p>
          <p>
            Inactifs : <span className="font-bold">{data.inactifs}</span>
          </p>
          <p>
            Actifs : <span className="font-bold">{data.actifs}</span>
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

  // const layers = [
  //   buildCircle(
  //     90,
  //     14,
  //     inactivPct,
  //     "rgba(147,51,234,1)",
  //     "rgba(147,51,234,0.1)"
  //   ), // purple
  //   // buildCircle(90, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"), // green

  //   buildCircle(
  //     70,
  //     14,
  //     parkingPct,
  //     "rgba(251,146,60,1)",
  //     "rgba(251,146,60,0.1)"
  //   ), // orange
  //   // buildCircle(70, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"),// green

  //   buildCircle(50, 14, activePct, "rgba(34,197,94,1)", "rgba(34,197,94,0.1)"), // green
  // ];

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
    const id = account;
    const pwd = password;
    const user = "admin";

    fetchAllComptes(adminAccount, adminUser, adminPassword);

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

  const [showFistGrapheOption, setShowFistGrapheOption] = useState(false);
  const [showFistGrapheOption2, setShowFistGrapheOption2] = useState(false);

  function TableauRecapitulatifComptes() {
    return (
      <div className={`w-full  overflow-x-auto overflow-y-hidden h-[20rem]`}>
        {/* fixed header */}
        <thead>
          <div className="h-auto border-l-2-- border-red-600- min- w-full -w-[150rem] w-full-">
            <tr className="bg-orange-100 border-2 border-green-600 relative z-20 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
              {/* <th className="border min-w-[.4rem] dark:border-gray-600 py-2 ----- --px-1"></th> */}
              <th className="border  min-w-[3.21rem]  dark:border-gray-600 py-2 ---- px-2">
                #
              </th>
              <th className="border min-w-[12rem] dark:border-gray-600 py-2 ---- px-2">
                Compte
              </th>
              <th className="border dark:border-gray-600 min-w-[6rem] py-2 ---- px-2">
                Total
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Déplacés
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Actifs
              </th>

              <th className="border  min-w-[8rem] dark:border-gray-600 py-2 ---- px-2">
                Hors service
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Utilisateurs
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Groupes
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Geofences
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Type
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Manager
              </th>
              <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
                Activer
              </th>
            </tr>
          </div>
        </thead>

        <div
          className={`border-2 pb-10 -translate-y-[3.1rem] w-full min-w-[78rem] overflow-y-auto overflow-x-hidden ${
            preparationDownloadPDF ? "" : "md:h-[25rem] h-[20rem]"
          }`}
        >
          {/* en-tête PDF, téléchargement… */}

          <table
            id="myTable"
            className="w-full-- text-left dark:bg-gray-800 dark:text-gray-200 border-2 border-red-500-- "
          >
            {/* second fixed header */}
            <thead>
              <tr className="bg-orange-50 h-[2.8rem]   text-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {/* <th className=""></th> */}
                <th className="">#</th>
                <th className="">Compte</th>
                <th className="">Total </th>
                <th className="">Déplacés</th>
                <th className="">Actifs</th>
                <th className="">Hors service</th>
                <th className="">Utilisateurs</th>
                <th className="">Groupes</th>
                <th className="">Geofences</th>
                <th className="">Type</th>
                <th className="">Manager</th>
                <th className="">Actif</th>
              </tr>
            </thead>
            <tbody>
              {gestionAccountData
                ?.slice()
                .sort(
                  (a, b) =>
                    (b.accountDevices?.length || 0) -
                    (a.accountDevices?.length || 0)
                )
                .map((acct, i) => {
                  const totalDevices = acct.accountDevices?.length || 0;
                  const movedDevices = acct.accountDevices?.filter(
                    (d) => d.lastStopTime > todayTimestamp
                  ).length;
                  const activeDevices = acct.accountDevices?.filter(
                    (d) =>
                      currentTimeSec - d.lastUpdateTime < twentyFourHoursInSec
                  ).length;
                  const inactiveDevices = acct.accountDevices?.filter(
                    (d) =>
                      currentTimeSec - d.lastUpdateTime >= twentyFourHoursInSec
                  ).length;
                  const nbUsers = acct.accountUsers?.length || 0;
                  const nbGroups = acct.accountGroupes?.length || 0;
                  const nbGeofences = acct.accountGeofences?.length || 0;

                  return (
                    <tr key={i} className="border dark:border-gray-600">
                      {/* <td className="border-l-4 w-0"></td> */}
                      <td className="py-3  w-[3rem] px-2 border">{i + 1}</td>
                      <td className="py-3 px-2 w-[12rem] border">
                        {acct.accountID}
                      </td>
                      <td className="py-3 w-[6rem] px-2 border">
                        {totalDevices}
                      </td>
                      <td className="py-3 px-2 border w-[6rem]">
                        {movedDevices}
                      </td>
                      <td className="py-3 px-2 border w-[6rem]">
                        {activeDevices}
                      </td>
                      <td className="py-3 px-2 border w-[8rem]">
                        {inactiveDevices}
                      </td>
                      <td className="py-3 px-2 border w-[6rem]">{nbUsers}</td>
                      <td className="py-3 px-2 border w-[6rem]">{nbGroups}</td>
                      <td className="py-3 px-2 border w-[6rem]">
                        {nbGeofences}
                      </td>
                      <td className="py-3 px-2 border w-[6rem]">
                        {acct.accountType}
                      </td>
                      <td className="py-3 px-2 border w-[6rem]">
                        {acct.isAccountManager}
                      </td>
                      <td className="py-3 min-w-[5rem] px-2">
                        {acct.isActive}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

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

  function Graphe3BatonnetComptes() {
    return (
      <div>
        {graphData2?.length > 0 ? (
          <div
            className="w-full flex -translate-y-6 flex-col justify-end h-[300px] overflow-x-auto p-4 bg-gray-100 rounded-xl"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div style={{ width: `${fixedWidth2}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={graphData2}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 0, bottom: -10 }}
                  barCategoryGap={barSpacing2 - 10}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortName"
                    type="category"
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip2 />} />
                  <Bar
                    dataKey="totalDisplay"
                    fill="#22c55e"
                    name="Total"
                    radius={[8, 8, 0, 0]}
                    barSize={7}
                    animationDuration={1000}
                  />

                  <Bar
                    dataKey="inactifsDisplay"
                    fill="#9333ea"
                    name="Inactifs"
                    radius={[8, 8, 0, 0]}
                    barSize={7}
                    animationDuration={1000}
                  />

                  <Bar
                    dataKey="actifsDisplay"
                    fill="#f97316"
                    name="Actifs"
                    radius={[8, 8, 0, 0]}
                    barSize={7}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-full flex justify-center items-center">
            <p className="py-10 font-semibold text-lg text-gray-600">
              Pas de données disponibles
            </p>
          </div>
        )}
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

  function DeviceListeDashboard() {
    return (
      <div className=" flex flex-col gap-4  h-full max-h-[20rem]-- overflow-y-auto-">
        {(currentAccountSelected
          ? currentAccountSelected?.accountDevices
          : Array.from(
              new Map(
                gestionAccountData
                  ?.flatMap((account) => account.accountDevices)
                  ?.map((device) => [device.deviceID, device])
              ).values()
            )
        )
          ?.slice(0, 3)
          .sort((a, b) => b.lastUpdateTime - a.lastUpdateTime)
          ?.map((device, index) => {
            let border_color = "bg-gray-50";
            let text_color = "text-orange-500/80";

            if (
              currentTimeSec - device?.lastUpdateTime <
              twentyFourHoursInSec
            ) {
              border_color = "border-l-[.4rem] border-orange-400";
              text_color = "text-orange-400";
            } else if (
              currentTimeSec - device?.lastUpdateTime >
              twentyFourHoursInSec
            ) {
              border_color = "border-l-[.4rem] border-purple-300";
              text_color = "text-purple-400";
            }

            if (device?.lastStopTime > todayTimestamp) {
              border_color = "border-l-[.4rem] border-green-500";
              text_color = "text-green-400";
            }

            return (
              <div
                key={index}
                onClick={() => {}}
                className={`${border_color} bg-gray-50 shadow-lg-- shadow-inner shadow-gray-500/10  cursor-pointer relative overflow-hidden-- 50 shadow-black/10-- flex gap-3 items-center- rounded-lg py-[1rem] px-2 `}
              >
                {/* <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                  {index + 1}
                </p> */}
                <FaCar
                  className={`${text_color} text-[2rem] hidden sm:block min-w-[2.5rem] mt-1`}
                />
                <div className="flex flex-col gap-1 ">
                  <FaCar
                    className={`${text_color} text-[2rem] sm:hidden min-w-[2.5rem] mt-1`}
                  />
                  <p className="text-gray-600 font-bold">
                    Nom du Groupe :{" "}
                    <span className="font-normal text-gray-500 ml-2">
                      {device?.description}
                    </span>{" "}
                  </p>
                  <p className="text-gray-600 font-bold">
                    Last Update :{" "}
                    <span className="font-normal text-gray-500 ml-2">
                      {FormatDateHeure(device?.lastUpdateTime)?.date} {" / "}
                      {FormatDateHeure(device?.lastUpdateTime)?.time}
                    </span>{" "}
                  </p>
                  {/* <p className="text-gray-600 font-bold">
                    Arrivée : 
                    <span className="font-normal text-gray-500 ml-2">
                      {FormatDateHeure(device?.lastStopTime)?.date} {" / "}
                      {FormatDateHeure(device?.lastStopTime)?.time}
                    </span>{" "}
                  </p> */}
                  {/* <p className="text-gray-600">
                    Derniere Heure :{" "}
                    <span className="font-bold">
                      {FormatDateHeure(device?.lastUpdateTime)?.time}
                    </span>{" "}
                  </p> */}
                </div>
              </div>
            );
          })}
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
  // Fonction pour avoir le dernier timestamp, pour calculer la dernière mise a jour
  // function getMostRecentTimestamp(data) {
  //   // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
  //   const validTimestamps = data
  //     .filter(
  //       (véhicule) =>
  //         Array.isArray(véhicule?.véhiculeDetails) &&
  //         véhicule?.véhiculeDetails.length > 0
  //     )
  //     .map((véhicule) => parseInt(véhicule?.véhiculeDetails[0].timestamp));

  //   // Trouver le timestamp le plus récent
  //   const mostRecentTimestamp = Math.max(...validTimestamps);

  //   return { mostRecentTimestamp };
  // }

  function getMostRecentTimestamp(data) {
    if (data) {
      console.log("data...............", data);
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
  const data = currentAccountSelected?.accountDevices || accountDevices;

  // Mettre à jour le timestamp le plus récent lorsque "data" change
  useEffect(() => {
    const result = getMostRecentTimestamp(data);
    if (result) {
      setLastUpdate(result); // garde l'objet { mostRecentTimestamp }
    }
    console.log("result", result);
  }, [listeGestionDesVehicules, currentAccountSelected, accountDevices]);

  return (
    <div className="pb-6-">
      {showStatisticDeviceListeDashboard && (
        <div className="fixed px-3 inset-0 bg-black/50 z-[99999999999999999999] flex justify-center items-center">
          <div className="bg-white overflow-hidden relative rounded-lg w-full md:max-w-[80vw]">
            <div className="absolute flex justify-center items-center top-0 left-0 right-0 h-[4rem] bg-orange-200 z-[999]">
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
                  // setChooseOneAccountToContinue={setChooseOneAccountToContinue}
                  // setChooseOtherAccountGestion={setChooseOtherAccountGestion}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* statistic box */}
      <div className="md:px-4-- pt-3--">
        <div className="w-full h-full bg-white rounded-lg p-4">
          <div className=" relative mb-4 ">
            <div className="">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="font-bold md:hidden text-[1.1rem] md:text-xl text-gray-800">
                  Pour Aujourd'hui
                </h1>
                <h1 className="font-bold hidden md:block text-[1.1rem] md:text-xl text-gray-800">
                  Statistiques pour aujourd'hui
                </h1>
              </div>
              <p className="  font-semibold max-w-[12rem] sm:max-w-[24rem]  whitespace-nowrap text-ellipsis overflow-hidden text-orange-500">
                <span className="mr-1  text-gray-600">Compte :</span>
                {currentAccountSelected
                  ? currentAccountSelected?.description
                  : "Tous les comptes"}
              </p>
            </div>
            {currentAccountSelected && (
              <div
                onClick={() => {
                  setChosseOtherGroupeDashboard(true);
                }}
                className=" cursor-pointer text-orange-500 flex gap-1 sm:gap-3 items-center absolute right-0  rounded-lg -bottom-0 sm:bottom-0"
              >
                <p className="font-semibold hidden sm:block">
                  Sélectionner un Groupe
                </p>
                <p className="font-semibold sm:hidden">Groupe</p>
                <FaChevronDown className="mt-1" />
              </div>
            )}

            <div className="  flex gap-1 sm:gap-3 items-center absolute right-0 py-2  rounded-lg bottom-4 ">
              {lastUpdate?.mostRecentTimestamp && (
                <p className="font-semibold flex items-center text-[.8rem] md:text-[.9rem] text-gray-700">
                  <span className="hidden md:block mr-2">Last Update</span>
                  {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
                  {" / "}
                  {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
                </p>
              )}
              <div
                onClick={() => {
                  fetchNewDataDevices();
                }}
                className={`${
                  isLoading2 ? "animate-spin" : ""
                }  text-orange-500 min-w-2  translate-y-1-- md:translate-y-0 cursor-pointer   dark:text-gray-200 `}
              >
                <MdUpdate className="sm:text-[1.35rem]  text-[1.2rem]  " />
              </div>
            </div>
          </div>

          {/* Liste des statistics */}
          <div className="grid grid-cols-2 gap-1.5 md:gap-4 md:grid-cols-4 items-center justify-between">
            {/*  */}
            <div
              onClick={() => {
                setShowStatisticDeviceListeDashboard(true);
                setStatisticFilteredDeviceListe(allDevices);
                setStatisticFilteredDeviceListeText("Tous les Appareils");
              }}
              className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
            >
              <div className="border border-blue-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-blue-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Total
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {/* {allDevices?.length} */}
                    {animatedTotal}
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
            <div
              onClick={() => {
                setShowStatisticDeviceListeDashboard(true);
                setStatisticFilteredDeviceListe(DeviceDéplacer);
                setStatisticFilteredDeviceListeText("Appareils Déplacer");
              }}
              className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
            >
              <div className="border border-green-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-green-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Déplacés
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {/* {DeviceDéplacer?.length} */}
                    {animatedDeplaces}
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
            <div
              onClick={() => {
                setShowStatisticDeviceListeDashboard(true);
                setStatisticFilteredDeviceListe(DeviceEnStationnement);
                setStatisticFilteredDeviceListeText("Appareils Actifs");
              }}
              className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
            >
              <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Actifs
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {/* {DeviceEnStationnement?.length} */}
                    {animatedStationnement}
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
            <div
              onClick={() => {
                setShowStatisticDeviceListeDashboard(true);
                setStatisticFilteredDeviceListe(DeviceInactifs);
                setStatisticFilteredDeviceListeText("Appareils Inactifs");
              }}
              className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
            >
              <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
                <div>
                  <div className="flex items-center  gap-2">
                    <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                      Inactifs
                    </h3>
                  </div>
                  <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                    {/* {DeviceInactifs?.length} */}
                    {animatedInactifs}
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
          {/* Graphe de déplacement */}
          {/* {(currentAccountSelected ||
            (!showFistGrapheOption && !currentAccountSelected)) && (
            <GrapheDeDeplacementDesAppareils />
          )} */}

          {/* Graphe des comptes */}
          {/* {!currentAccountSelected && showFistGrapheOption && ( */}
          <div className="bg-white relative md:col-span-2- justify-between flex flex-col   p-3 h-full rounded-lg">
            {/* title section */}
            <div className="flex relative   mb-4 justify-between items-end- ">
              {((showFistGrapheOption && !currentAccountSelected) ||
                currentAccountSelected) && (
                <div className="  min-w-[14rem]">
                  <div className="font-semibold flex items-center text-lg mb-4-- text-gray-700">
                    <h2>Position des appareils </h2>
                    <p
                      onClick={() => {
                        setDocumentationPage("Localisation_devices");
                      }}
                      className="font-semibold absolute top-1 right-0 text-sm underline cursor-pointer text-orange-500"
                    >
                      Voir tous
                    </p>
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
                    Nombre d'appareils ({listeGestionDesVehicules?.length})
                  </p>
                </div>
              )}

              {!showFistGrapheOption && !currentAccountSelected && (
                <div>
                  <div className="  min-w-[14rem]">
                    <div className="font-semibold flex items-center text-lg mb-4-- text-gray-700">
                      <h2>Graphe des Comptes </h2>
                      {/* {!currentAccountSelected && (
                        <FaAngleDoubleRight
                          onClick={() => {
                            setShowFistGrapheOption(!showFistGrapheOption);
                          }}
                          className="text-xl ml-3 mt-1 cursor-pointer"
                        />
                      )} */}
                    </div>
                    <p className="text-gray-500">
                      Nombre de comptes ({comptes?.length})
                    </p>
                  </div>
                  <div className="flex   text-[.8rem] absolute bottom-[0rem] right-0 gap-2 sm:gap-4 text-gray-600  ">
                    <div className="flex gap-1 items-center ">
                      <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-green-500">
                        {" "}
                      </p>{" "}
                      <p>Total</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-orange-500">
                        {" "}
                      </p>{" "}
                      <p>Actif</p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="w-[.6rem] sm:w-[.7rem] h-[.6rem] sm:h-[.7rem] rounded-full bg-purple-500">
                        {" "}
                      </p>{" "}
                      <p>Inactif</p>
                    </div>
                  </div>{" "}
                </div>
              )}
            </div>
            <div className=" max-h-[20rem] flex flex-col justify-between items-start overflow-x-auto overflow-y-hidden">
              {/* {!showFistGrapheOption && !currentAccountSelected && ( */}
              {!currentAccountSelected && (
                <div>
                  <div>
                    <p>.</p>
                    <p>.</p>
                  </div>

                  <Graphe3BatonnetComptes />
                </div>
              )}
              {
                // {((showFistGrapheOption && !currentAccountSelected) ||
                currentAccountSelected && (
                  <div className="w-full h-[15rem]-- overflow-hidden rounded-md">
                    <LocationPage fromDashboard="true" />
                  </div>
                )
              }
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
          <div className="bg-white relative flex flex-col justify-between- p-3 md:col-span-1- rounded-lg">
            <div className="flex items-center- items-start   mb-8">
              {showFistGrapheOption2 && (
                <h2 className="font-semibold text-lg text-gray-700">
                  Tous les appareils
                </h2>
              )}
              {!showFistGrapheOption2 && !currentAccountSelected && (
                <h2 className="font-semibold text-lg text-gray-700">
                  Tableau des comptes
                </h2>
              )}

              {currentAccountSelected && (
                <div>
                  <h2 className="font-semibold text-lg text-gray-700">
                    Liste des Appareils
                  </h2>
                  <p
                    onClick={() => {
                      setDocumentationPage("Gestion_des_appareils");
                    }}
                    className="font-semibold absolute top-4 right-4 text-sm underline cursor-pointer text-orange-500"
                  >
                    Voir tous
                  </p>

                  <p className="text-gray-500">
                    Nombre d'appareils ({listeGestionDesVehicules?.length})
                  </p>
                </div>
              )}
              {/* {!currentAccountSelected && ( */}
              {/* <FaAngleDoubleRight
                onClick={() => {
                  setShowFistGrapheOption2(!showFistGrapheOption2);
                }}
                className="text-xl ml-3 mt-1.5 cursor-pointer"
              /> */}
              {/* )} */}
            </div>
            <div className="  rounded-md overflow-hidden ">
              {!currentAccountSelected && <TableauRecapitulatifComptes />}
              {currentAccountSelected && <DeviceListeDashboard />}

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
                  <p>Actifs ({DeviceEnStationnement?.length})</p>
                </div>
              </div>
            )}
          </div>
          {/*  */}

          {/*  */}
        </div>

        {!currentAccountSelected && (
          <div className="w-full bg-white min-h-[15rem] max-h-[20rem] overflow-hidden rounded-lg mt-4">
            <div className="w-full overflow-hidden rounded-md">
              <LocationPage fromDashboard="true" />
            </div>
          </div>
        )}

        {/* Other info */}
        <div className="grid grid-cols-1 mt-5 md:grid-cols-2 items-stretch justify-center  gap-4 ">
          <div className="bg-white md:col-span-2-  p-3 h-full rounded-lg">
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
            <div className="h-full max-h-[20rem] flex flex-col gap-4 overflow-auto-- overflow-hidden">
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
              )
                ?.slice(0, 3)
                .map((user, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        // setShowSelectedUserOptionsPopup(true);
                        // setCurrentSelectedUserToConnect(user);
                        // console.log("user", user);
                        // setCurrentAccountSelected(account);
                        // setListeGestionDesVehicules(account?.accountDevices);
                        // setChooseOtherAccountGestion(false);
                      }}
                      className="shadow-lg- shadow-inner border- border-gray-200 cursor-pointer relative overflow-hidden-- bg-gray-50 /50 shadow-black/10 flex gap-3 items-center- rounded-lg py-[.65rem] px-2 "
                    >
                      {/* <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                        {index + 1}
                      </p> */}
                      <FaUserCircle className="text-orange-500/80 text-[2.5rem] mt-1" />
                      <div>
                        <p className="text-gray-600">
                          Nom de l'utilisateur :{" "}
                          <span className="font-bold">{user?.description}</span>{" "}
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
            </div>
          </div>

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
                            ?.flatMap((account) => account.accountGroupes)
                            ?.map((group) => [group.groupID, group])
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
              {(currentAccountSelected
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
                      {/* <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-gray-400/10">
                        {index + 1}
                      </p> */}
                      <PiIntersectThreeBold className="text-orange-500/80 text-[2.5rem] mt-1" />
                      <div>
                        <p className="text-gray-600">
                          Nom du Groupe :{" "}
                          <span className="font-bold">{user?.description}</span>{" "}
                        </p>
                        <p className="text-gray-600">
                          Nombre d'appareil :{" "}
                          <span className="font-bold">
                            {user?.groupeDevices?.length}
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContaintMaintComponant;
