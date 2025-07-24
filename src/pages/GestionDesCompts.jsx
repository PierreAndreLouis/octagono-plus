import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";

import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import LoadingPageEffectCircle from "../components/Reutilisable/LoadingPageEffectCircle";
import {
  IoClose,
  IoCloseOutline,
  IoOptions,
  IoSearchOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { FaPlusCircle } from "react-icons/fa";
import { MdSwitchAccount } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function GestionDesCompts({
  setDocumentationPage,
  showChooseItemToModifyMessage,
  setshowChooseItemToModifyMessage,
  showChooseItemToModifyPage,
}) {
  const {
    FormatDateHeure,
    gestionAccountData,
    setCurrentAccountSelected,
    currentAccountSelected,
    getAllAccountsDataLoading,
    setCurrentSelectedUserToConnect,
    setShowAccountOptionsPopup,

    adminPassword,
    currentCountry,
    handleLogin,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();

  const navigate = useNavigate();

  const [inputSearchItem, setInputSearchItem] = useState("");

  const filterListeDesCompte = inputSearchItem
    ? gestionAccountData.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(inputSearchItem.toLowerCase()) ||
          item?.accountID.toLowerCase().includes(inputSearchItem.toLowerCase())
      )
    : gestionAccountData;

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const [seConnecterAutreComptePopup, setSeConnecterAutreComptePopup] =
    useState(false);

  const [inputPassword, setInputPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting
    console.log("Clicked......");

    if (inputPassword === adminPassword) {
      console.log("Clicked...... 222");

      const sendConnectionMail = false;
      setSeConnecterAutreComptePopup(false);
      const localStorageCurrentCountry = localStorage.getItem("currentCountry");

      handleLogin(
        currentAccountSelected?.accountID,
        "admin",
        currentAccountSelected?.password,
        localStorageCurrentCountry || currentCountry,
        sendConnectionMail
      );

      setDocumentationPage("Dashboard");
      navigate("/Dashboard");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const nombreDeRésultatParClique = 10;

  const [voir10RésultatPlus, setVoir10RésultatPlus] = useState(1);

  const filterListeDesComptePagination =
    filterListeDesCompte &&
    filterListeDesCompte
      .sort((a, b) => b?.accountDevices?.length - a?.accountDevices?.length)
      ?.slice(0, voir10RésultatPlus * nombreDeRésultatParClique);

  const afficherPlusDeRésultat = () => {
    setVoir10RésultatPlus((prev) => prev + 1);
  };

  return (
    <div>
      <div>
        <LoadingPageEffectCircle
          getAllAccountsDataLoading={getAllAccountsDataLoading}
        />

        {seConnecterAutreComptePopup && (
          <div className="fixed  z-[9999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
            <form
              onSubmit={handlePasswordCheck}
              className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
            >
              <div className="bg-orange-600 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
                {t("Voulez-vous changer de Compte ?")}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
                >
                  {t("Veuillez entrer votre mot de passe")}
                </label>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={`${t("Mot de passe")}`}
                    required
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value);

                      setErrorMessage("");
                    }}
                    className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 justify-start mt-5">
                <button className="py-1 px-5 bg-orange-500 rounded-lg text-white">
                  {t("Confirmer")}
                </button>

                <h3
                  onClick={() => {
                    setSeConnecterAutreComptePopup(false);
                  }}
                  className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
                >
                  {t("Annuler")}
                </h3>
              </div>
            </form>
          </div>
        )}

        <div className="px-4 pt-10 mt-4-- pb-40 bg-white rounded-lg">
          <h2 className="mt-[10rem]-- text-lg text-center font-bold ">
            {t("Gestion Des Comptes")} ({filterListeDesCompte?.length})
          </h2>

          <div className="flex  justify-center mt-4">
            <button
              onClick={() => {
                setDocumentationPage("Ajouter_nouveau_compte");
                navigate("/Ajouter_nouveau_compte");
              }}
              className="bg-orange-500 w-full max-w-[30rem] shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3">
                <FaPlusCircle className="text-2xl" />
                <p className="text-[1rem] text-center">
                  {t("Ajouter un nouveau Compte")}
                </p>
              </div>
            </button>{" "}
          </div>
          <div className="flex mt-4 max-w-[30rem] mx-auto justify-between items-center gap-2 ">
            <div className="mx-auto border w-full border-gray-400 rounded-md flex items-center justify-between max-w-[30rem] ">
              <input
                id="text"
                name="text"
                type="text"
                placeholder={`${t("Rechercher un compte")}`}
                required
                value={inputSearchItem}
                onChange={(e) => setInputSearchItem(e.target.value)}
                className=" px-3 w-full focus:outline-0  dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />

              <IoSearchOutline className="text-2xl text-gray-500 border-l cursor-pointer border-l-gray-400 min-w-[3rem]" />
            </div>
          </div>
          {/* Liste des Comptes */}
          <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
            {showChooseItemToModifyMessage &&
              showChooseItemToModifyPage === "Gestion_des_comptes" && (
                <div className=" flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                  <p className="w-full">{showChooseItemToModifyMessage}</p>
                  <IoClose
                    onClick={() => {
                      setshowChooseItemToModifyMessage("");
                    }}
                  />
                </div>
              )}
            {filterListeDesComptePagination?.map((account, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    // setCurrentAccountSelected(account);
                    setCurrentSelectedUserToConnect(null);
                  }}
                  className="shadow-lg-- shadow-inner shadow-black/10 bg-gray-50 /50 relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
                >
                  <div className="bg-gray-100-- pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                    {index + 1}
                  </div>
                  <div className="flex  gap-3  w-full">
                    <MdSwitchAccount className="text-[3rem] hidden sm:block text-orange-500" />
                    <div className=" w-full  flex flex-wrap sm:flex-nowrap justify-between items-end gap-x-4 ">
                      <div className="w-full ">
                        <MdSwitchAccount className="text-[3rem] sm:hidden text-orange-500" />
                        <div className="flex flex-wrap">
                          <p className="font-bold- text-gray-700">
                            {t("Nom du Compte")} :
                          </p>
                          <span className="notranslate notranslate notranslate dark:text-orange-500 font-bold text-gray-600 pl-5">
                            {account?.description}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap">
                          <p className="font-bold- text-gray-700">
                            {t("ID du Compte")} :
                          </p>
                          <span className=" dark:text-orange-500 notranslate font-bold text-gray-600 pl-5">
                            {account?.accountID}
                          </span>
                        </div>{" "}
                        {/*  */}
                        {/*  */}
                        <div className="flex flex-wrap mt-1">
                          <p className="font-bold- text-gray-700">
                            {t("Nombre d'appareils")} :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {account?.accountDevices?.length}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap mt-1">
                          <p className="font-bold- text-gray-700">
                            {t("Nombre d'utilisateurs")} :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {account?.accountUsers?.length}
                          </span>
                        </div>{" "}
                        {/*  */}
                        {/*  */}
                        <div className="flex flex-wrap mt-1">
                          <p className="font-bold- text-gray-700">
                            {t("Nombre de Groupe")} :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {account?.accountGroupes?.length}
                          </span>
                        </div>{" "}
                        <div className="flex flex-wrap mt-1">
                          <p className="font-bold- text-gray-700">
                            {t("Nombre de Geofences")} :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {account?.accountGeofences?.length}
                          </span>
                        </div>{" "}
                        {/*  */}
                        <div className="flex flex-wrap mt-1">
                          <p className="font-bold- text-gray-700">
                            {t("Date de creation")} :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            {FormatDateHeure(account?.creationTime).date}
                            <span className="px-3">-</span>
                            {FormatDateHeure(account?.creationTime).time}
                          </span>
                        </div>{" "}
                      </div>
                      <div className="flex gap-2 md:flex-col md:max-w-[11rem] sm:justify-end w-full xs:justify-start justify-center">
                        <button
                          onClick={() => {
                            setCurrentAccountSelected(account);
                            setSeConnecterAutreComptePopup(true);
                          }}
                          className={`  bg-orange-500-- text-orange-500  w-full cursor-pointer xs:w-auto mt-4 md:mt-0 text-sm- border-2 border-orange-500 border-gray-300- text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                        >
                          <p className="text-[.8rem]">{t("Se connecter")}</p>
                          {/* <IoOptions className="text-xl" /> */}
                        </button>{" "}
                        <button
                          onClick={() => {
                            setCurrentAccountSelected(account);
                            setshowChooseItemToModifyMessage("");

                            setShowAccountOptionsPopup(true);
                          }}
                          className={`  bg-orange-500 text-white w-full cursor-pointer xs:w-auto mt-4 md:mt-0 text-sm- border-[0.02rem] border-gray-300- text-sm  font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                        >
                          <p className="text-[.8rem]">{t("Options")}</p>
                          <IoOptions className="text-xl" />
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filterListeDesCompte?.length >
              filterListeDesComptePagination?.length && (
              <div className="w-full flex justify-center mt-[4rem]">
                <button
                  onClick={() => {
                    afficherPlusDeRésultat();
                  }}
                  className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                >
                  {t("Voir plus de Résultat")}
                </button>
              </div>
            )}
            {/*  */}
          </div>
          {/*  */}
          <GestionAccountOptionPopup
            setDocumentationPage={setDocumentationPage}
          />
        </div>
      </div>
    </div>
  );
}

export default GestionDesCompts;
