import React, { useContext, useEffect, useState } from "react";
import {
  IoAlertCircleOutline,
  IoClose,
  IoSearchOutline,
} from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import {
  FaPlusCircle,
  FaRegEdit,
  FaTrashAlt,
  FaUserAlt,
  FaUserPlus,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { MdUpdate } from "react-icons/md";
import {
  FaCar,
  FaMapMarkerAlt,
  FaChargingStation,
  FaBatteryFull,
  FaBatteryQuarter,
  FaBolt,
  FaExclamationTriangle,
  FaTools,
  FaUser,
  FaPowerOff,
  FaLifeRing,
  FaLockOpen,
  FaLock,
  FaTachometerAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
function ListeDesAlertsGestion({
  setDocumentationPage,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
  fromDashboard = false,
  statisticFilteredDeviceListe,
  fromExpandSectionDashboard = "false",
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
    accountDevices,
    statusDescriptions,
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

  // const statusDescriptions = {
  //   0x0000: `${t("Code de statut non spécifié")}`,
  //   0xf020: `${t("Localisation - En mouvement")}`,
  //   0xf021: `${t("Localisation - Arrêté")}`,
  //   0xf022: `${t("Localisation - Parking")}`,
  //   0xf100: `${t("Localisation - Odomètre")}`,
  //   0xf110: `${t("Localisation - Heures moteur")}`,
  //   0xf120: `${t("Localisation - Niveau de carburant")}`,
  //   0xf200: `${t("Changement d'état d'entrée")}`,
  //   0xf201: `${t("Entrée activée")}`,
  //   0xf202: `${t("Entrée désactivée")}`,
  //   0xf210: `${t("Contact allumé")}`,
  //   0xf211: `${t("Contact éteint")}`,
  //   0xf301: `${t("Alimentation activée")}`,
  //   0xf302: `${t("Alimentation désactivée")}`,
  //   0xf310: `${t("Batterie faible")}`,
  //   0xf311: `${t("Batterie OK")}`,
  //   0xf320: `${t("En charge")}`,
  //   0xf321: `${t("Non en charge")}`,
  //   0xf400: `${t("Détection de remorquage")}`,
  //   0xf500: `${t("Détection de collision")}`,
  //   0xf600: `${t("Excès de vitesse")}`,
  //   0xf601: `${t("Vitesse normale")}`,
  //   0xf700: `${t("Entrée dans une zone géographique")}`,
  //   0xf701: `${t("Sortie d'une zone géographique")}`,
  //   0xf800: `${t("Informations de diagnostic")}`,
  //   0xf900: `${t("Signal de vie")}`,
  //   0xfa00: `${t("Connexion du conducteur")}`,
  //   0xfa01: `${t("Déconnexion du conducteur")}`,
  //   0xfb00: `${t("Alerte de panique")}`,
  //   0xfc00: `${t("Rappel de maintenance")}`,
  //   // Ajouter d'autres statuts spécifiques aux dispositifs Coban si nécessaire
  // };

  const getTextColor = (code) => {
    switch (code) {
      // Mouvements et localisation
      case 0xf020:
        return "text-green-500"; // En mouvement
      case 0xf021:
        return "text-green-500"; // Arrêté
      case 0xf022:
        return "text-blue-500"; // Parking
      case 0xf100:
        return "text-gray-500"; // Odomètre
      case 0xf110:
        return "text-gray-500"; // Heures moteur
      case 0xf120:
        return "text-yellow-500"; // Carburant

      // Entrées
      case 0xf200:
        return "text-purple-500"; // Changement d'état
      case 0xf201:
        return "text-green-500"; // Activée
      case 0xf202:
        return "text-red-500"; // Désactivée

      // Contact
      case 0xf210:
        return "text-green-500"; // Allumé
      case 0xf211:
        return "text-red-500"; // Éteint

      // Alimentation
      case 0xf301:
        return "text-green-500"; // Alimentation activée
      case 0xf302:
        return "text-red-500"; // Alimentation désactivée
      case 0xf310:
        return "text-yellow-500"; // Batterie faible
      case 0xf311:
        return "text-green-500"; // Batterie OK
      case 0xf320:
        return "text-blue-500"; // En charge
      case 0xf321:
        return "text-gray-500"; // Non en charge

      // Événements critiques
      case 0xf400:
        return "text-red-500"; // Remorquage
      case 0xf500:
        return "text-red-500"; // Collision
      case 0xf600:
        return "text-red-500"; // Excès de vitesse
      case 0xf601:
        return "text-green-500"; // Vitesse normale

      // Zones géographiques
      case 0xf700:
        return "text-blue-500"; // Entrée zone
      case 0xf701:
        return "text-blue-500"; // Sortie zone

      // Divers
      case 0xf800:
        return "text-gray-500"; // Diagnostic
      case 0xf900:
        return "text-gray-500"; // Signal de vie
      case 0xfa00:
        return "text-blue-500"; // Connexion conducteur
      case 0xfa01:
        return "text-gray-500"; // Déconnexion conducteur
      case 0xfb00:
        return "text-red-500"; // Panique
      case 0xfc00:
        return "text-orange-500"; // Maintenance

      default:
        return "text-gray-500"; // Inconnu ou générique
    }
  };

  // //////////////////////////////////////////////////
  // //////////////////////////////////////////////////
  // //////////////////////////////////////////////////
  // //////////////////////////////////////////////////
  // //////////////////////////////////////////////////
  // //////////////////////////////////////////////////

  const statusVisuals = (description = "") => {
    description = description.toLowerCase();

    if (description.includes("collision")) {
      return { icon: <FaExclamationTriangle />, color: "red" };
    }
    if (description.includes("batterie") && description.includes("faible")) {
      return { icon: <FaBatteryQuarter />, color: "yellow" };
    }
    if (description.includes("batterie")) {
      return { icon: <FaBatteryFull />, color: "green" };
    }
    if (description.includes("charge")) {
      return { icon: <FaChargingStation />, color: "blue" };
    }
    if (description.includes("localisation") || description.includes("zone")) {
      return { icon: <FaMapMarkerAlt />, color: "green" };
    }
    if (description.includes("carburant")) {
      return { icon: <FaBolt />, color: "yellow" };
    }
    if (description.includes("remorquage")) {
      return { icon: <FaLockOpen />, color: "red" };
    }
    if (description.includes("contact")) {
      return { icon: <FaPowerOff />, color: "gray" };
    }
    if (description.includes("panique")) {
      return { icon: <FaLifeRing />, color: "red" };
    }
    if (description.includes("conducteur")) {
      return { icon: <FaUser />, color: "blue" };
    }
    if (description.includes("vitesse")) {
      return {
        icon: <FaTachometerAlt />,
        color: description.includes("excès") ? "red" : "green",
      };
    }
    if (description.includes("diagnostic")) {
      return { icon: <FaTools />, color: "gray" };
    }

    return { icon: <FaCar />, color: "gray" };
  };

  const getTailwindBorderColor = (color) => {
    switch (color) {
      case "red":
        return " border-red-300";
      case "green":
        return " border-green-300";
      case "blue":
        return " border-blue-300";
      case "yellow":
        return " border-yellow-300";
      case "gray":
        return " border-gray-300";
      default:
        return " border-orange-300";
    }
  };
  const getTailwindColor = (color) => {
    switch (color) {
      case "red":
        return "text-red-500 ";
      case "green":
        return "text-green-500 ";
      case "blue":
        return "text-blue-500 ";
      case "yellow":
        return "text-yellow-500 ";
      case "gray":
        return "text-gray-500 ";
      default:
        return "text-orange-500 ";
    }
  };

  return (
    <div>
      <div className="px-2 pb-40 bg-white pt-10 rounded-lg">
        {fromExpandSectionDashboard === "false" && (
          <div>
            <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
              {t("Liste des Alertes")}
            </h2>

            <h3 className=" text-orange-600  text-md text-center font-bold-- ">
              {currentSelectedUserToConnect?.description && (
                <span className="text-gray-700">{t("Utilisateur")} :</span>
              )}{" "}
              <span className="notranslate">
                {currentSelectedUserToConnect?.description}
              </span>
            </h3>
            <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
              <span className="text-gray-700">{t("Nombre d'Alerte")} :</span> (
              {currentAccountSelected
                ? currentAccountSelected?.accountDevices
                    ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                    ?.filter((item) => item?.statusCode !== "0xF952")?.length
                : accountDevices
                    ?.flatMap((device) => device?.véhiculeDetails[0] || [])
                    ?.filter((item) => item?.statusCode !== "0xF952")?.length}
              )
            </h3>

            <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
              {/*  */}

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
              ?.flatMap((device) => device?.véhiculeDetails[0] || [])
              ?.filter((item) => item?.statusCode !== "0xF952")
              ?.slice()
              ?.map((alert, index) => {
                // const code = parseInt(alert.statusCode, 16);
                // const codeDescription =
                //   statusDescriptions[code] || "Statut inconnu";

                const code = parseInt(alert.statusCode, 16);
                const codeDescription =
                  statusDescriptions[code] || `${t("Statut inconnu")}`;
                const { icon, color } = statusVisuals(codeDescription);
                const twColor = getTailwindColor(color);
                const twBorderColor = getTailwindBorderColor(color);

                const currentDevice = accountDevices?.find(
                  (d) => d.deviceID === alert.deviceID
                );

                // const color = getTextColor(code);
                let border_color = "bg-gray-50";
                let text_color = "text-orange-500/80";
                // if (
                //   currentTimeSec - device?.lastUpdateTime <
                //   twentyFourHoursInSec
                // ) {
                //   border_color = "border-l-[.4rem] border-orange-300";
                //   text_color = "text-orange-500/80";
                // } else if (
                //   currentTimeSec - device?.lastUpdateTime >
                //   twentyFourHoursInSec
                // ) {
                //   border_color = "border-l-[.4rem] border-purple-300";
                //   text_color = "text-purple-500/80";
                // }

                // if (device?.lastStopTime > todayTimestamp) {
                //   border_color = "border-l-[.4rem] border-green-300";
                //   text_color = "text-green-500/80";
                // }
                return (
                  <div
                    key={index}
                    className={`${border_color} border-l-[.3rem]-- overflow-hidden bg-gray-50 shadow-inner  shadow-black/10 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4`}
                  >
                    <div className="bg-gray-100 shadow-lg shadow-black/10  pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3   w-full">
                      <IoAlertCircleOutline
                        className={`${text_color} text-[3rem] hidden sm:block  md:mr-4 `}
                      />
                      <div className=" w-full  flex flex-wrap justify-between gap-x-4">
                        <div className="  w-full">
                          <IoAlertCircleOutline
                            className={`${text_color} text-[3rem] sm:hidden   md:mr-4 `}
                          />
                          {/* <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">Description :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {device?.description ||
                                device?.displayName ||
                                "Pas de nom disponible"}
                            </span>
                          </div>{" "} */}
                          <div
                            className={`${text_color} flex-- w-full  flex-wrap00 border-b py-1`}
                          >
                            <p className="font-bold">
                              {t("Alerte")} :
                              <span className=" dark:text-orange-500 font-bold  pl-5">
                                {codeDescription}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Code")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {alert?.statusCode}
                            </span>
                          </div>{" "}
                          <div className="flex- flex-wrap- border-b py-1">
                            <p className="font-bold">
                              {t("Description")} :
                              <span className=" dark:text-orange-500 font-normal notranslate text-gray-600 pl-5">
                                {currentDevice?.description || "---"}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Account ID")} :</p>
                            <span className=" dark:text-orange-500 notranslate text-gray-600 pl-5">
                              {alert?.accountID}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex- flex-wrap- border-b py-1">
                            <p className="font-bold">
                              {t("Adresse")} :
                              <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-5">
                                {alert?.address ||
                                  `${t("Pas d'adresse disponible")}`}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Last update")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {FormatDateHeure(alert?.timestamp).date}
                              <span className="px-2">/</span>{" "}
                              {FormatDateHeure(alert?.timestamp).time}
                            </span>
                          </div>{" "}
                          {/* <div
                            className={`${
                              showMoreDeviceInfo === index
                                ? "max-h-[20rem]"
                                : "max-h-0"
                            }  overflow-hidden transition-all`}
                          >
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">Plaque du véhicule :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.licensePlate}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">Telephone :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.simPhoneNumber}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">Type d'appareil :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.equipmentType}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">ImeiNumber :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {device?.imeiNumber}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                Distance totale parcourue :
                              </p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">

                                {device?.lastOdometerKM &&
                                !isNaN(Number(device?.lastOdometerKM))
                                  ? Number(device?.lastOdometerKM).toFixed(0) +
                                    " km"
                                  : "Non disponible"}{" "}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">
                                Numéro de la carte SIM :
                              </p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                50941070132

                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap border-b py-1">
                              <p className="font-bold">Date Creation :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {FormatDateHeure(device?.creationTime).date}
                                <span className="px-2">/</span>{" "}
                                {FormatDateHeure(device?.creationTime).time}
                              </span>
                            </div>{" "}
                          </div> */}
                          {/* {showMoreDeviceInfo === index ? (
                            <p
                              onClick={() => {
                                setShowMoreDeviceInfo();
                              }}
                              className={`${text_color} font-semibold mt-2  cursor-pointer underline`}
                            >
                              Voir moins
                            </p>
                          ) : (
                            <p
                              onClick={() => {
                                setShowMoreDeviceInfo(index);
                              }}
                              className={` ${text_color} font-semibold mt-2  cursor-pointer underline`}
                            >
                              Voir plus
                            </p>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {true("Pas de résultat")}
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

export default ListeDesAlertsGestion;

// export default ListeDesAlertsGestion
