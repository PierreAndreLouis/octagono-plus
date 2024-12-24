import React, { useContext, useEffect, useRef, useState } from "react";

import { Chart, registerables } from "chart.js";

// Enregistrement des composants nécessaires
Chart.register(...registerables);

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import { DataContext } from "../context/DataContext";

import Liste_options from "../components/home/Liste_options";
import RapportPageDetailsHeader from "../components/rapport_page_details/RapportPageDetailsHeader";
import RapportGroupe from "../components/rapport_page_details/RapportGroupe";
import RapportPageDetailsOptions from "../components/rapport_page_details/RapportPageDetailsOptions";
import RapportPersonnel from "../components/rapport_page_details/RapportPersonnel";
import RapportPage from "./RapportPage";
import DatePupup from "../components/rapport_vehicule/DatePupup";
import DateTimePicker from "../components/home/DateTimePicker";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function RapportPageDetails() {
  const [typeDeVue, setTypeDeVue] = useState(false);
  const [zoomCart, setzoomCart] = useState(false);
  const [zoomPosition, setzoomPosition] = useState(false);

  const {
    currentVehicule,

    vehiclueHistoriqueDetails,
    vehiclueHistoriqueRapportDetails,
    showHistoriqueInMap,
    selectUTC,
    donneeFusionneeForRapport,
    vehiculeActiveAjourdhui,
    vehiculeNotActiveAjourdhui,
    vehiculeNotActif,
    currentdataFusionnee,
    searchdonneeFusionneeForRapport,
    showListeOption,
    setShowListOption,
    setCurrentVehicule,
    setVehiclueHistoriqueDetails,
    rapportDataLoading,
    fetSearchRapportchVehicleDetails,
    setRapportDataLoading,
    mergedData,
  } = useContext(DataContext);

  const dataFusionee = mergedData ? Object.values(mergedData) : [];

  const mapRef = useRef(); // Référence de la carte

  const [showOptions, setShowOptions] = useState(false);

  const [pageSection, setpageSection] = useState("unite");

  const handleClick = (vehicle) => {
    // setCurrentVehicule(vehicle);

    const deviceID = vehicle.deviceID;

    // // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel
      setPersonnelDetails(true);
      setVehiclueHistoriqueDetails(foundVehicle.vehiculeDetails);
      setpageSection("unite");
      window.scrollTo({
        top: 0,
        behavior: "auto", // Défilement fluide
        // behavior: "smooth", // Défilement fluide
      });
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
      setPersonnelDetails(true);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Section carte, pour afficher le trajet du vehicule

  const [mapType, setMapType] = useState("streets");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [personnelDetails, setPersonnelDetails] = useState(true);

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

  const tileLayers = {
    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.carto.com/attributions">CARTO</a>',
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

  const getMarkerIcon = (vehicule) => {
    const speed = parseFloat(vehicule.speedKPH);
    const direction = Math.round(vehicule.heading / 45.0) % 8;

    if (speed <= 0) return "/pin/ping_red.png";
    else if (speed > 0 && speed <= 20)
      return `/pin/ping_yellow_h${direction}.png`;
    else return `/pin/ping_green_h${direction}.png`;
  };

  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // Ouvrir dans un nouvel onglet
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  // Récupérer les positions successives pour les lignes rouges
  const positions = vehicles?.map((vehicle) => [
    vehicle.lastValidLatitude,
    vehicle.lastValidLongitude,
  ]);

  // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarker = () => {
    if (mapRef.current && vehicles.length > 0) {
      const { lastValidLatitude, lastValidLongitude } = vehicles[0];
      mapRef.current.setView([lastValidLatitude, lastValidLongitude], 15);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // section du diagrame de vitesse
  useEffect(() => {
    const canvas = document.getElementById("myChart");
    if (!canvas) {
      console.error("L'élément canvas avec l'ID 'myChart' n'existe pas.");
      return;
    }

    // Vérifiez si un graphique existe déjà, et détruisez-le
    const existingChart = Chart.getChart("myChart"); // Récupérer le graphique existant par ID
    if (existingChart) {
      existingChart.destroy(); // Détruire le graphique existant
    }
    const ctx = canvas.getContext("2d");

    // Exemple de données
    const data = filteredVehicles;

    const timestamps = data?.map((item) =>
      new Date(item.timestamp * 1000).toLocaleTimeString()
    );
    const speeds = data?.map((item) => parseFloat(item.speedKPH));

    // Créer un nouveau graphique
    new Chart(ctx, {
      type: "line", // Type de graphique
      // type: "polarArea", // Type de graphique
      // type: "radar", // Type de graphique
      // type: "bar", // Type de graphique
      fill: true, // Ajoutez cette propriété pour un graphique en aires

      data: {
        labels: timestamps, // Échelle X
        datasets: [
          {
            label: "Vitesse (km/h)",
            data: speeds,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: {
            type: "category", // Type de l'échelle X
            title: {
              display: true,
              text: "Heures",
            },
          },
          y: {
            title: {
              display: true,
              text: "Vitesse (km/h)",
            },
            ticks: {
              stepSize: 1, // Augmente l'écart entre les valeurs de l'axe Y
            },
          },
        },
      },
    });
  }, []); // Exécuter une seule fois au montage du composant

  const data = filteredVehicles || [];

  const timestamps = data.map((item) =>
    new Date(item.timestamp * 1000).toLocaleTimeString()
  );
  const speeds = data.map((item) => parseFloat(item.speedKPH));

  const options = {
    title: {
      // text: "Diagramme des vitesses",
      text: "",
      left: "center",
      textStyle: {
        fontSize: 16, // Taille de la police pour le titre
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: timestamps,
      name: "Heures",
      nameLocation: "middle",
      nameTextStyle: {
        fontSize: 14, // Taille du texte pour le nom
        padding: 20, // Espace autour du texte
      },
    },
    yAxis: {
      type: "value",
      name: "Vitesse (km/h)", // Nom de l'axe Y
      nameLocation: "middle", // Place le nom au milieu de l'axe
      nameTextStyle: {
        fontSize: 14, // Taille de la police pour le nom
        padding: 40, // Distance entre le texte et l'axe
      },
      axisLabel: {
        fontSize: 12, // Taille des étiquettes des graduations
      },
    },
    series: [
      {
        data: speeds,
        // type: "bar", // Type de graphique (ligne)
        type: "line", // Type de graphique (ligne)
        itemStyle: {
          color: "rgba(75, 192, 192, 0.8)", // Couleur des lignes ou barres
        },
        lineStyle: {
          width: 2, // Épaisseur de la ligne
        },
      },
    ],
  };

  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////

  // Trouver la date du rapport//  exemple  Résultat : Date : 23 novembre 2024
  const timestampInSeconds = currentVehicule?.vehiculeDetails[0]?.timestamp;
  const dateObject = new Date(timestampInSeconds * 1000);

  // Formater la date
  const formattedDate = dateObject.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // section pour trouver l'heure du debut et l'heure de la fin dur parcoure du vehicule

  // Fonctions pour formater le temps et la date
  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  function formatTimestampToTimeWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const filteredList = currentVehicule?.vehiculeDetails?.filter(
    (item) => parseFloat(item.speedKPH) > 0
  );

  // Trouve l'élément avec le timestamp minimum
  const heureActiveDebut = filteredList?.reduce((minItem, currentItem) => {
    return parseInt(currentItem.timestamp) < parseInt(minItem.timestamp)
      ? currentItem
      : minItem;
  }, filteredList[0]);

  const heureActiveFin = filteredList?.reduce((maxItem, currentItem) => {
    return parseInt(currentItem.timestamp) > parseInt(maxItem.timestamp)
      ? currentItem
      : maxItem;
  }, filteredList[0]);

  // function formatTimestampToTime(timestamp) {
  //   const date = new Date(timestamp * 1000);
  //   const hours = date.getUTCHours().toString().padStart(2, "0");
  //   const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  //   const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  //   return `${hours}:${minutes}:${seconds}`;
  // }

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes}  ${period}`;
    // return `${hours}:${minutes}:${seconds} ${period}`;
  }

  function calculateActivePeriodsForAllVehicles(vehicleData) {
    const results = [];

    vehicleData.forEach((vehicle) => {
      const { description, vehiculeDetails } = vehicle;

      const filteredList = vehiculeDetails?.filter(
        (item) => parseFloat(item.speedKPH) > 0
      );

      if (filteredList && filteredList.length > 0) {
        const startTimestamp = filteredList.reduce((minItem, currentItem) => {
          return parseInt(currentItem.timestamp) < parseInt(minItem.timestamp)
            ? currentItem
            : minItem;
        }, filteredList[0]);

        const endTimestamp = filteredList.reduce((maxItem, currentItem) => {
          return parseInt(currentItem.timestamp) > parseInt(maxItem.timestamp)
            ? currentItem
            : maxItem;
        }, filteredList[0]);

        results.push({
          description,
          startTime: formatTimestampToTime(parseInt(startTimestamp.timestamp)),
          endTime: formatTimestampToTime(parseInt(endTimestamp.timestamp)),
        });
      } else {
        results.push({
          description,
          startTime: null,
          endTime: null,
        });
      }
    });

    return results;
  }

  const activePeriods =
    calculateActivePeriodsForAllVehicles(currentdataFusionnee);

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // section pour calculer la distance totale parcourrue par le vehicule

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

  // Fonction pour calculer la distance totale pour tous les véhicules
  // Fonction pour calculer la distance totale pour tous les véhicules
  function calculateDistancesForAllVehicles(vehicles) {
    if (vehicles && vehicles.length > 0) {
      let distancesByVehicle = {}; // Stocker la distance totale pour chaque véhicule
      let totalDistanceAllVehicles = 0; // Stocker la distance totale pour tous les véhicules
      let maxDistance = 0; // Distance maximale parcourue
      let maxDistanceVehicle = ""; // Nom du véhicule ayant parcouru la plus grande distance

      vehicles.forEach((vehicle) => {
        const data = filterVehicleData(vehicle?.vehiculeDetails); // Appliquer le filtrage si nécessaire

        const totalDistance = calculateTotalDistance(data); // Calculer la distance pour ce véhicule
        distancesByVehicle[vehicle.description] = totalDistance; // Nom du véhicule + distance

        totalDistanceAllVehicles += totalDistance; // Ajouter la distance au total global

        // Vérifier si ce véhicule a la plus grande distance
        if (totalDistance > maxDistance) {
          maxDistance = totalDistance;
          maxDistanceVehicle = vehicle.description;
        }
      });

      return {
        distancesByVehicle, // Distance par véhicule
        totalDistanceAllVehicles, // Distance totale pour tous les véhicules
        maxDistanceVehicle, // Nom du véhicule ayant parcouru la plus grande distance
        maxDistance, // Distance la plus grande
      };
    }
  }

  // Exemple d'utilisation :
  const result2 = calculateDistancesForAllVehicles(currentdataFusionnee); // Remplacez "allVehicles" par votre liste

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // Fonction pour compter les arrêts totale du vehicule

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
  const nombreArret = countStops(currentVehicule?.vehiculeDetails);

  // Fonction pour calculer le nombre total d'arrêts pour tous les véhicules
  function countStopsForAllVehicles(vehicles) {
    if (vehicles && vehicles.length > 0) {
      let stopsByVehicle = {}; // Stocker le nombre d'arrêts pour chaque véhicule
      let totalStopsAllVehicles = 0; // Stocker le nombre total d'arrêts pour tous les véhicules

      vehicles.forEach((vehicle) => {
        const data = filterVehicleData(vehicle?.vehiculeDetails); // Appliquer le filtrage si nécessaire

        const stopCount = countStops(data); // Nombre d'arrêts pour ce véhicule
        stopsByVehicle[vehicle.description] = stopCount; // Nom du véhicule + nombre d'arrêts

        totalStopsAllVehicles += stopCount; // Ajouter le nombre d'arrêts au total global
      });

      return {
        stopsByVehicle, // Nombre d'arrêts par véhicule
        totalStopsAllVehicles, // Nombre total d'arrêts pour tous les véhicules
      };
    }
  }

  // Exemple d'utilisation :
  const result3 = countStopsForAllVehicles(currentdataFusionnee); // Remplacez "allVehicles" par votre liste

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // calcule de la vitesse ninimal, maximal et moyenne du vehicule

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
    currentVehicule?.vehiculeDetails
  );

  function calculateSpeedStatsForAllVehicles(vehicles) {
    if (vehicles && vehicles.length > 0) {
      let allSpeeds = []; // Stocker toutes les vitesses de tous les véhicules
      let statsByVehicle = {}; // Stocker les statistiques par véhicule
      let maxSpeedVehicle = { description: null, maxSpeed: 0 }; // Véhicule avec la vitesse maximale la plus élevée

      vehicles.forEach((vehicle) => {
        const data = vehicle?.vehiculeDetails || []; // Récupérer les détails du véhicule
        const stats = calculateSpeedStats(data); // Calculer les stats pour ce véhicule

        statsByVehicle[vehicle.description] = stats; // Ajouter les stats de ce véhicule

        // Vérifier si ce véhicule a la vitesse maximale la plus élevée
        if (stats.maxSpeed > maxSpeedVehicle.maxSpeed) {
          maxSpeedVehicle = {
            description: vehicle.description,
            maxSpeed: stats.maxSpeed,
          };
        }

        // Ajouter les vitesses du véhicule aux vitesses globales
        allSpeeds = [
          ...allSpeeds,
          ...data
            .map((item) => parseFloat(item.speedKPH))
            .filter((speed) => speed > 0),
        ];
      });

      // Calcul des statistiques globales pour tous les véhicules
      const globalStats = calculateGlobalSpeedStats(allSpeeds);

      return {
        statsByVehicle, // Statistiques par véhicule
        globalStats, // Statistiques globales
        maxSpeedVehicle, // Véhicule avec la vitesse maximale la plus élevée
      };
    }
  }

  // Fonction pour calculer les statistiques globales pour toutes les vitesses
  function calculateGlobalSpeedStats(allSpeeds) {
    if (allSpeeds.length === 0) {
      return {
        minSpeed: 0,
        maxSpeed: 0,
        averageSpeed: 0,
      };
    }

    const minSpeed = Math.min(...allSpeeds);
    const maxSpeed = Math.max(...allSpeeds);
    const averageSpeed =
      allSpeeds.reduce((sum, speed) => sum + speed, 0) / allSpeeds.length;

    return {
      minSpeed,
      maxSpeed,
      averageSpeed,
    };
  }

  // Exemple d'utilisation :
  const result5 = calculateSpeedStatsForAllVehicles(currentdataFusionnee); // Remplacez "allVehicles" par votre liste

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
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
  const filteredData = filterVehicleData(currentVehicule?.vehiculeDetails);

  const [longestHours, setLongestHours] = useState(0);
  const [longestMinutes, setLongestMinutes] = useState(0);
  const [longestSeconds, setLongestSeconds] = useState(0);
  const [totalStopHours, setTotalStopHours] = useState(0);
  const [totalStopMinutes, setTotalStopMinutes] = useState(0);
  const [totalStopSeconds, setTotalStopSeconds] = useState(0);
  const [totalMovingHours, setTotalMovingHours] = useState(0);
  const [totalMovingMinutes, setTotalMovingMinutes] = useState(0);
  const [totalMovingSeconds, setTotalMovingSeconds] = useState(0);

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
  }, [filteredData]);

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  function calculateTotalMovingTimePerVehicle(vehicleData) {
    // Initialiser un tableau pour stocker les résultats
    const results = [];

    vehicleData.forEach((vehicle) => {
      const { description, vehiculeDetails } = vehicle; // Nom et détails du véhicule
      let totalMovingDuration = 0; // Durée totale en mouvement pour ce véhicule

      vehiculeDetails.forEach((data, index) => {
        const speedKPH = parseFloat(data.speedKPH);
        if (speedKPH > 0 && index > 0) {
          const currentTimestamp = parseInt(data.timestamp) * 1000; // Convertir en millisecondes
          const prevTimestamp =
            parseInt(vehiculeDetails[index - 1].timestamp) * 1000; // Convertir en millisecondes

          totalMovingDuration += Math.abs(currentTimestamp - prevTimestamp); // Ajouter la durée en mouvement
        }
      });

      // Convertir la durée totale en heures, minutes et secondes
      const movingHours = Math.floor(totalMovingDuration / (1000 * 60 * 60));
      const movingMinutes = Math.floor(
        (totalMovingDuration % (1000 * 60 * 60)) / (1000 * 60)
      );
      const movingSeconds = Math.floor(
        (totalMovingDuration % (1000 * 60)) / 1000
      );

      // Ajouter le résultat pour ce véhicule
      results.push({
        description,
        totalMovingDuration: {
          hours: movingHours,
          minutes: movingMinutes,
          seconds: movingSeconds,
        },
      });
    });

    return results;
  }

  const movingTimes = calculateTotalMovingTimePerVehicle(currentdataFusionnee);

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // section pour savoir tous les lieux frequentes et stationnes

  // function getUniqueAddresses(dataList) {
  //   // Extraire toutes les adresses de la liste
  //   const addresses = dataList?.map(
  //     (item) => item.backupAddress || item.address
  //   );

  //   // Utiliser un Set pour éliminer les doublons
  //   const uniqueAddresses = [...new Set(addresses)];

  //   return uniqueAddresses;
  // }

  // const uniqueAddresses = getUniqueAddresses(currentVehicule?.vehiculeDetails);

  function getUniqueAddresses(dataList) {
    // Vérifier si dataList est défini
    if (!dataList) return [];

    // Utiliser un Map pour conserver les informations uniques par adresse
    const uniqueMap = new Map();

    dataList.forEach((item) => {
      const address = item.backupAddress || item.address;
      if (address && !uniqueMap.has(address)) {
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

  const uniqueAddresses = getUniqueAddresses(currentVehicule?.vehiculeDetails);
  // console.log("Unique addresssssssssss", uniqueAddresses);

  // function getUniqueAddressesWhenSpeedZeroOrLess(dataList) {
  //   // Filtrer les éléments où la vitesse est <= 0
  //   const filteredData = dataList?.filter(
  //     (item) => parseFloat(item.speedKPH) <= 0
  //   );

  //   // Extraire les adresses de ces éléments filtrés
  //   const addresses = filteredData?.map(
  //     (item) => item.backupAddress || item.address
  //   );

  //   // Utiliser un Set pour éliminer les doublons
  //   const uniqueAddresses = [...new Set(addresses)];

  //   return uniqueAddresses;
  // }

  // function getUniqueAddressesWhenSpeedZeroOrLess(dataList) {
  //   // Vérifier si dataList est défini
  //   if (!dataList) return [];

  //   // Utiliser un Map pour conserver les informations uniques par adresse
  //   const uniqueMap = new Map();

  //   // Filtrer les éléments où la vitesse est <= 0
  //   const filteredData = dataList.filter(
  //     (item) => parseFloat(item.speedKPH) <= 0
  //   );

  //   filteredData.forEach((item) => {
  //     const address = item.backupAddress || item.address;
  //     if (address && !uniqueMap.has(address)) {
  //       uniqueMap.set(address, {
  //         address,
  //         speedKPH: item.speedKPH || 0, // Ajouter la vitesse (0 par défaut si manquante)
  //         timestamp: item.timestamp || 0, // Ajouter le timestamp (0 par défaut si manquant)
  //       });
  //     }
  //   });

  //   // Retourner un tableau des valeurs uniques
  //   return Array.from(uniqueMap.values());
  // }

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
    currentVehicule?.vehiculeDetails
  );

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  //  section pour savoir le vehicule en mouvement en premier et en dernier

  function processVehicleData(vehicleData) {
    if (!vehicleData || vehicleData.length === 0) {
      return {
        filteredData: [],
        earliestVehicle: null,
        latestVehicle: null,
      };
    }

    // Filtrer les vehiculeDetails avec speedKPH >= 1
    const filteredData = vehicleData.map((vehicle) => ({
      ...vehicle,
      vehiculeDetails: vehicle.vehiculeDetails?.filter(
        (detail) => parseFloat(detail.speedKPH) >= 1
      ),
    }));

    // Trouver le véhicule avec le timestamp le plus tôt et le plus tard
    let earliestVehicle = null;
    let latestVehicle = null;
    let earliestTimestamp = Infinity;
    let latestTimestamp = -Infinity;

    filteredData.forEach((vehicle) => {
      const lastDetail =
        vehicle.vehiculeDetails?.[vehicle.vehiculeDetails?.length - 1];

      if (lastDetail) {
        const timestamp = parseInt(lastDetail.timestamp, 10);

        if (timestamp < earliestTimestamp) {
          earliestTimestamp = timestamp;
          earliestVehicle = vehicle;
        }

        if (timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
          latestVehicle = vehicle;
        }
      }
    });

    return {
      filteredData,
      earliestVehicle,
      latestVehicle,
    };
  }

  const data2 = currentdataFusionnee;

  const { filteredData2, earliestVehicle, latestVehicle } =
    processVehicleData(data2);

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  function calculateDurationsForAllVehicles(vehicles) {
    if (vehicles && vehicles.length > 0) {
      let totalMovingDuration = 0;
      let totalStopDuration = 0;
      let longestStopDuration = 0;
      let vehicleWithLongestStop = null;
      let longestMovingDuration = 0;
      let vehicleWithLongestMoving = null;

      vehicles.forEach((vehicle) => {
        const data = filterVehicleData(vehicle?.vehiculeDetails); // Appliquer le filtrage
        let stopSequences = [];
        let vehicleMovingDuration = 0;
        let vehicleStopDuration = 0;
        let vehicleLongestStop = 0;
        let inStopSequence = false;

        for (let i = 0; i < data?.length; i++) {
          const speedKPH = parseFloat(data[i].speedKPH);

          if (speedKPH <= 0) {
            if (!inStopSequence) {
              inStopSequence = true;
              stopSequences.push([data[i]]);
            } else {
              stopSequences[stopSequences.length - 1].push(data[i]);
            }
          } else if (speedKPH >= 1 && inStopSequence) {
            inStopSequence = false;
          }

          if (speedKPH > 0 && i > 0) {
            const currentTimestamp = parseInt(data[i].timestamp) * 1000;
            const prevTimestamp = parseInt(data[i - 1].timestamp) * 1000;
            vehicleMovingDuration += Math.abs(currentTimestamp - prevTimestamp);
          }
        }

        stopSequences.forEach((sequence) => {
          const firstTimestamp = sequence[0].timestamp;
          const lastTimestamp = sequence[sequence.length - 1].timestamp;

          const firstMillis = parseInt(firstTimestamp) * 1000;
          const lastMillis = parseInt(lastTimestamp) * 1000;
          const differenceInMillis = Math.abs(lastMillis - firstMillis);

          vehicleStopDuration += differenceInMillis;

          if (differenceInMillis > vehicleLongestStop) {
            vehicleLongestStop = differenceInMillis;
          }
        });

        // Ajouter les durées de ce véhicule aux totaux
        totalMovingDuration += vehicleMovingDuration;
        totalStopDuration += vehicleStopDuration;

        // Vérifier si ce véhicule a le plus long arrêt
        if (vehicleLongestStop > longestStopDuration) {
          longestStopDuration = vehicleLongestStop;
          vehicleWithLongestStop = vehicle.description; // Supposez que le nom du véhicule est dans `vehicle.description`
        }

        // Vérifier si ce véhicule a été en mouvement le plus longtemps
        if (vehicleMovingDuration > longestMovingDuration) {
          longestMovingDuration = vehicleMovingDuration;
          vehicleWithLongestMoving = vehicle.description;
        }
      });

      // Convertir les résultats finaux en heures, minutes et secondes
      const convertMillisToTime = (millis) => {
        const hours = Math.floor(millis / (1000 * 60 * 60));
        const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((millis % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
      };

      const totalMovingTime = convertMillisToTime(totalMovingDuration);
      const totalStopTime = convertMillisToTime(totalStopDuration);
      const longestStopTime = convertMillisToTime(longestStopDuration);
      const longestMovingTime = convertMillisToTime(longestMovingDuration);

      return {
        totalMovingTime,
        totalStopTime,
        longestStopTime,
        longestMovingTime,
        vehicleWithLongestStop, // Nom du véhicule avec le plus long arrêt
        vehicleWithLongestMoving, // Nom du véhicule ayant été en mouvement le plus longtemps
      };
    }
  }
  // Exemple d'utilisation :
  const result = calculateDurationsForAllVehicles(currentdataFusionnee); // Remplacez "allVehicles" par votre liste de véhicules

  const [showChooseDate, setShowChooseDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // Date sélectionnée

  // Gestion de la soumission
  const handleApply = (e) => {
    e.preventDefault();
    setShowChooseDate(false);
    setRapportDataLoading(true);
    setShowDatePicker2(false);
    console.log("okk");
    console.log("vehiculeDate", dataFusionee);
    // setpageSection("search");

    const startTime = "00:00:00";
    const endTime = "23:59:59";

    const timeFrom = `${selectedDate} ${startTime}`;
    const timeTo = `${selectedDate} ${endTime}`;

    if (dataFusionee && dataFusionee.length > 0) {
      dataFusionee?.forEach((vehicle) => {
        // console.log("Readyyyyyyyyyyyyyyyy");
        fetSearchRapportchVehicleDetails(vehicle.deviceID, timeFrom, timeTo);
      });
    }
  };

  // Formatage de la date actuelle
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  // Initialisation de la date et de l'heure actuelles par défaut
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState("00:00"); // Heure de début fixée à minuit
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [endTime, setEndTime] = useState(getCurrentTime());

  const handleApply2 = (e) => {
    console.log("Startt...................");
    e.preventDefault();
    const timeFrom = `${startDate} ${startTime}:00`;
    const timeTo = `${endDate} ${endTime}:00`;
    setShowDatePicker2(false);
    setRapportDataLoading(true);
    // setpageSection("search");

    console.log("Startt........222222222222...........");
    // handleDateChange(timeFrom, timeTo);
    if (dataFusionee && dataFusionee.length > 0) {
      dataFusionee.forEach((vehicle) => {
        console.log("Startt.......333333333333............");

        fetSearchRapportchVehicleDetails(vehicle.deviceID, timeFrom, timeTo);
      });
    }
    console.log("Startt..........444444444444.........");

    // fetSearchRapportchVehicleDetails(
    //   currentVehicule.deviceID,
    //   timeFrom,
    //   timeTo
    // );

    setShowDatePicker(false);
    // setLoadingHistoriqueFilter(true);
  };
  return (
    <div
      className={`${
        pageSection === "search" ? "pt-20" : " pt-44 "
      } flex flex-col max-w-screen min-h-[100vh]  overflow-hidden justify-center-- items-center pb-20 `}
    >
      <div>
        <DatePupup
          showChooseDate={showChooseDate}
          handleApply={handleApply}
          setShowChooseDate={setShowChooseDate}
          setShowDatePicker2={setShowDatePicker2}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {showDatePicker2 && (
        <div className="absolute z-[99999909999999]">
          <DateTimePicker
            setShowDatePicker={setShowDatePicker2}
            fetchHistoriqueVehicleDetails={fetSearchRapportchVehicleDetails}
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

      {rapportDataLoading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      <div className="fixed  px-4 z-[555555555] top-[3.4rem] left-0 right-0 bg-white py-3 dark:bg-gray-800">
        {showListeOption && <Liste_options />}

        <div className="fixed sm:px-[10vw] z-10 bg-white dark:bg-gray-800  top-[3rem] left-0 right-0">
          {/* Header */}
          {/* {pageSection != "search--" && ( */}
          <div className="max-w-[60rem]-- mx-auto">
            <RapportPageDetailsOptions
              setPersonnelDetails={setPersonnelDetails}
              personnelDetails={personnelDetails}
              setShowListOption={setShowListOption}
              setVehiclueHistoriqueDetails={setVehiclueHistoriqueDetails}
              currentVehicule={currentVehicule}
              formatTimestampToTimeWithTimezone={
                formatTimestampToTimeWithTimezone
              }
              formatTimestampToTime={formatTimestampToTime}
              pageSection={pageSection}
              setpageSection={setpageSection}
              setShowOptions={setShowOptions}
              showOptions={showOptions}
            />
            <RapportPageDetailsHeader
              setShowOptions={setShowOptions}
              showOptions={showOptions}
              currentVehicule={currentVehicule}
              setPersonnelDetails={setPersonnelDetails}
              vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
              handleClick={handleClick}
              vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
              vehiculeNotActif={vehiculeNotActif}
              personnelDetails={personnelDetails}
              formatTimestampToTimeWithTimezone={
                formatTimestampToTimeWithTimezone
              }
              formatTimestampToTime={formatTimestampToTime}
              pageSection={pageSection}
              setpageSection={setpageSection}
              setShowChooseDate={setShowChooseDate}
            />
          </div>
          {/* )} */}
        </div>
      </div>
      {/* <RapportPageDetailsOptions
        setPersonnelDetails={setPersonnelDetails}
        personnelDetails={personnelDetails}
        setShowListOption={setShowListOption}
        setVehiclueHistoriqueDetails={setVehiclueHistoriqueDetails}
        currentVehicule={currentVehicule}
        formatTimestampToTimeWithTimezone={formatTimestampToTimeWithTimezone}
        formatTimestampToTime={formatTimestampToTime}
        pageSection={pageSection}
        setpageSection={setpageSection}
      /> */}
      {/* categorie Personnelle , groupe, et options */}

      {/* Personnelle */}
      {pageSection === "unite" && (
        <RapportPersonnel
          currentVehicule={currentVehicule}
          formattedDate={formattedDate}
          heureActiveDebut={heureActiveDebut}
          heureActiveFin={heureActiveFin}
          selectUTC={selectUTC}
          formatTimestampToTimeWithTimezone={formatTimestampToTimeWithTimezone}
          formatTimestampToTime={formatTimestampToTime}
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
        />
      )}

      {/* ////////////////////////////////////////////////////////////////////////////////////// */}
      {/* en groupe */}
      {pageSection === "groupe" && (
        <RapportGroupe
          formattedDate={formattedDate}
          currentdataFusionnee={currentdataFusionnee}
          vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
          vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
          vehiculeNotActif={vehiculeNotActif}
          earliestVehicle={earliestVehicle}
          latestVehicle={latestVehicle}
          selectUTC={selectUTC}
          formatTimestampToTime={formatTimestampToTime}
          formatTimestampToTimeWithTimezone={formatTimestampToTimeWithTimezone}
          result={result}
          result2={result2}
          result3={result3}
          result5={result5}
          zoomPosition={zoomPosition}
          setzoomPosition={setzoomPosition}
          activePeriods={activePeriods}
          movingTimes={movingTimes}
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
          vehicles={vehicles}
          mapRef={mapRef}
          tileLayers={tileLayers}
          getMarkerIcon={getMarkerIcon}
          currentLocation={currentLocation}
          // customMarkerIcon={customMarkerIcon}
          positions={positions}
          centerOnFirstMarker={centerOnFirstMarker}
          showHistoriqueInMap={showHistoriqueInMap}
          openGoogleMaps={openGoogleMaps}
        />
      )}

      {pageSection === "search" && (
        <RapportPage
          setpageSection={setpageSection}
          showChooseDate={showChooseDate}
          setShowChooseDate={setShowChooseDate}
          handleApply={handleApply}
          showDatePicker2={showDatePicker2}
          setShowDatePicker2={setShowDatePicker2}
        />
      )}
    </div>
  );
}

export default RapportPageDetails;
