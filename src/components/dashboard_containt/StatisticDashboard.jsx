import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronCircleRight,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank, MdUpdate } from "react-icons/md";
import {
  FaArrowDownLong,
  FaArrowRightArrowLeft,
  FaArrowRightLong,
} from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

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
  DeviceNonDeplacer,
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
    timeLeftBeforeAutoUpdate,
    resetTimerForAutoUpdate,
    updaterInterval,
    setTimeLeftBeforeAutoUpdate,
    updateAutoSetting,
    setUpdateAutoSetting,
    DeviceEnStationnement,
    DeviceInactifsWidthDetails,
    DeviceInactifsWidthNoDetails,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  const [isDeviceEnDeplacement, setIsDeviceEnDeplacement] = useState(false);
  const [isDeviceEnStationnement, setIsDeviceEnStationnement] = useState(true);
  const [showUpdateAutoSettingPopup, setShowUpdateAutoSettingPopup] =
    useState(false);
  ///////////////////////////////////
  const [enDeplacementCount, setEnDeplacementCount] = useState(1);
  const [enStationnementCount, setEnStationnementCount] = useState(1);
  const [inactifsCount, setInactifsCount] = useState(1);

  const increaseCountFonction = (x) => {
    ///////////////////////////
    if (x === "orange") {
      if (enStationnementCount < 3) {
        setEnStationnementCount(enStationnementCount + 1);
      } else {
        setEnStationnementCount(1);
      }
      console.log(enStationnementCount);
    }

    if (x === "green") {
      if (enDeplacementCount < 2) {
        setEnDeplacementCount(enDeplacementCount + 1);
      } else {
        setEnDeplacementCount(1);
      }
      console.log(enDeplacementCount);
    }

    if (x === "purple") {
      if (inactifsCount < 3) {
        setInactifsCount(inactifsCount + 1);
      } else {
        setInactifsCount(1);
      }
      console.log(inactifsCount);
    }
    ///////////////////////////
    ///////////////////////////
  };

  return (
    <div className="">
      <div className="w-full h-full shadow-lg shadow-black/5 bg-white md:rounded-lg p-4 ">
        <div className=" relative mb-4 ">
          <div className="">
            <div
              onClick={() => {
                testClique();
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
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
                  {animatedTotal || allDevices?.length}
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
              if (enDeplacementCount === 2) {
                setFilteredColorCategorieListe(EnDéplacement);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils En déplacement")}`
                );
              }
              if (enDeplacementCount === 1) {
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
                    {enDeplacementCount === 1 ? `${t("Déplacés")}` : ""}
                    {enDeplacementCount === 2 ? `${t("En Déplacement")}` : ""}
                  </h3>

                  <div className=" text-[1.2rem] flex justify-end items-center w-[30%]  text-green-600">
                    <span className="font-bold text-sm mb-">
                      {enDeplacementCount}/2
                    </span>
                    <FaChevronCircleRight className="text-[2rem]- ml-1  min-w-[1rem]" />{" "}
                  </div>
                </div>
                <h2
                  onClick={() => {
                    setShowStatisticDeviceListeDashboard(true);
                  }}
                  className="text-gray-900  dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- "
                >
                  {enDeplacementCount === 1 ? animatedDeplaces : ""}
                  {enDeplacementCount === 2 ? EnDéplacement?.length : ""}
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
              <div
                onClick={() => {
                  increaseCountFonction("green");
                }}
                className="absolute top-0 bottom-0 right-0 min-w-[35%] z-30 md:hover:border  md:hover:border-l-green-400"
              >
                {" "}
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              if (enStationnementCount === 1) {
                setFilteredColorCategorieListe(DeviceNonDeplacer);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils non déplacer")}`
                );
              }
              if (enStationnementCount === 2) {
                setFilteredColorCategorieListe(DeviceListeActif);
                setStatisticFilteredDeviceListeText(`${t("Appareils Actifs")}`);
              }
              if (enStationnementCount === 3) {
                setFilteredColorCategorieListe(DeviceEnStationnement);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils En Stationnement")}`
                );
              }
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div className=" w-full">
                <div className="flex items-center  gap-2 w-full">
                  <h3
                    onClick={() => {
                      setShowStatisticDeviceListeDashboard(true);
                    }}
                    className="text-gray-500 max-w-[70%]-- w-full  whitespace-nowrap text-ellipsis overflow-hidden  dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- "
                  >
                    {enStationnementCount === 1 ? `${t("Non Déplacer")}` : ""}
                    {enStationnementCount === 2 ? `${t("Actifs")}` : ""}
                    {enStationnementCount === 3
                      ? `${t("En Stationnement")}`
                      : ""}
                  </h3>

                  <div className=" text-[1.2rem] flex justify-end items-center w-[30%]  text-orange-600">
                    <span className="font-bold text-sm mb-">
                      {enStationnementCount}/3
                    </span>
                    <FaChevronCircleRight className="text-[2rem]- ml-1   min-w-[1rem]" />{" "}
                  </div>
                </div>

                <h2
                  onClick={() => {
                    setShowStatisticDeviceListeDashboard(true);
                  }}
                  className="text-gray-900  dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- "
                >
                  {enStationnementCount === 1 ? animatedStationnement : ""}
                  {enStationnementCount === 2 ? DeviceListeActif?.length : ""}
                  {enStationnementCount === 3
                    ? DeviceEnStationnement?.length
                    : ""}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-4 ">
                <img
                  className=" w-8 md:w-10 lg:w-14--"
                  src="/img/cars/parking.png"
                  alt="Total"
                />
              </div>
              <div
                onClick={() => {
                  increaseCountFonction("orange");
                }}
                className="absolute top-0 bottom-0 right-0 min-w-[30%] z-30 md:hover:border  md:hover:border-l-orange-400"
              >
                {" "}
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              if (inactifsCount === 1) {
                // setShowStatisticDeviceListeDashboard(true);
                setFilteredColorCategorieListe(DeviceInactifs);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils Inactifs")}`
                );
              }
              if (inactifsCount === 2) {
                // setShowStatisticDeviceListeDashboard(true);
                setFilteredColorCategorieListe(DeviceInactifsWidthDetails);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils Inactifs Actualisés")}`
                );
              }
              if (inactifsCount === 3) {
                // setShowStatisticDeviceListeDashboard(true);
                setFilteredColorCategorieListe(DeviceInactifsWidthNoDetails);
                setStatisticFilteredDeviceListeText(
                  `${t("Appareils Inactifs non Actualisés")}`
                );
              }
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              {/* <div>
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
              </div> */}
              <div className=" w-full">
                <div className="flex items-center  gap-2 w-full">
                  <h3
                    onClick={() => {
                      setShowStatisticDeviceListeDashboard(true);
                    }}
                    className="text-gray-500 max-w-[70%]-- w-full  whitespace-nowrap text-ellipsis overflow-hidden  dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- "
                  >
                    {inactifsCount === 1 ? `${t("Inactifs")}` : ""}
                    {inactifsCount === 2 ? `${t("Actualisés")}` : ""}
                    {inactifsCount === 3 ? `${t("Non Actualisés")}` : ""}

                    {/* {isDeviceEnStationnement ? t("Non Déplacer") : t("Actifs")} */}
                  </h3>

                  <div className=" text-[1.2rem] flex justify-end items-center w-[30%]  text-purple-800">
                    <span className="font-bold text-sm mb-">
                      {inactifsCount}/3
                    </span>
                    <FaChevronCircleRight className="text-[2rem]- ml-1   min-w-[1rem]" />{" "}
                  </div>
                </div>

                <h2
                  onClick={() => {
                    setShowStatisticDeviceListeDashboard(true);
                  }}
                  className="text-gray-900  dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- "
                >
                  {inactifsCount === 1 ? animatedInactifs : ""}
                  {inactifsCount === 2
                    ? DeviceInactifsWidthDetails?.length
                    : ""}
                  {inactifsCount === 3
                    ? DeviceInactifsWidthNoDetails?.length
                    : ""}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-3 ">
                <img
                  className=" w-8 md:w-8"
                  src="/img/home_icon/payer.png"
                  alt="Total"
                />
              </div>
              <div
                onClick={() => {
                  increaseCountFonction("purple");
                }}
                className="absolute top-0 bottom-0 right-0 min-w-[30%] z-30 md:hover:border  md:hover:border-l-purple-400"
              >
                {" "}
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
        <p className="text-orange-50">.</p>

        <div className="min-w-[4.9rem]">
          <div className="relative ">
            {showUpdateAutoSettingPopup && (
              <div className="absolute top-[3rem] z-[2] border bg-white shadow-lg shadow-black/20 rounded-lg min-w-[20rem] right-0 p-2">
                <div className="relative">
                  <IoClose
                    onClick={() => {
                      setShowUpdateAutoSettingPopup(false);
                    }}
                    className="absolute top-2 right-2 text-lg  text-red-500 cursor-pointer"
                  />
                  <p className="font-bold  border-b py-2   px-2 cursor-pointer text-orange-500">
                    {t("Options")}
                  </p>
                  <p
                    onClick={() => {
                      resetTimerForAutoUpdate();
                      fetchNewDataDevices();
                      setShowUpdateAutoSettingPopup(false);
                    }}
                    className="font-semibold text-gray-700 border-b py-2 hover:bg-orange-100  px-2 cursor-pointer"
                  >
                    {t("Mettre à jour les données maintenant")}
                  </p>
                  <div
                    onClick={() => {
                      setUpdateAutoSetting(!updateAutoSetting);
                      setShowUpdateAutoSettingPopup(false);
                    }}
                    className="font-semibold text-gray-700 border-b py-2 hover:bg-orange-100  px-2 cursor-pointer flex justify-between items-center"
                  >
                    {updateAutoSetting ? (
                      <p>{t("Désactiver la mise à jour automatique")}</p>
                    ) : (
                      <p>{t("Activer la mise à jour automatique")}</p>
                    )}

                    {updateAutoSetting ? (
                      <IoMdCheckboxOutline className="text-[1.42rem] text-orange-500" />
                    ) : (
                      <MdOutlineCheckBoxOutlineBlank
                        IoMdCheckboxOutline
                        className="text-[1.42rem] text-orange-500"
                      />
                    )}
                  </div>
                </div>
              </div>
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
                  setShowUpdateAutoSettingPopup(true);
                }}
                className={`hover:bg-orange-500 md:hover:border-orange-500 transition-all hover:text-white rounded-lg min-w-[3.5rem] p-2 my-0.5 mr-1.5 w-full  justify-between items-center  bg-orange-100  text-orange-700 border border-orange-700    translate-y-1-- md:translate-y-0 cursor-pointer flex gap-2--   `}
              >
                <p
                  className="font-bold"
                  // onClick={() => resetTimerForAutoUpdate(30 * 60 * 1000)}
                >
                  {Math.floor(timeLeftBeforeAutoUpdate / 60)}:
                  {timeLeftBeforeAutoUpdate % 60}
                </p>
                <MdUpdate
                  className={`${
                    isLoading2 ? "animate-spin " : ""
                  }  sm:text-[1.35rem]  text-[1.2rem]  `}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        {/* </div>{" "} */}
      </div>
    </div>
  );
}

export default StatisticDashboard;
