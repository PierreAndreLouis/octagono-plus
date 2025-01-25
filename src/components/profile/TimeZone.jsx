import React, { useState, useEffect, useContext } from "react";
import moment from "moment-timezone";
import { IoSearch } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";

function TimeZone({ setChangeTimeZone, setChangeTimeZoneMessage }) {
  const {
    timeZoneData,
    setTimeZoneData,
    timeZonesearchQuery,
    settimeZoneSearchQuery,
    selectedTimeZone,
    setSelectedTimeZone,
    selectUTC,
    setselectUTC,
    selectTime,
    setselectTime,
    handleSelectTimeZone,
    userData,
    homePageReload,
    // FormatDateHeure,
  } = useContext(DataContext);

  // // Filtrer les données en fonction de la recherche
  // const filteredData = timeZoneData?.filter((zone) =>
  //   [zone.region, zone.utcOffset, zone.currentTime].some((field) =>
  //     field.toLowerCase().includes(timeZonesearchQuery.toLowerCase())
  //   )

  // );

  const filteredData = timeZoneData?.filter(
    (zone) =>
      zone?.utcOffset
        ?.toString()
        .toLowerCase()
        .includes(timeZonesearchQuery.toLowerCase()) ||
      zone?.region?.toLowerCase().includes(timeZonesearchQuery.toLowerCase())
  );

  // const [timestamp, setTimestamp] = useState(Date.now() / 1000);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimestamp(Date.now()); // Met à jour le timestamp toutes les secondes
  //   }, 1000);

  //   // Nettoyage à la fin du cycle de vie du composant
  //   return () => clearInterval(interval);
  // }, []);

  // La fonction donnée
  function FormatDateHeure(timestamp) {
    // Convertir le timestamp en millisecondes
    const date = new Date(timestamp * 1000);

    // Récupérer les informations nécessaires
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convertir en format 12 heures
    hours = hours % 12 || 12;

    // Formater la date et l'heure
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${String(hours).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  // const LiveFormattedTimestamp = () => {
  const [timestamp, setTimestamp] = useState(Date.now() / 1000); // Timestamp en secondes
  const [formatted, setFormatted] = useState(FormatDateHeure(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimestamp = Date.now() / 1000; // Timestamp mis à jour
      setTimestamp(newTimestamp);
      setFormatted(FormatDateHeure(newTimestamp)); // Mettre à jour les données formatées
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  let newHours = (Number(selectUTC) + 5 || 0) * 60 * 60;

  // if (selectUTC > 0) {
  // }

  // let addHoursFrom = -17;
  // let addHoursTo = 0;
  // if (selectUTC > -5 && selectUTC <= 0) {
  //   addHoursFrom = -7;
  // } else if (selectUTC > 0) {
  //   addHoursFrom = -(Number(selectUTC) + 7);
  // }

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center bg-black/50 dark:bg-black/70">
      <div className="w-[95vw] relative rounded-lg p-4 px-2 max-w-[40rem] max-h-[79vh] bg-white dark:bg-gray-800 min-h-[60vh]">
        <div className="p-4 px-3 md:px-4 absolute top-0 left-0 right-0">
          <div className="flex gap-3 items-center">
            <h2 className="md:min-w-24 font-semibold text-gray-500 dark:text-gray-300">
              TimeZone
              {/* // {selectUTC} + 7 = {addHoursFrom} */}
            </h2>
            <div className="flex w-full items-center border rounded-lg px-3 dark:border-gray-600">
              <input
                type="text"
                placeholder="Recherche (région, UTC, heure actuelle)"
                className="focus:outline-none p-1 w-full bg-transparent dark:text-gray-200"
                value={timeZonesearchQuery}
                onChange={(e) => settimeZoneSearchQuery(e.target.value)}
              />
              <IoSearch className="text-xl text-gray-500 dark:text-gray-400" />
            </div>
            <IoMdClose
              onClick={() => {
                setChangeTimeZone(false);
              }}
              className="cursor-pointer py-2 text-[2.3rem] text-red-600 dark:text-red-400"
            />
          </div>
          <div className="bg-orange-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 py-2 rounded-lg mt-2">
            <div className="flex justify-between">
              <h3 className="font-semibold">Fuseau horaire actuel</h3>
              <h4
                onClick={() => {
                  localStorage.removeItem("selectedTimeZone");
                  localStorage.removeItem("selectUTC");
                  localStorage.removeItem("selectTime");

                  setSelectedTimeZone("");
                  setselectUTC("");
                  setselectTime("");
                  setChangeTimeZone(false);
                  setChangeTimeZoneMessage(true);
                }}
                className="text-orange-600 dark:text-orange-400 cursor-pointer"
              >
                Réinitialiser
              </h4>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400">
                {selectedTimeZone || "Aucun fuseau horaire sélectionné"}
              </p>

              <p className="text-gray-500 dark:text-gray-400">
                {selectUTC && FormatDateHeure(timestamp + newHours).date} /
                <span className="font-bold ml-3">
                  {selectUTC && FormatDateHeure(timestamp + newHours).time}
                </span>
                {/* {selectTime || "--"} */}
              </p>
            </div>
          </div>
        </div>
        <div className="shadow-lg-- overflow-y-auto overflow-x-hidden max-h-[55vh] mt-[7.3rem] rounded-lg min-h-[100%] px-0 ">
          {/* TimeStamp: {timestamp} <br />
          selectUTC : {selectUTC || "---"} <br />
          selectUTC + heure-- : {Number(selectUTC) + 5 || 0} <br />
          Heure Actuelle: {FormatDateHeure(timestamp).time} <br />
          Heure Actuelle + heures: {
            FormatDateHeure(timestamp + newHours).time
          }{" "}
          <br /> */}
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                handleSelectTimeZone(item);
                setChangeTimeZone(false);
                setChangeTimeZoneMessage(true);
              }}
              className={`flex justify-between border-b py-3 my-2 cursor-pointer rounded-lg px-2 ${
                selectedTimeZone === item.region
                  ? "bg-orange-50 dark:bg-gray-900/80"
                  : "hover:bg-orange-50 dark:hover:bg-gray-900/80"
              }`}
            >
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-300">
                  {item.region}
                </h3>
                <h4 className="text-gray-500 dark:text-gray-400">
                  {/* UTC {item.utcOffset} */}
                  {
                    FormatDateHeure(
                      timestamp + (item.utcOffset + 5 || 0) * 60 * 60
                    ).date
                  }{" "}
                  /
                  <span className="font-bold ml-2">
                    {
                      FormatDateHeure(
                        timestamp + (item.utcOffset + 5 || 0) * 60 * 60
                      ).time
                    }
                  </span>
                </h4>
              </div>
              <div>
                <h3 className="text-gray-600 dark:text-gray-300">
                  {/* {item.currentTime} */}
                  {item.utcOffset >= 0 && "+"}
                  {item.utcOffset}:00
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimeZone;
