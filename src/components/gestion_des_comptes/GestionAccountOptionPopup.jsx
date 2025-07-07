import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";
import { PiIntersectThreeBold } from "react-icons/pi";
import { FaCar, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import { IoEarth } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function GestionAccountOptionPopup({ setDocumentationPage }) {
  const {
    showAccountOptionsPopup,
    setShowAccountOptionsPopup,
    currentAccountSelected,
    setListeGestionDesVehicules,
    setDeviceListeTitleGestion,
    setListeGestionDesGroupe,
    setListeGestionDesGroupeTitre,

    scrollToTop,
    setListeGestionDesGeofences,
    deleteAccountEnGestionAccountFonction,
    adminPassword,
  } = useContext(DataContext);
    const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [inputPassword, setInputPassword] = useState("");

  const deleteAccountFonction = (e) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      deleteAccountEnGestionAccountFonction(currentAccountSelected?.accountID);

      setDeleteAccountPopup(false);
    }
  };

  return (
    <div>
      {deleteAccountPopup && (
        <div className="fixed  z-[999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={deleteAccountFonction}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              {t("Voulez-vous Supprimer le compte")} :<br /> "
              <span className="notranslate">
                {currentAccountSelected?.description}" ?
              </span>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg mt-6 text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
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
              <button className="py-1 px-5 bg-red-500 rounded-lg text-white">
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

      {showAccountOptionsPopup && (
        <div className="fixed flex justify-center items-center z-[9999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[80vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowAccountOptionsPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1
                // onClick={() => {
                //   console.log(currentAccountSelected);
                // }}
                className="px-3 mt-4 mb-2--"
              >
                {t("Options du compte")}
              </h1>
              <h2 className="px-3 mt-8-- notranslate text-orange-600 mb-4">
                {currentAccountSelected?.description || "---"}
              </h2>
            </div>
            <div
              onClick={() => {
                setShowAccountOptionsPopup(false);

                scrollToTop();
              }}
              className="p-4 flex flex-col gap-4 py-6 pb-10--"
            >
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_utilisateurs");
                  navigate("/Gestion_des_utilisateurs");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 dark:text-white p-2 rounded-md flex items-center gap-4"
              >
                <FaUsers className="text-[1.62rem] text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Gestion des utilisateurs")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  setTimeout(() => {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                    setDeviceListeTitleGestion(`${t("Tous les Appareils")}`);
                    setDocumentationPage("Gestion_des_appareils");
                    navigate("/Gestion_des_appareils");
                  }, 200);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaCar className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Gestion des Appareils")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  setListeGestionDesGroupe(
                    currentAccountSelected?.accountGroupes
                  );
                  setListeGestionDesGroupeTitre(`${t("Tous les groupes")}`);
                  setDocumentationPage("Gestion_des_groupes");
                  navigate("/Gestion_des_groupes");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <PiIntersectThreeBold className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Gestion des Groupes")}
                </h2>
              </button>
              <button
                onClick={() => {
                  setListeGestionDesGeofences(
                    currentAccountSelected?.accountGeofences
                  );
                  // setListeGestionDesGroupeTitre("Tous les groupes");
                  setDocumentationPage("Gestion_geofences");
                  navigate("/Gestion_geofences");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <IoEarth className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Gestion des Geofences")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => {
                  setDocumentationPage("Modifier_compte");
                  navigate("/Modifier_compte");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaEdit className="text-[1.5rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Modifier le compte")}
                </h2>
              </div>
              <div
                onClick={() => {
                  setDeleteAccountPopup(true);
                }}
                className="shadow-md cursor-pointer hover:bg-red-100 dark:hover:bg-gray-900 bg-red-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaTrashAlt className="text-[1.7rem] min-w-8 text-red-500 dark:text-red-50" />
                <h2 className="font-semibold text-red-900 dark:text-red-50">
                  {t("Supprimer le compte")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAccountOptionPopup;
