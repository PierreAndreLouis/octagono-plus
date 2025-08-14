import React, { useState, useEffect, useContext, useRef, useMemo } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/pin/ping_red.png";
import { DataContext } from "../context/DataContext";
import HeaderLocation from "../components/location_vehicule/HeaderLocation";
import MapComponent from "../components/location_vehicule/MapComponent";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";
import TypeDeVue from "../components/historique_vehicule/TypeDeVue";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const LocationPage = ({
  isDashBoardComptnent,
  setDocumentationPage,
  fromDashboard,
}) => {
  const {
    mergedDataHome,
    selectedVehicleToShowInMap,
    setSelectedVehicleToShowInMap,
    currentVéhicule,
    accountDevices,
    currentAccountSelected,
    isDashboardHomePage,
    ajouterGeofencePopup,
    véhiculeDetails,
    updateAppareilsEtGeofencesPourCarte,
    appareilPourAfficherSurCarte,
    historiqueSelectedLocationIndex,
    véhiculeHistoriqueDetails,
    fetchVehicleDetails,
    fromSelectOnPositionValue,
    setFromSelectOnPositionValue,
    FormatDateHeure,
    setCurrentVéhicule,
  } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();
  // const navigate = useNavigate()

  //
  //
  //
  //
  //
  //
  //
  //
  x;
  // Pour voir la liste des
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  // Pour définir le type de vue
  const [typeDeVue, setTypeDeVue] = useState(false);

  // Le data converti en Objet
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const vehiculeActive = useMemo(() => {
    if (isDashboardHomePage && currentAccountSelected) {
      return currentAccountSelected?.accountDevices?.map((device) => {
        const match = véhiculeDetails?.find(
          (v) =>
            v.deviceID === device.deviceID &&
            v.véhiculeDetails?.[0]?.accountID === device.accountID
        );

        if (match && match.véhiculeDetails.length > 0) {
          return { ...device, véhiculeDetails: match.véhiculeDetails };
        }

        return device;
      });
    } else if (isDashboardHomePage && !currentAccountSelected) {
      return accountDevices?.map((device) => {
        const match = véhiculeDetails?.find(
          (v) =>
            v.deviceID === device.deviceID &&
            v.véhiculeDetails?.[0]?.accountID === device.accountID
        );

        if (match && match.véhiculeDetails.length > 0) {
          return { ...device, véhiculeDetails: match.véhiculeDetails };
        }

        return device;
      });
    } else if (!isDashboardHomePage) {
      return dataFusionné;
    }
    return [];
  }, [
    isDashboardHomePage,
    currentAccountSelected,
    véhiculeDetails,
    accountDevices,
    dataFusionné,
  ]);

  useEffect(() => {
    console.log(
      "appareilPourAfficherSurCarte====================",
      appareilPourAfficherSurCarte
    );
  }, [historiqueSelectedLocationIndex, appareilPourAfficherSurCarte]);

  const véhiculeData = useMemo(() => {
    return appareilPourAfficherSurCarte
      ?.map((véhicule) => {
        // const details = véhicule?.véhiculeDetails?.[0] || {};
        const details = véhicule?.véhiculeDetails?.[0] || {}; // ← ici, on choisit entre global ou local

        return {
          deviceID: véhicule?.deviceID || "",
          accountID: véhicule?.accountID || "",
          description: véhicule.description || "Véhicule",
          lastValidLatitude:
            details.latitude || véhicule?.lastValidLatitude || "",
          lastValidLongitude:
            details.longitude || véhicule?.lastValidLongitude || "",
          address: details.backupAddress || details.address || "",
          imeiNumber: véhicule?.imeiNumber || "",
          isActive: véhicule?.isActive || "",
          licensePlate: véhicule?.licensePlate || "",
          simPhoneNumber: véhicule?.simPhoneNumber || "",
          timestamp: details.timestamp || "",
          // timestamp: details.timestamp || véhicule?.lastUpdateTime || "",
          speedKPH: details.speedKPH,
          heading: details.heading || 0,
        };
      })
      ?.filter(
        (v) =>
          v.lastValidLatitude !== "0.0" &&
          v.lastValidLongitude !== "0.0" &&
          v.lastValidLatitude !== "" &&
          v.lastValidLongitude !== ""
      );
  }, [appareilPourAfficherSurCarte, véhiculeDetails]);

  const [selectDeviceInSearch, setSelectDeviceInSearch] = useState();

  useEffect(() => {
    if (!fromSelectOnPositionValue?.length) return;

    const filtered = véhiculeData?.filter(
      (v) => v.deviceID === selectedVehicleToShowInMap
    );

    if (filtered.length === 0) return;

    const updatedDevice = {
      ...filtered[0],
      lastValidLatitude: fromSelectOnPositionValue[0].latitude,
      lastValidLongitude: fromSelectOnPositionValue[0].longitude,
      speedKPH: fromSelectOnPositionValue[0].speedKPH,
      timestamp: fromSelectOnPositionValue[0].timestamp,
      heading: fromSelectOnPositionValue[0].heading,
      address: fromSelectOnPositionValue[0].address,
      description: fromSelectOnPositionValue[0].description,
    };

    setSelectDeviceInSearch([updatedDevice]);
  }, [fromSelectOnPositionValue, selectedVehicleToShowInMap, véhiculeData]);

  const vehicles = selectedVehicleToShowInMap
    ? selectDeviceInSearch
    : véhiculeData;

  const fromSelectOnPosition = true;

  const [isFetchFromUpdateAuro, setIsFetchFromUpdateAuro] = useState(false);
  /////////////////////////////////////////vvvvvvvvvvvvvvvvvvvvvvvvv/////////////////////////
  // Pour afficher une seule véhicule sur la carte
  const handleVehicleClick = (véhicule, fromUpdateAuto = false) => {
    console.log("devrais lancer la requette......", véhicule);
    fetchVehicleDetails(véhicule, true);
    setSelectedVehicleToShowInMap(véhicule?.deviceID);
    setShowVehiculeListe(false);
    updateAppareilsEtGeofencesPourCarte();
    setCurrentVéhicule(véhicule);

    if (fromUpdateAuto) {
      setIsFetchFromUpdateAuro(true);
    } else {
      setIsFetchFromUpdateAuro(false);
    }
  };

  // Pour mettre a jour le véhicules choisis pour afficher sur la carte
  useEffect(() => {
    console.log(selectedVehicleToShowInMap);
  }, [selectedVehicleToShowInMap]);

  // Pour afficher tous les véhicules en Generale sur la carte
  const showAllVehicles = () => {
    setSelectedVehicleToShowInMap(null);
    updateAppareilsEtGeofencesPourCarte();
  };

  // Pour définir le type de carte
  const [mapType, setMapType] = useState("streets");

  // Une reference pour la carte
  // const mapRef = useRef(null);

  // Pour trouver le véhicules a afficher parmi la liste
  // const vehicles = selectedVehicleToShowInMap
  //   ? véhiculeData.filter((v) => v.deviceID === selectedVehicleToShowInMap)
  //   : véhiculeData;

  // useEffect(() => {
  //   // console.log("vehicles", vehicles);
  // }, [vehicles]);

  // Les type de carte disponibles
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

  // Pour centrer une seule ou tous les véhicules
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (mapRef.current && vehicles?.length) {
  //       if (selectedVehicleToShowInMap) {
  //         // Si un véhicule est sélectionné, centrer sur lui
  //         const selectedVehicleData = vehicles?.find(
  //           (véhicule) => véhicule?.deviceID === selectedVehicleToShowInMap
  //         );
  //         if (selectedVehicleData) {
  //           const { lastValidLatitude, lastValidLongitude } =
  //             selectedVehicleData;
  //           mapRef.current.setView([lastValidLatitude, lastValidLongitude], 20);
  //         }
  //       } else {
  //         // Sinon, ajuster pour inclure tous les véhicules
  //         const bounds = L.latLngBounds(
  //           vehicles.map((véhicule) => [
  //             véhicule.lastValidLatitude,
  //             véhicule.lastValidLongitude,
  //           ])
  //         );
  //         mapRef.current.fitBounds(bounds);
  //       }
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeoutId); // Nettoyer le timeout au démontage du composant
  // }, [selectedVehicleToShowInMap, vehicles]);

  // Pour changer de type de map
  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  // Pour la recherche d'un véhicule dans la liste
  const [searchQueryLocationPage, setSearchQueryLocationPage] = useState("");

  // Pour mettre a jour le terme de recherche
  const handleSearchChange = (e) => {
    setSearchQueryLocationPage(e.target.value);
  };

  // Pour filtrer la recherche
  const filteredVehicles = useMemo(() => {
    return vehiculeActive?.filter(
      (véhicule) =>
        véhicule?.imeiNumber
          .toLowerCase()
          .includes(searchQueryLocationPage.toLowerCase()) ||
        véhicule?.simPhoneNumber
          .toLowerCase()
          .includes(searchQueryLocationPage.toLowerCase()) ||
        véhicule?.accountID
          .toLowerCase()
          .includes(searchQueryLocationPage.toLowerCase()) ||
        véhicule.description
          .toLowerCase()
          .includes(searchQueryLocationPage.toLowerCase())
    );
  }, [vehiculeActive, searchQueryLocationPage]);

  //
  //
  //
  //
  //
  //
  //

  x;

  const [isAddingNewGeofence, setIsAddingNewGeofence] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* {!isAddingNewGeofence &&
        (fromDashboard === "true" ? (
          ""
        ) : (
          <HeaderLocation
            setShowVehiculeListe={setShowVehiculeListe}
            selectedVehicleToShowInMap={selectedVehicleToShowInMap}
            véhiculeData={véhiculeData}
            setTypeDeVue={setTypeDeVue}
            showAllVehicles={showAllVehicles}
            isDashBoardComptnent={isDashBoardComptnent}
          />
        ))} */}

      {!isAddingNewGeofence &&
        fromDashboard !== "true" &&
        !ajouterGeofencePopup && (
          <HeaderLocation
            setShowVehiculeListe={setShowVehiculeListe}
            selectedVehicleToShowInMap={selectedVehicleToShowInMap}
            véhiculeData={véhiculeData}
            setTypeDeVue={setTypeDeVue}
            showAllVehicles={showAllVehicles}
            isDashBoardComptnent={isDashBoardComptnent}
          />
        )}

      {showVehiculeListe && (
        <SearchVehiculePupup
          searchQueryListPopup={searchQueryLocationPage}
          setSearchQueryListPopup={setSearchQueryLocationPage}
          handleSearchChange={handleSearchChange}
          setShowOptions={setShowVehiculeListe}
          filteredVehicles={filteredVehicles}
          handleClick={handleVehicleClick}
          currentVéhicule={currentVéhicule}
          isMapcomponent="true"
        />
      )}

      <div className="relative z-0">
        <TypeDeVue
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
        />

        <MapComponent
          mapType={mapType}
          tileLayers={tileLayers}
          isDashBoardComptnent={isDashBoardComptnent}
          isAddingNewGeofence={isAddingNewGeofence}
          setIsAddingNewGeofence={setIsAddingNewGeofence}
          setDocumentationPage={setDocumentationPage}
          vehicles={vehicles}
          véhiculeData={véhiculeData}
          handleVehicleClick={handleVehicleClick}
          isFetchFromUpdateAuro={isFetchFromUpdateAuro}
        />
      </div>
    </div>
  );
};

export default LocationPage;
