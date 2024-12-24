import React, { useContext, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { DataContext } from "../../context/DataContext";

function RapportPageDetailsOptions({
  setPersonnelDetails,
  personnelDetails,
  setShowListOption,
  setVehiclueHistoriqueDetails,
  currentVehicule,
  formatTimestampToTimeWithTimezone,
  formatTimestampToTime,
  pageSection,
  setpageSection,
  setShowOptions,
  showOptions,

  // formatTimestampToTimeWithTimezone,
  // formatTimestampToTime
}) {
  return (
    <>
      <div className="flex px-4 mb-2 w-full gap-2 justify-between max-w-[40rem]-- mx-auto mt-6">
        <button
          onClick={() => {
            setpageSection("unite");
            window.scrollTo({
              top: 0,
              behavior: "auto", // Défilement fluide
              // behavior: "smooth", // Défilement fluide
            });
          }}
          className={`${
            pageSection == "unite"
              ? "dark:bg-orange-700 bg-orange-100"
              : "dark:bg-gray-900/70 bg-gray-100"
          } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
        >
          Unité
        </button>
        <button
          onClick={() => {
            setpageSection("groupe");
            setShowOptions(false);
            window.scrollTo({
              top: 0,
              behavior: "auto", // Défilement fluide
              // behavior: "smooth", // Défilement fluide
            });
          }}
          className={`${
            pageSection === "groupe"
              ? "dark:bg-orange-700 bg-orange-100"
              : "dark:bg-gray-900/70 bg-gray-100"
          } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
        >
          Groupe
        </button>
        {/* <button
          onClick={() => {
            setpageSection("search");
            setShowOptions(false);
            window.scrollTo({
              top: 0,
              behavior: "auto", // Défilement fluide
              // behavior: "smooth", // Défilement fluide
            });
          }}
          className={`${
            pageSection === "search"
              ? "dark:bg-orange-700 bg-orange-100"
              : "dark:bg-gray-900/70 bg-gray-100"
          } border border-gray-100 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg shadow-lg-- shadow-gray-200 w-full py-1`}
        >
          Recherche
        </button> */}
        {/* <button
          onClick={() => {
            setShowListOption(true);
            // setVehiclueHistoriqueDetails(currentVehicule?.vehiculeDetails);
          }}
          className="border border-gray-100 dark:bg-gray-900/70 dark:text-gray-50 dark:border-gray-50/0 dark:shadow-gray-700 dark:shadow-lg rounded-lg bg-gray-100 shadow-lg-- shadow-gray-200 w-full py-1"
        >
          Options
        </button> */}
      </div>
    </>
  );
}

export default RapportPageDetailsOptions;
