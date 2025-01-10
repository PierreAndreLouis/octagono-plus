import React, { useContext } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { IoReload } from "react-icons/io5";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";

function VehiculeNotActifComponent({
  showInactiveVehicule,
  setshowInactiveVehicule,
  vehiculeNotActif,
  setshowRapportPupup,
  formatTimestampToDate,
  formatTimestampToTime,
  handleClick,
}) {
  const {
    setVehiclueHistoriqueDetails,
    setVehiclueHistoriqueRapportDetails,
    currentVehicule,
    FormatDateHeure,
  } = useContext(DataContext);

  return (
    <div>
      <div className="transition-all">
        <div
          onClick={() => {
            setshowInactiveVehicule(!showInactiveVehicule);
          }}
          className="flex gap-4 dark:text-gray-200 dark:bg-gray-900/50 dark:shadow-lg dark:shadow-gray-700 justify-between items-center px-4 cursor-pointer bg-gray-100 text-gray-700 p-2 mb-3 font-semibold rounded-md"
        >
          <h2 className="text-lg">Vehicules hors service :</h2>
          <FaChevronDown
            className={`${
              showInactiveVehicule ? "rotate-180" : "rotate-0"
            } transition-all`}
          />
        </div>

        <div
          onClick={() => {
            // setshowRapportPupup(true);
          }}
          className={` ${
            showInactiveVehicule
              ? "max-h-[100rem] pb-14 overflow-y-auto transition-all"
              : "max-h-[0rem] transition-all"
          } flex   overflow-hidden flex-col gap-4 transition-all `}
        >
          {vehiculeNotActif?.length > 0 ? (
            vehiculeNotActif?.map((vehicule, index) => {
              return (
                <Link
                  to="/rapport_page_details"
                  onClick={() => {
                    handleClick(vehicule);
                    // setVehiclueHistoriqueDetails(
                    //   currentVehicule?.vehiculeDetails
                    // );
                    // setVehiclueHistoriqueRapportDetails(
                    //   currentVehicule?.vehiculeDetails
                    // );
                    // setshowRapportPupup(true);
                  }}
                  key={index}
                  className="bg-white rounded-lg dark:bg-gray-800 dark:shadow-gray-600"
                >
                  <div
                    className={` bg-purple-100/30 py-6 dark:border-l-[.5rem] dark:border-purple-800 dark:bg-gray-900/50 dark:shadow-gray-700 shadow-md rounded-lg p-3`}
                  >
                    <div className="flex items-stretch relative gap-3 md:py-6--">
                      <div className="flex justify-center border-2 md:pt-6 md:pb-8 bg-purple-200/40 dark:bg-purple-900 border-white dark:border-purple-400 dark:shadow-gray-600 shadow-md shadow-purple-200 rounded-md p-2 flex-col items-center md:min-w-32">
                        <div className="">
                          <img
                            className="dark:hidden min-w-[4.5rem] max-w-[4.5rem] px-2 sm:max-w-[6.5rem]"
                            src="/img/home_icon/payer.png"
                            alt=""
                          />
                          <img
                            className="hidden dark:block min-w-[4.5rem] max-w-[4.5rem] px-2 sm:max-w-[6.5rem]"
                            src="/img/home_icon/rapport_not_active.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <div>
                        <h2
                          className={`text-purple-900 dark:text-purple-200 text-gray-800-- font-semibold text-md md:text-xl mb-2 `}
                        >
                          {vehicule?.description || "non disponible"}
                        </h2>
                        <div className="flex mb-2 gap-4 text-gray-600 text-md">
                          <div className="flex gap-3 items-center dark:text-gray-300">
                            <FaRegCalendarAlt
                              id="date-icon"
                              className="text-gray-500/80 dark:text-gray-300"
                            />
                            <h3 className="text-sm sm:text-sm md:text-md">
                              {vehicule?.vehiculeDetails[0]?.timestamp ? (
                                FormatDateHeure(
                                  vehicule?.vehiculeDetails[0]?.timestamp
                                )?.date
                              ) : (
                                <p>Pas de date disponible</p>
                              )}
                            </h3>
                          </div>
                          {vehicule.vehiculeDetails?.[0]?.timestamp && (
                            <div className="flex items-center gap-1 dark:text-gray-300">
                              <IoMdTime
                                id="time-icon"
                                className="text-gray-500/80 dark:text-gray-300 text-xl"
                              />
                              <h3 className="text-sm sm:text-sm md:text-md">
                                {
                                  FormatDateHeure(
                                    vehicule.vehiculeDetails?.[0]?.timestamp ||
                                      0
                                  )?.time
                                }
                              </h3>
                            </div>
                          )}
                        </div>

                        <div
                          id="statut-box"
                          className="flex gap-2 items-center"
                        >
                          <div>
                            <FaCar
                              id="car-icon"
                              className="text-gray-500/80 dark:text-gray-300"
                            />
                          </div>
                          <span
                            className={` bg-purple-300/50 ml-1 dark:text-purple-100 text-purple-800 pb-[.2rem] px-2 py-0 text-sm rounded-md `}
                          >
                            Hors service
                          </span>
                        </div>

                        <div className="hidden sm:flex gap-1">
                          <div>
                            <MdLocationPin className="text-xl text-gray-500/80 dark:text-gray-300 -translate-x-0.5 mt-3" />
                          </div>

                          <p className="text-md felx sm:flex text-gray-600 dark:text-gray-200 mt-2 md:text-lg">
                            {vehicule?.vehiculeDetails[0]?.backupAddress ||
                              vehicule.vehiculeDetails[0]?.address ||
                              "adresse non disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:hidden">
                      <p className="text-[.95rem] dark:text-[.95rem] felx sm:flex dark:text-gray-300 text-gray-600 mt-2 md:text-lg">
                        <span className="text-purple-800 font-bold dark:text-purple-200">
                          Adresse :{" "}
                        </span>
                        {vehicule?.vehiculeDetails[0]?.backupAddress ||
                          vehicule.vehiculeDetails[0]?.address ||
                          "adresse non disponible"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center dark:text-gray-200">
              Pas de véhicule inactifs
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehiculeNotActifComponent;
