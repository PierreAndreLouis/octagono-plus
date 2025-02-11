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
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";

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
    currentVéhicule,
    loadingHistoriqueFilter,
    setShowListOption,
    showListeOption,
    véhiculeHistoriqueDetails,
    setCurrentVéhicule,
    showHistoriqueInMap,
    setShowHistoriqueInMap,
    donneeFusionnéForRapport,
    setVéhiculeHistoriqueDetails,
    selectUTC,
    fetchHistoriqueVehicleDetails,
    currentDataFusionné,
    setSelectedVehicleToShowInMap,
    centrerAutoMapTrajet,
    setCentrerAutoMapTrajet,
  } = useContext(DataContext);

  let x;
  //
  //
  //
  //
  //
  //
  x;
  // Pour mettre a jour le véhicules actuel
  useEffect(() => {
    if (currentVéhicule) {
      const deviceID = currentVéhicule?.deviceID;

      const foundVehicle = currentDataFusionné?.find(
        (v) => v.deviceID === deviceID
      );

      setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
      setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
      setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection
    }
  }, [currentDataFusionné]);

  // Pour filtrer par statut
  const [checkboxes, setCheckboxes] = useState({
    en_marche: true,
    en_ralenti: true,
    en_arret: true,
  });

  // Une reference pour la carte
  const mapRef = useRef(); // Référence de la carte

  // Pour enregistrer les valeur des checkboxes
  const [appliedCheckboxes, setAppliedCheckboxes] = useState(checkboxes);

  // // Filtrage pour supprimer les doublons et respecter l'intervalle de 10 minutes
  const ecar10minuteArret = [];
  let lastZeroSpeedTimestamp = null;

  véhiculeHistoriqueDetails
    ?.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
    .forEach((details) => {
      const timestamp = parseInt(details.timestamp);
      const speedKPH = parseFloat(details.speedKPH);

      if (speedKPH <= 0) {
        if (
          lastZeroSpeedTimestamp === null ||
          lastZeroSpeedTimestamp - timestamp >= 60 * 10 // 10 minutes
        ) {
          ecar10minuteArret.push(details);
          lastZeroSpeedTimestamp = timestamp;
        }
      } else {
        ecar10minuteArret.push(details);
      }
    });

  // filtrer en fonction des statut choisis.
  const filteredVehicles = ecar10minuteArret?.filter(
    (véhicule) =>
      (appliedCheckboxes.en_marche && véhicule.speedKPH > 20) ||
      (appliedCheckboxes.en_ralenti &&
        véhicule.speedKPH >= 1 &&
        véhicule.speedKPH <= 20) ||
      (appliedCheckboxes.en_arret && véhicule.speedKPH < 1)
  );

  // les donnees utiliser dans la carte
  const historiqueInMap = filteredVehicles
    ? Object.values(filteredVehicles)
    : [];
  const véhiculeData = historiqueInMap?.map((véhicule) => ({
    description:
      // currentVéhicule?.displayName ||
      currentVéhicule?.description || "Véhicule",
    lastValidLatitude: véhicule?.latitude || "",
    lastValidLongitude: véhicule?.longitude || "",
    address: véhicule?.backupAddress || véhicule?.address || "",
    imeiNumber: currentVéhicule?.imeiNumber || "",
    isActive: currentVéhicule?.isActive || "",
    licensePlate: currentVéhicule?.licensePlate || "",
    simPhoneNumber: currentVéhicule?.simPhoneNumber || "",
    speedKPH: véhicule?.speedKPH || 0, // Ajout de la vitesse
    timestamp: véhicule?.timestamp || 0, // Ajout de la vitesse
    heading: véhicule?.heading || "",
  }));

  // les donnees pret a être utiliser apres formatage
  const [vehicles, setvehicles] = useState(véhiculeData);

  // Mettre a jour le data
  useEffect(() => {
    setvehicles(véhiculeData);
    // console.log(vehicles);
  }, [véhiculeHistoriqueDetails, vehicles, currentVéhicule]);
  //
  //
  //
  //

  useEffect(() => {
    // setvehicles(véhiculeData);
    if (centrerAutoMapTrajet) {
      // centerOnFirstMarker();
    }
  }, [véhiculeHistoriqueDetails, vehicles, currentVéhicule]);

  useEffect(() => {
    // setvehicles(véhiculeData);
    // if (!centrerAutoMapTrajet) {
    setCentrerAutoMapTrajet(true);
    // }
  }, [véhiculeHistoriqueDetails]);

  setTimeout(() => {
    setCentrerAutoMapTrajet(false);
  }, 1000); // 15 secondes

  // type de carte
  const [mapType, setMapType] = useState("streets");

  // les type de carte
  const tileLayers = {
    terrain: {
      url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
    },

    satelite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },

    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
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

  // les markers personnalisé
  const getMarkerIcon = (véhicule) => {
    const speed = parseFloat(véhicule.speedKPH);
    const direction = Math.round(véhicule.heading / 45.0) % 8;

    if (speed <= 0) return "/pin/ping_red.png";
    else if (speed > 0 && speed <= 20)
      return `/pin/ping_yellow_h${direction}.png`;
    else return `/pin/ping_green_h${direction}.png`;
  };

  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // Ouvrir dans un nouvel onglet
  };

  const dataFusionné = mergedData ? Object.values(mergedData) : [];

  // Pour afficher la liste des véhicules
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarker = () => {
    if (mapRef.current && vehicles.length > 0) {
      const { lastValidLatitude, lastValidLongitude } = vehicles[0];
      mapRef.current.setView([lastValidLatitude, lastValidLongitude], 13);
    }
  };

  // Recherche du véhicule correspondant dans la liste
  const handleVehicleClick = (véhicule) => {
    const deviceID = véhicule.deviceID;
    const foundVehicle = donneeFusionnéForRapport.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
      setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);

      // setInterval(() => {
      //   // setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
      //   // setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
      // }, 2000);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
    setShowVehiculeListe(!showVehiculeListe);
    // centerOnFirstMarker();
    // setTimeout(() => {
    //   centerOnFirstMarker();
    // }, 1000); // 1 secondes
    // // ....................
  };

  const handleCheckboxChange = (name) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  // Pour changer de type de carte
  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  // Pour la recherche d'une autre véhicules
  const [searchQueryHistoriquePage, setSearchQueryHistoriquePage] =
    useState("");

  // Pour enregistrer le terme de recherche
  const handleSearchChange = (e) => {
    setSearchQueryHistoriquePage(e.target.value);
  };

  // Pour filtrer le recherche
  const filteredVehiclesPupup = currentDataFusionné?.filter(
    (véhicule) =>
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryHistoriquePage.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryHistoriquePage.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryHistoriquePage.toLowerCase())
  );

  // Récupérer les positions successives pour les lignes rouges
  const positions = vehicles.map((véhicule) => [
    véhicule.lastValidLatitude,
    véhicule.lastValidLongitude,
  ]);

  //   // Fonction pour centrer la carte sur le premier marqueur
  // const centerOnFirstMarkerAnimation = () => {
  //   if (mapRef.current && vehicles.length > 0) {
  //     const { lastValidLatitude, lastValidLongitude } = vehicles[vehicles?.length - 1];
  //     mapRef.current.setView([lastValidLatitude, lastValidLongitude], 14);
  //   }
  // };

  // Pour afficher le popup du choix de la date
  const [showDatePicker, setShowDatePicker] = useState(false);

  /////////////////////////////////////////////////////////////////////////
  // Formatage de la date actuelle
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

  const adjustedTimeFrom = baseTimeFrom;
  const adjustedTimeTo = baseTimeTo;

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
  // Pour appliquer la data choisis
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
      fetchHistoriqueVehicleDetails(currentVéhicule.deviceID, timeFrom, timeTo);
      setAppliedCheckboxes(checkboxes);
    } else {
      fetchHistoriqueVehicleDetails(
        currentVéhicule.deviceID,
        timeFromFetch,
        timeToFetch
      );
      setAppliedCheckboxes(checkboxes);
    }
  };

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

  useEffect(() => {
    // console.log("xxxxxxxxxxxxxxxxxxxxxx", currentVéhicule);
  }, [currentVéhicule]);

  return (
    <div className="p-4 min-h-screen flex flex-col gap-4 mt-16 mb-32 px-4 sm:px-12 md:px-20 lg:px-40">
      <div className="z-50"></div>

      {/* Pour choisir une date */}
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

      {/* Animation Pour le chargement de la page */}
      {loadingHistoriqueFilter && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-black/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {/* entête de page pour l'historique */}
      <div className="mb-6 mt-8 md:mt-16">
        <div className="fixed flex justify-center z-20 top-[3.5rem] bg-white dark:bg-gray-800 md:bg-white/0 py-2 pt-3 left-0 right-0">
          <HistoriqueHeader
            setShowHistoriqueInMap={setShowHistoriqueInMap}
            showHistoriqueInMap={showHistoriqueInMap}
            centerOnFirstMarker={centerOnFirstMarker}
            setShowVehiculeListe={setShowVehiculeListe}
            showVehiculeListe={showVehiculeListe}
            currentVéhicule={currentVéhicule}
            setshowFilter={setshowFilter}
            showFilter={showFilter}
          />

          {/* La liste de véhicules a choisir */}
          {showVehiculeListe && (
            <div className="fixed z-[999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50  shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80 dark:border-gray-600">
              <SearchVehiculePupup
                searchQueryListPopup={searchQueryHistoriquePage}
                setSearchQueryListPopup={setSearchQueryHistoriquePage}
                handleSearchChange={handleSearchChange}
                setShowOptions={setShowVehiculeListe}
                filteredVehicles={filteredVehiclesPupup}
                handleClick={handleVehicleClick}
                currentVéhicule={currentVéhicule}
                isMapcomponent="false"
              />
            </div>
          )}

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
            currentVéhicule={currentVéhicule}
            loadingHistoriqueFilter={loadingHistoriqueFilter}
            véhiculeHistoriqueDetails={véhiculeHistoriqueDetails}
            appliedCheckboxes={appliedCheckboxes}
            setShowListOption={setShowListOption}
            selectUTC={selectUTC}
          />
        </div>
      ) : (
        // carte section
        <div className="  fixed z-[9] right-0 top-[5rem] md:top-[3.8rem] bottom-0 overflow-hidden left-0">
          <div className=" mt-[2.3rem]-- md:mt-0 overflow-hidden">
            <TrajetVehicule
              typeDeVue={typeDeVue}
              setTypeDeVue={setTypeDeVue}
              mapType={mapType}
              handleMapTypeChange={handleMapTypeChange}
              vehicles={vehicles}
              mapRef={mapRef}
              tileLayers={tileLayers}
              getMarkerIcon={getMarkerIcon}
              // currentLocation={currentLocation}
              customMarkerIcon={customMarkerIcon}
              positions={positions}
              centerOnFirstMarker={centerOnFirstMarker}
              showHistoriqueInMap={showHistoriqueInMap}
              openGoogleMaps={openGoogleMaps}
              composantLocationPage={"historique"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoriquePage;
