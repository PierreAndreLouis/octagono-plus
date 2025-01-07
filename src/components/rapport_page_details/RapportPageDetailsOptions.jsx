import React, { useContext, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";

function RapportPageDetailsOptions({
  setPersonnelDetails,
  personnelDetails,
  setShowListOption,
  setVehiclueHistoriqueDetails,
  currentVehicule,
  formatTimestampToTimeWithTimezone,
  formatTimestampToTime,
  pageSection,
  setpageSection,
  setShowOptions,
  showOptions,
  setSelectedVehicle,
  // formatTimestampToTimeWithTimezone,
  // formatTimestampToTime
}) {
  // const [setSelectedVehicle] = useContext(DataContext);
  return (
    <>
      <div className="flex px-4 mb-2 w-full gap-2 justify-between max-w-[40rem]-- mx-auto mt-6">
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
          title="Voir un rapport pour un seul véhicule"
        >
          <button
            onClick={() => {
              setpageSection("unite");
              window.scrollTo({
                top: 0,
                behavior: "auto", // Défilement fluide
                // behavior: "smooth", // Défilement fluide
              });
            }}
            className={`${
              pageSection == "unite"
                ? "dark:bg-orange-700 bg-orange-100"
                : "dark:bg-gray-900/70 bg-gray-100"
            } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
          >
            Unité
          </button>
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
          title="Voir un rapport pour tous les véhicules"
        >
          <button
            onClick={() => {
              setpageSection("groupe");
              setShowOptions(false);
              setSelectedVehicle(null);
              window.scrollTo({
                top: 0,
                behavior: "auto", // Défilement fluide
                // behavior: "smooth", // Défilement fluide
              });
            }}
            className={`${
              pageSection === "groupe"
                ? "dark:bg-orange-700 bg-orange-100"
                : "dark:bg-gray-900/70 bg-gray-100"
            } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
          >
            Groupe
          </button>
        </Tooltip>
        {/* <button
          onClick={() => {
            setpageSection("search");
            setShowOptions(false);
            window.scrollTo({
              top: 0,
              behavior: "auto", // Défilement fluide
              // behavior: "smooth", // Défilement fluide
            });
          }}
          className={`${
            pageSection === "search"
              ? "dark:bg-orange-700 bg-orange-100"
              : "dark:bg-gray-900/70 bg-gray-100"
          } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
        >
          Recherche
        </button> */}
        {/* <button
          onClick={() => {
            setShowListOption(true);
            // setVehiclueHistoriqueDetails(currentVehicule?.vehiculeDetails);
          }}
          className="border border-gray-100 dark:bg-gray-900/70 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg bg-gray-100 shadow-lg-- shadow-gray-200 w-full py-1"
        >
          Options
        </button> */}
      </div>
    </>
  );
}

export default RapportPageDetailsOptions;
