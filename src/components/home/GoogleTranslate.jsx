import React, { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    <div>
      {isOnline ? (
        <div
          id="google_translate_element"
          className="w-full text-4xl border-- rounded-lg px-4 border-gray-500 bg-gray-50"
        ></div>
      ) : (
        <p className="text-red-500 text-xl">
          Le service de traduction n'est pas disponible hors ligne.
        </p>
      )}
    </div>
  );
};

export default GoogleTranslate;

// import React, { useEffect } from "react";

// const GoogleTranslate = () => {
//   useEffect(() => {
//     const addGoogleTranslateScript = () => {
//       // Vérifier si le script existe déjà pour éviter des conflits
//       if (!document.getElementById("google-translate-script")) {
//         const script = document.createElement("script");
//         script.id = "google-translate-script";
//         script.src =
//           "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//         script.async = true;
//         script.onload = () => {
//           if (window.google && window.google.translate) {
//             initializeGoogleTranslate();
//           }
//         };
//         document.body.appendChild(script);
//       } else if (window.google && window.google.translate) {
//         initializeGoogleTranslate();
//       }
//     };

//     const initializeGoogleTranslate = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "fr", // Langue par défaut
//           includedLanguages: "fr,en,es,pt,ht", // Langues disponibles
//           layout:
//             window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
//         },
//         "google_translate_element"
//       );
//     };

//     // Définir la fonction globale appelée par le script
//     window.googleTranslateElementInit = initializeGoogleTranslate;

//     addGoogleTranslateScript();
//   }, []);

//   return (
//     <div>
//       <div
//         id="google_translate_element"
//         className="w-full text-4xl border rounded-lg px-4 border-gray-500 bg-gray-50"
//       ></div>
//     </div>
//   );
// };

// export default GoogleTranslate;
