import React, { useContext, useEffect, useRef, useState } from "react";

import { Chart, registerables } from "chart.js";

// Enregistrement des composants nécessaires
Chart.register(...registerables);

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import { DataContext } from "../context/DataContext";

import RapportPageDetailsHeader from "../components/rapport_page_details/RapportPageDetailsHeader";
import RapportGroupe from "../components/rapport_page_details/RapportGroupe";
import RapportPageDetailsOptions from "../components/rapport_page_details/RapportPageDetailsOptions";
import RapportPersonnel from "../components/rapport_page_details/RapportPersonnel";
import DatePupup from "../components/rapport_vehicule/DatePupup";
import DateTimePicker from "../components/home/DateTimePicker";
import { useTranslation } from "react-i18next";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function RapportPageDetails() {
  const {
    currentVéhicule,
    showHistoriqueInMap,
    selectUTC,
    véhiculeActiveToday,
    véhiculeNotActiveToday,
    véhiculeHorsService,
    currentDataFusionné,
    searchDonneeFusionnéForRapport,
    setShowListOption,
    setVéhiculeHistoriqueDetails,
    rapportDataLoading,
    fetchSearchRapportVehicleDetails,
    mergedDataHome,
    setSelectedVehicleToShowInMap,
    FormatDateHeure,
    vehiclesByDepartureTime,
    setCurrentPersonelVéhicule,
    chooseFirstVéhicule,
    TimeFrom,
    TimeTo,
    fetchHistoriqueVehicleDetails,
    loadingHistoriqueFilter,
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    gestionAccountData,
    currentSelectedDeviceGestion,
    homePageReload,
    setDonneeFusionnéForRapport,
    setRapportVehicleDetails,
    setIsSearchingFromRapportGroupePage,
  } = useContext(DataContext);

  let x;

  const [t, i18n] = useTranslation();

  // Le data converti en Objet
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let totalDevice;

  if (isDashboardHomePage && currentAccountSelected) {
    totalDevice = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    totalDevice = accountDevices;
  } else if (!isDashboardHomePage) {
    totalDevice = dataFusionné;
  }

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
  // Pour afficher le popup du type de vue afin de choisir
  const [typeDeVue, setTypeDeVue] = useState(false);

  // Pour voir le trajet du véhicules sur grand écran
  const [zoomCart, setzoomCart] = useState(false);

  // pour voir la position des véhicules sur grand écran
  const [zoomPosition, setzoomPosition] = useState(false);

  // Pour télécharger la table récapitulatif en excel
  const [downloadExelPDF, setdownloadExelPDF] = useState(false);
  useEffect(() => {
    console.log("downloadExelPDF :", downloadExelPDF);
  }, [downloadExelPDF]);

  // Pour donnee un signale de téléchargement
  const fonctiondownloadExelPDF = () => {
    setdownloadExelPDF(true);
    // Vérifier après un délai si l'action a échoué
    setTimeout(() => {
      setdownloadExelPDF(false);
    }, 2000); // Délai d'attente de 3 secondes
  };

  // Référence de la carte
  const mapRef = useRef();

  const [showOptions, setShowOptions] = useState(false);

  const [pageSection, setpageSection] = useState("unite");

  const handleClick = (véhicule) => {
    const deviceID = véhicule?.deviceID;

    console.error("Véhicule introuvable avec le deviceID :", deviceID);
    setpageSection("unite");
    setPersonnelDetails(true);
    window.scrollTo({
      top: 0,
      behavior: "auto", // Défilement fluide
      // behavior: "smooth", // Défilement fluide
    });
    const forCurrentDevice = true;
    console.log("xxxxxxxxxxxxxx", deviceID, TimeFrom, TimeTo);

    if (isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        deviceID,

        TimeFrom,

        TimeTo,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
    } else {
      fetchHistoriqueVehicleDetails(deviceID, TimeFrom, TimeTo);
    }

    setShowOptions(false);
    // ,,,,,,,,,,,    // }
  };

  useEffect(() => {
    if (!currentVéhicule) {
      chooseFirstVéhicule();
    }
    setTimeout(() => {
      if (!vehiclesByDepartureTime || !Array.isArray(vehiclesByDepartureTime)) {
        console.error(
          "vehiclesByDepartureTime est undefined ou n'est pas un tableau !"
        );
      } else {
        const deviceID = currentVéhicule?.deviceID || "";
        const foundPersonelVehicle = vehiclesByDepartureTime?.find(
          (v) => v.deviceID === deviceID
        );

        if (foundPersonelVehicle) {
          setCurrentPersonelVéhicule(foundPersonelVehicle);
        } else {
          console.error("Véhicule introuvable avec le deviceID :", deviceID);
        }
      }
    }, 2000);
  }, [searchDonneeFusionnéForRapport]);

  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Section carte, pour afficher le trajet du véhicule

  const [mapType, setMapType] = useState("streets");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [personnelDetails, setPersonnelDetails] = useState(true);

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

  const tileLayers = {
    terrain: {
      url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    },

    satelite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },

    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
    },

    humanitarian: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://hot.openstreetmap.org">Humanitarian OpenStreetMap Team</a>',
    },
    positron: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.carto.com/attributions">CARTO</a>',
    },
  };

  const getMarkerIcon = (véhicule) => {
    const speed = parseFloat(véhicule.speedKPH);
    const direction = Math.round(véhicule.heading / 45.0) % 8;

    if (speed <= 0) return "/pin/ping_red.png";
    else if (speed > 0 && speed <= 20)
      return `/pin/ping_yellow_h${direction}.png`;
    else return `/pin/ping_green_h${direction}.png`;
  };

  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // Ouvrir dans un nouvel onglet
  };

  //
  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  // Récupérer les positions successives pour les lignes rouges
  const positions = vehicles?.map((véhicule) => [
    véhicule.lastValidLatitude,
    véhicule.lastValidLongitude,
  ]);

  // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarker = () => {
    if (mapRef.current && vehicles.length > 0) {
      const { lastValidLatitude, lastValidLongitude } = vehicles[0];
      mapRef.current.setView([lastValidLatitude, lastValidLongitude], 15);
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
  //
  x;

  // Graphe des vitesse
  const data = filteredVehicles.reverse() || [];

  // const speedData = data.map((véhicule) => parseFloat(véhicule.speedKPH));
  const speedData = data.map((véhicule) => {
    const speed = parseFloat(véhicule.speedKPH);
    return !isNaN(speed) ? speed.toFixed(0) : null;
  });
  const timeData = data.map(
    (véhicule) => FormatDateHeure(véhicule.timestamp)?.time
  );

  const options = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        // La première entrée contient les informations de l'axe X (temps)
        const time = params[0].axisValue;
        const details = params
          .map((item) => {
            return `${item.marker} ${item.seriesName}: ${item.value} km/h`;
          })
          .join("<br />");
        return `Heure: ${time}<br />${details}`;
      },
    },

    xAxis: {
      type: "category",
      data: timeData, // Heure sur l'axe des X
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      name: "Vitesse (km/h)",
    },
    series: [
      {
        name: "Vitesse",
        data: speedData, // Vitesses sur l'axe des Y
        type: "line",
        smooth: true,
        lineStyle: {
          color: "rgba(75, 192, 192, 0.8)",
        },
      },
    ],
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
  // section pour trouver l'heure du debut et l'heure de la fin dur parcoure du véhicule

  const filteredList = currentVéhicule?.véhiculeDetails?.filter(
    (item) => parseFloat(item.speedKPH) > 0
  );

  // heure de fin
  const heureActiveDebut = filteredList?.reduce((minItem, currentItem) => {
    return parseInt(currentItem.timestamp) < parseInt(minItem.timestamp)
      ? currentItem
      : minItem;
  }, filteredList[0]);
  // Heure d'arrive
  const heureActiveFin = filteredList?.reduce((maxItem, currentItem) => {
    return parseInt(currentItem.timestamp) > parseInt(maxItem.timestamp)
      ? currentItem
      : maxItem;
  }, filteredList[0]);

  //
  //
  //
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
  // section pour calculer la distance totale parcourrue par le véhicule

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
  }

  function calculateTotalDistance(dataList) {
    let totalDistance = 0;

    for (let i = 1; i < dataList?.length; i++) {
      const prevPoint = dataList[i - 1];
      const currPoint = dataList[i];

      const distance = calculateDistance(
        parseFloat(prevPoint?.latitude),
        parseFloat(prevPoint?.longitude),
        parseFloat(currPoint?.latitude),
        parseFloat(currPoint?.longitude)
      );

      totalDistance += distance;
    }

    return totalDistance; // Distance totale en kilomètres
  }

  //
  //
  //
  //
  //
  //
  //
  //
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

  // Fonction pour compter les arrêts totale du véhicule

  const countStops = (vehiculedetails) => {
    let stopCount = 0;
    for (let i = 1; i < vehiculedetails?.length; i++) {
      const prevSpeed = parseFloat(vehiculedetails[i - 1].speedKPH);
      const currSpeed = parseFloat(vehiculedetails[i].speedKPH);
      // Compte comme arrêt si le véhicule passe de >= 1 à 0
      if (prevSpeed >= 1 && currSpeed === 0) {
        stopCount++;
      }
    }
    return stopCount;
  };

  // Calculer le nombre d'arrêts
  const nombreArret = countStops(currentVéhicule?.véhiculeDetails);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  // calcule de la vitesse ninimal, maximal et moyenne du véhicule
  function calculateSpeedStats(dataList) {
    // Filtre pour ne garder que les vitesses supérieures à 0
    const speeds = dataList
      ?.map((item) => parseFloat(item.speedKPH))
      .filter((speed) => speed > 0);

    let minSpeed;
    let maxSpeed;

    if (speeds?.length === 0) {
      return {
        minSpeed: 0,
        maxSpeed: 0,
        averageSpeed: 0,
      };
    }

    if (speeds) {
      // Calcul de la vitesse minimale, maximale et moyenne
      minSpeed = Math.min(...speeds);
      maxSpeed = Math.max(...speeds);
    }
    const averageSpeed =
      speeds?.reduce((sum, speed) => sum + speed, 0) / speeds?.length;

    return {
      minSpeed,
      maxSpeed,
      averageSpeed,
    };
  }

  const { minSpeed, maxSpeed, averageSpeed } = calculateSpeedStats(
    currentVéhicule?.véhiculeDetails
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
  //
  x;

  // calcule de la duree total en mouvement, duree total en arret et le plus longue arret

  function filterVehicleData(data) {
    // Trouver l'indice du premier objet avec speedKPH >= 1
    const firstValidIndex = data?.findIndex(
      (obj) => parseFloat(obj.speedKPH) >= 1
    );

    // Trouver l'indice du dernier objet avec speedKPH >= 1
    const lastValidIndex = data?.findLastIndex(
      (obj) => parseFloat(obj.speedKPH) >= 1
    );

    // Filtrer les données en excluant les objets avec speedKPH <= 0 avant le premier objet validé
    // et après le dernier objet validé
    return data?.filter((obj, index) => {
      const speedKPH = parseFloat(obj.speedKPH);
      if (index < firstValidIndex) {
        return speedKPH > 0; // Exclure les objets avant le premier valide avec speedKPH <= 0
      } else if (index > lastValidIndex) {
        return speedKPH > 0; // Exclure les objets après le dernier valide avec speedKPH <= 0
      }
      return true; // Inclure les objets dans la plage valide
    });
  }

  // Appliquer la fonction de filtrage
  const filteredData = filterVehicleData(currentVéhicule?.véhiculeDetails);

  const [longestHours, setLongestHours] = useState(0);
  const [longestMinutes, setLongestMinutes] = useState(0);
  const [longestSeconds, setLongestSeconds] = useState(0);
  const [totalStopHours, setTotalStopHours] = useState(0);
  const [totalStopMinutes, setTotalStopMinutes] = useState(0);
  const [totalStopSeconds, setTotalStopSeconds] = useState(0);
  const [totalMovingHours, setTotalMovingHours] = useState(0);
  const [totalMovingMinutes, setTotalMovingMinutes] = useState(0);
  const [totalMovingSeconds, setTotalMovingSeconds] = useState(0);

  const [longestDuration, setLongestDuration] = useState(0);

  let stopSequences = [];

  useEffect(() => {
    // Fonction pour calculer la durée des arrêts et des déplacements
    function countStopsAndShowData(data) {
      let longestDuration = 0; // Variable pour suivre la durée la plus longue
      let totalStopDuration = 0; // Variable pour suivre la durée totale de tous les arrêts
      let totalMovingDuration = 0; // Variable pour suivre la durée totale en mouvement

      let inStopSequence = false;

      // Parcours des données
      for (let i = 0; i < data?.length; i++) {
        const speedKPH = parseFloat(data[i].speedKPH);

        if (speedKPH <= 0) {
          if (!inStopSequence) {
            // Si on entre dans une séquence d'arrêt (speedKPH <= 0)
            inStopSequence = true;
            stopSequences.push([data[i]]); // Démarrer une nouvelle séquence d'arrêt
          } else {
            // Si on est déjà dans une séquence d'arrêt, ajouter l'objet à la séquence en cours
            stopSequences[stopSequences.length - 1].push(data[i]);
          }
        } else if (speedKPH >= 1 && inStopSequence) {
          // Quand on trouve un objet avec speedKPH >= 1 après une séquence d'arrêt
          inStopSequence = false; // Terminer la séquence d'arrêt
        }

        // Calculer la durée des déplacements
        if (speedKPH > 0) {
          const currentTimestamp = parseInt(data[i].timestamp) * 1000; // Convertir en millisecondes
          if (i > 0) {
            const prevTimestamp = parseInt(data[i - 1].timestamp) * 1000; // Convertir en millisecondes
            totalMovingDuration += Math.abs(currentTimestamp - prevTimestamp); // Ajouter à la durée totale en mouvement
          }
        }
      }

      // Calculer la durée entre le premier et le dernier objet de chaque séquence d'arrêt
      stopSequences.forEach((sequence) => {
        const firstTimestamp = sequence[0].timestamp;
        const lastTimestamp = sequence[sequence.length - 1].timestamp;

        const firstMillis = parseInt(firstTimestamp) * 1000; // Convertir en millisecondes
        const lastMillis = parseInt(lastTimestamp) * 1000; // Convertir en millisecondes

        const differenceInMillis = Math.abs(lastMillis - firstMillis);
        totalStopDuration += differenceInMillis; // Ajouter la durée à la durée totale

        // Mettre à jour la durée la plus longue
        if (differenceInMillis > longestDuration) {
          longestDuration = differenceInMillis;
          setLongestDuration(longestDuration);
        }
      });

      // Convertir la durée la plus longue en heures, minutes et secondes
      const longestStopHours = Math.floor(longestDuration / (1000 * 60 * 60));
      const longestStopMinutes = Math.floor(
        (longestDuration % (1000 * 60 * 60)) / (1000 * 60)
      );
      const longestStopSeconds = Math.floor(
        (longestDuration % (1000 * 60)) / 1000
      );

      // Convertir la durée totale d'arrêt en heures, minutes et secondes
      const stopHours = Math.floor(totalStopDuration / (1000 * 60 * 60));
      const stopMinutes = Math.floor(
        (totalStopDuration % (1000 * 60 * 60)) / (1000 * 60)
      );
      const stopSeconds = Math.floor((totalStopDuration % (1000 * 60)) / 1000);

      // Convertir la durée totale en mouvement en heures, minutes et secondes
      const movingHours = Math.floor(totalMovingDuration / (1000 * 60 * 60));
      const movingMinutes = Math.floor(
        (totalMovingDuration % (1000 * 60 * 60)) / (1000 * 60)
      );
      const movingSeconds = Math.floor(
        (totalMovingDuration % (1000 * 60)) / 1000
      );

      // Mettre à jour l'état avec la durée la plus longue d'arrêt
      setLongestHours(longestStopHours);
      setLongestMinutes(longestStopMinutes);
      setLongestSeconds(longestStopSeconds);

      // Mettre à jour l'état avec la durée totale d'arrêt
      setTotalStopHours(stopHours);
      setTotalStopMinutes(stopMinutes);
      setTotalStopSeconds(stopSeconds);

      // Mettre à jour l'état avec la durée totale en mouvement
      setTotalMovingHours(movingHours);
      setTotalMovingMinutes(movingMinutes);
      setTotalMovingSeconds(movingSeconds);
    }

    // Appeler la fonction avec les données du véhicule
    countStopsAndShowData(filteredData);
  }, [filteredData, currentVéhicule]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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

  // Tous les lieux fréquentes par le véhicules
  function getUniqueAddresses(dataList) {
    // Vérifier si dataList est défini
    if (!dataList) return [];

    // Utiliser un Map pour conserver les informations uniques par adresse
    const uniqueMap = new Map();

    dataList.forEach((item, index) => {
      const address = item.backupAddress || item.address;
      if (address && !uniqueMap.has(address)) {
        uniqueMap.set(address, {
          address,
          speedKPH: item.speedKPH || 0, // Ajouter la vitesse (0 par défaut si manquante)
          timestamp: item.timestamp || 0, // Ajouter le timestamp (0 par défaut si manquant)
          addressIndex: index,
        });
      }
    });

    // Retourner un tableau des valeurs uniques
    return Array.from(uniqueMap.values());
  }

  // const uniqueAddresses = currentVéhicule?.véhiculeDetails;
  const uniqueAddresses = getUniqueAddresses(currentVéhicule?.véhiculeDetails);

  //
  //
  //
  //
  //
  //
  //
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
  // Pour trouver tous les lieux en stationnent
  function getUniqueAddressesWhenSpeedZeroOrLess(dataList) {
    // Vérifier si dataList est défini
    if (!dataList) return [];

    // Utiliser un Map pour conserver les informations uniques par adresse avec vitesse <= 0
    const uniqueMap = new Map();

    dataList.forEach((item) => {
      const address = item.backupAddress || item.address;
      if (
        address &&
        !uniqueMap.has(address) &&
        parseFloat(item.speedKPH || 0) <= 0 // Vérifier si la vitesse est <= 0
      ) {
        uniqueMap.set(address, {
          address,
          speedKPH: item.speedKPH || 0, // Ajouter la vitesse (0 par défaut si manquante)
          timestamp: item.timestamp || 0, // Ajouter le timestamp (0 par défaut si manquant)
        });
      }
    });

    // Retourner un tableau des valeurs uniques
    return Array.from(uniqueMap.values());
  }

  const uniqueAddressesZerroSpeed = getUniqueAddressesWhenSpeedZeroOrLess(
    currentVéhicule?.véhiculeDetails
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
  //
  //
  x;

  // Variables pour choisir les dates
  const [showChooseDate, setShowChooseDate] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  const today = new Date(); // La date actuelle
  const [selectedDate, setSelectedDate] = useState(today); // Date sélectionnée

  // Formatage de la date actuelle
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("00:00"); // Heure de début fixée à minuit
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState(getCurrentTime());

  const [startDateToDisplay, setStartDateToDisplay] = useState(startDate);
  const [startTimeToDisplay, setStartTimeToDisplay] = useState(startTime); // Heure de début fixée à minuit
  const [endDateToDisplay, setEndDateToDisplay] = useState(endDate);
  const [endTimeToDisplay, setEndTimeToDisplay] = useState(endTime);

  useEffect(() => {
    console.log(startDateToDisplay);
    console.log(startTimeToDisplay);
    console.log(endTimeToDisplay);
    console.log(endTimeToDisplay);
  }, [
    startTimeToDisplay,
    startDateToDisplay,
    endDateToDisplay,
    endTimeToDisplay,
  ]);
  //
  //
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

  // Pour lancer une recherche pour une journée
  const handleApply = (e) => {
    e.preventDefault();
    setShowChooseDate(false);
    setShowDatePicker2(false);

    if (pageSection === "groupe") {
      setDonneeFusionnéForRapport([]);
      setRapportVehicleDetails([]);
      setIsSearchingFromRapportGroupePage(true);
    }

    const formatDateToISO = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Convertir en objet Date si nécessaire
      }
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return adjustedDate.toISOString().split("T")[0];
    };

    // Conversion des variables startDate et endDate
    const formattedStartDate = formatDateToISO(selectedDate);
    const formattedEndDate = formatDateToISO(selectedDate);

    const startTime = "00:00:00";
    const endTime = "23:59:59";

    // Combine les dates formatées avec les heures
    const baseTimeFrom = new Date(`${formattedStartDate}T${startTime}`);
    const baseTimeTo = new Date(`${formattedEndDate}T${endTime}`);

    // Ajout de l'ajustement UTC
    const adjustedTimeFrom = baseTimeFrom;

    const adjustedTimeTo = baseTimeTo;

    // Formatage en chaîne pour les heures ajustées
    const timeFrom = `${adjustedTimeFrom.getFullYear()}-${(
      adjustedTimeFrom.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeFrom
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeFrom
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const timeTo = `${adjustedTimeTo.getFullYear()}-${(
      adjustedTimeTo.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeTo
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeTo
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    //
    //
    //
    //
    //
    //
    if (pageSection === "unite" && isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentVéhicule?.deviceID || dataFusionné[0]?.deviceID,
        timeFrom,
        timeTo,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
    } else if (pageSection === "groupe" && isDashboardHomePage) {
      let accountID;
      let userID;
      let password;
      let onlyLastResult = false;

      if (isDashboardHomePage && currentAccountSelected) {
        accountID = currentAccountSelected?.accountID;
        userID = "admin";
        password = currentAccountSelected?.password;
      } else if (!isDashboardHomePage) {
        accountID = localStorage.getItem("account") || "";
        userID = localStorage.getItem("username") || "";
        password = localStorage.getItem("password") || "";
      }

      homePageReload(
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );

      console.log(
        "recherche avec les info: ",
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );
    } else if (pageSection === "unite" && !isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentVéhicule?.deviceID || dataFusionné[0]?.deviceID,
        timeFrom,
        timeTo
      );
    } else if (pageSection === "groupe" && !isDashboardHomePage) {
      let accountID;
      let userID;
      let password;
      let onlyLastResult = false;

      if (isDashboardHomePage && currentAccountSelected) {
        accountID = currentAccountSelected?.accountID;
        userID = "admin";
        password = currentAccountSelected?.password;
      } else if (!isDashboardHomePage) {
        accountID = localStorage.getItem("account") || "";
        userID = localStorage.getItem("username") || "";
        password = localStorage.getItem("password") || "";
      }
      homePageReload(
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );

      console.log(
        "recherche avec les info: ",
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );
    }

    //
    //
    //
    //
    //

    // setRapportDataLoading(true);

    console.log("TimeFrom---------", timeFrom);
    console.log("TimeTo------", timeTo);

    setStartDateToDisplay(selectedDate);
    setStartTimeToDisplay(startTime);
    setEndDateToDisplay(selectedDate);
    setEndTimeToDisplay(endTime);
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
  x;

  // Pour lancer une recherche plus en détaille
  const handleApply2 = (e) => {
    e.preventDefault();

    if (pageSection === "groupe") {
      setDonneeFusionnéForRapport([]);
      setRapportVehicleDetails([]);
      setIsSearchingFromRapportGroupePage(true);
    }

    const formatDateToISO = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Convertir en objet Date si nécessaire
      }
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return adjustedDate.toISOString().split("T")[0];
    };

    // Conversion des variables startDate et endDate
    const formattedStartDate = formatDateToISO(startDate);
    const formattedEndDate = formatDateToISO(endDate);

    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Combine les dates formatées avec les heures
    const baseTimeFrom = new Date(`${formattedStartDate}T${startTime}:00`);
    const baseTimeTo = new Date(`${formattedEndDate}T${endTime}:00`);

    // Ajout de 5 heures
    const adjustedTimeFrom = baseTimeFrom;
    const adjustedTimeTo = baseTimeTo;

    // Formatage en chaîne pour les heures ajustées
    const timeFrom = `${adjustedTimeFrom.getFullYear()}-${(
      adjustedTimeFrom.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeFrom
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeFrom
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const timeTo = `${adjustedTimeTo.getFullYear()}-${(
      adjustedTimeTo.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeTo
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeTo
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    // handleDateChange(timeFrom, timeTo);
    if (pageSection === "unite" && isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentVéhicule?.deviceID || dataFusionné[0]?.deviceID,
        timeFrom,
        timeTo,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
    } else if (pageSection === "groupe" && isDashboardHomePage) {
      let accountID;
      let userID;
      let password;
      let onlyLastResult = false;

      if (isDashboardHomePage && currentAccountSelected) {
        accountID = currentAccountSelected?.accountID;
        userID = "admin";
        password = currentAccountSelected?.password;
      } else if (!isDashboardHomePage) {
        accountID = localStorage.getItem("account") || "";
        userID = localStorage.getItem("username") || "";
        password = localStorage.getItem("password") || "";
      }
      homePageReload(
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );

      console.log(
        "recherche avec les info: ",
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );
    } else if (pageSection === "unite" && !isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentVéhicule?.deviceID || dataFusionné[0]?.deviceID,
        timeFrom,
        timeTo
      );
    } else if (pageSection === "groupe" && !isDashboardHomePage) {
      let accountID;
      let userID;
      let password;
      let onlyLastResult = false;

      if (isDashboardHomePage && currentAccountSelected) {
        accountID = currentAccountSelected?.accountID;
        userID = "admin";
        password = currentAccountSelected?.password;
      } else if (!isDashboardHomePage) {
        accountID = localStorage.getItem("account") || "";
        userID = localStorage.getItem("username") || "";
        password = localStorage.getItem("password") || "";
      }
      homePageReload(
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );

      console.log(
        "recherche avec les info: ",
        accountID,
        userID,
        password,
        onlyLastResult,
        timeFrom,
        timeTo
      );
    }

    setShowDatePicker2(false);
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
  x;

  useEffect(() => {
    console.log("rapportDataLoading >>>>>>>>>>>>.", rapportDataLoading);
  }, [rapportDataLoading]);

  //
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
    <div
      className={`${
        pageSection === "search" ? "pt-20" : " pt-40 "
      } flex flex-col max-w-screen bg-white rounded-lg   min-h-[100vh]  overflow-hidden justify-center-- items-center pb-20 `}
    >
      {/* {pageSection === "unite" && ( */}
      <div>
        <DatePupup
          showChooseDate={showChooseDate}
          pageSection={pageSection}
          handleApply={handleApply}
          setShowChooseDate={setShowChooseDate}
          setShowDatePicker2={setShowDatePicker2}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      {/* )} */}

      {loadingHistoriqueFilter && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-black/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {showDatePicker2 && (
        <div className="absolute z-[999999999999999999909999999]">
          <DateTimePicker
            setShowDatePicker={setShowDatePicker2}
            fetchHistoriqueVehicleDetails={fetchSearchRapportVehicleDetails}
            handleApply={handleApply2}
            setStartDate={setStartDate}
            setStartTime={setStartTime}
            setEndDate={setEndDate}
            setEndTime={setEndTime}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
          />
        </div>
      )}

      {rapportDataLoading && pageSection === "unite" && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      <div className=" px-4 bg-white py-3 dark:bg-gray-800">
        <div className=" absolute sm:px-[10vw] z-1 bg-white dark:bg-gray-800  top-[1rem] rounded-lg  left-4 right-4 ">
          {/* {pageSection != "search--" && ( */}
          <div className="max-w-[60rem]-- mx-auto--">
            {/* {totalDevice?.length < 400 && ( */}
            <RapportPageDetailsOptions
              setPersonnelDetails={setPersonnelDetails}
              personnelDetails={personnelDetails}
              setShowListOption={setShowListOption}
              setVéhiculeHistoriqueDetails={setVéhiculeHistoriqueDetails}
              currentVéhicule={currentVéhicule}
              pageSection={pageSection}
              setpageSection={setpageSection}
              setShowOptions={setShowOptions}
              setSelectedVehicleToShowInMap={setSelectedVehicleToShowInMap}
            />
            {/* )} */}
            <RapportPageDetailsHeader
              setShowOptions={setShowOptions}
              showOptions={showOptions}
              currentVéhicule={currentVéhicule}
              setPersonnelDetails={setPersonnelDetails}
              véhiculeActiveToday={véhiculeActiveToday}
              handleClick={handleClick}
              véhiculeNotActiveToday={véhiculeNotActiveToday}
              véhiculeHorsService={véhiculeHorsService}
              personnelDetails={personnelDetails}
              pageSection={pageSection}
              setpageSection={setpageSection}
              setShowChooseDate={setShowChooseDate}
              startDate={startDateToDisplay}
              startTime={startTimeToDisplay}
              endDate={endDateToDisplay}
              endTime={endTimeToDisplay}
              fonctiondownloadExelPDF={fonctiondownloadExelPDF}
              totalDevice={totalDevice}
            />
          </div>
          {/* )} */}
        </div>
      </div>

      {/* Personnelle */}
      {pageSection === "unite" && (
        <RapportPersonnel
          currentVéhicule={currentVéhicule}
          heureActiveDebut={heureActiveDebut}
          heureActiveFin={heureActiveFin}
          selectUTC={selectUTC}
          totalMovingHours={totalMovingHours}
          totalMovingMinutes={totalMovingMinutes}
          totalMovingSeconds={totalMovingSeconds}
          totalStopHours={totalStopHours}
          totalStopMinutes={totalStopMinutes}
          totalStopSeconds={totalStopSeconds}
          longestHours={longestHours}
          longestMinutes={longestMinutes}
          longestSeconds={longestSeconds}
          calculateTotalDistance={calculateTotalDistance}
          nombreArret={nombreArret}
          minSpeed={minSpeed}
          averageSpeed={averageSpeed}
          maxSpeed={maxSpeed}
          zoomCart={zoomCart}
          setzoomCart={setzoomCart}
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
          vehicles={vehicles}
          mapRef={mapRef}
          tileLayers={tileLayers}
          getMarkerIcon={getMarkerIcon}
          currentLocation={currentLocation}
          positions={positions}
          centerOnFirstMarker={centerOnFirstMarker}
          showHistoriqueInMap={showHistoriqueInMap}
          openGoogleMaps={openGoogleMaps}
          options={options}
          uniqueAddresses={uniqueAddresses}
          uniqueAddressesZerroSpeed={uniqueAddressesZerroSpeed}
          setShowOptions={setShowOptions}
          startDate={startDateToDisplay}
          startTime={startTimeToDisplay}
          endDate={endDateToDisplay}
          endTime={endTimeToDisplay}
          downloadExelPDF={downloadExelPDF}
          longestDuration={longestDuration}
        />
      )}

      {/* ////////////////////////////////////////////////////////////////////////////////////// */}
      {/* en groupe */}

      {pageSection === "groupe" && totalDevice?.length > 50 && (
        <div>
          <h2 className="font-bold mx-4 text-center mt-10 text-lg">
            {t("Ce compte comprend plus de 50 appareils")}...
          </h2>
          <br />
          <p className="text-orange-700-- text-center text-lg">
            <span className="text-orange-600">
              {t(
                "Il n’est pas possible de fournir un rapport global pour tous"
              )}
            </span>
            <br />
            {/* Nous vous remercions de votre compréhension. */}
          </p>
        </div>
      )}

      {pageSection === "groupe" && totalDevice?.length <= 50 && (
        <RapportGroupe
          currentDataFusionné={currentDataFusionné}
          véhiculeActiveToday={véhiculeActiveToday}
          véhiculeNotActiveToday={véhiculeNotActiveToday}
          véhiculeHorsService={véhiculeHorsService}
          selectUTC={selectUTC}
          zoomPosition={zoomPosition}
          setzoomPosition={setzoomPosition}
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
          vehicles={vehicles}
          mapRef={mapRef}
          tileLayers={tileLayers}
          getMarkerIcon={getMarkerIcon}
          currentLocation={currentLocation}
          positions={positions}
          centerOnFirstMarker={centerOnFirstMarker}
          showHistoriqueInMap={showHistoriqueInMap}
          openGoogleMaps={openGoogleMaps}
          setpageSection={setpageSection}
          setSelectedVehicleToShowInMap={setSelectedVehicleToShowInMap}
          startDate={startDateToDisplay}
          startTime={startTimeToDisplay}
          endDate={endDateToDisplay}
          endTime={endTimeToDisplay}
          downloadExelPDF={downloadExelPDF}
        />
      )}
    </div>
  );
}

export default RapportPageDetails;
