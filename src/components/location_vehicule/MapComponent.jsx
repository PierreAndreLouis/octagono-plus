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
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";
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
  isDashBoardComptnent,
  isAddingNewGeofence,
  setIsAddingNewGeofence,
  setDocumentationPage,
}) {
  const {
    selectedVehicleToShowInMap,
    currentDataFusionné,
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
    gestionAccountData,
  } = useContext(DataContext);

  // le data a utiliser
  const navigate = useNavigate();

  const dataFusionné =
    currentAccountSelected?.accountDevices ??
    accountDevices ??
    currentDataFusionné;

  const vehiculeActive = dataFusionné;

  // Formatage des donnee pour la  carte
  const véhiculeData = vehiculeActive?.map((véhicule) => ({
    deviceID: véhicule?.deviceID || "",
    accountID: véhicule?.accountID || "",
    description: véhicule.description || "Véhicule",
    lastValidLatitude:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.latitude ||
      véhicule?.lastValidLatitude ||
      "",
    lastValidLongitude:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.longitude ||
      véhicule?.lastValidLongitude ||
      "",
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
        ?.timestamp ||
      véhicule?.lastUpdateTime ||
      "",
    speedKPH:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.speedKPH,
    heading:
      véhicule?.véhiculeDetails?.[historiqueSelectedLocationIndex || 0]
        ?.heading || 0,
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
    // }, [selectedVehicleToShowInMap, vehicles]);
  }, [selectedVehicleToShowInMap]);

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const currentTimeSec = getCurrentTimestamp();

  const getMarkerIcon = (véhicule) => {
    const speed = parseFloat(véhicule?.speedKPH);
    const direction = Math.round(véhicule?.heading / 45.0) % 8;
    const timestamp = véhicule?.timestamp * 1000; // Convertir en millisecondes
    const lastUpdateTime = véhicule?.timestamp;

    const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
    const currentTimeMs = Date.now();

    const isRecentlyUpdate =
      currentTimeSec - lastUpdateTime <= twentyFourHoursInSec;

    const isNotRecentlyUpdate =
      currentTimeSec - lastUpdateTime <= twentyFourHoursInSec;

    const isStillSpeedActive =
      timestamp && currentTimeMs - timestamp <= tenMinutesInMs;

    if (currentAccountSelected?.accountDevices || accountDevices) {
      if (isRecentlyUpdate) return "/pin/ping_red.png";
      return "/pin/ping_purple.png";
    } else {
      if (speed <= 0 || !isStillSpeedActive) return "/pin/ping_red.png";
      if (speed > 0 && speed <= 20 && isStillSpeedActive)
        return `/pin/ping_yellow_h${direction}.png`;
      return `/pin/ping_green_h${direction}.png`;
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

  const [ajouterCouleurGeofencePopup, setAjouterCouleurGeofencePopup] =
    useState(false);
  const [
    ajouterCouleurGeofenceCodeCouleur,
    setAjouterCouleurGeofenceCodeCouleur,
  ] = useState("#FF0000");

  const ajouterCouleurGeofenceCodeCouleurRef = useRef(
    ajouterCouleurGeofenceCodeCouleur
  );

  useEffect(() => {
    ajouterCouleurGeofenceCodeCouleurRef.current =
      ajouterCouleurGeofenceCodeCouleur;
  }, [ajouterCouleurGeofenceCodeCouleur]);

  // xxxxxxxxxxxxxxxxxxxxxxx

  const [ajouterCouleurGeofenceEnText, setAjouterCouleurGeofenceEnText] =
    useState("Rouge vif");

  useEffect(() => {
    console.log("");
  }, [ajouterCouleurGeofenceCodeCouleur]);

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  const popupRef = useRef(null);

  const [positionIndex, setPositionIndex] = useState(1);

  const [addOrEditPosition, setAddOrEditPosition] = useState(
    `position${positionIndex}`
  );
  const [clickedPosition1, setClickedPosition1] = useState(null);
  const clickedPosition1Ref = useRef(clickedPosition1);

  useEffect(() => {
    clickedPosition1Ref.current = clickedPosition1;
  }, [clickedPosition1]);

  const [clickedPosition2, setClickedPosition2] = useState(null);
  const clickedPosition2Ref = useRef(clickedPosition2);

  const [clickedPosition3, setClickedPosition3] = useState(null);
  const clickedPosition3Ref = useRef(clickedPosition3);

  const [clickedPosition4, setClickedPosition4] = useState(null);
  const clickedPosition4Ref = useRef(clickedPosition4);

  const [clickedPosition5, setClickedPosition5] = useState(null);
  const clickedPosition5Ref = useRef(clickedPosition5);

  const [clickedPosition6, setClickedPosition6] = useState(null);
  const clickedPosition6Ref = useRef(clickedPosition6);

  const [clickedPosition7, setClickedPosition7] = useState(null);
  const clickedPosition7Ref = useRef(clickedPosition7);

  const [clickedPosition8, setClickedPosition8] = useState(null);
  const clickedPosition8Ref = useRef(clickedPosition8);

  useEffect(() => {
    clickedPosition2Ref.current = clickedPosition2;
  }, [clickedPosition2]);

  useEffect(() => {
    clickedPosition3Ref.current = clickedPosition3;
  }, [clickedPosition3]);

  useEffect(() => {
    clickedPosition4Ref.current = clickedPosition4;
  }, [clickedPosition4]);

  useEffect(() => {
    clickedPosition5Ref.current = clickedPosition5;
  }, [clickedPosition5]);

  useEffect(() => {
    clickedPosition6Ref.current = clickedPosition6;
  }, [clickedPosition6]);

  useEffect(() => {
    clickedPosition7Ref.current = clickedPosition7;
  }, [clickedPosition7]);

  useEffect(() => {
    clickedPosition8Ref.current = clickedPosition8;
  }, [clickedPosition8]);

  useEffect(() => {
    console.log("");
    setAddOrEditPosition(`position${positionIndex}`);
  }, [positionIndex]);

  function MapClickHandler({ setClickedPosition1 }) {
    useMapEvent("click", (e) => {
      console.log("Position cliquée :", e.latlng);

      if (addOrEditPosition === "position1" && clickedPosition1 === undefined) {
        setClickedPosition1(e.latlng);
      } else if (
        addOrEditPosition === "position2" &&
        clickedPosition2 === undefined
      ) {
        setClickedPosition2(e.latlng);
      } else if (
        addOrEditPosition === "position3" &&
        clickedPosition3 === undefined
      ) {
        setClickedPosition3(e.latlng);
      } else if (
        addOrEditPosition === "position4" &&
        clickedPosition4 === undefined
      ) {
        setClickedPosition4(e.latlng);
      } else if (
        addOrEditPosition === "position5" &&
        clickedPosition5 === undefined
      ) {
        setClickedPosition5(e.latlng);
      } else if (
        addOrEditPosition === "position6" &&
        clickedPosition6 === undefined
      ) {
        setClickedPosition6(e.latlng);
      } else if (
        addOrEditPosition === "position7" &&
        clickedPosition7 === undefined
      ) {
        setClickedPosition7(e.latlng);
      } else if (
        addOrEditPosition === "position8" &&
        clickedPosition8 === undefined
      ) {
        setClickedPosition8(e.latlng);
      } else {
        return;
      }
    });
    return null;
  }

  const [geofences, setGeofence] = useState(null);

  useEffect(() => {
    const coordinates = [
      clickedPosition1,
      clickedPosition2,
      clickedPosition3,
      clickedPosition4,
      clickedPosition5,
      clickedPosition6,
      clickedPosition7,
      clickedPosition8,
    ]
      .filter(Boolean)
      .map((pos) => ({ lat: pos.lat, lng: pos.lng })); // Assure une structure propre

    // setGeofence(newGeofence);
    // if (coordinates.length > 2) {
    setGeofence({
      coordinates, // Tableau d'objets { lat, lng }
      color: ajouterCouleurGeofenceCodeCouleurRef.current, // Couleur par défaut
    });
    // }
  }, [
    clickedPosition1,
    clickedPosition2,
    clickedPosition3,
    clickedPosition4,
    clickedPosition5,
    clickedPosition6,
    clickedPosition7,
    clickedPosition8,
    ajouterCouleurGeofenceCodeCouleurRef,
    ajouterCouleurGeofenceCodeCouleurRef.current,
  ]);

  const positions = [
    clickedPosition1,
    clickedPosition2,
    clickedPosition3,
    clickedPosition4,
    clickedPosition5,
    clickedPosition6,
    clickedPosition7,
    clickedPosition8,
  ];

  const positionComponents = positions.map((position, index) => {
    const positionNumber = index + 1;

    const handleDragEnd = (event) => {
      const { lat, lng } = event.target.getLatLng();
      switch (positionNumber) {
        case 1:
          setClickedPosition1({ lat, lng });
          break;
        case 2:
          setClickedPosition2({ lat, lng });
          break;
        case 3:
          setClickedPosition3({ lat, lng });
          break;
        case 4:
          setClickedPosition4({ lat, lng });
          break;
        case 5:
          setClickedPosition5({ lat, lng });
          break;
        case 6:
          setClickedPosition6({ lat, lng });
          break;
        case 7:
          setClickedPosition7({ lat, lng });
          break;
        case 8:
          setClickedPosition8({ lat, lng });
          break;
        default:
          break;
      }
    };

    return (
      position && (
        <Marker
          key={positionNumber}
          icon={L.icon({
            iconUrl:
              addOrEditPosition === `position${positionNumber}`
                ? "/pin/ping_green.png"
                : "/pin/ping_red.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl:
              "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
            shadowSize: [1, 1],
            // shadowSize: [41, 41],
          })}
          position={[position.lat, position.lng]}
          draggable={true} // Active le déplacement du marqueur
          eventHandlers={{
            dragend: handleDragEnd, // Met à jour la position après le déplacement
          }}
        ></Marker>
      )
    );
  });

  const [zoneName, setZoneName] = useState("");
  const [zoneDescription, setZoneDescription] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "zoneName") {
      setZoneName(value);
    } else if (name === "zoneDescription") {
      setZoneDescription(value);
    }
  };

  //
  //
  //
  //
  //
  //
  //

  const [pasAssezDePositionAjouterErreur, setPasAssezDePositionAjouterErreur] =
    useState(true);

  useEffect(() => {
    setPasAssezDePositionAjouterErreur(false);
  }, [geofences]);
  const addGeofenceFonction = (e) => {
    if (e) e.preventDefault(); // Vérifie si `e` existe avant d'appeler preventDefault()

    const description = zoneDescription || "";

    const color =
      ajouterCouleurGeofenceCodeCouleur ||
      ajouterCouleurGeofenceCodeCouleurRef.current ||
      ""; // Use shapeColor for consistency

    const geozoneID =
      currentGeozone?.geozoneID ||
      `${zoneDescription.toLowerCase().replace(/\s+/g, "_")}`;

    if (geofences?.coordinates.length >= 3 && !isEditingGeofence) {
      const [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8] =
        geofences?.coordinates;

      // console.log(
      createNewGeofence(
        description,

        color,
        pos1?.lat || "",
        pos1?.lng || "",
        pos2?.lat || "",
        pos2?.lng || "",
        pos3?.lat || "",
        pos3?.lng || "",
        pos4?.lat || "",
        pos4?.lng || "",
        pos5?.lat || "",
        pos5?.lng || "",
        pos6?.lat || "",
        pos6?.lng || "",
        pos7?.lat || "",
        pos7?.lng || "",
        pos8?.lat || "",
        pos8?.lng || "",
        currentAccountSelected?.accountID,
        // gestionAccountData.find(
        //   (account) => account.accountID === currentAccountSelected?.accountID
        // )?.accountID,
        "admin",
        currentAccountSelected?.password
        // gestionAccountData.find(
        //   (account) => account.accountID === currentAccountSelected?.accountID
        // )?.password
      );

      // setTimeout(() => {
      setDocumentationPage("Gestion_geofences");
      // }, 1000);
    } else if (geofences?.coordinates.length >= 3 && isEditingGeofence) {
      const [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8] =
        geofences?.coordinates;

      // console.log(
      ModifierGeofence(
        description,
        color,
        geozoneID,
        pos1?.lat || "",
        pos1?.lng || "",
        pos2?.lat || "",
        pos2?.lng || "",
        pos3?.lat || "",
        pos3?.lng || "",
        pos4?.lat || "",
        pos4?.lng || "",
        pos5?.lat || "",
        pos5?.lng || "",
        pos6?.lat || "",
        pos6?.lng || "",
        pos7?.lat || "",
        pos7?.lng || "",
        pos8?.lat || "",
        pos8?.lng || "",
        // ////////////////////
        currentAccountSelected?.accountID,
        "admin",
        currentAccountSelected?.password
      );

      setDocumentationPage("Gestion_geofences");
    } else {
      console.log("pas d'assez de coordonnee...");
      setPasAssezDePositionAjouterErreur(true);
    }
  };

  const setCurrentGeozoneFonction = () => {
    // setZoneName(currentGeozone?.description)
    setZoneDescription(currentGeozone?.description);
    setAjouterCouleurGeofenceCodeCouleur(currentGeozone?.color);
    setAjouterCouleurGeofenceEnText("");
    setClickedPosition1(
      L.latLng(
        currentGeozone?.coordinates[0].lat,
        currentGeozone?.coordinates[0].lng
      )
    );

    setClickedPosition2(
      L.latLng(
        currentGeozone?.coordinates[1].lat,
        currentGeozone?.coordinates[1].lng
      )
    );

    setClickedPosition3(
      L.latLng(
        currentGeozone?.coordinates[2].lat,
        currentGeozone?.coordinates[2].lng
      )
    );

    setClickedPosition4(
      L.latLng(
        currentGeozone?.coordinates[3].lat,
        currentGeozone?.coordinates[3].lng
      )
    );

    setClickedPosition5(
      L.latLng(
        currentGeozone?.coordinates[4].lat,
        currentGeozone?.coordinates[4].lng
      )
    );

    setClickedPosition6(
      L.latLng(
        currentGeozone?.coordinates[5].lat,
        currentGeozone?.coordinates[5].lng
      )
    );

    setClickedPosition7(
      L.latLng(
        currentGeozone?.coordinates[6].lat,
        currentGeozone?.coordinates[6].lng
      )
    );

    setClickedPosition8(
      L.latLng(
        currentGeozone?.coordinates[7].lat,
        currentGeozone?.coordinates[7].lng
      )
    );
  };

  useEffect(() => {
    setCurrentGeozoneFonction();
  }, [currentGeozone]);

  const calculatePolygonCenter = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return { lat: 0, lng: 0 };
    const latSum = coordinates.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = coordinates.reduce((sum, point) => sum + point.lng, 0);
    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length,
    };
  };

  const centrerSurGeofenceChoisis = () => {
    if (mapRef.current && geofences?.coordinates?.length > 0) {
      const { lat, lng } = geofences.coordinates[0];
      mapRef.current.setView([lat, lng], 10);
      console.log("Carte centrée sur la première position du geofence");
    }
  };

  const centrerSurHaiti = () => {
    if (mapRef.current) {
      const coordinates = [
        { lat: 17.79297219635383, lng: -74.46607937065865 },
        { lat: 19.81964982383767, lng: -74.57589816742004 },
        { lat: 20.180774787037656, lng: -70.42474764983946 },
        { lat: 17.83656772376724, lng: -70.14165652823564 },
      ];

      const avgLat =
        coordinates.reduce((sum, coord) => sum + coord.lat, 0) /
        coordinates.length;
      const avgLng =
        coordinates.reduce((sum, coord) => sum + coord.lng, 0) /
        coordinates.length;

      mapRef.current.setView([avgLat, avgLng], 7);
      console.log("Carte centrée sur le point moyen des 4 positions");
    }
  };

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

  return (
    <div ref={ref1} className="relative">
      {isAddingNewGeofence && (
        <div className="fixed  z-[9999999999] shadow-lg right-[1rem] lg:right-[2rem] md:top-[5rem] top-[11rem]  ">
          <button
            onClick={() => {
              setIsAddingNewGeofence(false);
              setAjouterGeofencePopup(false);
              if (!isDashBoardComptnent) {
                navigate("/gestion_geofences?tab=geozone");
              }
              setDocumentationPage("Gestion_geofences");

              // centrerSurGeofenceChoisis();
            }}
            // to="/gestion_geofences?tab=geozone"
            className="py-[.1rem] w-full flex justify-center items-center cursor-pointer px-3 bg-red-600 text-white rounded-lg"
          >
            Annuler
          </button>
        </div>
      )}

      {isAddingNewGeofence && (
        <div
          ref={ref2}
          className="fixed -- --absolute text-sm flex gap-2 z-[99999] shadow-lg bottom-[4rem] lg:bottom-[1rem] rounded-lg p-2 left-[.5rem]-- right-[.5rem] bg-white  "
        >
          <div className="mx-auto flex flex-col xs:flex-row gap-3">
            {positionIndex < 8 && (
              <p
                className=" xs:min-w-[11rem] flex justify-center font-semibold items-center gap-2 rounded-lg bg-green-200 text-green-900 px-3 py-1.5 cursor-pointer"
                onClick={() => {
                  if (clickedPosition1 != null) {
                    setPositionIndex(2);
                  }
                  if (clickedPosition2 != null) {
                    setPositionIndex(3);
                  }
                  if (clickedPosition3 != null) {
                    setPositionIndex(4);
                  }
                  if (clickedPosition4 != null) {
                    setPositionIndex(5);
                  }
                  if (clickedPosition5 != null) {
                    setPositionIndex(6);
                  }
                  if (clickedPosition6 != null) {
                    setPositionIndex(7);
                  }
                  if (clickedPosition7 != null) {
                    setPositionIndex(8);
                  }
                  console.log(clickedPosition1);
                  console.log(clickedPosition2);
                  console.log(clickedPosition3);
                  console.log(clickedPosition4);
                }}
              >
                <span className="w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-full bg-green-600 text-white">
                  <FaPlus />
                </span>
                Nouvelle position
              </p>
            )}
            <div className="flex  gap-3 w-full  min-w-[80vw] xs:min-w-0">
              <p
                className="py-1.5 w-full font-semibold flex justify-center items-center cursor-pointer px-3 bg-red-200 text-red-900 rounded-lg"
                onClick={() => {
                  setClickedPosition1(undefined);
                  setClickedPosition2(undefined);
                  setClickedPosition3(undefined);
                  setClickedPosition4(undefined);
                  setClickedPosition5(undefined);
                  setClickedPosition6(undefined);
                  setClickedPosition7(undefined);
                  setClickedPosition8(undefined);
                  setPositionIndex(1);
                }}
              >
                Recommencer
              </p>
              <p
                onClick={() => {
                  setAjouterGeofencePopup(true);
                }}
                className="py-1.5 w-full flex justify-center items-center cursor-pointer px-3 bg-green-600 text-white rounded-lg"
              >
                Continue
              </p>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      {ajouterGeofencePopup && (
        <div className="fixed flex justify-center items-center z-[99999999999] inset-0 bg-black/30 px-2">
          {/* {true && ( */}
          {createGeofenceLoading && (
            <div className="absolute z-[9] inset-0 bg-gray-100/70 dark:bg-gray-900/50">
              <div className="w-full h-full flex justify-center items-center">
                <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
              </div>
            </div>
          )}

          <div className="mx-auto relative   min-w-[90vw]-- w-full max-w-[40rem] rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-md font-semibold pb-2 border-b">
                Ajouter un Geofence{" "}
                <span className="font-normal text-gray-600">
                  (Separation sur la carte)
                </span>
              </h2>
              <button
                onClick={() => {
                  if (!isDashBoardComptnent) {
                    navigate("/gestion_geofences?tab=geozone");
                  }
                  setDocumentationPage("Gestion_geofences");
                }}
                // to="/gestion_geofences?tab=geozone"
              >
                <IoClose
                  onClick={() => {
                    setAjouterGeofencePopup(false);
                    setIsAddingNewGeofence(false);
                  }}
                  className="text-2xl cursor-pointer text-red-600"
                />
              </button>
            </div>
            <form onSubmit={addGeofenceFonction} className="mt-4">
              <label
                htmlFor="zoneDescription"
                className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Description de la zone :
              </label>
              <input
                id="zoneDescription"
                name="zoneDescription"
                type="text"
                placeholder="Description de la zone"
                value={zoneDescription}
                onChange={handleInputChange}
                required
                className="block px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300">
                Couleur :
              </p>
              <div
                onClick={() => {
                  setAjouterCouleurGeofencePopup(true);
                }}
                className="flex justify-between items-center px-3 w-full border-b pb-2 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <div className="flex gap-4 items-center ">
                  <div
                    style={{
                      backgroundColor: `${ajouterCouleurGeofenceCodeCouleur}`,
                    }}
                    className={` w-[2rem] h-[1.2rem] rounded-md -bg-red-500`}
                  ></div>
                  <p>{ajouterCouleurGeofenceEnText}</p>
                </div>
                <p className="cursor-pointer text-orange-500">Modifier</p>
              </div>
              <label
                htmlFor="description"
                className="block mt-4 text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
              >
                Coordonnée :
              </label>
              <div
                className="flex border-b pb-3
               justify-between items-center w-full "
              >
                <p>{geofences?.coordinates.length} positions </p>
                <p
                  onClick={() => {
                    setAjouterGeofencePopup(false);
                    setIsAddingNewGeofence(true);
                    if (isEditingGeofence) {
                      centrerSurGeofenceChoisis();
                    } else {
                      centrerSurHaiti();
                    }
                  }}
                  className="block cursor-pointer text-orange-600 px-3  border-b pb-2 py-1.5 outline-none  dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm "
                >
                  {geofences?.coordinates.length <= 0
                    ? "Ajouter des position "
                    : "Modifier les positions"}
                </p>
              </div>
              {pasAssezDePositionAjouterErreur && (
                <p className="bg-red-100 mt-3 text-red-800 px-4 py-1 rounded-lg">
                  Vous devez ajouter au 3 positions
                </p>
              )}
              <div className="mt-10 max-w-[25rem] flex justify-center  mx-auto gap-3 ">
                <button
                  type="submit"
                  // onClick={() => {
                  //   console.log("Les donnees trouver..............xxxxxxxxxxx");
                  //   addGeofenceFonction();
                  // }}
                  className="px-4 w-full cursor-pointer py-1 rounded-lg bg-green-500 text-white"
                >
                  {isEditingGeofence ? "Modifier" : "Ajouter"}
                </button>

                <button
                  onClick={() => {
                    setIsAddingNewGeofence(false);
                    setAjouterGeofencePopup(false);

                    if (!isDashBoardComptnent) {
                      navigate("/gestion_geofences?tab=geozone");
                    }
                    setDocumentationPage("Gestion_geofences");
                  }}
                  // to="/gestion_geofences?tab=geozone"
                  className="px-4 w-full text-center cursor-pointer py-1 rounded-lg bg-red-500 text-white"
                >
                  Annuler
                </button>
              </div>
            </form>{" "}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {ajouterCouleurGeofencePopup && (
              <div className="absolute bg-white min-w-[20rem] shadow-lg shadow-black/20 top-[1rem] right-[1rem] border p-4 rounded-lg flex flex-col gap-0">
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
                  className="mt-4 overflow-auto max-h-[20rem] flex flex-col"
                >
                  {[
                    { name: "Bleu foncé", color: "#003366" },
                    { name: "Rouge vif", color: "#FF0000" },
                    { name: "Vert émeraude", color: "#2ECC71" },
                    { name: "Jaune doré", color: "#F1C40F" },
                    { name: "Turquoise", color: "#1ABC9C" },
                    { name: "Violet", color: "#8E44AD" },
                    { name: "Orange", color: "#FF5733" },
                    { name: "Gris anthracite", color: "#34495E" },
                    { name: "Rose fuchsia", color: "#C0392B" },
                    { name: "Noir", color: "#000000" },
                    { name: "Rouge foncé", color: "#8B0000" }, // Dark Red
                    { name: "Orange foncé", color: "#E65100" }, // Dark Orange
                    { name: "Jaune foncé", color: "#B7950B" }, // Dark Yellow
                    { name: "Vert foncé", color: "#006400" }, // Dark Green
                    { name: "Bleu foncé", color: "#00008B" }, // Dark Blue
                    { name: "Indigo foncé", color: "#4B0082" }, // Dark Indigo
                    { name: "Violet foncé", color: "#5B2C6F" }, // Dark Violet
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setAjouterCouleurGeofenceCodeCouleur(item.color);

                        setAjouterCouleurGeofenceEnText(
                          item.name.toLowerCase()
                        );
                      }}
                      className={`${
                        ajouterCouleurGeofenceEnText === item.name.toLowerCase()
                          ? "bg-orange-50"
                          : ""
                      } hover:bg-orange-50 p-2 cursor-pointer`}
                    >
                      <div className="flex gap-4 justify-between items-center">
                        <p>{item.name}</p>
                        <div
                          className="w-[2rem] h-[1.2rem] rounded-md"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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

        {/* Composant qui gère le clic sur la carte */}

        {!isAddingNewGeofence &&
          geofenceData
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
                      color: geofence?.color || "", // Couleur de la bordure
                      fillColor: geofence?.color || "#000000", // Couleur du fond
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
                           
                           style="font-size: ${textSize}; width: ${widthSize}; color: #706f6f; {geofence.color}; textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'">
                           ${geofence?.description}
                           </div>`,
                    })}
                  />
                </React.Fragment>
              );
            })}

        {!isAddingNewGeofence &&
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
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl:
                    "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                  // shadowSize: [41, 41],
                  shadowSize: [1, 1],
                })}
              >
                <Popup>
                  <div className="w-[70vw] max-w-[20rem]">
                    <p className="font-bold text-[1rem]">
                      <span>Description :</span>{" "}
                      {véhicule.description || "Non disponible"}
                    </p>

                    <p>
                      <strong>accountID :</strong>{" "}
                      {véhicule.accountID || "Non disponible"}
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
                      {véhicule.speedKPH ? "" : "Hors service"}
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

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Composant qui gère le clic sur la carte */}
        <MapClickHandler setClickedPosition1={setClickedPosition1} />

        {isAddingNewGeofence && (
          <React.Fragment>
            <Polygon
              positions={geofences?.coordinates?.map((point) => [
                point.lat,
                point.lng,
              ])}
              pathOptions={{
                color:
                  geofences?.color ||
                  ajouterCouleurGeofenceCodeCouleurRef.current, // Couleur de la bordure
                fillColor:
                  geofences?.color ||
                  ajouterCouleurGeofenceCodeCouleurRef.current, // Couleur du fond
                fillOpacity: 0.1, // Opacité du fond
                weight: 1, // Épaisseur des lignes
              }}
            />

            <Marker
              position={calculatePolygonCenter(geofences?.coordinates || [])}
              icon={L.divIcon({
                className: "geofence-label",
                html: `<div 
                           class="bg-gray-100 px-2 shadow-lg shadow-black/20 rounded-md  flex justify-center items-center  -translate-x-[50%] text-black font-bold text-center whitespace-nowrap- overflow-hidden-" 
                           
                           style="font-size: ${textSize}; width: ${widthSize}; color: #706f6f; {
                  ajouterCouleurGeofenceCodeCouleurRef.current ||
                  ajouterCouleurGeofenceCodeCouleur
                }; textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'">
                           ${zoneDescription || ""}
                           </div>`,
              })}
            />
          </React.Fragment>
        )}

        <>{isAddingNewGeofence && positionComponents}</>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
