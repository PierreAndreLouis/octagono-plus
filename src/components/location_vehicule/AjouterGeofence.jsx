import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  AttributionControl,
  useMapEvents,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DataContext } from "../../context/DataContext";
import customMarkerIcon from "/pin/ping_red.png";
import { useTranslation } from "react-i18next";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 35],
  iconAnchor: [12, 35],
  popupAnchor: [1, -33],
  // iconSize: [25, 35],
  // iconAnchor: [7, 20],
  // popupAnchor: [1, -16],
  // shadowSize: [41, 41],
  // shadowSize: [1, 1],
});

const AjouterGeofence = ({
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
}) => {
  const {
    createNewGeofence,
    ModifierGeofence,
    currentGeozone,
    isEditingGeofence,
    currentAccountSelected,
    isDashboardHomePage,
  } = useContext(DataContext);
  const [markers, setMarkers] = useState([]);
  const [polygonColor, setPolygonColor] = useState("#FF0000");
  const [zoneDescription, setZoneDescription] = useState("");
  const mapRef = useRef(null);

  const [t, i18n] = useTranslation();

  // const customMarkerIcon = new L.Icon({
  //   iconUrl: "/pin/ping_red.png",
  //   iconSize: [22, 32],
  //   iconAnchor: [11, 32],
  //   popupAnchor: [0, -32],
  //   shadowUrl: undefined, // Important pour éviter qu’il cherche une ombre par défaut
  //   className: "custom-marker", // Optionnel pour ajouter du style
  // });

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (markers.length < 8) {
          const { lat, lng } = e.latlng;
          setMarkers((prev) => [...prev, [lat, lng]]);
        }
      },
    });
    return null;
  };

  const handleDragEnd = (index) => (event) => {
    const marker = event.target;
    const { lat, lng } = marker.getLatLng();
    setMarkers((prev) => {
      const newMarkers = [...prev];
      newMarkers[index] = [lat, lng];
      return newMarkers;
    });
  };

  const handleResetMarkers = () => {
    setMarkers([]);
    setZoneDescription("");
    setPolygonColor("#FF0000");
  };

  const setCurrentGeozoneFonction = () => {
    if (!currentGeozone || !Array.isArray(currentGeozone.coordinates)) return;
    const coords = currentGeozone.coordinates
      .filter((coord) => coord.lat !== undefined && coord.lng !== undefined)
      .map((coord) => [coord.lat, coord.lng]);

    setMarkers(coords);
    setZoneDescription(currentGeozone.description || "");
    setPolygonColor(currentGeozone.color || "#FF0000");
  };

  useEffect(() => {
    setCurrentGeozoneFonction();
  }, [currentGeozone]);

  const handleSubmitGeofence = () => {
    // Extraction manuelle des positions (jusqu’à 8)
    const pos1 = markers[0] || [];
    const pos2 = markers[1] || [];
    const pos3 = markers[2] || [];
    const pos4 = markers[3] || [];
    const pos5 = markers[4] || [];
    const pos6 = markers[5] || [];
    const pos7 = markers[6] || [];
    const pos8 = markers[7] || [];

    // Vérification de base
    if (markers.length < 3) {
      alert(`${t("Veuillez ajouter au moins 3 positions")}`);
      return;
    }

    if (!zoneDescription) {
      alert(`${t("Veuillez ajouter une description")}`);
      return;
    }

    // Récupération des données de base
    const description = zoneDescription;
    const color = polygonColor;

    const geozoneID = currentGeozone?.geozoneID || "";

    let accountID;
    let username;
    let password;

    if (isDashboardHomePage && !currentAccountSelected) {
      setChooseOtherAccountGestion(true);
      setChooseOneAccountToContinue(true);
      return;
    }

    if (isDashboardHomePage && currentAccountSelected) {
      accountID = currentAccountSelected?.accountID || "";
      username = "admin";
      password = currentAccountSelected?.password || "";
    } else {
      accountID = localStorage.getItem("account") || "";
      username = localStorage.getItem("username") || "";
      password = localStorage.getItem("password") || "";
    }

    // Affichage de debug (facultatif)
    // console.log("Soumission de geofence :");
    // console.log("Description :", description);
    // console.log("Couleur :", color);
    // console.log("Geozone ID :", geozoneID);
    // console.log("Account ID :", accountID);
    // console.log("Mot de passe :", password);
    // console.log("Positions :");
    // console.log("pos1 :", pos1);
    // console.log("pos2 :", pos2);
    // console.log("pos3 :", pos3);
    // console.log("pos4 :", pos4);
    // console.log("pos5 :", pos5);
    // console.log("pos6 :", pos6);
    // console.log("pos7 :", pos7);
    // console.log("pos8 :", pos8);

    if (isEditingGeofence) {
      ModifierGeofence(
        description,
        color,
        geozoneID,
        pos1[0] || "",
        pos1[1] || "",
        pos2[0] || "",
        pos2[1] || "",
        pos3[0] || "",
        pos3[1] || "",
        pos4[0] || "",
        pos4[1] || "",
        pos5[0] || "",
        pos5[1] || "",
        pos6[0] || "",
        pos6[1] || "",
        pos7[0] || "",
        pos7[1] || "",
        pos8[0] || "",
        pos8[1] || "",
        accountID,
        username,
        password
      );
    } else {
      createNewGeofence(
        description,
        color,
        pos1[0] || "",
        pos1[1] || "",
        pos2[0] || "",
        pos2[1] || "",
        pos3[0] || "",
        pos3[1] || "",
        pos4[0] || "",
        pos4[1] || "",
        pos5[0] || "",
        pos5[1] || "",
        pos6[0] || "",
        pos6[1] || "",
        pos7[0] || "",
        pos7[1] || "",
        pos8[0] || "",
        pos8[1] || "",
        accountID,
        username,
        password
      );
      console.log("Données envoyées pour création (sans geozoneID)");
    }
  };

  const calculatePolygonCenter = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return [0, 0];
    const latSum = coordinates.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = coordinates.reduce((sum, [, lng]) => sum + lng, 0);
    return [latSum / coordinates.length, lngSum / coordinates.length];
  };

  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (currentGeozone && Array.isArray(currentGeozone.coordinates)) {
      const coords = currentGeozone.coordinates
        .filter((coord) => {
          const latValid =
            coord.lat !== undefined && coord.lat !== null && coord.lat !== 0;
          const lngValid =
            coord.lng !== undefined && coord.lng !== null && coord.lng !== 0;
          return latValid && lngValid;
        })
        .map((coord) => [coord.lat, coord.lng]);

      if (coords.length > 0) {
        setIsInitializing(true); // On démarre l'initialisation

        setMarkers(coords);
        setZoneDescription(currentGeozone.description || "");
        setPolygonColor(currentGeozone.color || "#FF0000");
        setTimeout(() => {
          centrerSurGeofenceChoisis();
        }, 1000);
      }
    }
  }, [currentGeozone]);

  useEffect(() => {
    if (isInitializing && markers.length > 0) {
      centrerSurGeofenceChoisis();
      setIsInitializing(false); // Fin de l'initialisation après recentrage
    }
  }, [markers, isInitializing]);

  const centrerSurGeofenceChoisis = () => {
    if (mapRef.current && markers.length > 0) {
      const avgLat =
        markers.reduce((sum, [lat]) => sum + lat, 0) / markers.length;
      const avgLng =
        markers.reduce((sum, [, lng]) => sum + lng, 0) / markers.length;

      mapRef.current.setView([avgLat, avgLng], 9);
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
        coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
      const avgLng =
        coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;

      mapRef.current.setView([avgLat, avgLng], 7);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isEditingGeofence) {
        centrerSurHaiti();
      } else {
        centrerSurGeofenceChoisis();
      }
    }, 1000);
  }, [isEditingGeofence]);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="overflow-hidden  z-0 w-full relative min-h-screen">
      <div className="flex p-3 pt-3 pl-3 md:pl-0 gap-3 w-full pr-10-- md:pr-0 overflow-auto items-end justify-between flex-row ">
        {/* <button
          className="py-1.5 rounded-lg bg-red-100 text-red-800 px-4 border border-red-800 flex-nowrap font-semibold"
          onClick={handleResetMarkers}
        >
          {t("Recommencer")}
        </button> */}
        <div className="flex gap-4 ">
          <div className="flex items-end-  gap-1 flex-col">
            <p className="font-semibold">{t("Description")}</p>
            <input
              type="text"
              placeholder={`${t("Description de la zone")}`}
              value={zoneDescription}
              onChange={(e) => setZoneDescription(e.target.value)}
              className="px-4 rounded-lg py-1 focus-within:outline-none border border-gray-800"
            />
          </div>
          <div className="flex items-end- flex-col gap-1 ">
            <p className="font-semibold">{t("Couleur")}</p>
            <div className="max-w-[3rem] rounded-md cursor-pointer mt-[.1rem] overflow-hidden">
              <input
                type="color"
                value={polygonColor}
                onChange={(e) => setPolygonColor(e.target.value)}
                title={`${t("Choisir une couleur")}`}
                className="scale-150"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            className="py-[.25rem] rounded-lg bg-red-100 text-red-800 px-4 border border-red-800 flex-nowrap font-semibold"
            onClick={handleResetMarkers}
          >
            {t("Recommencer")}
          </button>
          <button
            className="py-[.25rem]  border-green-800 rounded-lg font-bold bg-green-500 text-white px-4 border  min-w-[10rem] flex-nowrap"
            onClick={handleSubmitGeofence}
          >
            {isEditingGeofence
              ? `${t("Modifier Geofence")}`
              : `${t("Créer Geofence")}`}
          </button>
        </div>
      </div>
      <div className="z-0 absolute inset-0 top-[5rem]  min-h-screen">
        <MapContainer
          center={[18.5944, -72.3074]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
          attributionControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <ScaleControl position="bottomleft" />
          <AttributionControl position="bottomright" />
          <MapClickHandler />

          {markers.map((pos, index) => (
            <Marker
              // icon={customMarkerIcon}
              key={index}
              position={pos}
              draggable={true}
              eventHandlers={{ dragend: handleDragEnd(index) }}
            >
              <Popup>
                <div>
                  <p>
                    {t("Marqueur")} {index + 1}
                    <br />
                    {t("Coordonnées")} : {pos[0].toFixed(5)},{" "}
                    {pos[1].toFixed(5)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // ← Empêche le click de se propager à la carte
                      setMarkers((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className=" px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    {t("Supprimer")}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {markers.length >= 3 && (
            <Polygon
              positions={markers}
              pathOptions={{
                color: polygonColor,
                fillColor: polygonColor,
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
          )}

          {markers.length >= 3 && (
            <Marker
              position={calculatePolygonCenter(markers)}
              icon={L.divIcon({
                className: "custom-label",
                html: `<div style="
                 background-color: white;
  border-radius: 5px;
  padding: 2px 5px;
  width: 10rem;
  text-align: center;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.4);
  font-size: 12px;
  color: black;
  position: relative;
  left: 50%;
  transform: translateX(-50%);">
                ${zoneDescription}
              </div>`,
              })}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default AjouterGeofence;
