import React, { useContext, useState } from "react";
import { IoEarth } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";

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
  } = useContext(DataContext);
  const [supprimerGeozonePopup, setSupprimerGeozonePopup] = useState(false);
  return (
    <div>
      <div className="px-4 pb-40">
        <h2
          onClick={() => {
            console.log(geofenceData);
          }}
          className="mt-[6rem] text-lg text-center font-bold "
        >
          Liste de tes Geozones
        </h2>
        <div className="flex justify-center mt-4">
          <Link
            to="/Groupe_vehicule_location?tab=localisation"
            onClick={() => {
              setAjouterGeofencePopup(true);
              setIsEditingGeofence(false);
              setCurrentGeozone();
            }}
            className="bg-green-100 text-green-900 font-semibold rounded-lg py-1 px-6"
          >
            Ajouter un nouveau Geozone
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
                  return (
                    <div
                      className="shadow-lg md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-2"
                      key={index}
                    >
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
                      <div className="flex  sm:max-w-[25rem] gap-3 mt-3 justify-between items-center ">
                        <Link
                          onClick={() => {
                            setCurrentGeozone(geozone);
                            setAjouterGeofencePopup(true);
                            setIsEditingGeofence(true);
                          }}
                          to="/Groupe_vehicule_location?tab=localisation"
                          className="bg-gray-100 w-full font-semibold rounded-lg py-1 px-4"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => {
                            setSupprimerGeozonePopup(true);
                          }}
                          className="bg-red-500 text-white w-full font-semibold rounded-lg py-1 px-4"
                        >
                          Supprimer
                        </button>
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
                      Supprimer
                    </h2>

                    <p className="text-gray-500">
                      Es-tu sûr de supprimer le geozone ? ?
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
                          setSupprimerGeozonePopup(false);
                        }}
                        className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset ---dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700"
                      >
                        <span className="flex items-center gap-1">
                          <span className="">Supprimer</span>
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
