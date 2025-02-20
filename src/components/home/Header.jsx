import React, { useContext, useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Logout from "../login/Logout";
import { IoMdClose } from "react-icons/io";
import { HiOutlineViewList } from "react-icons/hi";
import { toggleTheme } from "../../theme/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";

function Header() {
  // Récupère des données utilisateur et des fonctions utiles via le contexte DataContext
  const {
    userData,
    setShowSideBar,
    showSideBar,
    fetchVehicleData,
    setSearchQueryForHeader,
    tab,
    handleTabClick,
    username,
    account,
    setHistoriqueSelectedLocationIndex,
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
  const navigate = useNavigate();
  // Récupère l'état du thème (clair/sombre) depuis Redux
  const { theme } = useSelector((state) => state.theme);

  // Permet de déclencher des actions Redux
  const dispatch = useDispatch();

  //  pour afficher le composant de déconnexion
  const [logOutPopup, setLogOutPopup] = useState(false);

  // Charge la valeur de recherche enregistrée
  const [searchVéhicule, setSearchVéhicule] = useState(() => {
    const savedValue = localStorage.getItem("searchVéhicule");
    return savedValue ? JSON.parse(savedValue) : false;
  });

  // Sauvegarde la recherche du véhicule dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("searchVéhicule", JSON.stringify(searchVéhicule));
  }, [searchVéhicule]);

  // Gère le terme de recherche de véhicule
  const [searchTerm, setSearchTerm] = useState("");

  // Définit la requête de recherche
  const handleSearchSubmit = () => {
    setSearchQueryForHeader(searchTerm);
  };

  // Déclenche la recherche lorsque le terme change
  useEffect(() => {
    if (searchTerm) {
      handleSearchSubmit();
    }
  }, [searchTerm]);
  //
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

  return (
    // En-tête fixe avec barre de recherche conditionnelle et navigation utilisateur
    <div className="fixed   md:shadow-md md:py-1 md:px-20 z-50 bg-white dark:bg-gray-800 top-0 left-0 right-0 pb-2">
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* Popup de déconnexion  */}
      {logOutPopup && <Logout setLogOutPopup={setLogOutPopup} />} {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* Affiche le composant de déconnexion si logOutPopup est vrai */}
      {searchVéhicule && (
        <form className="fixed flex justify-center items-center -top-2 left-0 lg:left-[15rem] lg:right-[15rem] right-0 bg-white lg:bg-white/0 dark:bg-gray-800 dark:text-white">
          <div className="mt-4 px-4 max-w-[34rem] w-full">
            <div className="border-2 bg-white dark:bg-gray-700 flex gap-3 justify-center items-center rounded-lg overflow-hidden">
              <input
                className="p-2 focus:outline-none w-full dark:bg-gray-600 dark:text-white"
                type="text"
                placeholder="Recherche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Met à jour le terme de recherche
              />
              <IoSearch
                onClick={() => {
                  navigate("/home?tab=acceuil"); // Redirige vers la page d'accueil lors de la recherche
                }}
                className="text-3xl text-gray-500 dark:text-gray-200 cursor-pointer"
              />
              <IoMdClose
                onClick={() => {
                  setSearchVéhicule(false); // Ferme la barre de recherche
                  setSearchTerm(""); // Réinitialise le terme de recherche
                  setSearchQueryForHeader("");
                }}
                className="text-3xl text-red-500 dark:text-red-400 cursor-pointer mr-4"
              />
            </div>
          </div>
        </form>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <div className="flex pt-2  justify-between px-4 py-1 items-center dark:text-white">
        <div className="flex items-center gap-4">
          <Link
            onClick={() => handleTabClick("acceuil")} // Définit l'onglet courant sur "acceuil"
            to="/home?tab=acceuil"
          >
            <img src="/img/cars/logo.png" className="w-10" alt="Logo" />
          </Link>
          <div>
            <h3
              // onClick={fetchVehicleData} // Récupère les données des véhicules
              className="text-gray-500 dark:text-gray-300 text-sm"
            >
              Bonjour....
            </h3>
            <h2 className="font-semibold text-lg text-gray-600 dark:text-gray-200 leading-5">
              {(userData && account) || "Nom absent"}
            </h2>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center gap-5 font-semibold text-gray-700 dark:text-gray-300">
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <Tooltip
            title="Page d'accueil
"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <Link
              onClick={() => handleTabClick("acceuil")}
              to="/home?tab=acceuil"
              className={`${
                tab === "acceuil" && "text-orange-500"
              } hover:text-orange-500 cursor-pointer`}
            >
              Accueil
            </Link>
          </Tooltip>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {username === "admin" && (
            <Tooltip
              title="Enregistrer un nouveau véhicule
"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                  {
                    name: "zIndex",
                    enabled: true,
                    phase: "write",
                    fn: ({ state }) => {
                      state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
            >
              <Link
                onClick={() => handleTabClick("ajouter")}
                to="/ajouter_vehicule?tab=ajouter"
                className={`${
                  tab === "ajouter" && "text-orange-500"
                } hover:text-orange-500 cursor-pointer`}
              >
                Ajouter
              </Link>
            </Tooltip>
          )}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          {username === "admin" && (
            <Tooltip
              title="Modifier ou Supprimer un Véhicule

"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0], // Décalage horizontal et vertical
                    },
                  },
                  {
                    name: "zIndex",
                    enabled: true,
                    phase: "write",
                    fn: ({ state }) => {
                      state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                    },
                  },
                ],
              }}
            >
              <Link
                onClick={() => handleTabClick("modifier")}
                to="/modifier_vehicule?tab=modifier"
                className={`${
                  tab === "modifier" && "text-orange-500"
                } hover:text-orange-500 cursor-pointer`}
              >
                Modifier/Supprimer
              </Link>
            </Tooltip>
          )}

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <Tooltip
            title="Voir la position géographique des véhicules

