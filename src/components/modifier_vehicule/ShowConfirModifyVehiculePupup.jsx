import React from "react";

function ShowConfirModifyVehiculePupup({
  showConfirmAddVéhiculePopup,
  handlePasswordCheck,
  inputPassword,
  setInputPassword,
  errorMessage,
  setShowConfirmAddVéhiculePopup,
  setErrorMessage,
}) {
  return (
    <>
      {showConfirmAddVéhiculePopup && (
        <div className="fixed z-10 flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white dark:shadow-gray-600--- dark:shadow-lg dark:border dark:border-gray-600  dark:bg-gray-700 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center leading-6 text-gray-500 dark:text-gray-100 mb-3"
              >
                Veuillez saisir votre mot de passe{" "}
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
                  className=" dark:bg-gray-800 px-3 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100 shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-300 border border-gray-400 dark:border-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button className="py-1 px-5 bg-orange-500 rounded-lg text-white dark:bg-orange-600">
                Confirmer{" "}
              </button>

              <h3
                onClick={() => {
                  setErrorMessage("");
                  setInputPassword("");
                  setShowConfirmAddVéhiculePopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 dark:text-orange-400 rounded-lg font-semibold border border-orange-500 dark:border-orange-400"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ShowConfirModifyVehiculePupup;
