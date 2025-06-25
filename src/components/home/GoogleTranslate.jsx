import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

const GoogleTranslate = () => {
  const { setChooseOtherLanguagePopup, chooseOtherLanguagePopup } =
    useContext(DataContext);

  ///////////////////////

  const [t, i18n] = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const savedLang = localStorage.getItem("lang") || "fr";

  return (
    <>
      {chooseOtherLanguagePopup && (
        <div
          className={` fixed inset-0-- bottom-0 top-0  transition-all w-[100vw] bg-black/50 dark:bg-gray-700 z-[9999999999999999999999999999999999999999999999999999] flex justify-center items-center`}
        >
          <div className="min-h-[40vh] min-w-[95vw] sm:min-w-[30rem] bg-white relative rounded-lg p-4 flex justify-center items-center">
            <h2 className="absolute z-[9999] top-0 left-0 right-0 mt-3 text-center font-semibold">
              {t("Choisissez une langue")}
            </h2>
            <button
              onClick={() => setChooseOtherLanguagePopup(false)}
              className="absolute z-[9999] bg-orange-500 text-white py-1 px-4 rounded-lg right-4 lg:right-4 bottom-4 mt-3 text-center font-semibold"
            >
              {t("Annuler")}
            </button>
            <IoClose
              onClick={() => setChooseOtherLanguagePopup(false)}
              className="absolute top-4 z-[99999999999999999] right-4 text-[1.4rem] cursor-pointer text-red-500"
            />
            <div className="flex gap-3 flex-col w-full">
              <div
                onClick={() => {
                  changeLang("fr");
                  setChooseOtherLanguagePopup(false);
                }}
                className={`${
                  savedLang === "fr" ? "bg-orange-100" : "bg-gray-100"
                } font-semibold flex  justify-center items-center text-lg-- rounded-md py-2`}
              >
                {/* <div className="flex w-full justify-between max-w-[10rem]"> */}
                <button>{t("Français")}</button>
                {/* <p>img</p> */}
                {/* </div> */}
              </div>
              <button
                onClick={() => {
                  changeLang("es");
                  setChooseOtherLanguagePopup(false);
                }}
                className={`${
                  savedLang === "es" ? "bg-orange-100" : "bg-gray-100"
                } font-semibold text-lg-- rounded-md py-2`}
              >
                {t("Espagnol")}
              </button>
              <button
                onClick={() => {
                  changeLang("en");
                  setChooseOtherLanguagePopup(false);
                }}
                className={`${
                  savedLang === "en" ? "bg-orange-100" : "bg-gray-100"
                } font-semibold text-lg-- rounded-md py-2`}
              >
                {t("Anglais")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
