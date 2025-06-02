import React, { useContext, useEffect, useState } from "react";
import { IoClose, IoOptions, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";
import {
  FaRegEdit,
  FaUserPlus,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { PiIntersectThreeBold } from "react-icons/pi";
import GestionGroupeOptionPopup from "../components/gestion_des_comptes/GestionGroupeOptionPopup";
import { MdUpdate } from "react-icons/md";

function ListeDesGroupes({
  setDocumentationPage,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  fromExpandSectionDashboard = "false",
}) {
  const {
    currentAccountSelected,
    currentSelectedGroupeGestion,
    setCurrentSelectedGroupeGestion,
    deleteGroupeEnGestionAccount,
    password,
    listeGestionDesGroupe,
    setListeGestionDesGroupe,
    listeGestionDesGroupeTitre,
    setListeGestionDesGroupeTitre,
    currentSelectedUserToConnect,
    setCurrentSelectedUserToConnect,
    listeGestionDesUsers,
    scrollToTop,
    setListeGestionDesUsers,
    fetchAccountGroupes,
    gestionAccountData,
  } = useContext(DataContext);

  const [deleteGroupeAccountPopup, setDeleteGroupeAccountPopup] =
    useState(false);

  const [editAccountGestion, setEditAccountGestion] = useState(false);

  const [inputPassword, setInputPassword] = useState("");

  const [errorPassord, setErrorPassord] = useState("");

  const handlePasswordCheck = (e) => {
    e.preventDefault();
    if (inputPassword === password) {
      deleteGroupeEnGestionAccount(
        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedGroupeGestion?.accountID
          )?.accountID,

        "admin",

        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedGroupeGestion?.accountID
          )?.password,
        currentSelectedGroupeGestion?.groupID
      );
      setDeleteGroupeAccountPopup(false);
    } else {
      setErrorPassord("Mot de passe incorrect");
    }
  };

  const [showSelectedGroupeOptionsPopup, setShowSelectedGroupeOptionsPopup] =
    useState(false);

  useEffect(() => {
    console.log(
      "showSelectedGroupeOptionsPopup",
      showSelectedGroupeOptionsPopup
    );
  }, [showSelectedGroupeOptionsPopup]);

  useEffect(() => {
    console.log(
      "currentSelectedGroupeGestion +++++++++++++",
      currentSelectedGroupeGestion
    );
  }, [currentSelectedGroupeGestion]);

  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? listeGestionDesUsers?.filter((item) =>
        item?.description.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : listeGestionDesUsers;

  const [showChooseOtherUserGroupePopup, setShowChooseOtherUserGroupePopup] =
    useState(false);

  const [searchGroupInputTerm, setSearchGroupInputTerm] = useState("");
  const [showFilterInputSection, setShowFilterInputSection] = useState(false);

  const filterGroupeAccountData = searchGroupInputTerm
    ? listeGestionDesGroupe?.filter((item) =>
        item?.description
          .toLowerCase()
          .includes(searchGroupInputTerm.toLowerCase())
      )
    : listeGestionDesGroupe;

  return (
    <div>
      <GestionAccountOptionPopup setDocumentationPage={setDocumentationPage} />

      {/* {showSelectedGroupeOptionsPopup && ( */}
      <GestionGroupeOptionPopup
        showSelectedGroupeOptionsPopup={showSelectedGroupeOptionsPopup}
        setShowSelectedGroupeOptionsPopup={setShowSelectedGroupeOptionsPopup}
        setDeleteGroupeAccountPopup={setDeleteGroupeAccountPopup}
        setDocumentationPage={setDocumentationPage}
      />
      {/* )} */}

      {showChooseOtherUserGroupePopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999999999999999999999999999999999999999]">
          <div className="bg-white overflow-hidden w-full mx-4 max-w-[40rem] min-h-[80vh] max-h-[90vh] rounded-lg">
            <div className="relative">
              <div className="text-center font-semibold text-lg bg-orange-100 py-4">
                <h2 className="">Liste des Utilisateurs</h2>
                <p className="text-center font-normal- text-orange-600 translate-x-11--  text-sm">
                  {currentAccountSelected?.description}
                </p>
              </div>

              <IoClose
                onClick={() => {
                  setShowChooseOtherUserGroupePopup(false);
                }}
                className="absolute text-2xl text-red-600 top-4 cursor-pointer right-4"
              />
            </div>

            <div>
              <div className="flex mx-3 my-4 gap-2 justify-between items-center">
                <input
                  className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                  type="text"
                  placeholder="Rechercher un utilisateur"
                  value={searchInputTerm}
                  onChange={(e) => {
                    setSearchInputTerm(e.target.value);
                  }}
                />

                <div className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100">
                  <IoSearchOutline className="text-xl " />
                </div>
                {/* </Tooltip> */}
              </div>

              <div className="flex overflow-auto h-[60vh] max-h-[55vh] pb-20 flex-col gap-4 mx-3">
                {/*  */}
                <button
                  onClick={() => {
                    {
                      setListeGestionDesGroupe(
                        currentAccountSelected?.accountGroupes
                      );
                      setListeGestionDesGroupeTitre("Tous les Groupes ");
                      setShowChooseOtherUserGroupePopup(false);
                    }
                  }}
                  className="font-bold bg-orange-50 rounded-lg py-2 shadow-lg shadow-black/10"
                >
                  Tous les Groupes
                </button>{" "}
                {filterGestionAccountData?.map((user, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setListeGestionDesGroupe(user?.userGroupes);
                        setListeGestionDesGroupeTitre(user?.description);
                        setShowChooseOtherUserGroupePopup(false);
                        setCurrentSelectedUserToConnect(user);
                        scrollToTop();
                      }}
                      className="shadow-lg cursor-pointer relative overflow-hidden-- bg-orange-50/50 shadow-black/10 flex gap-3 items-center rounded-lg py-2 px-2 "
                    >
                      <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                        {index + 1}
                      </p>
                      <FaUserCircle className="text-gray-500 text-[2.5rem]" />
                      <div>
                        <p className="text-gray-600">
                          Nom de l'utilisateur :{" "}
                          <span className="font-bold">{user?.description}</span>{" "}
                        </p>
                        <p className="text-gray-600">
                          Nombre de Groupes affectés :{" "}
                          <span className="font-bold">
                            {user?.userGroupes?.length}
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/*  */}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteGroupeAccountPopup && (
        <div className="fixed  z-[9999999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
          <form
            onSubmit={handlePasswordCheck}
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[25rem] p-6 rounded-xl w-[80vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              Voulez-vous Supprimer le groupe ?
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                Veuillez entrer votre mot de passe
              </label>
              <p className="text-red-500 mx-4 text-center">{errorPassord}</p>
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
                    setErrorPassord("");
                  }}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button className="py-1 px-5 bg-red-500 rounded-lg text-white">
                Confirmer
              </button>

              <h3
                onClick={() => {
                  setDeleteGroupeAccountPopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
              >
                Annuler
              </h3>
            </div>
          </form>
        </div>
      )}

      <div className="px-4 pb-40 pt-10 bg-white rounded-lg">
        {fromExpandSectionDashboard === "false" && (
          <div>
            <h2
              onClick={() => {
                fetchAccountGroupes();
              }}
              className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold "
            >
              Liste des groupes
            </h2>

            <h3 className=" text-orange-600 text-md text-center font-bold-- ">
              {currentSelectedUserToConnect?.description && (
                <span className="text-gray-700">Utilisateur :</span>
              )}{" "}
              {currentSelectedUserToConnect?.description}
            </h3>
            <h3 className=" text-orange-600 text-md text-center font-bold-- ">
              {listeGestionDesGroupeTitre && (
                <span className="text-gray-700">Groupe :</span>
              )}{" "}
              {listeGestionDesGroupeTitre}
            </h3>
            <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
              <span className="text-gray-700">Nombre de Groupe :</span>{" "}
              {filterGroupeAccountData?.length}
            </h3>

            <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
              <div className="flex gap-2 justify-center mt-4">
                <div
                  onClick={() => {
                    // setDocumentationPage("Ajouter_nouveau_groupe");
                    if (!currentAccountSelected) {
                      setChooseOneAccountToContinue(true);
                      setChooseOtherAccountGestion(true);
                      setDocumentationPage("Ajouter_nouveau_groupe");
                    } else {
                      setDocumentationPage("Ajouter_nouveau_groupe");
                    }
                  }}
                  className="bg-orange-500 w-full cursor-pointer shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
                >
                  <div className="flex justify-center items-center gap-3 ">
                    <FaUserPlus className="text-2xl" />
                    <p className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                      <span className="hidden md:inline">Ajouter un</span>{" "}
                      Nouveau Groupe
                    </p>
                  </div>
                </div>{" "}
              </div>

              {/* <div
            onClick={() => {
              setShowChooseOtherUserGroupePopup(true);
            }}
            className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
          >
            <h3 className="w-full text-center font-semibold">
              <span>{listeGestionDesGroupeTitre || "Tous les Appareils"}</span>
            </h3>
            <FaChevronDown />
          </div> */}

              {!showFilterInputSection && (
                <div className="flex gap-2 w-full justify-between items-center">
                  <div
                    onClick={() => {
                      setShowChooseOtherUserGroupePopup(true);
                    }}
                    className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
                  >
                    <h3 className="w-full text-center font-semibold">
                      {/* Compte: */}
                      <span>
                        {listeGestionDesGroupeTitre || "Tous les Groupes"}
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
                  {/* <div
                onClick={() => {
                  // deviceUpdateFonction();
                }}
                className="border cursor-pointer px-3   py-2 border-gray-300 rounded-md bg-orange-100"
              >
                <MdUpdate className="text-xl " />
              </div> */}
                </div>
              )}

              {showFilterInputSection && (
                <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
                  <input
                    id="search"
                    name="search"
                    type="search"
                    placeholder="Recherche un Groupe"
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
          </div>
        )}

        <div className="hidden-- flex mt-[5rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}
          {/*  */}
          {/*  */}

          {filterGroupeAccountData?.length > 0 ? (
            filterGroupeAccountData
              ?.slice()
              .sort((a, b) => b?.creationTime - a?.creationTime)
              ?.map((groupe, index) => {
                const userListeAffected = (
                  currentAccountSelected ||
                  gestionAccountData.find(
                    (account) => account.accountID === groupe?.accountID
                  )
                )?.accountUsers?.filter((user) => {
                  const groupes = user?.userGroupes || [];
                  return groupes?.some(
                    (group) => group?.groupID === groupe?.groupID
                  );
                });

                return (
                  <div
                    onClick={() => {
                      setCurrentSelectedGroupeGestion(groupe);
                    }}
                    key={index}
                    className="shadow-lg- shadow-inner shadow-black/10 bg-gray-50  relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4"
                  >
                    <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                      {index + 1}
                    </div>
                    <div className="flex  gap-3  ">
                      <PiIntersectThreeBold className="text-[3rem] hidden sm:block text-orange-500 md:mr-4" />
                      <div className=" w-full flex flex-wrap justify-between gap-x-4">
                        <div>
                          <PiIntersectThreeBold className="text-[3rem] sm:hidden text-orange-500 md:mr-4" />
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              Nom du Groupe :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {groupe?.description}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              ID du Groupe :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {groupe?.groupID}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              Nombre d'appareil :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {groupe?.groupeDevices?.length}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p
                              onClick={() => {
                                console.log(userListeAffected);
                              }}
                              className="font-bold- text-gray-700"
                            >
                              Nombre Utilisateurs affectés :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {userListeAffected?.length}
                            </span>
                          </div>{" "}
                          {/* <div className="flex flex-wrap border-b py-1">
                          <p className="font-bold- text-gray-700">
                            Dernière mise a jour :
                          </p>
                          <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                            21-04-2024 <span className="px-2">/</span> 05:34 PM
                          </span>
                        </div>{" "} */}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end md:mr-10-- sm:max-w-[25rem] gap-3 mt-3 justify-between-- items-center ">
                      {/* <button
                        onClick={() => {
                          setDocumentationPage("Modifier_groupe");
                          setCurrentSelectedGroupeGestion(groupe);
                          // setShowModifyNewGroupePage(true);
                        }}
                        className="bg-gray-200 border border-gray-300 text-center w-[50%] md:w-full text-lg font-semibold rounded-lg py-2 pl-2.5 pr-1.5 flex justify-center items-center"
                      >
                        <p className="text-sm mr-2">Modifier</p>
                        <FaRegEdit />
                      </button> */}
                      <button
                        onClick={() => {
                          setTimeout(() => {
                            setCurrentSelectedGroupeGestion(groupe);
                          }, 500);
                          setListeGestionDesUsers(userListeAffected);
                          console.log(groupe);
                          setShowSelectedGroupeOptionsPopup(true);
                        }}
                        className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                      >
                        <p>Options</p> <IoOptions className="text-xl" />
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              Pas de résultat
            </div>
          )}

          {/*  */}
          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default ListeDesGroupes;
