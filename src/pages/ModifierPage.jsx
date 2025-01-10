import React, { useContext, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { DataContext } from "../context/DataContext";
import ShowConfirModifyVehiculePupup from "../components/modifier_vehicule/ShowConfirModifyVehiculePupup";
import ShowConfirmDeletePupupComponent from "../components/modifier_vehicule/ShowConfirmDeletePupupComponent";
import SuccessModifiervehiculePupupComponent from "../components/modifier_vehicule/SuccessModifiervehiculePupupComponent";
import SuccessDeletevehiculePupupComponent from "../components/modifier_vehicule/SuccessDeletevehiculePupupComponent";
import ErrorModifiervehiculePupupComponent from "../components/modifier_vehicule/ErrorModifiervehiculePupupComponent";
// import ErrorDeletevehiculePupupComponent from "../components/modifier_vehicule/errorDeletevehiculePupupComponent";
import VehiculeListeComponent from "../components/modifier_vehicule/VehiculeListeComponent";
import FormModifierVehicule from "../components/modifier_vehicule/FormModifierVehicule";
import ErreurDeleteVehiculePupupComponent from "../components/modifier_vehicule/ErreurDeleteVehiculePupupComponent";

// import { FaCar } from "react-icons/fa";

function Modifier() {
  const {
    updateVehicle,
    currentVehicule,
    error,
    setError,
    deleteVehicle,
    password,
    mergedData,
    setCurrentVehicule,
    crud_loading,
    username,

    successDeletevehiculePupup,
    setsuccessDeletevehiculePupup,
    errorDeletevehiculePupup,
    seterrorDeletevehiculePupup,

    successModifiervehiculePupup,
    setsuccessModifiervehiculePupup,
    errorModifiervehiculePupup,
    seterrorModifiervehiculePupup,
  } = useContext(DataContext);
  const [showConfirmAddVehiculePupup, setshowConfirmAddVehiculePupup] =
    useState(false);
  const [showConfirmDeletePupup, setshowConfirmDeletePupup] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showVehiculeListe, setShowVehiculeListe] = useState(false);

  const dataFusionee = mergedData ? Object.values(mergedData) : [];

  // error
  // État pour chaque champ du formulaire
  const [addvehicleData, setAddVehicleData] = useState({
    deviceID: currentVehicule?.deviceID || "",
    description: currentVehicule?.description || "",
    equipmentType: currentVehicule?.equipmentType || "",
    uniqueIdentifier: currentVehicule?.uniqueID || "---",
    imeiNumber: currentVehicule?.imeiNumber || "",
    licensePlate: currentVehicule?.licensePlate || "",
    simPhoneNumber: currentVehicule?.simPhoneNumber || "",
    displayName: currentVehicule?.displayName || "",
  });

  const [errorID, setErrorID] = useState(""); // État pour le message d'erreur
  const [errorImei, setErrorImei] = useState(""); // État pour le message d'erreur

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
    if (isNaN(addvehicleData.simPhoneNumber)) {
      setErrorID("Le numéro de la carte SIM doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    if (isNaN(addvehicleData.imeiNumber)) {
      setErrorID("L'IMEI doit être un nombre.");
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    setshowConfirmAddVehiculePupup(true);
  };

  const handleDeletePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      deleteVehicle(currentVehicule?.deviceID || "");

      setshowConfirmDeletePupup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
    }
  };

  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      // const deviceID = "undefined";
      const deviceID = addvehicleData.deviceID;

      const imeiNumber = addvehicleData.imeiNumber;
      const uniqueIdentifier = addvehicleData.uniqueIdentifier;
      const description = addvehicleData.description;
      const displayName = addvehicleData.displayName;
      const licensePlate = addvehicleData.licensePlate;
      const equipmentType = addvehicleData.equipmentType;
      const simPhoneNumber = addvehicleData.simPhoneNumber;

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

      setshowConfirmAddVehiculePupup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
    }
  };

  const delVehicule = () => {
    setshowConfirmDeletePupup(true);
  };

  const handleVehicleClick = (vehicule) => {
    setCurrentVehicule(vehicule);
    setShowVehiculeListe(!showVehiculeListe);

    // firstCallHistoriqueData();
  };

  useEffect(() => {
    if (currentVehicule) {
      setAddVehicleData({
        deviceID: currentVehicule.deviceID || "",
        description: currentVehicule.description || "",
        equipmentType: currentVehicule.equipmentType || "",
        uniqueIdentifier: currentVehicule.uniqueID || "---",
        imeiNumber: currentVehicule.imeiNumber || "",
        licensePlate: currentVehicule.licensePlate || "",
        simPhoneNumber: currentVehicule.simPhoneNumber || "",
        displayName: currentVehicule.displayName || "",
      });
    }
  }, [currentVehicule]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVehicles = dataFusionee?.filter(
    (vehicule) =>
      vehicule?.imeiNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicule?.simPhoneNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vehicule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-3">
      {/* Loading */}
      {crud_loading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}

      <ShowConfirModifyVehiculePupup
        showConfirmAddVehiculePupup={showConfirmAddVehiculePupup}
        handlePasswordCheck={handlePasswordCheck}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setshowConfirmAddVehiculePupup={setshowConfirmAddVehiculePupup}
      />

      <ShowConfirmDeletePupupComponent
        showConfirmDeletePupup={showConfirmDeletePupup}
        handleDeletePasswordCheck={handleDeletePasswordCheck}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setshowConfirmDeletePupup={setshowConfirmDeletePupup}
        inputPassword={inputPassword}
      />

      <SuccessModifiervehiculePupupComponent
        successModifiervehiculePupup={successModifiervehiculePupup}
        addvehicleData={addvehicleData}
        setsuccessModifiervehiculePupup={setsuccessModifiervehiculePupup}
      />

      <SuccessDeletevehiculePupupComponent
        successDeletevehiculePupup={successDeletevehiculePupup}
        addvehicleData={addvehicleData}
        setsuccessDeletevehiculePupup={setsuccessDeletevehiculePupup}
        setCurrentVehicule={setCurrentVehicule}
      />

      <ErrorModifiervehiculePupupComponent
        errorModifiervehiculePupup={errorModifiervehiculePupup}
        seterrorModifiervehiculePupup={seterrorModifiervehiculePupup}
        addvehicleData={addvehicleData}
      />

      <ErreurDeleteVehiculePupupComponent
        errorDeletevehiculePupup={errorDeletevehiculePupup}
        addvehicleData={addvehicleData}
        seterrorDeletevehiculePupup={seterrorDeletevehiculePupup}
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

            {/* <h2 className="text-orange-600 ml-4 mb-2">Chosis un appareil</h2> */}
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
                  {
                    // currentVehicule?.displayName ||
                    currentVehicule?.description || "Choisis un Véhicule"
                  }
                </p>
                <FaChevronDown className="mt-1" />
              </div>
            </div>

            <VehiculeListeComponent
              showVehiculeListe={showVehiculeListe}
              setShowVehiculeListe={setShowVehiculeListe}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              filteredVehicles={filteredVehicles}
              handleVehicleClick={handleVehicleClick}
            />

            <FormModifierVehicule
              handleSubmit={handleSubmit}
              addvehicleData={addvehicleData}
              handleChange={handleChange}
              error={error}
              errorID={errorID}
              errorImei={errorImei}
              currentVehicule={currentVehicule}
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
