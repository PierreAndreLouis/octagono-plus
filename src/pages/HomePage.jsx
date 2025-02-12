import React, { useContext, useEffect, useRef, useState } from "react";
import Statistics from "../components/home/Statistics";
import Liste from "../components/home/Liste";
import Liste_options from "../components/home/Liste_options";
import { DataContext } from "../context/DataContext";
import { RiWifiOffLine } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";

const Home = () => {
  const {
    isHomePageLoading,
    showListeOption,
    setShowListOption,
    mergedDataHome,
    FormatDateHeure,
    homePageReload,
    statisticFilterInHomePage,
    statisticFilterTextInHomePage,
    setStatisticFilterTextInHomePage,
    setStatisticFilterInHomePage,
    GeofenceDataFonction,
    geofenceData,
    userData,
    account,
    username,
    password,
  } = useContext(DataContext);

  let x;
  useEffect(() => {
    // console.log(mergedDataHome);
  }, [mergedDataHome]);

  //
  //
  //
  //
  //
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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // fonction pour gestion du message de connexion d'internet
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
  //
  //
  //
  //
  //
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

  // Fonction pour avoir le dernier timestamp, pour calculer la dernière mise a jour
  function getMostRecentTimestamp(data) {
    // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
    const validTimestamps = data
      .filter(
        (véhicule) =>
          Array.isArray(véhicule?.véhiculeDetails) &&
          véhicule?.véhiculeDetails.length > 0
      )
      .map((véhicule) => parseInt(véhicule?.véhiculeDetails[0].timestamp));

    // Trouver le timestamp le plus récent
    const mostRecentTimestamp = Math.max(...validTimestamps);

    return { mostRecentTimestamp };
  }
  const dataFusionnePourTimestamp = mergedDataHome
    ? Object.values(mergedDataHome)
    : [];

  // Pour stocker le timestamp le plus récent lorsque "data" change
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mettre à jour le timestamp le plus récent lorsque "data" change
  useEffect(() => {
    const result = getMostRecentTimestamp(dataFusionnePourTimestamp);
    setLastUpdate(result);
  }, [mergedDataHome]);

  // pour la conversion en heure/minute/seconde
  const MiseAJourFormatDateHeure = FormatDateHeure(
    lastUpdate?.mostRecentTimestamp
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
  x;
  // Pour le loading lors du clique sur l'icon reload in home page.
  const [isLoading2, setIsLoading2] = useState(false);

  // pour mettre a jour la variable isLoading2
  useEffect(() => {
    // console.log(isLoading2);
  }, [isLoading2]);

  //Pour Simuler un délai de 10 secondes pour le loading de l'icon loading dans la page home
  const handleClick = () => {
    setIsLoading2(true);
    setTimeout(() => {
      setIsLoading2(false);
    }, 10000);
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
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // Peut être supprimer
  const [test, setTest] = useState("x");
  const testRef = useRef(test);

  // Met à jour la référence à chaque changement de test
  useEffect(() => {
    testRef.current = test;
  }, [test]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Met à jour l'état avec la dernière valeur choisie
      setTest(testRef.current);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  //
  //
  //
  //
  //
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

  // Mise a jour les donnee de rapport page tous les 1 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      // reloadHomePage();
      homePageReload();

      // console.log("HomePage Reload start....");
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  //
  //
  //
  //
  //
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
  // a reviser
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const statisticFilterRef = useRef(statisticFilterInHomePage);
  const statisticFilterTextRef = useRef(statisticFilterTextInHomePage);

  // Met à jour la référence à chaque changement de statisticFilterInHomePage
  useEffect(() => {
    statisticFilterRef.current = statisticFilterInHomePage;
    statisticFilterTextRef.current = statisticFilterTextInHomePage;
  }, [statisticFilterInHomePage, statisticFilterTextInHomePage]);

  useEffect(() => {
    // Met à jour l'état avec la dernière valeur choisie
    // console.log(
    //   "mise a jour de Statistic header:",
    //   statisticFilterTextRef.current
    // );
    // console.log("mise a jour de Statistic header:", statisticFilterRef.current);
    setStatisticFilterInHomePage(statisticFilterRef.current);
    setStatisticFilterTextInHomePage(statisticFilterTextRef.current); // Met à jour l'état
  }, [
    mergedDataHome,
    statisticFilterInHomePage,
    statisticFilterTextInHomePage,
  ]);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  //
  //
  //
  //
  //
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
  // Pour mettre a jour le choix de statistic filter
  useEffect(() => {
    const interval = setInterval(() => {
      if (statisticFilterTextInHomePage) {
        // console.log("Dernier Filter choisi :", statisticFilterTextInHomePage);
        setStatisticFilterTextInHomePage(statisticFilterTextInHomePage); // Met à jour l'état
        setStatisticFilterInHomePage(statisticFilterInHomePage);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [
    statisticFilterTextInHomePage,
    mergedDataHome,
    statisticFilterInHomePage,
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
  //
  //
  //
  //
  //
  x;

  // const previousDataRef = useRef(JSON.stringify(mergedDataHome)); // Utilisation de useRef

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const currentData = JSON.stringify(mergedDataHome);

  //     if (currentData !== previousDataRef.current) {
  //       console.log(
  //         "Données de mergedDataHome changé VVVVVVVVVVVVVVVVVVVVVV :",
  //         mergedDataHome
  //       );
  //       previousDataRef.current = currentData; // Mise à jour de la référence
  //     } else {
  //       console.log("Les données de mergedDataHome sont inchangées.");
  //     }
  //   }, 3000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="sm:px-10 pt-16 md:px-14 lg:px-20 min-h-screen">
      {/* Statistic component */}
      <Statistics />
      {/* Chargement quand on login */}
      {isHomePageLoading && (
        <div className="fixed inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}
      {/* Pour afficher la date et heure de la dernière mise a jour */}
      {lastUpdate?.mostRecentTimestamp !== -Infinity && (
        <div
          onClick={() => {
            handleClick();
            homePageReload();
          }}
          className="shadow-md cursor-pointer dark:bg-red-900/40 dark:shadow-gray-900  flex gap-6 justify-between-- md:gap-6 rounded-lg mx-2 mt-3 p-3 py-2 text-center bg-red-100"
        >
          <div
            className={`${
              isLoading2 ? "animate-spin" : ""
            }  text-red-700 min-w-12   flex justify-center items-center dark:text-gray-200 text-2xl `}
          >
            <MdUpdate />
          </div>
          {/* <MdUpdate className="translate-y-0 text-red-700 dark:text-gray-200 text-2xl" /> */}
          <div className=" xs:flex items-center gap-4 ">
            <h3 className="text-red-700 text-start  dark:text-red-100">
              Dernière mise à jour :{" "}
            </h3>
            <p className="text-start font-bold  text-[.85rem] xs:text-[.91rem] dark:text-gray-100 text-gray-700 ">
              {" "}
              {MiseAJourFormatDateHeure?.date}
              {" / "}
              {MiseAJourFormatDateHeure?.time}
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
      {/* <button
        onClick={() => {
          // console.log(mergedDataHome);
          console.log("geofenceData indexdb", geofenceData);
        }}
      >
        testeeeeeeeeeeeeeeeeeeeee
      </button> */}

      {/* Liste des véhiculés */}
      <Liste setShowListOption={setShowListOption} />
      {/* Option pour chaque véhicule */}
      {showListeOption && <Liste_options />}
    </div>
  );
};

export default Home;
