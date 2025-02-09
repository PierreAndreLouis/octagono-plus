import React, { useContext, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

import { FaRegFilePdf } from "react-icons/fa6";
import { LuFileDown } from "react-icons/lu";

import { Chart, registerables } from "chart.js";
import { FaCar } from "react-icons/fa";

import { FaChevronDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import SearchVehiculePupup from "./SearchVehiculePupup";
import Tooltip from "@mui/material/Tooltip";

// import "leaflet/dist/leaflet.css";

function RapportPageDetailsHeader({
  setShowOptions,
  showOptions,
  // currentVéhicule,
  setPersonnelDetails,
  véhiculeActiveToday,
  handleClick,
  véhiculeNotActiveToday,
  véhiculeHorsService,
  personnelDetails,
  formatTimestampToTimeWithTimezone,
  formatTimestampToTime,
  setpageSection,
  setShowChooseDate,
  pageSection,
  startDate,
  startTime,
  endDate,
  endTime,
  fonctiondownloadExelPDF,
}) {
  const {
    currentVéhicule,
    currentDataFusionné,
    tableRef,
    rapportPersonnelPDFtRef,
    rapportGroupePDFtRef,
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);
  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  const [pdfDownloadPupup, setPdfDownloadPupup] = useState(false);

  // // Fonction d'exportation
  const exportToExcel = () => {
    console.log("Start Excel export");
    if (tableRef.current) {
      const workbook = XLSX.utils.table_to_book(tableRef.current);
      XLSX.writeFile(workbook, "Tables des vehicules.xlsx");
      console.log("Finish Excel export");
    } else {
      console.error("Tableau introuvable.");
    }
  };

  // const generatePersonelPDF = () => {
  //   console.log("Start PDF export");

  //   const element = rapportPersonnelPDFtRef.current; // Cible l'élément avec useRef
  //   html2pdf()
  //     .from(element)
  //     .save(`Rapport personnel (${currentVéhicule?.description}) .pdf`);
  //   console.log("Finish PDF export");
  // };

  const generatePersonelPDF = () => {
    fonctiondownloadExelPDF();

    setTimeout(() => {
      const element = rapportPersonnelPDFtRef.current; // Cible l'élément avec useRef
      html2pdf()
        .from(element)
        .save(`Rapport personnel (${currentVéhicule?.description}) .pdf`);
    }, 1000); // Délai d'attente de 2 secondes
  };

  const generateGroupePDF = () => {
    fonctiondownloadExelPDF();

    setTimeout(() => {
      const element = rapportGroupePDFtRef.current; // Cible l'élément avec useRef
      html2pdf().from(element).save("Rapport en Groupe.pdf");
    }, 1000); // Délai d'attente de 2 secondes
  };

  const donneeVehiculeDetails = currentDataFusionné?.find(
    (véhicule) =>
      véhicule.véhiculeDetails && véhicule.véhiculeDetails.length > 0
  )?.véhiculeDetails;

  const premierDetail =
    donneeVehiculeDetails?.[donneeVehiculeDetails.length - 1]?.timestamp;

  const dernierDetails = donneeVehiculeDetails?.[0]?.timestamp;

  const timestampInSecondsDebut = premierDetail;
  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  // const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  // const timestampInSecondsFin = currentVéhicule?.véhiculeDetails[0]?.timestamp;
  const timestampInSecondsFin = dernierDetails;
  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  // const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

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

  const [searchQueryRapportPageDetailHeader, setRapportPageDetailHeader] =
    useState("");

  const handleSearchChange = (e) => {
    e.preventDefault();
    setRapportPageDetailHeader(e.target.value);
  };

  const filteredVehicles = currentDataFusionné?.filter(
    (véhicule) =>
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase())
  );

  ///////////////////////////////////////////////////////////////////////////////

  // const {
  //   startDate,
  //   startTime,
  //   endDate,
  //   endTime,
  // } = useContext(DataContext);

  // Fonction pour extraire le jour, le mois, l'année et l'heure en AM/PM
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const day = date.getDate(); // Jour du mois en chiffre

    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.getFullYear();

    return { day, month, year };
  };

  const {
    day: jourDebut,
    month: moisDebut,
    year: anneeDebut,
  } = formatDate(startDate);
  const { day: jourFin, month: moisFin, year: anneeFin } = formatDate(endDate);

  const formatTo12Hour = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convertir l'heure 0 à 12 (minuit) en 12 AM
    const period = isAM ? "AM" : "PM";
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Convertir les heures
  const heureDebut = formatTo12Hour(startTime);
  const heureFin = formatTo12Hour(endTime);

  // console.log("Jour Début:", jourDebut);
  // console.log("Mois Début:", moisDebut);
  // console.log("Année Début:", anneeDebut);

  // console.log("Jour Fin:", jourFin);
  // console.log("Mois Fin:", moisFin);
  // console.log("Année Fin:", anneeFin);

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
                !currentVéhicule?.description &&
                "Choisissez un véhicule"}

              {personnelDetails && currentVéhicule?.description}

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
        <SearchVehiculePupup
          searchQueryListPopup={searchQueryRapportPageDetailHeader}
            setSearchQueryListPopup={setRapportPageDetailHeader}

          handleSearchChange={handleSearchChange}
          setShowOptions={setShowOptions}
          filteredVehicles={filteredVehicles}
          handleClick={handleClick}
          currentVéhicule={currentVéhicule}
          isMapcomponent="false"
        />
      )}
      {currentDataFusionné.length > 0 &&
        (pageSection === "unite" || pageSection === "groupe") && (
          <div className="flex justify-between gap-3 px-4 ">
            <div className="sm:flex w-full   gap-10 max-w-[50rem] mx-4-- justify-start items-center ">
              <div className="flex gap-0 items-center">
                <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                    {
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
                      {heureDebut}
                    </span>{" "}
                    a{" "}
                    <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                      {heureFin}
                    </span>{" "}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                {(currentVéhicule || pageSection === "groupe") && (
                  <Tooltip
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -3], // Décalage horizontal et vertical
                          },
                        },
                        {
                          name: "zIndex",
                          enabled: true,
                          phase: "write",
                          fn: ({ state }) => {
                            state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                          },
                        },
                      ],
                    }}
                    title="Telecharger en PDF"
                  >
                    <div
                      onClick={() => {
                        setPdfDownloadPupup(true);
                      }}
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <LuFileDown className="text-[1.3rem] mt-2- text-orange-500" />
                    </div>
                  </Tooltip>
                )}
                {pdfDownloadPupup && (
                  <div
                    // onClick={() => {
                    //   setPdfDownloadPupup(false);
                    // }}
                    className="absolute rounded-lg flex flex-col gap-0 bg-white top-8 border -right-10 z-[1111] shadow-lg shadow-gray-300 w-[80vw] max-w-[30rem] p-4 pt-0"
                  >
                    <div className="flex justify-between mx-2 mt-4 mb-3">
                      <p className="font-semibold text-orange-500 text-lg">
                        Telecharger{" "}
                        {pageSection === "unite" ? "(Unite)" : "(Groupe)"}
                      </p>
                      <IoMdClose
                        onClick={() => {
                          setPdfDownloadPupup(false);
                        }}
                        className=" text-xl text-red-500 cursor-pointer"
                      />
                    </div>
                    {pageSection === "unite" && (
                      <div
                        onClick={() => {
                          generatePersonelPDF();
                          setPdfDownloadPupup(false);
                        }}
                        className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
                      >
                        <p>Telecharger le rapport en PDF</p>
                        <img
                          className="w-[2rem]"
                          src="/img/pdf_download.png"
                          alt=""
                        />
                      </div>
                    )}
                    {pageSection !== "unite" && (
                      <div
                        onClick={() => {
                          generateGroupePDF();
                          setPdfDownloadPupup(false);
                        }}
                        className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
                      >
                        <p>Telecharger le rapport en PDF</p>
                        <img
                          className="w-[2rem]"
                          src="/img/pdf_download.png"
                          alt=""
                        />
                      </div>
                    )}
                    {pageSection !== "unite" && (
                      <div
                        onClick={() => {
                          exportToExcel();
                          setPdfDownloadPupup(false);
                        }}
                        className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
                      >
                        <p>Telecharger le tableau recapitulatif en Exel</p>
                        <img
                          className="w-[2rem]"
                          src="/img/exel_download.png"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Tooltip
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -3], // Décalage horizontal et vertical
                      },
                    },
                    {
                      name: "zIndex",
                      enabled: true,
                      phase: "write",
                      fn: ({ state }) => {
                        state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                      },
                    },
                  ],
                }}
                title="Recherche par date"
              >
                <div
                  onClick={() => {
                    setShowChooseDate(true);
                  }}
                  className="flex  gap-2 items-center cursor-pointer"
                >
                  <FaRegCalendarAlt className="text-xl mt-2- text-orange-500" />
                </div>
              </Tooltip>
            </div>
          </div>
        )}

      {/*  */}
    </div>
  );
}

export default RapportPageDetailsHeader;
