import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";

function SearchVehiculePupup({
  searchQueryListPopup,
  handleSearchChange,
  setShowOptions,
  filteredVehicles,
  handleClick,
  currentVéhicule,
  isMapcomponent,
}) {
  const {
    currentDataFusionné,
    selectedVehicleToShowInMap,
    setSelectedVehicleToShowInMap,
  } = useContext(DataContext);

  const foundVehicle = currentDataFusionné.find(
    (v) => v.deviceID === selectedVehicleToShowInMap
  );
  return (
    <div>
      <div className="fixed sm:mx-auto  border mx-4 max-w-[50rem] pt-[5.5rem] p-4 dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-lg dark:shadow-gray-950 text-gray-500 top-20 rounded-lg bg-white right-0 left-0 min-h-20 shadow-lg shadow-gray-600/80">
        <div className="absolute top-[2.4rem] left-4 right-4 p-2">
          <input
            className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
            type="text"
            placeholder="Recherche"
            value={searchQueryListPopup}
            onChange={handleSearchChange}
          />
        </div>
        <div
          onClick={() => {
            setShowOptions(false);
          }}
          className="flex justify-end absolute top-4 left-0 right-4"
        >
          <IoMdClose className="mt-1 text-2xl cursor-pointer text-end text-red-500 -translate-y-[.2rem] -translate-x-[.1rem]" />
        </div>
        <div className="overflow-auto h-[55vh]">
          {filteredVehicles?.length > 0 ? (
            filteredVehicles?.map((véhicule, index) => {
              const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
              const currentTime = Date.now(); // Heure actuelle en millisecondes

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
