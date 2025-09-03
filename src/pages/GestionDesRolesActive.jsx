import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaPlusCircle,
  FaUserCircle,
} from "react-icons/fa";
import { MdErrorOutline, MdSwitchAccount, MdUpdate } from "react-icons/md";
import GestionAccountOptionPopup from "../components/gestion_des_comptes/GestionAccountOptionPopup";
import LoadingPageEffectCircle from "../components/Reutilisable/LoadingPageEffectCircle";
import { IoCloseOutline, IoOptions, IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { BiUniversalAccess } from "react-icons/bi";
import { PiIntersectThreeBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbSettingsCheck } from "react-icons/tb";

function GestionDesRolesActive({
  setDocumentationPage,
  currentSelectedRoleActive,
  setCurrentSelectedRoleActive,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
}) {
  const {
    gestionAccountData,
    getAllAccountsDataLoading,
    fonctionTest,
    accountRules,
    FormatDateHeure,
    listeGestionDesRules,
    setListeGestionDesRules,
    currentAccountSelected,
    createNewRuleEnGestionAccount,
    fetchAccountRules,
    fetchRulesEnGestionAccount,
    adminPassword,
    DeleteRoleActiveEnGestionAccount,
    fetchAccountRulesActive,
    listeGestionDesRulesActive,
    mergedDataHome,
    accountDevices,
    isDashboardHomePage,
    documentationPage,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const dataFusionné = mergedDataHome ? Object.values(mergedDataHome) : [];

  let ListeOfDevice = isDashboardHomePage ? accountDevices : dataFusionné;

  const navigate = useNavigate();

  const [inputSearchItem, setInputSearchItem] = useState("");

  const filterListeGestionDesRules = inputSearchItem
    ? listeGestionDesRulesActive.filter(
        (item) =>
          item?.ruleID.toLowerCase().includes(inputSearchItem.toLowerCase()) ||
          item?.accountID.toLowerCase().includes(inputSearchItem.toLowerCase())
      )
    : listeGestionDesRulesActive;

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const [deleRolePopup, setDeleRolePopup] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorIncorrectPassword, setErrorIncorrectPassword] = useState();

  const deleteRoleFonction = (e) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      setDeleRolePopup(false);

      // console.log(
      DeleteRoleActiveEnGestionAccount(
        currentAccountSelected?.accountID ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedRoleActive?.accountID
          )?.accountID,
        "admin",
        currentAccountSelected?.password ||
          gestionAccountData.find(
            (account) =>
              account.accountID === currentSelectedRoleActive?.accountID
          )?.password,

        currentSelectedRoleActive?.ruleID,
        currentSelectedRoleActive?.deviceID,
        currentSelectedRoleActive?.groupID,
        currentSelectedRoleActive?.statusCode
      );
    } else {
      setErrorIncorrectPassword(`${t("Mot de passe incorrect")}`);
    }
  };

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const [openGroups, setOpenGroups] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});

  const itemsPerPage = 10;

  const grouped = filterListeGestionDesRules?.reduce((acc, item) => {
    if (!acc[item.accountID]) acc[item.accountID] = [];
    acc[item.accountID].push(item);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(
    (a, b) => b[1].length - a[1].length
  );

  const toggleGroup = (accountID) => {
    setOpenGroups((prev) => ({
      ...prev,
      [accountID]: !prev[accountID],
    }));

    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: prev[accountID] || 1,
    }));
  };

  const showMore = (accountID) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [accountID]: (prev[accountID] || 1) + 1,
    }));
  };

  // Ouvrir automatiquement le premier groupe au rendu initial
  useEffect(() => {
    if (sortedGroups.length > 0) {
      const firstAccountID = sortedGroups[0][0];
      setOpenGroups({ [firstAccountID]: true }); // 👈 ouvre uniquement le premier
      setVisibleCounts({ [firstAccountID]: 1 }); // 👈 initialise la pagination pour le premier
    }
  }, [currentAccountSelected, documentationPage, listeGestionDesRulesActive]);

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      {/* {account === "sysadmin" ? ( */}
      <div>
        {/* Loading effect quand le donnee sont recherche... */}
        <LoadingPageEffectCircle
          getAllAccountsDataLoading={getAllAccountsDataLoading}
        />

        {deleRolePopup && (
          <div className="fixed  z-[9999999999999999999999] flex justify-center items-center inset-0 bg-black/50">
            <form
              onSubmit={deleteRoleFonction}
              className="bg-white relative pt-20 overflow-hidden dark:bg-gray-700 dark:shadow-gray-600-- dark:shadow-lg dark:border dark:border-gray-600 max-w-[30rem] p-6 px-4 rounded-xl w-[100vw]"
            >
              <div
                onClick={() => {
                  // console.log(currentSelectedRoleActive);
                }}
                className="bg-red-500 px-3 font-bold text-white text-xl text-center py-3 absolute top-0 left-0 right-0"
              >
                {t("Voulez-vous Supprimer le role")}
                {" : "}
                <br />
                <span className="text-black">
                  {currentSelectedRoleActive?.ruleID} ?
                </span>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg text-center dark:text-gray-100 leading-6 text-gray-500 mb-3 mt-6"
                >
                  {t("Veuillez entrer votre mot de passe")}
                </label>
                <p className="text-center text-red-500 px-4">
                  {errorIncorrectPassword}
                </p>
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
                      setErrorIncorrectPassword("");
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
                    setDeleRolePopup(false);
                  }}
                  className="py-1 px-5 cursor-pointer text-center text-red-500 rounded-lg font-semibold border border-red-500"
                >
                  {t("Annuler")}
                </h3>
              </div>
            </form>
          </div>
        )}

        <div className="px-4 pt-10 mt-4-- pb-40 bg-white rounded-lg">
          <h2
            onClick={() => {
              //   fonctionTest();
              fetchAccountRulesActive("foodforthepoor", "Octa@112233");
            }}
            className="mt-[10rem]-- text-lg text-center font-bold "
          >
            {t("Gestion des règles actives")}
            {/* ({filterListeDesCompte?.length}) */}
          </h2>
          <p className="text-center mx-auto font-semibold text-gray-500">
            {t("Nombre de règles actives")}:{" "}
            <span className="text-orange-500">
              {" "}
              {listeGestionDesRulesActive?.length}
            </span>
          </p>
          <div className="flex  justify-center mt-4">
            <button
              onClick={() => {
                // setDocumentationPage("Ajouter_nouveau_role_active");
                navigate("/Ajouter_nouveau_role_active");
                setCurrentSelectedRoleActive(null);
                if (!currentAccountSelected) {
                  setChooseOneAccountToContinue(true);
                  setChooseOtherAccountGestion(true);
                }
              }}
              className="bg-orange-500 w-full max-w-[30rem] shadow-lg shadow-black/20 hover:px-8 transition-all text-white font-semibold rounded-lg py-2 px-6"
            >
              <div className="flex justify-center items-center gap-3">
                <FaPlusCircle className="text-2xl" />
                <p className="text-[1rem] text-center">
                  {t("Activer une nouvelle règle")}
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
                placeholder={`${t("Rechercher une règle")}`}
                required
                value={inputSearchItem}
                onChange={(e) => setInputSearchItem(e.target.value)}
                className=" px-3 w-full focus:outline-0  dark:text-white rounded-md dark:bg-gray-800 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />

              <IoSearchOutline className="text-2xl text-gray-500 border-l cursor-pointer border-l-gray-400 min-w-[3rem]" />
            </div>
          </div>
          {/* Liste des Comptes */}
          <div className="hidden-- flex mt-[5rem] min-h-[50vh] flex-col gap-6 max-w-[50rem] mx-auto">
            {sortedGroups?.length > 0 ? (
              sortedGroups?.map(([accountID, rules]) => (
                <div key={accountID}>
                  {!currentAccountSelected && isDashboardHomePage && (
                    <div
                      className="flex justify-between text-md items-center border-b border-orange-300 cursor-pointer hover:bg-orange-100 bg-orange-50 p-3 rounded-lg"
                      onClick={() => toggleGroup(accountID)}
                    >
                      <h2>
                        {t("Liste des règles actives de")} :{" "}
                        <span className="font-semibold">{accountID}</span> (
                        {rules?.length})
                      </h2>
                      <div></div>
                      {openGroups[accountID] ? (
                        <FaChevronRight />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  )}
                  {openGroups[accountID] && (
                    <div className="flex flex-col gap-4 mt-6">
                      {rules
                        ?.slice(
                          0,
                          (visibleCounts[accountID] || 1) * itemsPerPage
                        )
                        ?.map((rule, index) => {
                          //
                          //
                          const foundDevice = ListeOfDevice?.find(
                            (d) => d?.deviceID === rule?.deviceID
                          );

                          return (
                            <div
                              key={index}
                              className="shadow-lg- overflow-hidden shadow-inner shadow-black/10 bg-gray-50  relative md:flex gap-4 justify-between items-end rounded-lg px-2 md:px-4 py-4"
                            >
                              <div className="bg-gray-100 pb-1 pl-2 text-sm absolute top-0 right-0 rounded-bl-full font-bold w-[2rem] h-[2rem] flex justify-center items-center">
                                {index + 1}
                              </div>
                              <div className="flex  gap-3  w-full ">
                                <TbSettingsCheck className="text-[3rem] hidden sm:block text-orange-500 md:mr-4" />
                                <div className=" w-full flex flex-wrap justify-between gap-x-4">
                                  <div className="w-full">
                                    <TbSettingsCheck className="text-[3rem] sm:hidden text-orange-500 md:mr-4" />
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("ID du Compte")} :
                                      </p>
                                      <span className=" dark:text-orange-500 notranslate font-semibold text-gray-600 pl-5">
                                        {rule?.accountID}{" "}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("ID du règle")} :
                                      </p>
                                      <span className="notranslate dark:text-orange-500 notranslate font-semibold text-gray-600 pl-5">
                                        {rule?.ruleID}{" "}
                                      </span>
                                    </div>{" "}
                                    {/* <div className="flex flex-wrap border-b py-1">
                            <p className="font-bold- text-gray-700">
                              {t("Description")} :
                            </p>
                            <span className="notranslate dark:text-orange-500 notranslate font-semibold text-gray-600 pl-5">
                              {rule?.description}{" "}
                            </span>
                          </div>{" "} */}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("Appareil")} :
                                      </p>
                                      <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                                        {rule?.deviceID === "*"
                                          ? `${t("Tous les appareils")}`
                                          : foundDevice?.description}{" "}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("Groupe")} :
                                      </p>
                                      <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                                        {rule?.groupID === "-"
                                          ? `${t("Tous les groupes")}`
                                          : rule?.groupID}{" "}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("Statut Code")} :
                                      </p>
                                      <span className=" dark:text-orange-500 font-semibold text-gray-600 pl-5">
                                        {rule?.statusCode}{" "}
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("Date de creation")} :
                                      </p>
                                      <span className=" dark:text-orange-500 font-bold text-gray-600 pl-2">
                                        {
                                          FormatDateHeure(rule?.creationTime)
                                            .date
                                        }
                                        <span className="px-2">/</span>{" "}
                                        {
                                          FormatDateHeure(rule?.creationTime)
                                            .time
                                        }
                                      </span>
                                    </div>{" "}
                                    <div className="flex flex-wrap border-b py-1">
                                      <p className="font-bold- text-gray-700">
                                        {t("Last Update")} :
                                      </p>
                                      <span className=" dark:text-orange-500 font-bold text-gray-600 pl-2">
                                        {
                                          FormatDateHeure(rule?.lastUpdateTime)
                                            .date
                                        }
                                        <span className="px-2">/</span>{" "}
                                        {
                                          FormatDateHeure(rule?.lastUpdateTime)
                                            .time
                                        }
                                      </span>
                                    </div>{" "}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end md:flex-col  sm:max-w-[30rem] gap-3 mt-3 justify-between-- items-center ">
                                {/* <button
                        onClick={() => {
                          // console.log(rule);
                          setCurrentSelectedRoleActive(rule);
                          setDocumentationPage("Modifier_role_active");
                          navigate("/Modifier_role_active");

                          //   setCurrentSelectedRole(rule);
                        }}
                        className={` bg-gray-200 text-gray-800 text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                      >
                        <FaEdit className="text-xl" />
                        <p>{t("Modifier")}</p>
                      </button> */}
                                <button
                                  onClick={() => {
                                    // console.log(rule);
                                    setCurrentSelectedRoleActive(rule);
                                    setDeleRolePopup(true);

                                    //   setCurrentSelectedRole(rule);
                                  }}
                                  className={` bg-orange-500 text-white text-sm- w-[50%] border-[0.02rem] border-gray-300 text-sm md:w-full font-semibold rounded-lg py-2 px-4 flex gap-2 justify-center items-center`}
                                >
                                  <RiDeleteBin6Line className="text-xl" />
                                  <p>{t("Supprimer")}</p>
                                </button>
                              </div>
                            </div>
                          );
                        })}

                      {rules.length >
                        (visibleCounts[accountID] || 1) * itemsPerPage && (
                        <div className="w-full flex justify-center mt-[4rem]">
                          <button
                            onClick={() => showMore(accountID)}
                            className="bg-orange-600 text-white rounded-lg px-8 py-2 font-bold"
                          >
                            {t("Voir plus de Résultat")}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center font-semibold text-lg">
                {t("Pas de résultat")}
              </div>
            )}
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

export default GestionDesRolesActive;
