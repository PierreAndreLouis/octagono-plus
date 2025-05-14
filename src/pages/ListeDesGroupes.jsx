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
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { PiIntersectThreeBold } from "react-icons/pi";
import CreateNewGroupeGestion from "../components/gestion_des_comptes/CreateNewGroupeGestion";
import ModifyGroupeGestion from "../components/gestion_des_comptes/ModifyGroupeGestion";
import GestionGroupeOptionPopup from "../components/gestion_des_comptes/GestionGroupeOptionPopup";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

function ListeDesGroupes({ setDocumentationPage }) {
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
    backToPagePrecedent,
    currentSelectedGroupeGestion,
    setCurrentSelectedGroupeGestion,
    accountGroupes,
    deleteGroupeEnGestionAccount,
    password,
    successAddVéhiculePopup,
    setSuccessAddVéhiculePopup,
    errorAddVéhiculePopup,
    setErrorAddVéhiculePopup,
    successModifierVéhiculePopup,
    setSuccessModifierVéhiculePopup,
    errorModifierVéhiculePopup,
    setErrorModifierVéhiculePopup,
    successDeleteVéhiculePopup,
    setSuccessDeleteVéhiculePopup,
    errorDeleteVéhiculePopup,
    setErrorDeleteVéhiculePopup,
    listeGestionDesGroupe,
    setListeGestionDesGroupe,
    listeGestionDesGroupeTitre,
    setListeGestionDesGroupeTitre,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
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

  const geozoneID =
    currentGeozone?.geozoneID ||
    `${currentGeozone?.description?.toLowerCase().replace(/\s+/g, "_")}`;

  const supprimerOuModifierGeozone = () => {
    // activerOuDesactiverGeofence(geozoneID, 0);

    if (isCurrentGeozoneActive && currentGeozone?.isActive === (0 || 1)) {
      supprimerGeofence(geozoneID);
    }

    if (
      (isCurrentGeozoneActive || !isCurrentGeozoneActive) &&
      currentGeozone?.isActive === 0
    ) {
      // activerOuDesactiverGeofence(geozoneID, 1);
    }

    if (!isCurrentGeozoneActive && currentGeozone?.isActive === 1) {
      // activerOuDesactiverGeofence(geozoneID, 0);
    }
  };

  const [deleteGroupeAccountPopup, setDeleteGroupeAccountPopup] =
    useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [showCreateNewGroupePage, setShowCreateNewGroupePage] = useState(false);
  const [showModifyNewGroupePage, setShowModifyNewGroupePage] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const [errorPassord, setErrorPassord] = useState("");

  const handlePasswordCheck = (e) => {
    e.preventDefault();
    if (inputPassword === password) {
      console.log(
        currentAccountSelected?.accountID,
        "admin",
        currentAccountSelected?.password,
        currentSelectedGroupeGestion?.groupID
      );
      deleteGroupeEnGestionAccount(
        currentAccountSelected?.accountID,
        "admin",
        currentAccountSelected?.password,
        currentSelectedGroupeGestion?.groupID
      );
      setDeleteGroupeAccountPopup(false);
    } else {
      setErrorPassord("Mot de passe incorrect");
    }
  };

  const [showSelectedGroupeOptionsPopup, setShowSelectedGroupeOptionsPopup] =
    useState(false);

  useEffect(() => {
    console.log(
      "showSelectedGroupeOptionsPopup",
      showSelectedGroupeOptionsPopup
    );
  }, [showSelectedGroupeOptionsPopup]);

  useEffect(() => {
    console.log(
      "currentSelectedGroupeGestion +++++++++++++",
      currentSelectedGroupeGestion
    );
  }, [currentSelectedGroupeGestion]);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? currentAccountSelected?.accountUsers?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : currentAccountSelected?.accountUsers;

  const [showChooseOtherUserGroupePopup, setShowChooseOtherUserGroupePopup] =
    useState(false);

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />
      {/* {showCreateNewGroupePage && (
        <CreateNewGroupeGestion
          setShowCreateNewGroupePage={setShowCreateNewGroupePage}
        />
      )}

      {showModifyNewGroupePage && (
        <ModifyGroupeGestion
          setShowModifyNewGroupePage={setShowModifyNewGroupePage}
        />
      )} */}
      {/* Popup pour Message de succès */}
      <SuccèsÉchecMessagePopup
        message={successAddVéhiculePopup}
        setMessage={setSuccessAddVéhiculePopup}
        véhiculeData={null}
        composant_from={"succès ajout de Groupe"}
      />
      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorAddVéhiculePopup}
        setMessage={setErrorAddVéhiculePopup}
        véhiculeData={null}
        composant_from={"échec ajout la creation du groupe"}
      />
      <SuccèsÉchecMessagePopup
        message={successModifierVéhiculePopup}
        setMessage={setSuccessModifierVéhiculePopup}
        véhiculeData={null}
        composant_from={"succès modification de Groupe"}
      />
      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorModifierVéhiculePopup}
        setMessage={setErrorModifierVéhiculePopup}
        véhiculeData={null}
        composant_from={"échec modification du groupe"}
      />
      <SuccèsÉchecMessagePopup
        message={successDeleteVéhiculePopup}
        setMessage={setSuccessDeleteVéhiculePopup}
        véhiculeData={null}
        composant_from={"succès suppression de Groupe"}
      />
      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorDeleteVéhiculePopup}
        setMessage={setErrorDeleteVéhiculePopup}
        véhiculeData={null}
        composant_from={"échec suppression du groupe"}
      />

      {/* {showSelectedGroupeOptionsPopup && ( */}
      <GestionGroupeOptionPopup
        showSelectedGroupeOptionsPopup={showSelectedGroupeOptionsPopup}
        setShowSelectedGroupeOptionsPopup={setShowSelectedGroupeOptionsPopup}
        setDeleteGroupeAccountPopup={setDeleteGroupeAccountPopup}
        setDocumentationPage={setDocumentationPage}
      />
      {/* )} */}

      {showChooseOtherUserGroupePopup && (
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
                  setShowChooseOtherUserGroupePopup(false);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>

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

              <div className="flex overflow-auto h-[60vh] max-h-[55vh] pb-20 flex-col gap-4 mx-3">
                {/*  */}
                <button
                  onClick={() => {
                    {
                      setListeGestionDesGroupe(
                        currentAccountSelected?.accountGroupes
                      );
                      setListeGestionDesGroupeTitre("Tous les Groupes ");
                      setShowChooseOtherUserGroupePopup(false);
                    }
                  }}
                  className="font-bold bg-orange-50 rounded-lg py-2 shadow-lg shadow-black/10"
                >
                  Tous les Groupes
                </button>{" "}
                {filterGestionAccountData?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        // setTimeout(() => {
                        setListeGestionDesGroupe(user?.userGroupes);
                        setListeGestionDesGroupeTitre(user?.description);
                        setShowChooseOtherUserGroupePopup(false);
                        setCurrentSelectedUserToConnect(user);

                        // }, 500);
                        // console.log(user);
                        // setListeGestionDesVehicules(user?.userDevices);
                        // setCurrentSelectedUserToConnect(user);
                        // setChooseOtherAccountGestion(false);
                        // setDeviceListeTitleGestion(
                        //   "Utilisateur : " + user?.description
                        // );
                        // setShowChooseUserMessage(false);
                      }}
                      className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center rounded-lg py-2 px-2 "
                    >
                      <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                        {index + 1}
                      </p>
                      <FaUserCircle className="text-gray-500 text-[2.5rem]" />
                      <div>
                        <p className="text-gray-600">
                          Nom de l'utilisateur :{" "}
                          <span className="font-bold">{user?.description}</span>{" "}
                        </p>
                        <p className="text-gray-600">
                          Nombre de Groupes affectés :{" "}
                          <span className="font-bold">
                            {user?.userGroupes?.length}
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/*  */}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteGroupeAccountPopup && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous Supprimer le groupe ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              <p className="text-red-500 mx-4 text-center">{errorPassord}</p>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setErrorPassord("");
                  }}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button className="py-1 px-5 bg-red-500 rounded-lg text-white">
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setDeleteGroupeAccountPopup(false);
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
              Voulez-vous Modifier le groupe ?
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
      <div className="px-4 pb-40 pt-10 bg-white rounded-lg">
        <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
          Liste des groupes
        </h2>
        {/* <h3 className="mt-[10rem]-- mb-5 text-orange-600 text-lg text-center font-bold ">
          {currentAccountSelected?.description}
        </h3> */}
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
        <h3 className=" text-orange-600 text-md text-center font-bold-- ">
          {listeGestionDesGroupeTitre && (
            <span className="text-gray-700">Groupe :</span>
          )}{" "}
          {listeGestionDesGroupeTitre}
        </h3>
        <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
          <span className="text-gray-700">Nombre Appareil :</span>{" "}
          {listeGestionDesGroupe?.length}
        </h3>

        <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
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
            <div
              onClick={() => {
                // setShowCreateNewGroupePage(true);
                setDocumentationPage("Ajouter_nouveau_groupe");
              }}
              className="bg-orange-500 w-full cursor-pointer shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3 ">
                <FaUserPlus className="text-2xl" />
                <p className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                  <span className="hidden md:inline">Ajouter un</span> Nouveau
                  Groupe
                </p>
              </div>
            </div>{" "}
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
              setShowChooseOtherUserGroupePopup(true);

              // setChooseOtherAccountGestion(true);
              // setShowUserGroupeCategorieSection(true);
              // console.log(currentSelectedUserToConnect);
            }}
            className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
          >
            <h3 className="w-full text-center font-semibold">
              {/* Compte: */}
              <span>{listeGestionDesGroupeTitre || "Tous les Appareils"}</span>
            </h3>
            <FaChevronDown />
          </div>
        </div>
        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}
          {/*  */}
          {/*  */}

          {listeGestionDesGroupe?.length > 0 ? (
            listeGestionDesGroupe?.map((groupe, index) => {
              const userListeAffected =
                currentAccountSelected?.accountUsers?.filter((user) => {
                  const groupes = user?.userGroupes || [];
                  return groupes?.some(
                    (group) => group?.groupID === groupe?.groupID
                  );
                });

              return (
                <div
                  onClick={() => {
                    setCurrentSelectedGroupeGestion(groupe);
                  }}
                  key={index}
                  className="shadow-lg bg-orange-50/50 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4"
                >
                  <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                    {index + 1}
                  </div>
                  <div className="flex  gap-3  ">
                    <PiIntersectThreeBold className="text-[3rem] text-orange-500 md:mr-4" />
                    <div className=" w-full flex flex-wrap justify-between gap-x-4">
                      <div>
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            Nom du Groupe :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {/* {geozone?.description} */}
                            {groupe?.description}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            ID du Groupe :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {/* {geozone?.description} */}
                            {groupe?.groupID}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            Nombre d'appareil :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {groupe?.groupeDevices?.length}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            Nombre Utilisateurs affectés :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {userListeAffected?.length}
                            {/* {groupe?.groupeDevices?.length} */}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            Dernière mise a jour :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            21-04-2024 <span className="px-2">/</span> 05:34 PM
                          </span>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end md:mr-10-- sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
                    <button
                      onClick={() => {
                        setDocumentationPage("Modifier_groupe");
                        setCurrentSelectedGroupeGestion(groupe);
                        setShowModifyNewGroupePage(true);
                      }}
                      className="bg-gray-50 border border-gray-400 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-2 pl-2.5 pr-1.5 flex justify-center items-center"
                    >
                      <p className="text-sm mr-2">Modifier</p>
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => {
                        setTimeout(() => {
                          setCurrentSelectedGroupeGestion(groupe);
                        }, 500);
                        console.log(groupe);
                        setShowSelectedGroupeOptionsPopup(true);
                      }}
                      className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                    >
                      <p>Options</p> <IoOptions className="text-xl" />
                    </button>
                    {/* <button
                      onClick={() => {
                        setDeleteGroupeAccountPopup(true);
                        
                      }}
                      className={`${
                        true
                          ? " bg-red-500 text-white"
                          : "text-red-600 border-[0.02rem] border-red-500 "
                      }   text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-2 px-2 flex justify-center items-center`}
                    >
                      <p className="text-sm mr-2">Supprimer</p>

                      <FaTrashAlt />
                    </button> */}
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

export default ListeDesGroupes;

// export default ListeDesGroupes

// export default ListeDesGroupes

// export default ListeDesGroupes
