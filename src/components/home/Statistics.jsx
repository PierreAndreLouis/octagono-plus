import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";

function Statistics() {
  const {
    mergedDataHome,
    setStatisticFilterInHomePage,
    setStatisticFilterTextInHomePage,
    statisticFilterTextInHomePage,
    isDashboardHomePage,
    setIsDashboardHomePage,
  } = useContext(DataContext);

  const vehicleArray = mergedDataHome ? Object.values(mergedDataHome) : [];
  let x;
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes
  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Pour stocker le nombre véhicules totale
  const totalVehicleCount = vehicleArray.length;
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Liste des véhicules en mouvement actuellement
  const activeVehicleCount = vehicleArray.filter((véhicule) => {
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
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Liste des véhicules en stationnement actuellement
  const filteredVehicles = vehicleArray.filter((véhicule) => {
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

  // Nombre de véhicule en stationnement actuellement
  const inactiveVehicleCount = filteredVehicles.length || "0";
  //
  //
  //
  //
  //
  //
  //
  x;

  // Filtrer les véhicules sans détails ou inactifs  // hors services
  const filteredVehiclesInactifs = vehicleArray.filter((véhicule) => {
    // Vérifier si le véhicule n'a pas de détails
    const noDetails =
      !véhicule?.véhiculeDetails || véhicule?.véhiculeDetails.length === 0;

    // Vérifier si le véhicule est inactif
    const lastUpdateTime = véhicule?.lastUpdateTime;
    const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
    const isInactive =
      lastUpdateTimeMs > 0 && currentTime - lastUpdateTimeMs >= twentyHoursInMs;

    // Retourne true si l'une des conditions est satisfaite
    return noDetails || isInactive;
  });

  // Nombre de véhicules hors services filtrés
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
  x;
  // a supprimer
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
  x;

  return (
    <div className="mt-2 ">
      {/* ------------------------------- */}
      {/* Début des statistiques */}
      <div className="p-2 grid grid-cols-2 gap-2 mt-4 md:mt-10">
        {/* Nombre totale de véhicules */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Nombre total de véhicules"
        >
          <div
            onClick={() => {
              console.log("isDashboardHomePage", isDashboardHomePage);
              setStatisticFilterInHomePage(vehicleArray);
              setStatisticFilterTextInHomePage("tout");
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-blue-300/50 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-blue-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    Total
                  </h3>
                  {statisticFilterTextInHomePage === "tout" && (
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

        {/* Nombre de véhicules en mouvement */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement en service."
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(activeVehicleCount);
              setStatisticFilterTextInHomePage("mouvement");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-green-300/50 dark:bg-green-600/40 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-green-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    En Mouvement
                  </h3>
                  {statisticFilterTextInHomePage === "mouvement" && (
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

        {/* Nombre de véhicules en stationnement  */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement stationnés"
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(filteredVehicles);
              setStatisticFilterTextInHomePage("parking");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-red-300/50 dark:bg-red-800/50 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-red-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    En Stationnement
                  </h3>
                  {statisticFilterTextInHomePage === "parking" && (
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

        {/* Nombre de véhicules hors service  */}
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -20], // Décalage horizontal et vertical
                },
              },
            ],
          }}
          title="Véhicules actuellement hors service ou en panne"
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(filteredVehiclesInactifs);
              setStatisticFilterTextInHomePage("hors_service");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-400/10 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[2rem] bg-purple-300/50 dark:bg-purple-700/30 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-purple-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    Hors Service
                  </h3>
                  {statisticFilterTextInHomePage === "hors_service" && (
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

        {/*  */}
      </div>
      {/* Fin des statistiques */}
      {/* ------------------------------- */}
    </div>
  );
}

export default Statistics;
