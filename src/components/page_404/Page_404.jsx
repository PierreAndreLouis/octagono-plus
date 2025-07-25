import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Page_404() {
  const [t, i18n] = useTranslation();

  return (
    <div>
      {/* <div>
        <h1>404 - Page non trouvée</h1>
        <p>Oups ! La page que vous recherchez n'existe pas.</p>
        <Link to="/home">Retourner à l'accueil</Link>
      </div> */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mb-8">
            <h2 className="mt-6 text-6xl font-extrabold text-gray-900 dark:text-gray-100">
              404
            </h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("Page non trouvée")}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("Oups ! La page que vous recherchez n'existe pas")}.
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/home"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h18m-9-9l9 9-9 9"
                />
              </svg>
              {t("Retour à l'accueil")}{" "}
            </Link>
          </div>
        </div>
        <div className="mt-16 w-full max-w-2xl">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                {t(
                  "Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page_404;
