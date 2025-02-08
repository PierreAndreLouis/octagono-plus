import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";

function VehiculeDetailInformationComponent({
  currentVéhicule,
  setShowVehiculeListe,
}) {
  const { FormatDateHeure, username } = useContext(DataContext);
  const creationDateTime = (creationTime) => {
    // Convertir le timestamp en millisecondes
    const date = new Date(creationTime * 1000);

    // Extraire les parties de la date en texte clair
    const formattedDate = date.toLocaleDateString("fr-FR", {
      weekday: "long", // Jour de la semaine (ex : Lundi)
      year: "numeric",
      month: "long", // Mois en texte (ex : septembre)
      day: "numeric",
    });

    // Extraire les parties de l'heure
    const formattedTime = date.toLocaleTimeString("fr-FR", {
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
              Date de creation
            </h3>
            {/* <div className="flex gap-3"> */}
            <p className="pl-3 text-gray-500 dark:text-gray-400">{date}</p>
            {/* <p className="pl-3-- text-gray-500 dark:text-gray-400">à</p> */}
            <p className="pl-3 text-gray-500 dark:text-gray-400"> à {time}</p>
            {/* </div> */}
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Nom du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.description || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Description du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.description || ""}
            </p>
          </div>

          {username === "admin" && (
            <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
              <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
                IMEI
              </h3>
              <p className="pl-3 text-gray-500 dark:text-gray-400">
                {currentVéhicule?.imeiNumber || ""}
              </p>
            </div>
          )}

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Plaque du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.licensePlate || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Type d'appareil
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.equipmentType || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Adresse du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.véhiculeDetails[0]?.backupAddress ||
                currentVéhicule?.véhiculeDetails[0]?.address ||
                ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Statut du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.véhiculeDetails[0]?.speedKPH >= 1
                ? "En Déplacement"
                : "En Stationnement" || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Distance totale parcourue
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.lastOdometerKM &&
              !isNaN(Number(currentVéhicule?.lastOdometerKM))
                ? Number(currentVéhicule?.lastOdometerKM).toFixed(2) + " km"
                : "Non disponible"}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Numéro de la carte SIM
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVéhicule?.simPhoneNumber || ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col">
          <p className="text-center text-lg dark:text-gray-100">
            Veuillez choisir un véhicule
          </p>
          <button
            onClick={() => {
              setShowVehiculeListe(true);
            }}
            className="mx-auto border px-6 py-1 rounded-md mt-4 bg-orange-500 text-white font-semibold cursor-pointer"
          >
            Choisir
          </button>
        </div>
      )}
    </>
  );
}

export default VehiculeDetailInformationComponent;
