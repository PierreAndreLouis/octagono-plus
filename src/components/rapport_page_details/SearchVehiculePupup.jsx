import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

function SearchVehiculePupup({
  searchQueryListPopup,
  handleSearchChange,
  setShowOptions,
  filteredVehicles,
  handleClick,
  currentVéhicule,
  isMapcomponent,
  setSearchQueryListPopup,
  vehicles,
  mapRef,
}) {
  const {
    currentDataFusionné,
    selectedVehicleToShowInMap,
    setSelectedVehicleToShowInMap,
    searchDonneeFusionnéForRapport,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  const [
    filterSearchVehiculePopupByCategorie,
    setTilterSearchVehiculePopupByCategorie,
  ] = useState("hors service");
  useEffect(() => {
    setTilterSearchVehiculePopupByCategorie("all");
  }, [searchQueryListPopup]);

  const isSearching = searchDonneeFusionnéForRapport?.length > 0;

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit

  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  const twentyFourHoursInSec = 24 * 60 * 60;

  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const currentTimeSec = getCurrentTimestamp();
  // Pour filtrer le recherche

  const filteredVehiclesPupupByCategorie = filteredVehicles?.filter(
    (véhicule) => {
      const hasBeenMoving = véhicule?.lastStopTime > todayTimestamp;

      const isParking =
        currentTimeSec - véhicule?.lastUpdateTime < twentyFourHoursInSec;

      const isHorsService =
        currentTimeSec - véhicule?.lastUpdateTime > twentyFourHoursInSec;

      const noSpeed =
        véhicule?.véhiculeDetails &&
        véhicule?.véhiculeDetails?.every((detail) => detail.speedKPH <= 0);

      const hasDetails =
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0;
      const noDetails = véhicule?.véhiculeDetails?.length <= 0;

      // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

      const lastUpdateTimestampMs =
        véhicule.véhiculeDetails &&
        véhicule.véhiculeDetails[0] &&
        véhicule.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

      const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

      //
      //
      //

      // let border_color = "bg-gray-50";
      // let text_color = "text-orange-500/80";
      // let bg_color = "bg-orange-500";
      // if (currentTimeSec - device?.lastUpdateTime < twentyFourHoursInSec) {
      //   border_color = "border-l-[.4rem] border-orange-300";
      //   text_color = "text-orange-500/80";
      //   bg_color = "bg-orange-500";
      // } else if (
      //   currentTimeSec - device?.lastUpdateTime >
      //   twentyFourHoursInSec
      // ) {
      //   border_color = "border-l-[.4rem] border-purple-300";
      //   text_color = "text-purple-500/80";
      //   bg_color = "bg-purple-500";
      // }

      // if (device?.lastStopTime > todayTimestamp) {
      //   border_color = "border-l-[.4rem] border-green-300";
      //   text_color = "text-green-500/80";
      //   bg_color = "bg-green-500";
      // }

      //
      //
      //

      if (isSearching) {
        if (filterSearchVehiculePopupByCategorie === "all") {
          return true;
        } else if (filterSearchVehiculePopupByCategorie === "deplace") {
          return hasBeenMoving;
        } else if (filterSearchVehiculePopupByCategorie === "non deplace") {
          return hasDetails && noSpeed;
        } else if (filterSearchVehiculePopupByCategorie === "hors service") {
          return noDetails;
        }
      } else {
        if (filterSearchVehiculePopupByCategorie === "all") {
          return true;
        } else if (filterSearchVehiculePopupByCategorie === "deplace") {
          return hasBeenMoving;
        } else if (filterSearchVehiculePopupByCategorie === "non deplace") {
          return isParking;
        } else if (filterSearchVehiculePopupByCategorie === "hors service") {
          return isHorsService;
        }
      }
    }
  );

  const foundVehicle = currentDataFusionné?.find(
    (v) => v.deviceID === selectedVehicleToShowInMap
  );
  return (
    <div className="fixed min-h-[100vh] px-2  z-[999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999] inset-0 bg-black/50  flex justify-center ">
      <div className=" sm:mx-auto   min-w-[90vw]  md:min-w-[60vw] relative border md:mx-2  md:max-w-[50rem]  pt-[5.5rem]  dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-lg dark:shadow-gray-950 text-gray-500 top-20 rounded-lg bg-white right-2 left-0 min-h-20 h-[82vh]   shadow-lg shadow-gray-600/80 ">
        <div className="absolute  top-[1rem] left-2 right-2 md:left-4  md:right-4 py-2">
          <div className="mt-4 mb-4   flex items-center gap-2">
            <Tooltip
              title={`${t("cliquez pour filtrer")}`}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                ],
              }}
            >
              <p
                onClick={() => {
                  setTilterSearchVehiculePopupByCategorie("deplace");
                }}
                className="px-2 cursor-pointer  sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 dark:text-green-200 dark:bg-gray-700 border-l-green-600 "
              >
                {t("Véhicules déplacés")}
              </p>
            </Tooltip>

            <Tooltip
              title={`${t("cliquez pour filtrer")}`}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                ],
              }}
            >
              <p
                onClick={() => {
                  setTilterSearchVehiculePopupByCategorie("non deplace");
                }}
                className="px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold bg-red-50/60 dark:text-red-200 dark:bg-gray-700 border-l-red-600 "
              >
                {t("Véhicules non déplacés")}
              </p>
            </Tooltip>

            <Tooltip
              title={`${t("cliquez pour filtrer")}`}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                ],
              }}
            >
              <p
                onClick={() => {
                  setTilterSearchVehiculePopupByCategorie("hors service");
                }}
                className="px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 "
              >
                {t("Véhicules hors service")}
              </p>
            </Tooltip>
          </div>
          <div className="flex gap-2 justify-between items-center">
            <input
              className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
              type="text"
              placeholder={`${t("Rechercher")}`}
              value={searchQueryListPopup}
              onChange={handleSearchChange}
            />
            <Tooltip
              title={`${t("Réinitialiser le filtrer par catégorie")}`}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                ],
              }}
            >
              <p
                onClick={() => {
                  setTilterSearchVehiculePopupByCategorie("all");
                  setSearchQueryListPopup("");
                }}
                className="border cursor-pointer bg-gray-50 font-semibold  rounded-lg px-2 py-1.5"
              >
                {t("Reset")}
              </p>
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-end absolute top-4 left-0 right-4">
          <IoMdClose
            onClick={() => {
              setShowOptions(false);
            }}
            className="mt-1 text-2xl cursor-pointer text-end text-red-500 -translate-y-[.2rem] -translate-x-[.1rem]"
          />
        </div>
        <div className="overflow-auto  mt-14 h-[62vh] md:h-[55vh] ">
          {filteredVehiclesPupupByCategorie?.length > 0 ? (
            filteredVehiclesPupupByCategorie?.map((véhicule, index) => {
              const isMoving =
                véhicule?.véhiculeDetails &&
                véhicule?.véhiculeDetails?.some(
                  (detail) => detail.speedKPH >= 1
                );

              const hasDetails =
                véhicule?.véhiculeDetails &&
                véhicule?.véhiculeDetails.length > 0;

              const noSpeed = véhicule?.véhiculeDetails?.every(
                (detail) => detail.speedKPH <= 0
              );

              // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
              const lastUpdateTimeMs = véhicule?.lastUpdateTime
                ? véhicule?.lastUpdateTime * 1000
                : 0;
              const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

              const lastUpdateTimestampMs =
                véhicule.véhiculeDetails &&
                véhicule.véhiculeDetails[0] &&
                véhicule.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

              const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

              //
              //
              //
              //
              const hasBeenMoving = véhicule?.lastStopTime > todayTimestamp;

              const isParking =
                currentTimeSec - véhicule?.lastUpdateTime <
                twentyFourHoursInSec;

              const isHorsService =
                currentTimeSec - véhicule?.lastUpdateTime >
                twentyFourHoursInSec;

              let iconBg = "text-red-500 dark:text-red-500";

              if (isSearching) {
                if (isMoving) {
                  iconBg = "text-green-500 dark:text-green-500";
                } else if (hasDetails && noSpeed) {
                  iconBg = "text-red-500 dark:text-red-500";
                } else if (!hasDetails) {
                  iconBg = "text-purple-500 dark:text-purple-500";
                }
              } else {
                if (hasBeenMoving) {
                  iconBg = "text-green-500 dark:text-green-500";
                } else if (isParking) {
                  iconBg = "text-red-500 dark:text-red-500";
                } else if (isHorsService) {
                  iconBg = "text-purple-500 dark:text-purple-500";
                }
              }
              return (
                <div
                  key={véhicule.deviseID}
                  onClick={() => {
                    handleClick(véhicule);
                    setShowOptions(false);
                    setSelectedVehicleToShowInMap(véhicule?.deviceID);
                    console.log(véhicule);
                  }}
                  className={`${
                    véhicule.description ===
                      (isMapcomponent === "true"
                        ? foundVehicle?.description
                        : currentVéhicule?.description) &&
                    "bg-orange-50 dark:bg-gray-800"
                  }  cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 notranslate dark:bg-gray-600-- dark:hover:bg-gray-800`}
                >
                  <FaCar
                    className={` ${iconBg}   text-orange-600/80--- min-w-8 text-lg  `}
                  />
                  <p className="text-gray-700 notranslate dark:text-white">
                    {index + 1} - {véhicule.description || "---"}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center dark:text-gray-50 px-3 mt-10">
              {t("Pas de resultat")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchVehiculePupup;
