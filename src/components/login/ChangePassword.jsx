import React, { useContext } from "react";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import { DataContext } from "../../context/DataContext";
// import Navigation_bar from "../home/Navigation_bar";
// import PC_header from "../home/PC_header";
import { Link } from "react-router-dom";

function ChangePassword() {
  const {
    currentVéhicule,
    setIsPasswordConfirmed,
    account,
    username,
    password,
    userData,
  } = useContext(DataContext); // Récupération des données depuis le contexte

  return (
    <div className="pb-20 mt-14 bg-gray-100 dark:bg-gray-800">
      {/* <Navigation_bar />
      <PC_header /> */}
      <div className="flex w-full justify-center">
        <div className="w-full flex justify-center pb-3">
          <div className="bg-white dark:bg-gray-900/50 mt-8 pb-10 mx-4 dark:text-gray-100  max-w-[40rem] w-full shadow-lg overflow-auto rounded-md">
            <div className="flex justify-center items-center w-full py-2 pt-6 mb-10">
              <RiLockPasswordFill className="text-2xl mr-2 text-orange-500 dark:text-orange-400" />
              <h3
                // onClick={() => {
                //   console.log(userData);
                // }}
                className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl"
              >
                Changer de mot de passe
              </h3>
            </div>
            <form action="#" method="POST" className="space-y-4 px-4 pb-4">
              {/* Champ Compte */}
              <div>
                <label
                  htmlFor="account"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Compte
                </label>
                <div className="mt-2">
                  <input
                    id="account"
                    name="account"
                    type="text"
                    value={account || "-----"}
                    placeholder="Nom du compte"
                    required
                    readOnly
                    className="block px-3 placeholder:dark:text-gray-300 dark:bg-gray-700 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Champ Nom d'utilisateur */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Nom d'utilisateur
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username || "---"}
                    placeholder="Nom d'utilisateur"
                    required
                    readOnly
                    className="block px-3 placeholder:dark:text-gray-300 dark:bg-gray-700 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Champ Mot de passe actuel */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Mot de passe actuel
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    value={password || "-----"}
                    type="text"
                    placeholder="Mot de passe actuel"
                    required
                    readOnly
                    className="block px-3 placeholder:dark:text-gray-300 dark:bg-gray-700 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Champ Nouveau mot de passe */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Nouveau mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    required
                    className="block px-3 placeholder:dark:text-gray-300 dark:bg-gray-700 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Champ Confirmation du mot de passe */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Confirmer le mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    required
                    className="block px-3 placeholder:dark:text-gray-300 dark:bg-gray-700 w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100  shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Boutons Modifier et Annuler */}
              <div className="grid mb-20 grid-cols-2 gap-2 pt-10">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-orange-500 dark:bg-orange-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 dark:hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  Modifier
                </button>
                <Link
                  to="/User_Profile"
                  onClick={() => {
                    setIsPasswordConfirmed(false);
                  }}
                  className="flex cursor-pointer w-full justify-center rounded-md border text-orange-500 border-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
