import React, { useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Logout from "../components/login/Logout";
import { DataContext } from "../context/DataContext";
import ConfirmPasswordComponent from "../components/profile/ConfirmPasswordComponent";
import InfoUserComponent from "../components/profile/InfoUserComponent";
import TimeZone from "../components/profile/TimeZone";
import { IoMdClose } from "react-icons/io";

function ProfilUserPage() {
  const {
    currentVehicule,
    userData,
    account,
    username,
    password,
    setIsPasswordConfirmed,
    showChangePasswordPupup,
    setShowChangePasswordPupup,
    selectUTC,
    setUsername,
  } = useContext(DataContext);
  const [logOut, setLogOut] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [changeTimeZone, setChangeTimeZone] = useState(false);
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
      setShowChangePasswordPupup(false);
    } else {
      setErrorMessage("Le mot de passe est incorrect. Veuillez réessayer.");
    }
  };

  return (
    <div className="px-4 pb-20 min-h-screen">
      {changeTimeZoneMessage && (
        <div className="fixed flex justify-center items-center z-[1] inset-0 bg-black/50 dark:bg-black/70">
          <div className="relative w-[90vw] sm:w-[75vw] max-w-[32rem] bg-white dark:bg-gray-700 dark:border dark:border-gray-500 dark:shadow-gray-500-- overflow-hidden rounded-lg shadow-lg">
            <IoMdClose
              onClick={() => setChangeTimeZoneMessage(false)}
              className="absolute cursor-pointer top-3 right-3 text-2xl text-red-500 dark:text-red-600"
            />
            <div className="h-20--  bg-green-50 dark:bg-gray-800 dark:shadow-gray-500 shadow-md text-gray-800 dark:text-gray-200 text-xl font-semibold text-center flex flex-col justify-center items-center px-2">
              <h1 className="px-3 mt-8 mb-2 text-2xl text-center text-green-600 dark:text-gray-50--">
                Mise à jour réussie
              </h1>
            </div>
            <div className="p-4 flex flex-col gap-4 py-6  pb-10--">
              {/* callError, setCallError, lancerAppel, */}
              <p className="text-center font-semibold text-lg dark:text-gray-300 text-gray-700">
                Le fuseau horaire prendra automatiquement effet lors de la
                prochaine mise à jour des véhicules.
              </p>
            </div>
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setChangeTimeZoneMessage(false)}
                className="py-1 px-8 rounded-lg text-white bg-green-500 mx-auto"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {logOut && <Logout setLogOut={setLogOut} />}
      <ConfirmPasswordComponent
        showChangePasswordPupup={showChangePasswordPupup}
        handlePasswordCheck={handlePasswordCheck}
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        errorMessage={errorMessage}
        setShowChangePasswordPupup={setShowChangePasswordPupup}
        setIsPasswordConfirmed={setIsPasswordConfirmed}
        setErrorMessage={setErrorMessage}
      />
      <InfoUserComponent
        account={account}
        username={username}
        userData={userData}
        setShowChangePasswordPupup={setShowChangePasswordPupup}
        setLogOut={setLogOut}
        selectUTC={selectUTC}
        setChangeTimeZone={setChangeTimeZone}
      />
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
