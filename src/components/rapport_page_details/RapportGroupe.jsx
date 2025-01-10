import React, { useContext, useEffect, useState } from "react";

import { IoTimeOutline } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import customMarkerIcon from "/img/cars/localisation.png";

import { IoClose } from "react-icons/io5";
import { MdOutlineFullscreen } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { RiPinDistanceLine } from "react-icons/ri";
import { SlSpeedometer } from "react-icons/sl";
import MapComponent from "../location_vehicule/MapComponent";
import { DataContext } from "../../context/DataContext";
import VehiculeActiveAjourdhuiComponent from "../rapport_vehicule/VehiculeActiveAjourdhuiComponent";
import VehiculeNotActiveAjourdhuiComponent from "../rapport_vehicule/VehiculeNotActiveAjourdhuiComponent";
import VehiculeNotActifComponent from "../rapport_vehicule/VehiculeNotActifComponent";
import TrajetVehicule from "../historique_vehicule/TrajetVehicule";

function RapportGroupe({
  formattedDate, // Date formatée pour l'affichage
  currentdataFusionnee, // Liste des véhicules
  vehiculeActiveAjourdhui, // Véhicules actifs aujourd'hui
  vehiculeNotActiveAjourdhui, // Véhicules en stationnement aujourd'hui
  vehiculeNotActif, // Véhicules hors service
  earliestVehicle, // Premier véhicule en mouvement
  latestVehicle, // Dernier véhicule en mouvement
  selectUTC, // Option pour formater l'heure en UTC
  formatTimestampToTime, // Fonction pour formater le timestamp
  formatTimestampToTimeWithTimezone, // Fonction pour formater avec timezone
  result, // Résultats pour le temps d'activité
  result2, // Résultats pour les distances parcourues
  result3, // Résultats pour les arrêts
  result5, // Résultats pour la vitesse
  zoomPosition, // État pour la position zoomée de la carte
  setzoomPosition, // Fonctio
  activePeriods,
  movingTimes,
  typeDeVue,
  setTypeDeVue,
  mapType,
  handleMapTypeChange,
  // vehicles,
  mapRef,
  tileLayers,
  getMarkerIcon,

  currentLocation,
  positions,
  centerOnFirstMarker,
  showHistoriqueInMap,
  openGoogleMaps,
  options,
  uniqueAddresses,
  uniqueAddressesZerroSpeed,
  setShowOptions,
  setpageSection,
  setSelectedVehicle,
  startDate,
  startTime,
  endDate,
  endTime,
}) {
  const {
    loadingHistoriqueFilter,
    setShowListOption,
    vehiclueHistoriqueDetails,
    setVehiclueHistoriqueDetails,
    // currentVehicule,
    setdonneeFusionneeForRapport,
    setCurrentVehicule,
    FormatDateHeure,
  } = useContext(DataContext); // const { currentVehicule } = useContext(DataContext);

  const [voirPlus, setvoirPlus] = useState(false);
  const [voirDansLaCarte, setvoirDansLaCarte] = useState(false);

  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  // const donneeVehiculeDetails = currentdataFusionnee.find(
  //   (vehicule) =>
  //     vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  // )?.vehiculeDetails;

  // const premierDetail =
  //   donneeVehiculeDetails[donneeVehiculeDetails.length - 1]?.timestamp;
  // const dernierDetails = donneeVehiculeDetails[0]?.timestamp;
  const donneeVehiculeDetails = currentdataFusionnee?.find(
    (vehicule) =>
      vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  )?.vehiculeDetails;

  const premierDetail =
    donneeVehiculeDetails?.[donneeVehiculeDetails.length - 1]?.timestamp;

  const dernierDetails = donneeVehiculeDetails?.[0]?.timestamp;

  // Trouver la date du rapport
  // Trouver la date du rapport
  const timestampInSecondsDebut = premierDetail;

  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  // const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  const timestampInSecondsFin = dernierDetails;

  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  // const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  //////////////////////////////////////////////////////////////////

  // Fonction pour extraire le jour, le mois, l'année et l'heure en AM/PM
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const day = date.getDate(); // Jour du mois en chiffre

    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.getFullYear();

    return { day, month, year };
  };

  const {
    day: jourDebut,
    month: moisDebut,
    year: anneeDebut,
  } = formatDate(startDate);
  const { day: jourFin, month: moisFin, year: anneeFin } = formatDate(endDate);

  const formatTo12Hour = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convertir l'heure 0 à 12 (minuit) en 12 AM
    const period = isAM ? "AM" : "PM";
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Convertir les heures
  const heureDebut = formatTo12Hour(startTime);
  const heureFin = formatTo12Hour(endTime);

  // console.log("Jour Début:", jourDebut);
  // console.log("Mois Début:", moisDebut);
  // console.log("Année Début:", anneeDebut);

  // console.log("Jour Fin:", jourFin);
  // console.log("Mois Fin:", moisFin);
  // console.log("Année Fin:", anneeFin);

  ///////////////////////////////////////////////////////////

  const [showActiveVehicule, setshowActiveVehicule] = useState(true);
  const [showParkingVehicule, setshowParkingVehicule] = useState(true);
  const [showInactiveVehicule, setshowInactiveVehicule] = useState(true);
  const [voirVehiculeListePupup, setvoirVehiculeListePupup] = useState(false);
  const [defineVehiculeListePupup, setdefineVehiculeListePupup] =
    useState("tous");

  const [nothing, setnothing] = useState(false);

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const doNothing = () => {
    console.log("");
  };

  const [trajetVehiculePupup, settrajetVehiculePupup] = useState(false);
  const [tableDeplacement, settableDeplacement] = useState(false);
  const [tableDistance, settableDistance] = useState(false);
  const [tableActivite, settableActivite] = useState(false);
  const [tablevitesse, settablevitesse] = useState(false);
  const [tableTrajet, settableTrajet] = useState(false);

  ///////////////////////////////////////////////////////////////////////////

  // Fonction pour calculer la distance entre deux points géographiques en kilomètres
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Conversion des degrés en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
  };

  // Fonction pour calculer la durée entre deux timestamps en secondes
  const calculateDuration = (timestamp1, timestamp2) => {
    return Math.abs(parseInt(timestamp2) - parseInt(timestamp1)); // Différence absolue en secondes
  };

  // Fonction pour convertir une durée en secondes au format heure, minute et seconde
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const processVehicleData = (currentData) => {
    return currentData.map((item) => {
      const vehiculeDetails = item.vehiculeDetails;

      // Trouver le premier et le dernier index où speedKPH >= 1
      const firstValidIndex = vehiculeDetails.findIndex(
        (detail) => parseFloat(detail.speedKPH) >= 1
      );

      const lastValidIndex =
        vehiculeDetails.length -
        1 -
        vehiculeDetails
          .slice()
          .reverse()
          .findIndex((detail) => parseFloat(detail.speedKPH) >= 1);

      if (
        firstValidIndex === -1 ||
        lastValidIndex === -1 ||
        firstValidIndex > lastValidIndex
      ) {
        return {
          ...item,
          vehiculeDetails: [],
          totalDistance: 0, // Aucune distance calculée si aucun détail valide
          totalDuration: "0h 0m 0s", // Aucune durée calculée si aucun détail valide
          totalPauseDuration: "0h 0m 0s", // Aucune durée de pause calculée
          totalMovingDuration: "0h 0m 0s", // Aucune durée en mouvement calculée
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0, // Nombre d'arrêts
          totalStopDuration: "0h 0m 0s", // Durée totale des arrêts
        };
      }

      const filteredVehiculeDetails = vehiculeDetails.slice(
        firstValidIndex,
        lastValidIndex + 1
      );

      // Calculer la distance totale parcourue, la durée totale, la durée de pause et la durée en mouvement
      let totalDistance = 0;
      let totalDuration = 0;
      let totalPauseDuration = 0;
      let totalMovingDuration = 0;
      let stopCount = 0;
      let totalStopDuration = 0;

      let speeds = [];
      let stopStartIndex = null;

      for (let i = 1; i < filteredVehiculeDetails.length; i++) {
        const lat1 = parseFloat(filteredVehiculeDetails[i - 1].latitude);
        const lon1 = parseFloat(filteredVehiculeDetails[i - 1].longitude);
        const lat2 = parseFloat(filteredVehiculeDetails[i].latitude);
        const lon2 = parseFloat(filteredVehiculeDetails[i].longitude);
        const time1 = filteredVehiculeDetails[i - 1].timestamp;
        const time2 = filteredVehiculeDetails[i].timestamp;
        const speed1 = parseFloat(filteredVehiculeDetails[i - 1].speedKPH);

        speeds.push(speed1);
        totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
        totalDuration += calculateDuration(time1, time2);

        if (speed1 <= 0) {
          if (stopStartIndex === null) {
            stopStartIndex = i - 1;
          }
        } else {
          if (stopStartIndex !== null) {
            const stopEndIndex = i;
            const stopDuration = calculateDuration(
              filteredVehiculeDetails[stopStartIndex].timestamp,
              filteredVehiculeDetails[
                Math.min(stopEndIndex, filteredVehiculeDetails.length - 1)
              ].timestamp
            );
            totalStopDuration += stopDuration;
            stopCount++;
            stopStartIndex = null;
          }
        }

        if (speed1 <= 0) {
          totalPauseDuration += calculateDuration(time1, time2);
        } else {
          totalMovingDuration += calculateDuration(time1, time2);
        }
      }

      if (stopStartIndex !== null) {
        const stopDuration = calculateDuration(
          filteredVehiculeDetails[stopStartIndex].timestamp,
          filteredVehiculeDetails[filteredVehiculeDetails.length - 1].timestamp
        );
        totalStopDuration += stopDuration;
        stopCount++;
      }

      const minSpeed =
        speeds.length > 0
          ? Math.min(...speeds.filter((speed) => speed > 0)) || 0
          : 0;
      const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
      const avgSpeed =
        speeds.length > 0
          ? (
              speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
            ).toFixed(0)
          : 0;

      if (speeds.length === 0) {
        // Si aucune vitesse n'est valide
        return {
          ...item,
          vehiculeDetails: [],
          totalDistance: 0,
          totalDuration: "0h 0m 0s",
          totalPauseDuration: "0h 0m 0s",
          totalMovingDuration: "0h 0m 0s",
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0,
          totalStopDuration: "0h 0m 0s",
        };
      }

      return {
        ...item,
        vehiculeDetails: filteredVehiculeDetails,
        totalDistance: totalDistance, // Ajouter la distance parcourue
        totalDuration: formatDuration(totalDuration), // Ajouter la durée totale formatée
        totalPauseDuration: formatDuration(totalPauseDuration), // Ajouter la durée totale des pauses formatée
        totalMovingDuration: formatDuration(totalMovingDuration), // Ajouter la durée totale en mouvement formatée
        minSpeed: minSpeed || 0,
        maxSpeed: maxSpeed || 0,
        avgSpeed: avgSpeed || 0,
        stopCount: stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: formatDuration(totalStopDuration), // Ajouter la durée totale des arrêts
      };
    });
  };

  const sortVehiclesBySpeed = (filteredData) => {
    return filteredData
      .map((item) => {
        const lastDetail =
          item.vehiculeDetails[item.vehiculeDetails.length - 1];
        return {
          description: item.description,
          deviceID: item.deviceID,
          lastSpeedKPH: lastDetail ? parseFloat(lastDetail.speedKPH) : 0,
          totalDistance: item.totalDistance, // Inclure la distance parcourue
          totalDuration: item.totalDuration, // Inclure la durée totale
          totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
          totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
          minSpeed: item.minSpeed || 0,
          maxSpeed: item.maxSpeed || 0,
          avgSpeed: item.avgSpeed || 0,
          stopCount: item.stopCount, // Ajouter le nombre d'arrêts
          totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
          vehiculeDetails: item.vehiculeDetails,
        };
      })
      .sort((a, b) => b.lastSpeedKPH - a.lastSpeedKPH);
  };

  const sortVehiclesByDistance = (filteredData) => {
    return filteredData
      .map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        vehiculeDetails: item.vehiculeDetails,
      }))
      .sort((a, b) => b.totalDistance - a.totalDistance);
  };

  const sortVehiclesByMovingDuration = (filteredData) => {
    return filteredData
      .map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        vehiculeDetails: item.vehiculeDetails,
      }))
      .sort((a, b) => {
        // Convertir les durées en secondes pour les comparer
        const [ah, am, as] = a.totalMovingDuration
          .split(/[hms]/)
          .filter(Boolean)
          .map(Number);
        const [bh, bm, bs] = b.totalMovingDuration
          .split(/[hms]/)
          .filter(Boolean)
          .map(Number);

        const totalA = ah * 3600 + am * 60 + as;
        const totalB = bh * 3600 + bm * 60 + bs;

        return totalB - totalA;
      });
  };

  const sortVehiclesByMaxSpeed = (filteredData) => {
    return filteredData
      .map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        vehiculeDetails: item.vehiculeDetails,
      }))
      .sort((a, b) => b.maxSpeed - a.maxSpeed);
  };

  const filteredData = processVehicleData(currentdataFusionnee);
  const vehiculeMouvementOrdered = sortVehiclesBySpeed(filteredData);

  const vehiclesByDistance = sortVehiclesByDistance(filteredData);
  const vehiclesByMovingDuration = sortVehiclesByMovingDuration(filteredData);
  const vehiclesByMaxSpeed = sortVehiclesByMaxSpeed(filteredData);

  // console.log("Vehicles sorted by total distance:", vehiclesByDistance);
  // console.log(
  //   "Vehicles sorted by total moving duration:",
  //   vehiclesByMovingDuration
  // );
  // console.log("Vehicles sorted by max speed:", vehiclesByMaxSpeed);

  // console.log(
  //   "Final filtered data with total distances, durations, and pauses:",
  //   filteredData
  // );
  // console.log("Vehicles sorted by last speedKPH:", vehiculeMouvementOrdered);
  ////////////////////////////////////////////////////////
  const totalDistanceSum = vehiculeMouvementOrdered.reduce(
    (sum, vehicle) => sum + vehicle.totalDistance,
    0
  );

  const nombreTotaleArret = vehiculeMouvementOrdered.reduce(
    (sum, vehicle) => sum + vehicle.stopCount,
    0
  );

  //////////////////////////////////////////////////

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
  const totalMovingDurationInSeconds = vehiculeMouvementOrdered.reduce(
    (sum, vehicle) => sum + durationToSeconds(vehicle.totalMovingDuration),
    0
  );

  // Convertir le résultat en "Xh Ym Zs"
  const totalMovingDuration = secondsToDuration(totalMovingDurationInSeconds);

  // Calcul de la vitesse minimale
  const totalminSpeed = Math.min(
    ...vehiculeMouvementOrdered.map((vehicle) => vehicle.minSpeed)
  );

  // Calcul de la vitesse maximale
  const totalmaxSpeed = Math.max(
    ...vehiculeMouvementOrdered.map((vehicle) => vehicle.maxSpeed)
  );

  // Calcul de la vitesse moyenne totale
  const totalavgSpeed =
    vehiculeMouvementOrdered.reduce(
      (sum, vehicle) => sum + vehicle.avgSpeed,
      0
    ) / vehiculeMouvementOrdered.length;

  // Filtrer les éléments avec minSpeed > 0, puis trouver le minimum
  const filteredSpeeds = (vehiculeMouvementOrdered || [])
    .map((item) => Number(item?.minSpeed) || 0)
    .filter((speed) => speed > 0);

  const smallestMinSpeed =
    filteredSpeeds.length > 0 ? Math.min(...filteredSpeeds) : 0;

  // console.log("Smallest minSpeed > 0:", smallestMinSpeed);

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const premierMovementDebut =
    vehiculeMouvementOrdered[0]?.vehiculeDetails[
      vehiculeMouvementOrdered[0]?.vehiculeDetails.length - 1
    ]?.timestamp;

  const datePemierMouvementDebut = new Date(premierMovementDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourPemierMouvement = datePemierMouvementDebut.getUTCDate(); // Obtenir le jour
  const moisPemierMouvement = datePemierMouvementDebut.toLocaleString("fr-FR", {
    month: "long",
  }); // Obtenir le mois en toutes lettres
  const anneePemierMouvement = datePemierMouvementDebut.getFullYear(); // Obtenir l'année

  //

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const premierdistanceDebut =
    vehiclesByDistance[0]?.vehiculeDetails[
      vehiclesByDistance[0]?.vehiculeDetails.length - 1
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
    vehiclesByDistance[0]?.vehiculeDetails[0]?.timestamp;

  const dateDernierDistanceDebut = new Date(dernierdistanceDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDernierDistance = dateDernierDistanceDebut.getUTCDate(); // Obtenir le jour
  const moisDernierDistance = dateDernierDistanceDebut.toLocaleString("fr-FR", {
    month: "long",
  }); // Obtenir le mois en toutes lettres
  const anneeDernierDistance = dateDernierDistanceDebut.getFullYear(); // Obtenir l'année

  //
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  //

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const premierdistanceLontanDebut =
    vehiclesByMovingDuration[0]?.vehiculeDetails[
      vehiclesByMovingDuration[0]?.vehiculeDetails.length - 1
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
    vehiclesByMovingDuration[0]?.vehiculeDetails[0]?.timestamp;

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
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const [currentVehicule, setcurrentVehiculeChoose] = useState(
    vehiculeMouvementOrdered[0]
  );

  useEffect(() => {
    console.log("currentVehicule", currentVehicule);
  }, [currentVehicule]);
  // // Filtrage pour supprimer les doublons et respecter l'intervalle de 10 minutes
  const filteredVehicles = [];
  let lastZeroSpeedTimestamp = null;

  currentVehicule?.vehiculeDetails
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
  // const filteredVehicles = vehiclueHistoriqueDetails;
  // const filteredVehicles = currentVehicule?.vehiculeDetails;

  const historiqueInMap = filteredVehicles
    ? Object.values(filteredVehicles)
    : [];
  const vehicleData = historiqueInMap?.map((vehicule) => ({
    description: currentVehicule?.description || "Véhicule",
    lastValidLatitude: vehicule?.latitude || "",
    lastValidLongitude: vehicule?.longitude || "",
    address: vehicule?.backupAddress || vehicule?.address || "",
    imeiNumber: currentVehicule?.imeiNumber || "",
    isActive: currentVehicule?.isActive || "",
    licensePlate: currentVehicule?.licensePlate || "",
    simPhoneNumber: currentVehicule?.simPhoneNumber || "",
    timestamp: vehicule?.timestamp || "",
    speedKPH: vehicule?.speedKPH || 0, // Ajout de la vitesse
    heading: vehicule?.heading || "",
  }));

  const vehicles = vehicleData;
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const [tableSortBy, settableSortBy] = useState();
  const [tableSortByColorBg, settableSortByColorBg] = useState("");

  const [showsortfilterpupup, setshowsortfilterpupup] = useState(false);

  useEffect(() => {
    console.log("tableSortBy:", tableSortBy);
    console.log("tableSortByColorBg:", tableSortByColorBg);
  }, [tableSortBy, tableSortByColorBg]);

  const handleClick = (vehicle) => {
    // setCurrentVehicule(vehicle);

    const deviceID = vehicle.deviceID;

    // // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel
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
  return (
    <>
      <div className=" px-4 pb-20 md:max-w-[80vw] w-full">
        {voirVehiculeListePupup && (
          <div className="fixed z-[9999999999] inset-0 px-2 flex justify-center items-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg pt-3 w-[97vw]  px-2">
              <div className="flex justify-end ">
                <IoClose
                  onClick={() => {
                    setvoirVehiculeListePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className="relative h-[80vh] pt-6 rounded-lg overflow-auto bg-white-- md:px-[10vw]">
                {defineVehiculeListePupup === "active" && (
                  <VehiculeActiveAjourdhuiComponent
                    showActiveVehicule={showActiveVehicule}
                    setshowActiveVehicule={setshowActiveVehicule}
                    vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={handleClick}
                    selectUTC={selectUTC}
                  />
                )}
                {/*  */}
                {defineVehiculeListePupup === "notactive" && (
                  <VehiculeNotActiveAjourdhuiComponent
                    showParkingVehicule={showParkingVehicule}
                    setshowParkingVehicule={setshowParkingVehicule}
                    vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={handleClick}
                    selectUTC={selectUTC}
                  />
                )}
                {/* ----------------------------------- */}
                {defineVehiculeListePupup === "hors_service" && (
                  <VehiculeNotActifComponent
                    showInactiveVehicule={showInactiveVehicule}
                    setshowInactiveVehicule={setshowInactiveVehicule}
                    vehiculeNotActif={vehiculeNotActif}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={handleClick}
                  />
                )}
                {defineVehiculeListePupup === "tous" && (
                  <div>
                    <VehiculeActiveAjourdhuiComponent
                      showActiveVehicule={showActiveVehicule}
                      setshowActiveVehicule={setshowActiveVehicule}
                      vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={handleClick}
                      selectUTC={selectUTC}
                    />
                    <VehiculeNotActiveAjourdhuiComponent
                      showParkingVehicule={showParkingVehicule}
                      setshowParkingVehicule={setshowParkingVehicule}
                      vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={handleClick}
                      selectUTC={selectUTC}
                    />
                    <VehiculeNotActifComponent
                      showInactiveVehicule={showInactiveVehicule}
                      setshowInactiveVehicule={setshowInactiveVehicule}
                      vehiculeNotActif={vehiculeNotActif}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={handleClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {voirDansLaCarte && (
          <div className=" fixed inset-0 z-[999999999999999999] bg-black/50">
            <div className="relative  rounded-lg  mt-3-- h-[100vh]  overflow-hidden w-full">
              <div className="bg-white p-3 py-6">Trajet du vehicule</div>
              <button
                className="absolute z-[999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setvoirDansLaCarte(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                  <IoClose className="text-white text-[1.52rem]" />
                </div>
              </button>
              <div className="absolute-- -top-[11rem]-- rounded-lg  w-full ">
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
              </div>
            </div>
          </div>
        )}

        {/* <RapportOptions /> */}

        {trajetVehiculePupup && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white  rounded-lg p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold">Trajet du vehicule</h2>
                <IoClose
                  onClick={() => {
                    settrajetVehiculePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <div className="min-h-[60vh] overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <p className="text-center">Trajet du vehicule ici...</p>
                </div>{" "}
              </div>
            </div>
          </div>
        )}

        {tableDeplacement && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  Tableau des deplacements
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
                        Numéro
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure d'arrivée
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse d'arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculeMouvementOrdered?.map((vehicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            vehicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp && (
                            <span className="px-3">/</span>
                          )}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[
                              //         vehicule?.vehiculeDetails.length - 1
                              //       ]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp && (
                            <span className="px-3">/</span>
                          )}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? //  selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[0]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>

                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[
                            vehicule.vehiculeDetails?.length - 1
                          ]?.backupAddress ||
                            vehicule.vehiculeDetails[
                              vehicule.vehiculeDetails?.length - 1
                            ]?.address ||
                            "Pas de dépacement"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de dépacement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
          </div>
        )}

        {tableDistance && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  Tableau des Distances
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
                        Numéro
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Distance parcoure
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure d'arrivée
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse d'arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByDistance?.map((vehicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2   dark:bg-gray-800  dark:border-gray-600"
                        >
                          {
                            //
                            vehicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.totalDistance.toFixed(0) + " Km"}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ?
                              //    formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[
                              //         vehicule?.vehiculeDetails.length - 1
                              //       ]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? //  selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[0]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>

                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
                          {vehicule.vehiculeDetails[
                            vehicule.vehiculeDetails?.length - 1
                          ]?.backupAddress ||
                            vehicule.vehiculeDetails[
                              vehicule.vehiculeDetails?.length - 1
                            ]?.address ||
                            "Pas de dépacement"}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de dépacement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
          </div>
        )}

        {tableActivite && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  Tableau des activites
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
                        Numéro
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Duree du trajet
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure d'arrivée
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse d'arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByMovingDuration?.map((vehicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            vehicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.totalDuration}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[
                              //         vehicule?.vehiculeDetails.length - 1
                              //       ]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[0]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>

                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[
                            vehicule.vehiculeDetails?.length - 1
                          ]?.backupAddress ||
                            vehicule.vehiculeDetails[
                              vehicule.vehiculeDetails?.length - 1
                            ]?.address ||
                            "Pas de dépacement"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de dépacement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
          </div>
        )}

        {tablevitesse && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold text-gray-50">
                  Tableau des vitesse
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
                        Numéro
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        vitesse nimimale
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        vitesse maximale
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        vitesse moyenne
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Date et Heure d'arrivée
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse d'arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesByDistance?.map((vehicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {vehicule?.description || "---"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.minSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.maxSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {(
                            (vehicule?.maxSpeed + vehicule?.minSpeed) /
                            2
                          ).toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[
                              //         vehicule?.vehiculeDetails.length - 1
                              //       ]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[0]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>

                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[
                            vehicule.vehiculeDetails?.length - 1
                          ]?.backupAddress ||
                            vehicule.vehiculeDetails[
                              vehicule.vehiculeDetails?.length - 1
                            ]?.address ||
                            "Pas de dépacement"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de dépacement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
          </div>
        )}

        {tableTrajet && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg min-h-[60vh] p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold dark:text-gray-50">
                  Tableau du trajet
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
                        Numéro
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Duree du trajet
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        temps d'activite
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        temps d'inactivite
                      </th>
                      {/* <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        duree totale des pause
                      </th> */}
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        distance parcourue
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        nombre d'arrêt
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse de départ
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[20rem]">
                        Adresse d'arrivée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculeMouvementOrdered?.map((vehicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-gray-50 dark:bg-gray-800  dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-gray-50 dark:bg-gray-800  dark:border-gray-600"
                        >
                          {vehicule?.description || "---"}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule.totalDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule.totalMovingDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule.totalPauseDuration || "0h 0m 0s"}
                        </td>
                        {/* <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          2h 22m 45s
                        </td> */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.totalDistance?.toFixed(0) + " km" ||
                            " 0 km"}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {vehicule?.stopCount > 0
                            ? vehicule?.stopCount + " arrêts"
                            : "0 arrêt"}
                        </td>

                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de deplacement"}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de deplacement"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            </div>
          </div>
        )}

        <h1
          onClick={() => {
            // setdonneeFusionneeForRapport([]);
          }}
          className="text-center mb-10 font-semibold text-xl my-10 dark:text-gray-300"
        >
          Rapport détaillé en groupe
        </h1>
        <div className="shadow-md dark:bg-gray-800 dark:shadow-gray-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur les véhicules
            </h2>
          </div>

          <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
            <p>
              Date de Recherche :
              <span className="font-bold dark:text-orange-500 text-gray-900 pl-3">
                {jourDebut ? (
                  // true ||
                  // jourDebut === jourFin &&
                  // moisDebut === moisFin &&
                  // anneeDebut === anneeFin ? (
                  //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                  //     <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                  //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                  //       {anneeDebut || ""}
                  //     </span>{" "}
                  //   </span>
                  // ) : (
                  <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                    Du{" "}
                    <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                      {anneeDebut === anneeFin ? "" : anneeDebut}
                    </span>{" "}
                    au{" "}
                    <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      {jourFin} {moisFin} {anneeFin}
                    </span>
                  </span>
                ) : (
                  <span>Pas de date disponible</span>
                )}
              </span>
            </p>

            <p>
              Heure du Recherche :
              {currentVehicule?.vehiculeDetails[
                currentVehicule?.vehiculeDetails?.length - 1
              ]?.timestamp ? (
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  De{" "}
                  <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                    {heureDebut}
                    {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp
                            )} */}
                  </span>{" "}
                  a{" "}
                  <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                    {heureFin}{" "}
                    {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[0]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[0]?.timestamp
                            )} */}
                  </span>{" "}
                </span>
              ) : (
                <span className="font-normal ml-2 dark:text-orange-500">
                  {" "}
                  Pas d'heure disponible
                </span>
              )}
            </p>

            {/*  */}
            {/*  */}
            {/*  */}
            <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            {/*  */}
            {/*  */}
            {/*  */}

            <div className="flex justify-between items-center pr-3">
              <p>
                Nombre total de véhicules :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {currentdataFusionnee?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("tous");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicules actifs aujourd'hui :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {vehiculeActiveAjourdhui?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("active");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicule en stationnement :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {vehiculeNotActiveAjourdhui?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("notactive");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicule hors service :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {vehiculeNotActif?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("hors_service");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            {!voirPlus && (
              <div>
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                <div
                  onClick={() => {
                    setvoirPlus(!voirPlus);
                  }}
                  className="text-white rounded-lg text-center bg-orange-500/90 py-1 px-4  font-semibold cursor-pointer"
                >
                  voir Plus
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
          {/* {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && ( */}
          <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Véhicule en mouvement en 1er
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                  <div>
                    <div className="sm:flex gap-10 mt-3-- px-2">
                      <div className="flex gap-0 items-center">
                        <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                        <p className="text-[.9rem]">
                          <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                            {
                              <span className="text-[1rem] dark:text-gray-300 text-gray-900 font-semibold sm:text-sm md:text-[1rem]  lg:text-lg--">
                                Le {jourPemierMouvement} {moisPemierMouvement}{" "}
                                {anneePemierMouvement}
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
                          De{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? // selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiculeMouvementOrdered[0]
                                //         ?.vehiculeDetails[
                                //         vehiculeMouvementOrdered[0]
                                //           ?.vehiculeDetails.length - 1
                                //       ]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiculeMouvementOrdered[0]?.vehiculeDetails[
                                    vehiculeMouvementOrdered[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          a{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? //  selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiculeMouvementOrdered[0]
                                //         ?.vehiculeDetails[0]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiculeMouvementOrdered[0]
                                    ?.vehiculeDetails[0]?.timestamp
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
                  Nom du vehicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiculeMouvementOrdered[0]?.description + " a "
                      : "Pas de vehicule en mouvement"}
                  </span>
                  <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                      vehiculeMouvementOrdered[0]?.vehiculeDetails.length - 1
                    ]?.timestamp
                      ? // selectUTC
                        //   ? formatTimestampToTimeWithTimezone(
                        //       vehiculeMouvementOrdered[0]?.vehiculeDetails[
                        //         vehiculeMouvementOrdered[0]?.vehiculeDetails
                        //           .length - 1
                        //       ]?.timestamp,
                        //       selectUTC
                        //     )
                        //   :
                        FormatDateHeure(
                          vehiculeMouvementOrdered[0]?.vehiculeDetails[
                            vehiculeMouvementOrdered[0]?.vehiculeDetails
                              .length - 1
                          ]?.timestamp
                        )?.time
                      : " "}{" "}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/* <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" /> */}
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        setcurrentVehiculeChoose(vehiculeMouvementOrdered[0]);
                        setvoirDansLaCarte(true);
                      }}
                      className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                    >
                      Voir sur la carte
                    </button>
                  )}
                  <button
                    onClick={() => {
                      settableDeplacement(true);
                    }}
                    className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                  >
                    Plus d'info
                  </button>
                </div>

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
          {/* vehicule en mouvement en premier */}
          <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Véhicule ayant parcouru la plus grande distance
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                  <div>
                    <div className="sm:flex gap-10 mt-3-- px-2">
                      <div className="flex gap-0 items-center">
                        <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                        <p className="text-[1rem]  dark:text-gray-300">
                          <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                            {
                              // true ||
                              // jourDebut === jourFin &&
                              // moisDebut === moisFin &&
                              // anneeDebut === anneeFin ? (
                              //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                              //     <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                              //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                              //       {anneeDebut || ""}
                              //     </span>{" "}
                              //   </span>
                              // ) : (
                              <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                Du{" "}
                                <span className="dark:text-gray-300 dark:font-normal font-semibold text-gray-950">
                                  {jourPemierDistance}{" "}
                                  {moisPemierDistance === moisDernierDistance
                                    ? ""
                                    : moisPemierDistance}{" "}
                                  {anneePemierDistance === anneeDernierDistance
                                    ? ""
                                    : anneePemierDistance}
                                </span>{" "}
                                au{" "}
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
                          De{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? // selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiclesByDistance[0]?.vehiculeDetails[
                                //         vehiclesByDistance[0]?.vehiculeDetails
                                //           .length - 1
                                //       ]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiclesByDistance[0]?.vehiculeDetails[
                                    vehiclesByDistance[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          a{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? //  selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiclesByDistance[0]?.vehiculeDetails[0]
                                //         ?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiclesByDistance[0]?.vehiculeDetails[0]
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
                  Nom du vehicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByDistance[0]?.description + " "
                      : "Pas de vehicule en mouvement"}
                  </span>{" "}
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 &&
                    "( environ " +
                      vehiclesByDistance[0]?.totalDistance.toFixed(0) +
                      " Km )"}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/* <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" /> */}
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        setcurrentVehiculeChoose(vehiclesByDistance[0]);

                        setvoirDansLaCarte(true);
                      }}
                      className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                    >
                      Voir sur la carte
                    </button>
                  )}
                  <button
                    onClick={() => {
                      settableDistance(true);
                    }}
                    className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                  >
                    Plus d'info
                  </button>
                </div>

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
          {/* vehicule en mouvement plus longtemps */}
          <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Véhicule en mouvement plus longtemps
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                  <div>
                    <div className="sm:flex gap-10 mt-3-- px-2">
                      <div className="flex gap-0 items-center">
                        <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                        <p className="text-[.9rem]">
                          <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                            {
                              // true ||
                              // jourDebut === jourFin &&
                              // moisDebut === moisFin &&
                              // anneeDebut === anneeFin ? (
                              //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                              //     <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                              //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                              //       {anneeDebut || ""}
                              //     </span>{" "}
                              //   </span>
                              // ) : (
                              <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                Du{" "}
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
                                au{" "}
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
                          De{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? // selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiclesByMovingDuration[0]
                                //         ?.vehiculeDetails[
                                //         vehiclesByMovingDuration[0]
                                //           ?.vehiculeDetails.length - 1
                                //       ]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiclesByMovingDuration[0]?.vehiculeDetails[
                                    vehiclesByMovingDuration[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          a{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? // selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiclesByMovingDuration[0]
                                //         ?.vehiculeDetails[0]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiclesByMovingDuration[0]
                                    ?.vehiculeDetails[0]?.timestamp
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
                  Nom du vehicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByMovingDuration[0]?.description
                      : "Pas de vehicule en mouvement"}
                  </span>
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 &&
                    "( environ " +
                      vehiclesByMovingDuration[0]?.totalDuration +
                      " )"}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                {/* <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" /> */}
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        setcurrentVehiculeChoose(vehiclesByMovingDuration[0]);

                        setvoirDansLaCarte(true);
                      }}
                      className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                    >
                      Voir sur la carte
                    </button>
                  )}
                  <button
                    onClick={() => {
                      settableActivite(true);
                    }}
                    className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                  >
                    Plus d'info
                  </button>
                </div>

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

          {/* vehicule avec la vitesse maximale */}
          <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              {/* <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " /> */}
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Véhicule avec la vitesse maximale
              </h2>
            </div>

            <div className="">
              <div className="py-2-">
                {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                  <div>
                    <div className="sm:flex gap-10 mt-3-- px-2">
                      <div className="flex gap-0 items-center">
                        <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                        <p className="text-[.9rem]">
                          <span className="font-normal dark:text-gray-300 text-gray-700 pl-3">
                            {
                              // true ||
                              // jourDebut === jourFin &&
                              // moisDebut === moisFin &&
                              // anneeDebut === anneeFin ? (
                              //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                              //     <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                              //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                              //       {anneeDebut || ""}
                              //     </span>{" "}
                              //   </span>
                              // ) : (
                              <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                                Du{" "}
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
                                au{" "}
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
                          De{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? // selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiculeMouvementOrdered[0]
                                //         ?.vehiculeDetails[
                                //         vehiculeMouvementOrdered[0]
                                //           ?.vehiculeDetails.length - 1
                                //       ]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiculeMouvementOrdered[0]?.vehiculeDetails[
                                    vehiculeMouvementOrdered[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          a{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? //  selectUTC
                                //   ? formatTimestampToTimeWithTimezone(
                                //       vehiculeMouvementOrdered[0]
                                //         ?.vehiculeDetails[0]?.timestamp,
                                //       selectUTC
                                //     )
                                //   :
                                FormatDateHeure(
                                  vehiculeMouvementOrdered[0]
                                    ?.vehiculeDetails[0]?.timestamp
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
                  Nom du vehicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByMaxSpeed[0]?.description
                      : "Pas de vehicule en mouvement"}
                  </span>
                  <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 &&
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        setcurrentVehiculeChoose(vehiclesByMaxSpeed[0]);
                        setvoirDansLaCarte(true);
                      }}
                      className="mx-l px-4 text-white border border-orange-200 shadow-lg-- shadow-gray-400/20-- py-0.5 rounded-lg mt-3 bg-orange-500"
                    >
                      Voir sur la carte
                    </button>
                  )}
                  <button
                    onClick={() => {
                      settablevitesse(true);
                    }}
                    className="mx-2-- px-4-- text-orange-600 underline font-semibold shadow-lg-- shadow-gray-400/20-- py-0.5-- rounded-lg-- mt-3 bg-orange-200/50-- border-b- border-b-orange-600"
                  >
                    Plus d'info
                  </button>
                </div>

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
          {voirPlus && (
            <div
              onClick={() => {
                setvoirPlus(!voirPlus);
                window.scrollTo({
                  top: 200,
                  behavior: "auto", // Défilement fluide
                  // behavior: "smooth", // Défilement fluide
                });
              }}
              className="p-4 text-center  py-1 my-4 rounded-lg cursor-pointer shadow-lg shadow-gray-400/20 bg-orange-500/80 mt-8"
            >
              <p className="text-white font-semibold  cursor-pointer">
                voir moins
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
        <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur le trajet des véhicules
            </h2>
          </div>

          <div>
            <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
              <p>
                Date de Recherche :{/* <br className="sm:hidden" /> */}
                <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                  {
                    jourDebut ? (
                      // true ||
                      // jourDebut === jourFin &&
                      // moisDebut === moisFin &&
                      // anneeDebut === anneeFin ? (
                      //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      //     <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                      //       {anneeDebut || ""}
                      //     </span>{" "}
                      //   </span>
                      // ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      <span>Pas de date disponible</span>
                    )
                    // )
                  }
                </span>
              </p>

              <p>
                Heure du Recherche :
                {currentVehicule?.vehiculeDetails[
                  currentVehicule?.vehiculeDetails?.length - 1
                ]?.timestamp ? (
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    De{" "}
                    <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                      {heureDebut}
                      {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp
                            )} */}
                    </span>{" "}
                    a{" "}
                    <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                      {heureFin}{" "}
                      {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[0]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[0]?.timestamp
                            )} */}
                    </span>{" "}
                  </span>
                ) : (
                  <span className="font-normal ml-2 dark:text-orange-500">
                    {" "}
                    Pas d'heure disponible
                  </span>
                )}
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
                  Temps d'activité total :
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {formatTime(
                      result?.totalMovingTime.hours,
                      result?.totalMovingTime.minutes,
                      result?.totalMovingTime.seconds
                    )} */}
                    {totalMovingDuration || "Pas de deplacement"}
                  </span>
                </p>

                <p
                  onClick={() => {
                    settableTrajet(true);
                  }}
                  className="text-orange-400 min-w-[4rem] border-b-- border-b-orange-400-- underline cursor-pointer"
                >
                  voir plus
                </p>
              </div>
              <p>
                Distance totale parcourue:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result2?.totalDistanceAllVehicles.toFixed(2) || "0"} km{" "} */}
                  {totalDistanceSum.toFixed(0) + " km" || "Pas de mouvement"}
                </span>
              </p>
              {/* <p>
                Duree des arrêt lors du deplacement :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                 
                  {formatTime(
                    result?.totalStopTime.hours,
                    result?.totalStopTime.minutes,
                    result?.totalStopTime.seconds
                  )}
                </span>
              </p> */}

              {/*  */}
              {/* <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" /> */}
              {/*  */}
              {/*  */}
              {/*  */}

              <p>
                Nombre total d’arrêts :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result3?.totalStopsAllVehicles} */}
                  {nombreTotaleArret > 0
                    ? nombreTotaleArret + "arrêts"
                    : "0 arrêt"}
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
                  Vitesse minimale:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {result5?.globalStats.minSpeed.toFixed(2) || "---"} Km/h */}
                    {/* {totalminSpeed || "0 km/h"} */}
                    {smallestMinSpeed.toFixed(0) + " Km/h" || "0 Km/h"}
                  </span>
                </p>{" "}
                <p
                  onClick={() => {
                    settablevitesse(true);
                  }}
                  className="text-orange-400 min-w-[4rem] border-b-- border-b-orange-400-- underline cursor-pointer"
                >
                  voir plus
                </p>
              </div>
              <p>
                Vitesse maximale:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result5?.globalStats.maxSpeed.toFixed(2) || "---"} Km/h */}
                  {/* {totalmaxSpeed.toFixed(2) + " km" || "0 km/h"} */}
                  {vehiclesByMaxSpeed[0]?.maxSpeed
                    ? vehiclesByMaxSpeed[0]?.maxSpeed.toFixed(0) + " Km/h"
                    : "0.00 Km/h"}
                </span>
              </p>
              <p>
                Vitesse moyenne:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result5?.globalStats.averageSpeed.toFixed(2) || "---"} Km/h */}
                  {/* {(totalminSpeed + totalmaxSpeed) / 2 + " km/h " || "0 km/h"} */}
                  {vehiclesByMaxSpeed[0]?.maxSpeed
                    ? (
                        (smallestMinSpeed + vehiclesByMaxSpeed[0]?.maxSpeed) /
                        2
                      ).toFixed(0) + " km/h "
                    : " 0.00 km/h"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
          <MdLocationPin className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
          <h2 className="font-semibold dark:text-orange-50 text-orange-900">
            Position des véhicules{" "}
          </h2>
        </div>

        {zoomPosition ? (
          <div className="fixed inset-0 z-[9999999999999999999999] bg-black/50">
            <div className="relative  h-[100vh]  rounded-lg mt-3-- overflow-hidden">
              <button
                className="absolute z-[999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setzoomPosition(false);
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
              className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
              // onClick={centerOnFirstMarker}
              onClick={() => {
                setzoomPosition(true);
                setSelectedVehicle(null);
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

        {/* zoomPosition */}

        <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
          <BsTable className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
          <div className="flex justify-between items-center  w-full">
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Tableau récapitulatif{" "}
            </h2>
            <div onClick={() => {}} className="cursor-pointer relative">
              <p
                onClick={() => {
                  setshowsortfilterpupup(true);
                }}
                className="font-semibold underline text-orange-600"
              >
                Filtrer
              </p>
              {showsortfilterpupup && (
                <div className="absolute z-[30] flex flex-col gap-0 bg-white dark:bg-gray-700 dark:shadow-gray-900 dark:border shadow-lg shadow-gray-500 rounded-md p-3 top-10 -right-2 min-w-[15rem]">
                  <div className="flex justify-between mb-2 items-center ">
                    <p className="text-orange-500  font-semibold">
                      Filtrer par :
                    </p>
                    <IoClose
                      onClick={() => {
                        setshowsortfilterpupup(false);
                      }}
                      className="cursor-pointer text-2xl text-red-500"
                    />{" "}
                  </div>
                  <p
                    onClick={() => {
                      settableSortBy(vehiculeMouvementOrdered);
                      settableSortByColorBg("vehiculeMouvementOrdered");
                      setshowsortfilterpupup(false);

                      // console.log(
                      //   "xxxxxxxxxxxxxxxxxxxxxxx",
                      //   tableSortByColorBg
                      // );
                    }}
                    className={`${
                      tableSortByColorBg ===
                        ("vehiculeMouvementOrdered" || "") &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    Heure de départ
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
                    Distance parcouru
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
                    Temps en mouvement
                  </p>
                  <p
                    onClick={() => {
                      settableSortBy(vehiclesByMaxSpeed);
                      settableSortByColorBg("vehiclesByMaxSpeed");
                      setshowsortfilterpupup(false);

                      console.log(
                        "xxxxxxxxxxxxxxxxxxxxxxx",
                        tableSortByColorBg
                      );
                    }}
                    className={`${
                      tableSortByColorBg === "vehiclesByMaxSpeed" &&
                      "bg-orange-50 dark:bg-gray-800"
                    } hover:bg-orange-50 p-2 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 `}
                  >
                    Vitesse maximale
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-4 max-h-[30rem] md:h-[20rem] mb-20 overflow-x-auto overflow-y-hidden">
          {/*  */}
          <thead>
            <tr className="bg-orange-50 relative z-20 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
              <th className="text-start border-l-4  border-l-orange-200 border dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                Numéro
              </th>

              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                Véhicule
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                Date et Heure de départ
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                Date et Heure d'arrivée
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Vitesse moyenne
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Vitesse maximale
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Distance totale
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Nombre d'arrêts
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[12rem]">
                Temps en mouvement
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                Adresse de départ
              </th>
              <th className="text-start border dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                Adresse d'arrivée
              </th>
            </tr>
          </thead>

          <div className="border-2-- pb-10 -translate-y-[3.1rem] w-full min-w-[160rem] border-red-500 h-[30rem] md:h-[20rem] overflow-y-auto overflow-x-hidden">
            <table className=" w-full text-left dark:bg-gray-800 dark:text-gray-200">
              <thead>
                <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                  <th className="border border-l-4  border-l-red-600 dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                    Numéro
                  </th>

                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                    Véhicule
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                    Date et Heure de départ
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                    Date et Heure d'arrivée
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                    Vitesse moyenne
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                    Vitesse maximale
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                    Distance totale
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                    Nombre d'arrêts
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[12rem]">
                    Temps en mouvement
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                    Adresse de départ
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                    Adresse d'arrivée
                  </th>
                </tr>
              </thead>

              <tbody className="border-2-- border-red-500  max-w-20">
                {(tableSortBy || vehiclesByMovingDuration)?.map(
                  (vehicule, index) => {
                    const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
                    const currentTime = Date.now(); // Heure actuelle en millisecondes

                    const isMoving = vehicule.vehiculeDetails?.some(
                      (detail) => detail.speedKPH >= 1
                    );

                    const hasDetails =
                      vehicule.vehiculeDetails &&
                      vehicule.vehiculeDetails.length > 0;

                    const noSpeed = vehicule.vehiculeDetails?.every(
                      (detail) => detail.speedKPH <= 0
                    );

                    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                    const lastUpdateTimeMs = vehicule.lastUpdateTime
                      ? vehicule.lastUpdateTime * 1000
                      : 0;
                    const isActive =
                      currentTime - lastUpdateTimeMs < twentyHoursInMs;

                    let iconBg = "text-red-500 dark:text-red-500";

                    if (hasDetails && isMoving) {
                      iconBg =
                        "text-green-500 dark:text-green-500 border-l-green-600 dark:border-l-green-600";
                    } else if (hasDetails && noSpeed && isActive) {
                      iconBg =
                        "text-red-500 dark:text-red-500 border-l-red-500 dark:border-l-red-600";
                    } else if (!hasDetails || !isActive) {
                      iconBg =
                        "text-gray-800 dark:text-gray-100 border-l-gray-300 dark:border-l-gray-600";
                    }
                    return (
                      <tr key={index} className="border dark:border-gray-600">
                        <td
                          className={`${iconBg} border font-semibold text-lg border-l-4   py-3 px-2  bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600`}
                        >
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700 py-3 px-2  bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600"
                        >
                          {vehicule?.description || "---"}
                        </td>
                        {/*  */}
                        <td className="border py-3 px-2   dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp && (
                            <span className="px-2">/</span>
                          )}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[
                              //         vehicule?.vehiculeDetails.length - 1
                              //       ]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.date
                            : ""}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp && (
                            <span className="px-2">/</span>
                          )}{" "}
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? // selectUTC
                              //   ? formatTimestampToTimeWithTimezone(
                              //       vehicule?.vehiculeDetails[0]?.timestamp,
                              //       selectUTC
                              //     )
                              //   :
                              FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>

                        {/* Vitesse moyenne */}
                        <td className="border py-3 px-2 dark:border-gray-600">
                          {(
                            (vehicule?.maxSpeed + vehicule?.minSpeed) /
                            2
                          ).toFixed(0) + " Km/h"}
                        </td>
                        {/* max speed */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {(vehicule?.maxSpeed).toFixed(0) + " Km/h"}
                        </td>

                        {/* Distance totale */}
                        <td className="border py-3 px-2 dark:border-gray-600">
                          {vehicule.totalDistance.toFixed(0)} km
                        </td>

                        {/* Nombre d'arret */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {/* {Object.entries(result3.stopsByVehicle)[index][1]} arrêts */}
                          {vehicule.stopCount + " arrêts"}
                        </td>

                        {/* Temps actifs */}
                        <td className="border py-3 px-2 dark:border-gray-600">
                          {vehicule?.totalMovingDuration}
                        </td>

                        {/* Addresse départ */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {vehicule.vehiculeDetails[
                            vehicule.vehiculeDetails.length - 1
                          ]?.backupAddress ||
                            vehicule.vehiculeDetails[
                              vehicule.vehiculeDetails.length - 1
                            ]?.address ||
                            "Pas de deplacement"}
                        </td>

                        {/* Addresse départ */}
                        <td className="border py-3 px-2     dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas de deplacement"}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default RapportGroupe;
