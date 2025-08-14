import React, { useContext, useEffect, useState } from "react";
import { IoClose, IoEarth, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link, useNavigate } from "react-router-dom";

import {
  FaChevronDown,
  FaChevronRight,
  FaPlusCircle,
  FaUserPlus,
} from "react-icons/fa";
import ChooseOtherGeofenceDashboard from "../components/dashboard_containt/ChooseOtherGeofenceDashboard";
import { useTranslation } from "react-i18next";

function GestionGeofences({
  // isDashboardHomePage = false,
  setChooseOtherAccountGestion,
  setDocumentationPage,
  setChooseOneAccountToContinue,
  setChooseAccountFromGeozoneSection,
  showChooseGeofencesToModifyMessage,
  setShowChooseGeofencesToModifyMessage,

  ///////////////////////
  showChooseItemToModifyMessage,
  setshowChooseItemToModifyMessage,
  showChooseItemToModifyPage,
}) {
  const {
    setAjouterGeofencePopup,
    geofenceData,
    FormatDateHeure,
    currentGeozone,
    setCurrentGeozone,
    setIsEditingGeofence,
    supprimerGeofence,

    gestionAccountData,
    currentAccountSelected,
    accountGeofences,
    //
    isDashboardHomePage,
    documentationPage,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  const [supprimerGeozonePopup, setSupprimerGeozonePopup] = useState(false);
  const navigate = useNavigate();

  let currentGeofenceData;

  if (isDashboardHomePage && currentAccountSelected) {
    currentGeofenceData = currentAccountSelected?.accountGeofences;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    currentGeofenceData = accountGeofences;
  } else if (!isDashboardHomePage) {
    currentGeofenceData = geofenceData;
  }

  //  currentGeofenceData = geofenceData ?? listeGestionDesGeofences;

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  //
  //
  //    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
  const lastUpdateTimeMs = currentGeozone?.lastUpdateTime
    ? currentGeozone?.lastUpdateTime * 1000
    : 0;
  const isCurrentGeozoneActive =
    currentTime - lastUpdateTimeMs < twentyHoursInMs;

  const geozoneID =
    currentGeozone?.geozoneID ||
    `${currentGeozone?.description?.toLowerCase().replace(/\s+/g, "_")}`;

  const supprimerOuModifierGeozone = () => {
    const foundAccount = gestionAccountData?.find(
      (account) => account.accountID === currentGeozone?.accountID
    );

    let accountIDUser;
    let userIDUser;
    let passwordUser;

    if (isDashboardHomePage && currentAccountSelected) {
      accountIDUser = currentAccountSelected?.accountID;
      userIDUser = "admin";
      passwordUser = currentAccountSelected?.password;
    } else if (isDashboardHomePage && !currentAccountSelected) {
      accountIDUser = foundAccount?.accountID;
      userIDUser = "admin";
      passwordUser = foundAccount?.password;
    } else if (!isDashboardHomePage) {
      accountIDUser = localStorage.getItem("accountID");
      userIDUser = localStorage.getItem("username");
      passwordUser = localStorage.getItem("password");
    }

    supprimerGeofence(
      geozoneID,

      accountIDUser,
      userIDUser,
      passwordUser
    );
  };

  // /////////////////////////////////////////////////////////////////

  const [searchGroupInputTerm, setSearchGroupInputTerm] = useState("");
  const [showFilterInputSection, setShowFilterInputSection] = useState(false);

  const filterGeofencesAccountData = searchGroupInputTerm
    ? currentGeofenceData?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchGroupInputTerm.toLowerCase()) ||
          item?.accountID
            .toLowerCase()
            .includes(searchGroupInputTerm.toLowerCase())
      )
    : currentGeofenceData;

  const [chooseOtherGeofencesGestion, setChooseOtherGeofencesGestion] =
    useState(false);
  // const [showGeofenceInCarte, setShowGeofenceInCarte] = useState(true);
  const [showGeofenceInCartePopup, setShowGeofenceInCartePopup] =
    useState(false);

  const nombreDeRésultatParClique = 10;

  const [voir10RésultatPlus, setVoir10RésultatPlus] = useState(1);

  const filterGeofencesAccountDataPagination =
    filterGeofencesAccountData?.slice(
      0,
      voir10RésultatPlus * nombreDeRésultatParClique
    );

  const afficherPlusDeRésultat = () => {
    setVoir10RésultatPlus((prev) => prev + 1);
  };

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const [openGroups, setOpenGroups] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});

  const itemsPerPage = 10;

  const grouped = filterGeofencesAccountData?.reduce((acc, item) => {
    if (!acc[item.accountID]) acc[item.accountID] = [];
    acc[item.accountID].push(item);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(
    (a, b) => b[1].length - a[1].length
  );

  const toggleGroup = (accountID) => {
    setOpenGroups((prev) => ({
      ...prev,
      [accountID]: !prev[accountID],
    }));

    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: prev[accountID] || 1,
    }));
  };

  const showMore = (accountID) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: (prev[accountID] || 1) + 1,
    }));
  };

  // Ouvrir automatiquement le premier groupe au rendu initial
  useEffect(() => {
    if (sortedGroups.length > 0) {
      const firstAccountID = sortedGroups[0][0];
      setOpenGroups({ [firstAccountID]: true }); // 👈 ouvre uniquement le premier
      setVisibleCounts({ [firstAccountID]: 1 }); // 👈 initialise la pagination pour le premier
    }
  }, [currentAccountSelected, documentationPage, currentGeofenceData]);

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className=" bg-white border-white  border rounded-lg">
      <div className="px-4 pb-40 ">
        <ChooseOtherGeofenceDashboard
          chooseOtherGeofencesGestion={chooseOtherGeofencesGestion}
          setChooseOtherGeofencesGestion={setChooseOtherGeofencesGestion}
        />

        <h2
          onClick={() => {
            console.log(accountGeofences);
          }}
          className="mt-[6rem] text-lg text-center font-bold "
        >
          {t("Geozones")}
        </h2>

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
        <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
          <div className="flex gap-2 justify-center mt-4">
            <div
              onClick={() => {
                if (isDashboardHomePage && !currentAccountSelected) {
                  setChooseOneAccountToContinue(true);
                  setChooseOtherAccountGestion(true);
                } else if (isDashboardHomePage && currentAccountSelected) {
                }
                setAjouterGeofencePopup(true);
                setIsEditingGeofence(false);
                setCurrentGeozone();
                setDocumentationPage("Ajouter_modifier_geofence");
                navigate("/Ajouter_modifier_geofence");
              }}
              className="bg-orange-500 w-full cursor-pointer shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3 ">
                <FaUserPlus className="text-2xl" />
                <p className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                  <span className="hidden md:block">
                    {t("Ajouter un Nouveau Geofence")}
                  </span>
                  <span className="md:hidden"> {t("Nouveau Geofence")}</span>
                </p>
              </div>
            </div>{" "}
          </div>
          {!showFilterInputSection && isDashboardHomePage && (
            <div className="flex gap-2 w-full justify-between items-center">
              {isDashboardHomePage && (
                <div
                  onClick={() => {
                    setDocumentationPage("Gestion_geofences");
                    navigate("/Gestion_geofences");

                    setChooseOtherAccountGestion(true);
                    setChooseAccountFromGeozoneSection(true);
                  }}
                  className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
                >
                  <h3 className="w-full text-center font-semibold">
                    {/* Compte: */}
                    <span>
                      {/* {listeGestionDesGroupeTitre || "Tous les geofences"} */}
                      {t("Tous les geofences")}
                    </span>
                  </h3>
                  <FaChevronDown />
                </div>
              )}

              {isDashboardHomePage && (
                <div
                  onClick={() => {
                    setShowFilterInputSection(true);
                  }}
                  className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100"
                >
                  <IoSearchOutline className="text-xl " />
                </div>
              )}
            </div>
          )}
          {(showFilterInputSection || !isDashboardHomePage) && (
            <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
              <input
                id="search"
                name="search"
                type="search"
                placeholder={`${t("Recherche un Geozone")}`}
                required
                value={searchGroupInputTerm}
                onChange={(e) => {
                  setSearchGroupInputTerm(e.target.value);
                }}
                className=" px-3 w-full focus:outline-none dark:text-white  dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
              {isDashboardHomePage && (
                <div
                  onClick={() => {
                    {
                      setShowFilterInputSection(false);
                      setSearchTermInput("");
                    }
                  }}
                  className=" cursor-pointer border-l border-l-gray-300 px-3  py-2 "
                >
                  <IoClose className="text-xl text-red-600" />
                </div>
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
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {showChooseItemToModifyMessage &&
            showChooseItemToModifyPage === "Gestion_geofences" && (
              <div className=" flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                <p className="w-full">{showChooseItemToModifyMessage}</p>
                <IoClose
                  onClick={() => {
                    setshowChooseItemToModifyMessage("");
                  }}
                />
              </div>
            )}

          {sortedGroups?.length > 0 ? (
            sortedGroups?.map(([accountID, geozones]) => (
              <div key={accountID}>
                {!currentAccountSelected && isDashboardHomePage && (
                  <div
                    className="flex justify-between text-md items-center border-b border-orange-300 cursor-pointer hover:bg-orange-100 bg-orange-50 p-3 rounded-lg"
                    onClick={() => toggleGroup(accountID)}
                  >
                    <h2>
                      {t("Liste des geozones de")} :{" "}
                      <span className="font-semibold">{accountID}</span> (
                      {geozones?.length})
                    </h2>
                    <div></div>
                    {openGroups[accountID] ? (
                      <FaChevronRight />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                )}
                {openGroups[accountID] && (
                  <div className="flex flex-col gap-4 mt-6">
                    {geozones
                      ?.slice(0, (visibleCounts[accountID] || 1) * itemsPerPage)
                      ?.map((geozone, index) => {
                        //
                        //
                        //
                        //    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                        const lastUpdateTimeMs = geozone?.lastUpdateTime
                          ? geozone?.lastUpdateTime * 1000
                          : 0;
                        const isActive =
                          currentTime - lastUpdateTimeMs < twentyHoursInMs;

                        return (
                          <div
                            onClick={() => {
                              console.log(geozone);
                            }}
                            className="shadow-inner bg-gray-50 shadow-black/10 /50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                            key={index}
                          >
                            <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                              {index + 1}
                            </div>
                            <div className="flex  gap-3  ">
                              <IoEarth className="text-[3rem] text-orange-500 hidden md:block" />
                              <div className=" w-full flex flex-wrap justify-between gap-x-4">
                                <div>
                                  <IoEarth className="text-[3rem] text-orange-500 md:hidden" />
                                  <div className="flex flex-wrap">
                                    <p className="font-bold">
                                      {t("Nom du Geozone")} :
                                    </p>
                                    <span className="notranslate notranslate dark:text-orange-500 text-gray-600 pl-5">
                                      {geozone?.description}
                                    </span>
                                  </div>{" "}
                                  <div className="flex flex-wrap">
                                    <p className="font-bold">
                                      {t("Id du geozone")} :
                                    </p>
                                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                      {geozone?.geozoneID}
                                    </span>
                                  </div>{" "}
                                  <div className="flex flex-wrap">
                                    <p className="font-bold">
                                      {t("ID du compte")} :
                                    </p>
                                    <span className=" dark:text-orange-500 notranslate text-gray-600 pl-5">
                                      {geozone?.accountID}
                                    </span>
                                  </div>{" "}
                                  <div className="flex flex-wrap">
                                    <p className="font-bold">
                                      {t("Date de creation")} :
                                    </p>
                                    <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                      {
                                        FormatDateHeure(geozone?.lastUpdateTime)
                                          .date
                                      }
                                      <span className="px-3">-</span>
                                      {
                                        FormatDateHeure(geozone?.lastUpdateTime)
                                          .time
                                      }
                                    </span>
                                  </div>{" "}
                                </div>
                              </div>
                            </div>
                            <div className="flex  justify-end md:mr-10 sm:max-w-[30rem] gap-3 mt-3 justify-between-- items-end ">
                              {(isDashboardHomePage ||
                                localStorage.getItem("password")) && (
                                <button
                                  onClick={() => {
                                    setCurrentGeozone(geozone);
                                    setSupprimerGeozonePopup(true);
                                  }}
                                  className={`${
                                    true
                                      ? " bg-red-500 text-white"
                                      : "text-red-600 border-[0.02rem] border-red-500 "
                                  }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
                                >
                                  {t("Supprimer")}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setCurrentGeozone(geozone);
                                  setAjouterGeofencePopup(true);
                                  setIsEditingGeofence(true);
                                  setshowChooseItemToModifyMessage("");
                                  setDocumentationPage(
                                    "Ajouter_modifier_geofence"
                                  );
                                  navigate("/Ajouter_modifier_geofence");
                                }}
                                // to="/Groupe_vehicule_location?tab=localisation"
                                className="bg-gray-100 border border-gray-400 text-center w-[50%] md:w-full text-sm font-semibold rounded-lg py-1 px-4"
                              >
                                {t("Modifier")}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {geozones.length >
                      (visibleCounts[accountID] || 1) * itemsPerPage && (
                      <div className="w-full flex justify-center mt-[4rem]">
                        <button
                          onClick={() => showMore(accountID)}
                          className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                        >
                          {t("Voir plus de Résultat")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {t("Pas de résultat")}
            </div>
          )}
        </div>
      </div>

      {supprimerGeozonePopup && (
        <div className="fixed inset-0 z-10">
          <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
            {/* <!-- overlay --> */}
            <div className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"></div>

            {/* <!-- Modal --> */}
            <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
              <div className="w-full py-2 bg-white cursor-default pointer-events-auto ---dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                <div className="space-y-2 p-2">
                  <div className="p-4 space-y-2 text-center ---dark:text-white">
                    <h2
                      className="text-xl font-bold tracking-tight"
                      id="page-action.heading"
                    >
                      {isCurrentGeozoneActive || isDashboardHomePage
                        ? `${t("Supprimer")}`
                        : `${t("Désactiver")}`}
                    </h2>

                    <p className="text-gray-500">
                      {t("Êtes-vous sûr de")}{" "}
                      {isCurrentGeozoneActive || isDashboardHomePage
                        ? `${t("Supprimer")}`
                        : `${t("Désactiver")}`}{" "}
                      {t("le geozone")} ?
                    </p>
                    <p className="text-red-500 notranslate notranslate font-semibold">
                      {currentGeozone?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="border-t ---dark:border-gray-700 px-2"></div>

                  <div className="px-6 py-2">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                      <button
                        onClick={() => {
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 ---dark:bg-gray-800 ---dark:hover:bg-gray-700 ---dark:border-gray-600 ---dark:hover:border-gray-500 ---dark:text-gray-200 ---dark:focus:text-primary-400 ---dark:focus:border-primary-400 ---dark:focus:bg-gray-800"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">{t("Annuler")}</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          supprimerOuModifierGeozone();
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">
                            {isCurrentGeozoneActive || isDashboardHomePage
                              ? `${t("Supprimer")}`
                              : `${t("Désactiver")}`}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionGeofences;
