import React, { useContext, useEffect, useRef, useState } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import { DataContext } from "../context/DataContext";
import DateTimePicker from "../components/home/DateTimePicker";
import Liste_options from "../components/home/Liste_options";
import ShowVehiculeListeComponent from "../components/historique_vehicule/ShowVehiculeListeComponent";
import ShowFilterComponent from "../components/historique_vehicule/ShowFilterComponent";
import HistoriqueMainComponent from "../components/historique_vehicule/HistoriqueMainComponent";
import HistoriqueHeader from "../components/historique_vehicule/HistoriqueHeader";
import TrajetVehicule from "../components/historique_vehicule/TrajetVehicule";
// import ShowVehiculeListeComponent from "../components/location_vehicule/ShowVehiculeListeComponent";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function HistoriquePage() {
  const [showFilter, setshowFilter] = useState(false);
  const [typeDeVue, setTypeDeVue] = useState(false);

  const {
    mergedData,
    currentVehicule,
    loadingHistoriqueFilter,
    setShowListOption,
    showListeOption,
    vehiclueHistoriqueDetails,
    setCurrentVehicule,
    showHistoriqueInMap,
    setShowHistoriqueInMap,
    donneeFusionneeForRapport,
    setVehiclueHistoriqueDetails,
    selectUTC,
    fetchHistoriqueVehicleDetails,
  } = useContext(DataContext);

  const [checkboxes, setCheckboxes] = useState({
    en_marche: true,
    en_ralenti: true,
    en_arret: true,
  });

  const mapRef = useRef(); // Référence de la carte

  const [appliedCheckboxes, setAppliedCheckboxes] = useState(checkboxes);

  // // Filtrage pour supprimer les doublons et respecter l'intervalle de 10 minutes
  const ecar10minuteArret = [];
  let lastZeroSpeedTimestamp = null;

  vehiclueHistoriqueDetails
    ?.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
    .forEach((details) => {
      const timestamp = parseInt(details.timestamp);
      const speedKPH = parseFloat(details.speedKPH);

      if (speedKPH <= 0) {
        if (
          lastZeroSpeedTimestamp === null ||
          lastZeroSpeedTimestamp - timestamp >= 600
        ) {
          ecar10minuteArret.push(details);
          lastZeroSpeedTimestamp = timestamp;
        }
      } else {
        ecar10minuteArret.push(details);
      }
    });

  const filteredVehicles = ecar10minuteArret?.filter(
    (vehicle) =>
      (appliedCheckboxes.en_marche && vehicle.speedKPH > 20) ||
      (appliedCheckboxes.en_ralenti &&
        vehicle.speedKPH >= 1 &&
        vehicle.speedKPH <= 20) ||
      (appliedCheckboxes.en_arret && vehicle.speedKPH < 1)
  );

  const historiqueInMap = filteredVehicles
    ? Object.values(filteredVehicles)
    : [];
  const vehicleData = historiqueInMap?.map((vehicule) => ({
    description:
      // currentVehicule?.displayName ||
      currentVehicule?.description || "Véhicule",
    lastValidLatitude: vehicule?.latitude || "",
    lastValidLongitude: vehicule?.longitude || "",
    address: vehicule?.backupAddress || vehicule?.address || "",
    imeiNumber: currentVehicule?.imeiNumber || "",
    isActive: currentVehicule?.isActive || "",
    licensePlate: currentVehicule?.licensePlate || "",
    simPhoneNumber: currentVehicule?.simPhoneNumber || "",
    speedKPH: vehicule?.speedKPH || 0, // Ajout de la vitesse
    timestamp: vehicule?.timestamp || 0, // Ajout de la vitesse
    heading: vehicule?.heading || "",
  }));

  const vehicles = vehicleData;

  const [mapType, setMapType] = useState("streets");
  const [currentLocation, setCurrentLocation] = useState(null);

  const tileLayers = {
    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.carto.com/attributions">CARTO</a>',
    },
    humanitarian: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://hot.openstreetmap.org">Humanitarian OpenStreetMap Team</a>',
    },
    positron: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.carto.com/attributions">CARTO</a>',
    },
  };

  const getMarkerIcon = (vehicule) => {
    // const speedKPH = vehicule.speedKPH;

    const speed = parseFloat(vehicule.speedKPH);
    const direction = Math.round(vehicule.heading / 45.0) % 8;

    if (speed <= 0) return "/pin/ping_red.png";
    else if (speed > 0 && speed <= 20)
      return `/pin/ping_yellow_h${direction}.png`;
    else return `/pin/ping_green_h${direction}.png`;
  };

  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // Ouvrir dans un nouvel onglet
  };

  const dataFusionee = mergedData ? Object.values(mergedData) : [];

  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes}  ${period}`;
    // return `${hours}:${minutes}:${seconds} ${period}`;
  }

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleVehicleClick = (vehicule) => {
    const deviceID = vehicule.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle = donneeFusionneeForRapport.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel

      setVehiclueHistoriqueDetails(foundVehicle.vehiculeDetails);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }

    setShowVehiculeListe(!showVehiculeListe);
  };

  const handleCheckboxChange = (name) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVehiclesPupup = dataFusionee?.filter(
    (vehicule) =>
      // vehicule.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicule?.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Récupérer les positions successives pour les lignes rouges
  const positions = vehicles.map((vehicle) => [
    vehicle.lastValidLatitude,
    vehicle.lastValidLongitude,
  ]);

  // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarker = () => {
    if (mapRef.current && vehicles.length > 0) {
      const { lastValidLatitude, lastValidLongitude } = vehicles[0];
      mapRef.current.setView([lastValidLatitude, lastValidLongitude], 15);
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  /////////////////////////////////////////////////////////////////////////
  // Formatage de la date actuelle
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);
  const today = new Date(); // La date actuelle

  // Initialisation de la date et de l'heure actuelles par défaut
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("00:00"); // Heure de début fixée à minuit
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState(getCurrentTime());
  const [timeFrom, settimeFrom] = useState();
  const [timeTo, settimeTo] = useState();

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
    console.log(startTime);
    console.log(endTime);
    console.log(timeFrom);
    console.log(timeTo);
  }, [startDate, endDate, startTime, endTime, timeFrom, timeTo]);

  const formatDateToISO = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convertir en objet Date si nécessaire
    }
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split("T")[0];
  };

  // Conversion des variables startDate et endDate
  const formattedStartDate = formatDateToISO(startDate);
  const formattedEndDate = formatDateToISO(endDate);

  /////////////////////////////////////////////////////////////////////////

  // Combine les dates formatées avec les heures
  const baseTimeFrom = new Date(`${formattedStartDate}T${startTime}:00`);
  const baseTimeTo = new Date(`${formattedEndDate}T${endTime}:00`);

  // Ajout de 5 heures
  const adjustedTimeFrom = new Date(
    baseTimeFrom.getTime() + (selectUTC ? -selectUTC : 5) * 60 * 60 * 1000
  );

  const adjustedTimeTo = new Date(
    baseTimeTo.getTime() + (selectUTC ? -selectUTC : 5) * 60 * 60 * 1000
  );

  // Formatage en chaîne pour les heures ajustées
  const timeFromFetch = `${adjustedTimeFrom.getFullYear()}-${(
    adjustedTimeFrom.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${adjustedTimeFrom
    .getDate()
    .toString()
    .padStart(2, "0")} ${adjustedTimeFrom
    .getHours()
    .toString()
    .padStart(2, "0")}:${adjustedTimeFrom
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${adjustedTimeFrom
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  const timeToFetch = `${adjustedTimeTo.getFullYear()}-${(
    adjustedTimeTo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${adjustedTimeTo
    .getDate()
    .toString()
    .padStart(2, "0")} ${adjustedTimeTo
    .getHours()
    .toString()
    .padStart(2, "0")}:${adjustedTimeTo
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${adjustedTimeTo
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  ////////////////////////////////////////////////////////////////////////
  const handleApply = (e) => {
    // e.preventDefault();
    if (e) e.preventDefault(); // Vérifie si `e` existe avant d'appeler preventDefault()

    settimeFrom(timeFromFetch);
    settimeTo(timeToFetch);

    console.log("timeFrom:", timeFromFetch);
    console.log("timeToo:", timeToFetch);

    setShowDatePicker(false);
  };

  // Fonction pour appliquer les filtres

  const applyFilter = () => {
    console.log(timeFrom);
    console.log("////////////");
    console.log(timeTo);
    handleApply();

    if (timeFrom && timeTo) {
      fetchHistoriqueVehicleDetails(currentVehicule.deviceID, timeFrom, timeTo);
      setAppliedCheckboxes(checkboxes);
    } else {
      fetchHistoriqueVehicleDetails(
        currentVehicule.deviceID,
        timeFromFetch,
        timeToFetch
      );
      setAppliedCheckboxes(checkboxes);
    }
  };

  return (
    <div className="p-4 min-h-screen flex flex-col gap-4 mt-16 mb-32 px-4 sm:px-12 md:px-20 lg:px-40">
      <div className="z-50"></div>
      {showListeOption && (
        <div className="absolute z-30">
          <Liste_options />
        </div>
      )}
      {showDatePicker && (
        <div className="z-30">
          <DateTimePicker
            setShowDatePicker={setShowDatePicker}
            fetchHistoriqueVehicleDetails={fetchHistoriqueVehicleDetails}
            handleApply={handleApply}
            setStartDate={setStartDate}
            setStartTime={setStartTime}
            setEndDate={setEndDate}
            setEndTime={setEndTime}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
          />
        </div>
      )}

      {loadingHistoriqueFilter && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-black/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      <div className="mb-6 mt-8 md:mt-16">
        <div className="fixed flex justify-center z-20 top-[3.5rem] bg-white dark:bg-gray-800 md:bg-white/0 py-2 pt-3 left-0 right-0">
          <HistoriqueHeader
            setShowHistoriqueInMap={setShowHistoriqueInMap}
            showHistoriqueInMap={showHistoriqueInMap}
            centerOnFirstMarker={centerOnFirstMarker}
            setShowVehiculeListe={setShowVehiculeListe}
            showVehiculeListe={showVehiculeListe}
            currentVehicule={currentVehicule}
            setshowFilter={setshowFilter}
            showFilter={showFilter}
          />

          <ShowVehiculeListeComponent
            showVehiculeListe={showVehiculeListe}
            setShowVehiculeListe={setShowVehiculeListe}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            filteredVehiclesPupup={filteredVehiclesPupup}
            handleVehicleClick={handleVehicleClick}
          />

          <ShowFilterComponent
            showFilter={showFilter}
            setshowFilter={setshowFilter}
            showHistoriqueInMap={showHistoriqueInMap}
            setShowDatePicker={setShowDatePicker}
            checkboxes={checkboxes}
            handleCheckboxChange={handleCheckboxChange}
            applyFilter={applyFilter}
            setTypeDeVue={setTypeDeVue}
            timeFrom={timeFrom}
            timeTo={timeTo}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            showVehiculeListe={showVehiculeListe}
            setShowVehiculeListe={setShowVehiculeListe}
            handleApply={handleApply}
          />
        </div>
      </div>

      {!showHistoriqueInMap ? (
        <div>
          {/* // histiorique section */}
          <HistoriqueMainComponent
            currentVehicule={currentVehicule}
            loadingHistoriqueFilter={loadingHistoriqueFilter}
            vehiclueHistoriqueDetails={vehiclueHistoriqueDetails}
            appliedCheckboxes={appliedCheckboxes}
            setShowListOption={setShowListOption}
            formatTimestampToDate={formatTimestampToDate}
            formatTimestampToTime={formatTimestampToTime}
            selectUTC={selectUTC}
          />
        </div>
      ) : (
        // carte section
        <div className="  fixed z-[9] right-0 top-[5rem] md:top-[3.8rem] bottom-0 overflow-hidden left-0">
          <div className=" mt-[2.3rem] md:mt-0 overflow-hidden">
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
      )}
    </div>
  );
}

export default HistoriquePage;
