import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeft, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { PiIntersectThreeBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreateNewUserGestion({
  setDocumentationPage,
  documentationPage,
  setChooseOneAccountToContinue,
  setChooseOtherAccountGestion,
  isCreatingNewElement,
  setIsCreatingNewElement,
}) {
  const {
    currentAccountSelected,
    setError,
    currentSelectedUserToConnect,
    scrollToTop,
    createNewUserEnGestionAccount,
    timeZoneData,
    userRole,
    adminPassword,
    ModifyUserEnGestionAccountFonction,
    gestionAccountData,
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
  const [addNewUserData, setAddNewUserData] = useState({
    userID: "",
    description: "",
    displayName: "",
    contactEmail: "",
    notifyEmail: "",
    isActive: "1",
    contactPhone: "",
    contactName: "",
    userType: "0",
    addressCity: "",
    addressCountry: "",

    timeZone: "GMT-04:00",
    maxAccessLevel: "3",
    password: "",
    password2: "",
    roleID: "!clientproprietaire",
  });

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (["userID", "password", "password2"].includes(name)) {
      newValue = value.replace(/\s/g, "_"); // remplace les espaces par des underscores
    }

    if (name === "userID") {
      newValue = newValue.toLowerCase(); // convertit en minuscules uniquement pour userID
    }
    setAddNewUserData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setErrorID(""); // Réinitialise l'erreur lorsque l'utilisateur modifie l'entrée
  };

  const isValidUserData = () => {
    const phoneRegex = /^\+?\d{6,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = [];

    if (!emailRegex.test(addNewUserData.contactEmail)) {
      errors.push(`${t("L'email de contact n'est pas valide")}`);
    }

    if (!emailRegex.test(addNewUserData.notifyEmail)) {
      errors.push(`${t("L'email de notification n'est pas valide")}`);
    }

    if (!phoneRegex.test(addNewUserData.contactPhone)) {
      errors.push(`${t("Le numéro de téléphone est invalide")}`);
    }

    if (addNewUserData.password.length < 6) {
      errors.push(
        `${t("Le mot de passe doit contenir au moins 6 caractères")}`
      );
    }

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

    if (addNewUserData?.password !== addNewUserData?.password2) {
      setErrorID(`${t("Les mots de passe ne correspondent pas")}`);
      return;
    }

    const userID = addNewUserData.userID;

    const userExists = currentAccountSelected?.accountUsers?.some(
      (user) => user?.userID === userID
    );

    if (isCreatingNewElement && userExists) {
      setErrorID(
        `${t(
          "Cet identifiant (userID) est déjà utilisé. Veuillez en choisir un autre"
        )}`
      );
      return;
    }

    if (!currentAccountSelected) {
      setChooseOneAccountToContinue(true);
      setChooseOtherAccountGestion(true);
      return;
    }

    setShowConfirmAddGroupeGestionPopup(true);
  };

  const [showTimeZonePopup, setShowTimeZonePopup] = useState(false);
  const [showUserRolePopup, setShowUserRolePopup] = useState(false);
  const [maxAccessLevelText, setMaxAccessLevelText] = useState("Write/Edit");
  const [showIsUserActivePopup, setShowIsUserActivePopup] = useState(false);
  const [showUserTypePopup, setShowUserTypePopup] = useState(false);
  const [showIsUserActivePopupText, setShowIsUserActivePopupText] =
    useState("true");

  const [showMaxAccessLevelPopup, setShowMaxAccessLevelPopup] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  const groupeDuSelectedUser = currentSelectedUserToConnect?.userGroupes?.map(
    (groupe) => groupe?.groupID
  );

  const allGroupIDs = currentAccountSelected?.accountGroupes?.map(
    (groupe) => groupe?.groupID
  );
  const [groupesSelectionnes, setGroupesSelectionnes] = useState(
    groupeDuSelectedUser?.[0] || ""
  );

  const groupesNonSelectionnes = allGroupIDs?.filter(
    (userID) => !groupesSelectionnes.includes(userID)
  );

  const [showGroupesSelectionnesPopup, setShowGroupesSelectionnesPopup] =
    useState(false);
  //////////////////

  useEffect(() => {
    if (isCreatingNewElement) {
      setGroupesSelectionnes("");
    }
  }, [documentationPage, isCreatingNewElement]);

  //////////////////////////////////////////////////////////

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === adminPassword) {
      const userID = addNewUserData.userID;
      const description = addNewUserData.description;
      const displayName = addNewUserData.description;

      const contactEmail = addNewUserData.contactEmail;
      const notifyEmail = addNewUserData.notifyEmail;
      const isActive = addNewUserData.isActive;
      const contactPhone = addNewUserData.contactPhone;
      const contactName = addNewUserData.contactName;
      const userType = addNewUserData.userType;

      const timeZone = addNewUserData.timeZone;
      const maxAccessLevel = addNewUserData.maxAccessLevel;
      const roleID = addNewUserData.roleID;
      const addressCity = addNewUserData.addressCity;
      const addressCountry = addNewUserData.addressCountry;

      const password2 = addNewUserData.password2;

      if (
        currentAccountSelected?.accountID &&
        currentAccountSelected?.password
      ) {
        // console.log(

        if (isCreatingNewElement) {
          createNewUserEnGestionAccount(
            currentAccountSelected?.accountID,
            "admin",
            currentAccountSelected?.password,

            userID,
            description,
            displayName,
            password2,
            contactEmail,
            notifyEmail,
            isActive,
            contactPhone,
            contactName,
            timeZone,
            maxAccessLevel,
            roleID,
            //
            addressCity,
            addressCountry,
            userType,
            //
            groupesSelectionnes
          );
        } else {
          ModifyUserEnGestionAccountFonction(
            currentAccountSelected?.accountID ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.accountID,
            "admin",
            currentAccountSelected?.password ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.password,

            userID,
            description,
            displayName,
            password2,
            contactEmail,
            notifyEmail,
            isActive,
            contactPhone,
            contactName,
            timeZone,
            maxAccessLevel,
            roleID,
            //
            userType,
            addressCity,
            addressCountry,
            //
            groupesSelectionnes,
            groupesNonSelectionnes
          );
        }

        setDocumentationPage("Gestion_des_utilisateurs");
        navigate("/Gestion_des_utilisateurs");
      }

      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  //   Pour mettre a jour les nouvelle donnee du véhicule a modifier
  useEffect(() => {
    if (currentSelectedUserToConnect && !isCreatingNewElement) {
      setAddNewUserData({
        userID: currentSelectedUserToConnect.userID || "",
        description: currentSelectedUserToConnect.description || "",
        displayName: currentSelectedUserToConnect.displayName || "",
        contactEmail: currentSelectedUserToConnect.contactEmail || "",
        notifyEmail: currentSelectedUserToConnect.notifyEmail || "",
        isActive: currentSelectedUserToConnect.isActive === "true" ? "1" : "0",
        contactPhone: currentSelectedUserToConnect.contactPhone || "",
        contactName: currentSelectedUserToConnect.contactName || "",
        userType: currentSelectedUserToConnect.userType || "",
        addressCity: currentSelectedUserToConnect.addressCity || "",
        addressCountry: currentSelectedUserToConnect.addressCountry || "",
        timeZone: currentSelectedUserToConnect.timeZone || "",
        maxAccessLevel: currentSelectedUserToConnect.maxAccessLevel || "",

        roleID: currentSelectedUserToConnect.roleID || "",
        password: currentSelectedUserToConnect.password || "",
        password2: currentSelectedUserToConnect.password || "",
      });
      if (currentSelectedUserToConnect.maxAccessLevel === "0") {
        setMaxAccessLevelText("New/Delete");
      } else if (currentSelectedUserToConnect.maxAccessLevel === "1") {
        setMaxAccessLevelText("Read/View");
      } else if (currentSelectedUserToConnect.maxAccessLevel === "2") {
        setMaxAccessLevelText("Write/Edit");
      } else if (currentSelectedUserToConnect.maxAccessLevel === "3") {
        setMaxAccessLevelText("Accès complet");
      }
    }
  }, [currentSelectedUserToConnect, isCreatingNewElement]);

  return (
    <div className="px-3 rounded-lg  bg-white">
      {showMaxAccessLevelPopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setShowMaxAccessLevelPopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Choisir un max access level")}:
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                maxAccessLevelText === "New/Delete"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setMaxAccessLevelText("New/Delete");
                setAddNewUserData((prev) => ({
                  ...prev,
                  maxAccessLevel: "0",
                }));
                setShowMaxAccessLevelPopup(false);
              }}
            >
              <p>{t("New/Delete")}</p>
              <p>0</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                maxAccessLevelText === "Read/View"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setMaxAccessLevelText("Read/View");
                setAddNewUserData((prev) => ({
                  ...prev,
                  maxAccessLevel: "1",
                }));
                setShowMaxAccessLevelPopup(false);
              }}
            >
              <p>{t("Read/View")}</p>
              <p>1</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                maxAccessLevelText === "Write/Edit"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setMaxAccessLevelText("Write/Edit");
                setAddNewUserData((prev) => ({
                  ...prev,
                  maxAccessLevel: "2",
                }));
                setShowMaxAccessLevelPopup(false);
              }}
            >
              <p>{t("Write/Edit")}</p>
              <p>2</p>
            </div>
            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                maxAccessLevelText === "Accès complet"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setMaxAccessLevelText("Accès complet");
                setAddNewUserData((prev) => ({
                  ...prev,
                  maxAccessLevel: "3",
                }));
                setShowMaxAccessLevelPopup(false);
              }}
            >
              <p>{t("Accès complet")}</p>
              <p>3</p>
            </div>
          </div>
        </div>
      )}

      {showUserTypePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setShowUserTypePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Type de l'utilisateur")}:
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewUserData?.userType === "1"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                // setShowIsUserActivePopupText("true");
                setAddNewUserData((prev) => ({
                  ...prev,
                  userType: "1",
                }));
                setShowUserTypePopup(false);
              }}
            >
              <p>{t("Utilisateur standard / limité")}</p>
              <p>1</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewUserData?.userType === "0"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                // setShowIsUserActivePopupText("false");
                setAddNewUserData((prev) => ({
                  ...prev,
                  userType: "0",
                }));
                setShowUserTypePopup(false);
              }}
            >
              <p>{t("Utilisateur Administrateur / Superviseur")}</p>
              <p>0</p>
            </div>
          </div>
        </div>
      )}
      {showTimeZonePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setShowTimeZonePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Choisir un TimeZone")}:
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              {timeZoneData?.map((zone, index) => {
                return (
                  <div
                    key={index}
                    className={`cursor-pointer border-b py-3 hover:bg-gray-100 flex justify-between items-center dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      addNewUserData.timeZone === `${zone?.region}:00`
                        ? "bg-gray-100 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setAddNewUserData((prev) => ({
                        ...prev,
                        timeZone: zone?.region + ":00",
                      }));
                      setShowTimeZonePopup(false);
                    }}
                  >
                    <p>{zone?.region + ":00"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showUserRolePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setShowUserRolePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("choisissez un role")}:
            </h2>
            <div className="max-h-[60vh] overflow-auto">
              {userRole?.map((role, index) => {
                return (
                  <div
                    key={index}
                    className={`cursor-pointer border-b py-3 hover:bg-gray-100 flex justify-between items-center dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                      addNewUserData.roleID === role?.roleID
                        ? "bg-gray-100 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setAddNewUserData((prev) => ({
                        ...prev,
                        roleID: role?.roleID,
                      }));
                      setShowUserRolePopup(false);
                    }}
                  >
                    <p className="notranslate">{role?.description}</p>
                    <p className="notranslate">{role?.roleID}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showGroupesSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh]  relative  bg-white rounded-lg">
            <h2
              // onClick={() => {
              //   console.log("tous les Groupes: ", allGroupIDs);
              // }}
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
            <p className="mx-2 mb-3 text-center mt-4 text-lg">
              {t("Choisissez un Groupe pour affecter l'utilisateur")}
            </p>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {currentAccountSelected?.accountGroupes?.map((groupe, index) => {
                const isSelected = groupesSelectionnes === groupe.groupID;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (groupesSelectionnes === groupe.groupID) {
                        setGroupesSelectionnes("");
                      } else {
                        setGroupesSelectionnes(groupe.groupID);
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
                        {t("Nom du Groupe")} :{" "}
                        <span className="font-bold notranslate">
                          {groupe?.description}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre d'appareil")} :{" "}
                        <span className="font-bold">
                          {groupe?.groupeDevices?.length}
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

            {/* <div className="grid grid-cols-2 gap-4 px-4 mb-4 mt-2">
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
            </div> */}
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
                {isCreatingNewElement
                  ? t("Ajouter un nouveau Utilisateur")
                  : t("Modifier l'utilisateur")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_utilisateurs");
                  navigate("/Gestion_des_utilisateurs");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <p className="mb-2 font-semibold text-gray-700">
              {t("Choisissez un groupe pour affecter l'utilisateur")}
            </p>
            <div
              onClick={() => {
                setShowGroupesSelectionnesPopup(true);
              }}
              className="w-full mb-10 cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
            >
              <h3 className="w-full text-center-- font-semibold">
                <span>
                  {groupesSelectionnes
                    ? groupesSelectionnes
                    : `${t("Pas de groupe sélectionner")}`}
                </span>
              </h3>
              <FaChevronDown />
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Champs du formulaire */}
                {[
                  {
                    id: "userID",
                    label: `${t("ID de l'utilisateur")}`,
                    placeholder: "ex: Victor",
                  },
                  {
                    id: "description",
                    label: `${t("Description")}`,
                    placeholder: `${t("Nom de l'utilisateur")}`,
                  },

                  {
                    id: "contactEmail",
                    label: `${t("contactEmail")}`,
                    placeholder: `${t("contactEmail")}`,
                  },
                  {
                    id: "notifyEmail",
                    label: `${t("notifyEmail")}`,
                    placeholder: `${t("notifyEmail")}`,
                  },

                  {
                    id: "contactPhone",
                    label: `${t("Telephone")}`,
                    placeholder: `${t("Telephone")}`,
                  },
                  {
                    id: "contactName",
                    label: `${t("contactName")}`,
                    placeholder: `${t("contactName")}`,
                  },

                  {
                    id: "addressCity",
                    label: `${t("addressCity")}`,
                    placeholder: `${t("addressCity")}`,
                  },
                  {
                    id: "addressCountry",
                    label: `${t("addressCountry")}`,
                    placeholder: `${t("addressCountry")}`,
                  },
                  {
                    id: "isActive",
                    label: `${t("isActive")}`,
                    placeholder: `${t("isActive")}`,
                  },

                  {
                    id: "timeZone",
                    label: `${t("TimeZone")}`,
                    placeholder: "",
                  },
                  {
                    id: "roleID",
                    label: `${t("roleID")}`,
                    placeholder: "",
                  },

                  //
                  {
                    id: "password",
                    label: `${t("Mot de passe")}`,
                    placeholder: `${t("Ajouter un mot de passe")}`,
                  },
                  {
                    id: "password2",
                    label: `${t("Confirmer le mot de passe")}`,
                    placeholder: `${t("Confirmer le mot de passe")}`,
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block-- flex justify-between items-center text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
                    >
                      {field.label}{" "}
                      {!addNewUserData[field.id] && (
                        <span className="text-red-600 text-lg"> *</span>
                      )}
                    </label>
                    {/*  */}
                    {field.id === "maxAccessLevel" ? (
                      <div
                        onClick={() => {
                          setShowMaxAccessLevelPopup(true);
                        }}
                        className="pl-4 pt-1 border-b pb-2 flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{maxAccessLevelText}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : field.id === "addressCountry" ? (
                      <select
                        id="addressCountry"
                        name="addressCountry"
                        value={addNewUserData[field.id]}
                        onChange={handleChange}
                        required
                        className="  w-full   border-0 py-2 px-3 text-gray-900       border-b focus:outline-none  "
                      >
                        <option value="">{t("Sélectionner une Pays")}</option>
                        <option value="República Dominicana">
                          {t("República Dominicana")}
                        </option>
                        <option value="Haïti">{t("Haïti")}</option>
                      </select>
                    ) : field.id === "isActive" ? (
                      <select
                        id="isActive"
                        name="isActive"
                        value={addNewUserData[field.id]}
                        onChange={handleChange}
                        required
                        className="  w-full   border-0 py-2 px-3 text-gray-900       border-b focus:outline-none  "
                      >
                        <option value="">{t("Activer l'utilisateur")} ?</option>
                        <option value="true">{t("oui")}</option>
                        <option value="false">{t("non")}</option>
                      </select>
                    ) : field.id === "timeZone" ? (
                      <div
                        onClick={() => {
                          setShowTimeZonePopup(true);
                        }}
                        className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{addNewUserData?.timeZone}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : field.id === "roleID" ? (
                      <div
                        onClick={() => {
                          setShowUserRolePopup(true);
                        }}
                        className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{addNewUserData?.roleID}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : // : field.id === "userType" ? (
                    //   <div
                    //     onClick={() => {
                    //       setShowUserTypePopup(true);
                    //     }}
                    //     className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                    //   >
                    //     <p>
                    //       {addNewUserData?.userType === "1"
                    //         ? "Utilisateur standard / limité"
                    //         : "Utilisateur Administrateur / Superviseur"}
                    //     </p>
                    //     <FaChevronDown className="text-gray-700 mr-4" />
                    //   </div>
                    // )
                    field.id === "isActive" ? (
                      <div
                        onClick={() => {
                          setShowIsUserActivePopup(true);
                        }}
                        className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>
                          {addNewUserData?.isActive === "1" ? "true" : "false"}
                        </p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        value={addNewUserData[field.id]}
                        onChange={handleChange}
                        // { field.id === "groupID" && disable}
                        // disabled={field.id === "userID"}
                        disabled={
                          !isCreatingNewElement && field.id === "userID"
                        }
                        required
                        className="block px-3 w-full border-b pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    )}
                  </div>
                ))}

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
                      setDocumentationPage("Gestion_des_utilisateurs");
                      navigate("/Gestion_des_utilisateurs");

                      scrollToTop();
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

export default CreateNewUserGestion;
