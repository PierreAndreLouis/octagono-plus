import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { PiIntersectThreeBold } from "react-icons/pi";

import {
  FaCar,
  FaEdit,
  FaTrashAlt,
  FaUser,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

function GestionGroupeOptionPopup({
  showSelectedGroupeOptionsPopup,
  setShowSelectedGroupeOptionsPopup,
  setDeleteGroupeAccountPopup,
  setDocumentationPage,
}) {
  const {
    currentSelectedUserToConnect,

    setListeGestionDesVehicules,
    setDeviceListeTitleGestion,
    currentAccountSelected,
    currentSelectedGroupeGestion,
    setCurrentSelectedGroupeGestion,
  } = useContext(DataContext);
  const navigate = useNavigate();

  const currentSelectedGroupeGestionDevices = () => {
    console.log("currentSelectedGroupeGestion changer......");
    // Crée un Set des deviceID de deviceInfo pour une recherche rapide
    const deviceIDsInInfo = new Set(
      currentSelectedGroupeGestion?.groupeDevices?.map(
        (device) => device.deviceID
      )
    );

    // Filtre les éléments de deviceListe
    const updateListe = currentAccountSelected?.accountDevices?.filter(
      (device) => deviceIDsInInfo.has(device.deviceID)
    );

    console.log("updateListe", updateListe);

    setTimeout(() => {
      setListeGestionDesVehicules(updateListe);
    }, 500);
  };
  //   const [deleteAccountPopup, setDeleteGroupeAccountPopup] = useState(false);

  //   const [editAccountGestion, setEditAccountGestion] = useState(false);

  return (
    <div>
      {showSelectedGroupeOptionsPopup && (
        <div className="fixed flex justify-center items-center z-[199999999999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[80vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowSelectedGroupeOptionsPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1
                onClick={() => {
                  console.log(currentAccountSelected);
                }}
                className="px-3 mt-4 mb-2--"
              >
                Options du groupe
              </h1>
              <h2 className="px-3 mt-8-- text-orange-600 mb-4">
                {currentSelectedGroupeGestion?.description || "---"}
              </h2>
            </div>
            <div
              //   onClick={() => setShowSelectedGroupeOptionsPopup(false)}
              className="p-4 flex flex-col gap-4 py-6 pb-10"
            >
              {/* <Link
                to="/liste_des_vehicules"
                onClick={() => {
                  currentSelectedGroupeGestionDevices();
                  setDeviceListeTitleGestion(
                    "Groupe : " + currentSelectedGroupeGestion?.description
                  );
                  setShowSelectedGroupeOptionsPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaUserCircle className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Afficher Les Utilisateurs affectée
                </h2>
              </Link> */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                // to="/liste_des_vehicules"
                onClick={() => {
                  currentSelectedGroupeGestionDevices();
                  setDeviceListeTitleGestion(
                    "Groupe : " + currentSelectedGroupeGestion?.description
                  );
                  setShowSelectedGroupeOptionsPopup(false);
                  setDocumentationPage("Gestion_des_appareils");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaCar className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Afficher Les Appareils
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}

              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <div
                onClick={() => {
                  setDeleteGroupeAccountPopup(true);
                  setShowSelectedGroupeOptionsPopup(false);
                }}
                // onClick={() => lancerAppel(currentVéhicule?.simPhoneNumber)}
                className="shadow-md cursor-pointer hover:bg-red-100 dark:hover:bg-gray-900 bg-red-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaTrashAlt className="text-[1.7rem] min-w-8 text-red-500 dark:text-red-50" />
                <h2 className="font-semibold text-red-900 dark:text-red-50">
                  Supprimer le groupe
                </h2>
              </div>
              {/* callError, setCallError, lancerAppel, */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionGroupeOptionPopup;

// export default GestionGroupeOptionPopup

// export default GestionGroupeOptionPopup
