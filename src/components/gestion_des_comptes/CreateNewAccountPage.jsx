import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeft, FaChevronDown, FaUserCircle } from "react-icons/fa";

function CreateNewAccountPage({ setDocumentationPage }) {
  const {
    setError,
    scrollToTop,
    account,
    username,
    password,
    comptes,
    createAccountEnGestionAccountFonction,
  } = useContext(DataContext);

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
    notifyEmail: "",
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

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Si deviceID est unique, créer le véhicule
    const accountID = addNewAccountData.accountID;

    // Vérification si groupID existe déjà
    const accountExists = comptes?.some(
      (account) => account?.accountID === accountID
    );

    if (accountExists) {
      setErrorID(
        "Cet identifiant (accountID) est déjà utilisé. Veuillez en choisir un autre."
      );
      return;
    }

    if (addNewAccountData?.password !== addNewAccountData?.password2) {
      setErrorID("Les mots de passe ne correspondent pas.");
      return;
    }

    setShowConfirmAddGroupeGestionPopup(true);
  };

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      const accountID = addNewAccountData.accountID;
      const description = addNewAccountData.description;
      const displayName = addNewAccountData.displayName;
      const contactPhone = addNewAccountData.contactPhone;
      const notifyEmail = addNewAccountData.notifyEmail;
      const password2 = addNewAccountData.password2;

      if (account && username && password) {
        createAccountEnGestionAccountFonction(
          account,
          username,
          password,
          accountID,
          description,
          displayName,
          contactPhone,
          notifyEmail,
          password2
        );

        setDocumentationPage("Gestion_des_comptes");
      }

      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

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

      <div className="flex  w-full justify-center h-full  ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6  border-- shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                Ajouter un nouveau Compte
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_comptes");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                Retour
              </button>
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Champs du formulaire */}

                {[
                  {
                    id: "accountID",
                    label: "ID du compte",
                    placeholder: "ex: compte_victor",
                  },
                  {
                    id: "description",
                    label: "Description",
                    placeholder: "Description du compte",
                  },
                  {
                    id: "displayName",
                    label: "DisplayName",
                    placeholder: "Nom a afficher",
                  },
                  {
                    id: "contactPhone",
                    label: "Telephone",
                    placeholder: "le numero de telephone",
                  },
                  {
                    id: "notifyEmail",
                    label: "Email",
                    placeholder: "email",
                  },
                  {
                    id: "password",
                    label: "Mot de passe",
                    placeholder: "Ajouter un mot de passe",
                  },
                  {
                    id: "password2",
                    label: "confirmer le mot de passe",
                    placeholder: "Confirmer le mot de passe",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block-- flex justify-between items-center text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
                    >
                      {field.label}{" "}
                      {!addNewAccountData[field.id] && (
                        <span className="text-red-600 text-lg"> *</span>
                      )}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      placeholder={field.placeholder}
                      value={addNewAccountData[field.id]}
                      onChange={handleChange}
                      required
                      className="block px-3 w-full border-b pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
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
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setDocumentationPage("Gestion_des_comptes");
                      scrollToTop();
                    }}
                    className="flex w-full justify-center rounded-md border text-orange-500 dark:text-orange-400 border-orange-600 px-3 py-1.5 text-md font-semibold hover:bg-orange-100 dark:hover:bg-orange-900"
                  >
                    Annuler
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
