import React from "react";

const LanguageSwitcher = () => {
  const handleTranslate = (lang) => {
    const currentURL = window.location.href;
    const translateURL = `https://translate.google.com/translate?hl=${lang}&sl=auto&tl=${lang}&u=${encodeURIComponent(
      currentURL
    )}`;
    window.location.href = translateURL;
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold mb-4">Choisissez une langue :</h3>
      <div className="space-x-4">
        <button
          onClick={() => handleTranslate("fr")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Français
        </button>
        <button
          onClick={() => handleTranslate("en")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Anglais
        </button>
        <button
          onClick={() => handleTranslate("es")}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Espagnol
        </button>
        <button
          onClick={() => handleTranslate("pt")}
          className="bg-yellow-500 text-white py-2 px-4 rounded"
        >
          Portugais
        </button>
        <button
          onClick={() => handleTranslate("ht")}
          className="bg-purple-500 text-white py-2 px-4 rounded"
        >
          Créole
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
