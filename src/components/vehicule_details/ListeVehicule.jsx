import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import SearchVehiculePupup from "../rapport_page_details/SearchVehiculePupup";

function ListeVehicule({
  showVehiculeListe,
  setShowVehiculeListe,
  searchQueryForHeader,
  handleSearchChange,
  filteredVehicles,
  handleVehicleClick,
}) {
  const { currentVéhicule } = useContext(DataContext);
  return (
    <>
      {showVehiculeListe && (
        <SearchVehiculePupup
          searchQueryForHeader={searchQueryForHeader}
          handleSearchChange={handleSearchChange}
          setShowOptions={setShowVehiculeListe}
          filteredVehicles={filteredVehicles}
          handleClick={handleVehicleClick}
          currentVéhicule={currentVéhicule}
          isMapcomponent="false"
        />
      )}
    </>
  );
}

export default ListeVehicule;
