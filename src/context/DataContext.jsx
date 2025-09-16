// DataContextProvider.js
// Q5w4i4w9M8V2P9P

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import pLimit from "p-limit";
import { debounce } from "lodash";

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  let versionApplication = "9.0";
  let x;
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const ItAccount = "sysadmin";
  const ItUser = "monitoring";
  const ItSysUser = "admin";
  const ItPassword = "123456";
  const AdminPassword = "OctagonoGPSHaitiAdmin13@1919";
  const ItCountry = "ht";

  const [isItUser, setIsItUser] = useState(() => {
    const stored = localStorage.getItem("isItUser");
    return stored ? JSON.parse(stored) : false;
  });

  // chaque fois que isItUser change → on le sauvegarde
  useEffect(() => {
    localStorage.setItem("isItUser", JSON.stringify(isItUser));
  }, [isItUser]);

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;

  const currentTimeSec = getCurrentTimestamp();
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes

  //

  // Pour compter le nombre de requêtes
  const [countRequête, setCountRequête] = useState(() => {
    const storedCountRequête = localStorage.getItem("countRequête");
    return storedCountRequête && storedCountRequête !== "undefined"
      ? JSON.parse(storedCountRequête)
      : 0;
  });

  const incrementerRequête = () => {
    setCountRequête((prevCount) => {
      const newCount = (prevCount ?? 0) + 1;
      localStorage.setItem("countRequête", JSON.stringify(newCount));
      return newCount;
    });
  };

  const [
    showAnnimationProgresseBarDashboard,
    setShowAnnimationProgresseBarDashboard,
  ] = useState(true);

  const [isCreatingNewElement, setIsCreatingNewElement] = useState(true);
  const [chooseOneAccountToContinue, setChooseOneAccountToContinue] =
    useState(false);

  const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
    useState(false);

  const [moveDeviceToOtherCompte, setMoveDeviceToOtherCompte] = useState(false);

  const [showChooseItemToModifyMessage, setshowChooseItemToModifyMessage] =
    useState("");
  const [showChooseItemToModifyPage, setshowChooseItemToModifyPage] =
    useState("");

  const [documentationPage, setDocumentationPage] = useState("Dashboard");
  const [showPageRaccourciComponent, setShowPageRaccourciComponent] =
    useState("");

  const [progressAnimationStart, setProgressAnimationStart] = useState(0);
  const [chooseAccountID, setChooseAccountID] = useState("");
  const [runningAnimationProgressLoading, setRunningAnimationProgressLoading] =
    useState(false);
  const [
    runningAnimationProgressDuration,
    setRunningAnimationProgressDuration,
  ] = useState(200);

  const [
    isSearchingFromRapportGroupePage,
    setIsSearchingFromRapportGroupePage,
  ] = useState(false);

  // mise a jour auto des donnees des devices
  const [updateAuto, setupdateAuto] = useState(false);
  const [chooseOtherLanguagePopup, setChooseOtherLanguagePopup] =
    useState(false);

  const [showConfirmationMessagePopup, setShowConfirmationMessagePopup] =
    useState(false);
  const [confirmationMessagePopupTexte, setConfirmationMessagePopupTexte] =
    useState("");
  const [confirmationMessagePopupName, setConfirmationMessagePopupName] =
    useState("");

  // Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("updateAuto", JSON.stringify(updateAuto));
  }, [updateAuto]);

  const [estLancerUpdateAuto, setEstLancerUpdateAuto] = useState(false);

  useEffect(() => {
    if (estLancerUpdateAuto) {
      setTimeout(() => {
        setEstLancerUpdateAuto(false);
      }, 3000);
    }
  }, [estLancerUpdateAuto]);

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Login / logout / security variables
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // to store login user data  // account, username, password
  const [readDocumentation, setReadDocumentation] = useState(false);

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const [adminUserData, setAdminUserData] = useState(() => {
    const storedUserData = localStorage.getItem("adminUserData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    const storedUserRole = localStorage.getItem("userRole");
    return storedUserRole ? JSON.parse(storedUserRole) : null;
  });

  const [isDashboardHomePage, setIsDashboardHomePage] = useState(() => {
    const storedIsDashboardHomePage = localStorage.getItem(
      "isDashboardHomePage"
    );
    return storedIsDashboardHomePage
      ? JSON.parse(storedIsDashboardHomePage)
      : false;
  });

  // const [isDashboardHomePage, setIsDashboardHomePage] = useState(false);

  const [deviceListeTitleGestion, setDeviceListeTitleGestion] = useState("");

  // États de base
  const [comptes, setComptes] = useState([]);
  const [accountDevices, setAccountDevices] = useState([]);
  const [accountGeofences, setAccountGeofences] = useState([]);
  const [accountGroupes, setAccountGroupes] = useState([]);
  const [accountUsers, setAccountUsers] = useState([]);
  const [accountRules, setAccountRules] = useState([]);
  const [accountRulesActive, setAccountRulesActive] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [userGroupes, setUserGroupes] = useState([]);
  const [véhiculeDetails, setVehiculeDetails] = useState([]);
  const [groupeDevices, setGroupeDevices] = useState([]);
  const [showGeofenceInCarte, setShowGeofenceInCarte] = useState(true);

  // États liés à la gestion
  const [gestionAccountData, setGestionAccountData] = useState();

  const [currentAccountSelected, setCurrentAccountSelected] = useState();
  const [currentSelectedUserToConnect, setCurrentSelectedUserToConnect] =
    useState();
  const [currentSelectedDeviceGestion, setCurrentSelectedDeviceGestion] =
    useState();

  const [currentSelectedGroupeGestion, setCurrentSelectedGroupeGestion] =
    useState();

  const [listeGestionDesVehicules, setListeGestionDesVehicules] = useState([]);
  const [listeGestionDesGeofences, setListeGestionDesGeofences] = useState([]);
  const [listeGestionDesGroupe, setListeGestionDesGroupe] = useState([]);
  const [listeGestionDesGroupeTitre, setListeGestionDesGroupeTitre] =
    useState("");
  const [listeGestionDesUsers, setListeGestionDesUsers] = useState([]);
  const [listeGestionDesRules, setListeGestionDesRules] = useState([]);
  const [listeGestionDesRulesActive, setListeGestionDesRulesActive] = useState(
    []
  );

  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesRules(currentAccountSelected?.accountRules);
    } else {
      setListeGestionDesRules(
        accountRules?.filter((acct) => acct?.accountID !== "sysadmin")
      );
    }
  }, [currentAccountSelected]);

  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesRulesActive(currentAccountSelected?.accountRulesActive);
    } else {
      setListeGestionDesRulesActive(accountRulesActive);
    }
  }, [currentAccountSelected]);
  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesRulesActive(currentAccountSelected?.accountRulesActive);
    } else {
      setListeGestionDesRulesActive(accountRulesActive);
    }
  }, []);

  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesRules(currentAccountSelected?.accountRules);
    } else {
      setListeGestionDesRules(
        accountRules?.filter((acct) => acct?.accountID !== "sysadmin")
      );
    }
  }, []);

  // Effet principal : met à jour currentAccountSelected quand les données changent
  useEffect(() => {
    if (!currentAccountSelected) return;

    const compteMisAJour = gestionAccountData?.find(
      (compte) => compte?.accountID === currentAccountSelected?.accountID
    );

    if (compteMisAJour) {
      setCurrentAccountSelected(compteMisAJour);
      setListeGestionDesUsers(compteMisAJour?.accountUsers);
      setListeGestionDesRules(compteMisAJour?.accountRules);
      setListeGestionDesRulesActive(compteMisAJour?.accountRulesActive);
      setListeGestionDesGroupe(compteMisAJour?.accountGroupes);
      setListeGestionDesVehicules(compteMisAJour?.accountDevices);
      setListeGestionDesGeofences(compteMisAJour?.accountGeofences);
    } else {
      console.warn("❌ Aucun compte trouvé avec cet ID.");
    }
  }, [
    comptes,
    accountDevices,
    accountGeofences,
    accountGroupes,
    accountUsers,
    accountRules,
    accountRulesActive,
    groupeDevices,
    userGroupes,
    véhiculeDetails,
    gestionAccountData,
  ]);

  // Quand currentAccountSelected est mis à jour, mettre à jour l'utilisateur sélectionné
  useEffect(() => {
    if (!currentAccountSelected || !currentSelectedUserToConnect) return;

    const utilisateurActuel = currentAccountSelected?.accountUsers?.find(
      (user) => user?.userID === currentSelectedUserToConnect?.userID
    );

    if (utilisateurActuel) {
      setCurrentSelectedUserToConnect(utilisateurActuel);
    } else {
      console.warn("❌ Utilisateur non trouvé dans le compte sélectionné.");
    }
  }, [currentAccountSelected]);

  const [dashboardLoadingEffect, setDashboardLoadingEffect] = useState(false);
  const [dashboardLoadingEffectLogin, setDashboardLoadingEffectLogin] =
    useState(false);

  const loadForManySecond = () => {};

  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesGeofences(currentAccountSelected?.accountGeofences);
      setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
      setListeGestionDesGroupe(currentAccountSelected?.accountGroupes);
      setListeGestionDesUsers(currentAccountSelected?.accountUsers);
      setListeGestionDesRules(currentAccountSelected?.accountRules);
      setListeGestionDesRulesActive(currentAccountSelected?.accountRulesActive);
    } else {
      setListeGestionDesVehicules(accountDevices);
      setListeGestionDesGeofences(accountGeofences);

      setListeGestionDesGroupe(accountGroupes);

      setListeGestionDesUsers(accountUsers);
      setListeGestionDesRules(
        accountRules?.filter((acct) => acct?.accountID !== "sysadmin")
      );
      setListeGestionDesRulesActive(accountRulesActive);
    }
  }, [currentAccountSelected]);

  // /////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////

  const [geofenceData, setGeofenceData] = useState(null);

  const geofenceDataRef = useRef(geofenceData);

  useEffect(() => {
    geofenceDataRef.current = geofenceData;
  }, [geofenceData]);

  // variable to store the user personal login info
  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [adminAccount, setAdminAccount] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [currentCountry, setCurrentCountry] = useState("");

  let currentAPI = "/octagono-plus-api/track/Service";

  if (
    localStorage.getItem("currentCountry") === "rd" ||
    currentCountry === "rd"
  ) {
    currentAPI = "/octagono-gps-api/track/Service";
  } else {
    currentAPI = "/octagono-plus-api/track/Service";
  }

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }
    if (adminUsername) {
      localStorage.setItem("adminUsername", adminUsername);
    }
  }, [username, adminUsername]);

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  // to show the log out popup
  const [logOutPopup, setLogOutPopup] = useState(false);

  let isAuthenticated;

  if (account || adminAccount || userData || adminUserData) {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }

  //
  //
  //
  //
  //
  //

  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOME PAGE variables
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // to show or display the search input in the header
  const [search, setSearch] = useState(false);

  // loading pour la page home apres login
  const [isHomePageLoading, setIsHomePageLoading] = useState(false);

  // État pour stocker le terme de recherche dans le header
  const [searchQueryForHeader, setSearchQueryForHeader] = useState("");

  // to show the side bar
  const [showSideBar, setShowSideBar] = useState(true);

  // véhicule data in home page
  const [véhiculeData, setVehicleData] = useState(() => {
    const storedVehicleData = localStorage.getItem("véhiculeData");
    return storedVehicleData ? JSON.parse(storedVehicleData) : null;
  });

  const véhiculeDataRef = useRef(véhiculeData);

  useEffect(() => {
    véhiculeDataRef.current = véhiculeData;
  }, [véhiculeData]);

  const [vehicleDetails, setVehicleDetails] = useState([]);

  // const [mergedDataHome, setMergedDataHome] = useState(null);

  const vehicleDetailsRef = useRef(vehicleDetails);

  useEffect(() => {
    vehicleDetailsRef.current = vehicleDetails;
  }, [vehicleDetails]);

  // véhiculeData and vehicleDetails together
  const [mergedDataHome, setMergedDataHome] = useState(null);

  // véhicule actuelle
  const [currentVéhicule, setCurrentVéhicule] = useState(null); // 1. Déclaration de currentVéhicule

  // to show the véhicules options like in the homePage
  const [showListeOption, setShowListOption] = useState(false);

  //  Pour filtrer les donnee dans la page d’accueil en cliquant sur les statistics
  const [statisticFilterInHomePage, setStatisticFilterInHomePage] = useState();

  //  Pour savoir le filtrer actuelle afin d'ajouter une indication // le petit point a droite du text
  const [statisticFilterTextInHomePage, setStatisticFilterTextInHomePage] =
    useState("");

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
  //
  x;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Rapport page variables
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // véhicule details in rapport page

  const [rapportVehicleDetails, setRapportVehicleDetails] = useState([]);

  const rapportVehicleDetailsRef = useRef(rapportVehicleDetails);

  useEffect(() => {
    rapportVehicleDetailsRef.current = rapportVehicleDetails;
  }, [rapportVehicleDetails]);

  //véhicule search data in rapport page
  const [searchRapportVehicleDetails, setSearchRapportVehicleDetails] =
    useState([]);

  // loading for the rapport page
  const [rapportDataLoading, setRapportDataLoading] = useState(false);

  const [donneeFusionnéForRapport, setDonneeFusionnéForRapport] = useState();

  // liste des véhicule ayant déplacer aujourd'hui
  const [véhiculeActiveToday, setVéhiculeActiveToday] = useState([]);

  // liste des vehicles en stationnement aujourd'hui
  const [véhiculeNotActiveToday, setVéhiculeNotActiveToday] = useState([]);

  // Vehicles sans details ou non mise a jour
  const [véhiculeHorsService, setVéhiculeHorsService] = useState([]);

  // véhicules en déplacement actuellement / maintenant
  const [véhiculeEnMouvementMaintenant, setVéhiculeEnMouvementMaintenant] =
    useState([]);

  // Pour stocker les donnees de recherches /  rapportVehicleDetails and véhiculeData together
  const [searchDonneeFusionnéForRapport, setSearchDonneeFusionnéForRapport] =
    useState([]);

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
  //
  //
  //
  //
  //
  //
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Ajouter nouveau appareil variables
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // loading for create véhicule page
  const [createVéhiculeLoading, setCreateVéhiculeLoading] = useState(false);

  // to display error for creating véhicule or login
  const [error, setError] = useState();

  // to show the confirm password popup in user page
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

  const [ajouterGeofencePopup, setAjouterGeofencePopup] = useState(false);

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
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Historique page variables
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // to choose the only véhicule to show in the map
  const [selectedVehicleToShowInMap, setSelectedVehicleToShowInMap] =
    useState(null);

  const [
    selectedVehicleHistoriqueToShowInMap,
    setSelectedVehicleHistoriqueToShowInMap,
  ] = useState(false);

  //loading for Historique page
  const [loadingHistoriqueFilter, setLoadingHistoriqueFilter] = useState(false);

  // to show the map in the historique page
  const [showHistoriqueInMap, setShowHistoriqueInMap] = useState(false);

  // Pour stocker les donnee dans la page Historique
  const [véhiculeHistoriqueDetails, setVéhiculeHistoriqueDetails] = useState(
    []
  );

  const [historiqueSelectedLocationIndex, setHistoriqueSelectedLocationIndex] =
    useState(null);

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
  //
  //
  //
  //
  //
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TimeZone  component
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // Pour stocker le data des timezones.
  const [timeZoneData, setTimeZoneData] = useState([]);

  // Pour stocker le terme de recherche de timezone.
  const [timeZoneSearchQuery, setTimeZoneSearchQuery] = useState(""); // État pour la recherche

  // Pour stocker les choix de timezones.
  const [selectedTimeZone, setSelectedTimeZone] = useState(() => {
    return localStorage.getItem("selectedTimeZone") || "";
  });
  const [selectUTC, setSelectUTC] = useState(() => {
    return localStorage.getItem("selectUTC") || "";
  });
  const [selectTime, setSelectTime] = useState(() => {
    return localStorage.getItem("selectTime") || "";
  });

  // Pour le réglage des difference d'heure du timezone
  let addHoursFrom = -5;
  let addHoursTo = 0;
  if (selectUTC > -5 && selectUTC <= 0) {
    addHoursFrom = -7;
  } else if (selectUTC > 0) {
    addHoursFrom = -(Number(selectUTC) + 7);
  }
  let addSearchHoursFin = 0;
  if (selectUTC > -5) {
    addSearchHoursFin = Number(selectUTC) + 5;
  }
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
  //
  //
  //
  const [showAccountOptionsPopup, setShowAccountOptionsPopup] = useState(false);
  const [showSelectedUserOptionsPopup, setShowSelectedUserOptionsPopup] =
    useState(false);

  // const []
  //
  //
  //
  //
  //
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Time From and Time to...
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  const now = new Date();
  now.setHours(now.getHours() + addSearchHoursFin); // Ajouter d'heures en plus.

  const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  // Création d'une date représentant le début de la journée
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Ajouter d'heures en plus.
  startOfDay.setTime(startOfDay.getTime() - 0 * 60 * 60 * 1000);

  // Formatage de `TimeFrom`
  const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${startOfDay
    .getDate()
    .toString()
    .padStart(2, "0")} ${startOfDay
    .getHours()
    .toString()
    .padStart(2, "0")}:${startOfDay
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${startOfDay.getSeconds().toString().padStart(2, "0")}`;

  //
  //
  //
  //
  //
  //
  const [appareilPourAfficherSurCarte, setAppareilPourAfficherSurCarte] =
    useState([]);
  let [geofencePourAfficherSurCarte, setGeofencePourAfficherSurCarte] =
    useState([]);

  const updateAppareilsEtGeofencesPourCarte = () => {
    // setHistoriqueSelectedLocationIndex(null);
    const dataFusionnéHome = mergedDataHome
      ? Object.values(mergedDataHome)
      : [];
    //
    //
    if (isDashboardHomePage && currentAccountSelected) {
      const appareils = currentAccountSelected?.accountDevices;

      setAppareilPourAfficherSurCarte(
        addVehiculeDetailsFonction(appareils, véhiculeDetails)
      );
      setGeofencePourAfficherSurCarte(currentAccountSelected?.accountGeofences);
      //
    } else if (isDashboardHomePage && !currentAccountSelected) {
      const appareils = accountDevices;

      setAppareilPourAfficherSurCarte(
        addVehiculeDetailsFonction(appareils, véhiculeDetails)
      );

      setGeofencePourAfficherSurCarte(accountGeofences);
    } else if (!isDashboardHomePage) {
      setAppareilPourAfficherSurCarte(dataFusionnéHome);
      setGeofencePourAfficherSurCarte(geofenceData);
    }
  };

  //
  //
  //
  //
  //
  //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //

  const addVehiculeDetailsFonction = (deviceListe, véhiculeDetails) => {
    return deviceListe?.map((device) => {
      const match = véhiculeDetails?.find(
        (v) =>
          v.deviceID === device.deviceID &&
          v.véhiculeDetails?.[0]?.accountID === device.accountID
      );

      if (match && match.véhiculeDetails.length > 0) {
        return { ...device, véhiculeDetails: match.véhiculeDetails };
      }

      return device;
    });
  };

  const [allDevices, setAllDevices] = useState([]);

  const [filteredColorCategorieListe, setFilteredColorCategorieListe] =
    useState(null);
  const [
    isFilteredCartePositionByCategorie,
    setIsFilteredCartePositionByCategorie,
  ] = useState(false);

  useEffect(() => {
    const initialList = isDashboardHomePage
      ? addVehiculeDetailsFonction(
          currentAccountSelected?.accountDevices,
          véhiculeDetails
        ) || addVehiculeDetailsFonction(accountDevices, véhiculeDetails)
      : // ? currentAccountSelected?.accountDevices || accountDevices
      mergedDataHome
      ? Object.values(mergedDataHome)
      : [];

    setAllDevices(initialList);
    setListeGestionDesVehicules(initialList);
    setFilteredColorCategorieListe(initialList);
  }, [
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    mergedDataHome,
    véhiculeDetails,
    gestionAccountData,
  ]);

  const [devicesCalculated, setDevicesCalculated] = useState({
    DeviceDéplacer: [],
    EnDéplacement: [],
    DeviceNonDeplacer: [],
    DeviceListeActif: [],
    DeviceEnStationnement: [],
    DeviceInactifs: [],
    DeviceInactifsWidthDetails: [],
    DeviceInactifsWidthNoDetails: [],
  });

  useEffect(() => {
    const computeDevices = () => {
      const d = {
        DeviceDéplacer: [],
        EnDéplacement: [],
        DeviceNonDeplacer: [],
        DeviceEnStationnement: [],
        DeviceListeActif: [],
        DeviceInactifs: [],
        DeviceInactifsWidthDetails: [],
        DeviceInactifsWidthNoDetails: [],
      };

      const idsÀExclure = new Set();

      addVehiculeDetailsFonction(allDevices, véhiculeDetails)?.forEach(
        (device) => {
          const lastUpdateTimeSec =
            device?.véhiculeDetails?.[0]?.timestamp ?? 0;
          const lastStopTime = device?.lastStopTime ?? 0;
          const details = device?.véhiculeDetails?.[0];
          const speed = details?.speedKPH ?? 0;

          // Actifs
          if (
            currentTimeSec - lastUpdateTimeSec < twentyFourHoursInSec &&
            device?.véhiculeDetails?.length > 0
          ) {
            d.DeviceListeActif.push(device);

            if (speed > 0) d.EnDéplacement.push(device);
            else d.DeviceEnStationnement.push(device);

            if (speed > 0 || lastStopTime > todayTimestamp)
              d.DeviceDéplacer.push(device);
            else d.DeviceNonDeplacer.push(device);
          } else {
            // Inactifs
            d.DeviceInactifs.push(device);
            if (device?.véhiculeDetails?.length > 0)
              d.DeviceInactifsWidthDetails.push(device);
            else d.DeviceInactifsWidthNoDetails.push(device);
          }
        }
      );

      return d;
    };

    const handler = debounce(() => {
      setDevicesCalculated(computeDevices());
    }, 300); // recalcul max toutes les 100ms

    handler();
    return () => handler.cancel();
  }, [
    allDevices,
    todayTimestamp,
    mergedDataHome,
    véhiculeDetails,
    gestionAccountData,
    filteredColorCategorieListe,
  ]);

  // Tu peux ensuite déstructurer
  const {
    DeviceDéplacer,
    EnDéplacement,
    DeviceNonDeplacer,
    DeviceListeActif,
    DeviceEnStationnement,
    DeviceInactifs,
    DeviceInactifsWidthDetails,
    DeviceInactifsWidthNoDetails,
  } = devicesCalculated;

  // const {
  //   DeviceDéplacer,
  //   EnDéplacement,
  //   //
  //   DeviceNonDeplacer,
  //   DeviceListeActif,
  //   DeviceEnStationnement,
  //   //
  //   DeviceInactifs,
  //   DeviceInactifsWidthDetails,
  //   DeviceInactifsWidthNoDetails,
  //   //
  // } = useMemo(() => {
  //   const d = {
  //     DeviceDéplacer: [],
  //     EnDéplacement: [],
  //     //
  //     DeviceNonDeplacer: [],
  //     DeviceEnStationnement: [],
  //     DeviceListeActif: [],
  //     //
  //     DeviceInactifs: [],
  //     DeviceInactifsWidthDetails: [],
  //     DeviceInactifsWidthNoDetails: [],
  //   };

  //   const idsÀExclure = new Set();

  //   addVehiculeDetailsFonction(allDevices, véhiculeDetails)?.forEach(
  //     (device) => {
  //       //
  //       const lastUpdateTimeSec = device?.véhiculeDetails?.[0]?.timestamp ?? 0;
  //       const lastStopTime = device?.lastStopTime ?? 0;
  //       const details = device?.véhiculeDetails?.[0];
  //       const speed = details?.speedKPH ?? 0;

  //       //////////////////////////////////////////////////////////////////
  //       //////////////////////////////////////////////////////////////////

  //       // Actifs
  //       if (
  //         currentTimeSec - lastUpdateTimeSec < twentyFourHoursInSec &&
  //         device?.véhiculeDetails?.length > 0
  //         ////////
  //       ) {
  //         // ACTIFS ********
  //         d.DeviceListeActif.push(device);

  //         if (speed > 0) {
  //           // En Déplacement
  //           d.EnDéplacement.push(device);
  //         } else {
  //           // En stationnement
  //           d.DeviceEnStationnement.push(device);
  //         }

  //         ///////////////////////////////////////////////////
  //         //  déplacer :
  //         if (speed > 0 || lastStopTime > todayTimestamp) {
  //           d.DeviceDéplacer.push(device);
  //         }
  //         // Non déplacer
  //         else {
  //           d.DeviceNonDeplacer.push(device);
  //         }
  //       } else {
  //         // INACTIF *********
  //         d.DeviceInactifs.push(device);
  //         if (device?.véhiculeDetails?.length > 0) {
  //           // INACTIF Width Details
  //           d.DeviceInactifsWidthDetails.push(device);
  //         } else {
  //           // INACTIF Width NO Details
  //           d.DeviceInactifsWidthNoDetails.push(device);
  //         }
  //       }

  //       ////////////////////////
  //     }
  //   );

  //   return d;
  // }, [
  //   allDevices,
  //   todayTimestamp,
  //   mergedDataHome,
  //   véhiculeDetails,
  //   gestionAccountData,
  //   filteredColorCategorieListe,
  // ]);

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 12);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("mergedDataHome")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("mergedDataHome", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("vehicleDetails")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("vehicleDetails", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("geofenceData")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("geofenceData", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("comptes")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("comptes", { autoIncrement: true });
        }
        //
        if (!db.objectStoreNames.contains("accountDevices")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountDevices", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("accountGeofences")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountGeofences", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("accountGroupes")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountGroupes", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("groupeDevices")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("groupeDevices", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("userGroupes")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("userGroupes", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("véhiculeDetails")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("véhiculeDetails", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("accountUsers")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountUsers", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("accountRules")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountRules", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("accountRulesActive")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("accountRulesActive", { autoIncrement: true });
        }
      };

      request.onerror = (error) => reject(error);
      request.onsuccess = (event) => resolve(event.target.result);
    });
  };

  const saveDataToIndexedDB = (storeName, data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log("Aucune donnée à enregistrer.");
      return;
    }
    openDatabase().then((db) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      store.clear(); // Supprime les anciennes données
      // Si data est un tableau, ajoute chaque élément séparément
      if (Array.isArray(data)) {
        data?.forEach((item) => store.put(item));
      } else {
        store.put(data); // Ajoute l'objet directement sans enveloppe
      }
    });
  };

  const getDataFromIndexedDB = (storeName) => {
    return openDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll(); // Utilise getAll() pour tout récupérer

        request.onsuccess = () => {
          resolve(request.result || []); // Retourne un tableau vide si aucun résultat
        };
        request.onerror = () =>
          reject("Erreur lors de la récupération des données.");
      });
    });
  };

  // Récupérer les données au chargement
  useEffect(() => {
    getDataFromIndexedDB("mergedDataHome").then((data) => {
      if (data[0]) {
        // if (data.length > 0) {
        setMergedDataHome(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("vehicleDetails").then((data) => {
      // if (data.length > 0) {
      setVehicleDetails(data);
      // }
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("geofenceData").then((data) => {
      setGeofenceData(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("comptes").then((data) => {
      setComptes(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountDevices").then((data) => {
      setAccountDevices(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountGeofences").then((data) => {
      setAccountGeofences(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountGroupes").then((data) => {
      setAccountGroupes(data);
    });
  }, []);
  useEffect(() => {
    getDataFromIndexedDB("groupeDevices").then((data) => {
      setGroupeDevices(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("userGroupes").then((data) => {
      setUserGroupes(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("véhiculeDetails").then((data) => {
      setVehiculeDetails(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountUsers").then((data) => {
      setAccountUsers(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountRules").then((data) => {
      setAccountRules(data);
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("accountRulesActive").then((data) => {
      setAccountRulesActive(data);
    });
  }, []);

  // Sauvegarder les données lorsqu'elles changent
  useEffect(() => {
    if (mergedDataHome) {
      saveDataToIndexedDB("mergedDataHome", mergedDataHome);
    }
  }, [mergedDataHome]);

  useEffect(() => {
    if (vehicleDetails) {
      saveDataToIndexedDB("vehicleDetails", vehicleDetails);
    }
  }, [vehicleDetails]);

  useEffect(() => {
    if (geofenceData) {
      saveDataToIndexedDB("geofenceData", geofenceData);
    }
  }, [geofenceData]);

  useEffect(() => {
    if (comptes) {
      saveDataToIndexedDB("comptes", comptes);
    }
  }, [comptes]);

  useEffect(() => {
    if (accountDevices) {
      saveDataToIndexedDB("accountDevices", accountDevices);
    }
  }, [accountDevices]);
  useEffect(() => {
    if (accountGeofences) {
      saveDataToIndexedDB("accountGeofences", accountGeofences);
    }
  }, [accountGeofences]);

  useEffect(() => {
    if (accountGroupes) {
      saveDataToIndexedDB("accountGroupes", accountGroupes);
    }
  }, [accountGroupes]);

  useEffect(() => {
    if (groupeDevices) {
      saveDataToIndexedDB("groupeDevices", groupeDevices);
    }
  }, [groupeDevices]);

  useEffect(() => {
    if (userGroupes) {
      saveDataToIndexedDB("userGroupes", userGroupes);
    }
  }, [userGroupes]);

  useEffect(() => {
    if (véhiculeDetails) {
      saveDataToIndexedDB("véhiculeDetails", véhiculeDetails);
    }
  }, [véhiculeDetails]);

  useEffect(() => {
    if (accountUsers) {
      saveDataToIndexedDB("accountUsers", accountUsers);
    }
  }, [accountUsers]);

  useEffect(() => {
    if (accountRules) {
      saveDataToIndexedDB("accountRules", accountRules);
    }
  }, [accountRulesActive]);
  useEffect(() => {
    if (accountRulesActive) {
      saveDataToIndexedDB("accountRulesActive", accountRulesActive);
    }
  }, [accountRulesActive]);

  // Réinitialiser IndexedDB
  const resetIndexedDB = () => {
    indexedDB.deleteDatabase("MyDatabase");
  };

  const clearDataIndexedbStore = async (storeName) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction([storeName], "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();
      tx.oncomplete = () => console.log(`✅ Store "${storeName}" vidé.`);
      tx.onerror = () => console.error(`❌ Erreur en vidant "${storeName}".`);

      setTimeout(() => {
        //
        if (storeName === "mergedDataHome") {
          setMergedDataHome([]);
        }
        if (storeName === "vehicleDetails") {
          setVehicleDetails([]);
        }

        if (storeName === "geofenceData") {
          setGeofenceData([]);
        }
      }, 3000);
    } catch (error) {
      console.error("Erreur d'ouverture de la base :", error);
    }
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const sourceListe = isDashboardHomePage ? véhiculeDetails : vehicleDetails;
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const sourceListeDevice = isDashboardHomePage ? accountDevices : dataFusionné;

  const ListeDesAlertes = useMemo(() => {
    return sourceListe
      ?.flatMap(
        (obj) =>
          obj.véhiculeDetails?.map((detail) => {
            const speed = parseFloat(detail.speedKPH);

            ///////////////////////////////
            const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24h

            const lastUpdateMs = Number(detail.timestamp) * 1000;
            const updatedRecently =
              Number.isFinite(lastUpdateMs) &&
              currentTimeMs - lastUpdateMs < twentyFourHoursInMs;
            //  inconue
            if (detail.statusCode === "0xF952") {
              if (speed > 0 && updatedRecently) {
                // moving
                detail.statusCode = "0xF112";
              } else {
                // location
                detail.statusCode = "0xF020";
              }
            }

            // moving
            if (detail.statusCode === "0xF112") {
              if (speed <= 0 || !updatedRecently) {
                // location
                detail.statusCode = "0xF020";
              }
            }

            // Vérifier tous les autres codes
            if (
              detail.statusCode !== "0xF952" &&
              detail.statusCode !== "0xF112"
            ) {
              if (speed > 0 && updatedRecently) {
                detail.statusCode = "0xF112";
              }
            }

            return {
              deviceID: obj.deviceID,
              ...detail,
            };
          }) ?? []
      )
      ?.filter((item) =>
        currentAccountSelected
          ? item?.accountID === currentAccountSelected?.accountID
          : true
      );
  }, [
    isDashboardHomePage,
    véhiculeDetails,
    vehicleDetails,
    currentAccountSelected,
    mergedDataHome,
  ]);

  const testAlertListe = véhiculeDetails
    ?.flatMap(
      (obj) =>
        obj.véhiculeDetails?.map((detail) => ({
          deviceID: obj.deviceID,
          ...detail,
        })) ?? [] // important pour éviter undefined
    )
    ?.filter((item) =>
      currentAccountSelected
        ? item?.accountID === currentAccountSelected?.accountID
        : true
    );

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
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Fuseaux Horaires
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // Data pour mettre a jour les timezones
  useEffect(() => {
    const zones = [
      { region: "GMT+12", currentTime: "12:00", utcOffset: 12 },
      { region: "GMT+11", currentTime: "13:00", utcOffset: 11 },
      { region: "GMT+10", currentTime: "14:00", utcOffset: 10 },
      { region: "GMT+9", currentTime: "15:00", utcOffset: 9 },
      { region: "GMT+8", currentTime: "16:00", utcOffset: 8 },
      { region: "GMT+7", currentTime: "17:00", utcOffset: 7 },
      { region: "GMT+6", currentTime: "18:00", utcOffset: 6 },
      { region: "GMT+5", currentTime: "19:00", utcOffset: 5 },
      { region: "GMT+4", currentTime: "20:00", utcOffset: 4 },
      { region: "GMT+3", currentTime: "21:00", utcOffset: 3 },
      { region: "GMT+2", currentTime: "22:00", utcOffset: 2 },
      { region: "GMT+1", currentTime: "23:00", utcOffset: 1 },
      { region: "GMT+0", currentTime: "00:00", utcOffset: 0 },
      { region: "GMT-1", currentTime: "01:00", utcOffset: -1 },
      { region: "GMT-2", currentTime: "02:00", utcOffset: -2 },
      { region: "GMT-3", currentTime: "03:00", utcOffset: -3 },
      { region: "GMT-4", currentTime: "04:00", utcOffset: -4 },
      { region: "GMT-5", currentTime: "05:00", utcOffset: -5 },
      { region: "GMT-6", currentTime: "06:00", utcOffset: -6 },
      { region: "GMT-7", currentTime: "07:00", utcOffset: -7 },
      { region: "GMT-8", currentTime: "08:00", utcOffset: -8 },
      { region: "GMT-9", currentTime: "09:00", utcOffset: -9 },
      { region: "GMT-10", currentTime: "10:00", utcOffset: -10 },
      { region: "GMT-11", currentTime: "11:00", utcOffset: -11 },
      { region: "GMT-12", currentTime: "12:00", utcOffset: -12 },
      { region: "GMT-13", currentTime: "13:00", utcOffset: -13 },
      { region: "GMT-14", currentTime: "14:00", utcOffset: -14 },
    ];
    setTimeZoneData(zones);
  }, []);

  // fonction pour enregistrer les timezone choisis.
  const handleSelectTimeZone = (item) => {
    setSelectedTimeZone(item.region);
    setSelectUTC(item.utcOffset);
    setSelectTime(item.currentTime);
    localStorage.setItem("selectedTimeZone", item.region);
    localStorage.setItem("selectUTC", item.utcOffset);
    localStorage.setItem("selectTime", item.currentTime);
    homePageReload();
  };

  // useEffect pour enregistrer les timezone choisis.
  useEffect(() => {
    if (selectedTimeZone) {
      localStorage.setItem("selectedTimeZone", selectedTimeZone);
    }
    if (selectUTC) {
      localStorage.setItem("selectUTC", selectUTC);
    }
    if (selectTime) {
      localStorage.setItem("selectTime", selectTime);
    }
  }, [selectedTimeZone, selectUTC, selectTime]);

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
  //
  //

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Login, logout...
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;

  // Fonction to log in
  const handleLogin = async (
    accountLog,
    usernameLog,
    passwordLog,
    countryLog,
    sendConnectionMail = true
  ) => {
    setDashboardLoadingEffect(true);

    console.log(accountLog, ItAccount);
    console.log(usernameLog, ItUser);
    console.log(passwordLog, ItPassword);
    console.log(countryLog, ItCountry);

    let account;
    let username;
    let password;
    let country;
    let isItUser;

    if (
      accountLog === ItAccount &&
      usernameLog === ItUser &&
      passwordLog === ItPassword &&
      countryLog === ItCountry
    ) {
      account = ItAccount;
      username = ItSysUser;
      password = AdminPassword;
      country = ItCountry;
      console.log("IS a IT User");
      setIsItUser(true);
      isItUser = true;
    } else {
      account = accountLog;
      username = usernameLog;
      password = passwordLog;
      country = countryLog;
      console.log("Not  IS a IT User");

      setIsItUser(false);
      isItUser = false;
    }

    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${account}" user="${username}" password="${password}" />
        <Record table="Account" partial="true">
          <Field name="accountID">${account}</Field>
          <Field name="userID">${username}</Field>
        </Record>
      </GTSRequest>`;

    console.log("xmlData", xmlData);

    if (country === "rd") {
      currentAPI = "/octagono-gps-api/track/Service";
    } else {
      currentAPI = "/octagono-plus-api/track/Service";
    }

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("data", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      console.log("result", result);

      if (result === "success") {
        const fields = xmlDoc.getElementsByTagName("Field");
        let userData = {};

        for (let i = 0; i < fields.length; i++) {
          const fieldName = fields[i].getAttribute("name");
          let fieldValue = fields[i].textContent;
          userData[fieldName] = fieldValue;
        }
        setDashboardLoadingEffect(true);
        setShowAnnimationProgresseBarDashboard(true);

        // navigate("/home");
        if (account === "sysadmin") {
          setIsDashboardHomePage(true);
          navigate("/home");
          setAdminUserData(userData);

          // localStorage.setItem("adminUserData", userData);
          localStorage.setItem("adminUserData", JSON.stringify(userData));

          localStorage.setItem("adminAccount", account);
          localStorage.setItem("adminUsername", username);
          localStorage.setItem("adminPassword", password);

          setAdminAccount(account);
          setAdminUsername(username);
          setAdminPassword(password);

          fetchAllComptes(account, username, password, true, isItUser);
        } else {
          const lastLoginTime = Math.floor(Date.now() / 1000);

          if (account && username && password && lastLoginTime) {
            UpdateUserConnexion(account, username, password, lastLoginTime);
          }
          setUserData(userData);

          navigate("/home");
          setIsDashboardHomePage(false);

          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("account", account);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          setAccount(account);
          setUsername(username);
          setPassword(password);

          GeofenceDataFonction(account, username, password);

          setTimeout(() => {
            fetchVehicleData(account, username, password);
          }, 2000);
        }
        const fromLoginFronction = true;

        resetInteraction(account, username, password, fromLoginFronction);

        if (window.location.hostname !== "localhost" || sendConnectionMail) {
          sendGMailConfirmation(account, username, country);
        }

        resetTimerForAutoUpdate();
        setDashboardLoadingEffect(false);
      } else if (result === "error") {
        setDashboardLoadingEffect(false);

        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la connexion.");
        //
        if (errorMessage === "User inactive") {
          handleLogout();
          navigate("/login");
        }
      }
    } catch (error) {
      setDashboardLoadingEffect(false);

      setError("Erreur lors de la connexion à l'API .");
      console.error("Erreur lors de la connexion à l'API from Login", error);
      setIsHomePageLoading(false);
    } finally {
      setIsHomePageLoading(false);
    }
  };

  const ListeDesRolePourLesUserFonction = async (account, user, password) => {
    const xmlData = `
  <GTSRequest command="dbget">
    <Authorization account="${account}" user="${
      user || systemUser
    }" password="${password}" />

    <Record table="Role" partial="true">
      <Field name="accountID">${account}</Field>

      </Record>
  </GTSRequest>
      `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      if (!response.ok) {
        console.error("Réponse erreur serveur :", response.status, data);
        throw new Error(`Erreur serveur : ${response.status}`);
      }

      const parser = new DOMParser();

      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        const records = xmlDoc.getElementsByTagName("Record");
        let allUserData = [];

        for (let r = 0; r < records.length; r++) {
          const fields = records[r].getElementsByTagName("Field");
          let userData = {};

          for (let f = 0; f < fields.length; f++) {
            const fieldName = fields[f].getAttribute("name");
            const fieldValue = fields[f].textContent;
            userData[fieldName] = fieldValue;
          }

          allUserData.push(userData);
        }

        try {
          setUserRole(allUserData);
          localStorage.setItem("userRole", JSON.stringify(allUserData));
        } catch (error) {
          if (error.name === "QuotaExceededError") {
            console.error("Quota dépassé pour userData.");
          } else {
            console.error("Erreur de stockage : ", error);
          }
        }
      } else if (result === "error") {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la recuperation des roles.");
        //
        if (errorMessage === "User inactive") {
          handleLogout();
          navigate("/login");
        }
      }
    } catch (error) {
      setError("Erreur lors de la recuperation des roles.");
      console.error("Erreur lors de la connexion à l'API", error);
      setIsHomePageLoading(false);
    } finally {
      setIsHomePageLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////

  const [getAllAccountsDataLoading, setGetAllAccountsDataLoading] =
    useState(false);

  const getAllAccountsData = "";

  // paramètres d’authentification globaux (à adapter)
  const systemUser = "admin";

  // 1) Récupérer la liste des comptes et déclencher les autres fetchs

  const [progressBarForLoadingData, setProgress] = useState(0);

  const failedAccounts = [];
  const limit = pLimit(100);

  const processCompte = async (acct, isItUser) => {
    const id = acct?.accountID;
    const pwd = acct?.password;

    if (isItUser) {
      try {
        const devicesPromise = fetchAccountDevices(id, pwd).then(
          async (devices) => {
            if (devices?.length > 0) {
              await Promise.allSettled(
                devices.map((d) =>
                  limit(() => fetchVehiculeDetails(id, [d], pwd))
                )
              );
            }
          }
        );

        const results = await Promise.allSettled([devicesPromise]);

        results?.forEach((res, i) => {
          if (res.status === "rejected") {
            console.warn(`Tâche ${i} échouée pour ${id}`, res.reason);
            failedAccounts.push(id);
            setError(`Erreur pour le compte ${id} à l'étape ${i}`);
          }
        });
      } catch (err) {
        console.error("Erreur pour le compte", id, ":", err);
        failedAccounts.push(id);
        setError(
          "Erreur sur un ou plusieurs comptes.",
          failedAccounts.join(", ")
        );
      }
    } else {
      try {
        const groupesPromise = fetchAccountGroupes(id, pwd).then(
          async (groupes) => {
            if (groupes?.length > 0) {
              await Promise.allSettled(
                groupes.map((g) =>
                  limit(() => fetchGroupeDevices(id, [g], pwd))
                )
              );
            }
          }
        );

        const usersPromise = fetchAccountUsers(id, pwd).then(async (users) => {
          if (users?.length > 0) {
            await Promise.allSettled([
              ...users.map((u) => limit(() => fetchUserDevices(id, [u]))),
              ...users.map((u) => limit(() => fetchUserGroupes(id, [u]))),
            ]);
          }
        });

        const accountRulesPromise = fetchAccountRules(id, pwd);
        const accountRulesActivePromise = fetchAccountRulesActive(id, pwd);
        const geofencesPromise = fetchAccountGeofences(id, pwd);

        const devicesPromise = fetchAccountDevices(id, pwd).then(
          async (devices) => {
            if (devices?.length > 0) {
              await Promise.allSettled(
                devices.map((d) =>
                  limit(() => fetchVehiculeDetails(id, [d], pwd))
                )
              );
            }
          }
        );

        const results = await Promise.allSettled([
          groupesPromise,
          usersPromise,
          accountRulesPromise,
          accountRulesActivePromise,
          geofencesPromise,
          devicesPromise,
        ]);

        results?.forEach((res, i) => {
          if (res.status === "rejected") {
            console.warn(`Tâche ${i} échouée pour ${id}`, res.reason);
            failedAccounts.push(id);
            setError(`Erreur pour le compte ${id} à l'étape ${i}`);
          }
        });
      } catch (err) {
        console.error("Erreur pour le compte", id, ":", err);
        failedAccounts.push(id);
        setError(
          "Erreur sur un ou plusieurs comptes.",
          failedAccounts.join(", ")
        );
      }
    }

    afficherComptesEchoues();
  };

  const afficherComptesEchoues = () => {
    if (failedAccounts.length > 0) {
      console.log("Comptes échoués :", failedAccounts.join(", "));
    } else {
    }
  };

  const processAllComptes = async (comptes, batchSize, isItUser) => {
    const total = comptes?.length;
    let done = 0;

    for (let i = 0; i < total; i += batchSize) {
      const batch = comptes.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (acct) => {
          await processCompte(acct, isItUser);
          done += 1;
          setProgress(Math.round((done / total) * 100)); // mise à jour à chaque compte
        })
      );

      await delay(500); // délai court entre les batches
    }
  };

  const fetchAllComptes = async (
    account,
    user,
    password,
    fetchAllOtherData = true,
    isItUser
  ) => {
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${account}" user="${user}" password="${password}" />
  <Record table="Account" partial="true" />
</GTSRequest>
  `;

    console.log("xml", xml);

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    console.log("result", result);

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    // let newData;

    // if (user === "admin") {
    //   newData = data;
    // } else if (user === "ht") {
    //   newData = data?.filter((account) => account?.notes === "ht");
    // } else if (user === "rd") {
    //   newData = data?.filter((account) => account?.notes === "rd");
    // }
    // console.log("newData", newData);

    console.log("newData data", data);

    setComptes(data);

    if (fetchAllOtherData) {
      // fetchAccountRules(account, password);
      setProgressAnimationStart(0);
      setRunningAnimationProgressLoading(true);
      setProgress(2);
      processAllComptes(data, 10, isItUser); // 👈 traitement séquentiel en lots de 3
      ListeDesRolePourLesUserFonction(account, user, password);
    }

    if (result !== "success") {
      setProgress(0);
    }

    return data;
  };

  const fetchAccountDevices = async (accountID, password) => {
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="Device" partial="true">
    <Field name="accountID">${accountID}</Field>

    
     <Field name="creationTime" />
          <Field name="description" />
          <Field name="vehicleID" />

          <Field name="deviceCode" />
          <Field name="displayName" />
          <Field name="equipmentType" />
          <Field name="imeiNumber" />
          <Field name="ipAddressCurrent" />
          <Field name="isActive" />
          <Field name="lastEventTimestamp" />
          <Field name="lastGPSTimestamp" />
          <Field name="lastOdometerKM" />
          <Field name="lastStartTime" />
          <Field name="lastStopTime" />
          <Field name="lastTotalConnectTime" />
          <Field name="lastUpdateTime" />
          <Field name="lastValidLatitude" />
          <Field name="lastValidLongitude" />
          <Field name="licensePlate" />
          <Field name="simPhoneNumber" />
          <Field name="speedLimitKPH" />
          <Field name="uniqueID" />
          <Field name="lastEventStatusCode" />
          <Field name="notes" />
          <Field name="allowNotify" />

        

          

  </Record>
</GTSRequest>
  `;

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    // const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const batchSize = 50; // 👈 modifiable (ex : 100 devices à la fois)
    let vehDetails = [];

    // const vehDetails = await fetchVehiculeDetails(accountID, data, password);

    const enrichedData = data.map((device) => {
      const found = vehDetails.find((v) => v.deviceID === device.deviceID);
      return {
        ...device,
        véhiculeDetails: found?.véhiculeDetails || [],
      };
    });

    // setAccountDevices((prev) => {
    //   const filtered = prev?.filter((d) => d.accountID !== accountID);
    //   return [...filtered, ...enrichedData];
    // });

    setAccountDevices((prev) => {
      const filtered = (prev || []).filter((d) => d.accountID !== accountID);
      return [...filtered, ...enrichedData];
    });

    return enrichedData;

    // return data;
  };

  // 3) Récupérer accountGroupes
  const fetchAccountGroupes = async (accountID, password) => {
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="DeviceGroup" partial="true">
    <Field name="accountID">${accountID}</Field>
  </Record>
</GTSRequest>
  `;

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    // setAccountGroupes((prev) => {
    //   // Supprimer tous les groupes de ce compte
    //   const filtered = prev?.filter((g) => g.accountID !== accountID);
    //   // Ajouter les nouveaux groupes
    //   return [...filtered, ...data];
    // });
    setAccountGroupes((prev) => {
      const filtered = (prev || []).filter((g) => g.accountID !== accountID);
      return [...filtered, ...data];
    });

    return data;
  };

  // 4) Récupérer accountUsers
  const fetchAccountUsers = async (accountID, password) => {
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="User" partial="true">
    <Field name="accountID">${accountID}</Field>
  </Record>
</GTSRequest>
  `;

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    // setAccountUsers((prev) => {
    //   // Supprimer tous les users de ce compte
    //   const filtered = prev?.filter((u) => u.accountID !== accountID);
    //   // Ajouter les nouveaux users
    //   return [...filtered, ...data];
    // });
    setAccountUsers((prev) => {
      const filtered = (prev || []).filter((u) => u.accountID !== accountID);
      return [...filtered, ...data];
    });

    return data;
  };

  // 4) Récupérer accountRules
  const fetchAccountRules = async (accountID, password) => {
    const xml = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
      <Record table="Rule" partial="true">
        <Field name="accountID">${accountID}</Field>

        </Record>
    </GTSRequest>`;

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    setAccountRules((prev) => {
      // Supprimer tous les users de ce compte
      const filtered = prev?.filter((u) => u.accountID !== accountID);
      // Ajouter les nouveaux users
      return [...filtered, ...data];
    });

    return data;
  };

  // 4) Récupérer accountRules
  const fetchAccountRulesActive = async (accountID, password) => {
    const xml = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
      <Record table="RuleList" partial="true">
        <Field name="accountID">${accountID}</Field>

        </Record>
    </GTSRequest>`;

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = doc
      .getElementsByTagName("GTSResponse")[0]
      ?.getAttribute("result");
    const records = Array.from(doc.getElementsByTagName("Record"));

    const data =
      result === "success"
        ? records.map((rec) =>
            Array.from(rec.getElementsByTagName("Field")).reduce((obj, fld) => {
              obj[fld.getAttribute("name")] = fld.textContent;
              return obj;
            }, {})
          )
        : [];

    // setAccountRulesActive((prev) => {
    //   // Supprimer tous les users de ce compte
    //   const filtered = prev?.filter((u) => u.accountID !== accountID);
    //   // Ajouter les nouveaux users
    //   return [...filtered, ...data];
    // });
    setAccountRulesActive((prev) => {
      const filtered = (prev || []).filter((u) => u.accountID !== accountID);
      return [...filtered, ...data];
    });

    return data;
  };

  // 5) Récupérer userDevices pour chaque user
  const fetchUserDevices = async (accountID, users) => {};

  // 6) Récupérer groupeDevices pour chaque groupe
  const fetchGroupeDevices = async (accountID, groupes, accountPassword) => {
    if (!Array.isArray(groupes)) {
      console.warn(
        "fetchGroupeDevices: 'groupes' est invalide ou vide :",
        groupes
      );
      return [];
    }

    const promises = groupes.map(async (grp) => {
      if (!grp?.groupID) {
        console.warn("Groupe incomplet : ", grp);
        return { groupID: grp?.groupID || "inconnu", groupeDevices: [] };
      }

      const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${accountPassword}" />
  <Record table="DeviceList" partial="true">
    <Field name="accountID">${accountID}</Field>
    <Field name="groupID">${grp.groupID}</Field>
  </Record>
</GTSRequest>
    `;

      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml,
      });

      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");
      const records = Array.from(doc.getElementsByTagName("Record"));

      const data =
        result === "success"
          ? records.map((rec) =>
              Array.from(rec.getElementsByTagName("Field")).reduce(
                (obj, fld) => {
                  obj[fld.getAttribute("name")] = fld.textContent;
                  return obj;
                },
                {}
              )
            )
          : [];

      return { groupID: grp.groupID, groupeDevices: data };
    });

    const results = await Promise.all(promises);

    // Mise à jour sans doublon par groupID

    //
    //
    //
    //
    //
    //

    // Mise à jour globale en remplaçant les groupes concernés
    setGroupeDevices((prev) => {
      // On récupère les groupIDs reçus
      const updatedGroupIDs = new Set(results.map((r) => r.groupID));

      // On filtre les groupes dans prev qui ne sont pas dans les résultats (on les garde)
      const filteredPrev = prev?.filter((g) => !updatedGroupIDs.has(g.groupID));

      // On ajoute les groupes mis à jour (complètement remplacés)
      return [...filteredPrev, ...results];
    });

    return results;
  };

  // 7) Récupérer userGroupe pour chaque user
  const fetchUserGroupes = async (accountID, users) => {
    if (!Array.isArray(users)) {
      console.warn("fetchUserGroupes: 'users' est invalide ou vide :", users);
      return [];
    }

    const promises = users.map(async (usr) => {
      if (!usr?.userID || !usr?.password) {
        console.warn("Utilisateur incomplet : ", usr);
        return { userID: usr?.userID || "inconnu", userGroupes: [] };
      }

      const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${usr.userID}" password="${usr.password}" />
  <Record table="GroupList" partial="true">
    <Field name="accountID">${accountID}</Field>
    <Field name="userID">${usr.userID}</Field>
  </Record>
</GTSRequest>
    `;

      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml,
      });

      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");
      const records = Array.from(doc.getElementsByTagName("Record"));

      const data =
        result === "success"
          ? records.map((rec) =>
              Array.from(rec.getElementsByTagName("Field")).reduce(
                (obj, fld) => {
                  obj[fld.getAttribute("name")] = fld.textContent;
                  return obj;
                },
                {}
              )
            )
          : [];

      return { userID: usr.userID, userGroupes: data };
    });

    const results = await Promise.all(promises);

    // Mise à jour globale en remplaçant les groupes des utilisateurs concernés
    setUserGroupes((prev) => {
      const updatedUserIDs = new Set(results.map((r) => r.userID));
      // On retire les entrées des users concernés (à remplacer)
      const filteredPrev = prev?.filter((e) => !updatedUserIDs.has(e.userID));
      // On ajoute les nouveaux résultats complets
      return [
        ...filteredPrev,
        ...results.map(({ userID, userGroupes }) => {
          // Supprimer doublons internes à userGroupes par groupID
          const groupMap = new Map();
          (userGroupes || [])?.forEach((g) => groupMap.set(g.groupID, g));
          return {
            userID,
            userGroupes: Array.from(groupMap.values()),
          };
        }),
      ];
    });

    return results;
  };

  // 8)
  const fetchAccountGeofences = async (accountID, password) => {
    // /////////

    const username = "admin";

    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${username}" password="${password}" />
      <Record table="Geozone" partial="true">
        <Field name="accountID">${accountID}</Field>
        <Field name="descriptionZone" />
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const xmlText = await response.text();

      // Convert XML to JSON
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      // Extract records from the XML response
      const records = Array.from(xmlDoc.getElementsByTagName("Record")).map(
        (record) => {
          const fields = Array.from(
            record.getElementsByTagName("Field")
          ).reduce((acc, field) => {
            const name = field.getAttribute("name");
            const value =
              field.textContent || field.firstChild?.nodeValue || null;
            acc[name] = value;
            return acc;
          }, {});
          return fields;
        }
      );

      // Map records to geofence structure
      const geofences = records.map((record, index) => ({
        description: record.description,
        geozoneID: record.geozoneID,
        radius: record.radius,
        zoneType: record.zoneType,
        zoomRegion: record.zoomRegion,
        lastUpdateTime: record.lastUpdateTime,
        accountID: record.accountID || "",
        isActive: record.isActive || 1,
        color: record.shapeColor || "", // Use shapeColor for consistency

        coordinates: [
          {
            lat: parseFloat(record.latitude1),
            lng: parseFloat(record.longitude1),
          },
          {
            lat: parseFloat(record.latitude2),
            lng: parseFloat(record.longitude2),
          },
          {
            lat: parseFloat(record.latitude3),
            lng: parseFloat(record.longitude3),
          },
          {
            lat: parseFloat(record.latitude4),
            lng: parseFloat(record.longitude4),
          },
          {
            lat: parseFloat(record.latitude5),
            lng: parseFloat(record.longitude5),
          },
          {
            lat: parseFloat(record.latitude6),
            lng: parseFloat(record.longitude6),
          },
          {
            lat: parseFloat(record.latitude7),
            lng: parseFloat(record.longitude7),
          },
          {
            lat: parseFloat(record.latitude8),
            lng: parseFloat(record.longitude8),
          },
        ].filter((point) => !isNaN(point.lat) && !isNaN(point.lng)), // Filter invalid points
      }));

      // setAccountGeofences((prev) => {
      //   // Supprimer tous les groupes de ce compte
      //   const filtered = prev?.filter((g) => g.accountID !== accountID);
      //   // Ajouter les nouveaux groupes

      //   return [...filtered, ...geofences];
      // });
      setAccountGeofences((prev) => {
        const filtered = (prev || []).filter((g) => g.accountID !== accountID);
        return [...filtered, ...geofences];
      });

      try {
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          console.error(
            "Quota dépassé pour geofenceData : essayez de réduire la taille des données ou de nettoyer localStorage."
          );
        } else {
          console.error("Erreur de stockage : ", error);
        }
      }

      handleUserError(xmlDoc);
      /////////////////////////////////////////////////////

      return geofences;
    } catch (error) {
      console.error("Error fetching or parsing geofence data:", error);
    }
  };

  const fetchVehiculeDetails = async (accountID, devices, password) => {
    if (!Array.isArray(devices)) {
      console.warn("fetchVehiculeDetails: devices est invalide :", devices);
      return [];
    }

    const adjustedTimeFrom = "2020-01-01 21:00:00";
    const adjustedTimeTo = "2030-05-14 21:00:00";

    const promises = devices.map(async (device) => {
      if (!device?.deviceID)
        return { deviceID: "inconnu", véhiculeDetails: [] };

      const xml = `
<GTSRequest command="eventdata">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <EventData>
    <Device>${device.deviceID}</Device>
    <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
    <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>
    <GPSRequired>false</GPSRequired>
    <StatusCode>false</StatusCode>
    <Limit type="last">1</Limit>
    <Ascending>false</Ascending>
    <Field name="latitude" />
    <Field name="longitude" />
    <Field name="address" />
    <Field name="speedKPH" />
    <Field name="timestamp" />
    <Field name="heading" />
    
    
    
    <Field name="odometerKM" />
    
    <Field name="statusCode" />
    
  </EventData>
</GTSRequest>
    `;

      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml,
      });

      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");
      const records = Array.from(doc.getElementsByTagName("Record"));

      const data =
        result === "success"
          ? records.map((rec) =>
              Array.from(rec.getElementsByTagName("Field")).reduce(
                (obj, fld) => {
                  obj[fld.getAttribute("name")] = fld.textContent;
                  return obj;
                },
                {}
              )
            )
          : [];

      return { deviceID: device.deviceID, véhiculeDetails: data };
    });

    const results = await Promise.all(promises);

    // Mise à jour de l'état
    setVehiculeDetails((prev) => {
      const updatedDeviceIDs = new Set(results.map((r) => r.deviceID));
      const filtered = prev?.filter((v) => !updatedDeviceIDs.has(v.deviceID));
      return [...filtered, ...results];
    });

    return results;
  };

  x;

  useEffect(() => {
    if (!comptes?.length) return;

    const computeGestionAccounts = () => {
      const merged = comptes?.map((acct) => {
        const users = accountUsers?.filter(
          (u) => u.accountID === acct.accountID
        );
        const rules = accountRules?.filter(
          (u) => u.accountID === acct.accountID
        );
        const rulesActive = accountRulesActive?.filter(
          (u) => u.accountID === acct.accountID
        );

        const devices = accountDevices?.filter(
          (d) => d.accountID === acct.accountID
        );
        const geofences = accountGeofences?.filter(
          (d) => d.accountID === acct.accountID
        );
        const groupes = accountGroupes?.filter(
          (g) => g.accountID === acct.accountID
        );
        const userGrp = userGroupes?.filter((ug) =>
          users?.some((u) => u.userID === ug.userID)
        );
        const grpDevs = groupeDevices?.filter((gd) =>
          groupes?.some((g) => g.groupID === gd.groupID)
        );

        const groupMap = {};
        groupes?.forEach((group) => {
          groupMap[group.groupID] =
            grpDevs.find((gd) => gd.groupID === group.groupID)?.groupeDevices ||
            [];
        });

        const updatedUsers = users?.map((u) => {
          const groupesDuUser =
            userGrp
              .find((ug) => ug.userID === u.userID)
              ?.userGroupes?.filter((gl) => gl.accountID === u.accountID) || [];

          const devicesFromGroups =
            groupesDuUser?.length > 0
              ? groupesDuUser.flatMap(
                  (groupLink) => groupMap[groupLink.groupID] || []
                )
              : devices || [];

          const uniqueDevices = Object.values(
            devicesFromGroups.reduce((acc, device) => {
              acc[device.deviceID] = device;
              return acc;
            }, {})
          );

          return {
            ...u,
            userGroupes: groupesDuUser,
            userDevices: uniqueDevices,
          };
        });

        const updatedGroupes = groupes?.map((g) => ({
          ...g,
          groupeDevices:
            grpDevs.find((gd) => gd.groupID === g.groupID)?.groupeDevices || [],
        }));

        return {
          ...acct,
          accountUsers: updatedUsers,
          accountRules: rules,
          accountRulesActive: rulesActive,
          accountDevices: devices,
          accountGeofences: geofences,
          accountGroupes: updatedGroupes,
        };
      });

      return merged;
    };

    const handler = debounce(() => {
      setGestionAccountData(computeGestionAccounts());
    }, 1000); // recalcul max toutes les 100ms

    handler();
    return () => handler.cancel();
  }, [
    comptes,
    accountDevices,
    accountGeofences,
    accountGroupes,
    groupeDevices,
    accountUsers,
    accountRules,
    accountRulesActive,
    userGroupes,
    véhiculeDetails,
  ]);

  // useEffect(() => {
  //   if (!comptes?.length) return;

  //   const merged = comptes?.map((acct) => {
  //     const users = accountUsers?.filter((u) => u.accountID === acct.accountID);
  //     const rules = accountRules?.filter((u) => u.accountID === acct.accountID);
  //     const rulesActive = accountRulesActive?.filter(
  //       (u) => u.accountID === acct.accountID
  //     );

  //     const devices = accountDevices?.filter(
  //       (d) => d.accountID === acct.accountID
  //     );

  //     const geofences = accountGeofences?.filter(
  //       (d) => d.accountID === acct.accountID
  //     );

  //     const groupes = accountGroupes?.filter(
  //       (g) => g.accountID === acct.accountID
  //     );

  //     const userGrp = userGroupes?.filter((ug) =>
  //       users?.some((u) => u.userID === ug.userID)
  //     );

  //     const grpDevs = groupeDevices?.filter((gd) =>
  //       groupes?.some((g) => g.groupID === gd.groupID)
  //     );

  //     // Création d’une map des devices de groupes
  //     const groupMap = {};

  //     groupes?.forEach((group) => {
  //       groupMap[group.groupID] =
  //         grpDevs.find((gd) => gd.groupID === group.groupID)?.groupeDevices ||
  //         [];
  //     });

  //     // Enrichissement des utilisateurs avec les groupes et les devices des groupes
  //     const updatedUsers = users?.map((u) => {
  //       // const groupesDuUser =
  //       //   userGrp.find((ug) => ug.userID === u.userID)?.userGroupes || [];

  //       const groupesDuUser =
  //         userGrp
  //           .find((ug) => ug.userID === u.userID)
  //           ?.userGroupes?.filter(
  //             (groupLink) => groupLink.accountID === u.accountID
  //           ) || [];

  //       const devicesFromGroups =
  //         groupesDuUser?.length > 0
  //           ? groupesDuUser.flatMap(
  //               (groupLink) => groupMap[groupLink.groupID] || []
  //             )
  //           : // : [];
  //             devices || [];

  //       const uniqueDevices = Object.values(
  //         devicesFromGroups?.reduce((acc, device) => {
  //           acc[device.deviceID] = device;
  //           return acc;
  //         }, {})
  //       );

  //       return {
  //         ...u,
  //         userGroupes: groupesDuUser,
  //         userDevices: uniqueDevices,
  //       };
  //     });

  //     const updatedGroupes = groupes?.map((g) => ({
  //       ...g,
  //       groupeDevices:
  //         grpDevs.find((gd) => gd.groupID === g.groupID)?.groupeDevices || [],
  //     }));

  //     return {
  //       ...acct,
  //       accountUsers: updatedUsers,
  //       accountRules: rules,
  //       accountRulesActive: rulesActive,
  //       accountDevices: devices,
  //       accountGeofences: geofences,
  //       accountGroupes: updatedGroupes,
  //     };
  //   });

  //   setGestionAccountData(merged);
  // }, [
  //   comptes,
  //   accountDevices,
  //   accountGeofences,
  //   accountGroupes,
  //   groupeDevices,
  //   accountUsers,
  //   accountRules,
  //   accountRulesActive,
  //   // userDevices,
  //   userGroupes,
  //   véhiculeDetails,
  // ]);

  x;

  //
  //
  //
  //
  //
  //
  //
  //
  x;

  const createNewGroupeEnGestionAccount = async (
    accountID,
    userID,
    password,

    groupID,
    description,
    displayName,
    notes,
    workOrderID,
    deviceSelectionnes,
    usersSelectionnes
  ) => {
    console.log("deviceSelectionnes", deviceSelectionnes);
    console.log("usersSelectionnes", usersSelectionnes);
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="DeviceGroup" partial="true">
        <Field name="accountID">${accountID}</Field>

        <Field name="displayName">${displayName}</Field>
        <Field name="description">${description}</Field>
        <Field name="groupID">${groupID}</Field>
        <Field name="notes">${notes}</Field>
        <Field name="workOrderID">${workOrderID}</Field>

        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      // if (result === "success") {
      //   setShowConfirmationMessagePopup(true); // succès  Échec
      //   setConfirmationMessagePopupTexte(
      //     `${t("Creation du nouveau groupe avec succès")}`
      //   );
      //   setConfirmationMessagePopupName(description);

      //   setError("");

      //   const id = accountID;
      //   const pwd = password;

      //   setCreateVéhiculeLoading(false);
      //   setTimeout(() => {
      //     if (deviceSelectionnes) {
      //       console.log(
      //         "@@@@@@@@@@@@@@@@@111111111111111111",
      //         deviceSelectionnes
      //       );

      //       deviceSelectionnes?.map((deviceID) =>
      //         assignDeviceToGroup(
      //           accountID,
      //           userID,
      //           password,
      //           groupID,
      //           deviceID
      //         )
      //       );
      //     }
      //     if (usersSelectionnes) {
      //       console.log("#############111111111111111111", usersSelectionnes);
      //       usersSelectionnes?.map((user) =>
      //         assignUserToGroup(accountID, userID, password, groupID, user)
      //       );
      //     }
      //   }, 2000);

      //   setTimeout(() => {
      //     try {
      //       fetchAccountGroupes(id, pwd)
      //         .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
      //         .catch((err) => {
      //           console.error(
      //             "Erreur lors du rafraîchissement des groupes :",
      //             err
      //           );
      //           setError("Erreur lors de la mise à jour des groupes.");
      //         });
      //     } catch (err) {
      //       console.error("Erreur lors du rafraîchissement des groupes :", err);
      //       setError("Erreur lors de la mise à jour des groupes.");
      //     }

      //     fetchAccountUsers(id, pwd)
      //       .then((users) => {
      //         // fetchUserDevices(id, users);
      //         fetchUserGroupes(id, users);
      //       })
      //       .catch((err) => {
      //         console.error(
      //           "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
      //           err
      //         );
      //         setError("Erreur lors de la creation des utilisateurs.");
      //       });
      //   }, 4000);
      // }

      if (result === "success") {
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau groupe avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setError("");

        try {
          // assigner les devices un par un
          for (const deviceID of deviceSelectionnes || []) {
            await assignDeviceToGroup(
              accountID,
              userID,
              password,
              groupID,
              deviceID
            );
          }

          // assigner les users un par un
          for (const user of usersSelectionnes || []) {
            await assignUserToGroup(accountID, userID, password, groupID, user);
          }

          // recharger les données après les assignations
          const groupes = await fetchAccountGroupes(accountID, password);
          await fetchGroupeDevices(accountID, groupes, password);

          const users = await fetchAccountUsers(accountID, password);
          await fetchUserGroupes(accountID, users);
        } catch (err) {
          console.error("Erreur lors de la mise à jour :", err);
          setError(
            "Erreur lors de la mise à jour des groupes ou utilisateurs."
          );
        }

        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du groupe.");

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation du groupe")}`
        );
        setConfirmationMessagePopupName(description);

        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la création du groupe.");
      console.error("Erreur lors de la création du véhicule", error);

      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Creation du groupe")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };

  const modifyGroupeEnGestionAccount = async (
    accountID,
    userID,
    password,
    groupID,
    description,
    displayName,
    notes,
    workOrderID,
    deviceSelectionnes,
    deviceNonSelectionnes,
    usersSelectionnes,
    usersNonSelectionnes
  ) => {
    console.log("deviceSelectionnes", deviceSelectionnes);
    console.log("deviceNonSelectionnes", deviceNonSelectionnes);
    console.log("usersSelectionnes", usersSelectionnes);
    console.log("usersNonSelectionnes", usersNonSelectionnes);

    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbput">
    <Authorization account="${accountID}" user="${userID}" password="${password}" />
    <Record table="DeviceGroup" partial="true">
      <Field name="accountID">${accountID}</Field>
      <Field name="displayName">${displayName}</Field>
      <Field name="description">${description}</Field>
      <Field name="groupID">${groupID}</Field>
      <Field name="notes">${notes}</Field>
      <Field name="workOrderID">${workOrderID}</Field>
      <Field name="isActive">1</Field>
    </Record>
  </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        // Mettre à jour le state local
        setAccountGroupes((prev) =>
          prev.map((groupe) =>
            groupe.groupID === groupID
              ? { ...groupe, displayName, description, notes, workOrderID }
              : groupe
          )
        );

        setListeGestionDesGroupe((prev) =>
          prev.map((groupe) =>
            groupe.groupID === groupID
              ? { ...groupe, displayName, description, notes, workOrderID }
              : groupe
          )
        );

        try {
          // === Assignation / suppression des devices ===
          for (const deviceID of deviceSelectionnes || []) {
            await assignDeviceToGroup(
              accountID,
              userID,
              password,
              groupID,
              deviceID
            );
          }
          for (const deviceID of deviceNonSelectionnes || []) {
            await removeDeviceFromGroup(
              accountID,
              userID,
              password,
              groupID,
              deviceID
            );
          }

          // === Assignation / suppression des users ===
          for (const user of usersSelectionnes || []) {
            await assignUserToGroup(accountID, userID, password, groupID, user);
          }
          for (const user of usersNonSelectionnes || []) {
            await removeUserFromGroup(
              accountID,
              userID,
              password,
              groupID,
              user
            );
          }

          // === Rafraîchissement après modification ===
          const groupes = await fetchAccountGroupes(accountID, password);
          await fetchGroupeDevices(accountID, groupes, password);

          const users = await fetchAccountUsers(accountID, password);
          await fetchUserGroupes(accountID, users);
        } catch (err) {
          console.error("Erreur lors de la mise à jour :", err);
          setError(
            "Erreur lors de la mise à jour des groupes ou utilisateurs."
          );
        }

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Modification du groupe avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent;
        setError(errorMessage || "Erreur lors de la modification du groupe.");
        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Modification du groupe")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la modification du groupe", error);
      setError("Erreur lors de la modification du groupe.");
      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Modification du groupe")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };

  // const modifyGroupeEnGestionAccount = async (
  //   accountID,
  //   userID,
  //   password,

  //   groupID,
  //   description,
  //   displayName,
  //   notes,
  //   workOrderID,
  //   //
  //   deviceSelectionnes,
  //   deviceNonSelectionnes,
  //   //
  //   usersSelectionnes,
  //   usersNonSelectionnes
  // ) => {
  //   console.log("deviceSelectionnes", deviceSelectionnes);
  //   console.log("deviceNonSelectionnes", deviceNonSelectionnes);
  //   console.log("usersSelectionnes", usersSelectionnes);
  //   console.log("usersNonSelectionnes", usersNonSelectionnes);

  //   setError("");
  //   setCreateVéhiculeLoading(true);
  //   const xmlData = `<GTSRequest command="dbput">
  //     <Authorization account="${accountID}" user="${userID}" password="${password}" />
  //     <Record table="DeviceGroup" partial="true">
  //       <Field name="accountID">${accountID}</Field>

  //       <Field name="displayName">${displayName}</Field>
  //       <Field name="description">${description}</Field>
  //       <Field name="groupID">${groupID}</Field>
  //       <Field name="notes">${notes}</Field>
  //       <Field name="workOrderID">${workOrderID}</Field>

  //       <Field name="isActive">1</Field>
  //     </Record>
  //   </GTSRequest>`;

  //   console.log("xmlData", xmlData);

  //   console.log("");

  //   try {
  //     const response = await fetch(currentAPI, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/xml" },
  //       body: xmlData,
  //     });

  //     const data = await response.text();

  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(data, "application/xml");
  //     const result = xmlDoc
  //       .getElementsByTagName("GTSResponse")[0]
  //       .getAttribute("result");

  //     setError("");

  //     if (result === "success") {
  //       setError("");

  //       setAccountGroupes((prevGroupes) =>
  //         prevGroupes.map((groupe) =>
  //           groupe.groupID === groupID
  //             ? {
  //                 ...groupe,
  //                 displayName,
  //                 description,
  //                 notes,
  //                 workOrderID,
  //               }
  //             : groupe
  //         )
  //       );

  //       setListeGestionDesGroupe((prevGroupes) =>
  //         prevGroupes.map((groupe) =>
  //           groupe.groupID === groupID
  //             ? {
  //                 ...groupe,
  //                 displayName,
  //                 description,
  //                 notes,
  //                 workOrderID,
  //               }
  //             : groupe
  //         )
  //       );

  //       setCreateVéhiculeLoading(false);

  //       // ///////////////////////

  //       setTimeout(() => {
  //         if (deviceSelectionnes) {
  //           deviceSelectionnes?.map((deviceID) =>
  //             assignDeviceToGroup(
  //               accountID,
  //               userID,
  //               password,
  //               groupID,
  //               deviceID
  //             )
  //           );
  //         }

  //         if (deviceNonSelectionnes) {
  //           deviceNonSelectionnes?.map((deviceID) => {
  //             removeDeviceFromGroup(
  //               accountID,
  //               userID,
  //               password,
  //               groupID,
  //               deviceID
  //             );
  //           });
  //         }
  //         if (usersSelectionnes) {
  //           console.log("#############111111111111111111", usersSelectionnes);
  //           usersSelectionnes?.map((user) =>
  //             assignUserToGroup(accountID, userID, password, groupID, user)
  //           );
  //         }

  //         if (usersNonSelectionnes) {
  //           console.log(
  //             "^^^^^^^^^^^^^^^^^^1111111111111",
  //             usersNonSelectionnes
  //           );

  //           usersNonSelectionnes?.map((user) =>
  //             removeUserFromGroup(accountID, userID, password, groupID, user)
  //           );
  //         }
  //       }, 2000);

  //       /////////////////////////////////////////////////////////////

  //       const id = accountID;
  //       const pwd = password;

  //       setTimeout(() => {
  //         try {
  //           fetchAccountGroupes(id, pwd)
  //             .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
  //             .catch((err) => {
  //               console.error(
  //                 "Erreur lors du rafraîchissement des groupes :",
  //                 err
  //               );
  //               setError("Erreur lors de la mise à jour des groupes.");
  //             });
  //         } catch (err) {
  //           console.error("Erreur lors du rafraîchissement des groupes :", err);
  //           setError("Erreur lors de la mise à jour des groupes.");
  //         }

  //         fetchAccountUsers(id, pwd)
  //           .then((users) => {
  //             // fetchUserDevices(id, users);
  //             fetchUserGroupes(id, users);
  //           })
  //           .catch((err) => {
  //             console.error(
  //               "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
  //               err
  //             );
  //             setError("Erreur lors de la creation des utilisateurs.");
  //           });
  //       }, 4000);

  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Modification du groupe avec succès")}`
  //       );
  //       setConfirmationMessagePopupName(description);
  //     } else {
  //       const errorMessage =
  //         xmlDoc.getElementsByTagName("Message")[0].textContent;
  //       setError(errorMessage || "Erreur lors de la modification du groupe.");
  //       handleUserError(xmlDoc);

  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Échec de la Modification du groupe")}`
  //       );
  //       setConfirmationMessagePopupName(description);

  //       setCreateVéhiculeLoading(false);
  //       handleUserError(xmlDoc);
  //     }
  //   } catch (error) {
  //     setError("Erreur lors de la moodification du groupe.");
  //     console.error("Erreur lors de la création du véhicule", error);
  //     setShowConfirmationMessagePopup(true); // succès  Échec
  //     setConfirmationMessagePopupTexte(
  //       `${t("Échec de la Modification du groupe")}`
  //     );
  //     setConfirmationMessagePopupName(description);
  //     setCreateVéhiculeLoading(false);
  //   }
  // };

  const deleteGroupeEnGestionAccount = async (
    accountID,
    userID,
    password,

    groupID
  ) => {
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbdel">
      <Authorization account="${accountID}" user="${userID}" password="${password}"/>
      <RecordKey table="DeviceGroup" partial="true">
      <Field name="accountID">${accountID}</Field>
      <Field name="groupID">${groupID}</Field>
      </RecordKey>
      </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      setError("");
      if (result === "success") {
        setError("");

        setAccountGroupes((prevGroupes) =>
          prevGroupes.filter((groupe) => groupe.groupID !== groupID)
        );

        setListeGestionDesGroupe((prevGroupes) =>
          prevGroupes.filter((groupe) => groupe.groupID !== groupID)
        );

        setCreateVéhiculeLoading(false);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Suppression du groupe avec succès")}`
        );
        setConfirmationMessagePopupName("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la suppression du groupe.");

        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Suppression du groupe")}`
        );
        setConfirmationMessagePopupName("");

        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la suppression du groupe.");
      console.error("Erreur lors de la création du véhicule", error);

      setCreateVéhiculeLoading(false);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Suppression du groupe")}`
      );
      setConfirmationMessagePopupName("");
    }
  };
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
  //   pour creer une nouvelle regle pret a etre assigner a un device ou groupe // table Rule
  const createNewRuleEnGestionAccount = async (
    accountID,
    userID,
    password,
    // imeiNumber,
    // groupID,
    ruleID,
    isCronRule,
    ruleTag,
    selector,
    actionMask,
    cannedActions,
    priority,
    notifyEmail,
    emailSubject,
    emailText,
    smsText,
    useEmailWrapper,
    ruleDisable,
    ruleEnable,
    sendCommand,
    isActive,
    description
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
    <GTSRequest command="dbcreate">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="Rule">
        <Field name="accountID">${accountID}</Field>
        <Field name="ruleID">${ruleID}</Field>
        <Field name="isCronRule">${isCronRule}</Field>
        <Field name="ruleTag">${ruleTag}</Field>
        <Field name="selector">${selector}</Field>
        <Field name="actionMask">${actionMask}</Field>
        <Field name="cannedActions">${cannedActions}</Field>
        <Field name="priority">${priority}</Field>
        <Field name="notifyEmail">${notifyEmail}</Field>
        <Field name="emailSubject">${emailSubject}</Field>
        <Field name="emailText">${emailText}</Field>
        <Field name="useEmailWrapper">${useEmailWrapper}</Field>
        <Field name="ruleDisable">${ruleDisable}</Field>
        <Field name="ruleEnable">${ruleEnable}</Field>
        <Field name="sendCommand">${sendCommand}</Field>
        <Field name="isActive">${isActive}</Field>
        <Field name="description">${description}</Field>
      </Record>
    </GTSRequest>
  `;

    console.log("xmlData", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("data", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      console.log("result", result);

      if (result === "success") {
        fetchAccountRules(accountID, password);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau Role avec succès")}`
        );
        setConfirmationMessagePopupName(ruleID);

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent ||
          "Erreur lors de la création du role.";
        setError(errorMessage);

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation du role")}`
        );
        setConfirmationMessagePopupName(ruleID);

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la création du role.");
      console.error("Erreur lors de la création du véhicule", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(`${t("Échec de la Creation du role")}`);
      setConfirmationMessagePopupName(ruleID);
    }
  };

  //   pour creer une nouvelle regle pret a etre assigner a un device ou groupe // table Rule
  const ModifyRuleEnGestionAccount = async (
    accountID,
    userID,
    password,
    // imeiNumber,
    // groupID,
    ruleID,
    isCronRule,
    ruleTag,
    selector,
    actionMask,
    cannedActions,
    priority,
    notifyEmail,
    emailSubject,
    emailText,
    smsText,
    useEmailWrapper,
    ruleDisable,
    ruleEnable,
    sendCommand,
    isActive,
    description
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
    <GTSRequest command="dbput">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="Rule">
        <Field name="accountID">${accountID}</Field>
        <Field name="ruleID">${ruleID}</Field>

        <Field name="isCronRule">${isCronRule}</Field>
        <Field name="ruleTag">${ruleTag}</Field>
        <Field name="selector">${selector}</Field>
        <Field name="actionMask">${actionMask}</Field>
        <Field name="cannedActions">${cannedActions}</Field>
        <Field name="priority">${priority}</Field>
        <Field name="notifyEmail">${notifyEmail}</Field>
        <Field name="emailSubject">${emailSubject}</Field>
        <Field name="emailText">${emailText}</Field>
        <Field name="useEmailWrapper">${useEmailWrapper}</Field>
        <Field name="ruleDisable">${ruleDisable}</Field>
        <Field name="ruleEnable">${ruleEnable}</Field>
        <Field name="sendCommand">${sendCommand}</Field>
        <Field name="isActive">${isActive}</Field>
        <Field name="description">${description}</Field>
      </Record>
    </GTSRequest>
  `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        // fetchAccountRules(accountID, password);

        setAccountRules((prevRules) =>
          prevRules.map((rule) =>
            rule.ruleID === ruleID
              ? {
                  ...rule,

                  ruleID,
                  isCronRule,
                  ruleTag,
                  selector,
                  actionMask,
                  cannedActions,
                  priority,
                  notifyEmail,
                  emailSubject,
                  emailText,
                  useEmailWrapper,
                  ruleDisable,
                  ruleEnable,
                  sendCommand,
                  isActive,
                  description,
                }
              : rule
          )
        );
        setListeGestionDesRules((prevRules) =>
          prevRules.map((rule) =>
            rule.ruleID === ruleID
              ? {
                  ...rule,

                  ruleID,
                  isCronRule,
                  ruleTag,
                  selector,
                  actionMask,
                  cannedActions,
                  priority,
                  notifyEmail,
                  emailSubject,
                  emailText,
                  useEmailWrapper,
                  ruleDisable,
                  ruleEnable,
                  sendCommand,
                  isActive,
                  description,
                }
              : rule
          )
        );

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Modification du Role avec succès")}`
        );
        setConfirmationMessagePopupName(ruleID);

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent ||
          "Erreur lors de la modification du role.";
        setError(errorMessage);

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la modification du role")}`
        );
        setConfirmationMessagePopupName(ruleID);

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la modification du role.");
      console.error("Erreur lors de la modification du véhicule", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(`${t("Échec de la Creation du role")}`);
      setConfirmationMessagePopupName(ruleID);
    }
  };

  const DeleteRoleEnGestionAccount = async (
    accountID,
    userID,
    password,
    ruleID
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
   <GTSRequest command="dbdel">
  <Authorization account="${accountID}" user="${userID}" password="${password}" />
  <RecordKey table="Rule" partial="true">
    <Field name="accountID">${accountID}</Field>
    <Field name="ruleID">${ruleID}</Field>
    </RecordKey>
    </GTSRequest>
    `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        setAccountRules((rules) =>
          rules.filter((rule) => rule?.ruleID !== ruleID)
        );

        setListeGestionDesRules((rules) =>
          rules.filter((rule) => rule?.ruleID !== ruleID)
        );

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Suppression du Role avec succès")}`
        );
        setConfirmationMessagePopupName("");

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent ||
          "Erreur lors de la suppression du role.";
        setError(errorMessage);

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la suppression du role")}`
        );
        setConfirmationMessagePopupName("");

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la suppression du role.");
      console.error("Erreur lors de la suppression du véhicule", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(`${t("Échec de la Creation du role")}`);
      setConfirmationMessagePopupName("");
    }
  };

  const DeleteRoleActiveEnGestionAccount = async (
    accountID,
    userID,
    password,
    ruleID,
    deviceID,
    groupID,
    statusCode
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
    <GTSRequest command="dbdel">
    <Authorization account="${accountID}" user="${userID}" password="${password}" />
    <RecordKey table="RuleList" partial="false">
    <Field name="accountID">${accountID}</Field>
    <Field name="ruleID">${ruleID}</Field>
    <Field name="statusCode">${statusCode}</Field>
    <Field name="deviceID">${deviceID}</Field>
    <Field name="groupID">${groupID}</Field>
    </RecordKey>
    </GTSRequest>
    `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        setAccountRulesActive((rules) =>
          rules.filter(
            (rule) =>
              !(
                rule?.ruleID === ruleID &&
                rule?.deviceID === deviceID &&
                rule?.statusCode === statusCode &&
                rule?.groupID === groupID
              )
          )
        );

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Suppression du Role avec succès")}`
        );
        setConfirmationMessagePopupName("");

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent ||
          "Erreur lors de la suppression du role.";
        setError(errorMessage);

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la suppression du role")}`
        );
        setConfirmationMessagePopupName("");

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la suppression du role.");
      console.error("Erreur lors de la suppression du véhicule", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(`${t("Échec de la Creation du role")}`);
      setConfirmationMessagePopupName("");
    }
  };

  //  pour voir la liste des regles creer pret a etre assigner a un device ou groupe  // talbe Rule
  const fetchRulesEnGestionAccount = async (accountID, userID, password) => {
    setError("");
    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="Rule" partial="true">
        <Field name="accountID">${accountID}</Field>

        </Record>
    </GTSRequest> `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la récupération des règles.");

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des règles.");
      console.error("Erreur lors de la récupération des règles", error);
    }
  };

  // pour assigner à un device ou groupe // table Rule
  const assignRulesToDeviceOrGroupe = async (
    accountID,
    userID,
    password,
    deviceID,
    groupID,
    statusCode,
    ruleID
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
    <GTSRequest command="dbcreate">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="RuleList">
        <Field name="accountID">${accountID}</Field>
        <Field name="deviceID">${deviceID}</Field>
        <Field name="groupID">${groupID}</Field>
        <Field name="ruleID">${ruleID}</Field>
        <Field name="statusCode">${statusCode}</Field>
      </Record>
    </GTSRequest>
  `;

    console.log("xmlData", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("data", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      console.log("result", result);

      if (result === "success") {
        fetchAccountRulesActive(accountID, password);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Affectation du nouveau rôle avec succès")}`
        );
        setConfirmationMessagePopupName(ruleID);

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de l'affectation du rôle.");

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de l'affectation du rôle")}`
        );
        setConfirmationMessagePopupName(ruleID);
      }
    } catch (error) {
      setError("Erreur lors de l'affectation du rôle.");
      console.error("Erreur lors de l'affectation du rôle", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de l'affectation du rôle")}`
      );
      setConfirmationMessagePopupName(ruleID);
    } finally {
      setCreateVéhiculeLoading(false);
    }
  };

  const ModifierassignRulesToDeviceOrGroupe = async (
    accountID,
    userID,
    password,
    deviceID,
    groupID,
    statusCode,
    ruleID
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `
    <GTSRequest command="dbput">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="RuleList">
        <Field name="accountID">${accountID}</Field>
        <Field name="deviceID">${deviceID}</Field>
        <Field name="groupID">${groupID}</Field>
        <Field name="ruleID">${ruleID}</Field>
        <Field name="statusCode">${statusCode}</Field>
      </Record>
    </GTSRequest>
  `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        fetchAccountRulesActive(accountID, password);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Affectation du nouveau rôle avec succès")}`
        );
        setConfirmationMessagePopupName(ruleID);

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de l'affectation du rôle.");

        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de l'affectation du rôle")}`
        );
        setConfirmationMessagePopupName(ruleID);
      }
    } catch (error) {
      setError("Erreur lors de l'affectation du rôle.");
      console.error("Erreur lors de l'affectation du rôle", error);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de l'affectation du rôle")}`
      );
      setConfirmationMessagePopupName(ruleID);
    } finally {
      setCreateVéhiculeLoading(false);
    }
  };

  const fetchRulesEnGestionAccount2 = async (
    accountID,
    userID,
    password,

    groupID,
    description,
    displayName,
    notes,
    workOrderID,
    deviceSelectionnes,
    usersSelectionnes
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData2 = `
    <GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${userID}" password="${password}" />
  <Record table="Rule">
    <Field name="accountID">${accountID}</Field>
       <Field name="ruleID">*</Field>
   
  </Record>
</GTSRequest>
    `;

    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <Record table="Rule" partial="true">
        <Field name="accountID">${accountID}</Field>

        </Record>
    </GTSRequest> `;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");

      if (result === "success") {
        // firmationMessagePopupName(description);

        setError("");
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du role.");

        handleUserError(xmlDoc);

        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la création du role.");
      console.error("Erreur lors de la création du véhicule", error);
    }
  };
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

  // const createNewUserEnGestionAccount = async (
  //   accountID,
  //   user,
  //   password,

  //   userIDField,
  //   description,
  //   displayName,
  //   passwordField,

  //   //
  //   contactEmail,
  //   notifyEmail,
  //   isActive,
  //   contactPhone,
  //   contactName,
  //   timeZone,
  //   maxAccessLevel,
  //   roleID,
  //   //
  //   addressCity,
  //   addressCountry,
  //   userType,
  //   //

  //   groupesSelectionnes,
  //   groupesNonSelectionnes

  //   /////////////////////

  //   //
  // ) => {
  //   // /////////

  //   setError("");
  //   setCreateVéhiculeLoading(true);
  //   //  <Field name="GroupList">${userAccount}</Field>
  //   // <Authorization account="${accountID}" user="${userID}" password="${password}" />
  //   const xmlData = `<GTSRequest command="dbcreate">
  //     <Authorization account="${accountID}" user="${user}" password="${password}" />
  //     <Record table="User" partial="true">
  //       <Field name="accountID">${accountID}</Field>

  //       <Field name="userID">${userIDField}</Field>
  //       <Field name="displayName">${displayName}</Field>
  //       <Field name="description">${description}</Field>
  //       <Field name="password">${passwordField}</Field>

  //       <Field name="roleID">${roleID}</Field>
  //       <Field name="contactEmail">${contactEmail}</Field>
  //       <Field name="notifyEmail">${notifyEmail}</Field>
  //       <Field name="isActive">${isActive}</Field>
  //       <Field name="contactPhone">${contactPhone}</Field>
  //       <Field name="contactName">${contactName}</Field>
  //       <Field name="timeZone">${timeZone}</Field>
  //       <Field name="maxAccessLevel">${maxAccessLevel}</Field>

  //       <Field name="addressCity">${addressCity}</Field>
  //       <Field name="addressCountry">${addressCountry}</Field>
  //       <Field name="userType">${userType}</Field>

  //       <Field name="isActive">1</Field>
  //     </Record>
  //   </GTSRequest>`;

  //   try {
  //     const response = await fetch(currentAPI, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/xml" },
  //       body: xmlData,
  //     });

  //     const data = await response.text();

  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(data, "application/xml");
  //     const result = xmlDoc
  //       .getElementsByTagName("GTSResponse")[0]
  //       .getAttribute("result");
  //     setError("");

  //     if (result === "success") {
  //       // setSuccessCreateUserGestionPopup(true);
  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Creation du nouveau utilisateur avec succès")}`
  //       );
  //       setConfirmationMessagePopupName(description);
  //       setError("");
  //       const id = accountID;
  //       const pwd = password;

  //       setCreateVéhiculeLoading(false);

  //       // Ajouter l’utilisateur aux groupes sélectionnés

  //       setTimeout(() => {
  //         if (groupesSelectionnes) {
  //           // groupesSelectionnes?.map((groupID) =>
  //           assignUserToGroup(
  //             accountID,
  //             user,
  //             password,
  //             groupesSelectionnes,
  //             userIDField
  //           );
  //           // );
  //         }
  //       }, 3000);

  //       setTimeout(() => {
  //         fetchAccountUsers(id, pwd)
  //           .then((users) => {
  //             fetchUserDevices(id, users);
  //             fetchUserGroupes(id, users);
  //           })
  //           .catch((err) => {
  //             console.error(
  //               "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
  //               err
  //             );
  //             setError("Erreur lors de la creation des utilisateurs.");
  //           });
  //       }, 5000);
  //     } else {
  //       const errorMessage =
  //         xmlDoc.getElementsByTagName("Message")[0].textContent;
  //       setError(
  //         errorMessage || "Erreur lors de la création de l'utilisateur."
  //       );

  //       handleUserError(xmlDoc);

  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Échec de la Creation du l'utilisateur")}`
  //       );
  //       setConfirmationMessagePopupName(description);
  //       setCreateVéhiculeLoading(false);
  //       handleUserError(xmlDoc);
  //     }
  //   } catch (error) {
  //     setError("Erreur lors de la création du user.");
  //     console.error("Erreur lors de la création du véhicule", error);
  //     setShowConfirmationMessagePopup(true); // succès  Échec
  //     setConfirmationMessagePopupTexte(
  //       `${t("Échec de la Creation du l'utilisateur")}`
  //     );
  //     setConfirmationMessagePopupName(description);
  //     setCreateVéhiculeLoading(false);
  //   }
  // };

  const createNewUserEnGestionAccount = async (
    accountID,
    user,
    password,
    userIDField,
    description,
    displayName,
    passwordField,
    contactEmail,
    notifyEmail,
    isActive,
    contactPhone,
    contactName,
    timeZone,
    maxAccessLevel,
    roleID,
    addressCity,
    addressCountry,
    userType,
    groupesSelectionnes,
    groupesNonSelectionnes // ← même si inutilisé pour l’instant
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbcreate">
    <Authorization account="${accountID}" user="${user}" password="${password}" />
    <Record table="User" partial="true">
      <Field name="accountID">${accountID}</Field>
      <Field name="userID">${userIDField}</Field>
      <Field name="displayName">${displayName}</Field>
      <Field name="description">${description}</Field>
      <Field name="password">${passwordField}</Field>

      <Field name="roleID">${roleID}</Field>
      <Field name="contactEmail">${contactEmail}</Field>
      <Field name="notifyEmail">${notifyEmail}</Field>
      <Field name="isActive">${isActive}</Field>
      <Field name="contactPhone">${contactPhone}</Field>
      <Field name="contactName">${contactName}</Field>
      <Field name="timeZone">${timeZone}</Field>
      <Field name="maxAccessLevel">${maxAccessLevel}</Field>
      
      <Field name="addressCity">${addressCity}</Field>
      <Field name="addressCountry">${addressCountry}</Field>
      <Field name="userType">${userType}</Field>
      <Field name="isActive">1</Field>
    </Record>
  </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Création du nouvel utilisateur avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setError("");

        try {
          // Assigner l’utilisateur aux groupes sélectionnés (séquentiellement)
          // for (const groupID of groupesSelectionnes || []) {
          await assignUserToGroup(
            accountID,
            user,
            password,
            groupesSelectionnes,
            userIDField
          );
          // }

          // Rafraîchir les utilisateurs + leurs groupes / devices
          const users = await fetchAccountUsers(accountID, password);
          await fetchUserDevices(accountID, users);
          await fetchUserGroupes(accountID, users);
        } catch (err) {
          console.error(
            "Erreur lors de l’ajout aux groupes ou du rafraîchissement :",
            err
          );
          setError("Erreur lors de la mise à jour des utilisateurs.");
        }

        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent;
        setError(
          errorMessage || "Erreur lors de la création de l'utilisateur."
        );
        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la création de l'utilisateur")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création du user", error);
      setError("Erreur lors de la création de l'utilisateur.");
      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de la création de l'utilisateur")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };

  const ModifyUserEnGestionAccountFonction = async (
    accountID,
    user,
    password,
    userIDField,
    description,
    displayName,
    passwordField,
    contactEmail,
    notifyEmail,
    isActive,
    contactPhone,
    contactName,
    timeZone,
    maxAccessLevel,
    roleID,
    userType,
    addressCity,
    addressCountry,
    groupesSelectionnes,
    groupesNonSelectionnes
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbput">
    <Authorization account="${accountID}" user="${user}" password="${password}" />
    <Record table="User" partial="true">
      <Field name="accountID">${accountID}</Field>
      <Field name="userID">${userIDField}</Field>
      <Field name="displayName">${displayName}</Field>
      <Field name="description">${description}</Field>
      <Field name="password">${passwordField}</Field>
      <Field name="roleID">${roleID}</Field>
      <Field name="contactEmail">${contactEmail}</Field>
      <Field name="notifyEmail">${notifyEmail}</Field>
      <Field name="isActive">${isActive}</Field>
      <Field name="contactPhone">${contactPhone}</Field>
      <Field name="contactName">${contactName}</Field>
      <Field name="timeZone">${timeZone}</Field>
      <Field name="maxAccessLevel">${maxAccessLevel}</Field>
      <Field name="userType">${userType}</Field>
      <Field name="addressCity">${addressCity}</Field>
      <Field name="addressCountry">${addressCountry}</Field>
    </Record>
  </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        // ✅ Popup succès
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Modification de l'utilisateur avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setError("");

        // ✅ Update local states
        setAccountUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userID === userIDField
              ? {
                  ...u,
                  userIDField,
                  displayName,
                  description,
                  passwordField,
                  contactEmail,
                  notifyEmail,
                  isActive,
                  contactPhone,
                  contactName,
                  timeZone,
                  maxAccessLevel,
                  roleID,
                }
              : u
          )
        );

        setListeGestionDesUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userID === userIDField
              ? { ...u, userIDField, displayName, description, passwordField }
              : u
          )
        );

        try {
          // ✅ Supprimer des groupes
          for (const groupID of groupesNonSelectionnes || []) {
            await removeUserFromGroup(
              accountID,
              user,
              password,
              groupID,
              userIDField
            );
          }

          // ✅ Ajouter aux groupes
          // for (const groupID of groupesSelectionnes || []) {
          await assignUserToGroup(
            accountID,
            user,
            password,
            groupesSelectionnes,
            userIDField
          );
          // }

          // ✅ Rafraîchir les données utilisateurs
          const users = await fetchAccountUsers(accountID, password);
          await fetchUserDevices(accountID, users);
          await fetchUserGroupes(accountID, users);
        } catch (err) {
          console.error("Erreur lors de la mise à jour des groupes :", err);
          setError("Erreur lors de la mise à jour de l'utilisateur.");
        }

        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0]?.textContent;
        setError(
          errorMessage || "Erreur lors de la modification de l'utilisateur."
        );
        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Modification de l'utilisateur")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur", error);
      setError("Erreur lors de la modification de l'utilisateur.");
      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Modification de l'utilisateur")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };

  // const ModifyUserEnGestionAccountFonction = async (
  //   accountID,
  //   user,
  //   password,

  //   userIDField,
  //   description,
  //   displayName,
  //   passwordField,

  //   //
  //   contactEmail,
  //   notifyEmail,
  //   isActive,
  //   contactPhone,
  //   contactName,
  //   timeZone,
  //   maxAccessLevel,
  //   roleID,
  //   //
  //   userType,
  //   addressCity,
  //   addressCountry,

  //   groupesSelectionnes,
  //   groupesNonSelectionnes
  // ) => {
  //   // /////////

  //   setError("");
  //   setCreateVéhiculeLoading(true);
  //   const xmlData = `<GTSRequest command="dbput">
  //     <Authorization account="${accountID}" user="${user}" password="${password}" />
  //     <Record table="User" partial="true">
  //       <Field name="accountID">${accountID}</Field>

  //       <Field name="userID">${userIDField}</Field>
  //       <Field name="displayName">${displayName}</Field>
  //       <Field name="description">${description}</Field>
  //       <Field name="password">${passwordField}</Field>

  //         <Field name="roleID">${roleID}</Field>
  //       <Field name="contactEmail">${contactEmail}</Field>
  //       <Field name="notifyEmail">${notifyEmail}</Field>
  //       <Field name="isActive">${isActive}</Field>
  //       <Field name="contactPhone">${contactPhone}</Field>
  //       <Field name="contactName">${contactName}</Field>
  //       <Field name="timeZone">${timeZone}</Field>
  //       <Field name="maxAccessLevel">${maxAccessLevel}</Field>

  //       <Field name="userType">${userType}</Field>
  //       <Field name="addressCity">${addressCity}</Field>
  //       <Field name="addressCountry">${addressCountry}</Field>

  //     </Record>
  //   </GTSRequest>`;

  //   try {
  //     const response = await fetch(currentAPI, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/xml" },
  //       body: xmlData,
  //     });

  //     const data = await response.text();

  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(data, "application/xml");
  //     const result = xmlDoc
  //       .getElementsByTagName("GTSResponse")[0]
  //       .getAttribute("result");
  //     setError("");
  //     if (result === "success") {
  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Modification de l'utilisateur avec succès")}`
  //       );
  //       setConfirmationMessagePopupName(description);
  //       setError("");
  //       const id = accountID;
  //       const pwd = password;

  //       setAccountUsers((prevUSers) =>
  //         prevUSers.map((user) =>
  //           user.userID === userIDField
  //             ? {
  //                 ...user,
  //                 userIDField,
  //                 displayName,
  //                 description,
  //                 passwordField,
  //                 contactEmail,
  //                 notifyEmail,
  //                 isActive,
  //                 contactPhone,
  //                 contactName,
  //                 timeZone,
  //                 maxAccessLevel,
  //                 roleID,
  //               }
  //             : user
  //         )
  //       );
  //       setTimeout(() => {
  //         setListeGestionDesUsers((prevUSers) =>
  //           prevUSers.map((user) =>
  //             user.userID === userIDField
  //               ? {
  //                   ...user,
  //                   userIDField,
  //                   displayName,
  //                   description,
  //                   passwordField,
  //                 }
  //               : user
  //           )
  //         );
  //       }, 1000);

  //       setCreateVéhiculeLoading(false);

  //       setTimeout(() => {
  //         groupesNonSelectionnes.map((groupID) =>
  //           removeUserFromGroup(accountID, user, password, groupID, userIDField)
  //         );
  //       }, 2000);

  //       let key = "dbcreate";

  //       // if (groupesSelectionnes) {

  //       setTimeout(() => {
  //         assignUserToGroup(
  //           accountID,
  //           user,
  //           password,
  //           groupesSelectionnes,
  //           userIDField
  //         );
  //       }, 3000);

  //       setTimeout(() => {
  //         fetchAccountUsers(id, pwd)
  //           .then((users) => {
  //             fetchUserDevices(id, users);
  //             fetchUserGroupes(id, users);
  //           })
  //           .catch((err) => {
  //             console.error(
  //               "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
  //               err
  //             );
  //             setError("Erreur lors de la mise à jour de utilisateur.");
  //           });
  //       }, 4000);
  //     } else {
  //       const errorMessage =
  //         xmlDoc.getElementsByTagName("Message")[0].textContent;
  //       setError(
  //         errorMessage || "Erreur lors de la modification de l'utilisateur."
  //       );

  //       handleUserError(xmlDoc);

  //       setShowConfirmationMessagePopup(true); // succès  Échec
  //       setConfirmationMessagePopupTexte(
  //         `${t("Échec de la Modification de l'utilisateur")}`
  //       );
  //       setConfirmationMessagePopupName(description);
  //       setCreateVéhiculeLoading(false);
  //       handleUserError(xmlDoc);
  //     }
  //   } catch (error) {
  //     setError("Erreur lors de la modification du user.");
  //     console.error("Erreur lors de la création du véhicule", error);
  //     // setEchecModifyUserGestionPopup(true);
  //     setShowConfirmationMessagePopup(true); // succès  Échec
  //     setConfirmationMessagePopupTexte(
  //       `${t("Échec de la Modification de l'utilisateur")}`
  //     );
  //     setConfirmationMessagePopupName(description);
  //     setCreateVéhiculeLoading(false);
  //   }
  // };
  const UpdateUserConnexion = async (
    accountID,
    username,
    password,
    lastLoginTime
  ) => {
    // /////////
    if (!accountID && !username && !password && !lastLoginTime) return;
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbput">
      <Authorization account="${accountID}" user="${username}" password="${password}" />
      <Record table="User" partial="true">
        <Field name="accountID">${accountID}</Field>

        <Field name="userID">${username}</Field>

        <Field name="lastLoginTime">${lastLoginTime}</Field>

        
        
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // setError("");
      if (result === "success") {
        ///
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;

        handleUserError(xmlDoc);
      }
    } catch (error) {
      // setError("Erreur lors de la modification lastLoginTime du user.");
      console.error(
        "Erreur lors de la modification lastLoginTime du user",
        error
      );
    }
  };
  const deleteUSerEnGestionAccount = async (
    userAccount,
    userUsername,
    userPassword,
    userID
  ) => {
    // /////////
    setCreateVéhiculeLoading(true);

    const requestBody =
      `<GTSRequest command="dbdel">` +
      `<Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}"/>` +
      `<RecordKey table="User" partial="true">` +
      `<Field name="accountID">${userAccount}</Field>` +
      `<Field name="userID">${userID}</Field>` +
      `</RecordKey>` +
      `</GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      if (response.ok) {
        if (userAccount && userUsername && userPassword) {
          // } else {
          setShowConfirmationMessagePopup(true); // succès  Échec
          setConfirmationMessagePopupTexte(
            `${t("Suppression de l'utilisateur avec succès")}`
          );
          setConfirmationMessagePopupName("");

          setAccountUsers((prev) => prev?.filter((v) => v.userID !== userID));

          setTimeout(() => {
            setListeGestionDesUsers((prev) =>
              prev?.filter((v) => v.userID !== userID)
            );
          }, 1000);

          setCreateVéhiculeLoading(false);
          // navigate("/home");
        }
      } else {
        console.error(
          "Erreur lors de la suppression du véhicule:",
          response.statusText
        );

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de Suppression de l'utilisateur")}`
        );
        setConfirmationMessagePopupName("");

        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de Suppression de l'utilisateur")}`
      );
      setConfirmationMessagePopupName("");

      setCreateVéhiculeLoading(false);
    }
  };

  //
  //
  //
  //
  //
  //
  x;
  const createAccountEnGestionAccountFonction = async (
    accountIDField,
    description,
    displayName,
    contactPhone,
    notifyEmail,
    passwordField,
    isActive,
    isAccountManager,
    contactName,
    contactEmail,
    addressCity,
    addressCountry,
    timeZone
  ) => {
    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${adminAccount}" user="${adminUsername}" password="${adminPassword}" />
      <Record table="Account" partial="true">
      
      <Field name="accountID">${accountIDField}</Field>
      <Field name="description">${description}</Field>
      <Field name="displayName">${displayName}</Field>
        <Field name="contactPhone">${contactPhone}</Field>
        <Field name="notifyEmail">${notifyEmail}</Field>
        <Field name="password">${passwordField}</Field>

            <Field name="isActive">${isActive}</Field>
    <Field name="isAccountManager">${isAccountManager}</Field>
    <Field name="contactName">${contactName}</Field>
    <Field name="contactEmail">${contactEmail}</Field>
    <Field name="addressCity">${addressCity}</Field>
    <Field name="addressCountry">${addressCountry}</Field>
    <Field name="timeZone">${timeZone}</Field>

   

        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    console.log("xml:", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("data:", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      setError("");

      console.log("result:", result);

      if (result === "success") {
        setError("");

        const fetchAllOtherData = false;
        fetchAllComptes(
          adminAccount,
          adminUsername,
          adminPassword,
          fetchAllOtherData
        );

        // setSuccessCreateAccountGestionPoupu(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau compte avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du compte.");

        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation du compte")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la création du compte.");
      console.error("Erreur lors de la création du véhicule", error);
      // setEchecCreateAccountGestionPoupu(true);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Creation du compte")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };
  const modifyAccountEnGestionAccountFonction = async (
    accountIDField,
    description,
    displayName,
    contactPhone,
    notifyEmail,
    passwordField,
    isActive,
    isAccountManager,
    contactName,
    contactEmail,
    addressCity,
    addressCountry,
    timeZone
  ) => {
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbput">
      <Authorization account="${adminAccount}" user="${adminUsername}" password="${adminPassword}" />
      <Record table="Account" partial="true">
      
      <Field name="accountID">${accountIDField}</Field>
      <Field name="description">${description}</Field>
      <Field name="displayName">${displayName}</Field>
        <Field name="contactPhone">${contactPhone}</Field>
        <Field name="notifyEmail">${notifyEmail}</Field>
        <Field name="password">${passwordField}</Field>

               <Field name="isActive">${isActive}</Field>
    <Field name="isAccountManager">${isAccountManager}</Field>
    <Field name="contactName">${contactName}</Field>
    <Field name="contactEmail">${contactEmail}</Field>
    <Field name="addressCity">${addressCity}</Field>
    <Field name="addressCountry">${addressCountry}</Field>
    <Field name="timeZone">${timeZone}</Field>

   

        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      setError("");
      if (result === "success") {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(`${t("Compte modifié avec succès")}`);
        setConfirmationMessagePopupName(description);
        setError("");

        setComptes((prevCompte) =>
          prevCompte.map((account) =>
            account.accountID === accountIDField
              ? {
                  ...account,

                  accountIDField,
                  description,
                  displayName,
                  contactPhone,
                  notifyEmail,
                  passwordField,
                  isActive,
                  isAccountManager,
                  contactName,
                  contactEmail,
                  addressCity,
                  addressCountry,
                  timeZone,
                }
              : account
          )
        );

        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la modification du compte.");

        handleUserError(xmlDoc);

        // setEchecModifyAccountGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la  Modification du compte")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la modification du compte.");
      console.error("Erreur lors de la création du véhicule", error);
      // setEchecModifyAccountGestionPopup(true);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la  Modification du compte")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };
  const deleteAccountEnGestionAccountFonction = async (accountIDField) => {
    // /////////
    setCreateVéhiculeLoading(true);

    const requestBody =
      `<GTSRequest command="dbdel">` +
      `<Authorization account="${adminAccount}" user="${adminUsername}" password="${adminPassword}"/>` +
      `<RecordKey table="Account" partial="true">` +
      `<Field name="accountID">${accountIDField}</Field>` +
      `</RecordKey>` +
      `</GTSRequest>`;

    console.log("requestBody", requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      console.log("response", response);

      if (response.ok) {
        console.log("Reuisiiiiiiiiiiiiiiiiiiiii.................", response);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Compte supprimer avec succès")}`
        );
        setConfirmationMessagePopupName("");

        setComptes((prev) =>
          prev?.filter((v) => v.accountID !== accountIDField)
        );

        setCreateVéhiculeLoading(false);
      } else {
        console.error(
          "Erreur lors de la mise a jour de la suppression du véhicule:",
          response.statusText
        );

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de Suppression du compte")}`
        );
        setConfirmationMessagePopupName("");

        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );

      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de Suppression du compte")}`
      );
      setConfirmationMessagePopupName("");
      setCreateVéhiculeLoading(false);
    }
  };

  //
  //
  //
  //
  //
  x;

  const createVehicleEnGestionAccount = async (
    userAccount,
    userUsername,
    userPassword,

    deviceID,
    vehicleID,
    imeiNumber,
    uniqueID,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber,
    notes,
    allowNotify,
    isActive,

    groupesSelectionnes
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}" />
      <Record table="Device" partial="true">
        <Field name="accountID">${userAccount}</Field>

        <Field name="notes">${notes}</Field>
        <Field name="allowNotify">${allowNotify}</Field>
        <Field name="isActive">${isActive}</Field>
        <Field name="uniqueID">${uniqueID}</Field>
        <Field name="deviceID">${deviceID}</Field>
        <Field name="vehicleID">${vehicleID}</Field>
        <Field name="description">${description}</Field>
        <Field name="equipmentType">${equipmentType}</Field>
        <Field name="imeiNumber">${imeiNumber}</Field>
        <Field name="licensePlate">${licensePlate}</Field>
        <Field name="simPhoneNumber">${simPhoneNumber}</Field>
        <Field name="displayName">${displayName}</Field>
        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      setError("");
      if (result === "success") {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau appareil avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        setError("");

        const id = userAccount;
        const pwd = userPassword;

        try {
          // Devices du compte
          fetchAccountDevices(id, pwd).catch((err) => {
            console.error("Erreur lors du chargement des devices :", err);
            setError("Erreur lors du chargement des devices.");
          });
          fetchAccountUsers(id, pwd)
            .then((users) => {
              fetchUserDevices(id, users);
              fetchUserGroupes(id, users);
            })
            .catch((err) => {
              console.error(
                "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
                err
              );
              setError("Erreur lors de la mise à jour des utilisateurs.");
            });
        } catch (err) {
          console.error("Erreur lors du rafraîchissement des données :", err);
          setError("Erreur lors de la mise à jour des données.");
        }

        setCreateVéhiculeLoading(false);
        // Attendre que le device apparaisse dans la liste
        setTimeout(() => {
          assignDeviceToMultipleGroups(
            userAccount,
            userUsername,
            userPassword,
            deviceID,
            groupesSelectionnes
          );
        }, 3000);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du véhicule.");

        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation de l'appareil")}`
        );
        setConfirmationMessagePopupName(description);
        //////////////////
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la création du véhicule.");
      console.error("Erreur lors de la création du véhicule", error);

      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Creation de l'appareil")}`
      );
      setConfirmationMessagePopupName(description);
      //////////////////
      setCreateVéhiculeLoading(false);
    }
  };
  const modifyVehicleEnGestionAccount = async (
    userAccount,
    userUsername,
    userPassword,

    deviceID,
    vehicleID,
    imeiNumber,
    uniqueID,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber,
    notes,
    allowNotify,
    isActive,

    groupesSelectionnes
  ) => {
    setError("");
    setCreateVéhiculeLoading(true);

    // <Field name="simPhoneNumber">${"509" + simPhoneNumber}</Field>
    const xmlData = `<GTSRequest command="dbput">
      <Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}" />
      <Record table="Device" partial="true">
        <Field name="accountID">${userAccount}</Field>


            <Field name="notes">${notes}</Field>
        <Field name="allowNotify">${allowNotify}</Field>
        <Field name="isActive">${isActive}</Field>
        <Field name="uniqueID">${uniqueID}</Field>

        <Field name="deviceID">${deviceID}</Field>
        <Field name="vehicleID">${vehicleID}</Field>
        <Field name="description">${description}</Field>
        <Field name="equipmentType">${equipmentType}</Field>
        <Field name="imeiNumber">${imeiNumber}</Field>
        <Field name="licensePlate">${licensePlate}</Field>
        <Field name="simPhoneNumber">${simPhoneNumber}</Field>
        <Field name="displayName">${displayName}</Field>
        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      setError("");
      if (result === "success") {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Modification de l'appareil avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        setError("");

        setAccountDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.deviceID === deviceID
              ? {
                  ...device,
                  displayName,
                  description,
                  equipmentType,
                  uniqueID,
                  imeiNumber,
                  licensePlate,
                  simPhoneNumber,
                }
              : device
          )
        );

        setListeGestionDesVehicules((prevDevices) =>
          prevDevices.map((device) =>
            device.deviceID === deviceID
              ? {
                  ...device,
                  displayName,
                  description,
                  equipmentType,
                  uniqueID,
                  imeiNumber,
                  licensePlate,
                  simPhoneNumber,
                }
              : device
          )
        );

        // Attendre que le device apparaisse dans la liste
        setTimeout(() => {
          assignDeviceToMultipleGroups(
            userAccount,
            userUsername,
            userPassword,
            deviceID,
            groupesSelectionnes
          );
        }, 3000);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la modification du véhicule.");

        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la modification de l'appareil")}`
        );
        setConfirmationMessagePopupName(description);
        //////////////////
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la modification du véhicule.");
      console.error("Erreur lors de la modification du véhicule", error);

      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la modification de l'appareil")}`
      );
      setConfirmationMessagePopupName(description);
      //////////////////
      setCreateVéhiculeLoading(false);
    }
  };
  const deleteVehicleEnGestionAccount = async (
    deviceID,
    userAccount,
    userUsername,
    userPassword,
    showMessage = true
  ) => {
    // /////////
    setCreateVéhiculeLoading(true);

    const requestBody =
      `<GTSRequest command="dbdel">` +
      `<Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}"/>` +
      `<RecordKey table="Device" partial="true">` +
      `<Field name="accountID">${userAccount}</Field>` +
      `<Field name="deviceID">${deviceID}</Field>` +
      `</RecordKey>` +
      `</GTSRequest>`;

    console.log("xml", requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      if (response.ok) {
        if (userAccount && userUsername && userPassword) {
          if (showMessage) {
            setShowConfirmationMessagePopup(true); // succès  Échec
            setConfirmationMessagePopupTexte(
              `${t("Suppression de l'appareil avec succès")}`
            );
            setConfirmationMessagePopupName("");
          }

          setAccountDevices((prev) =>
            prev?.filter((v) => v.deviceID !== deviceID)
          );

          // setUserDevices((prev) => prev?.filter((v) => v.deviceID !== deviceID));
          setUserDevices((prev) =>
            prev.map((user) => ({
              ...user,
              userDevices: user?.userDevices?.filter(
                (device) => device.deviceID !== deviceID
              ),
            }))
          );

          setListeGestionDesVehicules((prev) =>
            prev.map((user) => ({
              ...user,
              userDevices: user?.userDevices?.filter(
                (device) => device?.deviceID !== deviceID
              ),
            }))
          );

          setCreateVéhiculeLoading(false);
          // navigate("/home");
        }
      } else {
        console.error(
          "Erreur lors de la suppression du véhicule:",
          response.statusText
        );
        if (showMessage) {
          setShowConfirmationMessagePopup(true); // succès  Échec
          setConfirmationMessagePopupTexte(
            `${t("Échec de Suppression de l'appareil")}`
          );
          setConfirmationMessagePopupName("");
        }

        setCreateVéhiculeLoading(false);
      }
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );
      if (showMessage) {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de Suppression de l'appareil")}`
        );
        setConfirmationMessagePopupName("");
      }

      setCreateVéhiculeLoading(false);
    }
  };

  //
  //
  //
  //
  //
  //
  x;

  const assignMultipleDevicesToGroup = async (
    account,
    user,
    password,
    groupID,
    devicesSelectionnes
  ) => {
    const assignPromises = devicesSelectionnes.map((deviceID) =>
      assignDeviceToGroup(account, user, password, groupID, deviceID)
    );

    const results = await Promise.all(assignPromises);
    const failed = devicesSelectionnes.filter((_, idx) => !results[idx]);

    if (failed.length > 0) {
      console.warn("Échec d’assignation pour les devices suivants :", failed);
    } else {
    }

    // Rafraîchir les données si besoin
    try {
      await fetchAccountGroupes(account, password)
        .then((groupes) => fetchGroupeDevices(account, groupes, password))
        .catch((err) => {
          console.error("Erreur lors du rafraîchissement des groupes :", err);
          setError("Erreur lors de la mise à jour des groupes.");
        });
    } catch (err) {
      console.error("Erreur globale :", err);
      setError("Erreur lors de la mise à jour.");
    }
  };
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

  const assignDeviceToGroup = async (
    account,
    user,
    password,
    groupID,
    deviceID
  ) => {
    const xmlData = `
<GTSRequest command="dbcreate">
  <Authorization account="${account}" user="${user}" password="${password}" />
  <Record table="DeviceList">
    <Field name="accountID">${account}</Field>
    <Field name="groupID">${groupID}</Field>
    <Field name="deviceID">${deviceID}</Field>
  </Record>
</GTSRequest>
  `;

    console.log("@@@@@@@@@@@@@@@@@22222 xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();
      console.log("@@@@@@@@@@@@@@@@@3333333 text", text);

      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      return result === "success";
    } catch (error) {
      console.error(
        `Erreur lors de l’assignation du device '${deviceID}' au groupe '${groupID}'`,
        error
      );
      return false;
    }
  };

  // Fonction pour assigner un device à plusieurs groupes en parallèle
  const assignDeviceToMultipleGroups = async (
    account,
    user,
    password,
    deviceID,
    groupesSelectionnes
  ) => {
    const assignPromises = groupesSelectionnes.map((groupID) =>
      assignDeviceToGroup(account, user, password, groupID, deviceID)
    );

    const results = await Promise.all(assignPromises);
    const failed = groupesSelectionnes.filter((_, idx) => !results[idx]);

    if (failed.length > 0) {
      console.warn("Échec pour les groupes suivants :", failed);
    } else {
    }

    // ✅ Rafraîchir les données des groupes et des devices dans les groupes
    const id = account;
    const pwd = password;

    try {
      fetchAccountGroupes(id, pwd)
        .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
        .catch((err) => {
          console.error("Erreur lors du rafraîchissement des groupes :", err);
          setError("Erreur lors de la mise à jour des groupes.");
        });
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des groupes :", err);
      setError("Erreur lors de la mise à jour des groupes.");
    }
  };

  const assignUserToGroup = async (
    account,
    adminUser, // celui qui fait la requête
    password,
    groupID,
    userID,
    key = "dbcreate" // l’utilisateur qu'on veut assigner
  ) => {
    const xmlData = `
<GTSRequest command="${key}">
  <Authorization account="${account}" user="${adminUser}" password="${password}" />
  <Record table="GroupList" partial="true">

    <Field name="accountID">${account}</Field>
    <Field name="userID">${userID}</Field>

    <Field name="groupID">${groupID}</Field>

  </Record>
</GTSRequest>`;
    // <Field name="groupID">${groupID1}</Field>

    console.log("#############2222222 xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const text = await res.text();
      console.log("#############333333333 text", text);

      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      return result === "success";
    } catch (error) {
      console.error(
        `Erreur lors de l’assignation de l’utilisateur '${userID}' au groupe '${groupID}'`,
        error
      );
      return false;
    }
  };

  const assignMultipleUsersToGroup = async (
    account,
    adminUser,
    password,
    groupID,
    usersSelectionnes
  ) => {
    const assignPromises = usersSelectionnes.map((userID) =>
      assignUserToGroup(account, adminUser, password, groupID, userID)
    );

    const results = await Promise.all(assignPromises);
    const failed = usersSelectionnes.filter((_, idx) => !results[idx]);

    if (failed.length > 0) {
      console.warn("Échec pour les utilisateurs suivants :", failed);
    } else {
    }

    const id = account;
    const pwd = password;

    try {
      fetchAccountGroupes(id, pwd)
        .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
        .catch((err) => {
          console.error("Erreur lors du rafraîchissement des groupes :", err);
          setError("Erreur lors de la mise à jour des groupes.");
        });

      fetchAccountUsers(id, pwd)
        .then((users) => {
          fetchUserDevices(id, users);
          fetchUserGroupes(id, users);
        })
        .catch((err) => {
          console.error(
            "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
            err
          );
          setError("Erreur lors de la mise à jour des utilisateurs.");
        });
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des groupes :", err);
      setError("Erreur lors de la mise à jour des groupes.");
    }
  };

  const removeUserFromGroup = async (
    account,
    adminUser,
    password,
    groupID,
    userID
  ) => {
    // <Field name="groupID">${groupID}</Field>
    const xmlData = `
<GTSRequest command="dbdel">
  <Authorization account="${account}" user="${adminUser}" password="${password}" />

    <RecordKey table="GroupList">

    <Field name="accountID">${account}</Field>
    <Field name="userID">${userID}</Field>
    <Field name="groupID">${groupID}</Field>

    </RecordKey>

</GTSRequest>`;

    console.log("^^^^^^^^^^^^^^^^^^22222222222 xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();

      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      console.log("^^^^^^^^^^^^^^^^^^33333333333 result", text);

      return result === "success";
    } catch (error) {
      console.error(
        `Erreur lors du retrait de l’utilisateur '${userID}' du groupe '${groupID}'`,
        error
      );
      return false;
    }
  };

  const removeDeviceFromGroup = async (
    account,
    adminUser,
    password,
    groupID,
    deviceID
  ) => {
    const xmlData = `
<GTSRequest command="dbdel">
  <Authorization account="${account}" user="${adminUser}" password="${password}" />
  <RecordKey table="DeviceList">
    <Field name="accountID">${account}</Field>
    <Field name="groupID">${groupID}</Field>
    <Field name="deviceID">${deviceID}</Field>
  </RecordKey>
</GTSRequest>`;

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();

      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      return result === "success";
    } catch (error) {
      console.error(
        `Erreur lors du retrait du device '${deviceID}' du groupe '${groupID}'`,
        error
      );
      return false;
    }
  };

  function handleUserError(xmlDoc) {
    const errorMessage = xmlDoc.getElementsByTagName("Message")[0]?.textContent;

    if (errorMessage === "User inactive") {
      handleLogout();
      navigate("/login");
    }
  }

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

  // pour stoker les donnees de l'utilisateur en local
  useEffect(() => {
    // Récupérer les informations de localStorage
    setAccount(localStorage.getItem("account") || "");
    setUsername(localStorage.getItem("username") || "");
    setPassword(localStorage.getItem("password") || "");
    setCurrentCountry(localStorage.getItem("currentCountry") || "");
  }, []);
  useEffect(() => {
    // Récupérer les informations de localStorage
    setAccount(localStorage.getItem("account") || "");
    setUsername(localStorage.getItem("username") || "");
    setPassword(localStorage.getItem("password") || "");
    setCurrentCountry(localStorage.getItem("currentCountry") || "");
  }, [account, username, password, currentCountry]);

  // pour stoker les donnees de l'utilisateur en local
  useEffect(() => {
    // Récupérer les informations de localStorage
    setAdminAccount(localStorage.getItem("adminAccount") || "");
    setAdminUsername(localStorage.getItem("adminUsername") || "");
    setAdminPassword(localStorage.getItem("adminPassword") || "");
    setCurrentCountry(localStorage.getItem("currentCountry") || "");
  }, []);

  useEffect(() => {
    // Récupérer les informations de localStorage
    setAdminAccount(localStorage.getItem("adminAccount") || "");
    setAdminUsername(localStorage.getItem("adminUsername") || "");
    setAdminPassword(localStorage.getItem("adminPassword") || "");
    setCurrentCountry(localStorage.getItem("currentCountry") || "");
  }, [adminAccount, adminUsername, adminPassword, currentCountry]);

  // Fonction pour se déconnecter de l’application
  const handleLogout = () => {
    clearCacheFonction();
    setShowSideBar(true);
    setLogOutPopup(false);

    localStorage.removeItem("userData");
    setUserData(null);

    localStorage.removeItem("userRole");
    setUserRole(null);

    localStorage.removeItem("adminUserData");
    setAdminUserData(null);

    localStorage.removeItem("gestionAccountData");
    setGestionAccountData(null);

    localStorage.removeItem("currentCountry");
    setCurrentCountry("");

    localStorage.removeItem("customHistory");

    // localStorage.removeItem("geofenceData");
    setGeofenceData(null);

    localStorage.removeItem("véhiculeData");
    setVehicleData(null);

    localStorage.removeItem("vehicleDetails");
    setVehicleDetails([]);

    localStorage.removeItem("mergedDataHome");

    setMergedDataHome(null);
    setDonneeFusionnéForRapport([]);

    // localStorage.removeItem("donneeFusionnéForRapport");

    setVéhiculeActiveToday([]);
    setVéhiculeNotActiveToday([]);
    setVéhiculeHorsService([]);
    setVéhiculeEnMouvementMaintenant([]);
    setSearchDonneeFusionnéForRapport([]);

    // localStorage.removeItem("rapportVehicleDetails");
    setRapportVehicleDetails([]);

    localStorage.removeItem("selectedTimeZone");
    setSelectedTimeZone("");

    // localStorage.removeItem("userCredentials");

    localStorage.removeItem("selectUTC");
    // setSelectUTC("");

    localStorage.removeItem("selectTime");
    setSelectTime("");

    localStorage.removeItem("account");
    setAccount("");

    localStorage.removeItem("username");
    setUsername("");

    localStorage.removeItem("password");
    setPassword("");

    localStorage.removeItem("adminAccount");
    setAdminAccount("");

    localStorage.removeItem("adminUsername");
    setAdminUsername("");

    localStorage.removeItem("adminPassword");
    setAdminPassword("");

    setStatisticFilterInHomePage();
    setStatisticFilterTextInHomePage("");
    // localStorage.clear();
    currentDataFusionné = [];
    setCurrentVéhicule(null);

    setAccountDevices(null);
    setAccountGeofences(null);
    setAccountGroupes(null);
    setAccountRulesActive(null);
    setAccountUsers(null);
    setComptes(null);
    setCurrentAccountSelected(null);

    resetIndexedDB(); // Vide le localStorage

    navigate("/login");
  };
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
  x;
  const GeofenceDataFonction = async (
    userAccount,
    userUsername,
    userPassword
  ) => {
    // Pour suivre le nombre de requête

    // /////////

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${account || userAccount}" user="${
      username || userUsername
    }" password="${password || userPassword}" />
      <Record table="Geozone" partial="true">
        <Field name="accountID">${account || userAccount}</Field>
        <Field name="descriptionZone" />
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const xmlText = await response.text();

      // Convert XML to JSON
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      // Extract records from the XML response
      const records = Array.from(xmlDoc.getElementsByTagName("Record")).map(
        (record) => {
          const fields = Array.from(
            record.getElementsByTagName("Field")
          ).reduce((acc, field) => {
            const name = field.getAttribute("name");
            const value =
              field.textContent || field.firstChild?.nodeValue || null;
            acc[name] = value;
            return acc;
          }, {});
          return fields;
        }
      );

      // Map records to geofence structure
      const geofences = records.map((record, index) => ({
        description: record.description,
        geozoneID: record.geozoneID,
        radius: record.radius,
        zoneType: record.zoneType,
        zoomRegion: record.zoomRegion,
        lastUpdateTime: record.lastUpdateTime,
        accountID: record.accountID || "",
        isActive: record.isActive || 1,
        color: record.shapeColor || "", // Use shapeColor for consistency

        coordinates: [
          {
            lat: parseFloat(record.latitude1),
            lng: parseFloat(record.longitude1),
          },
          {
            lat: parseFloat(record.latitude2),
            lng: parseFloat(record.longitude2),
          },
          {
            lat: parseFloat(record.latitude3),
            lng: parseFloat(record.longitude3),
          },
          {
            lat: parseFloat(record.latitude4),
            lng: parseFloat(record.longitude4),
          },
          {
            lat: parseFloat(record.latitude5),
            lng: parseFloat(record.longitude5),
          },
          {
            lat: parseFloat(record.latitude6),
            lng: parseFloat(record.longitude6),
          },
          {
            lat: parseFloat(record.latitude7),
            lng: parseFloat(record.longitude7),
          },
          {
            lat: parseFloat(record.latitude8),
            lng: parseFloat(record.longitude8),
          },
        ].filter((point) => !isNaN(point.lat) && !isNaN(point.lng)), // Filter invalid points
      }));

      try {
        setGeofenceData(geofences); // Mise à jour de la variable
        // localStorage.setItem("geofenceData", JSON.stringify(geofences));
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          console.error(
            "Quota dépassé pour geofenceData : essayez de réduire la taille des données ou de nettoyer localStorage."
          );
        } else {
          console.error("Erreur de stockage : ", error);
        }
      }

      setGeofenceData(geofences); // Mise à jour de la variable

      handleUserError(xmlDoc);
      /////////////////////////////////////////////////////

      return geofences;
    } catch (error) {
      console.error("Error fetching or parsing geofence data:", error);
    }
  };

  const [createGeofenceLoading, setCreateGeofenceLoading] = useState(false);

  const [currentGeozone, setCurrentGeozone] = useState();

  const [isEditingGeofence, setIsEditingGeofence] = useState(false);

  const createNewGeofence = async (
    description,
    color,
    lat1,
    lng1,
    lat2,
    lng2,
    lat3,
    lng3,
    lat4,
    lng4,
    lat5,
    lng5,
    lat6,
    lng6,
    lat7,
    lng7,
    lat8,
    lng8,
    accountIDProp,
    userProp,
    passwordProp
  ) => {
    // if (!userData || !adminUserData) return;
    // Pour suivre le nombre de requête

    // /////////

    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const geozoneID = `${description.toLowerCase().replace(/\s+/g, "_")}`;
    const sortID = `${description.toLowerCase().replace(/\s+/g, "_")}`;

    const isActive = 0;

    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${
        accountIDProp ? accountIDProp : account
      }" user="${userProp ? userProp : username}" password="${
      passwordProp ? passwordProp : password
    }" />
      <Record table="Geozone" partial="false">
        <Field name="accountID">${
          accountIDProp ? accountIDProp : account
        }</Field>


        <Field name="description">${description}</Field>
        <Field name="geozoneID">${geozoneID}</Field>
        <Field name="sortID">${sortID}</Field>
 <Field name="zoneType">3</Field>
        <Field name="radius">50</Field>
        
        <Field name="reverseGeocode">1</Field>
        <Field name="arrivalZone">1</Field>
        <Field name="departureZone">1</Field>
        <Field name="autoNotify">1</Field>
        
  
        <Field name="shapeColor">${color}</Field>
        <Field name="latitude1">${lat1}</Field>
        <Field name="longitude1">${lng1}</Field>
        <Field name="latitude2">${lat2}</Field>
        <Field name="longitude2">${lng2}</Field>
        <Field name="latitude3">${lat3}</Field>
        <Field name="longitude3">${lng3}</Field>
        <Field name="latitude4">${lat4}</Field>
        <Field name="longitude4">${lng4}</Field>
        <Field name="latitude5">${lat5}</Field>
        <Field name="longitude5">${lng5}</Field>
        <Field name="latitude6">${lat6}</Field>
        <Field name="longitude6">${lng6}</Field>
        <Field name="latitude7">${lat7}</Field>
        <Field name="longitude7">${lng7}</Field>
        <Field name="latitude8">${lat8}</Field>
        <Field name="longitude8">${lng8}</Field>
        <Field name="isActive">${isActive}</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        if (isDashboardHomePage) {
          fetchAccountGeofences(accountIDProp, passwordProp);
          // setCreateGeofenceLoading(false);
        } else {
          setGeofenceData((prevGeofences) => [
            ...prevGeofences,
            {
              description,
              geozoneID,
              sortID,
              color,
              lat1,
              lng1,
              lat2,
              lng2,
              lat3,
              lng3,
              lat4,
              lng4,
              lat5,
              lng5,
              lat6,
              lng6,
              lat7,
              lng7,
              lat8,
              lng8,
              isActive,
            },
          ]);

          // setCreateGeofenceLoading(false);
          GeofenceDataFonction(account, username, password);
        }

        navigate("/gestion_geofences?tab=geozone");
        // setSuccesCreateGeofencePopup(true);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Vous avez ajoutee le geofence avec succès")}`
        );
        setConfirmationMessagePopupName(description);
      } else {
        // setCreateGeofenceLoading(false);

        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de l'ajout du Geofence")}`
        );
        setConfirmationMessagePopupName(description);

        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        console.error("Error message:", errorMessage);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Échec de la création du Geofence.");
      console.error("Échec de la création du Geofence", error);
      // setCreateGeofenceLoading(false);

      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(`${t("Échec de l'ajout du Geofence")}`);
      setConfirmationMessagePopupName(description);
    }
  };

  const ModifierGeofence = async (
    description,
    color,
    geozoneID,
    lat1,
    lng1,
    lat2,
    lng2,
    lat3,
    lng3,
    lat4,
    lng4,
    lat5,
    lng5,
    lat6,
    lng6,
    lat7,
    lng7,
    lat8,
    lng8,
    accountIDProp,
    userProp,
    passwordProp
  ) => {
    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";
    const isActive = 0;

    const requestBody = `<GTSRequest command="dbput">
    <Authorization account="${accountIDProp || account}" user="${
      userProp || username
    }" password="${passwordProp || password}" />
    <Record table="Geozone" partial="true">
      <Field name="accountID">${accountIDProp || account}</Field>
      <Field name="geozoneID">${geozoneID}</Field>
      <Field name="sortID">${geozoneID}</Field>
        <Field name="zoneType">3</Field>
        <Field name="radius">50</Field>


          <Field name="reverseGeocode">1</Field>
        <Field name="arrivalZone">1</Field>
        <Field name="departureZone">1</Field>
        <Field name="autoNotify">1</Field>


      <Field name="description">${description}</Field>
      <Field name="shapeColor">${color}</Field>
      <Field name="latitude1">${lat1}</Field>
      <Field name="longitude1">${lng1}</Field>
      <Field name="latitude2">${lat2}</Field>
      <Field name="longitude2">${lng2}</Field>
      <Field name="latitude3">${lat3}</Field>
      <Field name="longitude3">${lng3}</Field>
      <Field name="latitude4">${lat4}</Field>
      <Field name="longitude4">${lng4}</Field>
      <Field name="latitude5">${lat5}</Field>
      <Field name="longitude5">${lng5}</Field>
      <Field name="latitude6">${lat6}</Field>
      <Field name="longitude6">${lng6}</Field>
      <Field name="latitude7">${lat7}</Field>
      <Field name="longitude7">${lng7}</Field>
      <Field name="latitude8">${lat8}</Field>
      <Field name="longitude8">${lng8}</Field>
      <Field name="isActive">${isActive}</Field>
    </Record>
  </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: requestBody,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const gtsResponse = xmlDoc.getElementsByTagName("GTSResponse")[0];

      if (!gtsResponse) {
        console.warn(
          "⚠️ Aucun élément <GTSResponse> trouvé dans la réponse XML."
        );
        throw new Error("Mauvaise structure XML");
      }

      const result = gtsResponse.getAttribute("result");

      if (result && result === "success") {
        const coordinates = [
          { lat: lat1, lng: lng1 },
          { lat: lat2, lng: lng2 },
          { lat: lat3, lng: lng3 },
          { lat: lat4, lng: lng4 },
          { lat: lat5, lng: lng5 },
          { lat: lat6, lng: lng6 },
          { lat: lat7, lng: lng7 },
          { lat: lat8, lng: lng8 },
        ];

        if (isDashboardHomePage) {
          setAccountGeofences((prevGeofences) =>
            prevGeofences?.map((geofence) =>
              geofence.geozoneID === geozoneID
                ? { ...geofence, description, isActive, color, coordinates }
                : geofence
            )
          );
          setListeGestionDesGeofences((prevGeofences) =>
            prevGeofences?.map((geofence) =>
              geofence.geozoneID === geozoneID
                ? { ...geofence, description, isActive, color, coordinates }
                : geofence
            )
          );
        } else {
          setGeofenceData((geofences) =>
            geofences.map((geofence) =>
              geofence?.geozoneID === geozoneID
                ? {
                    ...geofence,
                    description,
                    isActive,
                    color,
                    lat1,
                    lng1,
                    lat2,
                    lng2,
                    lat3,
                    lng3,
                    lat4,
                    lng4,
                    lat5,
                    lng5,
                    lat6,
                    lng6,
                    lat7,
                    lng7,
                    lat8,
                    lng8,
                  }
                : geofence
            )
          );
        }

        navigate("/gestion_geofences?tab=geozone");
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Modification du geofence avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateGeofenceLoading(false);
      } else {
        console.error("❌ Résultat non 'success' :", result);
        handleUserError(xmlDoc);
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la modification du geofence")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateGeofenceLoading(false);
      }
    } catch (error) {
      console.error("💥 Erreur attrapée dans le try/catch :", error);
      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de la modification du geofence")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateGeofenceLoading(false);
    }
  };

  const supprimerGeofence = async (
    geozoneID,
    accountIDProp,
    userProp,
    passwordProp
  ) => {
    // /////////

    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const requestBody = `<GTSRequest command="dbdel">
  <Authorization account="${accountIDProp || account}" user="${
      userProp || username
    }" password="${passwordProp || password}" />
  <RecordKey table="Geozone" partial="false">
    <Field name="accountID">${accountIDProp || account}</Field>
    <Field name="geozoneID">${geozoneID}</Field>
    <Field name="sortID">${geozoneID}</Field>
  </RecordKey>
</GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        if (isDashboardHomePage) {
          setAccountGeofences((prevGeofence) =>
            prevGeofence.filter((geofence) => geofence.geozoneID !== geozoneID)
          );
        } else {
          setGeofenceData((geofences) =>
            geofences.filter((geofence) => geofence?.geozoneID !== geozoneID)
          );

          navigate("/gestion_geofences?tab=geozone");
        }

        // setSuccesDeleteGeofencePopup(true);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Suppression du geofence avec succès")}`
        );
        setConfirmationMessagePopupName("");

        setCreateGeofenceLoading(false);
      } else {
        console.error(
          "Erreur lors de la Suppression du geofence:",
          response.statusText
        );

        // setErrorDeleteGeofencePopup(true);
        // succès  Échec
        setShowConfirmationMessagePopup(true);
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Suppression du geofence")}`
        );
        setConfirmationMessagePopupName("");
        setCreateGeofenceLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      // setErrorDeleteGeofencePopup(true);
      setShowConfirmationMessagePopup(true);
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Suppression du geofence")}`
      );
      setConfirmationMessagePopupName("");
      setCreateGeofenceLoading(false);
    }
  };

  const activerOuDesactiverGeofence = async (geozoneID, isActiveValue) => {
    // if (!userData) return;
    // Pour suivre le nombre de requête

    // /////////

    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    // const description = "Test ajout";

    const isActive = 0;

    const requestBody = `<GTSRequest command="dbput">
    <Authorization account="${account}" user="${username}" password="${password}" />
    <Record table="Geozone" partial="false">
    <Field name="accountID">${account}</Field>
    
    <Field name="geozoneID">${geozoneID}</Field>
    <Field name="sortID">${geozoneID}</Field>

        <Field name="isActive">${isActive}</Field>
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Modification du geofence avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        GeofenceDataFonction(account, username, password);

        navigate("/gestion_geofences?tab=geozone");
      } else {
        console.error(
          `Erreur lors de ${
            isActiveValue === 1 ? "l'activation" : "la desactivation"
          } du geofence:`,
          response.statusText
        );

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Modification du geofence")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateGeofenceLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Modification du geofence")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateGeofenceLoading(false);
    }
  };

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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [progressBarForLoadingDataUser, setProgressDataUser] = useState(0);

  const doneRef = { current: 0 }; // ou useRef(0) si tu es dans un composant React
  const limit2 = pLimit(30);

  const processVehicleDetails = async (vehicle, timeFrom, timeTo) => {
    try {
      await fetchRapportVehicleDetails(
        vehicle?.deviceID,
        timeFrom || TimeFrom,
        timeTo || TimeTo
      );
      await delay(500);
    } catch (error) {
      console.error("Erreur pour le véhicule", vehicle?.deviceID, ":", error);
    }
  };

  const processAllVehiclesDetails = async (vehicles, timeFrom, timeTo) => {
    const total = vehicles?.length ?? 0;
    doneRef.current = 0;

    const promises = vehicles.map((vehicle) =>
      limit2(async () => {
        await processVehicleDetails(vehicle, timeFrom, timeTo);

        doneRef.current += 1;
        const progress = Math.round((doneRef.current / total) * 100);
        setProgress(progress);
        // setProgressDataUser(progress);
      })
    );

    await Promise.all(promises);
  };

  ///////////////////////////////////

  const limit3 = pLimit(50); // utilise la même limite que pour les détails
  const doneRef3 = { current: 0 };

  const processVehicle = async (vehicle) => {
    try {
      await fetchVehicleDetails(vehicle);
      await delay(500);
    } catch (error) {
      console.error("Erreur pour le véhicule", vehicle?.deviceID, ":", error);
    }
  };

  const processAllVehicles = async (vehicles) => {
    const total = vehicles?.length ?? 0;
    doneRef3.current = 0;

    const promises = vehicles.map((vehicle) =>
      limit3(async () => {
        await processVehicle(vehicle);
        doneRef3.current += 1;
        const progress = Math.round((doneRef3.current / total) * 100);
        setProgress(progress);
        // setProgressDataUser(progress);
      })
    );

    await Promise.all(promises);
  };

  const [
    fetchVehicleDataFromRapportGroupe,
    setFetchVehicleDataFromRapportGroupe,
  ] = useState(false);

  // Requête pour afficher tous les véhicule mais sans details
  const fetchVehicleData = async (
    accountID,
    userID,
    password,
    onlyLastResult = true,
    timeFrom,
    timeTo
  ) => {
    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${accountID}" user="${userID}" password="${password}" />
        <Record table="Device" partial="true">
          <Field name="accountID">${accountID}</Field>

          <Field name="vehicleID" />
          <Field name="creationTime" />
          <Field name="description" />
          <Field name="deviceCode" />
          <Field name="displayName" />
          <Field name="equipmentType" />
          <Field name="imeiNumber" />
          <Field name="ipAddressCurrent" />
          <Field name="isActive" />
          <Field name="lastEventTimestamp" />
          <Field name="lastGPSTimestamp" />
          <Field name="lastOdometerKM" />
          <Field name="lastStartTime" />
          <Field name="lastStopTime" />
          <Field name="lastTotalConnectTime" />
          <Field name="lastUpdateTime" />
          <Field name="lastValidLatitude" />
          <Field name="lastValidLongitude" />
          <Field name="licensePlate" />
          <Field name="simPhoneNumber" />
          <Field name="speedLimitKPH" />
          <Field name="uniqueID" />
          <Field name="lastEventStatusCode" />
          <Field name="notes" />
          <Field name="allowNotify" />



          
        </Record>
      </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");
      let véhiculeData = [];

      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        let vehicleRecord = {};

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          let fieldValue = fields[j].textContent;
          vehicleRecord[fieldName] = fieldValue;
        }

        véhiculeData.push(vehicleRecord);
      }

      setVehicleData(véhiculeData);
      if (onlyLastResult) {
        if (véhiculeData?.length <= 0) return;
        setDashboardLoadingEffect(true);

        setFetchVehicleDataFromRapportGroupe(false);
        setProgress(2);
        setProgressAnimationStart(0);
        setRunningAnimationProgressLoading(true);
        processAllVehicles(véhiculeData);
      } else {
        if (véhiculeData?.length <= 0) return;
        setFetchVehicleDataFromRapportGroupe(true);
        setProgress(2);
        setProgressAnimationStart(0);
        setRunningAnimationProgressLoading(true);
        processAllVehiclesDetails(véhiculeData, timeFrom, timeTo);
        setDashboardLoadingEffect(true);
      }
      setDashboardLoadingEffect(false);

      handleUserError(xmlDoc);
    } catch (error) {
      setDashboardLoadingEffect(false);
      setProgress(0);

      console.error(
        "Erreur lors de la récupération des données des véhicules",
        error
      );
    }
  };

  const [fromSelectOnPositionValue, setFromSelectOnPositionValue] = useState();

  const fetchVehicleDetails = async (
    vehicule,
    fromSelectOnPosition = false
  ) => {
    setDashboardLoadingEffect(true);

    let accountID;
    let userID;
    let password;

    if (isDashboardHomePage) {
      accountID =
        currentAccountSelected?.accountID ||
        comptes?.find((account) => account.accountID === vehicule?.accountID)
          ?.accountID;
      userID = "admin";
      password =
        currentAccountSelected?.password ||
        comptes?.find((account) => account.accountID === vehicule?.accountID)
          ?.password;
    } else {
      accountID = localStorage.getItem("account") || "";
      userID = localStorage.getItem("username") || "";
      password = localStorage.getItem("password") || "";
    }

    const Device = vehicule?.deviceID;

    const adjustedTimeFrom = "2020-01-01 21:00:00";
    const adjustedTimeTo = "2030-05-14 21:00:00";

    const xmlData = `<GTSRequest command="eventdata">
    <Authorization account="${accountID}" user="${userID}" password="${password}" />
    <EventData>
      <Device>${Device}</Device>
      <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
      <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>

      <GPSRequired>false</GPSRequired>
      <StatusCode>false</StatusCode>
      <Limit type="last">1</Limit>
      <Ascending>false</Ascending>

      <Field name="latitude" />
      <Field name="longitude" />
      <Field name="address" />
      <Field name="speedKPH" />
      <Field name="timestamp" />
      <Field name="heading" />
      
      <Field name="odometerKM" />
      
      <Field name="statusCode" />
      
    </EventData>
  </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device };

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          let fieldValue = fields[j].textContent;

          if (fieldName === "timestamp") {
            let timestamp = parseInt(fieldValue, 10);
            timestamp = timestamp + ((Number(selectUTC) || -5) + 5) * 60 * 60;
            fieldValue = timestamp.toString();
          }
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";
        newVehicleDetails.push(details);
      }

      if (fromSelectOnPosition) {
        setFromSelectOnPositionValue(newVehicleDetails);
      }

      setVehicleDetails((prevDetails) => {
        const updatedDetails = prevDetails?.map((detail) => {
          if (detail.Device === Device) {
            return newVehicleDetails.length > 0
              ? { ...detail, véhiculeDetails: [...newVehicleDetails] }
              : detail;
          }
          return detail;
        });

        if (!updatedDetails?.some((detail) => detail.Device === Device)) {
          updatedDetails.push({
            Device,
            véhiculeDetails: [...newVehicleDetails],
          });
        }
        setDashboardLoadingEffect(false);

        return [...updatedDetails];
      });

      handleUserError(xmlDoc);
    } catch (error) {
      setDashboardLoadingEffect(false);

      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  useEffect(() => {
    if (vehicleDetails.length > 0) {
      mergeVehicleDataWithEvents(vehicleDetails);
    }
  }, [vehicleDetails]);

  // Pour fusionnée les donnees pour la page home // véhiculeData et vehicleDetails
  const mergeVehicleDataWithEvents = (eventData = vehicleDetails) => {
    const dataFusionne = {};
    const seenEvents = new Set();

    // Vérifiez si deviceID existe bien dans véhiculeData
    véhiculeData?.forEach((véhicule) => {
      const { deviceID } = véhicule;
      if (deviceID) {
        // Vérification de l'existence de deviceID
        dataFusionne[deviceID] = {
          ...véhicule,
          véhiculeDetails:
            vehicleDetails.find((v) => v.Device === deviceID)
              ?.véhiculeDetails || [],
        };
      } else {
        // console.warn("deviceID manquant dans véhiculeData", véhicule);
      }
    });

    eventData?.forEach((event) => {
      const { deviceID, timestamp, ...eventDetails } = event;
      const eventKey = `${deviceID}-${timestamp}`;

      if (!seenEvents.has(eventKey)) {
        seenEvents.add(eventKey);

        if (dataFusionne[deviceID]) {
          if (Object.keys(eventDetails).length > 0) {
            dataFusionne[deviceID].véhiculeDetails.push({
              timestamp,
              ...eventDetails,
            });
          }
        } else {
          // console.warn("deviceID manquant dans eventData", event);
        }
      }
    });

    const hasDeviceID = Object.values(dataFusionne)?.some(
      (item) => !!item.deviceID
    );
    if (hasDeviceID) {
      setMergedDataHome(dataFusionne);
    }
    setIsHomePageLoading(false);

    return dataFusionne;
  };

  const homePageReload = (
    account,
    user,
    password,
    onlyLastResult = true,
    timeFrom = null,
    timeTo = null
  ) => {
    setShowAnnimationProgresseBarDashboard(true);
    fetchVehicleData(account, user, password, onlyLastResult, timeFrom, timeTo);
  };
  const homePageReloadWidthNoAnimation = () => {};

  //
  //
  //
  //
  //

  //
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Rapport page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // Requête pour rechercher les details des véhicule dans la page rapport
  const fetchRapportVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    // if (!userData) return;
    // Pour suivre le nombre de requête

    console
      .log
      // "++++++++++++++++ Requête effectué: "
      ();

    // /////////
    // Ajuste les heures de TimeFrom et TimeTo

    // const { accountID, userID, password } = userData;
    let accountID;
    let userID;
    let password;

    if (isDashboardHomePage && currentAccountSelected) {
      accountID = currentAccountSelected?.accountID;
      userID = "admin";
      password = currentAccountSelected?.password;
    } else if (!isDashboardHomePage) {
      accountID = account || localStorage.getItem("account") || "";
      userID = username || localStorage.getItem("username") || "";
      password = localStorage.getItem("password") || "";
    }

    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>


        <GPSRequired>false</GPSRequired>
        <StatusCode>false</StatusCode>
        <Limit type="last">20000</Limit>
        <Ascending>false</Ascending>
        <Field name="latitude" />
        <Field name="longitude" />
        <Field name="address" />
        <Field name="speedKPH" />
        <Field name="timestamp" />
        <Field name="heading" />
        
        
        
        <Field name="odometerKM" />
        
        <Field name="statusCode" />
        


        
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          let fieldValue = fields[j].textContent;

          // // Si le champ est un timestamp, ajoute 4 heures
          if (fieldName === "timestamp") {
            // Convertir le timestamp en entier, ajouter 4 heures (en secondes)
            let timestamp = parseInt(fieldValue, 10);
            timestamp = timestamp + ((Number(selectUTC) || -5) + 5) * 60 * 60; // Ajouter 4 heures
            fieldValue = timestamp.toString(); // Reconvertir en chaîne
          }
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";

        newVehicleDetails.push(details);
      }

      // Suppression des doublons dans `newVehicleDetails`
      const uniqueVehicleDetails = newVehicleDetails.filter(
        (detail, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.Device === detail.Device &&
              t.timestamp === detail.timestamp &&
              t.latitude === detail.latitude &&
              t.longitude === detail.longitude
          )
      );

      // Filtrage des timestamps
      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = uniqueVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000; // Convertir en millisecondes
        return (
          recordTimestamp >= timeFromTimestamp &&
          recordTimestamp <= timeToTimestamp
        );
      });

      setRapportVehicleDetails((prevDetails) => {
        const autresDetails = prevDetails.filter(
          (detail) => detail.Device !== Device
        );
        if (filteredVehicleDetails.length === 0) {
          return autresDetails;
        }
        return [...autresDetails, ...filteredVehicleDetails];
      });
      handleUserError(xmlDoc);

      // rapportFusionnerDonnees();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  useEffect(() => {
    if (rapportVehicleDetails && rapportVehicleDetails.length > 0) {
      rapportFusionnerDonnees();
    }
  }, [rapportVehicleDetails]);

  const rapportFusionnerDonnees = () => {
    if (!véhiculeData || !rapportVehicleDetails) return [];

    const dataFusionné = véhiculeData.map((véhicule) => {
      const newDetails = rapportVehicleDetails?.filter(
        (detail) => detail.Device === véhicule?.deviceID
      );

      return {
        ...véhicule,
        véhiculeDetails: newDetails && newDetails.length > 0 ? newDetails : [],
      };
    });

    setDonneeFusionnéForRapport(dataFusionné);

    return dataFusionné;
  };

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
  //
  //
  //
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Rapport page recherche par date
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // Requête pour la recherche de details des véhicule dans la page rapport
  const fetchSearchRapportVehicleDetails = async (
    Device,
    TimeFrom,
    TimeTo,
    adminAccount,
    adminUser,
    adminPassword
  ) => {
    // Ajuste les heures de TimeFrom et TimeTo
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    // if (!userData) return;
    // Pour suivre le nombre de requête

    // /////////
    // Ajuste les heures de TimeFrom et TimeTo

    // const { accountID, userID, password } = userData;
    const accountID = account || localStorage.getItem("account") || "";
    const userID = username || localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${adminAccount || accountID}" user="${
      adminUser || userID
    }" password="${adminPassword || password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>
        <GPSRequired>false</GPSRequired>
        <StatusCode>false</StatusCode>
        <Limit type="last">20000</Limit>
        <Ascending>false</Ascending>
        <Field name="latitude" />
        <Field name="longitude" />
        <Field name="address" />
        <Field name="speedKPH" />
        <Field name="timestamp" />
        <Field name="heading" />
        
        
       
        <Field name="odometerKM" />
        
        <Field name="statusCode" />
        
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          let fieldValue = fields[j].textContent;

          // // Si le champ est un timestamp, ajoute 4 heures
          if (fieldName === "timestamp") {
            // Convertir le timestamp en entier, ajouter 4 heures (en secondes)
            let timestamp = parseInt(fieldValue, 10);
            timestamp = timestamp + ((Number(selectUTC) || -5) + 5) * 60 * 60; // Ajouter 4 heures
            fieldValue = timestamp.toString(); // Reconvertir en chaîne
          }

          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";

        newVehicleDetails.push(details);
      }

      // Suppression des doublons dans `newVehicleDetails`
      const uniqueVehicleDetails = newVehicleDetails.filter(
        (detail, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.Device === detail.Device &&
              t.timestamp === detail.timestamp &&
              t.latitude === detail.latitude &&
              t.longitude === detail.longitude
          )
      );

      // Filtrage des timestamps
      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = uniqueVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000; // Convertir en millisecondes
        return (
          recordTimestamp >= timeFromTimestamp &&
          recordTimestamp <= timeToTimestamp
        );
      });

      setSearchRapportVehicleDetails((prevDetails) => [
        ...prevDetails.filter((detail) => detail.Device !== Device),
        ...filteredVehicleDetails,
      ]);

      handleUserError(xmlDoc);
    } catch (error) {
      setRapportDataLoading(false);
      handleUserError(xmlDoc);

      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  // Fonction pour fusionnée les donnee de recherche par date
  const rapportSearchFusionnerDonnees = () => {
    if (!véhiculeData || !searchRapportVehicleDetails) return [];

    const dataFusionné = véhiculeData.map((véhicule) => {
      const events = searchRapportVehicleDetails?.filter(
        (detail) => detail.Device === véhicule?.deviceID
      );

      // Mettre à jour les informations du véhicule si les nouveaux détails ne sont pas vides
      return {
        ...véhicule,
        véhiculeDetails: events,
      };
    });

    const oneVehicleProcessed = dataFusionné?.some(
      (véhicule) =>
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0
    );

    if (oneVehicleProcessed) {
      setRapportDataLoading(false);
    } else {
    }

    // Vérifiez si chaque véhicule a ses détails ajoutés
    const allVehiclesProcessed = dataFusionné.every(
      (véhicule) =>
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0
    );

    // 1. Met à jour l'état avec toutes les données fusionnées
    setSearchDonneeFusionnéForRapport(dataFusionné);

    // 2. Met à jour le chargement uniquement lorsque toutes les données sont traitées
    if (allVehiclesProcessed) {
      setSearchDonneeFusionnéForRapport(dataFusionné);
    } else {
    }

    return dataFusionné;
  };

  // Pour lancer le fusionnement de donnee de recherche par date des fonctions fetchSearchRapportVehicleDetails et rapportSearchFusionnerDonnees
  useEffect(() => {
    if (searchRapportVehicleDetails.length > 0 && véhiculeData?.length > 0) {
      rapportSearchFusionnerDonnees();
    }
  }, [searchRapportVehicleDetails, véhiculeData]);

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
  //
  //
  //
  //
  //
  //
  //

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Pour filtrer les donnees dans la page rapport
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  let currentDataFusionné = donneeFusionnéForRapport;

  //  Pour filtrer les donnees dans la page rapport
  useEffect(() => {
    if (currentDataFusionné && currentDataFusionné?.length > 0) {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
      const currentTime = Date.now(); // Heure actuelle en millisecondes

      // Fonction pour obtenir le timestamp d'aujourd'hui à minuit
      const getTodayTimestamp = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Minuit
        return Math.floor(now.getTime() / 1000); // Convertir en secondes
      };
      const todayTimestamp = getTodayTimestamp() * 1000;

      const véhiculeActiveToday = currentDataFusionné?.filter((véhicule) => {
        const hasBeenMoving =
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH > 0);

        const lastUpdateTimestampMs =
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails[0] &&
          véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

        const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

        return hasBeenMoving;
      });

      setVéhiculeActiveToday(véhiculeActiveToday);

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
      //
      //

      const véhiculeNotActiveToday = currentDataFusionné.filter((véhicule) => {
        // Vérifie si le véhicule a des détails
        const hasDetails = véhicule?.véhiculeDetails?.length > 0;

        // Vérifie que tous les objets de véhiculeDetails ont speedKPH <= 0
        const noSpeed = véhicule?.véhiculeDetails?.every(
          (detail) => detail.speedKPH <= 0
        );

        const hasBeenMoving =
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH > 0);

        // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
        const lastUpdateTimeMs = véhicule?.lastUpdateTime
          ? véhicule?.lastUpdateTime * 1000
          : 0;
        const isActive = currentTime - lastUpdateTimeMs < twentyFourHoursInMs;

        const lastUpdateTimestampMs =
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails[0] &&
          véhicule?.véhiculeDetails[0].timestamp * 1000; // Convertir en millisecondes

        const isToday = lastUpdateTimestampMs - todayTimestamp > 0;

        // Retourne les véhicules qui remplissent toutes les conditions
        // return hasDetails && noSpeed && isActive;

        return (
          hasDetails && isActive && noSpeed
          // hasDetails && isActive && (noSpeed || (hasBeenMoving && !isToday))
        );
      });

      setVéhiculeNotActiveToday(véhiculeNotActiveToday);

      //
      //
      //
      //
      //
      //
      //
      //

      // 4. Met à jour l'état avec tous les véhicules dont `véhiculeDetails[0].speedKPH > 0`
      const véhiculeEnMouvementMaintenant = currentDataFusionné?.filter(
        (véhicule) =>
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails?.length &&
          véhicule?.véhiculeDetails[0]?.speedKPH > 0
      );

      setVéhiculeEnMouvementMaintenant(véhiculeEnMouvementMaintenant);
      //
      //
      //
      //
      //
      //
      //
      //
      // 5. Met à jour l'état avec tous les véhicules dont `lastUpdateTime` est supérieur à 24h par rapport à l'heure actuelle

      // Filtrer les véhicules sans détails ou inactifs
      const véhiculeHorsService = currentDataFusionné?.filter((véhicule) => {
        // Vérifier si le véhicule n'a pas de détails
        const noDetails =
          !véhicule?.véhiculeDetails || véhicule?.véhiculeDetails.length === 0;

        // Vérifier si le véhicule est inactif
        const lastUpdateTime = véhicule?.lastUpdateTime;
        const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
        const isInactive =
          lastUpdateTimeMs > 0 &&
          currentTime - lastUpdateTimeMs >= twentyFourHoursInMs;

        // Vérifier si le véhicule est actif
        const isActif = véhicule?.véhiculeDetails?.some(
          (detail) => detail.speedKPH > 0
        );

        // Retourner true pour les véhicules sans détails ou inactifs, mais pas actifs
        return (noDetails || isInactive) && !isActif;
      });

      setVéhiculeHorsService(véhiculeHorsService);
    }
  }, [currentDataFusionné, donneeFusionnéForRapport]);

  // Pour mettre a jour le véhicule actuelle
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentVéhicule) {
        const deviceID = currentVéhicule?.deviceID;

        const foundVehicle = currentDataFusionné?.find(
          (v) => v.deviceID === deviceID
        );

        setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
        setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, []); // Pas de dépendances, exécution régulière

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
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Historique page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // pour afficher les detail d'hun véhicule dans Historique page (utilise pour les recherches)
  const fetchHistoriqueVehicleDetails = async (
    Device,
    TimeFrom,
    TimeTo,

    adminAccount,
    adminUser,
    adminPassword,

    fromUpdateAuto
  ) => {
    // Ajuste les heures de TimeFrom et TimeTo
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    if (fromUpdateAuto) {
      setLoadingHistoriqueFilter(false);
    } else {
      setLoadingHistoriqueFilter(true);
    }

    // if (!userData) return;
    // Pour suivre le nombre de requête

    // /////////
    // Ajuste les heures de TimeFrom et TimeTo

    // const { accountID, userID, password } = userData;
    const accountID = account || localStorage.getItem("account") || "";
    const userID = username || localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${adminAccount || accountID}" user="${
      adminUser || userID
    }" password="${adminPassword || password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>
        <GPSRequired>false</GPSRequired>
        <StatusCode>false</StatusCode>
        <Limit type="last">20000</Limit>
        <Ascending>false</Ascending>
        <Field name="latitude" />
        <Field name="longitude" />
        <Field name="address" />
        <Field name="speedKPH" />
        <Field name="timestamp" />
        <Field name="heading" />
        
        
        
        <Field name="odometerKM" />
        
        <Field name="statusCode" />
        
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          let fieldValue = fields[j].textContent;

          // // Si le champ est un timestamp, ajoute 4 heures
          if (fieldName === "timestamp") {
            // Convertir le timestamp en entier, ajouter 4 heures (en secondes)
            let timestamp = parseInt(fieldValue, 10);
            timestamp = timestamp + ((Number(selectUTC) || -5) + 5) * 60 * 60; // Ajouter 4 heures
            fieldValue = timestamp.toString(); // Reconvertir en chaîne
          }
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";
        newVehicleDetails.push(details);
      }

      // Suppression des doublons
      const uniqueVehicleDetails = newVehicleDetails.filter(
        (detail, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.Device === detail.Device &&
              t.timestamp === detail.timestamp &&
              t.latitude === detail.latitude &&
              t.longitude === detail.longitude
          )
      );

      // Filtrage des timestamps
      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = uniqueVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000; // Convertir en millisecondes
        return (
          recordTimestamp >= timeFromTimestamp &&
          recordTimestamp <= timeToTimestamp
        );
      });

      setVéhiculeHistoriqueDetails(filteredVehicleDetails);
      // if (forCurrentDevice) {
      const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

      const foundVehicle = (
        isDashboardHomePage ? accountDevices : dataFusionné
      )?.find((v) => v.deviceID === Device);

      if (foundVehicle) {
        const foundVehicleWidthFilteredVehicleDetails = {
          ...foundVehicle,
          véhiculeDetails: filteredVehicleDetails,
        };

        setCurrentPersonelVéhicule(foundVehicleWidthFilteredVehicleDetails);
        setCurrentVéhicule(foundVehicleWidthFilteredVehicleDetails);
        setLoadingHistoriqueFilter(false);
        setRapportDataLoading(false);
      } else {
      }
      // }
      setRapportDataLoading(false);

      setLoadingHistoriqueFilter(false);
      setTimeout(() => {
        setLoadingHistoriqueFilter(false);
      }, 15000); // 10 000 millisecondes = 10 secondes
      handleUserError(xmlDoc);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  // Pour la rehcerhce de donnee dans Historique page apres avoir choisi une date
  const handleDateChange = (TimeFrom, TimeTo) => {
    if (véhiculeData && véhiculeData?.length > 0) {
      véhiculeData?.forEach((véhicule) => {
        fetchVehicleDetails(véhicule);
      });
    }
  };

  //

  //
  //
  //
  //
  let createVehicle;
  let updateVehicle;
  let deleteVehicle;

  //
  //
  //
  //

  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Envoyer un SMS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  const [smsError, setSmsError] = useState(""); // Utilisation du useState pour l'erreur

  // Fonction pour la gestion de l'envoie des sms
  const envoyerSMS = (numero, message) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Vérification de la plateforme

    if (!isMobile) {
      setSmsError(
        "Veuillez utiliser de préférence votre téléphone pour l'utilisation de cette fonctionnalité"
      );
      return;
    }

    try {
      const smsLink = `sms:${numero}?body=${encodeURIComponent(message)}`;

      // Essayer de rediriger vers le lien sms:
      window.location.href = smsLink;

      // Vérifier après un délai si l'action a échoué
      setTimeout(() => {
        if (window.location.href === smsLink) {
          // Si l'URL n'a pas changé, il y a probablement un problème
          setSmsError(
            "Impossible d'ouvrir l'application de messagerie. Veuillez utiliser de préférence votre téléphone pour l'utilisation de cette fonctionnalité."
          );
        }
      }, 3000); // Délai d'attente de 1 seconde (ajuster si nécessaire)
    } catch (error) {
      setSmsError("Une erreur est survenue lors de l'envoi du SMS.");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // fonction pour lancer appelle
  const lancerAppel = (numero) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Vérification de la plateforme

    if (!isMobile) {
      setSmsError(
        "Veuillez utiliser de préférence votre téléphone pour l'utilisation de cette fonctionnalité"
      );
      return;
    }

    try {
      const formattedNumber = numero;
      // const formattedNumber = numero.startsWith("509") ? `+${numero}` : numero;

      const callLink = `tel:${formattedNumber}`;

      // Essayer de rediriger vers le lien d'appel
      window.location.href = callLink;

      // Vérifier après un délai si l'action a échoué
      setTimeout(() => {
        if (window.location.href === callLink) {
          // Si l'URL n'a pas changé, il y a probablement un problème
          setSmsError(
            "Impossible d'ouvrir l'application d'appel. Veuillez vérifier que votre appareil supporte les appels."
          );
        }
      }, 3000); // Délai d'attente de 3 secondes
    } catch (error) {
      setSmsError("Une erreur est survenue lors de la tentative d'appel.");
    }
  };

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
  // Sauvegarde des données dans localStorage à chaque mise à jour des états
  useEffect(() => {
    try {
      localStorage.setItem("userRole", JSON.stringify(userRole));
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        // console.error(
        //   "Quota dépassé pour userRole : essayez de réduire la taille des données ou de nettoyer localStorage."
        // );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

    try {
      localStorage.setItem(
        "isDashboardHomePage",
        JSON.stringify(isDashboardHomePage)
      );
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        // console.error(
        //   "Quota dépassé pour isDashboardHomePage : essayez de réduire la taille des données ou de nettoyer localStorage."
        // );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }
  }, [userRole, isDashboardHomePage]);

  //
  //
  //
  //
  //
  //
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Pour définir les bouton active en fonction du lien dans le navigateur
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  const location = useLocation();
  const [tab, setTab] = useState("");

  // Synchronisation de l'état `tab` avec l'URL lors du montage du composant ou des changements d'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location]); // Réagit aux changements d'URL

  // fonction pour changer le text dans le tab
  const handleTabClick = (tabName) => {
    setTab(tabName);
    navigate(`/home?tab=${tabName}`);
  };

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
  //
  //
  //
  //
  //
  x;
  // const fonctionTest = () => {};
  const fonctionTest2 = () => {};

  const fonctionTest = async () => {
    const account = "foodforthepoor";
    const username = "admin";
    const password = "Octa@112233";
    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${account}" user="${username}" password="${password}" />
      <Record table="RuleList" partial="true">
        <Field name="accountID">${account}</Field>

        </Record>
    </GTSRequest>`;
    const api = "/octagono-plus-api/track/Service";

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const xmlText = await response.text();

      // Convert XML to JSON
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      // Extract records from the XML response
      const records = Array.from(xmlDoc.getElementsByTagName("Record")).map(
        (record) => {
          const fields = Array.from(
            record.getElementsByTagName("Field")
          ).reduce((acc, field) => {
            const name = field.getAttribute("name");
            const value =
              field.textContent || field.firstChild?.nodeValue || null;
            acc[name] = value;
            return acc;
          }, {});
          return fields;
        }
      );
    } catch (error) {
      console.error("Error fetching or parsing geofence data:", error);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  x;
  // Fonction pour le format de timestamp en Heure, minutes et seconde.
  function FormatDateHeure(timestamp) {
    // Convertir le timestamp en millisecondes
    const date = new Date(timestamp * 1000);

    // Récupérer les informations nécessaires
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convertir en format 12 heures
    hours = hours % 12 || 12;

    // Formater la date et l'heure
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${String(hours).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }
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
  //
  //
  //
  //
  //
  //
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Pour les téléchargements en PDF et en EXCEL
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // pour la fonction export excel dans la page rapport
  const tableRef = useRef(null);
  // conversion page en pdf rapport
  const rapportPersonnelPDFtRef = useRef();
  const rapportGroupePDFtRef = useRef();

  //
  //
  //
  //
  //
  //
  //
  //
  //

  // Pour définir un véhicule par défaut
  const chooseFirstVéhicule = () => {
    if (
      !currentVéhicule &&
      véhiculeNotActiveToday &&
      véhiculeNotActiveToday.length > 0
    ) {
      setCurrentVéhicule(véhiculeNotActiveToday[0]);
      setVéhiculeHistoriqueDetails(véhiculeNotActiveToday[0].véhiculeDetails);
    }
  };
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
  //
  x;

  const [tableSortCroissant, setTableSortCroissant] = useState(true);
  const [currentPersonelVéhicule, setCurrentPersonelVéhicule] = useState(null); // 1. Déclaration de currentVéhicule

  // Fonction pour calculer la distance entre deux points géographiques en kilomètres
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Conversion des degrés en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
  };

  // Fonction pour calculer la durée entre deux timestamps en secondes
  const calculateDuration = (timestamp1, timestamp2) => {
    return Math.abs(parseInt(timestamp2) - parseInt(timestamp1)); // Différence absolue en secondes
  };

  // Fonction pour convertir une durée en secondes au format heure, minute et seconde
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const processVehicleData2 = (currentData) => {
    return currentData?.map((item) => {
      const véhiculeDetails = item.véhiculeDetails;

      // Trouver le premier et le dernier index où speedKPH > 0
      const firstValidIndex = véhiculeDetails.findIndex(
        (detail) => parseFloat(detail.speedKPH) > 0
      );

      const lastValidIndex =
        véhiculeDetails.length -
        1 -
        véhiculeDetails
          .slice()
          .reverse()
          .findIndex((detail) => parseFloat(detail.speedKPH) > 0) +
        1;

      if (
        firstValidIndex === -1 ||
        lastValidIndex === -1 ||
        firstValidIndex > lastValidIndex
      ) {
        return {
          ...item,
          véhiculeDetails: [],
          totalDistance: 0, // Aucune distance calculée si aucun détail valide
          totalDuration: "0h 0m 0s", // Aucune durée calculée si aucun détail valide
          totalPauseDuration: "0h 0m 0s", // Aucune durée de pause calculée
          totalMovingDuration: "0h 0m 0s", // Aucune durée en mouvement calculée
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0, // Nombre d'arrêts
          totalStopDuration: "0h 0m 0s", // Durée totale des arrêts
        };
      }

      const filteredVehiculeDetails = véhiculeDetails.slice(
        firstValidIndex,
        lastValidIndex + 1
      );

      // Calculer la distance totale parcourue, la durée totale, la durée de pause et la durée en mouvement
      let totalDistance = 0;
      let totalDuration = 0;
      let totalPauseDuration = 0;
      let totalMovingDuration = 0;
      let stopCount = 0;
      let totalStopDuration = 0;

      let speeds = [];
      let stopStartIndex = null;

      for (let i = 1; i < filteredVehiculeDetails.length; i++) {
        const lat1 = parseFloat(filteredVehiculeDetails[i - 1].latitude);
        const lon1 = parseFloat(filteredVehiculeDetails[i - 1].longitude);
        const lat2 = parseFloat(filteredVehiculeDetails[i].latitude);
        const lon2 = parseFloat(filteredVehiculeDetails[i].longitude);
        const time1 = filteredVehiculeDetails[i - 1].timestamp;
        const time2 = filteredVehiculeDetails[i].timestamp;
        const speed1 = parseFloat(filteredVehiculeDetails[i - 1].speedKPH);

        speeds.push(speed1);
        totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
        totalDuration += calculateDuration(time1, time2);

        if (speed1 <= 0) {
          if (stopStartIndex === null) {
            stopStartIndex = i - 1;
          }
        } else {
          if (stopStartIndex !== null) {
            const stopEndIndex = i;
            const stopDuration = calculateDuration(
              filteredVehiculeDetails[stopStartIndex].timestamp,
              filteredVehiculeDetails[
                Math.min(stopEndIndex, filteredVehiculeDetails.length - 1)
              ].timestamp
            );
            totalStopDuration += stopDuration;
            stopCount++;
            stopStartIndex = null;
          }
        }

        if (speed1 <= 0) {
          totalPauseDuration += calculateDuration(time1, time2);
        } else {
          totalMovingDuration += calculateDuration(time1, time2);
        }
      }

      if (stopStartIndex !== null) {
        const stopDuration = calculateDuration(
          filteredVehiculeDetails[stopStartIndex].timestamp,
          filteredVehiculeDetails[filteredVehiculeDetails.length - 1].timestamp
        );
        totalStopDuration += stopDuration;
        stopCount++;
      }

      const minSpeed =
        speeds.length > 0
          ? Math.min(...speeds.filter((speed) => speed > 0)) || 0
          : 0;
      const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
      const avgSpeed =
        speeds.length > 0
          ? (
              speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
            ).toFixed(0)
          : 0;

      if (speeds.length === 0) {
        // Si aucune vitesse n'est valide
        return {
          ...item,
          véhiculeDetails: [],
          totalDistance: 0,
          totalDuration: "0h 0m 0s",
          totalPauseDuration: "0h 0m 0s",
          totalMovingDuration: "0h 0m 0s",
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0,
          totalStopDuration: "0h 0m 0s",
        };
      }

      return {
        ...item,
        véhiculeDetails: filteredVehiculeDetails,
        totalDistance: totalDistance, // Ajouter la distance parcourue
        totalDuration: formatDuration(totalDuration), // Ajouter la durée totale formatée
        totalPauseDuration: formatDuration(totalPauseDuration), // Ajouter la durée totale des pauses formatée
        totalMovingDuration: formatDuration(totalMovingDuration), // Ajouter la durée totale en mouvement formatée
        minSpeed: minSpeed || 0,
        maxSpeed: maxSpeed || 0,
        avgSpeed: avgSpeed || 0,
        stopCount: stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: formatDuration(totalStopDuration), // Ajouter la durée totale des arrêts
      };
    });
  };

  const processVehicleData = (currentData) => {
    return currentData?.map((item) => {
      const véhiculeDetails = item.véhiculeDetails;

      const firstValidIndex = véhiculeDetails.findIndex(
        (detail) => parseFloat(detail.speedKPH) > 0
      );
      const lastValidIndex =
        véhiculeDetails.length -
        1 -
        véhiculeDetails
          .slice()
          .reverse()
          .findIndex((detail) => parseFloat(detail.speedKPH) > 0);

      if (
        firstValidIndex === -1 ||
        lastValidIndex === -1 ||
        firstValidIndex > lastValidIndex
      ) {
        return {
          ...item,
          véhiculeDetails: [],
          totalDistance: 0,
          totalDuration: "0h 0m 0s",
          totalPauseDuration: "0h 0m 0s",
          totalMovingDuration: "0h 0m 0s",
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0,
          stopsPositions: [],
          longestStopObject: null,
          totalStopDuration: "0h 0m 0s",
        };
      }

      const filteredVehiculeDetails = véhiculeDetails.slice(
        firstValidIndex,
        lastValidIndex + 1
      );

      let totalDistance = 0;
      let totalDuration = 0;
      let totalPauseDuration = 0;
      let totalMovingDuration = 0;
      let stopCount = 0;
      let totalStopDuration = 0;
      let longestStop = 0;
      let longestStopObject = null;
      let currentStop = 0;
      let currentStopStartIndex = null;
      let speeds = [];
      let stopsPositions = [];

      for (let i = 1; i < filteredVehiculeDetails.length; i++) {
        const prev = filteredVehiculeDetails[i - 1];
        const curr = filteredVehiculeDetails[i];

        const lat1 = parseFloat(prev.latitude);
        const lon1 = parseFloat(prev.longitude);
        const lat2 = parseFloat(curr.latitude);
        const lon2 = parseFloat(curr.longitude);

        const time1 = prev.timestamp;
        const time2 = curr.timestamp;

        const speed1 = parseFloat(prev.speedKPH);

        totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
        const delta = calculateDuration(time1, time2);
        totalDuration += delta;

        speeds.push(speed1);

        if (speed1 > 0) {
          totalMovingDuration += delta;
          if (currentStop > longestStop) {
            longestStop = currentStop;
            longestStopObject = filteredVehiculeDetails[currentStopStartIndex];
          }
          currentStop = 0;
          currentStopStartIndex = null;
        } else {
          totalPauseDuration += delta;
          if (currentStopStartIndex === null) currentStopStartIndex = i - 1;
          currentStop += delta;
        }

        if (speed1 > 0 && parseFloat(curr.speedKPH) <= 0) {
          stopCount++;
          stopsPositions.push(filteredVehiculeDetails[i]);
        }
      }

      // Dernier arrêt en cours ?
      if (currentStop > 0) {
        totalStopDuration += currentStop;
        if (currentStop > longestStop) {
          longestStop = currentStop;
          longestStopObject = filteredVehiculeDetails[currentStopStartIndex];
        }
        stopCount++;
        stopsPositions.push(
          filteredVehiculeDetails[filteredVehiculeDetails.length - 1]
        );
      }

      totalStopDuration = totalPauseDuration;

      speeds = speeds.filter((s) => s > 0);

      if (speeds.length === 0) {
        return {
          ...item,
          véhiculeDetails: [],
          totalDistance: 0,
          totalDuration: "0h 0m 0s",
          totalPauseDuration: "0h 0m 0s",
          totalMovingDuration: "0h 0m 0s",
          minSpeed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          stopCount: 0,
          stopsPositions: [],
          longestStopObject: null,
          totalStopDuration: "0h 0m 0s",
        };
      }

      const minSpeed = Math.min(...speeds);
      const maxSpeed = Math.max(...speeds);
      const avgSpeed = (
        speeds.reduce((a, b) => a + b, 0) / speeds.length
      ).toFixed(0);

      return {
        ...item,
        véhiculeDetails: filteredVehiculeDetails,
        totalDistance,
        totalDuration: formatDuration(totalDuration),
        totalPauseDuration: formatDuration(totalPauseDuration),
        totalMovingDuration: formatDuration(totalMovingDuration),
        minSpeed,
        maxSpeed,
        avgSpeed,
        stopCount,
        stopsPositions,
        longestStopObject,
        totalStopDuration: formatDuration(totalStopDuration),
      };
    });
  };

  const sortVehiclesBySpeed = (filteredData) => {
    return filteredData
      ?.map((item) => {
        const lastDetail =
          item.véhiculeDetails[item.véhiculeDetails.length - 1];
        return {
          description: item.description,
          deviceID: item.deviceID,
          lastSpeedKPH: lastDetail ? parseFloat(lastDetail.speedKPH) : 0,
          totalDistance: item.totalDistance, // Inclure la distance parcourue
          totalDuration: item.totalDuration, // Inclure la durée totale
          totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
          totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
          minSpeed: item.minSpeed || 0,
          maxSpeed: item.maxSpeed || 0,
          avgSpeed: item.avgSpeed || 0,
          stopCount: item.stopCount, // Ajouter le nombre d'arrêts
          totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
          véhiculeDetails: item.véhiculeDetails,
        };
      })
      .sort((a, b) =>
        tableSortCroissant ? b.maxSpeed - a.maxSpeed : a.maxSpeed - b.maxSpeed
      );
  };

  const sortVehiclesByDistance = (filteredData) => {
    return filteredData
      ?.map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        véhiculeDetails: item.véhiculeDetails,
      }))
      .sort((a, b) =>
        tableSortCroissant
          ? b.totalDistance - a.totalDistance
          : a.totalDistance - b.totalDistance
      );
  };

  const sortVehiclesByMovingDuration = (filteredData) => {
    return filteredData
      ?.map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        véhiculeDetails: item.véhiculeDetails,
      }))
      .sort((a, b) => {
        // Convertir les durées en secondes pour les comparer
        const [ah, am, as] = a.totalMovingDuration
          .split(/[hms]/)
          .filter(Boolean)
          .map(Number);
        const [bh, bm, bs] = b.totalMovingDuration
          .split(/[hms]/)
          .filter(Boolean)
          .map(Number);

        const totalA = ah * 3600 + am * 60 + as;
        const totalB = bh * 3600 + bm * 60 + bs;

        return tableSortCroissant ? totalB - totalA : totalA - totalB;
      });
  };

  const sortVehiclesByMaxSpeed = (filteredData) => {
    return filteredData
      ?.map((item) => ({
        description: item.description,
        deviceID: item.deviceID,
        totalDistance: item.totalDistance, // Inclure la distance parcourue
        totalDuration: item.totalDuration, // Inclure la durée totale
        totalPauseDuration: item.totalPauseDuration, // Inclure la durée totale des pauses
        totalMovingDuration: item.totalMovingDuration, // Inclure la durée totale en mouvement
        minSpeed: item.minSpeed || 0,
        maxSpeed: item.maxSpeed || 0,
        avgSpeed: item.avgSpeed || 0,
        stopCount: item.stopCount, // Ajouter le nombre d'arrêts
        totalStopDuration: item.totalStopDuration, // Ajouter la durée totale des arrêts
        véhiculeDetails: item.véhiculeDetails,
      }))
      .sort((a, b) =>
        tableSortCroissant ? b.maxSpeed - a.maxSpeed : a.maxSpeed - b.maxSpeed
      );
  };

  const sortVehiclesByFirstMovement = (filteredData) => {
    return filteredData
      ?.map((item) => {
        const véhiculeDetails = item.véhiculeDetails;

        // Trouver le dernier index où speedKPH > 0
        const lastValidIndex = véhiculeDetails.findLastIndex(
          (detail) => parseFloat(detail.speedKPH) > 0
        );

        // Si aucun mouvement n'est trouvé, retourner un timestamp par défaut très élevé
        const firstMovementTimestamp =
          lastValidIndex === -1
            ? Number.MAX_SAFE_INTEGER
            : véhiculeDetails[lastValidIndex].timestamp;

        return {
          ...item,
          firstMovementTimestamp, // Ajouter le timestamp du premier mouvement ou une valeur par défaut
          description: item.description,
          deviceID: item.deviceID,
          totalDistance: item.totalDistance,
          totalDuration: item.totalDuration,
          totalPauseDuration: item.totalPauseDuration,
          totalMovingDuration: item.totalMovingDuration,
          minSpeed: item.minSpeed || 0,
          maxSpeed: item.maxSpeed || 0,
          avgSpeed: item.avgSpeed || 0,
          stopCount: item.stopCount,
          totalStopDuration: item.totalStopDuration,
          véhiculeDetails: item.véhiculeDetails,
        };
      })
      .sort((a, b) => {
        // Trier par ordre croissant du timestamp, en mettant les véhicules sans mouvement à la fin
        return tableSortCroissant
          ? a.firstMovementTimestamp - b.firstMovementTimestamp
          : b.firstMovementTimestamp - a.firstMovementTimestamp;
      });
  };

  const filteredData = processVehicleData(
    currentDataFusionné && currentDataFusionné
  );

  let rapportPersonelleData = {};
  if (currentVéhicule) {
    rapportPersonelleData = processVehicleData([currentVéhicule])[0];
  }

  const vehiculeMouvementOrdered = sortVehiclesBySpeed(filteredData);

  // Filtrer par distance parcouru OKK... tester
  const vehiclesByDistance = sortVehiclesByDistance(filteredData);

  // Filter par temps en mouvement OKKK... tester
  const vehiclesByMovingDuration = sortVehiclesByMovingDuration(filteredData);

  // Filtrer par vitesse maximale OKKK... tester
  const vehiclesByMaxSpeed = sortVehiclesByMaxSpeed(filteredData);

  // Appliquer le filtre par heure de départ
  const vehiclesByDepartureTime = sortVehiclesByFirstMovement(filteredData);
  //
  //
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // Défilement fluide
      // behavior: "smooth", // Défilement fluide
    });
  };

  //

  // Stocke la page actuelle et précédente à chaque changement de route
  // Ajoute la page actuelle dans l'historique, sauf si on vient d'un retour
  useEffect(() => {
    const isGoingBack = sessionStorage.getItem("isGoingBack");

    if (isGoingBack === "true") {
      // On vient de cliquer sur "Retour", on ne stocke pas cette page
      sessionStorage.setItem("isGoingBack", "false");
      return;
    }

    const currentPath = location.pathname;

    if (currentPath !== "/login" && currentPath !== "/") {
      const storedHistory =
        JSON.parse(localStorage.getItem("customHistory")) || [];
      const lastPath = storedHistory[storedHistory.length - 1];

      if (currentPath !== lastPath) {
        const updatedHistory = [...storedHistory, currentPath];
        localStorage.setItem("customHistory", JSON.stringify(updatedHistory));
      }
    }
  }, [location]);

  const backToPagePrecedent = () => {
    const storedHistory =
      JSON.parse(localStorage.getItem("customHistory")) || [];
    if (storedHistory.length > 1) {
      storedHistory.pop(); // Retire la page actuelle
      const lastPath = storedHistory[storedHistory.length - 1];
      // Mets à jour les données AVANT de rediriger
      localStorage.setItem("customHistory", JSON.stringify(storedHistory));
      sessionStorage.setItem("isGoingBack", "true");
      setDocumentationPage(lastPath.replace(/^\//, ""));

      // Petite astuce : on force une redirection propre
      setTimeout(() => {
        navigate(lastPath);
      }, 0); // pour que sessionStorage soit bien pris en compte avant le render
    } else {
      navigate("/home");
    }
  };

  const statusDescriptions = {
    0x0000: `${t("Code de statut non spécifié")}`,

    0xfd10: `${t("Low Battery")}`,
    0xf112: `${t("In motion")}`,
    0xf403: `${t("Ignition OFF")}`,
    0xf841: `${t("Panic")}`,
    0xf401: `${t("Ignition ON")}`,
    0xf020: `${t("Localisation")}`,
    0xf210: `${t("Arrived at Geozone")}`,
    0xf230: `${t("Departed at Geozone")}`,
  };

  const [isUserNotInteractingNow, setIsUserNotInteractingNow] = useState(true);
  const [timeSinceLastInteraction, setTimeSinceLastInteraction] = useState(0);
  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes en millisecondes pour tester

  const resetInteraction = (
    account,
    username,
    password,
    fromLoginFronction = false
  ) => {
    localStorage.setItem("lastInteraction", new Date().toISOString());
    setIsUserNotInteractingNow(false);
    setTimeSinceLastInteraction(0);

    const lastLoginTime = Math.floor(Date.now() / 1000);

    const storedAccount = localStorage.getItem("account");
    const storedUserName = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (fromLoginFronction) return;
    if (
      account ||
      (storedAccount && username) ||
      (storedUserName && password) ||
      (storedPassword && lastLoginTime)
    ) {
      UpdateUserConnexion(
        account || storedAccount,
        username || storedUserName,
        password || storedPassword,
        lastLoginTime
      );
    }

    if (window.location.hostname !== "localhost") {
      // Exécuter la fonction seulement si ce n'est pas localhost
      sendGMailConfirmation(
        account,
        username || storedUserName,
        localStorage.getItem("currentCountry")
      );
    }
  };

  useEffect(() => {
    const updateLastInteraction = () => {
      if (!isUserNotInteractingNow) {
        localStorage.setItem("lastInteraction", new Date().toISOString());
      }
    };

    const checkInactivity = () => {
      const lastInteraction = localStorage.getItem("lastInteraction");
      if (lastInteraction) {
        const lastInteractionTime = new Date(lastInteraction).getTime();
        const currentTime = new Date().getTime();
        const elapsed = currentTime - lastInteractionTime;
        setTimeSinceLastInteraction(elapsed);
        if (elapsed > INACTIVITY_LIMIT) {
          setIsUserNotInteractingNow(true);
        } else {
          setIsUserNotInteractingNow(false);
        }
      }
    };

    const handleInteraction = () => {
      updateLastInteraction();
      checkInactivity();
    };

    const events = ["mousemove", "click", "keydown"];
    events?.forEach((event) => {
      window.addEventListener(event, handleInteraction);
    });

    const interval = setInterval(checkInactivity, 1000);

    checkInactivity();

    return () => {
      events?.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
      clearInterval(interval);
    };
  }, [isUserNotInteractingNow]);

  function clearCacheFonction() {
    if ("caches" in window) {
      caches.keys().then(function (names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      clearCacheFonction();
      enforceCacheLimit(); // pour 30 MB
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []); // Pas de dépendances, exécution régulière

  async function enforceCacheLimit(maxSizeMB = 50) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      let totalSize = 0;
      const entries = [];

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cloned = response.clone();
          const body = await cloned.arrayBuffer();
          const size = body.byteLength;
          totalSize += size;
          entries.push({ request, size, response });
        }
      }

      // Supprime les plus anciens si on dépasse la limite
      if (totalSize > maxSizeBytes) {
        entries.sort((a, b) => a.size - b.size); // supprime petits d’abord
        while (totalSize > maxSizeBytes && entries.length > 0) {
          const entry = entries.shift();
          await cache.delete(entry.request);
          totalSize -= entry.size;
        }
      }
    }
  }

  useEffect(() => {
    enforceCacheLimit(); // pour 30 MB
  }, []);

  useEffect(() => {
    setDashboardLoadingEffect(true);

    const timeout = setTimeout(() => {
      setDashboardLoadingEffect(false);
    }, 3000);

    return () => clearTimeout(timeout); // Nettoie l'ancien timeout
  }, [
    comptes,
    accountDevices,
    accountGeofences,
    accountGroupes,
    accountUsers,
    accountRules,
    accountRulesActive,
    groupeDevices,
    userGroupes,
    véhiculeDetails,
    gestionAccountData,
    mergedDataHome,
    geofenceData,
    véhiculeHistoriqueDetails,
    rapportVehicleDetails,
  ]);

  const sendGMailConfirmation = (accountConnected, user, country2) => {
    // Obtenir la date et l'heure actuelles
    const now = new Date();
    const dateAujourdhui = now.toLocaleDateString("fr-FR"); // Format: JJ/MM/AAAA
    const hereActurel = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: HH:MM AM/PM
    //
    // let emails;
    // if (country === "rd") {
    //   emails = ["Info@octagonogps.com.do", "support@octagonoplus.com"];
    // } else {
    //   emails = ["webdeveloper3030@gmail.com", "support@octagonoplus.com"];
    // }

    const host = window.location.hostname.replace(/^www\./, "");
    let emails;
    let country;

    if (host === "octagonogps.com.do" || host === "app.octagonogps.com.do") {
      emails = ["Info@octagonogps.com.do", "support@octagonoplus.com"];
      country = "rd";
    } else if (host === "octagonoplus.com") {
      emails = ["webdeveloper3030@gmail.com", "support@octagonoplus.com"];
      country = "ht";
    } else {
      emails = ["webdeveloper3030@gmail.com", "support@octagonoplus.com"];
      country = "ht";
    }

    if (host === "octagonoplus.com" && country === "rd") {
      emails = ["webdeveloper3030@gmail.com", "support@octagonoplus.com"];
    }

    const emailText = `
Client : ${accountConnected}  \n
Utilisateur : ${user}  \n
Date : ${dateAujourdhui} ___ ${hereActurel}  \n
Plateforme : ${country === "ht" ? "Haiti" : "Republique dominicaine"}  \n
   `;

    //  text: `Le client ${user}\n     du compte ${accountConnected}\n     s'est connecté le ${dateAujourdhui}\n     à ${hereActurel}\n     en ${
    //           country === "ht" ? "Haiti" : "Republique dominicaine"
    //         }`,
    fetch("https://octagono-plus-email-server.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: emails,
        subject: `Connexion réussie de ${accountConnected}  /  ${user}  /  ${
          country === "ht" ? "Haiti" : "Republique dominicaine"
        }`,
        text: emailText,

        // text: "Bonjour depuis React !",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));

    const message = `Le client ${user}\n du compte ${accountConnected}\n s'est connecté le ${dateAujourdhui}\n à ${hereActurel}\n en ${
      country === "ht" ? "Haiti" : "Republique dominicaine"
    }`;
  };

  useEffect(() => {
    document.documentElement.style.overflow =
      documentationPage === "Localisation_devices" ||
      documentationPage === "Trajet_appareil"
        ? "hidden"
        : "auto";
  }, [documentationPage]);

  //
  //
  //
  const CHECK_INTERVAL = 5 * 1000; // 5 sec
  const updaterInterval = 30 * 60 * 1000;
  const [timeBeforAUtoUpdate, setTimeBeforAUtoUpdate] =
    useState(updaterInterval); // ms
  const [timeLeftBeforeAutoUpdate, setTimeLeftBeforeAutoUpdate] = useState(0);
  const lastExecutionRef = useRef(Date.now()); // <-- stockage persistant

  // const [updateAutoSetting, setUpdateAutoSetting] = useState(false);
  const [updateAutoSetting, setUpdateAutoSetting] = useState(() => {
    // Charger depuis localStorage au démarrage
    const saved = localStorage.getItem("updateAutoSetting");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Sauvegarder automatiquement à chaque changement
    localStorage.setItem(
      "updateAutoSetting",
      JSON.stringify(updateAutoSetting)
    );
  }, [updateAutoSetting]);

  const [isClique, setIsClique] = useState(false);
  useEffect(() => {
    if (!isClique) return;
    setTimeout(() => {
      setIsClique(false);
    }, 10000);
  }, [isClique]);

  const testClique = () => {
    if (isClique) return;
    setIsClique(true);
  };
  // mafonction
  // ma fonction
  const autoUpdateFonction = () => {
    if (isClique) return;
    setIsClique(true);

    ////////////////////////////////////////
    setDashboardLoadingEffect(true);
    resetTimerForAutoUpdate();
    const accountUser = account || localStorage.getItem("account") || "";
    const usernameUser = username || localStorage.getItem("username") || "";
    const passwordUser = password || localStorage.getItem("password") || "";

    const admin_Account =
      adminAccount || localStorage.getItem("adminAccount") || "";
    const admin_Username =
      adminUsername || localStorage.getItem("adminUsername") || "";
    const admin_Password =
      adminPassword || localStorage.getItem("adminPassword") || "";

    if (isDashboardHomePage) {
      fetchAllComptes(admin_Account, admin_Username, admin_Password);
    } else {
      homePageReload(accountUser, usernameUser, passwordUser);
    }
    lastExecutionRef.current = Date.now();
    localStorage.setItem("lastExecution", lastExecutionRef.current);
  };

  const updateItUserDataFonction = () => {
    if (isClique) return;
    setIsClique(true);
    setProgressAnimationStart(0);
    setRunningAnimationProgressLoading(true);
    setProgress(2);
    processAllComptes(comptes, 10, true);
  };

  useEffect(() => {
    if (!updateAutoSetting) {
      resetTimerForAutoUpdate();
      return;
    }
    let storedLastExecution = parseInt(
      localStorage.getItem("lastExecution") || "0",
      10
    );
    const now = Date.now();

    // Première exécution au montage (uniquement si actif et délai écoulé)
    if (!isUserNotInteractingNow && isAuthenticated) {
      if (
        !storedLastExecution ||
        now - storedLastExecution >= timeBeforAUtoUpdate
      ) {
        autoUpdateFonction();
        storedLastExecution = Date.now();
        localStorage.setItem("lastExecution", storedLastExecution);
      }
    }

    lastExecutionRef.current = storedLastExecution;

    const updateCountdown = () => {
      const remaining =
        timeBeforAUtoUpdate - (Date.now() - lastExecutionRef.current);
      setTimeLeftBeforeAutoUpdate(Math.max(0, Math.floor(remaining / 1000)));
    };

    updateCountdown();

    // Timer affichage compte à rebours
    const countdownId = setInterval(updateCountdown, 1000);

    // Timer vérification exécution
    const checkId = setInterval(() => {
      if (Date.now() - lastExecutionRef.current >= timeBeforAUtoUpdate) {
        if (!isUserNotInteractingNow && isAuthenticated) {
          autoUpdateFonction();
          lastExecutionRef.current = Date.now();
          localStorage.setItem("lastExecution", lastExecutionRef.current);
        }
      }
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(checkId);
      clearInterval(countdownId);
    };
  }, [
    timeBeforAUtoUpdate,
    isUserNotInteractingNow,
    isAuthenticated,
    updateAutoSetting,
  ]);

  const resetTimerForAutoUpdate = (time) => {
    const newInterval = time || updaterInterval;
    lastExecutionRef.current = Date.now();
    localStorage.setItem("lastExecution", lastExecutionRef.current);
    setTimeBeforAUtoUpdate(newInterval);
    setTimeLeftBeforeAutoUpdate(Math.floor(newInterval / 1000));
  };
  // backToPagePrecedent
  return (
    <DataContext.Provider
      value={{
        countRequête,
        scrollToTop,
        fonctionTest,
        fonctionTest2,
        userData,
        véhiculeData,
        vehicleDetails,
        mergedDataHome,
        isAuthenticated,
        error,
        isHomePageLoading,
        handleLogin,
        handleLogout,
        currentVéhicule,
        handleDateChange,
        loadingHistoriqueFilter,
        setLoadingHistoriqueFilter,
        searchQueryForHeader,
        setSearchQueryForHeader,
        search,
        setSearch,
        showSideBar,
        setShowSideBar,
        logOutPopup,
        setLogOutPopup,
        showListeOption,
        setShowListOption,
        fetchVehicleDetails,
        rapportPersonelleData,
        fetchHistoriqueVehicleDetails,
        véhiculeHistoriqueDetails,
        setCurrentVéhicule,
        account,
        currentCountry,
        setCurrentCountry,
        username,
        password,
        adminAccount,
        adminUsername,
        adminPassword,
        isPasswordConfirmed,
        setIsPasswordConfirmed,
        showChangePasswordPopup,
        setShowChangePasswordPopup,
        selectedVehicleToShowInMap,
        setSelectedVehicleToShowInMap,
        createVehicle,
        deleteVehicle,
        updateVehicle,
        setError,
        createVéhiculeLoading,
        setCreateVéhiculeLoading,

        //
        rapportVehicleDetails,
        fetchRapportVehicleDetails,
        setRapportDataLoading,
        rapportDataLoading,
        donneeFusionnéForRapport,
        setDonneeFusionnéForRapport,
        véhiculeActiveToday,
        setVéhiculeActiveToday,
        véhiculeNotActiveToday,
        setVéhiculeNotActiveToday,
        véhiculeEnMouvementMaintenant,
        setVéhiculeEnMouvementMaintenant,
        véhiculeHorsService,
        setVéhiculeHorsService,
        handleTabClick,
        tab,
        envoyerSMS,
        smsError,
        setSmsError,
        showHistoriqueInMap,
        setShowHistoriqueInMap,
        setVéhiculeHistoriqueDetails,
        fetchSearchRapportVehicleDetails,
        searchDonneeFusionnéForRapport,
        setSearchDonneeFusionnéForRapport,

        timeZoneData,
        setTimeZoneData,
        timeZoneSearchQuery,
        setTimeZoneSearchQuery,
        selectedTimeZone,
        setSelectedTimeZone,
        selectUTC,
        setSelectUTC,
        selectTime,
        setSelectTime,
        handleSelectTimeZone,

        currentDataFusionné,
        // callError,
        // setCallError,
        lancerAppel,
        setIsHomePageLoading,
        setUsername,
        statisticFilterInHomePage,
        setStatisticFilterInHomePage,
        statisticFilterTextInHomePage,
        setStatisticFilterTextInHomePage,

        /////////////////////////////////////////
        FormatDateHeure,

        historiqueSelectedLocationIndex,
        setHistoriqueSelectedLocationIndex,
        homePageReload,

        GeofenceDataFonction,
        geofenceData,
        resetIndexedDB,
        createNewGeofence,
        ModifierGeofence,
        ajouterGeofencePopup,
        setAjouterGeofencePopup,
        createGeofenceLoading,
        setCreateGeofenceLoading,
        // errorCreateGeofencePopup,

        // succesCreateGeofencePopup,
        // setSuccesCreateGeofencePopup,
        currentGeozone,
        setCurrentGeozone,
        isEditingGeofence,
        setIsEditingGeofence,
        supprimerGeofence,
        activerOuDesactiverGeofence,

        vehiculeMouvementOrdered,
        vehiclesByDistance,
        vehiclesByMovingDuration,
        vehiclesByMaxSpeed,
        vehiclesByDepartureTime,
        tableSortCroissant,
        setTableSortCroissant,
        currentPersonelVéhicule,
        setCurrentPersonelVéhicule,
        chooseFirstVéhicule,
        readDocumentation,
        setReadDocumentation,

        documentationPage,
        setDocumentationPage,

        updateAuto,
        setupdateAuto,
        estLancerUpdateAuto,
        setEstLancerUpdateAuto,
        fetchVehicleData,

        showAccountOptionsPopup,
        setShowAccountOptionsPopup,

        getAllAccountsData,
        gestionAccountData,
        currentAccountSelected,
        setCurrentAccountSelected,
        currentSelectedUserToConnect,
        setCurrentSelectedUserToConnect,
        getAllAccountsDataLoading,
        setGetAllAccountsDataLoading,
        showSelectedUserOptionsPopup,
        setShowSelectedUserOptionsPopup,
        listeGestionDesVehicules,
        setListeGestionDesVehicules,
        backToPagePrecedent,
        fetchAllComptes,
        createVehicleEnGestionAccount,
        deleteVehicleEnGestionAccount,
        currentSelectedDeviceGestion,
        setCurrentSelectedDeviceGestion,
        deviceListeTitleGestion,
        setDeviceListeTitleGestion,
        userDevices,
        currentSelectedGroupeGestion,
        setCurrentSelectedGroupeGestion,
        fetchAccountGroupes,
        fetchGroupeDevices,
        groupeDevices,
        fetchUserDevices,
        fetchAccountUsers,
        createNewGroupeEnGestionAccount,
        modifyGroupeEnGestionAccount,
        deleteGroupeEnGestionAccount,
        listeGestionDesGroupe,
        setListeGestionDesGroupe,
        listeGestionDesGroupeTitre,
        setListeGestionDesGroupeTitre,
        listeGestionDesUsers,
        setListeGestionDesUsers,
        createNewUserEnGestionAccount,
        ModifyUserEnGestionAccountFonction,
        deleteUSerEnGestionAccount,
        comptes,
        accountDevices,
        accountGroupes,
        accountUsers,
        accountRules,
        accountRulesActive,
        listeGestionDesRulesActive,
        setListeGestionDesRulesActive,
        createAccountEnGestionAccountFonction,
        modifyAccountEnGestionAccountFonction,
        deleteAccountEnGestionAccountFonction,
        fetchAccountDevices,
        fetchUserGroupes,
        dashboardLoadingEffect,
        setDashboardLoadingEffect,

        showConfirmationMessagePopup,
        setShowConfirmationMessagePopup,
        confirmationMessagePopupTexte,
        setConfirmationMessagePopupTexte,
        confirmationMessagePopupName,
        setConfirmationMessagePopupName,
        modifyVehicleEnGestionAccount,
        userRole,
        fetchAccountGeofences,
        listeGestionDesGeofences,
        setListeGestionDesGeofences,
        accountGeofences,
        setAccountGeofences,
        isDashboardHomePage,
        setIsDashboardHomePage,
        clearDataIndexedbStore,
        showGeofenceInCarte,
        setShowGeofenceInCarte,
        chooseOtherLanguagePopup,
        setChooseOtherLanguagePopup,
        véhiculeDetails,
        setVehiculeDetails,
        adminUserData,
        dashboardLoadingEffectLogin,
        setDashboardLoadingEffectLogin,
        loadForManySecond,
        progressBarForLoadingData,
        progressBarForLoadingDataUser,
        statusDescriptions,
        TimeFrom,
        TimeTo,
        progressAnimationStart,
        setProgressAnimationStart,
        runningAnimationProgressLoading,
        setRunningAnimationProgressLoading,
        runningAnimationProgressDuration,
        setRunningAnimationProgressDuration,
        setMergedDataHome,
        setGeofenceData,
        fetchVehicleDataFromRapportGroupe,
        setRapportVehicleDetails,
        isSearchingFromRapportGroupePage,
        setIsSearchingFromRapportGroupePage,
        showAnnimationProgresseBarDashboard,
        setShowAnnimationProgresseBarDashboard,
        homePageReloadWidthNoAnimation,
        resetInteraction,
        isUserNotInteractingNow,
        versionApplication,
        clearCacheFonction,
        setAccountDevices,
        appareilPourAfficherSurCarte,
        geofencePourAfficherSurCarte,
        updateAppareilsEtGeofencesPourCarte,
        DeviceDéplacer,
        EnDéplacement,
        DeviceNonDeplacer,
        DeviceInactifs,
        DeviceListeActif,
        allDevices,
        setAllDevices,
        filteredColorCategorieListe,
        setFilteredColorCategorieListe,
        addVehiculeDetailsFonction,
        selectedVehicleHistoriqueToShowInMap,
        setSelectedVehicleHistoriqueToShowInMap,
        ListeDesAlertes,
        testAlertListe,
        setProgressDataUser,
        sendGMailConfirmation,
        listeGestionDesRules,
        setListeGestionDesRules,
        createNewRuleEnGestionAccount,
        fetchAccountRules,
        fetchRulesEnGestionAccount,
        ModifyRuleEnGestionAccount,
        DeleteRoleEnGestionAccount,
        fetchAccountRulesActive,
        assignRulesToDeviceOrGroupe,
        ModifierassignRulesToDeviceOrGroupe,
        DeleteRoleActiveEnGestionAccount,
        chooseAccountID,
        setChooseAccountID,
        fromSelectOnPositionValue,
        setFromSelectOnPositionValue,
        timeLeftBeforeAutoUpdate,
        setTimeLeftBeforeAutoUpdate,
        resetTimerForAutoUpdate,
        autoUpdateFonction,
        updateAutoSetting,
        setUpdateAutoSetting,
        DeviceEnStationnement,
        DeviceInactifsWidthDetails,
        DeviceInactifsWidthNoDetails,
        isFilteredCartePositionByCategorie,
        setIsFilteredCartePositionByCategorie,
        showPageRaccourciComponent,
        setShowPageRaccourciComponent,
        isItUser,
        updateItUserDataFonction,
        isCreatingNewElement,
        setIsCreatingNewElement,
        chooseOneAccountToContinue,
        setChooseOneAccountToContinue,
        chooseOtherAccountGestion,
        setChooseOtherAccountGestion,
        moveDeviceToOtherCompte,
        setMoveDeviceToOtherCompte,
        showChooseItemToModifyMessage,
        setshowChooseItemToModifyMessage,
        showChooseItemToModifyPage,
        setshowChooseItemToModifyPage,
        // updateAccountDevicesWidthvéhiculeDetailsFonction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

// cd /var/octagono_folder/octagono-plus

// git pull origin main
// npm run build
// sudo systemctl restart nginx
