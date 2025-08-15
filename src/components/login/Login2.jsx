import React, { useContext, useEffect, useState } from "react";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import { DataContext } from "../../context/DataContext.jsx";
import InstallationPWA from "../../pages/InstallationPWA.jsx";
import GoogleTranslate from "../home/GoogleTranslate.jsx";
import { Link } from "react-router-dom";
import { FaAddressBook, FaBook } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import {
  IoChevronDownCircleOutline,
  IoChevronDownCircleSharp,
} from "react-icons/io5";

function Login2() {
  const { handleLogin, error, isHomePageLoading } = useContext(DataContext);
  let x;

  const [t, i18n] = useTranslation();

  const savedLang = localStorage.getItem("lang") || "fr";

  const changeLang = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

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

  const defaultCountry = "ht";
  const defaultLang = "fr";

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("userCredentials");
    return savedData
      ? JSON.parse(savedData)
      : { account: "", username: "", password: "", country: defaultCountry };
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
    setCountryAndLanguage(); // 2e vérification avant login
    const { account, username, password, country } = formData;
    handleLogin(account, username, password, country);
  };

  const demoAccountLogin = () => {
    const { account, username, password, country } = formData;
    setCountryAndLanguage(); // 2e vérification aussi
    handleLogin("demo", "admin", "112233", country);
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

  const [isShowPassword, setIsShowPassword] = useState(false);

  const setCountryAndLanguage = () => {
    const host = window.location.hostname.replace(/^www\./, "");

    let country = "ht";
    let lang = "fr";

    if (host === "octagonogps.com.do" || host === "app.octagonogps.com.do") {
      country = "rd";
      lang = "es";
    } else if (host === "octagonoplus.com") {
      country = "ht";
      lang = "fr";
    }

    setFormData((prev) => ({ ...prev, country }));
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    localStorage.setItem("currentCountry", country);
  };

  useEffect(() => {
    setCountryAndLanguage();
  }, []);

  const [showLangueAndCountryOption, setShowLangueAndCountryOption] =
    useState(false);
  return (
    <div>
      <div className="flex min-h-[90vh]  pt-14 md:pt-8 flex-1 flex-col justify-center px-6 pb-32   lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
          <div className=" flex  gap-5 justify-center items-center">
            <div className=" flex  gap-5 justify-center items-center scale-75 md:scale-100">
              {/* {formData.country === "ht" ? ( */}
              <div className="order flex flex-col justify-center items-center">
                <img
                  alt="Your Company"
                  src="/img/cars/logo.png"
                  className="mx-auto-- translate-y-0 w-[4.4rem] w-auto-- "
                />
                <h2 className="text-blue-900 text-[1.3rem] font-bold mb-1.5">
                  OCTAGONO<span className="text-orange-500">PLUS</span>
                </h2>
              </div>
              {/* ) : formData.country ? ( */}
              <img
                alt="Your Company"
                src="/img/logo/OctagonoGPS.png"
                className="mx-auto-- w-[10rem]  w-auto--"
              />
              {/* ) : (
              "Auccun pays"
            )} */}
            </div>
          </div>
          {/* <h2
            // onClick={() => {
            //   console.log(adminAccount);
            // }}
            className="mt-4 dark:text-gray-100 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            {t("Bienvenue à Octagono Plus")}
          </h2> */}
          <div className="flex justify-center items-center gap-2">
            <p className="text-center cursor-pointer">
              {/* Installer l'application */}
              <InstallationPWA />
            </p>
          </div>
          <IoChevronDownCircleSharp
            onClick={() => {
              setShowLangueAndCountryOption(!showLangueAndCountryOption);
            }}
            className={` ${
              showLangueAndCountryOption ? "rotate-180" : ""
            }  mx-auto text-[1.7rem] text-gray-400  transition-all cursor-pointer hover:text-orange-400 min-h-[3rem] px-[.78rem]  -translate-y-[.61rem] min-w-[3rem]`}
          />
        </div>

        <div className="mt-2   sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              {showLangueAndCountryOption && (
                <div className="grid grid-cols-2 justify-center items-center gap-2">
                  <div className="mb-4 ">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {t("Pays")}
                    </label>
                    <div className="mt-2 ">
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="block w-full bg-white rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:focus:ring-indigo-500"
                      >
                        <option value="">{t("Sélectionner un pays")}</option>
                        <option value="ht">{t("Haïti")}</option>
                        <option value="rd">República Dominicana</option>
                      </select>
                    </div>
                  </div>{" "}
                  <div className="mb-4 ">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {t("Language")}
                    </label>
                    <div className="mt-2 ">
                      <select
                        id="country"
                        name="country"
                        value={savedLang}
                        onChange={changeLang}
                        required
                        className="block bg-white w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:focus:ring-indigo-500"
                      >
                        <option value="">{t("Sélectionner une langue")}</option>
                        <option value="fr">{t("Français")}</option>
                        <option value="es">{t("Espagnol")}</option>
                        <option value="en">{t("Anglais")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <label
                htmlFor="account"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {t("Compte")}
              </label>
              <div className="mt-2 ">
                <input
                  id="account"
                  name="account"
                  type="text"
                  value={formData.account}
                  onChange={handleChange}
                  placeholder={`${t("Nom du compte")}`}
                  required
                  className="block bg-white px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {t("Nom d'utilisateur")}
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={`${t("Nom d'utilisateur")}`}
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
                {t("Mot de passe")}
              </label>
              <div className="mt-2  relative">
                {isShowPassword ? (
                  <IoMdEye
                    onClick={() => {
                      setIsShowPassword(!isShowPassword);
                    }}
                    className="absolute right-2 text-lg top-2 cursor-pointer min-w-[2rem]"
                  />
                ) : (
                  <IoMdEyeOff
                    onClick={() => {
                      setIsShowPassword(!isShowPassword);
                    }}
                    className="absolute right-2 text-lg top-2 cursor-pointer min-w-[2rem]"
                  />
                )}
                {/* <IoMdEyeOff className="absolute right-2 text-lg top-2 cursor-pointer min-w-[2rem]" /> */}

                <input
                  id="password"
                  name="password"
                  type={`${isShowPassword ? "text" : "password"}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={`${t("Mot de passe")}`}
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
                  {t("Se souvenir de moi")}
                </label>
              </div>

              {/* <div
                // to="/gestion_geofences?tab=geozone"
                onClick={() => {
                  setReadDocumentation(true);
                  // setShowSideBar(true);
                  // handleTabClick("geozone");
                }}
                className={`flex text-gray-600  py-4 gap-2 text-lg hover:text-orange-500 cursor-pointer items-center $ dark:text-gray-300 dark:border-gray-600 dark:hover:text-orange-400`}
              >
                <FaBook className="text-blue-600" />
                <h3 className="text-sm">{t("Manuel d'utilisation")}</h3>
              </div> */}
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
                {isHomePageLoading
                  ? `${t("Chargement")}...`
                  : `${t("Se connecter")}`}
              </button>
              <div>
                {isHomePageLoading ? (
                  <div className="flex w-full justify-center rounded-md hover:bg-indigo-50 border border-indigo-500 text-gray-800 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 cursor-pointer mt-3 dark:focus:ring-indigo-400">
                    {t("Chargement")}...
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      demoAccountLogin();
                    }}
                    className="flex w-full justify-center rounded-md hover:bg-indigo-50 border border-indigo-500 text-gray-800 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 cursor-pointer mt-3 dark:focus:ring-indigo-400"
                  >
                    {t("Compte Demo")}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* <div className="flex justify-end pb-4">
        <p className="mr-6 mt-6 font-semibold ">
          {t("version")} : {versionApplication}
        </p>
      </div> */}
    </div>
  );
}

export default Login2;
