import React, { useContext, useState } from "react";
import { IoEarth } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import { FaPlusCircle } from "react-icons/fa";
// import SuccèsÉchecMessagePopup from "../../components/Reutilisable/SuccèsÉchecMessagePopup";

function GestionGeofences() {
  const {
    ajouterGeofencePopup,
    setAjouterGeofencePopup,
    geofenceData,
    FormatDateHeure,
    account,
    currentGeozone,
    setCurrentGeozone,
    isEditingGeofence,
    setIsEditingGeofence,
    ModifierGeofence,
    supprimerGeofence,
    activerOuDesactiverGeofence,
    succesCreateGeofencePopup,
    setSuccesCreateGeofencePopup,
    succesModifierGeofencePopup,
    setSuccesModifierGeofencePopup,
    errorModifierGeofencePopup,
    setErrorModifierGeofencePopup,
    succesDeleteGeofencePopup,
    setSuccesDeleteGeofencePopup,
    errorDeleteGeofencePopup,
    setErrorDeleteGeofencePopup,
  } = useContext(DataContext);
  const [supprimerGeozonePopup, setSupprimerGeozonePopup] = useState(false);

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes
  //
  //
  //    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
  const lastUpdateTimeMs = currentGeozone?.lastUpdateTime
    ? currentGeozone?.lastUpdateTime * 1000
    : 0;
  const isCurrentGeozoneActive =
    currentTime - lastUpdateTimeMs < twentyHoursInMs;

  const geozoneID =
    currentGeozone?.geozoneID ||
    `${currentGeozone?.description?.toLowerCase().replace(/\s+/g, "_")}`;

  const supprimerOuModifierGeozone = () => {
    // activerOuDesactiverGeofence(geozoneID, 0);

    if (isCurrentGeozoneActive && currentGeozone?.isActive === (0 || 1)) {
      supprimerGeofence(geozoneID);
    }

    if (
      (isCurrentGeozoneActive || !isCurrentGeozoneActive) &&
      currentGeozone?.isActive === 0
    ) {
      // activerOuDesactiverGeofence(geozoneID, 1);
    }

    if (!isCurrentGeozoneActive && currentGeozone?.isActive === 1) {
      // activerOuDesactiverGeofence(geozoneID, 0);
    }
  };

  return (
    <div>
      <SuccèsÉchecMessagePopup
        message={succesCreateGeofencePopup}
        setMessage={setSuccesCreateGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de creation du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={succesModifierGeofencePopup}
        setMessage={setSuccesModifierGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de modification du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={succesDeleteGeofencePopup}
        setMessage={setSuccesDeleteGeofencePopup}
        véhiculeData={null}
        composant_from={"succès de suppression du geozone"}
      />
      <SuccèsÉchecMessagePopup
        message={errorDeleteGeofencePopup}
        setMessage={setErrorDeleteGeofencePopup}
        véhiculeData={null}
        composant_from={"échec de la suppression du geozone"}
      />

      <div className="px-4 pb-40">
        <h2
          onClick={() => {
            console.log(geofenceData);
          }}
          className="mt-[6rem] text-lg text-center font-bold "
        >
          Geozones
        </h2>
        <div className="flex justify-center mt-4">
          <Link
            to="/Groupe_vehicule_location?tab=localisation"
            onClick={() => {
              setAjouterGeofencePopup(true);
              setIsEditingGeofence(false);
              setCurrentGeozone();
            }}
            className="bg-orange-500 shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
          >
            <div className="flex justify-center items-center gap-3">
              <FaPlusCircle className="text-2xl" />
              <p className="text-lg text-center">Ajouter un nouveau Geozone</p>
            </div>
          </Link>{" "}
        </div>

        <div className="hidden-- flex mt-[2rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {
            // ?.filter((item) =>
            //   item.geozoneID.endsWith(`_${account}`)
            // )
            geofenceData?.length > 0 ? (
              geofenceData
                // ?.filter((item) => item.geozoneID.endsWith(`_${account}`))
                .map((geozone, index) => {
                  //    // Vérifie si le véhicule est actif (mise à jour dans les 20 dernières heures)
                  const lastUpdateTimeMs = geozone?.lastUpdateTime
                    ? geozone?.lastUpdateTime * 1000
                    : 0;
                  const isActive =
                    currentTime - lastUpdateTimeMs < twentyHoursInMs;

                  return (
                    <div
                      className="shadow-lg bg-orange-50/50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                      key={index}
                    >
                      <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                        {index + 1}
                      </div>
                      <div className="flex  gap-3  ">
                        <IoEarth className="text-[3rem] text-orange-500" />
                        <div className=" w-full flex flex-wrap justify-between gap-x-4">
                          <div>
                            <div className="flex flex-wrap">
                              <p className="font-bold">Nom du Geozone :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {geozone?.description}
                              </span>
                            </div>{" "}
                            <div className="flex flex-wrap">
                              <p className="font-bold">Date de creation :</p>
                              <span className=" dark:text-orange-500 text-gray-600 pl-5">
                                {FormatDateHeure(geozone?.lastUpdateTime).date}
                                <span className="px-3">-</span>
                                {FormatDateHeure(geozone?.lastUpdateTime).time}
                              </span>
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
                        {isActive && geozone?.isActive === (0 || 1) && (
                          <button
                            onClick={() => {
                              setCurrentGeozone(geozone);
                              setSupprimerGeozonePopup(true);
                            }}
                            className={`${
                              isActive
                                ? " bg-red-500 text-white"
                                : "text-red-600 border-[0.02rem] border-red-500 "
                            }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
                          >
                            {isActive &&
                              geozone?.isActive === (0 || 1) &&
                              "Supprimer"}

                            {(isActive || !isActive) &&
                              geozone?.isActive === 0 &&
                              "Activer"}

                            {!isActive &&
                              geozone?.isActive === 1 &&
                              "Désactiver"}
                          </button>
                        )}
                        <Link
                          onClick={() => {
                            setCurrentGeozone(geozone);
                            setAjouterGeofencePopup(true);
                            setIsEditingGeofence(true);
                          }}
                          to="/Groupe_vehicule_location?tab=localisation"
                          className="bg-gray-100 border border-gray-400 text-center w-[50%] md:w-full text-sm font-semibold rounded-lg py-1 px-4"
                        >
                          Modifier
                        </Link>

                        {/* {isActive && geozone?.isActive === (0 || 1) && (
                          <button
                            onClick={() => {
                              setCurrentGeozone(geozone);
                              setSupprimerGeozonePopup(true);
                            }}
                            className={`${
                              isActive
                                ? " bg-red-500 text-white"
                                : "text-red-600 border-[0.02rem] border-red-500 "
                            }   text-sm w-[50%] md:w-full font-semibold rounded-lg py-1 px-4`}
                          >
                            {isActive &&
                              geozone?.isActive === (0 || 1) &&
                              "Supprimer"}

                            {(isActive || !isActive) &&
                              geozone?.isActive === 0 &&
                              "Activer"}

                            {!isActive &&
                              geozone?.isActive === 1 &&
                              "Désactiver"}
                          </button>
                        )} */}
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="mt-[5rem] text-center mx-4 font-semibold text-gray-600">
                Pas de Geozone créer
              </p>
            )
          }
        </div>
      </div>

      {supprimerGeozonePopup && (
        <div className="fixed inset-0 z-10">
          <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
            {/* <!-- overlay --> */}
            <div className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"></div>

            {/* <!-- Modal --> */}
            <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
              <div className="w-full py-2 bg-white cursor-default pointer-events-auto ---dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                <div className="space-y-2 p-2">
                  <div className="p-4 space-y-2 text-center ---dark:text-white">
                    <h2
                      className="text-xl font-bold tracking-tight"
                      id="page-action.heading"
                    >
                      {isCurrentGeozoneActive ? "Supprimer" : "Désactiver"}
                    </h2>

                    <p className="text-gray-500">
                      Es-tu sûr de{" "}
                      {isCurrentGeozoneActive ? "Supprimer" : "Désactiver"} le
                      geozone ? ?
                    </p>
                    <p className="text-red-500 font-semibold">
                      {currentGeozone?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="border-t ---dark:border-gray-700 px-2"></div>

                  <div className="px-6 py-2">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                      <button
                        onClick={() => {
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 ---dark:bg-gray-800 ---dark:hover:bg-gray-700 ---dark:border-gray-600 ---dark:hover:border-gray-500 ---dark:text-gray-200 ---dark:focus:text-primary-400 ---dark:focus:border-primary-400 ---dark:focus:bg-gray-800"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">Annuler</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          supprimerOuModifierGeozone();
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">
                            {isCurrentGeozoneActive
                              ? "Supprimer"
                              : "Désactiver"}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionGeofences;
