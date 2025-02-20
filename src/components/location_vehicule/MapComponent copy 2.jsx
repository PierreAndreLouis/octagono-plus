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
  const { geofenceData } = useContext(DataContext);

  // une reference pour la carte
  const mapRef = useRef(null);

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

  const popupRef = useRef(null);

  const [positionIndex, setPositionIndex] = useState(1);

  const [addOrEditPosition, setAddOrEditPosition] = useState(
    `position${positionIndex}`
  );
  const [clickedPosition1, setClickedPosition1] = useState(null);
  const [clickedPosition2, setClickedPosition2] = useState(null);
  const [clickedPosition3, setClickedPosition3] = useState(null);
  const [clickedPosition4, setClickedPosition4] = useState(null);
  const [clickedPosition5, setClickedPosition5] = useState(null);
  const [clickedPosition6, setClickedPosition6] = useState(null);
  const [clickedPosition7, setClickedPosition7] = useState(null);
  const [clickedPosition8, setClickedPosition8] = useState(null);

  useEffect(() => {
    console.log("");
    setAddOrEditPosition(`position${positionIndex}`);
  }, [positionIndex]);

  function MapClickHandler({ setClickedPosition1 }) {
    useMapEvent("click", (e) => {
      console.log("Position cliquée :", e.latlng);
      if (addOrEditPosition === "position1") {
        setClickedPosition1(e.latlng);
      } else if (addOrEditPosition === "position2") {
        setClickedPosition2(e.latlng);
      } else if (addOrEditPosition === "position3") {
        setClickedPosition3(e.latlng);
      } else if (addOrEditPosition === "position4") {
        setClickedPosition4(e.latlng);
      } else if (addOrEditPosition === "position5") {
        setClickedPosition5(e.latlng);
      } else if (addOrEditPosition === "position6") {
        setClickedPosition6(e.latlng);
      } else if (addOrEditPosition === "position7") {
        setClickedPosition7(e.latlng);
      } else if (addOrEditPosition === "position8") {
        setClickedPosition8(e.latlng);
      } else {
        return;
      }
    });
    return null;
  }

  const [geofences, setGeofence] = useState([]);

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
      color: "#FF0000", // Couleur par défaut
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
            shadowSize: [41, 41],
          })}
          position={[position.lat, position.lng]}
        >
          <Popup ref={popupRef}>
            <div className="">
              <div className="font-bold mb-1">Coordonnée #{positionNumber}</div>
              Latitude: {position.lat.toFixed(6)} <br />
              Longitude: {position.lng.toFixed(6)} <br />
              <div
                onClick={() => {
                  setAddOrEditPosition(`position${positionNumber}`);
                  if (popupRef.current) {
                    popupRef.current.closePopup(); // Fermer le popup correctement
                  }
                }}
                className={`${
                  addOrEditPosition === `position${positionNumber}`
                    ? "bg-green-500"
                    : "bg-red-500"
                } mt-2 cursor-pointer rounded-md text-white p-1 px-3`}
              >
                Modifier
              </div>
            </div>
          </Popup>
        </Marker>
      )
    );
  });

  return (
    <div>
      <div className="fixed flex gap-2 z-[9999999999] shadow-lg bottom-[4rem] rounded-lg p-2 left-[1rem] bg-white ">
        <p
          className="border rounded-lg bg-green-200 text-green-900 px-3 py-1 cursor-pointer"
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
          }}
        >
          Nouvelle position #{positionIndex}
        </p>

        <p
          className="py-1 cursor-pointer px-3 bg-red-200 text-red-900 rounded-lg"
          onClick={() => {
            setClickedPosition1(null);
            setClickedPosition2(null);
            setClickedPosition3(null);
            setClickedPosition4(null);
            setClickedPosition5(null);
            setClickedPosition6(null);
            setClickedPosition7(null);
            setClickedPosition8(null);
            setPositionIndex(1);
          }}
        >
          recommencer
        </p>
        <p className="py-1 cursor-pointer px-3 bg-green-600 text-white rounded-lg">
          Finir
        </p>
      </div>
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

        {/* Composant qui gère le clic sur la carte */}
        <MapClickHandler setClickedPosition1={setClickedPosition1} />

        <Polygon
          positions={geofences?.coordinates?.map((point) => [
            point.lat,
            point.lng,
          ])}
          pathOptions={{
            color: geofences?.color || "#000000",
            fillColor: geofences?.color || "#000000",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />

        <>{positionComponents}</>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
