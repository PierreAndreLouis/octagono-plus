import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";

const GoogleTranslate = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { chooseOtherLanguagePopup, setChooseOtherLanguagePopup } =
    useContext(DataContext);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onload = () => {
          if (window.google && window.google.translate) {
            initializeGoogleTranslate();
          }
        };
        document.body.appendChild(script);
      } else if (window.google && window.google.translate) {
        initializeGoogleTranslate();
      }
    };

    const initializeGoogleTranslate = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "fr,en,es,pt,ht",
          // includedLanguages: "fr,en,es,pt,ht",
          layout:
            window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        "google_translate_element"
      );
    };

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (isOnline) {
      addGoogleTranslateScript();
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [isOnline]);

  return (
    <div className=" fixed inset-0  bg-black/50  dark:bg-gray-700  z-[2099999999999999999] flex justify-center items-center">
      <div className="min-h-[40vh] min-w-[95vw] md:min-w-[60vw] bg-white relative rounded-lg p-4 flex justify-center items-center">
        <h2 className="absolute z-[9999] top-0 left-0 right-0 mt-3 text-center font-semibold">
          Choisissez une langue
        </h2>
        <button
          onClick={() => {
            setChooseOtherLanguagePopup(false);
          }}
          className="absolute z-[9999] bg-orange-500 text-white py-1 px-4 rounded-lg  right-4 bottom-4 mt-3 text-center font-semibold"
        >
          Terminer
        </button>
        <IoClose
          onClick={() => {
            setChooseOtherLanguagePopup(false);
          }}
          className="absolute top-4 right-4 text-[1.4rem] cursor-pointer text-red-500"
        />
        {isOnline ? (
          <div className="min-w-[50vw]  flex flex-col">
            <div className=" w-full ">
              <div className=" scale-110">
                {/* <GoogleTranslate /> */}
                <div
                  id="google_translate_element"
                  className="w-full text-4xl border-- rounded-lg px-4 border-gray-200 bg-gray-50"
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-semibold text-lg">
            Le service de traduction n'est pas disponible hors ligne.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;
