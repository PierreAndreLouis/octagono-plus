import React, { useContext, useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { MdLocationPin, MdDateRange } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { DataContext } from "../../context/DataContext";
import { Tooltip } from "@mui/material";
import MapComponent from "../location_vehicule/MapComponent";
import { MdOutlineFullscreen } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function HistoriqueMainComponent({
  currentVehicule,
  loadingHistoriqueFilter,
  vehiclueHistoriqueDetails,
  appliedCheckboxes,
  setShowListOption,
  formatTimestampToDate,
  formatTimestampToTime,
  // selectUTC,
}) {
  const {
    FormatDateHeure,
    chooseHistoriqueLongitude,
    setchooseHistoriqueLongitude,
    chooseHistoriqueLatitude,
    setchooseHistoriqueLatitude,
    tab,
    histiriqueSelectedLocationIndex,
    sethistiriqueSelectedLocationIndex,
    setSelectedVehicle,
    selectUTC,
    currentdataFusionnee,
  } = useContext(DataContext);
  const targetDeviceID = "864893039477131";

  const vehicle = currentdataFusionnee.find(
    (vehicle) => vehicle.deviceID === targetDeviceID
  );

  if (vehicle) {
    console.log("Véhicule trouvé :", vehicle);
    console.log("VéhiculeDetails trouvé :", vehicle.vehiculeDetails);
    console.log(
      "VéhiculeDetails Length trouvé :",
      vehicle.vehiculeDetails.length
    );
  } else {
    console.log("Aucun véhicule trouvé avec ce deviceID.");
  }

  function convertToTimezone(timestamp, offset) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const [sign, hours, minutes] = offset
      .match(/([+-])(\d{2}):(\d{2})/)
      .slice(1);
    const totalOffsetMinutes =
      (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);

    date.setMinutes(date.getMinutes() + totalOffsetMinutes); // Appliquer le décalage
    return date;
  }

  function formatTimestampToDateWithTimezone(timestamp, offset) {
    const date = convertToTimezone(timestamp, offset);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTimestampToTimeWithTimezone(timestamp, offset) {}

  const [mapType, setMapType] = useState("streets");
  const [voirPositionSurCarte, setvoirPositionSurCarte] = useState(false);

  return (
    <>
      <div>
        {voirPositionSurCarte && (
          <div className="z-20 fixed bg-black/50 inset-0 pt-20 px-4">
            <div className="relative    h-[80vh] min-w-[90vw] my-20 rounded-lg mt-3 overflow-hidden">
              <button
                className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
                // onClick={centerOnFirstMarker}
                onClick={() => {
                  setvoirPositionSurCarte(false);
                }}
              >
                <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
                  <IoClose className="text-red-500 text-[1.62rem]" />
                </div>
              </button>

              <div className=" -translate-y-[10rem]">
                <MapComponent mapType={mapType} />
              </div>
            </div>
          </div>
        )}
        <div className="pb-7 md:pb-0 md:pt-7 md:w-full text-center">
          <h2
            onClick={() => {
              // console.log("Véhicule trouvé :", vehicle);
              // console.log("VéhiculeDetails trouvé :", vehicle.vehiculeDetails);
            }}
            className="text-xl md:text-4xl md:mb-4 text-orange-600"
          >
            Historique{" "}
            {/* <span className="text-sm">
              {currentVehicule?.vehiculeDetails.length}
            </span> */}
          </h2>
          <h2 className="text-gray-800 mb-10 dark:text-gray-50 font-semibold text-lg md:text-xl mb-2-- ">
            {currentVehicule?.description || "Pas de véhicule sélectionné"}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {loadingHistoriqueFilter ? (
            <p className="text-center">Chargement des données...</p>
          ) : vehiclueHistoriqueDetails.length > 0 ? (
            (() => {
              const filteredVehicles = vehiclueHistoriqueDetails.filter(
                (vehicle) =>
                  (appliedCheckboxes.en_marche && vehicle.speedKPH > 20) ||
                  (appliedCheckboxes.en_ralenti &&
                    vehicle.speedKPH >= 1 &&
                    vehicle.speedKPH <= 20) ||
                  (appliedCheckboxes.en_arret && vehicle.speedKPH < 1)
              );

              return filteredVehicles.length > 0 ? (
                filteredVehicles
                  .slice() // Créer une copie pour éviter de modifier la liste originale
                  .reverse()
                  .map((vehicle, reversedIndex) => {
                    const index = filteredVehicles.length - 1 - reversedIndex; // Calculer l'index original
                    const numero = filteredVehicles.length - index;

                    const speed = vehicle.speedKPH || 0;

                    // Définir les couleurs en fonction de la vitesse
                    let main_text_color,
                      lite_bg_color,
                      active_bg_color,
                      imgClass,
                      activeTextColor,
                      statut,
                      vitess_img;
                    if (speed < 1) {
                      main_text_color = "text-red-900 dark:text-red-300";
                      statut = "En stationnement";
                      lite_bg_color =
                        "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-red-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-red-900 dark:text-red-200";
                      active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
                      vitess_img = "img/cars/orange_vitess.png";
                      imgClass = "w-14 sm:w-16 md:w-20";
                    } else if (speed >= 1 && speed <= 20) {
                      main_text_color = "text-[#555b03] dark:text-yellow-300";
                      statut = "En mouvement lent";
                      lite_bg_color =
                        "bg-[#ffff001b] dark:bg-gray-900/40 dark:shadow-yellow-300/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-yellow-400/80  shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-[#555b03] dark:text-yellow-100";
                      active_bg_color =
                        "bg-yellow-400/20 dark:bg-yellow-600/20";
                      vitess_img = "img/cars/yellow_vitess.png";
                      imgClass = "w-12 sm:w-14 md:w-20";
                    } else {
                      main_text_color = "text-green-700 dark:text-green-400";
                      statut = "En mouvement rapide";
                      lite_bg_color =
                        "bg-green-100/50 dark:bg-gray-900/40 dark:shadow-green-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
                      activeTextColor = "text-green-800 dark:text-green-200";
                      active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
                      vitess_img = "img/cars/green_vitess.png";
                      imgClass = "w-12 sm:w-14 md:w-20";
                    }

                    const timeStampGMT = (
                      parseInt(vehicle.timestamp, 10) +
                      (selectUTC + 5) * 60 * 60
                    ).toString();

                    const FormatDateHeureTimestamp = FormatDateHeure(
                      vehicle.timestamp
                      // timeStampGMT
                    );

                    // const FormatDateHeureTimestamp =
                    //   FormatDateHeure(timeStampData);
                    return (
                      <Tooltip
                        title="Voir cette position sur la carte

                    "
                        PopperProps={{
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -10], // Décalage horizontal et vertical
                              },
                            },
                            // {
                            //   name: "zIndex",
                            //   enabled: true,
                            //   phase: "write",
                            //   fn: ({ state }) => {
                            //     state.styles.popper.zIndex = 1; // Niveau très élevé
                            //   },
                            // },
                          ],
                        }}
                      >
                        <div
                          onClick={() => {
                            setSelectedVehicle(currentVehicule?.deviceID);

                            sethistiriqueSelectedLocationIndex(index);

                            setvoirPositionSurCarte(true);
                            console.log(vehicle);
                          }}
                          key={index}
                          className={`${lite_bg_color} shadow-md relative rounded-lg p-3`}
                        >
                          <div
                            onClick={() => {
                              console.log(vehicle.timestamp);
                              console.log(vehicle);
                            }}
                            className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-3 pb-3 font-bold text-md `}
                          >
                            {/* {index + 1} */}
                            {numero}
                          </div>
                          <div className="flex relative gap-3 md:py-4--">
                            <div className="flex  flex-col items-center md:min-w-32">
                              <div className={`${imgClass} mb-2`}>
                                <img src={vitess_img} alt="" />
                              </div>
                              <h2
                                className={`${main_text_color} sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
                              >
                                {parseFloat(speed).toFixed(0)}
                              </h2>
                              <h2
                                className={`${main_text_color} text-[1rem] sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
                              >
                                Km/h
                              </h2>
                            </div>
                            <div className=" flex justify-center items-center">
                              <div className="">
                                <div className="flex mb-2 gap-4 text-gray-600 dark:text-gray-200 text-md">
                                  <div className="flex gap-3 items-center">
                                    <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300" />
                                    <h3 className="text-sm sm:text-sm md:text-md">
                                      {/* {formatTimestampToDate(vehicle.timestamp)} */}
                                      {vehicle.timestamp
                                        ? FormatDateHeureTimestamp.date
                                        : // ? selectUTC
                                          //   ? formatTimestampToDateWithTimezone(
                                          //       vehicle.timestamp,
                                          //       selectUTC
                                          //     )
                                          //   : formatTimestampToDate(vehicle.timestamp)
                                          "Pas de date disponible"}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <IoMdTime
                                      id="time-icon"
                                      className="text-gray-500/80 text-xl dark:text-gray-300"
                                    />
                                    <h3 className="text-sm sm:text-sm md:text-md">
                                      {/* {formatTimestampToTime(vehicle.timestamp)} */}
                                      {/* {selectUTC
                                    ? formatTimestampToTimeWithTimezone(
                                        vehicle.timestamp,
                                        selectUTC
                                      )
                                    : formatTimestampToTime(vehicle.timestamp)} */}
                                      {FormatDateHeureTimestamp?.time}
                                    </h3>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <div>
                                    <FaCar className="text-gray-500/80 dark:text-gray-300" />
                                  </div>
                                  <span
                                    className={` ${active_bg_color} ml-1 ${activeTextColor} pb-[.2rem] px-2 py-0 text-sm rounded-md `}
                                  >
                                    {statut}
                                  </span>
                                </div>
                                <div className="flex gap-1 ">
                                  <div>
                                    <MdLocationPin className="text-xl dark:text-gray-300 text-gray-500/80 -translate-x-0.5 mt-3" />
                                  </div>
                                  <p className="text-md flex text-gray-600 dark:text-gray-300 mt-2 md:text-lg">
                                    {vehicle?.backupAddress ||
                                      vehicle.address ||
                                      "Adresse non disponible"}{" "}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  })
              ) : (
                <p className="text-center">
                  Pas de données disponibles{" "}
                  <span className=" text-orange-600">pour le filtre</span>
                </p>
              );
            })()
          ) : (
            <p className="text-center dark:text-gray-50">
              Aucune donnée disponible
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default HistoriqueMainComponent;

// import React, { useContext, useEffect, useState } from "react";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { IoMdTime } from "react-icons/io";
// // import { DataContext } from "../../context/DataContext";
// import { MdLocationPin, MdDateRange } from "react-icons/md";
// import { FaCar } from "react-icons/fa";
// import { DataContext } from "../../context/DataContext";
// import { Tooltip } from "@mui/material";
// import MapComponent from "../location_vehicule/MapComponent";
// import { MdOutlineFullscreen } from "react-icons/md";
// import { IoClose } from "react-icons/io5";

// function HistoriqueMainComponent({
//   currentVehicule,
//   loadingHistoriqueFilter,
//   vehiclueHistoriqueDetails,
//   appliedCheckboxes,
//   setShowListOption,
//   formatTimestampToDate,
//   formatTimestampToTime,
//   // selectUTC,
// }) {
//   const {
//     FormatDateHeure,
//     chooseHistoriqueLongitude,
//     setchooseHistoriqueLongitude,
//     chooseHistoriqueLatitude,
//     setchooseHistoriqueLatitude,
//     tab,
//     histiriqueSelectedLocationIndex,
//     sethistiriqueSelectedLocationIndex,
//     setSelectedVehicle,
//     selectUTC,
//   } = useContext(DataContext);
//   function convertToTimezone(timestamp, offset) {
//     const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
//     const [sign, hours, minutes] = offset
//       .match(/([+-])(\d{2}):(\d{2})/)
//       .slice(1);
//     const totalOffsetMinutes =
//       (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);

//     date.setMinutes(date.getMinutes() + totalOffsetMinutes); // Appliquer le décalage
//     return date;
//   }

//   function formatTimestampToDateWithTimezone(timestamp, offset) {
//     const date = convertToTimezone(timestamp, offset);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   function formatTimestampToTimeWithTimezone(timestamp, offset) {}

//   const [mapType, setMapType] = useState("streets");
//   const [voirPositionSurCarte, setvoirPositionSurCarte] = useState(false);

//   function convertTimestampToLocalDateTime(timestamp, timeZone = "UTC") {
//     // Convertir le timestamp en millisecondes
//     const date = new Date(timestamp * 1000);

//     // Options pour afficher date et heure
//     const options = {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       timeZone: timeZone,
//     };

//     // Retourner une chaîne formatée selon le fuseau horaire
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   }

//   // const timestamp = 1737604988;
//   // const localDateTime = convertTimestampToLocalDateTime(
//   //   timestamp,
//   //   "America/New_York"
//   // );
//   // console.log("Conversion timestamp en localDate: ", localDateTime);

//   //   let timestamp = parseInt(node.InnerText, 10);
//   // let dt = new Date(timestamp * 1000);
//   // dt.setHours(dt.getHours() + 1);

//   function convertTimestampToGMT(timestamp, gmtOffset) {
//     // Convertir le timestamp en millisecondes
//     const date = new Date(timestamp * 1000);

//     // Calculer le décalage horaire manuellement
//     const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
//     const localTime = new Date(utcTime + gmtOffset * 3600000);

//     return localTime.toISOString().replace("T", " ").split(".")[0]; // Formater en YYYY-MM-DD HH:mm:ss
//   }

//   const timestamp = 1737604988;

//   // console.log("GMT-5:", convertTimestampToGMT(timestamp, -5));
//   // console.log("GMT-6:", convertTimestampToGMT(timestamp, -6));
//   // console.log("GMT-4:", convertTimestampToGMT(timestamp, -4));

//   return (
//     <>
//       <div>
//         {voirPositionSurCarte && (
//           <div className="z-20 fixed bg-black/50 inset-0 pt-20 px-4">
//             <div className="relative    h-[80vh] min-w-[90vw] my-20 rounded-lg mt-3 overflow-hidden">
//               <button
//                 className="absolute shadow-lg shadow-gray-400 rounded-full z-[999] top-[1rem] right-[1rem]"
//                 // onClick={centerOnFirstMarker}
//                 onClick={() => {
//                   setvoirPositionSurCarte(false);
//                 }}
//               >
//                 <div className="flex justify-center items-center min-w-10 min-h-10 rounded-full bg-white shadow-xl">
//                   <IoClose className="text-red-500 text-[1.62rem]" />
//                 </div>
//               </button>

//               <div className=" -translate-y-[10rem]">
//                 <MapComponent mapType={mapType} />
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="pb-7 md:pb-0 md:pt-7 md:w-full text-center">
//           <h2
//             onClick={() => {
//               console.log(
//                 "selectUTC ==>",
//                 isNaN(Number(selectUTC)) ? -5 : Number(selectUTC)
//               );
//             }}
//             className="text-xl md:text-4xl md:mb-4 text-orange-600"
//           >
//             Historique
//           </h2>
//           <h2 className="text-gray-800 mb-10 dark:text-gray-50 font-semibold text-lg md:text-xl mb-2-- ">
//             {currentVehicule?.description || "Pas de véhicule sélectionné"}
//           </h2>
//         </div>

//         <div className="flex flex-col gap-4">
//           {loadingHistoriqueFilter ? (
//             <p className="text-center">Chargement des données...</p>
//           ) : vehiclueHistoriqueDetails.length > 0 ? (
//             (() => {
//               const filteredVehicles = vehiclueHistoriqueDetails.filter(
//                 (vehicle) =>
//                   (appliedCheckboxes.en_marche && vehicle.speedKPH > 20) ||
//                   (appliedCheckboxes.en_ralenti &&
//                     vehicle.speedKPH >= 1 &&
//                     vehicle.speedKPH <= 20) ||
//                   (appliedCheckboxes.en_arret && vehicle.speedKPH < 1)
//               );

//               return filteredVehicles.length > 0 ? (
//                 filteredVehicles
//                   .slice() // Créer une copie pour éviter de modifier la liste originale
//                   .reverse()
//                   .map((vehicle, reversedIndex) => {
//                     const index = filteredVehicles.length - 1 - reversedIndex; // Calculer l'index original
//                     const numero = filteredVehicles.length - index;

//                     const speed = vehicle.speedKPH || 0;

//                     // Définir les couleurs en fonction de la vitesse
//                     let main_text_color,
//                       lite_bg_color,
//                       active_bg_color,
//                       imgClass,
//                       activeTextColor,
//                       statut,
//                       vitess_img;
//                     if (speed < 1) {
//                       main_text_color = "text-red-900 dark:text-red-300";
//                       statut = "En stationnement";
//                       lite_bg_color =
//                         "bg-red-100/40 dark:bg-gray-900/40 dark:shadow-red-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-red-600/80 shadow-lg shadow-gray-950/20";
//                       activeTextColor = "text-red-900 dark:text-red-200";
//                       active_bg_color = "bg-red-200/50 dark:bg-red-600/50";
//                       vitess_img = "img/cars/orange_vitess.png";
//                       imgClass = "w-14 sm:w-16 md:w-20";
//                     } else if (speed >= 1 && speed <= 20) {
//                       main_text_color = "text-[#555b03] dark:text-yellow-300";
//                       statut = "En mouvement lent";
//                       lite_bg_color =
//                         "bg-[#ffff001b] dark:bg-gray-900/40 dark:shadow-yellow-300/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-yellow-400/80  shadow-lg shadow-gray-950/20";
//                       activeTextColor = "text-[#555b03] dark:text-yellow-100";
//                       active_bg_color =
//                         "bg-yellow-400/20 dark:bg-yellow-600/20";
//                       vitess_img = "img/cars/yellow_vitess.png";
//                       imgClass = "w-12 sm:w-14 md:w-20";
//                     } else {
//                       main_text_color = "text-green-700 dark:text-green-400";
//                       statut = "En mouvement rapide";
//                       lite_bg_color =
//                         "bg-green-100/50 dark:bg-gray-900/40 dark:shadow-green-700/10 dark:shadow-lg dark:border-l-[.5rem] dark:border-green-600/80  shadow-lg shadow-gray-950/20";
//                       activeTextColor = "text-green-800 dark:text-green-200";
//                       active_bg_color = "bg-green-300/50 dark:bg-green-500/50";
//                       vitess_img = "img/cars/green_vitess.png";
//                       imgClass = "w-12 sm:w-14 md:w-20";
//                     }

//                     const timeStampGMT = (
//                       parseInt(vehicle.timestamp, 10) +
//                       (selectUTC + 5) * 60 * 60
//                     ).toString();

//                     let timestamp = Number(vehicle.timestamp);
//                     let dt = new Date(timestamp * 1000);
//                     dt.setHours(dt.getHours() + 1);

//                     // const FormatDateHeureTimestamp = FormatDateHeure(
//                     //   vehicle.timestamp
//                     // );

//                     // const FormatDateHeureTimestamp =
//                     //   FormatDateHeure(timeStampData);
//                     return (
//                       <Tooltip
//                         title="Voir cette position sur la carte

//                     "
//                         PopperProps={{
//                           modifiers: [
//                             {
//                               name: "offset",
//                               options: {
//                                 offset: [0, -10], // Décalage horizontal et vertical
//                               },
//                             },
//                             // {
//                             //   name: "zIndex",
//                             //   enabled: true,
//                             //   phase: "write",
//                             //   fn: ({ state }) => {
//                             //     state.styles.popper.zIndex = 1; // Niveau très élevé
//                             //   },
//                             // },
//                           ],
//                         }}
//                       >
//                         <div
//                           onClick={() => {
//                             // setShowListOption(true);
//                             // setchooseHistoriqueLongitudeLatitude(
//                             //   vehicle.longitude,
//                             //   vehicle.latitude
//                             // );
//                             // setchooseHistoriqueLongitude(vehicle.longitude);
//                             // setchooseHistoriqueLatitude(vehicle.latitude);
//                             setSelectedVehicle(currentVehicule?.deviceID);

//                             sethistiriqueSelectedLocationIndex(index);

//                             setvoirPositionSurCarte(true);
//                             console.log(vehicle);
//                           }}
//                           key={index}
//                           className={`${lite_bg_color} shadow-md relative rounded-lg p-3`}
//                         >
//                           <div
//                             onClick={() => {
//                               console.log(vehicle.timestamp);
//                               console.log(vehicle);
//                             }}
//                             className={`${active_bg_color}  ${activeTextColor} z-10 rounded-bl-full absolute top-0 right-0  p-2 pl-3 pb-3 font-bold text-md `}
//                           >
//                             {/* {index + 1} */}
//                             {numero}
//                           </div>
//                           <div className="flex relative gap-3 md:py-4--">
//                             <div className="flex  flex-col items-center md:min-w-32">
//                               <div className={`${imgClass} mb-2`}>
//                                 <img src={vitess_img} alt="" />
//                               </div>
//                               <h2
//                                 className={`${main_text_color} sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
//                               >
//                                 {parseFloat(speed).toFixed(0)}
//                               </h2>
//                               <h2
//                                 className={`${main_text_color} text-[1rem] sm:text-lg md:text-xl font-semibold whitespace-nowrap`}
//                               >
//                                 Km/h
//                               </h2>
//                             </div>
//                             <div className=" flex justify-center items-center">
//                               <div className="">
//                                 <div className="flex mb-2 gap-4 text-gray-600 dark:text-gray-200 text-md">
//                                   {/* <div className="flex gap-3 items-center">
//                                     <FaRegCalendarAlt className="text-gray-500/80 dark:text-gray-300" />
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       {vehicle.timestamp &&
//                                         "Pas de date disponible"}
//                                     </h3>
//                                   </div> */}
//                                   <div className="flex flex-col items-center-- gap-1">
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-Choisis xxxx{" "}
//                                       {FormatDateHeure(vehicle.timestamp).date}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-Choisis xxxx{" "}
//                                       {FormatDateHeure(vehicle.timestamp).time}{" "}
//                                     </h3>
//                                     {/* <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-14{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Kiritimati"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-13{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Enderbury"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-12{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Wake"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-11{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Pago_Pago"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-10{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Honolulu"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-9{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Anchorage"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-8{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Los_Angeles"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-7{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Denver"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-6{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Chicago"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-5{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/New_York"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-4{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Caracas"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-3{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "America/Sao_Paulo"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-2{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Atlantic/South_Georgia"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT-1{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Atlantic/Azores"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+0{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "UTC"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+1{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Europe/Paris"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+2{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Europe/Athens"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+3{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Riyadh"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+4{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Dubai"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+5{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Karachi"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+6{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Dhaka"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+7{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Bangkok"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+8{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Shanghai"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+9{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Asia/Tokyo"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+10{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Port_Moresby"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+11{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Guadalcanal"
//                                       )}{" "}
//                                     </h3>
//                                     <h3 className="text-sm sm:text-sm md:text-md">
//                                       GMT+12{" "}
//                                       {convertTimestampToLocalDateTime(
//                                         vehicle.timestamp,
//                                         "Pacific/Auckland"
//                                       )}{" "}
//                                     </h3> */}
//                                   </div>

//                                   {/* // Number(vehicle.timestamp) + 1 * 60 * 60, */}
//                                   {/* //////////////////////////////// */}
//                                   {/* <div className="flex items-center gap-1">
//                                     <IoMdTime
//                                       id="time-icon"
//                                       className="text-gray-500/80 text-xl dark:text-gray-300"
//                                     /> */}
//                                   {/* <h3 className="text-sm sm:text-sm md:text-md"> */}
//                                   {/* {formatTimestampToTime(vehicle.timestamp)} */}
//                                   {/* {selectUTC
//                                     ? formatTimestampToTimeWithTimezone(
//                                         vehicle.timestamp,
//                                         selectUTC
//                                       )
//                                     : formatTimestampToTime(vehicle.timestamp)} */}
//                                   {/* {vehicle.timestamp} /// */}
//                                   {/* {dt.toString()} */}
//                                   {/* </h3> */}
//                                   {/* </div> */}
//                                   {/* ///////////////////////////////////////////// */}
//                                 </div>
//                                 <div className="flex gap-2">
//                                   <div>
//                                     <FaCar className="text-gray-500/80 dark:text-gray-300" />
//                                   </div>
//                                   <span
//                                     className={` ${active_bg_color} ml-1 ${activeTextColor} pb-[.2rem] px-2 py-0 text-sm rounded-md `}
//                                   >
//                                     {statut}
//                                   </span>
//                                 </div>
//                                 <div className="flex gap-1 ">
//                                   <div>
//                                     <MdLocationPin className="text-xl dark:text-gray-300 text-gray-500/80 -translate-x-0.5 mt-3" />
//                                   </div>
//                                   <p className="text-md flex text-gray-600 dark:text-gray-300 mt-2 md:text-lg">
//                                     {vehicle?.backupAddress ||
//                                       vehicle.address ||
//                                       "Adresse non disponible"}{" "}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </Tooltip>
//                     );
//                   })
//               ) : (
//                 <p className="text-center">
//                   Pas de données disponibles{" "}
//                   <span className=" text-orange-600">pour le filtre</span>
//                 </p>
//               );
//             })()
//           ) : (
//             <p className="text-center dark:text-gray-50">
//               Aucune donnée disponible
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default HistoriqueMainComponent;
