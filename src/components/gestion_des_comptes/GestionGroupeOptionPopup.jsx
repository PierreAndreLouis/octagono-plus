import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";

import { FaCar, FaRegEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function GestionGroupeOptionPopup({
  showSelectedGroupeOptionsPopup,
  setShowSelectedGroupeOptionsPopup,
  setDeleteGroupeAccountPopup,
  setDocumentationPage,
}) {
  const {
    setListeGestionDesVehicules,
    setDeviceListeTitleGestion,
    currentSelectedGroupeGestion,
    gestionAccountData,
    accountDevices,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  const navigate = useNavigate();

  const currentSelectedGroupeGestionDevices = () => {
    const foundGroupe = gestionAccountData
      ?.flatMap((account) => account.accountGroupes)
      ?.find((u) => u.groupID === currentSelectedGroupeGestion?.groupID);

    const deviceIDsInInfo = new Set(
      foundGroupe?.groupeDevices?.map((device) => device.deviceID)
    );

    const foundDeviceIDs = [];
    const notFoundDeviceIDs = [];

    deviceIDsInInfo.forEach((id) => {
      const isFound = accountDevices?.some((device) => device.deviceID === id);
      if (isFound) {
        foundDeviceIDs.push(id);
      } else {
        notFoundDeviceIDs.push(id);
      }
    });

    const updateListe = accountDevices?.filter((device) =>
      deviceIDsInInfo.has(device.deviceID)
    );

    setTimeout(() => {
      setListeGestionDesVehicules(updateListe);
    }, 500);
  };

  return (
    <div>
      {showSelectedGroupeOptionsPopup && (
        <div className="fixed flex justify-center items-center z-[199999999999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[100vw]  max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowSelectedGroupeOptionsPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1
                // onClick={() => {
                //   console.log(currentAccountSelected);
                // }}
                className="px-3 mt-4 mb-2--"
              >
                {t("Options du groupe")}
              </h1>
              <h2 className="px-3 notranslate mt-8-- text-orange-600 mb-4">
                {currentSelectedGroupeGestion?.description ||
                  currentSelectedGroupeGestion?.groupID ||
                  "---"}
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6 pb-10">
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  currentSelectedGroupeGestionDevices();
                  setDeviceListeTitleGestion(
                    "Groupe : " + currentSelectedGroupeGestion?.description
                  );
                  setShowSelectedGroupeOptionsPopup(false);
                  setDocumentationPage("Gestion_des_appareils");
                  navigate("/Gestion_des_appareils");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaCar className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Liste Les Appareils")}
                </h2>
              </button>

              <button
                onClick={() => {
                  setShowSelectedGroupeOptionsPopup(false);
                  setDocumentationPage("Gestion_des_utilisateurs");
                  navigate("/Gestion_des_utilisateurs");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaUsers className="text-[1.2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Liste des utilisateurs affectés")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  setShowSelectedGroupeOptionsPopup(false);

                  setDocumentationPage("Modifier_groupe");
                  navigate("/Modifier_groupe");
                  // setCurrentSelectedGroupeGestion(groupe);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaRegEdit className="text-[1.2rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Modifier le groupe")}
                </h2>
              </button>

              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <div
                onClick={() => {
                  setDeleteGroupeAccountPopup(true);
                  setShowSelectedGroupeOptionsPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-red-100 dark:hover:bg-gray-900 bg-red-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaTrashAlt className="text-[1.7rem] min-w-8 text-red-500 dark:text-red-50" />
                <h2 className="font-semibold text-red-900 dark:text-red-50">
                  {t("Supprimer le groupe")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionGroupeOptionPopup;
