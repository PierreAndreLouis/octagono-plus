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

function CreateNewRoleActive({
  setDocumentationPage,
  documentationPage,
  accountIdFromRole,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  currentSelectedRoleActive,
  setCurrentSelectedRoleActive,
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
    assignRulesToDeviceOrGroupe,
    accountRules,
    ModifierassignRulesToDeviceOrGroupe,
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
    accountID: "",
    imeiNumber: "*",
    deviceID: "*",
    groupID: "-",
    ruleID: "",
    statusCode: "0",
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

    if (!currentAccountSelected) {
      // setErrorID(`${t("Veuillez choisir un compte")}`);
      setChooseOneAccountToContinue(true);
      setChooseOtherAccountGestion(true);
      return;
    }

    if (!addNewRoleData?.ruleID) {
      setErrorID(`${t("Le champ ruleID est vide")}`);
      return;
    }

    const ruleID = addNewRoleData.ruleID;
    const deviceID = addNewRoleData.deviceID;
    const groupID = addNewRoleData.groupID;

    const ruleExists = currentAccountSelected?.accountRulesActive?.some(
      (rule) =>
        rule?.ruleID === ruleID &&
        rule?.deviceID === deviceID &&
        rule?.groupID === groupID
    );

    if (!currentSelectedRoleActive && ruleExists) {
      setErrorID(
        `${t("Ce role est deja créer. Veuillez modifier l'un des champs")}`
      );
      return;
    }

    setShowConfirmAddGroupeGestionPopup(true);
  };

  useEffect(() => {
    setErrorID("");
  }, [addNewRoleData]);

  const [showIsUserActivePopup, setShowIsUserActivePopup] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [deviceSelectionne, setdeviceSelectionne] = useState("");
  const [ruleSelectionne, setRuleSelectionne] = useState("");

  const [showdeviceSelectionnePopup, setShowdeviceSelectionnePopup] =
    useState(false);

  const [showRoleSelectionnePopup, setShowRoleSelectionnePopup] =
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

    if (inputPassword === adminPassword) {
      const accountID = addNewRoleData.accountID;
      const imeiNumber = addNewRoleData.imeiNumber;
      const deviceID = addNewRoleData.deviceID;

      const groupID = addNewRoleData.groupID;

      const ruleID = addNewRoleData.ruleID;
      const statusCode = addNewRoleData.statusCode;

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

      console.log("accountID ", accountID);
      console.log("imeiNumber ", imeiNumber);
      console.log("deviceID ", deviceID);
      console.log("groupID ", groupID);
      console.log("isCronRule ", isCronRule);
      console.log("ruleTag ", ruleTag);
      console.log("selector ", selector);
      console.log("actionMask ", actionMask);
      console.log("cannedActions ", cannedActions);
      console.log("priority ", priority);
      console.log("notifyEmail ", notifyEmail);
      console.log("emailSubject ", emailSubject);
      console.log("emailText ", emailText);
      console.log("smsText ", smsText);
      console.log("useEmailWrapper ", useEmailWrapper);
      console.log("ruleDisable ", ruleDisable);
      console.log("ruleEnable ", ruleEnable);
      console.log("sendCommand ", sendCommand);
      console.log("isActive ", isActive);
      console.log("description ", description);

      if (
        currentAccountSelected?.accountID &&
        currentAccountSelected?.password
      ) {
        console.log(
          currentAccountSelected?.accountID,
          "admin",
          currentAccountSelected?.password,

          ruleID,
          statusCode,

          emailSubject,
          emailText,
          selector,
          isActive
        );

        if (currentSelectedRoleActive) {
          console.log("xxxxxxxx");

          ModifierassignRulesToDeviceOrGroupe(
            currentAccountSelected?.accountID ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.accountID,
            "admin",
            currentAccountSelected?.password ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.password,
            //
            deviceID,
            groupID,
            statusCode,
            ruleID
          );
        } else {
          //   console.log(
          assignRulesToDeviceOrGroupe(
            currentAccountSelected?.accountID,
            "admin",
            currentAccountSelected?.password,
            //
            deviceID,
            groupID,
            statusCode,
            ruleID
          );
        }

        navigate("/Gestion_des_roles_actives");

        setDocumentationPage("Gestion_des_roles_actives");
      }

      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const [searchInputTerm, setSearchInputTerm] = useState("");
  const [searchInputTermGroup, setSearchInputTermGroup] = useState("");
  const [searchInputTermRole, setSearchInputTermRole] = useState("");

  const filterGestionAccountData = searchInputTerm
    ? (currentAccountSelected
        ? currentAccountSelected?.accountDevices
        : accountDevices
      )?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchInputTerm.toLowerCase()) ||
          item?.deviceID
            .toLowerCase()
            .includes(searchInputTerm.toLowerCase()) ||
          item?.imeiNumber.toLowerCase().includes(searchInputTerm.toLowerCase())
      )
    : currentAccountSelected
    ? currentAccountSelected?.accountDevices
    : accountDevices;

  const filterRulesGestionAccountData = searchInputTermRole
    ? (currentAccountSelected
        ? currentAccountSelected?.accountRules
        : accountRules
      )?.filter(
        (item) =>
          item?.description
            .toLowerCase()
            .includes(searchInputTermRole.toLowerCase()) ||
          item?.ruleID
            .toLowerCase()
            .includes(searchInputTermRole.toLowerCase()) ||
          item?.accountID
            .toLowerCase()
            .includes(searchInputTermRole.toLowerCase())
      )
    : currentAccountSelected
    ? currentAccountSelected?.accountRules
    : accountRules;

  const filterGroupAccountData = searchInputTermGroup
    ? (currentAccountSelected
        ? currentAccountSelected?.accountGroupes
        : accountGroupes
      )?.filter(
        (item) =>
          item?.groupID
            .toLowerCase()
            .includes(searchInputTermGroup.toLowerCase()) ||
          item?.description
            .toLowerCase()
            .includes(searchInputTermGroup.toLowerCase())
      )
    : currentAccountSelected
    ? currentAccountSelected?.accountGroupes
    : accountGroupes;

  const [showGroupesSelectionnesPopup, setShowGroupesSelectionnesPopup] =
    useState(false);

  useEffect(() => {
    if (currentSelectedRoleActive) {
      setAddNewRoleData({
        accountID: currentSelectedRoleActive.accountID || "",
        deviceID: currentSelectedRoleActive.deviceID || "",
        imeiNumber: currentSelectedRoleActive.imeiNumber || "",
        groupID: currentSelectedRoleActive.groupID || "",
        ruleID: currentSelectedRoleActive.ruleID || "",
        statusCode: currentSelectedRoleActive.statusCode || "",

        isCronRule: currentSelectedRoleActive.isCronRule || "",
        ruleTag: currentSelectedRoleActive.ruleTag || "",
        selector: currentSelectedRoleActive.selector || "",
        actionMask: currentSelectedRoleActive.actionMask || "",
        cannedActions: currentSelectedRoleActive.cannedActions || "",
        priority: currentSelectedRoleActive.priority || "",
        notifyEmail: currentSelectedRoleActive.notifyEmail || "",
        emailSubject: currentSelectedRoleActive.emailSubject || "",
        emailText: currentSelectedRoleActive.emailText || "",
        smsText: currentSelectedRoleActive.smsText || "",
        useEmailWrapper: currentSelectedRoleActive.useEmailWrapper || "",
        ruleDisable: currentSelectedRoleActive.ruleDisable || "",
        ruleEnable: currentSelectedRoleActive.ruleEnable || "",
        sendCommand: currentSelectedRoleActive.sendCommand || "",
        isActive:
          currentSelectedRoleActive.isActive === "true" ? "1" : "0" || "",
        description: currentSelectedRoleActive.description || "",
      });
    }
  }, [currentSelectedRoleActive]);

  const foundDeviceDescription = accountDevices?.find(
    (d) => d?.deviceID === addNewRoleData?.deviceID
  )?.description;

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
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] relative  bg-white rounded-lg">
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

            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un Groupe")}`}
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
                      setShowGroupesSelectionnesPopup(false);
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
          </div>
        </div>
      )}
      {showdeviceSelectionnePopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] relative  bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Choisissez un Appareil")}
            </h2>
            <IoClose
              onClick={() => {
                setShowdeviceSelectionnePopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />

            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un Appareil")}`}
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
                          deviceID: "*",
                        }));
                      } else {
                        setdeviceSelectionne(device.deviceID);
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          deviceID: device?.deviceID,
                        }));
                        setShowdeviceSelectionnePopup(false);
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
                        {t("ID de l'appareil")} :{" "}
                        <span className="font-bold notranslate">
                          {device?.deviceID || "--------------"}
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
          </div>
        </div>
      )}

      {showRoleSelectionnePopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] relative  bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Choisissez un Role")}
            </h2>
            <IoClose
              onClick={() => {
                setShowRoleSelectionnePopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            <div className="flex pb-2 mx-3 mt-4 gap-2 justify-between items-center">
              <input
                className="w-full dark:bg-gray-800 border p-4 py-1.5 rounded-lg  dark:border-gray-600 dark:text-gray-200"
                type="text"
                placeholder={`${t("Rechercher un Role")}`}
                value={searchInputTermRole}
                onChange={(e) => {
                  setSearchInputTermRole(e.target.value);
                }}
              />

              <div className="border cursor-pointer px-3  py-2 border-gray-300 rounded-md bg-gray-100">
                <IoSearchOutline className="text-xl " />
              </div>
            </div>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {filterRulesGestionAccountData?.map((rule, index) => {
                const isSelected = ruleSelectionne === rule?.ruleID;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (ruleSelectionne === rule.ruleID) {
                        setRuleSelectionne("");
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          ruleID: "",
                        }));
                      } else {
                        setRuleSelectionne(rule.ruleID);
                        setAddNewRoleData((prev) => ({
                          ...prev,
                          ruleID: rule?.ruleID,
                        }));
                      }
                      setShowRoleSelectionnePopup(false);
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
                          {rule?.description}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("accountID")} :{" "}
                        <span className="font-bold notranslate">
                          {rule?.accountID}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("selector")} :{" "}
                        <span className="font-bold notranslate">
                          {rule?.selector || "--------------"}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("actionMask")} :{" "}
                        <span className="font-bold notranslate">
                          {rule?.actionMask || "--------------"}
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
                {t("Activer un nouveau Role")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_roles_actives");
                  navigate("/Gestion_des_roles_actives");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {foundDeviceDescription && (
                  <p className=" text-md font-medium leading-6 text-gray-700 dark:text-gray-300">
                    {t("Nom de l'appareil")} : <br />{" "}
                    <span className="font-normal pl-4">
                      {foundDeviceDescription}
                    </span>
                  </p>
                )}
                {/* Champs du formulaire */}
                {[
                  {
                    id: "deviceID",
                    label: `${t("deviceID")}`,
                    placeholder: "deviceID",
                  },
                  {
                    id: "groupID",
                    label: `${t("groupID")}`,
                    placeholder: "groupID",
                  },
                  {
                    id: "ruleID",
                    label: `${t("ruleID")}`,
                    placeholder: "ruleID",
                  },
                  {
                    id: "statusCode",
                    label: `${t("statusCode")}`,
                    placeholder: "statusCode",
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
                      ) : field.id === "deviceID" ? (
                        <div
                          onClick={() => {
                            setShowdeviceSelectionnePopup(true);
                          }}
                          className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                        >
                          <p>
                            {addNewRoleData?.deviceID === "*"
                              ? `${t("Tous")}`
                              : addNewRoleData?.deviceID}
                          </p>
                          <FaChevronDown className="text-gray-700 mr-4" />
                        </div>
                      ) : field.id === "ruleID" ? (
                        <div
                          onClick={() => {
                            setShowRoleSelectionnePopup(true);
                          }}
                          className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                        >
                          <p>
                            {addNewRoleData?.ruleID || "Choisissez un role"}
                          </p>
                          <FaChevronDown className="text-gray-700 mr-4" />
                        </div>
                      ) : field.id === "isActive" ? (
                        <div
                          onClick={() => {
                            setShowIsUserActivePopup(true);
                          }}
                          className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                        >
                          <p>
                            {addNewRoleData?.isActive === "1"
                              ? "true"
                              : "false"}
                          </p>
                          <FaChevronDown className="text-gray-700 mr-4" />
                        </div>
                      ) : field.id === "emailText" ? (
                        <textarea
                          id={field.id}
                          name={field.id}
                          type="text"
                          placeholder={field.placeholder}
                          value={addNewRoleData[field.id]}
                          onChange={handleChange}
                          required
                          className="block px-3 w-full border-b min-h-40 pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : field.id === "statusCode" ? (
                        <div className="border border-gray-800/0  border-b-gray-300">
                          <select
                            id="statusCode"
                            name="statusCode"
                            placeholder={field.placeholder}
                            value={addNewRoleData[field.id]}
                            onChange={handleChange}
                            required
                            className="block w-full focus:outline-none  py-1.5 px-3 text-gray-900     "
                          >
                            <option value="">
                              {t("Sélectionner un statut de code")}
                            </option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </div>
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
                            currentSelectedRoleActive && field.id === "ruleID"
                          }
                          // { field.id === "groupID" && disable}
                          // disabled={field.id === "userID"}
                          required={requiredFields.includes(field.id)}
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
                      scrollToTop();
                      setDocumentationPage("Gestion_des_roles_actives");
                      navigate("/Gestion_des_roles_actives");
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

export default CreateNewRoleActive;
