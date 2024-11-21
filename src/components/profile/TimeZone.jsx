import React, { useState, useEffect, useContext } from "react";
import moment from "moment-timezone";
import { IoSearch } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { IoMdClose } from "react-icons/io";

function TimeZone({ setChangeTimeZone }) {
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
  } = useContext(DataContext);

  // Filtrer les données en fonction de la recherche
  const filteredData = timeZoneData?.filter((zone) =>
    [zone.region, zone.utcOffset, zone.currentTime].some((field) =>
      field.toLowerCase().includes(timeZonesearchQuery.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center bg-black/50 dark:bg-black/70">
      <div className="w-[90vw] relative rounded-lg p-4 max-w-[40rem] max-h-[79vh] bg-white dark:bg-gray-800 min-h-[60vh]">
        <div className="p-4 absolute top-0 left-0 right-0">
          <div className="flex gap-3 items-center">
            <h2 className="md:min-w-24 font-semibold text-gray-500 dark:text-gray-300">
              TimeZone
            </h2>
            <div className="flex w-full items-center border rounded-lg px-3 dark:border-gray-600">
              <input
                type="text"
                placeholder="Recherche (région, UTC, heure)"
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
                }}
                className="text-orange-600 dark:text-orange-400 cursor-pointer"
              >
                Réinitialiser
              </h4>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400">
                {selectedTimeZone || "Pas de fuseau horaire"}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {selectUTC || "--"} / {selectTime || "--"}
              </p>
            </div>
          </div>
        </div>
        <div className="shadow-lg overflow-y-auto overflow-x-hidden max-h-[55vh] mt-[7rem] rounded-lg min-h-[100%] px-2">
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                handleSelectTimeZone(item);
                setChangeTimeZone(false);
              }}
              className={`flex justify-between border-b py-2 my-2 cursor-pointer rounded-lg px-2 ${
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
                  UTC {item.utcOffset}
                </h4>
              </div>
              <div>
                <h3 className="text-gray-600 dark:text-gray-300">
                  {item.currentTime}
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
