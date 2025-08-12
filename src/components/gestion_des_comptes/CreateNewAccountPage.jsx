import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeft, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreateNewAccountPage({ setDocumentationPage }) {
  const {
    setError,
    scrollToTop,
    comptes,
    createAccountEnGestionAccountFonction,
    timeZoneData,
    adminPassword,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

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
  const [addNewAccountData, setAddNewAccountData] = useState({
    accountID: "",
    description: "",
    displayName: "",
    contactPhone: "",
    contactName: "",
    contactEmail: "",
    addressCity: "",
    addressCountry: "",
    notifyEmail: "",
    isActive: "true",
    isAccountManager: "true",
    timeZone: "GMT-04:00",
    password: "",
    password2: "",
  });

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (["accountID", "password", "password2"].includes(name)) {
      newValue = value.replace(/\s/g, "_"); // remplace les espaces par des underscores
    }

    if (name === "accountID") {
      newValue = newValue.toLowerCase(); // convertit en minuscules uniquement pour userID
    }
    setAddNewAccountData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setErrorID(""); // Réinitialise l'erreur lorsque l'utilisateur modifie l'entrée
  };

  const isValid = () => {
    const phoneRegex = /^\+?\d{6,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = [];

    if (!phoneRegex.test(addNewAccountData.contactPhone)) {
      errors.push(`${t("Le téléphone n'est pas valide")}`);
    }

    if (!emailRegex.test(addNewAccountData.contactEmail)) {
      errors.push(`${t("L'email de contact n'est pas valide")}`);
    }

    if (!emailRegex.test(addNewAccountData.notifyEmail)) {
      errors.push(`${t("L'email de notification n'est pas valide")}`);
    }

    if (addNewAccountData.password.length < 6) {
      errors.push(
        `${t("Le mot de passe doit contenir au moins 6 caractères")}`
      );
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formatErrors = isValid();
    if (formatErrors.length > 0) {
      setErrorID(formatErrors[0]); // affiche seulement le premier
      return;
    }

    if (addNewAccountData?.password !== addNewAccountData?.password2) {
      setErrorID(`${t("Les mots de passe ne correspondent pas")}`);
      return;
    }

    const accountExists = comptes?.some(
      (account) => account?.accountID === addNewAccountData.accountID
    );

    if (accountExists) {
      setErrorID(
        `${t(
          "Cet identifiant (accountID) est déjà utilisé. Veuillez en choisir un autre"
        )}`
      );
      return;
    }

    setShowConfirmAddGroupeGestionPopup(true);
  };

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === adminPassword) {
      const accountID = addNewAccountData.accountID;
      const description = addNewAccountData.description;
      const displayName = addNewAccountData.displayName;
      const contactPhone = addNewAccountData.contactPhone;
      const contactName = addNewAccountData.contactName;
      const contactEmail = addNewAccountData.contactEmail;
      const addressCity = addNewAccountData.addressCity;
      const addressCountry = addNewAccountData.addressCountry;
      const notifyEmail = addNewAccountData.notifyEmail;
      const isActive = addNewAccountData.isActive;
      const isAccountManager = addNewAccountData.isAccountManager;
      const timeZone = addNewAccountData.timeZone;
      const password = addNewAccountData.password;
      const password2 = addNewAccountData.password2;

      // console.log(
      createAccountEnGestionAccountFonction(
        accountID,
        description,
        displayName,
        contactPhone,
        notifyEmail,
        password2,
        isActive,
        isAccountManager,
        contactName,
        contactEmail,
        addressCity,
        addressCountry,
        timeZone
      );

      navigate("/Gestion_des_comptes");
      setDocumentationPage("Gestion_des_comptes");
      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  const [isActivePopup, setIsActivePopup] = useState(false);
  const [isAccountManager, setIsAccountManager] = useState(false);
  const [showTimeZonePopup, setShowTimeZonePopup] = useState(false);

  const requiredFields = [
    "accountID",
    "description",
    "displayName",
    "contactPhone",
    "contactName",
    "contactEmail",
    "notifyEmail",
    "password",
    "password2",
  ];

  return (
    <div className="px-3 rounded-lg  bg-white">
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

      {isActivePopup && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setIsActivePopup(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Activation du compte")}:
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewAccountData?.isActive === "true"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setAddNewAccountData((prev) => ({
                  ...prev,
                  isActive: "true",
                }));
                setIsActivePopup(false);
              }}
            >
              <p>true</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewAccountData?.isActive === "false"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setAddNewAccountData((prev) => ({
                  ...prev,
                  isActive: "false",
                }));
                setIsActivePopup(false);
              }}
            >
              <p>false</p>
            </div>
          </div>
        </div>
      )}
      {isAccountManager && (
        <div className="fixed z-[99999999999999999999] inset-0 bg-black/50 flex justify-center items-center">
          <div
            className="bg-white dark:bg-gray-700 max-w-[30rem] relative flex flex-col gap-2 w-[100vw] p-6 px-4 border border-gray-600 mt-2 rounded-md"
            id="mapType"
          >
            <IoClose
              onClick={() => {
                setIsAccountManager(false);
              }}
              className="absolute right-4 cursor-pointer top-6 text-2xl text-red-600"
            />

            <h2 className="border-b border-orange-400 dark:text-orange-50 text-orange-600 text-lg pb-2 mb-3 font-semibold">
              {t("Droit de manager")}:
            </h2>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewAccountData?.isAccountManager === "true"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setAddNewAccountData((prev) => ({
                  ...prev,
                  isAccountManager: "true",
                }));
                setIsAccountManager(false);
              }}
            >
              <p>true</p>
            </div>

            <div
              className={`cursor-pointer flex justify-between items-center py-1 dark:text-gray-50 dark:hover:bg-gray-800/70 px-3 rounded-md ${
                addNewAccountData?.isAccountManager === "false"
                  ? "bg-gray-100 dark:bg-gray-800/70"
                  : ""
              }`}
              onClick={() => {
                setAddNewAccountData((prev) => ({
                  ...prev,
                  isAccountManager: "false",
                }));
                setIsAccountManager(false);
              }}
            >
              <p>false</p>
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
                      addNewAccountData.timeZone === `${zone?.region}:00`
                        ? "bg-gray-100 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => {
                      setAddNewAccountData((prev) => ({
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

      <div className="flex  w-full justify-center h-full  ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6  border-- shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                {t("Ajouter un nouveau Compte")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_comptes");
                  navigate("/Gestion_des_comptes");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {[
                  {
                    id: "accountID",
                    label: `${t("ID du compte")}`,
                    placeholder: "ex: compte_victor",
                  },
                  {
                    id: "description",
                    label: `${t("Description")}`,
                    placeholder: `${t("Description")}`,
                  },
                  {
                    id: "displayName",
                    label: `${t("DisplayName")}`,
                    placeholder: `${t("DisplayName")}`,
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
                    id: "contactEmail",
                    label: `${t("contactEmail")}`,
                    placeholder: `${t("contactEmail")}`,
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
                    id: "notifyEmail",
                    label: `${t("Email")}`,
                    placeholder: `${t("Email")}`,
                  },
                  {
                    id: "isActive",
                    label: `${t("isActive")}`,
                    placeholder: `${t("isActive")}`,
                  },
                  {
                    id: "isAccountManager",
                    label: `${t("isAccountManager")}`,
                    placeholder: `${t("isAccountManager")}`,
                  },
                  {
                    id: "timeZone",
                    label: `${t("timeZone")}`,
                    placeholder: "",
                  },

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
                      {requiredFields.includes(field.id) &&
                        !addNewAccountData[field.id] && (
                          <span className="text-red-600 text-lg"> *</span>
                        )}
                    </label>

                    {field.id === "isAccountManager" ? (
                      <div
                        onClick={() => {
                          setIsAccountManager(true);
                        }}
                        className="pl-4 pt-1 border-b pb-2 flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{addNewAccountData?.isAccountManager}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : field.id === "isActive" ? (
                      <div
                        onClick={() => {
                          setIsActivePopup(true);
                        }}
                        className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{addNewAccountData?.isActive}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : field.id === "timeZone" ? (
                      <div
                        onClick={() => {
                          setShowTimeZonePopup(true);
                        }}
                        className="pl-4 pt-1 pb-2 border-b flex justify-between items-center text-gray-600 w-full cursor-pointer"
                      >
                        <p>{addNewAccountData?.timeZone}</p>
                        <FaChevronDown className="text-gray-700 mr-4" />
                      </div>
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        value={addNewAccountData[field.id]}
                        onChange={handleChange}
                        required={requiredFields.includes(field.id)}
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
                      setDocumentationPage("Gestion_des_comptes");
                      scrollToTop();
                      navigate("/Gestion_des_comptes");
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

export default CreateNewAccountPage;
