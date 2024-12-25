import React, { useContext, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";

import { Chart, registerables } from "chart.js";
import { FaCar } from "react-icons/fa";

import { FaChevronDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

// import "leaflet/dist/leaflet.css";

function RapportPageDetailsHeader({
  setShowOptions,
  showOptions,
  currentVehicule,
  setPersonnelDetails,
  vehiculeActiveAjourdhui,
  handleClick,
  vehiculeNotActiveAjourdhui,
  vehiculeNotActif,
  personnelDetails,
  formatTimestampToTimeWithTimezone,
  formatTimestampToTime,
  setpageSection,
  setShowChooseDate,
  pageSection,
}) {
  const { selectUTC, currentdataFusionnee } = useContext(DataContext); // const { currentVehicule } = useContext(DataContext);
  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  // Trouver la date du rapport
  // const timestampInSecondsDebut =
  //   currentVehicule?.vehiculeDetails[
  //     currentVehicule?.vehiculeDetails.length - 1
  //   ]?.timestamp;

  // const donneeVehiculeDetails = currentdataFusionnee?.find(
  //   (vehicule) =>
  //     vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  // )?.vehiculeDetails;

  // const premierDetail =
  //   donneeVehiculeDetails[donneeVehiculeDetails?.length - 1]?.timestamp;
  // const dernierDetails = donneeVehiculeDetails[0]?.timestamp;

  const donneeVehiculeDetails = currentdataFusionnee?.find(
    (vehicule) =>
      vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  )?.vehiculeDetails;

  const premierDetail =
    donneeVehiculeDetails?.[donneeVehiculeDetails.length - 1]?.timestamp;

  const dernierDetails = donneeVehiculeDetails?.[0]?.timestamp;

  const timestampInSecondsDebut = premierDetail;
  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  // const timestampInSecondsFin = currentVehicule?.vehiculeDetails[0]?.timestamp;
  const timestampInSecondsFin = dernierDetails;
  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  const [showHistoriquePupup, setshowHistoriquePupup] = useState(false);
  const [ordreCroissant, setordreCroissant] = useState(true);
  // const [searchTerm, setSearchTerm] = useState(""); // Gère le terme de recherche de véhicule

  const [lieuxFrequentePupup, setlieuxFrequentePupup] = useState(false);
  const [lieuxFrequentePupupSearch, setlieuxFrequentePupupSearch] =
    useState(false);
  const [checkboxes, setCheckboxes] = useState({
    en_marche: true,
    en_ralenti: true,
    en_arret: true,
  });

  const [appliedCheckboxes, setAppliedCheckboxes] = useState(checkboxes);
  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les adresses en fonction du terme de recherche
  // const filteredAddresses = uniqueAddresses?.filter((adresse) =>
  //   adresse.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const filteredVehicles = currentdataFusionnee?.filter((vehicule) =>
    vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className=" shadow-md shadow-gray-400/20 pb-2">
      <div
        onClick={() => {
          setShowOptions(!showOptions);
        }}
        className="relative pt-5-- mx-4 mb-2"
      >
        {pageSection === "unite" && (
          <div className="flex justify-between cursor-pointer border rounded-md px-3 py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-500 dark:text-gray-300 text-center">
            <p className="text-start w-[90%] dark:text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis">
              {personnelDetails &&
                !currentVehicule?.description &&
                "Choisissez un véhicule"}

              {personnelDetails && currentVehicule?.description}

              {!personnelDetails && "Rapport en groupe"}
            </p>

            <div
              className={`${
                !showOptions ? "rotate-0" : "rotate-180"
              } transition-all`}
            >
              {!showOptions ? (
                <FaChevronDown className="mt-1" />
              ) : (
                <IoMdClose className="mt-1 text-xl text-red-500 -translate-y-[.2rem] -translate-x-[.1rem]" />
              )}
            </div>
          </div>
        )}
      </div>

      {showOptions && (
        <div className="fixed  pt-[5.5rem] p-4 dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-lg dark:shadow-gray-950 text-gray-500 top-20 rounded-lg bg-white right-0 left-0 min-h-20 shadow-lg shadow-gray-600/80">
          <div className="absolute top-[2.4rem] left-4 right-4 p-2">
            <input
              className="w-full border p-4 py-1.5 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              type="text"
              placeholder="Recherche"
              value={searchQuery}
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
          <div className="overflow-auto h-[40vh]">
            {filteredVehicles?.length > 0 ? (
              filteredVehicles?.map((vehicule, index) => {
                const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
                const currentTime = Date.now(); // Heure actuelle en millisecondes

                const isMoving = vehicule.vehiculeDetails?.some(
                  (detail) => detail.speedKPH >= 1
                );

                const hasDetails =
                  vehicule.vehiculeDetails &&
                  vehicule.vehiculeDetails.length > 0;

                const noSpeed = vehicule.vehiculeDetails?.every(
                  (detail) => detail.speedKPH <= 0
                );

                // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                const lastUpdateTimeMs = vehicule.lastUpdateTime
                  ? vehicule.lastUpdateTime * 1000
                  : 0;
                const isActive =
                  currentTime - lastUpdateTimeMs < twentyHoursInMs;

                let iconBg = "text-red-500";

                if (hasDetails && isMoving) {
                  iconBg = "text-green-500";
                } else if (hasDetails && noSpeed && isActive) {
                  iconBg = "text-red-500";
                } else if (!hasDetails || !isActive) {
                  iconBg = "text-purple-500";
                }

                return (
                  <div
                    key={vehicule.deviseID}
                    onClick={() => {
                      handleClick(vehicule);
                      setShowOptions(false);
                    }}
                    className={`${
                      vehicule.description === currentVehicule?.description &&
                      "bg-orange-50"
                    }  cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-gray-700`}
                  >
                    <FaCar
                      className={` ${iconBg}   text-orange-600/80--- min-w-8 text-lg dark:text-orange-400 `}
                    />
                    <p className="text-gray-700 dark:text-white">
                      {index + 1} - {vehicule.description || "---"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-center px-3 mt-10">Pas de resultat</p>
            )}
          </div>
        </div>
      )}
      {currentdataFusionnee.length > 0 &&
        (pageSection === "unite" || pageSection === "groupe") && (
          <div className="flex justify-between gap-3 px-4 ">
            <div className="sm:flex w-full   gap-10 max-w-[50rem] mx-4-- justify-start items-center ">
              <div className="flex gap-0 items-center">
                <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                    {
                      // true ||
                      // jourDebut === jourFin &&
                      // moisDebut === moisFin &&
                      // anneeDebut === anneeFin ? (
                      //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      //     <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                      //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                      //       {anneeDebut || ""}
                      //     </span>{" "}
                      //   </span>
                      // ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                      // )
                    }
                  </span>
                </p>
              </div>

              <div className="flex gap-0 items-center">
                <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                    De{" "}
                    <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            vehiculeActiveAjourdhui[0]?.vehiculeDetails[
                              vehiculeActiveAjourdhui[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp ||
                              vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[
                                vehiculeNotActiveAjourdhui[0]?.vehiculeDetails
                                  .length - 1
                              ]?.timestamp ||
                              vehiculeNotActif[0]?.vehiculeDetails[
                                vehiculeNotActif[0]?.vehiculeDetails.length - 1
                              ]?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            vehiculeActiveAjourdhui[0]?.vehiculeDetails[
                              vehiculeActiveAjourdhui[0]?.vehiculeDetails
                                .length - 1
                            ]?.timestamp ||
                              vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[
                                vehiculeNotActiveAjourdhui[0]?.vehiculeDetails
                                  .length - 1
                              ]?.timestamp ||
                              vehiculeNotActif[0]?.vehiculeDetails[
                                vehiculeNotActif[0]?.vehiculeDetails.length - 1
                              ]?.timestamp
                          )}
                    </span>{" "}
                    a{" "}
                    <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            vehiculeActiveAjourdhui[0]?.vehiculeDetails[0]
                              ?.timestamp ||
                              vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[0]
                                ?.timestamp ||
                              vehiculeNotActif[0]?.vehiculeDetails[0]
                                ?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            vehiculeActiveAjourdhui[0]?.vehiculeDetails[0]
                              ?.timestamp ||
                              vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[0]
                                ?.timestamp ||
                              vehiculeNotActif[0]?.vehiculeDetails[0]?.timestamp
                          )}
                    </span>{" "}
                  </span>
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                setShowChooseDate(true);
              }}
              className="flex  gap-2 items-center cursor-pointer"
            >
              <FaRegCalendarAlt className="text-xl mt-2- text-orange-500" />
            </div>
          </div>
        )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/* <div className="border-b mt-2 border-orange-400/50 dark:border-gray-700 " /> */}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  );
}

export default RapportPageDetailsHeader;
