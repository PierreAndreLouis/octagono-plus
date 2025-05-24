import React, { useContext, useState } from "react";
import {
  IoArrowBack,
  IoChevronBackCircleOutline,
  IoClose,
  IoEarth,
  IoOptions,
  IoSearchOutline,
} from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import { FaChevronDown, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import GestionUserOptionsPopup from "../components/gestion_des_comptes/GestionUserOptionsPopup";
import { MdUpdate } from "react-icons/md";

function ListeDesUtilisateur({
  setDocumentationPage,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
}) {
  const {
    FormatDateHeure,
    currentAccountSelected,
    password,
    setCurrentAccountSelected,
    listeGestionDesUsers,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
    handleLogin,
    setShowSelectedUserOptionsPopup,
    setListeGestionDesVehicules,
    gestionAccountData,
    TestDeRequetteDevices,
  } = useContext(DataContext);

  const twentyHoursInMs = 24 * 60 * 60 * 1000; // 20 heures en millisecondes
  const currentTime = Date.now(); // Heure actuelle en millisecondes

  const [seConnecterAutreComptePopup, setSeConnecterAutreComptePopup] =
    useState(false);

  const [inputPassword, setInputPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting
    console.log("Clicked......");

    if (inputPassword === password) {
      console.log("Clicked...... 222");

      handleLogin(
        currentSelectedUserToConnect?.accountID,
        currentSelectedUserToConnect?.userID,
        currentSelectedUserToConnect?.password
      );
    } else {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  // const [chooseOtherAccountGestion, setChooseOtherAccountGestion] =
  //   useState(false);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? gestionAccountData.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : gestionAccountData;

  const [searchGroupInputTerm, setSearchGroupInputTerm] = useState("");
  const [showFilterInputSection, setShowFilterInputSection] = useState(false);

  const filterUserAccountData = searchGroupInputTerm
    ? listeGestionDesUsers?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchGroupInputTerm.toLowerCase()) ||
          item?.accountID
            .toLowerCase()
            .includes(searchGroupInputTerm.toLowerCase()) ||
          item?.userID
            .toLowerCase()
            .includes(searchGroupInputTerm.toLowerCase())
      )
    : listeGestionDesUsers;

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />

      <GestionUserOptionsPopup setDocumentationPage={setDocumentationPage} />

      {seConnecterAutreComptePopup && (
        <div className="fixed  z-[9999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-orange-600 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous changer de Compte ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
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
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setSeConnecterAutreComptePopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-orange-500 rounded-lg font-semibold border border-orange-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}

      <div className="px-4 bg-white rounded-lg pt-10 mt-4-- pb-40">
        <h2 className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold ">
          Liste des Utilisateur
        </h2>

        <p
          onClick={() => {
            TestDeRequetteDevices();
          }}
        >
          test liste groupe user
        </p>

        <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
          <span className="text-gray-700">Nombre d'utilisateur :</span>{" "}
          {filterUserAccountData?.length}
        </h3>

        <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
          <div className="flex    gap-2 justify-between mt-4">
            <button
              onClick={() => {
                if (!currentAccountSelected) {
                  setChooseOneAccountToContinue(true);
                  setChooseOtherAccountGestion(true);
                  setDocumentationPage("Ajouter_nouveau_utilisateur");
                } else {
                  setDocumentationPage("Ajouter_nouveau_utilisateur");
                }
              }}
              className="bg-orange-500 w-full shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3 ">
                <FaUserPlus className="text-2xl" />
                <p className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                  <span className="hidden md:inline">Ajouter un</span> nouveau
                  utilisateur
                </p>
              </div>
            </button>{" "}
          </div>
          {/* <div
            onClick={() => {
              setChooseOtherAccountGestion(true);
            }}
            className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
          >
            <h3 className="w-full text-center font-semibold">
              <span>
                {currentAccountSelected?.description || "Choisissez un compte"}
              </span>
            </h3>
            <FaChevronDown />
          </div> */}

          {!showFilterInputSection && (
            <div className="flex gap-2 w-full justify-between items-center">
              <div
                onClick={() => {
                  setChooseOtherAccountGestion(true);
                }}
                className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
              >
                <h3 className="w-full text-center font-semibold">
                  {/* Compte: */}
                  <span>
                    {currentAccountSelected?.description ||
                      "Choisissez un compte"}
                  </span>
                </h3>
                <FaChevronDown />
              </div>
              <div
                onClick={() => {
                  setShowFilterInputSection(true);
                }}
                className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100"
              >
                <IoSearchOutline className="text-xl " />
              </div>
            </div>
          )}

          {showFilterInputSection && (
            <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Recherche un utilisateur"
                required
                value={searchGroupInputTerm}
                onChange={(e) => {
                  setSearchGroupInputTerm(e.target.value);
                }}
                className=" px-3 w-full focus:outline-none dark:text-white  dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
              <div
                onClick={() => {
                  {
                    setShowFilterInputSection(false);
                    setSearchTermInput("");
                  }
                }}
                className=" cursor-pointer border-l border-l-gray-300 px-3  py-2 "
              >
                <IoClose className="text-xl text-red-600" />
              </div>
            </div>
          )}
        </div>
        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {filterUserAccountData?.map((user, index) => {
            return (
              <div
                onClick={() => {
                  console.log("User:", user);
                  setCurrentSelectedUserToConnect(user);
                  setListeGestionDesVehicules(user?.userDevices);
                }}
                key={index}
                className="shadow-lg-- shadow-inner shadow-black/10 bg-gray-50  relative md:flex gap-4 justify-between rounded-lg px-2 md:px-4 py-4"
              >
                <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                  {index + 1}
                </div>
                <div className="flex  gap-3  ">
                  <FaUserCircle className="text-[3rem] text-gray-500 md:mr-4" />
                  <div className=" w-full flex flex-wrap justify-between gap-x-4">
                    <div>
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Nom Utilisateur :
                        </p>
                        <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                          {user?.description}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">UserID :</p>
                        <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                          {user?.userID}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">AccountID :</p>
                        <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                          {user?.accountID}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Groupes affectés :
                        </p>
                        <span className=" dark:text-orange-500 font-bold text-gray-600 pl-5">
                          {user?.userGroupes?.length > 0
                            ? user?.userGroupes?.length
                            : "Tous"}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Nombre d'Appareils :
                        </p>
                        <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                          {user?.userDevices?.length || "0"}
                        </span>
                      </div>{" "}
                      <div className="flex flex-wrap">
                        <p className="font-bold- text-gray-700">
                          Dernière connexion :
                        </p>
                        <span className=" dark:text-orange-500 text-gray-600 pl-5">
                          {FormatDateHeure(user?.lastLoginTime).date}

                          <span className="px-3">-</span>
                          {FormatDateHeure(user?.lastLoginTime).time}
                        </span>
                      </div>{" "}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end md:mr-10 sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
                  {" "}
                  <button
                    onClick={() => {
                      setSeConnecterAutreComptePopup(true);
                    }}
                    className={`${
                      true
                        ? " bg-gray-200 text-gray-800"
                        : "text-gray-800 border-[0.02rem] border-gray-50 "
                    }   text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                  >
                    <p>Login</p> <IoMdLogIn className="text-xl" />
                  </button>
                  <button
                    onClick={() => {
                      setShowSelectedUserOptionsPopup(true);
                      setCurrentSelectedUserToConnect(user);
                    }}
                    className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                  >
                    <p>Options</p> <IoOptions className="text-xl" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListeDesUtilisateur;
