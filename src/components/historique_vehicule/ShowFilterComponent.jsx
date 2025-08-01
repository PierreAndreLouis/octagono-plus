import React, { useContext } from "react";
import { MdDateRange } from "react-icons/md";
import { FaCarRear } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

function ShowFilterComponent({
  showFilter,
  setshowFilter,
  showHistoriqueInMap,
  setShowDatePicker,
  checkboxes,
  handleCheckboxChange,
  applyFilter,
  setTypeDeVue,
 
  startDate,
  startTime,
  endDate,
  endTime,
   setShowVehiculeListe,
  handleApply,
}) {
  const { currentVéhicule, setVéhiculeHistoriqueDetails } =
    useContext(DataContext);

  const [t, i18n] = useTranslation();

  const formatDateToDDMMYYYY = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convertir en objet Date si nécessaire
    }
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const day = adjustedDate.getDate().toString().padStart(2, "0");
    const month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = adjustedDate.getFullYear();
    return `${day}-${month}-${year}`; // Format "DD-MM-YYYY"
  };

  function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convertit 0 ou 12 en 12
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  return (
    <>
      {showFilter && (
        <div className="fixed inset-0 z-20 w-full flex justify-center items-center p-2 bg-black/50">
          <div className="relative max-w-[30rem] bg-white w-[90vw] rounded-md p-4 dark:bg-gray-800">
            <IoMdClose
              onClick={() => {
                setshowFilter(false);
              }}
              className="absolute top-0 cursor-pointer -right-0 min-w-14 py-2 text-[2.53rem] text-red-600 dark:text-red-400"
            />

            {showHistoriqueInMap && (
              <div
                onClick={() => {
                  setTypeDeVue(true);
                  setshowFilter(!showFilter);
                }}
                className="flex  mt-6 items-center justify-between gap-1 border px-2 py-1 cursor-pointer bg-orange-50 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <label htmlFor="mapType">{t("Type de vue")}</label>
                <FaChevronDown />
              </div>
            )}

            <div
              onClick={() => {
                setShowDatePicker(true);
              }}
              className="flex my-3 p-2 rounded-md hover:bg-orange-100/50 cursor-pointer items-center gap-3 dark:hover:bg-gray-700"
            >
              <MdDateRange className="text-xl text-orange-600 dark:text-orange-400" />
              <h3 className="text-gray-800 dark:text-gray-200">
                {t("Filtrer par Date")}
              </h3>
            </div>

            <hr className="dark:border-gray-600" />

            {/* /////////////////////////////////////////////////////////// */}

            <form action="" className="p-2">
              <div className="flex pt-4 mb-4 items-center gap-3">
                <FaCarRear className="text-xl text-orange-600/90 dark:text-orange-400" />
                <h3 className="text-gray-800 dark:text-gray-200">
                  {t("Filtrer par statut")}
                </h3>
              </div>
              <div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_marche"
                    type="checkbox"
                    checked={checkboxes.en_marche}
                    onChange={() => handleCheckboxChange("en_marche")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_marche"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {t("En mouvement rapide")}
                  </label>
                </div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_ralenti"
                    type="checkbox"
                    checked={checkboxes.en_ralenti}
                    onChange={() => handleCheckboxChange("en_ralenti")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_ralenti"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {t("En mouvement lent")}
                  </label>
                </div>
                <div className="flex flex-row mb-1.5 gap-4 ml-0.5">
                  <input
                    id="en_arret"
                    type="checkbox"
                    checked={checkboxes.en_arret}
                    onChange={() => handleCheckboxChange("en_arret")}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="en_arret"
                    className="text-gray-800 dark:text-gray-200"
                  >
                    {t("En stationnement")}
                  </label>
                </div>
              </div>
            </form>

            <hr className="dark:border-gray-600" />

            <div className="py-3 pl-2">
              <div className="font-semibold flex flex-wrap dark:text-gray-50 ">
                <p>
                  {t("Date et heure de Depart")}:{"  "}
                </p>
                <p className="ml-4 font-normal dark:text-orange-500">
                  {formatDateToDDMMYYYY(startDate)} -{" "}
                  {convertTo12HourFormat(startTime)}
                </p>
              </div>
              <div className="font-semibold flex flex-wrap mt-1 dark:text-gray-50 ">
                <p>
                  {t("Date et heure de d'arrivée")}:{"  "}
                </p>
                <p className="ml-4 font-normal dark:text-orange-500">
                  {formatDateToDDMMYYYY(endDate)} -{" "}
                  {convertTo12HourFormat(endTime)}
                </p>
              </div>
            </div>
            <hr className="dark:border-gray-600" />
            {!currentVéhicule ? (
              <div
                onClick={() => {
                  setShowVehiculeListe(true);
                }}
                className="cursor-pointer flex my-3 px-4 rounded-lg bg-red-100 justify-between gap-2 items-center"
              >
                <h2 className=" p-2 px-0 bg-red-100 text-red-600 rounded-lg">
                  {t("Veuillez sélectionner un véhicule")}
                </h2>
                <FaCar className="text-xl text-red-700" />
              </div>
            ) : (
              <p
                onClick={() => {
                  setVéhiculeHistoriqueDetails([]);
                  handleApply();
                  applyFilter();
                  setshowFilter(false);
                }}
                className="border cursor-pointer border-orange-500 text-center text-orange-600 font-semibold rounded-md pt-1 pb-1.5 px-6 mt-5 dark:text-orange-400 dark:border-orange-400"
              >
                {t("Appliquer")}
              </p>
            )}
          </div>
          <hr className="dark:border-gray-600" />
        </div>
      )}
    </>
  );
}

export default ShowFilterComponent;
