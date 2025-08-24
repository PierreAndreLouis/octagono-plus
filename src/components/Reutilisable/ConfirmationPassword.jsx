import React from "react";
import { useTranslation } from "react-i18next";

function ConfirmationPassword({
  showConfirmPassword,
  handlePasswordCheck,
  setInputPassword,
  errorMessage,
  setErrorMessage,
  setShowConfirmPassword,
  inputPassword,
  setIsPasswordConfirmed,
}) {
  const [t, i18n] = useTranslation();

  return (
    <>
      {showConfirmPassword && (
        <div className="fixed  z-[999999999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                {t("Veuillez entrer votre mot de passe")}
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("Mot de passe")}
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                // onClick={handlePasswordCheck}
                className="py-1 px-5 bg-orange-500 rounded-lg text-white"
              >
                {t("Confirmer")}
              </button>

              <h3
                onClick={() => {
                  setErrorMessage("");
                  setInputPassword("");
                  setShowConfirmPassword(false);
                  setIsPasswordConfirmed(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                {t("Annuler")}
              </h3>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ConfirmationPassword;
