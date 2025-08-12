import React, { useContext, useEffect, useState } from "react";
 
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
 import { MdErrorOutline } from "react-icons/md";
import {
  FaArrowLeft,
  FaCar,
  FaChevronDown,
 } from "react-icons/fa";
import { IoMdCheckboxOutline, IoMdSquareOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ModifyGroupeGestion({ setDocumentationPage }) {
  const {
    currentAccountSelected,
    setError,
     scrollToTop,
    FormatDateHeure,
    currentSelectedGroupeGestion,
    modifyGroupeEnGestionAccount,
    gestionAccountData,
    adminPassword,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();
  const navigate = useNavigate();

  // Pour afficher le popup de confirmation de password
  const [
    showConfirmModifyGroupeGestionPopup,
    setShowConfirmModifyGroupeGestionPopup,
  ] = useState(false);
  // Pour stocker le mot de passe de confirmation  de password
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher un message de d'erreur lors de mauvais mot de passe
  const [errorMessage, setErrorMessage] = useState("");

  // État pour le message d'erreur de deviceID incorrect
  const [errorID, setErrorID] = useState("");

  // État pour chaque champ du formulaire
  const [modifySelectedGroupeDataData, setModifySelectedGroupeDataData] =
    useState({
      accountID: "",
      groupID: "",
      description: "",
      displayName: "",
      notes: "",
      workOrderID: "",
    });

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifySelectedGroupeDataData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorID(""); // Réinitialise l'erreur lorsque l'utilisateur modifie l'entrée
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    setShowConfirmModifyGroupeGestionPopup(true);
  };

  const deviceDuSelectedGroupe =
    currentSelectedGroupeGestion?.groupeDevices?.map(
      (device) => device?.deviceID
    );

  const userDuSelectedGroupe = currentAccountSelected?.accountUsers
    ?.filter((user) => {
      const groupes = user?.userGroupes || [];
      return groupes?.some(
        (group) => group?.groupID === currentSelectedGroupeGestion?.groupID
      );
    })
    ?.map((user) => user?.userID);
  //

  const allDevicesIDs = currentAccountSelected?.accountDevices?.map(
    (device) => device?.deviceID
  );

  const allUsersIDs = currentAccountSelected?.accountUsers?.map(
    (user) => user?.userID
  );
  //
  const [deviceSelectionnes, setDeviceSelectionnes] = useState(
    deviceDuSelectedGroupe || []
  );

  const [usersSelectionnes, setUsersSelectionnes] = useState(
    userDuSelectedGroupe || []
  );

  const deviceNonSelectionnes = allDevicesIDs?.filter(
    (deviceID) => !deviceSelectionnes.includes(deviceID)
  );
 
  //

  const [showDeviceSelectionnesPopup, setShowDeviceSelectionnesPopup] =
    useState(false);

  // const [showUserSelectionnesPopup, setShowUSerSelectionnesPopup] =
  //   useState(false);
  //

  useEffect(() => {
  
  }, [deviceSelectionnes, usersSelectionnes]);

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === adminPassword) {
      const accountID = modifySelectedGroupeDataData.accountID;
      const groupID = modifySelectedGroupeDataData.groupID;
      const description = modifySelectedGroupeDataData.description;
      const displayName = modifySelectedGroupeDataData.displayName;
      const notes = modifySelectedGroupeDataData.notes;
      const workOrderID = modifySelectedGroupeDataData.workOrderID;

      if (
        (currentAccountSelected?.accountID ||
          gestionAccountData.find((account) => account.accountID === accountID)
            ?.accountID) &&
        (currentAccountSelected?.password ||
          gestionAccountData.find((account) => account.accountID === accountID)
            ?.password)
      ) {
        modifyGroupeEnGestionAccount(
          currentAccountSelected?.accountID ||
            gestionAccountData.find(
              (account) => account.accountID === accountID
            )?.accountID,
          "admin",
          currentAccountSelected?.password ||
            gestionAccountData.find(
              (account) => account.accountID === accountID
            )?.password,

          groupID,
          description,
          displayName,
          notes,
          workOrderID,
          //
          deviceSelectionnes,
          deviceNonSelectionnes
        );
        setDocumentationPage("Gestion_des_groupes");
        navigate("/Gestion_des_groupes")
      }

      setShowConfirmModifyGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  // Pour mettre a jour les nouvelle donnee du véhicule a modifier
  useEffect(() => {
    if (currentSelectedGroupeGestion) {
      setModifySelectedGroupeDataData({
        accountID: currentSelectedGroupeGestion.accountID || "",
        groupID: currentSelectedGroupeGestion.groupID || "",
        description: currentSelectedGroupeGestion.description || "",
        displayName: currentSelectedGroupeGestion.displayName || "",
        notes: currentSelectedGroupeGestion.notes || "",
        workOrderID: currentSelectedGroupeGestion.workOrderID || "",
      });
    }
  }, [currentSelectedGroupeGestion]);

  return (
    <div className="px-3 rounded-lg bg-white">
      {showDeviceSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh]  relative max-h-[75vh]-- bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Liste Des Appareils")}
            </h2>
            <IoClose
              onClick={() => {
                setShowDeviceSelectionnesPopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            <p
              // onClick={() => {
              //   console.log("deviceNonSelectionnes", deviceNonSelectionnes);
              // }}
              className="mx-2 mb-3 text-center mt-4 text-lg"
            >
              {t("Choisis un ou plusieurs Groupe pour intégrer l'appareil")}
            </p>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {currentAccountSelected?.accountDevices?.map((device, index) => {
                const isSelected = deviceSelectionnes.includes(device.deviceID);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setDeviceSelectionnes((prev) => {
                        if (prev.includes(device.deviceID)) {
                          return prev.filter((id) => id !== device.deviceID);
                        } else {
                          return [...prev, device.deviceID];
                        }
                      });
                    }}
                    className={`shadow-lg justify-between cursor-pointer relative flex gap-3 items-center-- rounded-lg py-2 px-2 ${
                      isSelected ? "bg-gray-50/50" : "bg-gray-50/50"
                    }`}
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <FaCar className="text-gray-500 text-[2.5rem] hidden sm:block" />
                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        <FaCar className="text-gray-500  sm:hidden text-[2.5rem]" />
                        <div className="min-w-[4rem] sm:hidden ">
                          {isSelected ? (
                            <IoMdCheckboxOutline className="text-[2rem] text-green-500" />
                          ) : (
                            <IoMdSquareOutline className="text-[2rem] text-red-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {t("Nom de l'appareil")} :{" "}
                        <span className="font-bold notranslate">
                          {device?.description}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        {t("Dernière mise a jour")} :{" "}
                        <span className="font-bold">
                          {FormatDateHeure(device?.lastUpdateTime).date}
                          <span className="mx-3">/</span>
                          {FormatDateHeure(device?.lastUpdateTime).time}
                        </span>
                      </p>
                    </div>
                    <div className="min-w-[4rem]  hidden sm:block">
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

            <div className="grid grid-cols-2 gap-4 px-4 mb-4 mt-2">
              <button
                onClick={() => {
                  setShowDeviceSelectionnesPopup(false);
                }}
                className="py-2 text-white rounded-md bg-orange-600 font-bold"
              >
                {t("Confirmer")}
              </button>
              <button
                onClick={() => {
                  setShowDeviceSelectionnesPopup(false);
                }}
                className="py-2  rounded-md bg-gray-200 font-bold"
              >
                {t("Annuler")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour la confirmation du mot de passe */}
      <ConfirmationPassword
        showConfirmPassword={showConfirmModifyGroupeGestionPopup}
        setShowConfirmPassword={setShowConfirmModifyGroupeGestionPopup}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handlePasswordCheck={handlePasswordCheck}
        setIsPasswordConfirmed={setShowConfirmModifyGroupeGestionPopup}
      />

      <div className="flex  w-full justify-center h-full  ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6 border-- shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              {/* <FaCar className="text-2xl mr-2 text-orange-500" /> */}
              <h3 className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl">
                {t("Modifier le Groupe")} :{" "}
                <span className="notranslate">
                  {currentSelectedGroupeGestion?.description}
                </span>
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_groupes");
        navigate("/Gestion_des_groupes")

                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <p className="mb-2">
              {t("Choisissez des Appareils pour intégrer dans le groupe")}
            </p>
            <div
              onClick={() => {
                setShowDeviceSelectionnesPopup(true);
              }}
              className="w-full mb-4 cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
            >
              <h3 className="w-full text-center-- font-semibold">
                <span>
                  {deviceSelectionnes?.length +
                    `${t("Appareil")}` +
                    (deviceSelectionnes?.length > 1 ? "s " : "") +
                    " " +
                    `${t("sélectionner")}` ||
                    `${t("Pas d'appareil sélectionner")}`}
                </span>
              </h3>
              <FaChevronDown />
            </div>
            {/* <p className="mb-2">
              Choisissez des Utilisateurs pour avoir accès a ce groupe
            </p>
            <div
              onClick={() => {
                setShowUSerSelectionnesPopup(true);
              }}
              className="w-full mb-10 cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
            >
              <h3 className="w-full text-center-- font-semibold">
                <span>
                  {usersSelectionnes?.length +
                    " Utilisateur" +
                    (usersSelectionnes?.length > 1 ? "s " : "") +
                    " sélectionner" || "Pas Utilisateur sélectionner"}
                </span>
              </h3>
              <FaChevronDown />
            </div> */}

            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Champs du formulaire */}
                {[
                  {
                    id: "groupID",
                    label: `${t("ID du groupe")}`,
                    placeholder: "ex: appareil_brûlé",
                  },
                  {
                    id: "description",
                    label: `${t("Description")}`,
                    placeholder: `${t("Description de l'appareil")}`,
                  },
                  {
                    id: "displayName",
                    label: `${t("DisplayName")}`,
                    placeholder: `${t("DisplayName")}`,
                  },
                  {
                    id: "notes",
                    label: `${t("Notes")}`,
                    placeholder: `${t("Ajouter une petite note")}`,
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block-- flex justify-between items-center text-md font-medium leading-6 text-gray-700 dark:text-gray-300"
                    >
                      {field.label}{" "}
                      {!modifySelectedGroupeDataData[field.id] && (
                        <span className="text-red-600 text-lg"> *</span>
                      )}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      placeholder={field.placeholder}
                      value={modifySelectedGroupeDataData[field.id]}
                      onChange={handleChange}
                      // { field.id === "groupID" && disable}
                      disabled={field.id === "groupID"}
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
                    {t("Enregistrer")}
                  </button>
                  <button
                    onClick={() => {
                      setDocumentationPage("Gestion_des_groupes");
        navigate("/Gestion_des_groupes")

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

export default ModifyGroupeGestion;
