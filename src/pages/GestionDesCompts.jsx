import React, { useContext, useState } from "react";
import { IoEarth } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import {
  FaCar,
  FaEdit,
  FaMicrophone,
  FaPlusCircle,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
// import { MdSwitchAccount  } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { TbLock, TbLockOpen } from "react-icons/tb";
import { MdSwitchAccount } from "react-icons/md";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

function GestionDesCompts() {
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
    TestDeRequetteAccounts,
    TestDeRequetteUsers,
    TestDeRequetteDevices,
    getAllAccountsData,
    gestionAccountData,
    currentAccountSelected,
    setCurrentAccountSelected,
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
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////
  //  /////////////////////////////////////////////////////

  //   const [showAccountOptionsPopup, setShowAccountOptionsPopup] = useState(false);

  return (
    <div>
      {account === "sysadmin" ? (
        <div>
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
            <h2
              onClick={() => {
                console.log(geofenceData);
              }}
              className="mt-[10rem] text-lg text-center font-bold "
            >
              Gestion Des Comptes
            </h2>
            <button
              onClick={() => {
                TestDeRequetteAccounts(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Test de requête Accounts
            </button>
            <br />
            {/* <button
              onClick={() => {
                TestDeRequetteUsers(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Test de requête Users
            </button>{" "}
            <br /> */}
            <button
              onClick={() => {
                TestDeRequetteDevices(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Test de requête Devices
            </button>{" "}
            <br />
            <button
              onClick={() => {
                getAllAccountsData(
                  "sysadmin",
                  "admin",
                  "OctagonoGPSHaitiAdmin13@1919"
                );
              }}
            >
              Tous les donnees regrouper
            </button>{" "}
            <br />
            {/* <button
              onClick={() => {
                console.log("gestionAccountData :", gestionAccountData);
              }}
            >
              Donnee gestionAccountData
            </button>{" "} */}
            {/* <button
              onClick={() => {
                console.log("currentAccountSelected :", currentAccountSelected);
              }}
            >
              currentAccountSelected
            </button>{" "} */}
            {/* <button
              onClick={() => {
                localStorage.removeItem("gestionAccountData");
              }}
            >
              localStorage.removeItem("gestionAccountData")
            </button> */}
            <div className="flex justify-center mt-4">
              <Link
                // to="/Groupe_vehicule_location?tab=localisation"
                onClick={() => {
                  //   setAjouterGeofencePopup(true);
                  //   setIsEditingGeofence(false);
                  //   setCurrentGeozone();
                }}
                className="bg-orange-500 shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
              >
                <div className="flex justify-center items-center gap-3">
                  <FaPlusCircle className="text-2xl" />
                  <p className="text-lg text-center">
                    Ajouter un nouveau Compte
                  </p>
                </div>
              </Link>{" "}
            </div>
            <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
              {/*  */}
              {gestionAccountData?.map((account, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentAccountSelected(account);
                      setShowAccountOptionsPopup(true);
                    }}
                    className="shadow-lg cursor-pointer bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                  >
                    <div className="bg-gray-100-- pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3  ">
                      <MdSwitchAccount className="text-[3rem] text-orange-500" />
                      <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                        <div>
                          <div className="flex flex-wrap">
                            <p className="font-bold- text-gray-700">
                              Nom du Compte :
                            </p>
                            <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                              {account?.description}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre d'utilisateurs :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountUsers?.length}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre d'appareils :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              ----
                            </span>
                          </div>{" "}
                          {/*  */}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Nombre de Groupe :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {account?.accountGroupes?.length}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex flex-wrap mt-1">
                            <p className="font-bold- text-gray-700">
                              Date de creation :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {FormatDateHeure(account?.creationTime).date}
                              <span className="px-3">-</span>
                              {FormatDateHeure(account?.creationTime).time}
                            </span>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/*  */}
            </div>
            {/*  */}
            <GestionAccountOptionPopup />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 justify-center items-center w-full min-h-screen">
          <h1 className="font-semibold text-2xl">
            Tu n'es pas autoriser a acceder a cette page
          </h1>
          <Link
            to="/home"
            className="px-4 py-2 rounded-lg text-white bg-orange-600"
          >
            Retour a la page d’accueil
          </Link>
        </div>
      )}
    </div>
  );
}

export default GestionDesCompts;

// export default GestionDesCompts
