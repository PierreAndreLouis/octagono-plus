import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
// import RapportOptions from "./RapportOptions";
import { IoReload } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import RapportOptions from "../components/rapport_vehicule/RapportOptions";
import VehiculeActiveMaintenantComponent from "../components/rapport_vehicule/VehiculeActiveMaintenantComponent";
import VehiculeNotActiveAjourdhuiComponent from "../components/rapport_vehicule/VehiculeNotActiveAjourdhuiComponent";
import VehiculeActiveAjourdhuiComponent from "../components/rapport_vehicule/VehiculeActiveAjourdhuiComponent";
import DateTimePicker from "../components/home/DateTimePicker";
import DateInput from "../components/rapport_vehicule/DateInput";
import VehiculeNotActifComponent from "../components/rapport_vehicule/VehiculeNotActifComponent";
// import { IoReload } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import DatePupup from "../components/rapport_vehicule/DatePupup";

function RapportPage({
  setpageSection,
  showChooseDate,
  setShowChooseDate,
  handleApply,
  showDatePicker2,
  setShowDatePicker2,
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
}) {
  const {
    vehicleData,
    rapportvehicleDetails,
    rapportDataLoading,
    firstCallRapportData,
    mergedData,
    isLoading,
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
    setCurrentVehicule,
    setSelectedVehicle,
    setShowListOption,
    currentVehicule,
    showListeOption,
    setRapportDataLoading,
    envoyerSMS,
    smsError,
    firstCallHistoriqueData,
    setShowHistoriqueInMap,
    setVehiclueHistoriqueDetails,
    vehiclueHistoriqueDetails,
    searchdonneeFusionneeForRapport,
    fetSearchRapportchVehicleDetails,
    setSearchdonneeFusionneeForRapport,
    selectUTC,
    currentdataFusionnee,
    // setShowListOption,
    // showListeOption,
    fonctionTest,
    fonctionTest2,
  } = useContext(DataContext);

  const [showActiveVehiculeNow, setshowActiveVehiculeNow] = useState(false);
  const [showActiveVehicule, setshowActiveVehicule] = useState(false);
  const [showParkingVehicule, setshowParkingVehicule] = useState(false);
  const [showInactiveVehicule, setshowInactiveVehicule] = useState(false);
  // const [showChooseDate, setShowChooseDate] = useState(false);
  //
  const [showRapportPupup, setshowRapportPupup] = useState(false);

  useEffect(() => {
    if (vehiculeActiveAjourdhui.length === 0) {
      setshowActiveVehicule(false);
    } else {
      setshowActiveVehicule(true);
    }

    if (vehiculeActiveMaintenant.length === 0) {
      setshowActiveVehiculeNow(false);
    } else {
      setshowActiveVehiculeNow(true);
    }

    if (vehiculeNotActiveAjourdhui.length === 0) {
      setshowParkingVehicule(false);
    } else {
      setshowParkingVehicule(true);
    }

    if (vehiculeNotActif.length === 0) {
      setshowInactiveVehicule(false);
    } else {
      setshowInactiveVehicule(true);
    }
  }, [
    vehiculeActiveAjourdhui,
    vehiculeNotActiveAjourdhui,
    vehiculeActiveMaintenant,
    vehiculeNotActif,
  ]);

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
    // return `${hours}:${minutes}:${seconds} ${period}`;
  }

  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fonction pour défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Défilement fluide
    });
  };

  const handleClick = (vehicle) => {
    // setCurrentVehicule(vehicle);

    const deviceID = vehicle.deviceID;

    // // Recherche du véhicule correspondant dans la liste
    const foundVehicle = currentdataFusionnee.find(
      (v) => v.deviceID === deviceID
    );

    if (foundVehicle) {
      setCurrentVehicule(foundVehicle); // Définit le véhicule actuel
      setpageSection("unite");
      window.scrollTo({
        top: 0,
        behavior: "auto", // Défilement fluide
        // behavior: "smooth", // Défilement fluide
      });
    } else {
      console.error("Véhicule introuvable avec le deviceID :", deviceID);
    }
  };

  // Fonction pour formater la date sélectionnée
  const formatDate = (dateInput) => {
    if (!dateInput) {
      // Si la date est vide, afficher Aujourd'hui
      const today = new Date();
      return "Rapport Véhicule";
    }

    const selected = new Date(dateInput + "T00:00:00");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getUTCDate() - 1);

    // Vérifier si la date correspond à Aujourd'hui
    if (selected.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }

    // Vérifier si la date correspond à Hier
    if (selected.toDateString() === yesterday.toDateString()) {
      return "Hier";
    }

    // Sinon, formater la date normalement
    return selected.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  //////////////////////////////////////////////////////////////////

  const donneeVehiculeDetails = currentdataFusionnee?.find(
    (vehicule) =>
      vehicule.vehiculeDetails && vehicule.vehiculeDetails.length > 0
  )?.vehiculeDetails;

  let premierDetail;
  let dernierDetails;
  // Vérifier si les détails existent avant d'y accéder
  if (donneeVehiculeDetails && donneeVehiculeDetails.length > 0) {
    premierDetail =
      donneeVehiculeDetails[donneeVehiculeDetails.length - 1]?.timestamp;
    dernierDetails = donneeVehiculeDetails[0]?.timestamp;

    console.log("Premier détail:", premierDetail);
    console.log("Dernier détail:", dernierDetails);
  } else {
    console.log("Aucun détail de véhicule disponible.");
  }

  // Trouver la date du rapport
  const timestampInSecondsDebut = premierDetail;

  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDebut = dateObjectDebut.getUTCDate(); // Obtenir le jour
  const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  const timestampInSecondsFin = dernierDetails;

  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourFin = dateObjectFin.getUTCDate(); // Obtenir le jour
  const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  return (
    <div className="pb-56 pt-10 min-h-screen">
      {showRapportPupup && (
        <RapportOptions
          setshowRapportPupup={setshowRapportPupup}
          currentVehicule={currentVehicule}
          formatTimestampToTime={formatTimestampToTime}
          envoyerSMS={envoyerSMS}
          smsError={smsError}
          firstCallHistoriqueData={firstCallHistoriqueData}
          setShowHistoriqueInMap={setShowHistoriqueInMap}
          setVehiclueHistoriqueDetails={setVehiclueHistoriqueDetails}
        />
      )}
      {rapportDataLoading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-gray-900/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}
      <div className="mt-[2.5rem]">
        <div className=" overflow-hidden">
          <div className={` transition-all `}>
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}
            {/* ------------------- */}

            {/* Rapport des vehicule */}
            <div className=" w-full sm:px-6 md:px-20 px-2">
              <h1
                onClick={() => {
                  console.log(day, month);
                }}
                className=" dark:text-orange-400 text-center mx-4 text-lg text-orange-600"
              >
                Résultat de recherche
              </h1>
              <h1 className="font-semibold dark:text-gray-200 text-center mx-4 mb-10 text-xl">
                {/* {formatDate(selectedDate)} */}
                {
                  jourDebut ? (
                    <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                      Du{" "}
                      <span className="dark:text-gray-50 dark:font-normal font-semibold- text-gray-950">
                        {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                        {anneeDebut === anneeFin ? "" : anneeDebut}
                      </span>{" "}
                      au{" "}
                      <span className="dark:text-gray-50 dark:font-normal font-semibold- text-gray-950">
                        {jourFin} {moisFin} {anneeFin}
                      </span>
                    </span>
                  ) : (
                    <span>Pas de date disponible</span>
                  )
                  // )
                }
              </h1>

              {/* //////////////////////////////////// */}
              <div className="flex gap-2 justify-end mb-4 ">
                <button
                  className="bg-orange-50 dark:bg-gray-700 py-2 shadow-lg rounded-lg px-3"
                  onClick={() => {
                    setSearchdonneeFusionneeForRapport([]);
                    setRapportDataLoading(true);
                    firstCallRapportData();
                  }}
                >
                  <IoReload className="text-orange-600 dark:text-gray-50 text-xl" />
                </button>

                <button
                  className="bg-orange-50 dark:bg-gray-700 shadow-lg rounded-lg px-3"
                  onClick={() => {
                    setShowChooseDate(true);
                  }}
                >
                  <BsFillCalendar2DateFill className="text-orange-600 dark:text-gray-50 text-xl" />
                </button>
              </div>

              {/* //////////////////////////////// */}

              {/* <button
                onClick={() => {
                  fonctionTest();
                }}
              >
                {" "}
                test
              </button> */}
              {/* <VehiculeActiveMaintenantComponent
                showActiveVehiculeNow={showActiveVehiculeNow}
                setshowActiveVehiculeNow={setshowActiveVehiculeNow}
                vehiculeActiveMaintenant={vehiculeActiveMaintenant}
                setshowRapportPupup={setshowRapportPupup}
                formatTimestampToDate={formatTimestampToDate}
                formatTimestampToTime={formatTimestampToTime}
                handleClick={handleClick}
                selectUTC={selectUTC}
              /> */}
              {/* ----------------------------------- */}
              <VehiculeActiveAjourdhuiComponent
                showActiveVehicule={showActiveVehicule}
                setshowActiveVehicule={setshowActiveVehicule}
                vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
                setshowRapportPupup={setshowRapportPupup}
                formatTimestampToDate={formatTimestampToDate}
                formatTimestampToTime={formatTimestampToTime}
                handleClick={handleClick}
                selectUTC={selectUTC}
              />
              {/* ----------------------------------- */}
              <VehiculeNotActiveAjourdhuiComponent
                showParkingVehicule={showParkingVehicule}
                setshowParkingVehicule={setshowParkingVehicule}
                vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
                setshowRapportPupup={setshowRapportPupup}
                formatTimestampToDate={formatTimestampToDate}
                formatTimestampToTime={formatTimestampToTime}
                handleClick={handleClick}
                selectUTC={selectUTC}
              />
              {/* ----------------------------------- */}
              <VehiculeNotActifComponent
                showInactiveVehicule={showInactiveVehicule}
                setshowInactiveVehicule={setshowInactiveVehicule}
                vehiculeNotActif={vehiculeNotActif}
                setshowRapportPupup={setshowRapportPupup}
                formatTimestampToDate={formatTimestampToDate}
                formatTimestampToTime={formatTimestampToTime}
                handleClick={handleClick}
              />
              {/* ----------------------------------- */}
            </div>

            {/* ------------------- */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RapportPage;
