import React, { useContext, useEffect, useState } from "react";
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
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  const currentListe = fromDashboard
    ? statisticFilteredDeviceListe?.map((device) => {
        const match = véhiculeDetails?.find(
          (v) =>
            v.deviceID === device.deviceID &&
            v.véhiculeDetails?.[0]?.accountID === device.accountID
        );

        if (match && match.véhiculeDetails.length > 0) {
          return { ...device, véhiculeDetails: match.véhiculeDetails };
        }

        return device;
      })
    : listeGestionDesVehicules?.map((device) => {
        const match = véhiculeDetails?.find(
          (v) =>
            v.deviceID === device.deviceID &&
            v.véhiculeDetails?.[0]?.accountID === device.accountID
        );

        if (match && match.véhiculeDetails.length > 0) {
          return { ...device, véhiculeDetails: match.véhiculeDetails };
        }

        return device;
      });

  const filteredListeGestionDesVehicules = searchTermInput
    ? currentListe?.filter((item) => {
        const véhicule = item?.véhiculeDetails?.[0];
        const code = parseInt(véhicule?.statusCode, 16);
        const statusDesc = statusDescriptions[code]?.toLowerCase() || "";

        return (
          item?.description
            ?.toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          item?.imeiNumber
            ?.toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          item?.simPhoneNumber
            ?.toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          item?.accountID
            ?.toLowerCase()
            .includes(searchTermInput.toLowerCase()) ||
          statusDesc.includes(searchTermInput.toLowerCase())
        );
      })
    : currentListe;

  return (
    <div>
      <div className="px-2 pb-40 bg-white pt-10 rounded-lg">
        <div>
          <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
            {/*  */}

            <div className="w-full flex justify-center items-center py-3 mt-5--  font-bold text-xl">
              <h2 className="mb-0">
                {t("Liste des Alertes")} (
                {filteredListeGestionDesVehicules?.length})
              </h2>
            </div>

            <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
              <input
                id="search"
                name="search"
                type="search"
                placeholder={`${t("Recherche un appareil")}`}
                required
                value={searchTermInput}
                onChange={(e) => {
                  setSearchTermInput(e.target.value);
                }}
                className=" px-3 w-full focus:outline-none dark:text-white  dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
              <div className=" cursor-pointer border-l border-l-gray-300 px-3  py-2 ">
                <IoSearch className="text-xl text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}

          {filteredListeGestionDesVehicules?.length > 0 ? (
            filteredListeGestionDesVehicules
              ?.flatMap((device) => device?.véhiculeDetails[0] || [])
              ?.filter((item) => item?.statusCode !== "0xF952")
              ?.slice()
              ?.map((alert, index) => {
                const code = parseInt(alert.statusCode, 16);
                const codeDescription =
                  statusDescriptions[code] || `${t("Statut inconnu")}`;

                const currentDevice = accountDevices?.find(
                  (d) => d.deviceID === alert.deviceID
                );

                let border_color = "bg-gray-50";
                let text_color = "text-orange-500/80";

                return (
                  <div
                    key={index}
                    className={`${border_color} border-l-[.3rem]-- overflow-hidden bg-orange-50/70 shadow-inner  shadow-black/10 relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4`}
                  >
                    <div className="bg-gray-100 shadow-lg shadow-black/10  pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3   w-full">
                      <IoAlertCircleOutline
                        className={`${text_color} text-[3rem] hidden sm:block  md:mr-4 `}
                      />
                      <div className=" w-full  flex flex-wrap justify-between gap-x-4">
                        <div className="  w-full">
                          <IoAlertCircleOutline
                            className={`${text_color} text-[3rem] sm:hidden   md:mr-4 `}
                          />
                          <div
                            className={`${text_color} flex-- w-full  flex-wrap00 border-b py-1`}
                          >
                            <p className="font-bold">
                              {t("Alerte")} :
                              <span className=" dark:text-orange-500 font-bold  pl-5">
                                {codeDescription}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Code")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {alert?.statusCode}
                            </span>
                          </div>{" "}
                          <div className="flex- flex-wrap- border-b py-1">
                            <p className="font-bold">
                              {t("Description")} :
                              <span className=" dark:text-orange-500 font-normal notranslate text-gray-600 pl-5">
                                {currentDevice?.description || "---"}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Account ID")} :</p>
                            <span className=" dark:text-orange-500 notranslate text-gray-600 pl-5">
                              {alert?.accountID}
                            </span>
                          </div>{" "}
                          {/*  */}
                          <div className="flex- flex-wrap- border-b py-1">
                            <p className="font-bold">
                              {t("Adresse")} :
                              <span className="notranslate font-normal dark:text-orange-500 text-gray-600 pl-5">
                                {alert?.address ||
                                  `${t("Pas d'adresse disponible")}`}
                              </span>
                            </p>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold">{t("Last update")} :</p>
                            <span className=" dark:text-orange-500 text-gray-600 pl-5">
                              {FormatDateHeure(alert?.timestamp).date}
                              <span className="px-2">/</span>{" "}
                              {FormatDateHeure(alert?.timestamp).time}
                            </span>
                          </div>{" "}
                        </div>
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
        </div>
      </div>
    </div>
  );
}

export default ListeDesAlertsGestion;
