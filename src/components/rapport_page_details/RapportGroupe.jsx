import React, { useContext, useState } from "react";

import { IoTimeOutline } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";

import { IoClose } from "react-icons/io5";
import { MdOutlineFullscreen } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { RiPinDistanceLine } from "react-icons/ri";
import { SlSpeedometer } from "react-icons/sl";
import MapComponent from "../location_vehicule/MapComponent";
import { DataContext } from "../../context/DataContext";
import VehiculeActiveAjourdhuiComponent from "../rapport_vehicule/VehiculeActiveAjourdhuiComponent";
import VehiculeNotActiveAjourdhuiComponent from "../rapport_vehicule/VehiculeNotActiveAjourdhuiComponent";
import VehiculeNotActifComponent from "../rapport_vehicule/VehiculeNotActifComponent";

function RapportGroupe({
  formattedDate, // Date formatée pour l'affichage
  currentdataFusionnee, // Liste des véhicules
  vehiculeActiveAjourdhui, // Véhicules actifs aujourd'hui
  vehiculeNotActiveAjourdhui, // Véhicules en stationnement aujourd'hui
  vehiculeNotActif, // Véhicules hors service
  earliestVehicle, // Premier véhicule en mouvement
  latestVehicle, // Dernier véhicule en mouvement
  selectUTC, // Option pour formater l'heure en UTC
  formatTimestampToTime, // Fonction pour formater le timestamp
  formatTimestampToTimeWithTimezone, // Fonction pour formater avec timezone
  result, // Résultats pour le temps d'activité
  result2, // Résultats pour les distances parcourues
  result3, // Résultats pour les arrêts
  result5, // Résultats pour la vitesse
  zoomPosition, // État pour la position zoomée de la carte
  setzoomPosition, // Fonctio
  activePeriods,
  movingTimes,
}) {
  const {
    loadingHistoriqueFilter,
    setShowListOption,
    vehiclueHistoriqueDetails,
    setVehiclueHistoriqueDetails,
    currentVehicule,
  } = useContext(DataContext); // const { currentVehicule } = useContext(DataContext);

  const [voirPlus, setvoirPlus] = useState(false);

  const formatTime = (hours, minutes, seconds) => {
    if (hours > 0 || minutes > 0 || seconds > 0) {
      return `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "m " : ""
      }${seconds > 0 ? seconds + "s" : ""}`;
    }
    return "0s";
  };

  // Trouver la date du rapport
  // Trouver la date du rapport
  const timestampInSecondsDebut =
    vehiculeActiveAjourdhui[0]?.vehiculeDetails[
      vehiculeActiveAjourdhui[0]?.vehiculeDetails.length - 1
    ]?.timestamp ||
    vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[
      vehiculeNotActiveAjourdhui[0]?.vehiculeDetails.length - 1
    ]?.timestamp ||
    vehiculeNotActif[0]?.vehiculeDetails[
      vehiculeNotActif[0]?.vehiculeDetails.length - 1
    ]?.timestamp;

  const dateObjectDebut = new Date(timestampInSecondsDebut * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourDebut = dateObjectDebut.getDate(); // Obtenir le jour
  const moisDebut = dateObjectDebut.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeDebut = dateObjectDebut.getFullYear(); // Obtenir l'année

  // Trouver la date du rapport
  const timestampInSecondsFin =
    vehiculeActiveAjourdhui[0]?.vehiculeDetails[0]?.timestamp ||
    vehiculeNotActiveAjourdhui[0]?.vehiculeDetails[0]?.timestamp ||
    vehiculeNotActif[0]?.vehiculeDetails[0]?.timestamp;

  const dateObjectFin = new Date(timestampInSecondsFin * 1000);

  // Récupérer le jour, le mois et l'année séparément
  const jourFin = dateObjectFin.getDate(); // Obtenir le jour
  const moisFin = dateObjectFin.toLocaleString("fr-FR", { month: "long" }); // Obtenir le mois en toutes lettres
  const anneeFin = dateObjectFin.getFullYear(); // Obtenir l'année

  const [showActiveVehicule, setshowActiveVehicule] = useState(true);
  const [showParkingVehicule, setshowParkingVehicule] = useState(true);
  const [showInactiveVehicule, setshowInactiveVehicule] = useState(true);
  const [voirVehiculeListePupup, setvoirVehiculeListePupup] = useState(false);
  const [defineVehiculeListePupup, setdefineVehiculeListePupup] =
    useState("tous");
  const [nothing, setnothing] = useState(false);
  function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const doNothing = () => {
    console.log("");
  };

  return (
    <>
      <div className=" px-4 pb-20 md:max-w-[80vw] w-full">
        {voirVehiculeListePupup && (
          <div className="fixed z-[9999999999] inset-0 px-2 flex justify-center items-center bg-black/50">
            <div className="bg-white rounded-lg pt-3 w-[97vw]  px-2">
              <div className="flex justify-end ">
                <IoClose
                  onClick={() => {
                    setvoirVehiculeListePupup(false);
                  }}
                  className="cursor-pointer text-3xl text-red-500"
                />
              </div>
              <div className="relative h-[80vh] pt-6 rounded-lg overflow-auto bg-white md:px-[10vw]">
                {defineVehiculeListePupup === "active" && (
                  <VehiculeActiveAjourdhuiComponent
                    showActiveVehicule={showActiveVehicule}
                    setshowActiveVehicule={setshowActiveVehicule}
                    vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={doNothing}
                    selectUTC={selectUTC}
                  />
                )}
                {/*  */}
                {defineVehiculeListePupup === "notactive" && (
                  <VehiculeNotActiveAjourdhuiComponent
                    showParkingVehicule={showParkingVehicule}
                    setshowParkingVehicule={setshowParkingVehicule}
                    vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={doNothing}
                    selectUTC={selectUTC}
                  />
                )}
                {/* ----------------------------------- */}
                {defineVehiculeListePupup === "hors_service" && (
                  <VehiculeNotActifComponent
                    showInactiveVehicule={showInactiveVehicule}
                    setshowInactiveVehicule={setshowInactiveVehicule}
                    vehiculeNotActif={vehiculeNotActif}
                    setshowRapportPupup={setnothing}
                    formatTimestampToDate={formatTimestampToDate}
                    formatTimestampToTime={formatTimestampToTime}
                    handleClick={doNothing}
                  />
                )}
                {defineVehiculeListePupup === "tous" && (
                  <div>
                    <VehiculeActiveAjourdhuiComponent
                      showActiveVehicule={showActiveVehicule}
                      setshowActiveVehicule={setshowActiveVehicule}
                      vehiculeActiveAjourdhui={vehiculeActiveAjourdhui}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={doNothing}
                      selectUTC={selectUTC}
                    />
                    <VehiculeNotActiveAjourdhuiComponent
                      showParkingVehicule={showParkingVehicule}
                      setshowParkingVehicule={setshowParkingVehicule}
                      vehiculeNotActiveAjourdhui={vehiculeNotActiveAjourdhui}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={doNothing}
                      selectUTC={selectUTC}
                    />
                    <VehiculeNotActifComponent
                      showInactiveVehicule={showInactiveVehicule}
                      setshowInactiveVehicule={setshowInactiveVehicule}
                      vehiculeNotActif={vehiculeNotActif}
                      setshowRapportPupup={setnothing}
                      formatTimestampToDate={formatTimestampToDate}
                      formatTimestampToTime={formatTimestampToTime}
                      handleClick={doNothing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* <RapportOptions /> */}

        <h1 className="text-center mb-10 font-semibold text-xl my-10 dark:text-gray-300">
          Rapport détaillé en groupe
        </h1>
        <div className="shadow-md dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <IoMdInformationCircleOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur les véhicules
            </h2>
          </div>

          <div>
            <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
              <p>
                Date de Recherche :
                <span className="font-bold dark:text-orange-500 text-gray-900 pl-3">
                  {
                    // true ||
                    jourDebut === jourFin &&
                    moisDebut === moisFin &&
                    anneeDebut === anneeFin ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          Le {jourDebut || ""} {moisDebut || ""}{" "}
                          {anneeDebut || ""}
                        </span>{" "}
                      </span>
                    ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    )
                  }
                </span>
              </p>

              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}

              {/* <p>
                Heure du Recherche :
                <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                  De{" "}
                  <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold- text-gray-950">
                    {selectUTC
                      ? formatTimestampToTimeWithTimezone(
                          currentVehicule?.vehiculeDetails[
                            currentVehicule?.vehiculeDetails?.length - 1
                          ]?.timestamp,
                          selectUTC
                        )
                      : formatTimestampToTime(
                          currentVehicule?.vehiculeDetails?.[
                            currentVehicule?.vehiculeDetails?.length - 1
                          ]?.timestamp
                        )}
                  </span>{" "}
                  a{" "}
                  <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold- text-gray-950">
                    {selectUTC
                      ? formatTimestampToTimeWithTimezone(
                          currentVehicule?.vehiculeDetails[0]?.timestamp,
                          selectUTC
                        )
                      : formatTimestampToTime(
                          currentVehicule?.vehiculeDetails?.[0]?.timestamp
                        )}
                  </span>{" "}
                </span>
              </p> */}
              <div className="flex justify-between items-center pr-3">
                <p>
                  Nombre total de véhicules :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {currentdataFusionnee?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setdefineVehiculeListePupup("tous");
                  }}
                  className="text-orange-500 cursor-pointer"
                >
                  voir
                </p>
              </div>
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicules actifs aujourd'hui :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeActiveAjourdhui?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setdefineVehiculeListePupup("active");
                  }}
                  className="text-orange-500 cursor-pointer"
                >
                  voir
                </p>
              </div>
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule en stationnement :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeNotActiveAjourdhui?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setdefineVehiculeListePupup("notactive");
                  }}
                  className="text-orange-500 cursor-pointer"
                >
                  voir
                </p>
              </div>
              <div className="flex justify-between items-center pr-3">
                <p>
                  Véhicule hors service :{" "}
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                    {vehiculeNotActif?.length || "0"}
                  </span>
                </p>
                <p
                  onClick={() => {
                    setvoirVehiculeListePupup(true);
                    setdefineVehiculeListePupup("hors_service");
                  }}
                  className="text-orange-500 cursor-pointer"
                >
                  voir
                </p>
              </div>

              <div
                className={`${
                  voirPlus ? "max-h-[30rem]" : "max-h-[0rem]"
                } transition-all overflow-hidden `}
              >
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}

                <div className="">
                  {earliestVehicle?.displayName != latestVehicle?.displayName ||
                  earliestVehicle?.description != latestVehicle?.description ? (
                    <div className="flex flex-col gap-3">
                      <p>
                        Véhicule en mouvement en 1er : <br />
                        <span className="font-bold dark:text-orange-500 text-gray-700 pl-5 pr-2">
                          {earliestVehicle?.displayName ||
                            earliestVehicle?.description ||
                            "Pas de véhicule"}
                        </span>
                        <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                          ({" "}
                          {earliestVehicle?.vehiculeDetails[
                            earliestVehicle?.vehiculeDetails.length - 1
                          ].timestamp
                            ? selectUTC
                              ? formatTimestampToTimeWithTimezone(
                                  earliestVehicle?.vehiculeDetails[
                                    earliestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp,
                                  selectUTC
                                )
                              : formatTimestampToTime(
                                  earliestVehicle?.vehiculeDetails[
                                    earliestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp
                                )
                            : "---"}{" "}
                          )
                        </span>
                      </p>
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}
                      {/*  */}

                      <p>
                        Véhicule en mouvement en Dernier : <br />
                        {/* <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      {latestVehicle?.displayName ||
                        latestVehicle?.description ||
                        "Pas de véhicule"}
                    </span> */}
                        <span className="font-bold dark:text-orange-500 text-gray-700 pl-5 pr-2">
                          {latestVehicle?.displayName ||
                            latestVehicle?.description ||
                            "Pas de véhicule"}
                        </span>
                        <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                          ({" "}
                          {latestVehicle?.vehiculeDetails[
                            latestVehicle?.vehiculeDetails.length - 1
                          ].timestamp
                            ? selectUTC
                              ? formatTimestampToTimeWithTimezone(
                                  latestVehicle?.vehiculeDetails[
                                    latestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp,
                                  selectUTC
                                )
                              : formatTimestampToTime(
                                  latestVehicle?.vehiculeDetails[
                                    latestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp
                                )
                            : "---"}{" "}
                          )
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        Véhicule en mouvement en 1er :<br />
                        <span className="font-bold dark:text-orange-500 text-gray-700 pl-5 pr-2">
                          {earliestVehicle?.displayName ||
                            earliestVehicle?.description ||
                            "Pas de véhicule"}
                        </span>
                        {(earliestVehicle?.displayName && " a ") ||
                          (earliestVehicle?.description && " a ")}
                        <span className="font-bold- dark:text-orange-500 text-gray-700 pl-3">
                          {earliestVehicle?.vehiculeDetails[
                            earliestVehicle?.vehiculeDetails.length - 1
                          ].timestamp
                            ? selectUTC
                              ? formatTimestampToTimeWithTimezone(
                                  earliestVehicle?.vehiculeDetails[
                                    earliestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp,
                                  selectUTC
                                )
                              : formatTimestampToTime(
                                  earliestVehicle?.vehiculeDetails[
                                    earliestVehicle?.vehiculeDetails.length - 1
                                  ].timestamp
                                )
                            : " "}{" "}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p className="mt-4--">
                  Véhicule en mouvement le plus longtemps :
                  <br />
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {result.vehicleWithLongestMoving || "Pas de vehicule"}{" "}
                  </span>
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}
                <p className="mt-4--">
                  Véhicule avec le plus grand arrêt:
                  <br />
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {result.vehicleWithLongestStop || "Pas de vehicule"} ({" "}
                    {formatTime(
                      result?.longestStopTime.hours,
                      result?.longestStopTime.minutes,
                      result?.longestStopTime.seconds
                    )}{" "}
                    )
                  </span>
                </p>

                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}

                <p>
                  Véhicule ayant parcouru la plus grande distance : <br />
                  {result2?.maxDistanceVehicle ? (
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                      {result2?.maxDistanceVehicle}, ({" "}
                      {result2?.maxDistance.toFixed(2)}, km )
                    </span>
                  ) : (
                    <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                      Pas de Véhicule en mouvement
                    </span>
                  )}
                </p>
                {/*  */}
                {/*  */}
                {/*  */}
                <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
                {/*  */}
                {/*  */}
                {/*  */}

                <p>
                  Véhicule avec la vitesse maximale: <br />
                  <span className="font-bold dark:text-orange-500 text-gray-700 pl-5">
                    {result5?.maxSpeedVehicle?.displayName ||
                      result5?.maxSpeedVehicle?.description ||
                      "Pas de vehicule"}{" "}
                  </span>
                  {result5?.maxSpeedVehicle?.displayName ||
                  result5?.maxSpeedVehicle?.description ? (
                    <span>
                      {/* avec une vitesse de : */}
                      <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                        ( {result5?.maxSpeedVehicle.maxSpeed.toFixed(2)} Km/h )
                      </span>
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}
              <div
                onClick={() => {
                  setvoirPlus(!voirPlus);
                }}
                className="text-orange-600 cursor-pointer"
              >
                {voirPlus ? "Vois moins" : "Vois plus"}
              </div>

              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
              {/*  */}
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="shadow-md mt-10 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4  bg-orange-50 p-2 rounded-md flex-- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Informations sur le trajet dues vehicules
            </h2>
          </div>

          <div>
            <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300">
              <p>
                Date de Recherche :{/* <br className="sm:hidden" /> */}
                <span className="font-bold dark:text-orange-500 text-gray-900 pl-5">
                  {
                    // true ||
                    jourDebut === jourFin &&
                    moisDebut === moisFin &&
                    anneeDebut === anneeFin ? (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          Le {jourDebut || ""} {moisDebut || ""}{" "}
                          {anneeDebut || ""}
                        </span>{" "}
                      </span>
                    ) : (
                      <span className="text-[.85rem]-- sm:text-sm md:text-[1rem]  lg:text-lg--">
                        Du{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          {jourDebut} {moisDebut === moisFin ? "" : moisDebut}{" "}
                          {anneeDebut === anneeFin ? "" : anneeDebut}
                        </span>{" "}
                        au{" "}
                        <span className="dark:text-orange-400 dark:font-normal font-semibold- text-gray-950">
                          {jourFin} {moisFin} {anneeFin}
                        </span>
                      </span>
                    )
                  }
                </span>
              </p>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}
              {/* <p>
                Heure du Recherche :
                <span className="font-normal dark:text-orange-500 text-gray-700 pl-3">
                  De{" "}
                  <span className="dark:text-orange-400 mx-1 dark:font-normal font-semibold- text-gray-950">
                    {selectUTC
                      ? formatTimestampToTimeWithTimezone(
                          currentVehicule?.vehiculeDetails[
                            currentVehicule?.vehiculeDetails?.length - 1
                          ]?.timestamp,
                          selectUTC
                        )
                      : formatTimestampToTime(
                          currentVehicule?.vehiculeDetails?.[
                            currentVehicule?.vehiculeDetails?.length - 1
                          ]?.timestamp
                        )}
                  </span>{" "}
                  a{" "}
                  <span className="dark:text-orange-400 ml-1 dark:font-normal font-semibold- text-gray-950">
                    {selectUTC
                      ? formatTimestampToTimeWithTimezone(
                          currentVehicule?.vehiculeDetails[0]?.timestamp,
                          selectUTC
                        )
                      : formatTimestampToTime(
                          currentVehicule?.vehiculeDetails?.[0]?.timestamp
                        )}
                  </span>{" "}
                </span>
              </p> */}
              <p>
                Temps d'activité total :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {formatTime(
                    result?.totalMovingTime.hours,
                    result?.totalMovingTime.minutes,
                    result?.totalMovingTime.seconds
                  )}
                </span>
              </p>
              <p>
                Duree des arrêt lors du deplacement :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result?.totalStopTime.hours}h {result?.totalStopTime.minutes}
                  m {result?.totalStopTime.seconds}m{" "} */}
                  {formatTime(
                    result?.totalStopTime.hours,
                    result?.totalStopTime.minutes,
                    result?.totalStopTime.seconds
                  )}
                </span>
              </p>
              <p>
                Duree de L'arrêt le plus long :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {/* {result?.longestStopTime.hours}h{" "}
                  {result?.longestStopTime.minutes}m{" "}
                  {result?.longestStopTime.seconds}m{" "} */}
                  {formatTime(
                    result?.longestStopTime.hours,
                    result?.longestStopTime.minutes,
                    result?.longestStopTime.seconds
                  )}
                </span>
              </p>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}
              <p>
                Distance totale parcourue:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {result2?.totalDistanceAllVehicles.toFixed(2) || "0"} km{" "}
                </span>
              </p>
              <p>
                Nombre total d’arrêts :
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {result3.totalStopsAllVehicles}
                </span>
              </p>
              {/*  */}
              {/*  */}
              {/*  */}
              <div className="border-b my-2 border-orange-400/50 dark:border-gray-700" />
              {/*  */}
              {/*  */}
              {/*  */}
              <p>
                Vitesse minimale:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {result5?.globalStats.minSpeed.toFixed(2) || "---"} Km/h
                </span>
              </p>{" "}
              <p>
                Vitesse maximale:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {result5?.globalStats.maxSpeed.toFixed(2) || "---"} Km/h Km/h
                </span>
              </p>
              <p>
                Vitesse moyenne:
                <span className="font-bold dark:text-orange-500 text-gray-700 pl-3">
                  {result5?.globalStats.averageSpeed.toFixed(2) || "---"} Km/h
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* <div className="shadow-md mt-4 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <IoTimeOutline className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Temps
            </h2>
          </div>

          <div>
            <div className="text-gray-700 flex flex-col gap-2 dark:text-gray-300"></div>
          </div>
        </div>
        <div className="shadow-md mt-4  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <RiPinDistanceLine className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Distance
            </h2>
          </div>

          <div>
            <div className="text-gray-600 flex flex-col gap-2 dark:text-gray-300"></div>
          </div>
        </div>
        <div className="shadow-md mt-4  dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900 py-4  bg-orange-50 p-2 rounded-md flex--- items-start gap-4">
          <div className="flex gap-4 items-center border-b border-orange-600/30 dark:border-gray-600 pb-2 mb-3">
            <SlSpeedometer className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
            <h2 className="font-semibold dark:text-orange-50 text-orange-900">
              Vitesse
            </h2>
          </div>

          <div>
            <div className="text-gray-600 flex flex-col gap-2 dark:text-gray-300"></div>
          </div>
        </div> */}

        <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900  bg-orange-50 p-2 rounded-md flex items-center gap-4">
          <MdLocationPin className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
          <h2 className="font-semibold dark:text-orange-50 text-orange-900">
            Position des véhicules{" "}
          </h2>
        </div>

        {zoomPosition ? (
          <div className="fixed inset-0 z-[9999999999999999999999] bg-black/50">
            <div className="relative  h-[100vh]  rounded-lg mt-3-- overflow-hidden">
              <button
                className="absolute z-[999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setzoomPosition(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-red-600 shadow-xl">
                  <IoClose className="text-white text-[1.52rem]" />
                </div>
              </button>
              <div className=" -translate-y-[10rem]---">
                <MapComponent />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[40vh] md:h-[60vh] rounded-lg mt-3 overflow-hidden">
            <button
              className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
              // onClick={centerOnFirstMarker}
              onClick={() => {
                setzoomPosition(true);
              }}
            >
              <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                <MdOutlineFullscreen className="text-orange-500 text-[2rem]" />
              </div>
            </button>
            <div className=" -translate-y-[10rem]">
              <MapComponent />
            </div>
          </div>
        )}

        {/* zoomPosition */}

        <div className="shadow-md mt-20  py-3 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900  bg-orange-50 p-2 rounded-md flex items-center gap-4">
          <BsTable className="min-w-[2rem] text-[1.82rem] text-orange-400 " />
          <h2 className="font-semibold dark:text-orange-50 text-orange-900">
            Tableau récapitulatif{" "}
          </h2>
        </div>

        <div className="w-full mt-4  overflow-auto">
          <table className="overflow-auto w-full text-left dark:bg-gray-800 dark:text-gray-200">
            <thead>
              <tr className="bg-orange-50 text-gray-700 border-- dark:bg-gray-900 dark:text-gray-100">
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[17rem]">
                  Véhicule
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Heure de départ
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Heure d'arrivée
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Vitesse moyenne
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Vitesse maximale
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Distance totale
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Nombre d'arrêts
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[10rem]">
                  Temps actif
                </th>
                <th className="border dark:border-gray-600 py-3 px-2 min-w-[30rem]">
                  Adresse actuelle
                </th>
              </tr>
            </thead>
            <tbody>
              {currentdataFusionnee?.map((vehicule, index) => (
                <tr key={index} className="border dark:border-gray-600">
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {vehicule?.displayName || vehicule?.description || "---"}
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {activePeriods[index]?.startTime
                      ? activePeriods[index].startTime
                      : "---"}

                    {/* {activePeriods[index]?.startTime
                        ? activePeriods[index].startTime.toLocaleTimeString()
                        : "---"} */}
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {activePeriods[index]?.endTime
                      ? activePeriods[index].endTime
                      : "---"}
                  </td>
                  <td
                    onClick={() => {
                      console.log(vehicule.vehiculeDetails[0]?.address);
                    }}
                    className="border py-3 px-2 dark:border-gray-600"
                  >
                    {Object.entries(result5.statsByVehicle)[
                      index
                    ][1].averageSpeed.toFixed(2)}{" "}
                    km/h
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {Object.entries(result5.statsByVehicle)[
                      index
                    ][1].maxSpeed.toFixed(2)}{" "}
                    km/h
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {Object.entries(result2.distancesByVehicle)[
                      index
                    ][1].toFixed(2)}{" "}
                    km
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {Object.entries(result3.stopsByVehicle)[index][1]} arrêts
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {/* {movingTimes[index].totalMovingDuration.hours}h{" "}
                    {movingTimes[index].totalMovingDuration.minutes}m{" "}
                    {movingTimes[index].totalMovingDuration.seconds}s */}

                    {formatTime(
                      movingTimes[index].totalMovingDuration.hours,
                      movingTimes[index].totalMovingDuration.minutes,
                      movingTimes[index].totalMovingDuration.seconds
                    )}
                  </td>
                  <td className="border py-3 px-2 dark:border-gray-600">
                    {vehicule.vehiculeDetails[0]?.backupAddress ||
                      vehicule.vehiculeDetails[0]?.address ||
                      "---"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default RapportGroupe;
