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
import Tooltip from "@mui/material/Tooltip";

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
  fromHistorique = "false",
  fromRapportGroupe,
  setDocumentationPage,
  handleVehicleClick,
  isFetchFromUpdateAuro,
  fromDashboard = "",
}) {
  const {
    selectedVehicleToShowInMap,
    FormatDateHeure,
    historiqueSelectedLocationIndex,
    username,

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
    fromSelectOnPositionValue,
    setFromSelectOnPositionValue,
    currentVéhicule,
    filteredColorCategorieListe,
    isFilteredCartePositionByCategorie,
    setIsFilteredCartePositionByCategorie,
    // updateAccountDevicesWidthvéhiculeDetailsFonction,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  // Pré-calcul des icônes pour éviter de recréer L.icon à chaque render
  const precomputedIcons = useMemo(() => {
    const scale = 0.8; // facteur de réduction (50%)
    const directions = Array.from({ length: 8 }, (_, i) => i);

    const baseSize = [25, 35]; // largeur, hauteur originale
    const anchor = [12, 35]; // anchor originale

    const icons = {
      red: L.icon({
        iconUrl: "/pin/ping_red.png",
        iconSize: [baseSize[0] * scale, baseSize[1] * scale],
        iconAnchor: [anchor[0] * scale, anchor[1] * scale],
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        shadowSize: [1, 1],
      }),
      purple: L.icon({
        iconUrl: "/pin/ping_purple.png",
        iconSize: [baseSize[0] * scale, baseSize[1] * scale],
        iconAnchor: [anchor[0] * scale, anchor[1] * scale],
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        shadowSize: [1, 1],
      }),
      yellow: {},
      green: {},
    };

    directions.forEach((dir) => {
      icons.yellow[dir] = L.icon({
        iconUrl: `/pin/ping_yellow_h${dir}.png`,
        iconSize: [baseSize[0] * scale, baseSize[1] * scale],
        iconAnchor: [anchor[0] * scale, anchor[1] * scale],
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        shadowSize: [1, 1],
      });
      icons.green[dir] = L.icon({
        iconUrl: `/pin/ping_green_h${dir}.png`,
        iconSize: [baseSize[0] * scale, baseSize[1] * scale],
        iconAnchor: [anchor[0] * scale, anchor[1] * scale],
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        shadowSize: [1, 1],
      });
    });

    return icons;
  }, []);

  let ListeAppareilFinalAAfficher = appareilPourAfficherSurCarte;

  if (isFilteredCartePositionByCategorie) {
    ListeAppareilFinalAAfficher = filteredColorCategorieListe;
  } else {
    ListeAppareilFinalAAfficher = appareilPourAfficherSurCarte;
  }
  // useEffect(() => {
  // }, [
  //   isFilteredCartePositionByCategorie,
  //   filteredColorCategorieListe,
  //   appareilPourAfficherSurCarte,
  // ]);

  const véhiculeData = useMemo(() => {
    return ListeAppareilFinalAAfficher?.map((véhicule) => {
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
    })?.filter(
      (v) =>
        v.lastValidLatitude !== "0.0" &&
        v.lastValidLongitude !== "0.0" &&
        v.lastValidLatitude !== "" &&
        v.lastValidLongitude !== "",
    );
  }, [
    appareilPourAfficherSurCarte,
    isFilteredCartePositionByCategorie,
    filteredColorCategorieListe,
  ]);

  const mapRef = useRef(null);

  const véhiculeHistoriqueUnique = useMemo(() => {
    if (historiqueSelectedLocationIndex != null && selectedVehicleToShowInMap) {
      const véhicule = appareilPourAfficherSurCarte?.find(
        (item) => item?.deviceID === selectedVehicleToShowInMap,
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

  const [selectDeviceInSearch, setSelectDeviceInSearch] = useState();

  useEffect(() => {
    if (!fromSelectOnPositionValue?.length) return;

    const filtered = véhiculeData?.filter(
      (v) => v.deviceID === selectedVehicleToShowInMap,
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
    };

    setSelectDeviceInSearch([updatedDevice]);
  }, [fromSelectOnPositionValue, selectedVehicleToShowInMap, véhiculeData]);

  useEffect(() => {
    onClickVehicle(selectDeviceInSearch?.[0]);
  }, [selectDeviceInSearch]);

  let vehicles;

  if (historiqueSelectedLocationIndex != null && véhiculeHistoriqueUnique) {
    vehicles = [véhiculeHistoriqueUnique];
  } else if (selectedVehicleToShowInMap) {
    vehicles = selectDeviceInSearch;
  } else {
    vehicles = véhiculeData;
  }

  // pour centrer la carter sur la position sélectionner
  useEffect(() => {
    if (isFetchFromUpdateAuro) return;
    const timeoutId = setTimeout(() => {
      // if (mapRef.current) {
      if (mapRef.current && vehicles?.length) {
        if (selectedVehicleToShowInMap) {
          // Si un véhicule est sélectionné, centrer sur lui
          const selectedVehicleData = vehicles?.find(
            (véhicule) => véhicule?.deviceID === selectedVehicleToShowInMap,
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
            ]),
          );
          mapRef.current.fitBounds(bounds);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Nettoyer le timeout au démontage du composant
  }, [selectedVehicleToShowInMap, vehicles]);

  const getMarkerIcon = (véhicule, getColor = false) => {
    const speed = parseFloat(véhicule?.speedKPH);
    const direction = Math.round(véhicule?.heading / 45.0) % 8;
    const lastUpdateTime = véhicule?.timestamp;

    const currentTimeSec = Math.floor(Date.now() / 1000);
    const twentyFourHoursInSec = 24 * 60 * 60;
    const isNotRecentlyUpdate =
      currentTimeSec - lastUpdateTime > twentyFourHoursInSec;

    if (!getColor) {
      if (isNotRecentlyUpdate) return precomputedIcons.purple;
      if (speed > 20) return precomputedIcons.green[direction];
      if (speed > 0) return precomputedIcons.yellow[direction];
      return precomputedIcons.red;
    } else {
      if (isNotRecentlyUpdate) return "bg-purple-600 text-white";
      if (speed > 20) return "bg-green-600 text-white";
      if (speed > 0)
        return "bg-yellow-300 border text-black font-bold border-b border-b-black";
      return "bg-red-500 text-white";
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
    console.log(véhicule);
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

  const countLimit = 30;
  const [IsUpdateAuto, setIsUpdateAuto] = useState(false);

  const countRef = useRef(countLimit);
  const [count, setCount] = useState(countLimit);

  useEffect(() => {
    if (!IsUpdateAuto) return;
    const timer = setInterval(() => {
      countRef.current =
        countRef.current === 0 ? countLimit : countRef.current - 1;
      setCount(countRef.current);
      if (countRef.current === 0) handleVehicleClick(currentVéhicule, true);
    }, 1000);
    return () => clearInterval(timer);
  }, [IsUpdateAuto, currentVéhicule]);

  useEffect(() => {
    if (!IsUpdateAuto) {
      setCount(countLimit);
    }
  }, [IsUpdateAuto]);

  const markers = useMemo(() => {
    if (!vehicles) return [];

    return vehicles.map((véhicule) => (
      <Marker
        key={véhicule.deviceID}
        position={[
          véhicule.lastValidLatitude || 0,
          véhicule.lastValidLongitude || 0,
        ]}
        icon={getMarkerIcon(véhicule)}
        eventHandlers={{ click: () => onClickVehicle(véhicule) }}
      />
    ));
  }, [vehicles, precomputedIcons]);

  const geofenceMarkers = useMemo(() => {
    if (!showGeofenceInCarte || !geofencePourAfficherSurCarte) return [];

    return geofencePourAfficherSurCarte
      .filter((g) => g.isActive === 1)
      .map((geofence, index) => {
        const validCoordinates = geofence?.coordinates?.filter(
          (point) => point.lat && point.lng,
        );
        if (!validCoordinates.length) return null;

        const latitudes = validCoordinates.map((p) => p.lat);
        const longitudes = validCoordinates.map((p) => p.lng);
        const center = [
          (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
          (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
        ];

        return (
          <React.Fragment key={index}>
            <Polygon
              positions={validCoordinates.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: geofence.color || "#067510",
                fillColor: geofence.color || "#11cc22",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
            <Marker
              position={center}
              icon={L.divIcon({
                className: "geofence-label",
                html: `<div class="bg-gray-100 px-2 shadow-lg rounded-md text-black font-bold text-center"
                         style="font-size:${textSize}; width:${widthSize};">
                      ${geofence.description}
                     </div>`,
              })}
            />
          </React.Fragment>
        );
      });
  }, [showGeofenceInCarte, geofencePourAfficherSurCarte, textSize, widthSize]);

  const VehiclePopup = React.memo(
    ({ véhicule, getMarkerIcon, t, openGoogleMaps }) => {
      if (!véhicule) return null;

      const timestamp = selectedVehicle?.timestamp;
      const now = Date.now();

      // conversion secondes → millisecondes
      const diff = now - timestamp * 1000;

      // 24h en ms
      const isOlderThan24h = diff >= 24 * 60 * 60 * 1000;

      const isHaiti = localStorage.getItem("currentCountry") === "ht";
      return (
        <div
          className={`bottom-[4rem] lg:bottom-4  ${
            fromHistorique === "true" ? "bottom-[1rem] " : ""
          } ${
            fromRapportGroupe === "true"
              ? "bottom-[7rem] lg:bottom-[6.2rem]"
              : ""
          } fixed   right-4 overflow-hidden bg-white p-4 rounded-md shadow-lg max-w-sm z-[1000]`}
        >
          <div className="w-[70vw] max-w-[20rem] relative ">
            <div className="absolute z-10 -top-[2.7rem] text-lg -right-2 flex justify-center items-center text-white-- cursor-pointer w-[2rem] h-[2rem] border border-black   rounded-full ">
              <IoClose
                onClick={() => {
                  setSelectedVehicle(null);
                }}
              />
            </div>
            <div
              className={`${getMarkerIcon(
                selectedVehicle,
                getColor,
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
                {isOlderThan24h && isHaiti && !isDashboardHomePage
                  ? t("Loading") + "..."
                  : selectedVehicle?.address || t("Non disponible")}
              </span>
            </p>

            {/* <p>
              timestamp: {selectedVehicle?.timestamp}
              <strong
                onClick={() => {
                  console.log(selectedVehicle?.timestamp);
                }}
              >
                {t("Adresse")} :
              </strong>{" "}
              <span className="notranslate">
                {selectedVehicle?.address || `${t("Non disponible")}`}
              </span>
            </p> */}

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
              {isOlderThan24h && isHaiti && !isDashboardHomePage ? (
                t("Loading") + "..."
              ) : (
                <span>
                  {selectedVehicle?.timestamp
                    ? FormatDateHeure(selectedVehicle.timestamp)?.date
                    : `${t("Pas de date disponible")}`}
                  <span className="px-3">/</span>
                  {FormatDateHeure(selectedVehicle.timestamp)?.time}
                </span>
              )}
            </p>

            <button
              onClick={() =>
                openGoogleMaps(
                  selectedVehicle?.lastValidLatitude,
                  selectedVehicle?.lastValidLongitude,
                )
              }
              className={`${getMarkerIcon(
                selectedVehicle,
                getColor,
              )}  mt-2 px-3 py-1  text-white-- rounded-md`}
            >
              {t("Voir sur Google Maps")}
            </button>
          </div>
        </div>
      );
    },
  );

  return (
    <div
      onClick={() => {
        // updateAccountDevicesWidthvéhiculeDetailsFonction();
      }}
      ref={ref1}
      className="relative overflow-hidden"
    >
      {selectedVehicle && (
        <VehiclePopup
          véhicule={selectedVehicle}
          getMarkerIcon={getMarkerIcon}
          t={t}
          openGoogleMaps={openGoogleMaps}
        />
      )}

      <Tooltip
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10], // Décalage horizontal et vertical
              },
            },
            {
              name: "zIndex",
              enabled: true,
              phase: "write",
              fn: ({ state }) => {
                state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
              },
            },
          ],
        }}
        title={`${t("Afficher les zones géographiques")}`}
      >
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
      </Tooltip>

      {selectedVehicleToShowInMap && fromHistorique === "false" && (
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -10], // Décalage horizontal et vertical
                },
              },
              {
                name: "zIndex",
                enabled: true,
                phase: "write",
                fn: ({ state }) => {
                  state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                },
              },
            ],
          }}
          title={`${
            IsUpdateAuto
              ? t("Désactiver la mise a jour automatique")
              : t("Activer la mise a jour automatique")
          }`}
        >
          <button
            className="absolute z-[999] top-[8rem] right-[1rem]"
            onClick={() => {
              setIsUpdateAuto(!IsUpdateAuto);
            }}
          >
            <div
              className={`${
                IsUpdateAuto
                  ? "text-green-700 bg-green-100 border border-green-500"
                  : "text-orange-700 bg-orange-100 border border-orange-500"
              } flex justify-center items-center min-w-10 min-h-10 rounded-full   shadow-xl `}
            >
              <p className=" text-[1.2rem] font-bold">{count}</p>
            </div>
          </button>
        </Tooltip>
      )}

      {!selectedVehicleToShowInMap && (
        <Tooltip
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -10], // Décalage horizontal et vertical
                },
              },
              {
                name: "zIndex",
                enabled: true,
                phase: "write",
                fn: ({ state }) => {
                  state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                },
              },
            ],
          }}
          title={`${t("Activer/Désactiver le regroupement des marqueurs")}`}
        >
          <div
            onClick={() => {
              setisMarkerClusterGroupMode(!isMarkerClusterGroupMode);
            }}
            className="border overflow-hidden absolute right-[1rem] top-[19rem] z-[999] cursor-pointer px-2  py-2 border-gray-300 rounded-full shadow-lg shadow-black/20 bg-gray-100"
          >
            <div className="relative">
              <TbMapPinPin
                className={`${
                  isMarkerClusterGroupMode
                    ? "text-green-500"
                    : "text-orange-500"
                } text-2xl `}
              />
            </div>
          </div>
        </Tooltip>
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

        {geofenceMarkers}

        {isMarkerClusterGroupMode ? (
          <MarkerClusterGroup
            chunkedLoading={true} // rend le clustering progressif
            spiderfyOnMaxZoom={false}
            showCoverageOnHover={false}
            maxClusterRadius={50}
          >
            {markers}
          </MarkerClusterGroup>
        ) : (
          markers
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
