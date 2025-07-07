import React, { useContext, useEffect, useRef, useState } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import { DataContext } from "../context/DataContext";
import DateTimePicker from "../components/home/DateTimePicker";

import ShowFilterComponent from "../components/historique_vehicule/ShowFilterComponent";
import HistoriqueMainComponent from "../components/historique_vehicule/HistoriqueMainComponent";
import HistoriqueHeader from "../components/historique_vehicule/HistoriqueHeader";
import TrajetVehicule from "../components/historique_vehicule/TrajetVehicule";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";
import { useTranslation } from "react-i18next";

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
    mergedDataHome,
    currentVéhicule,
    loadingHistoriqueFilter,
    setShowListOption,

    véhiculeHistoriqueDetails,
    setCurrentVéhicule,
    showHistoriqueInMap,
    setShowHistoriqueInMap,

    setVéhiculeHistoriqueDetails,
    selectUTC,
    fetchHistoriqueVehicleDetails,
    currentDataFusionné,
    setSelectedVehicleToShowInMap,
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    gestionAccountData,
    currentSelectedDeviceGestion,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  let x;

  // Le data converti en Objet
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let deviceListeChosen;

  if (isDashboardHomePage && currentAccountSelected) {
    deviceListeChosen = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    deviceListeChosen = accountDevices;
  } else if (!isDashboardHomePage) {
    deviceListeChosen = dataFusionné;
  }

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

      if (foundVehicle) {
        setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
        setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
        setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection
      }
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
  }, [véhiculeHistoriqueDetails, currentVéhicule]);
  //
  //
  //
  //

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

  // Pour afficher la liste des véhicules
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  // Fonction pour centrer la carte sur le premier marqueur

  const vehiclesRef = useRef(vehicles);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  useEffect(() => {
    console.log("vehicles mise a jour..................");
  }, [vehicles]);

  const centerOnFirstMarker = () => {
    if (mapRef.current && vehicles.length > 0) {
      const { lastValidLatitude, lastValidLongitude } = vehiclesRef.current[0];
      mapRef.current.setView([lastValidLatitude, lastValidLongitude], 13);
      console.log("centrer la carte 33333333333333333333333333333333333333333");
    }
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
  const filteredVehiclesPupup = deviceListeChosen?.filter(
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

    if (isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentVéhicule.deviceID,

        timeFromFetch || timeFrom,

        timeToFetch || timeTo,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
    } else {
      fetchHistoriqueVehicleDetails(
        currentVéhicule.deviceID,
        timeFromFetch || timeFrom,
        timeToFetch || timeTo
      );
    }

    if (timeFromFetch && timeToFetch) {
      setAppliedCheckboxes(checkboxes);
    }
  };

  //
  //
  //

  // Recherche du véhicule correspondant dans la liste
  const handleVehicleClick = (véhicule) => {
    const deviceID = véhicule?.deviceID;
    console.log("véhicule", véhicule);

    setCurrentVéhicule(véhicule); // Définit le véhicule actuel

    if (isDashboardHomePage) {
      if (timeFrom && timeTo) {
        fetchHistoriqueVehicleDetails(
          deviceID,
          timeFrom,
          timeTo,

          currentAccountSelected?.accountID ||
            gestionAccountData.find(
              (account) => account.accountID === véhicule?.accountID
            )?.accountID,
          "admin",
          currentAccountSelected?.password ||
            gestionAccountData.find(
              (account) => account.accountID === véhicule?.accountID
            )?.password
        );
        setAppliedCheckboxes(checkboxes);
      } else {
        fetchHistoriqueVehicleDetails(
          deviceID,
          timeFromFetch,
          timeToFetch,

          currentAccountSelected?.accountID ||
            gestionAccountData.find(
              (account) => account.accountID === véhicule?.accountID
            )?.accountID,
          "admin",
          currentAccountSelected?.password ||
            gestionAccountData.find(
              (account) => account.accountID === véhicule?.accountID
            )?.password
        );
        setAppliedCheckboxes(checkboxes);
      }
    } else {
      if (timeFrom && timeTo) {
        fetchHistoriqueVehicleDetails(deviceID, timeFrom, timeTo);
        setAppliedCheckboxes(checkboxes);
      } else {
        fetchHistoriqueVehicleDetails(deviceID, timeFromFetch, timeToFetch);
        setAppliedCheckboxes(checkboxes);
      }
    }

    // }
    setShowVehiculeListe(!showVehiculeListe);
    centerOnFirstMarker();

    setTimeout(() => {
      centerOnFirstMarker();
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      centerOnFirstMarker();
    }, 1000);
  }, [véhiculeHistoriqueDetails]);
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
    <div className="p-4 min-h-screen relative   bg-white flex flex-col gap-4  rounded-lg px-4 sm:px-12 md:px-20 lg:px-40">
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
      <div className="mb-6- mt-4- relative">
        <div className={`absolute z-[1] left-0 right-0 `}>
          <HistoriqueHeader
            setShowHistoriqueInMap={setShowHistoriqueInMap}
            showHistoriqueInMap={showHistoriqueInMap}
            setShowVehiculeListe={setShowVehiculeListe}
            showVehiculeListe={showVehiculeListe}
            currentVéhicule={currentVéhicule}
            setshowFilter={setshowFilter}
            showFilter={showFilter}
          />
        </div>
        <div className="fixed flex justify-center z-20 top-[3.5rem]-- bg-white-- dark:bg-gray-800 md:bg-white/0  pt-3 left-0 right-0">
          {/* La liste de véhicules a choisir */}
          {showVehiculeListe && (
            <SearchVehiculePupup
              searchQueryListPopup={searchQueryHistoriquePage}
              setSearchQueryListPopup={setSearchQueryHistoriquePage}
              handleSearchChange={handleSearchChange}
              setShowOptions={setShowVehiculeListe}
              filteredVehicles={filteredVehiclesPupup}
              handleClick={handleVehicleClick}
              currentVéhicule={currentVéhicule}
              isMapcomponent="false"
              vehicles={vehicles}
              mapRef={mapRef}
            />
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
        <div className="absolute inset-0 z-0  overflow-hidden">
          <div className="  overflow-hidden ">
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
