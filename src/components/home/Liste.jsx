import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import "./style.css";

import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

// import ReactTooltip from "react-tooltip";

// okk
// okk
// okk
// okk
// okk
// okk
// okk
// dark
// dark
// dark
// dark
// dark
// dark
// dark

function Liste() {
  const {
    mergedData,
    setCurrentVehicule,
    setSelectedVehicle,
    isLoading,
    setShowListOption,
    currentVehicule,
    updateCurrentVehicule,
    searchQuery,
    donneeFusionneeForRapport,
    selectUTC,
    userData,
    vehicleData,
    vehicleDetails,
    fetchVehicleDetails,
    fetRapportchVehicleDetails,
    fonctionTest,
    fonctionTest2,
    setSearchdonneeFusionneeForRapport,
    statisticFilter,
    setstatisticFilter,
    statisticFilterText,
  } = useContext(DataContext);

  const dataFusionee = statisticFilter ? Object.values(statisticFilter) : [];
  const dataFusionee2 = mergedData ? Object.values(mergedData) : [];

  // Filtrer les données selon la recherche
  const filteredData = searchQuery
    ? (statisticFilterText ? dataFusionee : dataFusionee2).filter(
        (vehicle) =>
          vehicle?.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (vehicle.vehiculeDetails?.[0]?.address &&
            vehicle.vehiculeDetails[0].address
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : statisticFilterText
    ? dataFusionee
    : dataFusionee2;

  // const filteredData = searchQuery
  // ? (dataFusionee || dataFusionee2).filter(
  //     (vehicle) =>
  //       vehicle?.description
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       (vehicle.vehiculeDetails?.[0]?.address &&
  //         vehicle.vehiculeDetails[0].address
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase()))
  //   )
  // : dataFusionee || dataFusionee2;

  useEffect(() => {
    console.log("Véhicule mis à jour", currentVehicule);
  }, [currentVehicule]);

  const handleClick = (vehicle) => {
    setCurrentVehicule(vehicle);
    setSelectedVehicle(vehicle.deviceID);
    setShowListOption(true);
    setSearchdonneeFusionneeForRapport([]);
    console.log("vehicule cliquer:", vehicle);
  };

  // Fonctions pour formater le temps et la date
  // function formatTimestampToTime(timestamp) {
  //   const date = new Date(timestamp * 1000);
  //   const hours = date.getUTCHours().toString().padStart(2, "0");
  //   const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  //   const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  //   return `${hours}:${minutes}:${seconds}`;
  // }

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes}  ${period}`;
    // return `${hours}:${minutes}:${seconds} ${period}`;
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

  const reloadVehiculeDetails = () => {
    const now = new Date();
    const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startOfDay
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00`;

    if (vehicleData && vehicleData?.length > 0) {
      vehicleData?.forEach((vehicle) => {
        fetchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
        fetRapportchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
      });
    }
  };

  // Calculer les 20 heures en millisecondes
  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const activeVehicleCount = filteredData.filter(
    (vehicle) =>
      vehicle.vehiculeDetails &&
      vehicle.vehiculeDetails[0] &&
      vehicle.vehiculeDetails[0].speedKPH > 0
  );

  // Filtrer les véhicules correspondant aux nouvelles conditions
  const filteredVehicles = filteredData.filter((vehicle) => {
    // Vérifie si le véhicule a des détails
    const hasDetails =
      vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

    // Vérifie la vitesse (noSpeed)
    // const noSpeed = vehicle.vehiculeDetails?.[0]?.speedKPH <= 1;
    const noSpeed = vehicle.vehiculeDetails?.every(
      (detail) => detail.speedKPH <= 0
    );

    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
    const lastUpdateTimeMs = vehicle.lastUpdateTime
      ? vehicle.lastUpdateTime * 1000
      : 0;
    const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

    // Inclure seulement les véhicules qui ont des détails, qui sont actifs, et qui ont noSpeed
    return hasDetails && noSpeed && isActive;
    // return hasDetails && isActive && noSpeed;
  });

  //
  //
  //
  //
  // Filtrer les véhicules sans détails ou inactifs
  const filteredVehiclesInactifs = filteredData.filter((vehicle) => {
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
  //

  return (
    <div className="p-2 flex flex-col gap-4 mt-4 mb-[10rem]-- pb-[6rem] dark:text-white">
      {/* <button
        onClick={() => {
          // Debug test - VehicleAddress
          // fonctionTest();
          console.log("aaaaaaaaaa", dataFusionee);
          console.log("bbbbbbbbbb", statisticFilterText);
        }}
      >
        test
      </button> */}

      {isLoading ? (
        <p>Chargement des données...</p>
      ) : filteredData.length > 0 ? (
        filteredData.map((vehicle, index) => {
          const speed = vehicle.vehiculeDetails?.[0]?.speedKPH || 0;

          let main_text_color = "text-red-900 dark:text-red-300";
          let statut = "";
          let lite_bg_color =
            "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
          let activeTextColor = "text-red-900 dark:text-red-200";
          let active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
          let vitess_img = "img/cars/orange_vitess.png";
          let imgClass = "w-14 sm:w-16 md:w-24";
          let border_top =
            "border-t border-t-red-200 dark:border-t-red-600/30 ";

          const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
          const currentTime = Date.now(); // Heure actuelle en millisecondes

          const isMoving = vehicle.vehiculeDetails?.some(
            (detail) => detail.speedKPH >= 1
          );

          const hasDetails =
            vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

          const noSpeed = vehicle.vehiculeDetails?.every(
            (detail) => detail.speedKPH <= 0
          );

          // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
          const lastUpdateTimeMs = vehicle.lastUpdateTime
            ? vehicle.lastUpdateTime * 1000
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

          if (!hasDetails || !isActive) {
            main_text_color = "text-purple-900 dark:text-purple-300 hidden";
            statut = "Hors service";
            lite_bg_color =
              "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
            activeTextColor = "text-purple-900 dark:text-purple-200";
            active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
            vitess_img = "/img/home_icon/payer.png";
            imgClass = "w-14 sm:w-16 md:w-24";
            border_top =
              "border-t border-t-purple-200 dark:border-t-purple-600/30 ";
          } else if (hasDetails && speed < 1 && isActive) {
            main_text_color = "text-red-900 dark:text-red-300";
            statut = "En Stationnement";
            lite_bg_color =
              "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
            activeTextColor = "text-red-900 dark:text-red-200";
            active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
            vitess_img = "img/cars/orange_vitess.png";
            imgClass = "w-14 sm:w-16 md:w-24";
            border_top = "border-t border-t-red-200 dark:border-t-red-600/30 ";
          } else if (
            hasDetails &&
            // isMoving &&
            isActive &&
            speed >= 1 &&
            speed <= 20
          ) {
            main_text_color = "text-[#555b03] dark:text-yellow-300";
            statut = "En ralenti";
            lite_bg_color =
              "bg-[#ffff001b] dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-yellow-400/80  shadow-lg shadow-gray-950/20";
            activeTextColor = "text-[#555b03] dark:text-yellow-100";
            active_bg_color = "bg-yellow-400/20 dark:bg-yellow-600/20";
            vitess_img = "img/cars/yellow_vitess.png";
            imgClass = "w-12 sm:w-14 md:w-20";
            border_top =
              "border-t border-t-yellow-200 dark:border-t-yellow-600/30 ";
          } else if (
            hasDetails &&
            //  isMoving &&
            isActive &&
            speed > 20
          ) {
            main_text_color = "text-green-700 dark:text-green-400";
            statut = "En marche";
            lite_bg_color =
              "bg-green-100/50 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
            activeTextColor = "text-green-800 dark:text-green-200";
            active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
            vitess_img = "img/cars/green_vitess.png";
            imgClass = "w-12 sm:w-14 md:w-20";
            border_top =
              "border-t border-t-green-200 dark:border-t-green-600/30 ";
          }

          return (
            <div className="bg-white dark:bg-gray-800">
              <div
                onClick={() => handleClick(vehicle)}
                key={vehicle.deviceID}
                className={` ${lite_bg_color} shadow-md relative rounded-lg p-3 border-2-- border-red-500--`}
              >
                <div
                  className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-4 pb-4 font-bold text-lg `}
                >
                  {index + 1}
                </div>
                <div className="----">
                  <div className="flex relative gap-3 md:py-2 border-2-- border-green-500--">
                    <div className="flex flex-col items-center md:min-w-32">
                      <div className={`${imgClass} mb-2`}>
                        <img src={vitess_img} alt="" />
                      </div>

                      <h2
                        className={`${main_text_color} sm:text-lg md:text-xl leading font-semibold whitespace-nowrap`}
                      >
                        {parseFloat(speed).toFixed(0)}
                      </h2>
                      <h2
                        className={`${main_text_color} text-[1rem] sm:text-lg md:text-xl leading-3 font-semibold whitespace-nowrap`}
                      >
                        Km/h
                      </h2>
                    </div>
                    <div>
                      <h2
                        className={`${activeTextColor} text-gray-800 dark:text-gray-100 font-semibold text-md md:text-xl mb-2 `}
                      >
                        {vehicle?.description || "---"}
                      </h2>
                      <div className="flex mb-2 gap-4 text-gray-600 text-md dark:text-gray-300">
                        <div className="flex gap-3 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300" />
                          <h3 className="text-sm sm:text-sm md:text-[1rem]  lg:text-lg--">
                            {vehicle?.vehiculeDetails?.[0]?.timestamp
                              ? selectUTC
                                ? formatTimestampToDateWithTimezone(
                                    vehicle?.vehiculeDetails[0].timestamp,
                                    selectUTC
                                  )
                                : formatTimestampToDate(
                                    vehicle?.vehiculeDetails?.[0]?.timestamp
                                  )
                              : "Pas de date disponible"}
                          </h3>
                        </div>

                        {vehicle.vehiculeDetails?.[0]?.timestamp ? (
                          <div className="flex items-center gap-1">
                            <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl" />
                            <h3 className="text-sm sm:text-sm md:text-[1rem] lg:text-lg--">
                              {selectUTC
                                ? formatTimestampToTimeWithTimezone(
                                    vehicle.vehiculeDetails[0]?.timestamp,
                                    selectUTC
                                  )
                                : formatTimestampToTime(
                                    vehicle.vehiculeDetails?.[0]?.timestamp
                                  )}
                            </h3>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="">
                          <FaCar className="text-gray-500/80 dark:text-gray-300 mt-0.5" />
                        </div>
                        <span
                          className={` ${active_bg_color} ml-1  ${activeTextColor} pb-[.1rem] px-2 py-0 text-[.87rem] rounded-md `}
                        >
                          {statut}
                        </span>
                      </div>

                      <div className="sm:flex gap-1 hidden ">
                        <div>
                          <MdLocationPin className="text-xl text-gray-500/80 dark:text-gray-300 -translate-x-0.5 mt-3" />
                        </div>

                        <p className=" text-md felx sm:flex text-gray-600 mt-2 md:text-[1.1rem] dark:text-gray-300">
                          {vehicle.vehiculeDetails?.[0]?.backupAddress ||
                            vehicle.vehiculeDetails?.[0]?.address ||
                            "Adresse non disponible"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /////////////////////////////////////////////////////// */}
                  <p
                    className={`${border_top} sm:hidden  pt-2 text-[.95rem] xs:text-[.9rem]-- felx  text-gray-600 mt-2 md:text-lg dark:text-gray-300 `}
                  >
                    <span
                      className={`${activeTextColor} font-semibold dark:text-orange-500--"`}
                    >
                      Adresse :{" "}
                    </span>
                    {vehicle.vehiculeDetails?.[0]?.backupAddress ||
                      vehicle.vehiculeDetails?.[0]?.address ||
                      "Adresse non disponible"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center dark:text-gray-400">Aucun véhicule trouvé.</p>
      )}
    </div>
  );
}
{
  /* <VehicleAddress
                  latitude={vehicle.vehiculeDetails?.[0]?.latitude}
                  longitude={vehicle.vehiculeDetails?.[0]?.longitude}
                /> */
}
export default Liste;
