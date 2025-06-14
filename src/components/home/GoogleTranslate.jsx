import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";
import { useTranslation } from "react-i18next";

const GoogleTranslate = () => {
  const { setChooseOtherLanguagePopup, chooseOtherLanguagePopup } =
    useContext(DataContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    let retryLimit = 15;

    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    const addCustomGoogleStyles = () => {
      const style = document.createElement("style");
      style.innerHTML = `
    .goog-tooltip, .goog-tooltip:hover {
      display: none !important;
    }
    .goog-text-highlight {
      background: none !important;
      box-shadow: none !important;
    }
  `;
      document.head.appendChild(style);
    };

    const initializeGoogleTranslate = () => {
      if (window.google?.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "fr",
              includedLanguages: "fr,en,es,pt,ht",
              layout:
                window.google.translate.TranslateElement.InlineLayout
                  .HORIZONTAL || 0,
            },
            "google_translate_element"
          );
          setIsLoading(false);
          setError(false);
        } catch (e) {
          console.warn("Erreur d'initialisation :", e);
          setError(true);
        }
      } else if (retryCount < retryLimit) {
        setRetryCount((count) => count + 1);
        console.warn("Google Translate non prêt, nouvelle tentative...");
        setTimeout(initializeGoogleTranslate, 2000);
      } else {
        setIsLoading(false);
        setError(true);
        console.error("Échec du chargement de Google Translate");
      }
    };

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (isOnline) {
      setIsLoading(true);
      addGoogleTranslateScript();
      // addCustomGoogleStyles();
      setTimeout(() => {
        if (!window.google?.translate) {
          initializeGoogleTranslate();
        }
      }, 1000);
    }

    // 🔁 Réinitialiser l'état
    const container = document.getElementById("google_translate_element");
    if (container) container.innerHTML = "";

    if (window.google && window.google.translate) {
      delete window.google.translate.TranslateElement;
    }

    setRetryCount(0);
    setIsLoading(true);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [isOnline, retryCount]);

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

            {/* {isOnline ? (
          <div className="min-w-[50vw] flex flex-col items-center gap-4">
            {isLoading && !error && (
              <div className="text-sm text-gray-500 animate-pulse">
                Chargement de Google Translate...
              </div>
            )}
            {error && (
              <div className="text-red-500 font-semibold text-sm">
                ❌ Échec du chargement de la traduction. Veuillez réessayer.
              </div>
            )}
            <div className="w-full scale-110">
              <div
                id="google_translate_element"
                className="w-full min-w-[80vw] md:min-w-[20vw] text-4xl rounded-lg px-4 border border-gray-200 bg-gray-50"
              ></div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-semibold text-lg">
            Le service de traduction n'est pas disponible hors ligne.
          </p>
        )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;
