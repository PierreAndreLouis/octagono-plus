import React, { useContext } from "react";
import { FaCar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { DataContext } from "../../context/DataContext";

function VehiculeListeComponent({
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
        <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-20 shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80">
          <div className="pt-28 relative w-full max-w-[30rem] rounded-xl p-4 max-h-[70vh] overflow-hidden bg-white dark:bg-gray-800">
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
              className="absolute left-0 top-4 right-0 font-semibold text-gray-700 mb-2 text-lg pl-7 border-b-2 pb-2 border-gray-600/20 dark:text-gray-200 dark:border-gray-600"
            >
              Choisis un véhicule
            </h2>
            <div className="absolute top-[3.5rem] left-4 right-4 p-2">
              <input
                className="w-full border p-4 py-1.5 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
                  className="cursor-pointer flex gap-4 py-4 items-center border-b border-gray-300 px-3 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-orange-700"
                >
                  <FaCar className="text-orange-600/80 min-w-8 text-lg dark:text-orange-400" />
                  <p className="dark:text-gray-200">{vehicule.description}</p>
                </div>
              ))} */}

              {filteredVehicles.length > 0 ? (
                filteredVehicles?.map((vehicule, index) => (
                  <div
                    key={vehicule.deviseID}
                    onClick={() => handleVehicleClick(vehicule)}
                    className={`${
                      vehicule.description === currentVehicule?.description &&
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VehiculeListeComponent;
