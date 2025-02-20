import React, { useContext } from "react";
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
  } = useContext(DataContext);



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
                      key={index}
                      className="flex  gap-3 items-center-- shadow-lg rounded-lg px-4 py-2"
                    >
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
                        <div className="flex gap-3 mt-3 justify-between items-center ">
                          <Link
                            onClick={() => {
                              setCurrentGeozone(geozone);
                              setAjouterGeofencePopup(true);
                            }}
                            to="/Groupe_vehicule_location?tab=localisation"
                            className="bg-gray-100 w-full font-semibold rounded-lg py-1 px-4"
                          >
                            Modifier
                          </Link>
                          <button className="bg-red-500 text-white w-full font-semibold rounded-lg py-1 px-4">
                            Supprimer
                          </button>
                        </div>
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
    </div>
  );
}

export default GestionGeofences;
