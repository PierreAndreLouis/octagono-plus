import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaCar,
  FaChevronDown,
  FaInfoCircle,
  FaUser,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { IoClose, IoEarth, IoStatsChartSharp } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import {
  MdGTranslate,
  MdLocationPin,
  MdLogout,
  MdOutlineSpaceDashboard,
  MdOutlineStickyNote2,
  MdSpaceDashboard,
  MdSwitchAccount,
} from "react-icons/md";
import { PiIntersectThreeBold } from "react-icons/pi";
import { BiUniversalAccess } from "react-icons/bi";
import { GiPathDistance } from "react-icons/gi";

function SideBarSysadmin({
  readDocumentationSideBar,
  setReadDocumentationSideBar,
  documentationPage,
  backToPagePrecedent,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  closeSideBar,
  setDocumentationPage,
  setListeGestionDesGroupeTitre,
  setListeGestionDesGeofences,
  setChooseOtherLanguagePopup,
  setAjouterGeofencePopup,
  setLogOutPopup,
}) {
  const {
    scrollToTop,
    currentAccountSelected,
    comptes,
    accountUsers,
    setListeGestionDesUsers,
    setListeGestionDesGroupe,
    accountGroupes,
    setListeGestionDesVehicules,
    accountDevices,
    accountGeofences,
    isDashboardHomePage,
    setIsDashboardHomePage,
    account,
    username,
    mergedDataHome,
    geofenceData,
    setShowHistoriqueInMap,
    adminAccount,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  return (
    <div
      className={`${
        readDocumentationSideBar ? "translate-x-0" : "-translate-x-[100%]"
      }  transition-all lg:translate-x-0-- bg-white fixed    left-0 top-[3rem] p-4 pt-3 z-[9] shadow-lg lg:shadow-none shadow-black/20   w-[100vw] max-w-[18rem] min-h-[100vh]`}
    >
      <IoClose
        onClick={() => {
          setReadDocumentationSideBar(false);
        }}
        className="text-3xl absolute top-[7.5rem]- top-3 right-[1.1rem] lg:hidden-- text-red-600 cursor-pointer"
      />
      {documentationPage !== "Dashboard" && (
        <button
          onClick={backToPagePrecedent}
          // disabled={historyRef.current.length === 0}
          className={` ${
            documentationPage === "Localisation_devices"
              ? "top-[7rem] md:top-[2rem]"
              : "top-[.5rem] md:top-[2rem]"
          } text-xl border-- shadow-lg-- shadow-black/10 bg-white rounded-md px-2 py-1 flex gap-2 items-center absolute z-[999999999999]  -right-[6.6rem] md:-right-[7rem] lg:hidden-- text-gray-600 cursor-pointer`}
        >
          <FaArrowLeft />
          <span className="text-[1rem]">{t("Retour")}</span>
        </button>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <div
        onClick={() => {
          scrollToTop();
        }}
        className="h-[105vh] pb-52 mt-5 font-semibold-- flex flex-col overflow-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Debut */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Tous les comptes */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              if (isDashboardHomePage) {
                setChooseOtherAccountGestion(true);
                setChooseOneAccountToContinue(false);
                setChooseAccountFromGeozoneSection(false);
              }
              closeSideBar();
            }}
            className={`$ flex items-center   justify-between  gap-2  border-b border-b-gray-200 py-4  cursor-pointer px-3`}
          >
            <FaUserCircle className="text-[3rem] min-w-[1.5rem] text-gray-500" />
            <div className="w-full">
              <p className="text-gray-600 font-semibold">
                {isDashboardHomePage ? t("Compte Actuel") : t("Compte")}
              </p>
              <p className="text-orange-500 notranslate max-w-[10rem] whitespace-nowrap text-ellipsis overflow-hidden  ">
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.description
                    : `${t("Tous les comptes")}`
                  : account + " / " + username}
              </p>
            </div>
            {isDashboardHomePage && <FaChevronDown className="text-lg" />}
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Dashboard */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              scrollToTop();
              setDocumentationPage("Dashboard");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Dashboard" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <MdSpaceDashboard className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">{t("Dashboard")}</p>
            </div>
          </div>
        </div>
        {/* 
        
        */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*admi_ Dashboard */}
        {account && username && adminAccount === "sysadmin" && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                setIsDashboardHomePage(!isDashboardHomePage);
                scrollToTop();
                setDocumentationPage("Dashboard");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Admin_Dashboard" ? "bg-orange-50" : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              {isDashboardHomePage ? (
                <FaUserCircle className="text-xl min-w-[1.5rem] text-orange-600" />
              ) : (
                <MdOutlineSpaceDashboard className="text-xl min-w-[1.5rem] text-orange-600" />
              )}
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">
                  {isDashboardHomePage
                    ? t("Mode Utilisateur")
                    : t("Admin Dashboard")}
                </p>
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Gestion_des_comptes */}
        {!currentAccountSelected && isDashboardHomePage && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                scrollToTop();
                setDocumentationPage("Gestion_des_comptes");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Gestion_des_comptes" ||
                documentationPage === "Ajouter_nouveau_compte" ||
                documentationPage === "Modifier_compte"
                  ? "bg-orange-50"
                  : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <MdSwitchAccount className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">
                  {t("Gestion des comptes")} ({comptes?.length})
                </p>
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Gestion_des_utilisateurs */}
        {isDashboardHomePage && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                if (currentAccountSelected) {
                  setListeGestionDesUsers(currentAccountSelected?.accountUsers);
                } else {
                  setListeGestionDesUsers(accountUsers);
                }
                scrollToTop();
                setDocumentationPage("Gestion_des_utilisateurs");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Gestion_des_utilisateurs"
                  ? "bg-orange-50"
                  : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <FaUsers className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">
                  {t("Gestion des Utilisateurs")} (
                  {currentAccountSelected
                    ? currentAccountSelected?.accountUsers?.length
                    : accountUsers?.length}
                  )
                </p>
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Gestion_des_groupes */}
        {isDashboardHomePage && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                if (currentAccountSelected) {
                  setListeGestionDesGroupe(
                    currentAccountSelected?.accountGroupes
                  );

                  setListeGestionDesGroupeTitre("Tous les Groupe");
                } else {
                  setListeGestionDesGroupe(accountGroupes);

                  setListeGestionDesGroupeTitre("Tous les Groupe");
                }
                scrollToTop();
                setDocumentationPage("Gestion_des_groupes");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Gestion_des_groupes"
                  ? "bg-orange-50"
                  : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <PiIntersectThreeBold className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">
                  {t("Gestion des Groupe")} (
                  {currentAccountSelected
                    ? currentAccountSelected?.accountGroupes?.length
                    : accountGroupes?.length}
                  )
                </p>
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Gestion_des_appareils */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
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
              scrollToTop();
              setDocumentationPage("Gestion_des_appareils");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Gestion_des_appareils"
                ? "bg-orange-50"
                : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <FaCar className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Gestion des Appareils")} (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountDevices?.length
                    : accountDevices?.length
                  : dataFusionné?.length}
                )
              </p>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {/* Gestion_des_roles */}

        {isDashboardHomePage && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                scrollToTop();
                setDocumentationPage("Gestion_des_roles");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Gestion_des_roles" ? "bg-orange-50" : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <BiUniversalAccess className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">
                  {t("Gestion des Roles")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/*  */}

        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              if (currentAccountSelected) {
                setListeGestionDesGeofences(
                  currentAccountSelected?.accountGeofences
                );
              } else {
                setListeGestionDesGeofences(accountGeofences);
              }
              scrollToTop();
              setDocumentationPage("Gestion_geofences");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Gestion_geofences" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <IoEarth className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Gestion des Geofences")} (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountGeofences?.length
                    : accountGeofences?.length
                  : geofenceData?.length}
                )
              </p>
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Historique_appareil */}
        {/* {!isDashboardHomePage && ( */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              // if (currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(
              //     currentAccountSelected?.accountDevices
              //   );
              // } else if (!currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(accountDevices);
              // } else if (!isDashboardHomePage) {
              //   setListeGestionDesVehicules(dataFusionné);
              // }
              setShowHistoriqueInMap(false);
              scrollToTop();
              setDocumentationPage("Historique_appareil");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Historique_appareil" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <IoStatsChartSharp className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Historique d'un Appareils")}
                {/* (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountDevices?.length
                    : accountDevices?.length
                  : dataFusionné?.length}
                ) */}
              </p>
            </div>
          </div>
        </div>
        {/* )} */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* Trajet_appareil */}
        {/* {!isDashboardHomePage && ( */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              // if (currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(
              //     currentAccountSelected?.accountDevices
              //   );
              // } else if (!currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(accountDevices);
              // } else if (!isDashboardHomePage) {
              //   setListeGestionDesVehicules(dataFusionné);
              // }
              setShowHistoriqueInMap(true);
              scrollToTop();
              setDocumentationPage("Trajet_appareil");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Trajet_appareil" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <GiPathDistance className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Trajet d'un Appareils")}
                {/* (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountDevices?.length
                    : accountDevices?.length
                  : dataFusionné?.length}
                ) */}
              </p>
            </div>
          </div>
        </div>
        {/* )} */}
        {/*  */}
        {/* Rapport_unite */}
        {(!isDashboardHomePage || currentAccountSelected) && (
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                scrollToTop();
                setDocumentationPage("Rapport_unite");
                closeSideBar();
              }}
              className={`${
                documentationPage === "Rapport_unite" ? "bg-orange-50" : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <MdOutlineStickyNote2 className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 font-semibold">{t("Rapport")}</p>
              </div>
            </div>
          </div>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {/*  */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              if (currentAccountSelected) {
                setListeGestionDesVehicules(
                  currentAccountSelected?.accountDevices
                );
              } else {
                setListeGestionDesVehicules(accountDevices);
              }
              scrollToTop();
              setDocumentationPage("Localisation_devices");
              setAjouterGeofencePopup(false);
              closeSideBar();
            }}
            className={`${
              documentationPage === "Localisation_devices" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <MdLocationPin className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Localisation Appareils")} (
                {
                  (isDashboardHomePage
                    ? currentAccountSelected
                      ? currentAccountSelected?.accountDevices
                      : accountDevices
                    : dataFusionné
                  )?.filter(
                    (v) =>
                      v.lastValidLatitude !== "0.0" &&
                      v.lastValidLongitude !== "0.0" &&
                      v.lastValidLatitude !== "" &&
                      v.lastValidLongitude !== ""
                  )?.length
                }
                )
              </p>
            </div>
          </div>
        </div>
        {/*  */}
        {/* Info_appareil */}
        {/* {!isDashboardHomePage && ( */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              // if (currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(
              //     currentAccountSelected?.accountDevices
              //   );
              // } else if (!currentAccountSelected && isDashboardHomePage) {
              //   setListeGestionDesVehicules(accountDevices);
              // } else if (!isDashboardHomePage) {
              //   setListeGestionDesVehicules(dataFusionné);
              // }
              // setShowHistoriqueInMap(false);
              scrollToTop();
              setDocumentationPage("Info_appareil");
              closeSideBar();
            }}
            className={`${
              documentationPage === "Info_appareil" ? "bg-orange-50" : ""
            } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <FaInfoCircle className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 font-semibold">
                {t("Informations sur un Appareils")}
                {/* (
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.accountDevices?.length
                    : accountDevices?.length
                  : dataFusionné?.length}
                ) */}
              </p>
            </div>
          </div>
        </div>
        {/* )} */}
        {/*  */}
        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              closeSideBar();
              setChooseOtherLanguagePopup(true);
            }}
            className={`${
              documentationPage === "installation" ? "bg-orange-50" : ""
            } flex items-center ajouter-appareil-container-2 gap-2   border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <MdGTranslate className="text-xl min-w-[1.5rem] text-orange-600" />
            <div className="flex w-full justify-between">
              <p className="text-gray-600 text-[1rem] font-semibold">
                {t("Language")}
              </p>
            </div>
          </div>
        </div>

        <div className="ajouter-appareil-container transition-all hover:border-b  ">
          <div
            onClick={() => {
              closeSideBar();
              setLogOutPopup(true);
            }}
            className={`${
              documentationPage === "installation" ? "bg-orange-50" : ""
            } flex items-center ajouter-appareil-container-2 gap-2   border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
          >
            <MdLogout className="text-xl min-w-[1.5rem] text-red-500" />
            <div className="flex w-full justify-between">
              <p className="text-red-600 text-[1rem] font-semibold">
                {t("Déconnexion")}
              </p>
            </div>
          </div>
        </div>

        {/*  */}
      </div>
    </div>
  );
}

export default SideBarSysadmin;
