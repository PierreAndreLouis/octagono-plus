import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { PiIntersectThreeBold } from "react-icons/pi";

import { FaCar, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function GestionUserOptionsPopup({
  setShowModifyUserPage,
  setDocumentationPage,
  isCreatingNewElement,
  setIsCreatingNewElement,
}) {
  const {
    currentSelectedUserToConnect,
    showSelectedUserOptionsPopup,
    setShowSelectedUserOptionsPopup,
    setListeGestionDesVehicules,
    setDeviceListeTitleGestion,
    setListeGestionDesGroupeTitre,
    setListeGestionDesGroupe,
    deleteUSerEnGestionAccount,
    currentAccountSelected,
    gestionAccountData,
    adminPassword,
    setFilteredColorCategorieListe,
  } = useContext(DataContext);
  const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [errorIncorrectPassword, setErrorIncorrectPassword] = useState("");

  const setUserDeviceListeFonction = () => {
    const foundAccount = gestionAccountData?.find(
      (acct) => acct?.accountID === currentSelectedUserToConnect?.accountID
    );

    const foundUser = foundAccount?.accountUsers?.find(
      (u) => u?.userID === currentSelectedUserToConnect?.userID
    );

    // ✅ présents dans les deux
    const dansAllDevice = foundUser?.userDevices?.filter((g) =>
      foundAccount?.accountDevices?.some((d) => d.deviceID === g.deviceID)
    );

    // ❌ présents dans foundUser?.userDevices? mais pas dans foundAccount?.accountDevices
    const pasDansAllDevice = foundUser?.userDevices?.filter(
      (g) =>
        !foundAccount?.accountDevices.some((d) => d.deviceID === g.deviceID)
    );

    setListeGestionDesVehicules(dansAllDevice);
  };

  const deleteUSerEnGestionAccountFonction = (e) => {
    e.preventDefault();
    if (
      inputPassword === adminPassword ||
      inputPassword ===
        JSON.parse(localStorage.getItem("userPersonnelData"))?.gender ||
      inputPassword ===
        JSON.parse(localStorage.getItem("userAdminPersonnelData"))?.gender
    ) {
      setDeleteAccountPopup(false);

      deleteUSerEnGestionAccount(
        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedUserToConnect?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedUserToConnect?.accountID
          )?.password,
        currentSelectedUserToConnect?.userID
      );
    } else {
      setErrorIncorrectPassword(`${t("Mot de passe incorrect")}`);
    }
  };

  return (
    <div>
      {deleteAccountPopup && (
        <div className="fixed  z-[9999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={deleteUSerEnGestionAccountFonction}
            className="bg-white relative pt-14 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              {t("Voulez-vous Supprimer l'utilisateur")} ?
            </div>
            <div>
              <span className="w-full text-center font-bold text-xl flex justify-center mb-3 ">
                {currentSelectedUserToConnect?.description}
              </span>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                {t("Veuillez entrer votre mot de passe")}
              </label>
              <p className="text-center text-red-500 px-4">
                {errorIncorrectPassword}
              </p>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={`${t("Mot de passe")}`}
                  required
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setErrorIncorrectPassword("");
                  }}
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

      {showSelectedUserOptionsPopup && (
        <div className="fixed flex justify-center items-center z-[9999999999999999999] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[100vw]  max-w-[40rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setShowSelectedUserOptionsPopup(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div
              onClick={() => {
                console.log(gestionAccountData);
              }}
              className="h-20--  bg-orange-100 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2"
            >
              <h1 className="px-3 mt-4 mb-2--">
                {t("Options de l'utilisateur")}
              </h1>
              <h2 className="px-3 notranslate mt-8-- text-orange-600 mb-4">
                {currentSelectedUserToConnect?.description || "---"}
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6 pb-10">
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}

              <Link
                onClick={() => {
                  setTimeout(() => {
                    setFilteredColorCategorieListe(null);
                    setUserDeviceListeFonction();

                    // setListeGestionDesVehicules(
                    //   currentSelectedUserToConnect?.userDevices
                    // );

                    setDeviceListeTitleGestion(
                      `${t("Utilisateur")} : ` +
                        currentSelectedUserToConnect?.description
                    );

                    setShowSelectedUserOptionsPopup(false);
                    setDocumentationPage("Gestion_des_appareils");
                    navigate("/Gestion_des_appareils");
                  }, 100);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaCar className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Liste des Appareils")}
                </h2>
              </Link>
              {/*  */}
              {/*  */}
              {/*  */}
              <button
                onClick={() => {
                  setTimeout(() => {
                    setListeGestionDesGroupe(
                      gestionAccountData
                        .find(
                          (account) =>
                            account.accountID ===
                            currentSelectedUserToConnect?.accountID
                        )
                        ?.accountGroupes?.filter((g) =>
                          currentSelectedUserToConnect?.userGroupes?.some(
                            (u) => u.groupID === g.groupID
                          )
                        )
                    );

                    console.log(
                      "Liste 11111111",
                      currentSelectedUserToConnect?.userGroupes
                    );
                    console.log(
                      "Liste 222222222",
                      gestionAccountData
                        .find(
                          (account) =>
                            account.accountID ===
                            currentSelectedUserToConnect?.accountID
                        )
                        ?.accountGroupes?.filter((g) =>
                          currentSelectedUserToConnect?.userGroupes?.some(
                            (u) => u.groupID === g.groupID
                          )
                        )
                    );

                    setListeGestionDesGroupeTitre(
                      currentSelectedUserToConnect?.description
                    );

                    setShowSelectedUserOptionsPopup(false);
                    setDocumentationPage("Gestion_des_groupes");
                    navigate("/Gestion_des_groupes");
                  }, 100);
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <PiIntersectThreeBold className="text-[1.6rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Groupe affecté")}
                </h2>
              </button>
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => {
                  setIsCreatingNewElement(false);
                  setShowSelectedUserOptionsPopup(false);
                  setDocumentationPage("Modifier_utilisateur");
                  navigate("/Modifier_utilisateur");
                }}
                className="shadow-md cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-900 bg-orange-50/50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaEdit className="text-[1.5rem] min-w-8 text-orange-400 dark:text-orange-50" />
                <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                  {t("Modifier l'utilisateur")}
                </h2>
              </div>
              <div
                onClick={() => {
                  setDeleteAccountPopup(true);
                  setShowSelectedUserOptionsPopup(false);
                }}
                className="shadow-md cursor-pointer hover:bg-red-100 dark:hover:bg-gray-900 bg-red-50 dark:bg-gray-800 p-2 rounded-md flex items-center gap-4"
              >
                <FaTrashAlt className="text-[1.7rem] min-w-8 text-red-500 dark:text-red-50" />
                <h2 className="font-semibold text-red-900 dark:text-red-50">
                  {t("Supprimer l'utilisateur")}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUserOptionsPopup;

// export default GestionUserOptionsPopup
