import React, { useContext, useEffect, useState } from "react";

import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowLeft, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { IoMdCheckboxOutline, IoMdSquareOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { PiIntersectThreeBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreateNewDeviceGestion({
  setDocumentationPage,
  documentationPage,
  setChooseOtherAccountGestion,
  setChooseOneAccountToContinue,
  isCreatingNewElement,
  setIsCreatingNewElement,
}) {
  const {
    setCurrentAccountSelected,
    currentAccountSelected,
    setError,
    createVehicleEnGestionAccount,
    scrollToTop,
    currentSelectedDeviceGestion,
    adminPassword,
    modifyVehicleEnGestionAccount,
    gestionAccountData,
  } = useContext(DataContext);
  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

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
    accountID: "",
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
    setErrorID("");
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Si deviceID est unique, créer le véhicule
    const deviceID = addVéhiculeData.deviceID;

    // Vérification si deviceID existe déjà
    const deviceExists = setCurrentAccountSelected?.accountDevices?.some(
      (véhicule) => véhicule?.deviceID === deviceID
    );

    if (deviceExists && isCreatingNewElement) {
      setErrorID(
        `${t(
          "Cet identifiant (ID) est déjà utilisé. Veuillez en choisir un autre"
        )}`
      );
      return;
    }

    // Validation du numéro SIM
    if (isNaN(addVéhiculeData.simPhoneNumber)) {
      setErrorID(`${t("Le numéro de la carte SIM doit être un nombre")}`);
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    // Validation du numéro SIM
    if (isNaN(addVéhiculeData.imeiNumber)) {
      setErrorID(`${t("L'IMEI doit être un nombre")}`);
      return; // Empêche la soumission si le numéro SIM n'est pas valide
    }

    if (!currentAccountSelected) {
      setChooseOneAccountToContinue(true);
      setChooseOtherAccountGestion(true);
      return;
    }

    setShowConfirmAddVéhiculePopup(true);
  };

  // //////////////////////

  const selectedDeviceID = currentSelectedDeviceGestion?.deviceID;

  const groupeDuSelectedDevice = currentAccountSelected?.accountGroupes
    ?.filter((groupe) =>
      groupe?.groupeDevices?.some(
        (device) => device?.deviceID === selectedDeviceID
      )
    )
    .map((groupe) => groupe?.groupID);

  const allGroupIDs = currentAccountSelected?.accountGroupes?.map(
    (groupe) => groupe?.groupID
  );
  const [groupesSelectionnes, setGroupesSelectionnes] = useState(
    groupeDuSelectedDevice || []
  );
  //
  const groupesNonSelectionnes = allGroupIDs?.filter(
    (groupID) => !groupesSelectionnes.includes(groupID)
  );

  const [showGroupesSelectionnesPopup, setShowGroupesSelectionnesPopup] =
    useState(false);

  // const selectedDeviceID = currentSelectedDeviceGestion?.deviceID;

  // const groupeDuSelectedDevice = currentAccountSelected?.accountGroupes
  //   ?.filter((groupe) =>
  //     groupe?.groupeDevices?.some(
  //       (device) => device?.deviceID === selectedDeviceID
  //     )
  //   )
  //   .map((groupe) => groupe?.groupID);

  // const allGroupIDs = currentAccountSelected?.accountGroupes?.map(
  //   (groupe) => groupe?.groupID
  // );
  // const [groupesSelectionnes, setGroupesSelectionnes] = useState(
  //   groupeDuSelectedDevice || []
  // );
  // //
  // const groupesNonSelectionnes = allGroupIDs?.filter(
  //   (groupID) => !groupesSelectionnes.includes(groupID)
  // );

  // const [showGroupesSelectionnesPopup, setShowGroupesSelectionnesPopup] =
  //   useState(false);

  useEffect(() => {
    // console.log("groupesSelectionnes", groupesSelectionnes);
  }, [groupesSelectionnes]);
  useEffect(() => {
    if (isCreatingNewElement) {
      setGroupesSelectionnes([]);
    }
  }, [documentationPage, isCreatingNewElement]);

  ////////////////////////////////////

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === adminPassword) {
      const accountID = addVéhiculeData.accountID;

      const deviceID = addVéhiculeData.deviceID;
      const imeiNumber = addVéhiculeData.imeiNumber;
      const uniqueIdentifier = addVéhiculeData.uniqueIdentifier;
      const description = addVéhiculeData.description;
      const displayName = addVéhiculeData.description;
      const licensePlate = addVéhiculeData.licensePlate;
      const equipmentType = addVéhiculeData.equipmentType;
      const simPhoneNumber = addVéhiculeData.simPhoneNumber;
      const vehicleID = deviceID + uniqueIdentifier || "";

      // console.log(
      //   currentAccountSelected?.accountID,
      //   "admin",
      //   currentAccountSelected?.password,

      //   deviceID,
      //   imeiNumber,
      //   uniqueIdentifier,
      //   description,
      //   displayName,
      //   licensePlate,
      //   equipmentType,
      //   simPhoneNumber
      // );

      if (
        currentAccountSelected?.accountID &&
        currentAccountSelected?.password
      ) {
        if (isCreatingNewElement) {
          createVehicleEnGestionAccount(
            currentAccountSelected?.accountID,
            "admin",
            currentAccountSelected?.password,
            deviceID,
            imeiNumber,
            uniqueIdentifier,
            description,
            displayName,
            licensePlate,
            equipmentType,
            simPhoneNumber,
            vehicleID,
            groupesSelectionnes
          );
        } else {
          modifyVehicleEnGestionAccount(
            currentAccountSelected?.accountID ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.accountID,
            "admin",
            currentAccountSelected?.password ||
              gestionAccountData.find(
                (account) => account.accountID === accountID
              )?.password,
            deviceID,
            imeiNumber,
            uniqueIdentifier,
            description,
            displayName,
            licensePlate,
            equipmentType,
            simPhoneNumber,
            vehicleID,
            groupesSelectionnes
          );
        }

        navigate("/Gestion_des_appareils");

        setDocumentationPage("Gestion_des_appareils");
      }

      setShowConfirmAddVéhiculePopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  // Pour mettre a jour les nouvelle donnee du véhicule a modifier
  useEffect(() => {
    if (currentSelectedDeviceGestion && !isCreatingNewElement) {
      setAddVehicleData({
        accountID: currentSelectedDeviceGestion.accountID || "",
        deviceID: currentSelectedDeviceGestion.deviceID || "",
        description: currentSelectedDeviceGestion.description || "",
        equipmentType: currentSelectedDeviceGestion.equipmentType || "",
        uniqueIdentifier: currentSelectedDeviceGestion.uniqueID || "---",
        imeiNumber: currentSelectedDeviceGestion.imeiNumber || "",
        licensePlate: currentSelectedDeviceGestion.licensePlate || "",
        simPhoneNumber: currentSelectedDeviceGestion.simPhoneNumber || "",
        displayName: currentSelectedDeviceGestion.displayName || "",
      });
    }
  }, [currentSelectedDeviceGestion, isCreatingNewElement]);

  return (
    <div className="px-3  rounded-lg bg-white">
      {showGroupesSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] mx-3 relative  bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Liste Des Groupe")}
            </h2>
            <IoClose
              onClick={() => {
                setShowGroupesSelectionnesPopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            <p
              // onClick={() => {
              //   console.log("groupesNonSelectionnes", groupesNonSelectionnes);
              // }}
              className="mx-2 mb-3 text-center mt-4 text-lg"
            >
              {t("Choisis un ou plusieurs Groupe pour intégrer l'appareil")}
            </p>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {currentAccountSelected?.accountGroupes?.map((groupe, index) => {
                const isSelected = groupesSelectionnes.includes(groupe.groupID);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setGroupesSelectionnes((prev) => {
                        if (prev.includes(groupe.groupID)) {
                          return prev.filter((id) => id !== groupe.groupID);
                        } else {
                          return [...prev, groupe.groupID];
                        }
                      });
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
                        {t("Nom du compte")} :{" "}
                        <span className="font-bold notranslate">
                          {groupe?.description}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre d'utilisateur")} :{" "}
                        <span className="font-bold">
                          {groupe?.groupeDevices?.length}
                        </span>
                      </p>
                    </div>
                    <div className="min-w-[4rem]">
                      {isSelected ? (
                        <IoMdCheckboxOutline className="text-[2rem] text-green-500" />
                      ) : (
                        <IoMdSquareOutline className="text-[2rem] text-red-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center px-4 mb-4 mt-2">
              <button
                onClick={() => {
                  setShowGroupesSelectionnesPopup(false);
                }}
                className="py-2 px-4 w-full text-white rounded-md bg-orange-600 font-bold"
              >
                {t("Confirmer")}
              </button>
            </div>
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

      <div className="flex  w-full justify-center h-full  ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6  border-- shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                {isCreatingNewElement
                  ? t("Enregistrer un nouveau Appareil")
                  : t("Modifier un Appareil")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_appareils");
                  navigate("/Gestion_des_appareils");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <p className="mb-2 font-semibold text-gray-700">
              {t("Choisissez un Groupe")}{" "}
              {groupesSelectionnes?.length > 0 &&
                "(" + groupesSelectionnes?.length + ")"}
            </p>
            <div
              onClick={() => {
                setShowGroupesSelectionnesPopup(true);
              }}
              className="w-full mb-10 cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
            >
              <h3 className="w-full text-center-- font-semibold">
                {/* Compte: */}
                <span>
                  {groupesSelectionnes.join(" - ") || `${t("Défaut")}`}
                </span>
              </h3>
              <FaChevronDown />
            </div>

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Champs du formulaire */}
                {[
                  { id: "deviceID", label: "ID", placeholder: "ID" },
                  {
                    id: "imeiNumber",
                    label: `${t("Numéro IMEI")}`,
                    placeholder: `${t("Numéro IMEI")}`,
                  },
                  {
                    id: "uniqueIdentifier",
                    label: `${t("IMEI")}`,
                    placeholder: `${t("IMEI")}`,
                  },
                  {
                    id: "description",
                    label: `${t("Description du véhicule")}`,
                    placeholder: `${t("Description du véhicule")}`,
                  },

                  {
                    id: "licensePlate",
                    label: `${t("Plaque du véhicule")}`,
                    placeholder: `${t("Plaque du véhicule")}`,
                  },
                  {
                    id: "equipmentType",
                    label: `${t("Type d'appareil")}`,
                    placeholder: "Ex. : BO, B1, B2",
                  },
                  {
                    id: "simPhoneNumber",
                    label: `${t("Numéro SIM")}`,
                    placeholder: `${t("Numéro SIM")}`,
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block-- flex justify-between items-center text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
                    >
                      {field.label}{" "}
                      {!addVéhiculeData[field.id] && (
                        <span className="text-red-600 text-lg"> *</span>
                      )}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      placeholder={field.placeholder}
                      value={addVéhiculeData[field.id]}
                      onChange={handleChange}
                      disabled={
                        !isCreatingNewElement && field.id === "deviceID"
                      }
                      required
                      className="block px-3 w-full border-b pb-4 py-1.5 outline-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/0 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                ))}

                {errorImei && (
                  <p className="flex items-start gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-md translate-y-4 px-4 py-1 rounded-md text-center">
                    <MdErrorOutline className="text-2xl mt-0.5" />
                    {errorImei}
                  </p>
                )}
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
                      setDocumentationPage("Gestion_des_appareils");
                      scrollToTop();
                      navigate("/Gestion_des_appareils");
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

export default CreateNewDeviceGestion;
