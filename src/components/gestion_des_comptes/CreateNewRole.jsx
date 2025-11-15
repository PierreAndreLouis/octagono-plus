import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeft, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { PiIntersectThreeBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreateNewRole({
  setDocumentationPage,
  documentationPage,
  accountIdFromRole,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  currentSelectedRole,
  setCurrentSelectedRole,
}) {
  const {
    currentAccountSelected,
    setError,
    scrollToTop,
    adminPassword,
    accountDevices,
    accountGroupes,
    gestionAccountData,
    createNewRuleEnGestionAccount,
    ModifyRuleEnGestionAccount,
    accountRules,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  // Pour afficher le popup de confirmation de password
  const [
    showConfirmAddGroupeGestionPopup,
    setShowConfirmAddGroupeGestionPopup,
  ] = useState(false);
  // Pour stocker le mot de passe de confirmation  de password
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher un message de d'erreur lors de mauvais mot de passe
  const [errorMessage, setErrorMessage] = useState("");

  // État pour le message d'erreur de deviceID incorrect
  const [errorID, setErrorID] = useState("");

  // État pour chaque champ du formulaire
  const [addNewRoleData, setAddNewRoleData] = useState({
    // accountID: accountIdFromRole,
    imeiNumber: "*",
    groupID: "-",
    ruleID: "",
    isCronRule: "0",
    ruleTag: "",
    selector: "",
    actionMask: "1287",
    cannedActions: "",
    priority: "0",
    notifyEmail: "",
    emailSubject: "",
    emailText: "",
    smsText: "",
    useEmailWrapper: "",
    ruleDisable: "",
    ruleEnable: "",
    sendCommand: "",
    isActive: "1",
    description: "",
  });

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (["ruleID"].includes(name)) {
      newValue = value.replace(/\s/g, "_"); // remplace les espaces par des underscores
    }

    if (name === "ruleID") {
      newValue = newValue.toLowerCase(); // convertit en minuscules
    }
    setAddNewRoleData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setErrorID(""); // Réinitialise l'erreur lorsque l'utilisateur modifie l'entrée
  };

  const isValidUserData = () => {
    const phoneRegex = /^\+?\d{6,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = [];

    // if (!emailRegex.test(addNewRoleData.notifyEmail)) {
    //   errors.push(`${t("l'email de notification n'est pas valide")}`);
    // }

    return errors;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formatErrors = isValidUserData();
    if (formatErrors.length > 0) {
      setErrorID(formatErrors[0]); // Affiche le premier message
      return;
    }

    // if (!currentAccountSelected) {
    //   // setErrorID(`${t("Veuillez choisir un compte")}`);
    //   setChooseOneAccountToContinue(true);
    //   setChooseOtherAccountGestion(true);
    //   return;
    // }

    if (!addNewRoleData?.selector) {
      setErrorID(`${t("Le champ selector est vide")}`);
      return;
    }

    const ruleID = addNewRoleData.ruleID;

    // const ruleExists = currentAccountSelected?.accountRules?.some(
    //   (rule) => rule?.ruleID === ruleID
    // );
    const ruleExists = accountRules?.some((rule) => rule?.ruleID === ruleID);

    if (!currentSelectedRole && ruleExists) {
      setErrorID(
        `${t(
          "Cet identifiant (ruleID) est déjà utilisé. Veuillez en choisir un autre"
        )}`
      );
      return;
    }

    // if (!currentAccountSelected) {
    //   setChooseOneAccountToContinue(true);
    //   setChooseOtherAccountGestion(true);
    //   return;
    // }

    setShowConfirmAddGroupeGestionPopup(true);
  };

  const [showIsUserActivePopup, setShowIsUserActivePopup] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [deviceSelectionne, setdeviceSelectionne] = useState("");

  const [showdeviceSelectionnePopup, setShowdeviceSelectionnePopup] =
    useState(false);

  useEffect(() => {
    if (currentAccountSelected) {
      setErrorID("");
    }
  }, [currentAccountSelected]);

  useEffect(() => {
    // console.log("deviceSelectionne", deviceSelectionne);
  }, [deviceSelectionne]);

  useEffect(() => {
    setdeviceSelectionne("");
  }, [documentationPage]);

  //////////////////////////////////////////////////////////

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (
      inputPassword === adminPassword ||
      inputPassword ===
        JSON.parse(localStorage.getItem("userPersonnelData"))?.gender ||
      inputPassword ===
        JSON.parse(localStorage.getItem("userAdminPersonnelData"))?.gender
    ) {
      // const accountID = accountIdFromRole;

      const imeiNumber = addNewRoleData.imeiNumber;
      const groupID = addNewRoleData.groupID;

      const ruleID = addNewRoleData.ruleID;
      const isCronRule = addNewRoleData.isCronRule;
      const ruleTag = addNewRoleData.ruleTag;
      const selector = addNewRoleData.selector;
      const actionMask = addNewRoleData.actionMask;
      const cannedActions = addNewRoleData.cannedActions;
      const priority = addNewRoleData.priority;
      const notifyEmail = addNewRoleData.notifyEmail;
      const emailSubject = addNewRoleData.emailSubject;
      const emailText = addNewRoleData.emailText;
      const smsText = addNewRoleData.smsText;
      const useEmailWrapper = addNewRoleData.useEmailWrapper;
      const ruleDisable = addNewRoleData.ruleDisable;
      const ruleEnable = addNewRoleData.ruleEnable;
      const sendCommand = addNewRoleData.sendCommand;
      const isActive = addNewRoleData.isActive;
      const description = addNewRoleData.description;

      const accountID = localStorage.getItem("adminAccount");
      const password = localStorage.getItem("adminPassword");
      // if (
      //   currentAccountSelected?.accountID &&
      //   currentAccountSelected?.password
      // ) {
      console.log(
        accountID,
        "admin",
        password,

        ruleID,

        emailSubject,
        emailText,
        selector,
        isActive
      );

      if (currentSelectedRole) {
        console.log("xxxxxxxx");

        ModifyRuleEnGestionAccount(
          // currentAccountSelected?.accountID,
          // "admin",
          // currentAccountSelected?.password,
          accountID,
          "admin",
          password,

          // imeiNumber,
          // groupID,
          ruleID,
          isCronRule,
          ruleTag,
          selector,
          actionMask,
          cannedActions,
          priority,
          notifyEmail,
          emailSubject,
          emailText,
          smsText,
          useEmailWrapper,
          ruleDisable,
          ruleEnable,
          sendCommand,
          isActive,
          description
        );
      } else {
        createNewRuleEnGestionAccount(
          // currentAccountSelected?.accountID,
          // "admin",
          // currentAccountSelected?.password,
          accountID,
          "admin",
          password,

          // imeiNumber,
          // groupID,
          ruleID,
          isCronRule,
          ruleTag,
          selector,
          actionMask,
          cannedActions,
          priority,
          notifyEmail,
          emailSubject,
          emailText,
          smsText,
          useEmailWrapper,
          ruleDisable,
          ruleEnable,
          sendCommand,
          isActive,
          description
        );
      }

      navigate("/Gestion_des_roles");

      setDocumentationPage("Gestion_des_roles");
      // }

      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const [searchInputTerm, setSearchInputTerm] = useState("");
  const [searchInputTermGroup, setSearchInputTermGroup] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? accountDevices?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchInputTerm.toLowerCase()) ||
          item?.deviceID
            .toLowerCase()
            .includes(searchInputTerm.toLowerCase()) ||
          item?.imeiNumber.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : accountDevices;

  const filterGroupAccountData = searchInputTermGroup
    ? accountGroupes?.filter(
        (item) =>
          item?.groupID
            .toLowerCase()
            .includes(searchInputTermGroup.toLowerCase()) ||
          item?.description
            .toLowerCase()
            .includes(searchInputTermGroup.toLowerCase())
      )
    : accountGroupes;

  const [showGroupesSelectionnesPopup, setShowGroupesSelectionnesPopup] =
    useState(false);

  useEffect(() => {
    if (currentSelectedRole) {
      setAddNewRoleData({
        imeiNumber: currentSelectedRole.imeiNumber || "",
        groupID: currentSelectedRole.groupID || "",
        ruleID: currentSelectedRole.ruleID || "",
        isCronRule: currentSelectedRole.isCronRule || "",
        ruleTag: currentSelectedRole.ruleTag || "",
        selector: currentSelectedRole.selector || "",
        actionMask: currentSelectedRole.actionMask || "",
        cannedActions: currentSelectedRole.cannedActions || "",
        priority: currentSelectedRole.priority || "",
        notifyEmail: currentSelectedRole.notifyEmail || "",
        emailSubject: currentSelectedRole.emailSubject || "",
        emailText: currentSelectedRole.emailText || "",
        smsText: currentSelectedRole.smsText || "",
        useEmailWrapper: currentSelectedRole.useEmailWrapper || "",
        ruleDisable: currentSelectedRole.ruleDisable || "",
        ruleEnable: currentSelectedRole.ruleEnable || "",
        sendCommand: currentSelectedRole.sendCommand || "",
        isActive: currentSelectedRole.isActive === "true" ? "1" : "0" || "",
        description: currentSelectedRole.description || "",
      });
    }
  }, [currentSelectedRole]);

  return (
    <div className="px-3 rounded-lg  bg-white">
      {showIsUserActivePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setShowIsUserActivePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Activation")}:
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewRoleData?.isActive === "1"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                // setShowIsUserActivePopupText("true");
                setAddNewRoleData((prev) => ({
                  ...prev,
                  isActive: "1",
                }));
                setShowIsUserActivePopup(false);
              }}
            >
              <p>true</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewRoleData?.isActive === "0"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                // setShowIsUserActivePopupText("false");
                setAddNewRoleData((prev) => ({
                  ...prev,
                  isActive: "0",
                }));
                setShowIsUserActivePopup(false);
              }}
            >
              <p>false</p>
            </div>
          </div>
        </div>
      )}

      {showGroupesSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh]  relative  bg-white rounded-lg">
            <h2
              onClick={() => {
                console.log("tous les Groupes: ", accountGroupes);
              }}
              className="text-center py-4 bg-orange-300 font-bold text-lg"
            >
              {t("Liste Des Groupe")}
            </h2>
            <IoClose
              onClick={() => {
                setShowGroupesSelectionnesPopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            {/* <p className="mx-2 mb-3 text-center mt-4 text-lg">
              {t("Choisis un Groupe pour intégrer l'appareil")}
            </p> */}
            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un compte")}`}
                value={searchInputTermGroup}
                onChange={(e) => {
                  setSearchInputTermGroup(e.target.value);
                }}
              />

              <div className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100">
                <IoSearchOutline className="text-xl " />
              </div>
            </div>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              <button
                onClick={() => {
                  setAddNewRoleData((prev) => ({
                    ...prev,
                    groupID: "-",
                  }));
                  setShowGroupesSelectionnesPopup(false);
                }}
                className="py-2 text-white rounded-md bg-orange-500 font-bold"
              >
                {t("Tous")}
              </button>
              {filterGroupAccountData?.map((groupe, index) => {
                const isSelected = addNewRoleData?.groupID === groupe.groupID;

                const foundGroupe = gestionAccountData
                  ?.flatMap((account) => account.accountGroupes)
                  ?.find((u) => u.groupID === groupe?.groupID);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (addNewRoleData?.groupID === groupe.groupID) {
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          groupID: "-",
                        }));
                      } else {
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          groupID: groupe?.groupID,
                        }));
                      }
                    }}
                    className={`shadow-lg justify-between cursor-pointer relative flex gap-3 items-center rounded-lg py-2 px-2 ${
                      isSelected ? "bg-gray-50/50" : "bg-gray-50/50"
                    }`}
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <PiIntersectThreeBold className="text-gray-500 text-[2.5rem]" />
                    <div className="w-full">
                      <p className="text-gray-600">
                        {t("groupID")} :{" "}
                        <span className="font-bold notranslate">
                          {groupe?.groupID}
                        </span>
                      </p>
                      {/* <p className="text-gray-600">
                        {t("Nom du Groupe")} :{" "}
                        <span className="font-bold notranslate">
                          {groupe?.description}
                        </span>
                      </p> */}
                      <p className="text-gray-600">
                        {t("Nombre d'appareil")} :{" "}
                        <span className="font-bold">
                          {foundGroupe?.groupeDevices?.length}
                        </span>
                      </p>
                    </div>
                    <div className="min-w-[4rem]">
                      {isSelected ? (
                        <IoMdRadioButtonOn className="text-[2rem] text-green-500" />
                      ) : (
                        <IoMdRadioButtonOff className="text-[2rem] text-red-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 px-4 mb-4 mt-2">
              <button
                onClick={() => {
                  setShowGroupesSelectionnesPopup(false);
                }}
                className="py-2 text-white rounded-md bg-orange-600 font-bold"
              >
                {t("Confirmer")}
              </button>
              <button
                onClick={() => {
                  setShowGroupesSelectionnesPopup(false);
                }}
                className="py-2  rounded-md bg-gray-100 font-bold"
              >
                {t("Annuler")}
              </button>
            </div>
          </div>
        </div>
      )}
      {showdeviceSelectionnePopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh]  relative  bg-white rounded-lg">
            <h2
              // onClick={() => {
              //   console.log("tous les Groupes: ", allGroupIDs);
              // }}
              className="text-center py-4 bg-orange-300 font-bold text-lg"
            >
              {t("Choisissez un Appareil")}
            </h2>
            <IoClose
              onClick={() => {
                setShowdeviceSelectionnePopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            {/* <p className="mx-2 mb-3 text-center mt-4 text-lg">
              {t("Choisissez un Appareil")}
            </p> */}
            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un compte")}`}
                value={searchInputTerm}
                onChange={(e) => {
                  setSearchInputTerm(e.target.value);
                }}
              />

              <div className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100">
                <IoSearchOutline className="text-xl " />
              </div>
            </div>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {filterGestionAccountData?.map((device, index) => {
                const isSelected = deviceSelectionne === device?.deviceID;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (deviceSelectionne === device.deviceID) {
                        setdeviceSelectionne("");
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          imeiNumber: "*",
                        }));
                      } else {
                        setdeviceSelectionne(device.deviceID);
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          imeiNumber: device?.imeiNumber,
                        }));
                      }
                    }}
                    className={`shadow-lg justify-between cursor-pointer relative flex gap-3 items-center rounded-lg py-2 px-2 ${
                      isSelected ? "bg-gray-50/50" : "bg-gray-50/50"
                    }`}
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <PiIntersectThreeBold className="text-gray-500 text-[2.5rem]" />
                    <div className="w-full">
                      <p className="text-gray-600">
                        {t("Description")} :{" "}
                        <span className="font-bold notranslate">
                          {device?.description}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("accountID")} :{" "}
                        <span className="font-bold notranslate">
                          {device?.accountID}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("imeiNumber")} :{" "}
                        <span className="font-bold notranslate">
                          {device?.imeiNumber || "--------------"}
                        </span>
                      </p>
                    </div>
                    <div className="min-w-[4rem]">
                      {isSelected ? (
                        <IoMdRadioButtonOn className="text-[2rem] text-green-500" />
                      ) : (
                        <IoMdRadioButtonOff className="text-[2rem] text-red-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 px-4 mb-4 mt-2">
              <button
                onClick={() => {
                  setShowdeviceSelectionnePopup(false);
                }}
                className="py-2 text-white rounded-md bg-orange-600 font-bold"
              >
                {t("Confirmer")}
              </button>
              <button
                onClick={() => {
                  setShowdeviceSelectionnePopup(false);
                }}
                className="py-2  rounded-md bg-gray-100 font-bold"
              >
                {t("Annuler")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour la confirmation du mot de passe */}
      <ConfirmationPassword
        showConfirmPassword={showConfirmAddGroupeGestionPopup}
        setShowConfirmPassword={setShowConfirmAddGroupeGestionPopup}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handlePasswordCheck={handlePasswordCheck}
        setIsPasswordConfirmed={setShowConfirmAddGroupeGestionPopup}
      />

      <div className="flex  w-full justify-center h-full  ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6 mb-10- border-- shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                {currentSelectedRole
                  ? t("Modifier la règle")
                  : t("Créer une nouvelle règle")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_roles");
                  navigate("/Gestion_des_roles");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Champs du formulaire */}
                {[
                  {
                    id: "ruleID",
                    label: `${t("ruleID")}`,
                    placeholder: "ruleID",
                  },
                  {
                    id: "description",
                    label: `${t("description")}`,
                    placeholder: "description",
                  },

                  {
                    id: "notifyEmail",
                    label: `${t("notifyEmail")}`,
                    placeholder: `${t("notifyEmail")}`,
                  },
                  //
                  {
                    id: "emailSubject",
                    label: `${t("emailSubject")}`,
                    placeholder: `${t("emailSubject")}`,
                  },

                  // {
                  //   id: "smsText",
                  //   label: `${t("smsText")}`,
                  //   placeholder: `${t("smsText")}`,
                  // },

                  {
                    id: "isActive",
                    label: `${t("isActive")}`,
                    placeholder: `${t("isActive")}`,
                  },
                  {
                    id: "selector",
                    label: `${t("selector")}`,
                    placeholder: `${t("selector")}`,
                  },
                  {
                    id: "emailText",
                    label: `${t("emailText")}`,
                    placeholder: `${t("emailText")}`,
                  },
                ].map((field) => {
                  const requiredFields = [
                    "accountID",
                    "ruleID",
                    "description",
                    "emailSubject",
                    "emailText",
                    "selector",
                  ];
                  return (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block-- flex justify-between items-center text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
                      >
                        {field.label}{" "}
                        {requiredFields.includes(field.id) &&
                          !addNewRoleData[field.id] && (
                            <span className="text-red-600 text-lg"> *</span>
                          )}
                      </label>

                      {/*  */}
                      {field.id === "accountID" ? (
                        <div
                          onClick={() => {
                            setChooseOtherAccountGestion(true);
                          }}
                          className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                        >
                          <p>
                            {accountIdFromRole ||
                              `${t("Pas de compte sélectionner")}`}
                          </p>
                          <FaChevronDown className="text-gray-700 mr-4" />
                        </div>
                      ) : field.id === "emailText" ? (
                        <textarea
                          id={field.id}
                          name={field.id}
                          type="text"
                          placeholder={field.placeholder}
                          value={addNewRoleData[field.id]?.replace(
                            /\\n/g,
                            "\n"
                          )}
                          // value={addNewRoleData[field.id]}
                          onChange={handleChange}
                          required
                          className="block px-3 w-full border-b min-h-40 pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : field.id === "isActive" ? (
                        <select
                          id="isActive"
                          name="isActive"
                          value={addNewRoleData[field.id]}
                          onChange={handleChange}
                          required
                          className="  w-full   border-0 py-2 px-3 text-gray-900       border-b focus:outline-none  "
                        >
                          <option value="">{t("Activer le Role")} ?</option>
                          <option value="1">{t("oui")}</option>
                          <option value="0">{t("non")}</option>
                        </select>
                      ) : field.id === "groupID" ? (
                        <div
                          onClick={() => {
                            setShowGroupesSelectionnesPopup(true);
                          }}
                          className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                        >
                          <p>
                            {addNewRoleData?.groupID === "-"
                              ? `${t("Tous")}`
                              : addNewRoleData?.groupID}
                          </p>
                          <FaChevronDown className="text-gray-700 mr-4" />
                        </div>
                      ) : (
                        <input
                          id={field.id}
                          name={field.id}
                          type="text"
                          placeholder={field.placeholder}
                          value={addNewRoleData[field.id]}
                          onChange={handleChange}
                          disabled={
                            currentSelectedRole && field.id === "ruleID"
                          }
                          // { field.id === "groupID" && disable}
                          // disabled={field.id === "userID"}
                          required={requiredFields.includes(field.id)}
                          // required
                          className="block px-3 w-full border-b pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                      )}
                    </div>
                  );
                })}

                {errorID && (
                  <p className="flex items-start gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-md translate-y-4 px-4 py-1 rounded-md text-center">
                    <MdErrorOutline className="text-2xl mt-0.5" />
                    {errorID}
                  </p>
                )}

                <div className="grid  grid-cols-2 gap-2 pt-10 pb-10 pb-6-">
                  <button
                    onClick={() => setError("")}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-orange-600 dark:bg-orange-700 px-3 py-1.5 text-md font-semibold text-white hover:bg-orange-700 dark:hover:bg-orange-800"
                  >
                    {t("Enregistrer")}
                  </button>
                  <button
                    onClick={() => {
                      setDocumentationPage("Gestion_des_roles");
                      scrollToTop();
                      navigate("/Gestion_des_roles");
                    }}
                    className="flex w-full justify-center rounded-md border text-orange-500 dark:text-orange-400 border-orange-600 px-3 py-1.5 text-md font-semibold hover:bg-orange-100 dark:hover:bg-orange-900"
                  >
                    {t("Annuler")}
                  </button>
                </div>
              </form>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewRole;

// export default CreateNewRole
