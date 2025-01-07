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
          <div className="pt-28 relative w-full max-w-[30rem] rounded-xl p-4 max-h-[70vh] overflow-hidden bg-white dark:bg-gray-700 dark:border-gray-700">
            <IoMdClose
              onClick={() => {
                setShowVehiculeListe(!showVehiculeListe);
              }}
              className="absolute top-3 cursor-pointer right-1 min-w-14 py-2 text-[2.3rem] text-red-600 dark:text-red-400"
            />

            <h2
              onClick={() => {
                setShowVehiculeListe(!showVehiculeListe);
                // console.log(foundVehicle.description);
              }}
              className="absolute left-0 top-4 right-0 font-semibold text-gray-700 dark:text-gray-100 mb-2 text-lg pl-7 border-b-2 pb-2 border-gray-600/20"
            >
              Choisir un véhicule
            </h2>
            <div
              onClick={() => {
                showAllVehicles();
                setShowVehiculeListe(false);
              }}
              className="pl-5 border-b border-gray-300 cursor-pointer text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800/50 dark:text-gray-50 font-semibold py-3"
            >
              Tous les véhicules
            </div>
            <div className="absolute top-[3.5rem] left-4 right-4 p-2">
              <input
                className="w-full border p-4 py-1.5 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                type="text"
                placeholder="Recherche"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="overflow-y-auto overflow-x-hidden h-[80vh] max-h-[58vh] pb-20">
              {/* {filteredVehicles?.map((vehicule) => (
                <div
                  key={vehicule.deviseID}
                  onClick={() => handleVehicleClick(vehicule)}
                  className="cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 dark:hover:bg-gray-800/50 dark:text-gray-50"
                >
                  <FaCar className="text-orange-600/80 min-w-8 text-lg dark:text-orange-400" />
                  <p className="">{vehicule.description || "---"}</p>
                </div>
              ))} */}

              {/* {filteredVehicles.length > 0 ? (
                filteredVehicles?.map((vehicule, index) => (
                  <div
                    key={vehicule.deviseID}
                    onClick={() => handleVehicleClick(vehicule)}
                    className={`${
                      vehicule.description === foundVehicle?.description &&
                      "bg-orange-50"
                    } cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-gray-700`}
                  >
                    <FaCar className="text-orange-600/80 min-w-8 text-lg dark:text-orange-400" />
                    <p className="text-gray-700 dark:text-white">
                      {index + 1} - {vehicule.description || "---"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center px-3 mt-10">Pas de resultat</p>
              )} */}
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
          </div>
        </div>
      )}
    </>
  );
}

export default ShowVehiculeListeComponent;
