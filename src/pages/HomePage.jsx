// src/pages/Home.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import Statistics from "../components/home/Statistics";
import Liste from "../components/home/Liste";
import Liste_options from "../components/home/Liste_options";
import { DataContext } from "../context/DataContext";
import { RiWifiOffLine } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";
import InstallationPWA from "./InstallationPWA";

const Home = () => {
  const {
    vehicleData,
    isLoading,
    showListeOption,
    setIsLoading,
    setShowListOption,
    mergedData,
  } = useContext(DataContext);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // gestion du message de connextion d'internet
  useEffect(() => {
    // Détecter la perte de connexion
    const handleOffline = () => setIsOffline(true);
    // Détecter le retour de la connexion
    const handleOnline = () => setIsOffline(false);

    // Ajouter les écouteurs d'événements
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Nettoyage des écouteurs d'événements
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(!isLoading);
      }, 5000); // 5000 millisecondes = 5 secondes

      return () => clearTimeout(timer); // Nettoyage pour éviter les effets secondaires
    }
  }, [isLoading]);

  ////////////////////////////////////////////////////////////////

  const [time, setTime] = useState(() => {
    // Récupère le temps depuis le localStorage ou initialise à 0
    const savedTime = localStorage.getItem("timer");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const prevMergedDataRef = useRef(mergedData); // Garde en mémoire la version précédente de `mergedData`
  const timerRef = useRef(null);

  useEffect(() => {
    // Réinitialise le timer si `mergedData` change
    if (
      JSON.stringify(prevMergedDataRef.current) !== JSON.stringify(mergedData)
    ) {
      prevMergedDataRef.current = mergedData;
      setTime(0);
    }
  }, [mergedData]);

  useEffect(() => {
    // Démarre le timer
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    // Nettoie l'intervalle au démontage
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Sauvegarde le temps dans le localStorage à chaque mise à jour
    localStorage.setItem("timer", time);
  }, [time]);

  // // Convertit le temps en jours, heures, minutes et secondes
  // const formatTime = (seconds) => {
  //   const days = Math.floor(seconds / (24 * 60 * 60));
  //   const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  //   const minutes = Math.floor((seconds % (60 * 60)) / 60);
  //   const secs = seconds % 60;

  //   return `${days}j ${hours}h ${minutes}m ${secs}s`;
  // };

  // Convertit le temps en jours, heures, minutes et secondes
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    // Construit la chaîne de temps conditionnellement
    const parts = [];
    if (days >= 1) parts.push(`${days}j`);
    if (hours >= 1) parts.push(`${hours}h`);
    if (minutes >= 1) parts.push(`${minutes}m`);
    parts.push(`${secs}s`); // Les secondes sont toujours affichées

    return parts.join(" ");
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

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

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  function getMostRecentTimestamp(data) {
    // Filtrer les entrées avec un tableau vehiculeDetails valide et non vide
    const validTimestamps = data
      .filter(
        (vehicle) =>
          Array.isArray(vehicle.vehiculeDetails) &&
          vehicle.vehiculeDetails.length > 0
      )
      .map((vehicle) => parseInt(vehicle.vehiculeDetails[0].timestamp));

    // if (validTimestamps.length === 0) {
    //   throw new Error("Aucun timestamp valide trouvé dans les données.");
    // }

    // Trouver le timestamp le plus récent
    const mostRecentTimestamp = Math.max(...validTimestamps);

    // Conversion en date et heure
    const mostRecentDate = formatTimestampToDate(mostRecentTimestamp);
    const mostRecentTime = formatTimestampToTime(mostRecentTimestamp);

    return { mostRecentTimestamp, mostRecentDate, mostRecentTime };
  }
  const dataFusionee2 = mergedData ? Object.values(mergedData) : [];

  // Appel de la fonction et affichage des résultats
  // try {

  const [derniereUpdate, setderniereUpdate] = useState(null);

  useEffect(() => {
    // Mettre à jour le timestamp le plus récent lorsque "data" change
    const result = getMostRecentTimestamp(dataFusionee2);
    console.log("Most Recent Timestamp:", result.mostRecentTimestamp);
    console.log("Date:", result.mostRecentDate);
    console.log("Time:", result.mostRecentTime);
    setderniereUpdate(result);
    // } catch (error) {
    //   console.error(error.message);
    // }    setMostRecent(result);
  }, [mergedData]);

  return (
    <div className="sm:px-10 pt-16 md:px-14 lg:px-20 min-h-screen">
      {/* Statistic component */}
      <Statistics />

      {/* <InstallationPWA /> */}

      {/* Chargement quand on login */}
      {isLoading && (
        // (!vehicleData && (
        <div className="fixed inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {derniereUpdate?.mostRecentTimestamp !== -Infinity && (
        <div className="shadow-md dark:bg-red-900/40 dark:shadow-gray-900  flex gap-4 justify-between-- md:gap-6 rounded-lg mx-2 mt-3 p-3 py-2 text-center bg-red-100">
          <MdUpdate className="translate-y-0 text-red-700 dark:text-gray-200 text-2xl" />
          <div className=" xs:flex items-center gap-4 ">
            <h3 className="text-red-700 text-start  dark:text-red-100">
              Dernière mise à jour :{" "}
            </h3>
            <p className="text-start font-bold  text-[.85rem] xs:text-[.91rem] dark:text-gray-100 text-gray-700 ">
              {" "}
              {/* {formatTime(time)} */}
              {derniereUpdate?.mostRecentDate}
              {" / "}
              {derniereUpdate?.mostRecentTime}
            </p>
          </div>
        </div>
      )}

      {/* Message quand il n y a pas d'internet */}
      {isOffline && (
        <div className="shadow-md dark:bg-red-900/40 dark:shadow-gray-900  flex gap-2 justify-center md:gap-6 rounded-lg mx-2 mt-3 p-3 text-center bg-red-100">
          <RiWifiOffLine className="translate-y-0 text-red-700 dark:text-gray-200 text-4xl" />
          <h3 className="text-red-700 dark:text-red-100">
            Vous êtes hors ligne. Veuillez vérifier votre connexion internet.
          </h3>
        </div>
      )}

      {/* Liste des vehicules */}
      <Liste setShowListOption={setShowListOption} />

      {/* Option pour chaque vehicule */}
      {showListeOption && <Liste_options />}
    </div>
  );
};

export default Home;
