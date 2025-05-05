// DataContextProvider.js
import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import emailjs from "emailjs-com";
import Logout from "../components/login/Logout";

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  let x;
  const navigate = useNavigate();

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

  // const [updateAuto, setupdateAuto] = useState(() => {
  //   const storedupdateAuto = localStorage.getItem("updateAuto");
  //   return storedupdateAuto && storedupdateAuto !== "undefined"
  //     ? JSON.parse(storedupdateAuto)
  //     : false;
  // });
  const [updateAuto, setupdateAuto] = useState(false);

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
  const [documentationPage, setDocumentationPage] = useState("connecter");
  const seConnecterRef = useRef();
  const docAddVehiculeRef = useRef();
  const docModifierVehiculeRef = useRef();
  const docLocalisationVehiculeRef = useRef();

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  // to store login user data  // account, username, password
  // const [geofenceData, setGeofenceData] = useState(() => {
  //   const storedGeofenceData = localStorage.getItem("geofenceData");
  //   return storedGeofenceData ? JSON.parse(storedGeofenceData) : null;
  // });

  const [geofenceData, setGeofenceData] = useState(null);

  const geofenceDataRef = useRef(geofenceData);

  useEffect(() => {
    geofenceDataRef.current = geofenceData;
  }, [geofenceData]);

  // to know if the user is login or not
  const isAuthenticated = userData !== null;

  // variable to store the user personal login info
  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   setInterval(() => {
  //     // console.log("Se deconnecter");
  //     // console.log("username", localStorage.getItem("username"));
  //     if (
  //       (localStorage.getItem("username") || username) === "mdireny" ||
  //       (localStorage.getItem("username") || username) === "fpaulemon" ||
  //       (localStorage.getItem("username") || username) === "slouis" ||
  //       (localStorage.getItem("username") || username) === "foodforthepoor"
  //     ) {
  //       handleLogout();
  //       navigate("/login");
  //     }
  //   }, 10000);
  // }, []);

  // const [account, setAccount] = useState(() => {
  //   const storedAccount = localStorage.getItem("account");
  //   return storedAccount && storedAccount !== "undefined"
  //     ? JSON.parse(storedAccount)
  //     : null;
  // });

  // const [username, setUsername] = useState(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   return storedUsername && storedUsername !== "undefined"
  //     ? JSON.parse(storedUsername)
  //     : null;
  // });

  // const [password, setPassword] = useState(() => {
  //   const storedPassword = localStorage.getItem("password");
  //   return storedPassword && storedPassword !== "undefined"
  //     ? JSON.parse(storedPassword)
  //     : null;
  // });

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  // to show the log out popup
  const [logOutPopup, setLogOutPopup] = useState(false);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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

  // véhicule detail in home page
  const [vehicleDetails, setVehicleDetails] = useState(() => {
    const storedVehicleDetails = localStorage.getItem("vehicleDetails");
    return storedVehicleDetails && storedVehicleDetails !== "undefined"
      ? JSON.parse(storedVehicleDetails)
      : [];
  });

  const vehicleDetailsRef = useRef(vehicleDetails);

  useEffect(() => {
    vehicleDetailsRef.current = vehicleDetails;
  }, [vehicleDetails]);

  // véhiculeData and vehicleDetails together
  const [mergedDataHome, setMergedDataHome] = useState(null);
  // const [mergedDataHome, setMergedDataHome] = useState(() => {
  //   const storedMergedData = localStorage.getItem("mergedDataHome");
  //   return storedMergedData ? JSON.parse(storedMergedData) : null;
  // });

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
  //
  //
  //
  //
  //
  //
  //
  //

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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

  // rapportVehicleDetails and véhiculeData together
  // const [donneeFusionnéForRapport, setDonneeFusionnéForRapport] = useState(
  //   () => {
  //     const storedDonneeFusionnéForRapport = localStorage.getItem(
  //       "donneeFusionnéForRapport"
  //     );
  //     return storedDonneeFusionnéForRapport
  //       ? JSON.parse(storedDonneeFusionnéForRapport)
  //       : [];
  //   }
  // );

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
  const [error, setError] = useState(null);

  // Pour afficher le popup succès apres ajoute d'un nouveau appareil
  const [successAddVéhiculePopup, setSuccessAddVéhiculePopup] = useState(false);

  // Pour afficher un popup d'erreur lors de L’échec de l'ajout d'un appareil
  const [errorAddVéhiculePopup, setErrorAddVéhiculePopup] = useState(false);

  // Pour afficher un popup succès apres ajoute d'un nouveau appareil
  const [successModifierVéhiculePopup, setSuccessModifierVéhiculePopup] =
    useState(false);

  //  Pour afficher un popup d'erreur apres échec de modification d'un appareil
  const [errorModifierVéhiculePopup, setErrorModifierVéhiculePopup] =
    useState(false);

  // Pour afficher un popup succès apres suppression d'un appareil
  const [successDeleteVéhiculePopup, setSuccessDeleteVéhiculePopup] =
    useState(false);

  // Pour ajouter un popup échec apres échec de suppression d'un appareil
  const [errorDeleteVéhiculePopup, setErrorDeleteVéhiculePopup] =
    useState(false);

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

  //loading for Historique page
  const [loadingHistoriqueFilter, setLoadingHistoriqueFilter] = useState(false);

  // to show the map in the historique page
  const [showHistoriqueInMap, setShowHistoriqueInMap] = useState(false);

  // Pour stocker les donnee dans la page Historique
  const [véhiculeHistoriqueDetails, setVéhiculeHistoriqueDetails] = useState(
    []
  );

  const [historiqueSelectedLocationIndex, setHistoriqueSelectedLocationIndex] =
    useState(0);

  // Pour mettre a jour la variable apres changement.
  // useEffect(() => {
  //   console.log(véhiculeHistoriqueDetails);
  // }, [véhiculeHistoriqueDetails]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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
  let addHoursFrom = -17;
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
  //
  //
  //
  //
  //
  //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //
  //
  //   //

  // Ouvrir la base de données
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("mergedDataHome")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("mergedDataHome", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("geofenceData")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("geofenceData", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("donneeFusionnéForRapport")) {
          // Auto-incrémente sans keyPath pour stocker uniquement les données
          db.createObjectStore("donneeFusionnéForRapport", {
            autoIncrement: true,
          });
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
      if (data.length > 0) {
        setMergedDataHome(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("geofenceData").then((data) => {
      if (data.length > 0) {
        setGeofenceData(data);
      }
    });
  }, []);

  useEffect(() => {
    getDataFromIndexedDB("donneeFusionnéForRapport").then((data) => {
      if (data.length > 0) {
        setDonneeFusionnéForRapport(data);
      }
    });
  }, []);

  // Sauvegarder les données lorsqu'elles changent
  useEffect(() => {
    if (mergedDataHome) {
      saveDataToIndexedDB("mergedDataHome", mergedDataHome);
    }
  }, [mergedDataHome]);

  useEffect(() => {
    // console.log("geofenceData:", geofenceData);
    if (geofenceData) {
      saveDataToIndexedDB("geofenceData", geofenceData);
    }
  }, [geofenceData]);

  useEffect(() => {
    // console.log("donneeFusionnéForRapport:", donneeFusionnéForRapport);
    if (donneeFusionnéForRapport) {
      saveDataToIndexedDB("donneeFusionnéForRapport", donneeFusionnéForRapport);
    }
  }, [donneeFusionnéForRapport]);

  // Réinitialiser IndexedDB
  const resetIndexedDB = () => {
    indexedDB.deleteDatabase("MyDatabase");
    console.log("IndexedDB a été réinitialisé.");
  };
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
  //
  //
  //
  //
  //
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
  const handleLogin = async (account, user, password) => {
    // Pour suivre le nombre de requête
    console.log("account : ===>", account);
    console.log("user : ===>", user);
    console.log("password : ===>", password);
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: handleLogin");
    // /////////
    setIsHomePageLoading(true);
    setError(null);

    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${account}" user="${user}" password="${password}" />
        <Record table="User" partial="true">
          <Field name="accountID">${account}</Field>
          <Field name="userID">${account}</Field>
        </Record>
      </GTSRequest>`;

    // console.log("xmlData ===>", xmlData);

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("Login data message: ", data);
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

        try {
          setUserData(userData);
          localStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
          if (error.name === "QuotaExceededError") {
            console.error(
              "Quota dépassé pour userData : essayez de réduire la taille des données ou de nettoyer localStorage."
            );
          } else {
            console.error("Erreur de stockage : ", error);
          }
        }

        setUserData(userData);
        navigate("/home");

        // Stocker les informations de connexion en local
        localStorage.setItem("account", account);
        localStorage.setItem("username", user);
        localStorage.setItem("password", password);

        setAccount(localStorage.getItem("account") || "");
        setUsername(localStorage.getItem("username") || "");
        setPassword(localStorage.getItem("password") || "");

        // if (
        //   user === "mdireny" ||
        //   user === "fpaulemon" ||
        //   user === "slouis" ||
        //   user === "foodforthepoor"
        // ) {
        //   handleLogout();
        //   navigate("/login");
        // }

        // Envoie d'un mail pour avertir m'avertir de la connexion

        if (window.location.hostname !== "localhost") {
          // Exécuter la fonction seulement si ce n'est pas localhost
          sendConfirmConnexionMail(account, user);
          sendConfirmConnexionMail2(account, user);
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
      setError("Erreur lors de la connexion à l'API.");
      console.error("Erreur lors de la connexion à l'API", error);
      setIsHomePageLoading(false);
    } finally {
      setIsHomePageLoading(false);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // reloadHomePage();
  //     const accountConnexion = username || localStorage.getItem("account");
  //     const usernameConnexion = username || localStorage.getItem("username");
  //     const passwordConnexion = username || localStorage.getItem("password");

  //     console.log("Verification identite...............");

  //     if (accountConnexion && usernameConnexion && passwordConnexion) {
  //       // console.log("username useefect :", usernameConnexion);
  //       // handleLogin(accountConnexion, usernameConnexion, passwordConnexion);
  //     }
  //   }, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

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

  // pour stoker les donnees de l'utilisateur en local
  useEffect(() => {
    // Récupérer les informations de localStorage
    setAccount(localStorage.getItem("account") || "");
    setUsername(localStorage.getItem("username") || "");
    setPassword(localStorage.getItem("password") || "");
  }, []);

  // Fonction pour se déconnecter de l’application
  const handleLogout = () => {
    setShowSideBar(true);
    setLogOutPopup(false);

    localStorage.removeItem("userData");
    setUserData(null);

    // localStorage.removeItem("geofenceData");
    setGeofenceData(null);

    localStorage.removeItem("véhiculeData");
    setVehicleData(null);

    localStorage.removeItem("vehicleDetails");
    setVehicleDetails([]);

    localStorage.removeItem("mergedDataHome");
    setMergedDataHome(null);

    // localStorage.removeItem("donneeFusionnéForRapport");
    setDonneeFusionnéForRapport([]);

    setVéhiculeActiveToday([]);
    setVéhiculeNotActiveToday([]);
    setVéhiculeHorsService([]);
    setVéhiculeEnMouvementMaintenant([]);
    setSearchDonneeFusionnéForRapport([]);

    localStorage.removeItem("rapportVehicleDetails");
    setRapportVehicleDetails([]);

    localStorage.removeItem("selectedTimeZone");
    setSelectedTimeZone("");

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

    setStatisticFilterInHomePage();
    setStatisticFilterTextInHomePage("");
    // localStorage.clear();
    currentDataFusionné = [];
    setCurrentVéhicule(null);

    resetIndexedDB(); // Vide le localStorage
    window.location.reload(); // Rafraîchit la page
    window.location.reload(); // Rafraîchit la page
    navigate("/login");
  };
  //

  function sendConfirmConnexionMail(account, user) {
    // if (e) e.preventDefault(); // Empêche le rechargement de la page

    // setLoading(true); // Active le mode chargement

    const serviceID = "service_1fuirwo";
    const templateID = "template_1ohyj6l";
    const publicKey = "1c_u66zneOqI3RQi0"; // Clé publique

    const accountConnected = account || localStorage.getItem("account") || "";
    const now = new Date();
    const dateAujourdhui = now.toLocaleDateString("fr-FR"); // Format: JJ/MM/AAAA
    const heureActuel = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: HH:MM AM/PM

    // Récupérer l'adresse IP publique
    fetch("https://api4.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipClient = data.ip; // Adresse IP du client

        // Mise à jour des params avec toutes les informations demandées
        const params = {
          userAccount: accountConnected,
          userName: user || "Utilisateur inconnu", // Si user n'est pas fourni
          date: dateAujourdhui,
          heure: heureActuel,
          adresseIp: ipClient,
        };

        emailjs.init(publicKey);

        emailjs
          .send(serviceID, templateID, params)
          .then((res) => {
            console.log(res);
            console.log("Envoi du mail de connexion avec succès");
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Erreur lors de l'envoi du message. Veuillez réessayer."
            );
          })
          .finally(() => {
            console.log("Envoi du mail de connexion terminé");
          });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération de l'adresse IP :",
          error
        );
      });
  }

  function sendConfirmConnexionMail22(account, user) {
    // if (e) e.preventDefault(); // Empêche le rechargement de la page

    // setLoading(true); // Active le mode chargement

    const serviceID = "service_vsuzpsx";
    const templateID = "template_e11xt3v";
    const publicKey = "Y4DfcLA5moa5C1k6K"; // Clé publique

    const accountConnected = account || localStorage.getItem("account") || "";
    const now = new Date();
    const dateAujourdhui = now.toLocaleDateString("fr-FR"); // Format: JJ/MM/AAAA
    const heureActuel = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: HH:MM AM/PM

    // Récupérer l'adresse IP publique
    fetch("https://api4.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipClient = data.ip; // Adresse IP du client

        // Mise à jour des params avec toutes les informations demandées
        const params = {
          userAccount: accountConnected,
          userName: user || "Utilisateur inconnu", // Si user n'est pas fourni
          date: dateAujourdhui,
          heure: heureActuel,
          adresseIp: ipClient,
        };

        emailjs.init(publicKey);

        emailjs
          .send(serviceID, templateID, params)
          .then((res) => {
            console.log(res);
            console.log("Envoi du mail de connexion avec succès");
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Erreur lors de l'envoi du message. Veuillez réessayer."
            );
          })
          .finally(() => {
            console.log("Envoi du mail de connexion terminé");
          });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération de l'adresse IP :",
          error
        );
      });
  }

  function sendConfirmConnexionMail2(account, user) {
    const serviceID = "service_vsuzpsx";
    const templateID = "template_e11xt3v";
    const publicKey = "Y4DfcLA5moa5C1k6K"; // Clé publique

    // Obtenir la date et l'heure actuelles
    const now = new Date();
    const dateAujourdhui = now.toLocaleDateString("fr-FR"); // Format: JJ/MM/AAAA
    const hereActurel = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // Format: HH:MM AM/PM

    // Exemple de client connecté (vous pouvez récupérer cette valeur dynamiquement)
    const accountConnected = account || localStorage.getItem("account") || "";

    const params = {
      message: `Le client ${accountConnected} s'est connecté le ${dateAujourdhui} à ${hereActurel}`,
    };

    emailjs.init(publicKey);

    emailjs
      .send(serviceID, templateID, params)
      .then((res) => {
        console.log(res);
        // alert("Votre message a été envoyé avec succès !");
      })
      .catch((err) => {
        console.log(err);
        // alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
      })
      .finally(() => {
        // setLoading(false); // Désactive le mode chargement après l'envoi
      });
  }

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
  const GeofenceDataFonction = async () => {
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: GeofenceDataFonction");

    // /////////
    console.log("Startttttt geofence");

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const xmlData = `<GTSRequest command="dbget">
      <Authorization account="${account}" user="${username}" password="${password}" />
      <Record table="Geozone" partial="true">
        <Field name="accountID">${account}</Field>
        <Field name="descriptionZone" />
      </Record>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
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

  // console.log(
  //   "%cGeofence Details",
  //   "color: red; font-weight: bold; font-size: 14px;",
  //   "\nDescription:",
  //   description,
  //   "\nGeozone ID:",
  //   geozoneID,
  //   "\nRadius:",
  //   radius,
  //   "\nZone Type:",
  //   zoneType,
  //   "\nZoom Region:",
  //   zoomRegion,
  //   "\nLast Update Time:",
  //   lastUpdateTime,
  //   "\nAccount ID:",
  //   accountID,
  //   "\nColor:",
  //   color,
  //   "\nCoordinates:",
  //   `\n  Latitude1: ${lat1}, Longitude1: ${lng1}`,
  //   `\n  Latitude2: ${lat2}, Longitude2: ${lng2}`,
  //   `\n  Latitude3: ${lat3}, Longitude3: ${lng3}`,
  //   `\n  Latitude4: ${lat4}, Longitude4: ${lng4}`,
  //   `\n  Latitude5: ${lat5}, Longitude5: ${lng5}`,
  //   `\n  Latitude6: ${lat6}, Longitude6: ${lng6}`,
  //   `\n  Latitude7: ${lat7}, Longitude7: ${lng7}`,
  //   `\n  Latitude8: ${lat8}, Longitude8: ${lng8}`
  // );

  const [succesCreateGeofencePopup, setSuccesCreateGeofencePopup] =
    useState(false);
  const [succesModifierGeofencePopup, setSuccesModifierGeofencePopup] =
    useState(false);
  const [succesDeleteGeofencePopup, setSuccesDeleteGeofencePopup] =
    useState(false);

  const [errorCreateGeofencePopup, setErrorCreateGeofencePopup] =
    useState(false);
  const [errorModifierGeofencePopup, setErrorModifierGeofencePopup] =
    useState(false);
  const [errorDeleteGeofencePopup, setErrorDeleteGeofencePopup] =
    useState(false);

  const [createGeofenceLoading, setCreateGeofenceLoading] = useState(false);

  const [currentGeozone, setCurrentGeozone] = useState();

  const [isEditingGeofence, setIsEditingGeofence] = useState(false);
  // console.log(
  //   "%cGeofence Details",
  //   "color: red; font-weight: bold; font-size: 14px;",
  //   "\nDescription:",
  //   description,

  //   "\nColor:",
  //   color,
  //   "\nCoordinates:",
  //   `\n  Latitude1: ${lat1}, Longitude1: ${lng1}`,
  //   `\n  Latitude2: ${lat2}, Longitude2: ${lng2}`,
  //   `\n  Latitude3: ${lat3}, Longitude3: ${lng3}`,
  //   `\n  Latitude4: ${lat4}, Longitude4: ${lng4}`,
  //   `\n  Latitude5: ${lat5}, Longitude5: ${lng5}`,
  //   `\n  Latitude6: ${lat6}, Longitude6: ${lng6}`,
  //   `\n  Latitude7: ${lat7}, Longitude7: ${lng7}`,
  //   `\n  Latitude8: ${lat8}, Longitude8: ${lng8}`
  // );

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
    lng8
  ) => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: createNewGeofence");

    // /////////

    setCreateGeofenceLoading(true);
    setErrorCreateGeofencePopup(false);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const geozoneID = `${description.toLowerCase().replace(/\s+/g, "_")}`;
    const sortID = `${description.toLowerCase().replace(/\s+/g, "_")}`;

    const isActive = 0;

    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${account}" user="${username}" password="${password}" />
      <Record table="Geozone" partial="false">
        <Field name="accountID">${account}</Field>


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

    try {
      console.log("Sending request to create Geofence...");
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
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
        console.log("Geofence created successfully...");
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
        setErrorCreateGeofencePopup(false);
        setSuccesCreateGeofencePopup(true);
        GeofenceDataFonction();
        navigate("/gestion_geofences?tab=geozone");
      } else {
        console.log("Error occurred while creating Geofence...");
        setCreateGeofenceLoading(false);
        setErrorCreateGeofencePopup(true);

        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        console.error("Error message:", errorMessage);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      setError("Échec de la création du Geofence.");
      console.error("Échec de la création du Geofence", error);
      setCreateGeofenceLoading(false);
      setErrorCreateGeofencePopup(true);
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
    lng8
  ) => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: ModifierGeofence");

    // /////////

    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const isActive = 0;

    // const description = "Test ajout";

    const requestBody = `<GTSRequest command="dbput">
    <Authorization account="${account}" user="${username}" password="${password}" />
    <Record table="Geozone" partial="false">
    <Field name="accountID">${account}</Field>
    
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

    try {
      const response = await fetch("/api/track/Service", {
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
        // console.log("Réponse serveur:", await response.text());
        console.log("Réponse serveur:", data);

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

        setSuccesModifierGeofencePopup(true);
        setCreateGeofenceLoading(false);
        setErrorModifierGeofencePopup(false);
        GeofenceDataFonction();

        navigate("/gestion_geofences?tab=geozone");

        console.log("Geofence modifié avec succès.");
      } else {
        console.error(
          "Erreur lors de la modification du geofence:",
          response.statusText
        );
        console.log("Erreur lors de la modification du geofence");
        setErrorModifierGeofencePopup(true);
        setCreateGeofenceLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      console.log("Erreur lors de la modification du geofence");
      setErrorModifierGeofencePopup(true);
      setCreateGeofenceLoading(false);
    }
  };

  const supprimerGeofence = async (geozoneID) => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: supprimerGeofence");

    // /////////

    setCreateGeofenceLoading(true);

    const account = localStorage.getItem("account") || "";
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const requestBody = `<GTSRequest command="dbdel">
    <Authorization account="${account}" user="${username}" password="${password}" />

    <Record table="Geozone" partial="false">
    <Field name="accountID">${account}</Field>

    <Field name="geozoneID">${geozoneID}</Field>
    <Field name="sortID">${geozoneID}</Field>

      </Record>



       <RecordKey table="Geozone" partial="false">
    <Field name="accountID">${account}</Field>

    <Field name="geozoneID">${geozoneID}</Field>
    <Field name="sortID">${geozoneID}</Field>

      </RecordKey>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
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
        // console.log("Réponse serveur:", await response.text());
        console.log("Réponse serveur:", data);

        setGeofenceData((geofences) =>
          geofences.filter((geofence) => geofence?.geozoneID !== geozoneID)
        );

        setSuccesDeleteGeofencePopup(true);
        setCreateGeofenceLoading(false);
        setErrorDeleteGeofencePopup(false);
        // GeofenceDataFonction();

        //
        // Supprimer la geozone de IndexedDB
        openDatabase().then((db) => {
          const transaction = db.transaction(["geofenceData"], "readwrite");
          const store = transaction.objectStore("geofenceData");

          const deleteRequest = store.openCursor();
          deleteRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              if (cursor.value.geozoneID === geozoneID) {
                cursor.delete();
              }
              cursor.continue();
            }
          };

          transaction.oncomplete = () => {
            console.log("Geozone supprimée de IndexedDB.");
          };

          transaction.onerror = () => {
            console.error(
              "Erreur lors de la suppression de la geozone dans IndexedDB."
            );
          };
        });

        //

        navigate("/gestion_geofences?tab=geozone");

        console.log("Geofence Supprimer avec succès.");
      } else {
        console.error(
          "Erreur lors de la Suppression du geofence:",
          response.statusText
        );
        console.log("Erreur lors de la Suppression du geofence");
        setErrorDeleteGeofencePopup(true);
        setCreateGeofenceLoading(false);
      }
    } catch (error) {
      console.log("Erreur lors de la Suppression du geofence");
      setErrorDeleteGeofencePopup(true);
      setCreateGeofenceLoading(false);
      handleUserError(xmlDoc);
    }
  };

  const activerOuDesactiverGeofence = async (geozoneID, isActiveValue) => {
    if (!userData) return;
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
      const response = await fetch("/api/track/Service", {
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
        // console.log("Réponse serveur:", await response.text());
        console.log("Réponse serveur:", data);

        // setGeofenceData((geofences) =>
        //   geofences.map((geofence) =>
        //     geofence?.geozoneID === geozoneID
        //       ? {
        //           ...geofence,
        //           isActive,
        //           color,
        //           lat1,
        //           lng1,
        //           lat2,
        //           lng2,
        //           lat3,
        //           lng3,
        //           lat4,
        //           lng4,
        //           lat5,
        //           lng5,
        //           lat6,
        //           lng6,
        //           lat7,
        //           lng7,
        //           lat8,
        //           lng8,
        //         }
        //       : geofence
        //   )
        // );

        // setSuccesModifierGeofencePopup(true);
        // setCreateGeofenceLoading(false);
        // setErrorModifierGeofencePopup(false);

        GeofenceDataFonction();

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
        setErrorModifierGeofencePopup(true);
        setCreateGeofenceLoading(false);
        handleUserError(xmlDoc);
      }
    } catch (error) {
      console.log(
        `Erreur lors de ${
          isActiveValue === 1 ? "l'activation" : "la desactivation"
        } du geofence:`
      );
      setErrorModifierGeofencePopup(true);
      setCreateGeofenceLoading(false);
    }
  };

  const activerOuDesactiverGeofence2 = (value) => {
    console.log("Desactivation du geofence", currentGeozone?.description);
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
  //  Home page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  x;
  // Requête pour afficher tous les véhicule mais sans details
  const fetchVehicleData = async () => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    // console.log("++++++++++++++++ Requête effectué: fetchVehicleData");

    // const { accountID, userID, password } = userData;

    const accountID = account || localStorage.getItem("account") || "";
    const userID = username || localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

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
        </Record>
      </GTSRequest>`;

    // console.log("xmlData : ===>", xmlData);

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("Data fetchVehicleData", data);
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

      if (véhiculeData && véhiculeData?.length > 0) {
        véhiculeData?.forEach((véhicule) => {
          fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
          fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
        });
      }
      handleUserError(xmlDoc);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des véhicules",
        error
      );
    }
  };

  // Requête pour rechercher les details des véhicule dans la page home
  const fetchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    // console.log("++++++++++++++++ Requête effectué: fetchVehicleDetails");

    // /////////

    // Ajuste les heures de TimeFrom et TimeTo
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    // const { accountID, userID, password } = userData;
    const accountID = account || localStorage.getItem("account") || "";
    const userID = username || localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${adjustedTimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${adjustedTimeTo}</TimeTo>

        <GPSRequired>false</GPSRequired>
        <StatusCode>false</StatusCode>
        <Limit type="last">4</Limit>
        <Ascending>false</Ascending>
        <Field name="latitude" />
        <Field name="longitude" />
        <Field name="address" />
        <Field name="speedKPH" />
        <Field name="timestamp" />
        <Field name="heading" />
        <Field name="city" />
        <Field name="creationMillis" />
        <Field name="creationTime" />
        <Field name="odometerKM" />
        <Field name="stateProvince" />
        <Field name="statusCode" />
        <Field name="streetAddress" />

      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      const data = await response.text();
      // console.log("data brut de :", fetchVehicleDetails);
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

      // Filtrage des timestamps
      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = newVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000; // Convertir en millisecondes
        return (
          recordTimestamp >= timeFromTimestamp &&
          recordTimestamp <= timeToTimestamp
        );
      });

      setVehicleDetails((prevDetails) => {
        const updatedDetails = prevDetails?.map((detail) => {
          if (detail.Device === Device) {
            return filteredVehicleDetails.length > 0
              ? { ...detail, véhiculeDetails: [...filteredVehicleDetails] }
              : detail;
          }
          return detail;
        });

        // Si le véhicule n'est pas trouvé, ajoute-le
        if (!updatedDetails.some((detail) => detail.Device === Device)) {
          updatedDetails.push({
            Device,
            véhiculeDetails: [...filteredVehicleDetails],
          });
        }

        // if (updatedDetails && updatedDetails.length > 0) {
        //   mergeVehicleDataWithEvents(updatedDetails);
        // }

        return [...updatedDetails];
      });

      handleUserError(xmlDoc);

      // mergeVehicleDataWithEvents();
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

    try {
      setMergedDataHome(dataFusionne);
      // localStorage.setItem("mergedDataHome", JSON.stringify(dataFusionne));
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error(
          "Quota dépassé pour mergedDataHome: essayez de réduire la taille des données ou de nettoyer localStorage."
        );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

    setMergedDataHome(dataFusionne);
    setIsHomePageLoading(false);

    return dataFusionne;
  };

  // Pour lancer la requête de details des véhicules
  // ????????????????????????????????????????????????????????????????????????????
  useEffect(() => {
    if (userData) {
      fetchVehicleData();
    }
  }, [userData]);

  // Premier appelle de donnee pour les details de véhicule de la page home et rapport
  // ????????????????????????????????????????????????????????????????????????????
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // useEffect(() => {
  //   if (
  //     véhiculeData &&
  //     véhiculeData?.length > 0 &&
  //     (vehicleDetailsRef.current?.length <= 0 || vehicleDetails?.length <= 0)
  //   ) {
  //     véhiculeData?.forEach((véhicule) => {
  //       console.log(
  //         "Recherche de donnee pour : vehiculeDetails  // pas de donnee"
  //       );
  //       fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
  //     });
  //   }

  //   if (
  //     véhiculeData &&
  //     véhiculeData?.length > 0 &&
  //     (rapportVehicleDetailsRef.current.length <= 0 ||
  //       rapportVehicleDetails.length <= 0)
  //   ) {
  //     véhiculeData?.forEach((véhicule) => {
  //       console.log(
  //         "Recherche de donnee pour : RapportvehiculeDetails  // pas de donnee"
  //       );

  //       fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
  //     });
  //   }
  // }, [véhiculeData]);

  // Pour mettre a jour les donnees
  const homePageReload = () => {
    // const vehicleDataDB = await getDataFromIndexedDB("mergedDataHome");
    fetchVehicleData();
    console.log("Start fetching.............");
    if (véhiculeDataRef?.current?.length > 0 || véhiculeData?.length > 0) {
      console.log("reload HomePage");
      (véhiculeDataRef?.current || véhiculeData)?.forEach((véhicule) => {
        fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
        fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
      });
    }

    // if (véhiculeData && véhiculeData?.length > 0) {
    //   véhiculeData?.forEach((véhicule) => {
    //     fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
    //     fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
    //   });
    // }
  };

  // Mise a jour les donnee de rapport page tous les 1 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      // reloadHomePage();
      if (updateAuto) {
        if (véhiculeDataRef?.current?.length > 0 || véhiculeData?.length > 0) {
          console.log("HomePage Reload start....");
          // console.log("reload HomePage");
          (véhiculeDataRef?.current || véhiculeData)?.forEach((véhicule) => {
            fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
            fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
          });
          setEstLancerUpdateAuto(true);
        }
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [updateAuto, véhiculeDataRef?.current, véhiculeData]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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

    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console
      .log
      // "++++++++++++++++ Requête effectué: fetchRapportVehicleDetails"
      ();

    // /////////
    // Ajuste les heures de TimeFrom et TimeTo

    // const { accountID, userID, password } = userData;
    const accountID = account || localStorage.getItem("account") || "";
    const userID = username || localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";

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
        <Field name="city" />
        <Field name="creationMillis" />
        <Field name="creationTime" />
        <Field name="odometerKM" />
        <Field name="stateProvince" />
        <Field name="statusCode" />
        <Field name="streetAddress" />


        
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
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

      setRapportVehicleDetails((prevDetails) => [
        ...prevDetails.filter((detail) => detail.Device !== Device),
        ...filteredVehicleDetails,
      ]);
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

    const getTodayTimestamp = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Minuit
      return Math.floor(now.getTime() / 1000); // Convertir en secondes
    };
    const todayTimestamp = getTodayTimestamp() * 1000;

    // Récupérer les anciens détails depuis localStorage
    const previousData = (() => {
      try {
        // Initialiser une valeur par défaut vide avant de charger les données de IndexedDB
        let data = [];

        // Charger les données depuis IndexedDB
        getDataFromIndexedDB("donneeFusionnéForRapport").then((result) => {
          // Vérifier si les données sont valides et les définir
          data = Array.isArray(result) ? result : [];
        });

        return data || Array.isArray(donneeFusionnéForRapport)
          ? donneeFusionnéForRapport
          : [];
        // const data = donneeFusionnéForRapport;

        // return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du localStorage:",
          error
        );
        return [];
      }
    })();

    const dataFusionné = véhiculeData.map((véhicule) => {
      // Trouver les nouveaux détails pour le véhicule
      const newDetails = rapportVehicleDetails?.filter(
        (detail) => detail.Device === véhicule?.deviceID
      );

      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0); // Met l'heure à 00:00:00.000

      const previousDetails = previousData
        ?.find((prev) => prev.deviceID === véhicule?.deviceID)
        ?.véhiculeDetails?.filter((detail) => {
          const timestampDate = new Date(detail.timestamp * 1000); // Conversion du timestamp en date
          return timestampDate >= todayMidnight;
        });

      // const previousDetails = Array.isArray(previousData)
      //   ? previousData
      //       ?.find((prev) => prev.deviceID === véhicule?.deviceID)
      //       ?.véhiculeDetails?.filter((detail) => {
      //         const timestampDate = new Date(detail.timestamp * 1000); // Conversion du timestamp en date
      //         return timestampDate >= todayMidnight;
      //       })
      //   : [];

      // const previousDetails = previousData.find(
      //   (prev) => prev.deviceID === véhicule?.deviceID
      // )?.véhiculeDetails;

      // Conserver les anciens détails si aucun nouveau n'est trouvé
      const updatedDetails =
        newDetails && newDetails.length > 0
          ? newDetails
          : previousDetails || [];

      // // Fonction pour obtenir le timestamp d'aujourd'hui à minuit

      // // const updatedDetails =
      // //   newDetails && newDetails.length > 0
      // //     ? newDetails.filter((detail) => detail.timestamp >= todayTimestamp)
      // //     : (previousDetails || []).filter(
      // //         (detail) => detail.timestamp >= todayTimestamp
      // //       );

      return {
        ...véhicule,
        véhiculeDetails: updatedDetails,
      };
    });

    // Met à jour l'état avec les données fusionnées
    setDonneeFusionnéForRapport(dataFusionné);

    try {
      setDonneeFusionnéForRapport(dataFusionné);

      // localStorage.setItem(
      //   "donneeFusionnéForRapport",
      //   JSON.stringify(dataFusionné)
      // );
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        // console.error(
        //   "Quota dépassé pour donneeFusionnéForRapport : essayez de réduire la taille des données ou de nettoyer localStorage."
        // );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

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
  const fetchSearchRapportVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    // Ajuste les heures de TimeFrom et TimeTo
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    if (!userData) return;
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
        <Field name="city" />
        <Field name="creationMillis" />
        <Field name="creationTime" />
        <Field name="odometerKM" />
        <Field name="stateProvince" />
        <Field name="statusCode" />
        <Field name="streetAddress" />
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
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

  // Pour mettre a jour la variable searchDonneeFusionnéForRapport
  // useEffect(() => {
  //   console.log(
  //     "Mise à jour de searchDonneeFusionnéForRapport:",
  //     searchDonneeFusionnéForRapport
  //   );
  // }, [searchDonneeFusionnéForRapport]);

  // Pour lancer le fusionnement de donnee de recherche par date des fonctions fetchSearchRapportVehicleDetails et rapportSearchFusionnerDonnees
  useEffect(() => {
    if (searchRapportVehicleDetails.length > 0 && véhiculeData?.length > 0) {
      rapportSearchFusionnerDonnees();
    }
  }, [searchRapportVehicleDetails, véhiculeData]);

  // Pour mettre a jour la variable rapportDataLoading
  // useEffect(() => {
  //   console.log("rapportDataLoading >>>>>>>>>>>>.", rapportDataLoading);
  // }, [rapportDataLoading]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
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
  let currentDataFusionné =
    searchDonneeFusionnéForRapport.length > 0
      ? searchDonneeFusionnéForRapport
      : donneeFusionnéForRapport;

  //  Pour filtrer les donnees dans la page rapport
  useEffect(() => {
    if (
      searchDonneeFusionnéForRapport.length > 0 &&
      currentDataFusionné &&
      currentDataFusionné?.length > 0
    ) {
      // 2. Met à jour l'état avec tous les véhicules ayant au moins un événement avec `speedKPH >= 1`
      const véhiculeActiveToday = currentDataFusionné?.filter((véhicule) =>
        véhicule?.véhiculeDetails?.some((detail) => detail.speedKPH >= 1)
      );
      setVéhiculeActiveToday(véhiculeActiveToday);

      //
      //
      //
      //
      //
      //
      //
      // 3. Met à jour l'état avec tous les véhicules n'ayant aucun événement avec `speedKPH >= 1`
      const véhiculeNotActiveToday = currentDataFusionné?.filter(
        (véhicule) =>
          véhicule?.véhiculeDetails?.length > 0 && // Vérifie que des détails existent
          véhicule?.véhiculeDetails.every((detail) => detail.speedKPH <= 0) // Tous les détails doivent avoir speedKPH <= 0
      );

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
      const véhiculeHorsService = currentDataFusionné?.filter((véhicule) => {
        const lastUpdate = new Date(véhicule?.lastUpdateTime);
        const now = new Date();
        const diffHeures = (now - lastUpdate) / (1000 * 60 * 60);
        return véhicule?.véhiculeDetails?.length <= 0 || diffHeures > 24;
      });

      setVéhiculeHorsService(véhiculeHorsService);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (
      searchDonneeFusionnéForRapport.length <= 0 &&
      currentDataFusionné &&
      currentDataFusionné?.length > 0
    ) {
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

        return hasBeenMoving && isToday;
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
          hasDetails && isActive && (noSpeed || (hasBeenMoving && !isToday))
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
  }, [
    currentDataFusionné,
    searchDonneeFusionnéForRapport,
    donneeFusionnéForRapport,
  ]);

  // Fonction pour mettre à jour le véhicule actuel
  const updateCurrentVéhicule = () => {
    if (currentDataFusionné?.length > 0) {
      const updatedVéhicule = currentDataFusionné.find(
        (véhicule) => véhicule?.deviceID === currentVéhicule?.deviceID
      );
      if (updatedVéhicule) {
        setCurrentVéhicule(updatedVéhicule);
        setVéhiculeHistoriqueDetails(updatedVéhicule?.véhiculeDetails);
        setSelectedVehicleToShowInMap(updatedVéhicule.deviceID);
      }
    }
  };

  // Utilisation d'un effet pour surveiller les mises à jour de data
  // Pour mettre a jour le véhicule actuelle
  // useEffect(() => {
  //   console.log("current véhicule actuel mise a jour maintenant.....");
  //   updateCurrentVéhicule();
  // }, [currentDataFusionné]);

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

  // Pour mettre a jour le véhicule actuelle
  // ?????????????????????????????????

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (geofenceDataRef.current?.length > 0 || geofenceData?.length > 0) {
  //       console.log(
  //         " il y a des donnees de geofence disponible  11111111111111111111111111111111",
  //         geofenceDataRef.current,
  //         geofenceData
  //       );
  //     } else {
  //       GeofenceDataFonction();
  //       console.log(
  //         "Pas de donnee dans geofence 111111111111111111111111111111",
  //         geofenceDataRef.current,
  //         geofenceData
  //       );
  //     }

  //     if (véhiculeDataRef.current?.length > 0 || véhiculeData?.length > 0) {
  //       console.log(
  //         " il y a des donnees de véhiculeData home disponible 22222222222222222222",
  //         véhiculeDataRef.current
  //       );
  //     } else {
  //       console.log(
  //         " il n'y a de donnees de véhiculeData home disponible 2222222222222222222222222222",
  //         véhiculeDataRef.current,
  //         véhiculeData
  //       );
  //       fetchVehicleData();
  //     }
  //     //
  //     //
  //     //
  //     //
  //     //
  //     //
  //     if (
  //       (véhiculeDataRef.current?.length > 0 || véhiculeData?.length > 0) &&
  //       (vehicleDetailsRef.current?.length > 0 || vehicleDetails?.length > 0)
  //     ) {
  //       console.log(
  //         " il y a des donnees de details home disponible 33333333333333333",
  //         vehicleDetailsRef.current
  //       );
  //     } else {
  //       console.log(
  //         "Pas de donnee dans details home disponible 333333333333333333333333333333333333",
  //         vehicleDetailsRef.current,
  //         vehicleDetails
  //       );
  //       if (véhiculeDataRef.current && véhiculeDataRef.current?.length > 0) {
  //         véhiculeDataRef.current.forEach((véhicule) => {
  //           fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
  //         });
  //       }
  //     }
  //     //
  //     //
  //     //
  //     //
  //     //
  //     //
  //     if (
  //       (véhiculeDataRef.current?.length > 0 || véhiculeData?.length > 0) &&
  //       (rapportVehicleDetailsRef.current?.length > 0 ||
  //         rapportVehicleDetails?.length > 0 ||
  //         rapportVehicleDetails != null ||
  //         rapportVehicleDetailsRef.current != null)
  //     ) {
  //       console.log(
  //         " il y a des donnees de rapport disponible 4444444444444444444444",
  //         rapportVehicleDetailsRef.current
  //       );
  //     } else {
  //       console.log(
  //         "Pas de donnees de rapport disponible 444444444444444444444444444444444",
  //         rapportVehicleDetailsRef.current,
  //         rapportVehicleDetails
  //       );
  //       if (véhiculeDataRef.current && véhiculeDataRef.current?.length > 0) {
  //         véhiculeDataRef.current.forEach((véhicule) => {
  //           fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
  //         });
  //       }
  //     }

  //     //
  //     //
  //     //
  //     //
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, []); // Pas de dépendances, exécution régulière

  useEffect(() => {
    const checkData = async () => {
      try {
        const geofenceDataDB = await getDataFromIndexedDB("geofenceData");
        const vehicleDataDB = await getDataFromIndexedDB("mergedDataHome");
        // const vehicleDetailsDB = await getDataFromIndexedDB("vehicleDetailsStore");
        const rapportVehicleDetailsDB = await getDataFromIndexedDB(
          "donneeFusionnéForRapport"
        );

        if (
          geofenceDataRef.current?.length > 0 ||
          geofenceData?.length > 0 ||
          geofenceDataDB.length > 0
        ) {
          // console.log("Données geofence disponibles", geofenceDataRef.current);
        } else {
          if (
            véhiculeDataRef.current?.length > 0 ||
            véhiculeData?.length > 0 ||
            vehicleDataDB.length > 0
          ) {
            GeofenceDataFonction();
          }
          console.log("Pas de données dans geofence", geofenceDataRef.current);
        }

        if (
          véhiculeDataRef.current?.length > 0 ||
          véhiculeData?.length > 0 ||
          vehicleDataDB.length > 0
        ) {
          // console.log("Données véhiculeData disponibles", vehicleDataDB);
        } else {
          fetchVehicleData();
          console.log("Pas de données véhiculeData", vehicleDataDB);
        }

        if (
          vehicleDetailsRef.current?.length > 0 ||
          vehicleDetails?.length > 0 ||
          vehicleDataDB.length > 0
        ) {
          // console.log(
          //   "Données vehicleDetails disponibles",
          //   vehicleDetailsRef.current
          // );
        } else {
          console.log(
            "Pas de données vehicleDetails",
            vehicleDetailsRef.current
          );
          if (
            véhiculeDataRef.current?.length > 0 ||
            véhiculeData?.length > 0 ||
            vehicleDataDB.length > 0
          ) {
            véhiculeDataRef.current?.forEach((véhicule) => {
              fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
            });
          }
        }

        if (
          rapportVehicleDetailsRef.current?.length > 0 ||
          rapportVehicleDetails?.length > 0 ||
          rapportVehicleDetailsDB.length > 0
        ) {
          // console.log("Données rapport disponibles", rapportVehicleDetailsDB);
        } else {
          console.log("Pas de données rapport", rapportVehicleDetailsDB);

          if (
            véhiculeDataRef.current?.length > 0 ||
            véhiculeData?.length > 0 ||
            vehicleDataDB.length > 0
          ) {
            véhiculeDataRef.current?.forEach((véhicule) => {
              fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
            });
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données IndexedDB",
          error
        );
      }
    };

    const intervalId = setInterval(() => {
      checkData();
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   console.log(currentVéhicule);
  //   console.log(véhiculeHistoriqueDetails);
  //   console.log(selectedVehicleToShowInMap);
  // }, [currentVéhicule, véhiculeHistoriqueDetails, selectedVehicleToShowInMap]);
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
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
  const fetchHistoriqueVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    // Ajuste les heures de TimeFrom et TimeTo
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom); // Retire d'heures en plus.
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo); // Ajoute d'heures en plus.

    console.log("Start fetching.........");
    setLoadingHistoriqueFilter(true);

    if (!userData) return;
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
        <Field name="city" />
        <Field name="creationMillis" />
        <Field name="creationTime" />
        <Field name="odometerKM" />
        <Field name="stateProvince" />
        <Field name="statusCode" />
        <Field name="streetAddress" />
      </EventData>
    </GTSRequest>`;

    try {
      const response = await fetch("/api/track/Service", {
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
  const createVehicle = async (
    deviceID,
    imeiNumber,
    uniqueIdentifier,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber,
    vehicleID
  ) => {
    if (!userData) return;
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: createVehicle");

    // /////////

    setError("");
    setCreateVéhiculeLoading(true);

    // <Authorization account="${accountID}" user="${userID}" password="${password}" />
    const xmlData = `<GTSRequest command="dbcreate">
      <Authorization account="${account}" user="${username}" password="${password}" />
      <Record table="Device" partial="true">
        <Field name="accountID">${account}</Field>

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

    try {
      const response = await fetch("/api/track/Service", {
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

      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        setSuccessAddVéhiculePopup(true);
        setError("");
        fetchVehicleData();
        setCreateVéhiculeLoading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du véhicule.");

        handleUserError(xmlDoc);

        // console.log("errorrrrrrrrr");
        setErrorAddVéhiculePopup(true);
        setCreateVéhiculeLoading(false);
        handleUserError(xmlDoc);
      }

      // console.log("End creating..............");
    } catch (error) {
      setError("Erreur lors de la création du véhicule.");
      console.error("Erreur lors de la création du véhicule", error);
      setErrorAddVéhiculePopup(true);
      setCreateVéhiculeLoading(false);
    }
  };

  // Fonction pour supprimer un véhicule
  const deleteVehicle = async (deviceID) => {
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: deleteVehicle");

    // /////////
    // console.log("Start Deleting.........");
    setCreateVéhiculeLoading(true);

    const requestBody =
      `<GTSRequest command="dbdel">` +
      `<Authorization account="${account}" user="${username}" password="${password}"/>` +
      `<RecordKey table="Device" partial="true">` +
      `<Field name="accountID">${account}</Field>` +
      `<Field name="deviceID">${deviceID}</Field>` +
      `</RecordKey>` +
      `</GTSRequest>`;

    // console.log("almost Delete.........");

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      // console.log("wait a little more.........");

      if (response.ok) {
        setVehicleData((prevVehicles) =>
          prevVehicles.filter((véhicule) => véhicule?.deviceID !== deviceID)
        );

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

        // Supprimer le véhicule de IndexedDB
        openDatabase().then((db) => {
          const transaction = db.transaction(
            ["donneeFusionnéForRapport"],
            "readwrite"
          );
          const store = transaction.objectStore("donneeFusionnéForRapport");

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

        // console.log("Véhicule supprimé avec succès.");
        fetchVehicleData();
        setSuccessDeleteVéhiculePopup(true);
        setCreateVéhiculeLoading(false);
      } else {
        console.error(
          "Erreur lors de la suppression du véhicule:",
          response.statusText
        );
        setErrorDeleteVéhiculePopup(true);
        setCreateVéhiculeLoading(false);
      }

      // console.log("finish Deleting.........");
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );
      setErrorDeleteVéhiculePopup(true);
      setCreateVéhiculeLoading(false);
    }
  };

  // Fonction pour modifier un véhicule
  const updateVehicle = async (
    deviceID,
    imeiNumber,
    uniqueID,
    description,
    displayName,
    licensePlate,
    equipmentType,
    simPhoneNumber
  ) => {
    // Pour suivre le nombre de requête
    incrementerRequête();
    console.log("++++++++++++++++ Requête effectué: updateVehicle");

    // /////////
    // console.log("Start updating.....");
    setCreateVéhiculeLoading(true);
    const requestBody =
      `<GTSRequest command="dbput">` +
      `<Authorization account="${account}" user="${username}" password="${password}"/>` +
      `<Record table="Device" partial="true">` +
      `<Field name="accountID">${account}</Field>` +
      `<Field name="deviceID">${deviceID}</Field>` +
      `<Field name="description">${description}</Field>` +
      `<Field name="equipmentType">${equipmentType}</Field>` +
      `<Field name="uniqueID">${uniqueID}</Field>` +
      `<Field name="imeiNumber">${imeiNumber}</Field>` +
      `<Field name="licensePlate">${licensePlate}</Field>` +
      `<Field name="simPhoneNumber">${simPhoneNumber}</Field>` +
      `<Field name="displayName">${displayName}</Field>` +
      `<Field name="isActive">1</Field>` +
      `</Record>` +
      `</GTSRequest>`;
    // console.log("almost there.....");

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: requestBody,
      });

      // console.log("wait updating.....");

      if (response.ok) {
        setVehicleData((prevVehicles) =>
          prevVehicles.map((véhicule) =>
            véhicule?.deviceID === deviceID
              ? {
                  ...véhicule,
                  description,
                  equipmentType,
                  uniqueID,
                  imeiNumber,
                  licensePlate,
                  simPhoneNumber,
                  displayName,
                }
              : véhicule
          )
        );
        // console.log("Véhicule modifié avec succès.");
        setSuccessModifierVéhiculePopup(true);
        fetchVehicleData();
        setCreateVéhiculeLoading(false);
      } else {
        console.error(
          "Erreur lors de la modification du véhicule:",
          response.statusText
        );
        setErrorModifierVéhiculePopup(true);
        setCreateVéhiculeLoading(false);
      }

      // console.log("finish updating.....");
    } catch (error) {
      setErrorModifierVéhiculePopup(true);
      setCreateVéhiculeLoading(false);

      console.error(
        "Erreur de connexion lors de la modification du véhicule:",
        error
      );
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
      localStorage.setItem("vehicleDetails", JSON.stringify(vehicleDetails));
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error(
          "Quota dépassé pour vehicleDetails: essayez de réduire la taille des données ou de nettoyer localStorage."
        );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

    // }

    try {
      localStorage.setItem(
        "rapportVehicleDetails",
        JSON.stringify(rapportVehicleDetails)
      );
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        // console.error(
        //   "Quota dépassé pour rapportVehicleDetails : essayez de réduire la taille des données ou de nettoyer localStorage."
        // );
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

    // try {
    //   localStorage.setItem(
    //     "donneeFusionnéForRapport",
    //     JSON.stringify(donneeFusionnéForRapport)
    //   );
    // } catch (error) {
    //   if (error.name === "QuotaExceededError") {
    //     // console.error(
    //     //   "Quota dépassé pour donneeFusionnéForRapport : essayez de réduire la taille des données ou de nettoyer localStorage."
    //     // );
    //   } else {
    //     console.error("Erreur de stockage : ", error);
    //   }
    // }

    // try {
    //   localStorage.setItem("geofenceData", JSON.stringify(geofenceData));
    // } catch (error) {
    //   if (error.name === "QuotaExceededError") {
    //     // console.error(
    //     //   "Quota dépassé pour donneeFusionnéForRapport : essayez de réduire la taille des données ou de nettoyer localStorage."
    //     // );
    //   } else {
    //     console.error("Erreur de stockage : ", error);
    //   }
    // }
  }, [
    // donneeFusionnéForRapport,
    vehicleDetails,
    rapportVehicleDetails,
    // mergedDataHome,
    // geofenceData,
  ]);

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

        fetchHistoriqueVehicleDetails,
        véhiculeHistoriqueDetails,
        setCurrentVéhicule,
        account,
        username,
        password,
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

        successAddVéhiculePopup,
        setSuccessAddVéhiculePopup,
        errorAddVéhiculePopup,
        setErrorAddVéhiculePopup,

        successModifierVéhiculePopup,
        setSuccessModifierVéhiculePopup,
        errorModifierVéhiculePopup,
        setErrorModifierVéhiculePopup,

        successDeleteVéhiculePopup,
        setSuccessDeleteVéhiculePopup,
        errorDeleteVéhiculePopup,
        setErrorDeleteVéhiculePopup,
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
        errorCreateGeofencePopup,
        setErrorCreateGeofencePopup,
        succesCreateGeofencePopup,
        setSuccesCreateGeofencePopup,
        currentGeozone,
        setCurrentGeozone,
        isEditingGeofence,
        setIsEditingGeofence,
        supprimerGeofence,
        activerOuDesactiverGeofence,
        succesModifierGeofencePopup,
        setSuccesModifierGeofencePopup,
        errorModifierGeofencePopup,
        setErrorModifierGeofencePopup,
        succesDeleteGeofencePopup,
        setSuccesDeleteGeofencePopup,
        errorDeleteGeofencePopup,
        setErrorDeleteGeofencePopup,

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
