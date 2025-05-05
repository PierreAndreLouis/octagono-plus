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
          className="mt-[6rem] text-lg text-center font-bold "
        >
          Gestion Des Comptes
        </h2>
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
              <p className="text-lg text-center">Ajouter un nouveau Compte</p>
            </div>
          </Link>{" "}
        </div>

        <div className="hidden-- flex mt-[2rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          <div
            onClick={() => setShowAccountOptionsPopup(true)}
            className="shadow-lg cursor-pointer bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
          >
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              1
            </div>
            <div className="flex  gap-3  ">
              <MdSwitchAccount className="text-[3rem] text-orange-500" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold-">Nom du Compte :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      admin
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'utilisateurs :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      3
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'appareils :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      6
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Date de creation :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      20-02-2025
                      <span className="px-3">-</span>
                      02:34 PM
                    </span>
                  </div>{" "}
                </div>
              </div>
            </div>
            {/* <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
              <button
                className={`${
                  true
                    ? " bg-red-500 text-white"
                    : "text-red-600 border-[0.02rem] border-red-500 "
                }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
              >
                Supprimer
              </button>
              <Link className="bg-gray-100 border border-gray-400 text-center w-[50%] md:w-full text-sm font-semibold rounded-lg py-1 px-4">
                Modifier
              </Link>
            </div> */}
          </div>
          {/*  */}
          <div
            onClick={() => setShowAccountOptionsPopup(true)}
            className="shadow-lg cursor-pointer bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
          >
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              2
            </div>
            <div className="flex  gap-3  ">
              <MdSwitchAccount className="text-[3rem] text-orange-500" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold-">Nom du Compte :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      foodforthepoor
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'utilisateurs :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      8
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'appareils :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      24
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Date de creation :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      18-05-2024
                      <span className="px-3">-</span>
                      06:32 PM
                    </span>
                  </div>{" "}
                </div>
              </div>
            </div>
            {/* <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
              <button
                className={`${
                  true
                    ? " bg-red-500 text-white"
                    : "text-red-600 border-[0.02rem] border-red-500 "
                }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
              >
                Supprimer
              </button>
              <Link className="bg-gray-100 border border-gray-400 text-center w-[50%] md:w-full text-sm font-semibold rounded-lg py-1 px-4">
                Modifier
              </Link>
            </div> */}
          </div>
          {/*  */}
          <div
            onClick={() => setShowAccountOptionsPopup(true)}
            className="shadow-lg cursor-pointer bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
          >
            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
              3
            </div>
            <div className="flex  gap-3  ">
              <MdSwitchAccount className="text-[3rem] text-orange-500" />
              <div className=" w-full flex flex-wrap justify-between gap-x-4 ">
                <div>
                  <div className="flex flex-wrap">
                    <p className="font-bold-">Nom du Compte :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      Lelevier
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'utilisateurs :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      6
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Nombre d'appareils :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      13
                    </span>
                  </div>{" "}
                  {/*  */}
                  <div className="flex flex-wrap mt-1">
                    <p className="font-bold-">Date de creation :</p>
                    <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                      12-06-2024
                      <span className="px-3">-</span>
                      05:21 PM
                    </span>
                  </div>{" "}
                </div>
              </div>
            </div>
            {/* <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
              <button
                className={`${
                  true
                    ? " bg-red-500 text-white"
                    : "text-red-600 border-[0.02rem] border-red-500 "
                }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
              >
                Supprimer
              </button>
              <Link className="bg-gray-100 border border-gray-400 text-center w-[50%] md:w-full text-sm font-semibold rounded-lg py-1 px-4">
                Modifier
              </Link>
            </div> */}
          </div>
        </div>

        {/*  */}

        <GestionAccountOptionPopup />
      </div>
    </div>
  );
}

export default GestionDesCompts;

// export default GestionDesCompts
