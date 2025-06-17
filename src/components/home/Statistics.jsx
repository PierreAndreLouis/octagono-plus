import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

function Statistics() {
  const {
    mergedDataHome,
    setStatisticFilterInHomePage,
    setStatisticFilterTextInHomePage,
    statisticFilterTextInHomePage,
    isDashboardHomePage,
    setIsDashboardHomePage,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

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

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now();
  const tenMinutesInMs = 10 * 60 * 1000;
  const twentyHoursInMs = 24 * 60 * 60 * 1000;
  const currentTimeMs = getCurrentTimestampMs();
  const currentTime = currentTimeMs;

  // Total véhicules
  const totalVehicleCount = vehicleArray;

  // Véhicules en mouvement (mouvement lent ou rapide)
  const activeVehicleCount = vehicleArray.filter((véhicule) => {
    const speed = véhicule?.véhiculeDetails?.[0]?.speedKPH || 0;
    const lastUpdateTimestampMs =
      véhicule?.véhiculeDetails?.[0]?.timestamp * 1000 || 0;
    const lastUpdateTimeMs = véhicule?.lastUpdateTime * 1000 || 0;
    const isStillSpeedActive =
      currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;
    const isRecentlyUpdated = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    return speed > 0 && isStillSpeedActive && isRecentlyUpdated;
  });

  // Véhicules en stationnement
  const inactiveVehicleCount = vehicleArray.filter((véhicule) => {
    const speed = véhicule?.véhiculeDetails?.[0]?.speedKPH || 0;
    const lastUpdateTimestampMs =
      véhicule?.véhiculeDetails?.[0]?.timestamp * 1000 || 0;
    const lastUpdateTimeMs = véhicule?.lastUpdateTime * 1000 || 0;
    const isStillSpeedActive =
      currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    return (speed < 1 || (speed > 0 && !isStillSpeedActive)) && isActive;
  });

  // Véhicules hors service (pas de détails OU inactifs depuis +20h)
  const notActiveVehicleCount = vehicleArray.filter((véhicule) => {
    const noDetails =
      !véhicule?.véhiculeDetails || véhicule?.véhiculeDetails.length === 0;

    const lastUpdateTimeMs = véhicule?.lastUpdateTime
      ? véhicule?.lastUpdateTime * 1000
      : 0;
    const isInactive = currentTimeMs - lastUpdateTimeMs >= twentyHoursInMs;

    return noDetails || isInactive;
  });

  x;

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  //
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
          title={`${t("Nombre total de véhicules")}`}
        >
          <div
            onClick={() => {
              // console.log("isDashboardHomePage", isDashboardHomePage);
              setStatisticFilterInHomePage(vehicleArray);
              setStatisticFilterTextInHomePage("tout");
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900 md:p-[1.2rem] bg-blue-300/50 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-blue-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    {t("Total")}
                  </h3>
                  {statisticFilterTextInHomePage === "tout" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-blue-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-3xl ">
                  {totalVehicleCount?.length}
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
          title={`${t("Véhicules actuellement en service")}`}
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(activeVehicleCount);
              setStatisticFilterTextInHomePage("mouvement");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[1.2rem] bg-green-300/50 dark:bg-green-600/40 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-green-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    {t("En Mouvement")}
                  </h3>
                  {statisticFilterTextInHomePage === "mouvement" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-green-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-3xl ">
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
          title={`${t("Véhicules actuellement stationnés")}`}
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(inactiveVehicleCount);
              setStatisticFilterTextInHomePage("parking");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[1.2rem] bg-red-300/50 dark:bg-red-800/50 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-red-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    {t("En Stationnement")}
                  </h3>
                  {statisticFilterTextInHomePage === "parking" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-red-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-3xl ">
                  {inactiveVehicleCount?.length}
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
          title={`${t("Véhicules actuellement hors service ou en panne")}`}
        >
          <div
            onClick={() => {
              setStatisticFilterInHomePage(notActiveVehicleCount);
              setStatisticFilterTextInHomePage("hors_service");
            }}
            className="bg-white  cursor-pointer dark:bg-gray-400/10 rounded-lg"
          >
            <div className="border relative dark:border-gray-800 dark:shadow-gray-900 md:p-[1.2rem] bg-purple-300/50 dark:bg-purple-700/30 flex justify-between items-start rounded-lg shadow-md p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-purple-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                    {t("Hors Service")}
                  </h3>
                  {statisticFilterTextInHomePage === "hors_service" && (
                    <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-purple-400"></div>
                  )}
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-3xl lg:text-3xl ">
                  {notActiveVehicleCount?.length}
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
