import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
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
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);
  let x;

  //
  //
  //
  //
  //
  //
  //
  //
  const dataFusionneeHome = mergedDataHome ? Object.values(mergedDataHome) : [];

  //
  //
  //
  //
  //
  //
  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
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

  // Pour voir plus de details
  const [voirPlus, setvoirPlus] = useState(false);

  // Pour voir le trajet d'un vehicules dans la carte dans la carte
  const [voirTrajetDansLaCarte, setVoirTrajetDansLaCarte] = useState(false);

  // Pour le filtrage du tableau en ordre croissant ou décroissant
  const [tableSortCroissant, setTableSortCroissant] = useState(true);
  useEffect(() => {
    console.log(tableSortCroissant);
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
  x;
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
    return currentData?.map((item) => {
      const véhiculeDetails = item.véhiculeDetails;

      // Trouver le premier et le dernier index où speedKPH >= 1
      const firstValidIndex = véhiculeDetails.findIndex(
        (detail) => parseFloat(detail.speedKPH) >= 1
      );

      const lastValidIndex =
        véhiculeDetails.length -
        1 -
        véhiculeDetails
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
          véhiculeDetails: [],
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

      const filteredVehiculeDetails = véhiculeDetails.slice(
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
          véhiculeDetails: [],
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
        véhiculeDetails: filteredVehiculeDetails,
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
      ?.map((item) => {
        const lastDetail =
          item.véhiculeDetails[item.véhiculeDetails.length - 1];
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
          véhiculeDetails: item.véhiculeDetails,
        };
      })
      .sort((a, b) =>
        tableSortCroissant ? b.maxSpeed - a.maxSpeed : a.maxSpeed - b.maxSpeed
      );
  };

  const sortVehiclesByDistance = (filteredData) => {
    return filteredData
      ?.map((item) => ({
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
        véhiculeDetails: item.véhiculeDetails,
      }))
      .sort((a, b) =>
        tableSortCroissant
          ? b.totalDistance - a.totalDistance
          : a.totalDistance - b.totalDistance
      );
  };

  const sortVehiclesByMovingDuration = (filteredData) => {
    return filteredData
      ?.map((item) => ({
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
        véhiculeDetails: item.véhiculeDetails,
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

        return tableSortCroissant ? totalB - totalA : totalA - totalB;
      });
  };

  const sortVehiclesByMaxSpeed = (filteredData) => {
    return filteredData
      ?.map((item) => ({
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
        véhiculeDetails: item.véhiculeDetails,
      }))
      .sort((a, b) =>
        tableSortCroissant ? b.maxSpeed - a.maxSpeed : a.maxSpeed - b.maxSpeed
      );
  };

  const sortVehiclesByFirstMovement = (filteredData) => {
    return filteredData
      ?.map((item) => {
        const véhiculeDetails = item.véhiculeDetails;

        // Trouver le dernier index où speedKPH >= 1
        const lastValidIndex = véhiculeDetails.findLastIndex(
          (detail) => parseFloat(detail.speedKPH) >= 1
        );

        // Si aucun mouvement n'est trouvé, retourner un timestamp par défaut très élevé
        const firstMovementTimestamp =
          lastValidIndex === -1
            ? Number.MAX_SAFE_INTEGER
            : véhiculeDetails[lastValidIndex].timestamp;

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
          véhiculeDetails: item.véhiculeDetails,
        };
      })
      .sort((a, b) => {
        // Trier par ordre croissant du timestamp, en mettant les véhicules sans mouvement à la fin
        return tableSortCroissant
          ? a.firstMovementTimestamp - b.firstMovementTimestamp
          : b.firstMovementTimestamp - a.firstMovementTimestamp;
      });
  };

  const filteredData = processVehicleData(
    currentDataFusionné && currentDataFusionné
  );

  const vehiculeMouvementOrdered = sortVehiclesBySpeed(filteredData);

  // Filtrer par distance parcouru OKK... tester
  const vehiclesByDistance = sortVehiclesByDistance(filteredData);

  // Filter par temps en mouvement OKKK... tester
  const vehiclesByMovingDuration = sortVehiclesByMovingDuration(filteredData);

  // Filtrer par vitesse maximale OKKK... tester
  const vehiclesByMaxSpeed = sortVehiclesByMaxSpeed(filteredData);

  // Appliquer le filtre par heure de départ
  const vehiclesByDepartureTime = sortVehiclesByFirstMovement(filteredData);
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
    console.log("currentVéhicule", currentVehiculeInCarte);
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
    console.log("tableSortBy:", tableSortBy);
    console.log("tableSortByColorBg:", tableSortByColorBg);
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

    if (foundVehicle) {
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
  // Fonction pour filtrer les véhicules
  const filteredVehiclesListe = vehiclesByDepartureTime?.filter((véhicule) => {
    const matchedVehicle =
      currentDataFusionné &&
      currentDataFusionné.find((v) => v.deviceID === véhicule?.deviceID);

    const matchedVehicle2 =
      dataFusionneeHome &&
      dataFusionneeHome?.find((v) => v.deviceID === véhicule?.deviceID);

    const isSpeedActive =
      matchedVehicle2.véhiculeDetails &&
      matchedVehicle2.véhiculeDetails[0] &&
      matchedVehicle2.véhiculeDetails[0].speedKPH > 0;

    const isNotSpeedActive =
      matchedVehicle2.véhiculeDetails &&
      matchedVehicle2.véhiculeDetails[0] &&
      matchedVehicle2.véhiculeDetails[0].speedKPH <= 0;

    const isMoving = matchedVehicle.véhiculeDetails?.some(
      (detail) => detail.speedKPH >= 1
    );

    const hasDetails =
      matchedVehicle.véhiculeDetails &&
      matchedVehicle.véhiculeDetails.length > 0;

    const noSpeed = matchedVehicle.véhiculeDetails?.every(
      (detail) => detail.speedKPH <= 0
    );
    //

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = matchedVehicle.lastUpdateTime
      ? matchedVehicle.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const isSearching = searchDonneeFusionnéForRapport?.length > 0;

    const hasBeenMoving =
      matchedVehicle.véhiculeDetails &&
      matchedVehicle.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

    const lastUpdateTimestampMs =
      matchedVehicle.véhiculeDetails &&
      matchedVehicle.véhiculeDetails[0] &&
      matchedVehicle.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

    const isNotStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

    if (!isSearching) {
      if (filter === "movingNow")
        return (
          isSpeedActive && hasDetails && isActive && !isNotStillSpeedActive
        );
      if (filter === "notMovingNow")
        return (
          hasDetails &&
          isActive &&
          (isNotSpeedActive || (hasBeenMoving && isNotStillSpeedActive))
        );
      if (filter === "moving") return hasDetails && isMoving && isToday;

      if (filter === "parking")
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
  const activeVehicleCount =
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
        currentTimeMs - lastUpdateTimestampMs <= thirtyMinutesInMs;

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
  const notActiveVehicleCount =
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
        currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

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
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
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

  const isSearching = searchDonneeFusionnéForRapport?.length > 0;

  const isSearchingToday = mostOldTimestamp * 1000 >= todayTimestamp;

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
    XLSX.writeFile(workbook, "Rapport des vehicules.xlsx"); // Nom du fichier
  };

  // preparation a l'exportation
  const [preparationDownloadPDF, setPreparationDownloadPDF] = useState(false);
  useEffect(() => {
    console.log(preparationDownloadPDF);
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
        className=" px-4 pb-20 md:max-w-[80vw] w-full"
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
              {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}

              <div className="mx-auto  md:w-[75vw]">
                <div className="flex  flex-wrap">
                  <p className="font-bold">Date : </p>
                  <span className="font-semibold dark:text-orange-500 text-gray-900 pl-5">
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
                {/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}
                <div className="flex flex-wrap">
                  <p className="font-bold">Heure :</p>
                  {jourDebut ? (
                    <span className="font-semibold dark:text-orange-500 text-gray-700 pl-5">
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
                {filter === "all" && (
                  <div className="mt-4 mb-4 flex items-center gap-2">
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 ">
                      {isSearching
                        ? "Véhicules déplacés"
                        : "Véhicules en mouvement"}
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
                      {isSearching
                        ? "Véhicules non déplacés"
                        : "Véhicules en stationnement"}
                    </p>
                    <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
                      Véhicules hors service
                    </p>
                  </div>
                )}
              </div>
              <div className="relative pb-20 flex flex-col gap-4 h-[70vh] pt-6 rounded-lg overflow-auto bg-white-- md:px-[10vw]">
                {filteredVehiclesListe.length > 0 ? (
                  filteredVehiclesListe?.map((véhicule, index) => {
                    // Trouver le véhicule correspondant dans updateData
                    const matchedVehicle =
                      currentDataFusionné &&
                      currentDataFusionné.find(
                        (v) => v.deviceID === véhicule?.deviceID
                      );

                    const matchedVehicle2 =
                      dataFusionneeHome &&
                      dataFusionneeHome?.find(
                        (v) => v.deviceID === véhicule?.deviceID
                      );

                    const isSpeedActive =
                      matchedVehicle2.véhiculeDetails &&
                      matchedVehicle2.véhiculeDetails[0] &&
                      matchedVehicle2.véhiculeDetails[0].speedKPH > 0;

                    const isNotSpeedActive =
                      matchedVehicle2.véhiculeDetails &&
                      matchedVehicle2.véhiculeDetails[0] &&
                      matchedVehicle2.véhiculeDetails[0].speedKPH <= 0;

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

                    const isSearching =
                      searchDonneeFusionnéForRapport?.length > 0;
                    ///////////////////////////////////////////////////////////////////////////

                    ////////////////////////////////////////////////////
                    // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
                    const getTodayTimestamp = () => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0); // Minuit
                      return Math.floor(now.getTime() / 1000); // Convertir en secondes
                    };
                    const todayTimestamp = getTodayTimestamp() * 1000;

                    const hasBeenMoving =
                      matchedVehicle.véhiculeDetails &&
                      matchedVehicle.véhiculeDetails?.some(
                        (detail) => detail.speedKPH >= 1
                      );

                    const lastUpdateTimestampMs =
                      matchedVehicle.véhiculeDetails &&
                      matchedVehicle.véhiculeDetails[0] &&
                      matchedVehicle.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

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
                      isSpeedActive &&
                      // isActive &&
                      !isNotStillSpeedActive
                      // && isToday
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
                      // hasBeenMoving &&
                      // !isSpeedActive
                      (!isSpeedActive ||
                        (isSpeedActive && isNotStillSpeedActive))
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

                    if (
                      hasDetails &&
                      isActive &&
                      isToday &&
                      filter === "moving"
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
                                  className={`${main_text_color} dark:text-green-200 text-gray-800-- font-semibold text-md md:text-xl mb-2`}
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
                                        Duree{" "}
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
                                        Départ{" "}
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
                                          : "Pas de date disponible"}{" "}
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
                                          : "Pas de date disponible"}{" "}
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
                                          Distance{" "}
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
                                  Départ{" "}
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
                                      : "Pas de date disponible"}{" "}
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
                                      : "Pas de date disponible"}{" "}
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
                                    {véhicule?.avgSpeed + " Km/h"}
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
                    Pas de Resultat
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
                    {vehiclesByDepartureTime?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
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
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
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
                            : "Pas de dépacement"}{" "}
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
                          className="border py-3 px-2 cursor-pointer  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            "Pas d'adresse disponible"}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 cursor-pointer  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
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
                    {vehiclesByDistance?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2   dark:bg-gray-800  dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.totalDistance.toFixed(0) + " Km"}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
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
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2    dark:bg-gray-800  dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
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
                          className="border py-3 px-2  cursor-pointer  dark:bg-gray-800  dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            "Pas d'adresse disponible"}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2  cursor-pointer  dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
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
                    {vehiclesByMovingDuration?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {
                            //
                            index + 1 || "---"
                          }
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {
                            //
                            véhicule?.description || "---"
                          }
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.totalMovingDuration}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
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
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
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
                          className="border py-3 px-2  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            "Pas d'adresse disponible"}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 cursor-pointer  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
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
                        Vitesse maximale
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Vitesse minimale
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Vitesse moyenne
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
                    {vehiclesByDistance?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.description || "---"}
                        </td>

                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.maxSpeed.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.minSpeed?.toFixed(0) + " Km/h"}
                        </td>
                        <td className="border py-3 px-2  bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule?.avgSpeed + " Km/h"}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
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
                            : "Pas de dépacement"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-white dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.véhiculeDetails[0]?.timestamp
                            ? FormatDateHeure(
                                véhicule?.véhiculeDetails[0]?.timestamp
                              )?.time
                            : "Pas de dépacement"}{" "}
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
                          className="border py-3 px-2  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[
                            véhicule?.véhiculeDetails?.length - 1
                          ]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            "Pas d'adresse disponible"}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2  cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
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
                        Temps d'activité
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Temps d'inactivité
                      </th>

                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Distance parcourue
                      </th>
                      <th className="border dark:border-gray-600 py-3 px-2 min-w-[15rem]">
                        Nombre d'arrêt
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
                    {vehiculeMouvementOrdered?.map((véhicule, index) => (
                      <tr key={index} className="border dark:border-gray-600">
                        <td className="border py-3 px-2  bg-gray-50 dark:bg-gray-800  dark:border-gray-600">
                          {index + 1 || "---"}
                        </td>
                        <td
                          onClick={() => {
                            handleClick(véhicule);
                          }}
                          className="border cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700  py-3 px-2  bg-gray-50 dark:bg-gray-800  dark:border-gray-600"
                        >
                          {véhicule?.description || "---"}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalMovingDuration || "0h 0m 0s "}
                        </td>
                        <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          {véhicule.totalPauseDuration || "0h 0m 0s"}
                        </td>
                        {/* <td className="border py-3 px-2   bg-orange-50 dark:bg-gray-900/70 dark:border-gray-600">
                          2h 22m 45s
                        </td> */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.totalDistance?.toFixed(0) + " km" ||
                            " 0 km"}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                          {véhicule?.stopCount > 0
                            ? véhicule?.stopCount + " arrêts"
                            : "0 arrêt"}
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
                          className="border py-3 px-2  cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails?.length - 1
                            ]?.address ||
                            "Pas d'adresse disponible"}
                        </td>
                        <td
                          onClick={() => {
                            afficherPositionTableauEnCarte(
                              véhicule,
                              véhicule?.véhiculeDetails[0]?.creationTime
                            );
                          }}
                          className="border py-3 px-2 cursor-pointer  bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                        >
                          {véhicule?.véhiculeDetails[0]?.backupAddress ||
                            véhicule?.véhiculeDetails[0]?.address ||
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <h1
          onClick={() => {
            console.log(vehiclesByDepartureTime);
          }}
          className="text-center mb-10 font-semibold text-xl my-10 dark:text-gray-300"
        >
          Rapport détaillé en groupe
        </h1>
        {preparationDownloadPDF && <p className="min-h-[4rem]"></p>}
        <div
          className={`
          ${preparationDownloadPDF ? " " : "shadow-md"}
           dark:bg-gray-800 dark:shadow-gray-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
        >
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur les véhicules
            </h2>
          </div>

          <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
            {/* Date et heure de recherche */}
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
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                * Informations Actuellement
              </h2>
            )}
            <div className="flex justify-between items-center pr-3">
              <p>
                Nombre total de véhicules :{" "}
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
                voir
              </p>
            </div>
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
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
                    setFilter("movingNow");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
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
                    setFilter("notMovingNow");
                  }}
                  className="text-orange-400 underline cursor-pointer"
                >
                  voir
                </p>
              </div>
            )}
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule hors service :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {véhiculeHorsService?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
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
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            )}{" "}
            {/*  */}
            {/*  */}
            {/*  */}
            {(searchDonneeFusionnéForRapport.length <= 0 ||
              isSearchingToday) && (
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                * Pour la journée d'aujourd'hui
              </h2>
            )}
            <div className="flex justify-between items-center pr-3">
              <p>
                Véhicules déplacés :{" "}
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {véhiculeActiveToday?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
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
                  {/* {véhiculeActiveToday?.length || "0"} */}
                  {véhiculeNotActiveToday?.length || "0"}
                </span>
              </p>
              <p
                onClick={() => {
                  setvoirVehiculeListePupup(true);
                  setFilter("parking");
                }}
                className="text-orange-400 underline cursor-pointer"
              >
                voir
              </p>
            </div>
            {searchDonneeFusionnéForRapport.length > 0 && (
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule hors service :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {véhiculeHorsService?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
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
                    setvoirPlus(true);
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
          {/* {vehiculeMouvementOrdered && vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 && ( */}
          <div
            className={`
             ${preparationDownloadPDF ? " " : "shadow-md"}
             mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Véhicule en mouvement en 1er
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
                            à{" "}
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiclesByDepartureTime &&
                    vehiclesByDepartureTime[0]?.véhiculeDetails.length > 0
                      ? vehiclesByDepartureTime[0]?.description + " a "
                      : "Pas de véhicule en mouvement"}
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
                Véhicule ayant parcouru la plus grande distance
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
                                  Du{" "}
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
                            à{" "}
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByDistance[0]?.description + " "
                      : "Pas de véhicule en mouvement"}
                  </span>{" "}
                  {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 &&
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
                Véhicule en mouvement plus longtemps
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
                            à{" "}
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByMovingDuration[0]?.description
                      : "Pas de véhicule en mouvement"}
                  </span>
                  {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0 &&
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
                Véhicule avec la vitesse maximale
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
                            à{" "}
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
                  Nom du véhicule :<br />
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5 pr-2">
                    {vehiculeMouvementOrdered &&
                    vehiculeMouvementOrdered[0]?.véhiculeDetails.length > 0
                      ? vehiclesByMaxSpeed[0]?.description
                      : "Pas de véhicule en mouvement"}
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
        <div
          className={`
          ${preparationDownloadPDF ? " " : "shadow-md"}
           mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4`}
        >
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
                  {(totalDistanceSum && totalDistanceSum.toFixed(0) + " km") ||
                    "Pas de mouvement"}
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
                  voir plus
                </p>
              </div>
              <p>
                Vitesse maximale:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {speeds.maxSpeed != "-Infinity"
                    ? speeds && speeds.maxSpeed?.toFixed(0) + " Km/h"
                    : "0 Km/h"}
                </span>
              </p>
              <p>
                Vitesse moyenne:
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
              Position des véhicules{" "}
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
                  className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
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
                <div className="absolute z-[30] flex flex-col gap-0 bg-white dark:bg-gray-700 dark:shadow-gray-900 dark:border shadow-lg shadow-gray-500 rounded-md p-3 top-10 -right-2 min-w-[20rem]">
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
                      Croissant
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
                      Decroissant
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
        <div className="flex justify-between  mt-4  items-center ">
          <div className="sm:flex w-full gap-10 max-w-[50rem] mx-4-- justify-start items-center ">
            <div className="flex gap-0 items-center">
              <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
              <p className="text-[.9rem]">
                <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                  {
                    <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      Du{" "}
                      <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                        {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                        {anneeDebut === anneeFin ? "" : anneeDebut}
                      </span>{" "}
                      au{" "}
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
                  De{" "}
                  <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                    {heureDebut}
                  </span>{" "}
                  a{" "}
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
              <p>Telecharger</p>
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
            Véhicules déplacés
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 ">
            Véhicules non déplacés
          </p>
          <p className="px-2  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 ">
            Véhicules hors service
          </p>
        </div>
        <div
          className={`${
            preparationDownloadPDF ? "" : "md:h-[25rem] h-[20rem] "
          }  w-full mt-4 mb-20 overflow-x-auto overflow-y-hidden`}
        >
          {/*  */}
          <thead>
            <div className="h-auto-  w-full- overflow-y-scroll--">
              <tr className="bg-orange-50  relative z-20 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                <th className="border border-l-4  border-l-orange-200  min-w-[0rem] max-w-[0rem]"></th>
                <th className="text-start border-l-4--   border-l-orange-200 border dark:border-gray-600 py-3 px-2 min-w-[4rem] max-w-[4rem]">
                  #
                </th>

                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[18rem] max-w-[18rem]">
                  Véhicule
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2  min-w-[13rem] max-w-[13rem]">
                  Date et Heure de départ
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                  Date et Heure d'arrivée
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                  Vitesse moyenne
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                  Vitesse maximale
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                  Distance totale
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                  Nombre d'arrêts
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[12rem] max-w-[12rem]">
                  Temps en mouvement
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                  Adresse de départ
                </th>
                <th className="text-start border  dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                  Adresse d'arrivée
                </th>
              </tr>
            </div>
          </thead>

          <div
            className={` ${
              preparationDownloadPDF ? "" : "md:h-[25rem] h-[20rem] "
            }  border-2-- pb-10 -translate-y-[3.1rem] w-full min-w-[160rem]  overflow-y-auto overflow-x-hidden`}
          >
            <table
              ref={tableRef}
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
                    Véhicule
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                    Date et Heure de départ
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[13rem] max-w-[13rem]">
                    Date et Heure d'arrivée
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                    Vitesse moyenne
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                    Vitesse maximale
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                    Distance totale
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem] max-w-[10rem]">
                    Nombre d'arrêts
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[12rem] max-w-[12rem]">
                    Temps en mouvement
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem] max-w-[30rem]">
                    Adresse de départ
                  </th>
                  <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem]  max-w-[30rem]">
                    Adresse d'arrivée
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

                    const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

                    ////////////////////////////////////////////////////////////////////

                    let iconBg = "text-red-500 dark:text-red-500";
                    let vehiculeBG =
                      "bg-red-50/50-- hover:bg-red-100 dark:hover:bg-gray-700";

                    if (
                      hasDetails &&
                      isMoving &&
                      (isToday || (isSearching && !isToday))
                    ) {
                      iconBg =
                        "text-green-500 bg-green-50/50  dark:text-green-500 border-l-green-600 dark:border-l-green-600";
                      vehiculeBG =
                        "bg-green-50/50-- text-green-800 dark:text-green-200 font-semibold hover:bg-green-100 dark:hover:bg-gray-700";
                    } else if (
                      hasDetails &&
                      (noSpeed || (isMoving && !isToday)) &&
                      isActive
                    ) {
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
                          className={`${vehiculeBG} border cursor-pointer  py-3 px-2  bg-gray-50-- dark:bg-gray-900/70  dark:border-gray-600 `}
                        >
                          {véhicule?.description || "---"}
                        </td>
                        {/*  */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByDepartureTime" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2   dark:border-gray-600`}
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
                            : "Pas de date disponible"}{" "}
                        </td>
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
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
                            : "Pas de date disponible"}{" "}
                        </td>

                        {/* Vitesse moyenne */}
                        <td className="border py-3 px-2 dark:border-gray-600">
                          {véhicule?.avgSpeed + " Km/h"}
                        </td>
                        {/* max speed */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByMaxSpeed" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600`}
                        >
                          {(véhicule?.maxSpeed).toFixed(0) + " Km/h"}
                        </td>

                        {/* Distance totale */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByDistance" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2 dark:border-gray-600`}
                        >
                          {véhicule.totalDistance.toFixed(0)} km
                        </td>

                        {/* Nombre d'arret */}
                        <td className="border py-3 px-2   bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600">
                          {/* {Object.entries(result3.stopsByVehicle)[index][1]} arrêts */}
                          {véhicule.stopCount + " arrêts"}
                        </td>

                        {/* Temps actifs */}
                        <td
                          className={`${
                            tableSortByColorBg ===
                              ("vehiclesByMovingDuration" || "") &&
                            "bg-orange-50 dark:bg-orange-950"
                          } border py-3 px-2 dark:border-gray-600`}
                        >
                          {véhicule?.totalMovingDuration}
                        </td>

                        {/* Addresse départ */}
                        <Tooltip
                          title="Voir cette adresse sur la carte
                         "
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
                            className="border py-3 px-2  cursor-pointer  bg-gray-50 dark:bg-gray-900/70  dark:border-gray-600"
                          >
                            {véhicule?.véhiculeDetails[
                              véhicule?.véhiculeDetails.length - 1
                            ]?.backupAddress ||
                              véhicule?.véhiculeDetails[
                                véhicule?.véhiculeDetails.length - 1
                              ]?.address ||
                              "Pas d'adresse disponible"}
                          </td>
                        </Tooltip>

                        {/* Addresse départ */}
                        <Tooltip
                          title="Voir cette adresse sur la carte
                         "
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
                            className="border py-3 px-2  cursor-pointer   dark:border-gray-600"
                          >
                            {véhicule?.véhiculeDetails[0]?.backupAddress ||
                              véhicule?.véhiculeDetails[0]?.address ||
                              "Pas d'adresse disponible"}
                          </td>
                        </Tooltip>
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
