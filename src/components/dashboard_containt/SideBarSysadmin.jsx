import React, { useContext, useState } from "react";
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
import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoEarth,
  IoStatsChartSharp,
} from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import {
  MdGTranslate,
  MdInstallDesktop,
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
import InstallationPWA from "../../pages/InstallationPWA";
import { TbPointFilled } from "react-icons/tb";
import { IoMdLogIn, IoMdStats } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import { Link } from "react-router-dom";

function SideBarSysadmin({
  readDocumentationSideBar,
  setReadDocumentationSideBar,
  backToPagePrecedent,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  closeSideBar,
  setListeGestionDesGroupeTitre,
  setListeGestionDesGeofences,
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
    setReadDocumentation,
    readDocumentation,
    documentationPage,
    setDocumentationPage,

    installation_sur_application_ref,
    installation_sur_chrome_ref,

    ajouter_nouveau_appareil_section_ref,
    modidier_appareil_section_ref,
    supprimer_appareil_section_ref,
    //
    voir_position_appareil_ref,
    position_choisir_autre_appareil_ref,
    position_voir_tous_appareil_ref,
    position_type_de_vue_ref,
    voir_trajet_ref,
    trajet_recentrer_ref,
    trajet_choix_autre_appareil_ref,
    trajet_type_de_vue_ref,
    trajet_recherche_ref,
    trajet_retracer_trajet_ref,
    voir_historique_appareil_ref,
    voir_position_historiquer_sur_carte_ref,
    historique_choix_autre_appareil_ref,
    historique_recherche_ref,
    aller_page_rapport_unite_ref,
    rapport_unite_recherche_ref,
    rapport_unite_telecherche_pdf_ref,
    voir_rapport_groupe_ref,
    rapport_groupe_recherche_ref,
    rapport_groupe_telecharger_pdf_ref,
    creer_geozone_ref,
    modifier_geozone_ref,

    setChooseOtherLanguagePopup,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const scrollToTitle = (titleRef) => {
    if (titleRef.current) {
      const offset = 7 * 16; // 5rem en pixels (1rem = 16px par défaut)
      const topPosition =
        titleRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: topPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`${
        readDocumentationSideBar ? "translate-x-0" : "-translate-x-[100%]"
      }  transition-all lg:translate-x-0-- bg-white fixed    left-0 top-[3rem] p-4 pt-3 z-[9] shadow-lg lg:shadow-none shadow-black/20   w-[100vw] md:max-w-[18rem] min-h-[100vh]`}
    >
      <IoClose
        onClick={() => {
          setReadDocumentationSideBar(false);
        }}
        className="text-3xl absolute top-[7.5rem]- top-3 right-[1.1rem] lg:hidden-- text-red-600 cursor-pointer"
      />
      {documentationPage !== "Dashboard" &&
        documentationPage !== "Trajet_appareil" &&
        documentationPage !== "Rapport_unite" && (
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
        <Link
          to="/Dashboard"
          className="ajouter-appareil-container transition-all hover:border-b  "
        >
          <div
            onClick={() => {
              scrollToTop();
              setDocumentationPage("Dashboard");
              closeSideBar();
              setReadDocumentation(false);
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
        </Link>
        {/* 
        
        */}

        {isDashboardHomePage && (
          // {!currentAccountSelected && isDashboardHomePage && (
          <Link
            to="/Gestion_des_comptes"
            className="ajouter-appareil-container transition-all hover:border-b  "
          >
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
          </Link>
        )}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {!readDocumentation ? (
          <div>
            {/*  */}
            {/*  */}
            {/*admi_ Dashboard */}
            {account && username && adminAccount === "sysadmin" && (
              <Link
                to="/Dashboard"
                className="ajouter-appareil-container transition-all hover:border-b  "
              >
                <div
                  onClick={() => {
                    setIsDashboardHomePage(!isDashboardHomePage);
                    scrollToTop();
                    setDocumentationPage("Dashboard");
                    closeSideBar();
                  }}
                  className={`${
                    documentationPage === "Admin_Dashboard"
                      ? "bg-orange-50"
                      : ""
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
                        : t("sysadmin Dashboard")}
                    </p>
                  </div>
                </div>
              </Link>
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
              <Link
                to="/Gestion_des_utilisateurs"
                className="ajouter-appareil-container transition-all hover:border-b  "
              >
                <div
                  onClick={() => {
                    if (currentAccountSelected) {
                      setListeGestionDesUsers(
                        currentAccountSelected?.accountUsers
                      );
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
              </Link>
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
              <Link
                to="/Gestion_des_groupes"
                className="ajouter-appareil-container transition-all hover:border-b  "
              >
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
              </Link>
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
            <Link
              to="/Gestion_des_appareils"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
              <div
                onClick={() => {
                  setDocumentationPage("Gestion_des_appareils");
                  scrollToTop();
                  closeSideBar();
                  if (currentAccountSelected && isDashboardHomePage) {
                    setListeGestionDesVehicules(
                      currentAccountSelected?.accountDevices
                    );
                  } else if (!currentAccountSelected && isDashboardHomePage) {
                    setListeGestionDesVehicules(accountDevices);
                  } else if (!isDashboardHomePage) {
                    setListeGestionDesVehicules(dataFusionné);
                  }
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
            </Link>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}

            {/* Gestion_des_roles */}

            {isDashboardHomePage && (
              <Link
                to="/Gestion_des_roles"
                className="ajouter-appareil-container transition-all hover:border-b  "
              >
                <div
                  onClick={() => {
                    scrollToTop();
                    setDocumentationPage("Gestion_des_roles");
                    closeSideBar();
                  }}
                  className={`${
                    documentationPage === "Gestion_des_roles"
                      ? "bg-orange-50"
                      : ""
                  } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
                >
                  <BiUniversalAccess className="text-xl min-w-[1.5rem] text-orange-600" />
                  <div className="flex w-full justify-between">
                    <p className="text-gray-600 font-semibold">
                      {t("Gestion des Roles")}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/*  */}

            <Link
              to="/Gestion_geofences"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
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
                  documentationPage === "Gestion_geofences"
                    ? "bg-orange-50"
                    : ""
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
            </Link>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/* Historique_appareil */}
            {/* {!isDashboardHomePage && ( */}
            <Link
              to="/Historique_appareil"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
              <div
                onClick={() => {
                  setShowHistoriqueInMap(false);
                  scrollToTop();
                  setDocumentationPage("Historique_appareil");
                  closeSideBar();
                }}
                className={`${
                  documentationPage === "Historique_appareil"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <IoStatsChartSharp className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 font-semibold">
                    {t("Historique d'un Appareils")}
                  </p>
                </div>
              </div>
            </Link>
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
            <Link
              to="/Trajet_appareil"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
              <div
                onClick={() => {
                  scrollToTop();
                  setShowHistoriqueInMap(true);
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
                  </p>
                </div>
              </div>
            </Link>
            {/* )} */}
            {/*  */}
            {/* Rapport_unite */}
            {(!isDashboardHomePage || currentAccountSelected) && (
              <Link
                to="/Rapport_unite"
                className="ajouter-appareil-container transition-all hover:border-b  "
              >
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
                    <p className="text-gray-600 font-semibold">
                      {t("Rapport")}
                    </p>
                  </div>
                </div>
              </Link>
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
            <Link
              to="/Localisation_devices"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
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
                  documentationPage === "Localisation_devices"
                    ? "bg-orange-50"
                    : ""
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
            </Link>
            {/*  */}
            {/* Info_appareil */}
            {/* {!isDashboardHomePage && ( */}
            <Link
              to="/Info_appareil"
              className="ajouter-appareil-container transition-all hover:border-b  "
            >
              <div
                onClick={() => {
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
                  </p>
                </div>
              </div>
            </Link>
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

            <InstallationPWA />

            <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  closeSideBar();
                  setLogOutPopup(true);
                }}
                className={`${
                  documentationPage === "" ? "bg-orange-50" : ""
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
          </div>
        ) : (
          <div
            onClick={() => {
              scrollToTop();
              closeSideBar();
            }}
          >
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
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();
                  setDocumentationPage("installation");
                }}
                className={`${
                  documentationPage === "installation" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <MdInstallDesktop className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">Installation</p>

                  <IoChevronDown
                    className={`${
                      documentationPage === "installation"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "installation"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(installation_sur_application_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Installation directement sur l'application
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(installation_sur_chrome_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Installation avec Google Chrome
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                scrollToTop();

                setDocumentationPage("connecter");
              }}
              className={`${
                documentationPage === "connecter" ? "bg-orange-50" : ""
              } flex items-center-- gap-4 border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <IoMdLogIn className="text-2xl min-w-[1.5rem] text-orange-600" />
              <p className="font-semibold text-gray-700">Se connecter</p>
            </div>

            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();
                  setDocumentationPage("gestionAppareil");
                }}
                className={`${
                  documentationPage === "gestionAppareil" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <IoCarSportOutline className="text-2xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Gestion des appareils
                  </p>

                  <IoChevronDown
                    className={`${
                      documentationPage === "gestionAppareil"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "gestionAppareil"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(ajouter_nouveau_appareil_section_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Ajouter un nouvel appareil
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(modidier_appareil_section_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Modifier un appareil
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(supprimer_appareil_section_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Supprimer un appareil
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}

            {/*  */}

            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();
                  setDocumentationPage("positionAppareil");
                }}
                className={`${
                  documentationPage === "positionAppareil" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Position d'un véhicule
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "positionAppareil"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "positionAppareil"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(voir_position_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Voir la position d'un véhicule{" "}
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(position_choisir_autre_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Choisir un autre appareil
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(position_voir_tous_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Voir tous les autres appareils
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(position_type_de_vue_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Modifier la vue de la carte
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();
                  setDocumentationPage("trajetAppareil");
                }}
                className={`${
                  documentationPage === "trajetAppareil" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <GiPathDistance className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Trajet d'un véhicule
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "trajetAppareil"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "trajetAppareil"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(voir_trajet_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Voir le trajet d'un véhicule
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(trajet_recentrer_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Recentrer la carte
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(trajet_choix_autre_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Choisir un autre appareil
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(trajet_type_de_vue_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Modifier la vue de la carte
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(trajet_recherche_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Recherche par intervalle de dates
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(trajet_retracer_trajet_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Retracer le trajet du véhicule
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}

            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();

                  setDocumentationPage("historiqueAppareil");
                }}
                className={`${
                  documentationPage === "historiqueAppareil"
                    ? "bg-orange-50"
                    : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <IoMdStats className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Historique d'un appareil
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "historiqueAppareil"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "historiqueAppareil"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(voir_historique_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    {" "}
                    Voir l'historique de l'appareil
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(voir_position_historiquer_sur_carte_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Voir une position historique sur la carte
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(historique_choix_autre_appareil_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Choisir un autre appareil
                  </p>
                </div>

                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(historique_recherche_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Recherche par intervalle de dates{" "}
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}

            {/* <h3 className="font-bold text-gray-600 px-4 py-3 mt-5">
                               Rapport des appareils
                             </h3> */}
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();

                  setDocumentationPage("rapportUnite");
                }}
                className={`${
                  documentationPage === "rapportUnite" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                {/* <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" /> */}
                <p className="translate-x-1 text-xl font-bold min-w-[1.5rem] text-orange-600">
                  U
                </p>
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Rapport par unité
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "rapportUnite"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "rapportUnite"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(aller_page_rapport_unite_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    {" "}
                    Accéder à la page du rapport d’unité
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(aller_page_rapport_unite_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Choisir un autre appareil
                  </p>
                </div>

                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(rapport_unite_recherche_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Recherche par intervalle de dates
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(rapport_unite_telecherche_pdf_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Télécharger le rapport en PDF
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();

                  setDocumentationPage("rapportGroupe");
                }}
                className={`${
                  documentationPage === "rapportGroupe" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <p className="translate-x-1 text-xl font-bold min-w-[1.5rem] text-orange-600">
                  G
                </p>
                {/* <LuMapPin className="text-xl min-w-[1.5rem] text-orange-600" /> */}
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Rapport en groupe
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "rapportGroupe"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "rapportGroupe"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(voir_rapport_groupe_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    {" "}
                    Accéder à la page du rapport de groupe
                  </p>
                </div>

                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(rapport_groupe_recherche_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Effectuer une recherche
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(rapport_groupe_telecharger_pdf_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Télécharger le rapport en PDF / Excel
                  </p>
                </div>
              </div>
            </div>
            {/* Fin */}

            {/* <h3 className="font-bold text-gray-600 px-4 py-3 mt-5">
                               Gestion des Geozones
                             </h3> */}
            {/* Debut */}
            <div className="ajouter-appareil-container transition-all ">
              <div
                onClick={() => {
                  scrollToTop();

                  setDocumentationPage("gestionGeozone");
                }}
                className={`${
                  documentationPage === "gestionGeozone" ? "bg-orange-50" : ""
                } flex items-center-- ajouter-appareil-container-2 gap-4  border-b py-3 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <IoEarth className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="font-semibold text-gray-700">
                    Gestion des géozones
                  </p>
                  <IoChevronDown
                    className={`${
                      documentationPage === "gestionGeozone"
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all min-w-[2rem] text-xl mt-1 text-gray-900`}
                  />
                </div>
              </div>
              <div
                className={`${
                  documentationPage === "gestionGeozone"
                    ? "max-h-[14rem] pb-6"
                    : ""
                } ajouter-appareil-other overflow-hidden `}
              >
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(creer_geozone_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer py-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    {" "}
                    Créer une géozone
                  </p>
                </div>
                <div
                  onClick={() => {
                    setTimeout(() => {
                      scrollToTitle(modifier_geozone_ref);
                    }, 100);
                  }}
                  className="flex hover:text-orange-700 cursor-pointer pb-2 pr-4 pl-4 gap-5 items-center--"
                >
                  <TbPointFilled className="mt-1" />
                  <p className="font-semibold text-gray-700">
                    Modifier une géozone
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  */}
      </div>
    </div>
  );
}

export default SideBarSysadmin;
