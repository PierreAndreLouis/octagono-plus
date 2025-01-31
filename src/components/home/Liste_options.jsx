import React, { useContext, useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { RiShutDownLine } from "react-icons/ri";
import { FaMicrophone } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { TbLock } from "react-icons/tb";
import { TbLockOpen } from "react-icons/tb";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import Tooltip from "@mui/material/Tooltip";

function Liste_options({}) {
  const {
    vehicleDetails,
    currentVehicule,

    setShowListOption,

    envoyerSMS,
    smsError,
    setCurrentVehicule,
    donneeFusionneeForRapport,
    setSelectedVehicle,
    setVehiclueHistoriqueDetails,
    password,
    currentdataFusionnee,
    setShowHistoriqueInMap,
    callError,
    setCallError,
    lancerAppel,
    username,
    sethistiriqueSelectedLocationIndex,
  } = useContext(DataContext); // fetchVehicleDetails importée du contexte

  const [showAccessCode, setAccessCode] = useState(false);
  // <h1 className="px-3">Toyota Land Cruser Prada</h1>;
  const [showControlePupup, setshowControlePupup] = useState(false);
  const [showNotezBienPupup, setshowNotezBienPupup] = useState(false);

  const handleClick = () => {
    setShowListOption(false);
    const deviceID = currentVehicule.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel

      setVehiclueHistoriqueDetails(foundVehicle.vehiculeDetails);
      setSelectedVehicle(foundVehicle.deviceID); // Met à jour la sélection
      setShowListOption(false); // Affiche la liste d'options si nécessaire
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  const [showVehiculeControle, setshowVehiculeControle] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      setshowControlePupup(true);
      setshowNotezBienPupup(true);
      setshowVehiculeControle(false);
      setInputPassword("");
      setErrorMessage("");
    } else {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  const rapportFonction = () => {
    // setCurrentVehicule(vehicle);

    const deviceID = currentVehicule?.deviceID;

    // // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee?.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel

      setShowListOption(false);
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////

  const containerRef = useRef(null); // La référence pour le composant à surveiller

  // Fonction pour fermer le tooltip si on clique en dehors du composant
  const handleClickOutside = (event) => {
    // if (containerRef.current && !containerRef.current.contains(event.target)) {
    //   setshowControlePupup(false); // Désactive l'état "isOffline" si on clique en dehors
    // }
  };

  // Ajouter l'event listener quand le composant est monté et le nettoyer à la destruction
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Nettoyer l'event listener au démontage du composant
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  ////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="bg-black/50 dark:bg-black/80 fixed z-[111111] inset-0 flex justify-center items-center">
      {showControlePupup && (
        <div
          ref={containerRef}
          className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50 dark:bg-black/70"
        >
          <div className="relative w-[90vw] sm:w-[80vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setshowControlePupup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 mt-8 mb-2">
                {currentVehicule?.description || "---"}
              </h1>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6 pb-10">
              {smsError && (
                <p className="flex items-start gap-0 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-50 py-2 px-4 rounded-md text-center">
                  <MdErrorOutline className="text-2xl min-w-10 mt-0.5" />
                  {smsError}
                </p>
              )}
              <div
                onClick={() =>
                  envoyerSMS(currentVehicule?.simPhoneNumber, "Stop123456")
                }
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 dark:text-white p-2 rounded-md flex items-center gap-4"
              >
                <TbLock className="text-[1.82rem] text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Bloquer le véhicule
                </h2>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() =>
                  envoyerSMS(currentVehicule?.simPhoneNumber, "Resume123456")
                }
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <TbLockOpen className="text-[2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Débloquer le véhicule
                </h2>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => lancerAppel(currentVehicule?.simPhoneNumber)}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaMicrophone className="text-[2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Écouter
                </h2>
              </div>
              {/* callError, setCallError, lancerAppel, */}
            </div>
          </div>
        </div>
      )}

      {showNotezBienPupup && (
        <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[75vw] max-w-[35rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setshowNotezBienPupup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 mt-8 mb-2 text-2xl text-center text-red-600 dark:text-gray-50--">
                Attention !
              </h1>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6  pb-10--">
              {/* callError, setCallError, lancerAppel, */}
              <p className="text-center dark:text-gray-300 text-red-500">
                Vous devez disposer soit de crédits, soit de minutes et SMS
                disponibles sur votre téléphone pour cette fonctionalité.
              </p>
            </div>
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setshowNotezBienPupup(false)}
                className="py-1 px-8 rounded-lg text-white bg-red-500 mx-auto"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {/*  */}

      <div className="border min-w-[90vw] sm:min-w-[30rem] bg-white dark:border-gray-50/10 dark:shadow-lg dark:shadow-gray-900 dark:shadow-lg-- dark:bg-gray-800 mx-4 rounded-xl overflow-hidden">
        <div className="p-4 py-6 pt-10 bg-orange-200/50 dark:bg-gray-900 dark:text-gray-50 dark:shadow-lg  dark:shadow-gray-700/50 relative">
          <h2 className="text-xl text-center font-semibold">
            {currentVehicule?.description || "---"}
          </h2>
          <IoMdClose
            onClick={() => {
              setShowListOption(false);
            }}
            className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500"
          />
        </div>
        <div className=" text-gray-600   p-4 py-8">
          <div className="grid text-gray-600 grid-cols-2 gap-4  p-4-- py-8--">
            <Tooltip
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
              title="Voir la position géographique du véhicule"
            >
              <Link
                onClick={() => {
                  setShowListOption(false);
                  sethistiriqueSelectedLocationIndex(0);
                }}
                to="/Groupe_vehicule_location"
                className=" dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg col-span-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaLocationDot className="text-4xl" />
                <h3>Localisation</h3>
              </Link>
            </Tooltip>

            {/* {username === "admin" ? (    ) : (     )} */}
            <Tooltip
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
              title="Voir le trajet du véhicule sur la carte"
            >
              <Link
                to="/voiture_historique"
                onClick={() => {
                  handleClick();

                  setShowListOption(false);
                  setShowHistoriqueInMap(true);
                }}
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <GiPathDistance className="text-[2rem]" />
                {/* GiPathDistance */}
                <h3>Trajet</h3>
              </Link>
            </Tooltip>

            <Tooltip
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
              title="Voir un historique sur l'état du véhicule"
            >
              <Link
                onClick={() => {
                  {
                    handleClick();
                    setShowHistoriqueInMap(false);
                  }
                }}
                to="/voiture_historique"
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-3---- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <IoStatsChartSharp className="text-3xl" />
                <h3>Historique</h3>
              </Link>
            </Tooltip>

            <Tooltip
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
              title="Voir tous les détails sur le déplacement d'un véhicule"
            >
              <Link
                onClick={() => {
                  // setAccessCode(true);
                  setShowListOption(false);
                  rapportFonction();
                }}
                to="/rapport_page_details"
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <MdOutlineStickyNote2 className="text-3xl" />
                <h3>Rapport</h3>
              </Link>
            </Tooltip>

            <Tooltip
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
              title="Bloquer ou débloquer le véhicule"
            >
              <div
                onClick={() => {
                  setshowVehiculeControle(true);
                }}
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-2---- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <RiShutDownLine className="text-3xl" />
                <h3>Contrôle</h3>
              </div>
            </Tooltip>
            <Tooltip
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
              title="Voir les informations personnelles du véhicule"
            >
              <Link
                onClick={() => {
                  setShowListOption(false);
                }}
                to="/voiture_details"
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-3--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaInfoCircle className="text-3xl" />
                <h3>Informations</h3>
              </Link>
            </Tooltip>
          </div>
          {username === "admin" && (
            <Tooltip
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
                      state.styles.popper.zIndex = 99999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
              title="Modifier des informations ou supprimer le véhicule"
            >
              <Link
                to="/modifier_vehicule"
                onClick={() => {
                  setShowListOption(false);
                }}
                className="dark:text-gray-100 mt-4 dark:shadow-gray-900 dark:shadow-lg  row-start-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaEdit className="text-3xl" />
                <h3>Modifier ou supprimer le vehicule</h3>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}

      {showAccessCode && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
          <div className="bg-white max-w-[25rem] p-6 rounded-xl w-[80vw] dark:bg-gray-700">
            <div>
              <label
                htmlFor="username"
                className="block text-lg leading-6 text-gray-500 mb-3 dark:text-gray-300"
              >
                Veuillez entrer votre code d'accès
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="code d'accès"
                  required
                  className="dark:bg-gray-800 block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 dark:text-gray-100 dark:ring-gray-600 dark:placeholder:text-gray-200 dark:focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => {
                  setAccessCode(false);
                }}
                className="py-1 px-5 text-orange-500 rounded-lg font-semibold border border-orange-500 dark:text-orange-400 dark:border-orange-400"
              >
                Annuler
              </button>
              <button className="py-1 px-5 bg-orange-500 rounded-lg text-white dark:bg-orange-400 dark:text-gray-900">
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {showVehiculeControle && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                // onClick={handlePasswordCheck}
                className="py-1 px-5 bg-orange-500 rounded-lg text-white"
              >
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setErrorMessage("");
                  setInputPassword("");
                  setshowVehiculeControle(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Liste_options;
