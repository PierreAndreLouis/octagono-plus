import React, { useContext, useEffect, useState } from "react";

import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../context/DataContext";

import VehiculeDetailInformationComponent from "../components/vehicule_details/VehiculeDetailInformationComponent";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";
import { useTranslation } from "react-i18next";
import { FaCar, FaInfo, FaInfoCircle } from "react-icons/fa";

function DetailsVehiculePage() {
  const {
    currentVéhicule,
    mergedDataHome,
    setCurrentVéhicule,
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
  } = useContext(DataContext); // fetchVehicleDetails importée du contexte
  let x;

  const [t, i18n] = useTranslation();

  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let listeDevices;

  if (isDashboardHomePage && currentAccountSelected) {
    listeDevices = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    listeDevices = accountDevices;
  } else if (!isDashboardHomePage) {
    listeDevices = dataFusionné;
  }
  //
  //
  //
  //
  //
  //
  //
  //
  x;
  // Pour voir la liste des véhicule
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  // Le data a utiliser

  // Pour définir le véhicule actuel
  const handleVehicleClick = (véhicule) => {
    setCurrentVéhicule(véhicule);
    setShowVehiculeListe(!showVehiculeListe);
    console.log("véhicule", véhicule);
  };

  // Pour mettre a jour le véhicules actuel
  useEffect(() => {
    console.log("Véhicule mis à jour", currentVéhicule);
  }, [currentVéhicule]);

  // Pour la recherche d'autre véhicules
  const [searchQueryDetailsVéhiculePage, setSearchQueryDetailsVéhiculePage] =
    useState("");

  // Pour enregistrer le terme de recherche
  const handleSearchChange = (e) => {
    setSearchQueryDetailsVéhiculePage(e.target.value);
  };

  // Pour filtrer la recherche des véhicules
  const filteredVehicles = listeDevices?.filter(
    (véhicule) =>
      // véhicule.displayName.toLowerCase().includes(searchQueryDetailsVéhiculePage.toLowerCase()) ||
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryDetailsVéhiculePage.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryDetailsVéhiculePage.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryDetailsVéhiculePage.toLowerCase())
  );
  //
  //
  //
  //
  //
  //
  x;

  return (
    <div className="px-4 pt-20 pb-20 min-h-screen bg-white rounded-lg">
      <div>
        <div
          onClick={() => {
            setShowVehiculeListe(!showVehiculeListe);
          }}
          className="relative max-w-[40rem] sm:mx-auto  mx-4 mb-6"
        >
          <div
            className="flex justify-between  cursor-pointer border rounded-md
                 px-3 py-2 bg-orange-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50 text-center"
          >
            <p
              onClick={() => {
                console.log(currentVéhicule);
              }}
              className="text-start notranslate w-[90%] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {currentVéhicule?.description || `${t("Choisissez un Appareil")}`}
            </p>
            <FaChevronDown className="mt-1" />
          </div>
        </div>

        {showVehiculeListe && (
          <SearchVehiculePupup
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehicles}
            handleClick={handleVehicleClick}
            currentVéhicule={currentVéhicule}
            isMapcomponent="false"
          />
        )}

        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center w-[6rem] text-[4rem] text-orange-600 h-[6rem] rounded-full bg-gray-100">
            <FaInfoCircle />
          </div>
          {/* <img
            src="/img/cars/voitrue_details.png"
            alt="Image de détails du véhicule"
          /> */}
        </div>
        <h1 className="text-center notranslate dark:text-gray-200 font-bold text-xl mt-8 text-gray-600">
          {currentVéhicule?.description || ""}
        </h1>

        <VehiculeDetailInformationComponent
          currentVéhicule={currentVéhicule}
          setShowVehiculeListe={setShowVehiculeListe}
        />
      </div>
    </div>
  );
}

export default DetailsVehiculePage;
