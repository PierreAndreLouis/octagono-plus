import React, { useContext, useState, useRef, useEffect } from "react";
import TypeDeVue from "./TypeDeVue";
import { MdCenterFocusStrong, MdClose } from "react-icons/md";
import { Polyline } from "react-leaflet";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { FaRegCirclePause } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { LuZoomIn } from "react-icons/lu";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";
import { TbReload } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { RiSpeedUpFill } from "react-icons/ri";

import { FaRegCirclePlay } from "react-icons/fa6";

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
  const { selectUTC, FormatDateHeure, username, currentVéhicule } =
    useContext(DataContext);
  const [ajusterLaVitesse, setAjusterLaVitesse] = useState(0.5);
  const [ajusterLaVitesseText, setAjusterLaVitesseText] = useState("Normal");
  const [centrerLaCarteAuto, setCentrerLaCarteAuto] = useState(true);
  const [voirInfoSurAnimation, setVoirInfoSurAnimation] = useState(false);
  const [niveauZoomAuto, setNiveauZoomAuto] = useState(15);
  const [niveauZoomAutoText, setNiveauZoomAutoText] = useState(50);
  const [voirAnimationTrajetPopup, setVoirAnimationTrajetPopup] =
    useState(false);

  const [vitesseActuelleAnimation, setVitesseActuelleAnimation] = useState(
    vehicles[0]?.speedKPH
  );
  const [timestampActuelleAnimation, setTimestampActuelleAnimation] = useState(
    vehicles[0]?.timestamp
  );
  const [addressActuelleAnimation, setAddressActuelleAnimation] = useState(
    vehicles[0]?.address
  );

  // Après vos autres useState
  // Variable pour pause ou play l'animation
  const [isPaused, setIsPaused] = useState(false);
  const [isReversed, setIsReversed] = useState(false);

  const isPausedRef = useRef(isPaused);
  const isReversedRef = useRef(isReversed);
  const ajusterLaVitesseRef = useRef(ajusterLaVitesse);

  useEffect(() => {
    isPausedRef.current = isPaused;
    isReversedRef.current = isReversed;
    ajusterLaVitesseRef.current = ajusterLaVitesse;
  }, [isPaused, isReversed, ajusterLaVitesse]);

  console.log("vitesseActuelleAnimation :", vitesseActuelleAnimation);

  useEffect(() => {
    console.log(isPaused);
    console.log(ajusterLaVitesse);
    console.log(vitesseActuelleAnimation);
    console.log(timestampActuelleAnimation);
    console.log(addressActuelleAnimation);
  }, [
    ajusterLaVitesse,
    vitesseActuelleAnimation,
    addressActuelleAnimation,
    timestampActuelleAnimation,
    isPaused,
  ]);

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

  const animateMovement = (pathData) => {
    if (pathData.length < 2) return;
    let index = isReversedRef.current ? pathData.length - 1 : 0;
    const frameRate = 60; // images par seconde

    const moveMarker = () => {
      if (!animationActiveRef.current) return;

      // Sélectionnez start et end selon la direction
      let start, end;
      if (isReversedRef.current) {
        if (index <= 0) {
          setIsAnimating(false);
          setVoirInfoSurAnimation(false);

          animationActiveRef.current = false;
          return;
        }
        start = pathData[index];
        end = pathData[index - 1];
      } else {
        if (index >= pathData.length - 1) {
          setIsAnimating(false);
          setVoirInfoSurAnimation(false);

          animationActiveRef.current = false;
          return;
        }
        start = pathData[index];
        end = pathData[index + 1];
      }

      const duration = ajusterLaVitesseRef.current * 1000; // 1 seconde par segment
      const totalFrames = (duration / 1000) * frameRate;
      let frame = 0;

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
          setAnimatedCurrentPosition(end.position);
          setAnimatedPath((prev) => [...prev, end.position]);
          const iconUrl = getMarkerIcon(end.vehicle);
          setVitesseActuelleAnimation(end.vehicle?.speedKPH);
          setTimestampActuelleAnimation(end.vehicle?.timestamp);
          setAddressActuelleAnimation(end.vehicle?.address);
          const updatedIcon = L.icon({
            iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });
          if (animatedMarkerRef.current) {
            animatedMarkerRef.current.setIcon(updatedIcon);
          }
          // Mise à jour de l'index selon la direction
          index = isReversedRef.current ? index - 1 : index + 1;
          moveMarker();
          return;
        }

        if (isPausedRef.current) {
          requestAnimationFrame(animateFrame);
          return;
        }

        const t = frame / totalFrames;
        const newPos = interpolatePosition(start.position, end.position, t);
        setAnimatedCurrentPosition(newPos);
        setAnimatedPath((prev) => [...prev, newPos]);
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
        // frame = isReversedRef.current ? frame - 1 : frame + 1;

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
    if (!isReversedRef.current) {
      setAnimatedCurrentPosition(
        filteredData[filteredData.length - 1].position
      );
      setAnimatedPath([filteredData[filteredData.length - 1].position]);
    }

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
      if (!isReversedRef.current) {
        setAnimatedCurrentPosition(
          filteredData[filteredData.length - 1].position
        );
        setAnimatedPath([filteredData[filteredData.length - 1].position]);
      }

      // Démarre l'animation sur les données filtrées
      // animateMovement(filteredData);
      animateMovement(filteredData.reverse());

      //

      // if (isReversedRef.current) {
      //   animateMovement(filteredData);
      //   setAnimatedCurrentPosition(filteredData[0].position);
      //   setAnimatedPath([filteredData[0].position]);
      // } else {
      //   setAnimatedCurrentPosition(
      //     filteredData[filteredData.length - 1].position
      //   );
      //   setAnimatedPath([filteredData[filteredData.length - 1].position]);
      //   animateMovement(filteredData.reverse());
      // }
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
          className={`${
            voirAnimationTrajetPopup ? " pl-0.5" : ""
          } absolute  bg-white cursor-pointer flex flex-col md:flex-row items-center z-[999999999999999999999999999] top-[4rem] left-[1rem] overflow-hidden---  font-bold shadow-lg shadow-black/20  rounded-lg`}
        >
          <div
            className={`${
              isAnimating
                ? "text-red-500 border border-red-500 bg-red-50"
                : "text-green-500 border border-green-500 bg-green-50"
            } flex gap-4 items-center p-2 rounded-lg `}
          >
            {/*  */}
            {/*  */}
            {/*  */}
            <Tooltip
              title={`${
                isAnimating
                  ? "Arrêtez le visionnage"
                  : "Visionné le trajet animé"
              }`}
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
              <div
                onClick={() => {
                  startOrStopAnimation();
                  setIsPaused(false);
                }}
              >
                {isAnimating ? "Arrêter " : "Start"}
              </div>
            </Tooltip>
            {/*  */}
            {/*  */}
            {/*  */}
            <Tooltip title="Afficher/Masquer le trajet animé">
              <div className="border-l-2 pl-2 cursor-pointer">
                {voirAnimationTrajetPopup ? (
                  <FaChevronLeft
                    className="hidden md:block"
                    onClick={() => {
                      setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                    }}
                  />
                ) : (
                  <FaChevronRight
                    className="hidden md:block"
                    onClick={() => {
                      setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                    }}
                  />
                )}

                {!voirAnimationTrajetPopup ? (
                  <FaChevronDown
                    className="md:hidden"
                    onClick={() => {
                      setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                    }}
                  />
                ) : (
                  <FaChevronUp
                    className="md:hidden"
                    onClick={() => {
                      setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                    }}
                  />
                )}
              </div>
            </Tooltip>
          </div>
          <div className="relative  ">
            <div
              className={`${
                !voirAnimationTrajetPopup
                  ? " max-w-[0rem] max-h-[0rem] md:max-h-[10rem]"
                  : "max-w-[40rem] max-h-[50rem]  p-1"
              } -- transition-all duration-500 flex flex-col gap-3 justify-start md:flex-row overflow-hidden`}
            >
              <Tooltip title={isPaused ? "Play" : "Pause"}>
                <div
                  onClick={() => {
                    setIsPaused(!isPaused);
                  }}
                  className={`${
                    !isPaused ? "bg-gray-50" : "bg-gray-50"
                  } min-w-[3rem] h-[2.3rem] mt-4 md:mt-0 md:ml-4 flex justify-center items-center rounded-lg border `}
                >
                  {isPaused ? (
                    <FaRegCirclePlay className="text-xl text-green-500" />
                  ) : (
                    <FaRegCirclePause className="text-xl text-red-500" />
                  )}
                  {/* <FaRegCirclePause /> */}
                </div>
              </Tooltip>

              <Tooltip
                title={
                  !centrerLaCarteAuto
                    ? "Activer le centrage automatique"
                    : "Désactiver le centrage automatique"
                }
              >
                <div
                  onClick={() => {
                    setCentrerLaCarteAuto(!centrerLaCarteAuto);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`${
                      !centrerLaCarteAuto ? "bg-gray-50" : "bg-gray-50"
                    } min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    {!centrerLaCarteAuto ? (
                      <MdCenterFocusStrong className="text-2xl text-green-500" />
                    ) : (
                      <MdCenterFocusStrong className="text-2xl text-red-500" />
                    )}
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title="Rejouer l'animation">
                <div
                  onClick={() => {
                    replayAnimation();
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`bg-gray-50  min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <TbReload className="text-2xl text-gray-800" />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title="Ajuster la vitesse">
                <div
                  onClick={() => {
                    setVoirAjusterLaVitessePopup(!voirAjusterLaVitessePopup);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`bg-gray-50  min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <IoSpeedometerOutline className="text-2xl text-gray-800" />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title="Ajuster le niveau de zoom">
                <div
                  onClick={() => {
                    setVoirNiveauZoomAutoPopup(!voirNiveauZoomAutoPopup);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`bg-gray-50  min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <LuZoomIn className="text-2xl text-gray-800" />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title="Inverser la direction du trajet">
                <div
                  onClick={() => {
                    setIsReversed(!isReversed);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`${
                      !isReversed ? "bg-gray-50" : "bg-gray-50"
                    } min-w-[4rem] h-[2.3rem]   flex justify-center items-center rounded-lg border `}
                  >
                    {isReversed ? (
                      <div className="flex gap-1 items-center">
                        <FaCar className="text-xl text-gray-600" />
                        <FaArrowRight className="text-lg text-gray-600" />
                      </div>
                    ) : (
                      <div className="flex gap-1 items-center">
                        <FaArrowLeft className="text-lg text-red-600" />
                        <FaCar className="text-xl text-red-600" />
                      </div>
                    )}
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title="Vois des details sur le trajet">
                <div
                  onClick={() => {
                    setVoirInfoSurAnimation(!voirInfoSurAnimation);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`bg-gray-50  min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <IoMdInformationCircleOutline className="text-2xl text-gray-800" />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip
                title={
                  voirAnimationTrajetPopup
                    ? "Masquer l'animation"
                    : "Afficher l'animation"
                }
              >
                <div
                  onClick={() => {
                    setVoirAnimationTrajetPopup(!voirAnimationTrajetPopup);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`bg-gray-50  min-w-[2.5rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <FaChevronLeft className="hidden md:block text-lg text-gray-800" />
                    <FaChevronUp className="md:hidden text-lg text-gray-800" />

                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>
            </div>

            {voirAjusterLaVitessePopup && (
              <div className="absolute font-normal z-[99999] bg-white min-w-[12rem] shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
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

            {voirNiveauZoomAutoPopup && (
              <div className="absolute bg-white min-w-[15rem] shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
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
        </div>

        {voirInfoSurAnimation && (
          <div className="absolute flex flex-col gap-2 z-[999999999999] bottom-[17rem] lg:bottom-[10rem] left-[1rem] min-w-[10rem] max-w-[20rem] min-h-[17rem] p-3 bg-white rounded-lg shadow-lg shadow-black/20 ">
            <div className="flex border-b pb-3 justify-between ">
              <p className="font-bold">{currentVéhicule?.description || ""}</p>
              <MdClose
                onClick={() => {
                  setVoirInfoSurAnimation(false);
                }}
                className="text-2xl text-red-500 cursor-pointer -translate-y-1"
              />
            </div>

            <p className="font-bold">
              Date :{" "}
              <span className="font-normal">
                {timestampActuelleAnimation &&
                  FormatDateHeure(Number(timestampActuelleAnimation)).date}
              </span>
            </p>
            <p className="font-bold">
              Heure :{" "}
              <span className="font-bold ml-3">
                {timestampActuelleAnimation &&
                  FormatDateHeure(Number(timestampActuelleAnimation)).time}
              </span>
            </p>
            <p className="font-bold">
              Vitesse :{" "}
              <span className="font-normal">
                {vitesseActuelleAnimation &&
                !isNaN(Number(vitesseActuelleAnimation))
                  ? Number(vitesseActuelleAnimation).toFixed(0) + " km"
                  : "Non disponible"}
              </span>
            </p>
            <p className="font-bold">
              Adresse :{" "}
              <span className="font-normal">
                {addressActuelleAnimation || ""}
              </span>
            </p>
          </div>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

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
