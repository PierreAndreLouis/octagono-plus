import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  AttributionControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customMarkerIcon from "/pin/ping_red.png";
import MarkerClusterGroup from "react-leaflet-cluster";

import { DataContext } from "../../context/DataContext";
import { Polygon } from "react-leaflet";
import { IoClose, IoEarth } from "react-icons/io5";
import { useMapEvent } from "react-leaflet";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";
import { TbMapPinPin } from "react-icons/tb";
// import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  // shadowSize: [41, 41],
  shadowSize: [1, 1],
});

function MapComponent({
  mapType,
  fromHistorique,
  fromRapportGroupe,
  setDocumentationPage,
}) {
  const {
    selectedVehicleToShowInMap,
    FormatDateHeure,
    historiqueSelectedLocationIndex,
    username,
    geofenceData,
    createNewGeofence,
    ajouterGeofencePopup,
    setAjouterGeofencePopup,
    createGeofenceLoading,
    currentGeozone,
    isEditingGeofence,
    ModifierGeofence,
    accountDevices,
    currentAccountSelected,
    updateAppareilsEtGeofencesPourCarte,
    isDashboardHomePage,
    adminUsername,
    accountGeofences,
    mergedDataHome,
    véhiculeDetails,
    appareilPourAfficherSurCarte,
    geofencePourAfficherSurCarte,
    documentationPage,
    addVehiculeDetailsFonction,
    véhiculeHistoriqueDetails,
    selectedVehicleHistoriqueToShowInMap,
    // updateAccountDevicesWidthvéhiculeDetailsFonction,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  const véhiculeData = useMemo(() => {
    return appareilPourAfficherSurCarte
      ?.map((véhicule) => {
        const details = véhicule?.véhiculeDetails?.[0] || {};

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
  }, [appareilPourAfficherSurCarte]);

  const mapRef = useRef(null);

  const véhiculeHistoriqueUnique = useMemo(() => {
    if (historiqueSelectedLocationIndex != null && selectedVehicleToShowInMap) {
      const véhicule = appareilPourAfficherSurCarte?.find(
        (item) => item?.deviceID === selectedVehicleToShowInMap
      );
      const details =
        véhiculeHistoriqueDetails?.[historiqueSelectedLocationIndex] || {};
      return {
        deviceID: véhicule?.deviceID || "",
        accountID: véhicule?.accountID || "",
        description: véhicule?.description || "Véhicule",
        lastValidLatitude:
          details?.latitude || véhicule?.lastValidLatitude || "",
        lastValidLongitude:
          details?.longitude || véhicule?.lastValidLongitude || "",
        address: details?.backupAddress || details?.address || "",
        imeiNumber: véhicule?.imeiNumber || "",
        isActive: véhicule?.isActive || "",
        licensePlate: véhicule?.licensePlate || "",
        simPhoneNumber: véhicule?.simPhoneNumber || "",
        timestamp: details?.timestamp || "",
        speedKPH: details?.speedKPH,
        heading: details?.heading || 0,
      };
    }
    return null;
  }, [
    appareilPourAfficherSurCarte,
    selectedVehicleToShowInMap,
    historiqueSelectedLocationIndex,
  ]);

  let vehicles;

  if (historiqueSelectedLocationIndex != null && véhiculeHistoriqueUnique) {
    vehicles = [véhiculeHistoriqueUnique];
  } else if (selectedVehicleToShowInMap) {
    vehicles = véhiculeData.filter(
      (v) => v.deviceID === selectedVehicleToShowInMap
    );
  } else {
    vehicles = véhiculeData;
  }

  // pour centrer la carter sur la position sélectionner
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current && vehicles?.length) {
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
  }, [selectedVehicleToShowInMap]);

  const getMarkerIcon = (véhicule, getColor = false) => {
    const speed = parseFloat(véhicule?.speedKPH);
    const direction = Math.round(véhicule?.heading / 45.0) % 8;
    const timestamp = véhicule?.timestamp * 1000; // En millisecondes
    const lastUpdateTime = véhicule?.timestamp;

    const currentTimeMs = Date.now();
    const currentTimeSec = Math.floor(currentTimeMs / 1000);
    const twentyFourHoursInSec = 24 * 60 * 60;

    const isRecentlyUpdate =
      currentTimeSec - lastUpdateTime <= twentyFourHoursInSec;
    const isNotRecentlyUpdate =
      currentTimeSec - lastUpdateTime > twentyFourHoursInSec;

    if (!getColor) {
      if (isNotRecentlyUpdate) return "/pin/ping_purple.png";

      if (
        speed > 0 &&
        speed <= 20
        // &&
        // (isStillSpeedActive || historiqueSelectedLocationIndex)
      )
        return `/pin/ping_yellow_h${direction}.png`;

      if (
        speed > 20
        //  && (isStillSpeedActive || historiqueSelectedLocationIndex)
      )
        return `/pin/ping_green_h${direction}.png`;

      return "/pin/ping_red.png";
    } else {
      if (isNotRecentlyUpdate) return "bg-purple-600";

      if (
        speed > 0 &&
        speed <= 20
        // &&
        // (isStillSpeedActive || historiqueSelectedLocationIndex)
      )
        return "bg-yellow-600";

      if (
        speed > 20
        // && (isStillSpeedActive || historiqueSelectedLocationIndex)
      )
        return "bg-green-600";

      return "bg-red-500";
    }
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
      } else newSize = "6px";

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
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
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

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  const popupRef = useRef(null);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref1.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(ref1.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (ref2.current) {
      ref2.current.style.width = `${width}px`;
    }
  }, [width]);

  const [showGeofenceInCartePopup, setShowGeofenceInCartePopup] =
    useState(false);

  useEffect(() => {
    if (currentAccountSelected || !isDashboardHomePage) {
      setShowGeofenceInCarte(true);
    } else {
      setShowGeofenceInCarte(false);
    }
  }, [currentAccountSelected, isDashboardHomePage]);
  const [showGeofenceInCarte, setShowGeofenceInCarte] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const MapClickHandlerClosePopup = ({ onMapClick }) => {
    useMapEvents({
      click: () => {
        onMapClick(); // Quand la carte est cliquée (hors marker)
      },
    });
    return null;
  };

  const onClickVehicle = (véhicule) => {
    if (historiqueSelectedLocationIndex && véhiculeHistoriqueUnique) {
      setSelectedVehicle(véhiculeHistoriqueUnique);
    } else {
      setSelectedVehicle(véhicule);
    }
  };

  useEffect(() => {
    updateAppareilsEtGeofencesPourCarte();
  }, [currentAccountSelected]);

  const [isMarkerClusterGroupMode, setisMarkerClusterGroupMode] =
    useState(true);

  let getColor = true;

  // useEffect(() => {
  //   if (mapRef.current) {
  //     const coordinates = [
  //       { lat: 17.79297219635383, lng: -74.46607937065865 },
  //       { lat: 19.81964982383767, lng: -74.57589816742004 },
  //       { lat: 20.180774787037656, lng: -70.42474764983946 },
  //       { lat: 17.83656772376724, lng: -70.14165652823564 },
  //     ];

  //     const avgLat =
  //       coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
  //     const avgLng =
  //       coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;

  //     mapRef.current.setView([avgLat, avgLng], 7);
  //   }
  // }, []);
  return (
    <div
      onClick={() => {
        // updateAccountDevicesWidthvéhiculeDetailsFonction();
      }}
      ref={ref1}
      className="relative overflow-hidden"
    >
      {selectedVehicle && (
        <div
          className={`bottom-[4rem] lg:bottom-4  ${
            fromHistorique === "true" ? "bottom-[6rem] lg:bottom-[6rem]" : ""
          } ${
            fromRapportGroupe === "true"
              ? "bottom-[7rem] lg:bottom-[6.2rem]"
              : ""
          } fixed   right-4 overflow-hidden bg-white p-4 rounded-md shadow-lg max-w-sm z-[1000]`}
        >
          <div className="w-[70vw] max-w-[20rem] relative ">
            <div className="absolute z-10 -top-[2.7rem] text-lg -right-2 flex justify-center items-center text-white cursor-pointer w-[2rem] h-[2rem] border border-white  rounded-full ">
              <IoClose
                onClick={() => {
                  setSelectedVehicle(null);
                }}
              />
            </div>
            <div
              className={`${getMarkerIcon(
                selectedVehicle,
                getColor
              )}   absolute z-4 -top-[3rem] -left-5 -right-5 h-10 `}
            >
              .
            </div>
            <p className="font-bold text-[1rem] mt-[2rem]">
              <span>{t("Description")} :</span>{" "}
              <span className="notranslate">
                {selectedVehicle?.description || `${t("Non disponible")}`}
              </span>
            </p>

            <p>
              <strong>{t("accountID")} :</strong>{" "}
              <span className="notranslate">
                {selectedVehicle?.accountID || `${t("Non disponible")}`}
              </span>
            </p>

            <p>
              <strong>{t("Adresse")} :</strong>{" "}
              <span className="notranslate">
                {selectedVehicle?.address || `${t("Non disponible")}`}
              </span>
            </p>

            <p>
              <strong>{t("Vitesse")} :</strong>{" "}
              {selectedVehicle?.speedKPH &&
              !isNaN(Number(selectedVehicle?.speedKPH))
                ? Number(selectedVehicle?.speedKPH).toFixed(0) + " km/h"
                : `${t("Non disponible")}`}
            </p>

            <p>
              <strong>{t("Statut")} : </strong>
              {selectedVehicle?.speedKPH ? "" : `${t("Hors service")}`}
              {selectedVehicle?.speedKPH < 1 && `${t("En stationnement")}`}
              {selectedVehicle?.speedKPH > 20 && `${t("En mouvement rapide")}`}
              {selectedVehicle?.speedKPH >= 1 &&
                selectedVehicle?.speedKPH <= 20 &&
                `${t("En mouvement lent")}`}
            </p>
            <p>
              <strong>{t("Plaque d'immatriculation")} :</strong>{" "}
              {selectedVehicle?.licensePlate || `${t("Chargement...")}`}
            </p>
            {(username === "admin" || adminUsername === "admin") && (
              <p>
                <strong>{t("IMEI")} :</strong>{" "}
                {selectedVehicle?.imeiNumber || `${t("Chargement...")}`}
              </p>
            )}
            <p>
              <strong>{t("SIM")} :</strong>{" "}
              {selectedVehicle?.simPhoneNumber || `${t("Chargement...")}`}
            </p>
            <p>
              <strong>{t("Last Update")} :</strong>{" "}
              {selectedVehicle?.timestamp
                ? FormatDateHeure(selectedVehicle.timestamp)?.date
                : `${t("Pas de date disponible")}`}
              <span className="px-3">/</span>
              {FormatDateHeure(selectedVehicle.timestamp)?.time}
              {/* {selectedVehicle.timestamp} */}
            </p>

            <button
              onClick={() =>
                openGoogleMaps(
                  selectedVehicle?.lastValidLatitude,
                  selectedVehicle?.lastValidLongitude
                )
              }
              className={`${getMarkerIcon(
                selectedVehicle,
                getColor
              )}  mt-2 px-3 py-1  text-white rounded-md`}
            >
              {t("Voir sur Google Maps")}
            </button>
          </div>
        </div>
      )}

      <div
        onClick={() => {
          setShowGeofenceInCarte(!showGeofenceInCarte);
        }}
        className="border overflow-hidden absolute right-[1rem] top-[14rem] z-[999] cursor-pointer px-2  py-2 border-gray-300 rounded-full shadow-lg shadow-black/20 bg-gray-100"
      >
        <div className="relative">
          <IoEarth
            className={`${
              showGeofenceInCarte ? "text-green-500" : "text-orange-500"
            } text-2xl `}
          />
        </div>
      </div>

      {!selectedVehicleToShowInMap && (
        <div
          onClick={() => {
            setisMarkerClusterGroupMode(!isMarkerClusterGroupMode);
          }}
          className="border overflow-hidden absolute right-[1rem] top-[19rem] z-[999] cursor-pointer px-2  py-2 border-gray-300 rounded-full shadow-lg shadow-black/20 bg-gray-100"
        >
          <div className="relative">
            <TbMapPinPin
              className={`${
                isMarkerClusterGroupMode ? "text-green-500" : "text-orange-500"
              } text-2xl `}
            />
          </div>
        </div>
      )}

      {showGeofenceInCartePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[80vw] p-6 border border-gray-600 mt-2 rounded-md">
            <IoClose
              onClick={() => {
                setShowGeofenceInCartePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b  border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-6 font-semibold">
              {t("Afficher les geofences dans la carte")} ?
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                showGeofenceInCarte ? "bg-gray-100 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => {
                setShowGeofenceInCarte(true);
                setShowGeofenceInCartePopup(false);
              }}
            >
              <p>{t("Oui")}</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                !showGeofenceInCarte ? "bg-gray-100 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => {
                setShowGeofenceInCarte(false);
                setShowGeofenceInCartePopup(false);
              }}
            >
              <p>{t("Non")}</p>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

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
        <MapClickHandlerClosePopup
          onMapClick={() => setSelectedVehicle(null)}
        />

        {showGeofenceInCarte &&
          geofencePourAfficherSurCarte
            ?.filter((isActiveGeofence) => {
              const activeGeofence = isActiveGeofence?.isActive === 1;
              return activeGeofence;
            })
            ?.map((geofence, index) => {
              // Filtrer les coordonnées valides
              const validCoordinates = geofence?.coordinates?.filter(
                (point) =>
                  point.lat !== null &&
                  point.lng !== null &&
                  point.lat !== "" &&
                  point.lng !== "" &&
                  point.lat !== 0 &&
                  point.lng !== 0
              );

              if (validCoordinates?.length === 0) return null; // Éviter d'afficher un polygone vide

              // Calculer le centre du geofence
              const latitudes = validCoordinates?.map((point) => point.lat);
              const longitudes = validCoordinates?.map((point) => point.lng);
              const center = [
                (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
                (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
              ];

              return (
                <React.Fragment key={index}>
                  <Polygon
                    positions={validCoordinates?.map((point) => [
                      point.lat,
                      point.lng,
                    ])}
                    pathOptions={{
                      color: geofence?.color || "#067510", // Couleur de la bordure
                      fillColor: geofence?.color || "#11cc22", // Couleur du fond
                      fillOpacity: 0.1, // Opacité du fond
                      weight: 1, // Épaisseur des lignes
                    }}
                  />

                  <Marker
                    position={center}
                    icon={L.divIcon({
                      className: "geofence-label",
                      html: `<div 
                           class="bg-gray-100 notranslate px-2 shadow-lg shadow-black/20 rounded-md  flex justify-center items-center  -translate-x-[50%] text-black font-bold text-center whitespace-nowrap- overflow-hidden-" 
                           
                           style="font-size: ${textSize}; width: ${widthSize}; color: #706f6f; {geofence.color}; textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'">
                           ${geofence?.description}
                           </div>`,
                    })}
                  />
                </React.Fragment>
              );
            })}

        {isMarkerClusterGroupMode ? (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={false}
            showCoverageOnHover={false}
            maxClusterRadius={50}
          >
            {vehicles?.map((véhicule, index) => {
              const FormatDateHeureTimestamp = FormatDateHeure(
                véhicule.timestamp
              );

              return (
                <Marker
                  key={index}
                  position={[
                    véhicule.lastValidLatitude || 0,
                    véhicule.lastValidLongitude || 0,
                  ]}
                  icon={L.icon({
                    iconUrl: getMarkerIcon(véhicule),
                    iconSize: [25, 35],
                    iconAnchor: [12, 35],
                    popupAnchor: [1, -33],
                    shadowUrl:
                      "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                    shadowSize: [1, 1],
                  })}
                  eventHandlers={{ click: () => onClickVehicle(véhicule) }}
                ></Marker>
              );
            })}
          </MarkerClusterGroup>
        ) : (
          vehicles?.map((véhicule, index) => {
            const FormatDateHeureTimestamp = FormatDateHeure(
              véhicule.timestamp
            );

            return (
              <Marker
                key={index}
                position={[
                  véhicule.lastValidLatitude || 0,
                  véhicule.lastValidLongitude || 0,
                ]}
                icon={L.icon({
                  iconUrl: getMarkerIcon(véhicule),
                  iconSize: [20, 30],
                  iconAnchor: [12, 35],
                  popupAnchor: [1, -33],
                  shadowUrl:
                    "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                  shadowSize: [1, 1],
                })}
                eventHandlers={{ click: () => onClickVehicle(véhicule) }}
              ></Marker>
            );
          })
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
