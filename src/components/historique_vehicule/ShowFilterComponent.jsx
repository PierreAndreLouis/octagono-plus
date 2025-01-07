import React, { useContext } from "react";
import { MdDateRange } from "react-icons/md";
import { FaCarRear } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";

import { IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { DataContext } from "../../context/DataContext";
import { Link } from "react-router-dom";

function ShowFilterComponent({
  showFilter,
  setshowFilter,
  showHistoriqueInMap,
  setShowDatePicker,
  checkboxes,
  handleCheckboxChange,
  applyFilter,
  setTypeDeVue,
  timeFrom,
  timeTo,
  startDate,
  startTime,
  endDate,
  endTime,
  showVehiculeListe,
  setShowVehiculeListe,
}) {
  const {
    vehiclueHistoriqueDetails,
    currentVehicule,
    setCurrentVehicule,
    currentdataFusionnee,
    dateDebut,
  } = useContext(DataContext);

  const updateRapportVehiculeDetails = () => {
    setCurrentVehicule((prev) => ({
      ...prev,
      vehiclueHistoriqueDetails,
    }));
  };

  const formatDate = (date) => {
    // Vérifiez si c'est déjà une chaîne, sinon, convertissez-la en format "dd/MM/yyyy"
    if (typeof date === "string") {
      const [day, month, year] = date.split("-"); // Sépare le jour, le mois et l'année
      return `${year}-${month}-${day}`; // Recombine en format 'YYYY-MM-DD'
    } else if (date instanceof Date) {
      // Si c'est un objet Date, formatez-le en "dd/MM/yyyy"
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return date; // Retourne la date telle quelle si elle n'est ni string ni Date
  };

  const formatDateToISO = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convertir en objet Date si nécessaire
    }
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split("T")[0];
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convertir en objet Date si nécessaire
    }
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = adjustedDate.getFullYear();
    return `${day}-${month}-${year}`; // Format "DD-MM-YYYY"
  };

  // const formatDate = (dateDebut) => {
  //   const [day, month, year] = dateDebut?.split("/"); // Sépare le jour, le mois et l'année
  //   return `${year}-${month}-${day}`; // Recombine en format 'YYYY-MM-DD'
  // };

  // // Conversion des variables startDate et endDate
  // const formattedStartDate = formatDate(dateDebut);
  // const formattedStartDate = "asfasdfs";

  return (
    <>
      {showFilter && (
        <div className="fixed inset-0 z-20 w-full flex justify-center items-center p-2 bg-black/50">
          <div className="relative max-w-[30rem] bg-white w-[90vw] rounded-md p-4 dark:bg-gray-800">
            <IoMdClose
              onClick={() => {
                setshowFilter(false);
                // console.log("formattedStartDate", formattedStartDate);
              }}
              className="absolute top-0 cursor-pointer -right-0 min-w-14 py-2 text-[2.53rem] text-red-600 dark:text-red-400"
            />

            {showHistoriqueInMap && (
              <div
                onClick={() => {
                  setTypeDeVue(true);
                  setshowFilter(!showFilter);
                }}
                className="flex  mt-6 items-center justify-between gap-1 border px-2 py-1 cursor-pointer bg-orange-50 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <label htmlFor="mapType">Type de vue</label>
                <FaChevronDown />
                {/* <hr className="dark:border-gray-600 mt-5" /> */}
              </div>
            )}

            <div
              onClick={() => {
                setShowDatePicker(true);
                // setshowFilter(false);
              }}
              className="flex my-3 p-2 rounded-md hover:bg-orange-100/50 cursor-pointer items-center gap-3 dark:hover:bg-gray-700"
            >
              <MdDateRange className="text-xl text-orange-600 dark:text-orange-400" />
              <h3 className="text-gray-800 dark:text-gray-200">
                Filtrer par Date
              </h3>
            </div>

            <hr className="dark:border-gray-600" />

            {/* /////////////////////////////////////////////////////////// */}

            <form action="" className="p-2">
              <div className="flex pt-4 mb-4 items-center gap-3">
                <FaCarRear className="text-xl text-orange-600/90 dark:text-orange-400" />
                <h3 className="text-gray-800 dark:text-gray-200">
                  Filtrer par statut
                </h3>
              </div>
              <div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_marche"
                    type="checkbox"
                    checked={checkboxes.en_marche}
                    onChange={() => handleCheckboxChange("en_marche")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_marche"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    En marche
                  </label>
                </div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_ralenti"
                    type="checkbox"
                    checked={checkboxes.en_ralenti}
                    onChange={() => handleCheckboxChange("en_ralenti")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_ralenti"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    En ralenti
                  </label>
                </div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_arret"
                    type="checkbox"
                    checked={checkboxes.en_arret}
                    onChange={() => handleCheckboxChange("en_arret")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_arret"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    En arrêt
                  </label>
                </div>

                {/* <div className="pt-4">
                  <hr className="dark:border-gray-600" />

                  <Link
                    onClick={() => {
                      updateRapportVehiculeDetails();
                    }}
                    to="/rapport_page_details"
                    // className="flex pt-4 mb-4 items-center gap-3"
                    className="flex my-3 p-2 rounded-md hover:bg-orange-100/50 cursor-pointer items-center gap-3 dark:hover:bg-gray-700"
                  >
                    <MdOutlineStickyNote2 className="text-xl text-orange-600/90 dark:text-orange-400" />
                    <h3 className="text-gray-800 dark:text-gray-200">
                      Rapport du Vehicule
                    </h3>
                  </Link>
                </div> */}
              </div>
            </form>

            <hr className="dark:border-gray-600" />

            <div className="py-3 pl-2">
              <div className="font-semibold dark:text-gray-50 ">
                Date et heure de Depart:{"  "}
                <span className="ml-4 font-normal dark:text-orange-500">
                  {formatDateToDDMMYYYY(startDate)} - {startTime}:00
                </span>
              </div>
              <div className="font-semibold mt-1 dark:text-gray-50 ">
                Date et heure de d'arrivée:{"  "}
                <span className="ml-4 font-normal dark:text-orange-500">
                  {formatDateToDDMMYYYY(endDate)} - {endTime}:00
                </span>
              </div>
            </div>
            <hr className="dark:border-gray-600" />
            {!currentVehicule ? (
              <div
                onClick={() => {
                  setShowVehiculeListe(true);
                }}
                className="cursor-pointer flex my-3 px-4 rounded-lg bg-red-100 justify-between gap-2 items-center"
              >
                <h2 className=" p-2 px-0 bg-red-100 text-red-600 rounded-lg">
                  Veuillez selectionner un vehicule
                </h2>
                <FaCar className="text-xl text-red-700" />
                {/* <FaCarRear /> */}
              </div>
            ) : (
              <p
                onClick={() => {
                  applyFilter();
                  setshowFilter(false);
                }}
                className="border cursor-pointer border-orange-500 text-center text-orange-600 font-semibold rounded-md pt-1 pb-1.5 px-6 mt-5 dark:text-orange-400 dark:border-orange-400"
              >
                Appliquer
              </p>
            )}
          </div>
          <hr className="dark:border-gray-600" />
        </div>
      )}
    </>
  );
}

export default ShowFilterComponent;
