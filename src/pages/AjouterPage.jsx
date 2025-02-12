import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import FormAjouterVehicule from "../components/ajouter_vehicule/FormAjouterVehicule";
import ConfirmationPassword from "../components/Reutilisable/ConfirmationPassword";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";

function AjouterPage() {
  const {
    createVehicle,
    error,
    setError,
    véhiculeData,
    password,
    successAddVéhiculePopup,
    errorAddVéhiculePopup,
    setErrorAddVéhiculePopup,
    setSuccessAddVéhiculePopup,
    createVéhiculeLoading,
    username,
  } = useContext(DataContext);

  // Pour afficher le popup de confirmation de password
  const [showConfirmAddVéhiculePopup, setShowConfirmAddVéhiculePopup] =
    useState(false);
  // Pour stocker le mot de passe de confirmation  de password
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher un message de d'erreur lors de mauvais mot de passe
  const [errorMessage, setErrorMessage] = useState("");

  // État pour le message d'erreur de deviceID incorrect
  const [errorID, setErrorID] = useState("");

  // État pour le message d'erreur de IMEI
  const [errorImei, setErrorImei] = useState("");

  // État pour chaque champ du formulaire
  const [addVéhiculeData, setAddVehicleData] = useState({
    deviceID: "",
    description: "",
    equipmentType: "",
    uniqueIdentifier: "",
    imeiNumber: "",
    licensePlate: "",
    simPhoneNumber: "",
    displayName: "",
  });

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorID(""); // Réinitialise l'erreur lorsque l'utilisateur modifie l'entrée
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Si deviceID est unique, créer le véhicule
    const deviceID = addVéhiculeData.deviceID;

    // Vérification si deviceID existe déjà
    const deviceExists = véhiculeData.some(
      (véhicule) => véhicule?.deviceID === deviceID
    );

    if (deviceExists) {
      setErrorID(
        "Cet identifiant (ID) est déjà utilisé. Veuillez en choisir un autre."
      );
      return;
    }

    // Validation du numéro SIM
    if (isNaN(addVéhiculeData.simPhoneNumber)) {
      setErrorID("Le numéro de la carte SIM doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    // Validation du numéro SIM
    if (isNaN(addVéhiculeData.imeiNumber)) {
      setErrorID("L'IMEI doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    setShowConfirmAddVéhiculePopup(true);
  };

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      const deviceID = addVéhiculeData.deviceID;
      const imeiNumber = addVéhiculeData.imeiNumber;
      const uniqueIdentifier = addVéhiculeData.uniqueIdentifier;
      const description = addVéhiculeData.description;
      const displayName = addVéhiculeData.displayName;
      const licensePlate = addVéhiculeData.licensePlate;
      const equipmentType = addVéhiculeData.equipmentType;
      const simPhoneNumber = addVéhiculeData.simPhoneNumber;

      createVehicle(
        deviceID,
        imeiNumber,
        uniqueIdentifier,
        description,
        displayName,
        licensePlate,
        equipmentType,
        simPhoneNumber
      );

      setShowConfirmAddVéhiculePopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  return (
    <div className="px-3">
      {createVéhiculeLoading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {/* Popup pour la confirmation du mot de passe */}
      <ConfirmationPassword
        showConfirmPassword={showConfirmAddVéhiculePopup}
        setShowConfirmPassword={setShowConfirmAddVéhiculePopup}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handlePasswordCheck={handlePasswordCheck}
        setIsPasswordConfirmed={setShowConfirmAddVéhiculePopup}
      />

      {/* Popup pour Message de succès */}
      <SuccèsÉchecMessagePopup
        message={successAddVéhiculePopup}
        setMessage={setSuccessAddVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"succès ajout de véhicule"}
      />

      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorAddVéhiculePopup}
        setMessage={setErrorAddVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"échec ajout de véhicule"}
      />

      <div className="flex w-full justify-center h-full mt-10 md:mt-20 ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6 mb-20 border-- shadow-lg overflow-auto">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              {/* <FaCar className="text-2xl mr-2 text-orange-500" /> */}
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                Enregistrer un nouveau véhicule
              </h3>
            </div>

            <FormAjouterVehicule
              handleSubmit={handleSubmit}
              addVéhiculeData={addVéhiculeData}
              handleChange={handleChange}
              errorID={errorID}
              errorImei={errorImei}
              error={error}
              username={username}
              setError={setError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AjouterPage;
