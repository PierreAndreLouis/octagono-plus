import React, { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../../context/DataContext";
import ConfirmationPassword from "../Reutilisable/ConfirmationPassword";
import { MdErrorOutline } from "react-icons/md";
import {
  FaArrowLeft,
  FaCar,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";
import { IoMdCheckboxOutline, IoMdSquareOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "react-router-dom";

function CreateNewGroupeGestion({
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
    scrollToTop,
    FormatDateHeure,
    currentSelectedGroupeGestion,
    createNewGroupeEnGestionAccount,
    adminPassword,
    gestionAccountData,
    modifyGroupeEnGestionAccount,
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
  const [addNewGroupeData, setAddNewGroupeData] = useState({
    accountID: "",
    groupID: "",
    description: "",
    displayName: "",
    notes: "",
    workOrderID: "",
  });

  const foundAccount = gestionAccountData?.find(
    (acct) =>
      acct?.accountID ===
      (currentAccountSelected?.accountID || addNewGroupeData?.accountID)
  );

  // Gestion de la modification des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddNewGroupeData((prevData) => ({
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
    const groupID = addNewGroupeData.groupID;

    // Vérification si groupID existe déjà
    const deviceExists = currentAccountSelected?.accountGroupes?.some(
      (groupe) => groupe?.groupID === groupID
    );

    if (isCreatingNewElement && deviceExists) {
      setErrorID(
        `${t(
          "Cet identifiant (ID) est déjà utilisé. Veuillez en choisir un autre"
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

  //////////////////////////////////////////////////

  // const foundAccount = gestionAccountData?.find(
  //   (acct) => acct?.accountID === addNewGroupeData?.accountID
  // );

  ///////////////////////////////////////////////

  // je veux la meme logique pour: deviceNonSelectionnes et usersNonSelectionnes

  // // tous les appareils disponibles
  // const allDevicesIDs = foundAccount?.accountDevices?.map(
  //   (device) => device?.deviceID
  // );

  // // appareil sélectionner avant mise a jour /actuel
  // const deviceDuSelectedGroupe =
  //   currentSelectedGroupeGestion?.groupeDevices?.map(
  //     (device) => device?.deviceID
  //   );

  // // appareils sélectionner pour la mise a jour
  // const [deviceSelectionnes, setDeviceSelectionnes] = useState(
  //   deviceDuSelectedGroupe || []
  // );

  // // apparels non sélectionner pour la mise a jour dans la selection
  // const deviceNonSelectionnesDispo = allDevicesIDs?.filter(
  //   (deviceID) => !deviceSelectionnes.includes(deviceID)
  // );

  // // appareils non sélectionnés pour la mise à jour (ceux à retirer)
  // const deviceNonSelectionnes = deviceDuSelectedGroupe?.filter(
  //   (oldID) => !deviceSelectionnes.includes(oldID)
  // );

  // // tous les utilisateurs disponibles
  // const allUsersIDs = foundAccount?.accountUsers?.map((user) => user?.userID);

  // const userListeAffected = foundAccount?.accountUsers?.filter((user) =>
  //   user.userGroupes?.some(
  //     (group) => group.groupID === currentSelectedGroupeGestion?.groupID
  //   )
  // );
  // // utilisateurs disponible avant mise a jour /actuel
  // const userDuSelectedGroupe = userListeAffected?.map((user) => user?.userID);

  // // apparels sélectionner pour la mise a jour dans la selection
  // const [usersSelectionnes, setUsersSelectionnes] = useState(
  //   userDuSelectedGroupe || []
  // );

  // // useEffect

  // // apparels non sélectionner pour la mise a jour dans la selection
  // const usersNonSelectionnesDispo = allUsersIDs?.filter(
  //   (userID) => !usersSelectionnes.includes(userID)
  // );

  // // utilisateurs non sélectionnés pour la mise à jour (ceux à retirer)
  // const usersNonSelectionnes = userDuSelectedGroupe?.filter(
  //   (oldID) => !usersSelectionnes.includes(oldID)
  // );

  // //

  // //

  // useEffect(() => {
  //   console.log("deviceSelectionnes", deviceSelectionnes);
  //   console.log("deviceNonSelectionnes", deviceNonSelectionnes);
  //   console.log("usersSelectionnes", usersSelectionnes);
  //   console.log("usersNonSelectionnes", usersNonSelectionnes);
  // }, [deviceSelectionnes, usersSelectionnes]);

  // useEffect(() => {
  //   if (isCreatingNewElement) {
  //     setDeviceSelectionnes([]);
  //     setUsersSelectionnes([]);
  //   }
  // }, [documentationPage, isCreatingNewElement]);
  // //

  // import React, { useEffect, useMemo, useState } from "react";

  // ...

  // tous les appareils disponibles
  const allDevicesIDs = useMemo(
    () => foundAccount?.accountDevices?.map((device) => device?.deviceID) || [],
    [foundAccount?.accountDevices]
  );

  // appareils sélectionnés avant mise à jour (actuels)
  const deviceDuSelectedGroupe = useMemo(
    () =>
      currentSelectedGroupeGestion?.groupeDevices?.map(
        (device) => device?.deviceID
      ) || [],
    [currentSelectedGroupeGestion?.groupeDevices]
  );

  // appareils sélectionnés pour la mise à jour
  const [deviceSelectionnes, setDeviceSelectionnes] = useState(
    deviceDuSelectedGroupe
  );

  useEffect(() => {
    setDeviceSelectionnes(deviceDuSelectedGroupe);
  }, [deviceDuSelectedGroupe]);

  // appareils non sélectionnés disponibles
  const deviceNonSelectionnesDispo = useMemo(
    () =>
      allDevicesIDs.filter(
        (deviceID) => !deviceSelectionnes.includes(deviceID)
      ),
    [allDevicesIDs, deviceSelectionnes]
  );

  // appareils non sélectionnés pour la mise à jour (ceux à retirer)
  const deviceNonSelectionnes = useMemo(
    () =>
      deviceDuSelectedGroupe.filter(
        (oldID) => !deviceSelectionnes.includes(oldID)
      ),
    [deviceDuSelectedGroupe, deviceSelectionnes]
  );

  // tous les utilisateurs disponibles
  const allUsersIDs = useMemo(
    () => foundAccount?.accountUsers?.map((user) => user?.userID) || [],
    [foundAccount?.accountUsers]
  );

  // utilisateurs affectés au groupe sélectionné
  const userListeAffected = useMemo(
    () =>
      foundAccount?.accountUsers?.filter((user) =>
        user.userGroupes?.some(
          (group) => group.groupID === currentSelectedGroupeGestion?.groupID
        )
      ) || [],
    [foundAccount?.accountUsers, currentSelectedGroupeGestion?.groupID]
  );

  // utilisateurs sélectionnés avant mise à jour (actuels)
  const userDuSelectedGroupe = useMemo(
    () => userListeAffected.map((user) => user?.userID),
    [userListeAffected]
  );

  // utilisateurs sélectionnés pour la mise à jour
  const [usersSelectionnes, setUsersSelectionnes] =
    useState(userDuSelectedGroupe);

  // synchroniser si userDuSelectedGroupe change
  useEffect(() => {
    setUsersSelectionnes(userDuSelectedGroupe);
  }, [userDuSelectedGroupe]);

  // utilisateurs non sélectionnés disponibles
  const usersNonSelectionnesDispo = useMemo(
    () => allUsersIDs.filter((userID) => !usersSelectionnes.includes(userID)),
    [allUsersIDs, usersSelectionnes]
  );

  // utilisateurs non sélectionnés pour la mise à jour (ceux à retirer)
  const usersNonSelectionnes = useMemo(
    () =>
      userDuSelectedGroupe.filter(
        (oldID) => !usersSelectionnes.includes(oldID)
      ),
    [userDuSelectedGroupe, usersSelectionnes]
  );

  // logs debug
  useEffect(() => {
    console.log("deviceSelectionnes", deviceSelectionnes);
    console.log("deviceNonSelectionnes", deviceNonSelectionnes);
    console.log("usersSelectionnes", usersSelectionnes);
    console.log("usersNonSelectionnes", usersNonSelectionnes);
  }, [
    deviceSelectionnes,
    usersSelectionnes,
    deviceNonSelectionnes,
    usersNonSelectionnes,
  ]);

  // reset lors de la création d’un nouvel élément
  useEffect(() => {
    if (isCreatingNewElement) {
      setDeviceSelectionnes([]);
      setUsersSelectionnes([]);
    }
  }, [documentationPage, isCreatingNewElement]);

  const [showUserSelectionnesPopup, setShowUSerSelectionnesPopup] =
    useState(false);

  ////////////////////////////////////////////////

  const [showDeviceSelectionnesPopup, setShowDeviceSelectionnesPopup] =
    useState(false);

  // fonction pour lancer la requête d'ajout de vehicle
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === adminPassword) {
      const accountID = addNewGroupeData.accountID;
      const groupID = addNewGroupeData.groupID;
      const description = addNewGroupeData.description;
      const displayName = addNewGroupeData.description;
      const notes = addNewGroupeData.notes;
      const workOrderID = addNewGroupeData.workOrderID;

      // if (
      //   currentAccountSelected?.accountID &&
      //   currentAccountSelected?.password
      // ) {
      if (isCreatingNewElement) {
        createNewGroupeEnGestionAccount(
          currentAccountSelected?.accountID,
          "admin",
          currentAccountSelected?.password,

          groupID,
          description,
          displayName,
          notes,
          workOrderID,
          deviceSelectionnes,
          usersSelectionnes
        );
      } else {
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
          deviceNonSelectionnes,
          //
          usersSelectionnes,
          usersNonSelectionnes
        );
      }

      navigate("/Gestion_des_groupes");
      setDocumentationPage("Gestion_des_groupes");
      // }

      setShowConfirmAddGroupeGestionPopup(false);
      setErrorMessage("");
      setInputPassword("");
    } else {
      setErrorMessage(`${t("Mot de passe incorrect. Veuillez réessayer")}`);
    }
  };

  // Pour mettre a jour les nouvelle donnee du véhicule a modifier
  useEffect(() => {
    if (currentSelectedGroupeGestion && !isCreatingNewElement) {
      setAddNewGroupeData({
        accountID: currentSelectedGroupeGestion.accountID || "",
        groupID: currentSelectedGroupeGestion.groupID || "",
        description: currentSelectedGroupeGestion.description || "",
        displayName: currentSelectedGroupeGestion.displayName || "",
        notes: currentSelectedGroupeGestion.notes || "",
        workOrderID: currentSelectedGroupeGestion.workOrderID || "",
      });
    }
  }, [currentSelectedGroupeGestion, isCreatingNewElement]);

  return (
    <div className="px-3 rounded-lg  bg-white">
      {showUserSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] mx-3 relative max-h-[75vh]-- bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Liste Des Utilisateurs")}
            </h2>
            <IoClose
              onClick={() => {
                setShowUSerSelectionnesPopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            <p className="mx-2 mb-3 text-center mt-4 text-lg font-semibold">
              {t(
                "Choisissez un ou plusieurs utilisateur(s) pour affecter le groupe"
              )}
            </p>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {foundAccount?.accountUsers?.map((user, index) => {
                const isSelected = usersSelectionnes.includes(user.userID);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setUsersSelectionnes((prev) => {
                        if (prev.includes(user.userID)) {
                          return prev.filter((id) => id !== user.userID);
                        } else {
                          return [...prev, user.userID];
                        }
                      });
                    }}
                    className={`shadow-lg justify-between cursor-pointer relative flex gap-3 items-start rounded-lg py-2 px-2 ${
                      isSelected ? "bg-gray-50/50" : "bg-gray-50/50"
                    }`}
                  >
                    <p className="absolute font-semibold top-0 right-0 text-sm rounded-bl-full p-3 pt-2 pr-2 bg-orange-400/10">
                      {index + 1}
                    </p>
                    <FaUserCircle className="text-gray-500 text-[2.5rem]" />
                    <div
                      onClick={() => {
                        console.log(user);
                      }}
                      className="w-full"
                    >
                      <p className="text-gray-600">
                        {t("Nom de l'utilisateur")} :{" "}
                        <span className="font-bold">{user?.description}</span>
                      </p>
                      <p className="text-gray-600">
                        {t("Nombre d'appareil")} :{" "}
                        <span className="font-bold">
                          {user?.userDevices?.length}
                        </span>
                      </p>

                      {(user?.roleID !== "!clientproprietaire" ||
                        user?.maxAccessLevel === "2" ||
                        user?.maxAccessLevel === "1") && (
                        <p className="mb-2 mt-1 font-semibold text-yellow-700 bg-yellow-100 border border-yellow-700 rounded-md px-2">
                          {t(
                            "Cet utilisateur n’est pas autorisé à être affecté à un groupe"
                          )}
                          {user?.roleID !== "!clientproprietaire" && (
                            <span className="block">
                              - {t("Role")} : {user?.roleID || `${t("Aucune")}`}
                            </span>
                          )}

                          {user?.maxAccessLevel === "1" && (
                            <span className="block">
                              - {t("Niveau d’accès")} : {t("Read/View")}
                            </span>
                          )}
                          {user?.maxAccessLevel === "2" && (
                            <span className="block">
                              - {t("Niveau d’accès")} : {t("Write/Edit")}
                            </span>
                          )}
                          {/* {user?.maxAccessLevel === "" && (
                            <span className="block">
                              - {t("Niveau d’accès")} : {t("Aucune")}
                            </span>
                          )} */}
                        </p>
                      )}
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

            <div className="flex flex-col  w-full  gap-2 px-4 mb-4 mt-2">
              <div className="grid grid-cols-2 gap-2 items-center  w-full">
                <button
                  onClick={() => {
                    setUsersSelectionnes([]);
                  }}
                  className="py-2 text-orange-600 border-2 border-orange-500 rounded-md  font-bold"
                >
                  {t("Aucune")}
                </button>
                <button
                  onClick={() => {
                    setUsersSelectionnes(allUsersIDs);
                  }}
                  className="py-2 text-orange-600 border-2 border-orange-500 rounded-md  font-bold"
                >
                  {t("Tous")}
                </button>
              </div>
              <button
                onClick={() => {
                  setShowUSerSelectionnesPopup(false);
                }}
                className="py-2 text-white rounded-md bg-orange-600 font-bold"
              >
                {t("Confirmer")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeviceSelectionnesPopup && (
        <div className="fixed inset-0 bg-black/50 z-[99999999999999999999999999999999999999] flex justify-center items-center">
          <div className="max-w-[40rem] overflow-hidden w-full min-h-[40vh] relative max-h-[75vh]-- bg-white rounded-lg">
            <h2 className="text-center py-4 bg-orange-300 font-bold text-lg">
              {t("Liste Des Appareils")}
            </h2>
            <IoClose
              onClick={() => {
                setShowDeviceSelectionnesPopup(false);
              }}
              className="text-[2rem] text-red-600 absolute top-3 right-4 cursor-pointer"
            />
            <p className="mx-2 mb-3 text-center mt-4 text-lg">
              {t(
                "Choisissez un ou plusieurs appareils pour affecter le groupe"
              )}
            </p>

            <div className="flex flex-col gap-4 px-3 pb-20 h-[60vh] overflow-auto">
              {foundAccount?.accountDevices?.map((device, index) => {
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

                    <FaCar className="text-gray-500 hidden sm:block text-[2.5rem]" />
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
                    <div className="min-w-[4rem] hidden sm:block">
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

            <div className="flex flex-col  px-4 mb-4 mt-2 gap-2">
              <div className="grid grid-cols-2 gap-2 items-center  w-full">
                <button
                  onClick={() => {
                    setDeviceSelectionnes([]);
                  }}
                  className="py-2 text-orange-600 border-2 border-orange-500 rounded-md  font-bold"
                >
                  {t("Aucune")}
                </button>
                <button
                  onClick={() => {
                    setDeviceSelectionnes(allDevicesIDs);
                  }}
                  className="py-2 text-orange-600 border-2 border-orange-500 rounded-md  font-bold"
                >
                  {t("Tous")}
                </button>
              </div>
              <button
                onClick={() => {
                  setShowDeviceSelectionnesPopup(false);
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
        showConfirmPassword={showConfirmAddGroupeGestionPopup}
        setShowConfirmPassword={setShowConfirmAddGroupeGestionPopup}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handlePasswordCheck={handlePasswordCheck}
        setIsPasswordConfirmed={setShowConfirmAddGroupeGestionPopup}
      />

      <div className="flex  w-full justify-center h-full ">
        <div className="w-full flex justify-center">
          <div className="bg-white  dark:bg-gray-900/30 max-w-[40rem] rounded-xl w-full md:px-6 mt-6  shadow-lg- overflow-auto-">
            <div className="flex justify-center items-center w-full mb-10 pt-10 ">
              <h3
                onClick={() => {
                  console.log("allUsersIDs", allUsersIDs);
                  console.log("userListeAffected", userListeAffected);
                  console.log("userDuSelectedGroupe", userDuSelectedGroupe);
                  console.log("usersSelectionnes", usersSelectionnes);
                }}
                className="text-center font-semibold text-gray-600 dark:text-gray-100 text-xl"
              >
                {isCreatingNewElement
                  ? t("Ajouter un nouveau Groupe")
                  : t("Modifier le Groupe")}
              </h3>
            </div>
            <div className="flex justify-center mb-10">
              <button
                onClick={() => {
                  setDocumentationPage("Gestion_des_groupes");
                  navigate("/Gestion_des_groupes");
                }}
                className="border hover:bg-gray-100 flex items-center gap-3 rounded-lg text-gray-700 px-6 py-2 font-bold  "
              >
                <FaArrowLeft />
                {t("Retour")}
              </button>
            </div>

            <p className="mb-2 font-semibold text-gray-700">
              {t(
                "Choisissez un ou plusieurs appareils pour affecter le groupe"
              )}
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
                    " " +
                    `${t("Appareil")}` +
                    (deviceSelectionnes?.length > 1 ? "s " : "") +
                    " " +
                    `${t("sélectionné")}` +
                    (deviceSelectionnes?.length > 1 ? "s " : "") ||
                    `${t("Pas d'appareil sélectionné")}`}
                </span>
              </h3>
              <FaChevronDown />
            </div>

            <p className="mb-2 font-semibold text-gray-700">
              {t(
                "Choisissez un ou plusieurs utilisateur(s) pour affecter le groupe"
              )}
            </p>
            <div
              onClick={() => {
                setShowUSerSelectionnesPopup(true);
              }}
              className="w-full mb-10 cursor-pointer flex justify-center items-center py-2 px-4 border bg-gray-50 rounded-lg"
            >
              <h3 className="w-full text-center-- font-semibold">
                <span>
                  {usersSelectionnes?.length
                    ? usersSelectionnes?.length +
                      " " +
                      `${t("Utilisateur")}` +
                      (usersSelectionnes?.length > 1 ? "s " : " ") +
                      `${t("sélectionné")}` +
                      (usersSelectionnes?.length > 1 ? "s" : "")
                    : `${t("Pas d'utilisateur sélectionné")}`}
                </span>
              </h3>
              <FaChevronDown />
            </div>

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
                      {!addNewGroupeData[field.id] && (
                        <span className="text-red-600 text-lg"> *</span>
                      )}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      placeholder={field.placeholder}
                      value={addNewGroupeData[field.id]}
                      onChange={handleChange}
                      disabled={!isCreatingNewElement && field.id === "groupID"}
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
                    {t("Enregistrer")}
                  </button>
                  <button
                    onClick={() => {
                      setDocumentationPage("Gestion_des_groupes");
                      scrollToTop();
                      navigate("/Gestion_des_groupes");
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

export default CreateNewGroupeGestion;
