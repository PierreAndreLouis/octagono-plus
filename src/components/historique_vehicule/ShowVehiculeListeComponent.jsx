import React, { useContext } from "react";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { FaCar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import SearchVehiculePupup from "../rapport_page_details/SearchVehiculePupup";

function ShowVehiculeListeComponent({
  showVehiculeListe,
  setShowVehiculeListe,
  searchQueryListPopup,
  handleSearchChange,
  filteredVehiclesPupup,
  handleVehicleClick,
}) {
  const { currentVéhicule, FormatDateHeure } = useContext(DataContext);
  return (
    <>
      {showVehiculeListe && (
        <div className="fixed z-[999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50  shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80 dark:border-gray-600">
        
          <SearchVehiculePupup
            searchQueryListPopup={searchQueryListPopup}
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehiclesPupup}
            handleClick={handleVehicleClick}
            currentVéhicule={currentVéhicule}
            isMapcomponent="false"
          />
        </div>
      )}
    </>
  );
}

export default ShowVehiculeListeComponent;
