import React, { useContext, useState, useRef, useEffect } from "react";
import TypeDeVue from "../../components/historique_vehicule/TypeDeVue";
import { MdCenterFocusStrong, MdClose } from "react-icons/md";
import { Polyline, useMap } from "react-leaflet";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { FaRegCirclePause } from "react-icons/fa6";

import { IoSpeedometerOutline } from "react-icons/io5";
import { LuZoomIn } from "react-icons/lu";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";
import { TbReload } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoEarth } from "react-icons/io5";

import { FaRegCirclePlay } from "react-icons/fa6";

import { IoClose } from "react-icons/io5";
import Tooltip2 from "@mui/material/Tooltip";

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
import { Polygon } from "react-leaflet";
import { useTranslation } from "react-i18next";

import Tooltip from "@mui/material/Tooltip";

// Exemple de fonction de sélection d'icône pour un véhicule donné
// (déjà utilisée dans d'autres parties du composant)
const getMarkerIcon = (véhicule) => {
  const speed = parseFloat(véhicule?.speedKPH);
  const direction = Math.round(véhicule?.heading / 45.0) % 8;

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
  openGoogleMaps,
  composantLocationPage,
  handleVehicleClick,
  currentDeviceToAutoUpdate,
}) {
  const {
    FormatDateHeure,
    username,
    currentVéhicule,
    véhiculeHistoriqueDetails,
    geofenceData,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  const geofences = geofenceData;

  const [ajusterLaVitesse, setAjusterLaVitesse] = useState(1);
  const [ajusterLaVitesseText, setAjusterLaVitesseText] = useState("Lent");
  const [centrerLaCarteAuto, setCentrerLaCarteAuto] = useState(true);
  const [centrerLaCarteAutoPopup, setCentrerLaCarteAutoPopup] = useState(false);
  const [voirInfoSurAnimation, setVoirInfoSurAnimation] = useState(false);
  const [voirGeofence, setVoirGeofence] = useState(true);
  const [voirGeofencePopup, setVoirGeofencePopup] = useState(false);
  const [niveauZoomAuto, setNiveauZoomAuto] = useState(16);
  const [niveauZoomAutoText, setNiveauZoomAutoText] = useState(60);
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

  const [visitedPositions, setVisitedPositions] = useState([]); // Track visited positions

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

  const [voirNiveauZoomAutoPopup, setVoirNiveauZoomAutoPopup] = useState(false);

  const [animatedPath, setAnimatedPath] = useState([]);
  const [animatedCurrentPosition, setAnimatedCurrentPosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // console.log(animatedCurrentPosition);
  //   // Fonction pour centrer la carte sur le premier marqueur
  const centerOnFirstMarkerAnimation = () => {
    // console.log("111111111111");
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

      let start, end;
      if (isReversedRef.current) {
        if (index <= 0) {
          setIsAnimating(false);
          setVisitedPositions([]);
          setVoirInfoSurAnimation(false);
          animationActiveRef.current = false;
          return;
        }
        start = pathData[index];
        end = pathData[index - 1];
      } else {
        if (index >= pathData.length - 1) {
          setIsAnimating(false);
          setVisitedPositions([]);

          setVoirInfoSurAnimation(false);
          animationActiveRef.current = false;
          return;
        }
        start = pathData[index];
        end = pathData[index + 1];
      }

      const duration = ajusterLaVitesseRef.current * 1000; // 1 second per segment
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

          // Store the position along with vehicle data (including speedKPH and heading) for marker customization
          setVisitedPositions((prev) => [
            ...prev,
            {
              position: end.position,
              vehicle: end.vehicle, // Store the full vehicle data
            },
          ]);

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
      setVoirInfoSurAnimation(true);
      setVisitedPositions([]);

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
    setVoirInfoSurAnimation(true);
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
      setVisitedPositions([]);

      setAnimatedPath([]);
      setAnimatedCurrentPosition(null);
    }

    setTimeout(() => {
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
      setVoirInfoSurAnimation(true);
      if (!isReversedRef.current) {
        setAnimatedCurrentPosition(
          filteredData[filteredData.length - 1].position
        );
        setAnimatedPath([filteredData[filteredData.length - 1].position]);
      }

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

  // const countLimit = 30;
  // const [count, setCount] = useState(countLimit);

  // const [IsUpdateAuto, setIsUpdateAuto] = useState(false);
  // const fromUpdateAuto = true;

  // useEffect(() => {
  //   if (!currentDeviceToAutoUpdate) return;
  //   if (!IsUpdateAuto) return;
  //   if (count === 0) {
  //     console.log("Countdown à 0");

  //     console.log(currentDeviceToAutoUpdate);
  //     handleVehicleClick(currentDeviceToAutoUpdate, fromUpdateAuto);
  //   }
  //   // console.log(count);

  //   const timer = setTimeout(() => {
  //     setCount(count === 0 ? countLimit : count - 1);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [count, IsUpdateAuto, currentVéhicule]);

  const countLimit = 30;
  const [count, setCount] = useState(countLimit);
  const [IsUpdateAuto, setIsUpdateAuto] = useState(false);
  const hasTriggeredRef = useRef(false); // pour éviter de relancer handleVehicleClick plusieurs fois

  useEffect(() => {
    if (!currentVéhicule || !IsUpdateAuto) return;

    if (count === 0 && !hasTriggeredRef.current) {
      console.log("Countdown à 0");
      console.log(currentVéhicule);
      handleVehicleClick(currentVéhicule, true);
      hasTriggeredRef.current = true; // on marque que l'action a été déclenchée
    }

    const timer = setTimeout(() => {
      setCount((prev) => (prev === 0 ? countLimit : prev - 1));
      if (count === 0) hasTriggeredRef.current = false; // reset pour le prochain cycle
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, IsUpdateAuto, currentVéhicule]);

  useEffect(() => {
    if (!IsUpdateAuto) {
      setCount(countLimit);
    }
  }, [IsUpdateAuto]);

  return (
    <div>
      <div className="relative">
        {/* Pour recentrer l'appareil */}
        <Tooltip2
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
          title={`${t("Recentrer sur le trajet")}`}
        >
          <button
            className="absolute z-[999] top-[11rem] right-[1rem]"
            onClick={() => {
              if (mapRef.current && vehicles.length > 0) {
                const { lastValidLatitude, lastValidLongitude } = vehicles[0];
                mapRef.current.setView(
                  [lastValidLatitude, lastValidLongitude],
                  // 13
                  13
                );
              }
            }}
          >
            <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
              <MdCenterFocusStrong className="text-orange-500 text-[1.52rem]" />
            </div>
          </button>
        </Tooltip2>

        {/* Pour la mise a jour auto */}
        {véhiculeHistoriqueDetails.length > 0 && (
          <Tooltip2
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
              className="absolute z-[999] top-[7rem] right-[1rem]"
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
          </Tooltip2>
        )}
        <div
          className={`${
            voirAnimationTrajetPopup ? " pl-0.5" : ""
          } absolute md:bg-white cursor-pointer flex flex-col md:flex-row md:items-center  justify-start items-start z-[999999999999999999999999999] ${
            composantLocationPage === "historique" ? "top-[7rem]" : "top-[2rem]"
          }   left-[.5rem] overflow-hidden---  font-bold md:shadow-lg shadow-black/20  rounded-lg`}
        >
          <div
            className={`${
              isAnimating
                ? "text-red-700 border border-red-500 bg-red-50"
                : "text-green-700 border border-green-500 bg-green-50"
            } flex gap-4 items-center p-2 rounded-lg `}
          >
            {/*  */}
            {/*  */}
            {/*  */}
            <Tooltip
              title={`${
                isAnimating
                  ? `${t("Arrêtez l'animation")}`
                  : `${t("Retracer le trajet")}`
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
                {isAnimating ? `${t("Arrêter")}` : `${t("Retracer le trajet")}`}
              </div>
            </Tooltip>
            {/*  */}
            {/*  */}
            {/*  */}
            <Tooltip
              title={`${
                voirAnimationTrajetPopup
                  ? `${t("Masquer les options")}`
                  : `${t("Afficher les options")}`
              }  `}
            >
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
          <div className="relative bg-white mt-1 rounded-lg md:rounded-none   md:mt-0  w-full-- ">
            <div
              className={`${
                !voirAnimationTrajetPopup
                  ? " max-w-[0rem] max-h-[0rem] md:max-h-[10rem]"
                  : "max-w-[40rem] max-h-[50rem] p-2 md:p-1"
              } -- transition-all duration-500 flex flex-col rounded-lg md:rounded-none gap-3 justify-start md:flex-row overflow-hidden`}
            >
              <Tooltip
                title={
                  !isAnimating || isPaused ? `${t("Play")}` : `${t("Pause")}`
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => {
                      if (!isAnimating) {
                        startOrStopAnimation();
                      } else if (isAnimating) {
                        setIsPaused(!isPaused);
                      } else if (!isAnimating && isPaused) {
                        setIsPaused(!isPaused);
                      }
                    }}
                    className={`${
                      !isPaused ? "bg-gray-50" : "bg-gray-50"
                    } min-w-[3rem] h-[2.3rem] mt-1 md:mt-0 md:ml-4 flex justify-center items-center rounded-lg border `}
                  >
                    {!isAnimating || isPaused ? (
                      <FaRegCirclePlay className="text-xl text-green-500" />
                    ) : (
                      <FaRegCirclePause className="text-xl text-red-500" />
                    )}
                    {/* <FaRegCirclePause /> */}
                  </div>
                  {/* <p>{isPaused ? "Play" : "Pause"}</p> */}
                </div>
              </Tooltip>

              <Tooltip
                title={
                  !centrerLaCarteAuto
                    ? `${t("Activer le centrage automatique de la carte")}`
                    : `${t("Désactiver le centrage automatique de la carte")}`
                }
              >
                <div
                  onClick={() => {
                    // setCentrerLaCarteAuto(!centrerLaCarteAuto);
                    setCentrerLaCarteAutoPopup(true);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`${
                      !centrerLaCarteAuto ? "bg-gray-50" : "bg-gray-50"
                    } min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    {centrerLaCarteAuto ? (
                      <MdCenterFocusStrong className="text-2xl text-green-500" />
                    ) : (
                      <MdCenterFocusStrong className="text-2xl text-red-500" />
                    )}
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title={`${t("Recommencer le trajet")}`}>
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

              <Tooltip title={`${t("Ajuster la vitesse du trajet")}`}>
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

              <Tooltip title={`${t("Ajuster le niveau de zoom")}`}>
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

              <Tooltip title={`${t("Voir des details sur le trajet")}`}>
                <div
                  onClick={() => {
                    setVoirInfoSurAnimation(!voirInfoSurAnimation);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`${
                      voirInfoSurAnimation ? "bg-green-50" : "bg-red-50"
                    }   min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <IoMdInformationCircleOutline
                      className={`${
                        voirInfoSurAnimation ? "text-green-700" : "text-red-700"
                      } text-2xl `}
                    />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip title={`${t("Voir les séparations de la carte")}`}>
                <div
                  onClick={() => {
                    setVoirGeofencePopup(!voirGeofencePopup);
                  }}
                  className="max-w-[0rem]-- max-w-[100rem]   transition-all overflow-hidden"
                >
                  <div
                    className={`${
                      voirGeofence ? "bg-green-50" : "bg-red-50"
                    }   min-w-[3rem] h-[2.3rem]  flex justify-center items-center rounded-lg border `}
                  >
                    <IoEarth
                      className={`${
                        voirGeofence ? "text-green-700" : "text-red-700"
                      } text-2xl `}
                    />
                    {/* <FaRegCirclePause /> */}
                  </div>
                </div>
              </Tooltip>

              <Tooltip
                title={
                  voirAnimationTrajetPopup
                    ? `${t("Masquer les options")}`
                    : `${t("Afficher les options")}`
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
              <div className="absolute font-normal z-[99999] bg-white min-w-[20rem] shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
                <div className="font-bold flex justify-between items-center border-b pb-2">
                  <p>{t("Vitesse de l'animation")}</p>
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
                    {t("Tres lent")}
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
                    {t("Lent")}
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
                    {t("Normal")}
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
                    {t("Rapide")}
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
                    {t("Tres rapide")}
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
                    {t("Super rapide")}
                  </p>
                </div>
              </div>
            )}

            {voirNiveauZoomAutoPopup && (
              <div className="absolute bg-white min-w-[20rem] shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
                <div className="font-bold flex justify-between items-center border-b pb-2">
                  <p>{t("Niveau de Zoom lors de l'animation")}</p>
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
                      setNiveauZoomAuto(16.5);
                      setNiveauZoomAutoText(70);
                    }}
                    className={`${
                      niveauZoomAutoText === 70 ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    70%
                  </p>
                  <p
                    onClick={() => {
                      setNiveauZoomAuto(16);
                      setNiveauZoomAutoText(60);
                    }}
                    className={`${
                      niveauZoomAutoText === 60 ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    60%
                  </p>
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

            {centrerLaCarteAutoPopup && (
              <div className="absolute bg-white min-w-[20rem] max-w-[70vw] w-full shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
                <div className="font-bold flex justify-between items-start border-b pb-2">
                  <p>{t("Centrer automatique la carte lors de l'animation")}</p>
                  <IoClose
                    onClick={() => {
                      setCentrerLaCarteAutoPopup(false);
                    }}
                    className="text-red-500 min-w-[2rem] text-2xl cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => {
                    // setVoirNiveauZoomAutoPopup(false);
                    setCentrerLaCarteAutoPopup(false);
                  }}
                  className="font-semibold"
                >
                  <p
                    onClick={() => {
                      // setNiveauZoomAuto(16.5);
                      // setNiveauZoomAutoText(70);
                      setCentrerLaCarteAuto(true);
                    }}
                    className={`${
                      centrerLaCarteAuto ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    {t("Activer")}
                  </p>
                  <p
                    onClick={() => {
                      // setNiveauZoomAuto(16);
                      // setNiveauZoomAutoText(60);
                      setCentrerLaCarteAuto(false);
                    }}
                    className={`${
                      !centrerLaCarteAuto ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    {t("Désactiver")}
                  </p>
                </div>
              </div>
            )}

            {voirGeofencePopup && (
              <div className="absolute bg-white min-w-[20rem] max-w-[70vw] w-full shadow-lg shadow-black/20 top-0 md:top-[3rem] left-0 md:right-0 border p-4 rounded-lg flex flex-col gap-0">
                <div className="font-bold flex justify-between items-start border-b pb-2">
                  <p>
                    {t(
                      "Voir les séparations et le nom des différentes parties de la carte"
                    )}
                  </p>
                  <IoClose
                    onClick={() => {
                      setVoirGeofencePopup(false);
                    }}
                    className="text-red-500 min-w-[2rem] text-2xl cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => {
                    // setVoirNiveauZoomAutoPopup(false);
                    setVoirGeofencePopup(false);
                  }}
                  className="font-semibold"
                >
                  <p
                    onClick={() => {
                      // setNiveauZoomAuto(16.5);
                      // setNiveauZoomAutoText(70);
                      setVoirGeofence(true);
                    }}
                    className={`${
                      voirGeofence ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    {t("Activer")}
                  </p>
                  <p
                    onClick={() => {
                      // setNiveauZoomAuto(16);
                      // setNiveauZoomAutoText(60);
                      setVoirGeofence(false);
                    }}
                    className={`${
                      !voirGeofence ? "bg-orange-100" : ""
                    } hover:bg-orange-100 p-2 cursor-pointer`}
                  >
                    {t("Désactiver")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ${
              composantLocationPage === "historique"
                ? "right-[1rem] top-[9.9rem]"
                : "top-[2rem] right-[4rem]"
            }   */}

        {voirInfoSurAnimation && (
          <div
            className={`fixed flex flex-col gap-2 z-[999999999999]  md:top-auto md: bottom-[4rem] lg:bottom-[1rem] md: right-[1rem] min-w-[10rem] max-w-[20rem] min-h-[17rem]-- p-3 bg-white rounded-lg shadow-lg shadow-black/20 `}
          >
            <div className="flex border-b md:pb-3 justify-end md:justify-between ">
              <p className="font-bold notranslate hidden md:block">
                {currentVéhicule?.description || ""}
              </p>
              <MdClose
                onClick={() => {
                  setVoirInfoSurAnimation(false);
                }}
                className="text-2xl text-red-500 cursor-pointer -translate-y-1"
              />
            </div>

            <p className="font-bold">
              {t("Date")} :{" "}
              <span className="font-normal">
                {timestampActuelleAnimation &&
                  FormatDateHeure(Number(timestampActuelleAnimation)).date}
              </span>
            </p>
            <p className="font-bold">
              {t("Heure")} :{" "}
              <span className="font-bold ml-3">
                {timestampActuelleAnimation &&
                  FormatDateHeure(Number(timestampActuelleAnimation)).time}
              </span>
            </p>
            <p className="font-bold">
              {t("Vitesse")} :{" "}
              <span className="font-normal">
                {vitesseActuelleAnimation &&
                !isNaN(Number(vitesseActuelleAnimation))
                  ? Number(vitesseActuelleAnimation).toFixed(0) + " km"
                  : "Non disponible"}
              </span>
            </p>
            <p className="font-bold  ">
              {t("Adresse")} :{" "}
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

              <ZoomTextUpdater />

              {/* Affichage des géofences */}
              {voirGeofence &&
                geofences
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
                    const latitudes = validCoordinates?.map(
                      (point) => point.lat
                    );
                    const longitudes = validCoordinates?.map(
                      (point) => point.lng
                    );

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
                            color: geofence.color || "", // Couleur de la bordure
                            fillColor: geofence.color || "#000000", // Couleur du fond
                            fillOpacity: 0.1, // Opacité du fond
                            weight: 1, // Épaisseur des lignes
                          }}
                        />

                        <Marker
                          position={center}
                          icon={L.divIcon({
                            className: "geofence-label",
                            html: `<div 
                        class="bg-gray-100 notranslate px-2 shadow-lg shadow-black/20 rounded-md  flex justify-center items-center  -translate-x-[50%] text-black font-bold text-center whitespace-nowrap- overflow-hidden-" 
                        
                        style="font-size: ${textSize}; width: ${widthSize}; color:  #706f6f; {geofence.color}; textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'">
                        ${geofence?.description}
                        </div>`,
                          })}
                        />
                      </React.Fragment>
                    );
                  })}

              {/* Affichage des marqueurs "classiques" si l'animation n'est pas lancée */}
              {/* {!isAnimating &&
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
                })} */}

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

                  const additionalMarkerIcon = L.icon({
                    iconUrl: getMarkerIcon(véhicule),
                    iconSize: [17, 25],
                    iconAnchor: [9, 25],
                    popupAnchor: [-1, -20],
                    shadowUrl:
                      "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
                    shadowSize: [5, 5],
                  });

                  let markerIcon;

                  const firstVehicle = vehicles.find((veh) => veh.speedKPH > 0);
                  const lastVehicle = vehicles
                    .filter((veh) => veh.speedKPH > 0)
                    .pop();

                  const firstStoppedVehicle = vehicles
                    .slice(0, vehicles.indexOf(firstVehicle))
                    .reverse()
                    .find((veh) => veh.speedKPH <= 0);

                  const lastStoppedVehicle = vehicles
                    .slice(vehicles.indexOf(lastVehicle) + 1)
                    .find((veh) => veh.speedKPH <= 0);

                  if (!lastStoppedVehicle && index === vehicles.length - 1) {
                    markerIcon = firstMarkerIcon;
                  } else if (!firstStoppedVehicle && index === 0) {
                    markerIcon = lastMarkerIcon;
                  } else if (véhicule === firstStoppedVehicle) {
                    markerIcon = lastMarkerIcon;
                  } else if (véhicule === lastStoppedVehicle) {
                    markerIcon = firstMarkerIcon;
                  } else {
                    markerIcon = additionalMarkerIcon;
                  }

                  // if (index === vehicles.length - 1) {
                  //   markerIcon = firstMarkerIcon;
                  // } else if (index === 0) {
                  //   markerIcon = lastMarkerIcon;
                  // } else {
                  //   markerIcon = additionalMarkerIcon;
                  // }

                  const FormatDateHeureTimestamp = FormatDateHeure(timestamp);

                  return (
                    <>
                      <Marker
                        key={`main-${index}`}
                        position={[
                          lastValidLatitude || 0,
                          lastValidLongitude || 0,
                        ]}
                        icon={markerIcon}
                      >
                        <Popup>
                          <div className=" flex flex-col gap-1 py-4  max-w-[12rem] md:max-w-[20rem] scale-110">
                            <p
                              style={{ margin: 0 }}
                              className="font-bold text-[1rem] m-0"
                            >
                              <span>{t("Description")} :</span>{" "}
                              {description || "----"}
                            </p>
                            <p style={{ margin: 0 }} className="m-0">
                              <strong>{t("Adresse")} :</strong>{" "}
                              {address || "----"}
                            </p>
                            {username === "admin" && (
                              <p style={{ margin: 0 }}>
                                <strong>{t("IMEI")} :</strong>{" "}
                                {imeiNumber || "----"}
                              </p>
                            )}
                            <p style={{ margin: 0 }}>
                              <strong>{t("Vitesse")} :</strong>{" "}
                              {speedKPH && !isNaN(Number(speedKPH))
                                ? Number(speedKPH).toFixed(0)
                                : "0"}{" "}
                              Km/h
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>{t("Date")} :</strong>{" "}
                              {timestamp
                                ? FormatDateHeureTimestamp?.date
                                : `${t("Pas de date disponible")}`}
                              <span className="px-3">/</span>
                              {FormatDateHeureTimestamp?.time}
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>{t("Statut")} : </strong>
                              {speedKPH < 1 && `${t("En stationnement")}`}
                              {speedKPH > 20 && `${t("En mouvement rapide")}`}
                              {speedKPH >= 1 &&
                                speedKPH <= 20 &&
                                `${t("En mouvement lent")}`}
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>{t("Plaque d’immatriculation")} :</strong>{" "}
                              {licensePlate || "----"}
                            </p>
                            <p style={{ margin: 0 }}>
                              <strong>{t("Numéro SIM")} :</strong>{" "}
                              {simPhoneNumber || "----"}
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
                              {t("Voir sur Google Maps")}
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                      {(markerIcon === firstMarkerIcon ||
                        markerIcon === lastMarkerIcon) && (
                        <Marker
                          key={`additional-${index}`}
                          position={[
                            lastValidLatitude || 0,
                            lastValidLongitude || 0,
                          ]}
                          icon={additionalMarkerIcon}
                        />
                      )}
                    </>
                  );
                })}

              {/* Trace la polyline du trajet */}
              {!isAnimating && (
                <Polyline positions={positions} color="red" weight={2} />
              )}

              {/* Trace la polyline animée */}
              {isAnimating && animatedPath.length > 0 && (
                <Polyline positions={animatedPath} color="green" weight={3} />
              )}

              {isAnimating &&
                visitedPositions.map((pos, index) => {
                  // Use the vehicle data from the stored position to determine the marker icon
                  const markerIcon = L.icon({
                    iconUrl: getMarkerIcon(pos.vehicle), // Use the getMarkerIcon function
                    iconSize: [20, 20],
                    iconAnchor: [10, 22],
                    popupAnchor: [-1, -20],
                  });

                  return (
                    <Marker
                      key={index}
                      position={pos.position}
                      icon={markerIcon}
                    >
                      {(isPaused || !centrerLaCarteAuto) && (
                        <Popup>
                          <div>
                            <p>
                              <strong>{t("Vitesse")} :</strong>{" "}
                              {pos.vehicle?.speedKPH &&
                              !isNaN(Number(pos.vehicle?.speedKPH))
                                ? Number(pos.vehicle?.speedKPH).toFixed(0)
                                : "Non disponible"}{" "}
                              Km/h
                            </p>

                            <p>
                              <strong>{t("Date")} :</strong>{" "}
                              {pos.vehicle?.timestamp
                                ? FormatDateHeure(pos.vehicle?.timestamp).date
                                : `${t("Pas de date disponible")}`}
                              <span className="px-3">/</span>
                              <span className="font-bold">
                                {FormatDateHeure(pos.vehicle?.timestamp).time}
                              </span>
                            </p>

                            <p>
                              <strong>{t("Adresse")} :</strong>{" "}
                              <span className="notranslate">
                                {pos.vehicle?.address || "Non disponible"}
                              </span>
                            </p>

                            <p>
                              <strong>{t("Statut")} : </strong>
                              {pos.vehicle?.speedKPH < 1 &&
                                `${t("En stationnement")}`}
                              {pos.vehicle?.speedKPH > 20 &&
                                `${t("En mouvement rapide")}}`}
                              {pos.vehicle?.speedKPH >= 1 &&
                                pos.vehicle?.speedKPH <= 20 &&
                                `${t("En mouvement lent")}`}
                            </p>
                          </div>
                        </Popup>
                      )}
                    </Marker>
                  );
                })}

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
