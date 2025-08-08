import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";
import { FaCar } from "react-icons/fa";

function DeviceListeDashboard() {
  const {
    currentAccountSelected,
    gestionAccountData,
    FormatDateHeure,
    isDashboardHomePage,
    mergedDataHome,
    addVehiculeDetailsFonction,
    véhiculeDetails,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  // Fonction pour obtenir le timestamp d'aujourd'hui à minuit (en secondes)
  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Minuit
    return Math.floor(now.getTime() / 1000); // secondes
  };

  const todayTimestamp = getTodayTimestamp();
  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000); // secondes
  const twentyFourHoursInSec = 24 * 60 * 60;
  const currentTimeSec = getCurrentTimestamp();

  const devices = isDashboardHomePage
    ? currentAccountSelected
      ? currentAccountSelected?.accountDevices
      : Array.from(
          new Map(
            gestionAccountData
              ?.flatMap((account) => account.accountDevices)
              ?.map((device) => [device.deviceID, device])
          ).values()
        )
    : dataFusionné;

  const DataDevices = devices
    ?.slice(0, 2)
    ?.sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);

  return (
    <div className=" flex flex-col gap-4  h-full max-h-[20rem]-- overflow-y-auto-">
      {DataDevices?.length > 0 ? (
        addVehiculeDetailsFonction(DataDevices, véhiculeDetails)?.map(
          (device, index) => {
            let border_color = "bg-gray-50";
            let text_color = "text-orange-500/80";

            if (
              currentTimeSec - device?.lastUpdateTime <
              twentyFourHoursInSec
            ) {
              border_color = "border-l-[.4rem] border-orange-400";
              text_color = "text-orange-400";
            } else if (
              currentTimeSec - device?.lastUpdateTime >
              twentyFourHoursInSec
            ) {
              border_color = "border-l-[.4rem] border-purple-300";
              text_color = "text-purple-400";
            }

            if (device?.lastStopTime > todayTimestamp) {
              border_color = "border-l-[.4rem] border-green-500";
              text_color = "text-green-400";
            }

            return (
              <div
                key={index}
                onClick={() => {
                  console.log(DataDevices);
                }}
                className={`${border_color} bg-gray-50 shadow-lg-- shadow-inner shadow-gray-500/10   relative overflow-hidden-- 50 shadow-black/10-- flex gap-3 items-center- rounded-lg py-[1rem] px-2 `}
              >
                <FaCar
                  className={`${text_color} text-[2rem] hidden sm:block min-w-[2.5rem] mt-1`}
                />
                <div className="flex flex-col gap-1 ">
                  <FaCar
                    className={`${text_color} text-[2rem] sm:hidden min-w-[2.5rem] mt-1`}
                  />
                  <p className="text-gray-600 font-bold">
                    {t("ID du compte")} :{" "}
                    <span className="font-normal notranslate text-gray-500 ml-0 ">
                      {device?.accountID}
                    </span>{" "}
                  </p>
                  <p className="text-gray-600 font-bold">
                    {t("Description")} :{" "}
                    <span className="font-normal notranslate text-gray-500 ml-0 ">
                      {device?.description}
                    </span>{" "}
                  </p>
                  <p className="text-gray-600 font-bold">
                    {t("Adresse")} :{" "}
                    <span className="font-normal notranslate text-gray-500 ml-0 ">
                      {device?.véhiculeDetails?.[0]?.address}
                    </span>{" "}
                  </p>
                  <p className="text-gray-600 font-bold">
                    {t("Last Update")} :{" "}
                    <span className="font-normal text-gray-500 ml-0">
                      {FormatDateHeure(device?.lastUpdateTime)?.date} {" / "}
                      {FormatDateHeure(device?.lastUpdateTime)?.time}
                    </span>{" "}
                  </p>
                </div>
              </div>
            );
          }
        )
      ) : (
        <div className="flex h-full   justify-center items-center font-semibold text-lg">
          <p className="mb-10 md:mt-20">{t("Pas de résultat")}</p>
        </div>
      )}
    </div>
  );
}

export default DeviceListeDashboard;
