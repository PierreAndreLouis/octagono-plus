import React, { useContext, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";

import { Chart, registerables } from "chart.js";

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

        {showOptions && (
          <div className="absolute  pt-10== p-4 dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-lg dark:shadow-gray-950 text-gray-500 top-20 rounded-lg bg-white right-0 left-0 min-h-20 shadow-lg shadow-gray-600/80">
            <div
              onClick={() => {
                setShowOptions(!showOptions);
              }}
              className="flex justify-end"
            >
              <IoMdClose className="mt-1 text-2xl cursor-pointer text-end text-red-500 -translate-y-[.2rem] -translate-x-[.1rem]" />
            </div>
            <div className="overflow-auto h-[40vh]">
              {/* <div
              onClick={() => {
                setShowOptions(!showOptions);
                setPersonnelDetails(false);
              }}
              className="border-b rounded-lg mt-1 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 flex gap-5 items-center border-gray-300 py-3"
            >
              <div className="min-w-[2.5rem]">
                <img
                  className="w-[2em] ml-2"
                  src="/img/home_icon/total.png"
                  alt="Icône total"
                />
              </div>

              <h3 className="dark:text-gray-200">Rapport de groupe</h3>
            </div> */}

              {vehiculeActiveAjourdhui &&
                vehiculeActiveAjourdhui.map((vehicule, index) => {
                  return (
                    <div
                      onClick={() => {
                        setShowOptions(!showOptions);
                        handleClick(vehicule);
                      }}
                      className="border-b rounded-lg mt-1 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 flex gap-5 items-center border-gray-300 py-3"
                    >
                      <div className="min-w-[2.5rem]">
                        <img
                          className="w-[2.5em]"
                          src="/img/home_icon/active.png"
                          alt="Icône actif"
                        />
                      </div>
                      <h3 className="dark:text-gray-200">
                        {/* {!personnelDetails || "Rapport en groupe"}
                      {(personnelDetails && vehicule.description) || "---"} */}
                        {vehicule.description || "---"}
                      </h3>
                    </div>
                  );
                })}

              {vehiculeNotActiveAjourdhui &&
                vehiculeNotActiveAjourdhui.map((vehicule, index) => {
                  return (
                    <div
                      onClick={() => {
                        setShowOptions(!showOptions);
                        handleClick(vehicule);
                      }}
                      className="border-b rounded-lg mt-1 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 flex gap-5 items-center border-gray-300 py-3"
                    >
                      <div className="min-w-[2.5rem]">
                        <img
                          className="w-[2em] ml-2"
                          src="/img/cars/parking.png"
                          alt="Icône parking"
                        />
                      </div>
                      <h3 className="dark:text-gray-200">
                        {vehicule.description || "---"}
                      </h3>
                    </div>
                  );
                })}

              {vehiculeNotActif &&
                vehiculeNotActif.map((vehicule, index) => {
                  return (
                    <div
                      onClick={() => {
                        setShowOptions(!showOptions);
                        handleClick(vehicule);
                      }}
                      className="border-b rounded-lg mt-1 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 flex gap-5 items-center border-gray-300 py-3"
                    >
                      <div className="min-w-[2.5rem]">
                        <img
                          className="w-[1.72em] ml-1"
                          src="/img/home_icon/payer.png"
                          alt="Icône paiement"
                        />
                      </div>
                      <h3 className="dark:text-gray-200">
                        {vehicule.description || "---"}
                      </h3>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
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
