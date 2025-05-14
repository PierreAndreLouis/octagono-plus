import React, { useContext, useEffect, useState } from "react";
import {
  IoArrowBack,
  IoChevronBackCircleOutline,
  IoClose,
  IoEarth,
  IoOptions,
} from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
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
import { IoMdLogIn } from "react-icons/io";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import CreateNewDeviceGestion from "../components/gestion_des_comptes/CreateNewDeviceGestion";
import ModifyDeviceGestion from "../components/gestion_des_comptes/ModifyDeviceGestion";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

function ListeDesVehiculesGestion({ setDocumentationPage }) {
  const {
    ajouterGeofencePopup,
    setAjouterGeofencePopup,
    geofenceData,
    FormatDateHeure,
    account,
    currentGeozone,
    setCurrentGeozone,
    isEditingGeofence,
    setIsEditingGeofence,
    ModifierGeofence,
    supprimerGeofence,
    activerOuDesactiverGeofence,
    succesCreateGeofencePopup,
    setSuccesCreateGeofencePopup,
    succesModifierGeofencePopup,
    setSuccesModifierGeofencePopup,
    errorModifierGeofencePopup,
    setErrorModifierGeofencePopup,
    succesDeleteGeofencePopup,
    setSuccesDeleteGeofencePopup,
    errorDeleteGeofencePopup,
    setErrorDeleteGeofencePopup,
    showAccountOptionsPopup,
    setShowAccountOptionsPopup,
    currentAccountSelected,
    deleteVehicle,
    listeGestionDesVehicules,
    setListeGestionDesVehicules,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
    TestDeRequetteDevices,
    backToPagePrecedent,
    password,
    deleteVehicleEnGestionAccount,
    currentSelectedDeviceGestion,
    setCurrentSelectedDeviceGestion,
    deviceListeTitleGestion,
    setDeviceListeTitleGestion,
    gestionAccountData,
    groupeDevices,
  } = useContext(DataContext);
  const [supprimerGeozonePopup, setSupprimerGeozonePopup] = useState(false);

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  //
  //
  //    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
  const lastUpdateTimeMs = currentGeozone?.lastUpdateTime
    ? currentGeozone?.lastUpdateTime * 1000
    : 0;
  const isCurrentGeozoneActive =
    currentTime - lastUpdateTimeMs < twentyHoursInMs;

  const [inputPassword, setInputPassword] = useState("");

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
    useState(false);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? currentAccountSelected?.accountUsers?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : currentAccountSelected?.accountUsers;

  const filterGroupeAccountData = searchInputTerm
    ? currentAccountSelected?.accountGroupes?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : currentAccountSelected?.accountGroupes;

  // const [selectedVehiculeAccount, setSelectedVehiculeAccount] = useState();

  const deleteVehicleFonction = (e) => {
    e.preventDefault();
    console.log("asdsdfsdf");
    console.log(inputPassword);
    console.log(password);
    if (inputPassword === password) {
      console.log("Permission de supprimer avec passowrd: ", inputPassword);
      deleteVehicleEnGestionAccount(
        currentSelectedDeviceGestion?.deviceID,
        currentSelectedUserToConnect?.accountID,
        currentSelectedUserToConnect?.userID,
        currentSelectedUserToConnect?.password
      );
      setDeleteAccountPopup(false);
    } else {
      console.log("Mot de passe incorrect");
    }
  };

  const [showCreateNewDevicePage, setShowCreateNewDevicePage] = useState(false);
  const [showModifyNewDevicePage, setShowModifyNewDevicePage] = useState(false);

  const [showUserListeToSelectDevice, setShowUserListeToSelectDevice] =
    useState(true);

  const [currentSelectedGroupeGestion, setCurrentSelectedGroupeGestion] =
    useState();

  // useEffect(() => {
  //   // Crée un Set des deviceID de deviceInfo pour une recherche rapide
  //   const deviceIDsInInfo = new Set(
  //     currentSelectedGroupeGestion?.groupeDevices?.map(
  //       (device) => device.deviceID
  //     )
  //   );

  //   // Filtre les éléments de deviceListe
  //   const updateListe = currentAccountSelected?.accountDevices?.filter(
  //     (device) => deviceIDsInInfo.has(device.deviceID)
  //   );

  //   // console.log(updateListe);

  //   setListeGestionDesVehicules(updateListe);
  // }, [currentSelectedGroupeGestion]);

  const [showChooseUserMessage, setShowChooseUserMessage] = useState("");

  const [showUserGroupeCategorieSection, setShowUserGroupeCategorieSection] =
    useState(true);

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />

      {deleteAccountPopup && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={deleteVehicleFonction}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous Supprimer l'Appareil ?
            </div>
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
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                type="submit"
                onClick={() => {
                  // console.log(
                  //   selectedVehiculeAccount.deviceID,
                  //   currentSelectedUserToConnect?.accountID,
                  //   currentSelectedUserToConnect?.userID,
                  //   currentSelectedUserToConnect?.password
                  // );
                  // deleteVehicle(
                  //   selectedVehiculeAccount.deviceID,
                  //   currentSelectedUserToConnect?.accountID,
                  //   currentSelectedUserToConnect?.userID,
                  //   currentSelectedUserToConnect?.password
                  // );
                }}
                className="py-1 px-5 bg-red-500 rounded-lg text-white"
              >
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setDeleteAccountPopup(false);
                  // TestDeRequetteDevices();
                }}
                className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}

      {editAccountGestion && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            // onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-orange-600 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous Modifier l'appareil ?
            </div>
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
                  //   value={inputPassword}
                  //   onChange={(e) => setInputPassword(e.target.value)}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                onClick={() => {
                  //   setEditAccountGestion(false);
                }}
                className="py-1 px-5 bg-orange-500 rounded-lg text-white"
              >
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setEditAccountGestion(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}

      {chooseOtherAccountGestion && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999999999999999999999999999999999999999]">
          <div className="bg-white overflow-hidden w-full mx-4 max-w-[40rem] min-h-[80vh] max-h-[90vh] rounded-lg">
            <div className="relative">
              <div className="text-center font-semibold text-lg bg-orange-100 py-4">
                <h2 className="">Liste des Utilisateurs</h2>
                <p className="text-center font-normal- text-orange-600 translate-x-11--  text-sm">
                  {currentAccountSelected?.description}
                </p>
              </div>

              <IoClose
                onClick={() => {
                  setChooseOtherAccountGestion(false);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>
            {showUserGroupeCategorieSection && (
              <div className="grid grid-cols-2 mx-3 my-3 gap-2">
                <button
                  onClick={() => {
                    setShowUserListeToSelectDevice(true);
                  }}
                  className={`${
                    showUserListeToSelectDevice
                      ? "bg-orange-300"
                      : "bg-gray-200"
                  } flex cursor-pointer justify-center items-center shadow-lg-- shadow-black/10 rounded-md  font-bold text-black py-2 `}
                >
                  Utilisateurs
                </button>
                <button
                  onClick={() => {
                    setShowUserListeToSelectDevice(false);
                  }}
                  className={`${
                    !showUserListeToSelectDevice
                      ? "bg-orange-300"
                      : "bg-gray-200"
                  }  font-bold cursor-pointer    flex  justify-center items-center shadow-lg-- shadow-black/10 rounded-md  py-2 `}
                >
                  Groupe
                </button>
              </div>
            )}
            <div>
              {showUserListeToSelectDevice ? (
                <div>
                  <div className="flex mx-3 my-4 gap-2 justify-between items-center">
                    <input
                      className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                      type="text"
                      placeholder="Rechercher un utilisateur"
                      value={searchInputTerm}
                      onChange={(e) => {
                        setSearchInputTerm(e.target.value);
                      }}
                    />

                    <p className="border cursor-pointer bg-gray-50 font-semibold  rounded-lg px-2 py-1.5">
                      Rechercher
                    </p>
                    {/* </Tooltip> */}
                  </div>
                  {showChooseUserMessage && (
                    <div className="px-3 flex justify-between items-start py-2 rounded-md border border-red-600 bg-red-200 font-semibold mx-3 mb-4">
                      <p className="w-full text-red-700">
                        Choisissez un utilisateur pour ajouter un nouveau
                        Appareil
                      </p>
                      <IoClose
                        className="text-[1.6rem] cursor-pointer text-red-500"
                        onClick={() => {
                          setShowChooseUserMessage(false);
                        }}
                      />
                    </div>
                  )}
                  <div className="flex overflow-auto h-[60vh] max-h-[55vh] pb-20 flex-col gap-4 mx-3">
                    {/*  */}
                    <button
                      onClick={() => {
                        {
                          setDeviceListeTitleGestion("Tous les appareils");
                          setListeGestionDesVehicules(
                            currentAccountSelected?.accountDevices
                          );
                          setChooseOtherAccountGestion(false);
                          setCurrentSelectedUserToConnect(null);
                        }
                      }}
                      className="font-bold bg-orange-50 rounded-lg py-2 shadow-lg shadow-black/10"
                    >
                      Tous les appareils
                    </button>{" "}
                    {filterGestionAccountData?.map((user, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setListeGestionDesVehicules(user?.userDevices);
                            setCurrentSelectedUserToConnect(user);
                            setChooseOtherAccountGestion(false);
                            setDeviceListeTitleGestion(
                              "Utilisateur : " + user?.description
                            );
                            setShowChooseUserMessage(false);
                          }}
                          className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center rounded-lg py-2 px-2 "
                        >
                          <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                            {index + 1}
                          </p>
                          <FaUserCircle className="text-gray-500 text-[2.5rem]" />
                          <div>
                            <p className="text-gray-600">
                              Nom du compte :{" "}
                              <span className="font-bold">
                                {user?.description}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              Nombre d'appareil :{" "}
                              <span className="font-bold">
                                {user?.userDevices?.length}
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/*  */}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex mx-3 my-4 gap-2 justify-between items-center">
                    <input
                      className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                      type="text"
                      placeholder="Rechercher un groupe"
                      value={searchInputTerm}
                      onChange={(e) => {
                        setSearchInputTerm(e.target.value);
                      }}
                    />

                    <p className="border cursor-pointer bg-gray-50 font-semibold  rounded-lg px-2 py-1.5">
                      Rechercher
                    </p>
                    {/* </Tooltip> */}
                  </div>
                  <div className="flex overflow-auto h-[60vh] max-h-[55vh] pb-20 flex-col gap-4 mx-3">
                    {/*  */}
                    <button
                      onClick={() => {
                        {
                          setListeGestionDesVehicules(
                            currentAccountSelected?.accountDevices
                          );
                          setChooseOtherAccountGestion(false);
                          setCurrentSelectedUserToConnect(null);
                        }
                      }}
                      className="font-bold bg-orange-50 rounded-lg py-2 shadow-lg shadow-black/10"
                    >
                      Tous les appareils
                    </button>{" "}
                    {filterGroupeAccountData?.map((group, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            // setCurrentSelectedUserToConnect(group);
                            setChooseOtherAccountGestion(false);
                            setCurrentSelectedGroupeGestion(group);
                            setDeviceListeTitleGestion(
                              "Groupe : " + group?.description
                            );
                          }}
                          className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center rounded-lg py-2 px-2 "
                        >
                          <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                            {index + 1}
                          </p>
                          <FaUserCircle className="text-gray-500 text-[2.5rem]" />
                          <div>
                            <p className="text-gray-600">
                              Nom du compte :{" "}
                              <span className="font-bold">
                                {group?.description}
                              </span>{" "}
                            </p>
                            <p className="text-gray-600">
                              Nombre d'appareil :{" "}
                              <span className="font-bold">
                                {group?.groupeDevices?.length}
                              </span>{" "}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/*  */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pb-40 bg-white pt-10 rounded-lg">
        <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
          Liste des Appareils
        </h2>

        <h3 className=" text-orange-600 text-md text-center font-bold-- ">
          <span className="text-gray-700">Compte :</span>{" "}
          {currentAccountSelected?.description}
        </h3>
        <h3 className=" text-orange-600 text-md text-center font-bold-- ">
          {currentSelectedUserToConnect?.description && (
            <span className="text-gray-700">Utilisateur :</span>
          )}{" "}
          {currentSelectedUserToConnect?.description}
        </h3>
        <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
          <span className="text-gray-700">Nombre Appareil :</span>{" "}
          {listeGestionDesVehicules?.length}
        </h3>

        <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
          {/*  */}
          <div className="flex gap-2 justify-center mt-4">
            {/* <button
              onClick={() => {
                backToPagePrecedent();
              }}
              className={`  bg-gray-50 text-gray-800 text-sm- border-[0.02rem] border-gray-300 text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
            >
              <IoArrowBack className="text-xl" />
              <p className="hidden md:block">Retour</p>
            </button>{" "} */}
            <button
              onClick={() => {
                setShowCreateNewDevicePage(true);
                setDocumentationPage("Ajouter_nouveau_appareil");
                // if (!currentSelectedUserToConnect) {
                //   setChooseOtherAccountGestion(true);
                //   setShowChooseUserMessage(true);
                //   setShowCreateNewDevicePage(true);
                //   setShowUserGroupeCategorieSection(false);
                //   setShowUserGroupeCategorieSection(false);
                //   setShowUserListeToSelectDevice(true);
                // }
              }}
              className="bg-orange-500 w-full shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <span className="flex justify-center items-center gap-3 ">
                <FaUserPlus className="text-2xl" />
                <span className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                  <span className="hidden md:inline">Ajouter un</span> Nouveau
                  Appareil
                </span>
              </span>
            </button>{" "}
            {/* <button
              onClick={() => setShowAccountOptionsPopup(true)}
              className={`  bg-gray-50 text-gray-800 text-sm- border-[0.02rem] border-gray-300 text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
            >
              <p className="hidden md:block">Options</p>
              <IoOptions className="text-xl" />
            </button>{" "} */}
          </div>

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
              <span>{deviceListeTitleGestion || "Tous les Appareils"}</span>
            </h3>
            <FaChevronDown />
          </div>
        </div>

        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}

          {listeGestionDesVehicules?.length > 0 ? (
            listeGestionDesVehicules?.map((device, index) => {
              return (
                <div
                  onClick={() => {
                    // setCurrentSelectedDeviceGestion(device);
                    console.log(device);
                    console.log(currentAccountSelected);
                    console.log(currentSelectedUserToConnect);
                  }}
                  key={index}
                  className="shadow-lg bg-orange-50/50 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4"
                >
                  <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                    {index + 1}
                  </div>
                  <div className="flex  gap-3  ">
                    <FaCar className="text-[3rem] text-orange-500 md:mr-4" />
                    <div className=" w-full flex flex-wrap justify-between gap-x-4">
                      <div>
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">Description :</p>
                          <span className=" dark:text-orange-500 text-gray-600 pl-5">
                            {device?.description ||
                              device?.displayName ||
                              "Pas de nom disponible"}
                          </span>
                        </div>{" "}
                        {/* <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">Groupe :</p>
                          <span className=" dark:text-orange-500 text-gray-600 pl-5">
                            {device?.groupeID || "Défaut"}
                          </span>
                        </div>{" "} */}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">Dernière mise a jour :</p>
                          <span className=" dark:text-orange-500 text-gray-600 pl-5">
                            {FormatDateHeure(device?.lastUpdateTime).date}
                            <span className="px-2">/</span>{" "}
                            {FormatDateHeure(device?.lastUpdateTime).time}
                          </span>
                        </div>{" "}
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
                            {/* {device?.lastOdometerKM.toFixed(0)} */}
                            {device?.lastOdometerKM &&
                            !isNaN(Number(device?.lastOdometerKM))
                              ? Number(device?.lastOdometerKM).toFixed(0) +
                                " km"
                              : "Non disponible"}{" "}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold">Numéro de la carte SIM :</p>
                          <span className=" dark:text-orange-500 text-gray-600 pl-5">
                            50941070132
                            {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end md:mr-10-- md:flex-col mt-6 sm:max-w-[25rem] gap-3 md:mt-3 justify-between-- items-center ">
                    <button
                      onClick={() => {
                        // setEditAccountGestion(true);
                        setCurrentSelectedDeviceGestion(device);

                        setShowModifyNewDevicePage(true);
                        setShowUserGroupeCategorieSection(false);
                        setDocumentationPage("Modifier_appareil");
                      }}
                      className="bg-gray-50 border border-gray-400 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-2 pl-2.5 pr-1.5 flex justify-center items-center"
                    >
                      <p className="text-sm mr-2">Modifier</p>

                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSelectedDeviceGestion(device);

                        setDeleteAccountPopup(true);
                      }}
                      className={`${
                        true
                          ? " bg-red-500 text-white"
                          : "text-red-600 border-[0.02rem] border-red-500 "
                      }   text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-2 px-2 flex justify-center items-center`}
                    >
                      <p className="text-sm mr-2">Supprimer</p>

                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              Pas de résultat
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

// export default ListeDesVehiculesGestion

// export default ListeDesVehiculesGestion
