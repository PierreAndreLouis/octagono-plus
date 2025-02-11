import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";

function SearchVehiculePupup({
  searchQueryListPopup,
  handleSearchChange,
  setShowOptions,
  filteredVehicles,
  handleClick,
  currentVéhicule,
  isMapcomponent,
  setSearchQueryListPopup,
}) {
  const {
    currentDataFusionné,
    selectedVehicleToShowInMap,
    setSelectedVehicleToShowInMap,
    centrerAutoMapTrajet,
    setCentrerAutoMapTrajet,
  } = useContext(DataContext);

  const [
    filterSearchVehiculePopupByCategorie,
    setTilterSearchVehiculePopupByCategorie,
  ] = useState("hors service");
  useEffect(() => {
    setTilterSearchVehiculePopupByCategorie("all");
  }, [searchQueryListPopup]);

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Pour filtrer le recherche

  const filteredVehiclesPupupByCategorie = filteredVehicles?.filter(
    (véhicule) => {
      const hasBeenMoving =
        véhicule.véhiculeDetails &&
        véhicule.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

      const noSpeed =
        véhicule.véhiculeDetails &&
        véhicule.véhiculeDetails?.every((detail) => detail.speedKPH <= 0);

      const hasDetails = véhicule.véhiculeDetails.length > 0;
      const noDetails = véhicule.véhiculeDetails.length <= 0;

      // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

      if (filterSearchVehiculePopupByCategorie === "all") {
        return true;
      } else if (filterSearchVehiculePopupByCategorie === "deplace") {
        return hasBeenMoving;
      } else if (filterSearchVehiculePopupByCategorie === "non deplace") {
        return hasDetails && noSpeed;
      } else if (filterSearchVehiculePopupByCategorie === "hors service") {
        return noDetails && isActive;
      }
    }
  );

  const foundVehicle = currentDataFusionné.find(
    (v) => v.deviceID === selectedVehicleToShowInMap
  );
  return (
    <div>
      <div className="fixed  sm:mx-auto  border mx-2 max-w-[50rem] pt-[5.5rem] p-2- dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-lg dark:shadow-gray-950 text-gray-500 top-20 rounded-lg bg-white right-0 left-0 min-h-20 shadow-lg shadow-gray-600/80">
        <div className="absolute  top-[1rem] left-4 right-4 py-2">
          <div className="mt-4 mb-4  flex items-center gap-2">
            <Tooltip
              title="Appuyer pour filtrer
            "
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
                Véhicules déplacés
              </p>
            </Tooltip>

            <Tooltip
              title="Appuyer pour filtrer
            "
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
                Véhicules non déplacés
              </p>
            </Tooltip>

            <Tooltip
              title="Appuyer pour filtrer
            "
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
                Véhicules hors service
              </p>
            </Tooltip>
          </div>
          <div className="flex gap-2 justify-between items-center">
            <input
              className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
              type="text"
              placeholder="Recherche"
              value={searchQueryListPopup}
              onChange={handleSearchChange}
            />
            <Tooltip
              title="Réinitialiser le filtrer par catégorie
            "
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
                Reset
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
        <div className="overflow-auto  mt-14 h-[55vh]">
          {filteredVehiclesPupupByCategorie?.length > 0 ? (
            filteredVehiclesPupupByCategorie?.map((véhicule, index) => {
              const isMoving = véhicule.véhiculeDetails?.some(
                (detail) => detail.speedKPH >= 1
              );

              const hasDetails =
                véhicule.véhiculeDetails && véhicule.véhiculeDetails.length > 0;

              const noSpeed = véhicule.véhiculeDetails?.every(
                (detail) => detail.speedKPH <= 0
              );

              // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
              const lastUpdateTimeMs = véhicule.lastUpdateTime
                ? véhicule.lastUpdateTime * 1000
                : 0;
              const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

              let iconBg = "text-red-500 dark:text-red-500";

              if (hasDetails && isMoving) {
                iconBg = "text-green-500 dark:text-green-500";
              } else if (hasDetails && noSpeed && isActive) {
                iconBg = "text-red-500 dark:text-red-500";
              } else if (!hasDetails || !isActive) {
                iconBg = "text-purple-500 dark:text-purple-500";
              }

              return (
                <div
                  key={véhicule.deviseID}
                  onClick={() => {
                    handleClick(véhicule);
                    setShowOptions(false);
                    setSelectedVehicleToShowInMap(véhicule.deviceID);
                    setCentrerAutoMapTrajet(true);
                  }}
                  className={`${
                    véhicule.description ===
                      (isMapcomponent === "true"
                        ? foundVehicle?.description
                        : currentVéhicule?.description) &&
                    "bg-orange-50 dark:bg-gray-800"
                  }  cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 dark:bg-gray-600-- dark:hover:bg-gray-800`}
                >
                  <FaCar
                    className={` ${iconBg}   text-orange-600/80--- min-w-8 text-lg  `}
                  />
                  <p className="text-gray-700 dark:text-white">
                    {index + 1} - {véhicule.description || "---"}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center dark:text-gray-50 px-3 mt-10">
              Pas de resultat
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchVehiculePupup;
