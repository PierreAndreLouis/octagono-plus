import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";

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
  DeviceEnStationnement,
  animatedStationnement,
  DeviceInactifs,
  animatedInactifs,
  DeviceDéplacer,
  allDevices,
}) {
  const {
    currentAccountSelected,
    FormatDateHeure,
    isDashboardHomePage,
    account,
    username,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  return (
    <div className="md:px-4-- pt-3--">
      <div className="w-full h-full shadow-lg shadow-black/5 bg-white rounded-lg p-4">
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

          <div className="  flex gap-1 sm:gap-3 items-center absolute right-0 py-2  rounded-lg bottom-4 ">
            {lastUpdate?.mostRecentTimestamp && (
              <p className="font-semibold flex items-center text-[.8rem] md:text-[.9rem] text-gray-700">
                <span className="hidden md:block mr-2">{t("Last Update")}</span>
                {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.date}
                {" / "}
                {FormatDateHeure(lastUpdate?.mostRecentTimestamp)?.time}{" "}
              </p>
            )}
            <div
              onClick={() => {
                fetchNewDataDevices();
              }}
              className={`${
                isLoading2 ? "animate-spin" : ""
              }  text-orange-500 min-w-2  translate-y-1-- md:translate-y-0 cursor-pointer   dark:text-gray-200 `}
            >
              {/* {isDashboardHomePage && ( */}
              <MdUpdate className="sm:text-[1.35rem]  text-[1.2rem]  " />
              {/* )} */}
            </div>
          </div>
        </div>

        {/* Liste des statistics */}
        <div className="grid grid-cols-2 gap-1.5 md:gap-4 md:grid-cols-4 items-center justify-between">
          {/*  */}
          <div
            onClick={() => {
              setShowStatisticDeviceListeDashboard(true);
              setStatisticFilteredDeviceListe(allDevices);
              setStatisticFilteredDeviceListeText("Tous les Appareils");
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
                  {/* {allDevices?.length} */}
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
              setShowStatisticDeviceListeDashboard(true);
              setStatisticFilteredDeviceListe(DeviceDéplacer);
              setStatisticFilteredDeviceListeText("Appareils Déplacer");
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-green-300  relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-green-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Déplacés")}
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {/* {DeviceDéplacer?.length} */}
                  {animatedDeplaces}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-4">
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
              setShowStatisticDeviceListeDashboard(true);
              setStatisticFilteredDeviceListe(DeviceEnStationnement);
              setStatisticFilteredDeviceListeText("Appareils Actifs");
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-orange-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-orange-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Actifs")}
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {/* {DeviceEnStationnement?.length} */}
                  {animatedStationnement}
                </h2>
              </div>
              <div className="absolute mt-1.5 right-4 bottom-4 ">
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
              setStatisticFilteredDeviceListe(DeviceInactifs);
              setStatisticFilteredDeviceListeText("Appareils Inactifs");
            }}
            className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg"
          >
            <div className="border border-purple-300 relative overflow-hidden dark:border-gray-800 dark:shadow-gray-900  bg-purple-300/40 dark:bg-blue-700/40 flex justify-between items-start rounded-lg shadow-md-- p-3">
              <div>
                <div className="flex items-center  gap-2">
                  <h3 className="text-gray-500 dark:text-gray-300 md:font-semibold  text-[.91rem] xs:text-[1.1rem] font-semibold md:text-xl-- ">
                    {t("Inactifs")}
                  </h3>
                </div>
                <h2 className="text-gray-900 dark:text-gray-200 font-bold text-2xl md:text-2xl lg:text-4xl-- ">
                  {/* {DeviceInactifs?.length} */}
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
    </div>
  );
}

export default StatisticDashboard;
