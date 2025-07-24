import React, { useContext, useEffect, useState } from "react";
import { IoClose, IoOptions, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { FaCar, FaUserPlus, FaChevronDown } from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { MdUpdate } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GestionAppareilOptionPopup from "../components/gestion_des_comptes/GestionAppareilOptionPopup";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function ListeDesVehiculesGestion({
  setDocumentationPage,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
  fromDashboard = false,
  statisticFilteredDeviceListe,
  statisticFilteredDeviceListeText,
  setStatisticFilteredDeviceListe,
  setStatisticFilteredDeviceListeText,
  showChooseAppareilToModifyMessage,
  setShowChooseAppareilToModifyMessage,

  /////////////////////
  showChooseItemToModifyMessage,
  setshowChooseItemToModifyMessage,
  showChooseItemToModifyPage,
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
    gestionAccountData,
    adminPassword,
    statusDescriptions,
    isDashboardHomePage,
    mergedDataHome,
    véhiculeDetails,

    DeviceDéplacer,
    EnDéplacement,
    DeviceEnStationnement,
    DeviceInactifs,
    DeviceListeActif,
    allDevices,
    setAllDevices,
    filteredColorCategorieListe,
    setFilteredColorCategorieListe,
    addVehiculeDetailsFonction,
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

  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
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
    if (fromDashboard) {
      return addVehiculeDetailsFonction(
        statisticFilteredDeviceListe,
        véhiculeDetails
      );
    }

    if (isDashboardHomePage) {
      return addVehiculeDetailsFonction(
        listeGestionDesVehicules,
        véhiculeDetails
      );
    }

    return dataFusionné;
  }, [
    fromDashboard,
    isDashboardHomePage,
    statisticFilteredDeviceListe,
    listeGestionDesVehicules,
    dataFusionné,
    véhiculeDetails,
  ]);

  const displayListeDevice = filteredColorCategorieListe
    ? filteredColorCategorieListe
    : currentListe;

  const filteredListeGestionDesVehicules = searchTermInput
    ? displayListeDevice?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          item?.imeiNumber
            .toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          item?.simPhoneNumber
            .toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
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

  const filteredAndCutListeGestionDesVehicules =
    filteredListeGestionDesVehicules &&
    filteredListeGestionDesVehicules
      .sort((a, b) => {
        const lenA = a.véhiculeDetails?.length || 0;
        const lenB = b.véhiculeDetails?.length || 0;

        const aIsFuture = a.lastStopTime > todayTimestamp;
        const bIsFuture = b.lastStopTime > todayTimestamp;

        if (aIsFuture !== bIsFuture) {
          return bIsFuture ? 1 : -1; // true (1) avant false (0)
        }

        if (lenB !== lenA) return lenB - lenA;

        if (b.lastUpdateTime !== a.lastUpdateTime) {
          return b.lastUpdateTime - a.lastUpdateTime;
        }

        return b.lastStopTime - a.lastStopTime;
      })
      ?.slice(0, voir10RésultatPlus * nombreDeRésultatParClique);

  const afficherPlusDeRésultat = () => {
    setVoir10RésultatPlus((prev) => prev + 1);
  };

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />
      <GestionAppareilOptionPopup
        setShowOptionAppareilOptionPopup={setShowOptionAppareilOptionPopup}
        showOptionAppareilOptionPopup={showOptionAppareilOptionPopup}
        setDocumentationPage={setDocumentationPage}
      />

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

          <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
            {/*  */}
            {isDashboardHomePage && !fromDashboard && (
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={() => {
                    // setShowCreateNewDevicePage(true);
                    scrollToTop();

                    if (!currentAccountSelected) {
                      setChooseOneAccountToContinue(true);
                      setChooseOtherAccountGestion(true);
                      setDocumentationPage("Ajouter_nouveau_appareil");
                      navigate("/Ajouter_nouveau_appareil");
                    } else {
                      setDocumentationPage("Ajouter_nouveau_appareil");
                      navigate("/Ajouter_nouveau_appareil");
                    }
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

            {!showPasswordInput && isDashboardHomePage && !fromDashboard && (
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
                      {deviceListeTitleGestion || `${t("Tous les Appareils")}`}
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
                <div
                  onClick={() => {
                    deviceUpdateFonction();
                  }}
                  className="border cursor-pointer px-3   py-2 border-gray-300 rounded-md bg-orange-100"
                >
                  <MdUpdate className="text-xl " />
                </div>
              </div>
            )}

            {(showPasswordInput || !isDashboardHomePage || fromDashboard) && (
              <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder={`${t("Recherche un appareil")}`}
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
            {fromDashboard && searchTermInput && (
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
        {/* )} */}
        <div className="hidden-- flex mt-[5rem] relative flex-col gap-6 max-w-[50rem] mx-auto">
          <div className="mt-4  grid grid-cols-2 md:flex items-center gap-2 flex-wrap">
            <p
              onClick={() => {
                if (
                  statisticFilteredDeviceListeText ===
                  `${t("Appareils En déplacement")}`
                ) {
                  if (fromDashboard) {
                    setStatisticFilteredDeviceListeText(
                      `${t("Appareils En déplacement")}`
                    );
                  }
                  setFilteredColorCategorieListe(EnDéplacement);
                } else {
                  if (fromDashboard) {
                    setStatisticFilteredDeviceListeText(
                      `${t("Appareils Déplacer")}`
                    );
                  }
                  setFilteredColorCategorieListe(DeviceDéplacer);
                }
              }}
              className={
                "px-2 cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-green-600 font-semibold bg-green-50/60 hover:bg-green-100  dark:text-green-200 dark:bg-gray-700 border-l-green-600 "
              }
            >
              {fromDashboard &&
              statisticFilteredDeviceListeText ===
                `${t("Appareils En déplacement")}`
                ? `${t("Véhicules En déplacement")}`
                : t("Véhicules déplacés")}
            </p>
            <p
              onClick={() => {
                if (fromDashboard) {
                  setStatisticFilteredDeviceListeText(
                    `${t("Appareils non déplacés")}`
                  );
                }
                setFilteredColorCategorieListe(DeviceEnStationnement);
              }}
              className="px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-orange-600 font-semibold bg-orange-50/60 hover:bg-orange-100 dark:text-orange-200 dark:bg-gray-700 border-l-orange-600 "
            >
              {t("Appareils non déplacés")}
            </p>

            <p
              onClick={() => {
                if (fromDashboard) {
                  setStatisticFilteredDeviceListeText(
                    `${t("Appareils Inactifs")}`
                  );
                }
                setFilteredColorCategorieListe(DeviceInactifs);
              }}
              className="px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-purple-600 font-semibold bg-purple-50/60 hover:bg-purple-100 dark:text-purple-200 dark:bg-gray-700 border-l-purple-600 "
            >
              {t("Appareils Inactifs")}
            </p>
            <p
              onClick={() => {
                if (fromDashboard) {
                  setStatisticFilteredDeviceListeText(
                    `${t("Tous les Appareils")}`
                  );
                }
                setFilteredColorCategorieListe(
                  addVehiculeDetailsFonction(allDevices, véhiculeDetails)
                );
              }}
              className="px-2  cursor-pointer sm:px-4 py-1 text-xs sm:text-sm border-l-4 text-blue-600 font-semibold bg-blue-50/60 hover:bg-blue-100 dark:text-blue-200 dark:bg-gray-700 border-l-blue-600 "
            >
              {t("Tous")}
            </p>
          </div>
          {/*  */}
          {showChooseItemToModifyMessage &&
            showChooseItemToModifyPage === "Gestion_des_appareils" && (
              <div className=" flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                <p className="w-full">{showChooseItemToModifyMessage}</p>
                <IoClose
                  onClick={() => {
                    setshowChooseItemToModifyMessage("");
                  }}
                />
              </div>
            )}

          {/* // .sort((a, b) => b.lastStopTime - a.lastStopTime) */}
          {filteredAndCutListeGestionDesVehicules?.length > 0 ? (
            filteredAndCutListeGestionDesVehicules?.map((device, index) => {
              const hasDetails = device?.véhiculeDetails?.length > 0;
              const lastDetail = device?.véhiculeDetails?.[0];
              const speed = lastDetail?.speedKPH ?? 0;
              const lastUpdateMs = lastDetail?.timestamp
                ? lastDetail.timestamp * 1000
                : 0;

              const isActive = device?.lastUpdateTime
                ? currentTime - device.lastUpdateTime * 1000 <
                  twentyFourHoursInMs
                : false;

              const updatedToday = lastUpdateMs >= todayTimestamp;
              const updatedRecently =
                currentTimeMs - lastUpdateMs <= tenMinutesInMs;

              let border_color = "bg-gray-50";
              let text_color = "text-orange-500/80";
              let bg_color = "bg-orange-500";
              if (
                currentTimeSec - device?.lastUpdateTime <
                twentyFourHoursInSec
              ) {
                border_color = "border-l-[.4rem] border-orange-300";
                text_color = "text-orange-500/80";
                bg_color = "bg-orange-500";
              } else if (
                currentTimeSec - device?.lastUpdateTime >
                twentyFourHoursInSec
              ) {
                border_color = "border-l-[.4rem] border-purple-300";
                text_color = "text-purple-500/80";
                bg_color = "bg-purple-500";
              }

              if (
                device?.lastStopTime > todayTimestamp ||
                (hasDetails &&
                  isActive &&
                  speed >= 1 &&
                  updatedRecently &&
                  updatedToday)
              ) {
                border_color = "border-l-[.4rem] border-green-300";
                text_color = "text-green-500/80";
                bg_color = "bg-green-500";
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
              return (
                <div
                  key={index}
                  className={`${border_color} bg-gray-50 shadow-inner  shadow-black/10 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4`}
                >
                  <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                    {index + 1}
                  </div>
                  <div className="absolute bottom-3 right-3 "></div>
                  <div className="flex  gap-3  ">
                    <div className=" hidden sm:flex flex-col  items-center   md:mr-4">
                      <FaCar className={`${text_color} text-[3rem]   `} />
                      <h3 className={`${text_color} font-bold text-2xl`}>
                        {updatedRecently
                          ? parseFloat(
                              device?.véhiculeDetails[0]?.speedKPH
                            ).toFixed(0)
                          : "0"}{" "}
                      </h3>
                      <h3 className={`${text_color} font-bold text-lg`}>
                        Km/h
                      </h3>
                    </div>
                    <div className=" w-full flex flex-wrap justify-between gap-x-4">
                      <div>
                        <div className="flex sm:hidden gap-6 items-center">
                          <FaCar
                            className={`${text_color} text-[3rem] sm:hidden   md:mr-4 `}
                          />
                          <h3
                            className={`${text_color} font-bold text-lg md:text-2xl`}
                          >
                            {updatedRecently
                              ? parseFloat(
                                  device?.véhiculeDetails[0]?.speedKPH
                                ).toFixed(0)
                              : "0"}{" "}
                            Km/h
                          </h3>
                        </div>
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
                        <div className=" border-b py-1">
                          <p className="font-bold">
                            {t("Adresse")} :
                            <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-2">
                              {device?.véhiculeDetails?.length >= 0
                                ? device?.véhiculeDetails[0]?.address
                                : `${t("Pas de nom disponible")}`}
                            </span>
                          </p>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">
                            {t("Dernière mise a jour")} :
                            <span className=" dark:text-orange-500 text-gray-600 pl-2 font-normal">
                              {FormatDateHeure(device?.lastUpdateTime).date}
                              <span className="px-2">/</span>{" "}
                              {FormatDateHeure(device?.lastUpdateTime).time}
                            </span>
                          </p>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">{t("Account ID")} :</p>
                          <span className=" dark:text-orange-500 notranslate text-gray-600 pl-2">
                            {device?.accountID}
                          </span>
                        </div>{" "}
                        <div
                          className={`${
                            showMoreDeviceInfo === index
                              ? "max-h-[20rem]"
                              : "max-h-0"
                          }  overflow-hidden transition-all`}
                        >
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("deviceID")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {device?.deviceID}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Alerte")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {codeDescription}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Code Alerte")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {device?.véhiculeDetails?.length > 0 &&
                                device?.véhiculeDetails[0]?.statusCode}
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
                            <p className="font-bold">{t("Telephone")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {device?.simPhoneNumber}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">
                              {typeof "Type d'appareil"} :
                            </p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {device?.equipmentType}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("ImeiNumber")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {device?.imeiNumber}
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
                                ? Number(device?.lastOdometerKM).toFixed(0) +
                                  `${t("km")}`
                                : `${t("Non disponible")}`}{" "}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">
                              {t("Numéro de la carte SIM")} :
                            </p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {/* 50941070132 */}
                              {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Date Creation")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-2">
                              {FormatDateHeure(device?.creationTime).date}
                              <span className="px-2">/</span>{" "}
                              {FormatDateHeure(device?.creationTime).time}
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
                    className="flex justify-between md:mr-10-- md:flex-col mt-6 sm:max-w-[25rem] gap-3 md:mt-3 justify-between-- 
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
                    <button
                      onClick={() => {
                        setCurrentSelectedDeviceGestion(device);
                        setShowOptionAppareilOptionPopup(true);
                        setshowChooseItemToModifyMessage("");
                      }}
                      className={` ${bg_color} text-white  text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-1.5 px-4 flex justify-center items-center`}
                    >
                      <p className="text-sm mr-2">{t("Options")}</p>

                      <IoOptions />
                    </button>
                    {/* <button
                          onClick={() => {
                            setShowUserGroupeCategorieSection(false);
                            setCurrentSelectedDeviceGestion(device);
                            setDocumentationPage("Modifier_appareil");
                            scrollToTop();
                          }}
                          className="bg-gray-200 border border-gray-300 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-1.5 pl-2.5 pr-1.5 flex justify-center items-center"
                        >
                          <p className="text-sm mr-2">{t("Modifier")}</p>

                          <FaRegEdit />
                        </button> */}
                    {/* <button
                          onClick={() => {
                            setCurrentSelectedDeviceGestion(device);

                            setDeleteAccountPopup(true);
                          }}
                          className={`${
                            true
                              ? " bg-orange-500 text-white"
                              : "text-orange-600 border-[0.02rem] border-orange-500 "
                          }   text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-1.5 px-2 flex justify-center items-center`}
                        >
                          <p className="text-sm mr-2">{t("Supprimer")}</p>

                          <FaTrashAlt />
                        </button> */}
                  </div>
                  {/* // )} */}
                </div>
              );
            })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {t("Pas de résultat")}
            </div>
          )}

          {filteredAndCutListeGestionDesVehicules?.length <
            filteredListeGestionDesVehicules?.length && (
            <div className="w-full flex justify-center mt-[4rem]">
              <button
                onClick={() => {
                  afficherPlusDeRésultat();
                }}
                className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
              >
                {t("Voir plus de Résultat")}
              </button>
            </div>
          )}
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
