import React, { useContext, useEffect, useState } from "react";

import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../context/DataContext";
import ListeVehicule from "../components/vehicule_details/ListeVehicule";
import VehiculeDetailInformationComponent from "../components/vehicule_details/VehiculeDetailInformationComponent";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";

function DetailsVehiculePage() {
  const {
    currentVéhicule,
    mergedDataHome,
    setCurrentVéhicule,
    currentDataFusionné,
  } = useContext(DataContext); // fetchVehicleDetails importée du contexte
  let x;
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
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  // Pour définir le véhicule actuel
  const handleVehicleClick = (véhicule) => {
    setCurrentVéhicule(véhicule);
    setShowVehiculeListe(!showVehiculeListe);
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
  const filteredVehicles = currentDataFusionné?.filter(
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
    <div className="px-4 mt-20 pb-20 min-h-screen">
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
              className="text-start w-[90%] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {currentVéhicule?.description || "Choisis un véhicule"}
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
          <img
            src="/img/cars/voitrue_details.png"
            alt="Image de détails du véhicule"
          />
        </div>
        <h1 className="text-center dark:text-gray-200 font-bold text-xl mt-8 text-gray-600">
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
