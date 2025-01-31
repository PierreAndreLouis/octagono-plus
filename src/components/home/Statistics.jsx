import React, { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

function Statistics() {
  const {
    mergedData,
    showCategorieListe,
    setshowCategorieListe,
    chooseActifs,
    setchooseActifs,
    chooseStationnement,
    setchooseStationnement,
    chooseInactifs,
    setchooseInactifs,
    chooseALl,
    setchooseALl,
    statisticFilter,
    setstatisticFilter,
    setstatisticFilterText,
    statisticFilterText,
  } = useContext(DataContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setstatisticFilterText((prevText) => prevText); // Pas de changement inutile
      setstatisticFilter((prevFilter) => prevFilter);
      console.log("mise a jour de Statistic header to : ", statisticFilterText);
    }, 20000);

    return () => clearInterval(intervalId);
  }, []); // Dépendances nécessaires

  const vehicleArray = mergedData ? Object.values(mergedData) : [];

  const totalVehicleCount = vehicleArray.length;

  // const activeVehicleCount = vehicleArray.filter(
  //   (vehicle) =>
  //     vehicle.vehiculeDetails &&
  //     vehicle.vehiculeDetails[0] &&
  //     vehicle.vehiculeDetails[0].speedKPH > 0
  // );

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // Convertir en secondes
  };

  // Fonction pour obtenir le timestamp actuel
  // const getCurrentTimestamp = () => {
  //   const now = new Date();
  //   return Math.floor(now.getTime() / 1000); // Convertir en secondes
  // };
  // const todayTimestamp = getCurrentTimestamp();

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const activeVehicleCount = vehicleArray.filter((vehicle) => {
    // Vérifie si le véhicule a des détails et si sa vitesse est supérieure à zéro
    const isSpeedActive =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH > 0;

    // const lastTimeStamp =
    //   vehicle.vehiculeDetails &&
    //   vehicle.vehiculeDetails[0] &&
    //   vehicle.vehiculeDetails[0].timestamp * 1000;
    // Récupérer le timestamp de la dernière mise à jour (en millisecondes)
    const lastUpdateTimestampMs =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    // const isStillSpeedActive = todayTimestamp - lastTimeStamp < trentMinute;
    // Vérifie si la mise à jour est récente (moins de 30 minutes)
    const isStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs <= thirtyMinutesInMs;

    // Vérifie si le véhicule a été mis à jour dans les 20 dernières heures
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isRecentlyUpdated = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    // Le véhicule doit être actif selon la vitesse et la mise à jour
    return isSpeedActive && isRecentlyUpdated && isStillSpeedActive;
  });

  // console.log(activeVehicleCount); // Affiche la liste des véhicules actifs

  // retireer les vehicule avec plus de 24h de misae a jour
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Calculer les 20 heures en millisecondes
  // const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  // const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Filtrer les véhicules correspondant aux nouvelles conditions
  const filteredVehicles = vehicleArray.filter((vehicle) => {
    // Vérifie si le véhicule a des détails
    const hasDetails =
      vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

    // Vérifie la vitesse (noSpeed)
    const noSpeed = vehicle.vehiculeDetails?.every(
      (detail) => detail.speedKPH <= 0
    );

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    const lastUpdateTimestampMs =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

    const isSpeedActive =
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH > 0;

    const isNotStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs > thirtyMinutesInMs;

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

  // Nombre de véhicules inactifs
  // const inactiveVehicleCount = "0";
  const inactiveVehicleCount = filteredVehicles.length || "0";
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Calculer les 20 heures en millisecondes
  // const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  // const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Filtrer les véhicules sans détails ou inactifs
  const filteredVehiclesInactifs = vehicleArray.filter((vehicle) => {
    // Vérifier si le véhicule n'a pas de détails
    const noDetails =
      !vehicle.vehiculeDetails || vehicle.vehiculeDetails.length === 0;

    // Vérifier si le véhicule est inactif
    const lastUpdateTime = vehicle?.lastUpdateTime;
    const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
    const isInactive =
      lastUpdateTimeMs > 0 && currentTime - lastUpdateTimeMs >= twentyHoursInMs;

    // Retourne true si l'une des conditions est satisfaite
    // return isInactive;
    // return noDetails || isInactive;
    return noDetails || isInactive;
  });

  // Nombre de véhicules filtrés
  // const notActiveVehicleCount = "0";
  const notActiveVehicleCount = filteredVehiclesInactifs.length || "0";
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  return (
    <div className="mt-2 ">
      {/* ------------------------------- */}
      {/* Début des statistiques */}
      <div className="p-2 grid grid-cols-2 gap-2 mt-4 md:mt-10">
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -40], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Nombre total de véhicules"
        >
          <div
            onClick={() => {
              setstatisticFilter(vehicleArray);
              setstatisticFilterText("tout");
              // setchooseALl(true);
              // setchooseActifs(false);
              // setchooseStationnement(false);
              // setchooseInactifs(false);
            }}
            // to="/Statistics_Page"
            className="bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="border  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-blue-300/50 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md p-3">
              {/* <div className="border overflow-hidden dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-blue-300/50 dark:bg-blue-700/30 flex justify-between items-start rounded-lg shadow-md p-3"> */}
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-blue-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    Total
                  </h3>
                  {statisticFilterText === "tout" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-blue-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-4xl ">
                  {totalVehicleCount}
                </h2>
              </div>
              <div className="absolute right-4 bottom-4 xs:relative xs:right-0 xs:bottom-0">
                <img
                  className="dark:hidden w-8 md:w-12 lg:w-14"
                  src="/img/home_icon/total.png"
                  alt="Total"
                />
                <img
                  className="hidden dark:block w-8 md:w-12 lg:w-14"
                  src="/img/home_icon/white_total.png"
                  alt="Total"
                />
              </div>
            </div>
          </div>
        </Tooltip>
        {/*  */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -40], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement en service."
        >
          <div
            onClick={() => {
              setstatisticFilter(activeVehicleCount);
              setstatisticFilterText("mouvement");

              // setchooseALl(false);
              // setchooseActifs(true);
              // setchooseStationnement(false);
              // setchooseInactifs(false);
            }}
            // to="/Statistics_Page"
            className="bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-green-300/50 dark:bg-green-600/40 flex justify-between items-start rounded-lg shadow-md p-3">
              {/* <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-green-300/50 dark:bg-green-700/30 flex justify-between items-start rounded-lg shadow-md p-3"> */}
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-green-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    En Mouvement
                  </h3>
                  {statisticFilterText === "mouvement" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-green-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-4xl ">
                  {activeVehicleCount.length || "0"}
                </h2>
              </div>
              <div className="absolute right-4 bottom-4 xs:relative xs:right-0 xs:bottom-0">
                <img
                  className="dark:hidden w-14 md:w-16 lg:w-20"
                  src="/img/home_icon/active.png"
                  alt="Véhicules actifs"
                />
                <img
                  className="hidden dark:block w-14 md:w-16 lg:w-20"
                  src="/img/home_icon/rapport_active.png"
                  alt="Véhicules actifs"
                />
              </div>
            </div>
          </div>
        </Tooltip>
        {/*  */}

        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -40], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement stationnés"
        >
          <div
            onClick={() => {
              setstatisticFilter(filteredVehicles);
              setstatisticFilterText("parking");

              // setchooseALl(false);
              // setchooseActifs(false);
              // setchooseStationnement(true);
              // setchooseInactifs(false);
            }}
            // to="/Statistics_Page"
            className="bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-red-300/50 dark:bg-red-800/50 flex justify-between items-start rounded-lg shadow-md p-3">
              {/* <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-red-300/50 dark:bg-red-900/40 flex justify-between items-start rounded-lg shadow-md p-3"> */}
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-red-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    En Stationnement
                  </h3>
                  {statisticFilterText === "parking" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-red-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-4xl ">
                  {inactiveVehicleCount}
                </h2>
              </div>
              <div className="absolute right-4 bottom-4 xs:relative xs:right-0 xs:bottom-0">
                <img
                  className="dark:hidden w-8 md:w-12 lg:w-14"
                  src="/img/cars/parking.png"
                  alt="Véhicules en stationnement"
                />
                <img
                  className="hidden dark:block w-8 md:w-12 lg:w-14"
                  src="/img/home_icon/rapport_parking.png"
                  alt="Véhicules en stationnement"
                />
              </div>
            </div>
          </div>
        </Tooltip>
        {/*  */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -40], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement hors service ou en panne"
        >
          <div
            onClick={() => {
              setstatisticFilter(filteredVehiclesInactifs);
              setstatisticFilterText("hors_service");

              // setchooseALl(false);
              // setchooseActifs(false);
              // setchooseStationnement(false);
              // setchooseInactifs(true);
            }}
            // to="/Statistics_Page"
            className="bg-white dark:bg-gray-400/10 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-purple-300/50 dark:bg-purple-700/30 flex justify-between items-start rounded-lg shadow-md p-3">
              {/* <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-purple-300/50 dark:bg-purple-950/50 flex justify-between items-start rounded-lg shadow-md p-3"> */}
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-purple-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    Hors Service
                  </h3>
                  {statisticFilterText === "hors_service" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-purple-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-4xl ">
                  {notActiveVehicleCount}
                </h2>
              </div>
              <div className="absolute right-4 bottom-4 xs:relative xs:right-0 xs:bottom-0">
                <img
                  className="dark:hidden w-8 md:w-12 lg:w-14"
                  src="/img/home_icon/payer.png"
                  alt="Véhicules inactifs"
                />
                <img
                  className="hidden dark:block w-8 md:w-12 lg:w-14"
                  src="/img/home_icon/rapport_not_active.png"
                  alt="Véhicules inactifs"
                />
              </div>
            </div>
          </div>
        </Tooltip>
        {/* <button
          onClick={() => {
            console.log(vehicleArray);
          }}
        >
          test
        </button> */}
        {/*  */}
      </div>
      {/* Fin des statistiques */}
      {/* ------------------------------- */}
    </div>
  );
}

export default Statistics;
