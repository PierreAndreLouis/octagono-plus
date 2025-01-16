import React, { useContext, useEffect, useState } from "react";

import { IoTimeOutline } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import customMarkerIcon from "/img/cars/localisation.png";
import { FaCar } from "react-icons/fa";

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
    currentVehicule,
    setdonneeFusionneeForRapport,
    setCurrentVehicule,
    FormatDateHeure,
    mergedData,
    searchdonneeFusionneeForRapport,
  } = useContext(DataContext); // const { currentVehicule } = useContext(DataContext);

  const dataFusionneeHome = mergedData ? Object.values(mergedData) : [];

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

  const donneeVehiculeDetails = currentdataFusionnee?.find(
    (vehicule) =>
      vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  )?.vehiculeDetails;

  const premierDetail =
    donneeVehiculeDetails?.[donneeVehiculeDetails.length - 1]?.timestamp;

  const dernierDetails = donneeVehiculeDetails?.[0]?.timestamp;

  // Trouver la date du rapport
  const timestampInSecondsDebut = premierDetail;

  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Trouver la date du rapport
  const timestampInSecondsFin = dernierDetails;

  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

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

  const formatTo12Hour = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convertir l'heure 0 à 12 (minuit) en 12 AM
    const period = isAM ? "AM" : "PM";
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  ///////////////////////////////////////////////////////////

  const [voirVehiculeListePupup, setvoirVehiculeListePupup] = useState(false);
  const [defineVehiculeListePupup, setdefineVehiculeListePupup] =
    useState("tous");

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
          .findIndex((detail) => parseFloat(detail.speedKPH) >= 1) +
        1;

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
      .sort((a, b) => b.maxSpeed - a.maxSpeed);
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

  const sortVehiclesByFirstMovement = (filteredData) => {
    return filteredData
      .map((item) => {
        const vehiculeDetails = item.vehiculeDetails;

        // Trouver le dernier index où speedKPH >= 1
        const lastValidIndex = vehiculeDetails.findLastIndex(
          (detail) => parseFloat(detail.speedKPH) >= 1
        );

        // Si aucun mouvement n'est trouvé, retourner un timestamp par défaut très élevé
        const firstMovementTimestamp =
          lastValidIndex === -1
            ? Number.MAX_SAFE_INTEGER
            : vehiculeDetails[lastValidIndex].timestamp;

        return {
          ...item,
          firstMovementTimestamp, // Ajouter le timestamp du premier mouvement ou une valeur par défaut
          description: item.description,
          deviceID: item.deviceID,
          totalDistance: item.totalDistance,
          totalDuration: item.totalDuration,
          totalPauseDuration: item.totalPauseDuration,
          totalMovingDuration: item.totalMovingDuration,
          minSpeed: item.minSpeed || 0,
          maxSpeed: item.maxSpeed || 0,
          avgSpeed: item.avgSpeed || 0,
          stopCount: item.stopCount,
          totalStopDuration: item.totalStopDuration,
          vehiculeDetails: item.vehiculeDetails,
        };
      })
      .sort((a, b) => {
        // Trier par ordre croissant du timestamp, en mettant les véhicules sans mouvement à la fin
        return a.firstMovementTimestamp - b.firstMovementTimestamp;
      });
  };

  const filteredData = processVehicleData(currentdataFusionnee);

  const vehiculeMouvementOrdered = sortVehiclesBySpeed(filteredData);

  // Filtrer par distance parcouru OKK... tester
  const vehiclesByDistance = sortVehiclesByDistance(filteredData);

  // Filter par temps en mouvement OKKK... tester
  const vehiclesByMovingDuration = sortVehiclesByMovingDuration(filteredData);

  // Filtrer par vitesse maximale OKKK... tester
  const vehiclesByMaxSpeed = sortVehiclesByMaxSpeed(filteredData);

  // Appliquer le filtre par heure de départ
  const vehiclesByDepartureTime = sortVehiclesByFirstMovement(filteredData);

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
  const totalAvgSpeed = vehiculeMouvementOrdered
    .filter((vehicle) => vehicle.avgSpeed > 0) // Filtrer les véhicules avec avgSpeed > 0
    .reduce((sum, vehicle, _, filteredArray) => {
      const count = filteredArray.length; // Nombre de véhicules avec avgSpeed > 0
      return sum + vehicle.avgSpeed / count; // Ajouter à la somme en divisant directement par le nombre
    }, 0);

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

  const [currentVehiculeInCarte, setcurrentVehiculeInCarte] = useState(
    vehiculeMouvementOrdered[0]
  );

  const positionDansCarte = (vehicule) => {
    const deviceID = vehicule.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setcurrentVehiculeInCarte(foundVehicle); // Définit le véhicule actuel
      setCurrentVehicule(foundVehicle);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  useEffect(() => {
    console.log("currentVehicule", currentVehiculeInCarte);
  }, [currentVehiculeInCarte]);
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

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  // Calcul de la vitesse minimale, maximale et moyenne (véhicules actifs uniquement)
  const calculateSpeeds = (data) => {
    const activeVehicles = data.filter(
      (vehicle) => vehicle.maxSpeed > 0 || vehicle.minSpeed > 0
    );

    const totalVehicles = activeVehicles.length;

    const minSpeed = Math.min(
      ...activeVehicles.map((vehicle) => vehicle.minSpeed)
    );
    const maxSpeed = Math.max(
      ...activeVehicles.map((vehicle) => vehicle.maxSpeed)
    );
    const avgSpeed =
      activeVehicles.reduce((sum, vehicle) => sum + vehicle.maxSpeed, 0) /
      totalVehicles;

    return { minSpeed, maxSpeed, avgSpeed, totalVehicles };
  };

  const speeds = calculateSpeeds(vehiclesByDepartureTime);

  // console.log("Nombre de véhicules actifs :", speeds.totalVehicles);
  // console.log("Vitesse minimale :", speeds.minSpeed.toFixed(2), "KPH");
  // console.log("Vitesse maximale :", speeds.maxSpeed.toFixed(2), "KPH");
  // console.log("Vitesse moyenne :", speeds.avgSpeed.toFixed(2), "KPH");
  const [filter, setFilter] = useState("all");

  // Fonction pour filtrer les véhicules
  const filteredVehiclesListe = vehiclesByDepartureTime?.filter((vehicule) => {
    const matchedVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === vehicule.deviceID
    );

    const matchedVehicle2 = dataFusionneeHome.find(
      (v) => v.deviceID === vehicule.deviceID
    );

    const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
    const currentTime = Date.now(); // Heure actuelle en millisecondes

    const isSpeedActive =
      matchedVehicle2.vehiculeDetails &&
      matchedVehicle2.vehiculeDetails[0] &&
      matchedVehicle2.vehiculeDetails[0].speedKPH > 0;

    const isNotSpeedActive =
      matchedVehicle2.vehiculeDetails &&
      matchedVehicle2.vehiculeDetails[0] &&
      matchedVehicle2.vehiculeDetails[0].speedKPH <= 0;

    const isMoving = matchedVehicle.vehiculeDetails?.some(
      (detail) => detail.speedKPH >= 1
    );

    const hasDetails =
      matchedVehicle.vehiculeDetails &&
      matchedVehicle.vehiculeDetails.length > 0;

    const noSpeed = matchedVehicle.vehiculeDetails?.every(
      (detail) => detail.speedKPH <= 0
    );
    //

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
      ? matchedVehicle.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const isSearching = searchdonneeFusionneeForRapport?.length > 0;

    ////////////////////////////////////////////////////
    // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
    const getTodayTimestamp = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Minuit
      return Math.floor(now.getTime() / 1000); // Convertir en secondes
    };
    const todayTimestamp = getTodayTimestamp() * 1000;

    // Fonction pour obtenir le timestamp actuel en millisecondes
    const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

    const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
    const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

    const hasBeenMoving =
      matchedVehicle.vehiculeDetails &&
      matchedVehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1);

    const lastUpdateTimestampMs =
      matchedVehicle.vehiculeDetails &&
      matchedVehicle.vehiculeDetails[0] &&
      matchedVehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

    const isNotStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

    if (!isSearching) {
      if (filter === "movingNow")
        return isSpeedActive && hasDetails && isActive && isNotStillSpeedActive;
      if (filter === "notMovingNow")
        // return isNotSpeedActive && hasDetails && isActive;
        return (
          hasDetails &&
          isActive &&
          (isNotSpeedActive || (hasBeenMoving && !isNotStillSpeedActive))
        );
      if (filter === "moving") return hasDetails && isMoving && isToday;

      if (filter === "parking")
        // return hasDetails && noSpeed && isActive;
        return (
          hasDetails && isActive && (noSpeed || (hasBeenMoving && !isToday))
        );
      if (filter === "inactive") return !hasDetails || !isActive;
      return true; // "all" : tous les véhicules
    } else {
      if (filter === "inactive") return !hasDetails;
      if (filter === "parking") return hasDetails && noSpeed;
      if (filter === "moving") return hasDetails && isMoving;
      return true; // "all" : tous les véhicules
    }
  });

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const activeVehicleCount = currentdataFusionnee?.filter((vehicle) => {
    // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
    const isSpeedActive =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH > 0;

    // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isRecentlyUpdated = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const lastUpdateTimestampMs =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    // const isStillSpeedActive = todayTimestamp - lastTimeStamp < trentMinute;
    // Vérifie si la mise à jour est récente (moins de 30 minutes)
    const isStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs <= thirtyMinutesInMs;

    // Le véhicule doit être actif selon la vitesse et la mise à jour
    return isSpeedActive && isRecentlyUpdated && isStillSpeedActive;
  });

  const notActiveVehicleCount = currentdataFusionnee?.filter((vehicle) => {
    // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
    const isNotSpeedActive =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH <= 0;

    const noSpeed =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails?.every((detail) => detail.speedKPH <= 0);

    // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isRecentlyUpdated = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const isSpeedActive =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH > 0;

    const lastUpdateTimestampMs =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    const isNotStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

    // Le véhicule doit être actif selon la vitesse et la mise à jour
    // return noSpeed && isRecentlyUpdated;
    return (
      isRecentlyUpdated && (noSpeed || (isSpeedActive && isNotStillSpeedActive))
    );
  });

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

  function getMostRecentTimestamp(data) {
    // Filtrer les entrées avec un tableau vehiculeDetails valide et non vide
    const validTimestamps = data
      .filter(
        (vehicle) =>
          Array.isArray(vehicle.vehiculeDetails) &&
          vehicle.vehiculeDetails.length > 0
      )
      .map((vehicle) => parseInt(vehicle.vehiculeDetails[0].timestamp));

    // Trouver le timestamp le plus récent
    const mostRecentTimestamp = Math.max(...validTimestamps);

    return { mostRecentTimestamp };
  }
  const mostRecentTimestamp =
    getMostRecentTimestamp(currentdataFusionnee)?.mostRecentTimestamp;

  function getMostOldTimestamp(data) {
    // Filtrer les entrées avec un tableau vehiculeDetails valide et non vide
    const validTimestamps = data
      .filter(
        (vehicle) =>
          Array.isArray(vehicle.vehiculeDetails) &&
          vehicle.vehiculeDetails.length > 0
      )
      .map((vehicle) =>
        parseInt(
          vehicle.vehiculeDetails[vehicle.vehiculeDetails.length - 1].timestamp
        )
      );

    // Trouver le timestamp le plus récent
    const mostOldTimestamp = Math.min(...validTimestamps);

    return { mostOldTimestamp };
  }
  const mostOldTimestamp =
    getMostOldTimestamp(currentdataFusionnee)?.mostOldTimestamp;

  const dataObjectDebut = new Date(mostOldTimestamp * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDebut = dataObjectDebut.getUTCDate(); // Obtenir le jour
  const moisDebut = dataObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeDebut = dataObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  const dataObjectFin = new Date(mostRecentTimestamp * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourFin = dataObjectFin.getUTCDate(); // Obtenir le jour
  const moisFin = dataObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeFin = dataObjectFin.getFullYear(); // Obtenir l'année

  const heureDebut = FormatDateHeure(mostOldTimestamp)?.time;
  const heureFin = FormatDateHeure(mostRecentTimestamp)?.time;

  const isSearching = searchdonneeFusionneeForRapport?.length > 0;

  return (
    <>
      <div className=" px-4 pb-20 md:max-w-[80vw] w-full">
        {/* yyyyyyyyyyyyyyyyyyyyyy */}
        {voirVehiculeListePupup && (
          <div className="fixed z-[9999999999] inset-0 px-2 flex justify-center items-center bg-black/50">
            <div className="bg-white  dark:bg-gray-800 rounded-lg pt-3 w-[97vw]  px-2">
              <div className="flex justify-between items-center py-2">
                <p></p>
                <h3 className="font-bold text-gray-600 text-lg dark:text-gray-50">
                  {filter === "all" && "Tous les véhicules"}
                  {filter === "moving" &&
                    `Véhicules déplacés  ${isSearching ? "" : "aujourd'hui"} `}
                  {filter === "notMovingNow" &&
                    `Véhicules en stationnement  ${
                      isSearching ? "" : "actuellement"
                    }`}

                  {filter === "movingNow" &&
                    `Véhicules en mouvement ${
                      isSearching ? "" : " actuellement"
                    }`}
                  {filter === "parking" &&
                    ` Véhicules non déplacés  ${
                      isSearching ? "" : " aujourd'hui"
                    }  `}
                  {filter === "inactive" && "Véhicules hors service "}
                </h3>
                <IoClose
                  onClick={() => {
                    setvoirVehiculeListePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className="relative pb-20 flex flex-col gap-4 h-[80vh] pt-6 rounded-lg overflow-auto bg-white-- md:px-[10vw]">
                {filteredVehiclesListe.length > 0 ? (
                  filteredVehiclesListe?.map((vehicule, index) => {
                    // Trouver le véhicule correspondant dans updateData
                    const matchedVehicle = currentdataFusionnee.find(
                      (v) => v.deviceID === vehicule.deviceID
                    );

                    const matchedVehicle2 = dataFusionneeHome.find(
                      (v) => v.deviceID === vehicule.deviceID
                    );

                    const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
                    const currentTime = Date.now(); // Heure actuelle en millisecondes

                    const isSpeedActive =
                      matchedVehicle2.vehiculeDetails &&
                      matchedVehicle2.vehiculeDetails[0] &&
                      matchedVehicle2.vehiculeDetails[0].speedKPH > 0;

                    const isNotSpeedActive =
                      matchedVehicle2.vehiculeDetails &&
                      matchedVehicle2.vehiculeDetails[0] &&
                      matchedVehicle2.vehiculeDetails[0].speedKPH <= 0;

                    const isMoving = matchedVehicle.vehiculeDetails?.some(
                      (detail) => detail.speedKPH >= 1
                    );

                    const hasDetails =
                      matchedVehicle.vehiculeDetails &&
                      matchedVehicle.vehiculeDetails.length > 0;

                    const noSpeed = matchedVehicle.vehiculeDetails?.every(
                      (detail) => detail.speedKPH <= 0
                    );

                    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                    const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
                      ? matchedVehicle.lastUpdateTime * 1000
                      : 0;
                    const isActive =
                      currentTime - lastUpdateTimeMs < twentyHoursInMs;

                    const isSearching =
                      searchdonneeFusionneeForRapport?.length > 0;
                    ///////////////////////////////////////////////////////////////////////////

                    ////////////////////////////////////////////////////
                    // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
                    const getTodayTimestamp = () => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0); // Minuit
                      return Math.floor(now.getTime() / 1000); // Convertir en secondes
                    };
                    const todayTimestamp = getTodayTimestamp() * 1000;

                    // Fonction pour obtenir le timestamp actuel en millisecondes
                    const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

                    const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
                    const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

                    const hasBeenMoving =
                      matchedVehicle.vehiculeDetails &&
                      matchedVehicle.vehiculeDetails?.some(
                        (detail) => detail.speedKPH >= 1
                      );

                    const lastUpdateTimestampMs =
                      matchedVehicle.vehiculeDetails &&
                      matchedVehicle.vehiculeDetails[0] &&
                      matchedVehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

                    const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

                    const isNotStillSpeedActive =
                      lastUpdateTimestampMs &&
                      currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

                    ////////////////////////////x////////////////////////////////////////

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
                    let border_top =
                      "border-t border-t-red-200 dark:border-t-red-600/30 ";

                    if (
                      !isSearching &&
                      hasDetails &&
                      isMoving &&
                      isActive &&
                      isToday
                    ) {
                      main_text_color = "text-green-700 dark:text-green-400";
                      statut = "En mouvement rapide";
                      lite_bg_color =
                        "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-green-800 dark:text-green-200";
                      active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
                      vitess_img = "/img/home_icon/active.png";
                      vitess_img_dark = "/img/home_icon/rapport_active.png";
                      imgClass = "w-12  h-auto sm:w-14 md:w-20";
                      imgBg =
                        "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200 ";
                      border_top =
                        "border-t border-t-green-200 dark:border-t-green-600/30 ";
                    } else if (
                      !isSearching &&
                      hasDetails &&
                      isActive &&
                      (noSpeed || (isMoving && !isToday))
                    ) {
                      main_text_color = "text-red-900 dark:text-red-300";
                      statut = "En Stationnement";
                      lite_bg_color =
                        "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
                      activeTextColor = "text-red-900 dark:text-red-200";
                      active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
                      vitess_img = "/img/home_icon/rapport_parking2.png";
                      vitess_img_dark = "/img/home_icon/rapport_parking.png";

                      imgClass = "w-14  h-auto sm:w-16 md:w-24";
                      imgBg =
                        "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 ";
                      border_top =
                        "border-t border-t-red-200 dark:border-t-red-600/30 ";
                    }
                    //
                    else if ((!isSearching && !hasDetails) || !isActive) {
                      main_text_color = "text-purple-900 dark:text-purple-300 ";
                      statut = "Hors service";
                      lite_bg_color =
                        "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-purple-900 dark:text-purple-200";
                      active_bg_color =
                        "bg-purple-200/50 dark:bg-purple-600/50";
                      vitess_img = "/img/home_icon/payer.png";
                      vitess_img_dark = "/img/home_icon/rapport_not_active.png";

                      imgClass = "w-14  h-auto sm:w-16 md:w-24";
                      imgBg =
                        "bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200 ";
                      border_top =
                        "border-t border-t-purple-200 dark:border-t-purple-600/30 ";
                    }
                    //
                    //
                    //
                    if (
                      !isSearching &&
                      isNotSpeedActive &&
                      hasDetails &&
                      isActive &&
                      filter === "notMovingNow"
                    ) {
                      main_text_color = "text-red-900 dark:text-red-300";
                      statut = "En Stationnement";
                      lite_bg_color =
                        "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
                      activeTextColor = "text-red-900 dark:text-red-200";
                      active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
                      vitess_img = "/img/home_icon/rapport_parking2.png";
                      vitess_img_dark = "/img/home_icon/rapport_parking.png";

                      imgClass = "w-14  h-auto sm:w-16 md:w-24";
                      imgBg =
                        "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 ";
                      border_top =
                        "border-t border-t-red-200 dark:border-t-red-600/30 ";
                    }
                    //

                    if (isSearching && hasDetails && isMoving) {
                      main_text_color = "text-green-700 dark:text-green-400";
                      statut = "En mouvement rapide";
                      lite_bg_color =
                        "bg-green-100/20 dark:bg-gray-900/30 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-green-800 dark:text-green-200";
                      active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
                      vitess_img = "/img/home_icon/active.png";
                      vitess_img_dark = "/img/home_icon/rapport_active.png";
                      imgClass = "w-12  h-auto sm:w-14 md:w-20";
                      imgBg =
                        "bg-green-200/40 dark:bg-green-900 border-white dark:border-green-400 dark:shadow-gray-600 shadow-md shadow-green-200 ";
                      border_top =
                        "border-t border-t-green-200 dark:border-t-green-600/30 ";
                    } else if (isSearching && hasDetails && noSpeed) {
                      main_text_color = "text-red-900 dark:text-red-300";
                      statut = "En Stationnement";
                      lite_bg_color =
                        "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
                      activeTextColor = "text-red-900 dark:text-red-200";
                      active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
                      vitess_img = "/img/home_icon/rapport_parking2.png";
                      vitess_img_dark = "/img/home_icon/rapport_parking.png";

                      imgClass = "w-14  h-auto sm:w-16 md:w-24";
                      imgBg =
                        "bg-red-200/40 dark:bg-red-900 border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 ";
                      border_top =
                        "border-t border-t-red-200 dark:border-t-red-600/30 ";
                    }
                    //
                    else if ((isSearching && !hasDetails) || !isActive) {
                      main_text_color = "text-purple-900 dark:text-purple-300 ";
                      statut = "Hors service";
                      lite_bg_color =
                        "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-purple-900 dark:text-purple-200";
                      active_bg_color =
                        "bg-purple-200/50 dark:bg-purple-600/50";
                      vitess_img = "/img/home_icon/payer.png";
                      vitess_img_dark = "/img/home_icon/rapport_not_active.png";

                      imgClass = "w-14  h-auto sm:w-16 md:w-24";
                      imgBg =
                        "bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200 ";
                      border_top =
                        "border-t border-t-purple-200 dark:border-t-purple-600/30 ";
                    }

                    return (
                      <div>
                        {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                        <div
                          onClick={() => {
                            handleClick(vehicule);
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
                                  className={`${main_text_color} dark:text-green-200 text-gray-800-- font-semibold text-md md:text-xl mb-2`}
                                >
                                  {vehicule?.description || "non disponible"}
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
                                      {vehicule?.totalMovingDuration}
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
                                        Duree{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem] font-semibold dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {vehicule?.totalMovingDuration}
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
                                        Départ{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {vehicule?.vehiculeDetails[0]?.timestamp
                                        ? FormatDateHeure(
                                            vehicule?.vehiculeDetails[
                                              vehicule?.vehiculeDetails.length -
                                                1
                                            ]?.timestamp
                                          )?.date
                                        : ""}{" "}
                                      {vehicule?.vehiculeDetails[0]
                                        ?.timestamp && (
                                        <span className="px-2"> / </span>
                                      )}{" "}
                                      <span className="font-bold">
                                        {vehicule?.vehiculeDetails[0]?.timestamp
                                          ? FormatDateHeure(
                                              vehicule?.vehiculeDetails[
                                                vehicule?.vehiculeDetails
                                                  .length - 1
                                              ]?.timestamp
                                            )?.time
                                          : "Pas d'adresse disponible"}{" "}
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
                                        Arrivé{" "}
                                      </p>
                                    </div>
                                    <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                      {vehicule?.vehiculeDetails[0]?.timestamp
                                        ? FormatDateHeure(
                                            vehicule?.vehiculeDetails[0]
                                              ?.timestamp
                                          )?.date
                                        : ""}{" "}
                                      {vehicule?.vehiculeDetails[0]
                                        ?.timestamp && (
                                        <span className="px-2">/</span>
                                      )}{" "}
                                      <span className="font-bold">
                                        {vehicule?.vehiculeDetails[0]?.timestamp
                                          ? FormatDateHeure(
                                              vehicule?.vehiculeDetails[0]
                                                ?.timestamp
                                            )?.time
                                          : "Pas d'adresse disponible"}{" "}
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
                                          Vitesse{" "}
                                        </p>
                                      </div>
                                      <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                        {vehicule?.avgSpeed + " Km/h"}
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
                                          Distance{" "}
                                        </p>
                                      </div>
                                      <p className="text-[.95rem]  dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600  md:text-[1.02rem]">
                                        {vehicule.totalDistance.toFixed(0)} km
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
                                  Départ{" "}
                                </p>
                                <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 mt-2 md:text-lg">
                                  {vehicule?.vehiculeDetails[0]?.timestamp
                                    ? FormatDateHeure(
                                        vehicule?.vehiculeDetails[
                                          vehicule?.vehiculeDetails.length - 1
                                        ]?.timestamp
                                      )?.date
                                    : ""}{" "}
                                  {vehicule?.vehiculeDetails[0]?.timestamp && (
                                    <span className="px-2"> / </span>
                                  )}{" "}
                                  <span className="font-bold">
                                    {vehicule?.vehiculeDetails[0]?.timestamp
                                      ? FormatDateHeure(
                                          vehicule?.vehiculeDetails[
                                            vehicule?.vehiculeDetails.length - 1
                                          ]?.timestamp
                                        )?.time
                                      : "Pas d'adresse disponible"}{" "}
                                  </span>
                                </p>
                              </div>
                              <div className="flex">
                                <p
                                  className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                >
                                  Arrivé{" "}
                                </p>
                                <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                  {vehicule?.vehiculeDetails[0]?.timestamp
                                    ? FormatDateHeure(
                                        vehicule?.vehiculeDetails[0]?.timestamp
                                      )?.date
                                    : ""}{" "}
                                  {vehicule?.vehiculeDetails[0]?.timestamp && (
                                    <span className="px-2">/</span>
                                  )}{" "}
                                  <span className="font-bold">
                                    {vehicule?.vehiculeDetails[0]?.timestamp
                                      ? FormatDateHeure(
                                          vehicule?.vehiculeDetails[0]
                                            ?.timestamp
                                        )?.time
                                      : "Pas d'adresse disponible"}{" "}
                                  </span>
                                </p>
                              </div>
                              <div className="flex gap-x-8 flex-wrap ">
                                <div className="flex">
                                  <p
                                    className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                  >
                                    {" "}
                                    Vitesse{" "}
                                  </p>
                                  <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                    {vehicule?.avgSpeed + " Km/h"}
                                  </p>
                                </div>

                                <div className="flex">
                                  <p
                                    className={`${main_text_color} min-w-[4.8rem] text-[.9rem] dark:text-[.9rem] felx sm:flex md:text-lg text-green-700  font-bold dark:text-green-200`}
                                  >
                                    {" "}
                                    Distance{" "}
                                  </p>
                                  <p className="text-[.9rem] dark:text-[.9rem] felx sm:flex dark:text-gray-300 text-gray-600 md:text-lg">
                                    {vehicule.totalDistance.toFixed(0)} km
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
                    Pas de Resultat
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {voirDansLaCarte && (
          <div className=" fixed inset-0 z-[999999999999999999] p-2 md:p-4 lg:px-10 bg-black/50">
            <div className="relative  rounded-lg  mt-3-- h-[100vh]  overflow-hidden w-full">
              {/* <div className="bg-white p-3 py-6">Trajet du véhicule</div> */}
              <button
                className="absolute z-[9999999999999999999999999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setvoirDansLaCarte(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                  <IoClose className="text-white text-[1.52rem]" />
                </div>
              </button>
              <div className="w-full max-h-[90vh]  overflow-hidden border-2-- border-red-600">
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

        {/* <RapportOptions /> */}

        {trajetVehiculePupup && (
          <div className="flex hidden-- z-[499999999990] justify-center items-center px-4 fixed inset-0 bg-black/50">
            <div className="bg-white  rounded-lg p-3--">
              <div className="flex justify-between px-4 pt-3">
                <h2 className="text-xl font-bold">Trajet du véhicule</h2>
                <IoClose
                  onClick={() => {
                    settrajetVehiculePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className=" overflow-auto w-[95vw] p-3  max-h-[70vh]">
                <div className="min-h-[60vh] overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
                  <p className="text-center">Trajet du véhicule ici...</p>
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
                        #
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
                    {vehiclesByDepartureTime?.map((vehicule, index) => (
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
                            ? FormatDateHeure(
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
                            ? FormatDateHeure(
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
                            "Pas d'adresse disponible"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
                        #
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
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
                          {vehicule?.vehiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
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
                            "Pas d'adresse disponible"}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
                        #
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
                          {vehicule?.totalMovingDuration}
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
                            ? FormatDateHeure(
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
                            "Pas d'adresse disponible"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
                <h2 className="text-xl font-bold dark:text-gray-50">
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
                        #
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                        Véhicule
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        vitesse maximale
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        vitesse nimimale
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
                          {vehicule?.maxSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.minSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {vehicule?.avgSpeed + " Km/h"}
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
                            ? FormatDateHeure(
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
                            "Pas d'adresse disponible"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
                        #
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
                            "Pas d'adresse disponible"}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
            console.log(
              "mostRecentTimestamp",
              mostRecentTimestamp.mostRecentTimestamp
            );
            console.log("mostOldTimestamp", mostOldTimestamp.mostOldTimestamp);
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
            <div className="flex flex-wrap">
              <p>Date de recherche trouvée : </p>
              <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                {jourDebut ? (
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
            </div>
            <div className="flex flex-wrap">
              <p>Heure de recherche trouvée :</p>
              {jourDebut ? (
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                  De{" "}
                  <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                    {heureDebut}
                  </span>{" "}
                  à{" "}
                  <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                    {heureFin}{" "}
                  </span>{" "}
                </span>
              ) : (
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                  Pas de date disponible
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
            {searchdonneeFusionneeForRapport.length <= 0 && (
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                * Informations Actuellement
              </h2>
            )}
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
                  setFilter("all");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            {searchdonneeFusionneeForRapport.length <= 0 && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule en mouvement :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {activeVehicleCount?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    // setdefineVehiculeListePupup("notactive");
                    setFilter("movingNow");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {searchdonneeFusionneeForRapport.length <= 0 && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule en stationnement :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {notActiveVehicleCount?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setdefineVehiculeListePupup("notactive");
                    setFilter("notMovingNow");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {searchdonneeFusionneeForRapport.length <= 0 && (
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
                    setFilter("inactive");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {/*  */}
            {/*  */}
            {/*  */}
            {searchdonneeFusionneeForRapport.length <= 0 && (
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            )}{" "}
            {/*  */}
            {/*  */}
            {/*  */}
            {searchdonneeFusionneeForRapport.length <= 0 && (
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                * Pour la journée d'aujourd'hui
              </h2>
            )}
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicules déplacés :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {vehiculeActiveAjourdhui?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("active");
                  setFilter("moving");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicules non déplacés :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {vehiculeActiveAjourdhui?.length || "0"} */}
                  {vehiculeNotActiveAjourdhui?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setdefineVehiculeListePupup("active");
                  setFilter("parking");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            {searchdonneeFusionneeForRapport.length > 0 && (
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
                    setFilter("inactive");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {/* ////////////////////////////////////////////////////////////////////////////// */}
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
                {vehiclesByDepartureTime[0]?.vehiculeDetails.length > 0 && (
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
                            {vehiclesByDepartureTime[0]?.vehiculeDetails[
                              vehiclesByDepartureTime[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? FormatDateHeure(
                                  vehiclesByDepartureTime[0]?.vehiculeDetails[
                                    vehiclesByDepartureTime[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          à{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiclesByDepartureTime[0]?.vehiculeDetails[
                              vehiclesByDepartureTime[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? FormatDateHeure(
                                  vehiclesByDepartureTime[0]?.vehiculeDetails[0]
                                    ?.timestamp
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiclesByDepartureTime[0]?.vehiculeDetails.length > 0
                      ? vehiclesByDepartureTime[0]?.description + " a "
                      : "Pas de véhicule en mouvement"}
                  </span>
                  <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                    {vehiclesByDepartureTime[0]?.vehiculeDetails[
                      vehiclesByDepartureTime[0]?.vehiculeDetails.length - 1
                    ]?.timestamp
                      ? FormatDateHeure(
                          vehiclesByDepartureTime[0]?.vehiculeDetails[
                            vehiclesByDepartureTime[0]?.vehiculeDetails.length -
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
                <div className="flex gap-6">
                  {vehiclesByDepartureTime[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        positionDansCarte(vehiclesByDepartureTime[0]);
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
                              ? FormatDateHeure(
                                  vehiclesByDistance[0]?.vehiculeDetails[
                                    vehiclesByDistance[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          à{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? FormatDateHeure(
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByDistance[0]?.description + " "
                      : "Pas de véhicule en mouvement"}
                  </span>{" "}
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 &&
                    "( environ " +
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        positionDansCarte(vehiclesByDistance[0]);

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
                              ? FormatDateHeure(
                                  vehiclesByMovingDuration[0]?.vehiculeDetails[
                                    vehiclesByMovingDuration[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          à{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? FormatDateHeure(
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByMovingDuration[0]?.description
                      : "Pas de véhicule en mouvement"}
                  </span>
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 &&
                    "( environ " +
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
                <div className="flex gap-6">
                  {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0 && (
                    <button
                      onClick={() => {
                        // settrajetVehiculePupup(true);
                        positionDansCarte(vehiclesByMovingDuration[0]);

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
                              ? FormatDateHeure(
                                  vehiculeMouvementOrdered[0]?.vehiculeDetails[
                                    vehiculeMouvementOrdered[0]?.vehiculeDetails
                                      .length - 1
                                  ]?.timestamp
                                )?.time
                              : " "}{" "}
                          </span>{" "}
                          à{" "}
                          <span className="font-semibold">
                            {" "}
                            {vehiculeMouvementOrdered[0]?.vehiculeDetails[
                              vehiculeMouvementOrdered[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp
                              ? FormatDateHeure(
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered[0]?.vehiculeDetails.length > 0
                      ? vehiclesByMaxSpeed[0]?.description
                      : "Pas de véhicule en mouvement"}
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
                        positionDansCarte(vehiclesByMaxSpeed[0]);
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
              <div className="flex flex-wrap">
                <p>Date de recherche trouvée : </p>
                <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                  {
                    jourDebut ? (
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
              </div>

              <div className="flex flex-wrap">
                <p>Heure de recherche trouvée :</p>
                {jourDebut ? (
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    De{" "}
                    <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                      {heureDebut}
                    </span>{" "}
                    à{" "}
                    <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                      {heureFin}{" "}
                    </span>{" "}
                  </span>
                ) : (
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    Pas de date disponible
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
                  Temps d'activité total :
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
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
                  {totalDistanceSum.toFixed(0) + " km" || "Pas de mouvement"}
                </span>
              </p>

              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <p>
                Nombre total d’arrêts :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {nombreTotaleArret > 0
                    ? nombreTotaleArret + " arrêts"
                    : " 0 arrêt"}
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
                    {speeds.minSpeed != "Infinity"
                      ? speeds.minSpeed.toFixed(0) + " Km/h"
                      : "0 Km/h"}
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
                  {speeds.maxSpeed != "-Infinity"
                    ? speeds.maxSpeed.toFixed(0) + " Km/h"
                    : "0 Km/h"}
                </span>
              </p>
              <p>
                Vitesse moyenne:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {totalAvgSpeed.toFixed(0) + " Km/h"}
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

        <div className="mt-4  flex items-center gap-2">
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 ">
            Véhicules déplacés
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
            Véhicules en stationnement
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
            Véhicules hors service
          </p>
        </div>

        <div className="w-full mt-4 max-h-[30rem] md:h-[20rem]-- mb-20 overflow-x-auto overflow-y-hidden">
          {/*  */}
          <thead>
            <tr className="bg-orange-50 relative z-20 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
              <th className="text-start border-l-4   border-l-orange-200 border dark:border-gray-600 py-3 px-2 min-w-[4.1458rem]">
                #
              </th>

              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                Véhicule
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                Date et Heure de départ
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[13rem]">
                Date et Heure d'arrivée
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Vitesse moyenne
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Vitesse maximale
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Distance totale
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                Nombre d'arrêts
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[12rem]">
                Temps en mouvement
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                Adresse de départ
              </th>
              <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                Adresse d'arrivée
              </th>
            </tr>
          </thead>

          <div className="border-2-- pb-10 -translate-y-[3.1rem] w-full min-w-[160rem] border-red-500 h-[30rem] md:h-[20rem]-- overflow-y-auto overflow-x-hidden">
            <table className=" w-full text-left dark:bg-gray-800 dark:text-gray-200">
              <thead>
                <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                  <th className="border border-l-4  border-l-red-600 dark:border-gray-600 py-3 px-2 min-w-[4rem]">
                    #
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
                {(tableSortBy || vehiclesByDepartureTime)?.map(
                  (vehicule, index) => {
                    // Trouver le véhicule correspondant dans updateData
                    const matchedVehicle = currentdataFusionnee.find(
                      (v) => v.deviceID === vehicule.deviceID
                    );

                    const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
                    const currentTime = Date.now(); // Heure actuelle en millisecondes

                    const isMoving = matchedVehicle.vehiculeDetails?.some(
                      (detail) => detail.speedKPH >= 1
                    );

                    const hasDetails =
                      matchedVehicle.vehiculeDetails &&
                      matchedVehicle.vehiculeDetails.length > 0;

                    const noSpeed = matchedVehicle.vehiculeDetails?.every(
                      (detail) => detail.speedKPH <= 0
                    );

                    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                    const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
                      ? matchedVehicle.lastUpdateTime * 1000
                      : 0;
                    const isActive =
                      currentTime - lastUpdateTimeMs < twentyHoursInMs;

                    ///////////////////////////////////////////////////////////////////////////

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
                          className={`${iconBg} border font-semibold text-lg border-l-4  py-3 px-2  bg-gray-50-- dark:bg-gray-900/70  dark:border-gray-600`}
                        >
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(vehicule);
                          }}
                          className={`${vehiculeBG} border cursor-pointer  py-3 px-2  bg-gray-50-- dark:bg-gray-900/70  dark:border-gray-600 `}
                        >
                          {vehicule?.description || "---"}
                        </td>
                        {/*  */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByDepartureTime" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2   dark:border-gray-600`}
                        >
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
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[
                                  vehicule?.vehiculeDetails.length - 1
                                ]?.timestamp
                              )?.time
                            : "Pas d'adresse disponible"}{" "}
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
                            ? FormatDateHeure(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas d'adresse disponible"}{" "}
                        </td>

                        {/* Vitesse moyenne */}
                        <td className="border py-3 px-2 dark:border-gray-600">
                          {vehicule?.avgSpeed + " Km/h"}
                        </td>
                        {/* max speed */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByMaxSpeed" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600`}
                        >
                          {(vehicule?.maxSpeed).toFixed(0) + " Km/h"}
                        </td>

                        {/* Distance totale */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByDistance" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2 dark:border-gray-600`}
                        >
                          {vehicule.totalDistance.toFixed(0)} km
                        </td>

                        {/* Nombre d'arret */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {/* {Object.entries(result3.stopsByVehicle)[index][1]} arrêts */}
                          {vehicule.stopCount + " arrêts"}
                        </td>

                        {/* Temps actifs */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByMovingDuration" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2 dark:border-gray-600`}
                        >
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
                            "Pas d'adresse disponible"}
                        </td>

                        {/* Addresse départ */}
                        <td className="border py-3 px-2     dark:border-gray-600">
                          {vehicule.vehiculeDetails[0]?.backupAddress ||
                            vehicule.vehiculeDetails[0]?.address ||
                            "Pas d'adresse disponible"}
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
