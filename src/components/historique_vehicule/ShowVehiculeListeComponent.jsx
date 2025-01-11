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
  searchQuery,
  handleSearchChange,
  filteredVehiclesPupup,
  handleVehicleClick,
}) {
  const { currentVehicule, FormatDateHeure } = useContext(DataContext);
  return (
    <>
      {showVehiculeListe && (
        <div className="fixed z-[999999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50  shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80 dark:border-gray-600">
          {/* <div className="pt-28 relative w-full max-w-[30rem] rounded-xl p-4 max-h-[70vh] overflow-hidden bg-white dark:bg-gray-800">
            <IoMdClose
              onClick={() => {
                setShowVehiculeListe(!showVehiculeListe);
              }}
              className="absolute top-3 cursor-pointer right-1 min-w-14 py-2 text-[2.3rem] text-red-600 dark:text-red-400"
            />

            <h2
              onClick={() => {
                setShowVehiculeListe(!showVehiculeListe);
              }}
              className="absolute left-0 top-4 right-0 font-semibold text-gray-700 mb-2 text-lg pl-7 border-b-2 pb-2 border-gray-600/20 dark:text-white dark:border-gray-500"
            >
              Choisis un véhicule
            </h2>
            <div className="absolute top-[3.5rem] left-4 right-4 p-2">
              <input
                className="w-full border p-4 py-1.5 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="overflow-y-auto overflow-x-hidden h-[80vh] max-h-[58vh] pb-20">
          
            </div>
          </div> */}
          <SearchVehiculePupup
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            setShowOptions={setShowVehiculeListe}
            filteredVehicles={filteredVehiclesPupup}
            handleClick={handleVehicleClick}
            currentVehicule={currentVehicule}
            isMapcomponent="false"
          />
        </div>
      )}
    </>
  );
}

export default ShowVehiculeListeComponent;
