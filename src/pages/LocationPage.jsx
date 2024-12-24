import React, { useState, useEffect, useContext, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import iconLowSpeed from "/pin/ping_red.png";
import iconMediumSpeed from "/pin/ping_yellow.png";
import iconHighSpeed from "/pin/ping_green.png";

import { DataContext } from "../context/DataContext";
import HeaderLocation from "../components/location_vehicule/HeaderLocation";
import ShowVehiculeListeComponent from "../components/location_vehicule/ShowVehiculeListeComponent";
import TypeDeVue from "../components/location_vehicule/TypeDeVue";
import MapComponent from "../components/location_vehicule/MapComponent";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const LocationPage = () => {
  const { mergedData, currentVehicule, selectedVehicle, setSelectedVehicle } =
    useContext(DataContext);

  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  const [typeDeVue, setTypeDeVue] = useState(false);

  const dataFusionee = mergedData ? Object.values(mergedData) : [];
  // const vehiculeActive = dataFusionee.filter((vehicule) =>  !vehicule.vehiculeDetails || vehicule.vehiculeDetails.length === 0 )

  const vehiculeActive = dataFusionee.filter(
    (vehicule) =>
      vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  );

  const vehicleData = vehiculeActive.map((vehicule) => ({
    deviceID: vehicule.deviceID || "",
    description: vehicule.description || "Véhicule",
    lastValidLatitude: vehicule.vehiculeDetails?.[0]?.latitude || "",
    lastValidLongitude: vehicule.vehiculeDetails?.[0]?.longitude || "",
    address: vehicule.vehiculeDetails?.[0]?.address || "",
    imeiNumber: vehicule?.imeiNumber || "",
    isActive: vehicule?.isActive || "",
    licensePlate: vehicule?.licensePlate || "",
    simPhoneNumber: vehicule?.simPhoneNumber || "",
    speedKPH: vehicule.vehiculeDetails?.[0]?.speedKPH || 0,
  }));

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle.deviceID);
    setShowVehiculeListe(!showVehiculeListe);
  };

  const showAllVehicles = () => {
    setSelectedVehicle(null);
  };

  // const { mergedData, currentVehicule, selectedVehicle, setSelectedVehicle } =
  // useContext(DataContext);

  const [mapType, setMapType] = useState("streets");
  const mapRef = useRef(null);
  const vehicles = selectedVehicle
    ? vehicleData.filter((v) => v.deviceID === selectedVehicle)
    : vehicleData;
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current && vehicles.length) {
        if (selectedVehicle) {
          // Si un véhicule est sélectionné, centrer sur lui
          const selectedVehicleData = vehicles.find(
            (vehicle) => vehicle.deviceID === selectedVehicle
          );
          if (selectedVehicleData) {
            const { lastValidLatitude, lastValidLongitude } =
              selectedVehicleData;
            mapRef.current.setView([lastValidLatitude, lastValidLongitude], 20);
          }
        } else {
          // Sinon, ajuster pour inclure tous les véhicules
          const bounds = L.latLngBounds(
            vehicles.map((vehicle) => [
              vehicle.lastValidLatitude,
              vehicle.lastValidLongitude,
            ])
          );
          mapRef.current.fitBounds(bounds);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Nettoyer le timeout au démontage du composant
  }, [selectedVehicle, vehicles]);

  const handleMapTypeChange = (type) => {
    setMapType(type);
    setTypeDeVue(false);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVehicles = vehiculeActive?.filter((vehicule) =>
    vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <HeaderLocation
        setShowVehiculeListe={setShowVehiculeListe}
        selectedVehicle={selectedVehicle}
        vehicleData={vehicleData}
        setTypeDeVue={setTypeDeVue}
        showAllVehicles={showAllVehicles}
      />

      <ShowVehiculeListeComponent
        showVehiculeListe={showVehiculeListe}
        setShowVehiculeListe={setShowVehiculeListe}
        showAllVehicles={showAllVehicles}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        filteredVehicles={filteredVehicles}
        handleVehicleClick={handleVehicleClick}
      />

      <div className="relative">
        <TypeDeVue
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
        />

        <MapComponent />
      </div>
    </div>
  );
};

export default LocationPage;
