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
import { IoClose } from "react-icons/io5";

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
    // deviceID: 33333333333,
    deviceID: vehicule.deviceID || "---",
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
    console.log("iiiiiiiiii", selectedVehicle);
    console.log("vvvvvvv", vehicle.deviceID);
    setSelectedVehicle(vehicle.deviceID);
    setShowVehiculeListe(!showVehiculeListe);
  };

  useEffect(() => {
    console.log(selectedVehicle);
  }, [selectedVehicle]);

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

  const filteredVehicles = vehiculeActive?.filter(
    (vehicule) =>
      vehicule?.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* <div
        onClick={() => {
          console.log(mergedData);
        }}
        className="fixed top-[5rem] z-[99999999999999999999999] left-0"
      >
        asfasdfs
      </div> */}
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
        selectedVehicle={selectedVehicle}
      />

      <div className="relative">
        {/* <TypeDeVue
          typeDeVue={typeDeVue}
          setTypeDeVue={setTypeDeVue}
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}
        /> */}
        {typeDeVue && (
          <div className="fixed z-[9999999999999999] inset-0 bg-black/50 flex justify-center items-center dark:bg-black/80">
            <div
              className="bg-white max-w-[30rem] relative flex flex-col gap-2 w-[80vw] p-6 border border-gray-600 mt-2 rounded-md dark:bg-gray-700 dark:border-gray-600"
              id="mapType"
            >
              <IoClose
                onClick={() => {
                  setTypeDeVue(false);
                }}
                className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600 dark:text-red-400"
              />

              <h2 className="border-b border-orange-400 text-orange-800 text-lg pb-2 mb-3 font-semibold dark:text-white dark:border-orange-500">
                Choisis un type de vue :
              </h2>

              <p
                className={`cursor-pointer dark:text-gray-50 dark:hover:bg-gray-800/40 py-1 px-3 rounded-md ${
                  mapType === "streets" ? "bg-gray-200 dark:bg-gray-800/50" : ""
                }`}
                onClick={() => handleMapTypeChange("streets")}
              >
                Vue normale
              </p>
              <p
                className={`cursor-pointer dark:text-gray-50 dark:hover:bg-gray-800/40 py-1 px-3 rounded-md ${
                  mapType === "humanitarian"
                    ? "bg-gray-200 dark:bg-gray-800/50"
                    : ""
                }`}
                onClick={() => handleMapTypeChange("humanitarian")}
              >
                Vue humanitaire
              </p>
              <p
                className={`cursor-pointer dark:text-gray-50 dark:hover:bg-gray-800/40 py-1 px-3 rounded-md ${
                  mapType === "positron"
                    ? "bg-gray-200 dark:bg-gray-800/50"
                    : ""
                }`}
                onClick={() => handleMapTypeChange("positron")}
              >
                Vue claire
              </p>
              <p
                className={`cursor-pointer dark:text-gray-50 dark:hover:bg-gray-800/40 py-1 px-3 rounded-md ${
                  mapType === "dark" ? "bg-gray-200 dark:bg-gray-800/50" : ""
                }`}
                onClick={() => handleMapTypeChange("dark")}
              >
                Vue sombre
              </p>
            </div>
          </div>
        )}
        <MapComponent mapType={mapType} tileLayers={tileLayers} />
      </div>
    </div>
  );
};

export default LocationPage;
