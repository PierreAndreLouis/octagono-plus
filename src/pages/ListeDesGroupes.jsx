import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoClose, IoOptions, IoSearchOutline } from "react-icons/io5";
import { DataContext } from "../context/DataContext";
import { FaUserPlus, FaChevronDown, FaUserCircle } from "react-icons/fa";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import { PiIntersectThreeBold } from "react-icons/pi";
import GestionGroupeOptionPopup from "../components/gestion_des_comptes/GestionGroupeOptionPopup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ListeDesGroupes({
  setDocumentationPage,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  fromExpandSectionDashboard = "false",
  showChooseGroupeToModifyMessage,
  setShowChooseGroupeToModifyMessage,

  ////////////////////////
  showChooseItemToModifyMessage,
  setshowChooseItemToModifyMessage,
  showChooseItemToModifyPage,
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
    accountGroupes,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  const [deleteGroupeAccountPopup, setDeleteGroupeAccountPopup] =
    useState(false);

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
      setErrorPassord(`${t("Mot de passe incorrect")}`);
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
  const [searchInputTerm, setSearchInputTerm] = useState("");

  const filterGestionAccountData = useMemo(() => {
    if (!searchInputTerm) return listeGestionDesUsers;
    const term = searchInputTerm.toLowerCase();
    return listeGestionDesUsers?.filter((item) =>
      item?.description?.toLowerCase().includes(term)
    );
  }, [searchInputTerm, listeGestionDesUsers]);

  const [showChooseOtherUserGroupePopup, setShowChooseOtherUserGroupePopup] =
    useState(false);

  const [searchGroupInputTerm, setSearchGroupInputTerm] = useState("");
  const [showFilterInputSection, setShowFilterInputSection] = useState(false);

  const filterGroupeAccountData = useMemo(() => {
    if (!searchGroupInputTerm) return listeGestionDesGroupe;
    const term = searchGroupInputTerm.toLowerCase();
    return listeGestionDesGroupe?.filter((item) =>
      item?.description?.toLowerCase().includes(term)
    );
  }, [searchGroupInputTerm, listeGestionDesGroupe]);

  const sortedGroupes = useMemo(() => {
    return [...(filterGroupeAccountData || [])].sort(
      (a, b) => b?.creationTime - a?.creationTime
    );
  }, [filterGroupeAccountData]);

  const groupUsersMap = useMemo(() => {
    const map = new Map();
    (gestionAccountData || []).forEach((account) => {
      (account.accountUsers || []).forEach((user) => {
        (user.userGroupes || []).forEach((group) => {
          if (!map.has(group.groupID)) map.set(group.groupID, []);
          map.get(group.groupID).push(user);
        });
      });
    });
    return map;
  }, [gestionAccountData]);

  const [itemsToShow, setItemsToShow] = useState(10);

  const groupesToDisplay = useMemo(() => {
    return sortedGroupes.slice(0, itemsToShow);
  }, [sortedGroupes, itemsToShow]);

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
          <div className="bg-white overflow-hidden w-full mx-4-- max-w-[40rem] min-h-[80vh] max-h-[90vh] rounded-lg">
            <div className="relative">
              <div className="text-center font-semibold text-lg bg-orange-100 py-4">
                <h2 className="">{t("Liste des Utilisateurs")}</h2>
                <p className="text-center notranslate font-normal- text-orange-600 translate-x-11--  text-sm">
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
                  placeholder={`${t("Rechercher un utilisateur")}`}
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
                      setListeGestionDesGroupeTitre(`${t("Tous les Groupes")}`);
                      setShowChooseOtherUserGroupePopup(false);
                    }
                  }}
                  className="font-bold bg-orange-50 rounded-lg py-2 shadow-lg shadow-black/10"
                >
                  {t("Tous les Groupes")}
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
                          {t("Nom de l'utilisateur")} :{" "}
                          <span className="font-bold notranslate">
                            {user?.description}
                          </span>{" "}
                        </p>
                        <p className="text-gray-600">
                          {t("Nombre de Groupes affectés")} :{" "}
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
            className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
          >
            <div className="bg-red-500 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0">
              {t("Voulez-vous Supprimer le groupe ?")}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3"
              >
                {t("Veuillez entrer votre mot de passe")}
              </label>
              <p className="text-red-500 mx-4 text-center">{errorPassord}</p>
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
                    setErrorPassord("");
                  }}
                  className=" px-3 w-full dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 border border-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 justify-start mt-5">
              <button className="py-1 px-5 bg-red-500 rounded-lg text-white">
                {t("Confirmer")}
              </button>

              <h3
                onClick={() => {
                  setDeleteGroupeAccountPopup(false);
                }}
                className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
              >
                {t("Annuler")}
              </h3>
            </div>
          </form>
        </div>
      )}

      <div className="px-4 pb-40 pt-10 bg-white rounded-lg">
        {/* {fromExpandSectionDashboard === "false" && ( */}
        <div className="mb-[4rem]">
          {fromExpandSectionDashboard === "false" && (
            <>
              <h2
                onClick={() => {
                  fetchAccountGroupes();
                }}
                className="mt-[10rem]-- text-2xl text-gray-700 text-center font-bold "
              >
                {t("Liste des groupes")}
              </h2>

              <h3 className=" text-orange-600 text-md text-center font-bold-- ">
                {currentSelectedUserToConnect?.description && (
                  <span className="text-gray-700">{t("Utilisateur")} :</span>
                )}{" "}
                <span className="notranslate">
                  {currentSelectedUserToConnect?.description}
                </span>
              </h3>
              <h3 className=" text-orange-600 text-md text-center font-bold-- ">
                {listeGestionDesGroupeTitre && (
                  <span className="text-gray-700">{t("Groupe")} :</span>
                )}{" "}
                {listeGestionDesGroupeTitre}
              </h3>
              <h3 className="mt-[10rem]-- mb-10 text-orange-600 text-md text-center font-bold-- ">
                <span className="text-gray-700">{t("Nombre de Groupe")} :</span>{" "}
                {filterGroupeAccountData?.length}
              </h3>
            </>
          )}

          <div className="flex flex-col gap-3 mx-auto max-w-[37rem]">
            {fromExpandSectionDashboard === "false" && (
              <div className="flex gap-2 justify-center mt-4">
                <div
                  onClick={() => {
                    // setDocumentationPage("Ajouter_nouveau_groupe");
                    if (!currentAccountSelected) {
                      setChooseOneAccountToContinue(true);
                      setChooseOtherAccountGestion(true);
                      setDocumentationPage("Ajouter_nouveau_groupe");
                      navigate("/Ajouter_nouveau_groupe");
                    } else {
                      setDocumentationPage("Ajouter_nouveau_groupe");
                      navigate("/Ajouter_nouveau_groupe");
                    }
                  }}
                  className="bg-orange-500 w-full cursor-pointer shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
                >
                  <div className="flex justify-center items-center gap-3 ">
                    <FaUserPlus className="text-2xl" />
                    <p className="text-sm md:text-[1rem] text-ellipsis whitespace-nowrap- w-[50%]-- text-center">
                      <span className="hidden md:inline">{t("Ajouter")} </span>{" "}
                      {t("Nouveau Groupe")}
                    </p>
                  </div>
                </div>{" "}
              </div>
            )}

            {!showFilterInputSection &&
              fromExpandSectionDashboard === "false" && (
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
                        {listeGestionDesGroupeTitre ||
                          `${t("Tous les Groupes")}`}
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

            {(showFilterInputSection ||
              fromExpandSectionDashboard === "true") && (
              <div className="mt-2-- border border-gray-300 rounded-md overflow-hidden flex justify-between items-center">
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder={`${t("Recherche un Groupe")}`}
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
                      setSearchGroupInputTerm("");
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
        {/* )} */}

        <div className="hidden-- flex mt-[1rem]  flex-col gap-6 max-w-[50rem] mx-auto">
          {/*  */}
          {showChooseItemToModifyMessage &&
            showChooseItemToModifyPage === "Gestion_des_groupes" && (
              <div className=" flex items-center cursor-pointer justify-between  px-3 py-1 rounded-md bg-yellow-200 text-yellow-700 border border-yellow-700 font-semibold text-sm text-center mb-2">
                <p className="w-full">{showChooseItemToModifyMessage}</p>
                <IoClose
                  onClick={() => {
                    setshowChooseItemToModifyMessage("");
                  }}
                />
              </div>
            )}
          {/*  */}
          {/*  */}

          {groupesToDisplay?.length > 0 ? (
            groupesToDisplay
              ?.slice()
              .sort((a, b) => b?.creationTime - a?.creationTime)
              ?.map((groupe, index) => {
                const userListeAffected =
                  groupUsersMap.get(groupe.groupID) || [];

                const foundGroupe = gestionAccountData
                  ?.flatMap((account) => account.accountGroupes)
                  ?.find((u) => u.groupID === groupe?.groupID);

                return (
                  <div
                    onClick={() => {
                      setCurrentSelectedGroupeGestion(foundGroupe);
                      console.log("foundGroupe----------", foundGroupe);
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
                              {t("ID du Groupe")} :
                            </p>
                            <span className=" dark:text-orange-500 notranslate font-semibold text-gray-600 pl-5">
                              {groupe?.groupID}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              {t("Nom du Groupe")} :
                            </p>
                            <span className="notranslate dark:text-orange-500 notranslate font-semibold text-gray-600 pl-5">
                              {groupe?.description || "---"}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              {t("Nombre d'appareils")} :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {foundGroupe?.groupeDevices?.length}
                            </span>
                          </div>{" "}
                          <div className="flex flex-wrap border-b py-1">
                            <p
                              onClick={() => {
                                console.log(userListeAffected);
                              }}
                              className="font-bold- text-gray-700"
                            >
                              {t("Nombre Utilisateurs affectés")} :
                            </p>
                            <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                              {userListeAffected?.length}
                            </span>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end md:mr-10-- sm:max-w-[30rem] gap-3 mt-3 justify-between-- items-center ">
                      <button
                        onClick={() => {
                          setTimeout(() => {
                            setCurrentSelectedGroupeGestion(groupe);
                          }, 500);
                          setListeGestionDesUsers(userListeAffected);
                          console.log(groupe);
                          setShowSelectedGroupeOptionsPopup(true);
                          setshowChooseItemToModifyMessage("");
                        }}
                        className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                      >
                        <p>{t("Options")}</p> <IoOptions className="text-xl" />
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex justify-center font-semibold text-lg">
              {t("Pas de résultat")}
            </div>
          )}
          {itemsToShow < sortedGroupes.length && (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setItemsToShow(itemsToShow + 10)}
                className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
              >
                {t("Voir plus de Résultat")}
              </button>
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
