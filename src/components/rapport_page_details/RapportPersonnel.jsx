import React, { useContext, useEffect, useState } from "react";
import { MdCenterFocusStrong } from "react-icons/md";
import { TfiMapAlt } from "react-icons/tfi";
import { FaCar } from "react-icons/fa";
import { Chart, registerables } from "chart.js";
import Tooltip from "@mui/material/Tooltip";

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
import MapComponent from "../location_vehicule/MapComponent";

function RapportPersonnel({
  // currentVéhicule,
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
  downloadExelPDF,
}) {
  const {
    loadingHistoriqueFilter,
    setShowListOption,
    véhiculeHistoriqueDetails,
    setVéhiculeHistoriqueDetails,
    setCurrentVéhicule,
    currentDataFusionné,
    setSelectedVehicleToShowInMap,
    setHistoriqueSelectedLocationIndex,
    FormatDateHeure,
    rapportPersonnelPDFtRef,
    searchDonneeFusionnéForRapport,
    currentVéhicule,
    currentPersonelVéhicule,
    setCurrentPersonelVéhicule,
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);

  useEffect(() => {
    if (currentDataFusionné?.length > 0) {
      const updatedVéhicule = currentDataFusionné.find(
        (véhicule) => véhicule?.deviceID === currentVéhicule?.deviceID
      );
      if (updatedVéhicule) {
        setCurrentVéhicule(updatedVéhicule);
        setVéhiculeHistoriqueDetails(updatedVéhicule?.véhiculeDetails);
        setSelectedVehicleToShowInMap(updatedVéhicule.deviceID);
      }
    }
  }, [currentDataFusionné]);

  useEffect(() => {
    console.log(currentVéhicule);
  }, [currentVéhicule]);

  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  const moisEnLettres = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  // Trouver la date du rapport
  const timestampInSecondsDebut =
    currentVéhicule?.véhiculeDetails[
      currentVéhicule?.véhiculeDetails.length - 1
    ]?.timestamp;
  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Trouver la date du rapport
  const timestampInSecondsFin = currentVéhicule?.véhiculeDetails[1]?.timestamp;
  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément pour la date de début en local
  const jourDebut = dateObjectDebut.getDate(); // Jour local
  const moisDebut = moisEnLettres[dateObjectDebut.getMonth()]; // Mois local
  const anneeDebut = dateObjectDebut.getFullYear(); // Année locale

  // Récupérer le jour, le mois et l'année séparément pour la date de fin en local
  const jourFin = dateObjectFin.getDate(); // Jour local
  const moisFin = moisEnLettres[dateObjectFin.getMonth()]; // Mois local
  const anneeFin = dateObjectFin.getFullYear(); // Année locale

  const heureDebut = FormatDateHeure(timestampInSecondsDebut)?.time;
  const heureFin = FormatDateHeure(timestampInSecondsFin)?.time;

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

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les adresses en fonction du terme de recherche

  // uniqueAddressesZerroSpeed

  const [addressType, setaddressType] = useState(true);

  const [croissantOrDecroissant, setcroissantOrDecroissant] =
    useState("croissant");

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

  //////////////////////////////////////////////////////////////////////////////////

  const handleClick = () => {
    const deviceID = currentVéhicule.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentDataFusionné.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel

      setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
      setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  const calculateAverageSpeed = (data) => {
    // Extraire les détails du véhicule
    const details = data?.véhiculeDetails;

    // Filtrer les vitesses supérieures à 0
    const validSpeeds = details
      ?.map((detail) => parseFloat(detail.speedKPH)) // Convertir en nombres
      ?.filter((speed) => speed > 0); // Garder uniquement les vitesses > 0

    // Calculer la somme des vitesses
    const totalSpeed = validSpeeds?.reduce((sum, speed) => sum + speed, 0);

    // Calculer la vitesse moyenne
    const averageSpeed =
      validSpeeds?.length > 0 ? totalSpeed / validSpeeds?.length : 0;

    return averageSpeed.toFixed(); // Arrondir à 2 décimales
  };

  const vitesseMoyenne = calculateAverageSpeed(currentPersonelVéhicule);
  // console.log(`Vitesse moyenne : ${averageSpeed} km/h`);

  const [voirPositionSurCarte, setvoirPositionSurCarte] = useState(false);
  // const [mapType, setMapType] = useState("streets");

  // gggggggggggggggggggggggggg
  const [preparationDownloadPDF, setPreparationDownloadPDF] = useState(false);
  useEffect(() => {
    console.log(preparationDownloadPDF);
  }, [preparationDownloadPDF]);

  useEffect(() => {
    if (downloadExelPDF) {
      setPreparationDownloadPDF(true);
    } else {
      setPreparationDownloadPDF(false);
    }
  }, [downloadExelPDF]);

  const isSearching = searchDonneeFusionnéForRapport?.length > 0;

  return (
    <>
      {/* <div ref={rapportPersonnelPDFtRef}>
        <h1>Mon contenu à exporter</h1>
        <p>Voici un exemple de texte dans le PDF.</p>
      </div> */}
      {currentVéhicule ? (
        <div
          ref={rapportPersonnelPDFtRef}
          className=" px-4 min-h-screen-- pb-20 md:max-w-[80vw] w-full"
        >
          <h1 className="text-center mb-2 font-semibold text-xl mt-16 dark:text-gray-300">
            Rapport détaillé du véhicule
          </h1>
          <h1 className="text-center notranslate mb-16 text-orange-600  text-md font-bold my-2 dark:text-gray-300">
            {currentVéhicule?.description || ""}
          </h1>
          <div
            className={`mb-12 ${
              preparationDownloadPDF ? " " : "shadow-md"
            }  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Informations sur le véhicule
              </h2>
            </div>

            {/* ///////////////////////////// */}

            <div>
              <div className="text-gray-700 font-bold flex flex-col gap-2 dark:text-gray-300">
                <div className="flex flex-wrap">
                  <p>Date de recherche trouvée :</p>
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5">
                    {jourDebut ? (
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
                </div>

                {/*  */}
                <div className="flex flex-wrap">
                  <p>Heure de recherche trouvée :</p>
                  {currentVéhicule?.véhiculeDetails[
                    currentVéhicule?.véhiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-5">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      à{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                        {heureFin}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-normal ml-5 dark:text-orange-500">
                      {" "}
                      Pas d'heure disponible
                    </span>
                  )}
                </div>

                <p>
                  Nom du Véhicule :{" "}
                  <span className=" dark:text-orange-500 notranslate font-normal text-gray-700 pl-3">
                    {currentVéhicule?.description || "---"}
                  </span>
                </p>

                <p>
                  Plaque d'immatriculation:{" "}
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                    {currentVéhicule?.licensePlate || "---"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div
            className={`
            ${preparationDownloadPDF ? " " : "shadow-md"} 
             mt-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4`}
          >
            <div className="flex gap-4 items-center-- border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <div>
                <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                  Informations sur le trajet du véhicule
                </h2>
              </div>
            </div>

            <div>
              <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="flex flex-wrap">
                  <p>Date de recherche trouvée :</p>
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {jourDebut ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-700">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-700">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )
                      <span>Pas de date disonible</span>
                    )}
                  </span>
                </div>
                {/*  */}
                <div className="flex flex-wrap">
                  <p>Heure de recherche trouvée :</p>
                  {currentVéhicule?.véhiculeDetails[
                    currentVéhicule?.véhiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-700">
                        {heureDebut}
                      </span>{" "}
                      à{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-700">
                        {heureFin}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-bold ml-5 dark:text-orange-500">
                      {" "}
                      Pas d'heure disponible
                    </span>
                  )}
                </div>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p>
                  Heure de départ:{" "}
                  <span className=" whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {heureActiveDebut &&
                      isSearching &&
                      FormatDateHeure(heureActiveDebut.timestamp)?.date}{" "}
                  </span>
                  {isSearching && <span className="mx-1"> /</span>}
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-1">
                    {heureActiveDebut
                      ? FormatDateHeure(heureActiveDebut.timestamp)?.time
                      : "Pas de mouvement"}{" "}
                  </span>
                </p>
                <p>
                  Heure d'arrivée:{" "}
                  <span className=" whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {heureActiveFin &&
                      isSearching &&
                      FormatDateHeure(heureActiveFin.timestamp)?.date}{" "}
                  </span>
                  {isSearching && <span className="mx-1"> /</span>}
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {heureActiveFin
                      ? FormatDateHeure(heureActiveFin.timestamp)?.time
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
                  <span
                    onClick={() => {
                      console.log(currentPersonelVéhicule);
                    }}
                    className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3"
                  >
                    {/* {formatTime(
                      totalMovingHours,
                      totalMovingMinutes,
                      totalMovingSeconds
                    )} */}
                    {currentPersonelVéhicule?.totalMovingDuration || ""}
                  </span>
                </p>
                <p>
                  Durée des arrêts lors du deplacement :
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                    {/* {formatTime(
                      totalStopHours,
                      totalStopMinutes,
                      totalStopSeconds
                    )} */}
                    {currentPersonelVéhicule?.totalPauseDuration || ""}
                  </span>
                </p>
                <p>
                  Duree de l’arrêts le plus long :
                  <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
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
                    {/* {calculateTotalDistance(
                      currentVéhicule?.véhiculeDetails
                    ).toFixed(0)} */}
                    {currentPersonelVéhicule?.totalDistance?.toFixed() || ""}
                    Km{" "}
                  </span>
                </p>
                <p>
                  Nombre total d’arrêts :
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {nombreArret || "0"} */}
                    {currentPersonelVéhicule?.stopCount || ""}

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
                    {/* {(minSpeed && minSpeed.toFixed(0)) || "0"} Km/h */}
                    {currentPersonelVéhicule?.minSpeed?.toFixed() || "0"} Km/h
                  </span>
                </p>{" "}
                <p>
                  Vitesse maximale:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {(maxSpeed && maxSpeed.toFixed(0)) || "0"} Km/h */}
                    {currentPersonelVéhicule?.maxSpeed?.toFixed() || "0"} Km/h
                  </span>
                </p>
                <p>
                  Vitesse moyenne:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {/* {(averageSpeed && averageSpeed.toFixed(2)) || "0"} Km/h/ */}
                    {currentPersonelVéhicule?.avgSpeed || 0} Km/h
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* {preparationDownloadPDF && <p className="min-h-[10rem]"></p>} */}
          {!preparationDownloadPDF && (
            <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <GiPathDistance className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Trajet du véhicule{" "}
              </h2>
            </div>
          )}

          {!preparationDownloadPDF && (
            <div>
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
              )}{" "}
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
          {preparationDownloadPDF && <p className="min-h-[5rem]">.</p>}

          <div
            className={`
            ${preparationDownloadPDF ? " " : "shadow-md"}
             mt-20 mb-2  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700  bg-orange-50 p-2 rounded-md flex items-center gap-4`}
          >
            <SlSpeedometer className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Graphe des vitesses{" "}
            </h2>
          </div>

          {/* ///////////////////////////////////////// */}
          {/* ///////////////////////////////////////// */}
          {/* preparationDownloadPDF */}
          <div
            className={`${
              preparationDownloadPDF
                ? "min-w-[47.5rem] max-w-[47.5rem] lg:min-w-[2rem]"
                : ""
            } overflow-auto  max-w-[100vw]--- `}
          >
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
          {/* {preparationDownloadPDF && <p className="min-h-[13rem]"></p>} */}
          {/* xxxxxxxxx */}
          {showHistoriquePupup && (
            <div className="fixed hidden- z-[10000000000] inset-0 bg-black/50 flex justify-center items-center">
              <div className="relative min-w-[80vw] mx-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="absolute z-[11] bg-white dark:bg-gray-900 p-4 py-6 top-0 left-0 right-0 flex flex-col justify-center items-center">
                  <IoClose
                    onClick={() => {
                      setshowHistoriquePupup(false);
                    }}
                    className="absolute z-[22222222222] top-3 right-4 cursor-pointer text-2xl text-red-500"
                  />
                  <h3 className="text-orange-500">Historique</h3>
                  <h2 className="text-gray-700 notranslate dark:text-gray-200 text-center">
                    {currentVéhicule?.description || ""}
                  </h2>
                </div>
                <div className="relative  overflow-auto mx-1 w-full h-[90vh] p-1 mx-4- max-w-[90vw]">
                  <HistoriqueMainComponent
                    currentVéhicule={currentVéhicule}
                    loadingHistoriqueFilter={loadingHistoriqueFilter}
                    véhiculeHistoriqueDetails={véhiculeHistoriqueDetails}
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
          {voirPositionSurCarte && (
            <div className="z-[9999999999999999999999999999999999999999999999999999999999999] fixed bg-black/50 inset-0 pt-20 px-4">
              <div className="relative    h-[80vh] min-w-[90vw] my-20 rounded-lg mt-3 overflow-hidden">
                <button
                  className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
                  // onClick={centerOnFirstMarker}
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
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          <div className="shadow-md-- relative mt-20 pb-[10rem] cursor-pointer dark:bg-gray-800-- dark:shadow-lg-- dark:shadow-gray-700 py-4 hover:bg-orange-100/70-- bg-orange-50-- p-2- rounded-md flex--- items-start gap-4">
            <div
              className={` 
              ${preparationDownloadPDF ? " " : "shadow-md"}
              flex  dark:bg-gray-800 bg-orange-50 flex-col border-b-- border-orange-600/30 dark:border-gray-600 p-3 rounded-lg mb-3 pb-2-- mb-3--`}
            >
              <div className="flex  gap-4 items-center border-b-- border-orange-600/30 dark:border-gray-600 pb-2-- mb-3--">
                <TfiMapAlt className="min-w-[2rem] text-[1.82rem] text-orange-400 " />

                <div className="flex   items-center justify-between gap-2 w-full">
                  <h2 className="font-semibold dark:text-orange-500 text-orange-900">
                    {addressType
                      ? `Tous les lieux fréquentés (${filteredAddresses?.length})`
                      : `Tous les lieux Stationnés (${filteredAddresses?.length})`}{" "}
                  </h2>

                  <div
                    onClick={() => {
                      setlieuxFrequentePupup(!lieuxFrequentePupup);
                    }}
                    className="flex items-center gap-3 "
                  >
                    <p className="font-semibold hidden xs:block text-lg text-orange-500 mb-0.5">
                      Filtrer
                    </p>

                    {lieuxFrequentePupup ? (
                      <IoClose
                        // onClick={() => setlieuxFrequentePupup(false)}
                        className="text-2xl text-red-500"
                      />
                    ) : (
                      <IoChevronDownCircleOutline
                        onClick={() => {
                          // setlieuxFrequentePupup(true);
                        }}
                        className="text-2xl text-orange-500"
                      />
                    )}
                  </div>
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
                    <div
                      onClick={() => {
                        handleClick();
                        setlieuxFrequentePupup(false);
                        setshowHistoriquePupup(true);
                      }}
                      className="flex items-center gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800 hover:rounded-lg "
                    >
                      <IoStatsChart className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">Voir l'Histoirque</h4>
                    </div>
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

                {currentVéhicule?.véhiculeDetails[
                  currentVéhicule?.véhiculeDetails?.length - 1
                ]?.timestamp ? (
                  <p className="text-[.9rem]">
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                      De{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      à{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold text-gray-950">
                        {heureFin}
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
            {/*  */}
            <div>
              <div className="text-gray-600  flex flex-col gap-4">
                {ordreCroissant ? (
                  filteredAddresses?.length > 0 ? (
                    filteredAddresses?.map((item, index) => {
                      const numero = filteredAddresses.length - index;

                      return (
                        <Tooltip
                          title="Voir cette position sur la carte
"
                          PopperProps={{
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -15], // Décalage horizontal et vertical
                                },
                              },
                              {
                                name: "zIndex",
                                enabled: true,
                                phase: "write",
                                fn: ({ state }) => {
                                  state.styles.popper.zIndex = 11; // Niveau très élevé
                                },
                              },
                            ],
                          }}
                        >
                          <div
                            className={`
                              ${preparationDownloadPDF ? " " : "shadow-md"}
                              bg-orange-50 dark:bg-gray-800 p-3 rounded-lg   `}
                            key={index}
                            onClick={() => {
                              setSelectedVehicleToShowInMap(
                                currentVéhicule.deviceID
                              );

                              setHistoriqueSelectedLocationIndex(
                                item.addressIndex
                              );
                              setvoirPositionSurCarte(true);
                            }}
                          >
                            <p className="dark:text-gray-500 font-bold">
                              <span className="font-bold dark:text-orange-500 text-black mr-3">
                                {numero} {") "}
                              </span>
                              {item.address}
                            </p>
                            <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                              <p>
                                <span className="font-bold">Date : </span>
                                {item.timestamp
                                  ? FormatDateHeure(item.timestamp)?.date
                                  : "Pas de date disponible"}{" "}
                              </p>
                              <p>
                                <span className="font-bold">Heure : </span>
                                {FormatDateHeure(item.timestamp)?.time}{" "}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                              <p>
                                <span className="font-bold">Vitesse : </span>
                                {item.speedKPH && !isNaN(Number(item.speedKPH))
                                  ? Number(item.speedKPH).toFixed(0) + " km/h"
                                  : "Non disponible"}
                              </p>
                              <p>
                                <span className="font-bold">Statut : </span>
                                {item.speedKPH <= 0 && "En stationnement"}
                                {item.speedKPH >= 1 &&
                                  item.speedKPH < 20 &&
                                  "En mouvement lent"}
                                {item.speedKPH >= 20 && "En mouvement rapide"}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })
                  ) : (
                    <p className="px-4 dark:text-gray-200 dark:bg-gray-800 text-center py-10">
                      Pas de Résultat
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
                        <Tooltip
                          title="Voir cette position sur la carte
                        "
                          PopperProps={{
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -15], // Décalage horizontal et vertical
                                },
                              },
                              {
                                name: "zIndex",
                                enabled: true,
                                phase: "write",
                                fn: ({ state }) => {
                                  state.styles.popper.zIndex = 11; // Niveau très élevé
                                },
                              },
                            ],
                          }}
                        >
                          <div
                            className={`
                              ${preparationDownloadPDF ? " " : "shadow-md"}
                              bg-orange-50 dark:bg-gray-900/40 dark:text-gray-300 p-3 rounded-lg    dark:shadow-gray-700`}
                            key={index}
                            onClick={() => {
                              setSelectedVehicleToShowInMap(
                                currentVéhicule.deviceID
                              );
                              setHistoriqueSelectedLocationIndex(
                                item.addressIndex
                              );
                              setvoirPositionSurCarte(true);
                              console.log(item.addressIndex);
                            }}
                          >
                            <p className="dark:text-gray-200 font-bold pb-4">
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
                                  ? FormatDateHeure(item.timestamp)?.date
                                  : "Pas de date disponible"}{" "}
                              </p>
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  Heure :{" "}
                                </span>
                                {FormatDateHeure(item.timestamp)?.time}{" "}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  Vitesse :{" "}
                                </span>
                                {item.speedKPH && !isNaN(Number(item.speedKPH))
                                  ? Number(item.speedKPH).toFixed(0) + " km/h"
                                  : "Non disponible"}
                              </p>
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  Statut :{" "}
                                </span>
                                {item.speedKPH <= 0 && "En stationnement"}
                                {item.speedKPH >= 1 &&
                                  item.speedKPH < 20 &&
                                  "En mouvement lent"}
                                {item.speedKPH >= 20 && "En mouvement rapide"}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })
                ) : (
                  <p className="px-4 text-center py-10">Pas de Résultat</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen-- pt-20 flex flex-col justify-center items-center">
          <button
            onClick={() => {
              setShowOptions(true);
            }}
            className="bg-orange-100  px-4 py-1 mt-5 cursor-pointer rounded-lg"
          >
            Choisissez un véhicule
          </button>
        </div>
      )}
    </>
  );
}

export default RapportPersonnel;
