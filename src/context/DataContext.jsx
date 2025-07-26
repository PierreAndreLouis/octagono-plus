// DataContextProvider.js
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

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  let versionApplication = "26/07/2025 _ 1";
  let x;
  const navigate = useNavigate();
  const [t, i18n] = useTranslation();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes

  const currentTimeSec = getCurrentTimestamp();
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const getCurrentTimestampMs = () => Date.now(); // Temps actuel en millisecondes

  const tenMinutesInMs = 10 * 60 * 1000; // 30 minutes en millisecondes
  const currentTimeMs = getCurrentTimestampMs(); // Temps actuel
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

  const [documentationPage, setDocumentationPage] = useState("Dashboard");

  const [progressAnimationStart, setProgressAnimationStart] = useState(0);
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
    // console.log("estLancerUpdateAuto ", estLancerUpdateAuto);
    if (estLancerUpdateAuto) {
      setTimeout(() => {
        setEstLancerUpdateAuto(false);
      }, 3000);
    }
  }, [estLancerUpdateAuto]);

  useEffect(() => {
    console.log("updateAuto", updateAuto);
  }, [updateAuto]);

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
  // const [documentationPage, setDocumentationPage] = useState("connecter");
  const seConnecterRef = useRef();
  const docAddVehiculeRef = useRef();
  const docModifierVehiculeRef = useRef();
  const docLocalisationVehiculeRef = useRef();

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

  useEffect(() => {
    console.log("🟢 currentAccountSelected CHANGÉ :", currentAccountSelected);
  }, [currentAccountSelected]);

  useEffect(() => {
    console.log(
      "🔵 currentSelectedUserToConnect CHANGÉ :",
      currentSelectedUserToConnect
    );
  }, [currentSelectedUserToConnect]);

  useEffect(() => {
    console.log(
      "🟣 listeGestionDesVehicules CHANGÉ :",
      listeGestionDesVehicules
    );
  }, [listeGestionDesVehicules]);

  // Effet principal : met à jour currentAccountSelected quand les données changent
  useEffect(() => {
    if (!currentAccountSelected) return;

    const compteMisAJour = gestionAccountData?.find(
      (compte) => compte?.accountID === currentAccountSelected?.accountID
    );

    if (compteMisAJour) {
      console.log(
        "📥 Mise à jour de currentAccountSelected avec :",
        compteMisAJour
      );
      setCurrentAccountSelected(compteMisAJour);
      setListeGestionDesUsers(compteMisAJour?.accountUsers);
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
      console.log(
        "📥 Mise à jour de currentSelectedUserToConnect avec :",
        utilisateurActuel
      );
      setCurrentSelectedUserToConnect(utilisateurActuel);
    } else {
      console.warn("❌ Utilisateur non trouvé dans le compte sélectionné.");
    }
  }, [currentAccountSelected]);

  const [dashboardLoadingEffect, setDashboardLoadingEffect] = useState(false);
  const [dashboardLoadingEffectLogin, setDashboardLoadingEffectLogin] =
    useState(false);

  const loadForManySecond = () => {
    // setDashboardLoadingEffectLogin(true);
    // setTimeout(() => {
    //   setDashboardLoadingEffectLogin(false);
    // }, 60 * 1000);
  };

  // useEffect(() => {
  //   if (dashboardLoadingEffect) {
  //     setTimeout(() => {
  //       setDashboardLoadingEffect(false);
  //     }, 5000);
  //   }
  // }, [dashboardLoadingEffect]);

  useEffect(() => {
    if (currentAccountSelected) {
      setListeGestionDesGeofences(currentAccountSelected?.accountGeofences);
      setListeGestionDesVehicules(currentAccountSelected?.accountDevices);
      setListeGestionDesGroupe(currentAccountSelected?.accountGroupes);
      setListeGestionDesUsers(currentAccountSelected?.accountUsers);
    } else {
      setListeGestionDesVehicules(accountDevices);
      setListeGestionDesGeofences(accountGeofences);

      setListeGestionDesGroupe(accountGroupes);

      setListeGestionDesUsers(accountUsers);
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
    currentCountry === "rd" ||
    localStorage.getItem("currentCountry") === "rd"
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
    if (currentCountry) {
      localStorage.setItem("currentCountry", currentCountry);
    }
  }, [username, adminUsername, currentCountry]);

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
    console.log("xxxxxxxxxxxxxxxxxxxxxxx");
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

  useEffect(() => {
    const initialList = isDashboardHomePage
      ? currentAccountSelected?.accountDevices || accountDevices
      : mergedDataHome
      ? Object.values(mergedDataHome)
      : [];

    setAllDevices(initialList);
    setListeGestionDesVehicules(
      addVehiculeDetailsFonction(initialList, véhiculeDetails)
    );
  }, [
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    mergedDataHome,
  ]);

  const {
    DeviceDéplacer,
    EnDéplacement,
    DeviceEnStationnement,
    DeviceInactifs,
    DeviceListeActif,
  } = useMemo(() => {
    const d = {
      DeviceDéplacer: [],
      EnDéplacement: [],
      DeviceEnStationnement: [],
      DeviceInactifs: [],
      DeviceListeActif: [],
    };

    const idsÀExclure = new Set();

    addVehiculeDetailsFonction(allDevices, véhiculeDetails).forEach(
      (device) => {
        const lastUpdateTimeSec = device?.lastUpdateTime ?? 0;
        const lastStopTime = device?.lastStopTime ?? 0;

        if (lastStopTime > todayTimestamp) {
          d.DeviceDéplacer.push(device);
          idsÀExclure.add(device.deviceID);
        }

        const details = device?.véhiculeDetails?.[0];
        const hasDetails = device?.véhiculeDetails?.length > 0;
        const speed = details?.speedKPH ?? 0;
        const lastUpdateMs = details?.timestamp * 1000;
        const updatedRecently = currentTimeMs - lastUpdateMs <= tenMinutesInMs;
        const updatedToday = lastUpdateMs >= todayTimestamp;

        const isActive =
          currentTimeMs - device?.lastUpdateTime * 1000 < twentyFourHoursInSec;

        // device?.lastUpdateTime
        // ?
        // : false;

        if (
          // hasDetails &&
          // isActive &&
          speed >= 1 &&
          updatedRecently
          // &&
          // updatedToday
        ) {
          d.EnDéplacement.push(device);
          idsÀExclure.add(device.deviceID);
        }

        if (currentTimeSec - lastUpdateTimeSec < twentyFourHoursInSec) {
          d.DeviceListeActif.push(device);
        } else {
          d.DeviceInactifs.push(device);
        }
      }
    );

    // Maintenant, filtrer les appareils stationnés
    addVehiculeDetailsFonction(allDevices, véhiculeDetails).forEach(
      (device) => {
        const lastUpdateTimeSec = device?.lastUpdateTime ?? 0;
        if (
          currentTimeSec - lastUpdateTimeSec < twentyFourHoursInSec &&
          !idsÀExclure.has(device.deviceID)
        ) {
          d.DeviceEnStationnement.push(device);
        }
      }
    );

    return d;
  }, [allDevices, todayTimestamp]);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //   //

  // Ouvrir la base de données

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 10);

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
        data.forEach((item) => store.put(item));
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

  // Réinitialiser IndexedDB
  const resetIndexedDB = () => {
    indexedDB.deleteDatabase("MyDatabase");
    console.log("IndexedDB a été réinitialisé.");
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
          console.log("setMergedDataHome5555555555555");

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

  //
  //
  //
  //
  //
  //
  //
  //
  //
  // let alertListe = isDashboardHomePage ? véhiculeDetails : vehicleDetails;
  // vehicleDetails
  // return véhiculeDetailsListe.filter((item) => item?.statusCode !== "0xF952");
  //
  // const ListeDesAlertes = useMemo(() => {
  //   const sourceListe = véhiculeDetails

  //   const alerteFinale = sourceListe
  //     ?.flatMap(
  //       (obj) =>
  //         obj.alertListe?.map((detail) => ({
  //           deviceID: obj.deviceID,
  //           ...detail,
  //         })) ?? []
  //     )
  //     ?.filter((item) =>
  //       currentAccountSelected
  //         ? item?.accountID === currentAccountSelected?.accountID
  //         : true
  //     );

  //   return alerteFinale;
  // }, [
  //   isDashboardHomePage,
  //   currentAccountSelected,
  //   véhiculeDetails,
  //   vehicleDetails,
  // ]);

  const sourceListe = isDashboardHomePage ? véhiculeDetails : vehicleDetails;

  const ListeDesAlertes = sourceListe
    ?.flatMap(
      (obj) =>
        obj.véhiculeDetails?.map((detail) => ({
          deviceID: obj.deviceID,
          ...detail,
        })) ?? []
    )
    ?.filter((item) =>
      currentAccountSelected
        ? item?.accountID === currentAccountSelected?.accountID
        : true
    );

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
    account,
    username,
    password,
    country,
    sendConnectionMail = true
  ) => {
    console.log("version 01/07/2025 _ 1");
    console.log("++++++++++++++++ Requête effectué: handleLogin");
    console.log("Country: --------", country);
    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${account}" user="${username}" password="${password}" />
        <Record table="Account" partial="true">
          <Field name="accountID">${account}</Field>
          <Field name="userID">${username}</Field>
        </Record>
      </GTSRequest>`;

    console.log("xmlData ===>", xmlData);
    console.log(
      "xxxx------------------xxxx",
      account,
      username,
      password,
      country
    );

    if (country === "rd") {
      currentAPI = "/octagono-gps-api/track/Service";
    } else {
      currentAPI = "/octagono-plus-api/track/Service";
    }

    console.log("currentAPI", currentAPI);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Login data message: ", data);
      console.log("Requête envoyer :", xmlData);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

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

          localStorage.setItem("currentCountry", country);

          setAdminAccount(account);
          setAdminUsername(username);
          setAdminPassword(password);

          fetchAllComptes(account, username, password);
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
          localStorage.setItem("currentCountry", country);

          setAccount(account);
          setUsername(username);
          setPassword(password);

          GeofenceDataFonction(account, username, password);

          setTimeout(() => {
            console.log("aaaaaaaaaaaaaaaaaa");
            fetchVehicleData(account, username, password);
          }, 2000);
        }
        const fromLoginFronction = true;

        resetInteraction(account, username, password, fromLoginFronction);

        if (window.location.hostname !== "localhost" || sendConnectionMail) {
          sendGMailConfirmation(account, username, country);
        }
      } else if (result === "error") {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la connexion.");
        //
        console.log("errorMessage inactive", errorMessage);
        if (errorMessage === "User inactive") {
          console.log("Logout the user, and navigate to /login");
          handleLogout();
          navigate("/login");
        }
      }
    } catch (error) {
      setError("Erreur lors de la connexion à l'API .");
      console.log(
        "account, user, password, country",
        account,
        username,
        password,
        country
      );
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

    console.log("Requête envoyer :", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("message Retour message: ", data);
      if (!response.ok) {
        console.error("Réponse erreur serveur :", response.status, data);
        throw new Error(`Erreur serveur : ${response.status}`);
      }

      const parser = new DOMParser();

      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      console.log("result", result);

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
          console.log("Data", allUserData);
          setUserRole(allUserData);
          localStorage.setItem("userRole", JSON.stringify(allUserData));
        } catch (error) {
          if (error.name === "QuotaExceededError") {
            console.error("Quota dépassé pour userData.");
          } else {
            console.error("Erreur de stockage : ", error);
          }
        }

        console.log("Données JSON de tous les comptes : ", allUserData);
      } else if (result === "error") {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la recuperation des roles.");
        //
        console.log("errorMessage inactive", errorMessage);
        if (errorMessage === "User inactive") {
          console.log("Logout the user, and navigate to /login");
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
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const [getAllAccountsDataLoading, setGetAllAccountsDataLoading] =
    useState(false);

  const getAllAccountsData = "";

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  // paramètres d’authentification globaux (à adapter)
  const systemUser = "admin";

  // 1) Récupérer la liste des comptes et déclencher les autres fetchs

  const [progressBarForLoadingData, setProgress] = useState(0);

  // const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // const failedAccounts = [];

  // const processCompte = async (acct, isLastBatch = false) => {
  //   const id = acct?.accountID;
  //   const pwd = acct?.password;

  //   try {
  //     if (isLastBatch) {
  //       await fetchAccountDevices(id, pwd)
  //         .then((devices) => fetchVehiculeDetails(id, devices, pwd))
  //         .catch((err) => {
  //           console.error("Erreur device/details :", err);
  //           setError("Erreur lors de la mise à jour des VehiculeDetails.");
  //         });
  //     } else {
  //       // fetchAccountDevices(id, pwd);
  //       fetchAccountDevices(id, pwd)
  //         .then((devices) => fetchVehiculeDetails(id, devices, pwd))
  //         .catch((err) => {
  //           console.error("Erreur device/details :", err);
  //           setError("Erreur lors de la mise à jour des VehiculeDetails.");
  //         });
  //     }

  //     fetchAccountGroupes(id, pwd)
  //       .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
  //       .catch((err) => {
  //         console.error("Erreur groupes/devices :", err);
  //         setError("Erreur lors de la mise à jour des groupes.");
  //       });

  //     fetchAccountUsers(id, pwd)
  //       .then((users) => {
  //         fetchUserDevices(id, users);
  //         fetchUserGroupes(id, users);
  //       })
  //       .catch((err) => {
  //         console.error("Erreur utilisateurs/données :", err);
  //         setError("Erreur lors de la mise à jour des utilisateurs.");
  //       });

  //     fetchAccountGeofences(id, pwd);

  //   } catch (err) {
  //     console.error("Erreur pour le compte", id, ":", err);
  //     failedAccounts.push(id);
  //     setError(
  //       "Erreur sur un ou plusieurs comptes.",
  //       failedAccounts.join(", ")
  //     );
  //   }

  //   afficherComptesEchoues();
  // };

  // // Après traitement de tous les comptes
  // const afficherComptesEchoues = () => {
  //   if (failedAccounts.length > 0) {
  //     console.log(
  //       "ssssssssssssssssssssssssssssssssssssssssssssssss Comptes échoués :",
  //       failedAccounts.join(", ")
  //     );
  //   } else {
  //     console.log(
  //       "sssssssssssssssssssssssssssssssssssssssssssssssss Aucun compte n'a échoué."
  //     );
  //   }
  // };

  // const processAllComptes = async (comptes, batchSize = 10) => {
  //   const total = comptes?.length;
  //   let done = 0;

  //   for (let i = 0; i < total; i += batchSize) {
  //     const batch = comptes?.slice(i, i + batchSize);
  //     const isLastBatch = i + batchSize >= total;

  //     for (const acct of batch) {
  //       await processCompte(acct, isLastBatch);
  //       done += 1;
  //       setProgress(Math.round((done / total) * 100));
  //     }
  //     if (!isLastBatch) await delay(1000); // pas de pause après le dernier lot
  //   }
  // };

  // const failedAccounts = [];

  // const processInBatches = async (items, batchSize, asyncCallback) => {
  //   for (let i = 0; i < items.length; i += batchSize) {
  //     const batch = items.slice(i, i + batchSize);
  //     await Promise.all(batch.map(asyncCallback));
  //     await delay(200); // pour éviter "ERR_INSUFFICIENT_RESOURCES"
  //   }
  // };

  // const processCompte = async (acct, isLastBatch = false) => {
  //   const id = acct?.accountID;
  //   const pwd = acct?.password;

  //   fetchAccountGroupes(id, pwd)
  //     .then(async (groupes) => {
  //       if (groupes && groupes.length > 0) {
  //         await processInBatches(groupes, 30, (groupe) =>
  //           fetchGroupeDevices(id, [groupe], pwd)
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Erreur groupes/devices :", err);
  //       setError("Erreur lors de la mise à jour des groupes.");
  //     });

  //   fetchAccountUsers(id, pwd)
  //     .then(async (users) => {
  //       if (users && users.length > 0) {
  //         await processInBatches(users, 40, (user) =>
  //           fetchUserDevices(id, [user])
  //         );
  //         await processInBatches(users, 40, (user) =>
  //           fetchUserGroupes(id, [user])
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Erreur utilisateurs/données :", err);
  //       setError("Erreur lors de la mise à jour des utilisateurs.");
  //     });

  //   fetchAccountGeofences(id, pwd);

  //   try {
  //     if (isLastBatch) {
  //       await fetchAccountDevices(id, pwd)
  //         .then(async (devices) => {
  //           if (devices && devices.length > 0) {
  //             await processInBatches(devices, 40, (device) =>
  //               fetchVehiculeDetails(id, [device], pwd)
  //             );
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("Erreur device/details :", err);
  //           setError("Erreur lors de la mise à jour des VehiculeDetails.");
  //         });
  //     } else {
  //       fetchAccountDevices(id, pwd)
  //         .then(async (devices) => {
  //           if (devices && devices.length > 0) {
  //             await processInBatches(devices, 40, (device) =>
  //               fetchVehiculeDetails(id, [device], pwd)
  //             );
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("Erreur device/details :", err);
  //           setError("Erreur lors de la mise à jour des VehiculeDetails.");
  //         });
  //     }
  //     //////////////////////////
  //   } catch (err) {
  //     console.error("Erreur pour le compte", id, ":", err);
  //     failedAccounts.push(id);
  //     setError(
  //       "Erreur sur un ou plusieurs comptes.",
  //       failedAccounts.join(", ")
  //     );
  //   }

  //   afficherComptesEchoues();
  // };

  // const afficherComptesEchoues = () => {
  //   if (failedAccounts.length > 0) {
  //     console.log(
  //       "ssssssssssssssssssssssssssssssssssssssssssssssss Comptes échoués :",
  //       failedAccounts.join(", ")
  //     );
  //   } else {
  //     console.log(
  //       "sssssssssssssssssssssssssssssssssssssssssssssssss Aucun compte n'a échoué."
  //     );
  //   }
  // };

  // const processAllComptes = async (comptes, batchSize) => {
  //   const total = comptes?.length;
  //   let done = 0;

  //   for (let i = 0; i < total; i += batchSize) {
  //     const batch = comptes.slice(i, i + batchSize);
  //     const isLastBatch = i + batchSize >= total;

  //     for (const acct of batch) {
  //       await processCompte(acct, isLastBatch);
  //       done += 1;
  //       setProgress(Math.round((done / total) * 100));
  //     }

  //     if (!isLastBatch) await delay(1000);
  //   }
  // };

  // Composant principal ou logique d'utilisation
  // const failedAccounts = [];

  // const processInBatches = async (items, batchSize, asyncCallback) => {
  //   for (let i = 0; i < items.length; i += batchSize) {
  //     const batch = items.slice(i, i + batchSize);
  //     const results = await Promise.allSettled(batch.map(asyncCallback));
  //     results.forEach((res, idx) => {
  //       if (res.status === "rejected") {
  //         console.error(`Erreur dans le batch à l'élément ${idx}:`, res.reason);
  //       }
  //     });
  //     await delay(200);
  //   }
  // };

  // const processCompte = async (acct, isLastBatch = false) => {
  //   const id = acct?.accountID;
  //   const pwd = acct?.password;

  //   try {
  //     const tasks = [
  //       // Groupes + devices par groupe
  //       fetchAccountGroupes(id, pwd).then(async (groupes) => {
  //         if (groupes?.length > 0) {
  //           await processInBatches(groupes, 30, (g) =>
  //             fetchGroupeDevices(id, [g], pwd)
  //           );
  //         }
  //       }),

  //       // Utilisateurs + devices/groupes par utilisateur
  //       fetchAccountUsers(id, pwd).then(async (users) => {
  //         if (users?.length > 0) {
  //           await Promise.allSettled([
  //             processInBatches(users, 40, (u) => fetchUserDevices(id, [u])),
  //             processInBatches(users, 40, (u) => fetchUserGroupes(id, [u])),
  //           ]);
  //         }
  //       }),

  //       // Géofences
  //       fetchAccountGeofences(id, pwd),

  //       // Devices + détails véhicules
  //       fetchAccountDevices(id, pwd).then(async (devices) => {
  //         if (devices?.length > 0) {
  //           await processInBatches(devices, 40, (d) =>
  //             fetchVehiculeDetails(id, [d], pwd)
  //           );
  //         }
  //       }),
  //     ];

  //     const results = await Promise.allSettled(tasks);
  //     results.forEach((res, i) => {
  //       if (res.status === "rejected") {
  //         console.warn(`Tâche ${i} échouée pour ${id}`, res.reason);
  //         failedAccounts.push(id);
  //         setError(`Erreur pour le compte ${id} à l'étape ${i}`);
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Erreur pour le compte", id, ":", err);
  //     failedAccounts.push(id);
  //     setError(
  //       "Erreur sur un ou plusieurs comptes.",
  //       failedAccounts.join(", ")
  //     );
  //   }

  //   afficherComptesEchoues();
  // };

  //   const processCompte = async (acct) => {
  //   const id = acct?.accountID;
  //   const pwd = acct?.password;

  //   try {
  //     const groupesPromise = fetchAccountGroupes(id, pwd).then(async (groupes) => {
  //       if (groupes?.length > 0) {
  //         await Promise.allSettled(
  //           groupes.map((g) => fetchGroupeDevices(id, [g], pwd))
  //         );
  //       }
  //     });

  //     const usersPromise = fetchAccountUsers(id, pwd).then(async (users) => {
  //       if (users?.length > 0) {
  //         await Promise.allSettled([
  //           ...users.map((u) => fetchUserDevices(id, [u])),
  //           ...users.map((u) => fetchUserGroupes(id, [u])),
  //         ]);
  //       }
  //     });

  //     const geofencesPromise = fetchAccountGeofences(id, pwd);

  //     const devicesPromise = fetchAccountDevices(id, pwd).then(async (devices) => {
  //       if (devices?.length > 0) {
  //         await Promise.allSettled(
  //           devices.map((d) => fetchVehiculeDetails(id, [d], pwd))
  //         );
  //       }
  //     });

  //     const results = await Promise.allSettled([
  //       groupesPromise,
  //       usersPromise,
  //       geofencesPromise,
  //       devicesPromise,
  //     ]);

  //     results.forEach((res, i) => {
  //       if (res.status === "rejected") {
  //         console.warn(`Tâche ${i} échouée pour ${id}`, res.reason);
  //         failedAccounts.push(id);
  //         setError(`Erreur pour le compte ${id} à l'étape ${i}`);
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Erreur pour le compte", id, ":", err);
  //     failedAccounts.push(id);
  //     setError("Erreur sur un ou plusieurs comptes.", failedAccounts.join(", "));
  //   }

  //   afficherComptesEchoues();
  // };

  // const afficherComptesEchoues = () => {
  //   if (failedAccounts.length > 0) {
  //     console.log("Comptes échoués :", failedAccounts.join(", "));
  //   } else {
  //     console.log("Aucun compte n'a échoué.");
  //   }
  // };

  //1 const processAllComptes = async (comptes, batchSize) => {
  //   const total = comptes?.length;
  //   let done = 0;

  //   for (let i = 0; i < total; i += batchSize) {
  //     const batch = comptes.slice(i, i + batchSize);
  //     const isLastBatch = i + batchSize >= total;

  //     const results = await Promise.allSettled(
  //       batch.map((acct) => processCompte(acct, isLastBatch))
  //     );

  //     results.forEach((res, idx) => {
  //       if (res.status === "rejected") {
  //         console.warn(`Échec du compte`, batch[idx].accountID, res.reason);
  //       }
  //     });

  //     done += batch.length;
  //     setProgress(Math.round((done / total) * 100));

  //     if (!isLastBatch) await delay(1000);
  //   }
  // };

  //
  //
  //
  //
  //

  //   const processAllComptes = async (comptes, batchSize) => {
  //   const total = comptes?.length;
  //   let done = 0;

  //   for (let i = 0; i < total; i += batchSize) {
  //     const batch = comptes.slice(i, i + batchSize);

  //     await Promise.allSettled(
  //       batch.map(async (acct) => {
  //         await processCompte(acct);
  //         done += 1;
  //         setProgress(Math.round((done / total) * 100)); // mise à jour à chaque compte
  //       })
  //     );

  //     await delay(500); // plus court
  //   }
  // };

  const failedAccounts = [];
  const limit = pLimit(100); // limite à 15 requêtes en parallèle

  const processCompte = async (acct) => {
    const id = acct?.accountID;
    const pwd = acct?.password;

    try {
      const groupesPromise = fetchAccountGroupes(id, pwd).then(
        async (groupes) => {
          if (groupes?.length > 0) {
            await Promise.allSettled(
              groupes.map((g) => limit(() => fetchGroupeDevices(id, [g], pwd)))
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
        geofencesPromise,
        devicesPromise,
      ]);

      results.forEach((res, i) => {
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

    afficherComptesEchoues();
  };

  const afficherComptesEchoues = () => {
    if (failedAccounts.length > 0) {
      console.log("Comptes échoués :", failedAccounts.join(", "));
    } else {
      console.log("Aucun compte n'a échoué.");
    }
  };

  const processAllComptes = async (comptes, batchSize) => {
    const total = comptes?.length;
    let done = 0;

    for (let i = 0; i < total; i += batchSize) {
      const batch = comptes.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (acct) => {
          await processCompte(acct);
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
    fetchAllOtherData = true
  ) => {
    console.log("fetchComptes: lancement de la requête XML");
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${account}" user="${user}" password="${password}" />
  <Record table="Account" partial="true" />
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

    let newData;
    if (user === "admin") {
      newData = data;
    } else if (user === "ht") {
      newData = data?.filter((account) => account?.notes === "ht");
    } else if (user === "rd") {
      newData = data?.filter((account) => account?.notes === "rd");
    }

    console.log("fetchComptes: résultats------- =", user, newData);

    setComptes(newData);

    if (fetchAllOtherData) {
      loadForManySecond();
      if (newData?.length < 20) {
        setRunningAnimationProgressDuration(100);
      } else if (newData?.length < 40) {
        setRunningAnimationProgressDuration(200);
      } else if (newData?.length < 60) {
        setRunningAnimationProgressDuration(300);
      } else if (newData?.length < 70) {
        setRunningAnimationProgressDuration(400);
      } else if (newData?.length < 80) {
        setRunningAnimationProgressDuration(500);
      } else {
        setRunningAnimationProgressDuration(600);
      }
      setProgressAnimationStart(0);
      setRunningAnimationProgressLoading(true);
      setProgressDataUser(10);
      setProgress(2);
      processAllComptes(newData, 10); // 👈 traitement séquentiel en lots de 3
      ListeDesRolePourLesUserFonction(account, user, password);
    }

    return newData;
  };

  const fetchAccountDevices = async (accountID, password) => {
    console.log(
      "fetchAccountDevices: lancement de la requête XML pour",
      accountID
    );
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="Device" partial="true">
    <Field name="accountID">${accountID}</Field>

    
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

    // for (let i = 0; i < data.length; i += batchSize) {
    //   const batch = data.slice(i, i + batchSize);
    //   const details = await fetchVehiculeDetails(accountID, batch, password);
    //   vehDetails = vehDetails.concat(details);
    //   await delay(1000); // 👈 modifiable (pause entre groupes)
    // }

    // const vehDetails = await fetchVehiculeDetails(accountID, data, password);

    const enrichedData = data.map((device) => {
      const found = vehDetails.find((v) => v.deviceID === device.deviceID);
      return {
        ...device,
        véhiculeDetails: found?.véhiculeDetails || [],
      };
    });

    setAccountDevices((prev) => {
      const filtered = prev?.filter((d) => d.accountID !== accountID);
      return [...filtered, ...enrichedData];
    });

    return enrichedData;

    // return data;
  };

  // 3) Récupérer accountGroupes
  const fetchAccountGroupes = async (accountID, password) => {
    console.log(
      "fetchAccountGroupes: lancement de la requête XML pour",
      accountID
    );
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="DeviceGroup" partial="true">
    <Field name="accountID">${accountID}</Field>
  </Record>
</GTSRequest>
  `;

    console.log("xml", xml);

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    console.log("result..........", text);
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

    console.log("fetchAccountGroupes: résultats =", data);

    setAccountGroupes((prev) => {
      // Supprimer tous les groupes de ce compte
      const filtered = prev?.filter((g) => g.accountID !== accountID);
      // Ajouter les nouveaux groupes
      return [...filtered, ...data];
    });

    return data;
  };

  // 4) Récupérer accountUsers
  const fetchAccountUsers = async (accountID, password) => {
    console.log(
      "fetchAccountUsers: lancement de la requête XML pour",
      accountID
    );
    const xml = `
<GTSRequest command="dbget">
  <Authorization account="${accountID}" user="${systemUser}" password="${password}" />
  <Record table="User" partial="true">
    <Field name="accountID">${accountID}</Field>
  </Record>
</GTSRequest>
  `;

    console.log(xml);

    const res = await fetch(currentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });
    const text = await res.text();
    // console.log(text)
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

    console.log("fetchAccountUsers: résultats =", data);

    setAccountUsers((prev) => {
      // Supprimer tous les users de ce compte
      const filtered = prev?.filter((u) => u.accountID !== accountID);
      // Ajouter les nouveaux users
      return [...filtered, ...data];
    });

    return data;
  };

  // 5) Récupérer userDevices pour chaque user
  const fetchUserDevices = async (accountID, users) => {};

  // 6) Récupérer groupeDevices pour chaque groupe
  const fetchGroupeDevices = async (accountID, groupes, accountPassword) => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    if (!Array.isArray(groupes)) {
      console.warn(
        "fetchGroupeDevices: 'groupes' est invalide ou vide :",
        groupes
      );
      return [];
    }

    console.log(
      "fetchGroupeDevices: lancement des requêtes pour chaque groupe de",
      accountID
    );

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

      console.log(xml);

      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml,
      });

      const text = await res.text();
      console.log("text........", text);
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

      console.log(`fetchGroupeDevices: groupe ${grp.groupID}, devices =`, data);
      return { groupID: grp.groupID, groupeDevices: data };
    });

    const results = await Promise.all(promises);

    // Mise à jour sans doublon par groupID
    console.log("Resultat Groupe Devices", (prev) => {
      const updated = [...prev];
      results.forEach((newEntry) => {
        const index = updated.findIndex((e) => e.groupID === newEntry.groupID);
        if (index !== -1) {
          updated[index] = newEntry;
        } else {
          updated.push(newEntry);
        }
      });
      return updated;
    });
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

    console.log(
      "fetchUserGroupes: lancement des requêtes pour chaque utilisateur de",
      accountID
    );

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

      console.log(`fetchUserGroupes: user ${usr.userID}, groupes =`, data);
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
          (userGroupes || []).forEach((g) => groupMap.set(g.groupID, g));
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
    console.log("Startttttt geofence");
    const username = "admin";

    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${accountID}" user="${username}" password="${password}" />
      <Record table="Geozone" partial="true">
        <Field name="accountID">${accountID}</Field>
        <Field name="descriptionZone" />
      </Record>
    </GTSRequest>`;

    console.log("xmlData", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const xmlText = await response.text();
      console.log("Received XML Data:", xmlText);

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

      console.log("Geofence Data:", records);

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

      console.log("Mapped Geofence Data:", geofences);

      setAccountGeofences((prev) => {
        // Supprimer tous les groupes de ce compte
        const filtered = prev?.filter((g) => g.accountID !== accountID);
        // Ajouter les nouveaux groupes

        console.log("[...filtered, ...geofences]", [...filtered, ...geofences]);
        return [...filtered, ...geofences];
      });

      try {
        // setGeofenceData(geofences); // Mise à jour de la variable
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

      // setGeofenceData(geofences); // Mise à jour de la variable

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

    console.log("fetchVehiculeDetails: lancement pour", accountID);

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

    //  setVehiculeDetails((prev) => {
    //   // Supprimer tous les groupes de ce compte
    //   const filtered = prev?.filter((g) => g.accountID !== accountID);
    //   // Ajouter les nouveaux groupes
    //   return [...filtered, ...data];
    // });

    // return data;

    // Mise à jour de l'état
    setVehiculeDetails((prev) => {
      const updatedDeviceIDs = new Set(results.map((r) => r.deviceID));
      const filtered = prev?.filter((v) => !updatedDeviceIDs.has(v.deviceID));
      return [...filtered, ...results];
    });

    return results;
  };

  // const setAccountDevicesFonction = () => {
  //   const newAccountDevices = accountDevices?.map((device) => {
  //     const match = véhiculeDetails?.find(
  //       (v) =>
  //         v.deviceID === device.deviceID &&
  //         v.véhiculeDetails?.[0]?.accountID === device.accountID
  //     );

  //     if (match && match.véhiculeDetails.length > 0) {
  //       return { ...device, véhiculeDetails: match.véhiculeDetails };
  //     }

  //     return device;
  //   });

  //   console.log("UPdate..... device initial + Details", newAccountDevices);

  //   setAccountDevices(newAccountDevices);
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAccountDevicesFonction();
  //   }, 3000);
  // }, [vehicleDetails]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAccountDevicesFonction();
  //   }, 3000);
  // }, []);

  x;
  useEffect(() => {
    console.log("🔄 Fusion + enrichissement des données");
    if (!comptes?.length) return;

    const merged = comptes?.map((acct) => {
      const users = accountUsers?.filter((u) => u.accountID === acct.accountID);

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
        users.some((u) => u.userID === ug.userID)
      );

      const grpDevs = groupeDevices?.filter((gd) =>
        groupes.some((g) => g.groupID === gd.groupID)
      );

      // Création d’une map des devices de groupes
      const groupMap = {};
      groupes?.forEach((group) => {
        groupMap[group.groupID] =
          grpDevs.find((gd) => gd.groupID === group.groupID)?.groupeDevices ||
          [];
      });

      // Enrichissement des utilisateurs avec les groupes et les devices des groupes
      const updatedUsers = users?.map((u) => {
        const groupesDuUser =
          userGrp.find((ug) => ug.userID === u.userID)?.userGroupes || [];

        const devicesFromGroups =
          groupesDuUser?.length > 0
            ? groupesDuUser.flatMap(
                (groupLink) => groupMap[groupLink.groupID] || []
              )
            : // : [];
              devices || [];

        const uniqueDevices = Object.values(
          devicesFromGroups?.reduce((acc, device) => {
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

      const updatedGroupes = groupes.map((g) => ({
        ...g,
        groupeDevices:
          grpDevs.find((gd) => gd.groupID === g.groupID)?.groupeDevices || [],
      }));

      return {
        ...acct,
        accountUsers: updatedUsers,
        accountDevices: devices,
        accountGeofences: geofences,
        accountGroupes: updatedGroupes,
      };
    });

    setGestionAccountData(merged);
    console.log("✅ Résultat fusionné et enrichi :", merged);
  }, [
    comptes,
    accountDevices,
    accountGeofences,
    accountGroupes,
    groupeDevices,
    accountUsers,
    // userDevices,
    userGroupes,
    véhiculeDetails,
  ]);

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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Ajoute d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");
      console.log(result);
      if (result === "success") {
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau groupe avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        setError("");
        console.log("Groupe ajouter avec success");
        const id = accountID;
        const pwd = password;

        setCreateVéhiculeLoading(false);
        setTimeout(() => {
          if (deviceSelectionnes) {
            assignMultipleDevicesToGroup(
              accountID,
              userID,
              password,
              groupID,
              deviceSelectionnes
            );
          }
          if (usersSelectionnes) {
            assignMultipleUsersToGroup(
              accountID,
              userID, // utilisateur qui fait la requête
              password,
              groupID,
              usersSelectionnes
            );
          }
        }, 4000);

        setTimeout(() => {
          try {
            fetchAccountGroupes(id, pwd)
              .then((groupes) => fetchGroupeDevices(id, groupes, pwd))
              .catch((err) => {
                console.error(
                  "Erreur lors du rafraîchissement des groupes :",
                  err
                );
                setError("Erreur lors de la mise à jour des groupes.");
              });
          } catch (err) {
            console.error("Erreur lors du rafraîchissement des groupes :", err);
            setError("Erreur lors de la mise à jour des groupes.");
          }
        }, 8000);
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
    //
    deviceSelectionnes,
    deviceNonSelectionnes
  ) => {
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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Modifier d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      setError("");
      console.log(result);
      if (result === "success") {
        setError("");
        console.log("Groupe ajouter avec success");

        setAccountGroupes((prevGroupes) =>
          prevGroupes.map((groupe) =>
            groupe.groupID === groupID
              ? {
                  ...groupe,
                  displayName,
                  description,
                  notes,
                  workOrderID,
                }
              : groupe
          )
        );

        setListeGestionDesGroupe((prevGroupes) =>
          prevGroupes.map((groupe) =>
            groupe.groupID === groupID
              ? {
                  ...groupe,
                  displayName,
                  description,
                  notes,
                  workOrderID,
                }
              : groupe
          )
        );

        setCreateVéhiculeLoading(false);

        setTimeout(() => {
          if (deviceSelectionnes) {
            deviceSelectionnes?.map((deviceID) =>
              assignDeviceToGroup(
                accountID,
                userID,
                password,
                groupID,
                deviceID
              )
            );
          }

          deviceNonSelectionnes?.map((deviceID) => {
            removeDeviceFromGroup(
              accountID,
              userID,
              password,
              groupID,
              deviceID
            );
          });
        }, 3000);

        setTimeout(() => {
          try {
            fetchAccountGroupes(accountID, password).then((groupes) =>
              fetchGroupeDevices(accountID, groupes, password)
            );
          } catch (err) {
            console.error("Erreur lors de la mise à jour des groupes :", err);
            setError("Erreur lors de la mise à jour des groupes.");
          }
        }, 6000);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Modification du groupe avec succès")}`
        );
        setConfirmationMessagePopupName(description);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la modification du groupe.");
        handleUserError(xmlDoc);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Modification du groupe")}`
        );
        setConfirmationMessagePopupName(description);

        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Erreur lors de la moodification du groupe.");
      console.error("Erreur lors de la création du véhicule", error);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Modification du groupe")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };

  const deleteGroupeEnGestionAccount = async (
    accountID,
    userID,
    password,

    groupID
  ) => {
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
    const xmlData = `<GTSRequest command="dbdel">
      <Authorization account="${accountID}" user="${userID}" password="${password}"/>
      <RecordKey table="DeviceGroup" partial="true">
      <Field name="accountID">${accountID}</Field>
      <Field name="groupID">${groupID}</Field>
      </RecordKey>
      </GTSRequest>`;

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Modifier d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        setError("");
        console.log("Groupe supprimer avec success");

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

        // console.log("errorrrrrrrrr");
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Suppression du groupe")}`
        );
        setConfirmationMessagePopupName("");

        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
  x;

  const createNewUserEnGestionAccount = async (
    accountID,
    user,
    password,

    userIDField,
    description,
    displayName,
    passwordField,

    //
    contactEmail,
    notifyEmail,
    isActive,
    contactPhone,
    contactName,
    timeZone,
    maxAccessLevel,
    roleID,
    //
    addressCity,
    addressCountry,
    userType,
    //

    groupesSelectionnes,
    groupesNonSelectionnes

    /////////////////////

    //
  ) => {
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Ajoute d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      );
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        // setSuccessCreateUserGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Creation du nouveau utilisateur avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setError("");
        console.log("Groupe ajouter avec success ++>>>>>>>>>>>>>>.");
        const id = accountID;
        const pwd = password;

        // setTimeout(() => {

        //   fetchAccountUsers(id, pwd)
        //   .then((users) => {
        //     fetchUserDevices(id, users);
        //     fetchUserGroupes(id, users);
        //   })
        //   .catch((err) => {
        //     console.error(
        //       "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
        //       err
        //     );
        //     setError("Erreur lors de la mise à jour des utilisateurs.");
        //   });
        //   }, 10000);

        setCreateVéhiculeLoading(false);

        // Ajouter l’utilisateur aux groupes sélectionnés

        setTimeout(() => {
          if (groupesSelectionnes) {
            // groupesSelectionnes?.map((groupID) =>
            assignUserToGroup(
              accountID,
              user,
              password,
              groupesSelectionnes,
              userIDField
            );
            // );
          }
        }, 6000);

        setTimeout(() => {
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
              setError("Erreur lors de la creation des utilisateurs.");
            });
        }, 10000);

        // setTimeout(() => {

        //   groupesNonSelectionnes.map((groupID) =>
        //       removeUserFromGroup(accountID, user, password, groupID, userIDField)
        //     )
        // }, 6000);

        // Retirer l’utilisateur des groupes non sélectionnés

        // setTimeout(() => {
        //   if (deviceSelectionnes) {
        //     assignMultipleDevicesToGroup(
        //       accountID,
        //       userID,
        //       password,
        //       groupID,
        //       deviceSelectionnes
        //     );
        //   }
        //   if (usersSelectionnes) {
        //     assignMultipleUsersToGroup(
        //       accountID,
        //       userID, // utilisateur qui fait la requête
        //       password,
        //       groupID,
        //       usersSelectionnes
        //     );
        //   }
        // }, 4000);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(
          errorMessage || "Erreur lors de la création de l'utilisateur."
        );

        handleUserError(xmlDoc);
        console.log(
          "8888888888888888888888888888888888888888888888888888888888"
        );

        // console.log("errorrrrrrrrr");
        // setEchecCreateUserGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation du l'utilisateur")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
    } catch (error) {
      setError("Erreur lors de la création du user.");
      console.error("Erreur lors de la création du véhicule", error);
      // setEchecCreateUserGestionPopup(true);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Creation du l'utilisateur")}`
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

    //
    contactEmail,
    notifyEmail,
    isActive,
    contactPhone,
    contactName,
    timeZone,
    maxAccessLevel,
    roleID,
    //
    userType,
    addressCity,
    addressCountry,

    groupesSelectionnes,
    groupesNonSelectionnes
  ) => {
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Modification d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        // setSuccessModifyUserGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Modification de l'utilisateur avec succès")}`
        );
        setConfirmationMessagePopupName(description);
        setError("");
        console.log("User modifier avec success ++>>>>>>>>>>>>>>.");
        const id = accountID;
        const pwd = password;

        setAccountUsers((prevUSers) =>
          prevUSers.map((user) =>
            user.userID === userIDField
              ? {
                  ...user,
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
              : user
          )
        );
        setTimeout(() => {
          console.log(
            "mise a jour de setListeGestionDesUsers : ",
            (prevUSers) =>
              prevUSers.map((user) =>
                user.userID === userIDField
                  ? {
                      ...user,
                      userIDField,
                      displayName,
                      description,
                      passwordField,
                    }
                  : user
              )
          );
          setListeGestionDesUsers((prevUSers) =>
            prevUSers.map((user) =>
              user.userID === userIDField
                ? {
                    ...user,
                    userIDField,
                    displayName,
                    description,
                    passwordField,
                  }
                : user
            )
          );
        }, 1000);

        setCreateVéhiculeLoading(false);

        setTimeout(() => {
          groupesNonSelectionnes.map((groupID) =>
            removeUserFromGroup(accountID, user, password, groupID, userIDField)
          );
        }, 3000);

        let key = "dbcreate";

        // if (groupesSelectionnes) {

        setTimeout(() => {
          assignUserToGroup(
            accountID,
            user,
            password,
            groupesSelectionnes,
            userIDField
          );
        }, 6000);

        setTimeout(() => {
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
              setError("Erreur lors de la mise à jour de utilisateur.");
            });
        }, 10000);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(
          errorMessage || "Erreur lors de la modification de l'utilisateur."
        );

        handleUserError(xmlDoc);

        // console.log("errorrrrrrrrr");
        // setEchecModifyUserGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Modification de l'utilisateur")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
    } catch (error) {
      setError("Erreur lors de la modification du user.");
      console.error("Erreur lors de la création du véhicule", error);
      // setEchecModifyUserGestionPopup(true);
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de la Modification de l'utilisateur")}`
      );
      setConfirmationMessagePopupName(description);
      setCreateVéhiculeLoading(false);
    }
  };
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
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
    const xmlData = `<GTSRequest command="dbput">
      <Authorization account="${accountID}" user="${username}" password="${password}" />
      <Record table="User" partial="true">
        <Field name="accountID">${accountID}</Field>

        <Field name="userID">${username}</Field>

        <Field name="lastLoginTime">${lastLoginTime}</Field>

        
        
      </Record>
    </GTSRequest>`;

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Modification d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      // setError("");
      console.log(result);
      if (result === "success") {
        console.log(
          "User lastLoginTime modifier avec success ++>>>>>>>>>>>>>>.",
          lastLoginTime
        );
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        // setError(
        //   errorMessage ||
        //     "Erreur lors de la modification lastLoginTime de l'utilisateur."
        // );

        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
    console.log("++++++++++++++++ Requête effectué: deleteVehicle");

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

    console.log("requestBody", requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      console.log(response);
      if (response.ok) {
        if (userAccount && userUsername && userPassword) {
          //   console.log("vehicule Delete avec successsssssssss...............");
          // } else {
          console.log("Delete successsssssssss...............");
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

          // setUserDevices((prev) => prev?.filter((v) => v.deviceID !== deviceID));
          // setUserDevices((prev) =>
          //   prev.map((user) => ({
          //     ...user,
          //     userDevices: user.userDevices.filter(
          //       (device) => device.deviceID !== deviceID
          //     ),
          //   }))
          // );

          // 🧠 Mise à jour d'IndexedDB
          // const db = await openDatabase();
          // const tx = db.transaction(
          //   ["accountDevices", "userDevices"],
          //   "readwrite"
          // );

          // const removeFromStore = async (storeName) => {
          //   const store = tx.objectStore(storeName);
          //   const getAllReq = store.getAll();
          //   getAllReq.onsuccess = () => {
          //     let updated;

          //     if (storeName === "userDevices") {
          //       // Suppression imbriquée dans chaque user
          //       updated = (getAllReq.result || []).map((user) => ({
          //         ...user,
          //         userDevices: (user.userDevices || []).filter(
          //           (device) => device.deviceID !== deviceID
          //         ),
          //       }));
          //     } else {
          //       // Suppression simple
          //       updated = (getAllReq.result || []).filter(
          //         (v) => v.deviceID !== deviceID
          //       );
          //     }

          //     store.clear();
          //     updated.forEach((v) => store.put(v));
          //   };
          // };

          // removeFromStore("accountDevices");
          // removeFromStore("userDevices");

          //
          // Supprimer le véhicule de IndexedDB
          // openDatabase().then((db) => {
          //   const transaction = db.transaction(["mergedDataHome"], "readwrite");
          //   const store = transaction.objectStore("mergedDataHome");

          //   // Récupérer toutes les données actuelles
          //   const getRequest = store.getAll();

          //   getRequest.onsuccess = () => {
          //     const existingData = getRequest.result || [];
          //     const updatedData = existingData.filter(
          //       (vehicle) => vehicle.deviceID !== deviceID
          //     );

          //     store.clear(); // Supprime les anciennes données
          //     updatedData.forEach((vehicle) => store.put(vehicle)); // Sauvegarde les données mises à jour
          //   };
          // });

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

      console.log("finish Deleting.........");
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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Ajoute d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        setError("");
        console.log("Groupe ajouter avec success ++>>>>>>>>>>>>>>.");
        // const id = accountID;
        // const pwd = password;
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

        // fetchAccountUsers(id, pwd)
        //   .then((users) => {
        //     fetchUserDevices(id, users);
        //     fetchUserGroupes(id, users);
        //   })
        //   .catch((err) => {
        //     console.error(
        //       "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
        //       err
        //     );
        //     setError("Erreur lors de la mise à jour des utilisateurs.");
        //   });

        setCreateVéhiculeLoading(false);

        // Ajouter l’utilisateur aux groupes sélectionnés

        // setTimeout(() => {
        //   if (groupesSelectionnes) {
        //     groupesSelectionnes?.map((groupID) =>
        //       assignUserToGroup(accountID, user, password, groupID, userIDField)
        //     );
        //   }
        // }, 4000);

        // setTimeout(() => {
        //   fetchAccountUsers(id, pwd)
        //     .then((users) => {
        //       fetchUserDevices(id, users);
        //       fetchUserGroupes(id, users);
        //     })
        //     .catch((err) => {
        //       console.error(
        //         "Erreur lors du chargement des utilisateurs ou des données utilisateurs :",
        //         err
        //       );
        //       setError("Erreur lors de la mise à jour des utilisateurs.");
        //     });
        // }, 8000);

        // setTimeout(() => {

        //   groupesNonSelectionnes.map((groupID) =>
        //       removeUserFromGroup(accountID, user, password, groupID, userIDField)
        //     )
        // }, 6000);

        // Retirer l’utilisateur des groupes non sélectionnés

        // setTimeout(() => {
        //   if (deviceSelectionnes) {
        //     assignMultipleDevicesToGroup(
        //       accountID,
        //       userID,
        //       password,
        //       groupID,
        //       deviceSelectionnes
        //     );
        //   }
        //   if (usersSelectionnes) {
        //     assignMultipleUsersToGroup(
        //       accountID,
        //       userID, // utilisateur qui fait la requête
        //       password,
        //       groupID,
        //       usersSelectionnes
        //     );
        //   }
        // }, 4000);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du compte.");

        handleUserError(xmlDoc);

        // console.log("errorrrrrrrrr");
        // setEchecCreateAccountGestionPoupu(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation du compte")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
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

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Ajoute d'un nouveau groupe", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        // setSuccessModifyAccountGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(`${t("Compte modifié avec succès")}`);
        setConfirmationMessagePopupName(description);
        setError("");
        console.log("Groupe ajouter avec success ++>>>>>>>>>>>>>>.");
        // const id = accountID;
        // const pwd = password;
        // const fetchAllOtherData = false;

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

        // console.log("errorrrrrrrrr");
        // setEchecModifyAccountGestionPopup(true);
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la  Modification du compte")}`
        );
        setConfirmationMessagePopupName(description);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
  const deleteAccountEnGestionAccountFonction = async (
    // account,
    // user,
    // password,
    accountIDField
  ) => {
    console.log("++++++++++++++++ Requête effectué: deleteVehicle");

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

      console.log(response);
      if (response.ok) {
        if (account && username && password) {
          //   console.log("vehicule Delete avec successsssssssss...............");
          // } else {
          console.log("Delete successsssssssss...............");

          setShowConfirmationMessagePopup(true); // succès  Échec
          setConfirmationMessagePopupTexte(
            `${t("Compte supprimer avec succès")}`
          );
          setConfirmationMessagePopupName("");

          setComptes((prev) =>
            prev?.filter((v) => v.accountID !== accountIDField)
          );

          // setUserDevices((prev) => prev?.filter((v) => v.deviceID !== deviceID));
          // setUserDevices((prev) =>
          //   prev.map((user) => ({
          //     ...user,
          //     userDevices: user.userDevices.filter(
          //       (device) => device.deviceID !== deviceID
          //     ),
          //   }))
          // );

          // 🧠 Mise à jour d'IndexedDB
          // const db = await openDatabase();
          // const tx = db.transaction(
          //   ["accountDevices", "userDevices"],
          //   "readwrite"
          // );

          // const removeFromStore = async (storeName) => {
          //   const store = tx.objectStore(storeName);
          //   const getAllReq = store.getAll();
          //   getAllReq.onsuccess = () => {
          //     let updated;

          //     if (storeName === "userDevices") {
          //       // Suppression imbriquée dans chaque user
          //       updated = (getAllReq.result || []).map((user) => ({
          //         ...user,
          //         userDevices: (user.userDevices || []).filter(
          //           (device) => device.deviceID !== deviceID
          //         ),
          //       }));
          //     } else {
          //       // Suppression simple
          //       updated = (getAllReq.result || []).filter(
          //         (v) => v.deviceID !== deviceID
          //       );
          //     }

          //     store.clear();
          //     updated.forEach((v) => store.put(v));
          //   };
          // };

          // removeFromStore("accountDevices");
          // removeFromStore("userDevices");

          //
          // Supprimer le véhicule de IndexedDB
          // openDatabase().then((db) => {
          //   const transaction = db.transaction(["mergedDataHome"], "readwrite");
          //   const store = transaction.objectStore("mergedDataHome");

          //   // Récupérer toutes les données actuelles
          //   const getRequest = store.getAll();

          //   getRequest.onsuccess = () => {
          //     const existingData = getRequest.result || [];
          //     const updatedData = existingData.filter(
          //       (vehicle) => vehicle.deviceID !== deviceID
          //     );

          //     store.clear(); // Supprime les anciennes données
          //     updatedData.forEach((vehicle) => store.put(vehicle)); // Sauvegarde les données mises à jour
          //   };
          // });

          setCreateVéhiculeLoading(false);
          // navigate("/home");
        }
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

      console.log("finish Deleting.........");
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
    imeiNumber,
    uniqueIdentifier,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber,
    vehicleID,
    groupesSelectionnes
  ) => {
    console.log(
      userAccount,
      userUsername,
      userPassword,
      deviceID,
      groupesSelectionnes
    );
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}" />
      <Record table="Device" partial="true">
        <Field name="accountID">${userAccount}</Field>

        <Field name="deviceID">${deviceID}</Field>
        <Field name="description">${description}</Field>
        <Field name="equipmentType">${equipmentType}</Field>
        <Field name="uniqueID">${uniqueIdentifier}</Field>
        <Field name="imeiNumber">${imeiNumber}</Field>
        <Field name="vehicleID">${vehicleID}</Field>
        <Field name="licensePlate">${licensePlate}</Field>
        <Field name="simPhoneNumber">${"509" + simPhoneNumber}</Field>
        <Field name="displayName">${displayName}</Field>
        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("data from add véhicule", data);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
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
        }, 5000);
        // waitForDeviceThenAssign(
        //   userAccount,
        //   userUsername,
        //   userPassword,
        //   deviceID,
        //   groupesSelectionnes
        // );
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du véhicule.");

        handleUserError(xmlDoc);

        // console.log("errorrrrrrrrr");
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la Creation de l'appareil")}`
        );
        setConfirmationMessagePopupName(description);
        //////////////////
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
    imeiNumber,
    uniqueIdentifier,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber,
    vehicleID,
    groupesSelectionnes
  ) => {
    console.log(
      userAccount,
      userUsername,
      userPassword,
      deviceID,
      groupesSelectionnes
    );
    // /////////

    setError("");
    setCreateVéhiculeLoading(true);
    //  <Field name="GroupList">${userAccount}</Field>
    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
    const xmlData = `<GTSRequest command="dbput">
      <Authorization account="${userAccount}" user="${userUsername}" password="${userPassword}" />
      <Record table="Device" partial="true">
        <Field name="accountID">${userAccount}</Field>

        <Field name="deviceID">${deviceID}</Field>
        <Field name="description">${description}</Field>
        <Field name="equipmentType">${equipmentType}</Field>
        <Field name="uniqueID">${uniqueIdentifier}</Field>
        <Field name="imeiNumber">${imeiNumber}</Field>
        <Field name="vehicleID">${vehicleID}</Field>
        <Field name="licensePlate">${licensePlate}</Field>
        <Field name="simPhoneNumber">${"509" + simPhoneNumber}</Field>
        <Field name="displayName">${displayName}</Field>
        <Field name="isActive">1</Field>
      </Record>
    </GTSRequest>`;

    console.log(xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("data from add véhicule", data);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");
      console.log(result);
      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
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
                  uniqueIdentifier,
                  imeiNumber,
                  vehicleID,
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
                  uniqueIdentifier,
                  imeiNumber,
                  vehicleID,
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
        }, 5000);

        // waitForDeviceThenAssign(
        //   userAccount,
        //   userUsername,
        //   userPassword,
        //   deviceID,
        //   groupesSelectionnes
        // );
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la modification du véhicule.");

        handleUserError(xmlDoc);

        // console.log("errorrrrrrrrr");
        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Échec de la modification de l'appareil")}`
        );
        setConfirmationMessagePopupName(description);
        //////////////////
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
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
    userPassword
  ) => {
    console.log("++++++++++++++++ Requête effectué: deleteVehicle");

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

    console.log("requestBody", requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      console.log(response);
      if (response.ok) {
        if (userAccount && userUsername && userPassword) {
          //   console.log("vehicule Delete avec successsssssssss...............");
          // } else {
          console.log("Delete successsssssssss...............");
          setShowConfirmationMessagePopup(true); // succès  Échec
          setConfirmationMessagePopupTexte(
            `${t("Suppression de l'appareil avec succès")}`
          );
          setConfirmationMessagePopupName("");

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

          // 🧠 Mise à jour d'IndexedDB
          const db = await openDatabase();
          const tx = db.transaction(
            ["accountDevices", "userDevices"],
            "readwrite"
          );

          const removeFromStore = async (storeName) => {
            const store = tx.objectStore(storeName);
            const getAllReq = store.getAll();
            getAllReq.onsuccess = () => {
              let updated;

              if (storeName === "userDevices") {
                // Suppression imbriquée dans chaque user
                updated = (getAllReq.result || []).map((user) => ({
                  ...user,
                  userDevices: (user.userDevices || []).filter(
                    (device) => device.deviceID !== deviceID
                  ),
                }));
              } else {
                // Suppression simple
                updated = (getAllReq.result || []).filter(
                  (v) => v.deviceID !== deviceID
                );
              }

              store.clear();
              updated.forEach((v) => store.put(v));
            };
          };

          removeFromStore("accountDevices");
          removeFromStore("userDevices");

          //
          // Supprimer le véhicule de IndexedDB
          openDatabase().then((db) => {
            const transaction = db.transaction(["mergedDataHome"], "readwrite");
            const store = transaction.objectStore("mergedDataHome");

            // Récupérer toutes les données actuelles
            const getRequest = store.getAll();

            getRequest.onsuccess = () => {
              const existingData = getRequest.result || [];
              const updatedData = existingData.filter(
                (vehicle) => vehicle.deviceID !== deviceID
              );

              store.clear(); // Supprime les anciennes données
              updatedData.forEach((vehicle) => store.put(vehicle)); // Sauvegarde les données mises à jour
            };
          });

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
          `${t("Échec de Suppression de l'appareil")}`
        );
        setConfirmationMessagePopupName("");
        setCreateVéhiculeLoading(false);
      }

      console.log("finish Deleting.........");
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );
      setShowConfirmationMessagePopup(true); // succès  Échec
      setConfirmationMessagePopupTexte(
        `${t("Échec de Suppression de l'appareil")}`
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
      console.log("Tous les devices ont été assignés au groupe avec succès.");
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

    console.log("xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();
      console.log("text", text);
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");
      console.log(
        `assignDeviceToGroup: Résultat pour ${deviceID} -> ${groupID} :`,
        result
      );
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
      console.log("Le device a été assigné à tous les groupes avec succès.");
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

    // `
    // <GTSRequest command="dbput">
    //       <Authorization account="foodforthepoor" user="admin" password="Octa@112233" />
    //       <Record table="User" partial="true">
    //         <Field name="accountID">foodforthepoor</Field>

    //         <Field name="userID">mdireny</Field>
    //         <Field name="displayName">Maly Direny</Field>
    //         <Field name="description">Maly Direny</Field>
    //         <Field name="password">mdireny@#2023</Field>

    //           <Field name="roleID">!clientproprietaire</Field>
    //         <Field name="contactEmail">mdireny@foodforthepoorhaiti.org</Field>
    //         <Field name="notifyEmail">malydireny@gmail.com</Field>
    //         <Field name="isActive">1</Field>
    //         <Field name="contactPhone">50934232343</Field>
    //         <Field name="contactName"></Field>
    //         <Field name="timeZone">GMT-05:00</Field>
    //         <Field name="maxAccessLevel">3</Field>

    //         <Field name="isActive">1</Field>
    //       </Record>
    //     </GTSRequest>`

    console.log(
      "xmlData affectation user to groupe ?????????????????",
      xmlData
    );

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const text = await res.text();
      console.log("Resultat............", text);
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      console.log(
        `assignUserToGroup: Résultat pour ${userID} -> ${groupID} :`,
        result
      );
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
      console.log(
        "Tous les utilisateurs ont été assignés au groupe avec succès."
      );
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

    //     const xmlData = `
    // <GTSRequest command="dbdel">
    //   <Authorization account="${account}" user="${adminUser}" password="${password}" />
    //   <Record table="GroupList">
    //     <RecordKey>

    //     <Field name="accountID">${account}</Field>
    //     <Field name="userID">${userID}</Field>
    // <Field name="groupID">${groupID}</Field>

    //     </RecordKey>

    //   </Record>
    // </GTSRequest>`;

    console.log("xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();
      console.log("resultat......", text);
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      console.log(`removeUserFromGroup: ${userID} -> ${groupID} :`, result);
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

    console.log("xmlData", xmlData);

    try {
      const res = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      const text = await res.text();
      console.log("Result........................", text);
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const result = doc
        .getElementsByTagName("GTSResponse")[0]
        ?.getAttribute("result");

      console.log(`removeDeviceFromGroup: ${deviceID} -> ${groupID} :`, result);
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

    // console.log("errorMessage inactive", errorMessage);

    if (errorMessage === "User inactive") {
      console.log("Logout the user, and navigate to /login");
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
    console.log("setMergedDataHome77777777777777");
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

    resetIndexedDB(); // Vide le localStorage
    // window.location.reload(); // Rafraîchit la page
    window.location.reload(); // Rafraîchit la page
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
  const GeofenceDataFonction = async (
    userAccount,
    userUsername,
    userPassword
  ) => {
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: GeofenceDataFonction");

    // /////////
    console.log("Startttttt geofence");

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
      console.log("Received XML Data:", xmlText);

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

      console.log("Geofence Data:", records);

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
        // shapeColor: record.shapeColor || "", // Default color if not provided
        color: record.shapeColor || "", // Use shapeColor for consistency
        // fillColor: `${record.shapeColor || ""}`, // Semi-transparent fill
        // fillColor: `${record.shapeColor || ""}33`, // Semi-transparent fill
        // opacity: 0.1,
        // weight: 1,
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

      console.log("Mapped Geofence Data:", geofences);

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
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: createNewGeofence");

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

    console.log("xmlData", xmlData);

    try {
      console.log("Sending request to create Geofence...");
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      console.log("Response received:", response);
      const data = await response.text();
      console.log("Response text:", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        console.log("Geofence created successfully...");

        if (isDashboardHomePage) {
          console.log("1111111111111111111111111111111111111111111111");
          fetchAccountGeofences(accountIDProp, passwordProp);
          setCreateGeofenceLoading(false);
        } else {
          console.log("2222222222222222222222222222222222222222222222");
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

          setCreateGeofenceLoading(false);
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
        console.log("Error occurred while creating Geofence...");
        setCreateGeofenceLoading(false);

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
      setCreateGeofenceLoading(false);

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

    console.log("🚀 Requête envoyée à l'API :");
    console.log(requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: requestBody,
      });

      console.log("✅ Réponse brute reçue :", response);
      const data = await response.text();
      console.log("📦 Texte de la réponse :", data);

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
      console.log("📍 Résultat extrait du XML :", result);

      if (result && result === "success") {
        console.log("🎉 Geofence modifié avec succès.");

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
    // if (!userData) return;
    // Pour suivre le nombre de requête

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

    // const requestBody = `<GTSRequest command="dbdel">
    // <Authorization account="${accountIDProp ? accountIDProp : account}" user="${
    //   userProp ? userProp : username
    // }" password="${passwordProp ? passwordProp : password}" />

    // <Record table="Geozone" partial="false">
    // <Field name="accountID">${accountIDProp ? accountIDProp : account}</Field>

    // <Field name="geozoneID">${geozoneID}</Field>
    // <Field name="sortID">${geozoneID}</Field>
    //   </Record>
    //    <RecordKey table="Geozone" partial="false">
    // <Field name="accountID">${account}</Field>
    // <Field name="geozoneID">${geozoneID}</Field>
    // <Field name="sortID">${geozoneID}</Field>
    //   </RecordKey>
    // </GTSRequest>`;

    console.log("requestBody", requestBody);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      console.log("Response received:", response);
      const data = await response.text();
      console.log("Response text:", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        // console.log("Réponse serveur:", await response.text());
        console.log("Réponse serveur:", data);

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

        console.log("Geofence Supprimer avec succès.");
      } else {
        console.error(
          "Erreur lors de la Suppression du geofence:",
          response.statusText
        );
        console.log("Erreur lors de la Suppression du geofence");
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
      console.log("Erreur lors de la Suppression du geofence");
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
    incrementerRequête();
    console.log(
      "++++++++++++++++ Requête effectué: activerOuDesactiverGeofence"
    );

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

      console.log("Response received:", response);
      const data = await response.text();
      // console.log("Response text:", data);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        console.log("Réponse serveur:", data);

        setShowConfirmationMessagePopup(true); // succès  Échec
        setConfirmationMessagePopupTexte(
          `${t("Modification du geofence avec succès")}`
        );
        setConfirmationMessagePopupName(description);

        GeofenceDataFonction(account, username, password);

        navigate("/gestion_geofences?tab=geozone");

        console.log(
          `Geofence ${
            isActiveValue === 1 ? "activer" : "desactiver"
          } avec succès.`
        );
      } else {
        console.error(
          `Erreur lors de ${
            isActiveValue === 1 ? "l'activation" : "la desactivation"
          } du geofence:`,
          response.statusText
        );
        console.log(
          `Erreur lors de ${
            isActiveValue === 1 ? "l'activation" : "la desactivation"
          } du geofence:`
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
      console.log(
        `Erreur lors de ${
          isActiveValue === 1 ? "l'activation" : "la desactivation"
        } du geofence:`
      );

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

  const processVehicle = async (vehicle, isLastBatch = false) => {
    try {
      fetchVehicleDetails(vehicle?.deviceID, TimeFrom, TimeTo);
    } catch (error) {
      console.error("Erreur pour le véhicule", vehicle?.deviceID, ":", error);
    }
  };

  const processVehicleDetails = async (
    vehicle,
    isLastBatch = false,
    timeFrom,
    timeTo
  ) => {
    try {
      if (isLastBatch) {
        await fetchRapportVehicleDetails(
          vehicle?.deviceID,
          timeFrom || TimeFrom,
          timeTo || TimeTo
        );
      } else {
        fetchRapportVehicleDetails(
          vehicle?.deviceID,
          timeFrom || TimeFrom,
          timeTo || TimeTo
        );
      }
      await delay(500);
    } catch (error) {
      console.error("Erreur pour le véhicule", vehicle?.deviceID, ":", error);
    }
  };

  const processAllVehicles = async (vehicles, batchSize = 10) => {
    const total = vehicles?.length;
    let done = 0;

    for (let i = 0; i < total; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      const isLastBatch = i + batchSize >= total;

      for (const vehicle of batch) {
        await processVehicle(vehicle, isLastBatch);
        done += 1;
        setProgress(Math.round((done / total) * 100));
        setProgressDataUser(Math.round((done / total) * 100));
      }

      if (!isLastBatch) await delay(1500);
    }
  };

  const processAllVehiclesDetails = async (
    vehicles,
    timeFrom,
    timeTo,
    batchSize = 5
  ) => {
    const total = vehicles?.length;
    let done = 0;
    for (let i = 0; i < total; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      const isLastBatch = i + batchSize >= total;
      for (const vehicle of batch) {
        await processVehicleDetails(vehicle, isLastBatch, timeFrom, timeTo);
        done += 1;
        setProgress(Math.round((done / total) * 100));
        setProgressDataUser(Math.round((done / total) * 100));
      }
      if (!isLastBatch) await delay(1500);
    }
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
    // const accountID = account || localStorage.getItem("account") || "";
    // const userID = username || localStorage.getItem("username") || "";
    // const password = localStorage.getItem("password") || "";
    setDashboardLoadingEffect(true);

    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${accountID}" user="${userID}" password="${password}" />
        <Record table="Device" partial="true">
          <Field name="accountID">${accountID}</Field>

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

          
        </Record>
      </GTSRequest>`;

    console.log("currentAPI", currentAPI);
    console.log("currentcountry", currentCountry);
    console.log(
      "localStorage.getItem()",
      localStorage.getItem("currentCountry")
    );
    console.log("xmlData : ===>", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log(
        "data...... fetchvehiculeData......, accountID,    userID,  password,",
        accountID,
        userID,
        password,
        data
      );

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

      console.log("véhiculeData", véhiculeData);
      console.log("onlyLastResult", onlyLastResult);
      setVehicleData(véhiculeData);
      if (onlyLastResult) {
        setFetchVehicleDataFromRapportGroupe(false);
        // await delay(1000);
        if (véhiculeData?.length < 50) {
          setRunningAnimationProgressDuration(10);
        } else if (véhiculeData?.length < 100) {
          setRunningAnimationProgressDuration(20);
        } else if (véhiculeData?.length < 200) {
          setRunningAnimationProgressDuration(40);
        } else if (véhiculeData?.length < 300) {
          setRunningAnimationProgressDuration(60);
        } else if (véhiculeData?.length < 400) {
          setRunningAnimationProgressDuration(80);
        } else {
          setRunningAnimationProgressDuration(150);
        }
        setProgressAnimationStart(0);
        setRunningAnimationProgressLoading(true);

        processAllVehicles(véhiculeData);
      } else {
        setFetchVehicleDataFromRapportGroupe(true);

        // await delay(1000);
        if (véhiculeData?.length < 20) {
          setRunningAnimationProgressDuration(100);
        } else if (véhiculeData?.length < 50) {
          setRunningAnimationProgressDuration(200);
        } else if (véhiculeData?.length < 100) {
          setRunningAnimationProgressDuration(300);
        } else if (véhiculeData?.length < 200) {
          setRunningAnimationProgressDuration(400);
        } else if (véhiculeData?.length < 300) {
          setRunningAnimationProgressDuration(500);
        } else if (véhiculeData?.length < 500) {
          setRunningAnimationProgressDuration(600);
        } else {
          setRunningAnimationProgressDuration(700);
        }
        setProgressAnimationStart(0);
        setRunningAnimationProgressLoading(true);

        processAllVehiclesDetails(véhiculeData, timeFrom, timeTo);
      }

      handleUserError(xmlDoc);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des véhicules",
        error
      );
    }
  };

  const fetchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    // const accountID = account || localStorage.getItem("account") || "";
    // const userID = username || localStorage.getItem("username") || "";
    // const password = localStorage.getItem("password") || "";

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

      setVehicleDetails((prevDetails) => {
        const updatedDetails = prevDetails?.map((detail) => {
          if (detail.Device === Device) {
            return newVehicleDetails.length > 0
              ? { ...detail, véhiculeDetails: [...newVehicleDetails] }
              : detail;
          }
          return detail;
        });

        if (!updatedDetails.some((detail) => detail.Device === Device)) {
          updatedDetails.push({
            Device,
            véhiculeDetails: [...newVehicleDetails],
          });
        }

        return [...updatedDetails];
      });

      handleUserError(xmlDoc);
    } catch (error) {
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

    eventData.forEach((event) => {
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

    // try {
    //   setMergedDataHome(dataFusionne);
    //   // localStorage.setItem("mergedDataHome", JSON.stringify(dataFusionne));
    // } catch (error) {
    //   if (error.name === "QuotaExceededError") {
    //     console.error(
    //       "Quota dépassé pour mergedDataHome: essayez de réduire la taille des données ou de nettoyer localStorage."
    //     );
    //   } else {
    //     console.error("Erreur de stockage : ", error);
    //   }
    // }
    const hasDeviceID = Object.values(dataFusionne).some(
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
    incrementerRequête();
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

    console.log("TimeFrom", TimeFrom);
    console.log("TimeTo", TimeTo);
    console.log("adjustedTimeFrom", adjustedTimeFrom);
    console.log("adjustedTimeTo", adjustedTimeTo);
    console.log("addHoursFrom", addHoursFrom);
    console.log("addHoursTo", addHoursTo);

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

    console.log("xml:", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      console.log("Data........", data);
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

      console.log(
        "filteredVehicleDetails pour le device: :",
        Device,
        "---------",
        filteredVehicleDetails
      );

      // setRapportVehicleDetails((prevDetails) => [
      //   ...prevDetails.filter((detail) => detail.Device !== Device),
      //   ...filteredVehicleDetails,
      // ]);
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
    incrementerRequête();
    console.log(
      "++++++++++++++++ Requête effectué: fetchSearchRapportVehicleDetails"
    );

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

    const oneVehicleProcessed = dataFusionné.some(
      (véhicule) =>
        véhicule?.véhiculeDetails && véhicule?.véhiculeDetails.length > 0
    );

    if (oneVehicleProcessed) {
      setRapportDataLoading(false);

      console.log("Au moins un véhicule a ses détails mis à jour !");
    } else {
      console.log("Aucun véhicule n'a encore ses détails.");
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
      console.log("Tous les véhicules ont leurs détails mis à jour !");
      setSearchDonneeFusionnéForRapport(dataFusionné);
    } else {
      console.log("Certains véhicules n'ont pas encore leurs détails.");
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

      const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
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
          véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

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
          véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH >= 1);

        // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
        const lastUpdateTimeMs = véhicule?.lastUpdateTime
          ? véhicule?.lastUpdateTime * 1000
          : 0;
        const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

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

      // 4. Met à jour l'état avec tous les véhicules dont `véhiculeDetails[0].speedKPH >= 1`
      const véhiculeEnMouvementMaintenant = currentDataFusionné?.filter(
        (véhicule) =>
          véhicule?.véhiculeDetails &&
          véhicule?.véhiculeDetails?.length &&
          véhicule?.véhiculeDetails[0]?.speedKPH >= 1
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
          currentTime - lastUpdateTimeMs >= twentyHoursInMs;

        // Vérifier si le véhicule est actif
        const isActif = véhicule?.véhiculeDetails?.some(
          (detail) => detail.speedKPH >= 1
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
        console.log("mise a jour véhicule Details");

        const deviceID = currentVéhicule?.deviceID;

        const foundVehicle = currentDataFusionné?.find(
          (v) => v.deviceID === deviceID
        );

        setCurrentVéhicule(foundVehicle); // Définit le véhicule actuel
        setVéhiculeHistoriqueDetails(foundVehicle.véhiculeDetails);
        setSelectedVehicleToShowInMap(foundVehicle.deviceID); // Met à jour la sélection      console.log("Mise à jour régulière des données");
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

    console.log("TimeFrom", TimeFrom);
    console.log("TimeTo", TimeTo);
    console.log("adjustedTimeFrom", adjustedTimeFrom);
    console.log("adjustedTimeTo", adjustedTimeTo);
    console.log("addHoursFrom", addHoursFrom);
    console.log("addHoursTo", addHoursTo);

    console.log("Start fetching.........");
    setLoadingHistoriqueFilter(true);

    // if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log(
      "++++++++++++++++ Requête effectué: fetchHistoriqueVehicleDetails"
    );

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

    console.log("xmlData", xmlData);

    try {
      const response = await fetch(currentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("data", data);
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
      console.log("filteredVehicleDetails", filteredVehicleDetails);
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

        console.log(
          "foundVehicleWidthFilteredVehicleDetails",
          foundVehicleWidthFilteredVehicleDetails
        );
      } else {
        console.log("Pas d'appareil trouver avec l'ID:", Device);
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
        fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
      });
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Ajouter / Modifier / Supprimer
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // Fonction pour ajouter un nouveau véhicule

  //
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
  //
  //
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
      // Ajouter automatiquement "+" si le numéro commence par "509" et ne contient pas déjà un "+"
      const formattedNumber = numero.startsWith("509") ? `+${numero}` : numero;

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
  const fonctionTest = () => {};
  const fonctionTest2 = () => {};

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

  const processVehicleData = (currentData) => {
    return currentData?.map((item) => {
      const véhiculeDetails = item.véhiculeDetails;

      // Trouver le premier et le dernier index où speedKPH >= 1
      const firstValidIndex = véhiculeDetails.findIndex(
        (detail) => parseFloat(detail.speedKPH) >= 1
      );

      const lastValidIndex =
        véhiculeDetails.length -
        1 -
        véhiculeDetails
          .slice()
          .reverse()
          .findIndex((detail) => parseFloat(detail.speedKPH) >= 1) +
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

        // Trouver le dernier index où speedKPH >= 1
        const lastValidIndex = véhiculeDetails.findLastIndex(
          (detail) => parseFloat(detail.speedKPH) >= 1
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

  // PDF ref
  const testRef = useRef();
  const docInstallationRef = useRef();
  const docGestionAppareilRef = useRef();
  const docPositionAppareilRef = useRef();
  const docTrajetVehiculeRef = useRef();
  const docHistoriqueRef = useRef();
  const docRapportUniteRef = useRef();
  const docRapportGroupeRef = useRef();
  const docGestionGeozoneRef = useRef();

  //
  //
  //

  //

  const installation_sur_application_ref = useRef();
  const installation_sur_chrome_ref = useRef();

  const ajouter_nouveau_appareil_section_ref = useRef();
  const modidier_appareil_section_ref = useRef();
  const supprimer_appareil_section_ref = useRef();
  //
  //
  //
  const voir_position_appareil_ref = useRef();
  const position_choisir_autre_appareil_ref = useRef();
  const position_voir_tous_appareil_ref = useRef();
  const position_type_de_vue_ref = useRef();
  //
  //
  //
  const voir_trajet_ref = useRef();
  const trajet_recentrer_ref = useRef();
  const trajet_choix_autre_appareil_ref = useRef();
  const trajet_type_de_vue_ref = useRef();
  const trajet_recherche_ref = useRef();
  const trajet_retracer_trajet_ref = useRef();
  //
  //
  //
  //
  //
  const voir_historique_appareil_ref = useRef();
  const voir_position_historiquer_sur_carte_ref = useRef();
  const historique_choix_autre_appareil_ref = useRef();
  const historique_recherche_ref = useRef();
  //
  //
  //
  //
  const aller_page_rapport_unite_ref = useRef();
  const rapport_unite_autre_appareil_ref = useRef();
  const rapport_unite_recherche_ref = useRef();
  const rapport_unite_telecherche_pdf_ref = useRef();
  //
  //
  //
  //
  //
  const voir_rapport_groupe_ref = useRef();
  const rapport_groupe_recherche_ref = useRef();
  const rapport_groupe_telecharger_pdf_ref = useRef();
  //
  //
  //
  //
  const creer_geozone_ref = useRef();
  const modifier_geozone_ref = useRef();

  // const location = useLocation();
  // const navigate = useNavigate();

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
      console.log("Navigation vers :", lastPath);
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

  const [isUserNotInteractingNow, setIsUserNotInteractingNow] = useState(false);
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
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction);
    });

    const interval = setInterval(checkInactivity, 1000);

    checkInactivity();

    return () => {
      events.forEach((event) => {
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
        console.log("Caches supprimés");
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
        console.log("Taille du cache dépassée. Nettoyage...");
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
    groupeDevices,
    userGroupes,
    véhiculeDetails,
    gestionAccountData,
    mergedDataHome,
    geofenceData,
  ]);

  const sendGMailConfirmation = (accountConnected, user, country) => {
    // Obtenir la date et l'heure actuelles
    const now = new Date();
    const dateAujourdhui = now.toLocaleDateString("fr-FR"); // Format: JJ/MM/AAAA
    const hereActurel = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: HH:MM AM/PM
    //
    fetch("https://octagono-plus-email-server.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ["webdeveloper3030@gmail.com", "jfstjoy@gmail.com"],
        subject: `Connexion Reussi de ${accountConnected} / ${user}`,
        text: `Le client ${user} du compte ${accountConnected} s'est connecté le ${dateAujourdhui} à ${hereActurel} en ${
          country === "ht" ? "Haiti" : "Republique dominicaine"
        }`,

        // text: "Bonjour depuis React !",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));

    const message = `Le client ${user} du compte ${accountConnected} s'est connecté le ${dateAujourdhui} à ${hereActurel} en ${
      country === "ht" ? "Haiti" : "Republique dominicaine"
    }`;
    console.log("message envoyer:", message);
  };

  useEffect(() => {
    document.documentElement.style.overflow =
      documentationPage === "Localisation_devices" ||
      documentationPage === "Trajet_appareil"
        ? "hidden"
        : "auto";
  }, [documentationPage]);

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
        tableRef,
        rapportPersonnelPDFtRef,
        rapportGroupePDFtRef,

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
        seConnecterRef,
        docAddVehiculeRef,
        docModifierVehiculeRef,
        documentationPage,
        setDocumentationPage,
        docLocalisationVehiculeRef,
        docTrajetVehiculeRef,
        testRef,
        docInstallationRef,

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
        rapport_unite_autre_appareil_ref,
        rapport_unite_recherche_ref,
        rapport_unite_telecherche_pdf_ref,
        voir_rapport_groupe_ref,
        rapport_groupe_recherche_ref,
        rapport_groupe_telecharger_pdf_ref,
        creer_geozone_ref,
        modifier_geozone_ref,
        //
        docGestionAppareilRef,
        docPositionAppareilRef,
        docHistoriqueRef,
        docRapportUniteRef,
        docRapportGroupeRef,
        docGestionGeozoneRef,
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
        DeviceEnStationnement,
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
        // updateAccountDevicesWidthvéhiculeDetailsFonction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
