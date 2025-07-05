import React, { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

function DatePupup({
  showChooseDate,
  handleApply,
  setShowChooseDate,
  setShowDatePicker2,
  selectedDate,
  setSelectedDate,
  pageSection,
}) {
  const [t, i18n] = useTranslation();

  const {} = useContext(DataContext);

  const today = new Date(); // La date actuelle
  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  return (
    <>
      {showChooseDate && (
        <form
          onSubmit={handleApply}
          className="fixed z-[9999999999999999999] inset-0 flex justify-center items-center bg-black/50"
        >
          <div className="border relative flex-col pt-6 bg-gray-50 dark:bg-gray-800 w-full max-w-[25rem] mx-4 rounded-lg px-4 pl-2 py-1 flex gap-4-- shadow-lg">
            <IoClose
              onClick={() => {
                setShowChooseDate(false);
              }}
              className="absolute top-4 right-4 text-xl text-red-500 dark:text-red-400 cursor-pointer"
            />

            {pageSection === "unite" && (
              <h2 className="font-semibold dark:text-gray-200 text-lg p-3 pb-0 text-gray-700">
                {t("Recherche par intervalle de date")}
              </h2>
            )}
            {pageSection === "unite" && (
              <p
                onClick={() => {
                  setShowDatePicker2(true);
                  setShowChooseDate(false);
                }}
                className="mx-3 shadow-lg-- shadow-gray-300/40 cursor-pointer bg-orange-100 p-2  mb-3 mt-2 rounded-lg"
              >
                {t("Sélectionner une intervalle de date")}
              </p>
            )}
            {/*  */}
            {/*  */}
            {pageSection === "unite" && (
              <div className="border-b my-4 border-orange-400/50 dark:border-gray-700" />
            )}
            {/*  */}
            {/*  */}
            <h2 className="font-semibold dark:text-gray-200 text-lg px-3 text-gray-700">
              {t("Recherche pour une journée")}
            </h2>

            {/* <h2 className="pt-4 pl-4 text-gray-900 dark:text-gray-100">
                      Choisissez une date :
                    </h2> */}
            {/* <p> {formatDate(selectedDate)}</p> */}
            <label className="px-3- w-full-- border border-orange-100 rounded-lg mx-4 mt-3 mb-6 bg-orange-100  dark:border-gray-600">
             

           
              <DatePicker
                id="date"
                className="focus:outline-none  shadow-lg-- shadow-gray-300/40 bg-black/0 border- p-2 rounded-lg w-full bg-orange-100- dark:bg-gray-400--  dark:border-gray-600- dark:text-gray-200--"
                dateFormat="dd/MM/yyyy"
                placeholderText={`${t("Sélectionner une date")}`}
                required
                selected={selectedDate} // Passer directement l'objet Date
                onChange={(date) => {
                  if (date) {
                
                    setSelectedDate(date); // Mettre à jour l'état  
                  }
                }}
                maxDate={today}
              />
            </label>
            <div className="flex mx-4 mb-4">
              {selectedDate ? (
                <button
                  className="cursor-pointer font-semibold text-gray-100 px-8 py-2 rounded-md bg-orange-500 dark:bg-orange-600"
                  type="submit"
                >
                  {t("Rechercher")}
                </button>
              ) : (
                <div className="cursor-default font-semibold text-gray-100 px-8 py-2 rounded-md bg-gray-400 dark:bg-gray-600">
                  {t("Rechercher")}
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default DatePupup;
