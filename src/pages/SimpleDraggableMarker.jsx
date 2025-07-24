import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SimpleDraggableMarker = () => {
  const [positions, setPositions] = useState({
    position1: null,
    position2: null,
    position3: null,
    position4: null,
    position5: null,
    position6: null,
    position7: null,
    position8: null,
  });

  const [addOrEditPosition, setAddOrEditPosition] = useState("1");

  // Composant interne juste pour le hook
  const MapClickHandler = () => {
    useMapEvent("click", (e) => {
      const key = `position${addOrEditPosition}`;
      if (!positions[key]) {
        setPositions((prev) => ({
          ...prev,
          [key]: e.latlng,
        }));
      }
    });
    return null;
  };

  const handleDrag = (key, newLatLng) => {
    setPositions((prev) => ({
      ...prev,
      [key]: newLatLng,
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label>Choisir un point à éditer : </label>
        <select
          value={addOrEditPosition}
          onChange={(e) => setAddOrEditPosition(e.target.value)}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i} value={i + 1}>
              Position {i + 1}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <MapClickHandler />

        {Object.entries(positions).map(([key, pos]) =>
          pos ? (
            <Marker
              key={key}
              position={pos}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => handleDrag(key, e.target.getLatLng()),
              }}
            />
          ) : null
        )}
      </MapContainer>
    </>
  );
};

export default SimpleDraggableMarker;

// export default SimpleDraggableMarker;
