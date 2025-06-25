import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function TableauRecapitulatifComptes({ isLongueur }) {
  const { gestionAccountData } = useContext(DataContext);
  const [t, i18n] = useTranslation();
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

  return (
    <div
      className={`w-full  overflow-x-auto overflow-y-hidden ${
        isLongueur === "true" ? "" : " h-[20rem] "
      } `}
    >
      {/* fixed header */}
      <thead>
        <div className="h-auto border-l-2-- border-red-600- min- w-full -w-[150rem] w-full-">
          <tr className="bg-orange-100 border-2 border-green-600 relative z-20 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {/* <th className="border min-w-[.4rem] dark:border-gray-600 py-2 ----- --px-1"></th> */}
            <th className="border  min-w-[3.21rem]  dark:border-gray-600 py-2 ---- px-2">
              #
            </th>
            <th className="border min-w-[11.94rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Compte")}
            </th>
            <th className="border dark:border-gray-600 min-w-[6rem] py-2 ---- px-2">
              {t("Total")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Déplacé")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Actifs")}
            </th>

            <th className="border  min-w-[8rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Hors service")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Utilisateur")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Groupe")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Geofence")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Type")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("Manager")}
            </th>
            <th className="border  min-w-[6rem] dark:border-gray-600 py-2 ---- px-2">
              {t("IsActif")}
            </th>
          </tr>
        </div>
      </thead>

      <div
        className={`border-2 pb-10 -translate-y-[3.1rem] w-full min-w-[78rem] overflow-y-auto overflow-x-hidden ${(isLongueur =
          "true" ? "h-[75vh] " : "md:h-[25rem] h-[20rem]")}`}
      >
        {/* en-tête PDF, téléchargement… */}

        <table
          id="myTable"
          className="w-full-- text-left dark:bg-gray-800 dark:text-gray-200 border-2 border-red-500-- "
        >
          {/* second fixed header */}
          <thead>
            <tr className="bg-orange-50 h-[2.8rem]   text-gray-700 dark:bg-gray-900 dark:text-gray-100">
              {/* <th className=""></th> */}
              <th className="">#</th>
              <th className="">Compte</th>
              <th className="">Total </th>
              <th className="">Déplacés</th>
              <th className="">Actifs</th>
              <th className="">Hors service</th>
              <th className="">Utilisateurs</th>
              <th className="">Groupes</th>
              <th className="">Geofences</th>
              <th className="">Type</th>
              <th className="">Manager</th>
              <th className="">Actif</th>
            </tr>
          </thead>
          <tbody>
            {gestionAccountData
              ?.slice()
              .sort(
                (a, b) =>
                  (b.accountDevices?.length || 0) -
                  (a.accountDevices?.length || 0)
              )
              .map((acct, i) => {
                const totalDevices = acct.accountDevices?.length || 0;
                const movedDevices = acct.accountDevices?.filter(
                  (d) => d.lastStopTime > todayTimestamp
                ).length;
                const activeDevices = acct.accountDevices?.filter(
                  (d) =>
                    currentTimeSec - d.lastUpdateTime < twentyFourHoursInSec
                ).length;
                const inactiveDevices = acct.accountDevices?.filter(
                  (d) =>
                    currentTimeSec - d.lastUpdateTime >= twentyFourHoursInSec
                ).length;
                const nbUsers = acct.accountUsers?.length || 0;
                const nbGroups = acct.accountGroupes?.length || 0;
                const nbGeofences = acct.accountGeofences?.length || 0;

                return (
                  <tr key={i} className="border dark:border-gray-600">
                    {/* <td className="border-l-4 w-0"></td> */}
                    <td className="py-3  w-[3rem] px-2 border">{i + 1}</td>
                    <td className="notranslate py-3 px-2 w-[12rem] border">
                      {acct.accountID}
                    </td>
                    <td className="py-3 w-[6rem] px-2 border">
                      {totalDevices}
                    </td>
                    <td className="py-3 px-2 border w-[6rem]">
                      {movedDevices}
                    </td>
                    <td className="py-3 px-2 border w-[6rem]">
                      {activeDevices}
                    </td>
                    <td className="py-3 px-2 border w-[8rem]">
                      {inactiveDevices}
                    </td>
                    <td className="py-3 px-2 border w-[6rem]">{nbUsers}</td>
                    <td className="py-3 px-2 border w-[6rem]">{nbGroups}</td>
                    <td className="py-3 px-2 border w-[6rem]">{nbGeofences}</td>
                    <td className="py-3 px-2 border w-[6rem]">
                      {acct.accountType}
                    </td>
                    <td className="py-3 px-2 border w-[6rem]">
                      {acct.isAccountManager}
                    </td>
                    <td className="py-3 min-w-[5rem] px-2">{acct.isActive}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableauRecapitulatifComptes;
