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
import { IoClose } from "react-icons/io5";
import { useMapEvent } from "react-leaflet";

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

  ///////////////////////////////////////////

  const [ajouterCouleurGeofencePopup, setAjouterCouleurGeofencePopup] =
    useState(false);
  const [
    ajouterCouleurGeofenceCodeCouleur,
    setAjouterCouleurGeofenceCodeCouleur,
  ] = useState("");
  const [ajouterCouleurGeofenceEnText, setAjouterCouleurGeofenceEnText] =
    useState("rouge");


  
  const [clickedPosition, setClickedPosition] = useState(null);

  function MapClickHandler({ setClickedPosition }) {
    useMapEvent("click", (e) => {
      console.log("Position cliquée :", e.latlng);
      setClickedPosition(e.latlng);
    });
    return null;
  }

  return (
    <div
      onClick={() => {
        console.log("xxxxxxxxxx");
      }}
    >
      {false && (
        <div className="fixed flex justify-center items-center z-[99999999999] inset-0 bg-black/30 px-2">
          <div className="mx-auto relative   min-w-[90vw]-- w-full max-w-[40rem] rounded-lg p-4 bg-white">
            <h2 className="text-md font-semibold pb-2 border-b">
              Ajouter un Geofence{" "}
              <span className="font-normal text-gray-600">
                (Separation sur la carte)
              </span>
            </h2>
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Nom de la Zone :
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="description"
                // value={addVéhiculeData[field.id]}
                // onChange={handleChange}
                required
                className="block px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              <label
                htmlFor="description"
                className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Description de la zone:
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="description"
                // value={addVéhiculeData[field.id]}
                // onChange={handleChange}
                required
                className="block px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              <label
                htmlFor="description"
                className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Couleur :
              </label>
              <div
                onClick={() => {
                  setAjouterCouleurGeofencePopup(true);
                }}
                className="flex justify-between items-center px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <div className="flex gap-4 items-center ">
                  <div className="w-[2rem] h-[1.2rem] rounded-md bg-red-500"></div>
                  <p>Rouges</p>
                </div>
                <p className="cursor-pointer text-orange-500">modifier</p>
              </div>
              <label
                htmlFor="description"
                className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Coordonnée :
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="description"
                // value={addVéhiculeData[field.id]}
                // onChange={handleChange}
                required
                className="block px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>{" "}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {ajouterCouleurGeofencePopup && (
              <div className="absolute bg-white min-w-[20rem] shadow-lg shadow-black/20 top-[1rem]  right-[1rem] border p-4 rounded-lg flex flex-col gap-0">
                <div className="font-bold flex justify-between items-center border-b pb-2">
                  <p>Choisissez une couleur</p>
                  <IoClose
                    onClick={() => {
                      setAjouterCouleurGeofencePopup(false);
                    }}
                    className="text-red-500 text-2xl cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => {
                    setAjouterCouleurGeofencePopup(false);
                  }}
                  className="mt-4 flex flex-col"
                >
                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "green"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Verte</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-green-500"></div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "rouge"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Rouge</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-red-500"></div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "violet"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Violet</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-purple-600"></div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "green"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Verte</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-green-500"></div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "rouge"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Rouge</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-red-500"></div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "violet"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Violet</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-purple-600"></div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "green"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Verte</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-green-500"></div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "rouge"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Rouge</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-red-500"></div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      ajouterCouleurGeofenceEnText === "violet"
                        ? "bg-orange-50"
                        : ""
                    } hover:bg-orange-50 p-2 cursor-pointer`}
                  >
                    <div className="flex gap-4 justify-between items-center ">
                      <p>Violet</p>
                      <div className="w-[2rem] h-[1.2rem] rounded-md bg-purple-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <MapContainer
        // onClick={(e) => {
        //   const { lat, lng } = e.latlng;
        //   console.log("Position cliquée :", lat, lng);
        //   setClickedPosition({ lat, lng });
        // }}
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

        {/* Composant qui gère le clic sur la carte */}
        <MapClickHandler setClickedPosition={setClickedPosition} />

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

        {clickedPosition && (
          <Marker
            icon={L.icon({
              iconUrl: "/pin/ping_red.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl:
                "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
              shadowSize: [41, 41],
            })}
            position={[clickedPosition.lat, clickedPosition.lng]}
          >
            <Popup>
              Latitude: {clickedPosition.lat.toFixed(6)} <br />
              Longitude: {clickedPosition.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

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
