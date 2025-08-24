import React, { useContext, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { TiExportOutline } from "react-icons/ti";

import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEdit,
  FaInfoCircle,
  FaListUl,
  FaMicrophone,
  FaTrashAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FaLocationDot } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { IoStatsChartSharp } from "react-icons/io5";
import { MdErrorOutline, MdOutlineStickyNote2 } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { TbLock, TbLockOpen } from "react-icons/tb";

function GestionAppareilOptionPopup({
  setDocumentationPage,
  showOptionAppareilOptionPopup,
  setShowOptionAppareilOptionPopup,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
  setMoveDeviceToOtherCompte,
  isCreatingNewElement,
  setIsCreatingNewElement,
}) {
  const {
    currentSelectedUserToConnect,
    fetchHistoriqueVehicleDetails,
    deleteUSerEnGestionAccount,
    currentAccountSelected,
    password,
    gestionAccountData,
    adminPassword,
    currentSelectedDeviceGestion,
    scrollToTop,
    TimeFrom,
    TimeTo,
    setSelectedVehicleToShowInMap,
    setShowHistoriqueInMap,
    setCurrentVéhicule,
    currentVéhicule,
    deleteVehicleEnGestionAccount,
    adminAccount,
    fetchVehicleDetails,
    updateAppareilsEtGeofencesPourCarte,

    envoyerSMS,
    smsError,
    lancerAppel,
    isDashboardHomePage,
  } = useContext(DataContext);
  const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  const [deleteAppareilPopup, setDeleteAppareilPopup] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [errorIncorrectPassword, setErrorIncorrectPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const deleteVehicleFonction = (e) => {
    e.preventDefault();

    if (inputPassword === adminPassword) {
      deleteVehicleEnGestionAccount(
        currentSelectedDeviceGestion?.deviceID,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,

        "admin",

        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
      setDeleteAppareilPopup(false);
    } else {
      console.log("Mot de passe incorrect");
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const [showVéhiculeControl, setShowVéhiculeControl] = useState(false);

  // Pour confirmer le code d’accès pour le control du véhicule
  const [showAccessCode, setAccessCode] = useState(false);

  // Pour voir la liste des option de contrôle du véhicules
  const [showControlPopup, setShowControlPopup] = useState(false);

  // Pour afficher le popup de Notez Bien // le petit message
  const [showNotezBienPopup, setShowNotezBienPopup] = useState(false);

  // Fonction pour verifier si le mot de passe est correct
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password || inputPassword === adminPassword) {
      setShowControlPopup(true);
      setShowNotezBienPopup(true);
      setShowVéhiculeControl(false);
      setInputPassword("");
      setErrorMessage("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const fetchHistoriqueVehicleDetailsFonction = () => {
    if (isDashboardHomePage) {
      fetchHistoriqueVehicleDetails(
        currentSelectedDeviceGestion?.deviceID,
        TimeFrom,
        TimeTo,
        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedDeviceGestion?.accountID
          )?.password
      );
    } else {
      fetchHistoriqueVehicleDetails(
        currentSelectedDeviceGestion?.deviceID,
        TimeFrom,
        TimeTo
      );
    }
  };

  const fromSelectOnPosition = true;

  return (
    <div>
      {deleteAppareilPopup && (
        <div className="fixed  z-[9999999999999999999999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={deleteVehicleFonction}
            className="bg-white relative pt-14 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              {t("Voulez-vous Supprimer l'Appareil ?")}
            </div>
            <div>
              <span className="w-full text-center font-bold text-lg flex justify-center mb-3 ">
                {currentSelectedDeviceGestion?.description}
              </span>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                {t("Veuillez entrer votre mot de passe")}
              </label>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMessage}
                </p>
              )}
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
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                type="submit"
                className="py-1 px-5 bg-red-500 rounded-lg text-white"
              >
                {t("Confirmer")}
              </button>

              <h3
                onClick={() => {
                  setDeleteAppareilPopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
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

      {/* La liste des fonctionnalités pour le control du véhicules */}
      {showControlPopup && (
        <div className="fixed flex justify-center items-center z-[199999999999999999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[100vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowControlPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 notranslate mt-8 mb-2">
                {currentVéhicule?.description ||
                  currentSelectedDeviceGestion?.description ||
                  "---"}
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
        <div className="fixed flex justify-center items-center z-[109999999999999999999999999999999999999999999999999999999999999999999999] inset-0 bg-black/50-- dark:bg-black/70">
          <div className="relative w-[100vw]  shadow-black/50 border-red-500 border max-w-[35rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
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
          <div className="bg-white max-w-[30rem] p-6 px-4 rounded-xl w-[100vw] dark:bg-gray-700">
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
            className="bg-white dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px4 rounded-xl w-[100vw]"
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

      {showOptionAppareilOptionPopup && (
        <div className="fixed flex justify-center items-center z-[999999999999999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[100vw]  max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowOptionAppareilOptionPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-orange-500 dark:text-orange-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 mt-4 mb-2--">{t("Options de l'appareil")}</h1>
              <h2 className="px-3 notranslate mt-8-- text-orange-600 mb-4">
                {currentVéhicule?.description ||
                  currentSelectedDeviceGestion?.description ||
                  "---"}
              </h2>
            </div>
            <div
              onClick={() => {
                scrollToTop();
              }}
              className="p-4 max-h-[70vh] overflow-auto flex flex-col gap-4 py-6 pb-10"
            >
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <Link
                to="/Localisation_devices"
                onClick={() => {
                  setShowOptionAppareilOptionPopup(false);
                  setDocumentationPage("Localisation_devices");
                  // navigate("/Localisation_devices");
                  setSelectedVehicleToShowInMap(
                    currentSelectedDeviceGestion?.deviceID
                  );

                  fetchVehicleDetails(
                    currentSelectedDeviceGestion,
                    fromSelectOnPosition
                  );
                  updateAppareilsEtGeofencesPourCarte();
                  setCurrentVéhicule(currentSelectedDeviceGestion);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaLocationDot className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Localisation de l'appareil")}
                </h2>
              </Link>
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  fetchHistoriqueVehicleDetailsFonction();

                  setDocumentationPage("Trajet_appareil");
                  navigate("/Trajet_appareil");

                  setShowHistoriqueInMap(true);
                  setShowOptionAppareilOptionPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <GiPathDistance className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Trajet de l'appareil")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => {
                  setShowOptionAppareilOptionPopup(false);
                  setShowHistoriqueInMap(false);
                  setDocumentationPage("Historique_appareil");
                  navigate("/Historique_appareil");

                  fetchHistoriqueVehicleDetailsFonction();
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaListUl className="text-[1.5rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Historique de l'appareil")}
                </h2>
              </div>
              <div
                onClick={() => {
                  fetchHistoriqueVehicleDetailsFonction();

                  setDocumentationPage("Rapport_unite");
                  navigate("/Rapport_unite");

                  setShowOptionAppareilOptionPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <MdOutlineStickyNote2 className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Rapport de l'appareil")}
                </h2>
              </div>
              <div
                onClick={() => {
                  setShowVéhiculeControl(true);
                  setShowOptionAppareilOptionPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <RiShutDownLine className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Contrôle de l'appareil")}
                </h2>
              </div>
              <div
                onClick={() => {
                  setCurrentVéhicule(currentSelectedDeviceGestion);
                  setDocumentationPage("Info_appareil");
                  navigate("/Info_appareil");

                  setShowOptionAppareilOptionPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaInfoCircle className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Informations sur l'appareil")}
                </h2>
              </div>

              {adminAccount && (
                <div
                  onClick={() => {
                    // setDocumentationPage("Modifier_appareil");
                    // navigate("/Modifier_appareil");
                    setChooseOneAccountToContinue(true);
                    setChooseOtherAccountGestion(true);
                    setMoveDeviceToOtherCompte(true);
                    setShowOptionAppareilOptionPopup(false);
                  }}
                  className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
                >
                  <TiExportOutline className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                  <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                    {t("Changer l'appareil de Compte")}
                  </h2>
                </div>
              )}
              {adminAccount && (
                <div
                  onClick={() => {
                    setDocumentationPage("Modifier_appareil");
                    navigate("/Modifier_appareil");
                    setIsCreatingNewElement(false);
                    setShowOptionAppareilOptionPopup(false);
                  }}
                  className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
                >
                  <FaEdit className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                  <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                    {t("Modifier l'appareil")}
                  </h2>
                </div>
              )}
              {adminAccount && (
                <div
                  onClick={() => {
                    setDeleteAppareilPopup(true);
                    setShowOptionAppareilOptionPopup(false);
                  }}
                  className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
                >
                  <FaTrashAlt className="text-[1.7rem] min-w-8 text-orange-500 dark:text-orange-50" />
                  <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                    {t("Supprimer l'appareil")}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAppareilOptionPopup;
