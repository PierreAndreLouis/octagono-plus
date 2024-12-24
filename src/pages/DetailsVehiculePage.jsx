import React, { useContext, useEffect, useState } from "react";

import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../context/DataContext";
import ListeVehicule from "../components/vehicule_details/ListeVehicule";
import VehiculeDetailInformationComponent from "../components/vehicule_details/VehiculeDetailInformationComponent";

function DetailsVehiculePage() {
  const { currentVehicule, mergedData, setCurrentVehicule } =
    useContext(DataContext); // fetchVehicleDetails importée du contexte
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  const dataFusionee = mergedData ? Object.values(mergedData) : [];

  const handleVehicleClick = (vehicule) => {
    setCurrentVehicule(vehicule);
    setShowVehiculeListe(!showVehiculeListe);
  };

  useEffect(() => {
    console.log("Véhicule mis à jour", currentVehicule);
  }, [currentVehicule]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVehicles = dataFusionee?.filter((vehicule) =>
    // vehicule.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                console.log(currentVehicule);
              }}
              className="text-start w-[90%] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {
                // currentVehicule?.displayName ||
                currentVehicule?.description || "Choisis un véhicule"
              }
            </p>
            <FaChevronDown className="mt-1" />
          </div>
        </div>

        <ListeVehicule
          showVehiculeListe={showVehiculeListe}
          setShowVehiculeListe={setShowVehiculeListe}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          filteredVehicles={filteredVehicles}
          handleVehicleClick={handleVehicleClick}
        />

        <div className="flex justify-center items-center">
          <img
            src="/img/cars/voitrue_details.png"
            alt="Image de détails du véhicule"
          />
        </div>
        <h1 className="text-center dark:text-gray-200 font-bold text-xl mt-8 text-gray-600">
          {currentVehicule?.description || ""}
        </h1>

        <VehiculeDetailInformationComponent
          currentVehicule={currentVehicule}
          setShowVehiculeListe={setShowVehiculeListe}
        />
      </div>
    </div>
  );
}

export default DetailsVehiculePage;
