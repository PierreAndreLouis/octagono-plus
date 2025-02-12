import React, { useContext, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import { RiPinDistanceLine } from "react-icons/ri";
import { SlSpeedometer } from "react-icons/sl";
import { TfiMapAlt } from "react-icons/tfi";
import { FaCar } from "react-icons/fa";
import { PiMapPinAreaBold } from "react-icons/pi";
import { LuParkingCircle } from "react-icons/lu";
import { GiPathDistance } from "react-icons/gi";
import { FiMapPin } from "react-icons/fi";
import { TbLock } from "react-icons/tb";
import { TbLockOpen } from "react-icons/tb";
import { FaHeadphonesAlt } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { DataContext } from "../../context/DataContext";

function RapportOptions({
  setshowRapportPupup,
  currentVéhicule,
  formatTimestampToTime,
  envoyerSMS,
  smsError,
  setShowHistoriqueInMap,
  setVéhiculeHistoriqueDetails,
}) {
  const {
    mergedDataHome,
    setCurrentVéhicule,
    setShowListOption,
    selectUTC,
    setVehiclueHistoriqueRapportDetails,
    véhiculeHistoriqueDetails,
  } = useContext(DataContext);
  const [showStatisticOption, setshowStatisticOption] = useState(true);
  const [showSmsError, setshowSmsError] = useState(false);

  const filteredList = currentVéhicule?.véhiculeDetails?.filter(
    (item) => parseFloat(item.speedKPH) > 0
  );

  // Trouve l'élément avec le timestamp minimum
  const heureActiveDebut = filteredList?.reduce((minItem, currentItem) => {
    return parseInt(currentItem.timestamp) < parseInt(minItem.timestamp)
      ? currentItem
      : minItem;
  }, filteredList[0]);

  const heureActiveFin = filteredList?.reduce((maxItem, currentItem) => {
    return parseInt(currentItem.timestamp) > parseInt(maxItem.timestamp)
      ? currentItem
      : maxItem;
  }, filteredList[0]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
  }

  function calculateTotalDistance(dataList) {
    let totalDistance = 0;

    for (let i = 1; i < dataList.length; i++) {
      const prevPoint = dataList[i - 1];
      const currPoint = dataList[i];

      const distance = calculateDistance(
        parseFloat(prevPoint.latitude),
        parseFloat(prevPoint.longitude),
        parseFloat(currPoint.latitude),
        parseFloat(currPoint.longitude)
      );

      totalDistance += distance;
    }

    return totalDistance; // Distance totale en kilomètres
  }

  function calculateSpeedStats(dataList) {
    // Filtre pour ne garder que les vitesses supérieures à 0
    const speeds = dataList
      .map((item) => parseFloat(item.speedKPH))
      .filter((speed) => speed > 0);

    if (speeds.length === 0) {
      return {
        minSpeed: 0,
        maxSpeed: 0,
        averageSpeed: 0,
      };
    }

    // Calcul de la vitesse minimale, maximale et moyenne
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);

    const averageSpeed =
      speeds?.reduce((sum, speed) => sum + speed, 0) / speeds.length;

    return {
      minSpeed,
      maxSpeed,
      averageSpeed,
    };
  }

  const { minSpeed, maxSpeed, averageSpeed } = calculateSpeedStats(
    currentVéhicule.véhiculeDetails
  );

  function getUniqueAddresses(dataList) {
    // Extraire toutes les adresses de la liste
    const addresses = dataList.map((item) => item.address);

    // Utiliser un Set pour éliminer les doublons
    const uniqueAddresses = [...new Set(addresses)];

    return uniqueAddresses;
  }

  const uniqueAddresses = getUniqueAddresses(currentVéhicule?.véhiculeDetails);

  function getUniqueAddressesWhenSpeedZeroOrLess(dataList) {
    // Filtrer les éléments où la vitesse est <= 0
    const filteredData = dataList.filter(
      (item) => parseFloat(item.speedKPH) <= 0
    );

    // Extraire les adresses de ces éléments filtrés
    const addresses = filteredData.map((item) => item.address);

    // Utiliser un Set pour éliminer les doublons
    const uniqueAddresses = [...new Set(addresses)];

    return uniqueAddresses;
  }
  const uniqueAddressesZerroSpeed = getUniqueAddressesWhenSpeedZeroOrLess(
    currentVéhicule?.véhiculeDetails
  );

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

  return (
    <div>
      {/* 
      <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50">
        <div className="w-[80vw] max-w-[40rem] bg-white overflow-hidden rounded-lg">
          <div className="h-16 bg-red-600 text-white text-xl font-semibold text-center flex justify-center items-center p-2">
            <h1>Toyota Land Cruser Prada</h1>
          </div>
          <div className="p-4  flex flex-col gap-4 py-6">
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-red-100 bg-red-50 p-2 rounded-md flex items-center gap-4">
              <IoStatsChartSharp className="min-w-[2rem] text-[1.92rem] text-red-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-red-700">
                Historique du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-red-100 bg-red-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/orange_parcoure.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-red-700">
                Trajet du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-red-100 bg-red-50 p-2 rounded-md flex items-center gap-4">
              <MdLocationPin className="text-[2rem] text-red-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-red-700">
                Position actuel du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-red-100 bg-red-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/group_position.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-red-700">
                Tous les véhicule en deplacement
              </h2>
            </div>
          </div>
        </div>
      </div> 
      */}

      <div className="fixed flex justify-center items-center z-[9999999999999999999999999999999999999999999999999991] inset-0 bg-black/50">
        <div className="relative w-[95vw] xl:w-[90vw] border-b-[.8rem] dark:border-gray-800 border-b-white dark:bg-gray-800  max-w-[40rem] bg-white overflow-hidden rounded-lg">
          <IoMdClose
            onClick={() => {
              setshowRapportPupup(false);
            }}
            className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500"
          />
          <div className="h-16-- py-5 bg-orange-100 dark:bg-gray-800 dark:text-gray-50 dark:shadow-lg dark:shadow-gray-900 shadow-md text-gray-800 text-xl font-semibold text-center flex justify-center items-center p-2">
            <h1 className="px-3">{currentVéhicule?.description}</h1>
          </div>

          {/*  */}

          {/* Button statistic et options */}
          <div className="grid grid-cols-2 gap-4 w-full justify-between py-3 px-4 items-center">
            <button
              // onClick={() => {
              //   console.log(uniqueAddresses);
              // }}
              onClick={() => setshowStatisticOption(true)}
              className={`${
                showStatisticOption && "bg-orange-100/80 dark:bg-orange-600"
              } dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 dark:text-gray-50 rounded-lg py-1 px-2 bg-gray-100 shadow-md rounded-md"`}
            >
              Statistics
            </button>
            <button
              onClick={() => setshowStatisticOption(false)}
              className={`${
                !showStatisticOption && "bg-orange-100/80 dark:bg-orange-600"
              } dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 dark:text-gray-50 rounded-lg py-1 px-2 bg-gray-100 shadow-md rounded-md"`}
            >
              Options
            </button>
          </div>

          {/*  */}

          {/* {showStatisticOption ? (
            // Statistics Section
            <div className="p-4 min-h-[60vh] max-h-[60vh] md:min-h-[55vh] md:max-h-[55vh] overflow-y-auto flex flex-col gap-4 py-6 pb-10">
              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <IoTimeOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                    Heure
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>
                      Heure de départ:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {heureActiveDebut
                          ? selectUTC
                            ? formatTimestampToTimeWithTimezone(
                                heureActiveDebut.timestamp,
                                selectUTC
                              )
                            : formatTimestampToTime(heureActiveDebut.timestamp)
                          : "Null"}
                      </span>
                    </p>
                    <p>
                      Dernière heure en mouvement:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {heureActiveFin
                          ? selectUTC
                            ? formatTimestampToTimeWithTimezone(
                                heureActiveFin.timestamp,
                                selectUTC
                              )
                            : formatTimestampToTime(heureActiveFin.timestamp)
                          : "Null"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                    Distance Parcourue
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>
                      Distance totale:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {calculateTotalDistance(
                          currentVéhicule?.véhiculeDetails
                        ).toFixed(2)}
                        Km
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <SlSpeedometer className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                    Vitesse
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>
                      Vitesse minimale:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {minSpeed.toFixed(2) || "0"} Km/h
                      </span>
                    </p>
                    <p>
                      Vitesse moyenne:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {averageSpeed.toFixed(2) || "0"} Km/h
                      </span>
                    </p>
                    <p>
                      Vitesse maximale:
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        {maxSpeed.toFixed(2) || "0"} Km/h
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <PiMapPinAreaBold className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                    Adresse
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 flex flex-col gap-3">
                    <p>
                      <span className="font-semibold text-gray-800 dark:text-orange-500 pr-3">
                        Adresse Début:
                      </span>
                      {currentVéhicule?.véhiculeDetails[0]?.address ||
                        "pas de resultat"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800 dark:text-orange-500 pr-3">
                        Dernière position:
                      </span>
                      {currentVéhicule?.véhiculeDetails[
                        currentVéhicule?.véhiculeDetails.length - 1
                      ]?.address || "pas de resultat"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <TfiMapAlt className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-500 text-orange-900">
                    Tous les lieux fréquentés
                  </h2>
                  <div className="text-gray-600 flex flex-col gap-3">
                    {uniqueAddresses?.map((add, index) => {
                      return (
                        <p className="dark:text-gray-300">
                          <span className="font-bold dark:text-orange-500 text-black mr-3">
                            *{" "}
                          </span>
                          {add}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-start gap-4">
                <FaCar className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <div>
                  <h2 className="font-semibold dark:text-orange-500 text-orange-900">
                    Tous les lieux Stationnés
                  </h2>
                  <div className="text-gray-600 flex flex-col gap-3">
                    {uniqueAddressesZerroSpeed?.map((add, index) => {
                      return (
                        <p className="dark:text-gray-300" key={index}>
                          <span className="font-bold dark:text-orange-500 text-black mr-3">
                            *{" "}
                          </span>
                          {add}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : ( */}
          {/* // Options section */}
          <div className="p-4 min-h-[60vh] max-h-[60vh] md:min-h-[55vh] md:max-h-[55vh] overflow-y-auto flex flex-col gap-4 py-6 pb-10">
            <Link
              to="/voiture_historique"
              onClick={() => {
                setShowHistoriqueInMap(false);

                setVéhiculeHistoriqueDetails(currentVéhicule?.véhiculeDetails);
              }}
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <IoStatsChartSharp className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Historique du véhicule
              </h2>
            </Link>

            <Link
              to="/voiture_historique"
              onClick={() => {
                setShowHistoriqueInMap(true);
                setVéhiculeHistoriqueDetails(currentVéhicule?.véhiculeDetails);
                setVehiclueHistoriqueRapportDetails(
                  currentVéhicule?.véhiculeDetails
                );
              }}
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <GiPathDistance className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Trajet du véhicule{" "}
              </h2>
            </Link>

            <Link
              to="/Groupe_vehicule_location"
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <FiMapPin className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Position du véhicule{" "}
              </h2>
            </Link>
            <div
              onClick={() => {
                {
                  envoyerSMS(
                    currentVéhicule.simPhoneNumber,
                    "Bonjour, ceci est un test de Déblocage"
                  );
                  setshowSmsError(!showSmsError);
                }
              }}
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <TbLock className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Bloquer le véhicule{" "}
              </h2>
              {/* <p>{smsError}</p> */}
            </div>

            <div
              onClick={() => {
                {
                  envoyerSMS(
                    currentVéhicule.simPhoneNumber,
                    "Bonjour, ceci est un test de Déblocage"
                  );
                  setshowSmsError(!showSmsError);
                }
              }}
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <TbLockOpen className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Débloquer le véhicule{" "}
              </h2>
              {/* <p>{smsError}</p> */}
            </div>

            {showSmsError && smsError && (
              <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
                <div className="bg-red-50 max-w-[25rem] p-6 rounded-xl w-[80vw]">
                  <div>
                    <h3 className="block text-lg  text-center leading-6 text-red-600 mb-3">
                      {smsError}
                    </h3>
                  </div>
                  <div className="flex justify-center gap-2 mt-5">
                    <h3
                      onClick={() => {
                        setshowSmsError(!showSmsError);
                      }}
                      className="cursor-pointer py-1 text-center px-10 bg-red-500 rounded-lg text-white"
                    >
                      OK
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------- */}

            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 py-3 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <FaHeadphonesAlt className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Écouter la discussion dans le véhicule{" "}
              </h2>
            </div>

            <Link
              to="/voiture_details"
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <IoInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Informations sur le véhicule{" "}
              </h2>
            </Link>

            <Link
              to="/modifier_vehicule"
              className="shadow-md cursor-pointer py-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4"
            >
              <CiEdit className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Modifier le véhicule{" "}
              </h2>
            </Link>

            {/* <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 py-3 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
                <IoStatsChartSharp className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
                <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                  Position du véhicule
                </h2>
              </div> */}
          </div>
          {/* )} */}
        </div>
      </div>

      {/* <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50">
        <div className="w-[80vw] max-w-[40rem] bg-white overflow-hidden rounded-lg">
          <div className="h-16 bg-green-500 text-white text-xl font-semibold text-center flex justify-center items-center p-2">
            <h1>Toyota Land Cruser Prada</h1>
          </div>
          <div className="p-4  flex flex-col gap-4 py-6">
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-green-100 bg-green-50 p-2 rounded-md flex items-center gap-4">
              <IoStatsChartSharp className="min-w-[2rem] text-[1.92rem] text-green-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-green-700">
                Historique du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-green-100 bg-green-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/green_parcoure.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-green-700">
                Trajet du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-green-100 bg-green-50 p-2 rounded-md flex items-center gap-4">
              <MdLocationPin className="text-[2rem] text-green-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-green-700">
                Position actuel du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-green-100 bg-green-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/group_position.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-green-700">
                Tous les véhicule en deplacement
              </h2>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50">
        <div className="w-[80vw] max-w-[40rem] bg-white overflow-hidden rounded-lg">
          <div className="h-16 bg-purple-800 text-white text-xl font-semibold text-center flex justify-center items-center p-2">
            <h1>Toyota Land Cruser Prada</h1>
          </div>
          <div className="p-4  flex flex-col gap-4 py-6">
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-purple-100 bg-purple-50 p-2 rounded-md flex items-center gap-4">
              <IoStatsChartSharp className="min-w-[2rem] text-[1.92rem] text-purple-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-purple-900">
                Historique du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-purple-100 bg-purple-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/green_parcoure.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-purple-900">
                Trajet du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-purple-100 bg-purple-50 p-2 rounded-md flex items-center gap-4">
              <MdLocationPin className="text-[2rem] text-purple-600 " />
              <h2 className="font-semibold dark:text-orange-50 text-purple-900">
                Position actuel du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-purple-100 bg-purple-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/group_position.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-purple-900">
                Tous les véhicule en deplacement
              </h2>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50">
        <div className="relative w-[90vw] max-w-[40rem] bg-white overflow-hidden rounded-lg">
        <IoMdClose
            onClick={() => {
              setshowRapportPupup(false);
            }}
            className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500"
          />
          <div className="h-16 bg-orange-100 shadow-md text-gray-800 text-xl font-semibold text-center flex justify-center items-center p-2">
            <h1 className="px-3">Toyota Land Cruser Prada</h1>
          </div>
          <div 
        //   onClick={() => {setshowRapportPupup(false)}}
          className="p-4  flex flex-col gap-4 py-6 pb-10">
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <IoStatsChartSharp className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Historique du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/parcoure.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Trajet du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <MdLocationPin className="text-[2rem] min-w-8 text-orange-400 " />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Position actuel du véhicule
              </h2>
            </div>
            <div className="shadow-md cursor-pointer dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4 hover:bg-orange-100/70 bg-orange-50 p-2 rounded-md flex items-center gap-4">
              <img
                className="w-[1.92rem]"
                src="/img/cars/orange_group_position.png"
                alt=""
              />
              <h2 className="font-semibold dark:text-orange-50 text-orange-900">
                Tous les vehicules en deplacement
              </h2>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default RapportOptions;
