import React, { useContext, useEffect, useMemo, useState } from "react";
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

import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/pin/ping_red.png";
// import { DataContext } from "../context/DataContext";
import { RiPinDistanceLine } from "react-icons/ri";
import { SlSpeedometer } from "react-icons/sl";
import TrajetVehicule from "../historique_vehicule/TrajetVehicule";
import { DataContext } from "../../context/DataContext";
import HistoriqueMainComponent from "../historique_vehicule/HistoriqueMainComponent";
import MapComponent from "../location_vehicule/MapComponent";
import { useTranslation } from "react-i18next";

function RapportPersonnel({
  // currentVéhicule,
  heureActiveDebut,
  heureActiveFin,
  selectUTC,
  formatTimestampToTime,
  longestHours,
  longestMinutes,
  longestSeconds,
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
  downloadExelPDF,
  lastIndex,
  firstIndex,
  setStopsPositionsListe,
}) {
  const {
    loadingHistoriqueFilter,
    véhiculeHistoriqueDetails,
    setVéhiculeHistoriqueDetails,
    setCurrentVéhicule,
    currentDataFusionné,
    setSelectedVehicleToShowInMap,
    setHistoriqueSelectedLocationIndex,
    FormatDateHeure,
    rapportPersonnelPDFtRef,
    currentVéhicule,
    currentPersonelVéhicule,
    rapportPersonelleData,
    setSelectedVehicleHistoriqueToShowInMap,
  } = useContext(DataContext); // const { currentVéhicule } = useContext(DataContext);

  const [t, i18n] = useTranslation();

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

  // const isSearching = searchDonneeFusionnéForRapport?.length > 0;

  const firstIndexFilter = vehicles?.findIndex(
    (item) => parseFloat(item.speedKPH) > 0
  );

  const lastIndexFilter =
    vehicles?.length -
    1 -
    [...vehicles].reverse().findIndex((item) => parseFloat(item.speedKPH) > 0);

  const filteredListDevicesNoSpeed = vehicles?.filter((item, index) => {
    const speed = parseFloat(item.speedKPH);
    return speed <= 0 && index > firstIndexFilter && index < lastIndexFilter;
  });
  // const filteredListDevicesNoSpeed = vehicles?.filter(
  //   (item) => parseFloat(item.speedKPH) <= 0
  // );

  // Exemple de données
  const data = currentVéhicule?.véhiculeDetails;

  function formatTime2(ts) {
    const date = new Date(parseInt(ts) * 1000);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function secondsToHMS(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  }

  function summarize(data) {
    const sortedData = [...data].sort(
      (a, b) => parseInt(a.timestamp) - parseInt(b.timestamp)
    );

    const firstMoveIndex = sortedData.findIndex(
      (d) => parseFloat(d.speedKPH) > 0
    );
    const lastMoveIndex = sortedData
      .map((d) => parseFloat(d.speedKPH) > 0)
      .lastIndexOf(true);

    if (firstMoveIndex === -1 || lastMoveIndex === -1) {
      return { message: "Aucun déplacement détecté" };
    }

    const movingData = sortedData
      .slice(firstMoveIndex, lastMoveIndex + 1)
      .filter((d) => parseFloat(d.speedKPH) > 0);

    const startTime =
      sortedData[firstMoveIndex - 1]?.timestamp ||
      sortedData[firstMoveIndex]?.timestamp;
    const endTime =
      sortedData[lastMoveIndex + 1]?.timestamp ||
      sortedData[lastMoveIndex]?.timestamp;

    const startAddress =
      sortedData[firstMoveIndex - 1]?.address ||
      sortedData[firstMoveIndex]?.address;
    const endAddress =
      sortedData[lastMoveIndex + 1]?.address ||
      sortedData[lastMoveIndex]?.address;

    let movingSeconds = 0;
    let stopSeconds = 0;
    let longestStop = 0;
    let currentStop = 0;
    let stopsCount = 0;
    let totalDistance = 0;

    // Fonction pour calculer la distance entre deux coordonnées
    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371; // Rayon Terre en km
      const toRad = (x) => (x * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // en km
    }

    for (let i = firstMoveIndex + 1; i <= lastMoveIndex; i++) {
      const prev = sortedData[i - 1];
      const curr = sortedData[i];
      const delta = parseInt(curr.timestamp) - parseInt(prev.timestamp);
      if (delta < 0) continue;

      // Ajout distance calculée entre points
      if (prev.latitude && prev.longitude && curr.latitude && curr.longitude) {
        totalDistance += haversine(
          parseFloat(prev.latitude),
          parseFloat(prev.longitude),
          parseFloat(curr.latitude),
          parseFloat(curr.longitude)
        );
      }

      if (parseFloat(prev.speedKPH) > 0) {
        movingSeconds += delta;
        currentStop = 0;
      } else {
        stopSeconds += delta;
        currentStop += delta;
        if (currentStop > longestStop) longestStop = currentStop;
      }

      if (parseFloat(prev.speedKPH) > 0 && parseFloat(curr.speedKPH) === 0) {
        stopsCount++;
      }
    }

    const speeds = movingData.map((d) => parseFloat(d.speedKPH));

    return {
      "Heure de départ": FormatDateHeure(startTime)?.time,
      "Heure d'arrivée": FormatDateHeure(endTime)?.time,

      "Adresse de départ": startAddress,
      "Adresse d'arrivée": endAddress,

      "Durée totale en mouvement": secondsToHMS(movingSeconds),
      "Durée des arrêts lors du déplacement": secondsToHMS(stopSeconds),
      "Durée de l'arrêt le plus long": secondsToHMS(longestStop),
      "Distance totale parcourue": `${totalDistance.toFixed(1)} Km`,
      "Nombre total d'arrêts": stopsCount,

      "Vitesse minimale": `${Math.min(...speeds).toFixed(0)} Km`,
      "Vitesse maximale": `${Math.max(...speeds).toFixed(0)} Km`,
      "Vitesse moyenne": `${(
        speeds.reduce((a, b) => a + b, 0) / speeds.length
      ).toFixed(0)} Km`,
    };
  }

  // Filtrer seulement les vitesses > 0
  const filteredSpeeds =
    vehicles?.length > 0 &&
    vehicles
      ?.map((item, index) => ({ ...item, index }))
      .filter((item) => parseFloat(item.speedKPH) > 0);

  // if (filteredSpeeds.length > 0) {
  // Trouver l'objet avec la plus petite vitesse
  const minSpeedVehicle =
    filteredSpeeds.length > 0 &&
    filteredSpeeds?.reduce((min, item) =>
      parseFloat(item.speedKPH) < parseFloat(min.speedKPH) ? item : min
    );

  const maxSpeedVehicle =
    vehicles.length > 0 &&
    vehicles?.reduce((max, item) =>
      parseFloat(item.speedKPH) > parseFloat(max.speedKPH) ? item : max
    );

  const maxSpeedIndex = currentVéhicule?.véhiculeDetails?.findIndex(
    (item) => parseFloat(item.speedKPH) === parseFloat(maxSpeedVehicle.speedKPH)
  );

  const minSpeedIndex = currentVéhicule?.véhiculeDetails?.findIndex(
    (item) => parseFloat(item.speedKPH) === parseFloat(minSpeedVehicle.speedKPH)
  );

  const longestStopIndex = currentVéhicule?.véhiculeDetails?.findIndex(
    (item) => item === rapportPersonelleData?.longestStopObject
  );

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
          <h1
            onClick={() => {
              console.log(
                "rapportPersonelleData?.stopsPositions",
                rapportPersonelleData
              );
              console.log("longestStopIndex", longestStopIndex);

              rapportPersonelleData?.stopsPositions;
            }}
            className="text-center mb-2 mt-[2rem] md:mt-0 font-semibold text-xl mt-16-- dark:text-gray-300"
          >
            {t("Rapport détaillé du véhicule")}
          </h1>
          <h1 className="text-center notranslate mb-16 text-orange-600  text-md font-bold my-2 dark:text-gray-300">
            {currentVéhicule?.description || "---"}
          </h1>
          <div
            className={`mb-12 ${
              preparationDownloadPDF ? " " : "shadow-md"
            }  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-700 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4`}
          >
            <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
              <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                {t("Informations sur le véhicule")}
              </h2>
            </div>

            {/* ///////////////////////////// */}

            <div>
              <div className="text-gray-700 font-bold flex flex-col gap-2 dark:text-gray-300">
                <div className="flex flex-wrap">
                  <p>{t("Date de recherche trouvée")} :</p>
                  <span className="font-normal dark:text-orange-500 text-gray-700 pl-5">
                    {jourDebut ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        {t("Du")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        {t("au")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )
                      <span>{t("Pas de date disponible")}</span>
                    )}
                  </span>
                </div>

                {/*  */}
                <div className="flex flex-wrap">
                  <p>{t("Heure de recherche trouvée")} :</p>
                  {currentVéhicule?.véhiculeDetails[
                    currentVéhicule?.véhiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-normal dark:text-orange-500 text-gray-700 pl-5">
                      {t("De")}{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-950">
                        {heureFin}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-normal ml-5 dark:text-orange-500">
                      {" "}
                      {t("Pas d'heure disponible")}
                    </span>
                  )}
                </div>

                <p>
                  {t("Nom du Véhicule")} :{" "}
                  <span className=" dark:text-orange-500 notranslate font-normal text-gray-700 pl-3">
                    {currentVéhicule?.description || "---"}
                  </span>
                </p>

                <p>
                  {t("Plaque d'immatriculation")}:{" "}
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
                  {t("Informations sur le trajet du véhicule")}
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
                  <p>{t("Date de recherche trouvée")} :</p>
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {jourDebut ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        {t("Du")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-700">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        {t("au")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold- text-gray-700">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )
                      <span>{t("Pas de date dispobible")}</span>
                    )}
                  </span>
                </div>
                {/*  */}
                <div className="flex flex-wrap">
                  <p>{t("Heure de recherche trouvée")} :</p>
                  {currentVéhicule?.véhiculeDetails[
                    currentVéhicule?.véhiculeDetails?.length - 1
                  ]?.timestamp ? (
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                      {t("De")}{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold- text-gray-700">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold- text-gray-700">
                        {heureFin}{" "}
                      </span>{" "}
                    </span>
                  ) : (
                    <span className="font-bold ml-5 dark:text-orange-500">
                      {" "}
                      {t("Pas d'heure disponible")}
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
                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Heure de départ")}:{" "}
                    <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-1">
                      {heureActiveDebut
                        ? FormatDateHeure(heureActiveDebut.timestamp)?.time
                        : `${t("Pas de mouvement")}`}{" "}
                      {/* ----
                      {summarize(data)["Heure de départ"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(lastIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Heure d'arrivée")}:{" "}
                    <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-1">
                      {heureActiveFin
                        ? FormatDateHeure(heureActiveFin.timestamp)?.time
                        : `${t("Pas de mouvement")}`}{" "}
                      {/* ----
                      {summarize(data)["Heure d'arrivée"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(firstIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                <div className="flex justify-between w-full items-center gap-3">
                  <p>
                    {t("Adresse de départ")}:{" "}
                    <span className="font-bold  dark:text-orange-500 text-gray-700 pl-1 ">
                      {summarize(data)["Adresse de départ"]}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(lastIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center gap-3">
                  <p>
                    {t("Adresse d'arrivée")}:{" "}
                    <span className="font-bold  dark:text-orange-500 text-gray-700 pl-1 ">
                      {summarize(data)["Adresse d'arrivée"]}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(firstIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="flex justify-between w-full items-center gap-3">
                  <p>
                    {t("Durée total en mouvement")} :{" "}
                    <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.totalMovingDuration}
                      {/* ----
                      {summarize(data)["Durée totale en mouvement"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setzoomCart(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center gap-3">
                  <p>
                    {t("Durée des arrêts lors du déplacement")} :
                    <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.totalStopDuration}
                      {/* ----
                      {summarize(data)["Durée des arrêts lors du déplacement"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setzoomCart(true);
                      setStopsPositionsListe(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>

                <div className="flex justify-between w-full items-center gap-3">
                  <p>
                    {t("Duree de l’arrêts le plus long")} :
                    <span className="font-bold whitespace-nowrap dark:text-orange-500 text-gray-700 pl-3">
                      {formatTime(longestHours, longestMinutes, longestSeconds)}
                      {/* ----
                    {summarize(data)["Durée de l'arrêt le plus long"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(longestStopIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Distance totale parcourue")}:
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.totalDistance?.toFixed(0) + " Km"}
                      {/* ----
                    {summarize(data)["Distance totale parcourue"]} // */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setzoomCart(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Nombre total d’arrêts")} :
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.stopCount}
                      {/* ----
                    {summarize(data)["Nombre total d'arrêts"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setzoomCart(true);
                      setStopsPositionsListe(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}

                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Vitesse minimale")}:
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.minSpeed?.toFixed(0) + " Km"}
                      {/* ----
                    {summarize(data)["Vitesse minimale"]} */}
                    </span>
                  </p>{" "}
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(minSpeedIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>

                <div className="flex justify-between w-full items-center">
                  <p>
                    {t("Vitesse maximale")}:
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      {rapportPersonelleData?.maxSpeed?.toFixed(0) + " Km"}
                      {/* ----
                    {summarize(data)["Vitesse maximale"]} */}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(currentVéhicule?.deviceID);
                      setHistoriqueSelectedLocationIndex(maxSpeedIndex);
                      setSelectedVehicleHistoriqueToShowInMap(true);
                      setvoirPositionSurCarte(true);
                    }}
                    className="underline whitespace-nowrap text-orange-500 pr-4 cursor-pointer font-semibold"
                  >
                    {t("voir")}
                  </p>
                </div>

                <p>
                  {t("Vitesse moyenne")}:
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {rapportPersonelleData?.avgSpeed} Km
                    {/* ----
                    {summarize(data)["Vitesse moyenne"]} */}
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
                {t("Trajet du véhicule")}{" "}
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
                        setStopsPositionsListe(false);
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
                <div className="relative  rounded-lg  mt-3 h-[60vh] md:h-[60vh] overflow-hidden w-full">
                  <button
                    className="absolute z-[999] top-[45%] right-[50%] translate-x-[50%]"
                    // onClick={centerOnFirstMarker}
                    onClick={() => {
                      setzoomCart(true);
                    }}
                  >
                    <div className="flex justify-center items-center min-w-14 min-h-14 rounded-full bg-white shadow-xl">
                      <MdOutlineFullscreen className="text-orange-500 text-[2.3rem]" />
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
                  <div className="absolute -top-[11rem] rounded-lg  w-full  z-[2]">
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
                  <div className="absolute inset-0 bg-black/20 z-[3]">
                    {/* filter */}x
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
              {t("Graphe des vitesses")}{" "}
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
              <div className="relative min-w-[100vw] mx-2 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="absolute z-[11] bg-white dark:bg-gray-900 p-4 py-6 top-0 left-0 right-0 flex flex-col justify-center items-center">
                  <IoClose
                    onClick={() => {
                      setshowHistoriquePupup(false);
                    }}
                    className="absolute z-[22222222222] top-3 right-4 cursor-pointer text-2xl text-red-500"
                  />
                  <h3 className="text-orange-500">{t("Historique")}</h3>
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
            <div className="z-[999999999999999999999999999999999] fixed bg-black/50 inset-0 pt-20-- ">
              <div className="relative  h-[100vh]  min-w-[100vw]  rounded-lg">
                <button
                  className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[2rem] right-[2rem]"
                  // onClick={centerOnFirstMarker}
                  onClick={() => {
                    setvoirPositionSurCarte(false);
                  }}
                >
                  <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                    <IoClose className="text-red-500 text-[1.62rem]" />
                  </div>
                </button>

                <div className=" -translate-y-[10rem]--">
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
                      ? `${t("Tous les lieux fréquentés")} (${
                          filteredAddresses?.length
                        })`
                      : `${t("Tous les lieux Stationnés")} (${
                          filteredAddresses?.length
                        })`}{" "}
                  </h2>

                  <div
                    onClick={() => {
                      setlieuxFrequentePupup(!lieuxFrequentePupup);
                    }}
                    className="flex items-center gap-3 "
                  >
                    <p className="font-semibold hidden xs:block text-lg text-orange-500 mb-0.5">
                      {t("Filtrer")}
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

                      <h4 className="dark:text-gray-200">{t("Recherche")}</h4>
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

                      <h4 className="dark:text-gray-200">
                        {t("Voir l’historique")}
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
                        setaddressType(true);
                        // setfrequenterOrStationnee("frequente");
                      }}
                      className={`${
                        addressType && "bg-orange-50 "
                      } flex items-center  dark:bg-gray-800 dark:rounded-lg gap-4 border-b  p-2 mb-2 hover:bg-orange-50 dark:hover:bg-gray-800  hover:rounded-lg `}
                    >
                      <TfiMapAlt className="text-orange-500 text-xl" />

                      <h4 className="dark:text-gray-200">
                        {t("Tous les lieux fréquentés")}
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
                        {t("Tous les lieux Stationnés")}
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
                        {t("Filtre en ordre croissant")}
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
                        {t("Filtre en ordre décroissant")}
                      </h4>
                    </div>
                  </div>
                )}
              </div>

              {lieuxFrequentePupupSearch && (
                <div className="border flex  max-w-[30rem]-- max-auto w-full dark:bg-gray-900 mt-3 bg-white justify-between border-gray-400 rounded-lg p-2 py-1">
                  <input
                    type="text"
                    placeholder={`${t("Rechercher")}`}
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
                        {t("Du")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        {t("au")}{" "}
                        <span className="dark:text-orange-500 dark:font-normal font-semibold text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    ) : (
                      // )

                      <span>{t("Pas de date disponible")}</span>
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
                      {t("De")}{" "}
                      <span className="dark:text-orange-500 mx-1 dark:font-normal font-semibold text-gray-950">
                        {heureDebut}
                      </span>{" "}
                      {t("à")}{" "}
                      <span className="dark:text-orange-500 ml-1 dark:font-normal font-semibold text-gray-950">
                        {heureFin}
                      </span>{" "}
                    </span>
                  </p>
                ) : (
                  <p className="text-[.9rem] ml-3 text-gray-700 dark:text-orange-500">
                    {t("Pas d'heure disponible")}
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
                          title={`${t("Voir cette position sur la carte")}`}
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
                                <span className="font-bold">
                                  {t("Date")} :{" "}
                                </span>
                                {item.timestamp
                                  ? FormatDateHeure(item.timestamp)?.date
                                  : `${t("Pas de date disponible")}`}{" "}
                              </p>
                              <p>
                                <span className="font-bold">
                                  {t("Heure")} :{" "}
                                </span>
                                {FormatDateHeure(item.timestamp)?.time}{" "}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                              <p>
                                <span className="font-bold">
                                  {t("Vitesse")} :{" "}
                                </span>
                                {item.speedKPH && !isNaN(Number(item.speedKPH))
                                  ? Number(item.speedKPH).toFixed(0) + " km/h"
                                  : "Non disponible"}
                              </p>
                              <p>
                                <span className="font-bold">
                                  {t("Statut")} :{" "}
                                </span>
                                {item.speedKPH <= 0 &&
                                  `${t("En stationnement")}`}
                                {item.speedKPH >= 1 &&
                                  item.speedKPH < 20 &&
                                  `${t("En mouvement lent")}`}
                                {item.speedKPH >= 20 &&
                                  `${t("En mouvement rapide")}`}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })
                  ) : (
                    <p className="px-4 dark:text-gray-200 dark:bg-gray-800 text-center py-10">
                      {t("Pas de Résultat")}
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
                          title={`${t("Voir cette position sur la carte")}`}
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
                                  {t("Date")} :{" "}
                                </span>
                                {item.timestamp
                                  ? FormatDateHeure(item.timestamp)?.date
                                  : `${t("Pas de date disponible")}`}{" "}
                              </p>
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  {t("Heure")} :{" "}
                                </span>
                                {FormatDateHeure(item.timestamp)?.time}{" "}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4 border-t mt-1 pt-1">
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  {t("Vitesse")} :{" "}
                                </span>
                                {item.speedKPH && !isNaN(Number(item.speedKPH))
                                  ? Number(item.speedKPH).toFixed(0) + " km/h"
                                  : `${t("Non disponible")}`}
                              </p>
                              <p>
                                <span className="font-bold  dark:text-orange-400">
                                  Statut :{" "}
                                </span>
                                {item.speedKPH <= 0 &&
                                  `${t("En stationnement")}`}
                                {item.speedKPH >= 1 &&
                                  item.speedKPH < 20 &&
                                  `${t("En mouvement lent")}`}
                                {item.speedKPH >= 20 &&
                                  `${t("En mouvement rapide")}`}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })
                ) : (
                  <p className="px-4 text-center py-10">
                    {t("Pas de Résultat")}
                  </p>
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
            {t("Choisissez un véhicule")}
          </button>
        </div>
      )}
    </>
  );
}

export default RapportPersonnel;
