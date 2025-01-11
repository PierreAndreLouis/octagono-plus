import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import SearchVehiculePupup from "../rapport_page_details/SearchVehiculePupup";

function ShowVehiculeListeComponent({
  showVehiculeListe,
  setShowVehiculeListe,
  showAllVehicles,
  searchQuery,
  handleSearchChange,
  filteredVehicles,
  handleVehicleClick,
  selectedVehicle,
}) {
  const { currentVehicule, currentdataFusionnee } = useContext(DataContext);

  // const deviceID = currentVehicule.deviceID;

  // Recherche du véhicule correspondant dans la liste
  const foundVehicle = currentdataFusionnee.find(
    (v) => v.deviceID === selectedVehicle
  );
  return (
    <>
      {showVehiculeListe && (
        <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-[14124124124124] shadow-xl border-- border-gray-100 rounded-md p-3">
          <SearchVehiculePupup
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehicles}
            handleClick={handleVehicleClick}
            currentVehicule={currentVehicule}
            isMapcomponent="true"
          />
        </div>
      )}
    </>
  );
}

export default ShowVehiculeListeComponent;
