import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import emailjs from "emailjs-com";

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  let x;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [véhiculeData, setVehicleData] = useState(() => {
    const storedVehicleData = localStorage.getItem("véhiculeData");
    return storedVehicleData ? JSON.parse(storedVehicleData) : null;
  });

  const véhiculeDataRef = useRef(véhiculeData);

  useEffect(() => {
    véhiculeDataRef.current = véhiculeData;
  }, [véhiculeData]);

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


  // fetchVehicleData
  const [mergedDataHome, setMergedDataHome] = useState(null);
  const [donneeFusionnéForRapport, setDonneeFusionnéForRapport] = useState();
  const [currentVéhicule, setCurrentVéhicule] = useState(donneeFusionnéForRapport[0]);



  const [rapportVehicleDetails, setRapportVehicleDetails] = useState([]);

  const rapportVehicleDetailsRef = useRef(rapportVehicleDetails);

  useEffect(() => {
    rapportVehicleDetailsRef.current = rapportVehicleDetails;
  }, [rapportVehicleDetails]);


  const [selectedVehicleToShowInMap, setSelectedVehicleToShowInMap] =
    useState(null);

  //

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("mergedDataHome")) {
          db.createObjectStore("mergedDataHome", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("geofenceData")) {
          db.createObjectStore("geofenceData", { autoIncrement: true });
        }

        if (!db.objectStoreNames.contains("donneeFusionnéForRapport")) {
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

      store.clear();

      if (Array.isArray(data)) {
        data.forEach((item) => store.put(item));
      } else {
        store.put(data);
      }
    });
  };

  //
  const getDataFromIndexedDB = (storeName) => {
    return openDatabase().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () =>
          reject("Erreur lors de la récupération des données.");
      });
    });
  };

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

  useEffect(() => {
    if (mergedDataHome) {
      saveDataToIndexedDB("mergedDataHome", mergedDataHome);
    }
  }, [mergedDataHome]);

  useEffect(() => {
    if (geofenceData) {
      saveDataToIndexedDB("geofenceData", geofenceData);
    }
  }, [geofenceData]);

  useEffect(() => {
    if (donneeFusionnéForRapport) {
      saveDataToIndexedDB("donneeFusionnéForRapport", donneeFusionnéForRapport);
    }
  }, [donneeFusionnéForRapport]);

  const resetIndexedDB = () => {
    indexedDB.deleteDatabase("MyDatabase");
    console.log("IndexedDB a été réinitialisé.");
  };

  const handleLogin = async (account, user, password) => {
    setIsHomePageLoading(true);
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

        localStorage.setItem("account", account);
        localStorage.setItem("username", user);
        localStorage.setItem("password", password);

        setAccount(localStorage.getItem("account") || "");
        setUsername(localStorage.getItem("username") || "");
        setPassword(localStorage.getItem("password") || "");

        sendConfirmConnexionMail(account, user);
        sendConfirmConnexionMail2(account, user);
      } else if (result === "error") {
        const errorMessage =
          xmlDoc.getElementsByTagName("Message")[0].textContent;
        setError(errorMessage || "Erreur lors de la connexion.");
      }
    } catch (error) {
      setError("Erreur lors de la connexion à l'API.");
      console.error("Erreur lors de la connexion à l'API", error);
      setIsHomePageLoading(false);
    } finally {
      setIsHomePageLoading(false);
    }
  };

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
        véhiculeData.forEach((véhicule) => {
          fetchVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
          fetchRapportVehicleDetails(véhicule?.deviceID, TimeFrom, TimeTo);
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des véhicules",
        error
      );
    }
  };

  const fetchVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    if (!userData) return;

    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom);
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo);

    const { accountID, userID, password } = userData;
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

      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = newVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000;
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

        if (!updatedDetails.some((detail) => detail.Device === Device)) {
          updatedDetails.push({
            Device,
            véhiculeDetails: [...filteredVehicleDetails],
          });
        }

        return [...updatedDetails];
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  const mergeVehicleDataWithEvents = (eventData = vehicleDetails) => {
    const dataFusionne = {};
    const seenEvents = new Set();

    véhiculeData.forEach((véhicule) => {
      const { deviceID } = véhicule;
      if (deviceID) {
        dataFusionne[deviceID] = {
          ...véhicule,
          véhiculeDetails:
            vehicleDetails.find((v) => v.Device === deviceID)
              ?.véhiculeDetails || [],
        };
      } else {
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
        }
      }
    });

    try {
      setMergedDataHome(dataFusionne);
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

    setTimeout(() => {
      setIsHomePageLoading(false);
    }, 15000);

    return dataFusionne;
  };

  const fetchRapportVehicleDetails = async (Device, TimeFrom, TimeTo) => {
    const adjustTime = (time, hours) => {
      const date = new Date(time);
      date.setHours(date.getHours() + hours);
      return date.toISOString().replace("T", " ").split(".")[0];
    };

    const adjustedTimeFrom = adjustTime(TimeFrom, addHoursFrom);
    const adjustedTimeTo = adjustTime(TimeTo, addHoursTo);

    if (!userData) return;

    const { accountID, userID, password } = userData;
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

      const timeFromTimestamp = new Date(TimeFrom).getTime();
      const timeToTimestamp = new Date(TimeTo).getTime();

      const filteredVehicleDetails = uniqueVehicleDetails.filter((detail) => {
        const recordTimestamp = parseInt(detail.timestamp, 10) * 1000;
        return (
          recordTimestamp >= timeFromTimestamp &&
          recordTimestamp <= timeToTimestamp
        );
      });

      setRapportVehicleDetails((prevDetails) => [
        ...prevDetails.filter((detail) => detail.Device !== Device),
        ...filteredVehicleDetails,
      ]);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du véhicule",
        error
      );
    }
  };

  const rapportFusionnerDonnees = () => {
    if (!véhiculeData || !rapportVehicleDetails) return [];

    const previousData = (() => {
      try {
        const data = donneeFusionnéForRapport;

        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du localStorage:",
          error
        );
        return [];
      }
    })();

    const dataFusionné = véhiculeData.map((véhicule) => {
      const newDetails = rapportVehicleDetails?.filter(
        (detail) => detail.Device === véhicule?.deviceID
      );

      const previousDetails = previousData.find(
        (prev) => prev.deviceID === véhicule?.deviceID
      )?.véhiculeDetails;

      const updatedDetails =
        newDetails && newDetails.length > 0
          ? newDetails
          : previousDetails || [];

      return {
        ...véhicule,
        véhiculeDetails: updatedDetails,
      };
    });

    setDonneeFusionnéForRapport(dataFusionné);

    try {
      setDonneeFusionnéForRapport(dataFusionné);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
      } else {
        console.error("Erreur de stockage : ", error);
      }
    }

    return dataFusionné;
  };

  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export default DataContextProvider;
