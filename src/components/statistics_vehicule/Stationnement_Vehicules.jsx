import React, { useContext } from "react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
// import RapportOptions from "./RapportOptions";
import { IoReload } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";

function Stationnement_Vehicules({
  showParkingVehicule,
  setshowParkingVehicule,
  vehiculeNotActiveAjourdhui,
  setshowRapportPupup,
  // formatTimestampToDate,
  // formatTimestampToTime,
  handleClick,
  // selectUTC,
}) {
  const {
    mergedData,
    chooseStationnement,
    setCurrentVehicule,
    setShowListOption,
    selectUTC
  } = useContext(DataContext);

  const vehicleArray = mergedData ? Object.values(mergedData) : [];
  const totalVehicleCount = vehicleArray.length;

  // Fonctions pour formater le temps et la date
  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  function convertToTimezone(timestamp, offset) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const [sign, hours, minutes] = offset
      .match(/([+-])(\d{2}):(\d{2})/)
      .slice(1);
    const totalOffsetMinutes =
      (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);

    date.setMinutes(date.getMinutes() + totalOffsetMinutes); // Appliquer le décalage
    return date;
  }

  function formatTimestampToDateWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTimestampToTimeWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  // Calculer les 20 heures en millisecondes
  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Filtrer les véhicules correspondant aux nouvelles conditions
  const filteredVehicles = vehicleArray.filter((vehicle) => {
    // Vérifie si le véhicule a des détails
    const hasDetails =
      vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

    // Vérifie la vitesse (noSpeed)
    const noSpeed = vehicle.vehiculeDetails?.[0]?.speedKPH <= 1;

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    // Inclure seulement les véhicules qui ont des détails, qui sont actifs, et qui ont noSpeed
    return hasDetails && isActive && noSpeed;
  });

  // Nombre de véhicules inactifs
  const inactiveVehicleCount = filteredVehicles.length || "0";

  return (
    <div>
      <div className="transition-all">
        {/* <div
          onClick={() => {
            // setshowParkingVehicule(!showParkingVehicule);
          }}
          className="flex gap-4 dark:text-gray-200 dark:bg-gray-900/50 dark:shadow-lg dark:shadow-gray-700 justify-between items-center px-4 cursor-pointer bg-gray-100 text-gray-700 p-2 mb-3 font-semibold rounded-md"
        >
          <h2 className="text-lg">En Stationnement aujourd'hui:</h2>
          <FaChevronDown
            className={`${
              showParkingVehicule ? "rotate-180" : "rotate-0"
            } transition-all`}
          />
        </div> */}

        <div
          onClick={() => {
            // setshowRapportPupup(true);
          }}
          className="flex flex-col gap-3 mt-3"
          // className={` ${
          //   showParkingVehicule
          //     ? "max-h-[100rem] pb-14 overflow-y-auto transition-all"
          //     : "max-h-[0rem] transition-all"
          // } flex   overflow-hidden flex-col gap-4 transition-all `}
        >
          {filteredVehicles?.length > 0 ? (
            filteredVehicles?.map((vehicule, index) => {
              return (
                <div
                  onClick={() => {
                    setCurrentVehicule(vehicule);
                    setShowListOption(true);
                    // handleClick(vehicule);
                    // setshowRapportPupup(true);
                  }}
                  key={index}
                  className="bg-white rounded-lg dark:bg-gray-800 dark:shadow-gray-600"
                >
                  <div
                    className={` py-6 bg-red-100/20 dark:border-l-[.5rem] dark:border-red-800 dark:bg-gray-900/50 dark:shadow-gray-700 shadow-md rounded-lg p-3`}
                  >
                    <div className="flex items-stretch relative gap-3 md:py-6--">
                      <div className="flex justify-center border-2 md:pt-6 md:pb-8 bg-red-200/40 dark:bg-red-900  border-white dark:border-red-400 dark:shadow-gray-600 shadow-md shadow-red-200 rounded-md p-2 flex-col items-center md:min-w-32">
                        <div>
                          <img
                            className="dark:hidden min-w-[4.5rem] max-w-[4.5rem] px-2 sm:max-w-[6.5rem]"
                            src="/img/home_icon/rapport_parking2.png"
                            alt=""
                          />
                          <img
                            className="hidden dark:block min-w-[4.5rem] max-w-[4.5rem] px-2 sm:max-w-[6.5rem]"
                            src="/img/home_icon/rapport_parking.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <div>
                        <h2
                          className={`text-red-800 dark:text-red-200 text-gray-800-- font-semibold text-md md:text-xl mb-2 `}
                        >
                          {vehicule?.description || "non disponible"}
                        </h2>
                        <div className="flex mb-2 gap-4 text-gray-600 text-md">
                          <div className="flex gap-3 items-center  dark:text-gray-300">
                            <FaRegCalendarAlt id="date-icon" className="text-gray-500/80  dark:text-gray-300" />
                            <h3 className="text-sm sm:text-sm md:text-md">
                              {/* {formatTimestampToDate(
                                vehicule?.vehiculeDetails[0]?.timestamp
                              )} */}
                              {vehicule.vehiculeDetails?.[0]?.timestamp
                                ? selectUTC
                                  ? formatTimestampToDateWithTimezone(
                                      vehicule.vehiculeDetails[0].timestamp,
                                      selectUTC
                                    )
                                  : formatTimestampToDate(
                                      vehicule.vehiculeDetails?.[0]?.timestamp
                                    )
                                : "Pas de date disponible"}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1  dark:text-gray-300">
                            <IoMdTime id="time-icon" className="text-gray-500/80  dark:text-gray-300 text-xl" />
                            <h3 className="text-sm sm:text-sm md:text-md">
                              {/* {formatTimestampToTime(
                                vehicule.vehiculeDetails?.[0]?.timestamp || 0
                              )} */}

                              {selectUTC
                                ? formatTimestampToTimeWithTimezone(
                                    vehicule.vehiculeDetails[0].timestamp,
                                    selectUTC
                                  )
                                : formatTimestampToTime(
                                    vehicule.vehiculeDetails?.[0]?.timestamp
                                  )}
                            </h3>
                          </div>
                        </div>

                        <div id="statut-box" className="flex gap-2 items-center">
                          <div>
                            <FaCar id="car-icon" className="text-gray-500/80 dark:text-gray-300" />
                          </div>
                          <span
                            className={` bg-red-300/20 ml-1 dark:text-red-300  text-red-800 pb-[.2rem] px-2 py-0 text-sm rounded-md `}
                          >
                            En Stationnement
                          </span>
                        </div>

                        <div className="hidden sm:flex gap-1">
                          <div>
                            <MdLocationPin className="text-xl text-gray-500/80 -translate-x-0.5 mt-3" />
                          </div>

                          <p className="text-md felx sm:flex text-gray-600 dark:text-gray-200 mt-2 md:text-lg">
                            {vehicule.vehiculeDetails[0]?.address ||
                              "adresse non disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:hidden">
                      <p className="text-md felx sm:flex dark:text-gray-300 text-gray-600 mt-2 md:text-lg">
                        <span className="text-red-700 font-bold dark:text-red-200">
                          Adresse :{" "}
                        </span>
                        {vehicule.vehiculeDetails[0]?.address ||
                          "adresse non disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : chooseStationnement ? (
            <p className="text-center dark:text-gray-200">
              Pas de véhicule en stationnement
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stationnement_Vehicules;

// export default Stationnement_Vehicules
