import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";

import { useTranslation } from "react-i18next";

function InfoUserComponent({
  account,
  username,
  setLogOutPopup,

  adminUserData,
}) {
  const {
    adminAccount,
    adminUsername,
    resetIndexedDB,
    currentCountry,
    versionApplication,
    isDashboardHomePage,
    sendGMailConfirmation,
    userData,
    currentAccountSelected,
    comptes,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  let timezone;
  let contactEmail;
  let contactPhone;
  let addressCity;
  let addressCountry;
  if (!isDashboardHomePage) {
    timezone = userData?.timeZone;
    contactEmail = userData?.contactEmail;
    addressCity = userData?.addressCity;
    addressCountry = userData?.addressCountry;
  } else if (isDashboardHomePage && currentAccountSelected) {
    timezone = currentAccountSelected?.timeZone;
    contactPhone = currentAccountSelected?.contactPhone;
    addressCity = currentAccountSelected?.addressCity;
    addressCountry = currentAccountSelected?.addressCountry;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    timezone = comptes?.find(
      (acct) => acct?.accountID === "sysadmin"
    )?.timeZone;
    contactPhone = comptes?.find(
      (acct) => acct?.accountID === "sysadmin"
    )?.contactPhone;
    addressCity = comptes?.find(
      (acct) => acct?.accountID === "sysadmin"
    )?.addressCity;
    addressCountry = comptes?.find(
      (acct) => acct?.accountID === "sysadmin"
    )?.addressCountry;
  }

  const [redemarerApplication, setRedemarerApplication] = useState(false);

  let body_bg = "bg-red-50";
  let header_bg = "bg-red-600";
  let button_bg = "bg-red-500";
  let text_color = "text-red-600";
  // setUsername
  return (
    <div className="bg-white rounded-lg">
      {/* Section de l'icône utilisateur */}
      <div
        onClick={() => {
          console.log("xxxxxxx");
          // sendGMailConfirmation("Test envoie Email", "Pedro", "ht");
        }}
        className="flex pt-14  justify-center items-center"
      >
        <FaUserCircle className="text-gray-300 dark:text-gray-300 w-[25rem] h-24" />
      </div>

      {/* Titre principal */}
      <h1 className="text-center font-bold text-xl mt-4 text-gray-700 dark:text-gray-100">
        {t("Mon Profil")}
      </h1>

      {/* Section des informations utilisateur */}
      <div className="mt-8 bg-gray-100 dark:bg-gray-800 max-w-[50rem] mx-auto py-4 rounded-xl px-4 sm:px-[10vw] flex flex-col gap-2">
        {/* Compte */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Compte")} :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {isDashboardHomePage
              ? localStorage.getItem("adminAccount")
              : localStorage.getItem("account")}
          </p>
        </div>

        {/* Nom d'utilisateur */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Nom d'utilisateur")} :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {isDashboardHomePage
              ? localStorage.getItem("adminUsername")
              : localStorage.getItem("username")}
          </p>
        </div>
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Pays")} :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {currentCountry === "rd" ? "República Dominicana" : "Haïti"}{" "}
          </p>
        </div>

        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Ville")} :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {addressCity || "---"}
            </p>
          </div>
        </div>

        {/* Mot de passe */}

        {/* Fuseau horaire */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Fuseau horaire")} :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {timezone || "---"}
            </p>
          </div>
        </div>

        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Email de contact")} :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {contactEmail || "---"}
            </p>
          </div>
        </div>

        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Téléphone")} :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {contactPhone || "---"}
            </p>
          </div>
        </div>

        {/* 
          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Adresse")} :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {addressCity || "---"}
            </p>
          </div>
        </div> */}

        {/* Adresse */}
        {/* <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            {t("Adresse")} :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {userData?.addressCity || "-----"}
            {"/ " + adminUserData?.addressCity && adminUserData?.addressCity}
          </p>
        </div> */}
      </div>

      {/* Boutons d'action */}
      <div className="flex  justify-center max-w-[30rem] mx-auto grid-cols-1 xs:grid-cols-2 mt-10 pb-20 gap-2 ">
        <button
          onClick={() => {
            setLogOutPopup(true);
          }}
          className="bg-orange-500 mx-4 w-full dark:bg-orange-400 text-center rounded-lg px-3 text-white py-2 hover:bg-orange-600 dark:hover:bg-orange-500"
        >
          {t("Se déconnecter")}{" "}
        </button>
      </div>

      {redemarerApplication && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
          <div
            className={` ${body_bg} max-w-[25rem] pb-6 overflow-hidden  rounded-xl w-[80vw] `}
          >
            <div
              className={` ${header_bg} flex justify-center items-center py-4 px-4  mb-8 `}
            >
              <h2 className="font-bold text-white text-xl">
                {t("Redémarrer l'application")}
              </h2>
            </div>
            <div>
              <h3
                className={`${text_color}  block font-semibold text-lg  text-center leading-6  mb-3 `}
              >
                {t("Êtes vous sur de redémarrer l'application")} ?
              </h3>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <div
                onClick={() => {
                  setRedemarerApplication(false);
                  resetIndexedDB(); // Vide le localStorage
                  localStorage.clear(); // Vide le localStorage
                  window.location.reload(); // Rafraîchit la page
                }}
                // to="/home?tab=acceuil"
                className={` bg-red-500 cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
              >
                {t("Oui")}
              </div>
              <div
                onClick={() => {
                  setRedemarerApplication(false);
                }}
                // to="/home?tab=acceuil"
                className={` bg-gray-500 cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
              >
                {t("Non")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoUserComponent;
