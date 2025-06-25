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
import { useTranslation } from "react-i18next";

function Liste_options({}) {
  const {
    currentVéhicule,
    setShowListOption,
    envoyerSMS,
    smsError,
    setCurrentVéhicule,
    setSelectedVehicleToShowInMap,
    setVéhiculeHistoriqueDetails,
    password,
    currentDataFusionné,
    setShowHistoriqueInMap,
    lancerAppel,
    username,
    setHistoriqueSelectedLocationIndex,
  } = useContext(DataContext); // fetchVehicleDetails importée du contexte
  const [t, i18n] = useTranslation();

  let x;
  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;
  // Pour confirmer le code d’accès pour le control du véhicule
  const [showAccessCode, setAccessCode] = useState(false);

  // Pour voir la liste des option de contrôle du véhicules
  const [showControlPopup, setShowControlPopup] = useState(false);

  // Pour afficher le popup de Notez Bien // le petit message
  const [showNotezBienPopup, setShowNotezBienPopup] = useState(false);

  // Pour confirmer le mot de passe avant d'avoir access au control du véhicule
  const [showVéhiculeControl, setShowVéhiculeControl] = useState(false);

  // Pour stocker le password pour le control du véhicule
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher un message d'erreur si le mot de passe est incorrect
  const [errorMessage, setErrorMessage] = useState("");

  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Pour définir le véhicule actuelle // pour cherche le véhicules pari la liste
  const handleClick = () => {
    setShowListOption(false);
    const deviceID = currentVéhicule.deviceID;

    // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentDataFusionné.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
      setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
      setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection
      setShowListOption(false); // Affiche la liste d'options si nécessaire
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // Fonction pour verifier si le mot de passe est correct
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      setShowControlPopup(true);
      setShowNotezBienPopup(true);
      setShowVéhiculeControl(false);
      setInputPassword("");
      setErrorMessage("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  // const [showControlPopup ,setShowControlPopup ] = useState(false)

  return (
    <div className="bg-black/50 dark:bg-black/80 fixed z-[111111] inset-0 flex justify-center items-center">
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      {/* La liste des fonctionnalités pour le control du véhicules */}
      {showControlPopup && (
        <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[80vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowControlPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 notranslate mt-8 mb-2">
                {currentVéhicule?.description || "---"}
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
                  envoyerSMS(currentVéhicule?.simPhoneNumber, "Stop123456")
                }
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 dark:text-white p-2 rounded-md flex items-center gap-4"
              >
                <TbLock className="text-[1.82rem] text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Bloquer le véhicule")}
                </h2>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() =>
                  envoyerSMS(currentVéhicule?.simPhoneNumber, "Resume123456")
                }
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <TbLockOpen className="text-[2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Débloquer le véhicule")}
                </h2>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => lancerAppel(currentVéhicule?.simPhoneNumber)}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaMicrophone className="text-[2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Écouter")}
                </h2>
              </div>
              {/* callError, setCallError, lancerAppel, */}
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      {/* Message de notez bien  */}
      {showNotezBienPopup && (
        <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[75vw] max-w-[35rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowNotezBienPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 mt-8 mb-2 text-2xl text-center text-red-600 dark:text-gray-50--">
                {t("Attention")} !
              </h1>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6  pb-10--">
              {/* callError, setCallError, lancerAppel, */}
              <p className="text-center dark:text-gray-300 text-red-500">
                {t(
                  "Vous devez disposer soit de crédits, soit de minutes et SMS disponibles sur votre téléphone pour cette fonctionnalité"
                )}
              </p>
            </div>
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setShowNotezBienPopup(false)}
                className="py-1 px-8 rounded-lg text-white bg-red-500 mx-auto"
              >
                {t("Ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* Affichage du popup pour entrer le code d’accès */}
      {showAccessCode && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
          <div className="bg-white max-w-[25rem] p-6 rounded-xl w-[80vw] dark:bg-gray-700">
            <div>
              <label
                htmlFor="username"
                className="block text-lg leading-6 text-gray-500 mb-3 dark:text-gray-300"
              >
                {t("Veuillez entrer votre code d'accès")}
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={`${t("code d'accès")}`}
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
                {t("Annuler")}
              </button>
              <button className="py-1 px-5 bg-orange-500 rounded-lg text-white dark:bg-orange-400 dark:text-gray-900">
                {t("Ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      {/* Affichage du popup pour confirmer le mot de passe */}
      {showVéhiculeControl && (
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
                {t("Veuillez entrer votre mot de passe")}
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={`${t("Mot de passe")}`}
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
                  setShowVéhiculeControl(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                {t("Annuler")}
              </h3>
            </div>
          </form>
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}

      <div className="border min-w-[90vw] sm:min-w-[30rem] bg-white dark:border-gray-50/10 dark:shadow-lg dark:shadow-gray-900 dark:shadow-lg-- dark:bg-gray-800 mx-4 rounded-xl overflow-hidden">
        {/* Options header */}

        <div className="p-4 py-6 pt-10 bg-orange-200/50 dark:bg-gray-900 dark:text-gray-50 dark:shadow-lg  dark:shadow-gray-700/50 relative">
          <h2 className="text-xl notranslate text-center font-semibold">
            {currentVéhicule?.description || "---"}
          </h2>
          <IoMdClose
            onClick={() => {
              setShowListOption(false);
            }}
            className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500"
          />
        </div>

        {/* Liste des options du véhicules */}

        <div className=" text-gray-600   p-4 py-8">
          <div className="grid text-gray-600 grid-cols-2 gap-4  p-4-- py-8--">
            {/* Option de localisation du véhicules */}

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
              title={`${t("Voir la position géographique du véhicule")}`}
            >
              <Link
                onClick={() => {
                  setShowListOption(false);
                  setHistoriqueSelectedLocationIndex(0);
                }}
                to="/Groupe_vehicule_location"
                className=" dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg col-span-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaLocationDot className="text-4xl" />
                <h3>{t("Localisation")}</h3>
              </Link>
            </Tooltip>

            {/* Options du trajet du véhicules */}

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
              title={`${t("Voir le trajet du véhicule sur la carte")}`}
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
                <h3>{t("Trajet")}</h3>
              </Link>
            </Tooltip>

            {/* Option de l'historique du véhicules */}

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
              title={`${t("Voir un historique sur l'état du véhicule")}`}
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
                <h3>{t("Historique")}</h3>
              </Link>
            </Tooltip>

            {/* Option du rapport du véhicules */}

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
              title={`${t(
                "Voir tous les détails sur le déplacement d'un véhicule"
              )}`}
            >
              <Link
                onClick={() => {
                  // setAccessCode(true);
                  setShowListOption(false);
                  handleClick();
                }}
                to="/rapport_page_details"
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <MdOutlineStickyNote2 className="text-3xl" />
                <h3>{t("Rapport")}</h3>
              </Link>
            </Tooltip>

            {/* Option du control du véhicule */}

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
              title={`${t("Bloquer ou débloquer le véhicule")}`}
            >
              <div
                onClick={() => {
                  setShowVéhiculeControl(true);
                }}
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-2---- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <RiShutDownLine className="text-3xl" />
                <h3>{t("Contrôle")}</h3>
              </div>
            </Tooltip>

            {/* Option des informations sur */}

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
              title={`${t("Voir les informations personnelles du véhicule")}`}
            >
              <Link
                onClick={() => {
                  setShowListOption(false);
                }}
                to="/voiture_details"
                className="dark:text-gray-100 dark:shadow-gray-900 dark:shadow-lg  row-start-3--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaInfoCircle className="text-3xl" />
                <h3>{t("Informations")}</h3>
              </Link>
            </Tooltip>

            {/* Option sur la modification du véhicules */}
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
              title={`${t(
                "Modifier des informations ou supprimer le véhicule"
              )}`}
            >
              <Link
                to="/modifier_vehicule"
                onClick={() => {
                  setShowListOption(false);
                }}
                className="dark:text-gray-100 mt-4 dark:shadow-gray-900 dark:shadow-lg  row-start-2--- rounded-md shadow-md hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer p-3 flex flex-col items-center"
              >
                <FaEdit className="text-3xl" />
                <h3>{t("Modifier ou supprimer l'appareil")}</h3>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
    </div>
  );
}

export default Liste_options;
