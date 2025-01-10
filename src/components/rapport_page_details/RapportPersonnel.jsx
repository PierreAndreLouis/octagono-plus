import React, { useContext, useState } from "react";
import { MdCenterFocusStrong } from "react-icons/md";
import { TfiMapAlt } from "react-icons/tfi";
import { FaCar } from "react-icons/fa";
import { Chart, registerables } from "chart.js";
import { IoTimeOutline } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineFullscreen } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { FaArrowUpAZ } from "react-icons/fa6";
import { FaArrowUp19 } from "react-icons/fa6";
import { FaArrowUp91 } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";

// import { CgChevronDownO } from "react-icons/lu";
// asdfasdf;
// Enregistrement des composants nécessaires
Chart.register(...registerables);
import ReactECharts from "echarts-for-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
// import { DataContext } from "../context/DataContext";
import { RiPinDistanceLine } from "react-icons/ri";
import { SlSpeedometer } from "react-icons/sl";
import TrajetVehicule from "../historique_vehicule/TrajetVehicule";
import { DataContext } from "../../context/DataContext";
import HistoriqueMainComponent from "../historique_vehicule/HistoriqueMainComponent";

function RapportPersonnel({
  currentVehicule,
  formattedDate,
  heureActiveDebut,
  heureActiveFin,
  selectUTC,
  formatTimestampToTimeWithTimezone,
  formatTimestampToTime,
  totalMovingHours,
  totalMovingMinutes,
  totalMovingSeconds,
  totalStopHours,
  totalStopMinutes,
  totalStopSeconds,
  longestHours,
  longestMinutes,
  longestSeconds,
  calculateTotalDistance,
  nombreArret,
  minSpeed,
  averageSpeed,
  maxSpeed,
  zoomCart,
  setzoomCart,
  typeDeVue,
  setTypeDeVue,
  mapType,
  handleMapTypeChange,
  vehicles,
  mapRef,
  tileLayers,
  getMarkerIcon,
  currentLocation,
  positions,
  centerOnFirstMarker,
  showHistoriqueInMap,
  openGoogleMaps,
  options,
  uniqueAddresses,
  uniqueAddressesZerroSpeed,
  setShowOptions,
  startDate,
  startTime,
  endDate,
  endTime,
}) {
  const {
    loadingHistoriqueFilter,
    setShowListOption,
    vehiclueHistoriqueDetails,
    setVehiclueHistoriqueDetails,
    FormatDateHeure,
  } = useContext(DataContext); // const { currentVehicule } = useContext(DataContext);

  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  // Trouver la date du rapport
  const timestampInSecondsDebut =
    currentVehicule?.vehiculeDetails[
      currentVehicule?.vehiculeDetails.length - 1
    ]?.timestamp;
  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  // const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  const timestampInSecondsFin = currentVehicule?.vehiculeDetails[1]?.timestamp;
  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  // const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  // const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  // const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  const [showHistoriquePupup, setshowHistoriquePupup] = useState(false);
  const [ordreCroissant, setordreCroissant] = useState(false);
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

  function formatTimestampToDateWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les adresses en fonction du terme de recherche

  // uniqueAddressesZerroSpeed

  const [addressType, setaddressType] = useState(true);

  const [croissantOrDecroissant, setcroissantOrDecroissant] =
    useState("croissant");

  // let filteredAddresses = uniqueAddresses?.filter((item) =>
  //   item?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  let filteredAddresses;
  if (addressType) {
    filteredAddresses = uniqueAddresses?.filter((item) =>
      item?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else {
    filteredAddresses = uniqueAddressesZerroSpeed?.filter((item) =>
      item?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Fonction pour extraire le jour, le mois, l'année et l'heure en AM/PM
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

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
    let [hours, minutes] = time?.split(":").map(Number);
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convertir l'heure 0 à 12 (minuit) en 12 AM
    const period = isAM ? "AM" : "PM";
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Convertir les heures
  const heureDebut = formatTo12Hour(startTime);
  const heureFin = formatTo12Hour(endTime);

  return (
    <>
      {currentVehicule ? (
        <div className=" px-4 min-h-screen-- pb-20 md:max-w-[80vw] w-full">
          <h1 className="text-center mb-16 font-semibold text-xl my-16 dark:text-gray-300">
            Rapport détaillé du véhicule
          </h1>

          <div className="mb-12 shadow-md dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
            {/* <div className="flex gap-4 items-center-- border-b-- border-orange-600/30 dark:border-gray-600 pb-1 mb---">
            <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <div>
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Informations sur le véhicule
              </h2>
            </div>
          </div> */}

            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Informations sur le véhicule
              </h2>
            </div>
            {/* <div className="flex mb-1 gap-4 text-gray-600 text-md dark:text-gray-300 ml-2">
            <div className="flex gap-2 items-center">
              <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 mr-4" />

              {jourDebut === jourFin &&
              moisDebut === moisFin &&
              anneeDebut === anneeFin ? (
                <h3 className="text-[.85rem] sm:text-sm md:text-[1rem]  lg:text-lg--">
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    Le {jourDebut || ""} {moisDebut || ""} {anneeDebut || ""}
                  </span>{" "}
                </h3>
              ) : (
                <h3 className="text-[.85rem] sm:text-sm md:text-[1rem]  lg:text-lg--">
                  Du{" "}
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                    {anneeDebut === anneeFin ? "" : anneeDebut}
                  </span>{" "}
                  au{" "}
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    {jourFin} {moisFin} {anneeFin}
                  </span>
                </h3>
              )}
            </div>
          </div> */}
            {/* ///////////////////////////// */}
            {/* <div className="flex mb-4 gap-4 text-gray-600 text-md dark:text-gray-300 border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3-- ml-1.5">
            <div className="flex items-center gap-1">
              <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4" />
              <h3 className="text-[.85rem] sm:text-sm md:text-[1rem] lg:text-lg-- ml-0.5">
                De{" "}
                <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                  {" "}
                  {selectUTC
                    ? formatTimestampToTimeWithTimezone(
                        currentVehicule?.vehiculeDetails[
                          currentVehicule?.vehiculeDetails?.length - 1
                        ]?.timestamp,
                        selectUTC
                      )
                    : formatTimestampToTime(
                        currentVehicule?.vehiculeDetails?.[
                          currentVehicule?.vehiculeDetails?.length - 1
                        ]?.timestamp
                      )}{" "}
                </span>{" "}
                a{" "}
                <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                  {" "}
                  {selectUTC
                    ? formatTimestampToTimeWithTimezone(
                        currentVehicule?.vehiculeDetails[0]?.timestamp,
                        selectUTC
                      )
                    : formatTimestampToTime(
                        currentVehicule?.vehiculeDetails?.[0]?.timestamp
                      )}{" "}
                </span>
              </h3>
            </div>
          </div> */}

            <div>
              <div className="text-gray-700 font-bold flex flex-col gap-2 dark:text-gray-300">
                <p>
                  Date recherchée :
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {jourDebut ? (
                      // true ||
                      // jourDebut === jourFin &&
                      // moisDebut === moisFin &&
                      // anneeDebut === anneeFin ? (
                      //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      //     <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                      //       {anneeDebut || ""}
                      //     </span>{" "}
                      //   </span>
                      // ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )
                      <span>Pas de date disonible</span>
                    )}
                  </span>
                </p>

                <p>
                  Heure du Recherche :
                  {currentVehicule?.vehiculeDetails[
                    currentVehicule?.vehiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                        {heureDebut}
                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp
                            )} */}
                      </span>{" "}
                      a{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                        {heureFin}{" "}
                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[0]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[0]?.timestamp
                            )} */}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-normal ml-2 dark:text-orange-500">
                      {" "}
                      Pas d'heure disponible
                    </span>
                  )}
                </p>

                <p>
                  Nom du Véhicule :{" "}
                  <span className=" dark:text-orange-500 font-normal text-gray-700 pl-3">
                    {currentVehicule?.description || "---"}
                  </span>
                </p>

                <p>
                  Plaque d'immatriculation:{" "}
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {currentVehicule?.licensePlate || "---"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="shadow-md mt-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
            {/* <div className="flex gap-4 items-center border-b-- border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur le trajet du vehicule
            </h2>
          </div> */}

            <div className="flex gap-4 items-center-- border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <div>
                <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                  Informations sur le trajet du vehicule
                </h2>
              </div>
            </div>

            {/* <div className="flex mb-1 gap-4 text-gray-600 text-md dark:text-gray-300 ml-2">
            <div className="flex gap-2 items-center">
              <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 mr-4" />

              {jourDebut === jourFin &&
              moisDebut === moisFin &&
              anneeDebut === anneeFin ? (
                <h3 className="text-[.9rem] sm:text-sm md:text-[1rem]  lg:text-lg--">
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    Le {jourDebut || ""} {moisDebut || ""} {anneeDebut || ""}
                  </span>{" "}
                </h3>
              ) : (
                <h3 className="text-[.9rem] sm:text-sm md:text-[1rem]  lg:text-lg--">
                  Du{" "}
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                    {anneeDebut === anneeFin ? "" : anneeDebut}
                  </span>{" "}
                  au{" "}
                  <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                    {jourFin} {moisFin} {anneeFin}
                  </span>
                </h3>
              )}
            </div>
          </div> */}
            {/* ///////////////////////////// */}
            {/* <div className="flex mb-4 gap-4 text-gray-600 text-md dark:text-gray-300 border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3-- ml-1.5">
            <div className="flex items-center gap-1">
              <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4" />
              <h3 className="text-[.9rem] sm:text-sm md:text-[1rem] lg:text-lg-- ml-0.5">
                De{" "}
                <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                  {" "}
                  {selectUTC
                    ? formatTimestampToTimeWithTimezone(
                        currentVehicule?.vehiculeDetails[
                          currentVehicule?.vehiculeDetails?.length - 1
                        ]?.timestamp,
                        selectUTC
                      )
                    : formatTimestampToTime(
                        currentVehicule?.vehiculeDetails?.[
                          currentVehicule?.vehiculeDetails?.length - 1
                        ]?.timestamp
                      )}{" "}
                </span>{" "}
                a{" "}
                <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                  {" "}
                  {selectUTC
                    ? formatTimestampToTimeWithTimezone(
                        currentVehicule?.vehiculeDetails[0]?.timestamp,
                        selectUTC
                      )
                    : formatTimestampToTime(
                        currentVehicule?.vehiculeDetails?.[0]?.timestamp
                      )}{" "}
                </span>
              </h3>
            </div>
          </div> */}

            <div>
              <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
                {/* <p>
                  Date recherchée :
                  <span className="font-semibold dark:text-orange-500 text-gray-700 pl-3">
                    {
                      // true ||
                      jourDebut === jourFin &&
                      moisDebut === moisFin &&
                      anneeDebut === anneeFin ? (
                        <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                          <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                            Le {jourDebut || ""} {moisDebut || ""}{" "}
                            {anneeDebut || ""}
                          </span>{" "}
                        </span>
                      ) : (
                        <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                          Du{" "}
                          <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                            {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                            {anneeDebut === anneeFin ? "" : anneeDebut}
                          </span>{" "}
                          au{" "}
                          <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                            {jourFin} {moisFin} {anneeFin}
                          </span>
                        </span>
                      )
                    }
                  </span>
                </p>

                <p>
                  Heure du Recherche :
                  <span className="font-normal-- font-semibold dark:text-orange-500 text-gray-700 pl-3">
                    De{" "}
                    <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            currentVehicule?.vehiculeDetails[
                              currentVehicule?.vehiculeDetails?.length - 1
                            ]?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            currentVehicule?.vehiculeDetails?.[
                              currentVehicule?.vehiculeDetails?.length - 1
                            ]?.timestamp
                          )}
                    </span>{" "}
                    a{" "}
                    <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            currentVehicule?.vehiculeDetails[0]?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            currentVehicule?.vehiculeDetails?.[0]?.timestamp
                          )}
                    </span>{" "}
                  </span>
                </p> */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/* <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" /> */}
                {/*  */}
                {/*  */}
                {/*  */}
                <p>
                  Date recherchée :
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {jourDebut ? (
                      // true ||
                      // jourDebut === jourFin &&
                      // moisDebut === moisFin &&
                      // anneeDebut === anneeFin ? (
                      //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      //     <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                      //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                      //       {anneeDebut || ""}
                      //     </span>{" "}
                      //   </span>
                      // ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )
                      <span>Pas de date disonible</span>
                    )}
                  </span>
                </p>
                <p>
                  Heure du Recherche :
                  {currentVehicule?.vehiculeDetails[
                    currentVehicule?.vehiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                        {heureDebut}{" "}
                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp
                            )} */}
                      </span>{" "}
                      a{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                        {heureFin}{" "}
                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[0]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[0]?.timestamp
                            )} */}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-normal ml-2 dark:text-orange-500">
                      {" "}
                      Pas d'heure disponible
                    </span>
                  )}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p>
                  Heure de départ:{" "}
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {heureActiveDebut
                      ? selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            heureActiveDebut.timestamp,
                            selectUTC
                          )
                        : FormatDateHeure(heureActiveDebut.timestamp)?.time
                      : "Pas de mouvement"}{" "}
                  </span>
                </p>
                <p>
                  Heure d'arriver:{" "}
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {heureActiveFin
                      ? selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            heureActiveFin.timestamp,
                            selectUTC
                          )
                        : FormatDateHeure(heureActiveFin.timestamp)?.time
                      : "Pas de mouvement"}{" "}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p>
                  Durée total en mouvement :{" "}
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {/* {totalMovingHours || "0"}h {totalMovingMinutes || "0"}m{" "}
                  {totalMovingSeconds || "0"}s */}
                    {formatTime(
                      totalMovingHours,
                      totalMovingMinutes,
                      totalMovingSeconds
                    )}
                  </span>
                </p>
                <p>
                  Durée des arrêts lors du deplacement :
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {/* {(() => {
                    if (
                      totalStopHours > 0 ||
                      totalStopMinutes > 0 ||
                      totalStopSeconds > 0
                    ) {
                      return `${
                        totalStopHours > 0 ? totalStopHours + "h " : ""
                      }${totalStopMinutes > 0 ? totalStopMinutes + "m " : ""}${
                        totalStopSeconds > 0 ? totalStopSeconds + "s" : ""
                      }`;
                    }
                    return "0s";
                  })()} */}

                    {formatTime(
                      totalStopHours,
                      totalStopMinutes,
                      totalStopSeconds
                    )}
                  </span>
                </p>
                <p>
                  Duree de l’arrêts le plus long :
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {/* {`${longestHours || "0"}h ${longestMinutes || "0"}mn ${
                    longestSeconds || "0"
                  }s`}{" "} */}
                    {formatTime(longestHours, longestMinutes, longestSeconds)}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p>
                  Distance totale parcourue:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {calculateTotalDistance(
                      currentVehicule?.vehiculeDetails
                    ).toFixed(0)}
                    Km{" "}
                  </span>
                </p>
                <p>
                  Nombre total d’arrêts :
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {nombreArret || "0"}
                    {/* {stopSequences?.length || "---"} */}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                <p>
                  Vitesse minimale:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {(minSpeed && minSpeed.toFixed(0)) || "0"} Km/h
                  </span>
                </p>{" "}
                <p>
                  Vitesse maximale:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {(maxSpeed && maxSpeed.toFixed(0)) || "0"} Km/h
                  </span>
                </p>
                <p>
                  Vitesse moyenne:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {(averageSpeed && averageSpeed.toFixed(2)) || "0"} Km/h/ */}
                    {((maxSpeed + minSpeed) / 2).toFixed(0) || 0} Km/h
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* <div className="shadow-md mt-4  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Distance
            </h2>
          </div>

          <div>
            <div className="text-gray-600 flex flex-col gap-2 dark:text-gray-300">
              <p>
                Distance totale parcourue:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {calculateTotalDistance(
                    currentVehicule?.vehiculeDetails
                  ).toFixed(2)}
                  Km{" "}
                </span>
              </p>
              <p>
                Nombre total d’arrêts :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {nombreArret || "0"}
                </span>
              </p>
            </div>
          </div>
        </div> */}

          {/* <div className="shadow-md mt-4  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <SlSpeedometer className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Vitesse
            </h2>
          </div>

          <div>
            <div className="text-gray-600 flex flex-col gap-2 dark:text-gray-300">
              <p>
                Vitesse moyenne:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {(averageSpeed && averageSpeed.toFixed(2)) || "0"} Km/h/
                </span>
              </p>
              <p>
                Vitesse maximale:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {(maxSpeed && maxSpeed.toFixed(2)) || "0"} Km/h
                </span>
              </p>
            </div>
          </div>
        </div> */}

          <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
            <GiPathDistance className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Trajet du véhicule{" "}
            </h2>
          </div>

          {zoomCart ? (
            <div className=" fixed inset-0 z-[999999999999999999] bg-black/50">
              <div className="relative  rounded-lg  mt-3-- h-[100vh]  overflow-hidden w-full">
                <button
                  className="absolute z-[999] top-[1rem] right-[1rem]"
                  // onClick={centerOnFirstMarker}
                  onClick={() => {
                    setzoomCart(false);
                  }}
                >
                  <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                    <IoClose className="text-white text-[1.52rem]" />
                  </div>
                </button>
                <div className="absolute-- -top-[11rem]-- rounded-lg  w-full ">
                  <div>
                    <TrajetVehicule
                      typeDeVue={typeDeVue}
                      setTypeDeVue={setTypeDeVue}
                      mapType={mapType}
                      handleMapTypeChange={handleMapTypeChange}
                      vehicles={vehicles}
                      mapRef={mapRef}
                      tileLayers={tileLayers}
                      getMarkerIcon={getMarkerIcon}
                      currentLocation={currentLocation}
                      customMarkerIcon={customMarkerIcon}
                      positions={positions}
                      centerOnFirstMarker={centerOnFirstMarker}
                      showHistoriqueInMap={showHistoriqueInMap}
                      openGoogleMaps={openGoogleMaps}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative  rounded-lg  mt-3 h-[40vh] md:h-[60vh] overflow-hidden w-full">
              <button
                className="absolute z-[999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setzoomCart(true);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                  <MdOutlineFullscreen className="text-orange-500 text-[2rem]" />
                </div>
              </button>
              <button
                className="absolute z-[999] top-[4rem] right-[1rem]"
                onClick={centerOnFirstMarker}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                  <MdCenterFocusStrong className="text-orange-500 text-[1.52rem]" />
                </div>
              </button>
              <div className="absolute -top-[11rem] rounded-lg  w-full ">
                <div>
                  <TrajetVehicule
                    typeDeVue={typeDeVue}
                    setTypeDeVue={setTypeDeVue}
                    mapType={mapType}
                    handleMapTypeChange={handleMapTypeChange}
                    vehicles={vehicles}
                    mapRef={mapRef}
                    tileLayers={tileLayers}
                    getMarkerIcon={getMarkerIcon}
                    currentLocation={currentLocation}
                    customMarkerIcon={customMarkerIcon}
                    positions={positions}
                    centerOnFirstMarker={centerOnFirstMarker}
                    showHistoriqueInMap={showHistoriqueInMap}
                    openGoogleMaps={openGoogleMaps}
                  />
                </div>
              </div>
            </div>
          )}

          {/* {zoomCart && ( */}

          {/* )} */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          <div className="shadow-md mt-20 mb-2  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
            <SlSpeedometer className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Graphe des vitesses{" "}
            </h2>
          </div>

          {/* ///////////////////////////////////////// */}
          {/* <div className="transition-all w-full h-[30rem] bg-gray-100 rounded-lg dark:bg-gray-900 dark:text-gray-100">
            <div className=" h-[30rem]">
              <canvas
                className="w-full transition-all dark:bg-gray-900 rounded-lg  h-[30rem] border"
                id="myChart"
              ></canvas>
            </div>
          </div> */}
          {/* ///////////////////////////////////////// */}
          <div className="overflow-auto max-w-[100vw]">
            <div className="w-[200rem]-- max-h-[30rem] ">
              <div className="dark:bg-gray-100 w-[100%] h-[20rem]  md:h-[25rem] pt-5 border  rounded-lg">
                <ReactECharts
                  className="-translate-x-52--- p-0 m-0"
                  option={options}
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {showHistoriquePupup && (
            <div className="fixed hidden- z-[10000000000] inset-0 bg-black/50 flex justify-center items-center">
              <div className="relative mx-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="absolute z-[111111111111111111111] bg-white dark:bg-gray-900 p-4 top-0 left-0 right-0 flex flex-col justify-center items-center">
                  <IoClose
                    onClick={() => {
                      setshowHistoriquePupup(false);
                    }}
                    className="absolute z-[22222222222] top-3 right-4 cursor-pointer text-2xl text-red-500"
                  />
                  <h3 className="text-orange-500">Historique</h3>
                  <h2 className="text-gray-700 dark:text-gray-200">
                    {currentVehicule?.description || ""}
                  </h2>
                </div>
                <div className="relative  overflow-auto mx-1 w-full h-[90vh] p-1 mx-4- max-w-[90vw]">
                  <HistoriqueMainComponent
                    currentVehicule={currentVehicule}
                    loadingHistoriqueFilter={loadingHistoriqueFilter}
                    vehiclueHistoriqueDetails={vehiclueHistoriqueDetails}
                    appliedCheckboxes={appliedCheckboxes}
                    setShowListOption={setshowHistoriquePupup}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    selectUTC={selectUTC}
                  />
                </div>{" "}
              </div>
            </div>
          )}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <div className="shadow-md-- relative mt-20 pb-[10rem] cursor-pointer dark:bg-gray-800-- dark:shadow-lg-- dark:shadow-gray-700 py-4 hover:bg-orange-100/70-- bg-orange-50-- p-2- rounded-md flex--- items-start gap-4">
            <div className="flex dark:bg-gray-800 bg-orange-50 flex-col border-b-- border-orange-600/30 dark:border-gray-600 p-3 rounded-lg mb-3 pb-2-- mb-3--">
              <div className="flex gap-4 items-center border-b-- border-orange-600/30 dark:border-gray-600 pb-2-- mb-3--">
                <TfiMapAlt className="min-w-[2rem] text-[1.82rem] text-orange-400 " />

                <div className="flex   items-center justify-between gap-2 w-full">
                  <h2 className="font-semibold dark:text-orange-500 text-orange-900">
                    {addressType
                      ? `Tous les lieux fréquentés (${filteredAddresses?.length})`
                      : `Tous les lieux Stationnés (${filteredAddresses?.length})`}{" "}
                  </h2>

                  {lieuxFrequentePupup ? (
                    <IoClose
                      onClick={() => setlieuxFrequentePupup(false)}
                      className="text-2xl text-red-500"
                    />
                  ) : (
                    <IoChevronDownCircleOutline
                      onClick={() => {
                        setlieuxFrequentePupup(true);
                      }}
                      className="text-2xl text-gray-500"
                    />
                  )}
                </div>

                {lieuxFrequentePupup && (
                  <div className="absolute hidden-- top-[4.3rem] rounded-lg p-4 bg-white  dark:border dark:bg-gray-900 shadow-lg shadow-gray-600 left-0 right-0">
                    <div
                      onClick={() => {
                        setlieuxFrequentePupupSearch(true);
                        setlieuxFrequentePupup(false);
                      }}
                      className="flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg "
                    >
                      <IoSearchSharp className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">Recherche</h4>
                    </div>
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/* <div
                      onClick={() => {
                        setlieuxFrequentePupup(false);
                        setshowHistoriquePupup(true);
                      }}
                      className="flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg "
                    >
                      <IoStatsChart className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">Voir l'Histoirque</h4>
                    </div> */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    <div
                      onClick={() => {
                        setlieuxFrequentePupup(false);
                        // setshowHistoriquePupup(true);
                        setaddressType(true);
                        // setfrequenterOrStationnee("frequente");
                      }}
                      className={`${
                        addressType && "bg-orange-50 "
                      } flex items-center  dark:bg-gray-800 dark:rounded-lg gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800  hover:rounded-lg `}
                    >
                      <TfiMapAlt className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">
                        Tous les lieux fréquentés
                      </h4>
                    </div>
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    <div
                      onClick={() => {
                        setlieuxFrequentePupup(false);
                        // setshowHistoriquePupup(true);
                        setaddressType(false);
                        // setfrequenterOrStationnee("stationne");
                      }}
                      className={`${
                        !addressType && "bg-orange-50"
                      }  flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg `}
                    >
                      <FaCar className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">
                        Tous les lieux Stationnés
                      </h4>
                    </div>
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}

                    <div
                      onClick={() => {
                        setlieuxFrequentePupup(false);
                        setordreCroissant(false);
                        setcroissantOrDecroissant("croissant");
                      }}
                      className={`${
                        croissantOrDecroissant === "croissant" && "bg-orange-50"
                      }  dark:bg-gray-800 dark:rounded-lg  flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg `}
                    >
                      <FaArrowUp19 className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">
                        Filtre en ordre croissant
                      </h4>
                    </div>
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {/*  */}

                    <div
                      onClick={() => {
                        setlieuxFrequentePupup(false);
                        setordreCroissant(true);
                        setcroissantOrDecroissant("decroissant");
                      }}
                      className={`${
                        croissantOrDecroissant === "decroissant" &&
                        "bg-orange-50"
                      }  flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg `}
                    >
                      <FaArrowUp91 className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">
                        Filtre en ordre decroissant
                      </h4>
                    </div>
                  </div>
                )}
              </div>

              {lieuxFrequentePupupSearch && (
                <div className="border flex  max-w-[30rem]-- max-auto w-full dark:bg-gray-900 mt-3 bg-white justify-between border-gray-400 rounded-lg p-2 py-1">
                  <input
                    type="text"
                    placeholder="Recherche"
                    className="w-full bg-transparent  focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IoClose
                    onClick={() => {
                      setlieuxFrequentePupupSearch(false);
                      setSearchTerm("");
                    }}
                    className="text-2xl text-red-500"
                  />
                </div>
              )}
            </div>

            <div className="sm:flex gap-10 px-2">
              <div className="flex gap-0 items-center">
                <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {jourDebut ? (
                      // true ||
                      // jourDebut === jourFin &&
                      // moisDebut === moisFin &&
                      // anneeDebut === anneeFin ? (
                      //   <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      //     <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                      //       Le {jourDebut || ""} {moisDebut || ""}{" "}
                      //       {anneeDebut || ""}
                      //     </span>{" "}
                      //   </span>
                      // ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )

                      <span>Pas de date disponible</span>
                    )}
                  </span>
                </p>
              </div>

              <div className="flex gap-0 items-center">
                <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

                {currentVehicule?.vehiculeDetails[
                  currentVehicule?.vehiculeDetails?.length - 1
                ]?.timestamp ? (
                  <p className="text-[.9rem]">
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold text-gray-950">
                        {heureDebut}
                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[
                                currentVehicule?.vehiculeDetails?.length - 1
                              ]?.timestamp
                            )} */}
                      </span>{" "}
                      a{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold text-gray-950">
                        {heureFin}

                        {/* {selectUTC
                          ? formatTimestampToTimeWithTimezone(
                              currentVehicule?.vehiculeDetails[0]?.timestamp,
                              selectUTC
                            )
                          : formatTimestampToTime(
                              currentVehicule?.vehiculeDetails?.[0]?.timestamp
                            )} */}
                      </span>{" "}
                    </span>
                  </p>
                ) : (
                  <p className="text-[.9rem] ml-3 text-gray-700 dark:text-orange-500">
                    Pas d'heure disponible
                  </p>
                )}
              </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
            {/*  */}
            {/*  */}
            {/*  */}

            <div>
              <div className="text-gray-600  flex flex-col gap-4">
                {ordreCroissant ? (
                  filteredAddresses?.length > 0 ? (
                    filteredAddresses?.map((item, index) => {
                      const numero = filteredAddresses.length - index;

                      return (
                        <div
                          className="bg-orange-50 dark:bg-gray-800 p-3 rounded-lg  shadow-lg "
                          key={index}
                        >
                          <p className="dark:text-gray-500">
                            <span className="font-bold dark:text-orange-500 text-black mr-3">
                              {numero} {") "}
                            </span>
                            {item.address}
                          </p>
                          <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                            <p>
                              <span className="font-bold">Date : </span>
                              {item.timestamp
                                ? // selectUTC
                                  //   ? formatTimestampToDateWithTimezone(
                                  //       item.timestamp,
                                  //       selectUTC
                                  //     )
                                  // :
                                  FormatDateHeure(item.timestamp)?.date
                                : "Pas de date disponible"}{" "}
                            </p>
                            <p>
                              <span className="font-bold">Heure : </span>
                              {selectUTC
                                ? formatTimestampToTimeWithTimezone(
                                    item.timestamp,
                                    selectUTC
                                  )
                                : FormatDateHeure(item.timestamp)?.time}{" "}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                            <p>
                              <span className="font-bold">Vitesse : </span>
                              {item.speedKPH && !isNaN(Number(item.speedKPH))
                                ? Number(item.speedKPH).toFixed(0) + " km"
                                : "Non disponible"}
                            </p>
                            <p>
                              <span className="font-bold">Statut : </span>
                              {item.speedKPH <= 0 && "en arret"}
                              {item.speedKPH >= 1 &&
                                item.speedKPH < 20 &&
                                "En mouvement lent"}
                              {item.speedKPH >= 20 && "En mouvement rapide"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="px-4 dark:text-gray-200 dark:bg-gray-800 text-center py-10">
                      Pas de Resultat
                    </p>
                  )
                ) : filteredAddresses?.length > 0 ? (
                  filteredAddresses
                    ?.slice() // Crée une copie du tableau pour ne pas modifier l'original
                    .reverse() // Inverse l'ordre des éléments
                    .map((item, index) => {
                      // Calculer le numéro basé sur la position inversée
                      const numero = filteredAddresses.length - index;

                      return (
                        <div
                          className="bg-orange-50 dark:bg-gray-900/40 dark:text-gray-300 p-3 rounded-lg  shadow-lg  dark:shadow-gray-700"
                          key={index}
                        >
                          <p className="dark:text-gray-200 pb-4">
                            <span className="font-bold dark:text-orange-500 text-black mr-3">
                              {index + 1} {") "}
                            </span>
                            {item.address}
                          </p>
                          <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                            <p>
                              <span className="font-bold dark:text-orange-400">
                                Date :{" "}
                              </span>
                              {item.timestamp
                                ? // selectUTC
                                  //   ? formatTimestampToDateWithTimezone(
                                  //       item.timestamp,
                                  //       selectUTC
                                  //     )
                                  //   :
                                  FormatDateHeure(item.timestamp)?.date
                                : "Pas de date disponible"}{" "}
                            </p>
                            <p>
                              <span className="font-bold  dark:text-orange-400">
                                Heure :{" "}
                              </span>
                              {selectUTC
                                ? formatTimestampToTimeWithTimezone(
                                    item.timestamp,
                                    selectUTC
                                  )
                                : FormatDateHeure(item.timestamp)?.time}{" "}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                            <p>
                              <span className="font-bold  dark:text-orange-400">
                                Vitesse :{" "}
                              </span>
                              {item.speedKPH && !isNaN(Number(item.speedKPH))
                                ? Number(item.speedKPH).toFixed(0) + " km"
                                : "Non disponible"}
                            </p>
                            <p>
                              <span className="font-bold  dark:text-orange-400">
                                Statut :{" "}
                              </span>
                              {item.speedKPH <= 0 && "en arret"}
                              {item.speedKPH >= 1 &&
                                item.speedKPH < 20 &&
                                "En mouvement lent"}
                              {item.speedKPH >= 20 && "En mouvement rapide"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="px-4 text-center py-10">Pas de Resultat</p>
                )}
              </div>
            </div>
          </div>

          {/* <div className="shadow-md mt-4 cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4 hover:bg-orange-100/70-- bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <FaCar className="min-w-[2rem] text-[1.82rem] text-orange-400 " />

              <h2 className="font-semibold dark:text-orange-500 text-orange-900">
                Tous les lieux Stationnés
              </h2>
            </div>

            <div className="sm:flex gap-10">
              <div className="flex gap-0 items-center">
                <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300 text-md mr-1 ml-0.5" />
                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {
                      // true ||
                      jourDebut === jourFin &&
                      moisDebut === moisFin &&
                      anneeDebut === anneeFin ? (
                        <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                          <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                            Le {jourDebut || ""} {moisDebut || ""}{" "}
                            {anneeDebut || ""}
                          </span>{" "}
                        </span>
                      ) : (
                        <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                          Du{" "}
                          <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                            {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                            {anneeDebut === anneeFin ? "" : anneeDebut}
                          </span>{" "}
                          au{" "}
                          <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                            {jourFin} {moisFin} {anneeFin}
                          </span>
                        </span>
                      )
                    }
                  </span>
                </p>
              </div>

              <div className="flex gap-0 items-center">
                <IoMdTime className="text-gray-500/80 dark:text-gray-300 text-xl mr-4-" />

                <p className="text-[.9rem]">
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    De{" "}
                    <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            currentVehicule?.vehiculeDetails[
                              currentVehicule?.vehiculeDetails?.length - 1
                            ]?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            currentVehicule?.vehiculeDetails?.[
                              currentVehicule?.vehiculeDetails?.length - 1
                            ]?.timestamp
                          )}
                    </span>{" "}
                    a{" "}
                    <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold text-gray-950">
                      {selectUTC
                        ? formatTimestampToTimeWithTimezone(
                            currentVehicule?.vehiculeDetails[0]?.timestamp,
                            selectUTC
                          )
                        : formatTimestampToTime(
                            currentVehicule?.vehiculeDetails?.[0]?.timestamp
                          )}
                    </span>{" "}
                  </span>
                </p>
              </div>
            </div>
         

            <div>
              <div className="text-gray-600 flex flex-col gap-3">
                {uniqueAddressesZerroSpeed?.map((add, index) => {
                  return (
                    <p className="dark:text-gray-300" key={index}>
                      <span className="font-bold dark:text-orange-500 text-black mr-3">
                        {index + 1} {") "}
                      </span>
                      {add}
                    </p>
                  );
                })}
              </div>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="w-full h-screen-- pt-20 flex flex-col justify-center items-center">
          <button
            onClick={() => {
              setShowOptions(true);
            }}
            className="bg-orange-100  px-4 py-1 mt-5 cursor-pointer rounded-lg"
          >
            Choisissez un vehicule
          </button>
        </div>
      )}
    </>
  );
}

export default RapportPersonnel;
