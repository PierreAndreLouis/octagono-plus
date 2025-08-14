import React, { useContext, useMemo, useState } from "react";
import { IoAlertCircleOutline, IoSearch } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { useTranslation } from "react-i18next";

function ListeDesAlertsGestion({
  fromDashboard = false,
  statisticFilteredDeviceListe,
  searchTermInput,
  setSearchTermInput,
}) {
  const {
    FormatDateHeure,
    listeGestionDesVehicules,
    accountDevices,
    statusDescriptions,
    véhiculeDetails,
    ListeDesAlertes,
    isDashboardHomePage,
    mergedDataHome,
  } = useContext(DataContext);

  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let ListeOfDevice = isDashboardHomePage ? accountDevices : dataFusionné;

  // Filtrage des devices selon la recherche
  // const filteredListe = useMemo(() => {
  //   if (!searchTermInput) return ListeDesAlertes;

  //   return ListeDesAlertes.filter((item) => {
  //     const code = parseInt(item?.statusCode, 16);
  //     const statusDesc = statusDescriptions[code]?.toLowerCase() || "";
  //     const foundDevice = ListeOfDevice?.find(
  //       (device) =>
  //         device?.deviceID === item?.deviceID &&
  //         device?.accountID === item?.accountID
  //     );

  //     return (
  //       item?.statusCode
  //         ?.toLowerCase()
  //         .includes(searchTermInput.toLowerCase()) ||
  //       foundDevice?.description
  //         ?.toLowerCase()
  //         .includes(searchTermInput.toLowerCase()) ||
  //       foundDevice?.imeiNumber
  //         ?.toLowerCase()
  //         .includes(searchTermInput.toLowerCase()) ||
  //       foundDevice?.simPhoneNumber
  //         ?.toLowerCase()
  //         .includes(searchTermInput.toLowerCase()) ||
  //       item?.accountID
  //         ?.toLowerCase()
  //         .includes(searchTermInput.toLowerCase()) ||
  //       statusDesc.includes(searchTermInput.toLowerCase())
  //     );
  //   });
  // }, [ListeDesAlertes, searchTermInput, statusDescriptions]);

  const filteredListe = useMemo(() => {
    if (!searchTermInput) return ListeDesAlertes;

    return ListeDesAlertes.filter((item) => {
      const code = parseInt(item?.statusCode, 16);
      const statusDesc = statusDescriptions[code];
      const statusDescLower = statusDesc?.toLowerCase() || "";

      const foundDevice = ListeOfDevice?.find(
        (device) =>
          device?.deviceID === item?.deviceID &&
          device?.accountID === item?.accountID
      );

      const search = searchTermInput.toLowerCase();

      return (
        item?.statusCode?.toLowerCase().includes(search) ||
        foundDevice?.description?.toLowerCase().includes(search) ||
        foundDevice?.imeiNumber?.toLowerCase().includes(search) ||
        foundDevice?.simPhoneNumber?.toLowerCase().includes(search) ||
        item?.accountID?.toLowerCase().includes(search) ||
        statusDescLower.includes(search) ||
        (search.includes("estado desconocido") && !statusDesc) ||
        (search.includes("statut inconnu") && !statusDesc) ||
        (search.includes("unknown status") && !statusDesc)
      );
    });
  }, [ListeDesAlertes, searchTermInput, statusDescriptions, ListeOfDevice]);

  // Extraction et pagination des alertes valides
  const paginatedAlerts = useMemo(() => {
    return (
      filteredListe
        // ?.filter((item) => item?.statusCode !== "0xF952")
        ?.slice(0, page * pageSize)
    );
  }, [filteredListe, page]);

  return (
    <div className="px-2 pb-40 bg-white pt-10 rounded-lg">
      <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
        <div className="w-full flex justify-center items-center py-3 font-bold text-xl">
          <h2 className="mb-0">
            {t("Liste des Alertes")} ({filteredListe?.length})
          </h2>
        </div>

        <div className="mt-2 border border-gray-300 rounded-md overflow-hidden flex">
          <input
            type="search"
            placeholder={t("Recherche une alerte")}
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
            className="px-3 w-full focus:outline-none dark:text-white dark:bg-gray-800 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm"
          />
          <div className="cursor-pointer border-l border-gray-300 px-3 py-2">
            <IoSearch className="text-xl text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-[50rem] mx-auto mt-6">
        {paginatedAlerts.length > 0 ? (
          paginatedAlerts.map((alert, index) => {
            const code = parseInt(alert.statusCode, 16);
            const codeDescription =
              statusDescriptions[code] || t("Statut inconnu");

            const currentDevice = ListeOfDevice?.find(
              (device) =>
                device?.deviceID === alert?.deviceID &&
                device?.accountID === alert?.accountID
            );

            return (
              <div
                key={index}
                className="bg-orange-50/70 shadow-inner relative flex gap-4 justify-between items-end rounded-lg px-4 py-4"
              >
                <div className="bg-gray-100 shadow text-sm absolute top-0 right-0 rounded-bl-full font-bold w-8 h-8 flex justify-center items-center">
                  {index + 1}
                </div>
                <div className="flex gap-3 w-full">
                  <IoAlertCircleOutline className="text-orange-500/80 text-[3rem] hidden sm:block" />
                  <div className="w-full">
                    <div className="text-orange-500/80 border-b py-1 font-bold">
                      {t("Alerte")} :{" "}
                      <span className="pl-2">{codeDescription}</span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Code")}:</p>
                      <span className="text-gray-600 pl-2">
                        {alert?.statusCode}
                      </span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Vitesse")}:</p>
                      <span className="text-gray-600 pl-2">
                        {/* {alert?.speedKPH}  */}
                        {parseFloat(alert?.speedKPH).toFixed(0)} Km/h
                      </span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Description")}:</p>
                      <span className="text-gray-600 pl-2">
                        {currentDevice?.description || "---"}
                      </span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Account ID")}:</p>
                      <span className="text-gray-600 pl-2">
                        {alert?.accountID}
                      </span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Adresse")}:</p>
                      <span className="text-gray-600 pl-2">
                        {alert?.address || t("Pas d'adresse disponible")}
                      </span>
                    </div>
                    <div className="border-b py-1">
                      <p className="font-bold inline">{t("Last update")}:</p>
                      <span className="text-gray-600 pl-2">
                        {FormatDateHeure(alert?.timestamp).date} /{" "}
                        {FormatDateHeure(alert?.timestamp).time}
                      </span>
                    </div>
                    {/* timestamp: {alert?.timestamp} */}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center font-semibold text-lg">
            {t("Pas de résultat")}
          </div>
        )}

        {filteredListe.length > page * pageSize && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold max-w-[15rem] mx-auto"
          >
            {t("Voir plus de Résultat")}
          </button>
        )}
      </div>
    </div>
  );
}

export default ListeDesAlertsGestion;
