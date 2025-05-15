import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { PiIntersectThreeBold } from "react-icons/pi";

import { FaCar, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import { MdPassword, MdSwitchAccount } from "react-icons/md";

function GestionAccountOptionPopup({
  setShowModifyAccountPagePopup,
  setDocumentationPage,
  showCreateNewDevicePage,
  setShowCreateNewDevicePage,
}) {
  const {
    showAccountOptionsPopup,
    setShowAccountOptionsPopup,
    setCurrentAccountSelected,
    currentAccountSelected,
    listeGestionDesVehicules,
    setListeGestionDesVehicules,
    deviceListeTitleGestion,
    setDeviceListeTitleGestion,
    listeGestionDesGroupe,
    setListeGestionDesGroupe,
    listeGestionDesGroupeTitre,
    setListeGestionDesGroupeTitre,
    deleteAccountEnGestionAccountFonction,
    account,
    username,
    password,
    comptes,
    scrollToTop,
  } = useContext(DataContext);
  const navigate = useNavigate(); // ✅ OK ici

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [inputPassword, setInputPassword] = useState("");

  const deleteAccountFonction = (e) => {
    e.preventDefault();
    if (inputPassword === password) {
      console.log("account : ", account);
      console.log("user :", username);
      console.log("password : ", password);
      console.log(
        "ID du compte a supprimer",
        currentAccountSelected?.accountID
      );

      // deleteAccountEnGestionAccountFonction(account, username, password, currentAccountSelected?.accountID)

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
              Voulez-vous Supprimer le compte :<br /> "
              {currentAccountSelected?.description}" ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg mt-6 text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
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
              Voulez-vous Modifier le compte ?
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

      {showAccountOptionsPopup && (
        <div className="fixed flex justify-center items-center z-[9999999999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[80vw] max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowAccountOptionsPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1
                onClick={() => {
                  console.log(currentAccountSelected);
                }}
                className="px-3 mt-4 mb-2--"
              >
                Options du compte
              </h1>
              <h2 className="px-3 mt-8-- text-orange-600 mb-4">
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
                // to="/liste_des_utilisateurs"
                onClick={() => {
                  setDocumentationPage("Gestion_des_utilisateurs");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 dark:text-white p-2 rounded-md flex items-center gap-4"
              >
                <FaUsers className="text-[1.62rem] text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Gestion des utilisateurs
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                // to="/liste_des_vehicules"

                onClick={() => {
                  setTimeout(() => {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                    setDeviceListeTitleGestion("Tous les Appareils");
                    setDocumentationPage("Gestion_des_appareils");
                  }, 200);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaCar className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Gestion des Appareils
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                // to="/liste_des_groupes"
                onClick={() => {
                  setListeGestionDesGroupe(
                    currentAccountSelected?.accountGroupes
                  );
                  setListeGestionDesGroupeTitre("Tous les groupes");
                  setDocumentationPage("Gestion_des_groupes");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <PiIntersectThreeBold className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Gestion des Groupes
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => {
                  // setEditAccountGestion(true);
                  // setShowModifyAccountPagePopup(true);
                  setDocumentationPage("Modifier_compte");
                  // Modifier_compte
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaEdit className="text-[1.5rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  Modifier le compte
                </h2>
              </div>
              <div
                onClick={() => {
                  setDeleteAccountPopup(true);
                }}
                // onClick={() => lancerAppel(currentVéhicule?.simPhoneNumber)}
                className="shadow-md cursor-pointer hover:bg-red-100 dark:hover:bg-gray-900 bg-red-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaTrashAlt className="text-[1.7rem] min-w-8 text-red-500 dark:text-red-50" />
                <h2 className="font-semibold text-red-900 dark:text-red-50">
                  Supprimer le compte
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

export default GestionAccountOptionPopup;
