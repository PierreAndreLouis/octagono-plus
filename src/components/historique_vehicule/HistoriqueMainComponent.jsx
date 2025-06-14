import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { MdLocationPin, MdDateRange } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import { Tooltip } from "@mui/material";
import MapComponent from "../location_vehicule/MapComponent";
import { MdOutlineFullscreen } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function HistoriqueMainComponent({
  // currentVéhicule,
  loadingHistoriqueFilter,
  véhiculeHistoriqueDetails,
  appliedCheckboxes,
  setShowListOption,
  // selectUTC,
}) {
  const {
    FormatDateHeure,
    setHistoriqueSelectedLocationIndex,
    setSelectedVehicleToShowInMap,
    selectUTC,
    currentDataFusionné,
    setCurrentVéhicule,
    currentVéhicule,
    selectedVehicleToShowInMap,
    setVéhiculeHistoriqueDetails,
  } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();

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
  //
  x;

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // const targetDeviceID = "864893039477131";

  // const véhicule = currentDataFusionné?.find(
  //   (véhicule) => véhicule?.deviceID === targetDeviceID
  // );

  // if (véhicule) {
  //   console.log("Véhicule trouvé :", véhicule);
  //   console.log("VéhiculeDetails trouvé :", véhicule?.véhiculeDetails);
  //   console.log(
  //     "VéhiculeDetails Length trouvé :",
  //     véhicule?.véhiculeDetails.length
  //   );
  // } else {
  //   console.log("Aucun véhicule trouvé avec ce deviceID.");
  // }
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
  //
  //
  //
  x;

  const [mapType, setMapType] = useState("streets");
  const [voirPositionSurCarte, setvoirPositionSurCarte] = useState(false);

  // Pour mettre a jour le véhicule actuelle
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentVéhicule) {
        console.log("mise a jour véhicule Details");

        const deviceID = currentVéhicule?.deviceID;

        const foundVehicle = currentDataFusionné?.find(
          (v) => v.deviceID === deviceID
        );

        // setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
        // setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
        // setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection      console.log("Mise à jour régulière des données");
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []); // Pas de dépendances, exécution régulière

  useEffect(() => {
    // console.log(currentVéhicule);
    // console.log(véhiculeHistoriqueDetails);
    // console.log(selectedVehicleToShowInMap);
  }, [currentVéhicule, véhiculeHistoriqueDetails, selectedVehicleToShowInMap]);

  return (
    <>
      <div>
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

              <div className=" -translate-y-[10rem]">
                <MapComponent mapType={mapType} />
              </div>
            </div>
          </div>
        )}
        <div className="pb-7 md:pb-0 md:pt-7 md:w-full text-center">
          <h2 className="text-xl md:text-4xl md:mb-4 text-orange-600">
            {t("Historique")}{" "}
          </h2>
          <h2 className="text-gray-800 notranslate mb-10 dark:text-gray-50 font-semibold text-lg md:text-xl mb-2-- ">
            {currentVéhicule?.description ||
              `${t("Pas de véhicule sélectionné")}`}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {loadingHistoriqueFilter ? (
            <p className="text-center">{t("Chargement des données")}...</p>
          ) : véhiculeHistoriqueDetails.length > 0 ? (
            (() => {
              const filteredVehicles = véhiculeHistoriqueDetails.filter(
                (véhicule) =>
                  (appliedCheckboxes.en_marche && véhicule.speedKPH > 20) ||
                  (appliedCheckboxes.en_ralenti &&
                    véhicule.speedKPH >= 1 &&
                    véhicule.speedKPH <= 20) ||
                  (appliedCheckboxes.en_arret && véhicule.speedKPH < 1)
              );

              return filteredVehicles.length > 0 ? (
                filteredVehicles
                  .slice() // Créer une copie pour éviter de modifier la liste originale
                  .reverse()
                  .map((véhicule, reversedIndex) => {
                    const index = filteredVehicles.length - 1 - reversedIndex; // Calculer l'index original
                    const numero = filteredVehicles.length - index;

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
                      active_bg_color =
                        "bg-yellow-400/20 dark:bg-yellow-600/20";
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

                            setHistoriqueSelectedLocationIndex(index);

                            setvoirPositionSurCarte(true);
                            // console.log(véhicule);
                          }}
                          key={index}
                          className={`${lite_bg_color} shadow-md relative rounded-lg p-3`}
                        >
                          <div
                            // onClick={() => {
                            //   console.log(véhicule.timestamp);
                            //   console.log(véhicule);
                            // }}
                            className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-3 pb-3 font-bold text-md `}
                          >
                            {numero}
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
              Aucune donnée disponible
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default HistoriqueMainComponent;
