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
  searchQueryListPopup,
  handleSearchChange,
  filteredVehicles,
  handleVehicleClick,
  selectedVehicleToShowInMap,
}) {
  const { currentVéhicule, currentDataFusionné } = useContext(DataContext);

  return (
    <>
      {/* {showVehiculeListe && (
        <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-[14124124124124] shadow-xl border-- border-gray-100 rounded-md p-3">
          <SearchVehiculePupup
            searchQueryListPopup={searchQueryListPopup}
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehicles}
            handleClick={handleVehicleClick}
            currentVéhicule={currentVéhicule}
            isMapcomponent="true"
          />
        </div>
      )} */}
    </>
  );
}

export default ShowVehiculeListeComponent;
