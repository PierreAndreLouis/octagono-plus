import React, { useContext, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { MdErrorOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = ({
  setShowDatePicker,

  fetchHistoriqueVehicleDetails,
  handleApply,
  setStartDate,
  setStartTime,
  setEndDate,
  setEndTime,
  startDate,
  startTime,
  endDate,
  endTime,
}) => {
  const {} = useContext(DataContext);

  

  const today = new Date(); // La date actuelle

  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
    console.log(startTime);
    console.log(endTime);
  }, [startDate, endDate, startTime, endTime]);

  return (
    <div className="fixed inset-0 z-10 flex justify-center items-center bg-black/50 dark:bg-black/80">
      <form className="w-full flex justify-center" onSubmit={handleApply}>
        <div className="flex  relative w-full md:max-w-[30rem] md:px-8 flex-col p-4 py-8 space-y-4 mx-4 bg-gray-100 rounded-lg shadow-lg dark:bg-gray-800">
          <IoClose
            onClick={() => setShowDatePicker(false)}
            className="absolute top-5 right-5 text-red-500 text-3xl cursor-pointer"
          />
          <h2 className="text-xl text-gray-700 dark:text-gray-100">
            Choisissez une date et une heure
          </h2>

          <p className="flex items-start border text-md pb-2 border-yellow-600  bg-yellow-100 text-yellow-700 md:text-lg px-4 py-1 rounded-md text-center dark:bg-yellow-900 dark:text-yellow-50 dark:border-yellow-500">
            <span className="inline-block translate-y-0 mr-2">
              <MdErrorOutline className="text-2xl mt-0.5" />
            </span>
            Une recherche portant sur plus de 3 jours ralentira un peu la carte.{" "}
          </p>

          {/* Date et heure de début */}
          <div className="flex gap-4 justify-center items-center">
            <div className="w-full">
              <label className="block text-gray-500 dark:text-gray-300">
                Date de Début:
              </label>

              <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={startDate} // Passer directement l'objet Date
                onChange={(date) => {
                  if (date) {
                    // const formattedDate = formatDateToISO(date); // Formater la date
                    setStartDate(date); // Mettre à jour l'état avec l'objet Date
                    // console.log("Date choisie :", formattedDate); // Afficher la date formatée dans la console
                  }
                }}
                maxDate={today}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-500 dark:text-gray-300">
                Heure de Début:
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Date et heure de fin */}
          <div className="flex gap-4 justify-center items-center">
            <div className="w-full">
              <label className="block text-gray-500 dark:text-gray-300">
                Date de Fin:
              </label>

              <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={endDate} // Passer directement l'objet Date
                onChange={(date) => {
                  if (date) {
                    // const formattedDate = formatDateToISO(date); // Formater la date
                    setEndDate(date); // Mettre à jour l'état avec l'objet Date
                    // console.log("Date choisie :", formattedDate); // Afficher la date formatée dans la console
                  }
                }}
                maxDate={today}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-500 dark:text-gray-300">
                Heure de fin:
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="py-2 px-12 bg-orange-500 rounded-lg mt-3 text-white dark:bg-orange-600 dark:hover:bg-orange-500"
            >
              Appliquer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateTimePicker;
