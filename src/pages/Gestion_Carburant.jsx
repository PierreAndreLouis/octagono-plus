import React, { useContext, useEffect, useRef, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import DataContextProvider, { DataContext } from "../context/DataContext";
import DatePicker from "react-datepicker";
import { FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";

function Gestion_Carburant() {
  const {
    currentVéhicule,

    mergedDataHome,

    fetchHistoriqueVehicleDetails,
    loadingHistoriqueFilter,
    isDashboardHomePage,
    currentAccountSelected,
    gestionAccountData,
    rechercheCarburantData1,
    rechercheCarburantData2,
    accountDevices,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  const todayData = rechercheCarburantData1 || [];
  const yesterdayData = rechercheCarburantData2 || [];

  // --- Simulation de données brutes ---
  // const todayData = [
  //   { timestamp: 1761120030, speedKPH: "40" },
  //   { timestamp: 1761123620, speedKPH: "45" },
  //   { timestamp: 1761127290, speedKPH: "51" },
  //   { timestamp: 1761130800, speedKPH: "54" },
  //   //
  //   { timestamp: 1761202740, speedKPH: "58" },
  //   { timestamp: 1761206400, speedKPH: "57" },
  //   { timestamp: 1761210100, speedKPH: "50" },
  //   { timestamp: 1761213600, speedKPH: "50" },
  //   { timestamp: 1761217250, speedKPH: "50" },
  //   //
  // ];

  // const yesterdayData = [
  //   { timestamp: 1761120030, speedKPH: "45" },
  //   { timestamp: 1761123620, speedKPH: "54" },
  //   { timestamp: 1761127290, speedKPH: "59" },
  //   { timestamp: 1761130800, speedKPH: "61" },
  //   //
  //   { timestamp: 1761202740, speedKPH: "30" },
  //   { timestamp: 1761206400, speedKPH: "40" },
  //   { timestamp: 1761210100, speedKPH: "55" },
  //   { timestamp: 1761213600, speedKPH: "53" },
  //   { timestamp: 1761217250, speedKPH: "50" },
  //   //
  // ];

  // --- Convertit un timestamp en heure (HH:mm) locale ---
  const getLocalTimeLabel = (ts) =>
    new Date(ts * 1000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // --- Transformation des données en {timeLabel, value} ---
  const mapToTimeSeries = (data) =>
    data.map((item) => ({
      timeLabel: getLocalTimeLabel(item.timestamp),
      value: parseFloat(item.speedKPH),
    }));

  const todaySeries = mapToTimeSeries(todayData);
  const yesterdaySeries = mapToTimeSeries(yesterdayData);

  // --- Fusionner toutes les heures présentes dans les deux datasets ---
  const allTimes = Array.from(
    new Set([
      ...todaySeries.map((d) => d.timeLabel),
      ...yesterdaySeries.map((d) => d.timeLabel),
    ])
  ).sort();

  // --- Aligner les séries selon toutes les heures ---
  const getValueAtTime = (data, time) => {
    const found = data.find((d) => d.timeLabel === time);
    return found ? found.value : null;
  };

  const fuelToday = allTimes.map((t) => getValueAtTime(todaySeries, t));
  const fuelYesterday = allTimes.map((t) => getValueAtTime(yesterdaySeries, t));

  // --- Graphique ---
  const options = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const details = params
          .map((item) => `${item.seriesName}: ${item.value ?? "–"} gallons`)
          .join("<br />");
        return `${params[0].axisValue}<br />${details}`;
      },
    },
    xAxis: {
      type: "category",
      data: allTimes,
      name: "Heures",
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      name: "Carburant (Gallons)",
    },
    series: [
      {
        name: "Aujourd'hui",
        data: fuelToday,
        type: "line",
        smooth: true,
        connectNulls: true,
        lineStyle: { color: "rgba(19, 61, 199, 0.854)" },
        areaStyle: { opacity: 0.1, color: "rgba(19, 61, 199, 0.854)" },
        // lineStyle: { color: "rgba(99,102,241,0.9)" },
        // areaStyle: { opacity: 0.15, color: "rgba(99,102,241,0.5)" },
      },
      {
        name: "Hier",
        data: fuelYesterday,
        type: "line",
        smooth: true,
        connectNulls: true,
        lineStyle: { color: "rgba(255, 81, 81, 0.854)" },
        areaStyle: { opacity: 0.15, color: "rgba(255, 81, 81, 0.854)" },
        // lineStyle: { color: "rgba(139,92,246,0.8)" },
        // areaStyle: { opacity: 0.1, color: "rgba(139,92,246,0.4)" },
      },
    ],
  };

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDate2, setSelectedDate2] = useState(yesterday);

  // Formatage de la date actuelle
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("00:00"); // Heure de début fixée à minuit
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState(getCurrentTime());

  const [startDateToDisplay, setStartDateToDisplay] = useState(startDate);
  const [startTimeToDisplay, setStartTimeToDisplay] = useState(startTime); // Heure de début fixée à minuit
  const [endDateToDisplay, setEndDateToDisplay] = useState(endDate);
  const [endTimeToDisplay, setEndTimeToDisplay] = useState(endTime);

  useEffect(() => {}, [
    startTimeToDisplay,
    startDateToDisplay,
    endDateToDisplay,
    endTimeToDisplay,
  ]);

  useEffect(() => {
    console.log(selectedDate);
    console.log(selectedDate2);
  }, [selectedDate, selectedDate2]);

  const handleApply = (selectedDate, isPart1, device) => {
    // e.preventDefault();

    const formatDateToISO = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Convertir en objet Date si nécessaire
      }
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return adjustedDate.toISOString().split("T")[0];
    };

    // Conversion des variables startDate et endDate
    const formattedStartDate = formatDateToISO(selectedDate);
    const formattedEndDate = formatDateToISO(selectedDate);
    //

    const startTime = "00:00:00";
    const endTime = "23:59:59";

    // Combine les dates formatées avec les heures
    const baseTimeFrom = new Date(`${formattedStartDate}T${startTime}`);
    const baseTimeTo = new Date(`${formattedEndDate}T${endTime}`);

    // Ajout de l'ajustement UTC
    const adjustedTimeFrom = baseTimeFrom;
    const adjustedTimeTo = baseTimeTo;

    // Formatage en chaîne pour les heures ajustées
    const timeFrom = `${adjustedTimeFrom.getFullYear()}-${(
      adjustedTimeFrom.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeFrom
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeFrom
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeFrom
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const timeTo = `${adjustedTimeTo.getFullYear()}-${(
      adjustedTimeTo.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${adjustedTimeTo
      .getDate()
      .toString()
      .padStart(2, "0")} ${adjustedTimeTo
      .getHours()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${adjustedTimeTo
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    //
    //
    //
    //

    //
    //
    //
    //

    const vehicleID =
      device?.deviceID ||
      currentVéhicule?.deviceID ||
      dataFusionné[0]?.deviceID;
    const vehicleAccountID =
      device?.accountID ||
      currentVéhicule?.accountID ||
      dataFusionné[0]?.accountID;

    let fromGestionCarburant;
    if (isDashboardHomePage) {
      // console.log(
      fetchHistoriqueVehicleDetails(
        vehicleID,
        timeFrom,
        timeTo,

        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) => account.accountID === vehicleAccountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) => account.accountID === vehicleAccountID
          )?.password,
        false,
        isPart1 ? "partie1" : "partie2"
      );
    } else {
      fetchHistoriqueVehicleDetails(
        vehicleID,
        timeFrom,
        timeTo,
        false,
        isPart1 ? "partie1" : "partie2"
      );
    }

    //
    //
    //

    setStartDateToDisplay(selectedDate);
    setStartTimeToDisplay(startTime);
    setEndDateToDisplay(selectedDate);
    setEndTimeToDisplay(endTime);

    console.log("selectedDate", selectedDate);
    console.log("startTime", startTime);
    console.log("selectedDate2", selectedDate);
    console.log("endTime", endTime);

    console.log(
      "xxxxxxxxxxxxxxxxxxxx",
      vehicleID,
      timeFrom,
      timeTo,
      false,
      isPart1
    );

    // console.log("selectedDate", selectedDate);
    // console.log("startTime", startTime);
    // console.log("selectedDate", selectedDate);
    // console.log("endTime", endTime);

    // console.log(vehicleID, timeFrom, timeTo);
  };

  let deviceListeSelected;

  if (isDashboardHomePage && currentAccountSelected) {
    deviceListeSelected = currentAccountSelected?.accountDevices;
  } else if (isDashboardHomePage && !currentAccountSelected) {
    deviceListeSelected = accountDevices;
  } else if (!isDashboardHomePage) {
    deviceListeSelected = dataFusionné;
  }

  const [showOptions, setShowOptions] = useState(false);

  const [searchQueryRapportPageDetailHeader, setRapportPageDetailHeader] =
    useState("");

  const handleSearchChange = (e) => {
    e.preventDefault();
    setRapportPageDetailHeader(e.target.value);
  };

  const filteredVehicles = deviceListeSelected?.filter(
    (véhicule) =>
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase()) ||
      véhicule?.accountID
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryRapportPageDetailHeader.toLowerCase())
  );

  const handleClick = (véhicule) => {
    handleApply(selectedDate, true, véhicule);
    handleApply(selectedDate2, false, véhicule);

    window.scrollTo({
      top: 0,
      behavior: "auto", // Défilement fluide
      // behavior: "smooth", // Défilement fluide
    });

    const deviceID = véhicule?.deviceID;

    console.error("Véhicule introuvable avec le deviceID :", deviceID);

    setShowOptions(false);
    // ,,,,,,,,,,,    // }
  };

  const DayOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg min-h-[100vh]">
      {loadingHistoriqueFilter && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-black/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {showOptions && (
        <SearchVehiculePupup
          searchQueryListPopup={searchQueryRapportPageDetailHeader}
          setSearchQueryListPopup={setRapportPageDetailHeader}
          handleSearchChange={handleSearchChange}
          setShowOptions={setShowOptions}
          filteredVehicles={filteredVehicles}
          handleClick={handleClick}
          currentVéhicule={currentVéhicule}
          isMapcomponent="false"
        />
      )}

      <h2 className="font-bold text-center w-full mt-10 text-2xl text-gray-600">
        {t("Évolution du niveau de carburant")}
      </h2>

      {/* <div
        onClick={() => {
          setShowOptions(!showOptions);
        }}
        className="relative mt-6 max-w-[35rem] mx-4 md:mx-auto mb-2"
      >
        {
          <div className="flex justify-between cursor-pointer border rounded-md px-3 py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-500 dark:text-gray-300 text-center">
            <p className="text-start notranslate w-[90%] dark:text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis">
              {!currentVéhicule?.description &&
                `${t("Choisissez un véhicule")}`}

              {currentVéhicule?.description}
            </p>

            <div
              className={`${
                !showOptions ? "rotate-0" : "rotate-180"
              } transition-all`}
            >
              {!showOptions ? (
                <FaChevronDown className="mt-1" />
              ) : (
                <IoMdClose className="mt-1 text-xl text-red-500 -translate-y-[.2rem] -translate-x-[.1rem]" />
              )}
            </div>
          </div>
        }
      </div> */}

      {currentVéhicule && false ? (
        <div>
          <div>
            <div className="flex pl-3 lg:gap-10 pr-4 flex-col sm:flex-row gap-4 max-w-[50rem] md:mx-auto">
              <div className=" relative flex-col pt-6   w-full   rounded-lg py-1 flex ">
                {/*  */}
                {/*  */}
                <h2
                  onClick={() => {
                    console.log(rechercheCarburantData1);
                  }}
                  className="font-semibold-- dark:text-gray-200 text-lg  text-gray-700"
                >
                  {/* {t("Recherche pour une journée")} //{" "} */}
                  <span className="font-bold text-blue-700">Jour 1 : </span>
                  {selectedDate.toLocaleDateString("fr-FR", DayOptions)}
                </h2>
                <div className="flex items-center w-full  mt-2 gap-2">
                  <label className=" w-full border border-blue-300 rounded-lg   bg-blue-50  dark:border-gray-600">
                    <DatePicker
                      id="date"
                      className="focus:outline-none  shadow-lg-- shadow-gray-300/40 bg-black/0 border- p-2 rounded-lg w-full "
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
                  <div className="flex  ">
                    {selectedDate ? (
                      <button
                        className="cursor-pointer font-semibold text-gray-100 px-3 py-2 rounded-md bg-blue-500 "
                        onClick={() => {
                          handleApply(selectedDate, true);
                        }}
                      >
                        {t("Rechercher")}
                      </button>
                    ) : (
                      <div className="cursor-default font-semibold text-gray-100 px-3 py-2 rounded-md bg-gray-400 dark:bg-gray-600">
                        {t("Rechercher")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className=" relative flex-col pt-0 sm:pt-6   w-full   rounded-lg py-1 flex ">
                {/*  */}
                {/*  */}
                <h2
                  onClick={() => {
                    console.log(rechercheCarburantData2);
                  }}
                  className="font-semibold--  dark:text-gray-200 text-lg  text-gray-700"
                >
                  {/* {t("Recherche pour une journée")} */}
                  <span className="font-bold text-orange-600">Jour 2 : </span>
                  {selectedDate2.toLocaleDateString("fr-FR", DayOptions)}
                </h2>
                <div className="flex items-center w-full  mt-2 gap-2">
                  <label className=" w-full border border-orange-300 rounded-lg   bg-orange-50  dark:border-gray-600">
                    <DatePicker
                      id="date"
                      className="focus:outline-none  shadow-lg-- shadow-gray-300/40 bg-black/0 border- p-2 rounded-lg w-full "
                      dateFormat="dd/MM/yyyy"
                      placeholderText={`${t("Sélectionner une date")}`}
                      required
                      selected={selectedDate2} // Passer directement l'objet Date
                      onChange={(date) => {
                        if (date) {
                          setSelectedDate2(date); // Mettre à jour l'état
                        }
                      }}
                      maxDate={today}
                    />
                  </label>
                  <div className="flex  ">
                    {selectedDate2 ? (
                      <button
                        className="cursor-pointer font-semibold text-gray-100 px-3 py-2 rounded-md bg-orange-600 "
                        onClick={() => {
                          handleApply(selectedDate2, false);
                        }}
                      >
                        {t("Rechercher")}
                      </button>
                    ) : (
                      <div className="cursor-default font-semibold text-gray-100 px-3 py-2 rounded-md bg-gray-400 dark:bg-gray-600">
                        {t("Rechercher")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="font-bold text-center w-full mt-4 text-lg text-orange-600">
              {currentVéhicule?.description}
            </h2>
            {/*  */}
            {/*  */}
          </div>

          <div className="flex justify-center mt-10">
            <div className="w-[95%]">
              <ReactECharts option={options} style={{ height: 400 }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen-- pt-20 flex flex-col justify-center items-center">
          <button
            onClick={() => {
              // setShowOptions(true);
            }}
            className="bg-orange-100  px-4 py-1 mt-5 cursor-pointer rounded-lg"
          >
            {/* {t("Choisissez un véhicule")} */}
            {t("Non disponible")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Gestion_Carburant;
