import React, { useContext, useEffect, useState } from "react";
import { IoClose, IoEarth, IoOptions, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Tooltip } from "@mui/material";
import { BsSortDown } from "react-icons/bs";

import {
  FaCar,
  FaUserPlus,
  FaChevronDown,
  FaChevronRight,
  FaSortAmountDownAlt,
  FaInfo,
  FaInfoCircle,
  FaFlagCheckered,
} from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { MdLocationPin, MdOutlineInfo, MdUpdate } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GestionAppareilOptionPopup from "../components/gestion_des_comptes/GestionAppareilOptionPopup";
import { useFetcher, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { FaLocationPin } from "react-icons/fa6";
import LocationPage from "./LocationPage";
import Logout from "../components/login/Logout";

function ListeDesVehiculesGestion({
  setDocumentationPage,

  fromDashboard = false,

  setStatisticFilteredDeviceListeText,
  showChooseAppareilToModifyMessage,
  setShowChooseAppareilToModifyMessage,

  /////////////////////

  showChooseItemToModifyPage,
  setExpandSection,
}) {
  const {
    FormatDateHeure,
    currentAccountSelected,
    listeGestionDesVehicules,
    currentSelectedUserToConnect,
    deleteVehicleEnGestionAccount,
    currentSelectedDeviceGestion,
    setCurrentSelectedDeviceGestion,
    deviceListeTitleGestion,
    listeGestionDesUsers,
    listeGestionDesGroupe,
    scrollToTop,
    comptes,
    fetchAccountDevices,
    fetchUserDevices,
    fetchAccountUsers,
    fetchAccountGroupes,
    fetchGroupeDevices,
    setDashboardLoadingEffect,
    dashboardLoadingEffect,
    autoUpdateFonction,
    gestionAccountData,
    adminPassword,
    statusDescriptions,
    isDashboardHomePage,
    mergedDataHome,
    véhiculeDetails,

    DeviceDéplacer,
    EnDéplacement,
    DeviceNonDeplacer,
    DeviceInactifs,
    DeviceListeActif,
    allDevices,
    setAllDevices,
    filteredColorCategorieListe,
    setFilteredColorCategorieListe,
    addVehiculeDetailsFonction,
    documentationPage,
    accountDevices,
    chooseAccountID,
    setChooseAccountID,
    modifyVehicleEnGestionAccount,
    createVehicleEnGestionAccount,
    vehicleDetails,
    setSelectedVehicleToShowInMap,
    DeviceEnStationnement,
    DeviceInactifsWidthDetails,
    DeviceInactifsWidthNoDetails,
    isFilteredCartePositionByCategorie,
    setIsFilteredCartePositionByCategorie,
    progressBarForLoadingData,
    fetchVehicleDataFromRapportGroupe,
    showAnnimationProgresseBarDashboard,
    updateItUserDataFonction,
    isItUser,
    setChooseOneAccountToContinue,
    setChooseOtherAccountGestion,
    chooseOtherAccountGestion,
    isCreatingNewElement,
    setIsCreatingNewElement,
    moveDeviceToOtherCompte,
    setMoveDeviceToOtherCompte,
    showChooseItemToModifyMessage,
    setshowChooseItemToModifyMessage,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  //
  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const currentTimeSec = getCurrentTimestamp();

  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes

  const currentTime = Date.now(); // Heure actuelle en millisecondes

  // Fonction pour obtenir le timestamp actuel en millisecondes
  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel

  //
  //
  //
  //

  const [inputPassword, setInputPassword] = useState("");

  const [showUserGroupeCategorieSection, setShowUserGroupeCategorieSection] =
    useState(true);

  const [showMoreDeviceInfo, setShowMoreDeviceInfo] = useState();
  const [searchTermInput, setSearchTermInput] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const currentListe = useMemo(() => {
    if (isDashboardHomePage) {
      return addVehiculeDetailsFonction(
        listeGestionDesVehicules,
        véhiculeDetails
      );
    } else {
      return dataFusionné;
    }
  }, [
    isDashboardHomePage,
    listeGestionDesVehicules,
    dataFusionné,
    véhiculeDetails,
  ]);

  const displayListeDevice1 = filteredColorCategorieListe
    ? filteredColorCategorieListe
    : currentListe;

  const [filterDeviceForItUser, setFilterDeviceForItUser] = useState(false);
  const displayListeDevice2 = filterDeviceForItUser
    ? filteredColorCategorieListe
    : DeviceInactifs;

  const displayListeDevice = isItUser
    ? displayListeDevice2
    : displayListeDevice1;

  const filteredListeGestionDesVehicules = searchTermInput
    ? displayListeDevice?.filter(
        (item) =>
          item?.description
            ?.toLowerCase()
            ?.includes(searchTermInput.toLowerCase()) ||
          item?.imeiNumber
            ?.toLowerCase()
            ?.includes(searchTermInput.toLowerCase()) ||
          item?.deviceID
            ?.toLowerCase()
            ?.includes(searchTermInput.toLowerCase()) ||
          item?.simPhoneNumber
            ?.toLowerCase()
            ?.includes(searchTermInput.toLowerCase()) ||
          item?.accountID.toLowerCase().includes(searchTermInput.toLowerCase())
      )
    : displayListeDevice;

  const deviceUpdateFonction = () => {
    comptes?.forEach((acct) => {
      setDashboardLoadingEffect(true);
      const id = acct.accountID;
      const pwd = acct.password;

      fetchAccountDevices(id, pwd).catch((err) => {
        console.error("Erreur lors du chargement des devices :", err);
      });

      setTimeout(() => {
        fetchAccountGroupes(id, pwd)
          .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
          .catch((err) => {
            console.error(
              "Erreur lors du chargement des groupes ou des devices de groupes :",
              err
            );
          });
      }, 3000);

      setTimeout(() => {
        fetchAccountUsers(id, pwd)
          .then((users) => {
            fetchUserDevices(id, users);
            // fetchUserGroupes(id, users);
          })
          .catch((err) => {
            console.error(
              "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
              err
            );
            // setError("Erreur lors de la mise à jour des utilisateurs.");
          });
      }, 6000);
    });
  };

  const [showOptionAppareilOptionPopup, setShowOptionAppareilOptionPopup] =
    useState(false);

  const nombreDeRésultatParClique = 10;

  const [voir10RésultatPlus, setVoir10RésultatPlus] = useState(1);

  const [showSortDeviceByPopup, setShowSortDeviceByPopup] = useState(false);

  const [sortDeviceBy, setSortDeviceBy] = useState("Dernière mouvement");
  const [isMoreRecentFirst, setIsMoreRecentFirst] = useState(true);

  const filteredAndCutListeGestionDesVehicules =
    filteredListeGestionDesVehicules &&
    filteredListeGestionDesVehicules.sort((a, b) => {
      const today = todayTimestamp;

      const lenA = Number(a?.véhiculeDetails?.length || 0);
      const lenB = Number(b?.véhiculeDetails?.length || 0);

      const aIsFuture = Number(a?.lastStopTime) > today;
      const bIsFuture = Number(b?.lastStopTime) > today;

      const speedA = parseFloat(a?.véhiculeDetails?.[0]?.speedKPH) || 0;
      const speedB = parseFloat(b?.véhiculeDetails?.[0]?.speedKPH) || 0;

      const dateCreationA = Number(a?.creationTime) || 0;
      const dateCreationB = Number(b?.creationTime) || 0;

      const distanceTotalA = parseFloat(a?.lastOdometerKM) || 0;
      const distanceTotalB = parseFloat(b?.lastOdometerKM) || 0;

      const lastUpdateA = Number(a?.véhiculeDetails?.[0]?.timestamp) || 0;
      const lastUpdateB = Number(b?.véhiculeDetails?.[0]?.timestamp) || 0;

      // --- Tri dynamique ---
      let result = 0;
      switch (sortDeviceBy) {
        case "Vitesse":
          result = speedA - speedB;
          break;
        case "Dernière mouvement":
          result = Number(a?.lastStopTime) - Number(b?.lastStopTime);
          break;
        case "Date de creation":
          result = dateCreationA - dateCreationB;
          break;
        case "Distance parcourue":
          result = distanceTotalA - distanceTotalB;
          break;
        case "Dernière mise a jour":
          result = lastUpdateA - lastUpdateB;
          break;
        default:
          result = aIsFuture - bIsFuture;
          break;
      }

      return isMoreRecentFirst ? -result : result;
    });

  const afficherPlusDeRésultat = () => {
    setVoir10RésultatPlus((prev) => prev + 1);
  };

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const [openGroups, setOpenGroups] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});

  const itemsPerPage = 10;

  const grouped = filteredAndCutListeGestionDesVehicules?.reduce(
    (acc, item) => {
      if (!acc[item.accountID]) acc[item.accountID] = [];
      acc[item.accountID].push(item);
      return acc;
    },
    {}
  );

  const sortedGroups = Object.entries(grouped || {})?.sort(
    (a, b) => b[1].length - a[1].length
  );

  const toggleGroup = (accountID) => {
    setOpenGroups((prev) => ({
      ...prev,
      [accountID]: !prev[accountID],
    }));

    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: prev[accountID] || 1,
    }));
  };

  const showMore = (accountID) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: (prev[accountID] || 1) + 1,
    }));
  };

  // Ouvrir automatiquement le premier groupe au rendu initial
  useEffect(() => {
    if (sortedGroups.length > 0) {
      const firstAccountID = sortedGroups[0][0];
      setOpenGroups({ [firstAccountID]: true }); // 👈 ouvre uniquement le premier
      setVisibleCounts({ [firstAccountID]: 1 }); // 👈 initialise la pagination pour le premier
    }
  }, [currentAccountSelected, documentationPage, filteredColorCategorieListe]);

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  function getMostRecentTimestamp(data) {
    if (data) {
      const validTimestamps = data
        .map((véhicule) => parseInt(véhicule?.véhiculeDetails?.[0]?.timestamp))
        .filter((timestamp) => !isNaN(timestamp));

      const mostRecentTimestamp =
        validTimestamps.length > 0 ? Math.max(...validTimestamps) : null; // ou une autre valeur par défaut

      return { mostRecentTimestamp };
    } else {
    }
  }

  // Pour stocker le timestamp le plus récent lorsque "data" change

  const [lastUpdate, setLastUpdate] = useState();
  const data = allDevices;

  // isDashboardHomePage
  //   ? currentAccountSelected?.accountDevices || accountDevices
  //   : dataFusionné;

  // Mettre à jour le timestamp le plus récent lorsque "data" change
  useEffect(() => {
    const result = getMostRecentTimestamp(data);
    if (result) {
      setLastUpdate(result); // garde l'objet { mostRecentTimestamp }
    }
  }, [listeGestionDesVehicules, currentAccountSelected, accountDevices]);
  useEffect(() => {
    const result = getMostRecentTimestamp(data);
    if (result) {
      setLastUpdate(result); // garde l'objet { mostRecentTimestamp }
    }
  }, []);

  const [errorMessage, setErrorMessage] = useState("");

  const moveDeviceToOtherCompteFonction = (e) => {
    e.preventDefault();

    if (inputPassword === adminPassword) {
      createVehicleEnGestionAccount(
        gestionAccountData.find(
          (account) => account.accountID === chooseAccountID
        )?.accountID,
        "admin",

        gestionAccountData.find(
          (account) => account.accountID === chooseAccountID
        )?.password,

        currentSelectedDeviceGestion?.deviceID,
        currentSelectedDeviceGestion?.vehicleID,

        currentSelectedDeviceGestion?.imeiNumber,
        currentSelectedDeviceGestion?.uniqueIdentifier,
        currentSelectedDeviceGestion?.description,
        currentSelectedDeviceGestion?.displayName,
        currentSelectedDeviceGestion?.licensePlate,
        currentSelectedDeviceGestion?.equipmentType,
        currentSelectedDeviceGestion?.simPhoneNumber
      );
      const showMessage = false;

      deleteVehicleEnGestionAccount(
        currentSelectedDeviceGestion?.deviceID,

        gestionAccountData.find(
          (account) =>
            account.accountID === currentSelectedDeviceGestion?.accountID
        )?.accountID,

        "admin",

        gestionAccountData.find(
          (account) =>
            account.accountID === currentSelectedDeviceGestion?.accountID
        )?.password,

        showMessage
      );

      setMoveDeviceToOtherCompte(false);
    } else {
      // console.log("Mot de passe incorrect");
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  // const foundAccount = comptes?.find((acct) => acct?.accountID === chooseAccountID)

  const [showCarte, setShowCarte] = useState(false);
  const [logOutPopup, setLogOutPopup] = useState(false);

  useEffect(() => {
    console.log("moveDeviceToOtherCompte", moveDeviceToOtherCompte);
  }, [moveDeviceToOtherCompte]);

  return (
    <div>
      {logOutPopup && (
        <div className="fixed inset-0 z-[99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999]">
          <Logout setLogOutPopup={setLogOutPopup} />
        </div>
      )}{" "}
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />
      <GestionAppareilOptionPopup
        setShowOptionAppareilOptionPopup={setShowOptionAppareilOptionPopup}
        showOptionAppareilOptionPopup={showOptionAppareilOptionPopup}
        setDocumentationPage={setDocumentationPage}
        setChooseOneAccountToContinue={setChooseOneAccountToContinue}
        setChooseOtherAccountGestion={setChooseOtherAccountGestion}
        setMoveDeviceToOtherCompte={setMoveDeviceToOtherCompte}
        isCreatingNewElement={isCreatingNewElement}
        setIsCreatingNewElement={setIsCreatingNewElement}
      />
      {showCarte && (
        <div className="fixed mx-auto  flex-col bg-black/50 z-[99999999999999999999999] inset-0 flex justify-center items-center">
          <div
            className={` 
            w-full  mx-auto md:mx-auto overflow-hidden- flex-  items-end-     bg-white rounded-lg`}
          >
            <div className="fixed rounded-full shadow-lg shadow-black/20 bg-white py-2 px-2 z-[9999999999999999999999] cursor-pointer top-10 right-[1rem] text-[2rem] text-red-500">
              <IoClose
                onClick={() => {
                  if (filteredColorCategorieListe) {
                    setShowCarte(false);
                  } else {
                    setFilteredColorCategorieListe(currentListe);
                  }
                }}
              />
            </div>
            <div className="relative ">
              <div className="w-full h-[15rem]-- overflow-hidden--- rounded-md ">
                <LocationPage fromDashboard="true" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-2 pb-40 bg-white pt-10 rounded-lg">
        {/* {!fromDashboard && ( */}
        <div>
          {!fromDashboard && (
            <div>
              <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
                {t("Liste des Appareils")}
              </h2>

              <h3 className=" text-orange-600 text-md text-center font-bold-- ">
                {currentSelectedUserToConnect?.description && (
                  <span className="text-gray-700">{t("Utilisateur")} :</span>
                )}{" "}
                <span className="notranslate">
                  {currentSelectedUserToConnect?.description}
                </span>
              </h3>
              <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
                <span className="text-gray-700">{t("Nombre Appareil")} :</span>{" "}
                {filteredListeGestionDesVehicules?.length}
              </h3>
            </div>
          )}
          {/* {moveDeviceToOtherCompte && !chooseOtherAccountGestion && ( */}
          {moveDeviceToOtherCompte && (
            <div className="fixed  z-[2] flex justify-center items-center inset-0 bg-black/50">
              <form
                onSubmit={moveDeviceToOtherCompteFonction}
                className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
              >
                <div className="bg-red-200 font-bold text-red-900 text-[1.1rem] px-3 text-center py-3 absolute top-0 left-0 right-0">
                  {t("Voulez-vous déplacer l'Appareil du compte")}{" "}
                  <span className="">
                    ({currentSelectedDeviceGestion?.accountID}){" "}
                  </span>
                  {t("vers le compte")}
                  <span className=" ml-1">
                    ({chooseAccountID}){""} ?
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3 mt-6"
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
                      setMoveDeviceToOtherCompte(false);
                    }}
                    className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
                  >
                    {t("Annuler")}
                  </h3>
                </div>
              </form>
            </div>
          )}
          {showSortDeviceByPopup && (
            <div className="fixed z-[999999909999999999999999999999999999999999999999999999999999999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
              <div
                className="bg-white dark:bg-gray-700 max-w-[40rem] relative flex flex-col gap-1 w-full mx-2-- p-6 px-4  border border-gray-600 mt-2 rounded-md"
                id="mapType"
              >
                <IoClose
                  onClick={() => {
                    setShowSortDeviceByPopup(false);
                  }}
                  className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
                />
                <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
                  {t("Trier les appareils par")}:
                </h2>
                <div className="flex gap-2 mb-4 p-[.2rem] border  shadow-md shadow-orange-100 border-orange-100 rounded-lg justify-between">
                  <p
                    onClick={() => {
                      setIsMoreRecentFirst(true);
                    }}
                    className={` w-full py-1 font-semibold text-center ${
                      isMoreRecentFirst ? "bg-orange-100 " : ""
                    } rounded-lg border cursor-pointer border-white/0  hover:border hover:bg-orange-200`}
                  >
                    {t("Décroissant")}
                  </p>
                  <p
                    onClick={() => {
                      setIsMoreRecentFirst(false);
                    }}
                    className={`w-full py-1 font-semibold text-center  ${
                      !isMoreRecentFirst ? "bg-orange-100 " : ""
                    } rounded-lg  border cursor-pointer border-white/0 hover:border hover:bg-orange-200`}
                  >
                    {t("Croissant")}
                  </p>
                </div>

                <div className="max-h-[60vh] overflow-auto">
                  <p
                    className={`cursor-pointer py-2 dark:text-gray-50 font-semibold hover:bg-orange-100 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      sortDeviceBy === "Dernière mouvement"
                        ? "bg-orange-50 border-b border-b-orange-300 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setSortDeviceBy("Dernière mouvement");
                      setShowSortDeviceByPopup(false);
                    }}
                  >
                    {t("Ordre de déplacement")}
                  </p>
                  <p
                    className={`cursor-pointer py-2 dark:text-gray-50 font-semibold hover:bg-orange-100 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      sortDeviceBy === "Date de creation"
                        ? "bg-orange-50 border-b border-b-orange-300 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setSortDeviceBy("Date de creation");
                      setShowSortDeviceByPopup(false);
                    }}
                  >
                    {t("Date de creation")}
                  </p>

                  <p
                    className={`cursor-pointer py-2 dark:text-gray-50 font-semibold hover:bg-orange-100 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      sortDeviceBy === "Dernière mise a jour"
                        ? "bg-orange-50 border-b border-b-orange-300 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setSortDeviceBy("Dernière mise a jour");
                      setShowSortDeviceByPopup(false);
                    }}
                  >
                    {t("Dernière mise a jour")}
                  </p>
                  <p
                    className={`cursor-pointer py-2 dark:text-gray-50 font-semibold hover:bg-orange-100 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      sortDeviceBy === "Vitesse"
                        ? "bg-orange-50 border-b border-b-orange-300 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setSortDeviceBy("Vitesse");
                      setShowSortDeviceByPopup(false);
                    }}
                  >
                    {t("Vitesse")}
                  </p>
                  <p
                    className={`cursor-pointer py-2 dark:text-gray-50 font-semibold hover:bg-orange-100 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      sortDeviceBy === "Distance parcourue"
                        ? "bg-orange-50 border-b border-b-orange-300 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setSortDeviceBy("Distance parcourue");
                      setShowSortDeviceByPopup(false);
                    }}
                  >
                    {t("Distance parcourue")}
                  </p>

                  {/* //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////// */}

                  <div
                    onClick={() => {
                      setShowSortDeviceByPopup(false);
                    }}
                    className="w-full flex flex-col items-center gap-3 flex-wrap mt-8"
                  >
                    <h2 className="border-b w-full text-start border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
                      {t("Trier les appareils par statut")}:
                    </h2>
                    {!isItUser && (
                      <>
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Tous les Appareils")}`
                              );
                            }
                            setFilteredColorCategorieListe(
                              addVehiculeDetailsFonction(
                                allDevices,
                                véhiculeDetails
                              )
                            );
                          }}
                          className="px-2  flex justify-between items-center cursor-pointer sm:px-4 py-1 text-sm border-l-4 text-blue-600 font-semibold bg-blue-50 w-full hover:bg-blue-100 dark:text-blue-200 dark:bg-gray-700 border-l-blue-600 "
                        >
                          {t("Tous")}
                          <span>({allDevices?.length})</span>
                        </p>
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Appareils En déplacement")}`
                              );
                            }
                            setFilteredColorCategorieListe(EnDéplacement);
                          }}
                          className={
                            "px-2 cursor-pointer w-full flex justify-between items-center sm:px-4 py-1  text-sm border-l-4 text-green-600 font-semibold bg-green-50 hover:bg-green-100  dark:text-green-200 dark:bg-gray-700 border-l-green-600 "
                          }
                        >
                          {t("Appareils En déplacement")}
                          <span>({EnDéplacement?.length})</span>
                        </p>
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Appareils déplacés")}`
                              );
                            }
                            setFilteredColorCategorieListe(DeviceDéplacer);
                          }}
                          className={
                            "px-2 cursor-pointer w-full flex justify-between items-center sm:px-4 py-1  text-sm border-l-4 text-green-600 font-semibold bg-green-50 hover:bg-green-100  dark:text-green-200 dark:bg-gray-700 border-l-green-600 "
                          }
                        >
                          {t("Appareils déplacés")}
                          <span>({DeviceDéplacer?.length})</span>
                        </p>
                        {/* ///////////////////////////////////////////////////////////////////////////////// */}
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Appareils non déplacés")}`
                              );
                            }
                            setFilteredColorCategorieListe(DeviceNonDeplacer);
                          }}
                          className="px-2 flex justify-between items-center cursor-pointer sm:px-4 py-1 text-sm sm:text-sm border-l-4 text-orange-600 font-semibold bg-orange-50 w-full hover:bg-orange-100 dark:text-orange-200 dark:bg-gray-700 border-l-orange-600 "
                        >
                          {t("Appareils non déplacés")}
                          <span>({DeviceNonDeplacer?.length})</span>
                        </p>
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Appareils Actifs")}`
                              );
                            }
                            setFilteredColorCategorieListe(DeviceListeActif);
                          }}
                          className="px-2  cursor-pointer flex justify-between items-center sm:px-4 py-1 text-sm sm:text-sm border-l-4 text-orange-600 font-semibold bg-orange-50 w-full hover:bg-orange-100 dark:text-orange-200 dark:bg-gray-700 border-l-orange-600 "
                        >
                          {t("Appareils Actifs")}
                          <span>({DeviceListeActif?.length})</span>
                        </p>
                        <p
                          onClick={() => {
                            if (fromDashboard) {
                              setStatisticFilteredDeviceListeText(
                                `${t("Appareils En Stationnement")}`
                              );
                            }
                            setFilteredColorCategorieListe(
                              DeviceEnStationnement
                            );
                          }}
                          className="px-2  cursor-pointer flex justify-between items-center sm:px-4 py-1 text-sm sm:text-sm border-l-4 text-orange-600 font-semibold bg-orange-50 w-full hover:bg-orange-100 dark:text-orange-200 dark:bg-gray-700 border-l-orange-600 "
                        >
                          {t("Appareils En Stationnement")}
                          <span>({DeviceEnStationnement?.length})</span>
                        </p>{" "}
                      </>
                    )}
                    {/* ///////////////////////////////////////////////////////////////////////////////// */}

                    <p
                      onClick={() => {
                        setFilterDeviceForItUser(true);

                        if (fromDashboard) {
                          setStatisticFilteredDeviceListeText(
                            `${t("Appareils Inactifs")}`
                          );
                        }
                        setFilteredColorCategorieListe(DeviceInactifs);
                      }}
                      className="px-2  cursor-pointer flex justify-between items-center sm:px-4 py-1  text-sm border-l-4 text-purple-600 font-semibold bg-purple-50 w-full hover:bg-purple-100 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 "
                    >
                      {t("Appareils Inactifs")}
                      <span>({DeviceInactifs?.length})</span>
                    </p>
                    <p
                      onClick={() => {
                        setFilterDeviceForItUser(true);

                        if (fromDashboard) {
                          setStatisticFilteredDeviceListeText(
                            `${t("Appareils Inactifs Actualisés")}`
                          );
                        }
                        setFilteredColorCategorieListe(
                          DeviceInactifsWidthDetails
                        );
                      }}
                      className="px-2  cursor-pointer flex justify-between items-center sm:px-4 py-1  text-sm border-l-4 text-purple-600 font-semibold bg-purple-50 w-full hover:bg-purple-100 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 "
                    >
                      {t("Appareils Inactifs Actualisés")}
                      <span>({DeviceInactifsWidthDetails?.length})</span>
                    </p>
                    <p
                      onClick={() => {
                        setFilterDeviceForItUser(true);

                        if (fromDashboard) {
                          setStatisticFilteredDeviceListeText(
                            `${t("Appareils Inactifs non Actualisés")}`
                          );
                        }
                        setFilteredColorCategorieListe(
                          DeviceInactifsWidthNoDetails
                        );
                      }}
                      className="px-2  cursor-pointer flex justify-between items-center sm:px-4 py-1  text-sm border-l-4 text-purple-600 font-semibold bg-purple-50 w-full hover:bg-purple-100 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 "
                    >
                      {t("Appareils Inactifs non Actualisés")}
                      <span>({DeviceInactifsWidthNoDetails?.length})</span>
                    </p>

                    {/* ///////////////////////////////////////////////////////////////////////////////// */}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
            {lastUpdate?.mostRecentTimestamp && (
              <p className="font-bold w-full text-center justify-center flex flex-wrap items-center text-[.8rem] md:text-[.9rem] text-orange-700 bg-orange-50 border border-orange-500/30 rounded-lg px-3 py-1.5 mx-auto ">
                <span className="text-gray-700  mr-2">
                  {t("Last Update")} :
                </span>
                <span>
                  {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
                  {" / "}
                  {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
                </span>
                <MdUpdate
                  onClick={() => {
                    setDashboardLoadingEffect(true);
                    if (isItUser) {
                      updateItUserDataFonction();
                    } else {
                      autoUpdateFonction();
                    }
                  }}
                  className={`${
                    dashboardLoadingEffect
                      ? "animate-spin rounded-full hover:bg-orange-50"
                      : " hover:bg-orange-500 hover:text-white rounded-sm"
                  } min-w-[2rem] cursor-pointer min-h-[1.7rem]  `}
                />
              </p>
            )}
            {/*  */}
            {isDashboardHomePage && !fromDashboard && !isItUser && (
              <div className="flex gap-2 justify-center mt-4--">
                <button
                  onClick={() => {
                    // setShowCreateNewDevicePage(true);
                    scrollToTop();

                    if (!currentAccountSelected) {
                      setChooseOneAccountToContinue(true);
                      setChooseOtherAccountGestion(true);
                    }
                    setDocumentationPage("Ajouter_nouveau_appareil");
                    navigate("/Ajouter_nouveau_appareil");

                    setIsCreatingNewElement(true);
                  }}
                  className="bg-orange-500 w-full shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
                >
                  <span className="flex justify-center items-center gap-3 ">
                    <FaUserPlus className="text-2xl" />
                    <span className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                      <span className="hidden md:inline">{t("Ajouter")} </span>{" "}
                      {t("Nouveau Appareil")}
                    </span>
                  </span>
                </button>{" "}
              </div>
            )}
            {!showPasswordInput &&
              isDashboardHomePage &&
              !fromDashboard &&
              !isItUser && (
                <div className="flex gap-2 w-full justify-between items-center">
                  <div
                    onClick={() => {
                      setChooseOtherAccountGestion(true);
                      setShowUserGroupeCategorieSection(true);
                    }}
                    className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
                  >
                    <h3 className="w-full text-center font-semibold">
                      {/* Compte: */}
                      <span className="max-w-[13rem] overflow-hidden whitespace-nowrap text-ellipsis sm:max-w-full">
                        {deviceListeTitleGestion ||
                          `${t("Tous les Appareils")}`}
                      </span>
                    </h3>
                    <FaChevronDown />
                  </div>
                  <div
                    onClick={() => {
                      setShowPasswordInput(true);
                    }}
                    className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100"
                  >
                    <IoSearchOutline className="text-xl " />
                  </div>
                  {/* <div
                  onClick={() => {
                    deviceUpdateFonction();
                  }}
                  className="border cursor-pointer px-3   py-2 border-gray-300 rounded-md bg-orange-100"
                >
                  <MdUpdate className="text-xl " />
                </div> */}
                </div>
              )}
            {(showPasswordInput ||
              !isDashboardHomePage ||
              fromDashboard ||
              isItUser) && (
              <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder={`${t(
                    "Recherche un appareil par description, compte, IMEI, telephone"
                  )}`}
                  required
                  value={searchTermInput}
                  onChange={(e) => {
                    setSearchTermInput(e.target.value);
                  }}
                  className=" px-3 w-full focus:outline-none dark:text-white  dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
                <div
                  onClick={() => {
                    {
                      setShowPasswordInput(false);
                      setSearchTermInput("");
                    }
                  }}
                  className=" cursor-pointer border-l border-l-gray-300 px-3  py-2 "
                >
                  {isDashboardHomePage && (
                    <IoClose className="text-xl text-red-600" />
                  )}
                </div>
              </div>
            )}

            {(fromDashboard || isItUser) && searchTermInput && (
              <div className="w-full flex justify-center">
                <p className="text-lg">
                  {t("Résultat")} :{" "}
                  <span className="font-bold text-orange-600">
                    {filteredListeGestionDesVehicules?.length}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/*  */}

        {/*  */}
        {/* )} */}
        <div className="hidden-- flex mt-[5rem] relative flex-col max-w-[50rem] mx-auto gap-4">
          {progressBarForLoadingData > 0 &&
            progressBarForLoadingData < 100 &&
            !fetchVehicleDataFromRapportGroupe &&
            showAnnimationProgresseBarDashboard && (
              <div className="flex justify-center items-center">
                <div
                  className="rounded-md shadow-sm shadow-black/10 overflow-hidden max-w-[50rem] mx-auto w-full border"
                  style={{
                    width: "100%",
                    background: "#fff",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      width: `${progressBarForLoadingData}%`,
                      background: "#4caf50",
                      color: "#fff",
                      padding: "4px",
                      transition: "width 1s linear",
                      textAlign: "center",
                    }}
                  >
                    <p className="font-semibold drop-shadow-2xl">
                      {Math.floor(progressBarForLoadingData)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          <div className="flex justify-end mt-4 items-end gap-3">
            <div className="flex  gap-2">
              {!isItUser && (
                <Tooltip
                  title={`${t("Voir cette liste sur la carte")}`}
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
                >
                  <p
                    onClick={() => {
                      setSelectedVehicleToShowInMap(null);
                      setShowCarte(true);
                      setIsFilteredCartePositionByCategorie(true);
                    }}
                    className="text-md  bg-orange-50 hover:bg-orange-100 h-[2.5rem] border border-orange-200 p-2 rounded-md text-orange-500 cursor-pointer"
                  >
                    <MdLocationPin className="text-[1.5rem]" />
                  </p>
                </Tooltip>
              )}

              {isItUser && (
                <button
                  onClick={() => {
                    setLogOutPopup(true);
                  }}
                  className="rounded-lg border-2 border-red-500 bg-white hover:bg-red-500 hover:text-white text-red-500 font-bold px-4"
                >
                  {t("Se Déconnecter")}
                </button>
              )}

              <Tooltip
                title={`${t("Filtrer les appareils")}`}
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
              >
                <p
                  onClick={() => {
                    setShowSortDeviceByPopup(true);
                  }}
                  className="text-md flex justify-center gap-4 font-bold px-4 h-[2.5rem] bg-orange-50 hover:bg-orange-100  border border-orange-500 p-2 rounded-md text-orange-500 cursor-pointer"
                >
                  <span>{t("Filtrer")}</span>{" "}
                  <FaSortAmountDownAlt className="text-[1.3rem]" />
                </p>
              </Tooltip>
            </div>
          </div>

          {/*  */}
          {/* {showChooseItemToModifyMessage &&
            showChooseItemToModifyPage === "Gestion_des_appareils" && (
              <div className=" flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                <p className="w-full">{showChooseItemToModifyMessage}</p>
                <IoClose
                  onClick={() => {
                    setshowChooseItemToModifyMessage("");
                  }}
                />
              </div>
            )} */}

          {sortedGroups?.length > 0 ? (
            sortedGroups?.map(([accountID, devices]) => (
              <div key={accountID}>
                {!currentAccountSelected && isDashboardHomePage && (
                  <div
                    className="flex justify-between text-md items-center border-b border-gray-300 cursor-pointer hover:bg-orange-100 bg-orange-50 p-3 rounded-lg"
                    onClick={() => {
                      toggleGroup(accountID);

                      setShowMoreDeviceInfo(null);
                    }}
                  >
                    <h2>
                      {t("Liste des appareils de")} :{" "}
                      <span className="font-semibold">{accountID}</span> (
                      {devices?.length})
                    </h2>
                    <div></div>
                    {openGroups[accountID] ? (
                      <FaChevronRight />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                )}
                {openGroups[accountID] && (
                  <div className="flex flex-col gap-4 mt-6">
                    {devices
                      ?.slice(0, (visibleCounts[accountID] || 1) * itemsPerPage)
                      ?.map((device, index) => {
                        //
                        //
                        //
                        //
                        const hasDetails = device?.véhiculeDetails?.length > 0;
                        const lastDetail = device?.véhiculeDetails?.[0];
                        const speed = lastDetail?.speedKPH ?? 0;
                        const lastUpdateMs = lastDetail?.timestamp
                          ? lastDetail.timestamp * 1000
                          : 0;

                        const isActive = device?.véhiculeDetails?.[0]?.timestamp
                          ? currentTime -
                              device?.véhiculeDetails?.[0]?.timestamp * 1000 <
                            twentyFourHoursInMs
                          : false;

                        const updatedToday = lastUpdateMs >= todayTimestamp;

                        let border_color = "bg-gray-50";
                        let text_color = "text-orange-500/80";
                        let bg_color = "bg-orange-500";

                        if (
                          (device?.lastStopTime > todayTimestamp &&
                            hasDetails) ||
                          (hasDetails && isActive && speed > 0)
                        ) {
                          border_color = "border-l-[.4rem] border-green-500";
                          text_color = "text-green-600";
                          bg_color = "bg-green-600/90";
                        } else if (
                          isActive &&
                          hasDetails &&
                          device?.lastStopTime <= todayTimestamp &&
                          speed <= 0
                        ) {
                          border_color = "border-l-[.4rem] border-orange-500";
                          text_color = "text-orange-500";
                          bg_color = "bg-orange-500";
                        } else {
                          border_color = "border-l-[.4rem] border-purple-500";
                          text_color = "text-purple-500";
                          bg_color = "bg-purple-500";
                        }

                        //
                        //
                        //
                        //

                        const code =
                          device?.véhiculeDetails?.length > 0 &&
                          device?.véhiculeDetails[0]?.statusCode &&
                          parseInt(device?.véhiculeDetails[0]?.statusCode, 16);
                        const codeDescription =
                          statusDescriptions[code] || `${t("statut inconnu")}`;

                        const detailsList = isDashboardHomePage
                          ? véhiculeDetails
                          : vehicleDetails;

                        const foundDetails = detailsList?.find((item) =>
                          item?.véhiculeDetails?.some(
                            (detail) =>
                              detail.accountID === device?.accountID &&
                              detail.deviceID === device?.deviceID
                          )
                        )?.véhiculeDetails?.[0];

                        return (
                          <div
                            key={index}
                            className={`${border_color} bg-gray-50 shadow-inner  shadow-black/10 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4`}
                          >
                            <div
                              onClick={() => {
                                // console.log(foundDetails);
                              }}
                              className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center"
                            >
                              {index + 1}
                            </div>
                            <div className="absolute bottom-3 right-3 "></div>
                            <div className="flex  gap-3   w-full">
                              {/* {showMoreDeviceInfo !== index && ( */}
                              <div
                                className={`${
                                  showMoreDeviceInfo !== index
                                    ? "max-w-[100vw] min-w-[5rem] md:mr-4"
                                    : "max-w-[0vw] min-w-[0rem] opacity-0"
                                } overflow-hidden transition-all hidden sm:flex flex-col  items-center    `}
                              >
                                <FaCar
                                  className={`${text_color} text-[3rem]   `}
                                />
                                <h3
                                  className={`${text_color} font-bold text-2xl`}
                                >
                                  {foundDetails?.speedKPH > 0 ||
                                  device?.véhiculeDetails?.[0]?.speedKPH
                                    ? parseFloat(
                                        device?.véhiculeDetails?.[0]
                                          ?.speedKPH || foundDetails?.speedKPH
                                      )?.toFixed(0)
                                    : 0}{" "}
                                  {/* {parseFloat(
                                    device?.véhiculeDetails?.[0]?.speedKPH ||
                                      foundDetails?.speedKPH
                                  )?.toFixed(0)}{" "} */}
                                </h3>
                                <h3
                                  className={`${text_color} font-bold text-lg`}
                                >
                                  Km/h
                                </h3>
                              </div>
                              {/* )} */}
                              <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                                <div className="w-full">
                                  <div
                                    className={` ${
                                      showMoreDeviceInfo !== index
                                        ? "max-h-[5rem]"
                                        : "max-h-[0rem] opacity-0"
                                    } flex sm:hidden overflow-hidden  gap-6 items-center`}
                                  >
                                    <FaCar
                                      className={`${text_color} text-[3rem] sm:hidden   md:mr-4 `}
                                    />
                                    <h3
                                      className={`${text_color} font-bold text-lg md:text-2xl`}
                                    >
                                      {/* {parseFloat(
                                        device?.véhiculeDetails?.[0]
                                          ?.speedKPH || foundDetails?.speedKPH
                                      )?.toFixed(0)}{" "} */}
                                      {foundDetails?.speedKPH > 0 ||
                                      device?.véhiculeDetails?.[0]?.speedKPH
                                        ? parseFloat(
                                            device?.véhiculeDetails?.[0]
                                              ?.speedKPH ||
                                              foundDetails?.speedKPH
                                          )?.toFixed(0)
                                        : 0}{" "}
                                      Km/h
                                    </h3>
                                  </div>
                                  {showMoreDeviceInfo === index && (
                                    <div
                                      className={`${text_color} text-[1rem] mt-4 border-b border-b-gray-600 py-1 flex items-center gap-3 `}
                                    >
                                      <FaCar className="text-[1.7rem]" />
                                      <p className="font-bold">
                                        {t("Informations générales")} :
                                      </p>
                                    </div>
                                  )}
                                  <div className=" border-b py-1">
                                    <p className="font-bold">
                                      {t("Description")} :
                                      <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.description ||
                                          device?.displayName ||
                                          `${t("Pas de nom disponible")}`}
                                      </span>
                                    </p>
                                  </div>{" "}
                                  {showMoreDeviceInfo !== index && (
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Account ID")} :
                                      </p>
                                      <span className=" dark:text-orange-500 notranslate text-gray-600 pl-2">
                                        {device?.accountID}
                                      </span>
                                    </div>
                                  )}
                                  <div className=" border-b py-1">
                                    <p className="font-bold">
                                      {t("Adresse")} :
                                      <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-2">
                                        {foundDetails?.address
                                          ? device?.véhiculeDetails[0]
                                              ?.address || foundDetails?.address
                                          : `${t("Pas de nom disponible")}`}
                                      </span>
                                    </p>
                                  </div>{" "}
                                  <div className="flex flex-wrap border-b py-1">
                                    <p className="font-bold">
                                      {t("Dernière mise a jour")} :
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2 font-normal">
                                        {
                                          FormatDateHeure(
                                            device?.véhiculeDetails?.[0]
                                              ?.timestamp
                                          ).date
                                        }
                                        <span className="px-2">/</span>{" "}
                                        {
                                          FormatDateHeure(
                                            device?.véhiculeDetails?.[0]
                                              ?.timestamp
                                          ).time
                                        }
                                      </span>
                                    </p>
                                  </div>{" "}
                                  {/*  */}
                                  {/*  */}
                                  {/*  */}
                                  {/*  */}
                                  <div
                                    className={`${
                                      showMoreDeviceInfo === index
                                        ? "max-h-[40rem]"
                                        : "max-h-0"
                                    }  overflow-hidden transition-all`}
                                  >
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Date Creation")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {
                                          FormatDateHeure(device?.creationTime)
                                            .date
                                        }
                                        <span className="px-2">/</span>{" "}
                                        {
                                          FormatDateHeure(device?.creationTime)
                                            .time
                                        }
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Plaque du véhicule")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.licensePlate}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Type d'installation")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.equipmentType}
                                      </span>
                                    </div>{" "}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {showMoreDeviceInfo === index && (
                                      <div
                                        className={`${text_color} text-[1rem] mt-4 border-b border-b-gray-600 py-1 flex items-center gap-3 `}
                                      >
                                        <FaInfoCircle className="text-[1.4rem]" />
                                        <p className="font-bold">
                                          {t("Informations d’identification")} :
                                        </p>
                                      </div>
                                    )}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Account ID")} :
                                      </p>
                                      <span className=" dark:text-orange-500 notranslate text-gray-600 pl-2">
                                        {device?.accountID}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("deviceID")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.deviceID}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">{t("VIN")} :</p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.vehicleID || "---"}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Numéro de la carte SIM")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.simPhoneNumber}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("ImeiNumber")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.imeiNumber}
                                      </span>
                                    </div>{" "}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    <div
                                      className={`${text_color} text-[1rem] mt-4 border-b border-b-gray-600 py-1 flex items-center gap-3 `}
                                    >
                                      <FaFlagCheckered className="text-[1.4rem]" />
                                      <p className="font-bold">
                                        {t("Statut & suivi")} :
                                      </p>
                                    </div>{" "}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    {/*  */}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Mensualité")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {device?.notes || "---"}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Vitesse")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {(foundDetails?.statusCode &&
                                          Number(
                                            device?.véhiculeDetails[0]?.speedKPH
                                          )?.toFixed(1)) ||
                                          Number(
                                            foundDetails?.speedKPH
                                          )?.toFixed(1)}{" "}
                                        Km/h{" "}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Statut")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {codeDescription}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Code Alerte")} :
                                      </p>
                                      <span className=" dark:text-orange-500 text-gray-600 pl-2">
                                        {(foundDetails?.statusCode &&
                                          device?.véhiculeDetails[0]
                                            ?.statusCode) ||
                                          foundDetails?.statusCode}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold">
                                        {t("Distance totale parcourue")} :
                                      </p>
                                      <span className="notranslate dark:text-orange-500 text-gray-600 pl-2">
                                        {/* {device?.lastOdometerKM.toFixed(0)} */}
                                        {device?.lastOdometerKM &&
                                        !isNaN(Number(device?.lastOdometerKM))
                                          ? Number(
                                              device?.lastOdometerKM
                                            ).toFixed(0) +
                                            " " +
                                            `${t("km")}`
                                          : `${t("Non disponible")}`}{" "}
                                      </span>
                                    </div>{" "}
                                  </div>
                                  <p
                                    onClick={() => {
                                      if (showMoreDeviceInfo === index) {
                                        setShowMoreDeviceInfo();
                                      } else {
                                        setShowMoreDeviceInfo(index);
                                      }
                                    }}
                                    className={`${text_color} hidden md:block font-semibold mt-2  cursor-pointer underline`}
                                  >
                                    {showMoreDeviceInfo === index
                                      ? t("Voir moins")
                                      : t("Voir plus")}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* {isDashboardHomePage && ( */}
                            <div
                              className="flex  justify-between md:mr-10-- md:flex-col mt-6 sm:max-w-[30rem] gap-3 md:mt-3 justify-between-- 
                      items-center "
                            >
                              <div
                                onClick={() => {
                                  if (showMoreDeviceInfo === index) {
                                    setShowMoreDeviceInfo();
                                  } else {
                                    setShowMoreDeviceInfo(index);
                                  }
                                }}
                                className={` ${text_color} flex md:hidden justify-center items-center border-2   rounded-lg  w-[50%] py-[.3rem]  cursor-pointer`}
                              >
                                <p
                                  className={`${text_color} font-semibold   cursor-pointer `}
                                >
                                  {showMoreDeviceInfo === index
                                    ? t("Voir moins")
                                    : t("Voir plus")}
                                </p>
                              </div>
                              {!isItUser && (
                                <button
                                  onClick={() => {
                                    console.log(device);
                                    setCurrentSelectedDeviceGestion(device);
                                    setShowOptionAppareilOptionPopup(true);
                                    setshowChooseItemToModifyMessage("");
                                  }}
                                  className={` ${bg_color} text-white  text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-1.5 px-4 flex justify-center items-center`}
                                >
                                  <p className="text-sm mr-2">{t("Options")}</p>

                                  <IoOptions />
                                </button>
                              )}
                            </div>
                            {/* // )} */}
                          </div>
                        );
                      })}

                    {devices.length >
                      (visibleCounts[accountID] || 1) * itemsPerPage && (
                      <div className="w-full flex justify-center mt-[4rem]">
                        <button
                          onClick={() => showMore(accountID)}
                          className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                        >
                          {t("Voir plus de Résultat")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {t("Pas de résultat")}
            </div>
          )}
          {/* /////////////////////////////////////////////////////// */}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default ListeDesVehiculesGestion;
