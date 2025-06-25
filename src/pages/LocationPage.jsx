import React, { useState, useEffect, useContext, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import { DataContext } from "../context/DataContext";
import HeaderLocation from "../components/location_vehicule/HeaderLocation";
import MapComponent from "../components/location_vehicule/MapComponent";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";
import TypeDeVue from "../components/historique_vehicule/TypeDeVue";
import { useTranslation } from "react-i18next";

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
    currentDataFusionné,
    accountDevices,
    currentAccountSelected,
    isDashboardHomePage,
    ajouterGeofencePopup,
  } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();

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

  let vehiculeActive;

  if (isDashboardHomePage && currentAccountSelected) {
    vehiculeActive = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    vehiculeActive = accountDevices;
  } else if (!isDashboardHomePage) {
    vehiculeActive = dataFusionné;
  }

  // vehiculeActive = currentDataFusionné;
  // vehiculeActive = currentDataFusionné;

  // le formatage des véhicules afficher sur la carte
  const véhiculeData =
    vehiculeActive &&
    vehiculeActive
      ?.map((véhicule) => ({
        deviceID: véhicule?.deviceID || "---",
        description: véhicule.description || "Véhicule",
        lastValidLatitude:
          véhicule?.véhiculeDetails?.[0]?.latitude ||
          véhicule?.lastValidLatitude ||
          "",
        lastValidLongitude:
          véhicule?.véhiculeDetails?.[0]?.longitude ||
          véhicule?.lastValidLongitude ||
          "",
        address: véhicule?.véhiculeDetails?.[0]?.address || "",
        imeiNumber: véhicule?.imeiNumber || "",
        isActive: véhicule?.isActive || "",
        licensePlate: véhicule?.licensePlate || "",
        simPhoneNumber: véhicule?.simPhoneNumber || "",
        speedKPH: véhicule?.véhiculeDetails?.[0]?.speedKPH || 0,
      }))
      .filter(
        (v) =>
          v.lastValidLatitude !== "0.0" &&
          v.lastValidLongitude !== "0.0" &&
          v.lastValidLatitude !== "" &&
          v.lastValidLongitude !== ""
      );

  // Pour afficher une seule véhicule sur la carte
  const handleVehicleClick = (véhicule) => {
    setSelectedVehicleToShowInMap(véhicule?.deviceID);
    setShowVehiculeListe(!showVehiculeListe);
  };

  // Pour mettre a jour le véhicules choisis pour afficher sur la carte
  useEffect(() => {
    console.log(selectedVehicleToShowInMap);
  }, [selectedVehicleToShowInMap]);

  // Pour afficher tous les véhicules en Generale sur la carte
  const showAllVehicles = () => {
    setSelectedVehicleToShowInMap(null);
  };

  // Pour définir le type de carte
  const [mapType, setMapType] = useState("streets");

  // Une reference pour la carte
  const mapRef = useRef(null);

  // Pour trouver le véhicules a afficher parmi la liste
  const vehicles = selectedVehicleToShowInMap
    ? véhiculeData.filter((v) => v.deviceID === selectedVehicleToShowInMap)
    : véhiculeData;

  useEffect(() => {
    console.log("vehicles", vehicles);
  }, [vehicles]);

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
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current && vehicles?.length) {
        if (selectedVehicleToShowInMap) {
          // Si un véhicule est sélectionné, centrer sur lui
          const selectedVehicleData = vehicles?.find(
            (véhicule) => véhicule?.deviceID === selectedVehicleToShowInMap
          );
          if (selectedVehicleData) {
            const { lastValidLatitude, lastValidLongitude } =
              selectedVehicleData;
            mapRef.current.setView([lastValidLatitude, lastValidLongitude], 20);
          }
        } else {
          // Sinon, ajuster pour inclure tous les véhicules
          const bounds = L.latLngBounds(
            vehicles.map((véhicule) => [
              véhicule.lastValidLatitude,
              véhicule.lastValidLongitude,
            ])
          );
          mapRef.current.fitBounds(bounds);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Nettoyer le timeout au démontage du composant
  }, [selectedVehicleToShowInMap, vehicles]);

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
  const filteredVehicles = vehiculeActive?.filter(
    (véhicule) =>
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryLocationPage.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryLocationPage.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryLocationPage.toLowerCase())
  );
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
    <div className="relative ">
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
        />
      </div>
    </div>
  );
};

export default LocationPage;
