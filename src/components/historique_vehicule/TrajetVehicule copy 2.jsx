import React, { useContext, useState, useRef, useEffect } from "react";
import TypeDeVue from "./TypeDeVue";
import { MdCenterFocusStrong } from "react-icons/md";
import { Polyline } from "react-leaflet";
import { FaChevronDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  AttributionControl,
} from "react-leaflet";
import { DataContext } from "../../context/DataContext";
import L from "leaflet";

// Exemple de fonction de sélection d'icône pour un véhicule donné
// (déjà utilisée dans d'autres parties du composant)
const getMarkerIcon = (véhicule) => {
  const speed = parseFloat(véhicule.speedKPH);
  const direction = Math.round(véhicule.heading / 45.0) % 8;

  if (speed <= 0) return "/pin/ping_red.png";
  else if (speed > 0 && speed <= 20)
    return `/pin/ping_yellow_h${direction}.png`;
  else return `/pin/ping_green_h${direction}.png`;
};

function TrajetVehicule({
  typeDeVue,
  setTypeDeVue,
  mapType,
  handleMapTypeChange,
  vehicles,
  mapRef,
  tileLayers,
  positions,
  centerOnFirstMarker,
  openGoogleMaps,
}) {
  const { selectUTC, FormatDateHeure, username } = useContext(DataContext);
  const [ajusterLaVitesse, setAjusterLaVitesse] = useState(0.5);
  const [ajusterLaVitesseText, setAjusterLaVitesseText] = useState("Normal");
  const [centrerLaCarteAuto, setCentrerLaCarteAuto] = useState(true);
  const [niveauZoomAuto, setNiveauZoomAuto] = useState(15);
  const [niveauZoomAutoText, setNiveauZoomAutoText] = useState(50);
  const [voirAnimationTrajetPopup, setVoirAnimationTrajetPopup] =
    useState(false);

  const [vitesseActuelleAnimation, setVitesseActuelleAnimation] = useState(
    vehicles[0]?.speedKPH
  );

  console.log("vitesseActuelleAnimation :", vitesseActuelleAnimation);

  useEffect(() => {
    console.log(ajusterLaVitesse);
    console.log(vitesseActuelleAnimation);
  }, [ajusterLaVitesse, vitesseActuelleAnimation]);

  const [voirAjusterLaVitessePopup, setVoirAjusterLaVitessePopup] =
    useState(false);
  const [voirCentrerLaCarteAutoPopup, setVoirCentrerLaCarteAutoPopup] =
    useState(false);
  const [voirNiveauZoomAutoPopup, setVoirNiveauZoomAutoPopup] = useState(false);

  const [animatedPath, setAnimatedPath] = useState([]);
  const [animatedCurrentPosition, setAnimatedCurrentPosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // console.log(animatedCurrentPosition);
  //   // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarkerAnimation = () => {
    console.log("111111111111");
    if (mapRef.current && vehicles.length > 0) {
      const lastValidLatitude = animatedCurrentPosition?.[0];
      const lastValidLongitude = animatedCurrentPosition?.[1];

      if (
        typeof lastValidLatitude === "number" &&
        typeof lastValidLongitude === "number"
      ) {
        mapRef.current.setView(
          [lastValidLatitude, lastValidLongitude],
          niveauZoomAuto
        );
      } else {
        console.warn("Les coordonnées sont invalides.");
      }
    } else {
      console.warn("La carte n'est pas prête ou il n'y a aucun véhicule.");
    }
  };

  useEffect(() => {
    if (centrerLaCarteAuto) {
      centerOnFirstMarkerAnimation();
    }
  }, [animatedCurrentPosition]);

  // Pour stocker l'icône du marqueur d'animation et pouvoir la mettre à jour
  const [animationMarkerIcon, setAnimationMarkerIcon] = useState(
    L.icon({
      iconUrl: "/pin/animation.png",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
  );
  // Références pour le contrôle de l'animation
  const animationTimeoutRef = useRef(null);
  const animationActiveRef = useRef(false);
  const animatedMarkerRef = useRef(null);
  const centerIntervalRef = useRef(null);

  // On filtre les données pour l'animation : on associe à chaque position le véhicule
  // correspondant, en limitant le nombre de positions consécutives avec speedKPH <= 0.
  const filterAnimationData = (positions, vehicles) => {
    const filtered = [];
    let consecutiveStationary = 0;
    for (let i = 0; i < positions.length; i++) {
      if (vehicles[i] && vehicles[i].speedKPH <= 0) {
        // ///////////////////////////////////
        // ///////////////////////////////////

        if (consecutiveStationary < 7) {
          filtered.push({ position: positions[i], vehicle: vehicles[i] });
          consecutiveStationary++;
        }
        // Si on a déjà 5 marqueurs consécutifs avec speedKPH <= 0, on ignore ce point
      } else {
        filtered.push({ position: positions[i], vehicle: vehicles[i] });
        consecutiveStationary = 0;
      }
    }
    return filtered;
  };

  // Fonction d'animation : interpole entre deux positions sur 1 seconde
  // et met à jour l'icône en fonction des données du véhicule
  const animateMovement = (pathData) => {
    if (pathData.length < 2) return;
    let index = 0;
    const frameRate = 60; // images par seconde

    const moveMarker = () => {
      if (!animationActiveRef.current) return;
      if (index >= pathData.length - 1) {
        setIsAnimating(false);
        animationActiveRef.current = false;
        return;
      }

      const start = pathData[index];
      const end = pathData[index + 1];
      const duration = ajusterLaVitesse * 1000; // 1 seconde par segment
      const totalFrames = (duration / 1000) * frameRate;
      let frame = 0;

      // Interpole entre deux positions (tableaux [lat, lng])
      const interpolatePosition = (startPos, endPos, t) => {
        const lat =
          Number(startPos[0]) + (Number(endPos[0]) - Number(startPos[0])) * t;
        const lng =
          Number(startPos[1]) + (Number(endPos[1]) - Number(startPos[1])) * t;
        return [lat, lng];
      };

      const animateFrame = () => {
        if (!animationActiveRef.current) return;
        if (frame >= totalFrames) {
          // Fin du segment : on fixe la position finale et on met à jour l'icône
          setAnimatedCurrentPosition(end.position);
          setAnimatedPath((prev) => [...prev, end.position]);
          const iconUrl = getMarkerIcon(end.vehicle);
          setVitesseActuelleAnimation(end.vehicle?.speedKPH);
          const updatedIcon = L.icon({
            iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });
          // Met à jour le marqueur d'animation
          if (animatedMarkerRef.current) {
            animatedMarkerRef.current.setIcon(updatedIcon);
          }
          index++;
          moveMarker();
          return;
        }
        const t = frame / totalFrames;
        const newPos = interpolatePosition(start.position, end.position, t);
        setAnimatedCurrentPosition(newPos);

        setAnimatedPath((prev) => [...prev, newPos]);
        // Pour cette frame, on peut utiliser les données du véhicule "start" (ou une interpolation)
        const iconUrl = getMarkerIcon(start.vehicle);
        const updatedIcon = L.icon({
          iconUrl,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
        if (animatedMarkerRef.current) {
          animatedMarkerRef.current.setIcon(updatedIcon);
          animatedMarkerRef.current.setLatLng(newPos);
        }
        frame++;
        requestAnimationFrame(animateFrame);
      };

      animateFrame();
    };

    moveMarker();
  };

  // Démarre ou arrête l'animation
  const startOrStopAnimation = () => {
    if (isAnimating) {
      // Arrêt de l'animation
      animationActiveRef.current = false;
      clearTimeout(animationTimeoutRef.current);
      setIsAnimating(false);
      setAnimatedPath([]);
      setAnimatedCurrentPosition(null);
      return;
    }

    // Filtrage des données pour l'animation en associant chaque position à son véhicule
    const filteredData = filterAnimationData(positions, vehicles);
    if (filteredData.length === 0) return;

    // On initialise l'icône d'animation en fonction du premier véhicule
    const initialIcon = L.icon({
      iconUrl: getMarkerIcon(filteredData[0].vehicle),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
    setAnimationMarkerIcon(initialIcon);

    animationActiveRef.current = true;
    setIsAnimating(true);
    setAnimatedCurrentPosition(filteredData[filteredData.length - 1].position);
    setAnimatedPath([filteredData[filteredData.length - 1].position]);

    // Démarre l'animation sur les données filtrées
    // animateMovement(filteredData);
    animateMovement(filteredData.reverse());
  };

  const replayAnimation = () => {
    if (isAnimating) {
      // Arrêt de l'animation
      animationActiveRef.current = false;
      clearTimeout(animationTimeoutRef.current);
      setIsAnimating(false);
      setAnimatedPath([]);
      setAnimatedCurrentPosition(null);
    }

    setTimeout(() => {
      // Filtrage des données pour l'animation en associant chaque position à son véhicule
      const filteredData = filterAnimationData(positions, vehicles);
      if (filteredData.length === 0) return;

      // On initialise l'icône d'animation en fonction du premier véhicule
      const initialIcon = L.icon({
        iconUrl: getMarkerIcon(filteredData[0].vehicle),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      setAnimationMarkerIcon(initialIcon);

      animationActiveRef.current = true;
      setIsAnimating(true);
      setAnimatedCurrentPosition(
        filteredData[filteredData.length - 1].position
      );
      setAnimatedPath([filteredData[filteredData.length - 1].position]);

      // Démarre l'animation sur les données filtrées
      // animateMovement(filteredData);
      animateMovement(filteredData.reverse());
    }, 500); // 1 secondes
  };

  useEffect(() => {
    return () => {
      animationActiveRef.current = false;
      clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  return (
    <div>
      <div className="relative">
        <button
          className="absolute z-[999] top-[5rem] right-[1rem]"
          // onClick={centerOnFirstMarkerAnimation}
          onClick={
            !isAnimating ? centerOnFirstMarker : centerOnFirstMarkerAnimation
          }
        >
          <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
            <MdCenterFocusStrong className="text-orange-500 text-[1.52rem]" />
          </div>
        </button>

        <div
          className={`absolute cursor-pointer flex gap-2 items-center z-[999] top-[5rem] left-[1rem] px-4 py-1 ${
            isAnimating
              ? "text-red-500  bg-red-50"
              : "text-green-500  bg-green-50"
          }  font-bold shadow-lg shadow-black/20  rounded-md`}
        >
          {/*  */}
          {/*  */}
          {/*  */}

          <Tooltip
            title={`${
              isAnimating ? "Arrêtez le visionnage" : "Visionné le trajet animé"
            } 
          `}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
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
          >
            <div onClick={startOrStopAnimation}>
              {isAnimating ? "Arrêter " : "Start"}
            </div>
          </Tooltip>
          {/*  */}
          {/*  */}
          {/*  */}
          <div className="border-l-2 pl-2 cursor-pointer">
            <FaChevronDown
              onClick={() => {
                setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
              }}
            />
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {voirAnimationTrajetPopup && (
          <div
            className={`absolute shadow-lg shadow-black/20 z-[999999999] min-w-[13rem]  flex flex-col gap-4  pb-4 top-[8rem] left-[1rem] px-4 py-2 bg-white rounded-md`}
          >
            <div className="font-semibold flex justify-between items-center border-b pb-2">
              <h3>Visionné le trajet</h3>
              <IoClose
                onClick={() => {
                  setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                }}
                className="text-red-500 text-2xl cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2  ">
              <div className="flex justify-between  w-full">
                <p>Vitesse :</p>
                <p className="font-semibold"> {ajusterLaVitesseText}</p>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <div className="relative ">
                <FaChevronDown
                  onClick={() => {
                    setVoirAjusterLaVitessePopup(true);
                  }}
                  className="cursor-pointer"
                />

                {voirAjusterLaVitessePopup && (
                  <div className="absolute z-[99999] bg-white min-w-[12rem] shadow-lg shadow-black/20 top-0 -right-4 border p-4 rounded-lg flex flex-col gap-0">
                    <div className="font-bold flex justify-between items-center border-b pb-2">
                      <p>Vitesse</p>
                      <IoClose
                        onClick={() => {
                          setVoirAjusterLaVitessePopup(false);
                        }}
                        className="text-red-500 text-2xl cursor-pointer"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setVoirAjusterLaVitessePopup(false);
                      }}
                    >
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(2);
                          setAjusterLaVitesseText("Tres lent");
                        }}
                        className={`${
                          ajusterLaVitesse === 2 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Tres lent
                      </p>
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(1);
                          setAjusterLaVitesseText("Lent");
                        }}
                        className={`${
                          ajusterLaVitesse === 1 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Lent
                      </p>
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(0.5);
                          setAjusterLaVitesseText("Normal");
                        }}
                        className={`${
                          ajusterLaVitesse === 0.5 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Normal
                      </p>
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(0.4);
                          setAjusterLaVitesseText("Rapide");
                        }}
                        className={`${
                          ajusterLaVitesse === 0.4 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Rapide
                      </p>
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(0.3);
                          setAjusterLaVitesseText("Tres rapide");
                        }}
                        className={`${
                          ajusterLaVitesse === 0.3 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Tres rapide
                      </p>
                      <p
                        onClick={() => {
                          setAjusterLaVitesse(0.1);
                          setAjusterLaVitesseText("Supper rapide");
                        }}
                        className={`${
                          ajusterLaVitesse === 0.1 ? "bg-orange-100" : ""
                        } hover:bg-orange-100 p-2 cursor-pointer`}
                      >
                        Supper rapide
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/*  */}
              {/*  */}
              {/*  */}
            </div>
            <div className="flex gap-8 items-center justify-between">
              <p>Centrer automatique :</p>
              <div className="flex gap-2 items-center">
                <p className=" font-semibold rounded-lg">
                  {centrerLaCarteAuto ? "Oui" : "Non"}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="relative ">
                  <FaChevronDown
                    onClick={() => {
                      setVoirCentrerLaCarteAutoPopup(true);
                    }}
                    className="cursor-pointer"
                  />
                  {voirCentrerLaCarteAutoPopup && (
                    <div className="absolute z-[99999] bg-white min-w-[15rem] shadow-lg shadow-black/20 top-0 -right-4 border p-4 rounded-lg flex flex-col gap-0">
                      <div className="font-bold flex justify-between items-center border-b pb-2">
                        <p>Centrer automatique</p>
                        <IoClose
                          onClick={() => {
                            setVoirCentrerLaCarteAutoPopup(false);
                          }}
                          className="text-red-500 text-2xl cursor-pointer"
                        />
                      </div>
                      <div
                        onClick={() => {
                          setVoirCentrerLaCarteAutoPopup(false);
                        }}
                      >
                        <p
                          onClick={() => {
                            setCentrerLaCarteAuto(true);
                          }}
                          className={` ${
                            centrerLaCarteAuto ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          Oui
                        </p>
                        <p
                          onClick={() => {
                            setCentrerLaCarteAuto(false);
                          }}
                          className={` ${
                            !centrerLaCarteAuto ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          Non
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/*  */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            <div className="flex gap-4 items-center justify-between">
              <p>Zoom :</p>
              <div className="flex gap-2 items-center">
                <p className=" font-semibold rounded-lg">
                  {niveauZoomAutoText}%
                </p>

                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}

                <div className="relative ">
                  <FaChevronDown
                    onClick={() => {
                      setVoirNiveauZoomAutoPopup(true);
                    }}
                    className="cursor-pointer"
                  />
                  {voirNiveauZoomAutoPopup && (
                    <div className="absolute bg-white min-w-[15rem] shadow-lg shadow-black/20 -top-[9rem] -right-4 border p-4 rounded-lg flex flex-col gap-0">
                      <div className="font-bold flex justify-between items-center border-b pb-2">
                        <p>Niveau de Zoom</p>
                        <IoClose
                          onClick={() => {
                            setVoirNiveauZoomAutoPopup(false);
                          }}
                          className="text-red-500 text-2xl cursor-pointer"
                        />
                      </div>
                      <div
                        onClick={() => {
                          setVoirNiveauZoomAutoPopup(false);
                        }}
                      >
                        <p
                          onClick={() => {
                            setNiveauZoomAuto(15);
                            setNiveauZoomAutoText(50);
                          }}
                          className={`${
                            niveauZoomAutoText === 50 ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          50%
                        </p>
                        <p
                          onClick={() => {
                            setNiveauZoomAuto(14);
                            setNiveauZoomAutoText(40);
                          }}
                          className={`${
                            niveauZoomAutoText === 40 ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          40%
                        </p>
                        <p
                          onClick={() => {
                            setNiveauZoomAuto(13);
                            setNiveauZoomAutoText(20);
                          }}
                          className={`${
                            niveauZoomAutoText === 20 ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          20%
                        </p>
                        <p
                          onClick={() => {
                            setNiveauZoomAuto(10);
                            setNiveauZoomAutoText(10);
                          }}
                          className={`${
                            niveauZoomAutoText === 10 ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          10%
                        </p>
                        <p
                          onClick={() => {
                            setNiveauZoomAuto(9);
                            setNiveauZoomAutoText(0);
                          }}
                          className={`${
                            niveauZoomAutoText === 0 ? "bg-orange-100" : ""
                          } hover:bg-orange-100 p-2 cursor-pointer`}
                        >
                          0%
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
              </div>
            </div>
            <div
              onClick={() => {
                setVoirAnimationTrajetPopup(false);
                replayAnimation();
              }}
              className="flex justify-center items-center py-1 font-bold bg-orange-500 text-white cursor-pointer  rounded-lg border"
            >
              {isAnimating ? "Restart" : "Start"}
            </div>
            {/* <div
            className={` cursor-pointer flex gap-2 items-center px-4 py-2 ${
              isAnimating ? "bg-red-500" : "bg-green-500"
            } text-white rounded-md`}
          >
            <div onClick={startOrStopAnimation}>
              {isAnimating ? "Arrêter l'animation" : "Démarrer l'animation"}
            </div>
            <div className="border-l-2 pl-2 cursor-pointer">
              <FaChevronDown />
            </div>
          </div> */}
          </div>
        )}

        <div className="border-2 relative overflow-hidden">
          <div className="relative">
            <TypeDeVue
              typeDeVue={typeDeVue}
              setTypeDeVue={setTypeDeVue}
              mapType={mapType}
              handleMapTypeChange={handleMapTypeChange}
            />

            <MapContainer
              center={[
                vehicles[0]?.lastValidLatitude || 0,
                vehicles[0]?.lastValidLongitude || 0,
              ]}
              zoom={15}
              style={{ height: "110vh", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url={tileLayers[mapType].url}
                attribution={tileLayers[mapType].attribution}
              />
              <ScaleControl position="bottomright" />
              <AttributionControl position="bottomleft" />

              {/* Affichage des marqueurs "classiques" si l'animation n'est pas lancée */}
              {!isAnimating &&
                vehicles?.map((véhicule, index) => {
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

                  const firstMarkerIcon = L.icon({
                    iconUrl: "/pin/start.png",
                    iconSize: [50, 60],
                    iconAnchor: [47, 61],
                    popupAnchor: [-22, -51],
                  });

                  const lastMarkerIcon = L.icon({
                    iconUrl: "/pin/end.png",
                    iconSize: [50, 60],
                    iconAnchor: [4, 61],
                    popupAnchor: [25, -51],
                  });

                  let markerIcon;

                  const firstVehicle = vehicles.find((veh) => veh.speedKPH > 0);
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
                      position={[
                        lastValidLatitude || 0,
                        lastValidLongitude || 0,
                      ]}
                      icon={markerIcon}
                    >
                      <Popup>
                        <div>
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
                            className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md"
                          >
                            Voir sur Google Maps
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

              {/* Trace la polyline du trajet */}
              {!isAnimating && (
                <Polyline positions={positions} color="red" weight={2} />
              )}

              {/* Trace la polyline animée */}
              {animatedPath.length > 0 && (
                <Polyline positions={animatedPath} color="green" weight={3} />
              )}

              {/* Marqueur d'animation */}
              {animatedCurrentPosition && (
                <Marker
                  position={animatedCurrentPosition}
                  icon={animationMarkerIcon}
                  ref={animatedMarkerRef}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrajetVehicule;
