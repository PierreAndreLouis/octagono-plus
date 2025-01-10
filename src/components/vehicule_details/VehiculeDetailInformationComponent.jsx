import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";

function VehiculeDetailInformationComponent({
  currentVehicule,
  setShowVehiculeListe,
}) {
  const { FormatDateHeure } = useContext(DataContext);
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
    currentVehicule?.creationTime
  );

  const { date } = creationDateTime(currentVehicule?.creationTime);
  const { time } = FormatDateHeureTimestamp;

  return (
    <>
      {currentVehicule ? (
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
              {currentVehicule?.description || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Description du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.description || ""}
            </p>
          </div>

          {/* <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              IMEI
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.imeiNumber || ""}
            </p>
          </div> */}

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Plaque du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.licensePlate || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Type d'appareil
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.equipmentType || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Adresse du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.vehiculeDetails[0]?.backupAddress ||
                currentVehicule?.vehiculeDetails[0]?.address ||
                ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Statut du véhicule
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.vehiculeDetails[0]?.speedKPH >= 1
                ? "En Deplacememt"
                : "En arrêt" || ""}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Distance totale parcourue
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {/* {currentVehicule?.lastOdometerKM + " km" || "---"} */}
              {currentVehicule?.lastOdometerKM &&
              !isNaN(Number(currentVehicule?.lastOdometerKM))
                ? Number(currentVehicule?.lastOdometerKM).toFixed(2) + " km"
                : "Non disponible"}
            </p>
          </div>

          <div className="flex justify-start flex-col sm:flex-row mt-2 border-b border-gray-300 pb-2 dark:border-gray-600">
            <h3 className="font-bold text-gray-600 min-w-[11.8rem] lg:min-w-[16rem] dark:text-gray-200">
              Numéro de la carte SIM
            </h3>
            <p className="pl-3 text-gray-500 dark:text-gray-400">
              {currentVehicule?.simPhoneNumber || ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col">
          <p className="text-center text-lg dark:text-gray-100">
            Veuillez choisir un vehicule
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
