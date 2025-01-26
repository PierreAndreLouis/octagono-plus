import React, { useEffect } from "react";

const MapComponentTest = () => {
  const positions = [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 40.7128, lng: -74.006 }, // New York
  ];

  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Centre par défaut
        zoom: 5,
      });

      // Ajouter des marqueurs
      positions.forEach((pos) => {
        new google.maps.Marker({
          position: pos,
          map: map,
        });
      });
    };

    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBG7gNHAhDzgYmq4-EHvM4bqW1DNj2UCuk`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapComponentTest;

// export default MapComponentTest