"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <Link
              to="/Groupe_vehicule_location?tab=localisation"
              onClick={() => {
                handleTabClick("localisation");
                setHistoriqueSelectedLocationIndex(0);
              }}
              className={`${
                tab === "localisation" && "text-orange-500"
              } hover:text-orange-500 cursor-pointer`}
            >
              Localisation
            </Link>
          </Tooltip>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <Tooltip
            title="Voir tous les détails sur le déplacement d'un véhicule

"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <Link
              to="/rapport_page_details?tab=rapport"
              onClick={() => handleTabClick("rapport")}
              className={`${
                tab === "rapport" && "text-orange-500"
              } hover:text-orange-500 cursor-pointer`}
            >
              Rapport
            </Link>
          </Tooltip>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <div className="flex gap-4 items-center">
          <Tooltip
            title="Rechercher un véhicule"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <button>
              <IoSearch
                onClick={() => {
                  setSearchVéhicule(true); // Affiche la barre de recherche
                }}
                className="text-2xl cursor-pointer text-gray-500 dark:text-gray-200"
              />
            </button>
          </Tooltip>
          <Tooltip
            title="Changer en mode sombre ou clair"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <button
              className="text-gray-500 dark:text-gray-200"
              onClick={() => dispatch(toggleTheme())} // Permet de basculer entre les thèmes
            >
              {theme === "light" ? (
                <FaSun className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
            </button>
          </Tooltip>
          <Tooltip
            title="Mon Profil
"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <Link
              className="hidden lg:block"
              onClick={() => handleTabClick("profile")}
              to="/User_Profile?tab=profile"
            >
              <FaUserCircle
                className={`${
                  tab === "profile" && "text-orange-500"
                } hover:text-orange-500 cursor-pointer text-gray-500 text-2xl dark:text-gray-200`}
              />
            </Link>
          </Tooltip>
          <Tooltip
            title="Menu"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 0], // Décalage horizontal et vertical
                  },
                },
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.styles.popper.zIndex = 9999999999999; // Niveau très élevé
                  },
                },
              ],
            }}
          >
            <div onClick={() => setShowSideBar(!showSideBar)}>
              <HiOutlineViewList className="text-2xl cursor-pointer text-gray-500 dark:text-gray-200" />
            </div>
          </Tooltip>
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
      </div>
    </div>
  );
}

export default Header;
