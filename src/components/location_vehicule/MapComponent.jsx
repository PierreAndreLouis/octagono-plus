import React, { useState, useEffect, useContext, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  AttributionControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/img/cars/localisation.png";
import iconLowSpeed from "/pin/ping_red.png";
import iconMediumSpeed from "/pin/ping_yellow.png";
import iconHighSpeed from "/pin/ping_green.png";
import { DataContext } from "../../context/DataContext";
import { Polygon } from "react-leaflet";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function MapComponent({ mapType }) {
  const {
    selectedVehicleToShowInMap,
    currentDataFusionné,
    FormatDateHeure,
    historiqueSelectedLocationIndex,
    username,
    geofenceData,
  } = useContext(DataContext);

  const geofences = geofenceData;

  // le data a utiliser
  const dataFusionné = currentDataFusionné;

  // filtrer pour avoir seulement les véhicules avec ces details
  const vehiculeActive = dataFusionné?.filter(
    (véhicule) =>
      véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0
  );

  // Formatage des donnee pour la  carte
  const véhiculeData = vehiculeActive?.map((véhicule) => ({
    deviceID: véhicule?.deviceID || "",
    description: véhicule.description || "Véhicule",
    lastValidLatitude:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.latitude || "",
    lastValidLongitude:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.longitude || "",
    address:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.backupAddress ||
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.address ||
      "",
    imeiNumber: véhicule?.imeiNumber || "",
    isActive: véhicule?.isActive || "",
    licensePlate: véhicule?.licensePlate || "",
    simPhoneNumber: véhicule?.simPhoneNumber || "",
    timestamp:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.timestamp || "",
    speedKPH:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.speedKPH || 0,
  }));

  // une reference pour la carte
  const mapRef = useRef(null);

  // Définir le véhicule a afficher sur la carte
  const vehicles = selectedVehicleToShowInMap
    ? véhiculeData.filter((v) => v.deviceID === selectedVehicleToShowInMap)
    : véhiculeData;
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current && vehicles.length) {
        if (selectedVehicleToShowInMap) {
          // Si un véhicule est sélectionné, centrer sur lui
          const selectedVehicleData = vehicles.find(
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
            vehicles?.map((véhicule) => [
              véhicule.lastValidLatitude,
              véhicule.lastValidLongitude,
            ])
          );
          mapRef.current.fitBounds(bounds);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Nettoyer le timeout au démontage du composant
    // }, [selectedVehicleToShowInMap, vehicles]);
  }, [selectedVehicleToShowInMap]);

  const getMarkerIcon = (speedKPH, timestamp) => {
    const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
    const currentTime = Date.now(); // Heure actuelle en millisecondes

    // Fonction pour obtenir le timestamp actuel en millisecondes
    const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

    const thirtyMinutesInMs = 15 * 60 * 1000; // 30 minutes en millisecondes
    const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

    const lastUpdateTimestampMs = timestamp * 1000; // Convertir en millisecondes

    const isStillSpeedActive =
      lastUpdateTimestampMs &&
      currentTimeMs - lastUpdateTimestampMs <= thirtyMinutesInMs;

    if (speedKPH < 1 || !isStillSpeedActive) return iconLowSpeed;
    if (speedKPH >= 1 && speedKPH <= 20 && isStillSpeedActive)
      return iconMediumSpeed;
    if (speedKPH > 20 && isStillSpeedActive) return iconMediumSpeed;
    // return iconHighSpeed ;
  };

  const openGoogleMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  // const map = useMap();
  // const [textSize, setTextSize] = useState("12px");

  // // Fonction pour ajuster la taille du texte en fonction du niveau de zoom
  // const updateTextSize = () => {
  //   const zoom = map.getZoom();
  //   let newSize = "12px"; // Taille par défaut

  //   if (zoom >= 18) newSize = "20px";
  //   else if (zoom >= 15) newSize = "16px";
  //   else if (zoom >= 12) newSize = "14px";
  //   else if (zoom >= 10) newSize = "10px";
  //   else newSize = "0px"; // Rendre le texte invisible

  //   setTextSize(newSize);
  // };

  // // Mettre à jour la taille du texte lors du chargement de la carte et à chaque changement de zoom
  // useEffect(() => {
  //   updateTextSize();
  //   map.on("zoomend", updateTextSize);
  //   return () => {
  //     map.off("zoomend", updateTextSize);
  //   };
  // }, [map]);

  const [textSize, setTextSize] = useState("12px");
  const [widthSize, setwidthSize] = useState("8rem");
  const ZoomTextUpdater = () => {
    const map = useMap();

    const updateTextSize = () => {
      let newSize = "12px";
      let newWidth = "8rem";
      const zoom = map.getZoom();
      // pppppppppppppppppppppppppppppppppp
      if (zoom >= 18) {
        newSize = "15px";
        newWidth = "14rem";
      } else if (zoom >= 16) {
        newSize = "15px";
        newWidth = "14rem";
      } else if (zoom >= 15) {
        newSize = "15px";
        newWidth = "14rem";
      } else if (zoom >= 14) {
        newSize = "15px";
        newWidth = "12rem";
      } else if (zoom >= 8) {
        newSize = "10px";
        newWidth = "8rem";
      } else if (zoom >= 6) {
        newSize = "6px";
        newWidth = "6rem";
      } else newSize = "0px";

      setTextSize(newSize);
      setwidthSize(newWidth);
    };

    useEffect(() => {
      updateTextSize();
      map.on("zoomend", updateTextSize);
      return () => {
        map.off("zoomend", updateTextSize);
      };
    }, [map]);

    return null;
  };

  return (
    <div>
      <MapContainer
        center={[0, 0]}
        zoom={3}
        // maxZoom={3} // Empêche un zoom trop proche
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url={tileLayers[mapType].url}
          attribution={tileLayers[mapType].attribution}
        />
        <ScaleControl position="bottomright" />
        <AttributionControl position="bottomleft" />

        <ZoomTextUpdater />

        {geofences?.map((geofence, index) => {
          // Calculer le centre du geofence
          const latitudes = geofence.coordinates.map((point) => point.lat);
          const longitudes = geofence.coordinates.map((point) => point.lng);
          const center = [
            (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
            (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
          ];

          return (
            <React.Fragment key={index}>
              <Polygon
                positions={geofence.coordinates.map((point) => [
                  point.lat,
                  point.lng,
                ])}
                pathOptions={{
                  color: geofence.color || "", // Couleur de la bordure
                  fillColor: geofence.color || "#000000", // Couleur du fond
                  fillOpacity: 0.1, // Opacité du fond
                  weight: 1, // Épaisseur des lignes
                }}
              />

              <Marker
                position={center}
                icon={L.divIcon({
                  className: "geofence-label",
                  html: `<div 
                           class="bg-gray-100 px-2 shadow-lg shadow-black/20 rounded-md  flex justify-center items-center  -translate-x-[50%] text-black font-bold text-center whitespace-nowrap- overflow-hidden-" 
                           
                           style="font-size: ${textSize}; width: ${widthSize}; color: ${geofence.color}; textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'">
                           ${geofence?.description}
                           </div>`,
                })}
              />

              {/* <Marker
                         position={center}
                         icon={L.divIcon({
                           className: "geofence-label",
                           html: `<div className="bg-red-600" style="font-size: ${textSize}; font-weight: bold; text-align: center; color: black; white-space: nowrap; text-overflow: ellipsis;">${geofence?.description}</div>`,
                         })}
                       /> */}
            </React.Fragment>
          );
        })}

        {vehicles?.map((véhicule, index) => {
          const FormatDateHeureTimestamp = FormatDateHeure(véhicule.timestamp);
          return (
            <Marker
              key={index}
              position={[
                véhicule.lastValidLatitude || 0,
                véhicule.lastValidLongitude || 0,
              ]}
              icon={L.icon({
                iconUrl: getMarkerIcon(véhicule.speedKPH, véhicule.timestamp),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl:
                  "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                shadowSize: [41, 41],
              })}
            >
              <Popup>
                <div className="w-[70vw] max-w-[20rem]">
                  <p className="font-bold text-[1rem]">
                    <span>Description :</span>{" "}
                    {véhicule.description || "Non disponible"}
                  </p>

                  <p>
                    <strong>Adresse :</strong>{" "}
                    {véhicule.address || "Non disponible"}
                  </p>
                  {username === "admin" && (
                    <p>
                      <strong>IMEI Number :</strong>{" "}
                      {véhicule.imeiNumber || "Chargement..."}
                    </p>
                  )}
                  <p>
                    <strong>Vitesse :</strong>{" "}
                    {véhicule.speedKPH && !isNaN(Number(véhicule.speedKPH))
                      ? Number(véhicule.speedKPH).toFixed(0) + " km/h"
                      : "Non disponible"}
                  </p>

                  <p>
                    <strong>Date :</strong>{" "}
                    {véhicule.timestamp
                      ? FormatDateHeureTimestamp.date
                      : "Pas de date disponible"}
                    <span className="px-3">/</span>
                    {FormatDateHeureTimestamp.time}
                  </p>
                  <p>
                    <strong>Statut : </strong>
                    {véhicule.speedKPH < 1 && "En stationnement"}
                    {véhicule.speedKPH > 20 && "En mouvement rapide"}
                    {véhicule.speedKPH >= 1 &&
                      véhicule.speedKPH <= 20 &&
                      "En mouvement lent"}
                  </p>
                  <p>
                    <strong>Plaque d'immatriculation :</strong>{" "}
                    {véhicule.licensePlate || "Chargement..."}
                  </p>
                  <button
                    onClick={() =>
                      openGoogleMaps(
                        véhicule.lastValidLatitude,
                        véhicule.lastValidLongitude
                      )
                    }
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    Voir sur Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
