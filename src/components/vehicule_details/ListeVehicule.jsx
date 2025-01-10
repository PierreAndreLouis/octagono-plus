import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import SearchVehiculePupup from "../rapport_page_details/SearchVehiculePupup";

function ListeVehicule({
  showVehiculeListe,
  setShowVehiculeListe,
  searchQuery,
  handleSearchChange,
  filteredVehicles,
  handleVehicleClick,
}) {
  const { currentVehicule } = useContext(DataContext);
  return (
    <>
      {showVehiculeListe && (
        <SearchVehiculePupup
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          setShowOptions={setShowVehiculeListe}
          filteredVehicles={filteredVehicles}
          handleClick={handleVehicleClick}
          currentVehicule={currentVehicule}
          isMapcomponent="false"
        />
      )}
    </>
  );
}

export default ListeVehicule;
