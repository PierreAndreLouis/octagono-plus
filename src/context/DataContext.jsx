// DataContextProvider.js
import React, { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";

export const DataContext = createContext();

const DataContextProvider = ({ children, centerOnFirstMarker }) => {
  const navigate = useNavigate();

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  //loading for Historique page
  const [loadingHistoriqueFilter, setLoadingHistoriqueFilter] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // loading for create vehicule page
  const [crud_loading, setCrud_loading] = useState(false);

  // store login user data
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Login / logout / security
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const isAuthenticated = userData !== null;

  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  // to show the log out pupup
  const [logOut, setLogOut] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOME PAGE
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // loding pour la page home apres log in
  const [isLoading, setIsLoading] = useState(false);

  // search data in the header
  const [searchQuery, setSearchQuery] = useState(""); // État pour stocker le terme de recherche

  // to show the side bar
  const [showSideBar, setShowSideBar] = useState(true);

  // vehicule data in home page
  const [vehicleData, setVehicleData] = useState(() => {
    const storedVehicleData = localStorage.getItem("vehicleData");
    return storedVehicleData ? JSON.parse(storedVehicleData) : null;
  });

  // vehicule detail in home page
  const [vehicleDetails, setVehicleDetails] = useState(() => {
    const storedvehicleDetails = localStorage.getItem("vehicleDetails");
    return storedvehicleDetails && storedvehicleDetails !== "undefined"
      ? JSON.parse(storedvehicleDetails)
      : [];
  });

  // userdata and vehiculedata together
  const [mergedData, setMergedData] = useState(() => {
    const storedmergedData = localStorage.getItem("mergedData");
    return storedmergedData ? JSON.parse(storedmergedData) : null;
  });

  // vehicule actuelle
  const [currentVehicule, setCurrentVehicule] = useState(null); // 1. Déclaration de currentVehicule

  // to show the vehicules options
  const [showListeOption, setShowListOption] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Rapport page
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // vehicule details in rapport page
  const [rapportvehicleDetails, setrapportVehicleDetails] = useState([]);

  //vehicule searh data in rapport page
  const [searchrapportvehicleDetails, setSearchrapportVehicleDetails] =
    useState([]);

  // loading for the rapport page
  const [rapportDataLoading, setRapportDataLoading] = useState(false);

  const [donneeFusionneeForRapport, setdonneeFusionneeForRapport] = useState(
    () => {
      const storeddonneeFusionneeForRapport = localStorage.getItem(
        "donneeFusionneeForRapport"
      );
      return storeddonneeFusionneeForRapport
        ? JSON.parse(storeddonneeFusionneeForRapport)
        : [];
    }
  );

  const [vehiculeActiveAjourdhui, setVehiculeActiveAjourdhui] = useState([]);
  const [vehiculeNotActiveAjourdhui, setVehiculeNotActiveAjourdhui] = useState(
    []
  );

  const [vehiculeNotActif, setVehiculeNotActif] = useState([]);
  const [vehiculeActiveMaintenant, setVehiculeActiveMaintenant] = useState([]);

  const [searchdonneeFusionneeForRapport, setSearchdonneeFusionneeForRapport] =
    useState([]);

  const [statisticFilter, setstatisticFilter] = useState(mergedData);
  const [statisticFilterText, setstatisticFilterText] = useState("tout");

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Pupup
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //
  const [successAddvehiculePupup, setsuccessAddvehiculePupup] = useState(false);
  const [errorAddvehiculePupup, seterrorAddvehiculePupup] = useState(false);
  //
  const [successModifiervehiculePupup, setsuccessModifiervehiculePupup] =
    useState(false);
  const [errorModifiervehiculePupup, seterrorModifiervehiculePupup] =
    useState(false);
  //
  const [successDeletevehiculePupup, setsuccessDeletevehiculePupup] =
    useState(false);
  const [errorDeletevehiculePupup, seterrorDeletevehiculePupup] =
    useState(false);
  // to show the confirm password pupup in user page
  const [showChangePasswordPupup, setShowChangePasswordPupup] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Historique page
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // to show the map in the historique page
  const [showHistoriqueInMap, setShowHistoriqueInMap] = useState(false);

  const [vehiclueHistoriqueDetails, setVehiclueHistoriqueDetails] = useState(
    []
  );

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Statistic  page
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [showCategorieListe, setshowCategorieListe] = useState(false);
  const [chooseActifs, setchooseActifs] = useState(false);
  const [chooseStationnement, setchooseStationnement] = useState(false);
  const [chooseInactifs, setchooseInactifs] = useState(false);
  const [chooseALl, setchooseALl] = useState(false);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TimeZone  component
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Initialisation des états depuis localStorage
  const [timeZoneData, setTimeZoneData] = useState([]);
  const [timeZonesearchQuery, settimeZoneSearchQuery] = useState(""); // État pour la recherche
  const [selectedTimeZone, setSelectedTimeZone] = useState(() => {
    return localStorage.getItem("selectedTimeZone") || "";
  });
  const [selectUTC, setselectUTC] = useState(() => {
    return localStorage.getItem("selectUTC") || "";
  });
  // const [selectUTC, setselectUTC] = useState("");
  const [selectTime, setselectTime] = useState(() => {
    return localStorage.getItem("selectTime") || "";
  });

  // Charger les fuseaux horaires
  useEffect(() => {
    const zones = moment.tz.names().map((zone) => {
      const currentTime = moment().tz(zone).format("HH:mm");
      const utcOffset = moment().tz(zone).format("Z");
      return { region: zone, currentTime, utcOffset };
    });
    setTimeZoneData(zones);
  }, []);

  const handleSelectTimeZone = (item) => {
    setSelectedTimeZone(item.region);
    setselectUTC(item.utcOffset);
    setselectTime(item.currentTime);
    localStorage.setItem("selectedTimeZone", item.region);
    localStorage.setItem("selectUTC", item.utcOffset);
    localStorage.setItem("selectTime", item.currentTime);
  };

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  /////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Log in, log out...
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Fonction to log in
  const handleLogin = async (account, user, password) => {
    // e.preventDefault();
    setIsLoading(true);
    setError(null);

    const xmlData = `<GTSRequest command="dbget">
        <Authorization account="${account}" user="${user}" password="${password}" />
        <Record table="User" partial="true">
          <Field name="accountID">${account}</Field>
          <Field name="userID">${account}</Field>
        </Record>
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
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");

      if (result === "success") {
        const fields = xmlDoc.getElementsByTagName("Field");
        let userData = {};

        for (let i = 0; i < fields.length; i++) {
          const fieldName = fields[i].getAttribute("name");
          const fieldValue = fields[i].textContent;
          userData[fieldName] = fieldValue;
        }

        localStorage.setItem("userData", JSON.stringify(userData));
        setUserData(userData);
        navigate("/home");
        if (!statisticFilter) {
          setstatisticFilter(mergedData);
          setstatisticFilterText("tout");
        }

        // Stocker les informations de connexion en local
        localStorage.setItem("account", account);
        localStorage.setItem("username", user);
        localStorage.setItem("password", password);

        setAccount(localStorage.getItem("account") || "");
        setUsername(localStorage.getItem("username") || "");
        setPassword(localStorage.getItem("password") || "");
        // console.log("user data --------", userData);
      } else if (result === "error") {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la connexion.");
        // setIsLoading(false);
      }
    } catch (error) {
      setError("Erreur lors de la connexion à l'API.");
      console.error("Erreur lors de la connexion à l'API", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // pour stoquer les donnnes de l'utilisateur en local
  useEffect(() => {
    // Récupérer les informations de localStorage
    setAccount(localStorage.getItem("account") || "");
    setUsername(localStorage.getItem("username") || "");
    setPassword(localStorage.getItem("password") || "");
  }, []);

  // Fonction pour se deconnecter de l'applicaton
  const handleLogout = () => {
    setShowSideBar(true);
    setLogOut(false);

    localStorage.removeItem("userData");
    setUserData(null);

    localStorage.removeItem("vehicleData");
    setVehicleData(null);

    localStorage.removeItem("vehicleDetails");
    setVehicleDetails([]);

    localStorage.removeItem("mergedData");
    setMergedData(null);

    localStorage.removeItem("donneeFusionneeForRapport");
    setdonneeFusionneeForRapport([]);

    setVehiculeActiveAjourdhui([]);
    setVehiculeNotActiveAjourdhui([]);
    setVehiculeNotActif([]);
    setVehiculeActiveMaintenant([]);
    setSearchdonneeFusionneeForRapport([]);

    localStorage.removeItem("rapportvehicleDetails");
    setrapportVehicleDetails([]);

    localStorage.removeItem("selectedTimeZone");
    setSelectedTimeZone("");

    localStorage.removeItem("selectUTC");
    setselectUTC("");

    localStorage.removeItem("selectTime");
    setselectTime("");

    localStorage.removeItem("account");
    setAccount("");

    localStorage.removeItem("username");
    setUsername("");

    localStorage.removeItem("password");
    setPassword("");

    navigate("/login");
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
  //  Home page
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Requette pour afficher tous les vehicule mais sans details
  const fetchVehicleData = async () => {
    if (!userData) return;

    const { accountID, userID, password } = userData;

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
      let vehicleData = [];

      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        let vehicleRecord = {};

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          const fieldValue = fields[j].textContent;
          vehicleRecord[fieldName] = fieldValue;
        }

        vehicleData.push(vehicleRecord);
      }

      setVehicleData(vehicleData);

      // localStorage.setItem("vehicleData", JSON.stringify(vehicleData));

      // console.log("******** Données des véhicules ********** ", vehicleData);
      // ---------------------------------------------------------------------

      const now = new Date();
      const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const TimeFrom = `${startOfDay.getFullYear()}-${(
        startOfDay.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${startOfDay
        .getDate()
        .toString()
        .padStart(2, "0")} 00:00:00`;

      if (vehicleData && vehicleData.length > 0) {
        vehicleData.forEach((vehicle) => {
          fetchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
          fetRapportchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);

          // firstCallRapportData();
        });
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données des véhicules.");
      console.error(
        "Erreur lors de la récupération des données des véhicules",
        error
      );
    }
  };

  // Repuette pour rechercher les details des vehicule dans la page home
  const fetchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    if (!userData) return;
    // console.log("Start fetching fetails");

    const { accountID, userID, password } = userData;
    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${TimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${TimeTo}</TimeTo>

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

    // console.log("wait... 1");

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });

      // console.log("wait... 2");

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      // console.log("data en xml:---------", data);

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          const fieldValue = fields[j].textContent;
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";

        // Ajout du backupAddress pour chaque enregistrement
        // const latitude = -23.4797785;
        // const longitude = -46.76839450000001;
        const latitude = details.latitude;
        const longitude = details.longitude;

        // if (newVehicleDetails.length > 0) {
        //   if (latitude && longitude) {
        //     // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        //     const url = `/other-api/nominatim/reverse.php?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        //     // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=-23.4797785&lon=-46.76839450000001`;
        //     try {
        //       // const addressResponse = await fetch(url);
        //       const addressResponse = await fetch(url);
        //       const addressData = await addressResponse.json();
        //       const responseText = await addressResponse.text(); // Récupère la réponse brute
        //       console.log("Raw response from Nominatim:", responseText);
        //       details.backupAddress =
        //         addressData?.display_name || "Adresse introuvable";
        //     } catch (error) {
        //       console.error(
        //         "Erreur lors de la récupération de l'adresse :",
        //         error
        //       );
        //       details.backupAddress = "";
        //     }
        //   } else {
        //     details.backupAddress = "Coordonnées non disponibles";
        //   }
        // }
        newVehicleDetails.push(details);
      }

      setVehicleDetails((prevDetails) => {
        const updatedDetails = prevDetails?.map((detail) => {
          if (detail.Device === Device) {
            return newVehicleDetails.length > 0
              ? { ...detail, vehiculeDetails: [...newVehicleDetails] }
              : detail;
          }
          return detail;
        });

        // Si le véhicule n'est pas trouvé, ajoute-le
        if (!updatedDetails.some((detail) => detail.Device === Device)) {
          updatedDetails.push({
            Device,
            vehiculeDetails: [...newVehicleDetails],
          });
        }

        return [...updatedDetails];
      });

      // console.log("xxxxxxxxxxxxxxxxxxxxxxx", newVehicleDetails);
    } catch (error) {
      setError("Erreur lors de la récupération des détails du véhicule.");
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  // Pour lancer la requette de details des vehicules
  useEffect(() => {
    if (userData) {
      fetchVehicleData();
    }
  }, [userData]);

  // Premier appelle de donnee pour les detils de vehicule de la page home et rapport
  useEffect(() => {
    // console.log("start fffffffffffff........");

    const now = new Date();
    const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startOfDay
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00`;

    if (vehicleData && vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        fetchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
        fetRapportchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
      });
    }
  }, [vehicleData]);

  // Pour fusionnee les donnes des fonctions fetchVehicleData et fetchVehicleDetails
  // const mergeVehicleDataWithEvents = (eventData = vehicleDetails) => {
  //   const dataFusionne = {};
  //   const seenEvents = new Set();

  //   vehicleData.forEach((vehicle) => {
  //     const { deviceID } = vehicle;
  //     dataFusionne[deviceID] = {
  //       ...vehicle,
  //       vehiculeDetails:
  //         vehicleDetails.find((v) => v.Device === deviceID)?.vehiculeDetails ||
  //         [],
  //     };
  //   });

  //   eventData.forEach((event) => {
  //     const { deviceID, timestamp, ...eventDetails } = event;
  //     const eventKey = `${deviceID}-${timestamp}`;

  //     if (!seenEvents.has(eventKey)) {
  //       seenEvents.add(eventKey);

  //       if (dataFusionne[deviceID]) {
  //         if (Object.keys(eventDetails).length > 0) {
  //           dataFusionne[deviceID].vehiculeDetails.push({
  //             timestamp,
  //             ...eventDetails,
  //           });
  //         }
  //       }
  //     }
  //   });

  //   localStorage.setItem("mergedData", JSON.stringify(dataFusionne));
  //   setMergedData(dataFusionne);
  //   setIsLoading(false);
  //   if (!statisticFilter) {
  //     setstatisticFilter(mergedData);
  //     setstatisticFilterText("tout");
  //   }

  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 15000); // 10 000 millisecondes = 10 secondes

  //   return dataFusionne;
  // };

  const mergeVehicleDataWithEvents = (eventData = vehicleDetails) => {
    const dataFusionne = {};
    const seenEvents = new Set();

    // Vérifiez si deviceID existe bien dans vehicleData
    vehicleData.forEach((vehicle) => {
      const { deviceID } = vehicle;
      if (deviceID) {
        // Vérification de l'existence de deviceID
        dataFusionne[deviceID] = {
          ...vehicle,
          vehiculeDetails:
            vehicleDetails.find((v) => v.Device === deviceID)
              ?.vehiculeDetails || [],
        };
      } else {
        console.warn("deviceID manquant dans vehicleData", vehicle);
      }
    });

    eventData.forEach((event) => {
      const { deviceID, timestamp, ...eventDetails } = event;
      const eventKey = `${deviceID}-${timestamp}`;

      if (!seenEvents.has(eventKey)) {
        seenEvents.add(eventKey);

        if (dataFusionne[deviceID]) {
          if (Object.keys(eventDetails).length > 0) {
            dataFusionne[deviceID].vehiculeDetails.push({
              timestamp,
              ...eventDetails,
            });
          }
        } else {
          console.warn("deviceID manquant dans eventData", event);
        }
      }
    });

    localStorage.setItem("mergedData", JSON.stringify(dataFusionne));
    setMergedData(dataFusionne);
    setIsLoading(false);
    if (!statisticFilter) {
      setstatisticFilter(mergedData);
      setstatisticFilterText("tout");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 15000); // 15 secondes

    return dataFusionne;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 10 000 millisecondes = 10 secondes
  }, [isLoading]);

  // Pour fusionner les donnes des vehicule dans la page Home
  useEffect(() => {
    if (
      vehicleDetails &&
      vehicleDetails.length > 0 &&
      vehicleData &&
      vehicleData.length > 0
    ) {
      mergeVehicleDataWithEvents();
    }
  }, [vehicleData, vehicleDetails]);

  //
  //
  //
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

  // Repuette pour rechercher les details des vehicule dans la page rapport
  const fetRapportchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    if (!userData) return;
    // setRapportDataLoading(true);
    // console.log("Rapport start fetching............");

    const { accountID, userID, password } = userData;
    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${TimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${TimeTo}</TimeTo>


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

    // console.log("wait 1111.......");

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      // console.log("wait 22222.......");

      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const records = xmlDoc.getElementsByTagName("Record");

      // console.log("Data brut rapport details.....", data);

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          const fieldValue = fields[j].textContent;
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";

        // Ajout du backupAddress pour chaque enregistrement
        // const latitude = -23.4797785;
        // const longitude = -46.76839450000001;
        const latitude = details.latitude;
        const longitude = details.longitude;
        // if (newVehicleDetails.length > 0) {
        //   if (latitude && longitude) {
        //     // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        //     const url = `/other-api/nominatim/reverse.php?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        //     // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=-23.4797785&lon=-46.76839450000001`;
        //     try {
        //       const addressResponse = await fetch(url);
        //       const addressData = await addressResponse.json();
        //       details.backupAddress =
        //         addressData?.display_name || "Adresse introuvable";
        //     } catch (error) {
        //       console.error(
        //         "Erreur lors de la récupération de l'adresse :",
        //         error
        //       );
        //       details.backupAddress = "";
        //     }
        //   } else {
        //     details.backupAddress = "Coordonnées non disponibles";
        //   }
        // }

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

      setrapportVehicleDetails((prevDetails) => [
        ...prevDetails.filter((detail) => detail.Device !== Device),
        ...uniqueVehicleDetails,
      ]);

      // setrapportVehicleDetails((prevDetails) => [
      //   ...prevDetails.filter((detail) => detail.Device !== Device),
      //   ...newVehicleDetails,
      // ]);

      // console.log("...............newVehicleDetails", newVehicleDetails);
      // console.log("...............newVehicleDetails", newVehicleDetails);
      // console.log(
      //   "...............rapportvehicleDetails",
      //   rapportvehicleDetails
      // );
      // console.log("...............xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("...............End.....");

      setTimeout(() => {
        setRapportDataLoading(false);
      }, 15000); // 10 000 millisecondes = 10 secondes
    } catch (error) {
      setRapportDataLoading(false);
      setError("Erreur lors de la récupération des détails du véhicule.");
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  // Pour le fusionnement de donnee de la page rapport
  const rapportfusionnerDonnees = () => {
    if (!vehicleData || !rapportvehicleDetails) return [];

    // Récupérer les anciens détails depuis localStorage
    const previousData = (() => {
      try {
        const data = JSON.parse(
          localStorage.getItem("donneeFusionneeForRapport")
        );
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du localStorage:",
          error
        );
        return [];
      }
    })();

    const dataFusionnee = vehicleData.map((vehicle) => {
      // Trouver les nouveaux détails pour le véhicule
      const newDetails = rapportvehicleDetails?.filter(
        (detail) => detail.Device === vehicle.deviceID
      );

      // Récupérer les anciens détails depuis les données précédentes
      const previousDetails = previousData.find(
        (prev) => prev.deviceID === vehicle.deviceID
      )?.vehiculeDetails;

      // Conserver les anciens détails si aucun nouveau n'est trouvé
      const updatedDetails =
        newDetails && newDetails.length > 0
          ? newDetails
          : previousDetails || [];

      return {
        ...vehicle,
        vehiculeDetails: updatedDetails,
      };
    });

    // Met à jour l'état avec les données fusionnées
    setdonneeFusionneeForRapport(dataFusionnee);

    // Enregistrer les données fusionnées dans localStorage
    localStorage.setItem(
      "donneeFusionneeForRapport",
      JSON.stringify(dataFusionnee)
    );

    setTimeout(() => {
      setRapportDataLoading(false);
    }, 15000); // 10 000 millisecondes = 10 secondes

    setRapportDataLoading(false);

    return dataFusionnee;
  };

  // Pour lancer le fusionnement des donnees dans la page rapport
  useEffect(() => {
    if (rapportvehicleDetails?.length > 0 && vehicleData?.length > 0) {
      rapportfusionnerDonnees();
    }
  }, [rapportvehicleDetails, vehicleData]);

  // pour mettre a jour rapport data avec la date actuelle
  const firstCallRapportData = () => {
    setShowListOption(false);
    // console.log("Start.........");
    const now = new Date();
    const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startOfDay
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00`;

    if (vehicleData && vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        fetRapportchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
        // console.log("call the fonction.........");
      });
    }
  };

  // Mise a jour les donnee de rapport page tous les 1 minutes
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     firstCallRapportData();
  //     console.log("okkkkkkkkkk");
  //   }, 60000);

  //   return () => clearInterval(intervalId);
  // }, []);

  //
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

  // Repuette pour la recherche par date de details des vehicule dans la page rapport
  const fetSearchRapportchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    if (!userData) return;
    // setRapportDataLoading(true);
    console.log("starttttttttttttt..............");

    const { accountID, userID, password } = userData;
    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${TimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${TimeTo}</TimeTo>
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

    console.log("2222222222");

    try {
      const response = await fetch("/api/track/Service", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
      });
      console.log("3333333333333");

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
          const fieldValue = fields[j].textContent;
          details[fieldName] = fieldValue;
        }
        console.log("4444444444444");

        details.backupAddress = "";

        // Ajout de backupAddress
        const latitude = details.latitude;
        const longitude = details.longitude;
        // if (newVehicleDetails.length > 0) {
        //   if (latitude && longitude) {
        //     const url = `/other-api/nominatim/reverse.php?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        //     try {
        //       const addressResponse = await fetch(url);
        //       const addressData = await addressResponse.json();
        //       details.backupAddress =
        //         addressData?.display_name || "Adresse introuvable";
        //     } catch (error) {
        //       console.error(
        //         "Erreur lors de la récupération de l'adresse :",
        //         error
        //       );
        //       details.backupAddress = "";
        //     }
        //   } else {
        //     details.backupAddress = "Coordonnées non disponibles";
        //   }
        // }
        console.log("555555555555555");

        newVehicleDetails.push(details);
      }
      console.log("66666666666666");

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
      console.log("7777777777777777");

      setSearchrapportVehicleDetails((prevDetails) => [
        ...prevDetails.filter((detail) => detail.Device !== Device),
        ...uniqueVehicleDetails,
      ]);

      console.log("888888888888888888");

      console.log("end fetching.................");
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.");
      console.log("uniqueVehicleDetails.");

      setTimeout(() => {
        setRapportDataLoading(false);
      }, 15000); // 10 000 millisecondes = 10 secondes
    } catch (error) {
      setRapportDataLoading(false);
      setError("Erreur lors de la récupération des détails du véhicule.");
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  // Fonction pour fusionnee les donnee de recherce par date
  const rapportSearchfusionnerDonnees = () => {
    if (!vehicleData || !searchrapportvehicleDetails) return [];

    const dataFusionnee = vehicleData.map((vehicle) => {
      const events = searchrapportvehicleDetails?.filter(
        (detail) => detail.Device === vehicle.deviceID
      );

      // Si les nouveaux détails sont vides, ne pas mettre à jour les détails actuels
      // if (!events || events.length === 0) {
      //   return vehicle;
      // }

      // Mettre à jour les informations du véhicule si les nouveaux détails ne sont pas vides
      return {
        ...vehicle,
        vehiculeDetails: events,
      };
    });

    // Vérifiez si chaque véhicule a ses détails ajoutés
    const allVehiclesProcessed = dataFusionnee.every(
      (vehicle) => vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0
    );

    // 1. Met à jour l'état avec toutes les données fusionnées
    setSearchdonneeFusionneeForRapport(dataFusionnee);
    setRapportDataLoading(false);

    // 2. Met à jour le chargement uniquement lorsque toutes les données sont traitées
    if (allVehiclesProcessed) {
      console.log("Tous les véhicules ont leurs détails mis à jour !");
      setSearchdonneeFusionneeForRapport(dataFusionnee);
    } else {
      console.log("Certains véhicules n'ont pas encore leurs détails.");
    }

    return dataFusionnee;
  };

  // Pour mettre a jour la variable searchdonneeFusionneeForRapport
  useEffect(() => {
    console.log(
      "Mise à jour de searchdonneeFusionneeForRapport:",
      searchdonneeFusionneeForRapport
    );
  }, [searchdonneeFusionneeForRapport]);

  // Pour lancer le fusionnement de donnee de recherche par date des fonctions fetSearchRapportchVehicleDetails et rapportSearchfusionnerDonnees
  useEffect(() => {
    if (searchrapportvehicleDetails.length > 0 && vehicleData?.length > 0) {
      rapportSearchfusionnerDonnees();
    }
  }, [searchrapportvehicleDetails, vehicleData]);

  //
  //
  //
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

  let currentdataFusionnee =
    searchdonneeFusionneeForRapport.length > 0
      ? searchdonneeFusionneeForRapport
      : donneeFusionneeForRapport;

  //  Pour filtrer les donnees dans la page rapport
  useEffect(() => {
    if (
      searchdonneeFusionneeForRapport.length > 0 &&
      currentdataFusionnee &&
      currentdataFusionnee?.length > 0
    ) {
      // 2. Met à jour l'état avec tous les véhicules ayant au moins un événement avec `speedKPH >= 1`
      const vehiculeActiveAjourdhui = currentdataFusionnee?.filter((vehicle) =>
        vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      );
      setVehiculeActiveAjourdhui(vehiculeActiveAjourdhui);

      // const now = new Date();
      // const filteredVehicles = currentdataFusionnee?.filter((vehicle) => {
      //   const lastUpdate = new Date(vehicle.lastUpdateTime);
      //   const diffHeures = (now - lastUpdate) / (1000 * 60 * 60);
      //   return diffHeures < 24; // Conserver uniquement les véhicules mis à jour il y a moins de 24 heures
      // });

      // const vehiculeActiveAjourdhui = filteredVehicles?.filter((vehicle) =>
      //   vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      // );

      // setVehiculeActiveAjourdhui(vehiculeActiveAjourdhui);
      //
      //
      //
      //
      //
      //
      //
      // 3. Met à jour l'état avec tous les véhicules n'ayant aucun événement avec `speedKPH >= 1`
      const vehiculeNotActiveAjourdhui = currentdataFusionnee?.filter(
        (vehicle) =>
          vehicle.vehiculeDetails?.length > 0 && // Vérifie que des détails existent
          vehicle.vehiculeDetails.every((detail) => detail.speedKPH <= 0) // Tous les détails doivent avoir speedKPH <= 0
      );

      setVehiculeNotActiveAjourdhui(vehiculeNotActiveAjourdhui);
      //
      //
      //
      //
      //
      //
      //
      //
      // 4. Met à jour l'état avec tous les véhicules dont `vehiculeDetails[0].speedKPH >= 1`
      const vehiculeActiveMaintenant = currentdataFusionnee?.filter(
        (vehicle) =>
          vehicle?.vehiculeDetails &&
          vehicle?.vehiculeDetails?.length &&
          vehicle?.vehiculeDetails[0]?.speedKPH >= 1
      );
      setVehiculeActiveMaintenant(vehiculeActiveMaintenant);
      //
      //
      //
      //
      //
      //
      //
      //
      // 5. Met à jour l'état avec tous les véhicules dont `lastUpdateTime` est supérieur à 24h par rapport à l'heure actuelle
      const vehiculeNotActif = currentdataFusionnee?.filter((vehicle) => {
        const lastUpdate = new Date(vehicle.lastUpdateTime);
        const now = new Date();
        const diffHeures = (now - lastUpdate) / (1000 * 60 * 60);
        return vehicle.vehiculeDetails?.length <= 0 || diffHeures > 24;
      });

      setVehiculeNotActif(vehiculeNotActif);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (
      searchdonneeFusionneeForRapport.length <= 0 &&
      currentdataFusionnee &&
      currentdataFusionnee?.length > 0
    ) {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 2. Met à jour l'état avec tous les véhicules ayant au moins un événement avec `speedKPH >= 1`
      // const vehiculeActiveAjourdhui = currentdataFusionnee?.filter((vehicle) =>
      //   vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      // );
      // setVehiculeActiveAjourdhui(vehiculeActiveAjourdhui);

      // const now = new Date();
      // const filteredVehicles = currentdataFusionnee?.filter((vehicle) => {
      //   const lastUpdate = new Date(vehicle.lastUpdateTime);
      //   const diffHeures = (now - lastUpdate) / (1000 * 60 * 60);
      //   return diffHeures < 24; // Conserver uniquement les véhicules mis à jour il y a moins de 24 heures
      // });

      const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
      const currentTime = Date.now(); // Heure actuelle en millisecondes

      // const vehiculeActiveAjourdhui = currentdataFusionnee?.filter(
      //   (vehicle) => {
      //     // Vérifier si le véhicule n'a pas de détails
      //     const noDetails =
      //       !vehicle.vehiculeDetails || vehicle.vehiculeDetails.length === 0;

      //     // Vérifier si le véhicule est inactif
      //     const lastUpdateTime = vehicle?.lastUpdateTime;
      //     const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
      //     const isInactive =
      //       lastUpdateTimeMs > 0 &&
      //       currentTime - lastUpdateTimeMs >= twentyHoursInMs;

      //     const isRunningToday = currentdataFusionnee?.filter((vehicle) =>
      //       vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      //     );

      //     // Retourne true si l'une des conditions est satisfaite
      //     return !noDetails && !isInactive && isRunningToday;
      //   }
      // );

      // const vehiculeActiveAjourdhui = currentdataFusionnee?.filter(
      //   (vehicle) => {
      //     // Vérifier si le véhicule a des détails
      //     const hasDetails =
      //       vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

      //     // Vérifier si le véhicule est actif dans les dernières 24h
      //     const lastUpdateTime = vehicle?.lastUpdateTime;
      //     const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
      //     const isActive =
      //       lastUpdateTimeMs > 0 &&
      //       currentTime - lastUpdateTimeMs < 24 * 60 * 60 * 1000; // Moins de 24h

      //     // Vérifier si le véhicule a au moins un détail avec une vitesse > 0
      //     const hasSpeed = vehicle.vehiculeDetails?.some(
      //       (detail) => detail.speedKPH > 0
      //     );

      //     // Retourne true si toutes les conditions sont remplies
      //     return hasDetails && isActive && hasSpeed;
      //   }
      // );

      const vehiculeActiveAjourdhui = currentdataFusionnee?.filter((vehicle) =>
        vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      );

      // const vehiculeActiveAjourdhui = filteredVehicles?.filter((vehicle) =>
      //   vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      // );

      // const vehiculeActiveAjourdhui2 = filteredVehicles?.filter((vehicle) =>
      //   vehicle.vehiculeDetails?.some((detail) => detail.speedKPH >= 1)
      // );

      setVehiculeActiveAjourdhui(vehiculeActiveAjourdhui);

      // 3. Met à jour l'état avec tous les véhicules n'ayant aucun événement avec `speedKPH >= 1`

      // const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
      // const currentTime = Date.now(); // Heure actuelle en millisecondes

      // const vehiculeNotActiveAjourdhui = currentdataFusionnee.filter(
      //   (vehicle) => {
      //     // Vérifie si le véhicule a des détails
      //     const hasDetails =
      //       vehicle.vehiculeDetails && vehicle.vehiculeDetails.length > 0;

      //     // Vérifie la vitesse (noSpeed)
      //     const noSpeed = vehicle.vehiculeDetails?.[0]?.speedKPH < 1;

      //     // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
      //     const lastUpdateTimeMs = vehicle.lastUpdateTime
      //       ? vehicle.lastUpdateTime * 1000
      //       : 0;
      //     const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

      //     // Inclure seulement les véhicules qui ont des détails, qui sont actifs, et qui ont noSpeed
      //     return hasDetails && isActive && noSpeed;
      //   }
      // );

      // const vehiculeNotActiveAjourdhui = currentdataFusionnee.filter(
      //   (vehicle) => {
      //     // Vérifie si le véhicule a des détails
      //     const hasDetails = vehicle.vehiculeDetails?.length > 0;

      //     // Vérifie si la vitesse est inférieure ou égale à 0
      //     // const noSpeed = vehicle.vehiculeDetails?.[0]?.speedKPH <= 0;
      //     const noSpeed = vehicle.vehiculeDetails?.filter(
      //       (detail) => detail.speedKPH >= 1
      //     );

      //     // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
      //     const lastUpdateTimeMs = vehicle.lastUpdateTime
      //       ? vehicle.lastUpdateTime * 1000
      //       : 0;
      //     const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

      //     // Retourne les véhicules qui remplissent toutes les conditions
      //     return hasDetails && isActive && noSpeed;
      //   }
      // );

      const vehiculeNotActiveAjourdhui = currentdataFusionnee.filter(
        (vehicle) => {
          // Vérifie si le véhicule a des détails
          const hasDetails = vehicle.vehiculeDetails?.length > 0;

          // Vérifie que tous les objets de vehiculeDetails ont speedKPH <= 0
          const noSpeed = vehicle.vehiculeDetails?.every(
            (detail) => detail.speedKPH <= 0
          );

          // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
          const lastUpdateTimeMs = vehicle.lastUpdateTime
            ? vehicle.lastUpdateTime * 1000
            : 0;
          const isActive = currentTime - lastUpdateTimeMs < twentyHoursInMs;

          // Retourne les véhicules qui remplissent toutes les conditions
          return hasDetails && noSpeed && isActive;
        }
      );

      setVehiculeNotActiveAjourdhui(vehiculeNotActiveAjourdhui);

      // 4. Met à jour l'état avec tous les véhicules dont `vehiculeDetails[0].speedKPH >= 1`
      const vehiculeActiveMaintenant = currentdataFusionnee?.filter(
        (vehicle) =>
          vehicle?.vehiculeDetails &&
          vehicle?.vehiculeDetails?.length &&
          vehicle?.vehiculeDetails[0]?.speedKPH >= 1
      );

      setVehiculeActiveMaintenant(vehiculeActiveMaintenant);

      // 5. Met à jour l'état avec tous les véhicules dont `lastUpdateTime` est supérieur à 24h par rapport à l'heure actuelle

      // Filtrer les véhicules sans détails ou inactifs
      // const vehiculeNotActif = currentdataFusionnee?.filter((vehicle) => {
      //   // Vérifier si le véhicule n'a pas de détails
      //   const noDetails =
      //     !vehicle.vehiculeDetails || vehicle.vehiculeDetails.length === 0;

      //   // Vérifier si le véhicule est inactif
      //   const lastUpdateTime = vehicle?.lastUpdateTime;
      //   const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
      //   const isInactive =
      //     lastUpdateTimeMs > 0 &&
      //     currentTime - lastUpdateTimeMs >= twentyHoursInMs;

      //   const isActif = vehicle.vehiculeDetails?.some(
      //     (detail) => detail.speedKPH >= 1
      //   );

      //   // Retourne true si l'une des conditions est satisfaite
      //   return (noDetails || isInactive) && !isActif;
      // });

      // setVehiculeNotActif(vehiculeNotActif);

      // Filtrer les véhicules sans détails ou inactifs
      const vehiculeNotActif = currentdataFusionnee?.filter((vehicle) => {
        // Vérifier si le véhicule n'a pas de détails
        const noDetails =
          !vehicle.vehiculeDetails || vehicle.vehiculeDetails.length === 0;

        // Vérifier si le véhicule est inactif
        const lastUpdateTime = vehicle?.lastUpdateTime;
        const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0; // Conversion en millisecondes
        const isInactive =
          lastUpdateTimeMs > 0 &&
          currentTime - lastUpdateTimeMs >= twentyHoursInMs;

        // Vérifier si le véhicule est actif
        const isActif = vehicle.vehiculeDetails?.some(
          (detail) => detail.speedKPH >= 1
        );

        // Retourner true pour les véhicules sans détails ou inactifs, mais pas actifs
        return (noDetails || isInactive) && !isActif;
      });

      setVehiculeNotActif(vehiculeNotActif);
    }
  }, [
    currentdataFusionnee,
    searchdonneeFusionneeForRapport,
    donneeFusionneeForRapport,
  ]);

  // Fonction pour mettre à jour le véhicule actuel
  const updateCurrentVehicule = () => {
    if (currentdataFusionnee.length > 0) {
      const updatedVehicule = currentdataFusionnee.find(
        (vehicule) => vehicule.deviceID === currentVehicule?.deviceID
      );
      if (updatedVehicule) {
        setCurrentVehicule(updatedVehicule);
      }
    }
  };

  // Utilisation d'un effet pour surveiller les mises à jour de data
  useEffect(() => {
    updateCurrentVehicule();
  }, [currentdataFusionnee]);
  //
  //
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

  // pour afficher les detail d'hun vehicule dans Historique page (utilise pour les recherche)
  const fetchHistoriqueVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    console.log("Start fetching.........");
    setLoadingHistoriqueFilter(true);

    if (!userData) return;

    const { accountID, userID, password } = userData;
    const xmlData = `<GTSRequest command="eventdata">
      <Authorization account="${accountID}" user="${userID}" password="${password}" />
      <EventData>
        <Device>${Device}</Device>
        <TimeFrom timezone="GMT">${TimeFrom}</TimeFrom>
        <TimeTo timezone="GMT">${TimeTo}</TimeTo>
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

      // console.log("Data brut:", data);

      const newVehicleDetails = [];
      for (let i = 0; i < records.length; i++) {
        const fields = records[i].getElementsByTagName("Field");
        const details = { Device }; // Ajoute l'identifiant du véhicule pour regrouper les événements

        for (let j = 0; j < fields.length; j++) {
          const fieldName = fields[j].getAttribute("name");
          const fieldValue = fields[j].textContent;
          details[fieldName] = fieldValue;
        }

        details.backupAddress = "";

        // Ajout du backupAddress pour chaque enregistrement
        // const latitude = -23.4797785;
        // const longitude = -46.76839450000001;
        const latitude = details.latitude;
        const longitude = details.longitude;

        // if (latitude && longitude) {
        //   // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        //   const url = `/other-api/nominatim/reverse.php?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        //   // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=-23.4797785&lon=-46.76839450000001`;
        //   try {
        //     const addressResponse = await fetch(url);
        //     const addressData = await addressResponse.json();
        //     details.backupAddress =
        //       addressData?.display_name || "Adresse introuvable";
        //   } catch (error) {
        //     console.error(
        //       "Erreur lors de la récupération de l'adresse :",
        //       error
        //     );
        //     details.backupAddress = "";
        //   }
        // } else {
        //   details.backupAddress = "Coordonnées non disponibles";
        // }

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

      setVehiclueHistoriqueDetails(uniqueVehicleDetails);

      // setVehiclueHistoriqueDetails(newVehicleDetails);
      // setVehiclueHistoriqueRapportDetails(newVehicleDetails);

      // console.log("newVehicleDetails.......>>>", newVehicleDetails);
      // console.log(
      //   "newVehicleDetails.lenght.......>>>",
      //   newVehicleDetails.length
      // );
      // console.log("End fetching.........");

      setLoadingHistoriqueFilter(false);
      setTimeout(() => {
        setLoadingHistoriqueFilter(false);
      }, 15000); // 10 000 millisecondes = 10 secondes
    } catch (error) {
      setError("Erreur lors de la récupération des détails du véhicule.");
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // Pour la rehcerhce de donnee dans Historique page apres avoir choisi une date
  const handleDateChange = (TimeFrom, TimeTo) => {
    if (vehicleData && vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        fetchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
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
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // pour lancer le premier fetch des donne de l'hitorique (N'est pas utiliser pour le moment)
  const firstCallHistoriqueData = () => {
    setShowListOption(false);

    const now = new Date();
    const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startOfDay
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00`;

    fetchHistoriqueVehicleDetails(currentVehicule.deviceID, TimeFrom, TimeTo);
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Ajouter / Modifier / Supprimer
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Fonction pour ajouter un nouveau vehicule
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

    setError("");
    setCrud_loading(true);

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
      // console.log("data from add vehicule", data);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const result = xmlDoc
        .getElementsByTagName("GTSResponse")[0]
        .getAttribute("result");
      // console.log("Almost thereeee..............");
      setError("");

      if (result === "success") {
        // console.log("Véhicule créé avec succès :");
        setsuccessAddvehiculePupup(true);
        setError("");
        fetchVehicleData();
        setCrud_loading(false);
      } else {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la création du véhicule.");
        // console.log("errorrrrrrrrr");
        seterrorAddvehiculePupup(true);
        setCrud_loading(false);
      }

      // console.log("End creating..............");
    } catch (error) {
      setError("Erreur lors de la création du véhicule.");
      console.error("Erreur lors de la création du véhicule", error);
      seterrorAddvehiculePupup(true);
      setCrud_loading(false);
    }
  };

  // Fonction pour supprimer un vehicule
  const deleteVehicle = async (deviceID) => {
    // console.log("Start Deleting.........");
    setCrud_loading(true);

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
          prevVehicles.filter((vehicle) => vehicle.deviceID !== deviceID)
        );
        // console.log("Véhicule supprimé avec succès.");
        fetchVehicleData();
        setsuccessDeletevehiculePupup(true);
        setCrud_loading(false);
      } else {
        console.error(
          "Erreur lors de la suppression du véhicule:",
          response.statusText
        );
        seterrorDeletevehiculePupup(true);
        setCrud_loading(false);
      }

      // console.log("finish Deleting.........");
    } catch (error) {
      console.error(
        "Erreur de connexion lors de la suppression du véhicule:",
        error
      );
      seterrorDeletevehiculePupup(true);
      setCrud_loading(false);
    }
  };

  // Fonction pour modifier un vehicule
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
    // console.log("Start updating.....");
    setCrud_loading(true);
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
          prevVehicles.map((vehicle) =>
            vehicle.deviceID === deviceID
              ? {
                  ...vehicle,
                  description,
                  equipmentType,
                  uniqueID,
                  imeiNumber,
                  licensePlate,
                  simPhoneNumber,
                  displayName,
                }
              : vehicle
          )
        );
        // console.log("Véhicule modifié avec succès.");
        setsuccessModifiervehiculePupup(true);
        fetchVehicleData();
        setCrud_loading(false);
      } else {
        console.error(
          "Erreur lors de la modification du véhicule:",
          response.statusText
        );
        seterrorModifiervehiculePupup(true);
        setCrud_loading(false);
      }

      // console.log("finish updating.....");
    } catch (error) {
      seterrorModifiervehiculePupup(true);
      setCrud_loading(false);

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

  const [smsError, setSmsError] = useState(""); // Utilisation du useState pour l'erreur

  // Fonction pour la gestion de l'envoie des sms
  const envoyerSMS = (numero, message) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Vérification de la plateforme

    if (!isMobile) {
      setSmsError(
        "L'envoi de SMS n'est pas pris en charge sur cette plateforme."
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
            "Impossible d'ouvrir l'application de messagerie. Veuillez vérifier que votre appareil supporte les SMS."
          );
        }
      }, 3000); // Délai d'attente de 1 seconde (ajuster si nécessaire)
    } catch (error) {
      setSmsError("Une erreur est survenue lors de l'envoi du SMS.");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const [callError, setCallError] = useState(""); // Utilisation du useState pour l'erreur

  // Fonction pour la gestion des appels
  // const lancerAppel = (numero) => {
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Vérification de la plateforme

  //   if (!isMobile) {
  //     setSmsError(
  //       "Les appels téléphoniques ne sont pas pris en charge sur cette plateforme."
  //     );
  //     return;
  //   }

  //   try {
  //     const callLink = `tel:${numero}`;

  //     // Essayer de rediriger vers le lien d'appel
  //     window.location.href = callLink;

  //     // Vérifier après un délai si l'action a échoué
  //     setTimeout(() => {
  //       if (window.location.href === callLink) {
  //         // Si l'URL n'a pas changé, il y a probablement un problème
  //         setSmsError(
  //           "Impossible d'ouvrir l'application d'appel. Veuillez vérifier que votre appareil supporte les appels."
  //         );
  //       }
  //     }, 3000); // Délai d'attente de 3 secondes
  //   } catch (error) {
  //     setSmsError("Une erreur est survenue lors de la tentative d'appel.");
  //   }
  // };

  const lancerAppel = (numero) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Vérification de la plateforme

    if (!isMobile) {
      setSmsError(
        "Les appels téléphoniques ne sont pas pris en charge sur cette plateforme."
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

  // Sauvegarde des données dans localStorage à chaque mise à jour des états
  useEffect(() => {
    localStorage.setItem("vehicleDetails", JSON.stringify(vehicleDetails));
    localStorage.setItem("mergedData", JSON.stringify(mergedData));

    localStorage.setItem(
      "rapportvehicleDetails",
      JSON.stringify(rapportvehicleDetails)
    );

    localStorage.setItem(
      "donneeFusionneeForRapport",
      JSON.stringify(donneeFusionneeForRapport)
    );
  }, [
    donneeFusionneeForRapport,
    vehicleDetails,
    rapportvehicleDetails,
    mergedData,
  ]);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Pour definir les boutton active en fonction du lien dans le navigateur
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

  const fonctionTest = () => {
    console.log("Start test11111111.....................");

    const now = new Date();
    const TimeTo = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const TimeFrom = `${startOfDay.getFullYear()}-${(startOfDay.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startOfDay
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00`;

    console.log("xxxxxxxxxxxxx", mergedData);
    console.log(vehicleData);
    console.log(vehicleDetails);

    if (vehicleData && vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        // fetRapportchVehicleDetails(
        //   vehicle.deviceID,
        //   "2024-11-30 00:00:00",
        //   "2024-11-30 23:40:45"
        //   /////////////////////////
        //   // "2024-10-01 00:00:00",
        //   // "2024-10-01 23:40:45"
        // );
        // fetchVehicleDetails()
        // fetSearchRapportchVehicleDetails(vehicle.deviceID, TimeFrom, TimeTo);
      });
    }
  };
  const fonctionTest2 = () => {
    console.log("Start test222222222222.....................");

    //     timeFrom: 2024-11-30 00:00:00
    // DataContext.jsx:1526 timeTo: 2024-11-30 14:40:45

    if (vehicleData && vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        console.log("...............................");

        // fetchVehicleDetails(
        fetRapportchVehicleDetails(
          vehicle.deviceID,
          // "2024-11-30 00:00:00",
          // "2024-11-30 23:40:45"
          /////////////////////////
          "2024-10-01 00:00:00",
          "2024-10-01 23:40:45"
        );
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        fonctionTest,
        fonctionTest2,
        userData,
        vehicleData,
        vehicleDetails,
        mergedData,
        isAuthenticated,
        error,
        isLoading,
        handleLogin,
        handleLogout,
        currentVehicule,
        handleDateChange,
        loadingHistoriqueFilter,
        setLoadingHistoriqueFilter,
        searchQuery,
        setSearchQuery,
        search,
        setSearch,
        showSideBar,
        setShowSideBar,
        logOut,
        setLogOut,
        showListeOption,
        setShowListOption,
        fetchVehicleDetails,

        fetchHistoriqueVehicleDetails,
        vehiclueHistoriqueDetails,
        firstCallHistoriqueData,
        setCurrentVehicule,
        account,
        username,
        password,
        isPasswordConfirmed,
        setIsPasswordConfirmed,
        showChangePasswordPupup,
        setShowChangePasswordPupup,
        selectedVehicle,
        setSelectedVehicle,
        createVehicle,
        deleteVehicle,
        updateVehicle,
        setError,
        crud_loading,
        setCrud_loading,

        successAddvehiculePupup,
        setsuccessAddvehiculePupup,
        errorAddvehiculePupup,
        seterrorAddvehiculePupup,

        successModifiervehiculePupup,
        setsuccessModifiervehiculePupup,
        errorModifiervehiculePupup,
        seterrorModifiervehiculePupup,

        successDeletevehiculePupup,
        setsuccessDeletevehiculePupup,
        errorDeletevehiculePupup,
        seterrorDeletevehiculePupup,
        //
        rapportvehicleDetails,
        fetRapportchVehicleDetails,
        firstCallRapportData,
        setRapportDataLoading,
        rapportDataLoading,
        donneeFusionneeForRapport,
        setdonneeFusionneeForRapport,
        vehiculeActiveAjourdhui,
        setVehiculeActiveAjourdhui,
        vehiculeNotActiveAjourdhui,
        setVehiculeNotActiveAjourdhui,
        vehiculeActiveMaintenant,
        setVehiculeActiveMaintenant,
        vehiculeNotActif,
        setVehiculeNotActif,
        handleTabClick,
        tab,
        envoyerSMS,
        smsError,
        setSmsError,
        showHistoriqueInMap,
        setShowHistoriqueInMap,
        setVehiclueHistoriqueDetails,
        fetSearchRapportchVehicleDetails,
        searchdonneeFusionneeForRapport,
        setSearchdonneeFusionneeForRapport,

        timeZoneData,
        setTimeZoneData,
        timeZonesearchQuery,
        settimeZoneSearchQuery,
        selectedTimeZone,
        setSelectedTimeZone,
        selectUTC,
        setselectUTC,
        selectTime,
        setselectTime,
        handleSelectTimeZone,

        //
        showCategorieListe,
        setshowCategorieListe,
        chooseActifs,
        setchooseActifs,
        chooseStationnement,
        setchooseStationnement,
        chooseInactifs,
        setchooseInactifs,
        chooseALl,
        setchooseALl,

        currentdataFusionnee,
        // callError,
        // setCallError,
        lancerAppel,
        setIsLoading,
        setUsername,
        statisticFilter,
        setstatisticFilter,
        statisticFilterText,
        setstatisticFilterText,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
