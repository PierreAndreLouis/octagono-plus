import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import "./style.css";

function Liste() {
  const {
    mergedData,
    setCurrentVehicule,
    setSelectedVehicle,
    isLoading,
    setShowListOption,
    currentVehicule,
    updateCurrentVehicule,
    searchQuery,
    donneeFusionneeForRapport,
    selectUTC,
    userData,
    vehicleData,
    vehicleDetails,
    fetchVehicleDetails,
    fetRapportchVehicleDetails,
    fonctionTest,
    fonctionTest2,
    setSearchdonneeFusionneeForRapport,
  } = useContext(DataContext);

  const dataFusionee = mergedData ? Object.values(mergedData) : [];

  // Filtrer les données selon la recherche
  const filteredData = searchQuery
    ? dataFusionee.filter(
        (vehicle) =>
          vehicle?.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (vehicle.vehiculeDetails?.[0]?.address &&
            vehicle.vehiculeDetails[0].address
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : dataFusionee;

  useEffect(() => {
    console.log("Véhicule mis à jour", currentVehicule);
  }, [currentVehicule]);

  const handleClick = (vehicle) => {
    setCurrentVehicule(vehicle);
    setSelectedVehicle(vehicle.deviceID);
    setShowListOption(true);
    setSearchdonneeFusionneeForRapport([]);
    console.log("Véhicule cliqué:", vehicle);
  };

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes} ${period}`;
  }

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  function convertToTimezone(timestamp, offset) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const [sign, hours, minutes] = offset
      .match(/([+-])(\d{2}):(\d{2})/)
      .slice(1);
    const totalOffsetMinutes =
      (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);

    date.setMinutes(date.getMinutes() + totalOffsetMinutes); // Appliquer le décalage
    return date;
  }

  function formatTimestampToDateWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTimestampToTimeWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const reloadVehiculeDetails = () => {
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
  };

  // Composant pour afficher l'adresse
  function VehicleAddress({ longitude, latitude }) {
    const [address, setAddress] = useState("");

    useEffect(() => {
      const fetchAddress = async () => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.address) {
            const { road, suburb, city, country } = data.address;
            setAddress(
              `${road || ""}, ${suburb || ""}, ${city || ""}, ${country || ""}`
            );
          } else {
            setAddress("Adresse non disponible");
          }
        } catch (error) {
          setAddress("Erreur de récupération de l'adresse");
        }
      };

      fetchAddress();
    }, [longitude, latitude]);

    return <p>Adresse: {address}</p>;
  }

  return (
    <div className="p-2 flex flex-col gap-4 mt-4 mb-32 dark:text-white">
      <button
        onClick={() => {
          // Debug test - VehicleAddress
          VehicleAddress({
            longitude: -46.76834833333334,
            latitude: -23.4797645,
          });
        }}
      >
        Test Adresse
      </button>
      {isLoading ? (
        <p>Chargement des données...</p>
      ) : filteredData.length > 0 ? (
        filteredData.map((vehicle, index) => {
          const speed = vehicle.vehiculeDetails?.[0]?.speedKPH || 0;

          let main_text_color = "text-red-900 dark:text-red-300";
          let statut = "";
          let lite_bg_color =
            "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
          let activeTextColor = "text-red-900 dark:text-red-200";
          let active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
          let vitess_img = "";
          let imgClass = "w-14 sm:w-16 md:w-24";

          ////////////////////////////////////////////////////////////////////////

          // Vérifier si les détails du véhicule existent et s'il est inactif
          const twentyHoursInMs = 24 * 60 * 60 * 1000;
          const currentTime = Date.now();
          const lastUpdateTime = vehicle?.lastUpdateTime;
          const lastUpdateTimeMs = lastUpdateTime ? lastUpdateTime * 1000 : 0;
          const isInactive =
            lastUpdateTimeMs > 0 &&
            currentTime - lastUpdateTimeMs >= twentyHoursInMs;

          if (!vehicle.vehiculeDetails || isInactive) {
            main_text_color = "text-purple-900 dark:text-purple-300 md:hidden";
            statut = "En arrêt";
            lite_bg_color =
              "bg-purple-100/40 dark:bg-gray-900/40 dark:shadow-gray-600/50 dark:shadow-lg dark:border-l-[.5rem] dark:border-purple-600/80 shadow-lg shadow-gray-950/20";
            activeTextColor = "text-purple-800 dark:text-purple-100";
            active_bg_color = "bg-purple-200/50 dark:bg-purple-600/50";
          } else {
            switch (speed) {
              case speed >= 10 && speed < 30:
                vitess_img = "yellow_vitess.png";
                break;
              case speed >= 30 && speed < 50:
                vitess_img = "green_vitess.png";
                break;
              default:
                vitess_img = "orange_vitess.png";
                break;
            }
          }

          return (
            <div
              key={index}
              onClick={() => handleClick(vehicle)}
              className={`p-2 px-4 md:px-8 flex gap-2 md:gap-4 justify-between rounded-md text-sm lg:text-lg font-bold transition-all ease-in-out cursor-pointer ${lite_bg_color}`}
            >
              <div className="flex gap-2">
                <img
                  src={`./images/${vitess_img}`}
                  alt="Indicateur de vitesse"
                  className={imgClass}
                />
                <div className="flex flex-col">
                  <p className={`font-medium ${main_text_color}`}>
                    {vehicle?.description}
                  </p>
                  <p
                    className={`font-medium md:hidden ${main_text_color}`}
                    onClick={() => handleClick(vehicle)}
                  >
                    {vehicle?.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div
                  className={`flex flex-row gap-1 items-center ${activeTextColor}`}
                >
                  <FaCar className="text-lg" />
                  {statut}
                </div>
                <div className="flex gap-1 text-sm text-gray-500">
                  <IoMdTime className="text-lg" />
                  {formatTimestampToTime(
                    vehicle.vehiculeDetails?.[0]?.timestamp
                  )}
                </div>
                <VehicleAddress
                  latitude={vehicle.vehiculeDetails?.[0]?.latitude}
                  longitude={vehicle.vehiculeDetails?.[0]?.longitude}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p>Aucun véhicule trouvé</p>
      )}
    </div>
  );
}

export default Liste;
