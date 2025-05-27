import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";

const PrivateRoute = ({ element }) => {
  const { userData, account, isAuthenticated, adminAccount, adminUserData } =
    useContext(DataContext); // vérifier si userData est bien défini

  // Vérifie l'authentification en consultant localStorage si userData est absent

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { DataContext } from "../../context/DataContext";

// const PrivateRoute = ({ element }) => {
//   const { isAuthenticated } = useContext(DataContext);
//   return isAuthenticated ? element : <Navigate to="/login" />;
// };

// export default PrivateRoute;
