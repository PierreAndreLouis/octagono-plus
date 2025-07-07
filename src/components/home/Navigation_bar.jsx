import React, { useContext } from "react";
import { IoMdHome } from "react-icons/io";
import { FaPlus, FaRegEdit, FaCar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCircleUser, FaUsers } from "react-icons/fa6";
import { DataContext } from "../../context/DataContext";
import { MdOutlineStickyNote2, MdSwitchAccount } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { useTranslation } from "react-i18next";

function NavigationBar({}) {
  const {
    handleTabClick,
    tab,
    username,
    setHistoriqueSelectedLocationIndex,
    setShowHistoriqueInMap,
    currentVéhicule,
    setCurrentVéhicule,
    setVéhiculeHistoriqueDetails,
    véhiculeNotActiveToday,
    chooseFirstVéhicule,
    account,
    isDashboardHomePage,
    setIsDashboardHomePage,
    documentationPage,
    setDocumentationPage,
    scrollToTop,
    accountUsers,
    setListeGestionDesUsers,
    currentAccountSelected,
    setListeGestionDesVehicules,
    accountDevices,
    mergedDataHome,
  } = useContext(DataContext);
  let x;
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

    const navigate = useNavigate();
  

  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;
  return (
    <div>
      <div className="bg-red fixed bottom-0 left-0 right-0 dark:bg-slate-800 lg:hidden z-[8] ">
        <div className="grid grid-cols-5 gap-4 justify-between px-4 bg-gray-200 dark:bg-gray-900/50 py-0 ">
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <div
            onClick={() => {
              setDocumentationPage("Dashboard");
              navigate("/Dashboard")
            }}
            className={`${
              documentationPage === "Dashboard"
                ? "text-orange-500 dark:text-orange-300"
                : "text-gray-600 dark:text-gray-400"
            } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
          >
            <IoMdHome className="text-xl" />
            <h3 className="text-sm">{t("Accueil")}</h3>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {isDashboardHomePage ? (
            <div
              onClick={() => {
                setDocumentationPage("Gestion_des_comptes");
              navigate("/Gestion_des_comptes")

              }}
              className={`${
                documentationPage === "Gestion_des_comptes"
                  ? "text-orange-500 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-400"
              } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
            >
              <MdSwitchAccount className="text-xl" />
              <h3 className="text-sm">{t("Comptes")}</h3>
            </div>
          ) : (
            <div
              onClick={() => {
                setShowHistoriqueInMap(true);
                setDocumentationPage("Trajet_appareil");
              navigate("/Trajet_appareil")

              }}
              className={`${
                documentationPage === "Trajet_appareil"
                  ? "text-orange-500 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-400"
              } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
            >
              <GiPathDistance className="text-xl" />
              {/* <FaCar className="text-xl" /> */}
              <h3 className="text-sm">{t("Trajet")}</h3>
            </div>
          )}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {/* {username === "admin" ? (
            <div className="flex justify-center items-center">
              <div className="min-w-14 h-14 cursor-pointer -translate-y-3 border-4 border-gray-200 dark:border-slate-800 bg-orange-500 dark:bg-orange-600 flex justify-center items-center rounded-full">
                <FaPlus className="text-white text-xl" />
              </div>
            </div>
          ) : ( */}
          <div className="flex justify-center items-center">
            <div
              onClick={() => {
                setDocumentationPage("Localisation_devices");
              navigate("/Localisation_devices")

              }}
              className="min-w-14 h-14 cursor-pointer -translate-y-3 border-4 border-gray-200 dark:border-slate-800 bg-orange-500 dark:bg-orange-600 flex justify-center items-center rounded-full"
            >
              <MdLocationPin className="text-white text-[1.7rem]" />
            </div>
          </div>
          {/* )} */}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {/* // acceuil -  trajet  -  Location -   vehicule  - rapport */}
          {/* // acceuil -  comptes  -  location   - appareils - user */}

          {isDashboardHomePage ? (
            <div
              onClick={() => {
                if (currentAccountSelected) {
                  setListeGestionDesUsers(currentAccountSelected?.accountUsers);
                } else {
                  setListeGestionDesUsers(accountUsers);
                }
                scrollToTop();
                setDocumentationPage("Gestion_des_utilisateurs");
              navigate("/Gestion_des_utilisateurs")

              }}
              className={`${
                documentationPage === "Gestion_des_utilisateurs"
                  ? "text-orange-500 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-400"
              } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
            >
              <FaUsers className="text-xl" />
              {/* <FaCar className="text-xl" /> */}

              <h3 className="text-sm">{t("Utilisateurs")}</h3>
            </div>
          ) : (
            <div
              onClick={() => {
                setDocumentationPage("Rapport_unite");
              navigate("/Rapport_unite")

              }}
              className={`${
                documentationPage === "Rapport_unite"
                  ? "text-orange-500 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-400"
              } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
            >
              <MdOutlineStickyNote2 className="text-xl" />
              {/* <FaCar className="text-xl" /> */}

              <h3 className="text-sm">{t("Rapport")}</h3>
            </div>
          )}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <div
            onClick={() => {
              if (currentAccountSelected && isDashboardHomePage) {
                setListeGestionDesVehicules(
                  currentAccountSelected?.accountDevices
                );
              } else if (!currentAccountSelected && isDashboardHomePage) {
                setListeGestionDesVehicules(accountDevices);
              } else if (!isDashboardHomePage) {
                setListeGestionDesVehicules(dataFusionné);
              }
              setDocumentationPage("Gestion_des_appareils");
              navigate("/Gestion_des_appareils")

            }}
            className={`${
              documentationPage === "Gestion_des_appareils"
                ? "text-orange-500 dark:text-orange-300"
                : "text-gray-600 dark:text-gray-400"
            } flex flex-col cursor-pointer hover:text-orange-500 dark:hover:text-orange-300 justify-center items-center`}
          >
            <FaCar className="text-xl" />
            <h3 className="text-sm">{t("Appareils")}</h3>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
