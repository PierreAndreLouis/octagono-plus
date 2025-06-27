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
import { MdErrorOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

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
  totalDevice,
}) {
  const {
    currentVéhicule,
    currentDataFusionné,
    tableRef,
    rapportPersonnelPDFtRef,
    rapportGroupePDFtRef,
    mergedDataHome,
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    FormatDateHeure,
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  let x;
  // Le data converti en Objet
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let deviceListeSelected;

  if (isDashboardHomePage && currentAccountSelected) {
    deviceListeSelected = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    deviceListeSelected = accountDevices;
  } else if (!isDashboardHomePage) {
    deviceListeSelected = dataFusionné;
  }

  // const formatTime = (hours, minutes, seconds) => {
  //   if (hours > 0 || minutes > 0 || seconds > 0) {
  //     return `${hours > 0 ? hours + "h " : ""}${
  //       minutes > 0 ? minutes + "m " : ""
  //     }${seconds > 0 ? seconds + "s" : ""}`;
  //   }
  //   return "0s";
  // };

  const [pdfDownloadPupup, setPdfDownloadPupup] = useState(false);

  // // Fonction d'exportation
  const exportToExcel = () => {
    console.log("Start Excel export");
    if (tableRef.current) {
      const workbook = XLSX.utils.table_to_book(tableRef.current);
      XLSX.writeFile(workbook, `${t("Tables des véhicules")}.xlsx`);
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
        .save(
          `${t("Rapport personnel")} (${currentVéhicule?.description}).pdf`
        );
    }, 1000); // Délai d'attente de 2 secondes
  };

  const generateGroupePDF = () => {
    fonctiondownloadExelPDF();

    setTimeout(() => {
      const element = rapportGroupePDFtRef.current; // Cible l'élément avec useRef
      html2pdf()
        .from(element)
        .save(`${t("Rapport en Groupe")}.pdf`);
    }, 1000); // Délai d'attente de 2 secondes
  };

  // const generateTableGroupePDF = () => {
  //   fonctiondownloadExelPDF();

  //   setTimeout(() => {
  //     const element = tableRef.current; // Cible l'élément avec useRef
  //     html2pdf()
  //       .from(element)
  //       .save("Rapport Tableau Récapitulatif en Groupe.pdf");
  //   }, 1000); // Délai d'attente de 2 secondes
  // };

  const generateTableGroupePDF = () => {
    fonctiondownloadExelPDF();

    setTimeout(() => {
      const element = tableRef.current;

      const options = {
        margin: 10,
        filename: `${t("Rapport Tableau Récapitulatif en Groupe")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Permet de capturer correctement les styles
        jsPDF: {
          unit: "mm",
          format: [700, 1000], // Largeur fixée à 250mm, hauteur ajustée dynamiquement
          // format: [700, element.scrollHeight], // Largeur fixée à 250mm, hauteur ajustée dynamiquement
          orientation: "portrait",
        },
      };

      html2pdf().set(options).from(element).save();
    }, 1000);
  };

  const donneeVehiculeDetails = currentDataFusionné?.find(
    (véhicule) =>
      véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0
  )?.véhiculeDetails;

  const premierDetail =
    donneeVehiculeDetails?.[donneeVehiculeDetails.length - 1]?.timestamp;

  const dernierDetails = donneeVehiculeDetails?.[0]?.timestamp;

  // const timestampInSecondsDebut = premierDetail;
  // const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  // const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  // const timestampInSecondsFin = currentVéhicule?.véhiculeDetails[0]?.timestamp;
  // const timestampInSecondsFin = dernierDetails;
  // const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  // const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  // const [showHistoriquePupup, setshowHistoriquePupup] = useState(false);
  // const [ordreCroissant, setordreCroissant] = useState(true);
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

  const filteredVehicles = deviceListeSelected?.filter(
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

  // const {
  //   day: jourDebut,
  //   month: moisDebut,
  //   year: anneeDebut,
  // } = formatDate(startDate);
  // const { day: jourFin, month: moisFin, year: anneeFin } = formatDate(endDate);

  const formatTo12Hour = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convertir l'heure 0 à 12 (minuit) en 12 AM
    const period = isAM ? "AM" : "PM";
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Convertir les heures
  // const heureDebut = formatTo12Hour(startTime);
  // const heureFin = formatTo12Hour(endTime);

  // console.log("Jour Début:", jourDebut);
  // console.log("Mois Début:", moisDebut);
  // console.log("Année Début:", anneeDebut);

  // console.log("Jour Fin:", jourFin);
  // console.log("Mois Fin:", moisFin);
  // console.log("Année Fin:", anneeFin);

  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  const moisEnLettres = [
    `${t("janvier")}`,
    `${t("février")}`,
    `${t("mars")}`,
    `${t("avril")}`,
    `${t("mai")}`,
    `${t("juin")}`,
    `${t("juillet")}`,
    `${t("août")}`,
    `${t("septembre")}`,
    `${t("octobre")}`,
    `${t("novembre")}`,
    `${t("décembre")}`,
  ];
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
  // Fonction pour avoir le timestamp le plus recent
  function getMostRecentTimestamp(data) {
    // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
    const validTimestamps = data
      ?.filter(
        (véhicule) =>
          Array.isArray(véhicule?.véhiculeDetails) &&
          véhicule?.véhiculeDetails.length > 0
      )
      .map((véhicule) => parseInt(véhicule?.véhiculeDetails[0].timestamp));

    // Trouver le timestamp le plus récent
    const mostRecentTimestamp = validTimestamps && Math.max(...validTimestamps);

    return { mostRecentTimestamp };
  }
  const mostRecentTimestamp = getMostRecentTimestamp(
    currentDataFusionné && currentDataFusionné
  )?.mostRecentTimestamp;
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

  // Pour avoir le timestamp le plus ancien
  function getMostOldTimestamp(data) {
    // Filtrer les entrées avec un tableau véhiculeDetails valide et non vide
    const validTimestamps = data
      ?.filter(
        (véhicule) =>
          Array.isArray(véhicule?.véhiculeDetails) &&
          véhicule?.véhiculeDetails.length > 0
      )
      .map((véhicule) =>
        parseInt(
          véhicule?.véhiculeDetails[véhicule?.véhiculeDetails.length - 1]
            .timestamp
        )
      );

    // Trouver le timestamp le plus récent
    const mostOldTimestamp = validTimestamps && Math.min(...validTimestamps);

    return { mostOldTimestamp };
  }

  // Récupérer le timestamp le plus ancien
  const mostOldTimestamp = getMostOldTimestamp(
    currentDataFusionné && currentDataFusionné
  )?.mostOldTimestamp;
  //
  //
  //
  //
  //
  //
  // Trouver la date du rapport
  const timestampInSecondsDebut =
    currentVéhicule?.véhiculeDetails[
      currentVéhicule?.véhiculeDetails.length - 1
    ]?.timestamp;
  const dateObjectDebut =
    pageSection === "unite"
      ? new Date(timestampInSecondsDebut * 1000)
      : new Date(mostOldTimestamp * 1000);

  // Trouver la date du rapport
  const timestampInSecondsFin = currentVéhicule?.véhiculeDetails[1]?.timestamp;
  const dateObjectFin =
    pageSection === "unite"
      ? new Date(timestampInSecondsFin * 1000)
      : new Date(mostRecentTimestamp * 1000);

  // Récupérer le jour, le mois et l'année séparément pour la date de début en local
  const jourDebut = dateObjectDebut.getDate(); // Jour local
  const moisDebut = moisEnLettres[dateObjectDebut.getMonth()]; // Mois local
  const anneeDebut = dateObjectDebut.getFullYear(); // Année locale

  // Récupérer le jour, le mois et l'année séparément pour la date de fin en local
  const jourFin = dateObjectFin.getDate(); // Jour local
  const moisFin = moisEnLettres[dateObjectFin.getMonth()]; // Mois local
  const anneeFin = dateObjectFin.getFullYear(); // Année locale

  const heureDebut = FormatDateHeure(
    pageSection === "unite" ? timestampInSecondsDebut : mostRecentTimestamp
  )?.time;
  const heureFin = FormatDateHeure(
    pageSection === "unite" ? timestampInSecondsFin : mostOldTimestamp
  )?.time;

  const [showHistoriquePupup, setshowHistoriquePupup] = useState(false);
  const [ordreCroissant, setordreCroissant] = useState(false);

  return (
    <div className=" shadow-md-- shadow-gray-400/20 pb-2">
      <div
        onClick={() => {
          setShowOptions(!showOptions);
        }}
        className="relative pt-5-- mx-4 mb-2"
      >
        {pageSection === "unite" && (
          <div className="flex justify-between cursor-pointer border rounded-md px-3 py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-500 dark:text-gray-300 text-center">
            <p className="text-start notranslate w-[90%] dark:text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis">
              {personnelDetails &&
                !currentVéhicule?.description &&
                `${t("Choisissez un véhicule")}`}

              {personnelDetails && currentVéhicule?.description}

              {!personnelDetails && `${t("Rapport en groupe")}`}
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
      {(pageSection === "unite" || pageSection === "groupe") && (
        <div className="flex justify-end gap-3 px-4 ">
          {timestampInSecondsDebut &&
            timestampInSecondsFin &&
            pageSection === "unite" && (
              <div className="sm:flex w-full   gap-8 max-w-[50rem] mx-4-- justify-start items-center ">
                <div className="flex gap-0 items-center whitespace-nowrap">
                  <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                  <p className="text-[.9rem]">
                    <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                      {
                        <span className=" sm:text-sm md:text-[1rem]  lg:text-lg--">
                          {t("Du")}{" "}
                          <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                            {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                            {anneeDebut === anneeFin ? "" : anneeDebut}
                          </span>{" "}
                          {t("au")}{" "}
                          <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                            {jourFin} {moisFin} {anneeFin}
                          </span>
                        </span>
                        // )
                      }
                    </span>
                  </p>
                </div>

                <div className="flex gap-0 items-center whitespace-nowrap">
                  <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

                  <p className="text-[.9rem]">
                    <span className="font-normal sm:text-sm md:text-[1rem]  dark:text-orange-400 text-gray-700 pl-3">
                      {t("De")}{" "}
                      <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                        {heureFin}
                      </span>{" "}
                    </span>
                  </p>
                </div>
              </div>
            )}
          {currentDataFusionné &&
            currentDataFusionné?.length > 0 &&
            pageSection === "groupe" && (
              <div className="sm:flex w-full   gap-8 max-w-[50rem] mx-4-- justify-start items-center ">
                <div className="flex gap-0 items-center whitespace-nowrap">
                  <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                  <p className="text-[.9rem]">
                    <span className="font-normal dark:text-orange-400 text-gray-700 pl-3">
                      {
                        <span className=" sm:text-sm md:text-[1rem]  lg:text-lg--">
                          {t("Du")}{" "}
                          <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                            {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                            {anneeDebut === anneeFin ? "" : anneeDebut}
                          </span>{" "}
                          {t("au")}{" "}
                          <span className="dark:text-orange-400 dark:font-normal font-semibold text-gray-950">
                            {jourFin} {moisFin} {anneeFin}
                          </span>
                        </span>
                        // )
                      }
                    </span>
                  </p>
                </div>

                <div className="flex gap-0 items-center whitespace-nowrap">
                  <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

                  <p className="text-[.9rem]">
                    <span className="font-normal sm:text-sm md:text-[1rem]  dark:text-orange-400 text-gray-700 pl-3">
                      {t("De")}{" "}
                      <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold text-gray-950">
                        {heureFin}
                      </span>{" "}
                    </span>
                  </p>
                </div>
              </div>
            )}
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
                  title={`${t("Télécharger en PDF")}`}
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
                      {t("Télécharger")}{" "}
                      {pageSection === "unite"
                        ? `(${t("Unite")})`
                        : `(${t("Groupe")})`}
                    </p>
                    <IoMdClose
                      onClick={() => {
                        setPdfDownloadPupup(false);
                      }}
                      className=" text-xl text-red-500 cursor-pointer"
                    />
                  </div>
                  {/*  */}
                  {/*  */}
                  {/* <div className="flex justify-center items-center "> */}
                  <p className="flex items-start gap-3 bg-yellow-100 text-yellow-600 text-md mb-2 px-2 py-1 rounded-md text-center dark:bg-yellow-900 dark:text-yellow-400">
                    {/* <span>
                          <MdErrorOutline className="text-2xl mt-0.5" />
                        </span> */}
                    {t("Le téléchargement peut prendre jusqu'a 1 minute")}
                  </p>
                  {/* </div> */}
                  {/*  */}
                  {/*  */}
                  {pageSection === "unite" && (
                    <div
                      onClick={() => {
                        generatePersonelPDF();
                        setPdfDownloadPupup(false);
                      }}
                      className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
                    >
                      <p>{t("Télécharger le rapport en PDF")}</p>
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
                      <p>{t("Télécharger le rapport en PDF")}</p>
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
                        generateTableGroupePDF();
                        setPdfDownloadPupup(false);
                      }}
                      className="border-b flex justify-between gap-2 items-center pb-2 text-[.951rem] font-semibold hover:bg-orange-50 p-2 cursor-pointer"
                    >
                      <p>{t("Télécharger le tableau récapitulatif en PDF")}</p>
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
                      <p>{t("Télécharger le tableau récapitulatif en Exel")}</p>
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
              title={`${t("Recherche par date")}`}
            >
              {/* {(totalDevice?.length < 100 && pageSection === "groupe") ||
                ((pageSection === "unite" ||
                  deviceListeSelected?.length < 100) && (
                  <div
                    onClick={() => {
                      setShowChooseDate(true);
                    }}
                    className="flex  gap-2 items-center cursor-pointer"
                  >
                    <FaRegCalendarAlt className="text-xl mt-2- text-orange-500" />
                  </div>
                ))} */}

              {pageSection === "unite" && (
                <div
                  onClick={() => {
                    setShowChooseDate(true);
                  }}
                  className="flex  gap-2 items-center cursor-pointer"
                >
                  <FaRegCalendarAlt className="text-xl mt-2- text-orange-500" />
                </div>
              )}

              {pageSection === "groupe" &&
                deviceListeSelected?.length < 200 && (
                  <div
                    onClick={() => {
                      setShowChooseDate(true);
                    }}
                    className="flex  gap-2 items-center cursor-pointer"
                  >
                    <FaRegCalendarAlt className="text-xl mt-2- text-orange-500" />
                  </div>
                )}
            </Tooltip>
          </div>
        </div>
      )}

      {/*  */}
    </div>
  );
}

export default RapportPageDetailsHeader;
