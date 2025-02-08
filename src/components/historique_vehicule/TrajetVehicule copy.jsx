import React, { useContext } from "react";
import TypeDeVue from "./TypeDeVue";
import { MdCenterFocusStrong } from "react-icons/md";
import { Polyline } from "react-leaflet"; // 1. Import Polyline

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  AttributionControl,
} from "react-leaflet";
import { DataContext } from "../../context/DataContext";

function TrajetVehicule({
  typeDeVue,
  setTypeDeVue,
  mapType,
  handleMapTypeChange,
  vehicles,
  mapRef,
  tileLayers,
  getMarkerIcon,
  currentLocation,
  customMarkerIcon,
  positions,
  centerOnFirstMarker,
  showHistoriqueInMap,
  openGoogleMaps,
}) {
  const { selectUTC, FormatDateHeure, username } = useContext(DataContext);
  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes}  ${period}`;
    // return `${hours}:${minutes}:${seconds} ${period}`;
  }

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  function convertToTimezone(timestamp, offset) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const [sign, hours, minutes] = offset
      .match(/([+-])(\d{2}):(\d{2})/)
      .slice(1);
    const totalOffsetMinutes =
      (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);

    date.setMinutes(date.getMinutes() + totalOffsetMinutes); // Appliquer le décalage
    return date;
  }

  function formatTimestampToDateWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTimestampToTimeWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div>
      <div className="relative ">
        <button
          className="absolute z-[999] top-[5rem] right-[1rem]"
          onClick={centerOnFirstMarker}
        >
          <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
            <MdCenterFocusStrong className="text-orange-500 text-[1.52rem]" />
          </div>
        </button>

        <div className="border-2 relative border-red-600--- w-[50rem]--- h-[30rem]--- mt-[2.3rem]-- md:mt-0-- overflow-hidden---">
          {/* centrer la carte */}

          <div className="relative">
            <TypeDeVue
              typeDeVue={typeDeVue}
              setTypeDeVue={setTypeDeVue}
              mapType={mapType}
              handleMapTypeChange={handleMapTypeChange}
            />

            <MapContainer
              center={[
                vehicles[0]?.lastValidLatitude || "",
                vehicles[0]?.lastValidLongitude || "",
              ]}
              zoom={15}
              style={{ height: "110vh", width: "100%" }}
              ref={mapRef} // Utiliser la référence ici
            >
              <TileLayer
                url={tileLayers[mapType].url}
                attribution={tileLayers[mapType].attribution}
              />
              <ScaleControl position="bottomright" />
              <AttributionControl position="bottomleft" />

              {vehicles?.map((véhicule, index) => {
                const {
                  lastValidLatitude,
                  lastValidLongitude,
                  description,
                  imeiNumber,
                  isActive,
                  licensePlate,
                  simPhoneNumber,
                  address,
                  speedKPH,
                  heading,
                  timestamp,
                } = véhicule;

                // const markerIcon = getMarkerIcon(véhicule); // Récupérer l'icône en fonction de la vitesse

                const firstMarkerIcon = L.icon({
                  iconUrl: "/pin/start.png", // Remplacez par le chemin de votre icône
                  iconSize: [50, 60], // Taille plus grande
                  iconAnchor: [47, 61], // Point d'ancrage
                  popupAnchor: [-22, -51],
                });

                const lastMarkerIcon = L.icon({
                  iconUrl: "/pin/end.png", // Remplacez par le chemin de votre icône
                  iconSize: [50, 60],
                  iconAnchor: [4, 61],
                  popupAnchor: [25, -51],
                });

                let markerIcon;

                // Trouver le premier véhicule avec speedKPH > 0
                const firstVehicle = vehicles.find((veh) => veh.speedKPH > 0);
                // Trouver le dernier véhicule avec speedKPH > 0
                const lastVehicle = vehicles
                  .filter((veh) => veh.speedKPH > 0)
                  .pop();

                if (!lastVehicle && index === vehicles.length - 1) {
                  markerIcon = firstMarkerIcon;
                } else if (!firstVehicle && index === 0) {
                  markerIcon = lastMarkerIcon;
                } else if (véhicule === firstVehicle) {
                  markerIcon = lastMarkerIcon;
                } else if (véhicule === lastVehicle) {
                  markerIcon = firstMarkerIcon;
                } else {
                  // Autres positions
                  markerIcon = L.icon({
                    iconUrl: getMarkerIcon(véhicule),
                    iconSize: [17, 25],
                    iconAnchor: [9, 25],
                    popupAnchor: [-1, -20],
                    shadowUrl:
                      "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                    shadowSize: [5, 5],
                  });
                }

                const FormatDateHeureTimestamp = FormatDateHeure(timestamp);

                return (
                  <Marker
                    key={index}
                    position={[lastValidLatitude || 0, lastValidLongitude || 0]}
                    icon={markerIcon}
                  >
                    <Popup className="">
                      <div className="--w-[70vw] ---max-w-[20rem]">
                        <p className="font-bold text-[1rem]">
                          <span>Description :</span>{" "}
                          {description || "Non disponible"}
                        </p>
                        <p>
                          <strong>Adresse :</strong>{" "}
                          {address || "Non disponible"}
                        </p>
                        {username === "admin" && (
                          <p>
                            <strong>IMEI Number :</strong>{" "}
                            {imeiNumber || "loading..."}
                          </p>
                        )}
                        <p>
                          <strong>Vitesse :</strong>{" "}
                          {speedKPH && !isNaN(Number(speedKPH))
                            ? Number(speedKPH).toFixed(0)
                            : "Non disponible"}{" "}
                          Km/h
                        </p>

                        <p>
                          <strong>Date :</strong>{" "}
                          {timestamp
                            ? FormatDateHeureTimestamp?.date
                            : "Pas de date disponible"}
                          <span className="px-3">/</span>
                          {FormatDateHeureTimestamp?.time}
                        </p>

                        <p>
                          <strong>Statut : </strong>
                          {speedKPH < 1 && "En stationnement"}
                          {speedKPH > 20 && "En mouvement rapide"}
                          {speedKPH >= 1 &&
                            speedKPH <= 20 &&
                            "En mouvement lent"}
                        </p>
                        <p>
                          <strong>License Plate :</strong>{" "}
                          {licensePlate || "loading..."}
                        </p>
                        <p>
                          <strong>Numéro SIM :</strong>{" "}
                          {simPhoneNumber || "loading..."}
                        </p>
                        <button
                          onClick={() =>
                            openGoogleMaps(
                              lastValidLatitude,
                              lastValidLongitude
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

              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={L.icon({
                    iconUrl: customMarkerIcon,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl:
                      "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                    shadowSize: [41, 41],
                  })}
                >
                  <Popup>Vous êtes ici</Popup>
                </Marker>
              )}

              {/* 2. Ajoute la ligne rouge entre les positions consécutives */}
              <Polyline positions={positions} color="red" weight={2} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrajetVehicule;
