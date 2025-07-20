import React, { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function TableauRecapitulatifComptes({
  isLongueur,
  voirPlusDeColonneDansTableauCompte,
  setDocumentationPage,
  setExpandSection,
  setStatisticFilteredDeviceListeText,
  setShowStatisticDeviceListeDashboard,
}) {
  const {
    gestionAccountData,
    setCurrentAccountSelected,
    setFilteredColorCategorieListe,
    addVehiculeDetailsFonction,
    véhiculeDetails,
  } = useContext(DataContext);
  const [t] = useTranslation();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getTodayTimestamp = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  };

  const todayTimestamp = useMemo(getTodayTimestamp, []);
  const currentTimeSec = useMemo(() => Math.floor(Date.now() / 1000), []);
  const twentyFourHoursInSec = 86400;

  const comptesAnalysés = useMemo(() => {
    if (!gestionAccountData) return [];

    return gestionAccountData
      .slice()
      .sort(
        (a, b) =>
          (b.accountDevices?.length || 0) - (a.accountDevices?.length || 0)
      )
      .map((acct, i) => {
        const devices = acct.accountDevices || [];
        const totalDevices = devices.length;

        let moved = 0;
        let actifs = 0;

        for (let j = 0; j < devices.length; j++) {
          const d = devices[j];
          if (d.lastStopTime > todayTimestamp) moved++;
          if (currentTimeSec - d.lastUpdateTime < twentyFourHoursInSec)
            actifs++;
        }

        return {
          index: i + 1,
          id: acct.accountID,
          totalDevices,
          moved,
          actifs,
          inactifs: totalDevices - actifs,
          nbUsers: acct.accountUsers?.length || 0,
          nbGroups: acct.accountGroupes?.length || 0,
          nbGeofences: acct.accountGeofences?.length || 0,
          type: acct.accountType || "-",
          isManager: acct.isAccountManager ? "Oui" : "Non",
          isActive: acct.isActive ? "Oui" : "Non",
        };
      });
  }, [gestionAccountData, todayTimestamp, currentTimeSec]);

  const comptesVisibles = useMemo(() => {
    return comptesAnalysés.slice(0, page * pageSize);
  }, [comptesAnalysés, page]);

  const tableauClass =
    isLongueur === "true" ? "h-[75vh]" : "md:h-[20rem] h-[20rem]";

  useEffect(() => {
    if (page > 1) {
      setPage(1);
    }
  }, [setDocumentationPage]);

  const handleChooseCompte = (acct) => {
    const acctID = acct?.id;
    const foundAccount = gestionAccountData?.find(
      (c) => c.accountID === acctID
    );
    setCurrentAccountSelected(foundAccount);
    // console.log("foundAccount", foundAccount);
    // console.log("gestionAccountData", gestionAccountData);
  };

  const handleSetAllDevice = (acct) => {
    setShowStatisticDeviceListeDashboard(true);
    const acctID = acct?.id;
    const foundAccount = gestionAccountData?.find(
      (c) => c.accountID === acctID
    );
    const accountDevice = foundAccount?.accountDevices;

    // const accountDevice = foundAccount?.accountDevices?.filter((device) => device?.lastStopTime > todayTimestamp);

    setFilteredColorCategorieListe(
      addVehiculeDetailsFonction(accountDevice, véhiculeDetails)
    );
    setStatisticFilteredDeviceListeText(`${t("Tous les Appareils")}`);
  };

  const handleSetDeviceDéplacer = (acct) => {
    setShowStatisticDeviceListeDashboard(true);
    const acctID = acct?.id;
    const foundAccount = gestionAccountData?.find(
      (c) => c.accountID === acctID
    );

    const accountDevice = foundAccount?.accountDevices?.filter(
      (device) => device?.lastStopTime > todayTimestamp
    );

    setFilteredColorCategorieListe(
      addVehiculeDetailsFonction(accountDevice, véhiculeDetails)
    );
    setStatisticFilteredDeviceListeText(`${t("Tous les Appareils")}`);
  };

  const handleSetDeviceActif = (acct) => {
    setShowStatisticDeviceListeDashboard(true);
    const acctID = acct?.id;
    const foundAccount = gestionAccountData?.find(
      (c) => c.accountID === acctID
    );

    const accountDevice = foundAccount?.accountDevices?.filter(
      (device) => currentTimeSec - device?.lastUpdateTime < twentyFourHoursInSec
    );

    setFilteredColorCategorieListe(
      addVehiculeDetailsFonction(accountDevice, véhiculeDetails)
    );
    setStatisticFilteredDeviceListeText(`${t("Tous les Appareils")}`);
  };

  const handleSetDeviceInActif = (acct) => {
    setShowStatisticDeviceListeDashboard(true);
    const acctID = acct?.id;
    const foundAccount = gestionAccountData?.find(
      (c) => c.accountID === acctID
    );

    const accountDevice = foundAccount?.accountDevices?.filter(
      (device) =>
        currentTimeSec - device?.lastUpdateTime >= twentyFourHoursInSec
    );

    setFilteredColorCategorieListe(
      addVehiculeDetailsFonction(accountDevice, véhiculeDetails)
    );
    setStatisticFilteredDeviceListeText(`${t("Tous les Appareils")}`);
  };

  return (
    <div className={`w-full overflow-x-auto overflow-y-hidden`}>
      <div className={`min-w-[55rem] overflow-y-auto ${tableauClass}`}>
        <table className="w-full text-left dark:bg-gray-800 dark:text-gray-200 border">
          <thead className="bg-orange-50 h-[2.8rem] text-gray-700 dark:bg-gray-900 dark:text-gray-100 sticky top-0 z-10 ">
            <tr>
              <th>#</th>
              <th>{t("Compte")}</th>
              <th>{t("Nombre appareils")}</th>
              <th>{t("Appareils Déplacés")}</th>
              <th>{t("Appareils Actifs")}</th>
              <th>{t("Appareils Hors service")}</th>
              {/*  */}
              {voirPlusDeColonneDansTableauCompte && (
                <>
                  <th>{t("Utilisateur")}</th>
                  <th>{t("Groupe")}</th>
                  <th>{t("Geofence")}</th>
                  {/* <th>{t("Type")}</th> */}
                  {/* <th>{t("Manager")}</th> */}
                  <th>{t("Actif")}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {comptesVisibles.map((acct) => (
              <tr key={acct.index} className="border dark:border-gray-600">
                <td className="py-3 w-[3rem] px-2">{acct.index}</td>
                <td
                  onClick={() => {
                    handleChooseCompte(acct);
                    if (isLongueur === "true") {
                      setExpandSection("");
                    }
                  }}
                  className="py-3 px-2 w-[12rem] notranslate cursor-pointer hover:bg-orange-50"
                >
                  {acct.id}
                </td>
                <td
                  onClick={() => {
                    handleSetAllDevice(acct);
                  }}
                  className="py-3  px-2 cursor-pointer hover:bg-orange-50"
                >
                  {acct.totalDevices}
                </td>
                <td
                  onClick={() => {
                    handleSetDeviceDéplacer(acct);
                  }}
                  className="py-3 px-2 hover:bg-orange-50 cursor-pointer"
                >
                  {acct.moved}
                </td>
                <td
                  onClick={() => {
                    handleSetDeviceActif(acct);
                  }}
                  className="py-3 px-2 hover:bg-orange-50 cursor-pointer"
                >
                  {acct.actifs}
                </td>
                <td
                  onClick={() => {
                    handleSetDeviceInActif(acct);
                  }}
                  className="py-3 px-2 hover:bg-orange-50 cursor-pointer"
                >
                  {acct.inactifs}
                </td>
                {/*  */}
                {voirPlusDeColonneDansTableauCompte && (
                  <>
                    <td className="py-3 px-2">{acct.nbUsers}</td>
                    <td className="py-3 px-2">{acct.nbGroups}</td>
                    <td className="py-3 px-2">{acct.nbGeofences}</td>
                    {/* <td className="py-3 px-2">{acct.type}</td> */}
                    {/* <td className="py-3 px-2">{acct.isManager}</td> */}
                    <td className="py-3 px-2">{acct.isActive}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {comptesAnalysés.length > comptesVisibles.length ? (
          <div
            className={`${
              isLongueur === "true" ? "justify-center" : "justify-between"
            } flex  items-center mt-4`}
          >
            <button
              onClick={() => setPage(page + 1)}
              className="text-sm mb-10 py-1 px-4 rounded-lg bg-orange-500 font-bold text-white"
            >
              {t("Voir plus")}
            </button>
            {isLongueur !== "true" && (
              <button
                onClick={() => setPage(page + 1)}
                className="text-sm mb-10 py-1 px-4 rounded-lg bg-orange-500 font-bold text-white"
              >
                {t("Voir plus")}
              </button>
            )}
          </div>
        ) : (
          <div
            className={`${
              isLongueur === "true" ? "justify-center" : "justify-between"
            } flex  items-center mt-4`}
          >
            <button
              onClick={() => setPage(1)}
              className="text-sm mb-10 py-1 px-4 rounded-lg bg-orange-500 font-bold text-white"
            >
              {t("Voir moins")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableauRecapitulatifComptes;
