import React, { useContext, useState } from "react";
import {
  IoArrowBack,
  IoChevronBackCircleOutline,
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
  FaUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
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

  return (
    <div>
      <GestionAccountOptionPopup />

      {seConnecterAutreComptePopup && (
        <div className="fixed  z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            // onSubmit={handlePasswordCheck}
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
                  //   setSeConnecterAutreComptePopup(false);
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
        <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-lg text-center font-bold ">
          foodforthepoor{" "}
        </h3>
        <div className="flex gap-2 justify-center mt-4">
          <Link
            to="/gestion_des_comptes?tab=comptes"
            className={`  bg-gray-50 text-gray-800 text-sm- border-[0.02rem] border-gray-300 text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
          >
            <IoArrowBack className="text-xl" />
            <p className="hidden md:block">Retour</p>
          </Link>{" "}
          <Link className="bg-orange-500 shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6">
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

        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}
          <div className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4">
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nom Utilisateur :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}
                      monitoring
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nombre d'Appareils :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}5
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Date de creation :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      12-03-2024
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).date} */}
                      <span className="px-3">-</span>
                      12:00 PM
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
              {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
              {/* )} */}
              <Link
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
              </button>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4">
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nom Utilisateur :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}
                      monitoring
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nombre d'Appareils :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}5
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Date de creation :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      12-03-2024
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).date} */}
                      <span className="px-3">-</span>
                      12:00 PM
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
              {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
              {/* )} */}
              <Link
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
              </button>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4">
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nom Utilisateur :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}
                      monitoring
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nombre d'Appareils :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}5
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Date de creation :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      12-03-2024
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).date} */}
                      <span className="px-3">-</span>
                      12:00 PM
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
              {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
              {/* )} */}
              <Link
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
              </button>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4">
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nom Utilisateur :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}
                      monitoring
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nombre d'Appareils :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}5
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Date de creation :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      12-03-2024
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).date} */}
                      <span className="px-3">-</span>
                      12:00 PM
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
              {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
              {/* )} */}
              <Link
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
              </button>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div className="shadow-lg bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4">
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nom Utilisateur :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}
                      monitoring
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Nombre d'Appareils :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      {/* {geozone?.description} */}5
                    </span>
                  </div>{" "}
                  <div className="flex flex-wrap">
                    <p className="font-bold">Date de creation :</p>
                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                      12-03-2024
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).date} */}
                      <span className="px-3">-</span>
                      12:00 PM
                      {/* {FormatDateHeure(geozone?.lastUpdateTime).time} */}
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
              {/* {isActive && geozone?.isActive === (0 || 1) && ( */}
              {/* )} */}
              <Link
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
              </button>
            </div>
          </div>
          {/*  */}
        </div>
      </div>

      {supprimerGeozonePopup && (
        <div className="fixed inset-0 z-10">
          <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
            {/* <!-- overlay --> */}
            <div className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"></div>

            {/* <!-- Modal --> */}
            <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
              <div className="w-full py-2 bg-white cursor-default pointer-events-auto ---dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                <div className="space-y-2 p-2">
                  <div className="p-4 space-y-2 text-center ---dark:text-white">
                    <h2
                      className="text-xl font-bold tracking-tight"
                      id="page-action.heading"
                    >
                      {isCurrentGeozoneActive ? "Supprimer" : "Désactiver"}
                    </h2>

                    <p className="text-gray-500">
                      Êtes-vous sûr de{" "}
                      {isCurrentGeozoneActive ? "Supprimer" : "Désactiver"} le
                      geozone ? ?
                    </p>
                    <p className="text-red-500 font-semibold">
                      {currentGeozone?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="border-t ---dark:border-gray-700 px-2"></div>

                  <div className="px-6 py-2">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                      <button
                        onClick={() => {
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 ---dark:bg-gray-800 ---dark:hover:bg-gray-700 ---dark:border-gray-600 ---dark:hover:border-gray-500 ---dark:text-gray-200 ---dark:focus:text-primary-400 ---dark:focus:border-primary-400 ---dark:focus:bg-gray-800"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">Annuler</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          //   supprimerOuModifierGeozone();
                          //   setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">
                            {isCurrentGeozoneActive
                              ? "Supprimer"
                              : "Désactiver"}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeDesUtilisateur;

// export default ListeDesUtilisateur
