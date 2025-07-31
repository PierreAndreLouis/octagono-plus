import React, { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";

import {
  FaArrowLeft,
  FaBook,
  FaCar,
  FaChevronDown,
  FaInfoCircle,
  FaListUl,
  FaUser,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import {
  IoCarSportOutline,
  IoChevronDown,
  IoClose,
  IoEarth,
  IoSearch,
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
import { Link, useNavigate } from "react-router-dom";

function SideBarSysadmin({
  readDocumentationSideBar,
  setReadDocumentationSideBar,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  closeSideBar,
  setListeGestionDesGroupeTitre,
  setListeGestionDesGeofences,
  setAjouterGeofencePopup,
  setLogOutPopup,
  //
  showChooseUserToModifyMessage,
  setShowChooseUserToModifyMessage,
  showChooseGroupeToModifyMessage,
  setShowChooseGroupeToModifyMessage,
  showChooseAppareilToModifyMessage,
  setShowChooseAppareilToModifyMessage,
  showChooseGeofencesToModifyMessage,
  setShowChooseGeofencesToModifyMessage,
  showChooseCompteToModifyMessage,
  setShowChooseCompteToModifyMessage,
  ///////////////////////
  showChooseItemToModifyMessage,
  setshowChooseItemToModifyMessage,
  showChooseItemToModifyPage,
  setshowChooseItemToModifyPage,
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
    setSelectedVehicleToShowInMap,

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
    updateAppareilsEtGeofencesPourCarte,
    setChooseOtherLanguagePopup,
    setFilteredColorCategorieListe,
    backToPagePrecedent,
    setIsEditingGeofence,
    setCurrentGeozone,
    versionApplication,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();
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

  const [searchGroupInputTerm, setSearchGroupInputTerm] = useState("");
  const optionListe = [
    {
      name: t("Dashboard"),
      isSysadmin: false,
      link: "/Dashboard",
      setVariable: () => setDocumentationPage("Dashboard"),
    },

    // Comptes
    {
      name: t("Gestion des comptes"),
      isSysadmin: true,
      link: "/Gestion_des_comptes",
      setVariable: () => setDocumentationPage("Gestion_des_comptes"),
    },
    {
      name: t("Ajouter un nouveau compte"),
      isSysadmin: true,
      link: "/Ajouter_nouveau_compte",
      setVariable: () => setDocumentationPage("Ajouter_nouveau_compte"),
    },
    {
      name: t("Modifier un compte"),
      isSysadmin: true,
      link: "/Gestion_des_comptes",
      setVariable: () => {
        setDocumentationPage("Gestion_des_comptes");
        setshowChooseItemToModifyPage("Gestion_des_comptes");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option du Compte a modifier, puis sur 'Modifier le Compte'"
          )}`
        );
      },
    },
    {
      name: t("Supprimer un compte"),
      isSysadmin: true,
      link: "/Gestion_des_comptes",
      setVariable: () => {
        setDocumentationPage("Gestion_des_comptes");
        setshowChooseItemToModifyPage("Gestion_des_comptes");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option du Compte a supprimer, puis sur 'Supprimer le Compte'"
          )}`
        );
      },
    },

    // Utilisateurs
    {
      name: t("Gestion des Utilisateurs"),
      isSysadmin: true,
      link: "/Gestion_des_utilisateurs",
      setVariable: () => {
        setDocumentationPage("Gestion_des_utilisateurs");

        if (currentAccountSelected) {
          setListeGestionDesUsers(currentAccountSelected?.accountUsers);
        } else {
          setListeGestionDesUsers(accountUsers);
        }
      },
    },
    {
      name: t("Ajouter un nouveau utilisateur"),
      isSysadmin: true,
      link: "/Ajouter_nouveau_utilisateur",
      setVariable: () => {
        setDocumentationPage("Ajouter_nouveau_utilisateur");
      },
    },
    {
      name: t("Modifier un utilisateur"),
      isSysadmin: true,
      link: "/Gestion_des_utilisateurs",
      setVariable: () => {
        setDocumentationPage("Gestion_des_utilisateurs");
        setshowChooseItemToModifyPage("Gestion_des_utilisateurs");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option de l'utilisateur a modifier, puis sur 'Modifier l'utilisateur'"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesUsers(currentAccountSelected?.accountUsers);
        } else {
          setListeGestionDesUsers(accountUsers);
        }
      },
    },
    {
      name: t("Supprimer un utilisateur"),
      isSysadmin: true,
      link: "/Gestion_des_utilisateurs",
      setVariable: () => {
        setDocumentationPage("Gestion_des_utilisateurs");
        setshowChooseItemToModifyPage("Gestion_des_utilisateurs");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option de l'utilisateur a supprimer, puis sur 'Supprimer l'utilisateur'"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesUsers(currentAccountSelected?.accountUsers);
        } else {
          setListeGestionDesUsers(accountUsers);
        }
      },
    },

    // Groupes
    {
      name: t("Gestion des Groupe"),
      isSysadmin: true,
      link: "/Gestion_des_groupes",
      setVariable: () => {
        setDocumentationPage("Gestion_des_groupes");

        if (currentAccountSelected) {
          setListeGestionDesGroupe(currentAccountSelected?.accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        } else {
          setListeGestionDesGroupe(accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        }
      },
    },
    {
      name: t("Ajouter un nouveau groupe"),
      isSysadmin: true,
      link: "/Ajouter_nouveau_groupe",
      setVariable: () => setDocumentationPage("Ajouter_nouveau_groupe"),
    },
    {
      name: t("Modifier un groupe"),
      isSysadmin: true,
      link: "/Gestion_des_groupes",
      setVariable: () => {
        setDocumentationPage("Gestion_des_groupes");
        setshowChooseItemToModifyPage("Gestion_des_groupes");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option du groupe a modifier, puis sur 'Modifier le groupe'"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesGroupe(currentAccountSelected?.accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        } else {
          setListeGestionDesGroupe(accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        }
      },
    },
    {
      name: t("Supprimer un groupe"),
      isSysadmin: true,
      link: "/Gestion_des_groupes",
      setVariable: () => {
        setDocumentationPage("Gestion_des_groupes");
        setshowChooseItemToModifyPage("Gestion_des_groupes");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option du groupe a supprimer, puis sur 'Supprimer le groupe'"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesGroupe(currentAccountSelected?.accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        } else {
          setListeGestionDesGroupe(accountGroupes);

          setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
        }
      },
    },

    // Appareils
    {
      name: t("Gestion des Appareils"),
      isSysadmin: false,
      link: "/Gestion_des_appareils",
      setVariable: () => {
        setDocumentationPage("Gestion_des_appareils");

        if (currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
        } else if (!currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(accountDevices);
        } else if (!isDashboardHomePage) {
          setListeGestionDesVehicules(dataFusionné);
        }
      },
    },
    {
      name: t("Ajouter un nouveau appareil"),
      isSysadmin: true,
      link: "/Ajouter_nouveau_appareil",
      setVariable: () => setDocumentationPage("Ajouter_nouveau_appareil"),
    },
    {
      name: t("Modifier un appareil"),
      isSysadmin: true,
      link: "/Gestion_des_appareils",
      setVariable: () => {
        setDocumentationPage("Gestion_des_appareils");
        setshowChooseItemToModifyPage("Gestion_des_appareils");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option de l'appareil a modifier, puis sur 'Modifier l'appareil'"
          )}`
        );
        if (currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
        } else if (!currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(accountDevices);
        } else if (!isDashboardHomePage) {
          setListeGestionDesVehicules(dataFusionné);
        }
      },
    },
    {
      name: t("Supprimer un appareil"),
      isSysadmin: true,
      link: "/Gestion_des_appareils",
      setVariable: () => {
        setDocumentationPage("Gestion_des_appareils");
        setshowChooseItemToModifyPage("Gestion_des_appareils");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur l'option de l'appareil a supprimer, puis sur 'Supprimer l'appareil'"
          )}`
        );
        if (currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
        } else if (!currentAccountSelected && isDashboardHomePage) {
          setListeGestionDesVehicules(accountDevices);
        } else if (!isDashboardHomePage) {
          setListeGestionDesVehicules(dataFusionné);
        }
      },
    },

    // Geofences
    {
      name: t("Gestion des Geofences"),
      isSysadmin: false,
      link: "/Gestion_geofences",
      setVariable: () => {
        setDocumentationPage("Gestion_geofences");

        if (currentAccountSelected) {
          setListeGestionDesGeofences(currentAccountSelected?.accountGeofences);
        } else {
          setListeGestionDesGeofences(accountGeofences);
        }
      },
    },
    {
      name: t("Ajouter une nouvelle geozone"),
      isSysadmin: false,
      link: "/Ajouter_modifier_geofence",
      setVariable: () => {
        if (isDashboardHomePage && !currentAccountSelected) {
          setChooseOneAccountToContinue(true);
          setChooseOtherAccountGestion(true);
        }
        setDocumentationPage("Ajouter_modifier_geofence");
        setAjouterGeofencePopup(true);
        setIsEditingGeofence(false);
        setCurrentGeozone();
      },
    },
    {
      name: t("Modifier une geozone"),
      isSysadmin: true,
      link: "/Gestion_geofences",
      setVariable: () => {
        setDocumentationPage("Gestion_geofences");
        setshowChooseItemToModifyPage("Gestion_geofences");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur le bouton 'Modifier' du geofence souhaité modifier"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesGeofences(currentAccountSelected?.accountGeofences);
        } else {
          setListeGestionDesGeofences(accountGeofences);
        }
      },
    },
    {
      name: t("Supprimer une geozone"),
      isSysadmin: true,
      link: "/Gestion_geofences",
      setVariable: () => {
        setDocumentationPage("Gestion_geofences");
        setshowChooseItemToModifyPage("Gestion_geofences");
        setshowChooseItemToModifyMessage(
          `${t(
            "Veuillez cliquer sur le bouton 'Supprimer' du geofence souhaité Supprimé"
          )}`
        );
        if (currentAccountSelected) {
          setListeGestionDesGeofences(currentAccountSelected?.accountGeofences);
        } else {
          setListeGestionDesGeofences(accountGeofences);
        }
      },
    },

    // Autres
    {
      name: t("Historique d'un Appareils"),
      isSysadmin: false,
      link: "/Historique_appareil",
      setVariable: () => {
        setDocumentationPage("Historique_appareil");
        setShowHistoriqueInMap(false);
      },
    },
    {
      name: t("Trajet d'un Appareils"),
      isSysadmin: false,
      link: "/Trajet_appareil",
      setVariable: () => {
        setDocumentationPage("Trajet_appareil");
        setShowHistoriqueInMap(true);
      },
    },
    {
      name: t("Rapport"),
      isSysadmin: false,
      link: "/Rapport_unite",
      setVariable: () => setDocumentationPage("Rapport_unite"),
    },
    {
      name: t("Localisation Appareils"),
      isSysadmin: false,
      link: "/Localisation_devices",
      setVariable: () => {
        setDocumentationPage("Localisation_devices");
        if (currentAccountSelected) {
          setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
        } else {
          setListeGestionDesVehicules(accountDevices);
        }
      },
    },
    {
      name: t("Informations sur un Appareils"),
      isSysadmin: false,
      link: "/Info_appareil",
      setVariable: () => setDocumentationPage("Info_appareil"),
    },
    {
      name: t("Gestion des Roles"),
      isSysadmin: true,
      link: "/Gestion_des_roles",
      setVariable: () => setDocumentationPage("Gestion_des_roles"),
    },
    {
      name: t("Informations utilisateur"),
      isSysadmin: false,
      link: "/userInfo",
      setVariable: () => setDocumentationPage("userInfo"),
    },
    {
      name: t("Language"),
      isSysadmin: false,
      link: "",
      setVariable: () => setChooseOtherLanguagePopup(true),
    },
    {
      name: t("Manuel d'utilisation"),
      isSysadmin: false,
      link: "",
      setVariable: () => ouvrirPDF(),
    },
  ];

  const filteredOptionListe = useMemo(() => {
    if (!searchGroupInputTerm) return optionListe;
    const term = searchGroupInputTerm.toLowerCase();
    const allListe = optionListe?.filter(
      (item) => item?.name?.toLowerCase().includes(term)
      //  && (isDashboardHomePage && !item?.isSysadmin)
    );

    const filteredListe = allListe?.filter((item) => !item?.isSysadmin);

    return isDashboardHomePage ? allListe : filteredListe;
  }, [searchGroupInputTerm, optionListe]);

  const [showSideBar2, setShowSideBar2] = useState(false);

  const ouvrirPDF = () => {
    window.open("/Guide d'utilisation Octagono.pdf", "_blank");
  };

  return (
    <div
      className={`${
        readDocumentationSideBar || showSideBar2
          ? "translate-x-0"
          : "-translate-x-[100%]"
      }  transition-all lg:translate-x-0-- bg-white fixed    left-0 top-[3rem] p-4 pt-3  z-[9] shadow-lg lg:shadow-none shadow-black/20   w-[100vw] md:max-w-[21rem] min-h-[100vh]`}
    >
      <IoClose
        onClick={() => {
          setReadDocumentationSideBar(false);
          setShowSideBar2(false);
        }}
        className="text-3xl absolute top-[7.5rem]- top-3 right-[1.1rem] lg:hidden-- text-red-600 cursor-pointer"
      />

      {/* <button
        onClick={() => {
          backToPagePrecedent();
          backToPagePrecedent();
        }}
        className={`
    ${
      documentationPage === "Localisation_devices"
        ? "top-[7rem] md:top-[2rem]"
        : "top-[.5rem] md:top-[2rem]"
    }
    text-xl border-- shadow-lg-- shadow-black/10 bg-white rounded-md px-2 py-1
    flex gap-2  items-center absolute z-[999999999999] -right-[6.6rem] md:-right-[7rem]
    ${
      [
        "Dashboard",
        "Trajet_appareil",
        "Rapport_unite",
        "Historique_appareil",
      ].includes(documentationPage)
        ? "hidden lg:flex"
        : "flex"
    }
    text-gray-600 cursor-pointer
  `}
      >
        <FaArrowLeft />
        <span className="text-[1rem]">{t("Retour")}</span>
      </button> */}

      {documentationPage !== "Dashboard" &&
        documentationPage !== "Ajouter_modifier_geofence" && (
          <button
            onClick={() => {
              backToPagePrecedent();
              backToPagePrecedent();
            }}
            // disabled={historyRef.current.length === 0}
            className={` ${
              documentationPage === "Localisation_devices"
                ? "top-[7rem] md:top-[2rem]"
                : "top-[.5rem] md:top-[2rem]"
            } text-xl border-- shadow-lg-- shadow-black/10 bg-white rounded-md px-2 py-1  gap-2 items-center absolute z-[999999999999]  -right-[6.6rem] md:-right-[7rem] lg:flex hidden text-gray-600 cursor-pointer`}
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
        className="h-[105vh] pb-[20rem] mt-5 font-semibold-- flex flex-col overflow-auto"
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
        <div className="ajouter-appareil-container transition-all   ">
          <div
            className={`$ flex items-center   justify-between  gap-2   py-4  cursor-pointer px-3`}
          >
            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10], // Décalage horizontal et vertical
                    },
                  },
                  {
                    name: "zIndex",
                    enabled: true,
                    phase: "write",
                    fn: ({ state }) => {
                      state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
              title={`${t("Voir les infos sur le compte")}`}
            >
              <FaUserCircle
                onClick={() => {
                  setDocumentationPage("userInfo");
                  navigate("/userInfo");
                  closeSideBar();
                  setShowSideBar2(false);
                }}
                className="text-[3rem] min-w-[1.5rem] text-gray-500"
              />
            </Tooltip>
            <div
              onClick={() => {
                if (isDashboardHomePage) {
                  setChooseOtherAccountGestion(true);
                  setChooseOneAccountToContinue(false);
                  setChooseAccountFromGeozoneSection(false);
                }
                closeSideBar();
                setShowSideBar2(false);
              }}
              className="w-full"
            >
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
            {isDashboardHomePage && (
              <Tooltip
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -10], // Décalage horizontal et vertical
                      },
                    },
                    {
                      name: "zIndex",
                      enabled: true,
                      phase: "write",
                      fn: ({ state }) => {
                        state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                      },
                    },
                  ],
                }}
                title={`${t("Choisir un autre compte")}`}
              >
                <FaChevronDown
                  onClick={() => {
                    setChooseOtherAccountGestion(true);
                  }}
                  className="text-lg"
                />
              </Tooltip>
            )}
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="relative">
          <div
            onClick={() => {
              setShowSideBar2(true);
              setReadDocumentationSideBar(true);
            }}
            className="mb-4 border border-gray-300 rounded-md overflow-hidden flex justify-between items-center"
          >
            <input
              id="search"
              name="search"
              type="search"
              placeholder={`${t("Rechercher une option")}`}
              required
              value={searchGroupInputTerm}
              onChange={(e) => {
                setSearchGroupInputTerm(e.target.value);
              }}
              className=" px-3 w-full focus:outline-none dark:text-white  dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
            />
          </div>
          {searchGroupInputTerm && (
            <div className="absolute top-[3rem] overflow-auto max-h-[100vh] left-0 w-full bg-white shadow-lg shadow-black/50 rounded-lg p-3 pl-0">
              {filteredOptionListe?.length > 0 ? (
                filteredOptionListe?.map((option, index) => {
                  return (
                    <div
                      onClick={() => {
                        if (option.link) navigate(option.link);
                        if (option.setVariable) option.setVariable();
                        setSearchGroupInputTerm("");
                        closeSideBar();
                        setShowSideBar2(false);
                      }}
                      className="flex cursor-pointer gap-3 items-center pl-3 w-full hover:bg-orange-50"
                      key={index}
                    >
                      <IoSearch className="text-orange-300" />
                      <p className="py-2 ">{option?.name}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-center font-semibold py-3">{`${t(
                  "Pas de résultat"
                )}`}</p>
              )}
            </div>
          )}
        </div>
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
              setShowSideBar2(false);

              setReadDocumentation(false);
              setSelectedVehicleToShowInMap(null);
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
        {isDashboardHomePage && !readDocumentation && (
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
                setShowSideBar2(false);
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
                  setShowSideBar2(false);
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
          <Link
            to="/Localisation_devices"
            className="ajouter-appareil-container transition-all hover:border-b  "
          >
            <div
              onClick={() => {
                setSelectedVehicleToShowInMap(null);

                if (currentAccountSelected) {
                  setListeGestionDesVehicules(
                    currentAccountSelected?.accountDevices
                  );
                } else {
                  setListeGestionDesVehicules(accountDevices);
                }
                updateAppareilsEtGeofencesPourCarte();
                scrollToTop();
                setDocumentationPage("Localisation_devices");
                setAjouterGeofencePopup(false);
                closeSideBar();
                setShowSideBar2(false);
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
                  setShowSideBar2(false);
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

                    setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
                  } else {
                    setListeGestionDesGroupe(accountGroupes);

                    setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
                  }
                  scrollToTop();
                  setDocumentationPage("Gestion_des_groupes");
                  closeSideBar();
                  setShowSideBar2(false);
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
                  setShowSideBar2(false);
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
                setShowSideBar2(false);
              }}
              className={`${
                documentationPage === "Historique_appareil"
                  ? "bg-orange-50"
                  : ""
              } flex items-center-- ajouter-appareil-container-2 gap-2  border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <FaListUl className="text-xl min-w-[1.5rem] text-orange-600" />
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
                setShowSideBar2(false);
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
                  setShowSideBar2(false);
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
            </Link>
          )}

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
                setFilteredColorCategorieListe(null);
                setDocumentationPage("Gestion_des_appareils");
                scrollToTop();
                closeSideBar();
                setShowSideBar2(false);

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
          {/*  */}
          {/*  */}
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
                setShowSideBar2(false);
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
          </Link>
          {/*  */}

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
                setShowSideBar2(false);
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
          {/* setReadDocumentation(false); */}
          {/*  */}
          {/* <div className="ajouter-appareil-container transition-all hover:border-b  ">
              <div
                onClick={() => {
                  closeSideBar();
          setShowSideBar2(false);

                  setReadDocumentation(true);
                  navigate("/installation_application");
                }}
                className={`${
                  documentationPage === "installation" ? "bg-orange-50" : ""
                } flex items-center ajouter-appareil-container-2 gap-2   border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
              >
                <FaBook className="text-xl min-w-[1.5rem] text-orange-600" />
                <div className="flex w-full justify-between">
                  <p className="text-gray-600 text-[1rem] font-semibold">
                    {t("Manuel d'utilisation")}
                  </p>
                </div>
              </div>
            </div> */}
          {/*  */}
          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                closeSideBar();
                setShowSideBar2(false);
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
                ouvrirPDF();
                // closeSideBar();
                // setShowSideBar2(false);
                // setChooseOtherLanguagePopup(true);
              }}
              className={`${
                documentationPage === "installation" ? "bg-orange-50" : ""
              } flex items-center ajouter-appareil-container-2 gap-2   border-b border-b-gray-200 py-4 hover:bg-orange-50 cursor-pointer px-3`}
            >
              <FaBook className="text-xl min-w-[1.5rem] text-orange-600" />
              <div className="flex w-full justify-between">
                <p className="text-gray-600 text-[1rem] font-semibold">
                  {t("Guide d'utilisation")}
                </p>
              </div>
            </div>
          </div>

          <div className="ajouter-appareil-container transition-all hover:border-b  ">
            <div
              onClick={() => {
                closeSideBar();
                setShowSideBar2(false);

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
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        {/*  */}
      </div>
    </div>
  );
}

export default SideBarSysadmin;
