import React, { useContext, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../../context/DataContext";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { MdUpdate } from "react-icons/md";

function HeaderLocation({
  setShowVehiculeListe,
  selectedVehicleToShowInMap,
  véhiculeData,
  setTypeDeVue,
  showAllVehicles,
  isDashBoardComptnent = false,
  handleVehicleClick,
}) {
  const {
    isDashboardHomePage,
    currentAccountSelected,
    accountDevices,
    mergedDataHome,
    listeGestionDesVehicules,
    FormatDateHeure,
    dashboardLoadingEffect,
    autoUpdateFonction,
    setDashboardLoadingEffect,
    currentVéhicule,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  function getMostRecentTimestamp(data) {
    if (data) {
      // console.log("data...............", data);
      const validTimestamps = data
        .map((véhicule) => parseInt(véhicule?.lastUpdateTime))
        .filter((timestamp) => !isNaN(timestamp));

      const mostRecentTimestamp =
        validTimestamps.length > 0 ? Math.max(...validTimestamps) : null; // ou une autre valeur par défaut

      return { mostRecentTimestamp };
    } else {
      console.log("Pas de donnees");
    }
  }

  // Pour stocker le timestamp le plus récent lorsque "data" change

  const [lastUpdate, setLastUpdate] = useState();
  const data = isDashboardHomePage
    ? currentAccountSelected?.accountDevices || accountDevices
    : dataFusionné;

  // Mettre à jour le timestamp le plus récent lorsque "data" change
  useEffect(() => {
    const result = getMostRecentTimestamp(data);
    if (result) {
      setLastUpdate(result); // garde l'objet { mostRecentTimestamp }
    }
  }, [listeGestionDesVehicules, currentAccountSelected, accountDevices]);

  return (
    <>
      <div
        className={`${
          isDashBoardComptnent ? "absolute top-0" : "fixed top-12"
        }  absolute bg-white dark:bg-gray-800 md:bg-white/0   left-0 right-0 z-[7] flex flex-col gap-2 p-4`}
      >
        {/* Pour choisir un véhicule */}
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
          <h2
            onClick={() => {
              setShowVehiculeListe(true);
            }}
            id="vehicule_actuel"
            className="flex justify-between items-center border py-2 px-5 rounded-md w-full max-w-[40rem] mx-auto cursor-pointer bg-orange-50 dark:bg-gray-900/50 dark:text-gray-100 dark:border-gray-300/40 md:bg-white md:border md:border-gray-300  md:shadow-xl"
          >
            <p className="w-[90%] notranslate overflow-hidden whitespace-nowrap text-ellipsis">
              {selectedVehicleToShowInMap
                ? véhiculeData?.find(
                    (véhicule) =>
                      véhicule?.deviceID === selectedVehicleToShowInMap
                  )?.description || `${t("Véhicule non disponible")}`
                : `${t("Choisir un véhicule")}`}
            </p>
            <span>
              <FaChevronDown />
            </span>
          </h2>
        </Tooltip>

        <div className="grid  gap-3 w-full max-w-[40rem] mx-auto grid-cols-2 items-center justify-between">
          {/* Changer le type de vue sur la carte */}
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
            title={`${t("Changer le type de vue sur la carte")}`}
          >
            <div
              onClick={() => {
                setTypeDeVue(true);
              }}
              className="flex items-center md:shadow-xl justify-between gap-1 border px-2 py-1 cursor-pointer  dark:bg-gray-900/50 dark:text-gray-100 dark:border-gray-300/40 bg-orange-50 md:bg-white md:border md:border-gray-300  rounded-md"
            >
              <label htmlFor="mapType">{t("Type de vue")} </label>
              <FaChevronDown />
            </div>
          </Tooltip>

          {/* Voir la position géographique de tous les véhicules */}
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
            title={`${t(
              "Voir la position géographique de tous les véhicules"
            )}`}
          >
            <h3
              onClick={() => {
                showAllVehicles();
                setShowVehiculeListe(false);
              }}
              className="text-end md:bg-white md:border md:border-gray-300  md:shadow-xl md:py-1 md:px-4 rounded-lg text-orange-600 font-semibold cursor-pointer underline"
            >
              {t("Tous les véhicules")}
            </h3>
          </Tooltip>
        </div>
        {lastUpdate?.mostRecentTimestamp && (
          <p className="font-bold hidden  md:flex flex-nowrap items-center text-[.8rem] sm:text-[.9rem] text-orange-700 bg-white  rounded-lg px-0 sm:px-3 py-0 mx-auto">
            <span className="text-gray-700  mr-2">{t("Last Update")} :</span>
            <span>
              {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
              {" / "}
              {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
            </span>
            <MdUpdate
              onClick={() => {
                setDashboardLoadingEffect(true);

                if (selectedVehicleToShowInMap) {
                  handleVehicleClick(currentVéhicule, true);
                } else {
                  autoUpdateFonction();
                }
              }}
              className={`${
                dashboardLoadingEffect
                  ? "animate-spin rounded-full hover:bg-orange-50"
                  : " hover:bg-orange-500 hover:text-white rounded-sm"
              } min-w-[2rem] cursor-pointer min-h-[1.7rem]  `}
            />
          </p>
        )}
      </div>
    </>
  );
}

export default HeaderLocation;
