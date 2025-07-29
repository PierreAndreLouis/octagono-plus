import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import { MdLocationPin, MdDateRange } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import { Tooltip } from "@mui/material";
import MapComponent from "../location_vehicule/MapComponent";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { LuArrowDownUp } from "react-icons/lu";

function HistoriqueMainComponent({
  loadingHistoriqueFilter,
  véhiculeHistoriqueDetails,
  appliedCheckboxes,
  setCheckboxes,
  handleCheckboxChange,
}) {
  const {
    FormatDateHeure,
    setHistoriqueSelectedLocationIndex,
    setSelectedVehicleToShowInMap,
    selectUTC,
    currentDataFusionné,
    currentVéhicule,
    selectedVehicleToShowInMap,
    updateAppareilsEtGeofencesPourCarte,
    selectedVehicleHistoriqueToShowInMap,
    setSelectedVehicleHistoriqueToShowInMap,
  } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();

  x;

  const [mapType, setMapType] = useState("streets");
  const [voirPositionSurCarte, setvoirPositionSurCarte] = useState(false);

  const [filterByColor, setFilterByColor] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setFilterByColor(null);
    }, 200);
  }, [véhiculeHistoriqueDetails]);

  const [isReverseListe, setIsReverseListe] = useState(false);

  const filteredVehicles = useMemo(() => {
    if (!véhiculeHistoriqueDetails) return [];

    const filtrés = véhiculeHistoriqueDetails.filter((véhicule) => {
      const estValideParCheckbox =
        (appliedCheckboxes.en_marche && véhicule.speedKPH > 20) ||
        (appliedCheckboxes.en_ralenti &&
          véhicule.speedKPH >= 1 &&
          véhicule.speedKPH <= 20) ||
        (appliedCheckboxes.en_arret && véhicule.speedKPH < 1);

      const estValideParCouleur =
        !filterByColor ||
        (filterByColor === "mouvement lent" &&
          véhicule.speedKPH > 0 &&
          véhicule.speedKPH < 20) ||
        (filterByColor === "mouvement rapide" && véhicule.speedKPH > 20) ||
        (filterByColor === "en stationnement" && véhicule.speedKPH <= 0) ||
        (filterByColor === "all" && véhicule.speedKPH >= -1);

      return filterByColor === null
        ? estValideParCheckbox
        : estValideParCouleur;
    });

    return isReverseListe ? filtrés.reverse() : filtrés;
  }, [
    véhiculeHistoriqueDetails,
    appliedCheckboxes,
    filterByColor,
    isReverseListe,
  ]);

  // const filteredVehicles = useMemo(() => {
  //   if (!véhiculeHistoriqueDetails) return [];

  //   return véhiculeHistoriqueDetails
  //     .filter((véhicule) => {
  //       const estValideParCheckbox =
  //         (appliedCheckboxes.en_marche && véhicule.speedKPH > 20) ||
  //         (appliedCheckboxes.en_ralenti &&
  //           véhicule.speedKPH >= 1 &&
  //           véhicule.speedKPH <= 20) ||
  //         (appliedCheckboxes.en_arret && véhicule.speedKPH < 1);

  //       const estValideParCouleur =
  //         !filterByColor ||
  //         (filterByColor === "mouvement lent" &&
  //           véhicule.speedKPH > 0 &&
  //           véhicule.speedKPH < 20) ||
  //         (filterByColor === "mouvement rapide" && véhicule.speedKPH > 20) ||
  //         (filterByColor === "en stationnement" && véhicule.speedKPH <= 0) ||
  //         (filterByColor === "all" && véhicule.speedKPH >= -1);

  //       return filterByColor === null
  //         ? estValideParCheckbox
  //         : estValideParCouleur;
  //     })
  //     .reverse();
  // }, [
  //   véhiculeHistoriqueDetails,
  //   appliedCheckboxes,
  //   filterByColor,
  //   appliedCheckboxes,
  // ]);

  const nombreDeRésultatParClique = 10;

  const [voir10RésultatPlus, setVoir10RésultatPlus] = useState(1);

  const filteredVehiclesPagination =
    filteredVehicles &&
    filteredVehicles.slice(0, voir10RésultatPlus * nombreDeRésultatParClique);
  const afficherPlusDeRésultat = () => {
    setVoir10RésultatPlus((prev) => prev + 1);
  };

  // Pour mettre a jour le véhicule actuelle

  return (
    <>
      <div className=" w-full max-w-[60rem] mx-auto pb-40">
        {voirPositionSurCarte && (
          <div className="z-20 fixed bg-black/50 inset-0 pt-20 px-4">
            <div className="relative    h-[80vh] min-w-[90vw] my-20 rounded-lg mt-3 overflow-hidden">
              <button
                className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
                onClick={() => {
                  setvoirPositionSurCarte(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                  <IoClose className="text-red-500 text-[1.62rem]" />
                </div>
              </button>

              <div className=" -translate-y-[10rem] mt-[6rem]">
                <MapComponent mapType={mapType} fromHistorique="true" />
              </div>
            </div>
          </div>
        )}
        <div className="pb-7 md:pb-0 md:pt-7 md:w-full text-center">
          {/* <div className="flex gap-3 justify-center items-center"> */}
          <h2 className="text-xl md:text-4xl  text-orange-600   md:mb-4 mt-8">
            {t("Historique")}{" "}
          </h2>

          {/* </div> */}
          <h2 className="text-gray-800 notranslate mb-10 dark:text-gray-50 font-semibold text-lg md:text-xl mb-2-- ">
            {currentVéhicule?.description ||
              `${t("Pas de véhicule sélectionné")}`}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* -{filterByColor}- */}

          <div className="flex items-end justify-center">
            <div className="mt-4 grid grid-cols-2  md:flex items-center gap-2 flex-wrap w-full">
              <p
                onClick={() => {
                  setFilterByColor("mouvement rapide");
                }}
                className={`${
                  filterByColor === "mouvement rapide"
                    ? "bg-green-100 "
                    : "bg-green-50/60"
                } px-2 cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold  hover:bg-green-100  dark:text-green-200 dark:bg-gray-700 border-l-green-600 "
                `}
              >
                {t("En mouvement rapide")}
              </p>
              <p
                onClick={() => {
                  setFilterByColor("mouvement lent");
                }}
                className={` ${
                  filterByColor === "mouvement lent"
                    ? "bg-yellow-100 "
                    : "bg-yellow-50/60"
                } px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-yellow-600 font-semibold  hover:bg-yellow-100 dark:text-yellow-200 dark:bg-gray-700 border-l-yellow-600 `}
              >
                {t("En mouvement lent")}
              </p>

              <p
                onClick={() => {
                  setFilterByColor("en stationnement");
                }}
                className={`${
                  filterByColor === "en stationnement"
                    ? "bg-red-100 "
                    : "bg-red-50/60"
                } px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-red-600 font-semibold  hover:bg-red-100 dark:text-red-200 dark:bg-gray-700 border-l-red-600 `}
              >
                {t("En stationnement")}
              </p>
              <p
                onClick={() => {
                  setFilterByColor("all");
                  // handleCheckboxChange("en_marche");
                  // handleCheckboxChange("en_ralenti");
                  // handleCheckboxChange("en_arret");
                }}
                className="px-6 cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-blue-600 font-semibold bg-blue-50/60 hover:bg-blue-100  dark:text-blue-200 dark:bg-gray-700 border-l-blue-600 "
              >
                {t("All")}
              </p>
            </div>
            <div className="w-[3rem] flex justify-end">
              {filteredVehiclesPagination?.length > 0 && (
                <p
                  onClick={() => {
                    setIsReverseListe(!isReverseListe);
                  }}
                  className="text-md bg-orange-50 hover:bg-orange-100 h-full border border-orange-200 p-2 rounded-md text-orange-500 cursor-pointer"
                >
                  <LuArrowDownUp className="text-[1.3rem]" />
                </p>
              )}
            </div>{" "}
          </div>

          {loadingHistoriqueFilter ? (
            <p className="text-center">{t("Chargement des données")}...</p>
          ) : véhiculeHistoriqueDetails.length > 0 ? (
            (() => {
              return filteredVehiclesPagination.length > 0 ? (
                filteredVehiclesPagination.map((véhicule, reversedIndex) => {
                  const index =
                    filteredVehiclesPagination.length - 1 - reversedIndex; // Calculer l'index original
                  const numero = filteredVehiclesPagination?.length - index;
                  const numero2 = filteredVehicles?.length;

                  const speed = véhicule.speedKPH || 0;

                  // Définir les couleurs en fonction de la vitesse
                  let main_text_color,
                    lite_bg_color,
                    active_bg_color,
                    imgClass,
                    activeTextColor,
                    statut,
                    vitess_img;
                  if (speed < 1) {
                    main_text_color = "text-red-900 dark:text-red-300";
                    statut = `${t("En stationnement")}`;
                    lite_bg_color =
                      "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-red-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
                    activeTextColor = "text-red-900 dark:text-red-200";
                    active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
                    vitess_img = "img/cars/orange_vitess.png";
                    imgClass = "w-14 sm:w-16 md:w-20";
                  } else if (speed >= 1 && speed <= 20) {
                    main_text_color = "text-[#555b03] dark:text-yellow-300";
                    statut = `${t("En mouvement lent")}`;
                    lite_bg_color =
                      "bg-[#ffff001b] dark:bg-gray-900/40 dark:shadow-yellow-300/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-yellow-400/80  shadow-lg shadow-gray-950/20";
                    activeTextColor = "text-[#555b03] dark:text-yellow-100";
                    active_bg_color = "bg-yellow-400/20 dark:bg-yellow-600/20";
                    vitess_img = "img/cars/yellow_vitess.png";
                    imgClass = "w-12 sm:w-14 md:w-20";
                  } else {
                    main_text_color = "text-green-700 dark:text-green-400";
                    statut = `${t("En mouvement rapide")}`;
                    lite_bg_color =
                      "bg-green-100/50 dark:bg-gray-900/40 dark:shadow-green-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
                    activeTextColor = "text-green-800 dark:text-green-200";
                    active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
                    vitess_img = "img/cars/green_vitess.png";
                    imgClass = "w-12 sm:w-14 md:w-20";
                  }

                  const timeStampGMT = (
                    parseInt(véhicule.timestamp, 10) +
                    (selectUTC + 5) * 60 * 60
                  ).toString();

                  const FormatDateHeureTimestamp = FormatDateHeure(
                    véhicule.timestamp
                  );

                  const indexDansHistorique =
                    véhiculeHistoriqueDetails.findIndex(
                      (v) =>
                        v.timestamp === véhicule.timestamp &&
                        v.deviceID === véhicule.deviceID
                    );

                  //   FormatDateHeure(timeStampData);
                  return (
                    <Tooltip
                      title={`${t("Voir cette position sur la carte")}`}
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -10], // Décalage horizontal et vertical
                            },
                          },
                        ],
                      }}
                    >
                      <div
                        onClick={() => {
                          setSelectedVehicleToShowInMap(
                            currentVéhicule?.deviceID
                          );
                          setHistoriqueSelectedLocationIndex(
                            indexDansHistorique
                          );
                          setSelectedVehicleHistoriqueToShowInMap(true);

                          setvoirPositionSurCarte(true);
                        }}
                        key={index}
                        className={`${lite_bg_color} shadow-md relative rounded-lg p-3 w-full`}
                      >
                        <div
                          className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-3 pb-3 font-bold text-md `}
                        >
                          {isReverseListe ? numero2 : numero}
                        </div>
                        <div className="flex relative gap-3 md:py-4--">
                          <div className="flex  flex-col items-center md:min-w-32">
                            <div className={`${imgClass} mb-2`}>
                              <img src={vitess_img} alt="" />
                            </div>
                            <h2
                              className={`${main_text_color} sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
                            >
                              {parseFloat(speed).toFixed(0)}
                            </h2>
                            <h2
                              className={`${main_text_color} text-[1rem] sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
                            >
                              Km/h
                            </h2>
                          </div>
                          <div className=" flex justify-center items-center">
                            <div className="">
                              <div className="flex mb-2 gap-4 text-gray-600 dark:text-gray-200 text-md">
                                <div className="flex gap-3 items-center">
                                  <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300" />
                                  <h3 className="text-sm sm:text-sm md:text-md">
                                    {véhicule.timestamp
                                      ? FormatDateHeureTimestamp.date
                                      : `${t("Pas de date disponible")}`}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IoMdTime
                                    id="time-icon"
                                    className="text-gray-500/80 text-xl dark:text-gray-300"
                                  />
                                  <h3 className="text-sm sm:text-sm md:text-md">
                                    {FormatDateHeureTimestamp?.time}
                                  </h3>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <div>
                                  <FaCar className="text-gray-500/80 dark:text-gray-300" />
                                </div>
                                <span
                                  className={` ${active_bg_color} ml-1 ${activeTextColor} pb-[.2rem] px-2 py-0 text-sm rounded-md `}
                                >
                                  {statut}
                                </span>
                              </div>
                              <div className="flex gap-1 ">
                                <div>
                                  <MdLocationPin className="text-xl dark:text-gray-300 text-gray-500/80 -translate-x-0.5 mt-3" />
                                </div>
                                <p className="text-md flex text-gray-600 dark:text-gray-300 mt-2 md:text-lg">
                                  {véhicule?.backupAddress ||
                                    véhicule.address ||
                                    `${t("Adresse non disponible")}`}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  );
                })
              ) : (
                <p className="text-center">
                  {t("Pas de résultat")}{" "}
                  {/* <span className=" text-orange-600">pour le filtre</span> */}
                </p>
              );
            })()
          ) : (
            <p className="text-center dark:text-gray-50">
              {t("Pas de résultat")}
            </p>
          )}
          {filteredVehicles.length > filteredVehiclesPagination?.length &&
            filteredVehiclesPagination?.length > 0 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => afficherPlusDeRésultat()}
                  className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                >
                  {t("Voir plus de Résultat")}
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default HistoriqueMainComponent;
