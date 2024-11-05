import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import ChangePassword from "../components/login/ChangePassword";


function ProtectedChangePassword() {
  const { isPasswordConfirmed, setShowChangePasswordPupup } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPasswordConfirmed) {
      // Affiche la pop-up et redirige vers /User_Profile
      setShowChangePasswordPupup(true);
      navigate("/User_Profile");
    }
  }, [isPasswordConfirmed, navigate, setShowChangePasswordPupup]);

  // Affiche la page de changement de mot de passe si le mot de passe est confirmé
  return isPasswordConfirmed ? <ChangePassword /> : null;
}

export default ProtectedChangePassword;
