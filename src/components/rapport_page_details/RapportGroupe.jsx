import React, { useContext, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationPin, MdUpdate } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import customMarkerIcon from "/img/cars/localisation.png";
import { IoClose } from "react-icons/io5";
import { MdOutlineFullscreen } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { RiPinDistanceLine } from "react-icons/ri";
import MapComponent from "../location_vehicule/MapComponent";
import { DataContext } from "../../context/DataContext";

import TrajetVehicule from "../historique_vehicule/TrajetVehicule";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

function RapportGroupe({
  currentDataFusionné, // Liste des véhicules
  véhiculeActiveToday, // Véhicules actifs aujourd'hui
  véhiculeNotActiveToday, // Véhicules en stationnement aujourd'hui
  véhiculeHorsService, // Véhicules hors service
  zoomPosition, // État pour la position zoomée de la carte
  setzoomPosition, // Fonctio
  typeDeVue,
  setTypeDeVue,
  mapType,
  handleMapTypeChange,
  mapRef,
  tileLayers,
  getMarkerIcon,
  currentLocation,
  positions,
  centerOnFirstMarker,
  showHistoriqueInMap,
  openGoogleMaps,
  setpageSection,
  setSelectedVehicleToShowInMap,
  downloadExelPDF,
}) {
  const {
    currentVéhicule,
    setCurrentVéhicule,
    FormatDateHeure,
    mergedDataHome,
    searchDonneeFusionnéForRapport,
    tableRef,
    rapportGroupePDFtRef,
    setHistoriqueSelectedLocationIndex,
    vehiculeMouvementOrdered,
    vehiclesByDistance,
    vehiclesByMovingDuration,
    vehiclesByMaxSpeed,
    vehiclesByDepartureTime,
    tableSortCroissant,
    setTableSortCroissant,
    setCurrentPersonelVéhicule,
    progressAnimationStart,
    setProgressAnimationStart,
    runningAnimationProgressLoading,
    setRunningAnimationProgressLoading,
    runningAnimationProgressDuration,
    setRunningAnimationProgressDuration,
    progressBarForLoadingData,
    homePageReload,
    username,
    statusDescriptions,
    isDashboardHomePage,
    fetchVehicleDataFromRapportGroupe,
    account,
    currentAccountSelected,
    setDonneeFusionnéForRapport,
    accountDevices,
    isSearchingFromRapportGroupePage,
    setIsSearchingFromRapportGroupePage,
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();

  const onlyLastResult = false;

  const rapportFetchFonction = () => {
    let accountID;
    let userID;
    let password;

    if (isDashboardHomePage && currentAccountSelected) {
      accountID = currentAccountSelected?.accountID;
      userID = "admin";
      password = currentAccountSelected?.password;
    } else if (!isDashboardHomePage) {
      accountID = account || localStorage.getItem("account") || "";
      userID = username || localStorage.getItem("username") || "";
      password = localStorage.getItem("password") || "";
    }
    homePageReload(accountID, userID, password, onlyLastResult);
  };

  //
  //
  //
  //
  //
  //
  //
  //
  // const dataFusionneeHome = mergedDataHome ? Object.values(mergedDataHome) : [];

  // Le data converti en Objet
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let dataFusionneeHome;

  if (isDashboardHomePage && currentAccountSelected) {
    dataFusionneeHome = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    dataFusionneeHome = accountDevices;
  } else if (!isDashboardHomePage) {
    dataFusionneeHome = dataFusionné;
  }

  //
  //
  //
  //
  //
  //
  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes

  const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
  //
  //
  //
  //
  //
  //
  //
  const véhiculeHorsService2 =
    dataFusionneeHome &&
    dataFusionneeHome?.filter((véhicule, index) => {
      const hasDetails =
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0;

      // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

      return !hasDetails || !isActive;
    });

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
  //
  //
  //
  x;

  // Pour {t("voir plus")} de details
  const [voirPlus, setvoirPlus] = useState(false);

  // Pour voir le trajet d'un vehicules dans la carte dans la carte
  const [voirTrajetDansLaCarte, setVoirTrajetDansLaCarte] = useState(false);

  // Pour le filtrage du tableau en ordre croissant ou décroissant
  useEffect(() => {
    console.log("");
  }, [tableSortCroissant]);

  const [voirVehiculeListePupup, setvoirVehiculeListePupup] = useState(false);
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
  //
  //
  //
  //
  x;
  const [trajetVehiculePupup, settrajetVehiculePupup] = useState(false);
  const [tableDeplacement, settableDeplacement] = useState(false);
  const [tableDistance, settableDistance] = useState(false);
  const [tableActivite, settableActivite] = useState(false);
  const [tablevitesse, settablevitesse] = useState(false);
  const [tableTrajet, settableTrajet] = useState(false);

  ///////////////////////////////////////////////////////////////////////////
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
  //
  //
  //
  //
  //
  //
  x;

  ////////////////////////////////////////////////////////
  const totalDistanceSum = vehiculeMouvementOrdered?.reduce(
    (sum, véhicule) => sum + véhicule.totalDistance,
    0
  );

  const nombreTotaleArret = vehiculeMouvementOrdered?.reduce(
    (sum, véhicule) => sum + véhicule.stopCount,
    0
  );

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
  //
  //
  //
  //
  //
  //
  //
  x;

  //////////////////////////////////////////////////

  // distance totale parcouru par tous les vehicules

  // Fonction pour convertir "Xh Ym Zs" en secondes
  const durationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration
      .split(" ")
      .map((part) => parseInt(part));
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Fonction pour convertir les secondes en "Xh Ym Zs"
  const secondsToDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculer la somme des durées en secondes
  const totalMovingDurationInSeconds = vehiculeMouvementOrdered?.reduce(
    (sum, véhicule) => sum + durationToSeconds(véhicule.totalMovingDuration),
    0
  );

  // Convertir le résultat en "Xh Ym Zs"
  const totalMovingDuration = secondsToDuration(totalMovingDurationInSeconds);
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
  //
  //
  //
  //
  //
  //
  //
  x;
  // Calcul de la vitesse moyenne totale
  const totalAvgSpeed = vehiculeMouvementOrdered
    ?.filter((véhicule) => véhicule.avgSpeed > 0) // Filtrer les véhicules avec avgSpeed > 0
    ?.reduce((sum, véhicule, _, filteredArray) => {
      const count = filteredArray.length; // Nombre de véhicules avec avgSpeed > 0
      return sum + véhicule.avgSpeed / count; // Ajouter à la somme en divisant directement par le nombre
    }, 0);

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
  //
  //
  //
  //
  //
  //
  //

  // La date du Véhicule en mouvement en 1er

  const premierMovementDebut =
    vehiculeMouvementOrdered &&
    vehiculeMouvementOrdered[0]?.véhiculeDetails[
      vehiculeMouvementOrdered[0]?.véhiculeDetails.length - 1
    ]?.timestamp;

  const datePemierMouvementDebut = new Date(premierMovementDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourPemierMouvement = datePemierMouvementDebut.getUTCDate(); // Obtenir le jour
  const moisPemierMouvement = datePemierMouvementDebut.toLocaleString("fr-FR", {
    month: "long",
  }); // Obtenir le mois en toutes lettres
  const anneePemierMouvement = datePemierMouvementDebut.getFullYear(); // Obtenir l'année

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
  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;
  // Date et Heure du Véhicule ayant parcouru la plus grande distance

  const premierdistanceDebut =
    vehiclesByDistance &&
    vehiclesByDistance[0]?.véhiculeDetails[
      vehiclesByDistance[0]?.véhiculeDetails.length - 1
    ]?.timestamp;

  const datePemierDistanceDebut = new Date(premierdistanceDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourPemierDistance = datePemierDistanceDebut.getUTCDate(); // Obtenir le jour
  const moisPemierDistance = datePemierDistanceDebut.toLocaleString("fr-FR", {
    month: "long",
  }); // Obtenir le mois en toutes lettres
  const anneePemierDistance = datePemierDistanceDebut.getFullYear(); // Obtenir l'année

  //

  //////////////////////////////////////////////////////////////////////

  const dernierdistanceDebut =
    vehiclesByDistance && vehiclesByDistance[0]?.véhiculeDetails[0]?.timestamp;

  const dateDernierDistanceDebut = new Date(dernierdistanceDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDernierDistance = dateDernierDistanceDebut.getUTCDate(); // Obtenir le jour
  const moisDernierDistance = dateDernierDistanceDebut.toLocaleString("fr-FR", {
    month: "long",
  }); // Obtenir le mois en toutes lettres
  const anneeDernierDistance = dateDernierDistanceDebut.getFullYear(); // Obtenir l'année

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
  x;

  // Date et heure du vehicule en mouvement le plus lonntemps

  const premierdistanceLontanDebut =
    vehiclesByMovingDuration &&
    vehiclesByMovingDuration[0]?.véhiculeDetails[
      vehiclesByMovingDuration[0]?.véhiculeDetails.length - 1
    ]?.timestamp;

  const datePemierDistanceLontanDebut = new Date(
    premierdistanceLontanDebut * 1000
  );

  // Récupérer le jour, le mois et l'année séparément
  const jourPemierDistanceLontan = datePemierDistanceLontanDebut.getUTCDate(); // Obtenir le jour
  const moisPemierDistanceLontan = datePemierDistanceLontanDebut.toLocaleString(
    "fr-FR",
    {
      month: "long",
    }
  ); // Obtenir le mois en toutes lettres
  const anneePemierDistanceLontan = datePemierDistanceLontanDebut.getFullYear(); // Obtenir l'année

  //

  //////////////////////////////////////////////////////////////////////

  const dernierdistanceLontanDebut =
    vehiclesByMovingDuration &&
    vehiclesByMovingDuration[0]?.véhiculeDetails[0]?.timestamp;

  const dateDernierDistanceLontanDebut = new Date(
    dernierdistanceLontanDebut * 1000
  );

  // Récupérer le jour, le mois et l'année séparément
  const jourDernierDistanceLontan = dateDernierDistanceLontanDebut.getUTCDate(); // Obtenir le jour
  const moisDernierDistanceLontan =
    dateDernierDistanceLontanDebut.toLocaleString("fr-FR", {
      month: "long",
    }); // Obtenir le mois en toutes lettres
  const anneeDernierDistanceLontan =
    dateDernierDistanceLontanDebut.getFullYear(); // Obtenir l'année

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
  //
  //
  //
  //
  //
  // Afficher la position d'un vehicule dans la carte

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const [currentVehiculeInCarte, setcurrentVehiculeInCarte] = useState(
    vehiculeMouvementOrdered && vehiculeMouvementOrdered[0]
  );
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  const positionDansCarte = (véhicule) => {
    const deviceID = véhicule?.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle =
      currentDataFusionné &&
      currentDataFusionné.find((v) => v.deviceID === deviceID);

    if (foundVehicle) {
      setcurrentVehiculeInCarte(foundVehicle); // Définit le véhicule actuel
      setCurrentVéhicule(foundVehicle);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  useEffect(() => {
    console.log("currentVéhicule");
  }, [currentVehiculeInCarte]);
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

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
  //
  x;
  // afficher le trajer dans la carte
  // // Filtrage pour supprimer les doublons et respecter l'intervalle de 10 minutes
  const filteredVehicles = [];
  let lastZeroSpeedTimestamp = null;

  currentVéhicule?.véhiculeDetails
    .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
    .forEach((details) => {
      const timestamp = parseInt(details.timestamp);
      const speedKPH = parseFloat(details.speedKPH);

      if (speedKPH <= 0) {
        if (
          lastZeroSpeedTimestamp === null ||
          lastZeroSpeedTimestamp - timestamp >= 600
        ) {
          filteredVehicles.push(details);
          lastZeroSpeedTimestamp = timestamp;
        }
      } else {
        filteredVehicles.push(details);
      }
    });

  const historiqueInMap = filteredVehicles
    ? Object.values(filteredVehicles)
    : [];
  const véhiculeData = historiqueInMap?.map((véhicule) => ({
    description: currentVéhicule?.description || "Véhicule",
    lastValidLatitude: véhicule?.latitude || "",
    lastValidLongitude: véhicule?.longitude || "",
    address: véhicule?.backupAddress || véhicule?.address || "",
    imeiNumber: currentVéhicule?.imeiNumber || "",
    isActive: currentVéhicule?.isActive || "",
    licensePlate: currentVéhicule?.licensePlate || "",
    simPhoneNumber: currentVéhicule?.simPhoneNumber || "",
    timestamp: véhicule?.timestamp || "",
    speedKPH: véhicule?.speedKPH || 0, // Ajout de la vitesse
    heading: véhicule?.heading || "",
  }));

  const vehicles = véhiculeData;

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
  //
  //
  //
  //
  //
  x;

  // Pour filtrer le tableau
  const [tableSortBy, settableSortBy] = useState();
  const [tableSortByColorBg, settableSortByColorBg] = useState("");

  const [showsortfilterpupup, setshowsortfilterpupup] = useState(false);

  useEffect(() => {
    console.log("tableSortBy:");
  }, [tableSortBy, tableSortByColorBg]);

  useEffect(() => {
    settableSortBy();
  }, [tableSortCroissant]);
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
  //
  //
  //
  //
  //
  x;

  // Pour choisir un vehicule de la liste.
  const handleClick = (véhicule) => {
    // setCurrentVéhicule(véhicule);

    const deviceID = véhicule?.deviceID;

    // // Recherche du véhicule correspondant dans la liste
    const foundVehicle =
      currentDataFusionné &&
      currentDataFusionné.find((v) => v.deviceID === deviceID);

    const foundPersonelVehicle =
      vehiclesByDepartureTime &&
      vehiclesByDepartureTime.find((v) => v.deviceID === deviceID);

    if (foundVehicle) {
      // currentPersonelVéhicule,
      setCurrentPersonelVéhicule(foundPersonelVehicle);
      setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
      setpageSection("unite");
      window.scrollTo({
        top: 0,
        behavior: "auto", // Défilement fluide
        // behavior: "smooth", // Défilement fluide
      });
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
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
  //
  //
  //
  x;
  // Calcul de la vitesse minimale, maximale et moyenne (véhicules actifs uniquement)
  const calculateSpeeds = (data) => {
    const activeVehicles = data?.filter(
      (véhicule) => véhicule.maxSpeed > 0 || véhicule.minSpeed > 0
    );

    const totalVehicles = activeVehicles?.length;

    const minSpeed =
      activeVehicles &&
      Math.min(...activeVehicles?.map((véhicule) => véhicule.minSpeed));
    const maxSpeed =
      activeVehicles &&
      Math.max(...activeVehicles?.map((véhicule) => véhicule.maxSpeed));
    const avgSpeed =
      activeVehicles?.reduce((sum, véhicule) => sum + véhicule.maxSpeed, 0) /
      totalVehicles;

    return { minSpeed, maxSpeed, avgSpeed, totalVehicles };
  };

  const speeds = calculateSpeeds(vehiclesByDepartureTime);
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
  //
  x;
  const [filter, setFilter] = useState("all");

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
  x;

  ////////////////////////////////////////////////////
  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // Convertir en secondes
  };
  const todayTimestamp = getTodayTimestamp() * 1000;

  //
  //

  let main_text_color = "text-red-900 dark:text-red-300";
  let statut = "";
  let lite_bg_color =
    "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
  let activeTextColor = "text-red-900 dark:text-red-200";
  let active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
  let vitess_img = "img/cars/orange_vitess.png";
  let vitess_img_dark = "img/cars/orange_vitess.png";

  let imgClass = "w-14 sm:w-16 md:w-24";
  let imgBg = "bg-green-200/40";
  let border_top = "border-t border-t-red-200 dark:border-t-red-600/30 ";
  // Fonction pour filtrer les véhicules

  const filteredVehiclesListe = vehiclesByDepartureTime?.filter((véhicule) => {
    const matchedVehicle = currentDataFusionné?.find(
      (v) => v.deviceID === véhicule?.deviceID
    );
    const matchedVehicle2 = dataFusionneeHome?.find(
      (v) => v.deviceID === véhicule?.deviceID
    );

    const hasDetails = matchedVehicle?.véhiculeDetails?.length > 0;
    const lastDetail = matchedVehicle?.véhiculeDetails?.[0];
    const speed = lastDetail?.speedKPH ?? 0;
    const lastUpdateMs = lastDetail?.timestamp
      ? lastDetail.timestamp * 1000
      : 0;

    const isActive = matchedVehicle?.lastUpdateTime
      ? currentTime - matchedVehicle.lastUpdateTime * 1000 < twentyFourHoursInMs
      : false;

    const updatedToday = lastUpdateMs >= todayTimestamp;
    const updatedRecently = currentTimeMs - lastUpdateMs <= tenMinutesInMs;

    const movedToday = matchedVehicle?.véhiculeDetails?.some(
      (d) => d.timestamp * 1000 >= todayTimestamp && d.speedKPH >= 1
    );

    const neverMovedToday = matchedVehicle?.véhiculeDetails?.every(
      (d) => d.timestamp * 1000 >= todayTimestamp && d.speedKPH <= 0
    );

    const movedBefore = matchedVehicle?.véhiculeDetails?.some(
      (d) => d.speedKPH >= 1
    );

    ///////////////////////////// FILTRES /////////////////////////////////

    if (filter === "isNotActiveRithtNowToday") {
      const inactive =
        !hasDetails || currentTimeMs - lastUpdateMs > twentyFourHoursInMs;
      if (inactive) {
        main_text_color = "text-purple-900 dark:text-purple-300";
        statut = `${t("Hors service")}`;
        lite_bg_color =
          "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
        activeTextColor = "text-purple-900 dark:text-purple-200";
        active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
        vitess_img = "/img/home_icon/payer.png";
        vitess_img_dark = "/img/home_icon/rapport_not_active.png";
        imgClass = "w-14 h-auto sm:w-16 md:w-24";
        imgBg =
          "bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200";
        border_top = "border-t border-t-purple-200 dark:border-t-purple-600/30";
        return true;
      }
      return false;
    }

    if (filter === "isMovingRightNowToday") {
      if (
        hasDetails &&
        isActive &&
        speed >= 1 &&
        updatedRecently &&
        updatedToday
      ) {
        main_text_color = "text-green-700 dark:text-green-400";
        statut = `${t("En mouvement rapide")}`;
        lite_bg_color =
          "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80 shadow-lg shadow-gray-950/20";
        activeTextColor = "text-green-800 dark:text-green-200";
        active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
        vitess_img = "/img/home_icon/active.png";
        vitess_img_dark = "/img/home_icon/rapport_active.png";
        imgClass = "w-12 h-auto sm:w-14 md:w-20";
        imgBg =
          "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200";
        border_top = "border-t border-t-green-200 dark:border-t-green-600/30";
        return true;
      }
      return false;
    }

    if (filter === "ispParkingRightNowToday") {
      if (
        hasDetails &&
        isActive &&
        updatedToday &&
        (speed <= 0 || (speed >= 1 && !updatedRecently))
      ) {
        main_text_color = "text-red-900 dark:text-red-300";
        statut = `${t("En Stationnement")}`;
        lite_bg_color =
          "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
        activeTextColor = "text-red-900 dark:text-red-200";
        active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
        vitess_img = "/img/home_icon/rapport_parking2.png";
        vitess_img_dark = "/img/home_icon/rapport_parking.png";
        imgClass = "w-14 h-auto sm:w-16 md:w-24";
        imgBg =
          "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200";
        border_top = "border-t border-t-red-200 dark:border-t-red-600/30";
        return true;
      }
      return false;
    }

    if (filter === "hasBeenMovingToday") {
      if (movedToday) {
        main_text_color = "text-green-700 dark:text-green-400";
        statut = `${t("A bougé aujourd'hui")}`;
        lite_bg_color =
          "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80 shadow-lg shadow-gray-950/20";
        activeTextColor = "text-green-800 dark:text-green-200";
        active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
        vitess_img = "/img/home_icon/active.png";
        vitess_img_dark = "/img/home_icon/rapport_active.png";
        imgClass = "w-12 h-auto sm:w-14 md:w-20";
        imgBg =
          "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200";
        border_top = "border-t border-t-green-200 dark:border-t-green-600/30";
        return true;
      }
      return false;
    }

    if (filter === "hasNotBeenMovingToday") {
      if (!movedToday && hasDetails && isActive) {
        main_text_color = "text-red-900 dark:text-red-300";
        statut = `${t("N'a pas bougé aujourd'hui")}`;
        lite_bg_color =
          "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
        activeTextColor = "text-red-900 dark:text-red-200";
        active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
        vitess_img = "/img/home_icon/rapport_parking2.png";
        vitess_img_dark = "/img/home_icon/rapport_parking.png";
        imgClass = "w-14 h-auto sm:w-16 md:w-24";
        imgBg =
          "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200";
        border_top = "border-t border-t-red-200 dark:border-t-red-600/30";
        return true;
      }
      return false;
    }

    if (filter === "hasBeenMovingFromSearch") {
      if (hasDetails && movedBefore) {
        main_text_color = "text-green-700 dark:text-green-400";
        statut = `${t("A bougé récemment")}`;
        lite_bg_color =
          "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80 shadow-lg shadow-gray-950/20";
        activeTextColor = "text-green-800 dark:text-green-200";
        active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
        vitess_img = "/img/home_icon/active.png";
        vitess_img_dark = "/img/home_icon/rapport_active.png";
        imgClass = "w-12 h-auto sm:w-14 md:w-20";
        imgBg =
          "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200";
        border_top = "border-t border-t-green-200 dark:border-t-green-600/30";
        return true;
      }
      return false;
    }

    if (filter === "hasNotBeenMovingFromSearch") {
      if (hasDetails && !movedBefore) {
        main_text_color = "text-red-900 dark:text-red-300";
        statut = `${t("Jamais bougé")}`;
        lite_bg_color =
          "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
        activeTextColor = "text-red-900 dark:text-red-200";
        active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
        vitess_img = "/img/home_icon/rapport_parking2.png";
        vitess_img_dark = "/img/home_icon/rapport_parking.png";
        imgClass = "w-14 h-auto sm:w-16 md:w-24";
        imgBg =
          "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200";
        border_top = "border-t border-t-red-200 dark:border-t-red-600/30";
        return true;
      }
      return false;
    }

    if (filter === "isNotActiveFromSearch") {
      if (!hasDetails) {
        main_text_color = "text-purple-900 dark:text-purple-300";
        statut = `${t("Hors service")}`;
        lite_bg_color =
          "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
        activeTextColor = "text-purple-900 dark:text-purple-200";
        active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
        vitess_img = "/img/home_icon/payer.png";
        vitess_img_dark = "/img/home_icon/rapport_not_active.png";
        imgClass = "w-14 h-auto sm:w-16 md:w-24";
        imgBg =
          "bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200";
        border_top = "border-t border-t-purple-200 dark:border-t-purple-600/30";
        return true;
      }
      return false;
    }

    if (filter === "all") {
      return true;
    }

    return true; // par défaut, tous les véhicules
  });

  function filteredVehiclesListeFonction(filter) {
    return vehiclesByDepartureTime?.filter((véhicule) => {
      const matchedVehicle = currentDataFusionné?.find(
        (v) => v.deviceID === véhicule?.deviceID
      );
      const hasDetails = matchedVehicle?.véhiculeDetails?.length > 0;
      const lastDetail = matchedVehicle?.véhiculeDetails?.[0];
      const speed = lastDetail?.speedKPH ?? 0;
      const lastUpdateMs = lastDetail?.timestamp
        ? lastDetail.timestamp * 1000
        : 0;
      const isActive = matchedVehicle?.lastUpdateTime
        ? currentTime - matchedVehicle.lastUpdateTime * 1000 <
          twentyFourHoursInMs
        : false;
      const updatedToday = lastUpdateMs >= todayTimestamp;
      const updatedRecently = currentTimeMs - lastUpdateMs <= tenMinutesInMs;
      const movedToday = matchedVehicle?.véhiculeDetails?.some(
        (d) => d.timestamp * 1000 >= todayTimestamp && d.speedKPH >= 1
      );
      const movedBefore = matchedVehicle?.véhiculeDetails?.some(
        (d) => d.speedKPH >= 1
      );

      switch (filter) {
        case "isMovingRightNowToday":
          return (
            hasDetails &&
            isActive &&
            speed >= 1 &&
            updatedRecently &&
            updatedToday
          );

        case "ispParkingRightNowToday":
          return (
            hasDetails &&
            isActive &&
            updatedToday &&
            (speed <= 0 || (speed >= 1 && !updatedRecently))
          );

        case "isNotActiveRithtNowToday":
          return (
            !hasDetails || currentTimeMs - lastUpdateMs > twentyFourHoursInMs
          );

        case "hasBeenMovingToday":
          return movedToday;

        case "hasNotBeenMovingToday":
          return !movedToday && hasDetails && isActive;

        case "hasBeenMovingFromSearch":
          return hasDetails && movedBefore;

        case "hasNotBeenMovingFromSearch":
          return hasDetails && !movedBefore;

        case "isNotActiveFromSearch":
          return !hasDetails;

        default:
          return true;
      }
    });
  }

  // const filteredVehiclesListe = vehiclesByDepartureTime?.filter((véhicule) => {
  //   // ttttttttttttttttttt

  //   // Trouver le véhicule correspondant dans updateData
  //   const matchedVehicle =
  //     currentDataFusionné &&
  //     currentDataFusionné.find((v) => v.deviceID === véhicule?.deviceID);

  //   const matchedVehicle2 =
  //     dataFusionneeHome &&
  //     dataFusionneeHome?.find((v) => v.deviceID === véhicule?.deviceID);

  //   const isSpeedActive =
  //     matchedVehicle2?.véhiculeDetails &&
  //     matchedVehicle2?.véhiculeDetails[0] &&
  //     matchedVehicle2?.véhiculeDetails[0]?.speedKPH > 0;

  //   const isNotSpeedActive =
  //     matchedVehicle2?.véhiculeDetails &&
  //     matchedVehicle2?.véhiculeDetails[0] &&
  //     matchedVehicle2?.véhiculeDetails[0]?.speedKPH <= 0;

  //   const isMoving = matchedVehicle.véhiculeDetails?.some(
  //     (detail) => detail.speedKPH >= 1
  //   );

  //   const hasDetails =
  //     matchedVehicle.véhiculeDetails &&
  //     matchedVehicle.véhiculeDetails.length > 0;

  //   const noSpeed = matchedVehicle.véhiculeDetails?.every(
  //     (detail) => detail.speedKPH <= 0
  //   );

  //   // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
  //   const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
  //     ? matchedVehicle.lastUpdateTime * 1000
  //     : 0;
  //   const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

  //   ///////////////////////////////////////////////////////////////////////////

  //   ////////////////////////////////////////////////////
  //   // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
  //   const getTodayTimestamp = () => {
  //     const now = new Date();
  //     now.setHours(0, 0, 0, 0); // Minuit
  //     return Math.floor(now.getTime() / 1000); // Convertir en secondes
  //   };
  //   const todayTimestamp = getTodayTimestamp() * 1000;

  //   const hasBeenMoving =
  //     matchedVehicle.véhiculeDetails &&
  //     matchedVehicle.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

  //   const lastUpdateTimestampMs =
  //     matchedVehicle.véhiculeDetails &&
  //     matchedVehicle.véhiculeDetails[0] &&
  //     matchedVehicle.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

  //   const isNotStillSpeedActive =
  //     lastUpdateTimestampMs &&
  //     currentTimeMs - lastUpdateTimestampMs > tenMinutesInMs;

  //   ////////////////////////////x////////////////////////////////////////

  //   if (hasDetails && isSpeedActive && !isNotStillSpeedActive) {
  //     main_text_color = "text-green-700 dark:text-green-400";
  //     statut = `${t("En mouvement rapide")}`;
  //     lite_bg_color =
  //       "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
  //     activeTextColor = "text-green-800 dark:text-green-200";
  //     active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
  //     vitess_img = "/img/home_icon/active.png";
  //     vitess_img_dark = "/img/home_icon/rapport_active.png";
  //     imgClass = "w-12  h-auto sm:w-14 md:w-20";
  //     imgBg =
  //       "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200 ";
  //     border_top = "border-t border-t-green-200 dark:border-t-green-600/30 ";
  //   } else if (
  //     hasDetails &&
  //     isActive &&
  //     (!isSpeedActive || (isSpeedActive && isNotStillSpeedActive))
  //   ) {
  //     main_text_color = "text-red-900 dark:text-red-300";
  //     statut = `${t("En Stationnement")}`;
  //     lite_bg_color =
  //       "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
  //     activeTextColor = "text-red-900 dark:text-red-200";
  //     active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
  //     vitess_img = "/img/home_icon/rapport_parking2.png";
  //     vitess_img_dark = "/img/home_icon/rapport_parking.png";

  //     imgClass = "w-14  h-auto sm:w-16 md:w-24";
  //     imgBg =
  //       "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 ";
  //     border_top = "border-t border-t-red-200 dark:border-t-red-600/30 ";
  //   }
  //   //
  //   else if (!hasDetails || !isActive) {
  //     main_text_color = "text-purple-900 dark:text-purple-300 ";
  //     statut = `${t("Hors service")}`;
  //     lite_bg_color =
  //       "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
  //     activeTextColor = "text-purple-900 dark:text-purple-200";
  //     active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
  //     vitess_img = "/img/home_icon/payer.png";
  //     vitess_img_dark = "/img/home_icon/rapport_not_active.png";

  //     imgClass = "w-14  h-auto sm:w-16 md:w-24";
  //     imgBg =
  //       "bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200 ";
  //     border_top = "border-t border-t-purple-200 dark:border-t-purple-600/30 ";
  //   }
  //   //
  //   //
  //   //
  //   if (
  //     isNotSpeedActive &&
  //     hasDetails &&
  //     isActive &&
  //     filter === "notMovingNow"
  //   ) {
  //     main_text_color = "text-red-900 dark:text-red-300";
  //     statut = `${t("En Stationnement")}`;
  //     lite_bg_color =
  //       "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
  //     activeTextColor = "text-red-900 dark:text-red-200";
  //     active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
  //     vitess_img = "/img/home_icon/rapport_parking2.png";
  //     vitess_img_dark = "/img/home_icon/rapport_parking.png";

  //     imgClass = "w-14  h-auto sm:w-16 md:w-24";
  //     imgBg =
  //       "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 ";
  //     border_top = "border-t border-t-red-200 dark:border-t-red-600/30 ";
  //   }

  //   if (hasDetails && isActive && filter === "moving") {
  //     main_text_color = "text-green-700 dark:text-green-400";
  //     statut = `${t("En mouvement rapide")}`;
  //     lite_bg_color =
  //       "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
  //     activeTextColor = "text-green-800 dark:text-green-200";
  //     active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
  //     vitess_img = "/img/home_icon/active.png";
  //     vitess_img_dark = "/img/home_icon/rapport_active.png";
  //     imgClass = "w-12  h-auto sm:w-14 md:w-20";
  //     imgBg =
  //       "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200 ";
  //     border_top = "border-t border-t-green-200 dark:border-t-green-600/30 ";
  //   }
  //   //

  //   if (filter === "isMoving") return hasDetails && isSpeedActive && !isNotStillSpeedActive;
  //   if (filter === "parking") return hasDetails && noSpeed;
  //   if (filter === "inactive") return !hasDetails;

  //   if (filter === "haveBeenMoving") return hasDetails && isMoving;
  //   if (filter === "haveNotBeenMoving") return hasDetails && isMoving;

  //   return true; // "all" : tous les véhicules
  // });

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
  //
  //
  //
  //
  //
  //
  x;
  // Vehicule en mouvement actuellement

  const activeVehicleCount = dataFusionneeHome.filter((véhicule) => {
    // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
    const isSpeedActive =
      véhicule?.véhiculeDetails &&
      véhicule?.véhiculeDetails[0] &&
      véhicule?.véhiculeDetails[0].speedKPH > 0;

    // Récupérer le timestamp de la dernière mise à jour (en millisecondes)
    const lastUpdateTimestampMs =
      véhicule?.véhiculeDetails &&
      véhicule?.véhiculeDetails[0] &&
      véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    // const isStillSpeedActive = todayTimestamp - lastTimeStamp < trentMinute;
    // Vérifie si la mise à jour est récente (moins de 30 minutes)
    const isStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;

    // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
    const lastUpdateTimeMs = véhicule?.lastUpdateTime
      ? véhicule?.lastUpdateTime * 1000
      : 0;
    const isRecentlyUpdated = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    // Le véhicule doit être actif selon la vitesse et la mise à jour
    return isSpeedActive && isRecentlyUpdated && isStillSpeedActive;
  });

  const activeVehicleCount2 =
    currentDataFusionné &&
    currentDataFusionné?.filter((véhicule) => {
      // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
      const isSpeedActive =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails[0] &&
        véhicule?.véhiculeDetails[0].speedKPH > 0;

      // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isRecentlyUpdated =
        currentTime - lastUpdateTimeMs < twentyHoursInMs;

      const lastUpdateTimestampMs =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails[0] &&
        véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

      // const isStillSpeedActive = todayTimestamp - lastTimeStamp < trentMinute;
      // Vérifie si la mise à jour est récente (moins de 30 minutes)
      const isStillSpeedActive =
        lastUpdateTimestampMs &&
        currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;

      // Le véhicule doit être actif selon la vitesse et la mise à jour
      return isSpeedActive && isRecentlyUpdated && isStillSpeedActive;
    });

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
  //
  //
  //
  //
  x;

  // Vehicule en stationnement actuellement
  // const notActiveVehicleCount = dataFusionneeHome?.filter((véhicule) => {

  const notActiveVehicleCount = dataFusionneeHome?.filter((véhicule) => {
    // Vérifie si le véhicule a des détails
    const hasDetails =
      véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0;

    // Vérifie la vitesse (noSpeed)
    const noSpeed = véhicule?.véhiculeDetails?.every(
      (detail) => detail.speedKPH <= 0
    );

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = véhicule?.lastUpdateTime
      ? véhicule?.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const lastUpdateTimestampMs =
      véhicule?.véhiculeDetails &&
      véhicule?.véhiculeDetails[0] &&
      véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    const isSpeedActive =
      véhicule?.véhiculeDetails &&
      véhicule?.véhiculeDetails[0] &&
      véhicule?.véhiculeDetails[0].speedKPH > 0;

    const isNotStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs > tenMinutesInMs;

    // Inclure seulement les véhicules qui ont des détails, qui sont actifs, et qui ont noSpeed
    // return hasDetails && noSpeed && isActive;
    // Inclure les véhicules :
    // - Soit ils ont noSpeed et sont actifs
    // - Soit ils sont isSpeedActive mais isNotStillSpeedActive
    return (
      hasDetails &&
      isActive &&
      (noSpeed || (isSpeedActive && isNotStillSpeedActive))
    );
  });

  const notActiveVehicleCount2 =
    currentDataFusionné &&
    currentDataFusionné?.filter((véhicule) => {
      // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
      const isNotSpeedActive =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails[0] &&
        véhicule?.véhiculeDetails[0].speedKPH <= 0;

      const noSpeed =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails?.every((detail) => detail.speedKPH <= 0);

      // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isRecentlyUpdated =
        currentTime - lastUpdateTimeMs < twentyHoursInMs;

      const isSpeedActive =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails[0] &&
        véhicule?.véhiculeDetails[0].speedKPH > 0;

      const lastUpdateTimestampMs =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails[0] &&
        véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

      const isNotStillSpeedActive =
        lastUpdateTimestampMs &&
        currentTimeMs - lastUpdateTimestampMs > tenMinutesInMs;

      const hasBeenMoving =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

      // Le véhicule doit être actif selon la vitesse et la mise à jour
      // return noSpeed && isRecentlyUpdated;
      return (
        isRecentlyUpdated &&
        (isNotSpeedActive || (isSpeedActive && isNotStillSpeedActive))
      );
    });

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

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
  //
  //
  //
  x;
  // Fonction pour avoir le timestamp le plus recent
  function getMostRecentTimestamp(data) {
    // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
    const validTimestamps = data
      ?.filter(
        (véhicule) =>
          Array.isArray(véhicule?.véhiculeDetails) &&
          véhicule?.véhiculeDetails.length > 0
      )
      .map((véhicule) => parseInt(véhicule?.véhiculeDetails[0].timestamp));

    // Trouver le timestamp le plus récent
    const mostRecentTimestamp = validTimestamps && Math.max(...validTimestamps);

    return { mostRecentTimestamp };
  }
  const mostRecentTimestamp = getMostRecentTimestamp(
    currentDataFusionné && currentDataFusionné
  )?.mostRecentTimestamp;
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
  //
  //
  //
  x;

  // Pour avoir le timestamp le plus ancien
  function getMostOldTimestamp(data) {
    // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
    const validTimestamps = data
      ?.filter(
        (véhicule) =>
          Array.isArray(véhicule?.véhiculeDetails) &&
          véhicule?.véhiculeDetails.length > 0
      )
      .map((véhicule) =>
        parseInt(
          véhicule?.véhiculeDetails[véhicule?.véhiculeDetails.length - 1]
            .timestamp
        )
      );

    // Trouver le timestamp le plus récent
    const mostOldTimestamp = validTimestamps && Math.min(...validTimestamps);

    return { mostOldTimestamp };
  }

  // Récupérer le timestamp le plus ancien
  const mostOldTimestamp = getMostOldTimestamp(
    currentDataFusionné && currentDataFusionné
  )?.mostOldTimestamp;
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
  //
  //
  //
  x;
  // Pour savoir la date et heure /debut et fin
  const moisEnLettres = [
    `${t("janvier")}`,
    `${t("février")}`,
    `${t("mars")}`,
    `${t("avril")}`,
    `${t("mai")}`,
    `${t("juin")}`,
    `${t("juillet")}`,
    `${t("août")}`,
    `${t("septembre")}`,
    `${t("octobre")}`,
    `${t("novembre")}`,
    `${t("décembre")}`,
  ];

  const dataObjectDebut = new Date(mostOldTimestamp * 1000);
  const dataObjectFin = new Date(mostRecentTimestamp * 1000);

  // Récupérer le jour, le mois et l'année séparément pour la date de début en local
  const jourDebut = dataObjectDebut.getDate(); // Jour local
  const moisDebut = moisEnLettres[dataObjectDebut.getMonth()]; // Mois local
  const anneeDebut = dataObjectDebut.getFullYear(); // Année locale

  // Récupérer le jour, le mois et l'année séparément pour la date de fin en local
  const jourFin = dataObjectFin.getDate(); // Jour local
  const moisFin = moisEnLettres[dataObjectFin.getMonth()]; // Mois local
  const anneeFin = dataObjectFin.getFullYear(); // Année locale

  //////////////////////////////////////
  const heureDebut = FormatDateHeure(mostOldTimestamp)?.time;
  const heureFin = FormatDateHeure(mostRecentTimestamp)?.time;

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
  //
  //
  //
  x;

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
  //
  //
  //
  x;

  // Fonction d'exportation
  const exportToExcel = () => {
    const table = document.getElementById("myTable"); // ID du tableau HTML
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, `${t("Rapport des vehicules")}.xlsx `); // Nom du fichier
  };

  // preparation a l'exportation
  const [preparationDownloadPDF, setPreparationDownloadPDF] = useState(false);
  useEffect(() => {
    console.log("");
  }, [preparationDownloadPDF]);

  useEffect(() => {
    if (downloadExelPDF) {
      setPreparationDownloadPDF(true);
      if (downloadExelPDF && !voirPlus) {
        setvoirPlus(true);
      }
    } else {
      setPreparationDownloadPDF(false);
      if (!downloadExelPDF && voirPlus) {
        setvoirPlus(false);
      }
    }
  }, [downloadExelPDF]);

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
  //
  //
  //
  x;
  // ppppppppppppppppppppppp
  // Pour afficher les position des tableu en cart

  // Pour afficher les positions des tableaux sur la carte
  const afficherPositionTableauEnCarte = (véhicule, creationTime) => {
    const véhiculeDeviceID = véhicule?.deviceID;

    const foundVehicle = currentDataFusionné.find(
      (v) => v.deviceID === véhiculeDeviceID
    );

    if (!foundVehicle || !foundVehicle.véhiculeDetails) return;

    const foundVehicleDetailsIndex = foundVehicle.véhiculeDetails.findIndex(
      (d) => d.creationTime === creationTime
    );

    setSelectedVehicleToShowInMap(véhiculeDeviceID);
    setHistoriqueSelectedLocationIndex(foundVehicleDetailsIndex);
    setzoomPosition(true);
  };

  //
  //
  //
  //
  //
  //
  //

  const intervalRef = useRef(null);

  useEffect(() => {
    if (runningAnimationProgressLoading && progressAnimationStart < 99) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setProgressAnimationStart((prev) => {
          if (prev >= 98) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 99;
          }
          return prev + 1;
        });
      }, runningAnimationProgressDuration);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    runningAnimationProgressLoading,
    progressAnimationStart,
    runningAnimationProgressDuration,
  ]);

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
  // }, [runningAnimationProgressLoading, progressAnimationStart]);
  //
  //
  //
  //
  //
  //
  x;

  return (
    <>
      <div
        ref={rapportGroupePDFtRef}
        className=" px-4 pb-20 md:max-w-[70vw] w-full"
      >
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* La liste des vehicule filtrer */}
        {voirVehiculeListePupup && (
          <div className="fixed z-[9999999999] inset-0 px-2 flex justify-center items-center bg-black/50">
            <div className="bg-white  dark:bg-gray-800 rounded-lg pt-3 w-[97vw]  px-2">
              <div className="flex justify-between items-center py-2">
                <p></p>
                <h3 className="font-bold text-gray-600 text-lg dark:text-gray-50">
                  {filter === "all" && `${t("Tous les véhicules")}`}
                  {filter === "moving" && `${t("Véhicules déplacés")}   `}

                  {filter === "notMovingNow" &&
                    `${t("Véhicules en stationnement")}`}

                  {filter === "movingNow" && `${t("Véhicules en mouvement")} `}
                  {filter === "parking" && ` ${t("Véhicules non déplacés")}   `}

                  {filter === "inactive" && `${t("Véhicules hors service")}`}
                </h3>
                <IoClose
                  onClick={() => {
                    setvoirVehiculeListePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}

              <div className="mx-auto  md:w-[75vw]">
                <div className="flex  flex-wrap">
                  <p className="font-bold">{t("Date")} : </p>
                  <span className="font-semibold dark:text-orange-500 text-gray-900 pl-5">
                    {jourDebut ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        {t("Du")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        {t("au")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      <span>{t("Pas de date disponible")}</span>
                    )}
                  </span>
                </div>
                {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                <div className="flex flex-wrap">
                  <p className="font-bold">{t("Heure")} :</p>
                  {jourDebut ? (
                    <span className="font-semibold dark:text-orange-500 text-gray-700 pl-5">
                      {t("De")}{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                        {heureFin}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                      {t("Pas de date disponible")}
                    </span>
                  )}
                </div>
                {filter === "all" && (
                  <div className="mt-4 mb-4 flex items-center gap-2">
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 ">
                      Véhicules en mouvement
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
                      Véhicules en stationnement
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
                      {t("Véhicules hors service")}
                    </p>
                  </div>
                )}
              </div>
              <div className="relative pb-20 flex flex-col gap-4 h-[70vh] pt-6 rounded-lg overflow-auto bg-white-- md:px-[10vw]">
                {filteredVehiclesListe.length > 0 ? (
                  filteredVehiclesListe?.map((véhicule, index) => {
                    return (
                      <div>
                        {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                        <div
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          key={index}
                          className="bg-white relative rounded-lg dark:bg-gray-800 dark:shadow-gray-600"
                        >
                          <div
                            className={`${active_bg_color} ${main_text_color} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-4 pb-4 font-bold text-lg `}
                          >
                            {index + 1}
                          </div>
                          <div
                            className={` py-6 ${lite_bg_color} dark:border-l-[.5rem] dark:border-green-800 dark:bg-gray-900/50 dark:shadow-gray-700 shadow-md rounded-lg p-3`}
                          >
                            <div className="flex items-stretch relative gap-3 md:py-6--">
                              <div
                                className={`${imgBg} flex max-w-[4rem] md:max-w-[5rem] justify-center border-2 md:pt-6 md:pb-8  rounded-md p-2 flex-col items-center sm:min-w-36 `}
                              >
                                <div>
                                  <img
                                    className="dark:hidden px-4 md:px-2 scale-110  --min-w-[4.5rem] max-w-[4.5rem]  sm:max-w-[6.5rem]"
                                    src={vitess_img}
                                    alt=""
                                  />
                                  <img
                                    className="hidden px-4 md:px-4 dark:block  scale-110  min-w-[4.5rem] max-w-[4.5rem]  sm:max-w-[6.5rem]"
                                    src={vitess_img_dark}
                                    alt=""
                                  />
                                </div>
                              </div>

                              <div>
                                <h2
                                  className={`${main_text_color} notranslate dark:text-green-200 text-gray-800-- font-semibold text-md md:text-xl mb-2`}
                                >
                                  {véhicule?.description || "non disponible"}
                                </h2>

                                <div className="sm:flex flex-col gap-1">
                                  <div
                                    id="statut-box"
                                    className="flex sm:hidden gap-2 items-center "
                                  >
                                    <div>
                                      <IoMdTime
                                        // FaCar
                                        id="car-icon"
                                        className="text-gray-500 dark:text-gray-300"
                                      />
                                    </div>
                                    <p className="text-[.95rem] font-semibold dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-lg">
                                      {véhicule?.totalMovingDuration}
                                    </p>
                                  </div>

                                  {/* ///////////////////////////////// */}

                                  <div
                                    id="statut-box"
                                    className="hidden sm:flex gap-2 items-center "
                                  >
                                    <div>
                                      <p
                                        className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  md:text-[1.02rem]   font-bold dark:text-green-200 `}
                                      >
                                        {t("Durée")}{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem] font-semibold dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {véhicule?.totalMovingDuration}
                                    </p>
                                  </div>
                                  <div
                                    id="statut-box"
                                    className="hidden sm:flex gap-2 items-center "
                                  >
                                    <div>
                                      <p
                                        className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  md:text-[1.02rem]   font-bold dark:text-green-200 `}
                                      >
                                        {t("Départ")}{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {véhicule?.véhiculeDetails[0]?.timestamp
                                        ? FormatDateHeure(
                                            véhicule?.véhiculeDetails[
                                              véhicule?.véhiculeDetails.length -
                                                1
                                            ]?.timestamp
                                          )?.date
                                        : ""}{" "}
                                      {véhicule?.véhiculeDetails[0]
                                        ?.timestamp && (
                                        <span className="px-2"> / </span>
                                      )}{" "}
                                      <span className="font-bold">
                                        {véhicule?.véhiculeDetails[0]?.timestamp
                                          ? FormatDateHeure(
                                              véhicule?.véhiculeDetails[
                                                véhicule?.véhiculeDetails
                                                  .length - 1
                                              ]?.timestamp
                                            )?.time
                                          : `${t(
                                              "Pas de date disponible"
                                            )}`}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div
                                    id="statut-box"
                                    className="hidden sm:flex gap-2 items-center "
                                  >
                                    <div>
                                      <p
                                        className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  md:text-[1.02rem]   font-bold dark:text-green-200 `}
                                      >
                                        {t("Arrivé")}{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {véhicule?.véhiculeDetails[0]?.timestamp
                                        ? FormatDateHeure(
                                            véhicule?.véhiculeDetails[0]
                                              ?.timestamp
                                          )?.date
                                        : ""}{" "}
                                      {véhicule?.véhiculeDetails[0]
                                        ?.timestamp && (
                                        <span className="px-2">/</span>
                                      )}{" "}
                                      <span className="font-bold">
                                        {véhicule?.véhiculeDetails[0]?.timestamp
                                          ? FormatDateHeure(
                                              véhicule?.véhiculeDetails[0]
                                                ?.timestamp
                                            )?.time
                                          : `${t(
                                              "Pas de date disponible"
                                            )}`}{" "}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-x-14">
                                    <div
                                      id="statut-box"
                                      className="hidden sm:flex gap-2 items-center "
                                    >
                                      <div>
                                        <p
                                          className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  md:text-[1.02rem]   font-bold dark:text-green-200 `}
                                        >
                                          {t("Vitesse")}{" "}
                                        </p>
                                      </div>
                                      <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                        {véhicule?.avgSpeed + " Km/h"}
                                      </p>
                                    </div>
                                    <div
                                      id="statut-box"
                                      className="hidden sm:flex gap-2 items-center "
                                    >
                                      <div>
                                        <p
                                          className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  md:text-[1.02rem]   font-bold dark:text-green-200 `}
                                        >
                                          {t("Distance")}{" "}
                                        </p>
                                      </div>
                                      <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                        {véhicule.totalDistance.toFixed(0)} km
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* ///////////////////////////////////////////////////////////////////////////// */}
                            {/* ///////////////////////////////////////////////////////////////////////////// */}
                            <div className="flex flex-col gap-1 sm:hidden">
                              <div className="flex">
                                <p
                                  className={` ${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex  mt-2 md:text-lg   font-bold dark:text-green-200`}
                                >
                                  {t("Départ")}{" "}
                                </p>
                                <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 mt-2 md:text-lg">
                                  {véhicule?.véhiculeDetails[0]?.timestamp
                                    ? FormatDateHeure(
                                        véhicule?.véhiculeDetails[
                                          véhicule?.véhiculeDetails.length - 1
                                        ]?.timestamp
                                      )?.date
                                    : ""}{" "}
                                  {véhicule?.véhiculeDetails[0]?.timestamp && (
                                    <span className="px-2"> / </span>
                                  )}{" "}
                                  <span className="font-bold">
                                    {véhicule?.véhiculeDetails[0]?.timestamp
                                      ? FormatDateHeure(
                                          véhicule?.véhiculeDetails[
                                            véhicule?.véhiculeDetails.length - 1
                                          ]?.timestamp
                                        )?.time
                                      : `${t("Pas de date disponible")}`}{" "}
                                  </span>
                                </p>
                              </div>
                              <div className="flex">
                                <p
                                  className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                >
                                  {t("Arrivé")}{" "}
                                </p>
                                <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                  {véhicule?.véhiculeDetails[0]?.timestamp
                                    ? FormatDateHeure(
                                        véhicule?.véhiculeDetails[0]?.timestamp
                                      )?.date
                                    : ""}{" "}
                                  {véhicule?.véhiculeDetails[0]?.timestamp && (
                                    <span className="px-2">/</span>
                                  )}{" "}
                                  <span className="font-bold">
                                    {véhicule?.véhiculeDetails[0]?.timestamp
                                      ? FormatDateHeure(
                                          véhicule?.véhiculeDetails[0]
                                            ?.timestamp
                                        )?.time
                                      : `${t("Pas de date disponible")}`}{" "}
                                  </span>
                                </p>
                              </div>
                              <div className="flex gap-x-8 flex-wrap ">
                                <div className="flex">
                                  <p
                                    className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                  >
                                    {" "}
                                    {t("Vitesse")}{" "}
                                  </p>
                                  <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                    {véhicule?.avgSpeed + " Km/h"}
                                  </p>
                                </div>

                                <div className="flex">
                                  <p
                                    className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                  >
                                    {" "}
                                    {t("Distance")}{" "}
                                  </p>
                                  <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                    {véhicule.totalDistance.toFixed(0)} km
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                      </div>
                    );
                  })
                ) : (
                  <p className="mt-12 text-center dark:text-gray-50 mr-6">
                    {t("Pas de resultat")}
                  </p>
                )}
              </div>
            </div>
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
        {/* Voir le trajet d'un vehicule sur la carte */}
        {voirTrajetDansLaCarte && (
          <div className=" fixed inset-0 z-[999999999999999999] p-2 md:p-4 lg:px-10 bg-black/50">
            <div className="relative  rounded-lg  mt-3-- h-[100vh]  overflow-hidden w-full">
              <button
                className="absolute z-[9999999999999999999999999] top-[1rem] right-[1rem]"
                onClick={() => {
                  setVoirTrajetDansLaCarte(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                  <IoClose className="text-white text-[1.52rem]" />
                </div>
              </button>
              <div className="w-full max-h-[90vh]  overflow-hidden border-2-- ">
                <div className="   ">
                  <div>
                    <TrajetVehicule
                      typeDeVue={typeDeVue}
                      setTypeDeVue={setTypeDeVue}
                      mapType={mapType}
                      handleMapTypeChange={handleMapTypeChange}
                      vehicles={vehicles}
                      mapRef={mapRef}
                      tileLayers={tileLayers}
                      getMarkerIcon={getMarkerIcon}
                      currentLocation={currentLocation}
                      customMarkerIcon={customMarkerIcon}
                      positions={positions}
                      centerOnFirstMarker={centerOnFirstMarker}
                      showHistoriqueInMap={showHistoriqueInMap}
                      openGoogleMaps={openGoogleMaps}
                    />
                  </div>
                </div>{" "}
              </div>
            </div>
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Non utiliser/ a supprimer */}
        {trajetVehiculePupup && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white  rounded-lg p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold">{t("Trajet du véhicule")}</h2>
                <IoClose
                  onClick={() => {
                    settrajetVehiculePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <div className="min-h-[60vh] overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <p className="text-center">
                    {t("Trajet du véhicule ici")}...
                  </p>
                </div>{" "}
              </div>
            </div>
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  Tableau des deplacements */}
        {tableDeplacement && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  {t("Tableau des deplacements")}
                </h2>
                <IoClose
                  onClick={() => {
                    settableDeplacement(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                        #
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        {t("Véhicule")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure d'arrivée")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse d'arrivée")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByDepartureTime?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2 notranslate  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border notranslate cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {véhicule?.véhiculeDetails[0]?.timestamp && (
                            <span className="px-3">/</span>
                          )}
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.date
                            : ""}{" "}
                          {véhicule?.véhiculeDetails[0]?.timestamp && (
                            <span className="px-3">/</span>
                          )}
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>

                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails?.length - 1
                              ]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate cursor-pointer notranslate  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate cursor-pointer notranslate  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
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
        {/* Tableau des Distances */}
        {tableDistance && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  {t("Tableau des Distances")}
                </h2>
                <IoClose
                  onClick={() => {
                    settableDistance(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                        #
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        {t("Véhicule")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Distance parcoure")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure d'arrivée")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse d'arrivée")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByDistance?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2 notranslate  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border notranslate cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2   dark:bg-gray-800  dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2 notranslate  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.totalDistance.toFixed(0) + " Km"}
                        </td>
                        <td className="border py-3 px-2 notranslate    dark:bg-gray-800  dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>
                        <td className="border py-3 px-2 notranslate    dark:bg-gray-800  dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>

                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails?.length - 1
                              ]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer  dark:bg-gray-800  dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer  dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Tableau des activites */}
        {tableActivite && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  {t("Tableau des activites")}
                </h2>
                <IoClose
                  onClick={() => {
                    settableActivite(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                        #
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        {t("Véhicule")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Duree du trajet")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure d'arrivée")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse d'arrivée")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByMovingDuration?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2 notranslate  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border notranslate cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.totalMovingDuration}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>

                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails?.length - 1
                              ]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate cursor-pointer notranslate  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Tableau des vitesse */}
        {tablevitesse && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  {t("Tableau des vitesse")}
                </h2>
                <IoClose
                  onClick={() => {
                    settablevitesse(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                        #
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        {t("Véhicule")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Vitesse maximale")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Vitesse minimale")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Vitesse moyenne")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Date et Heure d'arrivée")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse d'arrivée")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByDistance?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2 notranslate  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border notranslate cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.description || "---"}
                        </td>

                        <td className="border py-3 px-2 notranslate  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.maxSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2 notranslate  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.minSpeed?.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2 notranslate  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.avgSpeed + " Km/h"}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : `${t("Pas de dépacement")}`}{" "}
                        </td>

                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails?.length - 1
                              ]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
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
        {/*  */}
        {/*  Tableau du trajet */}
        {tableTrajet && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  {t("Tableau du trajet")}
                </h2>
                <IoClose
                  onClick={() => {
                    settableTrajet(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                        #
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        {t("Véhicule")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Duree du trajet")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Temps d'activité")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Temps d'inactivité")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Distance parcourue")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        {t("Nombre d'arrêt")}
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse de départ")}
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        {t("Adresse d'arrivée")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculeMouvementOrdered?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2 notranslate  bg-gray-50 dark:bg-gray-800  dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border notranslate cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-gray-50 dark:bg-gray-800  dark:border-gray-600"
                        >
                          {véhicule?.description || "---"}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalMovingDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalPauseDuration || "0h 0m 0s"}
                        </td>
                        {/* <td className="border py-3 px-2 notranslate   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          2h 22m 45s
                        </td> */}
                        <td className="border py-3 px-2 notranslate   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.totalDistance?.toFixed(0) + " km" ||
                            " 0 km"}
                        </td>
                        <td className="border py-3 px-2 notranslate   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.stopCount > 0
                            ? véhicule?.stopCount + " " + `${t("arrêts")}`
                            : "0 " + `${t("arrêt")}`}
                        </td>

                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails?.length - 1
                              ]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate  cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 notranslate cursor-pointer notranslate  bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
                            `${t("Pas d'adresse disponible")}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
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
        <h1 className="text-center mb-10 font-semibold text-xl mb-10 dark:text-gray-300">
          {t("Rapport détaillé en groupe")}
        </h1>
        <div
          onClick={() => {
            rapportFetchFonction();
            setIsSearchingFromRapportGroupePage(true);
          }}
          className="text-center bg-orange-500 text-white  rounded-lg py-1.5 max-w-[25rem] cursor-pointer mx-auto mb-10 font-semibold text-[1.1rem] flex gap-4 justify-center items-center dark:text-gray-300"
        >
          <h3>{t("Mettre a jour les donnees")}</h3>
          <MdUpdate className="sm:text-[1.35rem]  text-[1.2rem]  " />
        </div>

        {progressBarForLoadingData > 0 &&
          progressBarForLoadingData < 100 &&
          // !(
          //   progressBarForLoadingData === 100 ||
          //   progressBarForLoadingData === 0 ||
          //   progressAnimationStart === 0
          // ) &&
          // (
          //   (progressBarForLoadingData === 100 &&
          //     progressAnimationStart === 99) ||
          //   progressBarForLoadingData === 0 ||
          //   progressAnimationStart === 0
          // )
          fetchVehicleDataFromRapportGroupe && (
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
        {/*  */}
        {preparationDownloadPDF && <p className="min-h-[4rem]"></p>}
        <div
          className={`
          ${preparationDownloadPDF ? " " : "shadow-md"}
           dark:bg-gray-800 dark:shadow-gray-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
        >
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              {t("Informations sur les véhicules")}
            </h2>
          </div>

          <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
            {/* Date et heure de recherche */}
            <div className="flex flex-wrap">
              <p>{t("Date de recherche trouvée")} : </p>
              <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                {jourDebut ? (
                  <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                    {t("Du")}{" "}
                    <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                      {anneeDebut === anneeFin ? "" : anneeDebut}
                    </span>{" "}
                    {t("au")}{" "}
                    <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      {jourFin} {moisFin} {anneeFin}
                    </span>
                  </span>
                ) : (
                  <span>{t("Pas de date disponible")}</span>
                )}
              </span>
            </div>
            <div className="flex flex-wrap">
              <p>{t("Heure de recherche trouvée")} :</p>
              {jourDebut ? (
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                  {t("De")}{" "}
                  <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                    {heureDebut}
                  </span>{" "}
                  {t("à")}{" "}
                  <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                    {heureFin}{" "}
                  </span>{" "}
                </span>
              ) : (
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                  {t("Pas de date disponible")}
                </span>
              )}
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            {/*  */}
            {/*  */}
            {/*  */}
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              *{" "}
              {isSearchingFromRapportGroupePage
                ? t("Informations de recherche")
                : t("Informations Actuellement")}
            </h2>

            <div className="flex justify-between items-center pr-3">
              <p>
                {t("Nombre total de véhicules")} :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {(currentDataFusionné && currentDataFusionné?.length) || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setFilter("all");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                {t("voir")}
              </p>
            </div>
            {!isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicule en mouvement")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("isMovingRightNowToday")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("isMovingRightNowToday");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {!isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicule en stationnement")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("ispParkingRightNowToday")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("ispParkingRightNowToday");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {!isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicule hors service")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("isNotActiveRithtNowToday")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("isNotActiveRithtNowToday");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {/*  */}
            {/*  */}
            {/*  */}
            {!isSearchingFromRapportGroupePage && (
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            )}
            {/*  */}
            {/*  */}
            {/*  */}
            {!isSearchingFromRapportGroupePage && (
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                * {t("Information sur les déplacements")}
              </h2>
            )}

            {!isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicules déplacés")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("hasBeenMovingToday")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("hasBeenMovingToday");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}
            {!isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicules non déplacés")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("hasNotBeenMovingToday")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("hasNotBeenMovingToday");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicules déplacés")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("hasBeenMovingFromSearch")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("hasBeenMovingFromSearch");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}
            {isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicules non déplacés")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction(
                        "hasNotBeenMovingFromSearch"
                      )?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("hasNotBeenMovingFromSearch");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {isSearchingFromRapportGroupePage && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  {t("Véhicules hors service")} :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      filteredVehiclesListeFonction("isNotActiveFromSearch")
                        ?.length
                    }
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setFilter("isNotActiveFromSearch");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  {t("voir")}
                </p>
              </div>
            )}

            {/* ////////////////////////////////////////////////////////////////////////////// */}
            {!voirPlus && (
              <div>
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                <div
                  onClick={() => {
                    setvoirPlus(true);
                  }}
                  className="text-white rounded-lg text-center bg-orange-500/90 py-1 px-4  font-semibold cursor-pointer"
                >
                  {t("voir Plus")}
                </div>
              </div>
            )}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
        {/* ////////////////////////////////////////////////////// */}
        {/* ////////////////////////////////////////////////////// */}
        {/* ////////////////////////////////////////////////////// */}
        {/* ////////////////////////////////////////////////////// */}
        {/* ////////////////////////////////////////////////////// */}
        <div
          className={`${
            voirPlus ? "max-h-[150rem]" : "max-h-[0rem]"
          } transition-all overflow-hidden `}
        >
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
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/* Vehicule en mouvement en premier */}
          {/* {vehiculeMouvementOrdered && vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 && ( */}
          <div
            className={`
             ${preparationDownloadPDF ? " " : "shadow-md"}
             mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                {t("Véhicule en mouvement en 1er")}
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiclesByDepartureTime &&
                  vehiclesByDepartureTime[0]?.véhiculeDetails.length > 0 && (
                    <div>
                      <div className="sm:flex gap-10 mt-3-- px-2">
                        <div className="flex gap-0 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                          <p className="text-[.9rem]">
                            <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                              {
                                <span className="text-[1rem] dark:text-gray-300 text-gray-900 font-semibold sm:text-sm md:text-[1rem]  lg:text-lg--">
                                  {t("Le")} {jourPemierMouvement}{" "}
                                  {moisPemierMouvement} {anneePemierMouvement}
                                </span>
                                // )
                              }
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="px-2 mt-">
                        <div className="flex gap-3 items-center">
                          <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />
                          <p className="dark:text-gray-300">
                            {t("De")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiclesByDepartureTime &&
                              vehiclesByDepartureTime[0]?.véhiculeDetails[
                                vehiclesByDepartureTime[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByDepartureTime[0]?.véhiculeDetails[
                                      vehiclesByDepartureTime[0]
                                        ?.véhiculeDetails.length - 1
                                    ]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>{" "}
                            {t("à")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiclesByDepartureTime &&
                              vehiclesByDepartureTime[0]?.véhiculeDetails[
                                vehiclesByDepartureTime[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByDepartureTime[0]
                                      ?.véhiculeDetails[0]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                    </div>
                  )}

                {/*  */}
                {/*  */}
                {/*  */}
                <p className="font-semibold pl-2 dark:text-gray-50">
                  {t("Nom du véhicule")} :<br />
                  <span className="font-normal notranslate dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiclesByDepartureTime &&
                    vehiclesByDepartureTime[0]?.véhiculeDetails.length > 0
                      ? vehiclesByDepartureTime[0]?.description + " a "
                      : `${t("Pas de véhicule en mouvement")}`}
                  </span>
                  <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                    {vehiclesByDepartureTime &&
                    vehiclesByDepartureTime[0]?.véhiculeDetails[
                      vehiclesByDepartureTime[0]?.véhiculeDetails.length - 1
                    ]?.timestamp
                      ? FormatDateHeure(
                          vehiclesByDepartureTime[0]?.véhiculeDetails[
                            vehiclesByDepartureTime[0]?.véhiculeDetails.length -
                              1
                          ]?.timestamp
                        )?.time
                      : " "}{" "}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                {!preparationDownloadPDF && (
                  <div className="flex gap-6">
                    {vehiclesByDepartureTime &&
                      vehiclesByDepartureTime[0]?.véhiculeDetails.length >
                        0 && (
                        <button
                          onClick={() => {
                            // settrajetVehiculePupup(true);
                            positionDansCarte(vehiclesByDepartureTime[0]);
                            setVoirTrajetDansLaCarte(true);
                          }}
                          className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                        >
                          {t("Voir sur la carte")}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        settableDeplacement(true);
                      }}
                      className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                    >
                      {t("Plus d'info")}
                    </button>
                  </div>
                )}

                {/* //////////////////////////////// */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
          </div>
          {/* )} */}
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
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/* véhicule en mouvement en premier */}
          <div
            className={`
            
             ${
               preparationDownloadPDF ? " " : "shadow-md"
             } mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                {t("Véhicule ayant parcouru la plus grande distance")}
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered &&
                  vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 && (
                    <div>
                      <div className="sm:flex gap-10 mt-3-- px-2">
                        <div className="flex gap-0 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                          <p className="text-[1rem]  dark:text-gray-300">
                            <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                              {
                                <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                  {t("Du")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourPemierDistance}{" "}
                                    {moisPemierDistance === moisDernierDistance
                                      ? ""
                                      : moisPemierDistance}{" "}
                                    {anneePemierDistance ===
                                    anneeDernierDistance
                                      ? ""
                                      : anneePemierDistance}
                                  </span>{" "}
                                  {t("au")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourDernierDistance} {moisDernierDistance}{" "}
                                    {anneeDernierDistance}
                                  </span>
                                </span>
                                // )
                              }
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="px-2 mt-">
                        <div className="flex gap-3 items-center">
                          <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />
                          <p className=" dark:text-gray-300">
                            {t("De")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByDistance[0]?.véhiculeDetails[
                                      vehiclesByDistance[0]?.véhiculeDetails
                                        .length - 1
                                    ]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>{" "}
                            {t("à")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByDistance[0]?.véhiculeDetails[0]
                                      ?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                    </div>
                  )}
                {/*  */}
                {/*  */}
                {/*  */}
                <p className="font-semibold pl-2 dark:text-gray-50">
                  {t("Nom du véhicule")} :<br />
                  <span className="font-normal notranslate dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByDistance[0]?.description + " "
                      : `${t("Pas de véhicule en mouvement")}`}
                  </span>{" "}
                  {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 &&
                    ` ( ${t("environ")} ` +
                      " " +
                      vehiclesByDistance[0]?.totalDistance.toFixed(0) +
                      " Km )"}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                {!preparationDownloadPDF && (
                  <div className="flex gap-6">
                    {vehiculeMouvementOrdered &&
                      vehiculeMouvementOrdered[0]?.véhiculeDetails.length >
                        0 && (
                        <button
                          onClick={() => {
                            // settrajetVehiculePupup(true);
                            positionDansCarte(vehiclesByDistance[0]);

                            setVoirTrajetDansLaCarte(true);
                          }}
                          className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                        >
                          {t("Voir sur la carte")}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        settableDistance(true);
                      }}
                      className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                    >
                      {t("Plus d'info")}
                    </button>
                  </div>
                )}

                {/* //////////////////////////////// */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
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

          {/* {preparationDownloadPDF && <p className="min-h-[13rem]"></p>} */}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/* véhicule en mouvement plus longtemps */}
          <div
            className={`
             ${preparationDownloadPDF ? " " : "shadow-md"}
             mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                {t("Véhicule en mouvement plus longtemps")}
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered &&
                  vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 && (
                    <div>
                      <div className="sm:flex gap-10 mt-3-- px-2">
                        <div className="flex gap-0 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                          <p className="text-[.9rem]">
                            <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                              {
                                <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                  {t("Du")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourPemierDistanceLontan}{" "}
                                    {moisPemierDistanceLontan ===
                                    moisDernierDistanceLontan
                                      ? ""
                                      : moisPemierDistanceLontan}{" "}
                                    {anneePemierDistanceLontan ===
                                    anneeDernierDistanceLontan
                                      ? ""
                                      : anneePemierDistanceLontan}
                                  </span>{" "}
                                  {t("au")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourDernierDistanceLontan}{" "}
                                    {moisDernierDistanceLontan}{" "}
                                    {anneeDernierDistanceLontan}
                                  </span>
                                </span>
                                // )
                              }
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="px-2 mt-">
                        <div className="flex gap-3 items-center">
                          <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />
                          <p className=" dark:text-gray-300">
                            {t("De")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByMovingDuration[0]
                                      ?.véhiculeDetails[
                                      vehiclesByMovingDuration[0]
                                        ?.véhiculeDetails.length - 1
                                    ]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>{" "}
                            {t("à")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiclesByMovingDuration[0]
                                      ?.véhiculeDetails[0]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                    </div>
                  )}

                {/*  */}
                {/*  */}
                {/*  */}
                <p className="font-semibold pl-2 dark:text-gray-50">
                  {t("Nom du véhicule")} :<br />
                  <span className="font-normal notranslate dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByMovingDuration[0]?.description
                      : `${t("Pas de véhicule en mouvement")}`}
                  </span>
                  {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 &&
                    `( ${t("environ")} ` +
                      vehiclesByMovingDuration[0]?.totalMovingDuration +
                      " )"}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                {!preparationDownloadPDF && (
                  <div className="flex gap-6">
                    {vehiculeMouvementOrdered &&
                      vehiculeMouvementOrdered[0]?.véhiculeDetails.length >
                        0 && (
                        <button
                          onClick={() => {
                            // settrajetVehiculePupup(true);
                            positionDansCarte(vehiclesByMovingDuration[0]);

                            setVoirTrajetDansLaCarte(true);
                          }}
                          className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                        >
                          {t("Voir sur la carte")}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        settableActivite(true);
                      }}
                      className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                    >
                      {t("Plus d'info")}
                    </button>
                  </div>
                )}

                {/* //////////////////////////////// */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
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
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {/* véhicule avec la vitesse maximale */}
          <div
            className={`
             ${preparationDownloadPDF ? " " : "shadow-md"}
             mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                {t("Véhicule avec la vitesse maximale")}
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered &&
                  vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 && (
                    <div>
                      <div className="sm:flex gap-10 mt-3-- px-2">
                        <div className="flex gap-0 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                          <p className="text-[.9rem]">
                            <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                              {
                                <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                  {t("Du")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourPemierDistanceLontan}{" "}
                                    {moisPemierDistanceLontan ===
                                    moisDernierDistanceLontan
                                      ? ""
                                      : moisPemierDistanceLontan}{" "}
                                    {anneePemierDistanceLontan ===
                                    anneeDernierDistanceLontan
                                      ? ""
                                      : anneePemierDistanceLontan}
                                  </span>{" "}
                                  {t("au")}{" "}
                                  <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                    {jourDernierDistanceLontan}{" "}
                                    {moisDernierDistanceLontan}{" "}
                                    {anneeDernierDistanceLontan}
                                  </span>
                                </span>
                                // )
                              }
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="px-2 mt-">
                        <div className="flex gap-3 items-center">
                          <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />
                          <p className=" dark:text-gray-300">
                            {t("De")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiculeMouvementOrdered[0]
                                      ?.véhiculeDetails[
                                      vehiculeMouvementOrdered[0]
                                        ?.véhiculeDetails.length - 1
                                    ]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>{" "}
                            {t("à")}{" "}
                            <span className="font-semibold">
                              {" "}
                              {vehiculeMouvementOrdered &&
                              vehiculeMouvementOrdered[0]?.véhiculeDetails[
                                vehiculeMouvementOrdered[0]?.véhiculeDetails
                                  .length - 1
                              ]?.timestamp
                                ? FormatDateHeure(
                                    vehiculeMouvementOrdered[0]
                                      ?.véhiculeDetails[0]?.timestamp
                                  )?.time
                                : " "}{" "}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                    </div>
                  )}

                {/*  */}
                {/*  */}
                {/*  */}
                <p className="font-semibold pl-2 dark:text-gray-50">
                  {t("Nom du véhicule")} :<br />
                  <span className="font-normal notranslate dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByMaxSpeed[0]?.description
                      : `${t("Pas de véhicule en mouvement")}`}
                  </span>
                  <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeMouvementOrdered &&
                      vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 &&
                      "( " +
                        vehiclesByMaxSpeed[0]?.maxSpeed.toFixed(0) +
                        " km/h )"}{" "}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                {!preparationDownloadPDF && (
                  <div className="flex gap-6">
                    {vehiculeMouvementOrdered &&
                      vehiculeMouvementOrdered[0]?.véhiculeDetails.length >
                        0 && (
                        <button
                          onClick={() => {
                            // settrajetVehiculePupup(true);
                            positionDansCarte(vehiclesByMaxSpeed[0]);
                            setVoirTrajetDansLaCarte(true);
                          }}
                          className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                        >
                          {t("Voir sur la carte")}
                        </button>
                      )}
                    <button
                      onClick={() => {
                        settablevitesse(true);
                      }}
                      className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                    >
                      {t("Plus d'info")}
                    </button>
                  </div>
                )}

                {/* //////////////////////////////// */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
          {voirPlus && !preparationDownloadPDF && (
            <div
              onClick={() => {
                setvoirPlus(false);
                window.scrollTo({
                  top: 200,
                  behavior: "auto", // Défilement fluide
                  // behavior: "smooth", // Défilement fluide
                });
              }}
              className="p-4 text-center  py-1 my-4 rounded-lg cursor-pointer shadow-lg shadow-gray-400/20 bg-orange-500/80 mt-8"
            >
              <p className="text-white font-semibold  cursor-pointer">
                {t("voir moins")}
              </p>
            </div>
          )}
          {/*  */}
          {/*  */}
          {/*  */}
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
        {/*  */}
        {/*  */}
        <div
          className={`
          ${preparationDownloadPDF ? " " : "shadow-md"}
           mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
        >
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              {t("Informations sur le trajet des véhicules")}
            </h2>
          </div>

          <div>
            <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
              <div className="flex flex-wrap">
                <p>{t("Date de recherche trouvée")} : </p>
                <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                  {
                    jourDebut ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        {t("Du")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        {t("au")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      <span>{t("Pas de date disponible")}</span>
                    )
                    // )
                  }
                </span>
              </div>

              <div className="flex flex-wrap">
                <p>{t("Heure de recherche trouvée")} :</p>
                {jourDebut ? (
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {t("De")}{" "}
                    <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                      {heureDebut}
                    </span>{" "}
                    {t("à")}{" "}
                    <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                      {heureFin}{" "}
                    </span>{" "}
                  </span>
                ) : (
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {t("Pas de date disponible")}
                  </span>
                )}
              </div>

              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}

              <div className="flex gap-2 justify-between">
                <p>
                  {t("Temps d'activité total")} :
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {totalMovingDuration || `${t("Pas de deplacement")}`}
                  </span>
                </p>

                <p
                  onClick={() => {
                    settableTrajet(true);
                  }}
                  className="text-orange-400 min-w-[4rem] border-b-- border-b-orange-400-- underline cursor-pointer"
                >
                  {t("voir plus")}
                </p>
              </div>
              <p>
                {t("Distance totale parcourue")}:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {(totalDistanceSum && totalDistanceSum.toFixed(0) + " km") ||
                    `${t("Pas de mouvement")}`}
                </span>
              </p>

              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <p>
                {t("Nombre total d’arrêts")} :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {nombreTotaleArret > 0
                    ? nombreTotaleArret + "" + `${t("arrêts")}`
                    : " 0 " + `${t("arrêts")}`}
                </span>
              </p>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="flex gap-2 justify-between">
                <p>
                  {t("Vitesse minimale")}:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {speeds.minSpeed != "Infinity"
                      ? speeds && speeds.minSpeed?.toFixed(0) + " Km/h"
                      : "0 Km/h"}
                  </span>
                </p>{" "}
                <p
                  onClick={() => {
                    settablevitesse(true);
                  }}
                  className="text-orange-400 min-w-[4rem] border-b-- border-b-orange-400-- underline cursor-pointer"
                >
                  {t("voir plus")}
                </p>
              </div>
              <p>
                {t("Vitesse maximale")}:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {speeds.maxSpeed != "-Infinity"
                    ? speeds && speeds.maxSpeed?.toFixed(0) + " Km/h"
                    : "0 Km/h"}
                </span>
              </p>
              <p>
                {t("Vitesse moyenne")}:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {totalAvgSpeed?.toFixed(0) + " Km/h"}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* {preparationDownloadPDF && <p className="min-h-[11rem]"></p>} */}
        {!preparationDownloadPDF && (
          <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
            <MdLocationPin className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              {t("Position des véhicules")}{" "}
            </h2>
          </div>
        )}
        {!preparationDownloadPDF && (
          <div>
            {zoomPosition ? (
              <div className="fixed inset-0 z-[9999999999999999999999] bg-black/50">
                <div className="relative  h-[100vh]  rounded-lg mt-3-- overflow-hidden">
                  <button
                    className="absolute z-[999] top-[1rem] right-[1rem]"
                    onClick={() => {
                      setzoomPosition(false);
                      setSelectedVehicleToShowInMap(null);
                    }}
                  >
                    <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                      <IoClose className="text-white text-[1.52rem]" />
                    </div>
                  </button>
                  <div className=" -translate-y-[10rem]---">
                    <MapComponent mapType={mapType} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-[40vh] md:h-[60vh] rounded-lg mt-3 overflow-hidden">
                <button
                  className="absolute shadow-lg shadow-gray-400 rounded-full z-[99] top-[4rem] right-[0.3rem]"
                  onClick={() => {
                    setzoomPosition(true);
                    setSelectedVehicleToShowInMap(null);
                  }}
                >
                  <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                    <MdOutlineFullscreen className="text-orange-500 text-[2rem]" />
                  </div>
                </button>
                <div className=" -translate-y-[10rem]">
                  <MapComponent mapType={mapType} />
                </div>
              </div>
            )}
          </div>
        )}
        {/* zoomPosition */}
        {/* <button onClick={() => exportToExcel()}>
          Exporter la table en Excel
        </button> */}
        {preparationDownloadPDF && <p className="min-h-[13rem]">.</p>}
        <div
          className={`
          ${preparationDownloadPDF ? " " : "shadow-md"}
           mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4`}
        >
          <BsTable className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
          <div className="flex justify-between items-center  w-full">
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              {t("Tableau récapitulatif")}{" "}
            </h2>
            <div onClick={() => {}} className="cursor-pointer relative">
              <p
                onClick={() => {
                  setshowsortfilterpupup(true);
                }}
                className="font-semibold underline text-orange-600"
              >
                {t("Filtrer")}
              </p>
              {showsortfilterpupup && (
                <div className="absolute z-[30] flex flex-col gap-0 bg-white dark:bg-gray-700 dark:shadow-gray-900 dark:border shadow-lg shadow-gray-500 rounded-md p-3 top-10 -right-2 min-w-[20rem]">
                  <div className="flex justify-between mb-2 items-center ">
                    <p className="text-orange-500  font-semibold">
                      {t("Filtrer par")} :
                    </p>
                    <IoClose
                      onClick={() => {
                        setshowsortfilterpupup(false);
                      }}
                      className="cursor-pointer text-2xl text-red-500"
                    />{" "}
                  </div>

                  <div className="flex gap-2 mb-4 p-[.2rem] border  shadow-md shadow-orange-100 border-orange-100 rounded-lg justify-between">
                    <p
                      onClick={() => {
                        setTableSortCroissant(true);
                        // settableSortBy(vehiclesByDepartureTime);
                        // settableSortByColorBg("vehiclesByDepartureTime");
                        // settableSortBy(tableSortBy);
                      }}
                      className={` w-full py-1 font-semibold text-center ${
                        tableSortCroissant ? "bg-orange-100 " : ""
                      } rounded-lg border border-white/0  hover:border hover:border-orange-200`}
                    >
                      {t("Croissant")}
                    </p>
                    <p
                      onClick={() => {
                        // settableSortBy(tableSortBy);
                        setTableSortCroissant(false);
                        // settableSortBy(vehiclesByDepartureTime);
                        // settableSortByColorBg("vehiclesByDepartureTime");
                      }}
                      className={`w-full py-1 font-semibold text-center  ${
                        !tableSortCroissant ? "bg-orange-100 " : ""
                      } rounded-lg  border border-white/0 hover:border hover:border-orange-200`}
                    >
                      {t("Décroissant")}
                    </p>
                  </div>

                  <p
                    onClick={() => {
                      settableSortBy(vehiclesByDepartureTime);
                      settableSortByColorBg("vehiclesByDepartureTime");
                      setshowsortfilterpupup(false);
                    }}
                    className={`${
                      tableSortByColorBg ===
                        ("vehiclesByDepartureTime" || "") &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    {t("Heure de départ")}
                  </p>

                  <p
                    onClick={() => {
                      settableSortBy(vehiclesByDistance);
                      settableSortByColorBg("vehiclesByDistance");
                      setshowsortfilterpupup(false);

                      console.log(
                        "xxxxxxxxxxxxxxxxxxxxxxx",
                        tableSortByColorBg
                      );
                    }}
                    className={`${
                      tableSortByColorBg === "vehiclesByDistance" &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    {t("Distance parcouru")}
                  </p>
                  <p
                    onClick={() => {
                      settableSortBy(vehiclesByMovingDuration);
                      settableSortByColorBg("vehiclesByMovingDuration");
                      setshowsortfilterpupup(false);

                      console.log("xxxxxxxxxxxxxxxxxxxxxxx", tableSortBy);
                    }}
                    className={`${
                      tableSortByColorBg === "vehiclesByMovingDuration" &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    {t("Temps en mouvement")}
                  </p>
                  <p
                    onClick={() => {
                      settableSortBy(vehiclesByMaxSpeed);
                      settableSortByColorBg("vehiclesByMaxSpeed");
                      setshowsortfilterpupup(false);
                    }}
                    className={`${
                      tableSortByColorBg === "vehiclesByMaxSpeed" &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    {t("Vitesse maximale")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between  mt-4  items-center ">
          <div className="sm:flex w-full gap-10 max-w-[50rem] mx-4-- justify-start items-center ">
            <div className="flex gap-0 items-center">
              <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
              <p className="text-[.9rem]">
                <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                  {
                    <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      {t("Du")}{" "}
                      <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                        {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                        {anneeDebut === anneeFin ? "" : anneeDebut}
                      </span>{" "}
                      {t("au")}{" "}
                      <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                        {jourFin} {moisFin} {anneeFin}
                      </span>
                    </span>
                    // )
                  }
                </span>
              </p>
            </div>

            <div className="flex gap-0 items-center">
              <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

              <p className="text-[.9rem]">
                <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                  {t("De")}{" "}
                  <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                    {heureDebut}
                  </span>{" "}
                  {t("à")}{" "}
                  <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                    {heureFin}
                  </span>{" "}
                </span>
              </p>
            </div>
          </div>

          {!preparationDownloadPDF && (
            <div
              onClick={() => {
                exportToExcel();
              }}
              className="border  gap-2 items-center px-4 hidden lg:flex cursor-pointer border-green-600 font-semibold rounded-lg text-green-600"
            >
              <p>{t("Télécharger")}</p>
              <img
                className="w-[2rem] mr-3--"
                src="/img/exel_download.png"
                alt=""
              />
            </div>
          )}

          {preparationDownloadPDF && (
            <p
              onClick={() => {
                exportToExcel();
              }}
              className=" lg:hidden cursor-pointer     py-1 px-4"
            >
              <img className="w-[2.6rem]" src="/img/exel_download.png" alt="" />
            </p>
          )}
        </div>
        <div className="mt-4  flex items-center gap-2">
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 ">
            {t("Véhicules déplacés")}
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
            {t("Véhicules non déplacés")}
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
            {t("Véhicules hors service")}
          </p>
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
        {/*  */}
        <div
          className={`${
            preparationDownloadPDF ? "" : "md:h-[25rem] h-[20rem] "
          }  w-full mt-4 mb-20 overflow-x-auto overflow-y-hidden`}
        >
          <thead className="">
            <tr className="bg-orange-50  relative z-20 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
              <th className="border border-l-4  border-l-orange-200  min-w-[0rem] max-w-[0rem]"></th>
              <th className="text-start border-l-4--   border-l-orange-200 border dark:border-gray-600 py-3 px-2 min-w-[4rem] max-w-[4rem]">
                #
              </th>

              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[18rem] max-w-[18rem]">
                {t("Véhicule")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2  min-w-[13rem] max-w-[13rem]">
                {t("Date et Heure de départ")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                {t("Date et Heure d'arrivée")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                {t("Vitesse moyenne")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                {t("Vitesse maximale")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                {t("Distance totale")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                {t("Nombre d'arrêts")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[12rem] max-w-[12rem]">
                {t("Temps en mouvement")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                {t("Adresse de départ")}
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                {t("Adresse d'arrivée")}
              </th>
            </tr>
          </thead>

          <div
            ref={tableRef}
            className={` ${
              preparationDownloadPDF ? "" : "md:h-[25rem] h-[20rem] "
            }  border-2-- pb-10 -translate-y-[3.1rem] w-full min-w-[160rem]  overflow-y-auto overflow-x-hidden`}
          >
            <div>
              {/* eeeeeeeeeeeeeeeeeeeee */}
              {preparationDownloadPDF && (
                <div>
                  <p className="text-white">.</p>
                  <p className="text-white">.</p>

                  <h2 className="w-full  mt-20 text-center font-semibold text-gray-800 text-[3rem] dark:text-orange-50 ">
                    {t("Tableau récapitulatif")}{" "}
                  </h2>
                  <div className="flex justify-between  mt-4  items-center ">
                    <div className="sm:flex w-full gap-20 max-w-[50rem]-- mx-4-- justify-start items-center ">
                      <div className="flex gap-0 items-center text-xl">
                        <p className="font-bold ">
                          {tableSortByColorBg("Date du résultat")}:{" "}
                        </p>
                        <p className="text-[.9rem]--  text-xl">
                          <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                            {
                              <span className="text-[.85rem]--  --sm:text-sm md:text-[1rem]-- text-xl  lg:text-lg--">
                                {t("Du")}{" "}
                                <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                                  {jourDebut}{" "}
                                  {moisDebut === moisFin ? "" : moisDebut}{" "}
                                  {anneeDebut === anneeFin ? "" : anneeDebut}
                                </span>{" "}
                                {t("au")}{" "}
                                <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                                  {jourFin} {moisFin} {anneeFin}
                                </span>
                              </span>
                              // )
                            }
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-0 items-center text-xl">
                        <p className="font-bold ">{t("Heure du résultat")}: </p>

                        <p className="text-[.9rem]-- text-xl">
                          <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                            {t("De")}{" "}
                            <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                              {heureDebut}
                            </span>{" "}
                            {t("à")}{" "}
                            <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                              {heureFin}
                            </span>{" "}
                          </span>
                        </p>
                      </div>
                    </div>

                    {!preparationDownloadPDF && (
                      <div
                        onClick={() => {
                          exportToExcel();
                        }}
                        className="border  gap-2 items-center px-4 hidden lg:flex cursor-pointer border-green-600 font-semibold rounded-lg text-green-600"
                      >
                        <p>{t("Télécharger")}</p>
                        <img
                          className="w-[2rem] mr-3--"
                          src="/img/exel_download.png"
                          alt=""
                        />
                      </div>
                    )}

                    {preparationDownloadPDF && (
                      <p
                        onClick={() => {
                          exportToExcel();
                        }}
                        className=" lg:hidden cursor-pointer     py-1 px-4"
                      >
                        <img
                          className="w-[2.6rem]"
                          src="/img/exel_download.png"
                          alt=""
                        />
                      </p>
                    )}
                  </div>
                  <div className="mt-4 mb-8 flex items-center gap-2">
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 ">
                      {t("Véhicules déplacés")}
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
                      {t("Véhicules non déplacés")}
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
                      {t("Véhicules hors service")}
                    </p>
                  </div>
                </div>
              )}
              {/* xxxxxxxxxxxxxxxxxxxxxxxx */}
              <table
                // ref={tableRef}
                id="myTable"
                className=" w-full text-left dark:bg-gray-800 dark:text-gray-200"
              >
                <thead>
                  <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                    <th className="border border-l-4  border-l-red-600  min-w-[0rem] max-w-[0rem]"></th>
                    <th className="border border-l-4--  border-l-red-600 dark:border-gray-600 py-3 px-2  min-w-[4rem] max-w-[4rem]">
                      #
                    </th>

                    <th className="border dark:border-gray-600 py-3 px-2  min-w-[18rem] max-w-[18rem]">
                      {t("Véhicule")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                      {t("Date et Heure de départ")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                      {t("Date et Heure d'arrivée")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                      {t("Vitesse moyenne")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                      {t("Vitesse maximale")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                      {t("Distance totale")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                      {t("Nombre d'arrêts")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[12rem] max-w-[12rem]">
                      {t("Temps en mouvement")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                      {t("Adresse de départ")}
                    </th>
                    <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem]  max-w-[30rem]">
                      {t("Adresse d'arrivée")}
                    </th>
                  </tr>
                </thead>

                <tbody className="  max-w-20">
                  {(tableSortBy || vehiclesByDepartureTime)?.map(
                    (véhicule, index) => {
                      // Trouver le véhicule correspondant dans updateData
                      const matchedVehicle =
                        currentDataFusionné &&
                        currentDataFusionné.find(
                          (v) => v.deviceID === véhicule?.deviceID
                        );

                      const isMoving = matchedVehicle.véhiculeDetails?.some(
                        (detail) => detail.speedKPH >= 1
                      );

                      const hasDetails =
                        matchedVehicle.véhiculeDetails &&
                        matchedVehicle.véhiculeDetails.length > 0;

                      const noSpeed = matchedVehicle.véhiculeDetails?.every(
                        (detail) => detail.speedKPH <= 0
                      );

                      // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                      const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
                        ? matchedVehicle.lastUpdateTime * 1000
                        : 0;
                      const isActive =
                        currentTime - lastUpdateTimeMs < twentyHoursInMs;

                      ///////////////////////////////////////////////////////////////////////////
                      // iiiiiiiiiiiiiiiiiiiiiiiiiiii

                      const lastUpdateTimestampMs =
                        matchedVehicle.véhiculeDetails &&
                        matchedVehicle.véhiculeDetails[0] &&
                        matchedVehicle.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

                      ////////////////////////////////////////////////////////////////////

                      let iconBg = "text-red-500 dark:text-red-500";
                      let vehiculeBG =
                        "bg-red-50/50-- hover:bg-red-100 dark:hover:bg-gray-700";

                      if (hasDetails && isMoving) {
                        iconBg =
                          "text-green-500 bg-green-50/50  dark:text-green-500 border-l-green-600 dark:border-l-green-600";
                        vehiculeBG =
                          "bg-green-50/50-- text-green-800 dark:text-green-200 font-semibold hover:bg-green-100 dark:hover:bg-gray-700";
                      } else if (hasDetails && noSpeed && isActive) {
                        iconBg =
                          "text-red-500  bg-red-50/50 dark:text-red-500 border-l-red-500 dark:border-l-red-600";
                        vehiculeBG =
                          "bg-red-50/50--  text-red-700 dark:text-red-200  font-semibold hover:bg-red-100 dark:hover:bg-gray-700";
                      } else if (!hasDetails || !isActive) {
                        iconBg =
                          "text-purple-800  bg-purple-50/50 dark:text-purple-100 border-l-purple-500 dark:border-l-purple-600";
                        vehiculeBG =
                          "bg-purple-50/50--  text-purple-800 dark:text-purple-200  font-semibold hover:bg-purple-100 dark:hover:bg-gray-700";
                      }
                      {
                        /* yyyyyyyyyyyyyyyyyyyyyy */
                      }

                      ///////////////////////////////////////////////////////////////////////
                      return (
                        <tr key={index} className="border dark:border-gray-600">
                          <td
                            className={`${iconBg}   border font-semibold text-lg border-l-4  dark:bg-gray-900/70  dark:border-gray-600`}
                          ></td>
                          <td
                            className={`${iconBg}   border font-semibold text-lg border-l-4--  py-3 px-2  bg-gray-50-- dark:bg-gray-900/70  dark:border-gray-600`}
                          >
                            {index + 1 || "---"}
                          </td>
                          <td
                            onClick={() => {
                              handleClick(véhicule);
                            }}
                            className={`${vehiculeBG} notranslate border cursor-pointer  py-3 px-2  bg-gray-50-- dark:bg-gray-900/70  dark:border-gray-600 `}
                          >
                            {véhicule?.description || "---"}
                          </td>
                          {/*  */}
                          <td
                            className={`${
                              tableSortByColorBg ===
                                ("vehiclesByDepartureTime" || "") &&
                              "bg-orange-50 dark:bg-orange-950"
                            } border py-3 px-2 notranslate   dark:border-gray-600`}
                          >
                            {véhicule?.véhiculeDetails[0]?.timestamp
                              ? FormatDateHeure(
                                  véhicule?.véhiculeDetails[
                                    véhicule?.véhiculeDetails.length - 1
                                  ]?.timestamp
                                )?.date
                              : ""}{" "}
                            {véhicule?.véhiculeDetails[0]?.timestamp && (
                              <span className="px-2">/</span>
                            )}{" "}
                            {véhicule?.véhiculeDetails[0]?.timestamp
                              ? FormatDateHeure(
                                  véhicule?.véhiculeDetails[
                                    véhicule?.véhiculeDetails.length - 1
                                  ]?.timestamp
                                )?.time
                              : `${t("Pas de date disponible")}`}{" "}
                          </td>
                          <td className="border py-3 px-2 notranslate   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                            {véhicule?.véhiculeDetails[0]?.timestamp
                              ? FormatDateHeure(
                                  véhicule?.véhiculeDetails[0]?.timestamp
                                )?.date
                              : ""}{" "}
                            {véhicule?.véhiculeDetails[0]?.timestamp && (
                              <span className="px-2">/</span>
                            )}{" "}
                            {véhicule?.véhiculeDetails[0]?.timestamp
                              ? FormatDateHeure(
                                  véhicule?.véhiculeDetails[0]?.timestamp
                                )?.time
                              : `${t("Pas de date disponible")}`}{" "}
                          </td>

                          {/* Vitesse moyenne */}
                          <td className="border py-3 px-2 notranslate dark:border-gray-600">
                            {véhicule?.avgSpeed + " Km/h"}
                          </td>
                          {/* max speed */}
                          <td
                            className={`${
                              tableSortByColorBg ===
                                ("vehiclesByMaxSpeed" || "") &&
                              "bg-orange-50 dark:bg-orange-950"
                            } border py-3 px-2 notranslate   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600`}
                          >
                            {(véhicule?.maxSpeed).toFixed(0) + " Km/h"}
                          </td>

                          {/* Distance totale */}
                          <td
                            className={`${
                              tableSortByColorBg ===
                                ("vehiclesByDistance" || "") &&
                              "bg-orange-50 dark:bg-orange-950"
                            } border py-3 px-2 notranslate dark:border-gray-600`}
                          >
                            {véhicule.totalDistance.toFixed(0)} km
                          </td>

                          {/* Nombre d'arret */}
                          <td className="border py-3 px-2 notranslate   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                            {/* {Object.entries(result3.stopsByVehicle)[index][1]} arrêts */}
                            {véhicule.stopCount + " " + `${t("arrêts")}`}
                          </td>

                          {/* Temps actifs */}
                          <td
                            className={`${
                              tableSortByColorBg ===
                                ("vehiclesByMovingDuration" || "") &&
                              "bg-orange-50 dark:bg-orange-950"
                            } border py-3 px-2 notranslate dark:border-gray-600`}
                          >
                            {véhicule?.totalMovingDuration}
                          </td>

                          {/* Addresse départ */}
                          <Tooltip
                            title={`${t("Voir cette adresse sur la carte")}`}
                            PopperProps={{
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, -30], // Décalage horizontal et vertical
                                  },
                                },
                                {
                                  name: "zIndex",
                                  enabled: true,
                                  phase: "write",
                                  fn: ({ state }) => {
                                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                                  },
                                },
                              ],
                            }}
                          >
                            <td
                              onClick={() => {
                                afficherPositionTableauEnCarte(
                                  véhicule,
                                  véhicule?.véhiculeDetails[
                                    véhicule?.véhiculeDetails?.length - 1
                                  ]?.creationTime
                                );
                              }}
                              className="border py-3 px-2 notranslate  cursor-pointer  bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600"
                            >
                              {véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails.length - 1
                              ]?.backupAddress ||
                                véhicule?.véhiculeDetails[
                                  véhicule?.véhiculeDetails.length - 1
                                ]?.address ||
                                `${t("Pas d'adresse disponible")}`}
                            </td>
                          </Tooltip>

                          {/* Addresse départ */}
                          <Tooltip
                            title={`${t("Voir cette adresse sur la carte")}`}
                            PopperProps={{
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, -30], // Décalage horizontal et vertical
                                  },
                                },
                                {
                                  name: "zIndex",
                                  enabled: true,
                                  phase: "write",
                                  fn: ({ state }) => {
                                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                                  },
                                },
                              ],
                            }}
                          >
                            <td
                              onClick={() => {
                                afficherPositionTableauEnCarte(
                                  véhicule,
                                  véhicule?.véhiculeDetails[0]?.creationTime
                                );
                              }}
                              className="border py-3 px-2 notranslate  cursor-pointer   dark:border-gray-600"
                            >
                              {véhicule?.véhiculeDetails[0]?.backupAddress ||
                                véhicule?.véhiculeDetails[0]?.address ||
                                `${t("Pas d'adresse disponible")}`}
                            </td>
                          </Tooltip>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RapportGroupe;
