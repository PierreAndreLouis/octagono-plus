import React from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";

function TypeDeVue({ typeDeVue, setTypeDeVue, mapType, handleMapTypeChange }) {
  const [t, i18n] = useTranslation();

  return (
    <>
      {typeDeVue && (
        <div className="fixed z-[999999909999999999999999999999999999999999999999999999999999999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[40rem] relative flex flex-col gap-2 w-full mx-2-- p-6 px-4  border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setTypeDeVue(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2
              onClick={() => {
                // setVéhiculeDataWidthData();
              }}
              className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold"
            >
              {t("Choisissez un type de vue")}:
            </h2>

            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "streets" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("streets")}
            >
              {t("Vue Normale")}
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "satelite" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("satelite")}
            >
              {t("Vue Satelite")}
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "terrain" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("terrain")}
            >
              {t("Vue terrain")}
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "humanitarian"
                  ? "bg-gray-200 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => handleMapTypeChange("humanitarian")}
            >
              {t("Vue Humanitaire")}
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "positron" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("positron")}
            >
              {t("Vue Claire")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default TypeDeVue;
