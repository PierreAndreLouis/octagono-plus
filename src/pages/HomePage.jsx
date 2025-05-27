import React, { useContext, useEffect, useRef, useState } from "react";
import Statistics from "../components/home/Statistics";
import Liste from "../components/home/Liste";
import Liste_options from "../components/home/Liste_options";
import { DataContext } from "../context/DataContext";
import { RiWifiOffLine } from "react-icons/ri";
import { MdUpdate } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquareXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import DashboardAdminPage from "./DashboardAdminPage";

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
    updateAuto,
    setupdateAuto,
    estLancerUpdateAuto,
    setEstLancerUpdateAuto,
    fetchVehicleDetails,
    handleLogin,
    fetchVehicleData,
    successAddVéhiculePopup,
    successModifierVéhiculePopup,
    setSuccessModifierVéhiculePopup,
    successDeleteVéhiculePopup,
    setSuccessDeleteVéhiculePopup,
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
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // reloadHomePage();
  //     console.log("HomePage Reload start....");
  //     homePageReload();
  //   }, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

  //
  //
  //
  //
  //
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

  const [activeDesactiveUpdateAutoPopup, setActiveDesactiveUpdateAutoPopup] =
    useState(false);
  let body_bg = "bg-red-50";
  let header_bg = "bg-red-600";
  let button_bg = "bg-red-500";
  let text_color = "text-red-600";

  if (!updateAuto) {
    body_bg = "bg-green-50";
    header_bg = "bg-green-600";
    button_bg = "bg-green-500";
    text_color = "text-green-600";
  } else {
    body_bg = "bg-red-50";
    header_bg = "bg-red-600";
    button_bg = "bg-red-500";
    text_color = "text-red-600";
  }

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
    <>
      {/* {account === "sysadmin" ? (
        <DashboardAdminPage />
      ) : ( */}
      <div className="sm:px-10 pt-16 md:px-14 lg:px-20 min-h-[120vh]">
        <Statistics />
        {/* Chargement quand on login */}
        {/* {isHomePageLoading && (
        <div className="fixed inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )} */}
        {/* Pour afficher la date et heure de la dernière mise a jour */}
        {lastUpdate?.mostRecentTimestamp !== -Infinity && (
          <div className="shadow-md md:py-4 md:pr-4 lg:pr-10 cursor-pointer dark:bg-red-900/40 dark:shadow-gray-900  flex gap-2 justify-between-- md:gap-6 rounded-lg mx-2 mt-3 p-3 py-2 text-center bg-red-100">
            <div
              onClick={() => {
                handleClick();
                console.log("HomePage Reload start....");

                homePageReload();
              }}
              className={`${
                isLoading2 ? "animate-spin" : ""
              }  text-red-700 min-w-12   flex justify-center sm: items-center dark:text-gray-200 text-2xl `}
            >
              <div className="relative ">
                {estLancerUpdateAuto && (
                  <div className=" flex justify-center items-center absolute scale-75 opacity-75 top-0 sm:mt-1 left-0 right-0 z-20">
                    <GoDotFill className="text-green-600" />
                  </div>
                )}
                <MdUpdate className="sm:text-[2rem] mt-1-- sm:mt-0" />
              </div>
            </div>
            {/* <MdUpdate className="translate-y-0 text-red-700 dark:text-gray-200 text-2xl" /> */}
            <div className="flex justify-between items-start  sm:items-center w-full gap-2  ">
              <div
                onClick={() => {
                  handleClick();
                  console.log("HomePage Reload start....");

                  homePageReload();
                }}
                className=" xs:flex flex-wrap items-center col-gap-4 "
              >
                <h3 className="text-red-700 mr-3 text-start md:text-[1.15rem] sm:font-bold  dark:text-red-100">
                  Dernière mise à jour :{" "}
                </h3>
                <p className="text-start font-bold  text-[.85rem] xs:text-[.91rem] md:text-[1.1rem] dark:text-gray-100 text-gray-700 ">
                  {" "}
                  {MiseAJourFormatDateHeure?.date}
                  {" / "}
                  {MiseAJourFormatDateHeure?.time}
                </p>
              </div>
              {/* updateAuto, setupdateAuto, */}
              <div
                onClick={() => {
                  setActiveDesactiveUpdateAutoPopup(true);
                }}
                className="flex mt-1 sm:mt-0 gap-2 items-center "
              >
                {updateAuto ? (
                  <FaCheckSquare className="text-orange-600 text-xl" />
                ) : (
                  <FaSquareXmark className="text-orange-600 text-xl" />
                )}

                <p className="font-semibold sm:hidden text-sm sm:text-[1rem]">
                  Auto...
                </p>

                <p className="font-semibold hidden sm:block whitespace-nowrap lg:hidden text-sm sm:text-[1rem]---">
                  Actualisation auto...
                </p>
                <p className="font-semibold hidden lg:block text-sm sm:text-[1rem]">
                  Actualisation automatique
                </p>
              </div>
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
          // fetchVehicleDetails();
          homePageReload();
          // console.log("fetchVehicleDetails", fetchVehicleDetails);
        }}
      >
        Mise a jour des donnees
      </button>
      <br />
      <button
        onClick={() => {
          handleLogin("foodforthepoor", "monitoring", "123456");
        }}
      >
        Login
      </button>
      <br /> */}
        {/* <button
        onClick={() => {
          // console.log(mergedDataHome);
          // fetchVehicleDetails();
          fetchVehicleData();
          // console.log("fetchVehicleDetails", fetchVehicleDetails);
        }}
      >
        Recherche de donnee vehicule
      </button>
      <br />

      <button
        onClick={() => {
          console.log();
          localStorage.getItem("username");
        }}
      >
        localStorage
      </button> */}

        {/* Liste des véhiculés */}
        <Liste setShowListOption={setShowListOption} />
        {/* Option pour chaque véhicule */}
        {showListeOption && <Liste_options />}
        {activeDesactiveUpdateAutoPopup && (
          <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
            <div
              className={` ${body_bg} max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[90vw] `}
            >
              <div
                className={` ${header_bg} flex justify-center items-center py-4 px-4  mb-8 `}
              >
                <h2 className="font-bold text-white text-xl">
                  Mise a jour automatique
                </h2>
              </div>
              <div>
                <h3
                  className={`${text_color}  block font-semibold text-lg  text-center leading-6  mb-3 px-4`}
                >
                  Êtes-vous sur {updateAuto ? "de désactiver" : "d'activer"} la
                  mise a jour automatique ?
                </h3>
              </div>
              <div className="flex justify-center gap-2 mt-12">
                {updateAuto ? (
                  <div
                    onClick={() => {
                      setupdateAuto(false);
                      setActiveDesactiveUpdateAutoPopup(false);
                    }}
                    // to="/home?tab=acceuil"
                    className={` ${button_bg} cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
                  >
                    Oui
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setupdateAuto(true);
                      setActiveDesactiveUpdateAutoPopup(false);
                    }}
                    // to="/home?tab=acceuil"
                    className={` ${button_bg} cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
                  >
                    Oui
                  </div>
                )}
                <div
                  onClick={() => {
                    setActiveDesactiveUpdateAutoPopup(false);
                  }}
                  // to="/home?tab=acceuil"
                  className={` bg-gray-500 cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
                >
                  Non
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* // )} */}
    </>
  );
};

export default Home;
