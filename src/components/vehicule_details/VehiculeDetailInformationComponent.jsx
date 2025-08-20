import React, { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function VehiculeDetailInformationComponent({
  currentVéhicule,
  setShowVehiculeListe,
}) {
  const [t, i18n] = useTranslation();

  const { FormatDateHeure, username, currentCountry } = useContext(DataContext);

  const country = currentCountry || localStorage.getItem("currentCountry");
  let locale = "fr-FR";

  useEffect(() => {
    if (country === "ht") locale = "fr-FR";
    else if (country === "rd") locale = "es-ES";
    else if (country === "en") locale = "en-US";
  }, [currentCountry]);

  const creationDateTime = (creationTime) => {
    const date = new Date(creationTime * 1000);

    const formattedDate = date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return { date: formattedDate, time: formattedTime };
  };

  const FormatDateHeureTimestamp = FormatDateHeure(
    currentVéhicule?.creationTime
  );

  const { date } = creationDateTime(currentVéhicule?.creationTime);
  const { time } = FormatDateHeureTimestamp;

  return (
    <>
      {currentVéhicule ? (
        <div className="mt-8 bg-gray-100 py-4 rounded-xl px-4 sm:px-[10vw] flex flex-col gap-2 dark:bg-gray-800">
          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Date de creation")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">{date}</p>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {" "}
              {t("à")} {time}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Nom du véhicule")}
            </h3>
            <p className="pl-3 notranslate text-gray-500 dark:text-gray-400">
              {currentVéhicule?.description || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Description du véhicule")}
            </h3>
            <p className="pl-3 notranslate text-gray-500 dark:text-gray-400">
              {currentVéhicule?.description || ""}
            </p>
          </div>

          {username === "admin" && (
            <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
              <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
                {t("IMEI")}
              </h3>
              <p className="pl-3 text-gray-500 dark:text-gray-400">
                {currentVéhicule?.imeiNumber || ""}
              </p>
            </div>
          )}

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Plaque du véhicule")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.licensePlate || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Type d'installation")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.equipmentType || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Adresse du véhicule")}
            </h3>
            <p className="pl-3 notranslate text-gray-500 dark:text-gray-400">
              {currentVéhicule?.véhiculeDetails[0]?.backupAddress ||
                currentVéhicule?.véhiculeDetails[0]?.address ||
                ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Statut du véhicule")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.véhiculeDetails[0]?.speedKPH >= 1
                ? `${t("En Déplacement")}`
                : `${t("En Stationnement")}` || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Distance totale parcourue")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.lastOdometerKM &&
              !isNaN(Number(currentVéhicule?.lastOdometerKM))
                ? Number(currentVéhicule?.lastOdometerKM).toFixed(2) + " km"
                : `${t("Non disponible")}`}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              {t("Numéro de la carte SIM")}
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.simPhoneNumber || ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col">
          <p className="text-center text-lg dark:text-gray-100">
            {t("Veuillez choisir un véhicule")}
          </p>
          <button
            onClick={() => {
              setShowVehiculeListe(true);
            }}
            className="mx-auto border px-6 py-1 rounded-md mt-4 bg-orange-500 text-white font-semibold cursor-pointer"
          >
            {t("Choisir")}
          </button>
        </div>
      )}
    </>
  );
}

export default VehiculeDetailInformationComponent;
