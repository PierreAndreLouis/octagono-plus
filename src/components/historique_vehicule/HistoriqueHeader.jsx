import React, { useContext, useEffect, useState } from "react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import { MdLocationPin, MdDateRange } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

// import DateTimePicker from "./DateTimePicker";

import { BsFilterRight } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdCenterFocusStrong } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { DataContext } from "../../context/DataContext";

function HistoriqueHeader({
  setShowHistoriqueInMap,
  showHistoriqueInMap,
  setShowVehiculeListe,
  showVehiculeListe,
  currentVéhicule,
  setshowFilter,
  showFilter,
}) {
  const {
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    mergedDataHome,
    listeGestionDesVehicules,
    FormatDateHeure,
    véhiculeHistoriqueDetails,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  // Pour stocker le timestamp le plus récent lorsque "data" change

  return (
    <>
      <div className="flex   flex-col w-full">
        <div className="w-full ">
          <div className="flex  mx-auto relative justify-between px-4 max-w-[45rem] w-[100vw]-- w-full items-center-- gap-3 w-full--">
            <div
              onClick={() => {
                setShowHistoriqueInMap(!showHistoriqueInMap);
              }}
              className="cursor-pointer relative shadow-xl border md:border-orange-200 min-w-10 rounded-md flex justify-center items-center py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-300/30"
            >
              {showHistoriqueInMap ? (
                <Tooltip
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -10], // Décalage horizontal et vertical
                        },
                      },
                      {
                        name: "zIndex",
                        enabled: true,
                        phase: "write",
                        fn: ({ state }) => {
                          state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                        },
                      },
                    ],
                  }}
                  title={`${t("Voir l'historique du véhicule")}`}
                >
                  <div className="cursor-pointer">
                    <IoStatsChart className="text-xl text-orange-600 " />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -10], // Décalage horizontal et vertical
                        },
                      },
                      {
                        name: "zIndex",
                        enabled: true,
                        phase: "write",
                        fn: ({ state }) => {
                          state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                        },
                      },
                    ],
                  }}
                  title={`${t("Voir le trajet du véhicule")}`}
                >
                  <img
                    className="w-[1.7rem]"
                    src="/img/cars/parcoure.png"
                    alt=""
                  />
                </Tooltip>
              )}
              {/* <div className="absolute z-10 top-[3em] left-0 w-[20rem] p-2 border text-gray-6 bg-orange-50 rounded-lg">
            hover to display me !{" "}
          </div> */}
            </div>
            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10], // Décalage horizontal et vertical
                    },
                  },
                  {
                    name: "zIndex",
                    enabled: true,
                    phase: "write",
                    fn: ({ state }) => {
                      state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
              title={`${t("Choisissez un véhicule")}`}
            >
              <div
                onClick={() => {
                  setShowVehiculeListe(!showVehiculeListe);
                }}
                className="relative w-full "
              >
                <div
                  className="flex gap-2 dark:bg-gray-900/50 dark:text-gray-50 dark:border-gray-300/30 justify-between  cursor-pointer border md:border-orange-200  rounded-md
                 px-3 py-2 bg-orange-50 shadow-xl text-center"
                >
                  <p
                    // className="text-start w-[50%] overflow-hidden whitespace-nowrap text-ellipsis"
                    className="md:hidden"
                  >
                    {t("Choisissez un véhicule")}
                  </p>
                  <p className="hidden md:block notranslate">
                    {currentVéhicule?.description ||
                      `${t("Choisissez un véhicule")}`}
                  </p>
                  <FaChevronDown className="mt-1" />
                </div>
              </div>
            </Tooltip>
            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10], // Décalage horizontal et vertical
                    },
                  },
                  {
                    name: "zIndex",
                    enabled: true,
                    phase: "write",
                    fn: ({ state }) => {
                      state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
              title={`${t("Filtrer les résultats de recherche")}`}
            >
              <div
                onClick={() => setshowFilter(!showFilter)}
                className="min-w-10 cursor-pointer border rounded-md shadow-xl md:border-orange-200 flex justify-center items-center py-2 bg-orange-50  dark:bg-gray-900/50 dark:border-gray-300/30"
              >
                <BsFilterRight className="text-2xl text-orange-600 " />
              </div>
            </Tooltip>
          </div>
        </div>
        {/* <div className="border py-.5 px-1 rounded-lg bg-orange-600 text-clip">
          {" "}
          La maison de Monsieur Pedro
        </div> */}
        <div className="px-4 flex justify-center items-center py-1-- flex-col">
          <p className="font-semibold notranslate bg-white px-3 text-orange-600 rounded-lg text-center md:hidden mt-1 dark:text-orange-500 overflow-hidden whitespace-nowrap text-ellipsis">
            {" "}
            {(showHistoriqueInMap && currentVéhicule?.description) || ""}
          </p>
          {véhiculeHistoriqueDetails?.length > 0 && (
            <p className="font-bold  flex flex-wrap items-center text-[.9rem] text-orange-700 bg-orange-50 border border-orange-700/30 z-10 rounded-lg px-3 py-1 mt-0.5 mx-auto">
              <span className="text-gray-700  mr-2">{t("Last Update")} :</span>
              <span>
                {
                  FormatDateHeure(véhiculeHistoriqueDetails?.[0]?.timestamp)
                    ?.date
                }
                {" / "}
                {
                  FormatDateHeure(véhiculeHistoriqueDetails?.[0]?.timestamp)
                    ?.time
                }{" "}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default HistoriqueHeader;
