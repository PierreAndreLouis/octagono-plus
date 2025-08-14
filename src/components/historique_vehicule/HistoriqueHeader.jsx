import React, { useContext, useEffect, useState } from "react";

import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import { MdLocationPin, MdDateRange, MdUpdate } from "react-icons/md";
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
import { useNavigate } from "react-router-dom";

function HistoriqueHeader({
  setShowHistoriqueInMap,
  showHistoriqueInMap,
  setShowVehiculeListe,
  showVehiculeListe,
  setshowFilter,
  showFilter,
  handleVehicleClick,
}) {
  const {
    currentVéhicule,
    dashboardLoadingEffect,
    setDashboardLoadingEffect,

    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    mergedDataHome,
    listeGestionDesVehicules,
    FormatDateHeure,
    véhiculeHistoriqueDetails,
    setDocumentationPage,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  // Pour stocker le timestamp le plus récent lorsque "data" change

  return (
    <>
      {véhiculeHistoriqueDetails?.length > 0 && (
        <p className="font-bold text-center  justify-center  mb-1 max-w-[45rem] flex flex-wrap items-center text-[.75rem] sm:text-[.9rem] text-orange-700 bg-orange-50 border border-orange-700/30 z-10 rounded-lg px-3  py-1 mt-0.5 mx-auto">
          <span className="text-gray-700  mr-2">{t("Last Update")} :</span>
          <span>
            {FormatDateHeure(véhiculeHistoriqueDetails?.[0]?.timestamp)?.date}
            {" / "}
            {
              FormatDateHeure(véhiculeHistoriqueDetails?.[0]?.timestamp)?.time
            }{" "}
          </span>
          <MdUpdate
            onClick={() => {
              setDashboardLoadingEffect(true);
              handleVehicleClick(currentVéhicule, true);
            }}
            className={`${
              dashboardLoadingEffect
                ? "animate-spin rounded-full hover:bg-orange-50"
                : " hover:bg-orange-500 hover:text-white rounded-sm"
            } min-w-[2rem] cursor-pointer min-h-[1.7rem]  `}
          />
        </p>
      )}
      <div className="flex   flex-col w-full">
        <div className="w-full ">
          <div className="flex  mx-auto relative justify-between px-0  md:max-w-[45rem]  w-full items-center-- gap-1 w-full--">
            <div
              onClick={() => {
                if (showHistoriqueInMap) {
                  navigate("/Historique_appareil");
                  setDocumentationPage("Historique_appareil");
                } else {
                  setDocumentationPage("Trajet_appareil");
                  navigate("/Trajet_appareil");
                }
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
                          offset: [0, 10], // Décalage horizontal et vertical
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
                  <div className="cursor-pointer flex-shrink-0">
                    <IoStatsChart className="text-xl text-orange-600  cursor-pointer" />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 10], // Décalage horizontal et vertical
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
                    className="w-[1.7rem] flex-shrink-0 cursor-pointer"
                    src="/img/cars/parcoure.png"
                    alt=""
                  />
                </Tooltip>
              )}
            </div>

            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10], // Décalage horizontal et vertical
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
                className="relative flex-1 min-w-0 "
              >
                <div
                  className="flex gap-2 dark:bg-gray-900/50 dark:text-gray-50 dark:border-gray-300/30 justify-between  cursor-pointer border md:border-orange-200  rounded-md
                 px-3 py-2 bg-orange-50 shadow-xl text-center"
                >
                  <div className="w-full flex justify-center font-semibold">
                    <p className="hidden-- md:block truncate text-center">
                      {currentVéhicule?.description ||
                        `${t("Choisissez un véhicule")}`}
                    </p>
                  </div>
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
                      offset: [0, 10], // Décalage horizontal et vertical
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
                className="min-w-10  flex-shrink-0 cursor-pointer border rounded-md shadow-xl md:border-orange-200 flex justify-center items-center py-2 bg-orange-50  dark:bg-gray-900/50 dark:border-gray-300/30"
              >
                <BsFilterRight className="text-2xl text-orange-600  cursor-pointer" />
              </div>
            </Tooltip>
          </div>
        </div>
        {/* <div className="border py-.5 px-1 rounded-lg bg-orange-600 text-clip">
          {" "}
          La maison de Monsieur Pedro
        </div> */}
        {/* <div className="px-2 flex justify-center items-center py-1-- flex-col">
          <p className="font-semibold max-w-[95vw] notranslate bg-white px-3 text-orange-600 rounded-lg text-center md:hidden mt-1 dark:text-orange-500 overflow-hidden whitespace-nowrap text-ellipsis">
            {" "}
            {(showHistoriqueInMap && currentVéhicule?.description) || ""}
          </p>
        </div> */}
      </div>
    </>
  );
}

export default HistoriqueHeader;
