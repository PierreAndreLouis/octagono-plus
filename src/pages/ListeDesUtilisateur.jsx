import React, { useContext, useState } from "react";
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
  FaChevronDown,
  FaPlusCircle,
  FaRegEdit,
  FaTrashAlt,
  FaUserAlt,
  FaUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import GestionUserOptionsPopup from "../components/gestion_des_comptes/GestionUserOptionsPopup";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

function ListeDesUtilisateur() {
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
    password,
    setCurrentAccountSelected,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
    handleLogout,
    handleLogin,
    resetIndexedDB,
    setGestionAccountData,
    setShowSelectedUserOptionsPopup,
    listeGestionDesVehicules,
    setListeGestionDesVehicules,
    gestionAccountData,
    backToPagePrecedent,
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

  const [seConnecterAutreComptePopup, setSeConnecterAutreComptePopup] =
    useState(false);
  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [inputPassword, setInputPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting
    console.log("Clicked......");

    if (inputPassword === password) {
      console.log("Clicked...... 222");

      // resetIndexedDB();
      // localStorage.removeItem("gestionAccountData");
      // setGestionAccountData(null);

      handleLogin(
        currentSelectedUserToConnect?.accountID,
        currentSelectedUserToConnect?.userID,
        currentSelectedUserToConnect?.password
      );
    } else {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
    useState(false);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? gestionAccountData.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : gestionAccountData;

  return (
    <div>
      <GestionAccountOptionPopup />
      <GestionUserOptionsPopup />

      {seConnecterAutreComptePopup && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-orange-600 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous changer de Compte ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
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

                    setErrorMessage("");
                  }}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                onClick={() => {
                  // setSeConnecterAutreComptePopup(false);
                  //   changerDeCompte();
                }}
                className="py-1 px-5 bg-orange-500 rounded-lg text-white"
              >
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setSeConnecterAutreComptePopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}

      {deleteAccountPopup && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            // onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous Supprimer l'Utilisateur ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
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
              {/* {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )} */}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                onClick={() => {
                  //   setDeleteAccountPopup(false);
                }}
                className="py-1 px-5 bg-red-500 rounded-lg text-white"
              >
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setDeleteAccountPopup(false);
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
              Voulez-vous Modifier l'utilisateur ?
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40">
          <div className="bg-white overflow-hidden w-full mx-4 max-w-[40rem] min-h-[70vh] rounded-lg">
            <div className="relative">
              <h2 className="text-center font-semibold text-lg bg-orange-100 py-4">
                Liste des Comptes
              </h2>

              <IoClose
                onClick={() => {
                  setChooseOtherAccountGestion(false);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>
            <div className="flex mx-3 my-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder="Rechercher un compte"
                value={searchInputTerm}
                onChange={(e) => {
                  setSearchInputTerm(e.target.value);
                }}
                // value={searchQueryListPopup}
                // onChange={handleSearchChange}
              />
              {/* <Tooltip
                        title="Réinitialiser le filtrer par catégorie
                      "
                        PopperProps={{
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, 0], // Décalage horizontal et vertical
                              },
                            },
                          ],
                        }}
                      > */}
              <p
                onClick={() => {
                  // setTilterSearchVehiculePopupByCategorie("all");
                  // setSearchQueryListPopup("");
                }}
                className="border cursor-pointer bg-gray-50 font-semibold  rounded-lg px-2 py-1.5"
              >
                Rechercher
              </p>
              {/* </Tooltip> */}
            </div>
            <div className="flex overflow-auto h-[45vh] pb-20 flex-col gap-4 mx-3">
              {/*  */}
              {filterGestionAccountData?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentAccountSelected(account);
                      setListeGestionDesVehicules(account?.accountDevices);
                      setChooseOtherAccountGestion(false);
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
                          {account?.description}
                        </span>{" "}
                      </p>
                      <p className="text-gray-600">
                        Nombre d'utilisateur :{" "}
                        <span className="font-bold">
                          {account?.accountUsers?.length}
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
      )}

      {/* <SuccèsÉchecMessagePopup
        message={succesCreateGeofencePopup}
        setMessage={setSuccesCreateGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de creation du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={succesModifierGeofencePopup}
        setMessage={setSuccesModifierGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de modification du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={succesDeleteGeofencePopup}
        setMessage={setSuccesDeleteGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de suppression du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={errorDeleteGeofencePopup}
        setMessage={setErrorDeleteGeofencePopup}
        véhiculeData={null}
        composant_from={"échec de la suppression du geozone"}
      /> */}

      <div className="px-4 pb-40">
        <h2 className="mt-[10rem] text-2xl text-gray-700 text-center font-bold ">
          Liste des Utilisateur
        </h2>
        {/* <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-lg text-center font-bold ">
          {currentAccountSelected?.description}
        </h3> */}
        <h3 className=" text-orange-600 mb-10 text-md text-center font-bold-- ">
          <span className="text-gray-700">Compte :</span>{" "}
          {currentAccountSelected?.description}
        </h3>
        {/* <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
          {currentSelectedUserToConnect?.description && (
            <span className="text-gray-700">Utilisateur :</span>
          )}{" "}
          {currentSelectedUserToConnect?.description}
        </h3> */}
        <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
          <div className="flex    gap-2 justify-between mt-4">
            <button
              // to="/gestion_des_comptes?tab=comptes"
              onClick={() => {
                backToPagePrecedent();
              }}
              className={`  bg-gray-50 text-gray-800 text-sm- border-[0.02rem] border-gray-300 text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
            >
              <IoArrowBack className="text-xl" />
              <p className="hidden md:block">Retour</p>
            </button>{" "}
            <Link className="bg-orange-500 w-full shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6">
              <div className="flex justify-center items-center gap-3 ">
                <FaUserPlus className="text-2xl" />
                <p className="text-sm md:text-lg text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                  <span className="hidden md:inline">Ajouter un</span> nouveau
                  utilisateur
                </p>
              </div>
            </Link>{" "}
            <button
              onClick={() => setShowAccountOptionsPopup(true)}
              className={`  bg-gray-50 text-gray-800 text-sm- border-[0.02rem] border-gray-300 text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
            >
              <p className="hidden md:block">Options</p>
              <IoOptions className="text-xl" />
            </button>{" "}
          </div>
          <div
            onClick={() => {
              setChooseOtherAccountGestion(true);
            }}
            className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
          >
            <h3 className="w-full text-center font-semibold">
              {/* Compte: */}
              <span>{currentAccountSelected?.description}</span>
            </h3>
            <FaChevronDown />
          </div>
        </div>
        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}
          {currentAccountSelected?.accountUsers?.map((user, index) => {
            return (
              <div
                onClick={() => {
                  console.log("User:", user);
                  setCurrentSelectedUserToConnect(user);
                  setListeGestionDesVehicules(user?.userDevices);
                }}
                key={index}
                className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
              >
                <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                  {index + 1}
                </div>
                <div className="flex  gap-3  ">
                  <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
                  <div className=" w-full flex flex-wrap justify-between gap-x-4">
                    <div>
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Nom Utilisateur :
                        </p>
                        <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                          {/* {geozone?.description} */}
                          {user?.description}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Nombre d'Appareils :
                        </p>
                        <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                          {user?.userDevices?.length}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Dernière connexion :
                        </p>
                        <span className=" dark:text-orange-500 text-gray-600 pl-5">
                          {FormatDateHeure(user?.lastLoginTime).date}

                          <span className="px-3">-</span>
                          {FormatDateHeure(user?.lastLoginTime).time}
                        </span>
                      </div>{" "}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
                  {" "}
                  <button
                    onClick={() => {
                      setSeConnecterAutreComptePopup(true);
                    }}
                    className={`${
                      true
                        ? " bg-gray-50 text-gray-800"
                        : "text-gray-800 border-[0.02rem] border-gray-50 "
                    }   text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                  >
                    <p>Login</p> <IoMdLogIn className="text-xl" />
                  </button>
                  <button
                    onClick={() => {
                      setShowSelectedUserOptionsPopup(true);
                    }}
                    className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                  >
                    <p>Options</p> <IoOptions className="text-xl" />
                  </button>
                  {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
                  {/* )} */}
                  {/* <Link
                    onClick={() => {
                      setEditAccountGestion(true);
                    }}
                    className="bg-gray-50 border border-gray-400 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-2 pl-2.5 pr-1.5 flex justify-center items-center"
                  >
                    <FaRegEdit />
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteAccountPopup(true);
                    }}
                    className={`${
                      true
                        ? " bg-red-500 text-white"
                        : "text-red-600 border-[0.02rem] border-red-500 "
                    }   text-sm- w-[50%] text-lg md:w-full font-semibold rounded-lg py-2 px-2 flex justify-center items-center`}
                  >
                    <FaTrashAlt />
                  </button> */}
                </div>
              </div>
            );
          })}

          {/*  */}
          {/*  */}

          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default ListeDesUtilisateur;

// export default ListeDesUtilisateur
