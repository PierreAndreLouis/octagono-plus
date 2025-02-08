import React, { useContext, useEffect, useState } from "react";
import { RiLockPasswordLine, RiLockPasswordFill } from "react-icons/ri";
import { DataContext } from "../../context/DataContext.jsx";
import InstallationPWA from "../../pages/InstallationPWA.jsx";
import GoogleTranslate from "../home/GoogleTranslate.jsx";

function Login2() {
  const { handleLogin, error, isHomePageLoading } = useContext(DataContext);
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
      <GoogleTranslate />
      <div className="flex min-h-[90vh]  pt-32 flex-1 flex-col justify-center px-6 pb-12   lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
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
                disabled={isHomePageLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-400"
              >
                {isHomePageLoading ? "Chargement..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login2;
