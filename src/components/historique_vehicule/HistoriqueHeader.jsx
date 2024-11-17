import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
// import { DataContext } from "../../context/DataContext";
import { MdLocationPin, MdDateRange } from "react-icons/md";
import { FaCar } from "react-icons/fa";

// import DateTimePicker from "./DateTimePicker";

// import Liste_options from "./Liste_options";
import { BsFilterRight } from "react-icons/bs";
import { FaCarRear } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdCenterFocusStrong } from "react-icons/md";


function HistoriqueHeader({
  setShowHistoriqueInMap,
  showHistoriqueInMap,
  centerOnFirstMarker,
  setShowVehiculeListe,
  showVehiculeListe,
  currentVehicule,
  setshowFilter,
  showFilter
}) {
  return (
    <>
      <div className="flex relative justify-between px-4 max-w-[35rem] w-[100vw]-- w-full items-center-- gap-3 w-full--">
        <div
          onClick={() => {
            setShowHistoriqueInMap(!showHistoriqueInMap);
          }}
          className="cursor-pointer shadow-xl border md:border-orange-200 min-w-10 rounded-md flex justify-center items-center py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-300/30"
        >
          {showHistoriqueInMap ? (
            <IoStatsChart className="text-xl text-orange-600 " />
          ) : (
            <img className="w-[1.7rem]" src="/img/cars/parcoure.png" alt="" />
          )}
        </div>
 

        <div
          onClick={() => {
            setShowVehiculeListe(!showVehiculeListe);
          }}
          className="relative w-full "
        >
          <div
            className="flex gap-2 dark:bg-gray-900/50 dark:text-gray-50 dark:border-gray-300/30 justify-between  cursor-pointer border md:border-orange-200  rounded-md
                 px-3 py-2 bg-orange-50 shadow-xl text-center"
          >
            <p 
            // className="text-start w-[90%] overflow-hidden whitespace-nowrap text-ellipsis"
            >
              {currentVehicule?.description || "Choisir un vehicule"}
            </p>
            <FaChevronDown className="mt-1" />
          </div>
        </div>

        <div
          onClick={() => setshowFilter(!showFilter)}
          className="min-w-10 cursor-pointer border rounded-md shadow-xl md:border-orange-200 flex justify-center items-center py-2 bg-orange-50  dark:bg-gray-900/50 dark:border-gray-300/30"
        >
          <BsFilterRight className="text-2xl text-orange-600 " />
        </div>
      </div>
    </>
  );
}

export default HistoriqueHeader;
