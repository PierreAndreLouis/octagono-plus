import React, { useContext, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../context/DataContext";
import FormModifierVehicule from "../components/modifier_vehicule/FormModifierVehicule";
import ConfirmationPassword from "../components/Reutilisable/ConfirmationPassword";
import SuccèsÉchecMessagePopup from "../components/Reutilisable/SuccèsÉchecMessagePopup";
import SearchVehiculePupup from "../components/rapport_page_details/SearchVehiculePupup";

function Modifier() {
  const {
    updateVehicle,
    currentVéhicule,
    error,
    setError,
    deleteVehicle,
    password,
    mergedData,
    setCurrentVéhicule,
    createVéhiculeLoading,
    username,
    successDeleteVéhiculePopup,
    setSuccessDeleteVéhiculePopup,
    errorDeleteVéhiculePopup,
    setErrorDeleteVéhiculePopup,
    successModifierVéhiculePopup,
    setSuccessModifierVéhiculePopup,
    errorModifierVéhiculePopup,
    setErrorModifierVéhiculePopup,
  } = useContext(DataContext);
  let x;
  //
  //
  //
  //
  //
  //
  //
  //
  //

  x;
  // Pour confirmer le mot de pass avant l'ajout...
  const [showConfirmAddVéhiculePopup, setShowConfirmAddVéhiculePopup] =
    useState(false);

  // Pour confirmer le mot de pass avant la suppression
  const [showConfirmDeletePupup, setshowConfirmDeletePupup] = useState(false);

  // Pour stocker le mot de passe entrer
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher une message d'erreur en cas de mauvaise password
  const [errorMessage, setErrorMessage] = useState("");

  // Pour afficher la liste des véhicules
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  // Le data des véhicules
  const dataFusionné = mergedData ? Object.values(mergedData) : [];

  // État pour chaque champ du formulaire
  const [addVéhiculeData, setAddVehicleData] = useState({
    deviceID: currentVéhicule?.deviceID || "",
    description: currentVéhicule?.description || "",
    equipmentType: currentVéhicule?.equipmentType || "",
    uniqueIdentifier: currentVéhicule?.uniqueID || "---",
    imeiNumber: currentVéhicule?.imeiNumber || "",
    licensePlate: currentVéhicule?.licensePlate || "",
    simPhoneNumber: currentVéhicule?.simPhoneNumber || "",
    displayName: currentVéhicule?.displayName || "",
  });

  // État pour le message d'erreur de deviseID
  const [errorID, setErrorID] = useState("");

  // État pour le message d'erreur de IMEI
  const [errorImei, setErrorImei] = useState("");

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

    // Validation du numéro SIM
    if (isNaN(addVéhiculeData.simPhoneNumber)) {
      setErrorID("Le numéro de la carte SIM doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    if (isNaN(addVéhiculeData.imeiNumber)) {
      setErrorID("L'IMEI doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    setShowConfirmAddVéhiculePopup(true);
  };

  // Pour verifier le mot de passe avant le lancement de la requête
  const handleDeletePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      deleteVehicle(currentVéhicule?.deviceID || "");

      setshowConfirmDeletePupup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
    }
  };

  // Pour verifier le mot de passe avant le lancement de la requête
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      // const deviceID = "undefined";
      const deviceID = addVéhiculeData.deviceID;

      const imeiNumber = addVéhiculeData.imeiNumber;
      const uniqueIdentifier = addVéhiculeData.uniqueIdentifier;
      const description = addVéhiculeData.description;
      const displayName = addVéhiculeData.displayName;
      const licensePlate = addVéhiculeData.licensePlate;
      const equipmentType = addVéhiculeData.equipmentType;
      const simPhoneNumber = addVéhiculeData.simPhoneNumber;

      updateVehicle(
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
      setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
    }
  };

  const delVehicule = () => {
    setshowConfirmDeletePupup(true);
  };

  // Pour choisir un véhicule dans la liste
  const handleVehicleClick = (véhicule) => {
    setCurrentVéhicule(véhicule);
    setShowVehiculeListe(!showVehiculeListe);
  };

  // Pour mettre a jour les nouvelle donnee du véhicule a modifier
  useEffect(() => {
    if (currentVéhicule) {
      setAddVehicleData({
        deviceID: currentVéhicule.deviceID || "",
        description: currentVéhicule.description || "",
        equipmentType: currentVéhicule.equipmentType || "",
        uniqueIdentifier: currentVéhicule.uniqueID || "---",
        imeiNumber: currentVéhicule.imeiNumber || "",
        licensePlate: currentVéhicule.licensePlate || "",
        simPhoneNumber: currentVéhicule.simPhoneNumber || "",
        displayName: currentVéhicule.displayName || "",
      });
    }
  }, [currentVéhicule]);

  // Pour stocker le terme de recherche
  const [searchQueryModifyPage, setSearchQueryModifyPage] = useState("");

  // Pour enregistrer le text écrit
  const handleSearchChange = (e) => {
    setSearchQueryModifyPage(e.target.value);
  };

  // Pour filtrer les véhicules de la liste
  const filteredVehicles = dataFusionné?.filter(
    (véhicule) =>
      véhicule?.imeiNumber
        .toLowerCase()
        .includes(searchQueryModifyPage.toLowerCase()) ||
      véhicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQueryModifyPage.toLowerCase()) ||
      véhicule.description
        .toLowerCase()
        .includes(searchQueryModifyPage.toLowerCase())
  );

  return (
    <div className="px-3">
      {/* Loading */}
      {createVéhiculeLoading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      {/* Popup pour la confirmation du mot de passe pour ajouter un appareil */}
      <ConfirmationPassword
        showConfirmPassword={showConfirmAddVéhiculePopup}
        handlePasswordCheck={handlePasswordCheck}
        setShowConfirmPassword={setShowConfirmAddVéhiculePopup}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setIsPasswordConfirmed={setShowConfirmAddVéhiculePopup}
      />

      {/* Popup pour la confirmation du mot de passe pour supprimer un appareil */}
      <ConfirmationPassword
        showConfirmPassword={showConfirmDeletePupup}
        handlePasswordCheck={handleDeletePasswordCheck}
        setInputPassword={setInputPassword}
        setShowConfirmPassword={setshowConfirmDeletePupup}
        inputPassword={inputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setIsPasswordConfirmed={setshowConfirmDeletePupup}
      />

      {/* Popup pour Message de succès */}
      <SuccèsÉchecMessagePopup
        message={successModifierVéhiculePopup}
        setMessage={setSuccessModifierVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"succès modification de véhicule"}
      />

      {/* Popup pour Message de succès */}
      <SuccèsÉchecMessagePopup
        message={successDeleteVéhiculePopup}
        setMessage={setSuccessDeleteVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"succès suppression de véhicule"}
      />

      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorModifierVéhiculePopup}
        setMessage={setErrorModifierVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"échec modification de véhicule"}
      />

      {/* Popup pour Message de échec */}
      <SuccèsÉchecMessagePopup
        message={errorDeleteVéhiculePopup}
        setMessage={setErrorDeleteVéhiculePopup}
        véhiculeData={addVéhiculeData}
        composant_from={"échec suppression de véhicule"}
      />

      <div className="flex w-full justify-center h-full mt-16 pb-2 md:mt-20">
        <div className="w-full flex justify-center">
          <div className="bg-white dark:bg-gray-900/30 max-w-[40rem] md:px-6 mb-20 w-full mt-4 rounded-xl shadow-lg overflow-auto">
            <div className="flex justify-center mb-6 items-center w-full py-6 pb-8">
              {/* <CiEdit className="text-2xl mr-2 text-orange-500" /> */}
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-300 text-xl">
                Modifier / Supprimer un Véhicule
              </h3>
            </div>

            <div
              onClick={() => {
                setShowVehiculeListe(true);
              }}
              className="relative  mx-4 mb-12"
            >
              <div
                className="flex justify-between   cursor-pointer border rounded-md
                 px-3 py-2 bg-orange-50 dark:bg-gray-900/50 dark:border-gray-500  dark:text-gray-300 text-center"
              >
                <p className="text-start w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
                  {currentVéhicule?.description || "Choisis un Véhicule"}
                </p>
                <FaChevronDown className="mt-1" />
              </div>
            </div>

            {/* Pour afficher le popup de la liste des véhicules */}
            {showVehiculeListe && (
              <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-20 shadow-xl border-- border-gray-100 rounded-md p-3 dark:bg-black/80">
                <SearchVehiculePupup
                  searchQueryListPopup={searchQueryModifyPage}
                  setSearchQueryListPopup={setSearchQueryModifyPage}
                  handleSearchChange={handleSearchChange}
                  setShowOptions={setShowVehiculeListe}
                  filteredVehicles={filteredVehicles}
                  handleClick={handleVehicleClick}
                  currentVéhicule={currentVéhicule}
                  isMapcomponent="false"
                />
              </div>
            )}

            {/* La form a modifier ou a supprimer */}
            <FormModifierVehicule
              handleSubmit={handleSubmit}
              addVéhiculeData={addVéhiculeData}
              handleChange={handleChange}
              error={error}
              errorID={errorID}
              errorImei={errorImei}
              currentVéhicule={currentVéhicule}
              setError={setError}
              delVehicule={delVehicule}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modifier;
