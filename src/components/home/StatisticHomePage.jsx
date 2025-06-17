import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

function StatisticHomePage() {
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

  //   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;
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
    <div className="mt-10 mx-2">
      <div className="flex mb-3 items-center gap-2 sm:gap-3">
        <h1 className="font-bold  md:hidden text-[1.1rem] md:text-xl text-gray-800">
          {t("Pour Aujourd'hui")}
        </h1>
        <h1 className="font-bold hidden md:block text-[1.1rem] md:text-xl text-gray-800">
          {t("Statistiques pour aujourd'hui")}
        </h1>
      </div>
      <div className="grid  max-w-[] grid-cols-2 gap-1.5 md:gap-4 lg:grid-cols-4 items-center justify-between">
        {/*  */}
        <div
          onClick={() => {
            setStatisticFilterInHomePage(vehicleArray);
            setStatisticFilterTextInHomePage("tout");
          }}
          className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
        >
          <div className="border border-blue-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-blue-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
            <div>
              <div className="flex items-center  gap-2">
                <h3 className="text-blue-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                  {t("Total")}
                </h3>
                {statisticFilterTextInHomePage === "tout" && (
                  <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-blue-400"></div>
                )}
              </div>
              <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                {/* {allDevices?.length} */}
                {totalVehicleCount?.length}
              </h2>
            </div>
            <div className="absolute mt-1.5 right-4 bottom-4 ">
              <img
                className=" w-8 md:w-10 lg:w-14--"
                src="/img/home_icon/total.png"
                alt="Total"
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setStatisticFilterInHomePage(activeVehicleCount);
            setStatisticFilterTextInHomePage("mouvement");
          }}
          className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
        >
          <div className="border border-green-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-green-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
            <div>
              <div className="flex items-center  gap-2">
                <h3 className="text-green-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                  {t("En Mouvement")}
                </h3>
                {statisticFilterTextInHomePage === "mouvement" && (
                  <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-green-400"></div>
                )}
              </div>
              <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                {/* {DeviceDéplacer?.length} */}
                {activeVehicleCount.length || "0"}
              </h2>
            </div>
            <div className="absolute mt-1.5 right-4 bottom-4">
              <img
                className=" w-12 md:w-14 lg:w-14--"
                src="/img/home_icon/active.png"
                alt="Total"
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setStatisticFilterInHomePage(inactiveVehicleCount);
            setStatisticFilterTextInHomePage("parking");
          }}
          className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
        >
          <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
            <div>
              <div className="flex items-center  gap-2">
                <h3 className="text-red-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                  {t("En Stationnement")}
                </h3>
                {statisticFilterTextInHomePage === "parking" && (
                  <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-red-400"></div>
                )}
              </div>
              <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                {/* {DeviceEnStationnement?.length} */}
                {inactiveVehicleCount?.length}
              </h2>
            </div>
            <div className="absolute mt-1.5 right-4 bottom-4 ">
              <img
                className=" w-8 md:w-10 lg:w-14--"
                src="/img/cars/parking.png"
                alt="Total"
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setStatisticFilterInHomePage(notActiveVehicleCount);
            setStatisticFilterTextInHomePage("hors_service");
          }}
          className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
        >
          <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
            <div>
              <div className="flex items-center  gap-2">
                <h3 className="text-purple-950 dark:text-gray-300 md:font-semibold text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl ">
                  {t("Hors Service")}
                </h3>
                {statisticFilterTextInHomePage === "hors_service" && (
                  <div className="min-w-2 min-h-2 md:min-w-3 md:min-h-3  rounded-full bg-purple-400"></div>
                )}
              </div>
              <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                {/* {DeviceInactifs?.length} */}
                {notActiveVehicleCount?.length}
              </h2>
            </div>
            <div className="absolute mt-1.5 right-4 bottom-4 ">
              <img
                className=" w-8 md:w-10 lg:w-14--"
                src="/img/home_icon/payer.png"
                alt="Total"
              />
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default StatisticHomePage;
