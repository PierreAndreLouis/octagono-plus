import React, { useContext, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

function RapportPageDetailsOptions({
  pageSection,
  setpageSection,
  setShowOptions,
  setSelectedVehicleToShowInMap,
}) {
  const [t, i18n] = useTranslation();

  // const [setSelectedVehicleToShowInMap] = useContext(DataContext);
  return (
    <>
      <div className="flex px-4 mb-2 w-full gap-2 justify-between  mx-auto">
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
          title={`${t("Voir un rapport pour un seul véhicule")}`}
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
            {t("Unité")}
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
          title={`${t("Voir un rapport pour tous les véhicules")}`}
        >
          <button
            onClick={() => {
              setpageSection("groupe");
              setShowOptions(false);
              setSelectedVehicleToShowInMap(null);
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
            {t("Groupe")}
          </button>
        </Tooltip>
      </div>
    </>
  );
}

export default RapportPageDetailsOptions;
