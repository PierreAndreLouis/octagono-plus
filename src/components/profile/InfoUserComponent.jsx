import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import LanguageComponent from "../home/LanguageComponent";
import GoogleTranslate from "../home/GoogleTranslate";
import GoogleTranslate2 from "../home/GoogleTranslate2";
import LanguageSwitcher from "../home/LanguageSwitcher";

function InfoUserComponent({
  account,
  username,
  userData,
  setShowChangePasswordPopup,
  setLogOutPopup,
  selectUTC,
  SelectedTimeZone,
  setChangeTimeZone,
}) {
  const { setUsername, homePageReload, resetIndexedDB } =
    useContext(DataContext);

  const [redemarerApplication, setRedemarerApplication] = useState(false);

  let body_bg = "bg-red-50";
  let header_bg = "bg-red-600";
  let button_bg = "bg-red-500";
  let text_color = "text-red-600";
  // setUsername
  return (
    <div>
      {/* Section de l'icône utilisateur */}
      <div
        onClick={() => {
          // setUsername("xxxxxxx");
        }}
        className="flex mt-24 md:mt-28 justify-center items-center"
      >
        <FaUserCircle className="text-gray-300 dark:text-gray-300 w-[25rem] h-24" />
      </div>

      {/* Titre principal */}
      <h1
        onClick={() => {
          // setUsername("admin");
          console.log(userData);
        }}
        className="text-center font-bold text-xl mt-4 text-gray-700 dark:text-gray-100"
      >
        Mon Profil
      </h1>

      {/* Section des informations utilisateur */}
      <div className="mt-8 bg-gray-100 dark:bg-gray-800 max-w-[50rem] mx-auto py-4 rounded-xl px-4 sm:px-[10vw] flex flex-col gap-2">
        {/* Compte */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Compte :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {account || "-----"}
          </p>
        </div>

        {/* Nom d'utilisateur */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Nom d'utilisateur :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {username || "-----"}
          </p>
        </div>

        {/* Mot de passe */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Mot de passe :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">**********</p>
        </div>

        {/* Fuseau horaire */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Fuseau horaire :
          </h3>
          <div className="flex justify-between items-center w-full">
            <p className="pl-3 text-gray-500 dark:text-gray-300">
              {/* {userData?.timeZone || "-----"} */}
              {selectUTC !== ""
                ? "GMT" + (selectUTC >= 0 ? "+" : "") + selectUTC
                : userData?.timeZone || "-----"}
            </p>
            {/* <p
              onClick={() => {
                setChangeTimeZone(true);
              }}
              className="pl-3 text-orange-500 cursor-pointer dark:text-orange-500"
            >
              Modifier
            </p> */}
          </div>
        </div>

        {/* Adresse */}
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Adresse :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">
            {userData?.addressCity || "-----"}
          </p>
        </div>
        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Version de l'application :
          </h3>
          <p className="pl-3 text-gray-500 dark:text-gray-300">13.02.05</p>
        </div>

        <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3 className="font-bold text-gray-600 dark:text-gray-100 min-w-[11.8rem] lg:min-w-[16rem]">
            Redémarrer l'application :
          </h3>
          <p
            onClick={() => {
              setRedemarerApplication(true);
              // resetIndexedDB(); // Vide le localStorage
              // localStorage.clear(); // Vide le localStorage
              // window.location.reload(); // Rafraîchit la page
            }}
            className="pl-3 text-orange-500 font-semibold cursor-pointer dark:text-gray-300"
          >
            Cliquez ici
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex  justify-center max-w-[30rem] mx-auto grid-cols-1 xs:grid-cols-2 mt-10 gap-2">
        {username === "admin" && (
          <div
            onClick={() => {
              setShowChangePasswordPopup(true);
            }}
            className="text-orange-500 w-full dark:text-orange-400 cursor-pointer text-center rounded-lg px-3 border border-orange-500 dark:border-orange-400 py-2 hover:bg-orange-100 dark:hover:bg-orange-900"
          >
            Changer le mot de passe{" "}
          </div>
        )}
        <button
          onClick={() => {
            setLogOutPopup(true);
          }}
          className="bg-orange-500 w-full dark:bg-orange-400 text-center rounded-lg px-3 text-white py-2 hover:bg-orange-600 dark:hover:bg-orange-500"
        >
          Se déconnecter{" "}
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
                Redémarrer l'application
              </h2>
            </div>
            <div>
              <h3
                className={`${text_color}  block font-semibold text-lg  text-center leading-6  mb-3 `}
              >
                Êtes vous sur de redémarrer l'application ?
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
                Oui
              </div>
              <div
                onClick={() => {
                  setRedemarerApplication(false);
                }}
                // to="/home?tab=acceuil"
                className={` bg-gray-500 cursor-pointer py-1 text-center px-10  rounded-lg text-white`}
              >
                Non
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoUserComponent;
