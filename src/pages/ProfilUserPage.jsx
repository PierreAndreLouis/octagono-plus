import React, { useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Logout from "../components/login/Logout";
import { DataContext } from "../context/DataContext";
import InfoUserComponent from "../components/profile/InfoUserComponent";
import TimeZone from "../components/profile/TimeZone";
import ConfirmationPassword from "../components/Reutilisable/ConfirmationPassword";

import { useTranslation } from "react-i18next";

function ProfilUserPage() {
  const {
    userData,
    account,
    username,
    password,
    setIsPasswordConfirmed,
    showChangePasswordPopup,
    setShowChangePasswordPopup,
    selectUTC,
  } = useContext(DataContext);

  const [t, i18n] = useTranslation();

  let x;
  //
  //
  //
  //
  //
  //
  x;
  const navigate = useNavigate();
  // Pour afficher le popup de déconnexion
  const [logOutPopup, setLogOutPopup] = useState(false);

  // Pour stocker le mot de passe
  const [inputPassword, setInputPassword] = useState("");

  // Pour afficher un message d'erreur de mauvais mot de passe
  const [errorMessage, setErrorMessage] = useState("");

  // Pour la gestion du timezone
  const [changeTimeZone, setChangeTimeZone] = useState(false);

  // Pour afficher le message de susses de modification du timezone
  const [changeTimeZoneMessage, setChangeTimeZoneMessage] = useState(false);

  // Redirection si le mot de passe est "password"
  useEffect(() => {
    if (password === "password") {
      navigate("/Change_Password");
    }
  }, [password, navigate]);

  // Gestion de la vérification du mot de passe
  const handlePasswordCheck = (event) => {
    event.preventDefault(); // Prevents the form from submitting

    if (inputPassword === password) {
      setIsPasswordConfirmed(true);
      navigate("/Change_Password");
      setShowChangePasswordPopup(false);
    } else {
      setErrorMessage(
        `${t("Le mot de passe est incorrect. Veuillez réessayer")}`
      );
    }
  };
  //
  //
  //
  //
  //
  //
  //
  x;

  return (
    <div className="">
      {/* Log Out popup */}
      {logOutPopup && <Logout setLogOutPopup={setLogOutPopup} />}

      {/* Confirmation du mot de passe */}
      <ConfirmationPassword
        showConfirmPassword={showChangePasswordPopup}
        handlePasswordCheck={handlePasswordCheck}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setShowConfirmPassword={setShowChangePasswordPopup}
        setErrorMessage={setErrorMessage}
        setIsPasswordConfirmed={setIsPasswordConfirmed}
      />

      {/* Les info personnelle de l'utilisateur */}
      <InfoUserComponent
        account={account}
        username={username}
        userData={userData}
        setShowChangePasswordPopup={setShowChangePasswordPopup}
        setLogOutPopup={setLogOutPopup}
        selectUTC={selectUTC}
        setChangeTimeZone={setChangeTimeZone}
      />

      {/* Popup de modification de timezone */}
      {changeTimeZone && (
        <TimeZone
          setChangeTimeZone={setChangeTimeZone}
          setChangeTimeZoneMessage={setChangeTimeZoneMessage}
        />
      )}
    </div>
  );
}

export default ProfilUserPage;
