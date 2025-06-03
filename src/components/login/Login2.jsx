import React, { useContext, useEffect, useState } from "react";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import { DataContext } from "../../context/DataContext.jsx";
import InstallationPWA from "../../pages/InstallationPWA.jsx";
import GoogleTranslate from "../home/GoogleTranslate.jsx";
import { Link } from "react-router-dom";
import { FaAddressBook, FaBook } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";

function Login2() {
  const {
    handleLogin,
    error,
    adminAccount,
    isHomePageLoading,
    setReadDocumentation,
    setChooseOtherLanguagePopup,
    chooseOtherLanguagePopup,
  } = useContext(DataContext);
  let x;
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("userCredentials") ? true : false
  );

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("userCredentials");
    return savedData
      ? JSON.parse(savedData)
      : { account: "", username: "", password: "" };
  });

  // Sauvegarde ou suppression instantanée des données dès qu'il y a un changement
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("userCredentials", JSON.stringify(formData));
    } else {
      localStorage.removeItem("userCredentials");
    }
  }, [formData, rememberMe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { account, username, password } = formData;
    handleLogin(account, username, password);
  };

  const demoAccountLogin = () => {
    handleLogin("demo", "admin", "112233");
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  x;

  return (
    <div>
      {/* <GoogleTranslate /> */}

      <div className="fixed top-0 right-4  ">
        <div
          onClick={() => {
            // closeSideBar();
            setChooseOtherLanguagePopup(true);
          }}
          className={` flex items-center  gap-2   border-b border-b-gray-200 py-1 mt-2 hover:bg-orange-50 cursor-pointer px-3`}
        >
          <MdGTranslate className="text-xl min-w-[1.5rem] text-blue-400" />
          <div className="flex w-full justify-between">
            <p className="text-gray-600 text-[1rem] font-semibold">
              Traduction
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-[90vh]  pt-32 flex-1 flex-col justify-center px-6 pb-12   lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
          <img
            alt="Your Company"
            src="/img/cars/logo.png"
            className="mx-auto h-20 w-auto"
          />
          <h2
            onClick={() => {
              console.log(adminAccount);
            }}
            className="mt-4 dark:text-gray-100 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Bienvenue à Octagono Plus
          </h2>
          <div className="flex justify-center items-center gap-2">
            <p className="text-center cursor-pointer">
              {/* Installer l'application */}
              <InstallationPWA />
            </p>
          </div>
        </div>

        <div className="mt-10   sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={formData.account}
                  onChange={handleChange}
                  placeholder="Nom du compte"
                  required
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
                />
              </div>
            </div>

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
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nom d'utilisateur"
                  required
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  required
                  autoComplete="current-password"
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-between gap-2 items-center">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-indigo-500"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div
                // to="/gestion_geofences?tab=geozone"
                onClick={() => {
                  setReadDocumentation(true);
                  // setShowSideBar(true);
                  // handleTabClick("geozone");
                }}
                className={`flex text-gray-600  py-4 gap-2 text-lg hover:text-orange-500 cursor-pointer items-center $ dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
              >
                <FaBook className="text-blue-600" />
                <h3 className="text-sm">Manuel d'utilisation</h3>
              </div>
            </div>
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isHomePageLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
              >
                {isHomePageLoading ? "Chargement..." : "Se connecter"}
              </button>
              <div>
                {isHomePageLoading ? (
                  <div className="flex w-full justify-center rounded-md hover:bg-indigo-50 border border-indigo-500 text-gray-800 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 cursor-pointer mt-3 dark:focus:ring-indigo-400">
                    Chargement...
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      demoAccountLogin();
                    }}
                    className="flex w-full justify-center rounded-md hover:bg-indigo-50 border border-indigo-500 text-gray-800 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 cursor-pointer mt-3 dark:focus:ring-indigo-400"
                  >
                    Compte Demo
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login2;
