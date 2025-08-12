import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";

function StatisticDashboard({
  setChosseOtherGroupeDashboard,
  lastUpdate,
  fetchNewDataDevices,
  isLoading2,
  setShowStatisticDeviceListeDashboard,
  setStatisticFilteredDeviceListe,
  setStatisticFilteredDeviceListeText,
  animatedTotal,
  animatedDeplaces,
  animatedEnDéplacement,
  DeviceEnStationnement,
  animatedStationnement,
  animatedInactifs,
}) {
  const {
    currentAccountSelected,
    FormatDateHeure,
    isDashboardHomePage,
    account,
    username,
    DeviceListeActif,
    EnDéplacement,
    setFilteredColorCategorieListe,
    DeviceInactifs,
    DeviceDéplacer,
    allDevices,
    addVehiculeDetailsFonction,
    véhiculeDetails,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  const [isDeviceEnDeplacement, setIsDeviceEnDeplacement] = useState(false);
  const [isDeviceEnStationnement, setIsDeviceEnStationnement] = useState(true);
  //
  return (
    <div className="">
      <div className="w-full h-full shadow-lg shadow-black/5 bg-white md:rounded-lg p-4 ">
        <div className=" relative mb-4 ">
          <div className="">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="font-bold md:hidden text-[1.1rem] md:text-xl text-gray-800">
                {t("Pour Aujourd'hui")}
              </h1>
              <h1 className="font-bold hidden md:block text-[1.1rem] md:text-xl text-gray-800">
                {t("Statistiques pour aujourd'hui")}
              </h1>
            </div>
            <p className="  font-semibold max-w-[12rem] sm:max-w-[24rem]  whitespace-nowrap text-ellipsis overflow-hidden text-orange-500">
              <span className="mr-1  text-gray-600">{t("Compte")} :</span>
              <span className="notranslate">
                {isDashboardHomePage
                  ? currentAccountSelected
                    ? currentAccountSelected?.description
                    : `${t("Tous les comptes")}`
                  : account + " / " + username}
              </span>
            </p>
          </div>
          {isDashboardHomePage && currentAccountSelected && (
            <div
              onClick={() => {
                setChosseOtherGroupeDashboard(true);
              }}
              className=" cursor-pointer text-orange-500 flex gap-1 sm:gap-3 items-center absolute right-0  rounded-lg -bottom-0 sm:bottom-0"
            >
              <p className="font-semibold hidden sm:block">
                {t("Sélectionner un Groupe")}
              </p>
              <p className="font-semibold sm:hidden">{t("Groupe")}</p>
              <FaChevronDown className="mt-1" />
            </div>
          )}

          {/* <div className="  flex gap-1 sm:gap-3 items-center absolute right-0 py-2  rounded-lg bottom-4 ">
            {lastUpdate?.mostRecentTimestamp && (
              <p className="font-semibold flex items-center text-[.8rem] md:text-[.9rem] text-gray-700">
                <span className="hidden md:block mr-2">{t("Last Update")}</span>
                {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
                {" / "}
                {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
              </p>
            )}
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
              title={`${t("Mettre a jour les donnes")}`}
            >
              <div
                onClick={() => {
                  fetchNewDataDevices();
                }}
                className={`${
                  isLoading2 ? "animate-spin" : ""
                }  text-orange-500 min-w-2  translate-y-1-- md:translate-y-0 cursor-pointer   dark:text-gray-200 `}
              >
                <MdUpdate className="sm:text-[1.35rem]  text-[1.2rem]  " />
              </div>
            </Tooltip>
          </div> */}
        </div>

        {/* Liste des statistics */}
        <div className="grid grid-cols-2 gap-1.5 md:gap-4 md:grid-cols-4 items-center justify-between">
          {/*  */}
          <div
            onClick={() => {
              setShowStatisticDeviceListeDashboard(true);
              setFilteredColorCategorieListe(
                addVehiculeDetailsFonction(allDevices, véhiculeDetails)
              );
              setStatisticFilteredDeviceListeText(`${t("Tous les Appareils")}`);
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-blue-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-blue-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Total")}
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {animatedTotal}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-4 ">
                <img
                  className=" w-8 md:w-10 lg:w-14--"
                  src="/img/home_icon/total.png"
                  alt="Total"
                />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              if (isDeviceEnDeplacement) {
                setFilteredColorCategorieListe(EnDéplacement);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils En déplacement")}`
                );
              } else {
                setFilteredColorCategorieListe(DeviceDéplacer);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils Déplacer")}`
                );
              }
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-green-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-green-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div className=" w-full">
                <div className="flex items-center  gap-2 w-full">
                  <h3
                    onClick={() => {
                      setShowStatisticDeviceListeDashboard(true);
                    }}
                    className="text-gray-500 max-w-[70%]-- w-full  whitespace-nowrap text-ellipsis overflow-hidden  dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- "
                  >
                    {isDeviceEnDeplacement
                      ? t("En Déplacement")
                      : t("Déplacés")}
                  </h3>

                  <div className=" text-[1.2rem] flex justify-end w-[30%]  text-green-800">
                    <FaArrowRightArrowLeft
                      onClick={() => {
                        setIsDeviceEnDeplacement(!isDeviceEnDeplacement);
                      }}
                    />
                  </div>
                </div>
                <h2
                  onClick={() => {
                    setShowStatisticDeviceListeDashboard(true);
                  }}
                  className="text-gray-900  dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- "
                >
                  {isDeviceEnDeplacement
                    ? EnDéplacement?.length
                    : animatedDeplaces}
                </h2>
              </div>
              <div
                onClick={() => {
                  setShowStatisticDeviceListeDashboard(true);
                }}
                className="absolute mt-1.5 right-4 bottom-4"
              >
                <img
                  className=" w-12 md:w-14 lg:w-14--"
                  src="/img/home_icon/active.png"
                  alt="Total"
                />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              if (isDeviceEnStationnement) {
                setFilteredColorCategorieListe(DeviceEnStationnement);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils en Stationnement")}`
                );
              } else {
                setFilteredColorCategorieListe(DeviceListeActif);
                setStatisticFilteredDeviceListeText(`${t("Appareils Actifs")}`);
              }
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              {/* <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Actifs")}
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {animatedStationnement}
                </h2>
              </div> */}
              <div className=" w-full">
                <div className="flex items-center  gap-2 w-full">
                  <h3
                    onClick={() => {
                      setShowStatisticDeviceListeDashboard(true);
                    }}
                    className="text-gray-500 max-w-[70%]-- w-full  whitespace-nowrap text-ellipsis overflow-hidden  dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- "
                  >
                    {isDeviceEnStationnement ? t("Non Déplacer") : t("Actifs")}
                  </h3>

                  <div className=" text-[1.2rem] flex justify-end w-[30%]  text-orange-600">
                    <FaArrowRightArrowLeft
                      onClick={() => {
                        setIsDeviceEnStationnement(!isDeviceEnStationnement);
                      }}
                    />
                  </div>
                </div>
                <h2
                  onClick={() => {
                    setShowStatisticDeviceListeDashboard(true);
                  }}
                  className="text-gray-900  dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- "
                >
                  {isDeviceEnStationnement
                    ? animatedStationnement || 0
                    : DeviceListeActif?.length || 0}{" "}
                  {/* {DeviceEnStationnement?.length} - {DeviceListeActif?.length} */}
                </h2>
              </div>
              <div
                onClick={() => {
                  setShowStatisticDeviceListeDashboard(true);
                }}
                className="absolute mt-1.5 right-4 bottom-4 "
              >
                <img
                  className=" w-8 md:w-10 lg:w-14--"
                  src="/img/cars/parking.png"
                  alt="Total"
                />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setShowStatisticDeviceListeDashboard(true);
              setFilteredColorCategorieListe(DeviceInactifs);
              setStatisticFilteredDeviceListeText(`${t("Appareils Inactifs")}`);
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Inactifs")}{" "}
                    <span className="text-sm text-black">
                      ( {`${"> 24h"}`})
                    </span>
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {animatedInactifs}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-4 ">
                <img
                  className=" w-8 md:w-10 lg:w-14--"
                  src="/img/home_icon/payer.png"
                  alt="Total"
                />
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </div>{" "}
      <div className="flex  gap-2 justify-between px-2 pl-4 py-1 rounded-md--  md:rounded-lg bg-orange-100 border border-orange-600/20 shadow-lg shadow-black/5 mt-2 md:mt-4">
        {/* <div className="  flex gap-1 sm:gap-3 items-center absolute-- right-0 py-2  rounded-lg bottom-4 "> */}
        {lastUpdate?.mostRecentTimestamp && (
          <p className="font-bold   flex flex-wrap items-center text-[.9rem]  text-orange-700">
            <span className="text-gray-700  mr-2">{t("Last Update")} :</span>
            <span>
              {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
              {" / "}
              {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
            </span>
          </p>
        )}
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
          title={`${t("Mettre a jour les donnes")}`}
        >
          <div
            onClick={() => {
              fetchNewDataDevices();
            }}
            className={`${
              isLoading2
                ? "animate-spin rounded-full min-w-[2.3rem]"
                : "rounded-lg min-w-[3.5rem]"
            } p-2 my-0.5 mr-1.5  flex justify-center items-center  bg-orange-500  text-white    translate-y-1-- md:translate-y-0 cursor-pointer   dark:text-gray-200 `}
          >
            <MdUpdate className="sm:text-[1.35rem]  text-[1.2rem]  " />
          </div>
        </Tooltip>
        {/* </div>{" "} */}
      </div>
    </div>
  );
}

export default StatisticDashboard;
