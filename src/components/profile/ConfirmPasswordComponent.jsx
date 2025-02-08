import React from "react";

function ConfirmPasswordComponent({
  showChangePasswordPopup,
  handlePasswordCheck,
  inputPassword,
  setInputPassword,
  errorMessage,
  setShowChangePasswordPopup,
  setIsPasswordConfirmed,
  setErrorMessage,
}) {
  return (
    <>
      {showChangePasswordPopup && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50 dark:bg-black/70">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white dark:bg-gray-700 max-w-[25rem] p-6 rounded-xl w-[80vw] shadow-lg"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center leading-6 text-gray-500 dark:text-gray-300 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="px-3 w-full dark:bg-gray-800 rounded-md py-1.5 text-gray-900 dark:text-gray-100 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-gray-400 dark:border-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button
                type="submit"
                className="py-1 px-5 bg-orange-500 dark:bg-orange-600 rounded-lg text-white dark:text-gray-100 shadow hover:bg-orange-600 dark:hover:bg-orange-700"
              >
                Confirmer
              </button>

              <div
                onClick={() => {
                  setShowChangePasswordPopup(false);
                  setIsPasswordConfirmed(false);
                  setErrorMessage("");
                  setInputPassword("");
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 dark:text-orange-400 rounded-lg font-semibold border border-orange-500 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900"
              >
                Annuler
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ConfirmPasswordComponent;
