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

import { FaPlus } from "react-icons/fa";

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerIcon,
  iconUrl: customMarkerIcon,
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function MapComponent({ mapType }) {
  const { setAjouterGeofencePopup } = useContext(DataContext);

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

  const [isAddingNewGeofence, setIsAddingNewGeofence] = useState(false);
  const [positionIndex, setPositionIndex] = useState(1);

  const geofences = {
    description: "",
    color: "",
    coordinates: [
      {
        lat: "",
        lng: "",
      },
      {
        lat: "",
        lng: "",
      },
      {
        lat: "",
        lng: "",
      },
      {
        lat: "",
        lng: "",
      },
    ],
  };

  return (
    <div>
      {isAddingNewGeofence && (
        <div className="fixed text-sm flex gap-2 z-[999] shadow-lg bottom-[4rem] lg:bottom-[1rem] rounded-lg p-2 left-[.5rem] right-[.5rem] bg-white  ">
          <div className="mx-auto flex flex-col xs:flex-row gap-3">
            {positionIndex <= 8 && (
              <p
                className=" xs:min-w-[11rem] flex justify-center font-semibold items-center gap-2 rounded-lg bg-green-200 text-green-900 px-3 py-1.5 cursor-pointer"
                onClick={() => {}}
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
                onClick={() => {}}
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

        {isAddingNewGeofence && (
          <Polygon
            positions={geofences?.coordinates?.map((point) => [
              point.lat,
              point.lng,
            ])}
            pathOptions={{
              color:
                geofences?.color ||
                ajouterCouleurGeofenceCodeCouleurRef.current,
              fillColor:
                geofences?.color ||
                ajouterCouleurGeofenceCodeCouleurRef.current,
              fillOpacity: 0.1,
              weight: 1,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
