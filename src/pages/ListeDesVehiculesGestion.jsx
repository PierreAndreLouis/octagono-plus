import React, { useContext, useEffect, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import {
  FaPlusCircle,
  FaRegEdit,
  FaTrashAlt,
  FaUserAlt,
  FaCar,
  FaUserPlus,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { MdUpdate } from "react-icons/md";
import { useTranslation } from "react-i18next";

function ListeDesVehiculesGestion({
  setDocumentationPage,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
  fromDashboard = false,
  statisticFilteredDeviceListe,
}) {
  const {
    FormatDateHeure,
    currentAccountSelected,
    listeGestionDesVehicules,
    setListeGestionDesVehicules,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
    password,
    deleteVehicleEnGestionAccount,
    currentSelectedDeviceGestion,
    setCurrentSelectedDeviceGestion,
    deviceListeTitleGestion,
    setDeviceListeTitleGestion,
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
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

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

  //
  //
  //
  //

  const [inputPassword, setInputPassword] = useState("");

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  // const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
  //   useState(false);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? listeGestionDesUsers?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : listeGestionDesUsers;

  const filterGroupeAccountData = searchInputTerm
    ? listeGestionDesGroupe?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : listeGestionDesGroupe;

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
      setDeleteAccountPopup(false);
    } else {
      console.log("Mot de passe incorrect");
    }
  };

  const [showUserListeToSelectDevice, setShowUserListeToSelectDevice] =
    useState(true);

  const [currentSelectedGroupeGestion, setCurrentSelectedGroupeGestion] =
    useState();

  const [showChooseUserMessage, setShowChooseUserMessage] = useState("");

  const [showUserGroupeCategorieSection, setShowUserGroupeCategorieSection] =
    useState(true);

  const [showMoreDeviceInfo, setShowMoreDeviceInfo] = useState();
  const [searchTermInput, setSearchTermInput] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const currentListe = fromDashboard
    ? statisticFilteredDeviceListe
    : listeGestionDesVehicules;

  const filteredListeGestionDesVehicules = searchTermInput
    ? currentListe?.filter(
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
    : currentListe;

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

  const statusDescriptions = {
    0x0000: `${t("Code de statut non spécifié")}`,
    0xf020: `${t("Localisation - En mouvement")}`,
    0xf021: `${t("Localisation - Arrêté")}`,
    0xf022: `${t("Localisation - Parking")}`,
    0xf100: `${t("Localisation - Odomètre")}`,
    0xf110: `${t("Localisation - Heures moteur")}`,
    0xf120: `${t("Localisation - Niveau de carburant")}`,
    0xf200: `${t("Changement d'état d'entrée")}`,
    0xf201: `${t("Entrée activée")}`,
    0xf202: `${t("Entrée désactivée")}`,
    0xf210: `${t("Contact allumé")}`,
    0xf211: `${t("Contact éteint")}`,
    0xf301: `${t("Alimentation activée")}`,
    0xf302: `${t("Alimentation désactivée")}`,
    0xf310: `${t("Batterie faible")}`,
    0xf311: `${t("Batterie OK")}`,
    0xf320: `${t("En charge")}`,
    0xf321: `${t("Non en charge")}`,
    0xf400: `${t("Détection de remorquage")}`,
    0xf500: `${t("Détection de collision")}`,
    0xf600: `${t("Excès de vitesse")}`,
    0xf601: `${t("Vitesse normale")}`,
    0xf700: `${t("Entrée dans une zone géographique")}`,
    0xf701: `${t("Sortie d'une zone géographique")}`,
    0xf800: `${t("Informations de diagnostic")}`,
    0xf900: `${t("Signal de vie")}`,
    0xfa00: `${t("Connexion du conducteur")}`,
    0xfa01: `${t("Déconnexion du conducteur")}`,
    0xfb00: `${t("Alerte de panique")}`,
    0xfc00: `${t("Rappel de maintenance")}`,
    // Ajouter d'autres statuts spécifiques aux dispositifs Coban si nécessaire
  };

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />

      {deleteAccountPopup && (
        <div className="fixed  z-[99999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={deleteVehicleFonction}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              {t("Voulez-vous Supprimer l'Appareil ?")}
            </div>
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
                  setDeleteAccountPopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
              >
                {t("Annuler")}
              </h3>
            </div>
          </form>
        </div>
      )}

      <div className="px-4 pb-40 bg-white pt-10 rounded-lg">
        {!fromDashboard && (
          <div>
            <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
              {t("Liste des Appareils")}
            </h2>

            {/* <h3 className=" text-orange-600 text-md text-center font-bold-- ">
          <span className="text-gray-700">Compte :</span>{" "}
          {currentAccountSelected?.description}
        </h3> */}
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

            <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
              {/*  */}
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={() => {
                    // setShowCreateNewDevicePage(true);
                    scrollToTop();

                    if (!currentAccountSelected) {
                      setChooseOneAccountToContinue(true);
                      setChooseOtherAccountGestion(true);
                      setDocumentationPage("Ajouter_nouveau_appareil");
                    } else {
                      setDocumentationPage("Ajouter_nouveau_appareil");
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

              {!showPasswordInput && (
                <div className="flex gap-2 w-full justify-between items-center">
                  <div
                    onClick={() => {
                      setChooseOtherAccountGestion(true);
                      setShowUserGroupeCategorieSection(true);

                      console.log(currentSelectedUserToConnect);
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

              {showPasswordInput && (
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
                    <IoClose className="text-xl text-red-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}

          {filteredListeGestionDesVehicules?.length > 0 ? (
            filteredListeGestionDesVehicules
              ?.slice()
              .sort((a, b) => b.lastUpdateTime - a.lastUpdateTime)
              ?.map((device, index) => {
                let border_color = "bg-gray-50";
                let text_color = "text-orange-500/80";
                if (
                  currentTimeSec - device?.lastUpdateTime <
                  twentyFourHoursInSec
                ) {
                  border_color = "border-l-[.4rem] border-orange-300";
                  text_color = "text-orange-500/80";
                } else if (
                  currentTimeSec - device?.lastUpdateTime >
                  twentyFourHoursInSec
                ) {
                  border_color = "border-l-[.4rem] border-purple-300";
                  text_color = "text-purple-500/80";
                }

                if (device?.lastStopTime > todayTimestamp) {
                  border_color = "border-l-[.4rem] border-green-300";
                  text_color = "text-green-500/80";
                }

                const code = parseInt(
                  device?.véhiculeDetails[0]?.statusCode,
                  16
                );
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
                    <div className="flex  gap-3  ">
                      <FaCar
                        className={`${text_color} text-[3rem] hidden sm:block  md:mr-4 `}
                      />
                      <div className=" w-full flex flex-wrap justify-between gap-x-4">
                        <div>
                          <FaCar
                            className={`${text_color} text-[3rem] sm:hidden   md:mr-4 `}
                          />
                          <div className=" border-b py-1">
                            <p className="font-bold">
                              {t("Description")} :
                              <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-5">
                                {device?.description ||
                                  device?.displayName ||
                                  `${t("Pas de nom disponible")}`}
                              </span>
                            </p>
                          </div>{" "}
                          <div className=" border-b py-1">
                            <p
                              onClick={() => {
                                console.log(
                                  device?.véhiculeDetails[0]?.address
                                );
                              }}
                              className="font-bold"
                            >
                              {t("Adresse")} :
                              <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-5">
                                {device?.véhiculeDetails?.length >= 0
                                  ? device?.véhiculeDetails[0]?.address
                                  : `${t("Pas de nom disponible")}`}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">
                              {t("Dernière mise a jour")} :
                            </p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {FormatDateHeure(device?.lastUpdateTime).date}
                              <span className="px-2">/</span>{" "}
                              {FormatDateHeure(device?.lastUpdateTime).time}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Account ID")} :</p>
                            <span className=" dark:text-orange-500 notranslate text-gray-600 pl-5">
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
                              <p className="font-bold">{t("Alerte")} :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {codeDescription}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">{t("Code Alerte")} :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.véhiculeDetails[0]?.statusCode}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                {t("Plaque du véhicule")} :
                              </p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.licensePlate}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">{t("Telephone")} :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.simPhoneNumber}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                {typeof "Type d'appareil"} :
                              </p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.equipmentType}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">{t("ImeiNumber")} :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.imeiNumber}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                {t("Distance totale parcourue")} :
                              </p>
                              <span className="notranslate dark:text-orange-500 text-gray-600 pl-5">
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
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {/* 50941070132 */}
                                {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                {t("Date Creation")} :
                              </p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {FormatDateHeure(device?.creationTime).date}
                                <span className="px-2">/</span>{" "}
                                {FormatDateHeure(device?.creationTime).time}
                              </span>
                            </div>{" "}
                          </div>
                          {showMoreDeviceInfo === index ? (
                            <p
                              onClick={() => {
                                setShowMoreDeviceInfo();
                              }}
                              className={`${text_color} font-semibold mt-2  cursor-pointer underline`}
                            >
                              {t("Voir moins")}
                            </p>
                          ) : (
                            <p
                              onClick={() => {
                                setShowMoreDeviceInfo(index);
                              }}
                              className={` ${text_color} font-semibold mt-2  cursor-pointer underline`}
                            >
                              {t("Voir plus")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end md:mr-10-- md:flex-col mt-6 sm:max-w-[25rem] gap-3 md:mt-3 justify-between-- items-center ">
                      <button
                        onClick={() => {
                          setCurrentSelectedDeviceGestion(device);
                          setShowUserGroupeCategorieSection(false);
                          setDocumentationPage("Modifier_appareil");
                          scrollToTop();
                        }}
                        className="bg-gray-200 border border-gray-300 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-1.5 pl-2.5 pr-1.5 flex justify-center items-center"
                      >
                        <p className="text-sm mr-2">{t("Modifier")}</p>

                        <FaRegEdit />
                      </button>
                      <button
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
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {t("Pas de résultat")}
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
