import React, { useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Initialisation d'i18next avec les traductions intégrées
i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        welcome: "Bienvenue",
        language: "Langue"
      }
    },
    en: {
      translation: {
        welcome: "Welcome",
        language: "Language"
      }
    },
    es: {
      translation: {
        welcome: "Bienvenido",
        language: "Idioma"
      }
    },
    pt: {
      translation: {
        welcome: "Bem-vindo",
        language: "Idioma"
      }
    },
    ht: {
      translation: {
        welcome: "Byenveni",
        language: "Lang"
      }
    }
  },
  lng: "fr", // Langue par défaut
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false
  }
});

// Composant principal
const LanguageComponent = () => {
  const { t } = useTranslation(); // Hook pour utiliser les traductions
  const [currentLang, setCurrentLang] = useState("fr"); // Langue actuelle

  // Changer la langue
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <div>
      {/* Sélecteur de langue */}
      <div>
        <label>{t('language')}: </label>
        <select
          value={currentLang}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="ht">Kreyòl</option>
        </select>
      </div>

      {/* Texte traduit */}
      <div>
        <h1>{t('welcome')}</h1>
      </div>
    </div>
  );
};

export default LanguageComponent;
