import React from "react";
import { IoClose } from "react-icons/io5";

function TypeDeVue({ typeDeVue, setTypeDeVue, mapType, handleMapTypeChange }) {
  return (
    <>
      {typeDeVue && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[80vw] p-6 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setTypeDeVue(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              Choisir un type de vue:
            </h2>

            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "streets" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("streets")}
            >
              Vue Normale
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "satelite" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("satelite")}
            >
              Vue Satelite
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "terrain" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("terrain")}
            >
              Vue terrain
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "humanitarian"
                  ? "bg-gray-200 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => handleMapTypeChange("humanitarian")}
            >
              Vue Humanitaire
            </p>
            <p
              className={`cursor-pointer py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                mapType === "positron" ? "bg-gray-200 dark:bg-gray-800/70" : ""
              }`}
              onClick={() => handleMapTypeChange("positron")}
            >
              Vue Claire
            </p>
           
          </div>
        </div>
      )}
    </>
  );
}

export default TypeDeVue;
