import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import "./style.css";
import { useTranslation } from "react-i18next";

function Liste() {
  const {
    mergedDataHome,
    setCurrentVéhicule,
    setSelectedVehicleToShowInMap,
    isHomePageLoading,
    setShowListOption,
    currentVéhicule,
    searchQueryForHeader,
    setSearchDonneeFusionnéForRapport,
    statisticFilterInHomePage,
    statisticFilterTextInHomePage,
    FormatDateHeure,
    setCurrentPersonelVéhicule,
    vehiclesByDepartureTime,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  let x;

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
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

  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  x;
  // Filtrer les données selon la recherche dans le header
  const filteredData = searchQueryForHeader
    ? dataFusionné.filter(
        (véhicule) =>
          véhicule?.description
            .toLowerCase()
            .includes(searchQueryForHeader.toLowerCase()) ||
          véhicule?.imeiNumber
            .toLowerCase()
            .includes(searchQueryForHeader.toLowerCase()) ||
          véhicule?.simPhoneNumber
            .toLowerCase()
            .includes(searchQueryForHeader.toLowerCase()) ||
          (véhicule?.véhiculeDetails?.[0]?.address &&
            véhicule?.véhiculeDetails[0].address
              .toLowerCase()
              .includes(searchQueryForHeader.toLowerCase()))
      )
    : dataFusionné;

  //
  //
  //
  //
  //
  //

  x;

  // Pour mettre a jour le véhicule actuel
  useEffect(() => {
    // console.log("Véhicule mise à jour", currentVéhicule);
  }, [currentVéhicule]);
  //
  //
  //
  //
  //
  //

  x;

  // Fonction pour choisir le véhicule actuel depuis la liste dans la page home
  const handleClick = (véhicule) => {
    setCurrentVéhicule(véhicule);
    setSelectedVehicleToShowInMap(véhicule?.deviceID);
    setShowListOption(true);
    setSearchDonneeFusionnéForRapport([]);

    //
    const deviceID = véhicule?.deviceID;
    const foundPersonelVehicle = vehiclesByDepartureTime.find(
      (v) => v.deviceID === deviceID
    );

    if (foundPersonelVehicle) {
      setCurrentPersonelVéhicule(foundPersonelVehicle);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
    // console.log("véhicule cliquer:", véhicule);
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
  x;

  const filteredDataToDisplay = filteredData.filter((véhicule) => {
    // Gérer chaque filtre en fonction du texte de filtrage
    if (statisticFilterTextInHomePage === "mouvement") {
      const isSpeedActive = véhicule?.véhiculeDetails?.[0]?.speedKPH > 0;

      const lastUpdateTimestampMs =
        véhicule?.véhiculeDetails?.[0]?.timestamp * 1000;

      const isStillSpeedActive =
        currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;

      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isRecentlyUpdated =
        currentTimeMs - lastUpdateTimeMs < twentyHoursInMs;

      return isSpeedActive && isRecentlyUpdated && isStillSpeedActive;
    }

    if (statisticFilterTextInHomePage === "parking") {
      const hasDetails = véhicule?.véhiculeDetails?.length > 0;
      const noSpeed = véhicule?.véhiculeDetails?.every(
        (detail) => detail.speedKPH <= 0
      );

      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isActive = currentTimeMs - lastUpdateTimeMs < twentyHoursInMs;

      const lastUpdateTimestampMs =
        véhicule?.véhiculeDetails?.[0]?.timestamp * 1000;
      const isSpeedActive = véhicule?.véhiculeDetails?.[0]?.speedKPH > 0;
      const isNotStillSpeedActive =
        currentTimeMs - lastUpdateTimestampMs > tenMinutesInMs;

      return (
        hasDetails &&
        isActive &&
        (noSpeed || (isSpeedActive && isNotStillSpeedActive))
      );
    }

    if (statisticFilterTextInHomePage === "hors_service") {
      const noDetails =
        !véhicule?.véhiculeDetails || véhicule?.véhiculeDetails.length === 0;

      const lastUpdateTimeMs = véhicule?.lastUpdateTime
        ? véhicule?.lastUpdateTime * 1000
        : 0;
      const isInactive = currentTimeMs - lastUpdateTimeMs >= twentyHoursInMs;

      return noDetails || isInactive;
    }

    // Si le filtre est "tous" ou vide, ne rien filtrer
    if (
      statisticFilterTextInHomePage === "tout" ||
      statisticFilterTextInHomePage === ""
    ) {
      return true; // Aucun filtre, tout afficher
    }

    return false; // Retourner false par défaut si aucune condition n'est remplie
  });

  /////////////////////////////////////////////

  const sortedData = [...filteredDataToDisplay].sort((a, b) => {
    const getPriority = (véhicule) => {
      const speed = véhicule?.véhiculeDetails?.[0]?.speedKPH || 0;

      const hasDetails =
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0;

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

      // Vérifie si la mise à jour est récente (moins de 30 minutes)
      const isStillSpeedActive =
        lastUpdateTimestampMs &&
        currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;

      if (hasDetails && isActive && speed > 20 && isStillSpeedActive) return 1;
      if (
        hasDetails &&
        isActive &&
        speed >= 1 &&
        speed <= 20 &&
        isStillSpeedActive
      )
        return 2;
      if (
        hasDetails &&
        isActive &&
        (speed < 1 || (isSpeedActive && !isStillSpeedActive))
      )
        return 3;
      if (!hasDetails || !isActive) return 4;
    };

    return getPriority(a) - getPriority(b);
  });

  return (
    <div className="p-2 flex flex-col gap-4 mt-4 mb-[10rem]-- pb-[6rem] dark:text-white">
      {isHomePageLoading ? (
        <p>{t("Chargement des données")}...</p>
      ) : sortedData.length > 0 ? (
        sortedData.map((véhicule, index) => {
          const speed = véhicule?.véhiculeDetails?.[0]?.speedKPH || 0;

          let main_text_color = "text-red-900 dark:text-red-300";
          let statut = "";
          let lite_bg_color =
            "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
          let activeTextColor = "text-red-900 dark:text-red-200";
          let active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
          let vitesse_img = "img/cars/orange_vitess.png";
          let imgClass = "w-14 sm:w-16 md:w-24";
          let border_top =
            "border-t border-t-red-200 dark:border-t-red-600/30 ";
          //
          //
          //
          //
          //
          //
          //
          //
          x;

          const hasDetails =
            véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0;

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

          // Vérifie si la mise à jour est récente (moins de 30 minutes)
          const isStillSpeedActive =
            lastUpdateTimestampMs &&
            currentTimeMs - lastUpdateTimestampMs <= tenMinutesInMs;

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

          if (!hasDetails || !isActive) {
            main_text_color = "text-purple-900 dark:text-purple-300 hidden";
            statut = `${t("Hors service")}`;
            lite_bg_color =
              "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
            activeTextColor = "text-purple-900 dark:text-purple-200";
            active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
            vitesse_img = "/img/home_icon/payer.png";
            imgClass = "w-14  h-auto sm:w-16 md:w-24";
            border_top =
              "border-t border-t-purple-200 dark:border-t-purple-600/30 ";
          } else if (
            hasDetails &&
            isActive &&
            (speed < 1 || (isSpeedActive && !isStillSpeedActive))
          ) {
            main_text_color = "text-red-900 dark:text-red-300";
            statut = `${t("En Stationnement")}`;
            lite_bg_color =
              "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-900/20";
            activeTextColor = "text-red-900 dark:text-red-200";
            active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
            vitesse_img = "img/cars/orange_vitess.png";
            imgClass = "w-14  h-auto sm:w-16 md:w-24";
            border_top = "border-t border-t-red-200 dark:border-t-red-600/30 ";
          } else if (
            hasDetails &&
            isActive &&
            speed >= 1 &&
            speed <= 20 &&
            isStillSpeedActive
          ) {
            main_text_color = "text-[#555b03] dark:text-yellow-300";
            statut = `${t("En mouvement lent")}`;
            lite_bg_color =
              "bg-[#ffff001b] dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-yellow-400/80  shadow-lg shadow-gray-950/20";
            activeTextColor = "text-[#555b03] dark:text-yellow-100";
            active_bg_color = "bg-yellow-400/20 dark:bg-yellow-600/20";
            vitesse_img = "img/cars/yellow_vitess.png";
            imgClass = "w-12  h-auto sm:w-14 md:w-20";
            border_top =
              "border-t border-t-yellow-200 dark:border-t-yellow-600/30 ";
          } else if (
            hasDetails &&
            isActive &&
            speed > 20 &&
            isStillSpeedActive
          ) {
            main_text_color = "text-green-700 dark:text-green-400";
            statut = `${t("En mouvement rapide")}`;
            lite_bg_color =
              "bg-green-100/50 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
            activeTextColor = "text-green-800 dark:text-green-200";
            active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
            vitesse_img = "img/cars/green_vitess.png";
            imgClass = "w-12  h-auto sm:w-14 md:w-20";
            border_top =
              "border-t border-t-green-200 dark:border-t-green-600/30 ";
          }

          const FormatDateHeureTimestamp = FormatDateHeure(
            véhicule?.véhiculeDetails?.[0]?.timestamp
          );
          //
          //
          //
          //
          //
          //
          //
          x;
          //////////////////////////

          return (
            <div className="bg-white dark:bg-gray-800">
              <div
                onClick={() => handleClick(véhicule)}
                key={index}
                className={` ${lite_bg_color} shadow-md relative rounded-lg p-3 border-2-- border-red-500--`}
              >
                <div
                  className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-3 pb-3 font-bold text-md `}
                >
                  {/* Numérotation des véhicules */}
                  {index + 1}
                </div>
                <div className="----">
                  <div className="flex relative gap-3 md:py-2 border-2-- border-green-500--">
                    <div className="flex flex-col items-center md:min-w-32">
                      <div className={`${imgClass} mb-2`}>
                        <img src={vitesse_img} alt="" />
                      </div>

                      {/* vitesse actuelle du véhicule */}
                      <h2
                        className={`${main_text_color} sm:text-lg md:text-xl leading font-semibold whitespace-nowrap`}
                      >
                        {parseFloat(speed).toFixed(0)}
                      </h2>
                      <h2
                        className={`${main_text_color} notranslate text-[1rem] sm:text-lg md:text-xl leading-3 font-semibold whitespace-nowrap`}
                      >
                        Km/h
                      </h2>
                    </div>
                    <div>
                      {/* Nom du véhicule */}
                      <h2
                        className={`${activeTextColor} notranslate text-gray-800 dark:text-gray-100 font-semibold text-md md:text-xl mb-2 `}
                      >
                        {véhicule?.description
                          ? véhicule?.description
                          : "-----"}
                      </h2>
                      <div className="flex mb-2 gap-4 text-gray-600 text-md dark:text-gray-300">
                        <div className="flex gap-3 items-center">
                          <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300" />
                          {/* Date de dernière mise a jour */}
                          <h3 className="text-sm sm:text-sm md:text-[1rem]  lg:text-lg--">
                            {/* {véhicule?.véhiculeDetails?.[0]?.timestamp
                              ? FormatDateHeureTimestamp.date
                              : "Pas de date disponible"} */}
                            {véhicule?.lastUpdateTime
                              ? véhicule?.véhiculeDetails?.[0]?.timestamp
                                ? FormatDateHeure(
                                    véhicule?.véhiculeDetails?.[0]?.timestamp
                                  ).date
                                : FormatDateHeure(véhicule?.lastUpdateTime).date
                              : `${t("Pas de date disponible")}`}{" "}
                          </h3>
                        </div>

                        {véhicule?.lastUpdateTime ? (
                          <div className="flex items-center gap-1">
                            <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl" />
                            <h3 className="text-sm sm:text-sm md:text-[1rem] lg:text-lg--">
                              {véhicule?.véhiculeDetails?.[0]?.timestamp
                                ? FormatDateHeure(
                                    véhicule?.véhiculeDetails?.[0]?.timestamp
                                  ).time
                                : FormatDateHeure(véhicule?.lastUpdateTime)
                                    .time}
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
                        {/* Adresse du véhicule */}
                        <p className=" text-md notranslate felx sm:flex text-gray-600 mt-2 md:text-[1.1rem] dark:text-gray-300">
                          {véhicule?.véhiculeDetails?.[0]?.backupAddress ||
                            véhicule?.véhiculeDetails?.[0]?.address ||
                            `${t("Adresse non disponible")}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /////////////////////////////////////////////////////// */}
                  {/* Adresse du véhicule */}
                  <p
                    className={`${border_top} sm:hidden  pt-2 text-[.95rem] xs:text-[.9rem]-- felx  text-gray-600 mt-2 md:text-lg dark:text-gray-300 `}
                  >
                    <span
                      className={`${activeTextColor} font-semibold dark:text-orange-500--"`}
                    >
                      {t("Adresse")} :{" "}
                    </span>
                    <span className="notranslate">
                      {véhicule?.véhiculeDetails?.[0]?.backupAddress ||
                        véhicule?.véhiculeDetails?.[0]?.address ||
                        `${t("Adresse non disponible")}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center dark:text-gray-400">
          {t("Aucun véhicule trouvé")}
        </p>
      )}
    </div>
  );
}

export default Liste;
