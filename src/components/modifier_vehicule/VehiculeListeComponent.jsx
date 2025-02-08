import React, { useContext } from "react";
import { FaCar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import SearchVehiculePupup from "../rapport_page_details/SearchVehiculePupup";

function VehiculeListeComponent({
  showVehiculeListe,
  setShowVehiculeListe,
  searchQueryListPopup,
  handleSearchChange,
  filteredVehicles,
  handleVehicleClick,
}) {
  const { currentVéhicule } = useContext(DataContext);
  return (
    <>
      {showVehiculeListe && (
        <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-20 shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80">
          <SearchVehiculePupup
            searchQueryListPopup={searchQueryListPopup}
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehicles}
            handleClick={handleVehicleClick}
            currentVéhicule={currentVéhicule}
            isMapcomponent="false"
          />
        </div>
      )}
    </>
  );
}

export default VehiculeListeComponent;
