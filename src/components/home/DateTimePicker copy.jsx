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
  const {
    handleDateChange,
    fetchVehicleDetails,
    // fetchHistoriqueVehicleDetails,
    currentVéhicule,
    setLoadingHistoriqueFilter,
 
  } = useContext(DataContext);

  // const today = new Date(); // La date actuelle

  // // Formatage de la date actuelle
  // const getCurrentDate = () => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajuste le décalage
  //   return now.toISOString().split("T")[0];
  // };

  // const [endDate2, setEndDate2] = useState(getCurrentDate());

  // const today = new Date(); // La date actuelle

  // // Initialiser l'état avec la date actuelle
  // const [endDate2, setEndDate2] = useState(today);

  const today = new Date(); // La date actuelle

  // Fonction pour formater une date en 'YYYY-MM-DD'
  const formatDateToISO = (date) => {
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split("T")[0];
  };

  // Initialiser l'état avec la date actuelle au bon format
  const [endDate2, setEndDate2] = useState(today);

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
              {/* <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                required
              /> */}

              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
               
                maxDate={today} // Désactive tous les jours futurs
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={today} // Désactive tous les jours futurs
              /> */}
              <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={new Date(startDate)} // Convertir la date au bon format
                onChange={(date) =>
                  setStartDate(date.toISOString().split("T")[0])
                } // Met à jour l'état avec un format correct
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
              {/* <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                required
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                maxDate={today} // Désactive tous les jours futurs
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={new Date(endDate)} // Convertir la date au bon format
                onChange={(date) =>
                  setEndDate(date.toISOString().split("T")[0])
                } // Met à jour l'état avec un format correct
                maxDate={today}
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={new Date(endDate2)} // Convertir la date au bon format
                onChange={(date) =>
                  setEndDate2(date.toISOString().split("T")[0])
                } // Met à jour l'état avec un format correct
                maxDate={today}
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={new Date(endDate2)} // Convertir la date au bon format
                onChange={(date) => {
                  const adjustedDate = new Date(date);
                  adjustedDate.setMinutes(
                    adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
                  );
                  setEndDate2(adjustedDate.toISOString().split("T")[0]);
                }} // Met à jour l'état avec un format correct
                maxDate={today}
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={new Date(endDate2)}
                onChange={(date) => {
                  if (date) {
                    const adjustedDate = new Date(
                      date.getTime() - date.getTimezoneOffset() * 60000
                    );
                    setEndDate2(adjustedDate.toISOString().split("T")[0]);
                    console.log(
                      "Date choisie :",
                      adjustedDate.toISOString().split("T")[0]
                    );
                  }
                }}
                maxDate={today}
              /> */}
              {/* <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={endDate2} // Passer l'objet Date directement
                onChange={(date) => {
                  if (date) {
                    setEndDate2(date); // Met à jour directement avec l'objet Date
                    // setEndDate2(date.toISOString().split("T")[0]); // Met à jour directement avec l'objet Date
                    console.log(
                      "Date choisie :",
                      date.toISOString().split("T")[0]
                    );
                    console.log("end date........", endDate2);
                  }
                }}
                maxDate={today}
              /> */}
              <DatePicker
                id="date"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Choisissez une date"
                required
                selected={endDate2} // Passer directement l'objet Date
                onChange={(date) => {
                  if (date) {
                    const formattedDate = formatDateToISO(date); // Formater la date
                    setEndDate2(date); // Mettre à jour l'état avec l'objet Date
                    console.log("Date choisie :", formattedDate); // Afficher la date formatée dans la console
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
            {/* <button
              type="submit"
              className="py-2 px-12 bg-orange-500 rounded-lg mt-3 text-white dark:bg-orange-600 dark:hover:bg-orange-500"
            >
              Appliquer
            </button> */}
            <p
              onClick={() => {
                console.log("StartDate", endDate2);
              }}
              className="py-2 px-12 bg-orange-500 rounded-lg mt-3 text-white dark:bg-orange-600 dark:hover:bg-orange-500"
            >
              test
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateTimePicker;
