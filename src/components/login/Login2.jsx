import React, { useContext, useEffect, useState } from "react";
import Flag from "react-world-flags";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext.jsx";
import InstallationPWA from "../../pages/InstallationPWA.jsx";
import { GrInstallOption } from "react-icons/gr";
import GoogleTranslate from "../home/GoogleTranslate.jsx";

function Login2({ setShowLogin }) {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { handleLogin, error, isLoading } = useContext(DataContext);
  const [rememberMe, setRememberMe] = useState(false); // Ajout de l'état pour "Se souvenir de moi"

  const languages = [
    { code: "en", name: "English", countryCode: "GB" },
    { code: "fr", name: "Français", countryCode: "FR" },
    { code: "es", name: "Español", countryCode: "ES" },
  ];
  const [formData, setFormData] = useState({
    account: "",
    username: "",
    password: "",
  });

  // Récupérer les informations depuis localStorage au montage
  useEffect(() => {
    const savedCredentials = JSON.parse(
      localStorage.getItem("userCredentials")
    );
    if (savedCredentials) {
      setFormData(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { account, username, password } = formData;

    if (rememberMe) {
      localStorage.setItem(
        "userCredentials",
        JSON.stringify({ account, username, password })
      );
    } else {
      localStorage.removeItem("userCredentials");
    }

    handleLogin(account, username, password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeLanguage = (lang) => {
    setSelectedLang(lang.code);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 pb-12 lg:px-8 ">
        <div className="flex justify-end">
          <div className="relative inline-block text-left  mt-4  mb-12 md:mb-0">
            {/* <div>
              <button
                type="button"
                onClick={toggleMenu} // Ouvre/ferme le menu
                className="inline-flex justify-between w-full rounded-lg border dark:border-gray-600 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm dark:bg-gray-900/30 dark:text-gray-50 font-medium text-gray-700 hover:bg-gray-50 -----focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <Flag
                    code={
                      languages.find((lang) => lang.code === selectedLang)
                        .countryCode
                    }
                    className="w-6 h-4"
                  />
                  <span>
                    {languages.find((lang) => lang.code === selectedLang).name}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
            </div> */}

            {isOpen && ( // Affiche le menu si `isOpen` est vrai
              <div className="origin-top-right  absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-white dark:bg-gray-900/70 ring-1 ring-black ring-opacity-5 -----focus:outline-none z-10">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleChangeLanguage(lang)} // Sélectionne la langue et ferme le menu
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100-- -----focus:bg-gray-200"
                    >
                      <Flag code={lang.countryCode} className="w-6 h-4" />
                      <span className="dark:text-white">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/img/cars/logo.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-4 dark:text-gray-100 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Bienvenue à Octagono Plus
          </h2>
          <div className="flex justify-center items-center gap-2">
            <p className="text-center cursor-pointer">
              {/* <GrInstallOption /> */}
              <InstallationPWA />
              {/* Installer l'application */}
            </p>
          </div>
          <div className="flex fixed top-10 right-6 items-center mx-auto gap-3 justify-center">
            <h3>Language</h3>
            <div className="h-[2.3rem]  w-[10rem] border rounded-lg overflow-hidden">
              <GoogleTranslate />
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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

            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
              >
                {isLoading ? "Chargement..." : "Se connecter"}
              </button>
            </div>
          </form>

          {/*  */}

          {/*  */}

          {changePassword && (
            <div
              id=""
              className={
                "fixed flex w-full bg-white justify-center left-0 right-0 top-0 h-full"
              }
            >
              <div className=" h-fulle w-full flex justify-center  pb-3">
                <div className="bg-white max-w-[30remx] md:px-[20vw] lg:px-[28vw] w-full  shadow-lg overflow-auto">
                  <div className="flex justify-center items-center w-full py-2 pt-10 mb-10">
                    <RiLockPasswordFill className="text-2xl mr-2 text-blue-500" />
                    <h3 className="text-center font-semibold text-gray-600 text-xl">
                      Changer de mot de passe
                    </h3>
                  </div>
                  <form
                    action="#"
                    method="POST"
                    className="space-y-4 px-4 pb-4"
                  >
                    <div>
                      <label
                        htmlFor="account"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Compte
                      </label>
                      <div className="mt-2">
                        <input
                          id="account"
                          name="account"
                          type="text"
                          placeholder="nom du compte"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 -----focus:ring-2 -----focus:ring-inset -----focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nom d'utilisateur
                      </label>
                      <div className="mt-2">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="nom"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 -----focus:ring-2 -----focus:ring-inset -----focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Mot de passe
                      </label>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="password"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 -----focus:ring-2 -----focus:ring-inset -----focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nouveau mot de passe
                      </label>
                      <div className="mt-2">
                        <input
                          id="new-password"
                          name="new-password"
                          type="password"
                          placeholder="password"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 -----focus:ring-2 -----focus:ring-inset -----focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Confirmer mot de passe
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          placeholder="password"
                          required
                          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 -----focus:ring-2 -----focus:ring-inset -----focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-10">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 -----focus-visible:outline -----focus-visible:outline-2 -----focus-visible:outline-offset-2 -----focus-visible:outline-indigo-600"
                      >
                        Modifier
                      </button>
                      <div
                        onClick={() => {
                          setChangePassword(false);
                        }}
                        className="flex cursor-pointer w-full justify-center rounded-md border text-indigo-500 border-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm -----focus-visible:outline -----focus-visible:outline-2 -----focus-visible:outline-offset-2 -----focus-visible:outline-indigo-600"
                      >
                        Annuler
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login2;
