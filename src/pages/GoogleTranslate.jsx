import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Fonction pour initialiser Google Translate
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en", // Langue source de la page
            includedLanguages: "en,fr,es,ht", // Limite les langues (anglais, français, espagnol, créole)
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE, // Affiche les options de manière simple
          },
          "google_translate_element"
        );
      };
    };

    if (!window.google || !window.google.translate) {
      addGoogleTranslateScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  const handleButtonClick = () => {
    console.log("start translating.....");
    const translateContainer = document.getElementById(
      "google_translate_element"
    );
    if (translateContainer) {
      translateContainer.style.display = "block"; // Affiche le sélecteur
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Traduire cette page</button>
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default GoogleTranslate;
